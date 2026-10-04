import React, { useState, useEffect } from 'react';
import {
  Users,
  MessageCircle,
  Send,
  Sparkles,
  ChevronDown,
  ChevronUp,
  MapPin,
  RefreshCw,
  Search,
  Lock,
  Trash2,
} from 'lucide-react';
import { ConsultationDossier } from '../types';
import { SupportedLanguage, TRANSLATIONS } from '../data/translations';

const ADMIN_TOKEN_KEY = 'margo_admin_token';

function readStoredToken(): string | null {
  try {
    const fromLocal = localStorage.getItem(ADMIN_TOKEN_KEY);
    if (fromLocal) return fromLocal;
    // Migrate older sessionStorage sessions so login does not "fall off" after refresh/tab restore
    const fromSession = sessionStorage.getItem(ADMIN_TOKEN_KEY);
    if (fromSession) {
      localStorage.setItem(ADMIN_TOKEN_KEY, fromSession);
      sessionStorage.removeItem(ADMIN_TOKEN_KEY);
      return fromSession;
    }
  } catch {
    // ignore
  }
  return null;
}

function writeStoredToken(token: string) {
  try {
    localStorage.setItem(ADMIN_TOKEN_KEY, token);
    sessionStorage.removeItem(ADMIN_TOKEN_KEY);
  } catch {
    // ignore
  }
}

function clearStoredToken() {
  try {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    sessionStorage.removeItem(ADMIN_TOKEN_KEY);
  } catch {
    // ignore
  }
}

interface AtelierDashboardProps {
  onBackToApp: () => void;
  lang?: SupportedLanguage;
}

function authHeaders(token: string): HeadersInit {
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}

export const AtelierDashboard: React.FC<AtelierDashboardProps> = ({ onBackToApp, lang = 'ru' }) => {
  const t = TRANSLATIONS[lang];
  const [token, setToken] = useState<string | null>(() => readStoredToken());
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loggingIn, setLoggingIn] = useState(false);

  const [consultations, setConsultations] = useState<ConsultationDossier[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'new' | 'scheduled' | 'fitting' | 'archive'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<ConsultationDossier | null>(null);
  const [purgePassword, setPurgePassword] = useState('');
  const [actionError, setActionError] = useState<string | null>(null);
  const [acting, setActing] = useState(false);

  const clearSession = (message?: string) => {
    setToken(null);
    clearStoredToken();
    if (message) setLoginError(message);
  };

  const fetchConsultations = async (authToken = token, attempt = 0) => {
    if (!authToken) return;
    if (attempt === 0) setLoading(true);
    try {
      const res = await fetch('/api/consultations', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      // Only drop the session on a confirmed unauthorized response — never on 5xx / network blips
      if (res.status === 401) {
        clearSession(t.adminSessionExpired);
        return;
      }
      if ((res.status === 503 || res.status >= 500) && attempt < 1) {
        await new Promise((r) => setTimeout(r, 500));
        await fetchConsultations(authToken, attempt + 1);
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setConsultations(data.consultations || []);
      }
    } catch (err) {
      console.error('Failed to load consultations:', err);
      if (attempt < 1) {
        await new Promise((r) => setTimeout(r, 500));
        await fetchConsultations(authToken, attempt + 1);
        return;
      }
      // Keep token — transient offline should not force re-login
    } finally {
      if (attempt === 0) setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchConsultations(token);
  }, [token]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoggingIn(true);
    setLoginError(null);
    // Drop any stale token before a fresh login attempt
    clearStoredToken();
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: password.trim() }),
      });
      const rawText = await res.text();
      let data: any = {};
      try {
        data = rawText ? JSON.parse(rawText) : {};
      } catch {
        data = {};
      }
      if (!res.ok || !data.token) {
        if (res.status === 503) {
          setLoginError(t.adminLoginErrorNotConfigured);
        } else if (res.status === 401) {
          setLoginError(t.adminLoginErrorUnauthorized);
        } else if (res.status === 429) {
          setLoginError(
            lang === 'ru'
              ? 'Слишком много попыток входа. Подождите несколько минут.'
              : 'Too many login attempts. Please wait a few minutes.'
          );
        } else if (res.status >= 500) {
          setLoginError(
            lang === 'ru'
              ? 'Сервер админки недоступен. Проверьте, что ADMIN_PASSWORD задан на хостинге, и перезапустите приложение.'
              : 'Admin server error. Set ADMIN_PASSWORD on the host and restart the app.'
          );
        } else {
          setLoginError(typeof data.error === 'string' ? data.error : t.adminLoginError);
        }
        return;
      }
      writeStoredToken(data.token);
      setToken(data.token);
      setPassword('');
    } catch {
      setLoginError(t.adminLoginErrorOffline);
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = () => {
    setConsultations([]);
    clearSession();
  };

  const updateStatus = async (id: string, status: any) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/consultations/${id}`, {
        method: 'PATCH',
        headers: authHeaders(token),
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setConsultations((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const closeDeleteDialog = () => {
    setPendingDelete(null);
    setPurgePassword('');
    setActionError(null);
    setActing(false);
  };

  const confirmArchive = async () => {
    if (!token || !pendingDelete?.id || pendingDelete.archived) return;
    setActing(true);
    setActionError(null);
    try {
      const res = await fetch(`/api/consultations/${pendingDelete.id}`, {
        method: 'PATCH',
        headers: authHeaders(token),
        body: JSON.stringify({ archive: true }),
      });
      if (!res.ok) {
        setActionError(t.dashActionError);
        return;
      }
      const archivedAt = new Date().toISOString();
      setConsultations((prev) =>
        prev.map((c) => (c.id === pendingDelete.id ? { ...c, archived: true, archivedAt } : c))
      );
      closeDeleteDialog();
    } catch {
      setActionError(t.dashActionError);
    } finally {
      setActing(false);
    }
  };

  const confirmPurge = async () => {
    if (!token || !pendingDelete?.id || !pendingDelete.archived) return;
    setActing(true);
    setActionError(null);
    try {
      const res = await fetch(`/api/consultations/${pendingDelete.id}`, {
        method: 'DELETE',
        headers: authHeaders(token),
        body: JSON.stringify({ password: purgePassword.trim() }),
      });
      if (res.status === 401) {
        setActionError(t.adminLoginErrorUnauthorized);
        return;
      }
      if (!res.ok) {
        setActionError(t.dashActionError);
        return;
      }
      setConsultations((prev) => prev.filter((c) => c.id !== pendingDelete.id));
      closeDeleteDialog();
    } catch {
      setActionError(t.dashActionError);
    } finally {
      setActing(false);
    }
  };

  const activeConsultations = consultations.filter((c) => !c.archived);

  const filtered = consultations.filter((c) => {
    const archived = Boolean(c.archived);
    if (activeFilter === 'archive') {
      if (!archived) return false;
    } else if (archived || (activeFilter !== 'all' && c.status !== activeFilter)) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = c.contact?.fullName?.toLowerCase().includes(q);
      const matchId = c.id?.toLowerCase().includes(q);
      const matchOccasion = String(c.occasion || '').toLowerCase().includes(q);
      return matchName || matchId || matchOccasion;
    }
    return true;
  });

  if (!token) {
    return (
      <div className="w-full max-w-md mx-auto px-4 py-16">
        <div className="rounded-2xl border border-[#E8E1D6] bg-[#FAF8F5] p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Lock className="w-4 h-4 text-[#8C7D70]" />
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#7D7267]">{t.dashConsoleBadge}</span>
          </div>
          <h1 className="font-serif text-2xl font-light text-[#1A1816] mb-1">{t.adminLoginTitle}</h1>
          <p className="text-xs text-[#706459] font-light mb-2">{t.adminLoginHint}</p>
          <p className="text-xs text-[#544B43] font-medium mb-5 leading-relaxed">{t.adminLoginStaffNote}</p>
          <button
            type="button"
            onClick={onBackToApp}
            className="w-full mb-5 py-3 rounded-full border border-[#1A1816] text-[#1A1816] text-xs uppercase tracking-[0.14em] hover:bg-[#1A1816] hover:text-[#FAF8F5] transition-colors"
          >
            {t.dashBackBtn}
          </button>
          <form onSubmit={handleLogin} className="space-y-3">
            <label className="block text-[11px] uppercase tracking-[0.15em] text-[#544B43]">
              {t.adminPasswordLabel}
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t.adminPasswordPlaceholder}
                autoComplete="current-password"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
                lang="en"
                inputMode="text"
                className="mt-1.5 w-full px-3.5 py-2.5 rounded-xl bg-[#F6F1EA] border border-[#D9D1C5] text-sm text-[#1A1816] focus:outline-none focus:ring-1 focus:ring-[#1A1816]"
              />
              <p className="mt-1.5 text-[10px] text-[#8A8177]">
                {lang === 'ru'
                  ? 'Вводите пароль в латинской раскладке. Он задаётся в ADMIN_PASSWORD, не показывается здесь.'
                  : 'Use a Latin keyboard layout. The password comes from ADMIN_PASSWORD and is not shown here.'}
              </p>
            </label>
            {loginError && <p className="text-xs text-[#A83D3D]">{loginError}</p>}
            <button
              type="submit"
              disabled={loggingIn || !password.trim()}
              className="w-full py-3 rounded-full bg-[#1A1816] text-[#FAF8F5] text-xs uppercase tracking-[0.18em] disabled:bg-[#E5DDD2] disabled:text-[#9E9488]"
            >
              {loggingIn ? '…' : t.adminLoginBtn}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E8E1D6]">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#398256]" />
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#7D7267] font-medium">
              {t.dashConsoleBadge}
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-light text-[#1A1816] tracking-tight mt-0.5">
            {t.dashTitle}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => fetchConsultations()}
            disabled={loading}
            className="p-2 rounded-xl border border-[#D9D1C5] bg-[#FAF8F5] text-[#54493F] hover:bg-[#EFE9E0] transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="px-3 py-2 rounded-xl border border-[#D9D1C5] text-xs uppercase tracking-wider text-[#54493F] hover:bg-[#EFE9E0]"
          >
            {t.adminLogoutBtn}
          </button>
          <button
            type="button"
            onClick={onBackToApp}
            className="px-4 py-2 rounded-xl bg-[#1A1816] text-[#FAF8F5] text-xs font-medium uppercase tracking-wider hover:bg-[#2E2824] transition-colors"
          >
            {t.dashBackBtn}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6">
        <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E8E1D6]">
          <span className="text-[10px] uppercase tracking-wider text-[#8A7D71] block font-medium">{t.dashTotal}</span>
          <div className="font-serif text-2xl font-light text-[#1A1816] mt-1">{activeConsultations.length}</div>
        </div>
        <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E8E1D6]">
          <span className="text-[10px] uppercase tracking-wider text-[#8A7D71] block font-medium">{t.dashNew}</span>
          <div className="font-serif text-2xl font-light text-[#A86430] mt-1">
            {activeConsultations.filter((c) => c.status === 'new').length}
          </div>
        </div>
        <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E8E1D6]">
          <span className="text-[10px] uppercase tracking-wider text-[#8A7D71] block font-medium">{t.dashScheduled}</span>
          <div className="font-serif text-2xl font-light text-[#2E7A4C] mt-1">
            {activeConsultations.filter((c) => c.status === 'scheduled').length}
          </div>
        </div>
        <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E8E1D6]">
          <span className="text-[10px] uppercase tracking-wider text-[#8A7D71] block font-medium">{t.dashTgSync}</span>
          <div className="flex items-center gap-1.5 text-xs text-[#205A32] mt-2 font-medium">
            <span className="w-2 h-2 rounded-full bg-[#205A32] animate-pulse" />
            {t.dashConnected}
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-[#8A7D71] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={t.dashSearchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-[#FAF8F5] border border-[#D9D1C5] text-xs text-[#1A1816] focus:outline-none focus:ring-1 focus:ring-[#1A1816]"
          />
        </div>
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {(['all', 'new', 'scheduled', 'fitting', 'archive'] as const).map((tab) => {
            const label =
              tab === 'all'
                ? t.dashFilterAll
                : tab === 'new'
                  ? t.dashFilterNew
                  : tab === 'scheduled'
                    ? t.dashFilterScheduled
                    : tab === 'fitting'
                      ? t.dashFilterFitting
                      : t.dashFilterArchive;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveFilter(tab)}
                className={`px-3 py-1.5 rounded-xl text-xs uppercase tracking-wider transition-all whitespace-nowrap border ${
                  activeFilter === tab
                    ? 'bg-[#1A1816] text-[#FAF8F5] border-[#1A1816]'
                    : 'bg-[#FAF8F5] text-[#63574D] border-[#E8E1D6] hover:border-[#BDB0A2]'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-[#FAF8F5] border border-[#E8E1D6]">
            <Users className="w-8 h-8 text-[#B8AA99] mx-auto mb-2" />
            <div className="font-serif text-lg font-light text-[#1A1816]">{t.dashNoDossiers}</div>
            <p className="text-xs text-[#867B71] mt-1">{t.dashNoDossiersSub}</p>
          </div>
        ) : (
          filtered.map((item) => {
            const isExpanded = expandedId === item.id;
            const silhouette =
              typeof item.silhouette === 'string'
                ? item.silhouette
                : Array.isArray(item.silhouette)
                  ? item.silhouette.join(', ')
                  : '';
            const style =
              typeof item.style === 'string'
                ? item.style
                : Array.isArray(item.style)
                  ? item.style.join(', ')
                  : '';
            return (
              <div
                key={item.id}
                className="rounded-2xl bg-[#FAF8F5] border border-[#E8E1D6] overflow-hidden transition-all shadow-sm"
              >
                <div
                  onClick={() => setExpandedId(isExpanded ? null : item.id || null)}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:bg-[#F7F2EB] transition-colors"
                >
                  <div className="flex items-start sm:items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#EFE9E0] flex items-center justify-center font-serif text-sm font-medium text-[#1A1816] shrink-0 border border-[#DFD6C9]">
                      {item.contact?.fullName ? item.contact.fullName.charAt(0) : 'M'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-serif text-base sm:text-lg font-medium text-[#1A1816]">
                          {item.contact?.fullName || 'Private Client'}
                        </span>
                        <span className="font-mono text-[10px] text-[#8C7E72] px-2 py-0.5 rounded bg-[#EFE8DF]">
                          {item.id}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-[#706458] mt-0.5 font-light">
                        <span className="font-medium text-[#1A1816]">{item.occasion}</span>
                        <span>•</span>
                        <span>{item.budget}</span>
                        <span>•</span>
                        <span>{item.date || item.timeline}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#EFE9E0]">
                    <span
                      className={`text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full font-medium ${
                        item.archived
                          ? 'bg-[#EFE8DF] text-[#61564C]'
                          : item.status === 'new'
                          ? 'bg-[#FBEEDC] text-[#8C5319] border border-[#EACCA4]'
                          : item.status === 'scheduled'
                            ? 'bg-[#E3F2E7] text-[#1E6B39] border border-[#BEE0C8]'
                            : 'bg-[#EFE8DF] text-[#61564C]'
                      }`}
                    >
                      {item.archived ? t.dashFilterArchive : item.status || 'new'}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActionError(null);
                        setPurgePassword('');
                        setPendingDelete(item);
                      }}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[#E4C8C8] text-[10px] uppercase tracking-wider text-[#A83D3D] hover:bg-[#F8EAEA]"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      {item.archived ? t.dashPurgeBtn : t.dashArchiveBtn}
                    </button>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-[#8C7E72]" /> : <ChevronDown className="w-4 h-4 text-[#8C7E72]" />}
                  </div>
                </div>

                {isExpanded && (
                  <div className="p-5 border-t border-[#E8E1D6] bg-[#F9F5EE] space-y-5">
                    <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E5DFD6]">
                      <div className="flex flex-wrap items-center gap-4 text-xs text-[#52473D]">
                        {item.contact?.telegramHandle && (
                          <span className="flex items-center gap-1 font-mono">
                            <Send className="w-3.5 h-3.5 text-[#398256]" />
                            {item.contact.telegramHandle}
                          </span>
                        )}
                        {item.contact?.whatsappPhone && (
                          <span className="flex items-center gap-1 font-mono">
                            <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                            {item.contact.whatsappPhone}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#8C7E72]" />
                          {item.contact?.atelierLocation}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {item.contact?.whatsappPhone && (
                          <a
                            href={`https://wa.me/${item.contact.whatsappPhone.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-lg bg-[#25D366] text-white text-[11px] font-medium tracking-wider uppercase flex items-center gap-1"
                          >
                            <MessageCircle className="w-3 h-3" />
                            WhatsApp
                          </a>
                        )}
                        {item.contact?.telegramHandle && (
                          <a
                            href={`https://t.me/${item.contact.telegramHandle.replace('@', '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-lg bg-[#229ED9] text-white text-[11px] font-medium tracking-wider uppercase flex items-center gap-1"
                          >
                            <Send className="w-3 h-3" />
                            Telegram
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E5DFD6]">
                        <span className="text-[10px] uppercase tracking-wider text-[#8A7D71] block">Силуэт и стиль</span>
                        <div className="font-medium text-[#1A1816] mt-0.5">{silhouette || '—'}</div>
                        <div className="text-[#6B5F54] mt-0.5">{style || '—'}</div>
                      </div>
                      <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E5DFD6]">
                        <span className="text-[10px] uppercase tracking-wider text-[#8A7D71] block">Цвета</span>
                        <div className="font-medium text-[#1A1816] mt-0.5">
                          {Array.isArray(item.colors) && item.colors.length > 0 ? item.colors.join(', ') : '—'}
                        </div>
                        {item.customColorNote && (
                          <div className="text-[#6B5F54] mt-0.5">{item.customColorNote}</div>
                        )}
                      </div>
                      <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E5DFD6]">
                        <span className="text-[10px] uppercase tracking-wider text-[#8A7D71] block">Посадка</span>
                        <div className="font-medium text-[#1A1816] mt-0.5">
                          {item.measurements?.clothingSize || '—'} · {item.measurements?.height || '—'}
                        </div>
                        <div className="text-[#6B5F54] mt-0.5">
                          {Array.isArray(item.measurements?.fitPreferences) &&
                          item.measurements.fitPreferences.length > 0
                            ? item.measurements.fitPreferences.join(', ')
                            : '—'}
                        </div>
                        {item.measurements?.notes && (
                          <div className="text-[#6B5F54] mt-1">{item.measurements.notes}</div>
                        )}
                      </div>
                      <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E5DFD6]">
                        <span className="text-[10px] uppercase tracking-wider text-[#8A7D71] block">Приоритеты / событие</span>
                        <div className="text-[#6B5F54] mt-0.5">
                          {Array.isArray(item.priorities) && item.priorities.length > 0
                            ? item.priorities.join(', ')
                            : '—'}
                        </div>
                        <div className="text-[#6B5F54] mt-1">
                          {[...(item.settings || []), item.settingOther, item.eventCity]
                            .filter(Boolean)
                            .join(' · ') || '—'}
                        </div>
                        {item.consentAccepted && (
                          <div className="text-[10px] text-[#2E7A4C] mt-1">
                            Согласие: да · {item.consentVersion || '—'}
                          </div>
                        )}
                      </div>
                    </div>

                    {item.aiStyleDirection && (
                      <div className="p-4 rounded-xl bg-[#1A1816] text-[#FAF8F5] space-y-2.5">
                        <div className="flex items-center gap-2 text-[#D8CEBF] text-xs font-medium uppercase tracking-widest">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>AI Style Direction</span>
                        </div>
                        <h4 className="font-serif text-lg font-light italic">
                          “{item.aiStyleDirection.headline}”
                        </h4>
                        <p className="text-xs text-[#D8CEBF] font-light leading-relaxed">
                          {item.aiStyleDirection.concept}
                        </p>
                      </div>
                    )}

                    <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E5DFD6]">
                      <span className="text-[10px] uppercase tracking-wider text-[#8A7D71] block mb-1">Статус</span>
                      <select
                        value={item.status || 'new'}
                        onChange={(e) => updateStatus(item.id!, e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-[#F6F1EA] border border-[#D9D1C5] text-xs font-medium text-[#1A1816]"
                      >
                        <option value="new">{t.statusNew}</option>
                        <option value="contacted">{t.statusContacted}</option>
                        <option value="scheduled">{t.statusScheduled}</option>
                        <option value="fitting">{t.statusFitting}</option>
                        <option value="completed">{t.statusCompleted}</option>
                      </select>
                    </div>

                    {item.referenceNotes && (
                      <div className="text-xs text-[#63574D]">
                        <span className="text-[10px] uppercase tracking-wider text-[#8A7D71] block mb-1">
                          Заметки к референсам
                        </span>
                        {item.referenceNotes}
                      </div>
                    )}

                    {item.references && item.references.length > 0 && (
                      <div>
                        <span className="text-[10px] font-medium uppercase tracking-wider text-[#8A7D71] block mb-2">
                          Фото-референсы ({item.references.length})
                        </span>
                        <div className="grid grid-cols-3 gap-2.5">
                          {item.references.map((img, i) => (
                            <div
                              key={i}
                              className="aspect-[3/4] rounded-xl overflow-hidden border border-[#D9D1C5] bg-[#ECE5DA]"
                            >
                              <img
                                src={img}
                                alt={`Reference ${i + 1}`}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-contain object-center"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {pendingDelete && (
        <div
          className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center bg-[#1A1816]/45 backdrop-blur-[2px] p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md rounded-2xl bg-[#FAF8F5] border border-[#E8E1D6] shadow-2xl p-6">
            <h2 className="font-serif text-2xl font-light text-[#1A1816] mb-2">
              {pendingDelete.archived ? t.dashPurgeTitle : t.dashArchiveTitle}
            </h2>
            <p className="text-xs text-[#706459] font-light leading-relaxed mb-1">
              {pendingDelete.contact?.fullName || '—'} · {pendingDelete.id}
            </p>
            <p className="text-sm text-[#544B43] font-light leading-relaxed mb-4">
              {pendingDelete.archived ? t.dashPurgeText : t.dashArchiveText}
            </p>
            {pendingDelete.archived && (
              <label className="block text-[11px] uppercase tracking-[0.15em] text-[#544B43] mb-3">
                {t.dashPurgePassword}
                <input
                  type="password"
                  value={purgePassword}
                  onChange={(e) => setPurgePassword(e.target.value)}
                  autoComplete="current-password"
                  className="mt-1.5 w-full px-3.5 py-2.5 rounded-xl bg-[#F6F1EA] border border-[#D9D1C5] text-sm text-[#1A1816] normal-case tracking-normal focus:outline-none focus:ring-1 focus:ring-[#1A1816]"
                />
              </label>
            )}
            {actionError && <p className="text-xs text-[#A83D3D] mb-3">{actionError}</p>}
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={closeDeleteDialog}
                disabled={acting}
                className="flex-1 py-3 rounded-full border border-[#D9D1C5] text-xs uppercase tracking-[0.14em] text-[#54493F]"
              >
                {t.dashCancel}
              </button>
              <button
                type="button"
                disabled={acting || (Boolean(pendingDelete.archived) && !purgePassword.trim())}
                onClick={pendingDelete.archived ? confirmPurge : confirmArchive}
                className="flex-1 py-3 rounded-full bg-[#A83D3D] text-[#FAF8F5] text-xs uppercase tracking-[0.14em] disabled:bg-[#E5DDD2] disabled:text-[#9E9488]"
              >
                {pendingDelete.archived ? t.dashPurgeConfirm : t.dashArchiveConfirm}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
