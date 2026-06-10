import type { PredictionResult } from '@/types';

export function drawFaceBox(
  canvas: HTMLCanvasElement,
  result: PredictionResult | null
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const W = canvas.width;
  const H = canvas.height;
  ctx.clearRect(0, 0, W, H);

  if (!result || !result.faceDetected) return;

  const bw = W * 0.34;
  const bh = H * 0.44;
  const x = (W - bw) / 2;
  const y = (H - bh) / 2;
  const col = result.isAutism ? '#f05a7e' : '#3de8a0';
  const len = 22;

  ctx.strokeStyle = col;
  ctx.lineWidth = 2;
  ctx.shadowColor = col;
  ctx.shadowBlur = 8;

  const corners: [number, number][] = [
    [x, y],
    [x + bw, y],
    [x, y + bh],
    [x + bw, y + bh],
  ];

  corners.forEach(([cx, cy], i) => {
    const dx = i % 2 === 0 ? 1 : -1;
    const dy = i < 2 ? 1 : -1;
    ctx.beginPath();
    ctx.moveTo(cx + dx * len, cy);
    ctx.lineTo(cx, cy);
    ctx.lineTo(cx, cy + dy * len);
    ctx.stroke();
  });

  ctx.shadowBlur = 0;
  const pct = Math.round(
    (result.isAutism ? result.autismProb : result.normalProb) * 100
  );
  ctx.font = '500 11px "Space Mono",monospace';
  ctx.fillStyle = col;
  ctx.fillText(
    `${result.isAutism ? 'AUTISM' : 'NOT AUTISM'}  ${pct}%`,
    x + 6,
    y - 8
  );
  ctx.font = '400 10px "Space Mono",monospace';
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.fillText(result.topEmotion.toUpperCase(), x + 6, y + bh + 16);
}

export function captureFrame(video: HTMLVideoElement): string {
  const c = document.createElement('canvas');
  c.width = 224;
  c.height = 224;
  c.getContext('2d')!.drawImage(video, 0, 0, 224, 224);
  return c.toDataURL('image/jpeg', 0.85);
}
