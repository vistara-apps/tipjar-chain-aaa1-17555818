
import '@coinbase/onchainkit/styles.css';
import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Providers } from './providers';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'TipJar Chain',
  description: 'Get paid directly by your fans, instantly, on-chain.',
  other: {
    'fc:frame': JSON.stringify({
      version: 'next',
      imageUrl: `${process.env.NEXT_PUBLIC_URL}/api/og`,
      button: {
        title: 'Launch TipJar Chain',
        action: {
          type: 'launch_frame',
          name: 'TipJar Chain',
          url: process.env.NEXT_PUBLIC_URL,
          splashImageUrl: `${process.env.NEXT_PUBLIC_URL}/splash.png`,
          splashBackgroundColor: '#1e1b31',
        },
      },
    }),
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-bg">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
