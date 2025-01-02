import type { Metadata } from 'next'
 
// These styles apply to every route in the application
import './globals.css'
import { Inter } from 'next/font/google'
// If loading a variable font, you don't need to specify the font weight
const inter = Inter({ subsets: ['latin'] })
 
 
export const metadata: Metadata = {
  title: 'Atom',
  description: 'Learn',
}
 
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.className}>
      <body>{children}</body>
    </html>
  )
}