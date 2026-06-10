export interface PredictionResult {
  isAutism: boolean;
  autismProb: number;
  normalProb: number;
  topEmotion: string;
  emotions: string[];
  emotionProbs: number[];
  faceDetected: boolean;
  error?: string;
}

export interface HealthResponse {
  status: string;
  device?: string;
  model?: string;
}

export interface HistoryItem {
  id: number;
  isAutism: boolean;
  topEmotion: string;
  confidence: number;
  time: string;
}

export type URLStatus = 'ok' | 'err' | 'checking' | 'idle';

export interface SessionStats {
  autismCount: number;
  normalCount: number;
  frameCount: number;
}
