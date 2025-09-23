"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  Calendar,
  MapPin,
  CreditCard,
  User,
  Phone,
  Mail,
  Building,
  Image as ImageIcon,
  Type,
  CheckSquare,
  X,
  Eye,
  EyeOff,
} from "lucide-react";
import { Order } from "@/services/orders";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { getItemCustomizations } from '@/lib/customization-utils';

interface OrderDetailsModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export function OrderDetailsModal({
  order,
  isOpen,
  onClose,
}: OrderDetailsModalProps) {
  const t = useTranslations('orders');
  const [showCustomizations, setShowCustomizations] = useState<Record<string, boolean>>({});

  if (!order) return null;

  const getOrderStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'confirmed':
        return <CheckCircle className="w-4 h-4" />;
      case 'processing':
        return <Package className="w-4 h-4" />;
      case 'shipped':
        return <Truck className="w-4 h-4" />;
      case 'delivered':
        return <CheckCircle className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'processing':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'shipped':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400';
      case 'delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getPaymentStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'paid':
        return <CheckCircle className="w-4 h-4" />;
      case 'failed':
        return <XCircle className="w-4 h-4" />;
      case 'refund':
        return <Clock className="w-4 h-4" />;
      default:
        return <CreditCard className="w-4 h-4" />;
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'paid':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'refund':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getPaymentMethodName = (method: string) => {
    switch (method) {
      case 'visa': return 'Visa';
      case 'mastercard': return 'Mastercard';
      case 'apple_pay': return 'Apple Pay';
      case 'stc_pay': return 'STC Pay';
      default: return method;
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const toggleCustomizations = (itemId: string) => {
    setShowCustomizations(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <DialogHeader className="border-b border-gray-200 dark:border-gray-700 pb-4">
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-gold to-brand-navy flex items-center justify-center shadow-lg">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  {t('orderDetails')}
                </span>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  #{order.id.slice(-8).toUpperCase()}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-3 text-lg">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-white" />
                  </div>
                  {t('paymentStatus.title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Badge className={`${getPaymentStatusColor(order.paymentStatus)} px-3 py-1 text-sm font-medium`}>
                    <div className="flex items-center gap-2">
                      {getPaymentStatusIcon(order.paymentStatus)}
                      {t(`paymentStatus.${order.paymentStatus}`)}
                    </div>
                  </Badge>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                    {getPaymentMethodName(order.paymentMethod)}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-3 text-lg">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                    <Truck className="w-5 h-5 text-white" />
                  </div>
                  {t('deliveryStatus.title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Badge className={`${getOrderStatusColor(order.orderStatus)} px-3 py-1 text-sm font-medium`}>
                    <div className="flex items-center gap-2">
                      {getOrderStatusIcon(order.orderStatus)}
                      {t(`deliveryStatus.${order.orderStatus}`)}
                    </div>
                  </Badge>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                    {order.deliveryEnabled ? t('homeDelivery') : t('pickup')}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Information */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-lg">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                {t('orderInformation')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <Calendar className="w-5 h-5 text-purple-600" />
                    <div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('orderDate')}</span>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <CreditCard className="w-5 h-5 text-purple-600" />
                    <div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('totalAmount')}</span>
                      <p className="text-lg font-bold text-brand-gold">
                        {parseFloat(order.total.toString()).toFixed(2)} ﷼
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <MapPin className="w-5 h-5 text-purple-600" />
                    <div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('deliveryType')}</span>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {order.deliveryEnabled ? t('homeDelivery') : t('pickup')}
                      </p>
                    </div>
                  </div>
                  {order.deliveryEnabled && (
                    <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <MapPin className="w-5 h-5 text-purple-600 mt-0.5" />
                      <div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('deliveryAddress')}</span>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {order.googleAddress}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-lg">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                {t('customerInformation')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <User className="w-5 h-5 text-indigo-600" />
                    <div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('customerName')}</span>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {order.user.firstName} {order.user.lastName}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <Mail className="w-5 h-5 text-indigo-600" />
                    <div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('email')}</span>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {order.user.email}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  {(order.user as any).phoneNumber && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <Phone className="w-5 h-5 text-indigo-600" />
                      <div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('phone')}</span>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {(order.user as any).phoneNumber}
                        </p>
                      </div>
                    </div>
                  )}
                  {(order.user as any).address && (
                    <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <Building className="w-5 h-5 text-indigo-600 mt-0.5" />
                      <div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('address')}</span>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {(order.user as any).address}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5 text-brand-gold" />
                {t('orderItems')} ({(order.items && order.items.length > 0 ? order.items : order.cart.items).length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(order.items && order.items.length > 0 ? order.items : order.cart.items).map((item, index) => (
                  <div key={item.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-start gap-4">
                      {item.product.imageUrl && (
                        <Image
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          width={80}
                          height={80}
                          className="rounded-lg object-cover border border-gray-200 dark:border-gray-700"
                        />
                      )}
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold text-lg dark:text-white">
                              {item.product.name}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1"
                            dangerouslySetInnerHTML={{__html: item.product.description}}
                            >
                            </p>
                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                              <span>{t('quantity')}: {item.quantity}</span>
                              <span>{t('price')}: {parseFloat(String((item as any).unitPrice || 0)).toFixed(2)} ﷼</span>
                              {item.salePrice && parseFloat(String(item.salePrice)) < parseFloat(String((item as any).unitPrice || 0)) && (
                                <span className="text-green-600 dark:text-green-400">
                                  {t('salePrice')}: {parseFloat(String(item.salePrice)).toFixed(2)} ﷼
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg dark:text-white">
                              {(() => {
                                const unitPrice = parseFloat(String((item as any).unitPrice || 0));
                                const customizationCost = parseFloat(String((item as any).customizationCost || 0));
                                const totalPerItem = (unitPrice + customizationCost) * item.quantity;
                                return totalPerItem.toFixed(2);
                              })()} ﷼
                            </p>
                            {(() => {
                              const customizationCost = parseFloat((item as any).customizationCost || item?.customizationCost || 0);
                              return customizationCost > 0 && (
                                <p className="text-sm text-brand-gold">
                                  +{t('customization')}: {customizationCost.toFixed(2)} ﷼
                                </p>
                              );
                            })()}
                          </div>
                        </div>

                        {/* Customizations */}
                        {(() => {
                          const customizations = item.customizations || [];
                          const hasCustomizations = customizations.length > 0;
                          
                          if (!hasCustomizations) return null;
                          
                          return (
                            <div className="mt-4">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleCustomizations(item.id)}
                                className="gap-2 text-brand-gold hover:text-brand-gold/80"
                              >
                                {showCustomizations[item.id] ? (
                                  <EyeOff className="w-4 h-4" />
                                ) : (
                                  <Eye className="w-4 h-4" />
                                )}
                                {t('viewCustomizations')} ({customizations.length})
                              </Button>
                              
                              {showCustomizations[item.id] && (
                                <div className="mt-3 space-y-2">
                                  {getItemCustomizations(customizations).map((customization, custIndex: number) => (
                                    <div key={custIndex} className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                                      {/* Question Text */}
                                      <div className="mb-2">
                                        <span className="text-sm font-semibold text-yellow-800 dark:text-yellow-200">
                                          {customization.questionText}
                                        </span>
                                      </div>
                                      
                                      {/* Answer Text */}
                                      <div className="flex items-center gap-2 mb-2">
                                        <CheckSquare className="w-4 h-4 text-yellow-600" />
                                        <span className="text-sm text-yellow-800 dark:text-yellow-200">
                                          {customization.answerText}
                                        </span>
                                      </div>
                                      
                                      {/* Image */}
                                      {customization.hasImage && customization.imageUrl && (
                                        <div className="flex items-center gap-2 mb-2">
                                          <ImageIcon className="w-4 h-4 text-yellow-600" />
                                          <Button 
                                            onClick={() => window.open(customization.imageUrl!, '_blank')}
                                            variant="outline"
                                            size="sm"
                                            className="h-6 px-2 text-xs"
                                          >
                                            {t('viewImage')}
                                          </Button>
                                        </div>
                                      )}
                                      
                                      {/* Additional Price */}
                                      {customization.additionalPrice > 0 && (
                                        <div className="flex items-center gap-2">
                                          <span className="text-sm font-medium text-green-600 dark:text-green-400">
                                            +{customization.additionalPrice.toFixed(2)} ﷼
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-brand-gold" />
                {t('orderSummary')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">{t('subtotal')}:</span>
                  <span className="font-medium dark:text-white">{ (+order.subtotal).toFixed(2)} ﷼</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">{t('delivery')}:</span>
                  <span className="font-medium dark:text-white">
                    {order.deliveryFee > 0 ? `${(+order.deliveryFee).toFixed(2)} ﷼` : t('free')}
                  </span>
                </div>
                {order.discountAmount > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">{t('discount')}:</span>
                    <span className="font-medium text-green-600 dark:text-green-400">
                      -{(+order.discountAmount).toFixed(2)} ﷼
                    </span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold dark:text-white">{t('total')}:</span>
                  <span className="text-xl font-bold text-brand-gold">
                    {(+order.total).toFixed(2)} ﷼
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
