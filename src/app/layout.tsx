import type { Metadata } from 'next'
import { Inter, JetBrains_Mono, Space_Grotesk } from 'next/font/google'
import './globals.css'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
})

const spaceGrotesk = Space_Grotesk({
  variable: '--font-display',
  subsets: ['latin'],
})

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'HypeSeek — Trade culture before charts.',
  description:
    'HypeSeek is a real-time virality terminal that detects emerging narratives 1–2 hours before they hit mainstream crypto.',
  openGraph: {
    title: 'HypeSeek — Trade culture before charts.',
    description:
      'A real-time virality terminal that detects emerging narratives 1–2 hours before they hit mainstream crypto.',
    images: ['/brand/hypeseek-wordmark.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HypeSeek — Trade culture before charts.',
    description:
      'A real-time virality terminal that detects emerging narratives 1–2 hours before they hit mainstream crypto.',
    images: ['/brand/hypeseek-wordmark.jpg'],
  },
  icons: {
    icon: '/brand/hypeseek-icon.jpg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  )
}
