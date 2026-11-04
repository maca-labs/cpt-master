export const PWA_UPDATE_INTERVAL_MS = 60 * 60 * 1000;
export const PWA_MIN_CHECK_INTERVAL_MS = 60 * 1000;

/** pathname is the React Router path inside the hash, not the hosting prefix. */
export function isPwaUpdateBlocked(pathname: string, activeDiagnostic = false): boolean {
  const path = pathname.split(/[?#]/, 1)[0].replace(/\/+$/, '') || '/';
  return (
    /^\/session\/[^/]+(?:\/|$)/.test(path) ||
    (path !== '/exam/full' && /^\/exam\/[^/]+(?:\/|$)/.test(path)) ||
    (path === '/diagnostic' && activeDiagnostic)
  );
}

export function canApplyPwaUpdate(state: {
  available: boolean;
  blocked: boolean;
  acknowledged: boolean;
  applying: boolean;
}): boolean {
  return state.available && !state.blocked && state.acknowledged && !state.applying;
}

/** A controller change from another tab must never force a page reload. */
export function shouldReloadPwa(state: { approved: boolean; blocked: boolean }): boolean {
  return state.approved && !state.blocked;
}

export function shouldCheckPwaUpdate(state: {
  online: boolean;
  visible: boolean;
  installing: boolean;
  waiting: boolean;
  checking: boolean;
  now: number;
  lastCheckedAt: number;
  force?: boolean;
}): boolean {
  return (
    state.online &&
    state.visible &&
    !state.installing &&
    !state.waiting &&
    !state.checking &&
    (state.force === true ||
      state.lastCheckedAt === 0 ||
      state.now - state.lastCheckedAt >= PWA_MIN_CHECK_INTERVAL_MS)
  );
}
