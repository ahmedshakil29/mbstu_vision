import type { HealthResponse, PredictionResult } from '@/types';

export async function fetchHealth(backendUrl: string): Promise<HealthResponse> {
  const res = await fetch(`${backendUrl}/health`);
  if (!res.ok) throw new Error('bad status');
  const data: HealthResponse = await res.json();
  if (data.status !== 'ok') throw new Error('bad status');
  return data;
}

export async function fetchPrediction(
  backendUrl: string,
  frame: string
): Promise<PredictionResult> {
  const res = await fetch(`${backendUrl}/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ frame }),
  });
  if (!res.ok) throw new Error('predict failed');
  return res.json() as Promise<PredictionResult>;
}
