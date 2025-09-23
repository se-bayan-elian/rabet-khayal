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
import { QueryClient, dehydrate } from '@tanstack/react-query'
import { getServerProfile } from '@/lib/server-auth'
import MainLayout from "@/components/layouts/MainLayout"
import { cookies } from "next/headers"

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
  const messages = await getMessages();
  
  // Create a new QueryClient for server-side prefetching
  const queryClient = new QueryClient();
  const accessToken = (await cookies()).get('accessToken')?.value ?? "";
  // Fetch profile data on server-side for hydration
  const initialProfile = await getServerProfile(accessToken);
  // Prefetch profile data if we have a profile
  if (initialProfile) {
    queryClient.setQueryData(['profile', accessToken],  initialProfile);
  }

  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="icon" href="/m-logo.png" />
      </head>
      <body className={tajawal.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange={false}>
          <NextIntlClientProvider messages={messages}>
            <QueryProvider initialData={dehydrate(queryClient)}>
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
            </QueryProvider>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
