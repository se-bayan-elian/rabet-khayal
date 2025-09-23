"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Mail,
  Loader2,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Timer,
  Sparkles
} from 'lucide-react';
import { useAuthActions } from '@/lib/auth-actions';
import { toast } from 'sonner';
import { loginWithEmail } from '@/services/auth';

export default function VerifyOtpPage() {
  const t = useTranslations('auth.verify');
  const router = useRouter();
  const searchParams = useSearchParams();
  const { verifyOtp } = useAuthActions();
  const [isLoading, setIsLoading] = useState(false);

  const email = searchParams.get('email') || '';
  const type = searchParams.get('type') || 'login'; // 'login' or 'register'
  const returnUrl = searchParams.get('callback') || searchParams.get('returnUrl') || '/';

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(300); // 5 minutes
  const [canResend, setCanResend] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState('');

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Redirect if no email provided
  useEffect(() => {
    if (!email) {
      router.push('/login');
    }
  }, [email, router]);

  // Timer countdown
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only allow single digit

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all fields are filled
    if (newOtp.every(digit => digit !== '') && newOtp.join('').length === 6) {
      handleSubmit(newOtp.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtp = Array(6).fill('').map((_, i) => pastedData[i] || '');
    setOtp(newOtp);

    if (pastedData.length === 6) {
      handleSubmit(pastedData);
    }
  };

  const handleSubmit = async (otpCode?: string) => {
    const code = otpCode || otp.join('');

    if (code.length !== 6) {
      setError(t('errors.invalidLength'));
      return;
    }

    try {
      setIsLoading(true);
      await verifyOtp(email, code, type as 'register' | 'login', returnUrl);
      // Redirect is handled in auth actions
    } catch (error: any) {
      console.log('from verify otp page');
      console.log(error);
      setError(error.message || t('errors.invalidCode'));
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setIsResending(true);
      await loginWithEmail({ email });
      setTimer(300);
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
      setError('');
      toast.success(t('resend.success'));
      inputRefs.current[0]?.focus();
    } catch (error: any) {
      toast.error(error.message || t('resend.error'));
    } finally {
      setIsResending(false);
    }
  };

  const isOtpComplete = otp.every(digit => digit !== '');

  return (
    <div className="min-h-screen pt-20 pb-12" style={{ background: 'var(--brand-bg)' }}>
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Left Side - Instructions */}
          <div className="hidden lg:flex flex-col justify-center px-8">
            <div className="max-w-lg">

              <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6 brand-heading">
                {t('instructions.title')}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                {t('instructions.subtitle')}
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                    <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-gray-800 dark:text-gray-100 font-semibold mb-1">{t('instructions.step1.title')}</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">{t('instructions.step1.description')}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
                    <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-gray-800 dark:text-gray-100 font-semibold mb-1">{t('instructions.step2.title')}</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">{t('instructions.step2.description')}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
                    <Timer className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-gray-800 dark:text-gray-100 font-semibold mb-1">{t('instructions.step3.title')}</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">{t('instructions.step3.description')}</p>
                  </div>
                </div>
              </div>

              {/* Help Text */}
              <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
                <h3 className="text-sm font-medium text-blue-900 dark:text-blue-200 mb-3">
                  {t('help.title')}
                </h3>
                <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 dark:text-blue-400 mt-1">•</span>
                    <span>{t('help.checkSpam')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 dark:text-blue-400 mt-1">•</span>
                    <span>{t('help.checkEmail')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 dark:text-blue-400 mt-1">•</span>
                    <span>{t('help.wait')}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right Side - Verification Form */}
          <div className="flex items-center justify-center">
            <div className="max-w-md w-full">

              <Card className="shadow-2xl border-0 dark:bg-gray-800 dark:border-gray-700">
                <CardHeader className="text-center pb-6">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center shadow-lg"
                    style={{ background: 'linear-gradient(135deg, var(--brand-gold), var(--brand-navy))' }}>
                    {isLoading ? (
                      <Loader2 className="w-8 h-8 text-white animate-spin" />
                    ) : (
                      <Mail className="w-8 h-8 text-white" />
                    )}
                  </div>
                  <CardTitle className="text-2xl brand-heading">{t('title')}</CardTitle>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">
                    {type === 'register' ? t('subtitle.register') : t('subtitle.login')}
                  </p>
                  <div className="flex items-center justify-center gap-2 mt-2 text-sm text-gray-500 dark:text-gray-400">
                    <Mail className="w-4 h-4" />
                    <span className="break-all">{email}</span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* OTP Input */}
                  <div>
                    <div dir="ltr" className="flex justify-center gap-3 mb-4">
                      {otp.map((digit, index) => (
                        <Input
                          key={index}
                          ref={el => { inputRefs.current[index] = el; }}
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          maxLength={1}
                          value={digit}
                          onChange={e => handleOtpChange(index, e.target.value)}
                          onKeyDown={e => handleKeyDown(index, e)}
                          onPaste={handlePaste}
                          className="w-12 h-12 text-center text-xl font-bold border-2 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:focus:border-brand-gold"
                          disabled={isLoading}
                        />
                      ))}
                    </div>

                    {error && (
                      <Alert variant="destructive" className="mb-4">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}
                  </div>

                  {/* Timer */}
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <Timer className="w-4 h-4" />
                      <span>{t('codeExpires')} {formatTime(timer)}</span>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    onClick={() => handleSubmit()}
                    className="w-full btn-primary h-12 text-base"
                    disabled={!isOtpComplete || isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        {t('verifying')}
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5 mr-2" />
                        {t('verify')}
                      </>
                    )}
                  </Button>

                  {/* Resend Code */}
                  <div className="text-center space-y-4">
                    <p className="text-sm text-gray-600 dark:text-gray-300">{t('didntReceive')}</p>

                    <Button
                      variant="outline"
                      onClick={handleResend}
                      disabled={!canResend || isResending}
                      className="w-full h-12 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      {isResending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          {t('resend.sending')}
                        </>
                      ) : (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2" />
                          {canResend ? t('resend.button') : t('resend.waitTimer', { time: formatTime(timer) })}
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Navigation Links */}
                  <div className="text-center space-y-2 pt-4 border-t dark:border-gray-600">
                    <Button
                      variant="ghost"
                      onClick={() => router.push(type === 'register' ? '/register' : '/login')}
                      className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2 rtl:hidden" />
                      <ArrowRight className="w-4 h-4 ml-2 ltr:hidden" />
                      {t('changeEmail')}
                    </Button>

                    <div>
                      <Button
                        variant="ghost"
                        onClick={() => router.push('/')}
                        className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                      >
                        {t('backToHome')}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Mobile Help Text */}
              <div className="lg:hidden mt-6 text-center">
                <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                    {t('help.title')}
                  </h3>
                  <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                    <li>• {t('help.checkSpam')}</li>
                    <li>• {t('help.checkEmail')}</li>
                    <li>• {t('help.wait')}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
