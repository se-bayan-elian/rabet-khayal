# Cloudinary Setup for Frontend

## Environment Variables Required

Add these environment variables to your `.env.local` file:

```bash
# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

## How to Get These Values:

1. **NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME**:

   - Go to your Cloudinary Dashboard
   - Find your "Cloud name" in the Account Details section

2. **NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET**:
   - Go to Settings → Upload → Upload presets
   - Create a new preset or use an existing one
   - Set signing mode to "Unsigned" for frontend uploads
   - Configure allowed formats, transformations, and folder settings

## Usage

The image upload functionality is now available for:

- Product question images (type: 'image')
- Drag & drop interface
- Automatic validation (file type, size)
- Real-time upload to Cloudinary
- Stores both URL and public_id for database

## Components

- `lib/upload.ts`: Upload utilities and validation
- `components/ui/image-upload.tsx`: Reusable drag & drop component
- Integrated in product details page for question images
