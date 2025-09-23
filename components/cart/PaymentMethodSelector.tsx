"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  CreditCard,
  Smartphone,
  Apple,
  Building,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

export type PaymentMethod = 'visa' | 'mastercard' | 'apple_pay' | 'stc_pay';

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethod | null;
  onMethodChange: (method: PaymentMethod) => void;
  className?: string;
}

export function PaymentMethodSelector({
  selectedMethod,
  onMethodChange,
  className,
}: PaymentMethodSelectorProps) {
  const t = useTranslations("cart.payment");
  const locale = useLocale();
const dir = locale === 'ar' ? 'rtl' : 'ltr'
  const paymentMethods = [
    {
      id: 'visa' as PaymentMethod,
      name: t('methods.visa.name'),
      description: t('methods.visa.description'),
      icon: <CreditCard className="w-5 h-5" />,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      borderColor: 'border-blue-200 dark:border-blue-800',
      available: true,
    },
    {
      id: 'mastercard' as PaymentMethod,
      name: t('methods.mastercard.name'),
      description: t('methods.mastercard.description'),
      icon: <CreditCard className="w-5 h-5" />,
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      borderColor: 'border-red-200 dark:border-red-800',
      available: true,
    },
    {
      id: 'apple_pay' as PaymentMethod,
      name: t('methods.applePay.name'),
      description: t('methods.applePay.description'),
      icon: <Apple className="w-5 h-5" />,
      color: 'text-gray-800 dark:text-gray-200',
      bgColor: 'bg-gray-50 dark:bg-gray-800/50',
      borderColor: 'border-gray-200 dark:border-gray-600',
      available: true,
    },
    {
      id: 'stc_pay' as PaymentMethod,
      name: t('methods.stcPay.name'),
      description: t('methods.stcPay.description'),
      icon: <Smartphone className="w-5 h-5" />,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      borderColor: 'border-green-200 dark:border-green-800',
      available: true,
    },
  ];

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-brand-gold" />
          {t("title")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={selectedMethod || ""}
          onValueChange={(value) => onMethodChange(value as PaymentMethod)}
          className="space-y-4"
          dir={dir}
        >
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className={`flex items-center gap-3 border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                selectedMethod === method.id
                  ? `${method.borderColor} ${method.bgColor} border-2 dark:border-brand-gold dark:bg-brand-gold/10`
                  : 'border-gray-200 dark:border-gray-600'
              } ${!method.available ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <RadioGroupItem
                value={method.id}
                id={method.id}
                disabled={!method.available}
                className="shrink-0"
              />
              <Label
                htmlFor={method.id}
                className={`flex-1 cursor-pointer ${!method.available ? 'cursor-not-allowed' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`${method.color} ${selectedMethod === method.id ? method.bgColor : ''} p-2 rounded-lg`}>
                      {method.icon}
                    </div>
                    <div className="text-start rtl:text-right">
                      <div className="font-medium flex items-center gap-2 text-gray-900 dark:text-gray-100">
                        {method.name}
                        {method.available ? (
                          <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                        )}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">{method.description}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300">
                      {t("secure")}
                    </Badge>
                  </div>
                </div>
              </Label>
            </div>
          ))}
        </RadioGroup>

        {/* Payment Security Info */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
            <div className="text-sm text-blue-800 dark:text-blue-200">
              <p className="font-medium mb-1">{t("security.title")}</p>
              <p className="text-blue-700 dark:text-blue-300">{t("security.description")}</p>
            </div>
          </div>
        </div>

      </CardContent>
    </Card>
  );
}
