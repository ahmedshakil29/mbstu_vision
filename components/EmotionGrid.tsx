import { EMOTION_COLORS } from '@/lib/constants';
import type { PredictionResult } from '@/types';

interface EmotionGridProps {
  result: PredictionResult | null;
  defaultEmotions: string[];
}

export default function EmotionGrid({ result, defaultEmotions }: EmotionGridProps) {
  const emotions = result?.emotions ?? defaultEmotions;
  const probs = result?.emotionProbs ?? emotions.map(() => 0);
  const top = result?.topEmotion ?? '';

  return (
    <div className="emotion-grid">
      {emotions.map((em, i) => {
        const pct = Math.round((probs[i] ?? 0) * 100);
        const col = EMOTION_COLORS[em] ?? '#8a95a8';
        const isActive = em === top;
        return (
          <div
            key={em}
            className={`emotion-tile ${isActive ? 'active' : ''}`}
            style={{ ['--em-col' as string]: col }}
          >
            <div className="emotion-tile-name">{em.toUpperCase()}</div>
            <div className="emotion-tile-bar">
              <div
                className="emotion-tile-fill"
                style={{ width: `${pct}%`, background: col }}
              />
            </div>
            <div className="emotion-tile-pct">{pct}%</div>
          </div>
        );
      })}
    </div>
  );
}
