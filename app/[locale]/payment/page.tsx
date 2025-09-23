'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useCartStore } from '@/store/cart-api';
import { useAuth } from '@/hooks/use-profile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CreditCard, Lock, CheckCircle, Shield } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';

interface PaymentFormData {
  name: string;
  number: string;
  expiryMonth: string;
  expiryYear: string;
  cvc: string;
}

interface PaymentFormErrors {
  name?: string;
  number?: string;
  expiryMonth?: string;
  expiryYear?: string;
  cvc?: string;
  general?: string;
}

export default function PaymentPage() {
  const t = useTranslations('payment');
  const router = useRouter();
  const { cart, createOrder } = useCartStore();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState<PaymentFormData>({
    name: '',
    number: '',
    expiryMonth: '',
    expiryYear: '',
    cvc: '',
  });
  
  const [errors, setErrors] = useState<PaymentFormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Redirect if cart is empty
  useEffect(() => {
    if (!cart.items || cart.items.length === 0) {
      router.push('/cart');
      return;
    }
  }, [cart.items, router]);

  const validateForm = (): boolean => {
    const newErrors: PaymentFormErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = t('errors.nameRequired');
    } else if (formData.name.trim().length < 2) {
      newErrors.name = t('errors.nameMinLength');
    }

    // Card number validation
    if (!formData.number.trim()) {
      newErrors.number = t('errors.cardNumberRequired');
    } else {
      const cleanNumber = formData.number.replace(/\s/g, '');
      if (!/^\d{13,19}$/.test(cleanNumber)) {
        newErrors.number = t('errors.cardNumberInvalid');
      }
    }

    // Expiry month validation
    if (!formData.expiryMonth) {
      newErrors.expiryMonth = t('errors.expiryMonthRequired');
    } else {
      const month = parseInt(formData.expiryMonth);
      if (month < 1 || month > 12) {
        newErrors.expiryMonth = t('errors.expiryMonthInvalid');
      }
    }

    // Expiry year validation
    if (!formData.expiryYear) {
      newErrors.expiryYear = t('errors.expiryYearRequired');
    } else {
      const year = parseInt(formData.expiryYear);
      const currentYear = new Date().getFullYear();
      if (year < currentYear || year > currentYear + 20) {
        newErrors.expiryYear = t('errors.expiryYearInvalid');
      }
    }

    // CVC validation
    if (!formData.cvc.trim()) {
      newErrors.cvc = t('errors.cvcRequired');
    } else if (!/^\d{3,4}$/.test(formData.cvc)) {
      newErrors.cvc = t('errors.cvcInvalid');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatCardNumber = (value: string): string => {
    const cleanValue = value.replace(/\s/g, '');
    const formattedValue = cleanValue.replace(/(.{4})/g, '$1 ').trim();
    return formattedValue.slice(0, 19); // Max 16 digits + 3 spaces
  };

  const handleInputChange = (field: keyof PaymentFormData, value: string) => {
    let processedValue = value;
    
    if (field === 'number') {
      processedValue = formatCardNumber(value);
    } else if (field === 'cvc') {
      processedValue = value.replace(/\D/g, '').slice(0, 4);
    } else if (field === 'expiryMonth' || field === 'expiryYear') {
      processedValue = value.replace(/\D/g, '');
    }

    setFormData(prev => ({
      ...prev,
      [field]: processedValue
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error(t('errors.formInvalid'));
      return;
    }

    setIsLoading(true);
    setIsProcessing(true);

    try {
      // Create Moyasar payment
      const paymentData = {
        amount: Math.round(cart.totalPrice * 100), // Convert to halalas
        currency: 'SAR',
        description: `Order payment - ${cart.items.length} items`,
        callback_url: `${window.location.origin}/payment/callback`,
        source: {
          type: 'creditcard',
          name: formData.name.trim(),
          number: formData.number.replace(/\s/g, ''),
          cvc: formData.cvc,
          month: formData.expiryMonth,
          year: formData.expiryYear,
        },
        metadata: {
          cart_id: cart.id,
          user_id: user?.id,
          items_count: cart.items.length,
        }
      };

      const response = await fetch('/api/moyasar/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || t('errors.paymentFailed'));
      }

      // Redirect to Moyasar payment page
      if (result.payment_url) {
        window.location.href = result.payment_url;
      } else {
        throw new Error(t('errors.noPaymentUrl'));
      }

    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error instanceof Error ? error.message : t('errors.paymentFailed'));
      setErrors({ general: error instanceof Error ? error.message : t('errors.paymentFailed') });
    } finally {
      setIsLoading(false);
      setIsProcessing(false);
    }
  };

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{t('emptyCart.title')}</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{t('emptyCart.description')}</p>
          <Button onClick={() => router.push('/cart')} className="btn-primary">
            {t('emptyCart.backToCart')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-24">
      <div className="max-w-6xl mx-auto px-4 ">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-center mb-2 text-gray-900 dark:text-white">{t('title')}</h1>
          <p className="text-gray-600 dark:text-gray-400 text-center">{t('subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment Form */}
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                <CreditCard className="h-5 w-5 text-brand-gold" />
                {t('form.title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {errors.general && (
                  <Alert variant="destructive">
                    <AlertDescription>{errors.general}</AlertDescription>
                  </Alert>
                )}

                {/* Cardholder Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">{t('form.cardholderName')}</Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder={t('form.cardholderNamePlaceholder')}
                    className={`bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-brand-gold dark:focus:border-brand-gold ${errors.name ? 'border-red-500 dark:border-red-500' : ''}`}
                    disabled={isLoading}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500 dark:text-red-400">{errors.name}</p>
                  )}
                </div>

                {/* Card Number */}
                <div className="space-y-2">
                  <Label htmlFor="number" className="text-gray-700 dark:text-gray-300">{t('form.cardNumber')}</Label>
                  <Input
                    id="number"
                    type="text"
                    value={formData.number}
                    onChange={(e) => handleInputChange('number', e.target.value)}
                    placeholder="1234 5678 9012 3456"
                    className={`bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-brand-gold dark:focus:border-brand-gold ${errors.number ? 'border-red-500 dark:border-red-500' : ''}`}
                    disabled={isLoading}
                    dir="ltr"
                  />
                  {errors.number && (
                    <p className="text-sm text-red-500 dark:text-red-400">{errors.number}</p>
                  )}
                </div>

                {/* Expiry Date */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiryMonth" className="text-gray-700 dark:text-gray-300">{t('form.expiryMonth')}</Label>
                    <Input
                      id="expiryMonth"
                      type="text"
                      value={formData.expiryMonth}
                      onChange={(e) => handleInputChange('expiryMonth', e.target.value)}
                      placeholder="MM"
                      maxLength={2}
                      className={`bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-brand-gold dark:focus:border-brand-gold ${errors.expiryMonth ? 'border-red-500 dark:border-red-500' : ''}`}
                      disabled={isLoading}
                    />
                    {errors.expiryMonth && (
                      <p className="text-sm text-red-500 dark:text-red-400">{errors.expiryMonth}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expiryYear" className="text-gray-700 dark:text-gray-300">{t('form.expiryYear')}</Label>
                    <Input
                      id="expiryYear"
                      type="text"
                      value={formData.expiryYear}
                      onChange={(e) => handleInputChange('expiryYear', e.target.value)}
                      placeholder="YYYY"
                      maxLength={4}
                      className={`bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-brand-gold dark:focus:border-brand-gold ${errors.expiryYear ? 'border-red-500 dark:border-red-500' : ''}`}
                      disabled={isLoading}
                    />
                    {errors.expiryYear && (
                      <p className="text-sm text-red-500 dark:text-red-400">{errors.expiryYear}</p>
                    )}
                  </div>
                </div>

                {/* CVC */}
                <div className="space-y-2">
                  <Label htmlFor="cvc" className="text-gray-700 dark:text-gray-300">{t('form.cvc')}</Label>
                  <Input
                    id="cvc"
                    type="text"
                    value={formData.cvc}
                    onChange={(e) => handleInputChange('cvc', e.target.value)}
                    placeholder="123"
                    maxLength={4}
                    className={`bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-brand-gold dark:focus:border-brand-gold ${errors.cvc ? 'border-red-500 dark:border-red-500' : ''}`}
                    disabled={isLoading}
                  />
                  {errors.cvc && (
                    <p className="text-sm text-red-500 dark:text-red-400">{errors.cvc}</p>
                  )}
                </div>

                {/* Security Notice */}
                <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <Lock className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    {t('form.securityNotice')}
                  </p>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full btn-primary"
                  disabled={isLoading}
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t('form.processing')}
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-4 w-4" />
                      {t('form.payNow')} {cart.totalPrice.toFixed(2)} ﷼
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                {t('summary.title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Items */}
                <div>
                  <h4 className="font-medium mb-3 text-gray-900 dark:text-white">{t('summary.items')}</h4>
                  <div className="space-y-2">
                    {cart.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center text-sm">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-white">{item.name}</p>
                          <p className="text-gray-600 dark:text-gray-400">× {item.quantity}</p>
                        </div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {((item.unitPrice || item.salePrice || item.price) * item.quantity).toFixed(2)} ﷼
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <hr className="border-gray-200 dark:border-gray-700" />

                {/* Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-700 dark:text-gray-300">{t('summary.subtotal')}</span>
                    <span className="text-gray-900 dark:text-white">{cart.subtotal.toFixed(2)} ﷼</span>
                  </div>
                  
                  {cart.deliveryCost > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-700 dark:text-gray-300">{t('summary.delivery')}</span>
                      <span className="text-gray-900 dark:text-white">{cart.deliveryCost.toFixed(2)} ﷼</span>
                    </div>
                  )}
                  
                  {cart.couponDiscount > 0 && (
                    <div className="flex justify-between text-green-600 dark:text-green-400">
                      <span>{t('summary.discount')}</span>
                      <span>-{cart.couponDiscount.toFixed(2)} ﷼</span>
                    </div>
                  )}
                  
                  <hr className="border-gray-200 dark:border-gray-700" />
                  
                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-gray-900 dark:text-white">{t('summary.total')}</span>
                    <span className="text-brand-gold">{cart.totalPrice.toFixed(2)} ﷼</span>
                  </div>
                </div>

                {/* Payment Method Info */}
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                  <h5 className="font-medium mb-3 text-gray-900 dark:text-white">{t('paymentMethods.title')}</h5>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{t('paymentMethods.subtitle')}</p>
                  
                  {/* Supported Payment Methods */}
                  <div className="grid grid-cols-2  gap-4 mb-4">
                    {/* Mada */}
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center border-2 transition-all duration-300"
                        style={{
                          borderColor: 'var(--brand-gray-600)',
                          background: 'rgba(255, 255, 255, 0.95)',
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                        }}
                      >
                        <Image src="/mada.png" alt={t('paymentMethods.mada')} width={24} height={24} className="object-contain" />
                      </div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t('paymentMethods.mada')}
                      </span>
                    </div>

                    {/* Visa */}
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center border-2 transition-all duration-300"
                        style={{
                          borderColor: 'var(--brand-gray-600)',
                          background: 'rgba(255, 255, 255, 0.95)',
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                        }}
                      >
                        <Image src="/visa.png" alt={t('paymentMethods.visa')} width={24} height={24} className="object-contain" />
                      </div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t('paymentMethods.visa')}
                      </span>
                    </div>

                    {/* Mastercard */}
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center border-2 transition-all duration-300"
                        style={{
                          borderColor: 'var(--brand-gray-600)',
                          background: 'rgba(255, 255, 255, 0.95)',
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                        }}
                      >
                        <Image src="/master.png" alt={t('paymentMethods.mastercard')} width={24} height={24} className="object-contain" />
                      </div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t('paymentMethods.mastercard')}
                      </span>
                    </div>

                    {/* American Express */}
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center border-2 transition-all duration-300"
                        style={{
                          borderColor: 'var(--brand-gray-600)',
                          background: 'rgba(255, 255, 255, 0.95)',
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                        }}
                      >
                        <Image src="/amex.png" alt={t('paymentMethods.amex')} width={24} height={24} className="object-contain" />
                      </div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t('paymentMethods.amex')}
                      </span>
                    </div>

                   

                    
                  </div>

                  {/* Security Info */}
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <Shield className="w-3 h-3" />
                    <span>{t('paymentMethods.encrypted')}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
