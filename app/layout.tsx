import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SocialClubsMaps - Directorio de Clubs Sociales de Cannabis en España',
  description: 'Descubre y conecta con los mejores clubs sociales de cannabis en España. Plataforma verificada para una cultura cannábica responsable.',
  keywords: 'cannabis, clubs sociales, España, Madrid, marihuana, comunidad',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
