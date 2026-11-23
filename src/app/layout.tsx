import type { Metadata, Viewport } from 'next'
import { Changa_One, Google_Sans_Flex } from 'next/font/google'

import { siteConfig } from '@/config/site'

import './globals.css'

const googleSansFlex = Google_Sans_Flex({
  subsets: ['latin'],
  variable: '--font-google-sans-flex',
  display: 'swap',
  axes: ['opsz'],
  fallback: ['system-ui', 'sans-serif'],
})

const changaOne = Changa_One({
  subsets: ['latin'],
  variable: '--font-changa-one',
  display: 'swap',
  weight: '400',
  style: ['normal', 'italic'],
  fallback: ['system-ui', 'sans-serif'],
})

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: '%s · AKAR',
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: 'Hutan mangrove hijau di tepi perairan dengan langit biru',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
}

export const viewport: Viewport = {
  themeColor: '#2B3A2D',
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="id"
      data-scroll-behavior="smooth"
      className={`${googleSansFlex.variable} ${changaOne.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  )
}
