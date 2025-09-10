"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Mail,
  Loader2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Shield,
  Clock,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { GoogleSignInButton } from '@/components/ui/google-signin-button';
import { toast } from 'sonner';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const t = useTranslations('auth.login');
  const tCommon = useTranslations('common');
  const router = useRouter();
  const { login, isLoading, isAuthenticated } = useAuth();
  const [emailSent, setEmailSent] = useState(false);
  const [sentEmail, setSentEmail] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email);
      setEmailSent(true);
      setSentEmail(data.email);
      // Redirect to verification page with email in query
      router.push(`/verify-otp?email=${encodeURIComponent(data.email)}&type=login`);
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
      title: t('features.fast.title'),
      description: t('features.fast.description'),
    },
    {
      icon: CheckCircle,
      title: t('features.verified.title'),
      description: t('features.verified.description'),
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
                {t('emailSent.description')} <strong>{sentEmail}</strong>
              </p>
              <Button
                onClick={() => router.push(`/verify-otp?email=${encodeURIComponent(sentEmail)}&type=login`)}
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
        <div className="hidden lg:flex flex-col justify-center px-12 py-24" style={{ background: 'linear-gradient(135deg, var(--brand-navy), var(--brand-gold))' }}>
          <div className="max-w-lg">

            <h2 className="text-4xl font-bold text-white mb-6 brand-heading">
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

        {/* Right Side - Login Form */}
        <div className="flex items-center justify-center px-4 pt-36 pb-12">
          <div className="max-w-md w-full">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center shadow-lg"
                style={{ background: 'linear-gradient(135deg, var(--brand-gold), var(--brand-navy))' }}>
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold brand-heading">ربط الخيال</h1>
              <p className="text-gray-600 text-sm">Link of Imagination</p>
            </div>

            <Card className="shadow-2xl border-0">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl brand-heading">{t('title')}</CardTitle>
                <p className="text-gray-600 mt-2">{t('subtitle')}</p>
              </CardHeader>

              <CardContent className="space-y-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

                  <Button
                    type="submit"
                    className="w-full btn-primary h-12 text-base"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        {t('form.sending')}
                      </>
                    ) : (
                      <>
                        {t('form.sendCode')}
                        <ArrowRight className="w-5 h-5 ml-2 rtl:hidden" />
                        <ArrowLeft className="w-5 h-5 mr-2 ltr:hidden" />
                      </>
                    )}
                  </Button>
                </form>

                <div className="relative">
                  <Separator className="my-6" />
                  <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-sm text-gray-500">
                    {t('or')}
                  </span>
                </div>

                {/* Google Sign In */}
                <GoogleSignInButton
                  text={t('form.googleSignIn')}
                  className="h-12 text-base"
                />

                <div className="text-center space-y-2">
                  <p className="text-sm text-gray-600">
                    {t('noAccount')}{' '}
                    <Link href="/register" className="font-semibold text-blue-600 hover:text-blue-500">
                      {t('signUp')}
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
