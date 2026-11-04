import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  canApplyPwaUpdate,
  isPwaUpdateBlocked,
  PWA_MIN_CHECK_INTERVAL_MS,
  PWA_UPDATE_INTERVAL_MS,
  shouldCheckPwaUpdate,
  shouldReloadPwa,
} from '../src/engines/pwa';

describe('PWA update safety on study routes', () => {
  it.each([
    '/session/abc',
    '/session/abc/',
    '/session/abc/review',
    '/exam/mock-id',
    '/exam/mock-id/review',
  ])('blocks reload on %s', (path) => {
    expect(isPwaUpdateBlocked(path)).toBe(true);
  });
  it('blocks an active diagnostic landing page but allows a completed diagnostic or ordinary navigation', () => {
    expect(isPwaUpdateBlocked('/diagnostic', true)).toBe(true);
    expect(isPwaUpdateBlocked('/diagnostic/', true)).toBe(true);
    for (const path of ['/', '/practice', '/settings', '/learn/anatomy', '/exam', '/diagnostic']) {
      expect(isPwaUpdateBlocked(path, false)).toBe(false);
    }
  });
  it('allows the full-exam preparation page and completed result pages', () => {
    for (const path of ['/exam/full', '/exam/full/', '/exam-results/finished-id', '/analytics']) {
      expect(isPwaUpdateBlocked(path)).toBe(false);
    }
    expect(isPwaUpdateBlocked('/exam/live-mock-id')).toBe(true);
  });
  it('requires explicit acknowledgement and never applies while answering or while already applying', () => {
    const state = { available: true, blocked: false, acknowledged: true, applying: false };
    expect(canApplyPwaUpdate(state)).toBe(true);
    expect(canApplyPwaUpdate({ ...state, available: false })).toBe(false);
    expect(canApplyPwaUpdate({ ...state, acknowledged: false })).toBe(false);
    expect(canApplyPwaUpdate({ ...state, blocked: true })).toBe(false);
    expect(canApplyPwaUpdate({ ...state, applying: true })).toBe(false);
  });
  it('does not let another tab force a reload and rechecks the current route after local approval', () => {
    expect(shouldReloadPwa({ approved: false, blocked: false })).toBe(false);
    expect(shouldReloadPwa({ approved: false, blocked: true })).toBe(false);
    expect(shouldReloadPwa({ approved: true, blocked: true })).toBe(false);
    expect(shouldReloadPwa({ approved: true, blocked: false })).toBe(true);
  });
});

describe('PWA update-check policy', () => {
  const ready = {
    online: true,
    visible: true,
    installing: false,
    waiting: false,
    checking: false,
    now: 100000,
    lastCheckedAt: 0,
  };
  it('checks hourly while online and visible, without frequent repeated requests', () => {
    expect(PWA_UPDATE_INTERVAL_MS).toBe(3600000);
    expect(shouldCheckPwaUpdate(ready)).toBe(true);
    expect(
      shouldCheckPwaUpdate({ ...ready, lastCheckedAt: ready.now - PWA_MIN_CHECK_INTERVAL_MS + 1 }),
    ).toBe(false);
    expect(
      shouldCheckPwaUpdate({ ...ready, lastCheckedAt: ready.now - PWA_MIN_CHECK_INTERVAL_MS }),
    ).toBe(true);
    expect(shouldCheckPwaUpdate({ ...ready, lastCheckedAt: ready.now, force: true })).toBe(true);
  });
  it.each(['online', 'visible'] as const)('does not check without %s', (key) => {
    expect(shouldCheckPwaUpdate({ ...ready, [key]: false })).toBe(false);
    expect(shouldCheckPwaUpdate({ ...ready, [key]: false, force: true })).toBe(false);
  });
  it.each(['installing', 'waiting', 'checking'] as const)(
    'does not overlap an existing %s state',
    (key) => {
      expect(shouldCheckPwaUpdate({ ...ready, [key]: true })).toBe(false);
      expect(shouldCheckPwaUpdate({ ...ready, [key]: true, force: true })).toBe(false);
    },
  );
});

describe('installable PNG icon assets', () => {
  it.each([
    ['pwa-192.png', 192],
    ['pwa-512.png', 512],
    ['apple-touch-icon.png', 180],
  ] as const)('ships %s at its declared dimensions', (name, size) => {
    const bytes = readFileSync(fileURLToPath(new URL(`../public/${name}`, import.meta.url)));
    expect([...bytes.subarray(0, 8)]).toEqual([137, 80, 78, 71, 13, 10, 26, 10]);
    expect(bytes.toString('ascii', 12, 16)).toBe('IHDR');
    expect(bytes.readUInt32BE(16)).toBe(size);
    expect(bytes.readUInt32BE(20)).toBe(size);
  });
});
