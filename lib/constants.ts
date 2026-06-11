export const EMOTION_COLORS: Record<string, string> = {
  angry: '#f05a5a',
  fear: '#c07af5',
  happy: '#f0c84a',
  neutral: '#8a95a8',
  sad: '#4a9af0',
  surprise: '#f07a2a',
  surprised: '#f07a2a',
  afraid: '#c07af5',
  disgusted: '#6adb6a',
};

export const DEFAULT_EMOTIONS = ['angry', 'fear', 'happy', 'neutral', 'sad', 'surprise'];

export const INFERENCE_INTERVAL_MS = 100;  // ~10 fps
export const LOG_INTERVAL_MS       = 1500;
export const MAX_HISTORY_ITEMS     = 30;
export const CAPTURE_SIZE          = 224;

// ── Smoothing: rolling average over last N frames ─────────────────────────
// Prevents single-frame misclassifications from flickering the UI.
export const SMOOTH_WINDOW    = 8;     // number of frames to average
export const AUTISM_THRESHOLD = 0.60;  // averaged prob must be ≥60% to show AUTISTIC

// export const EMOTION_COLORS: Record<string, string> = {
//   angry: '#f05a5a',
//   fear: '#c07af5',
//   happy: '#f0c84a',
//   neutral: '#8a95a8',
//   sad: '#4a9af0',
//   surprise: '#f07a2a',
//   surprised: '#f07a2a',
//   afraid: '#c07af5',
//   disgusted: '#6adb6a',
// };

// export const DEFAULT_EMOTIONS = ['angry', 'fear', 'happy', 'neutral', 'sad', 'surprise'];

// export const INFERENCE_INTERVAL_MS = 100; // ~10 fps
// export const LOG_INTERVAL_MS = 1500;
// export const MAX_HISTORY_ITEMS = 30;
// export const CAPTURE_SIZE = 224;
