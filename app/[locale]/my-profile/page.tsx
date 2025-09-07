"use client";

import { useState, useEffect } from 'react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Settings,
  Bell,
  Globe,
  CreditCard,
  Shield,
  Eye,
  EyeOff,
  Save,
  Edit,
  Camera,
  Loader2,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { UpdateProfileRequest } from '@/types/auth';
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

  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm<ProfileFormData>({
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
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
          <div className="section-container">
          <div className="max-w-4xl mx-auto">
            <Skeleton className="h-32 w-full mb-8" />
            <div className="grid md:grid-cols-4 gap-6">
              <Skeleton className="h-96 md:col-span-1" />
              <Skeleton className="h-96 md:col-span-3" />
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
    <div className="min-h-screen bg-gray-50 py-8">
        <div className="section-container">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="bg-white rounded-2xl p-6 mb-8 shadow-lg">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={user.avatar} alt={user.firstName} />
                  <AvatarFallback className="text-xl">
                    {user.firstName[0]}{user.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                        <Button
                          size="sm"
                  className="absolute bottom-0 right-0 rounded-full w-8 h-8 p-0"
                  onClick={() => {/* TODO: Implement avatar upload */ }}
                        >
                          <Camera className="w-4 h-4" />
                </Button>
              </div>

              <div className="text-center md:text-left flex-1">
                <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
                  {!isEditing && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      {t('editProfile')}
                        </Button>
                      )}
                    </div>

                    <h3 className="text-xl font-semibold brand-heading">
                      {user.firstName} {user.lastName}
                    </h3>
                    <p className="text-gray-600 mb-4">{user.email}</p>

                <div className="flex justify-center md:justify-start gap-2 mb-4">
                  {user.isVerified ? (
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          {t('verified')}
                        </Badge>
                      ) : (
                        <Badge variant="destructive">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          {t('unverified')}
                        </Badge>
                      )}
                      <Badge variant="outline">
                        {t(`role.${user.role}`)}
                      </Badge>
                    </div>
              </div>
                    </div>
                  </div>

          <div className="grid md:grid-cols-4 gap-6">
            {/* Sidebar Navigation */}
            <div className="md:col-span-1">
              <Card>
                <CardContent className="p-0">
                  <nav className="space-y-1">
                    {[
                      { id: 'personal', label: t('personalInfo'), icon: User },
                      { id: 'address', label: t('addressInfo'), icon: MapPin },
                      { id: 'preferences', label: t('preferences'), icon: Settings },
                      { id: 'security', label: t('security'), icon: Shield }
                    ].map((tab) => {
                      const Icon = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${activeTab === tab.id
                              ? 'bg-brand-gold/10 text-brand-navy border-r-2 border-brand-gold'
                              : 'text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                          <Icon className="w-4 h-4" />
                          {tab.label}
                        </button>
                      );
                    })}
                  </nav>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="md:col-span-3">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Personal Info Tab */}
                {activeTab === 'personal' && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User className="w-5 h-5" />
                        {t('personalInfo')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName">{t('firstName')}</Label>
                          <Input
                            id="firstName"
                            {...register('firstName')}
                            disabled={!isEditing}
                            className="mt-1"
                          />
                          {errors.firstName && (
                            <p className="text-sm text-red-600 mt-1">
                              {errors.firstName.message}
                            </p>
                          )}
                        </div>
                        <div>
                          <Label htmlFor="lastName">{t('lastName')}</Label>
                          <Input
                            id="lastName"
                            {...register('lastName')}
                            disabled={!isEditing}
                            className="mt-1"
                          />
                          {errors.lastName && (
                            <p className="text-sm text-red-600 mt-1">
                              {errors.lastName.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email">{t('email')}</Label>
                        <Input
                          id="email"
                            type="email"
                          value={user.email}
                          disabled
                          className="mt-1 bg-gray-50"
                        />
                          <p className="text-xs text-gray-500 mt-1">
                            {t('emailNotEditable')}
                          </p>
                      </div>
                      <div>
                          <Label htmlFor="phoneNumber">{t('phoneNumber')}</Label>
                        <Input
                          id="phoneNumber"
                          {...register('phoneNumber')}
                          disabled={!isEditing}
                          className="mt-1"
                        />
                      </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Address Tab */}
                {activeTab === 'address' && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="w-5 h-5" />
                        {t('addressInfo')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="address">{t('address')}</Label>
                        <Textarea
                          id="address"
                          {...register('address')}
                          disabled={!isEditing}
                          className="mt-1"
                          placeholder={t('addressPlaceholder')}
                          rows={3}
                        />
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Preferences Tab - Coming Soon */}
                {activeTab === 'preferences' && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Settings className="w-5 h-5" />
                        {t('preferences')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center py-12">
                      <Settings className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                      <h3 className="text-lg font-semibold text-gray-600 mb-2">
                        {t('comingSoon')}
                      </h3>
                      <p className="text-gray-500">
                        {t('preferencesComingSoonDesc')}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Security Tab - Coming Soon */}
                {activeTab === 'security' && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="w-5 h-5" />
                        {t('security')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center py-12">
                      <Shield className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                      <h3 className="text-lg font-semibold text-gray-600 mb-2">
                        {t('comingSoon')}
                      </h3>
                      <p className="text-gray-500">
                        {t('securityComingSoonDesc')}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Action Buttons */}
                {isEditing && (
                  <div className="flex gap-4">
                    <Button
                      type="submit"
                      className="btn-primary"
                      disabled={isUpdating}
                    >
                      {isUpdating ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          {t('updating')}
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
                      disabled={isUpdating}
                    >
                      {t('cancel')}
                    </Button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}