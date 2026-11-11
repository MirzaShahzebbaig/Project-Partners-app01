// Runtime API base-URL handling.
// - In a browser served by the Express server, relative "/api/..." calls just work (base = "").
// - In the Android APK (Capacitor) the page origin is the phone itself, so "/api/..." must be
//   redirected to the real backend. The address is set once on first launch (or via
//   VITE_API_BASE at build time) and stored on the device.

const KEY = 'pp_api_base';

export const isNative = () =>
  typeof window !== 'undefined' &&
  !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform());

export const normalizeBase = (value) => {
  let v = (value || '').trim();
  if (!v) return '';
  if (!/^https?:\/\//i.test(v)) v = 'http://' + v;
  return v.replace(/\/+$/, '').replace(/\/api$/i, '');
};

export const getApiBase = () => {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved) return saved;
  } catch (_) {}
  return normalizeBase(import.meta.env.VITE_API_BASE || '');
};

export const setApiBase = (value) => {
  const base = normalizeBase(value);
  try {
    if (base) localStorage.setItem(KEY, base);
    else localStorage.removeItem(KEY);
  } catch (_) {}
  return base;
};

// Prefix every relative /api call with the configured backend address.
export const installFetchBase = () => {
  if (window.__ppFetchPatched) return;
  window.__ppFetchPatched = true;
  const original = window.fetch.bind(window);
  window.fetch = (input, init) => {
    if (typeof input === 'string' && input.startsWith('/api')) {
      const base = getApiBase();
      if (base) input = base + input;
    }
    return original(input, init);
  };
};
