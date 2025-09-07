import type React from "react"
import type { Metadata } from "next"
import { Inter, Tajawal } from "next/font/google"
import "../globals.css"
import { NextIntlClientProvider } from "next-intl"
import { getMessages } from "next-intl/server"
import { ThemeProvider } from "@/components/layouts/theme-provider"
import { QueryProvider } from "@/components/query-provider"
import { Toaster } from "@/components/ui/toaster"
import { Toaster as SonnerToaster } from 'sonner'
import { AuthProvider } from '@/contexts/AuthContext'
import MainLayout from "@/components/layouts/MainLayout"

const tajawal = Tajawal({
  weight: ["200", "400", "500", "700"],
  subsets: ["arabic"],
})
export const metadata: Metadata = {
  title: "ربط الخيال - Rabet Alkhayal",
  description: "شركة ربط الخيال - نربط أحلامك بالواقع",
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params;
  const messages = await getMessages()

  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      <body className={tajawal.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange={false}>
          <NextIntlClientProvider messages={messages}>
            <QueryProvider>
              <AuthProvider>
                <MainLayout>
                  {children}
                </MainLayout>
                <Toaster />
                <SonnerToaster
                  position="top-right"
                  richColors
                  closeButton
                  theme="light"
                />
              </AuthProvider>
            </QueryProvider>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
