'use client';

import { forwardRef } from 'react';
import type { PredictionResult } from '@/types';

interface VideoPanelProps {
  isCameraOn: boolean;
  isRunning: boolean;
  result: PredictionResult | null;
  fps: string;
  onStart: () => void;
}

const VideoPanel = forwardRef<
  { video: HTMLVideoElement | null; canvas: HTMLCanvasElement | null },
  VideoPanelProps
>(function VideoPanel({ isCameraOn, isRunning, result, fps, onStart }, ref) {
  return (
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
          <button className="start-btn" onClick={onStart}>
            ▶ START CAMERA
          </button>
        </div>
      )}

      <video
        ref={(el) => {
          if (ref && typeof ref === 'object') {
            if (!ref.current) (ref as React.MutableRefObject<{ video: HTMLVideoElement | null; canvas: HTMLCanvasElement | null }>).current = { video: null, canvas: null };
            (ref as React.MutableRefObject<{ video: HTMLVideoElement | null; canvas: HTMLCanvasElement | null }>).current!.video = el;
          }
        }}
        autoPlay
        muted
        playsInline
        style={{ display: isCameraOn ? 'block' : 'none' }}
        className="video-el"
      />
      <canvas
        ref={(el) => {
          if (ref && typeof ref === 'object') {
            if (!ref.current) (ref as React.MutableRefObject<{ video: HTMLVideoElement | null; canvas: HTMLCanvasElement | null }>).current = { video: null, canvas: null };
            (ref as React.MutableRefObject<{ video: HTMLVideoElement | null; canvas: HTMLCanvasElement | null }>).current!.canvas = el;
          }
        }}
        className="canvas-el"
      />

      <div className={`scan-overlay ${isRunning ? 'active' : ''}`}>
        <div className="scan-line" />
      </div>

      {result && (
        <div className="video-overlay">
          {result.isAutistic && <div className="overlay-chip autism">● AUTISM DETECTED</div>}
          {!result.isAutistic && <div className="overlay-chip normal">● NOT AUTISTIC</div>}
          <div className="overlay-chip emotion">
            EMOTION: {result.topEmotion.toUpperCase()}
          </div>
        </div>
      )}

      {fps && <div className="fps-counter">{fps}</div>}
    </div>
  );
});

export default VideoPanel;
// 'use client';

// import { forwardRef } from 'react';
// import type { PredictionResult } from '@/types';

// interface VideoPanelProps {
//   isCameraOn: boolean;
//   isRunning: boolean;
//   result: PredictionResult | null;
//   fps: string;
//   onStart: () => void;
// }

// const VideoPanel = forwardRef<
//   { video: HTMLVideoElement | null; canvas: HTMLCanvasElement | null },
//   VideoPanelProps
// >(function VideoPanel({ isCameraOn, isRunning, result, fps, onStart }, ref) {
//   return (
//     <div className="video-panel">
//       {!isCameraOn && (
//         <div className="no-cam">
//           <div className="no-cam-icon">
//             <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
//               <path d="M23 7l-7 5 7 5V7z" />
//               <rect x="1" y="5" width="15" height="14" rx="2" />
//             </svg>
//           </div>
//           <div>Real-time detection — webcam required</div>
//           <button className="start-btn" onClick={onStart}>
//             ▶ START CAMERA
//           </button>
//         </div>
//       )}

//       <video
//         ref={(el) => {
//           if (ref && typeof ref === 'object') {
//             if (!ref.current) (ref as React.MutableRefObject<{ video: HTMLVideoElement | null; canvas: HTMLCanvasElement | null }>).current = { video: null, canvas: null };
//             (ref as React.MutableRefObject<{ video: HTMLVideoElement | null; canvas: HTMLCanvasElement | null }>).current!.video = el;
//           }
//         }}
//         autoPlay
//         muted
//         playsInline
//         style={{ display: isCameraOn ? 'block' : 'none' }}
//         className="video-el"
//       />
//       <canvas
//         ref={(el) => {
//           if (ref && typeof ref === 'object') {
//             if (!ref.current) (ref as React.MutableRefObject<{ video: HTMLVideoElement | null; canvas: HTMLCanvasElement | null }>).current = { video: null, canvas: null };
//             (ref as React.MutableRefObject<{ video: HTMLVideoElement | null; canvas: HTMLCanvasElement | null }>).current!.canvas = el;
//           }
//         }}
//         className="canvas-el"
//       />

//       <div className={`scan-overlay ${isRunning ? 'active' : ''}`}>
//         <div className="scan-line" />
//       </div>

//       {result && (
//         <div className="video-overlay">
//           {result.isAutism && <div className="overlay-chip autism">● AUTISM DETECTED</div>}
//           {!result.isAutism && <div className="overlay-chip normal">● NOT AUTISM</div>}
//           <div className="overlay-chip emotion">
//             EMOTION: {result.topEmotion.toUpperCase()}
//           </div>
//         </div>
//       )}

//       {fps && <div className="fps-counter">{fps}</div>}
//     </div>
//   );
// });

// export default VideoPanel;
