import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AppProvider } from '../context/AppContext'
import { ThemeProvider } from '../context/ThemeContext'
import { AutumnProvider } from 'autumn-js/react'
import ClientWrapper from './client-wrapper'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ClerkSmart',
  description: 'The intelligent clinical reasoning simulator',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AutumnProvider backendUrl={process.env.NEXT_PUBLIC_AUTUMN_BACKEND_URL}>
          <ThemeProvider>
            <AppProvider>
              <ClientWrapper>
                {children}
              </ClientWrapper>
            </AppProvider>
          </ThemeProvider>
        </AutumnProvider>
      </body>
    </html>
  )
} 