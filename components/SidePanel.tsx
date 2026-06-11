import EmotionGrid from './EmotionGrid';
import DetectionLog from './DetectionLog';
import type { PredictionResult, HistoryItem, SessionStats } from '@/types';
import { DEFAULT_EMOTIONS } from '@/lib/constants';

interface SidePanelProps {
  result: PredictionResult | null;
  history: HistoryItem[];
  stats: SessionStats;
  isConnected: boolean;
  connText: string;
  isCameraOn: boolean;
  onStart: () => void;
  onStop: () => void;
  onClear: () => void;
}

export default function SidePanel({
  result,
  history,
  stats,
  isConnected,
  connText,
  isCameraOn,
  onStart,
  onStop,
  onClear,
}: SidePanelProps) {
  const badgeClass = result
    ? result.isAutistic
      ? 'result-badge autism'
      : 'result-badge normal'
    : 'result-badge idle';

  const badgeLabel = result
    ? `● ${result.isAutistic ? 'AUTISTIC' : 'NOT AUTISTIC'}`
    : '● AWAITING INPUT';

  const conf = result
    ? Math.round(Math.max(result.autisticProb, result.nonAutisticProb) * 100)
    : null;

  return (
    <div className="side-panel">
      {/* Result badge */}
      <div className="side-section result-main">
        <div className={badgeClass}>{badgeLabel}</div>
        {conf !== null && (
          <div className="result-confidence">
            confidence <span>{conf}%</span>
          </div>
        )}
      </div>

      {/* Emotion grid */}
      <div className="side-section">
        <div className="section-label">emotion analysis</div>
        <EmotionGrid result={result} defaultEmotions={DEFAULT_EMOTIONS} />
      </div>

      {/* Detection log */}
      <div className="side-section" style={{ flex: 1 }}>
        <div className="section-label">detection log</div>
        <DetectionLog items={history} />
      </div>

      {/* Models + connection */}
      <div className="side-section">
        <div className="section-label">models</div>
        <div className="model-cards">
          <div className="model-card">
            <span className="model-name">autism_model (ResNet-34 KFold)</span>
            <span className="model-tag ok">LOADED</span>
          </div>
          <div className="model-card">
            <span className="model-name">autism_emotion (EffNet-B0 6cls)</span>
            <span className="model-tag ok">LOADED</span>
          </div>
          <div className="model-card">
            <span className="model-name">kdef_model (EffNet-B0 7cls)</span>
            <span className="model-tag ok">LOADED</span>
          </div>
        </div>
        <div className="conn-row" style={{ marginTop: 12 }}>
          <div className={`conn-dot ${isConnected ? 'connected' : ''}`} />
          <span>{connText}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-row">
        <div className="stat-cell">
          <span className="stat-val autism">{stats.autismCount}</span>
          <span className="stat-lbl">Autism</span>
        </div>
        <div className="stat-cell">
          <span className="stat-val normal">{stats.normalCount}</span>
          <span className="stat-lbl">Normal</span>
        </div>
        <div className="stat-cell">
          <span className="stat-val total">{stats.frameCount}</span>
          <span className="stat-lbl">Total</span>
        </div>
      </div>

      {/* Controls */}
      <div className="controls">
        <button
          className="ctrl-btn primary"
          onClick={onStart}
          disabled={isCameraOn}
        >
          ▶ START
        </button>
        <button
          className="ctrl-btn danger"
          onClick={onStop}
          disabled={!isCameraOn}
        >
          ■ STOP
        </button>
        <button className="ctrl-btn" onClick={onClear}>
          CLEAR
        </button>
      </div>
    </div>
  );
}
// import EmotionGrid from './EmotionGrid';
// import DetectionLog from './DetectionLog';
// import type { PredictionResult, HistoryItem, SessionStats } from '@/types';
// import { DEFAULT_EMOTIONS } from '@/lib/constants';

// interface SidePanelProps {
//   result: PredictionResult | null;
//   history: HistoryItem[];
//   stats: SessionStats;
//   isConnected: boolean;
//   connText: string;
//   isCameraOn: boolean;
//   onStart: () => void;
//   onStop: () => void;
//   onClear: () => void;
// }

// export default function SidePanel({
//   result,
//   history,
//   stats,
//   isConnected,
//   connText,
//   isCameraOn,
//   onStart,
//   onStop,
//   onClear,
// }: SidePanelProps) {
//   const badgeClass = result
//     ? result.isAutism
//       ? 'result-badge autism'
//       : 'result-badge normal'
//     : 'result-badge idle';

//   const badgeLabel = result
//     ? `● ${result.isAutism ? 'AUTISM' : 'NOT AUTISM'}`
//     : '● AWAITING INPUT';

//   const conf = result
//     ? Math.round(Math.max(result.autismProb, result.normalProb) * 100)
//     : null;

//   return (
//     <div className="side-panel">
//       {/* Result badge */}
//       <div className="side-section result-main">
//         <div className={badgeClass}>{badgeLabel}</div>
//         {conf !== null && (
//           <div className="result-confidence">
//             confidence <span>{conf}%</span>
//           </div>
//         )}
//       </div>

//       {/* Emotion grid */}
//       <div className="side-section">
//         <div className="section-label">emotion analysis</div>
//         <EmotionGrid result={result} defaultEmotions={DEFAULT_EMOTIONS} />
//       </div>

//       {/* Detection log */}
//       <div className="side-section" style={{ flex: 1 }}>
//         <div className="section-label">detection log</div>
//         <DetectionLog items={history} />
//       </div>

//       {/* Models + connection */}
//       <div className="side-section">
//         <div className="section-label">models</div>
//         <div className="model-cards">
//           <div className="model-card">
//             <span className="model-name">autism_model (ResNet-34 KFold)</span>
//             <span className="model-tag ok">LOADED</span>
//           </div>
//           <div className="model-card">
//             <span className="model-name">autism_emotion (EffNet-B0 6cls)</span>
//             <span className="model-tag ok">LOADED</span>
//           </div>
//           <div className="model-card">
//             <span className="model-name">kdef_model (EffNet-B0 7cls)</span>
//             <span className="model-tag ok">LOADED</span>
//           </div>
//         </div>
//         <div className="conn-row" style={{ marginTop: 12 }}>
//           <div className={`conn-dot ${isConnected ? 'connected' : ''}`} />
//           <span>{connText}</span>
//         </div>
//       </div>

//       {/* Stats */}
//       <div className="stats-row">
//         <div className="stat-cell">
//           <span className="stat-val autism">{stats.autismCount}</span>
//           <span className="stat-lbl">Autism</span>
//         </div>
//         <div className="stat-cell">
//           <span className="stat-val normal">{stats.normalCount}</span>
//           <span className="stat-lbl">Normal</span>
//         </div>
//         <div className="stat-cell">
//           <span className="stat-val total">{stats.frameCount}</span>
//           <span className="stat-lbl">Total</span>
//         </div>
//       </div>

//       {/* Controls */}
//       <div className="controls">
//         <button
//           className="ctrl-btn primary"
//           onClick={onStart}
//           disabled={isCameraOn}
//         >
//           ▶ START
//         </button>
//         <button
//           className="ctrl-btn danger"
//           onClick={onStop}
//           disabled={!isCameraOn}
//         >
//           ■ STOP
//         </button>
//         <button className="ctrl-btn" onClick={onClear}>
//           CLEAR
//         </button>
//       </div>
//     </div>
//   );
// }
