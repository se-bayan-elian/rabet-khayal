"use client"

import { useEffect } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { X, ZoomIn, ZoomOut, RotateCw, Download } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

interface FullscreenImageModalProps {
  isOpen: boolean
  onClose: () => void
  imageUrl: string
  alt: string
}

export function FullscreenImageModal({ isOpen, onClose, imageUrl, alt }: FullscreenImageModalProps) {
  const [scale, setScale] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setScale(1)
      setRotation(0)
      setPosition({ x: 0, y: 0 })
    }
  }, [isOpen])

  // Handle keyboard shortcuts
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose()
          break
        case '+':
        case '=':
          e.preventDefault()
          setScale(prev => Math.min(prev + 0.2, 3))
          break
        case '-':
          e.preventDefault()
          setScale(prev => Math.max(prev - 0.2, 0.5))
          break
        case 'r':
        case 'R':
          e.preventDefault()
          setRotation(prev => (prev + 90) % 360)
          break
        case '0':
          e.preventDefault()
          setScale(1)
          setRotation(0)
          setPosition({ x: 0, y: 0 })
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.2, 3))
  }

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.2, 0.5))
  }

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360)
  }

  const handleReset = () => {
    setScale(1)
    setRotation(0)
    setPosition({ x: 0, y: 0 })
  }

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = imageUrl
    link.download = alt || 'product-image'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true)
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? -0.1 : 0.1
    setScale(prev => Math.max(0.5, Math.min(3, prev + delta)))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-black/95 border-0">
        <div className="relative w-full h-full flex flex-col">
          {/* Header with controls */}
          <div className="flex items-center justify-between p-4 bg-black/50 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleZoomOut}
                className="text-white hover:bg-white/20"
                disabled={scale <= 0.5}
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
              <span className="text-white text-sm min-w-[60px] text-center">
                {Math.round(scale * 100)}%
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleZoomIn}
                className="text-white hover:bg-white/20"
                disabled={scale >= 3}
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRotate}
                className="text-white hover:bg-white/20"
              >
                <RotateCw className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="text-white hover:bg-white/20"
              >
                Reset
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDownload}
                className="text-white hover:bg-white/20"
              >
                <Download className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-white hover:bg-white/20"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Image container */}
          <div 
            className="flex-1 flex items-center justify-center overflow-hidden cursor-move"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
          >
            <div
              className="relative transition-transform duration-200 ease-out"
              style={{
                transform: `scale(${scale}) rotate(${rotation}deg) translate(${position.x}px, ${position.y}px)`,
                transformOrigin: 'center center'
              }}
            >
              <Image
                src={imageUrl}
                alt={alt}
                width={800}
                height={800}
                className="max-w-none object-contain"
                style={{
                  maxWidth: '80vw',
                  maxHeight: '80vh'
                }}
                priority
              />
            </div>
          </div>

          {/* Footer with instructions */}
          <div className="p-4 bg-black/50 backdrop-blur-sm">
            <div className="text-center text-white/70 text-sm">
              <p>Use mouse wheel to zoom • Drag to pan • Press R to rotate • Press 0 to reset • Press Esc to close</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
