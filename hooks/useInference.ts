'use client';

import { useRef, useState, useCallback } from 'react';
import { fetchPrediction } from '@/lib/api';
import { captureFrame, drawFaceBox } from '@/lib/canvas';
import { INFERENCE_INTERVAL_MS, LOG_INTERVAL_MS, MAX_HISTORY_ITEMS, SMOOTH_WINDOW, AUTISM_THRESHOLD } from '@/lib/constants';
import type { PredictionResult, HistoryItem, SessionStats } from '@/types';

export function useInference(
  backendUrl: string,
  videoRef: React.RefObject<HTMLVideoElement | null>,
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  onConnectionChange: (ok: boolean, msg: string) => void
) {
  const animRef       = useRef<number | null>(null);
  const isRunningRef  = useRef(false);
  const lastLogRef    = useRef(0);
  const lastFPSRef    = useRef(Date.now());
  const fpsFramesRef  = useRef(0);
  const probBufferRef = useRef<number[]>([]);

  const [result,  setResult]  = useState<PredictionResult | null>(null);
  const [fps,     setFps]     = useState('');
  const [stats,   setStats]   = useState<SessionStats>({ autismCount: 0, normalCount: 0, frameCount: 0 });
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const historyIdRef = useRef(0);

  const smooth = useCallback((data: PredictionResult): PredictionResult => {
    probBufferRef.current.push(data.autisticProb);
    if (probBufferRef.current.length > SMOOTH_WINDOW) probBufferRef.current.shift();
    const avg = probBufferRef.current.reduce((a, b) => a + b, 0) / probBufferRef.current.length;
    return { ...data, isAutistic: avg >= AUTISM_THRESHOLD, autisticProb: avg, nonAutisticProb: 1 - avg };
  }, []);

  const loop = useCallback(async () => {
    if (!isRunningRef.current) return;
    const video  = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width  = video.videoWidth  || 640;
    canvas.height = video.videoHeight || 480;

    try {
      const frame = captureFrame(video);
      const raw   = await fetchPrediction(backendUrl, frame);

      if (!raw.error) {
        const data = smooth(raw);
        onConnectionChange(true, 'Connected · receiving predictions');
        setResult(data);
        drawFaceBox(canvas, data);

        setStats((prev) => ({
          autismCount: prev.autismCount + (data.isAutistic ? 1 : 0),
          normalCount: prev.normalCount + (!data.isAutistic ? 1 : 0),
          frameCount:  prev.frameCount + 1,
        }));

        const now = Date.now();
        if (now - lastLogRef.current > LOG_INTERVAL_MS) {
          lastLogRef.current = now;
          const conf = Math.round(Math.max(data.autisticProb, data.nonAutisticProb) * 100);
          const t    = new Date();
          const time = [t.getHours(), t.getMinutes(), t.getSeconds()]
            .map((n) => String(n).padStart(2, '0')).join(':');
          setHistory((prev) => {
            const item: HistoryItem = {
              id: ++historyIdRef.current, isAutistic: data.isAutistic,
              topEmotion: data.topEmotion, confidence: conf, time,
            };
            return [item, ...prev].slice(0, MAX_HISTORY_ITEMS);
          });
        }
      }
    } catch {
      onConnectionChange(false, 'Connection lost — check Colab is still running');
    }

    fpsFramesRef.current++;
    const now = Date.now();
    if (now - lastFPSRef.current >= 1000) {
      setFps(`${((fpsFramesRef.current * 1000) / (now - lastFPSRef.current)).toFixed(1)} fps`);
      fpsFramesRef.current = 0;
      lastFPSRef.current   = now;
    }

    setTimeout(() => { animRef.current = requestAnimationFrame(loop); }, INFERENCE_INTERVAL_MS);
  }, [backendUrl, videoRef, canvasRef, onConnectionChange, smooth]);

  const startInference = useCallback(() => {
    probBufferRef.current = [];
    isRunningRef.current  = true;
    animRef.current       = requestAnimationFrame(loop);
  }, [loop]);

  const stopInference = useCallback(() => {
    isRunningRef.current  = false;
    probBufferRef.current = [];
    if (animRef.current) { cancelAnimationFrame(animRef.current); animRef.current = null; }
    setResult(null);
    if (canvasRef.current) {
      canvasRef.current.getContext('2d')?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
    setFps('');
  }, [canvasRef]);

  const clearStats = useCallback(() => {
    setStats({ autismCount: 0, normalCount: 0, frameCount: 0 });
    setHistory([]);
  }, []);

  return { result, fps, stats, history, startInference, stopInference, clearStats };
}
// 'use client';

// import { useRef, useState, useCallback } from 'react';
// import { fetchPrediction } from '@/lib/api';
// import { captureFrame, drawFaceBox } from '@/lib/canvas';
// import { INFERENCE_INTERVAL_MS, LOG_INTERVAL_MS, MAX_HISTORY_ITEMS } from '@/lib/constants';
// import type { PredictionResult, HistoryItem, SessionStats } from '@/types';

// export function useInference(
//   backendUrl: string,
//   videoRef: React.RefObject<HTMLVideoElement | null>,
//   canvasRef: React.RefObject<HTMLCanvasElement | null>,
//   onConnectionChange: (ok: boolean, msg: string) => void
// ) {
//   const animRef = useRef<number | null>(null);
//   const isRunningRef = useRef(false);
//   const lastLogRef = useRef(0);
//   const lastFPSRef = useRef(Date.now());
//   const fpsFramesRef = useRef(0);

//   const [result, setResult] = useState<PredictionResult | null>(null);
//   const [fps, setFps] = useState('');
//   const [stats, setStats] = useState<SessionStats>({
//     autismCount: 0,
//     normalCount: 0,
//     frameCount: 0,
//   });
//   const [history, setHistory] = useState<HistoryItem[]>([]);
//   const historyIdRef = useRef(0);

//   const loop = useCallback(async () => {
//     if (!isRunningRef.current) return;

//     const video = videoRef.current;
//     const canvas = canvasRef.current;
//     if (!video || !canvas) return;

//     canvas.width = video.videoWidth || 640;
//     canvas.height = video.videoHeight || 480;

//     try {
//       const frame = captureFrame(video);
//       const data = await fetchPrediction(backendUrl, frame);

//       if (!data.error) {
//         onConnectionChange(true, 'Connected · receiving predictions');
//         setResult(data);
//         drawFaceBox(canvas, data);

//         setStats((prev) => ({
//           autismCount: prev.autismCount + (data.isAutism ? 1 : 0),
//           normalCount: prev.normalCount + (!data.isAutism ? 1 : 0),
//           frameCount: prev.frameCount + 1,
//         }));

//         const now = Date.now();
//         if (now - lastLogRef.current > LOG_INTERVAL_MS) {
//           lastLogRef.current = now;
//           const conf = Math.round(
//             Math.max(data.autismProb, data.normalProb) * 100
//           );
//           const t = new Date();
//           const time = [t.getHours(), t.getMinutes(), t.getSeconds()]
//             .map((n) => String(n).padStart(2, '0'))
//             .join(':');
//           setHistory((prev) => {
//             const item: HistoryItem = {
//               id: ++historyIdRef.current,
//               isAutism: data.isAutism,
//               topEmotion: data.topEmotion,
//               confidence: conf,
//               time,
//             };
//             return [item, ...prev].slice(0, MAX_HISTORY_ITEMS);
//           });
//         }
//       }
//     } catch {
//       onConnectionChange(false, 'Connection lost — check Colab is still running');
//     }

//     // FPS
//     fpsFramesRef.current++;
//     const now = Date.now();
//     if (now - lastFPSRef.current >= 1000) {
//       setFps(
//         `${((fpsFramesRef.current * 1000) / (now - lastFPSRef.current)).toFixed(1)} fps`
//       );
//       fpsFramesRef.current = 0;
//       lastFPSRef.current = now;
//     }

//     setTimeout(() => {
//       animRef.current = requestAnimationFrame(loop);
//     }, INFERENCE_INTERVAL_MS);
//   }, [backendUrl, videoRef, canvasRef, onConnectionChange]);

//   const startInference = useCallback(() => {
//     isRunningRef.current = true;
//     animRef.current = requestAnimationFrame(loop);
//   }, [loop]);

//   const stopInference = useCallback(() => {
//     isRunningRef.current = false;
//     if (animRef.current) {
//       cancelAnimationFrame(animRef.current);
//       animRef.current = null;
//     }
//     setResult(null);
//     if (canvasRef.current) {
//       const ctx = canvasRef.current.getContext('2d');
//       ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
//     }
//     setFps('');
//   }, [canvasRef]);

//   const clearStats = useCallback(() => {
//     setStats({ autismCount: 0, normalCount: 0, frameCount: 0 });
//     setHistory([]);
//   }, []);

//   return { result, fps, stats, history, startInference, stopInference, clearStats };
// }
