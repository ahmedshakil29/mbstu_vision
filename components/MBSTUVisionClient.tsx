'use client';

import { useRef, useState, useCallback } from 'react';
import Header from '@/components/Header';
import URLBanner from '@/components/URLBanner';
import SidePanel from '@/components/SidePanel';
import { useCamera } from '@/hooks/useCamera';
import { useInference } from '@/hooks/useInference';

export default function MBSTUVisionClient() {
  const [backendUrl, setBackendUrl] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [connText, setConnText] = useState('Not connected to Colab');

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { isCameraOn, startCamera, stopCamera } = useCamera(videoRef);

  const handleConnectionChange = useCallback((ok: boolean, msg: string) => {
    setIsConnected(ok);
    setConnText(msg);
  }, []);

  const { result, fps, stats, history, startInference, stopInference, clearStats } =
    useInference(backendUrl, videoRef, canvasRef, handleConnectionChange);

  const handleConnect = useCallback(
    (url: string, device: string, model: string) => {
      setBackendUrl(url);
      setIsConnected(true);
      setConnText(`Connected · ${device} · ${model}`);
    },
    []
  );

  const handleDisconnect = useCallback(() => {
    setIsConnected(false);
    setConnText('Colab not reachable — is the server cell running?');
  }, []);

  const handleStart = useCallback(async () => {
    if (!backendUrl || !backendUrl.startsWith('http')) {
      alert('Paste your Colab URL in the bar at the top, then click CONNECT.');
      return;
    }
    const ok = await startCamera();
    if (!ok) {
      alert('Camera access denied.\nPlease allow camera access in your browser and try again.');
      return;
    }
    startInference();
  }, [backendUrl, startCamera, startInference]);

  const handleStop = useCallback(() => {
    stopCamera();
    stopInference();
  }, [stopCamera, stopInference]);

  return (
    <div className="app-shell">
      <Header isLive={isCameraOn} />
      <URLBanner onConnect={handleConnect} onDisconnect={handleDisconnect} />

      <main className="main-layout">
        {/* Video panel */}
        <div className="video-panel">
          {!isCameraOn && (
            <div className="no-cam">
              <div className="no-cam-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M23 7l-7 5 7 5V7z" />
                  <rect x="1" y="5" width="15" height="14" rx="2" />
                </svg>
              </div>
              <div>Real-time detection — webcam required</div>
              <button className="start-btn" onClick={handleStart}>
                ▶ START CAMERA
              </button>
            </div>
          )}

          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="video-el"
            style={{ display: isCameraOn ? 'block' : 'none' }}
          />
          <canvas ref={canvasRef} className="canvas-el" />

          <div className={`scan-overlay${isCameraOn ? ' active' : ''}`}>
            <div className="scan-line" />
          </div>

          {result && (
            <div className="video-overlay">
              {result.isAutism && (
                <div className="overlay-chip autism">● AUTISM DETECTED</div>
              )}
              {!result.isAutism && (
                <div className="overlay-chip normal">● NOT AUTISM</div>
              )}
              <div className="overlay-chip emotion">
                EMOTION: {result.topEmotion.toUpperCase()}
              </div>
            </div>
          )}

          {fps && <div className="fps-counter">{fps}</div>}
        </div>

        <SidePanel
          result={result}
          history={history}
          stats={stats}
          isConnected={isConnected}
          connText={connText}
          isCameraOn={isCameraOn}
          onStart={handleStart}
          onStop={handleStop}
          onClear={clearStats}
        />
      </main>
    </div>
  );
}
