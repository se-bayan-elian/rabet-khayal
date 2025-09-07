/**
 * Uploads an image file to Cloudinary
 * Returns the public_id and secure_url
 */
export async function uploadImageToCloudinary(
  file: File,
  folder?: string
): Promise<{ url: string; publicId: string }> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error("Cloudinary configuration is missing");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  if (folder) {
    formData.append("folder", folder);
  }

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error(`Upload failed: ${response.statusText}`);
  }

  const data = await response.json();

  if (!data.secure_url || !data.public_id) {
    throw new Error("Cloudinary upload failed - invalid response");
  }

  return {
    url: data.secure_url,
    publicId: data.public_id,
  };
}

/**
 * Validates an image file before upload
 */
export function validateImageFile(file: File): {
  isValid: boolean;
  error?: string;
} {
  // Check file type
  if (!file.type.startsWith("image/")) {
    return { isValid: false, error: "Please select an image file only" };
  }

  // Check file size (10MB max)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: `File size must be less than ${Math.round(
        maxSize / 1024 / 1024
      )}MB`,
    };
  }

  return { isValid: true };
}

/**
 * Generates a unique filename with timestamp
 */
export function generateUniqueFileName(originalName: string): string {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 8);
  const extension = originalName.split(".").pop();
  return `${timestamp}_${randomStr}.${extension}`;
}
