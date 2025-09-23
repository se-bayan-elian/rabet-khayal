'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useCartStore } from '@/store/cart-api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface PaymentResult {
  success: boolean;
  paymentId?: string;
  orderId?: string;
  message?: string;
  error?: string;
}

export default function PaymentCallbackPage() {
  const t = useTranslations('payment');
  const router = useRouter();
  const searchParams = useSearchParams();
  const { createOrder, clearCart } = useCartStore();
  
  const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);

  useEffect(() => {
    const handlePaymentCallback = async () => {
      try {
        // Get payment parameters from URL
        const paymentId = searchParams.get('id');
        const status = searchParams.get('status');
        const error = searchParams.get('error');


        if (error) {
          setPaymentResult({
            success: false,
            error: error,
            message: t('callback.paymentFailed')
          });
          setIsLoading(false);
          return;
        }

        if (!paymentId) {
          setPaymentResult({
            success: false,
            error: 'No payment ID provided',
            message: t('callback.noPaymentId')
          });
          setIsLoading(false);
          return;
        }

        if (status !== 'paid') {
          setPaymentResult({
            success: false,
            paymentId,
            error: `Payment status: ${status}`,
            message: t('callback.paymentNotPaid')
          });
          setIsLoading(false);
          return;
        }

        // Payment was successful, now create the order
        setIsCreatingOrder(true);
        
        try {
          // Since this is a credit card payment, we'll default to 'visa' as the payment method
          // In a real implementation, you might want to determine this from the payment gateway response
          const orderResult = await createOrder('visa', paymentId);
          
          if (orderResult.success && orderResult.order) {
            setPaymentResult({
              success: true,
              paymentId,
              orderId: orderResult.order.id,
              message: t('callback.orderCreated')
            });
            
            // Clear the cart after successful order
            clearCart();
            
            toast.success(t('callback.successMessage'));
          } else {
            setPaymentResult({
              success: false,
              paymentId,
              error: orderResult.error || 'Failed to create order',
              message: t('callback.orderCreationFailed')
            });
          }
        } catch (orderError) {
          console.error('Order creation error:', orderError);
          setPaymentResult({
            success: false,
            paymentId,
            error: orderError instanceof Error ? orderError.message : 'Unknown error',
            message: t('callback.orderCreationFailed')
          });
        }

      } catch (error) {
        console.error('Payment callback error:', error);
        setPaymentResult({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          message: t('callback.generalError')
        });
      } finally {
        setIsLoading(false);
        setIsCreatingOrder(false);
      }
    };

    handlePaymentCallback();
  }, [searchParams, createOrder, clearCart, t]);

  const handleContinue = () => {
    if (paymentResult?.success) {
      router.push('/my-orders');
    } else {
      router.push('/cart');
    }
  };

  const handleRetry = () => {
    router.push('/payment');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Card className="w-full max-w-md bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardContent className="pt-6">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-600 dark:text-blue-400" />
              <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{t('callback.processing')}</h2>
              <p className="text-gray-600 dark:text-gray-400">{t('callback.processingDescription')}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isCreatingOrder) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Card className="w-full max-w-md bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardContent className="pt-6">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-green-600 dark:text-green-400" />
              <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{t('callback.creatingOrder')}</h2>
              <p className="text-gray-600 dark:text-gray-400">{t('callback.creatingOrderDescription')}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-8">
      <div className="w-full max-w-md">
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader className="text-center">
            {paymentResult?.success ? (
              <CheckCircle className="h-16 w-16 text-green-600 dark:text-green-400 mx-auto mb-4" />
            ) : (
              <XCircle className="h-16 w-16 text-red-600 dark:text-red-400 mx-auto mb-4" />
            )}
            <CardTitle className="text-2xl text-gray-900 dark:text-white">
              {paymentResult?.success ? t('callback.successTitle') : t('callback.failureTitle')}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {paymentResult?.message && (
              <Alert variant={paymentResult.success ? "default" : "destructive"}>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{paymentResult.message}</AlertDescription>
              </Alert>
            )}

            {paymentResult?.error && (
              <Alert variant="destructive">
                <AlertDescription>
                  <strong>{t('callback.errorDetails')}:</strong> {paymentResult.error}
                </AlertDescription>
              </Alert>
            )}

            {paymentResult?.success && paymentResult.orderId && (
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">{t('callback.orderDetails')}</h4>
                <p className="text-sm text-green-700 dark:text-green-300">
                  <strong>{t('callback.orderId')}:</strong> {paymentResult.orderId}
                </p>
                {paymentResult.paymentId && (
                  <p className="text-sm text-green-700 dark:text-green-300">
                    <strong>{t('callback.paymentId')}:</strong> {paymentResult.paymentId}
                  </p>
                )}
              </div>
            )}

            {paymentResult?.success && (
              <div className="space-y-3">
                <Button onClick={handleContinue} className="w-full btn-primary" size="lg">
                  {t('callback.viewOrders')}
                </Button>
                <Button 
                  onClick={() => router.push('/')} 
                  variant="outline" 
                  className="w-full border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  {t('callback.continueShopping')}
                </Button>
              </div>
            )}

            {!paymentResult?.success && (
              <div className="space-y-3">
                <Button onClick={handleRetry} className="w-full btn-primary" size="lg">
                  {t('callback.retryPayment')}
                </Button>
                <Button 
                  onClick={() => router.push('/cart')} 
                  variant="outline" 
                  className="w-full border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  {t('callback.backToCart')}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
