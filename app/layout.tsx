import type {Metadata} from 'next';
import { Outfit, Manrope } from 'next/font/google';
import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Trading Maze — Trading Risk Calculator',
  description: 'Professional position sizing and risk management for Forex, Commodities and Crypto traders.',
  openGraph: {
    title: 'Trading Maze — Trading Risk Calculator',
    description: 'Professional position sizing and risk management for Forex, Commodities and Crypto traders.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Trading Maze — Trading Risk Calculator',
    description: 'Professional position sizing and risk management for Forex, Commodities and Crypto traders.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${outfit.variable} ${manrope.variable} font-body bg-[#090808] text-[#FDFBF7] antialiased selection:bg-[#D4AF37]/30`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
