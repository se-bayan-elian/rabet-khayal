"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  CreditCard,
  Loader2,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { PaymentMethod } from "./PaymentMethodSelector";
import { processPayment } from "@/services/orders";

interface PaymentProcessingModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  paymentMethod: PaymentMethod;
  amount: number;
  onSuccess: (orderId: string) => void;
}

type PaymentStatus = 'processing' | 'success' | 'failed';

export function PaymentProcessingModal({
  isOpen,
  onClose,
  orderId,
  paymentMethod,
  amount,
  onSuccess,
}: PaymentProcessingModalProps) {
  const t = useTranslations("cart.payment");
  const router = useRouter();
  const [status, setStatus] = useState<PaymentStatus>('processing');
  const [error, setError] = useState<string | null>(null);
  const [transactionId, setTransactionId] = useState<string | null>(null);

  // Simulate payment processing
  useEffect(() => {
    if (!isOpen || status !== 'processing') return;

    const processPaymentAsync = async () => {
      try {
        // Generate a mock transaction ID
        const mockTransactionId = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        setTransactionId(mockTransactionId);

        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Process the payment
        const result = await processPayment(orderId, {
          paymentMethod,
          transactionId: mockTransactionId,
          amount,
        });

        if (result) {
          setStatus('success');
          // Call success callback after a short delay
          setTimeout(() => {
            onSuccess(orderId);
          }, 1500);
        } else {
          setStatus('failed');
          setError(t("errors.processingFailed"));
        }
      } catch (err: any) {
        console.error('Payment processing error:', err);
        setStatus('failed');
        setError(err.response?.data?.message || t("errors.processingFailed"));
      }
    };

    processPaymentAsync();
  }, [isOpen, status, orderId, paymentMethod, amount, onSuccess, t]);

  const handleClose = () => {
    if (status === 'processing') return; // Prevent closing during processing
    onClose();
  };

  const handleViewOrder = () => {
    router.push(`/my-orders`);
    onClose();
  };

  const getPaymentMethodName = (method: PaymentMethod) => {
    switch (method) {
      case 'visa': return 'Visa';
      case 'mastercard': return 'Mastercard';
      case 'apple_pay': return 'Apple Pay';
      case 'stc_pay': return 'STC Pay';
      default: return method;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            {t("processing.title")}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Payment Method Info */}
          <div className="text-center">
            <div className="text-sm text-gray-600 mb-2">
              {t("processing.payingWith")}
            </div>
            <div className="font-semibold text-lg">
              {getPaymentMethodName(paymentMethod)}
            </div>
            <div className="text-2xl font-bold text-brand-navy mt-2">
              ﷼{amount.toFixed(2)}
            </div>
          </div>

          {/* Status Display */}
          {status === 'processing' && (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <Loader2 className="w-12 h-12 text-brand-gold animate-spin" />
              </div>
              <div className="space-y-2">
                <p className="font-medium">{t("processing.processing")}</p>
                <p className="text-sm text-gray-600">
                  {t("processing.pleaseWait")}
                </p>
              </div>
            </div>
          )}

          {status === 'success' && (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <div className="space-y-2">
                <p className="font-medium text-green-800">
                  {t("processing.success")}
                </p>
                <p className="text-sm text-gray-600">
                  {t("processing.orderConfirmed")}
                </p>
                {transactionId && (
                  <p className="text-xs text-gray-500">
                    {t("processing.transactionId")}: {transactionId}
                  </p>
                )}
              </div>
            </div>
          )}

          {status === 'failed' && (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <XCircle className="w-12 h-12 text-red-600" />
              </div>
              <div className="space-y-2">
                <p className="font-medium text-red-800">
                  {t("processing.failed")}
                </p>
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            {status === 'success' && (
              <Button
                onClick={handleViewOrder}
                className="flex-1 btn-primary"
              >
                <ArrowRight className="w-4 h-4 mr-2" />
                {t("processing.viewOrder")}
              </Button>
            )}

            {status === 'failed' && (
              <Button
                onClick={handleClose}
                variant="outline"
                className="flex-1"
              >
                {t("processing.tryAgain")}
              </Button>
            )}

            {status === 'processing' && (
              <Button
                disabled
                className="flex-1"
              >
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {t("processing.processing")}
              </Button>
            )}
          </div>

          {/* Security Note */}
          <div className="text-xs text-gray-500 text-center">
            {t("processing.securityNote")}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
