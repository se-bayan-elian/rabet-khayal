import React from 'react'
import { Skeleton } from './ui/skeleton'

const CarouselSkeleton = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800">
      {/* Animated Background Elements */}
      <div className="absolute top-20 right-20 w-64 h-64 rounded-full bg-white/5 animate-pulse" />
      <div className="absolute bottom-32 left-16 w-96 h-96 rounded-full bg-yellow-400/10" style={{ animation: 'float 8s ease-in-out infinite' }} />
      <div className="absolute top-1/2 right-1/4 w-32 h-32 rounded-full bg-white/5" style={{ animation: 'pulse 4s ease-in-out infinite' }} />

      <div className="section-container px-6 relative z-10 py-12 lg:py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center px-4 lg:px-6">
          {/* Content Side Skeleton */}
          <div className="text-white space-y-6">
            {/* Badge Skeleton */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm">
              <Skeleton className="w-4 h-4 bg-white/30 rounded" />
              <Skeleton className="h-4 w-32 bg-white/30" />
            </div>

            {/* Title Skeleton */}
            <div className="space-y-4">
              <Skeleton className="h-12 w-full bg-white/20" />
              <Skeleton className="h-12 w-4/5 bg-white/20" />
              <Skeleton className="h-8 w-3/5 bg-white/20" />
            </div>

            {/* Description Skeleton */}
            <div className="space-y-2">
              <Skeleton className="h-5 w-full bg-white/20" />
              <Skeleton className="h-5 w-4/5 bg-white/20" />
              <Skeleton className="h-5 w-3/5 bg-white/20" />
            </div>

            {/* Buttons Skeleton */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Skeleton className="h-12 w-40 bg-white/20 rounded-lg" />
              <Skeleton className="h-12 w-36 bg-white/20 rounded-lg" />
            </div>

            {/* Stats Skeleton */}
            <div className="grid grid-cols-3 gap-4 pt-6">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="text-center space-y-2">
                  <Skeleton className="h-8 w-16 bg-white/20 mx-auto" />
                  <Skeleton className="h-4 w-20 bg-white/20 mx-auto" />
                </div>
              ))}
            </div>
          </div>

          {/* Visual Side Skeleton */}
          <div className="relative px-2 lg:px-0">
            <div className="relative w-full h-80 lg:h-[450px] rounded-2xl overflow-hidden bg-white/10 backdrop-blur-sm">
              <Skeleton className="w-full h-full bg-white/20" />
              {/* Floating Icon Skeleton */}
              <div className="absolute top-4 right-4 w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Skeleton className="w-6 h-6 bg-white/30 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar Skeleton */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
        <div className="h-full bg-gradient-to-r from-yellow-400 to-yellow-600 w-1/3 animate-pulse" />
      </div>
    </section>)
}

export default CarouselSkeleton