"use client";

import React, { useState, useCallback } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, X, Upload, ImageIcon } from "lucide-react";
import { uploadImageToCloudinary, validateImageFile } from "@/lib/upload";
import { useTranslations } from "next-intl";

interface ImageUploadProps {
  imageUrl?: string;
  imagePublicId?: string;
  onImageChange: (imageUrl: string, imagePublicId?: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
  folder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
}

export function ImageUpload({
  imageUrl,
  imagePublicId,
  onImageChange,
  label,
  placeholder,
  className,
  folder = "product-questions",
  disabled = false,
  required = false,
  error,
}: ImageUploadProps) {
  const t = useTranslations("productDetails.questions");
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFileSelect = useCallback(async (file: File) => {
    if (!file || disabled) return;

    // Validate file
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      // You might want to show toast or error message here
      console.error(validation.error);
      return;
    }

    setIsUploading(true);

    try {
      const result = await uploadImageToCloudinary(file, folder);
      onImageChange(result.url, result.publicId);
    } catch (error) {
      console.error("Error uploading image:", error);
      // You might want to show toast or error message here
    } finally {
      setIsUploading(false);
    }
  }, [onImageChange, folder, disabled]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);

    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect, disabled]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setDragActive(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  }, []);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const handleRemoveImage = useCallback(() => {
    if (disabled) return;
    onImageChange("", "");
  }, [onImageChange, disabled]);

  const inputId = `image-upload-${Math.random().toString(36).substring(2, 8)}`;

  return (
    <div className={className}>
      {label && (
        <Label htmlFor={inputId} className="text-sm font-medium">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}

      <div className="mt-2">
        {imageUrl ? (
          <div className="relative">
            <div className="relative h-32 w-full overflow-hidden rounded-lg border bg-gray-50">
              <Image
                src={imageUrl}
                alt="Preview"
                fill
                className="object-cover"
              />
              {!disabled && (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2 h-6 w-6 p-0"
                  onClick={handleRemoveImage}
                  disabled={isUploading}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
            {!disabled && (
              <div className="mt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById(inputId)?.click()}
                  disabled={isUploading}
                  className="text-xs"
                >
                  <Upload className="h-3 w-3 mr-1" />
                  Change Image
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div
            className={`relative h-32 w-full rounded-lg border-2 border-dashed transition-colors ${disabled
                ? "border-gray-200 bg-gray-50 cursor-not-allowed"
                : dragActive
                  ? "border-brand-gold bg-brand-gold/5"
                  : error
                    ? "border-red-300 bg-red-50"
                    : "border-gray-200 bg-gray-50 hover:border-brand-gold hover:bg-brand-gold/5 cursor-pointer"
              }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => !disabled && document.getElementById(inputId)?.click()}
          >
            <div className="flex h-full flex-col items-center justify-center p-4">
              {isUploading ? (
                <>
                  <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                  <p className="mt-1 text-xs text-gray-500">Uploading...</p>
                </>
              ) : (
                <>
                  <ImageIcon className={`h-6 w-6 ${error ? "text-red-400" : "text-gray-400"}`} />
                  <p className="mt-1 text-xs text-gray-600 text-center">
                    {disabled
                      ? "Image upload disabled"
                      : placeholder || "Drag & drop image here, or click to select"
                    }
                  </p>
                  {!disabled && (
                    <p className="text-xs text-gray-500 mt-1">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        <input
          id={inputId}
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
          className="hidden"
          disabled={isUploading || disabled}
        />

        {error && (
          <p className="text-xs text-red-600 mt-1">{error}</p>
        )}

        {imagePublicId && (
          <div className="mt-1 text-xs text-gray-500">
            ID: {imagePublicId}
          </div>
        )}
      </div>
    </div>
  );
}
