import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MicroLecturi - Lecturi pentru BAC prin Email',
  description: 'Descoperă selecția noastră de opere literare pentru BAC și învață din mers, direct prin email. De la Epica la Lirică și Dramă, acoperim toate genurile esențiale.',
  keywords: 'BAC, bacalaureat, lecturi, română, opere literare, Eminescu, Rebreanu, Caragiale',
  openGraph: {
    title: 'MicroLecturi - Lecturi pentru BAC prin Email',
    description: 'Descoperă selecția noastră de opere literare pentru BAC și învață din mers, direct prin email.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ro">
      <body>{children}</body>
    </html>
  )
}
