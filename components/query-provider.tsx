"use client"

import type React from "react"

import { QueryClient, QueryClientProvider, DehydratedState } from "@tanstack/react-query"
import { HydrationBoundary } from "@tanstack/react-query"
import { useState } from "react"

export function QueryProvider({ 
  children, 
  initialData 
}: { 
  children: React.ReactNode;
  initialData?: DehydratedState;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
          },
        },
      }),
  )

  return (
    <QueryClientProvider client={queryClient}>
      {initialData ? (
        <HydrationBoundary state={initialData}>
          {children}
        </HydrationBoundary>
      ) : (
        children
      )}
    </QueryClientProvider>
  )
}
