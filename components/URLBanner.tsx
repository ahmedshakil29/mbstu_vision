'use client';

import { useState, useCallback, KeyboardEvent } from 'react';
import { fetchHealth } from '@/lib/api';
import type { URLStatus } from '@/types';

interface URLBannerProps {
  onConnect: (url: string, device: string, model: string) => void;
  onDisconnect: () => void;
}

export default function URLBanner({ onConnect, onDisconnect }: URLBannerProps) {
  const [inputVal, setInputVal] = useState(
    () => (typeof window !== 'undefined' ? localStorage.getItem('mbstu_backend_url') ?? '' : '')
  );
  const [urlStatus, setUrlStatus] = useState<URLStatus>('idle');
  const [statusMsg, setStatusMsg] = useState('');

  const applyURL = useCallback(async () => {
    const val = inputVal.trim().replace(/\/$/, '');
    if (!val.startsWith('http')) {
      setUrlStatus('err');
      setStatusMsg('✗ Must start with https://');
      return;
    }
    setUrlStatus('checking');
    setStatusMsg('⏳ Connecting…');
    try {
      const data = await fetchHealth(val);
      localStorage.setItem('mbstu_backend_url', val);
      setUrlStatus('ok');
      setStatusMsg(`✓ Connected (${data.device ?? 'cpu'})`);
      onConnect(val, data.device ?? 'cpu', data.model ?? 'ResNet34');
    } catch {
      setUrlStatus('err');
      setStatusMsg('✗ Not reachable');
      onDisconnect();
    }
  }, [inputVal, onConnect, onDisconnect]);

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') applyURL();
  };

  return (
    <div className="url-banner">
      <label>Colab URL</label>
      <input
        type="text"
        value={inputVal}
        onChange={(e) => setInputVal(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="https://xxxx.trycloudflare.com"
        autoComplete="off"
        spellCheck={false}
      />
      <button className="url-apply-btn" onClick={applyURL}>
        CONNECT
      </button>
      {statusMsg && (
        <span className={`url-status ${urlStatus}`}>{statusMsg}</span>
      )}
    </div>
  );
}
