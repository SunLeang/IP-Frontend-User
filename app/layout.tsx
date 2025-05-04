import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { InterestProvider } from "@/context/interest-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Eventura - Discover Tailored Events",
  description: "Sign up for personalized event recommendations",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <InterestProvider>{children}</InterestProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
