"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  User,
  Mail,
  MapPin,
  Save,
  Edit,
  Camera,
  Loader2,
  CheckCircle,
  AlertTriangle,
  ArrowLeft,
  X
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { UpdateProfileRequest } from '@/types/auth';
import { uploadImageToCloudinary, validateImageFile } from '@/lib/upload';
import { toast } from 'sonner';

const profileSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
  avatar: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function MyProfilePage() {
  const t = useTranslations('profile');
  const router = useRouter();
  const { user, updateProfile, isLoading } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phoneNumber: user?.phoneNumber || '',
      address: user?.address || '',
      avatar: user?.avatar || '',
    },
  });

  // Update form when user data changes
  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber || '',
        address: user.address || '',
        avatar: user.avatar || '',
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: ProfileFormData) => {
    try {
      setIsUpdating(true);
      await updateProfile({
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
        address: data.address,
        avatar: data.avatar,
      });
      setIsEditing(false);
      toast.success(t('updateSuccess'));
    } catch (error) {
      toast.error(t('updateError'));
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
    setPreviewImage(null);
  };

  const handleImageUpload = async (file: File) => {
    if (!file) return;

    // Validate file
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      toast.error(validation.error || 'Invalid image file');
      return;
    }

    setIsUploadingImage(true);

    try {
      // Upload to Cloudinary
      const result = await uploadImageToCloudinary(file, 'user-avatars');
      
      // Set preview image
      setPreviewImage(result.url);
      
      // Update form with new avatar URL
      setValue('avatar', result.url);
      
      toast.success(t('imageUploadSuccess'));
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error(t('imageUploadError'));
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleRemoveImage = () => {
    setPreviewImage(null);
    setValue('avatar', '');
  };

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (isEditing && !isUploadingImage) {
      setDragActive(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    if (!isEditing || isUploadingImage) return;
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleImageUpload(files[0]);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Skeleton className="h-8 w-48 mb-8" />
            <div className="grid lg:grid-cols-3 gap-8">
              <Skeleton className="h-96 lg:col-span-1" />
              <Skeleton className="h-96 lg:col-span-2" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    router.push('/auth/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('back')}
            </Button>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('title')}</h1>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8 dark:bg-gray-800 dark:border-gray-700">
                <CardContent className="p-8">
                  <div className="text-center">
                    {/* Avatar */}
                    <div className="relative inline-block mb-6">
                      <div 
                        className={`relative rounded-full p-1 transition-all duration-200 ${
                          dragActive ? 'bg-blue-100 ring-2 ring-blue-300' : ''
                        } ${isEditing ? 'cursor-pointer' : ''}`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={isEditing ? handleCameraClick : undefined}
                      >
                        <Avatar className="w-24 h-24 mx-auto">
                          <AvatarImage 
                            src={previewImage || user.avatar} 
                            alt={user.firstName} 
                          />
                          <AvatarFallback className="text-2xl font-semibold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                            {user.firstName[0]}{user.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        
                        {/* Drag Overlay */}
                        {dragActive && (
                          <div className="absolute inset-0 rounded-full bg-blue-500/20 flex items-center justify-center">
                            <div className="text-center text-blue-600">
                              <Camera className="w-6 h-6 mx-auto mb-1" />
                              <p className="text-xs font-medium">Drop image here</p>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Camera Button */}
                      {isEditing && (
                        <Button
                          size="sm"
                          className="absolute -bottom-2 -right-2 rounded-full w-10 h-10 p-0 shadow-lg"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCameraClick();
                          }}
                          disabled={isUploadingImage}
                        >
                          {isUploadingImage ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Camera className="w-4 h-4" />
                          )}
                        </Button>
                      )}
                      
                      {/* Remove Image Button */}
                      {isEditing && (previewImage || user.avatar) && (
                        <Button
                          size="sm"
                          variant="destructive"
                          className="absolute -top-2 -right-2 rounded-full w-8 h-8 p-0 shadow-lg"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveImage();
                          }}
                          disabled={isUploadingImage}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      )}
                      
                      {/* Hidden File Input */}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileInputChange}
                        className="hidden"
                        disabled={isUploadingImage}
                      />
                    </div>
                    
                    {/* Upload Instructions */}
                    {isEditing && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                        {t('imageUploadInstructions')}
                      </p>
                    )}

                    {/* User Info */}
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {user.firstName} {user.lastName}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 flex items-center justify-center gap-2">
                      <Mail className="w-4 h-4" />
                      {user.email}
                    </p>

                    {/* Status Badges */}
                    <div className="flex flex-wrap justify-center gap-2 mb-6">
                      {user.isVerified ? (
                        <Badge className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-700">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          {t('verified')}
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="dark:bg-red-900 dark:text-red-200 dark:border-red-700">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          {t('unverified')}
                        </Badge>
                      )}
                      
                    </div>

                    {/* Edit Button */}
                    {!isEditing ? (
                      <Button
                        onClick={() => setIsEditing(true)}
                        className="w-full"
                        size="lg"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        {t('editProfile')}
                      </Button>
                    ) : (
                      <div className="space-y-2">
                        <Button
                          type="submit"
                          form="profile-form"
                          className="w-full"
                          size="lg"
                          disabled={isUpdating}
                        >
                          {isUpdating ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              {t('saving')}
                            </>
                          ) : (
                            <>
                              <Save className="w-4 h-4 mr-2" />
                              {t('saveChanges')}
                            </>
                          )}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleCancel}
                          className="w-full"
                          disabled={isUpdating}
                        >
                          {t('cancel')}
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Form Content */}
            <div className="lg:col-span-2">
              <form id="profile-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Personal Information */}
                <Card className="dark:bg-gray-800 dark:border-gray-700">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3 text-xl dark:text-white">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                        <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      {t('personalInfo')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="firstName" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {t('firstName')} *
                        </Label>
                        <Input
                          id="firstName"
                          {...register('firstName')}
                          disabled={!isEditing}
                          className={`h-11 ${!isEditing ? 'bg-gray-50 dark:bg-gray-700' : 'dark:bg-gray-700 dark:border-gray-600 dark:text-white'}`}
                          placeholder={t('firstNamePlaceholder')}
                        />
                        {errors.firstName && (
                          <p className="text-sm text-red-600">
                            {errors.firstName.message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {t('lastName')} *
                        </Label>
                        <Input
                          id="lastName"
                          {...register('lastName')}
                          disabled={!isEditing}
                          className={`h-11 ${!isEditing ? 'bg-gray-50 dark:bg-gray-700' : 'dark:bg-gray-700 dark:border-gray-600 dark:text-white'}`}
                          placeholder={t('lastNamePlaceholder')}
                        />
                        {errors.lastName && (
                          <p className="text-sm text-red-600">
                            {errors.lastName.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {t('email')}
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={user.email}
                          disabled
                          className="h-11 bg-gray-50"
                        />
                        <p className="text-xs text-gray-500">
                          {t('emailNotEditable')}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {t('phoneNumber')}
                        </Label>
                        <Input
                          id="phoneNumber"
                          {...register('phoneNumber')}
                          disabled={!isEditing}
                          className={`h-11 ${!isEditing ? 'bg-gray-50 dark:bg-gray-700' : 'dark:bg-gray-700 dark:border-gray-600 dark:text-white'}`}
                          placeholder={t('phoneNumberPlaceholder')}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Address Information */}
                <Card className="dark:bg-gray-800 dark:border-gray-700">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3 text-xl dark:text-white">
                      <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                        <MapPin className="w-5 h-5 text-green-600 dark:text-green-400" />
                      </div>
                      {t('addressInfo')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Label htmlFor="address" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t('address')}
                      </Label>
                      <Textarea
                        id="address"
                        {...register('address')}
                        disabled={!isEditing}
                        className={`min-h-[100px] ${!isEditing ? 'bg-gray-50 dark:bg-gray-700' : 'dark:bg-gray-700 dark:border-gray-600 dark:text-white'}`}
                        placeholder={t('addressPlaceholder')}
                      />
                    </div>
                  </CardContent>
                </Card>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}