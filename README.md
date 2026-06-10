# MBSTU Vision — Next.js + TypeScript

Real-time autism and emotion detection GUI built with Next.js 14 (App Router) + TypeScript.

## Project Structure

```
mbstu-vision/
├── app/
│   ├── globals.css        # All CSS (same design as original HTML)
│   ├── layout.tsx         # Root layout + metadata
│   └── page.tsx           # Entry page (server component)
├── components/
│   ├── MBSTUVisionClient.tsx  # Main client component (state hub)
│   ├── Header.tsx             # Top bar with logo + live status
│   ├── URLBanner.tsx          # Colab URL input + connect
│   ├── SidePanel.tsx          # Right sidebar
│   ├── EmotionGrid.tsx        # 2-col emotion tiles
│   └── DetectionLog.tsx       # Scrollable history log
├── hooks/
│   ├── useCamera.ts       # Webcam start/stop
│   └── useInference.ts    # Inference loop, FPS, stats, history
├── lib/
│   ├── api.ts             # fetchHealth / fetchPrediction
│   ├── canvas.ts          # drawFaceBox / captureFrame
│   └── constants.ts       # EMOTION_COLORS, intervals, etc.
└── types/
    └── index.ts           # Shared TypeScript interfaces
```

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Usage

1. Start your Colab backend (Flask server exposing `/health` and `/predict`).
2. Paste the Cloudflare tunnel URL in the **Colab URL** bar and click **CONNECT**.
3. Click **▶ START** to open your webcam and begin real-time inference.

## Backend API

Your Colab server must expose:

### `GET /health`
```json
{ "status": "ok", "device": "cuda", "model": "ResNet34" }
```

### `POST /predict`
Request:
```json
{ "frame": "<base64 jpeg data URL>" }
```
Response:
```json
{
  "isAutism": true,
  "autismProb": 0.87,
  "normalProb": 0.13,
  "topEmotion": "happy",
  "emotions": ["angry", "fear", "happy", "neutral", "sad", "surprise"],
  "emotionProbs": [0.02, 0.01, 0.85, 0.05, 0.04, 0.03],
  "faceDetected": true
}
```
