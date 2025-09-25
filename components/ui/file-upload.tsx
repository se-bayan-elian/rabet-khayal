"use client";

import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, X, Upload, FileIcon, Download } from "lucide-react";
import { uploadFileToCloudinary, validateFile } from "@/lib/upload";
import { useTranslations } from "next-intl";

interface FileUploadProps {
  fileUrl?: string;
  filePublicId?: string;
  onFileChange: (fileUrl: string, filePublicId?: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
  folder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
}

export function FileUpload({
  fileUrl,
  filePublicId,
  onFileChange,
  label,
  placeholder,
  className,
  folder = "product-question-files",
  disabled = false,
  required = false,
  error,
}: FileUploadProps) {
  const t = useTranslations("productDetails.questions");
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFileSelect = useCallback(async (file: File) => {
    if (!file || disabled) return;

    // Validate file
    const validation = validateFile(file);
    if (!validation.isValid) {
      // You might want to show toast or error message here
      console.error(validation.error);
      return;
    }

    setIsUploading(true);

    try {
      const result = await uploadFileToCloudinary(file, folder);
      onFileChange(result.url, result.publicId);
    } catch (error) {
      console.error("Error uploading file:", error);
      // You might want to show toast or error message here
    } finally {
      setIsUploading(false);
    }
  }, [onFileChange, folder, disabled]);

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

  const handleRemoveFile = useCallback(() => {
    if (disabled) return;
    onFileChange("", "");
  }, [onFileChange, disabled]);

  const getFileName = (url: string) => {
    const parts = url.split('/');
    return parts[parts.length - 1] || 'file';
  };

  const getFileExtension = (url: string) => {
    const fileName = getFileName(url);
    return fileName.split('.').pop()?.toUpperCase() || '';
  };

  const inputId = `file-upload-${Math.random().toString(36).substring(2, 8)}`;

  return (
    <div className={className}>
      {label && (
        <Label htmlFor={inputId} className="text-sm font-medium">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}

      <div className="mt-2">
        {fileUrl ? (
          <div className="relative">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 border rounded-lg bg-gray-50 gap-3 sm:gap-0">
              <div className="flex items-center space-x-3 min-w-0 flex-1">
                <div className="flex-shrink-0">
                  <FileIcon className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-900 truncate" title={getFileName(fileUrl)}>
                    {getFileName(fileUrl).length > 20 ? 
                      `${getFileName(fileUrl).substring(0, 20)}...` : 
                      getFileName(fileUrl)
                    }
                  </p>
                  <p className="text-xs text-gray-500">
                    {getFileExtension(fileUrl)} file
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(fileUrl, '_blank')}
                  className="text-xs px-2 sm:px-3"
                >
                  <Download className="h-3 w-3 sm:mr-1" />
                  <span className="hidden sm:inline">View</span>
                </Button>
                {!disabled && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={handleRemoveFile}
                    disabled={isUploading}
                    className="text-xs px-2 sm:px-3"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
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
                  Change File
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div
            className={`relative h-24 sm:h-32 w-full rounded-lg border-2 border-dashed transition-colors ${disabled
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
            <div className="flex h-full flex-col items-center justify-center p-3 sm:p-4">
              {isUploading ? (
                <>
                  <Loader2 className="h-5 w-5 sm:h-6 sm:w-6 animate-spin text-gray-400" />
                  <p className="mt-1 text-xs text-gray-500">Uploading...</p>
                </>
              ) : (
                <>
                  <FileIcon className={`h-5 w-5 sm:h-6 sm:w-6 ${error ? "text-red-400" : "text-gray-400"}`} />
                  <p className="mt-1 text-xs text-gray-600 text-center px-2">
                    {disabled
                      ? "File upload disabled"
                      : placeholder || "Drag & drop file here, or click to select"
                    }
                  </p>
                  {!disabled && (
                    <p className="text-xs text-gray-500 mt-1 text-center px-2">
                      PDF files up to 10MB
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
          accept=".pdf"
          onChange={handleFileInputChange}
          className="hidden"
          disabled={isUploading || disabled}
        />

        {error && (
          <p className="text-xs text-red-600 mt-1">{error}</p>
        )}

        {filePublicId && (
          <div className="mt-1 text-xs text-gray-500">
            ID: {filePublicId}
          </div>
        )}
      </div>
    </div>
  );
}
