import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Hospital Concierge - Healthcare SaaS Platform',
  description: 'Policy-driven healthcare platform with telehealth, appointment booking, and multi-tenant support.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
