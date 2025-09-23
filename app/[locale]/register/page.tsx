"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Mail,
  User,
  Phone,
  Loader2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  UserPlus,
  Shield,
  Clock,
  CheckCircle
} from 'lucide-react';
import { useAuthActions } from '@/lib/auth-actions';
import { useAuth } from '@/hooks/use-profile';
import { GoogleSignInButton } from '@/components/ui/google-signin-button';
import { toast } from 'sonner';

const registerSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phoneNumber: z.string().min(1, 'Phone number is required'), // Required in backend
  agreeTerms: z.boolean().refine(val => val === true, 'You must agree to the terms and conditions'),
  agreeMarketing: z.boolean().optional(),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const t = useTranslations('auth.register');
  const tCommon = useTranslations('common');
  const router = useRouter();
  const { register: registerUser } = useAuthActions();
  const { isAuthenticated, isLoading } = useAuth();
  const [emailSent, setEmailSent] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  const { register, handleSubmit, control, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      agreeTerms: false,
      agreeMarketing: false,
    },
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const { agreeTerms, agreeMarketing, ...registerData } = data;
      await registerUser(registerData);
      setEmailSent(true);
      setUserData(registerData);
      // Redirect to verification page with email in query
      router.push(`/verify-otp?email=${encodeURIComponent(data.email)}&type=register`);
    } catch (error) {
      // Error is handled by the auth context
    }
  };

  const features = [
    {
      icon: Shield,
      title: t('features.security.title'),
      description: t('features.security.description'),
    },
    {
      icon: Clock,
      title: t('features.easy.title'),
      description: t('features.easy.description'),
    },
    {
      icon: CheckCircle,
      title: t('features.support.title'),
      description: t('features.support.description'),
    },
  ];

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--brand-bg)' }}>
        <div className="max-w-md w-full mx-4">
          <Card className="shadow-2xl border-0">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center shadow-lg"
                style={{ background: 'linear-gradient(135deg, var(--brand-gold), var(--brand-navy))' }}>
                <Mail className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl brand-heading">{t('emailSent.title')}</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-6">
                {t('emailSent.description')} <strong>{userData?.email}</strong>
              </p>
              <Button
                onClick={() => router.push(`/verify-otp?email=${encodeURIComponent(userData?.email)}&type=register`)}
                className="w-full btn-primary"
              >
                {t('emailSent.continue')}
                <ArrowRight className="w-4 h-4 ml-2 rtl:hidden" />
                <ArrowLeft className="w-4 h-4 mr-2 ltr:hidden" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--brand-bg)' }}>
      <div className="grid lg:grid-cols-2 min-h-screen">
        {/* Left Side - Branding */}
        <div className="hidden lg:block px-12 py-28" style={{ background: 'linear-gradient(135deg, var(--brand-navy), var(--brand-gold))' }}>
          <div className="max-w-lg">

            <h2 className="text-4xl font-bold !text-white mb-6 brand-heading">
              {t('welcome.title')}
            </h2>
            <p className="text-xl text-white/90 mb-12 leading-relaxed">
              {t('welcome.subtitle')}
            </p>

            <div className="space-y-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">{feature.title}</h3>
                    <p className="text-white/80 text-sm">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Register Form */}
        <div className="flex items-center justify-center px-4 py-24">
          <div className="max-w-md w-full">

            <Card className="shadow-2xl border-0">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl brand-heading">{t('title')}</CardTitle>
                <p className="text-gray-600 mt-2">{t('subtitle')}</p>
              </CardHeader>

              <CardContent className="space-y-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  {/* Name Fields */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName" className="text-base font-medium">
                        {t('form.firstName')}
                      </Label>
                      <div className="relative mt-2">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          id="firstName"
                          placeholder={t('form.firstNamePlaceholder')}
                          className="pl-10 h-12 text-base"
                          {...register('firstName')}
                        />
                      </div>
                      {errors.firstName && (
                        <p className="text-sm text-red-500 mt-1">{errors.firstName.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="lastName" className="text-base font-medium">
                        {t('form.lastName')}
                      </Label>
                      <div className="relative mt-2">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          id="lastName"
                          placeholder={t('form.lastNamePlaceholder')}
                          className="pl-10 h-12 text-base"
                          {...register('lastName')}
                        />
                      </div>
                      {errors.lastName && (
                        <p className="text-sm text-red-500 mt-1">{errors.lastName.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <Label htmlFor="email" className="text-base font-medium">
                      {t('form.email')}
                    </Label>
                    <div className="relative mt-2">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder={t('form.emailPlaceholder')}
                        className="pl-10 h-12 text-base"
                        {...register('email')}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
                    )}
                  </div>

                  {/* Phone (Required) */}
                  <div>
                    <Label htmlFor="phoneNumber" className="text-base font-medium">
                      {t('form.phone')} *
                    </Label>
                    <div className="relative mt-2">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="phoneNumber"
                        type="tel"
                        placeholder={t('form.phonePlaceholder')}
                        className="pl-10 h-12 text-base"
                        {...register('phoneNumber')}
                      />
                    </div>
                    {errors.phoneNumber && (
                      <p className="text-sm text-red-500 mt-1">{errors.phoneNumber.message}</p>
                    )}
                  </div>

                  {/* Terms Agreement */}
                  <div className="space-y-3">
                    <div className="flex items-start space-x-2 rtl:space-x-reverse">
                      <Controller
                        name="agreeTerms"
                        control={control}
                        render={({ field }) => (
                          <Checkbox
                            id="agreeTerms"
                            className="mt-1"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        )}
                      />
                      <Label htmlFor="agreeTerms" className="text-sm leading-relaxed">
                        {t('form.agreeTerms.start')}{' '}
                        <Link href="/terms" className="text-blue-600 hover:text-blue-500 underline">
                          {t('form.agreeTerms.terms')}
                        </Link>{' '}
                        {t('form.agreeTerms.and')}{' '}
                        <Link href="/cookies" className="text-blue-600 hover:text-blue-500 underline">
                          {t('form.agreeTerms.cookies')}
                        </Link>
                      </Label>
                    </div>
                    {errors.agreeTerms && (
                      <p className="text-sm text-red-500">{errors.agreeTerms.message}</p>
                    )}

                    <div className="flex items-start space-x-2 rtl:space-x-reverse">
                      <Controller
                        name="agreeMarketing"
                        control={control}
                        render={({ field }) => (
                          <Checkbox
                            id="agreeMarketing"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        )}
                      />
                      <Label htmlFor="agreeMarketing" className="text-sm text-gray-600">
                        {t('form.agreeMarketing')}
                      </Label>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full btn-primary h-12 text-base"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        {t('form.creating')}
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-5 h-5 mr-2" />
                        {t('form.createAccount')}
                      </>
                    )}
                  </Button>
                </form>

                <div className="relative">
                  <Separator className="my-6" />
                  <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-transparent px-4 text-sm text-gray-500 dark:text-white">
                    {t('or')}
                  </span>
                </div>

                {/* Google Sign Up */}
                <GoogleSignInButton
                  text={t('form.googleSignUp')}
                  className="h-12 text-base"
                />

                <div className="text-center space-y-2">
                  <p className="text-sm text-gray-600">
                    {t('hasAccount')}{' '}
                    <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-500">
                      {t('signIn')}
                    </Link>
                  </p>
                  <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
                    {t('backToHome')}
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
