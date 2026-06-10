import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MBSTU Vision — Autism & Emotion Detection',
  description: 'Real-time autism and emotion detection using webcam and deep learning.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
