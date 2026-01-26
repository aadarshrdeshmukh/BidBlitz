import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'
import InteractiveAura from '@/components/InteractiveAura'
import { Providers } from '@/components/Providers'

export const metadata: Metadata = {
  title: 'BidBlitz | The Future of Elite Bidding',
  description: 'Experience the thrill of live real-time auctions with professional-grade security.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#8b5cf6" />
      </head>
      <body>
        <Providers>
          <InteractiveAura />
          <Header />
          <main style={{ minHeight: '100vh' }}>
            {children}
          </main>
        </Providers>
      </body>
    </html>
  )
}
