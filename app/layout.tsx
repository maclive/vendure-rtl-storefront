import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import CartDrawer from '@/components/cart/CartDrawer'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://souq-adko.com'),
  title: {
    default: 'سوق إدكو — تسوق الأحدث بأفضل الأسعار',
    template: '%s | سوق إدكو',
  },
  description: 'سوق إدكو — متجرك الإلكتروني للملابس والإلكترونيات والعطور والمنتجات المتنوعة. شحن سريع لكل أنحاء مصر، أسعار منافسة، دفع آمن.',
  keywords: ['سوق إدكو', 'تسوق اونلاين', 'ملابس', 'إلكترونيات', 'عطور', 'مصر'],
  openGraph: {
    type: 'website',
    locale: 'ar_EG',
    siteName: 'سوق إدكو',
    title: 'سوق إدكو — تسوق الأحدث بأفضل الأسعار',
    description: 'متجرك الإلكتروني الأول — منتجات أصيلة، شحن سريع، دفع آمن',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'سوق إدكو',
    description: 'تسوق الأحدث بأفضل الأسعار',
  },
  robots: { index: true, follow: true },
  alternates: { canonical: '/' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              fontFamily: "'Cairo', sans-serif",
              direction: 'rtl',
              borderRadius: '10px',
              background: '#0f0f0f',
              color: '#fff',
              fontSize: '14px',
            },
            success: { iconTheme: { primary: '#c9933a', secondary: '#fff' } },
          }}
        />
        <Header />
        <CartDrawer />
        <main id="main-content">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
