import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'PolyGrok - Professor IA de Idiomas',
  description: 'Aprenda idiomas com um professor IA paciente e nativo. Conversação em tempo real com feedback imediato.',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.svg',
    apple: '/icon.svg',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'PolyGrok',
  },
  openGraph: {
    title: 'PolyGrok - Professor IA',
    description: 'Aprenda idiomas com IA',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#7c3aed',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
