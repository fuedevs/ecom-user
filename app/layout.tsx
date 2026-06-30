import './globals.css'
import { ReactNode } from 'react'

export const metadata = {
  title: 'Ecom User',
  description: 'Next.js frontend for ecom-user',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-gray-50">
          {children}
        </div>
      </body>
    </html>
  )
}
