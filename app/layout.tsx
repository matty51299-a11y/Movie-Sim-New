import type { Metadata } from 'next';

import './globals.css';

export const metadata: Metadata = {
  title: 'Movie Studio Sim - Milestone 1',
  description: 'Milestone 1 foundation for a browser-based movie studio management sim.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
