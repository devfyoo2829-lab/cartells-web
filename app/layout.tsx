import React from "react"
import type { Metadata, Viewport } from 'next'
import { DM_Sans, Playfair_Display, Noto_Serif_KR } from 'next/font/google'

import './globals.css'

const dmSans = DM_Sans({ 
  subsets: ['latin'],
  variable: '--font-dm-sans',
  weight: ['400', '500', '600', '700'],
})

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['400', '500', '600', '700'],
})

const notoSerifKR = Noto_Serif_KR({ 
  subsets: ['latin'],
  variable: '--font-noto-serif-kr',
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'Cartells | AI 기반 자동차 정밀 감정 서비스',
  description: '등록원부, 사고이력, 주행거리를 종합 분석하여 정확한 차량 가치를 산정합니다.',
}

export const viewport: Viewport = {
  themeColor: '#FAF9F7',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <body className={`${dmSans.variable} ${playfair.variable} ${notoSerifKR.variable} font-sans antialiased`}>{children}</body>
    </html>
  )
}
