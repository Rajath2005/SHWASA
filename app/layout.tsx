import { Analytics } from '@vercel/analytics/next'
import { Geist, Geist_Mono } from 'next/font/google'
import type { Metadata, Viewport } from 'next'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' })
import './globals.css'

export const metadata: Metadata = {
  title: 'SHWASA — Respiratory Acoustic Intelligence',
  description: 'SHWASA — Respiratory Acoustic Intelligence. An open research prototype for respiratory sound classification.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f4f5f1' },
    { media: '(prefers-color-scheme: dark)', color: '#0d2023' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" data-theme="system" data-scroll-behavior="smooth" className={`${geist.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: `(function(){try{var p=JSON.parse(localStorage.getItem('pulmo-preferences')||'null');var t=localStorage.getItem('pulmo-theme')||p?.theme||'system';var r=localStorage.getItem('pulmo-reduced-motion')==='true'||p?.reduced===true;document.documentElement.dataset.theme=t;document.documentElement.dataset.reducedMotion=String(r)}catch(e){}})()` }} /></head>
      <body className="antialiased" suppressHydrationWarning>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
