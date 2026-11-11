import React, { useState } from 'react';
import { Server, CheckCircle2, AlertTriangle } from 'lucide-react';
import { getApiBase, setApiBase, normalizeBase } from '../config';

// Shown inside the Android app until a backend address is saved (and from the menu to change it).
export default function ServerSetup({ onDone, onCancel }) {
  const [value, setValue] = useState(getApiBase());
  const [status, setStatus] = useState(null); // null | 'testing' | 'ok' | 'fail'

  const test = async () => {
    const base = normalizeBase(value);
    if (!base) return setStatus('fail');
    setStatus('testing');
    try {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 6000);
      const res = await fetch(base + '/api/health', { signal: ctrl.signal });
      clearTimeout(t);
      const data = await res.json();
      setStatus(data.status === 'success' ? 'ok' : 'fail');
    } catch (_) {
      setStatus('fail');
    }
  };

  const save = () => {
    setApiBase(value);
    onDone && onDone();
    window.location.reload();
  };

  return (
    <div className="pp-modal-backdrop" style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(9,13,22,0.96)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '460px', padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
          <Server size={22} color="#818cf8" />
          <h2 style={{ fontSize: '1.2rem' }}>Connect to server</h2>
        </div>
        <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '1rem' }}>
          Enter the address of your ProjectPartner backend, e.g.
          <span className="mono" style={{ color: '#c7d2fe' }}> http://192.168.1.20:5000</span> (your PC on the same Wi-Fi)
          or your hosted URL.
        </p>
        <input
          type="url"
          inputMode="url"
          autoCapitalize="off"
          autoCorrect="off"
          placeholder="http://192.168.1.20:5000"
          value={value}
          onChange={(e) => { setValue(e.target.value); setStatus(null); }}
          style={{ width: '100%', padding: '0.8rem 0.9rem', borderRadius: '0.6rem', border: '1px solid rgba(255,255,255,0.15)', background: '#0f172a', color: '#f8fafc' }}
        />
        <div style={{ minHeight: '1.6rem', marginTop: '0.6rem', fontSize: '0.85rem' }}>
          {status === 'testing' && <span style={{ color: '#94a3b8' }}>Testing connection…</span>}
          {status === 'ok' && <span style={{ color: '#34d399', display: 'flex', gap: '0.3rem', alignItems: 'center' }}><CheckCircle2 size={15} /> Server reachable</span>}
          {status === 'fail' && <span style={{ color: '#f87171', display: 'flex', gap: '0.3rem', alignItems: 'center' }}><AlertTriangle size={15} /> Could not reach the server</span>}
        </div>
        <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
          <button className="btn btn-secondary" style={{ flex: 1 }} onClick={test}>Test</button>
          <button className="btn btn-primary" style={{ flex: 1 }} onClick={save} disabled={!normalizeBase(value)}>Save</button>
          {onCancel && <button className="btn btn-outline" style={{ flex: '1 1 100%' }} onClick={onCancel}>Cancel</button>}
        </div>
      </div>
    </div>
  );
}
