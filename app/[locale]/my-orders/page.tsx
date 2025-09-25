"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  Search,
  Filter,
  Calendar,
  MapPin,
  CreditCard,
  Eye,
  Download,
  RefreshCw,
  ShoppingBag,
  AlertTriangle,
  X,
  Image as ImageIcon
} from 'lucide-react';
import { useAuth } from '@/hooks/use-profile';
import { getUserOrders } from '@/services/orders';
import { Order } from '@/services/orders';
import { OrderDetailsModal } from '@/components/OrderDetailsModal';
import Image from 'next/image';
import Link from 'next/link';
import { getItemCustomizations } from '@/lib/customization-utils';

export default function MyOrdersPage() {
  const t = useTranslations('orders');
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const locale = useLocale();
  const dir = locale === 'ar' ? 'rtl' : 'ltr';
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const limit = 10;

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  // Fetch orders
  const {
    data: ordersData,
    isLoading,
    isError,
    refetch
  } = useQuery({
    queryKey: ['user-orders', page, statusFilter, searchTerm],
    queryFn: () => getUserOrders({
      page,
      limit,
      orderStatus: statusFilter !== 'all' ? statusFilter : undefined
    }),
    enabled: isAuthenticated,
    staleTime: 30000, // 30 seconds
  });

  const orders = ordersData?.data || [];
  const meta = ordersData?.meta;

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
        return <RefreshCw className="w-4 h-4" />;
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
      month: 'short',
      day: 'numeric'
    });
  };

  const formatPrice = (price: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(price);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen pt-20">
        <div className="section-padding">
          <div className="section-container">
            <div className="space-y-8">
              <Skeleton className="h-8 w-64" />
              <div className="grid gap-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-64 w-full" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="section-padding">
        <div className="section-container max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div className="text-center md:text-start">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-brand-gold to-gray-700 dark:from-white dark:via-brand-gold dark:to-gray-300 bg-clip-text text-transparent mb-3">
                {t('title')}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg">{t('subtitle')}</p>
            </div>
            <Button 
              onClick={() => refetch()} 
              variant="outline" 
              className="gap-2 border-brand-gold text-brand-gold hover:bg-brand-gold hover:!text-white transition-all duration-300"
            >
              <RefreshCw className="w-4 h-4" />
              {t('refresh')}
            </Button>
          </div>

          {/* Filters */}
          <Card className="mb-8 border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-brand-gold/10 to-transparent dark:from-brand-gold/20">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Filter className="w-5 h-5 text-brand-gold" />
                {t('filters.title')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder={t('filters.searchPlaceholder')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-gray-200 dark:border-gray-700 focus:border-brand-gold focus:ring-brand-gold/20"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter} dir={dir}>
                  <SelectTrigger className="border-gray-200 dark:border-gray-700 focus:border-brand-gold focus:ring-brand-gold/20">
                    <SelectValue placeholder={t('filters.statusPlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('filters.allStatuses')}</SelectItem>
                    <SelectItem value="pending">{t('status.pending')}</SelectItem>
                    <SelectItem value="confirmed">{t('status.confirmed')}</SelectItem>
                    <SelectItem value="processing">{t('status.processing')}</SelectItem>
                    <SelectItem value="shipped">{t('status.shipped')}</SelectItem>
                    <SelectItem value="delivered">{t('status.delivered')}</SelectItem>
                    <SelectItem value="cancelled">{t('status.cancelled')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Orders List */}
          {isLoading ? (
            <div className="space-y-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-6 w-24" />
                      </div>
                      <Skeleton className="h-4 w-48" />
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-24 w-full" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : isError ? (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {t('error.loadFailed')}
              </AlertDescription>
            </Alert>
          ) : orders.length === 0 ? (
            <Card className="text-center p-12">
              <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold mb-2">{t('empty.title')}</h3>
              <p className="text-gray-600 mb-6">{t('empty.description')}</p>
                <Link href="/products" className="btn-primary">{t('empty.startShopping')}</Link>
            </Card>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <Card key={order.id} className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:scale-[1.02]">
                  <CardContent className="p-6">
                    {/* Order Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                      <div>
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                            {t('orderNumber')}: {order.id.slice(-8).toUpperCase()}
                          </h3>
                          <Badge className={`${getOrderStatusColor(order.orderStatus)} border-0 shadow-sm`}>
                            <div className="flex items-center gap-1">
                              {getOrderStatusIcon(order.orderStatus)}
                              {t(`status.${order.orderStatus}`)}
                            </div>
                          </Badge>
                        </div>
                        <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-brand-gold" />
                            {formatDate(order.createdAt)}
                          </div>
                          <div className="flex items-center gap-2">
                            <CreditCard className="w-4 h-4 text-brand-gold" />
                            <span className="font-semibold text-brand-gold">{ (+order.total).toFixed(2)} ﷼</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Button 
                          variant="default" 
                          size="sm"
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowOrderDetails(true);
                          }}
                          className="bg-brand-gold hover:bg-brand-gold/90 text-white border-0 shadow-md hover:shadow-lg transition-all duration-300"
                        >
                            <Eye className="w-4 h-4 mr-2" />
                            {t('viewDetails')}
                          </Button>
                      </div>
                    </div>

                    {/* Payment and Delivery Status */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <div className="flex items-center gap-2 mb-3">
                          <CreditCard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          <span className="font-semibold text-blue-900 dark:text-blue-100">{t('paymentStatus.title')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={`${getPaymentStatusColor(order.paymentStatus)} border-0 shadow-sm`}>
                            <div className="flex items-center gap-1">
                              {getPaymentStatusIcon(order.paymentStatus)}
                              {t(`paymentStatus.${order.paymentStatus}`)}
                            </div>
                          </Badge>
                          <span className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                            {getPaymentMethodName(order.paymentMethod)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg border border-green-200 dark:border-green-800">
                        <div className="flex items-center gap-2 mb-3">
                          <Truck className="w-5 h-5 text-green-600 dark:text-green-400" />
                          <span className="font-semibold text-green-900 dark:text-green-100">{t('deliveryStatus.title')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={`${getOrderStatusColor(order.orderStatus)} border-0 shadow-sm`}>
                            <div className="flex items-center gap-1">
                              {getOrderStatusIcon(order.orderStatus)}
                              {t(`deliveryStatus.${order.orderStatus}`)}
                            </div>
                          </Badge>
                          <span className="text-sm text-green-700 dark:text-green-300 font-medium">
                            {order.deliveryEnabled ? t('homeDelivery') : t('pickup')}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Order Items Preview */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                      {(order.items && order.items.length > 0 ? order.items : order.cart.items).slice(0, 3).map((item) => (
                        <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          {item.product.imageUrl && (
                            <Image
                              src={item.product.imageUrl}
                              alt={item.product.name}
                              width={48}
                              height={48}
                              className="rounded-lg object-cover"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate dark:text-white">{item.product.name}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              {t('quantity')}: {item.quantity} × {(+(item as any).unitPrice || (item as any).price || 0).toFixed(2)} ﷼
                            </p>
                            {item.customizations && item.customizations.length > 0 && (
                              <div className="mt-1 space-y-1">
                                <p className="text-xs text-brand-gold font-medium">
                                  {item.customizations.length} {t('customizations')}:
                                </p>
                                <div className="space-y-1">
                                  {getItemCustomizations(item.customizations).map((customization, idx: number) => (
                                    <div key={idx} className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                                      <div className="font-medium text-gray-600 dark:text-gray-400">{customization.questionText}</div>
                                      <div className="flex items-center gap-2">
                                        <span className="text-gray-800 dark:text-gray-200">{customization.answerText}</span>
                                        {customization.hasImage && customization.imageUrl && (
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-5 px-2 text-xs"
                                            onClick={() => window.open(customization.imageUrl!, '_blank')}
                                          >
                                            <ImageIcon className="w-3 h-3 mr-1" />
                                            {t('viewImage')}
                                          </Button>
                                        )}
                                        {customization.hasFile && customization.fileUrl && (
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-5 px-2 text-xs"
                                            onClick={() => window.open(customization.fileUrl!, '_blank')}
                                          >
                                            <Download className="w-3 h-3 mr-1" />
                                            {t('downloadFile')}
                                          </Button>
                                        )}
                                        {customization.additionalPrice > 0 && (
                                          <span className="text-green-600 dark:text-green-400 font-medium">
                                            +{customization.additionalPrice.toFixed(2)} ﷼
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                      {(order.items && order.items.length > 0 ? order.items : order.cart.items).length > 3 && (
                        <div className="flex items-center justify-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            +{(order.items && order.items.length > 0 ? order.items : order.cart.items).length - 3} {t('moreItems')}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Delivery Address */}
                    <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                      <span>
                        {order.deliveryEnabled ? order.googleAddress : t('pickupFromCompany')}
                      </span>
                    </div>

                    {/* Order Summary */}
                    <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">{t('subtotal')}:</span>
                          <span className="ml-2 font-medium dark:text-white">{(+order.subtotal).toFixed(2)} ﷼</span>
                        </div>
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">{t('delivery')}:</span>
                          <span className="ml-2 font-medium dark:text-white">
                            {order.deliveryFee > 0 ? `${(+order.deliveryFee).toFixed(2)} ﷼` : t('free')}
                          </span>
                        </div>
                        {order.discountAmount > 0 && (
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">{t('discount')}:</span>
                            <span className="ml-2 font-medium text-green-600 dark:text-green-400">
                              -﷼{(+order.discountAmount).toFixed(2)}
                            </span>
                          </div>
                        )}
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">{t('total')}:</span>
                          <span className="ml-2 font-bold text-lg dark:text-white">{(+order.total).toFixed(2)} ﷼</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Pagination */}
              {meta && meta.totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  <Button
                    variant="outline"
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                  >
                    {t('pagination.previous')}
                  </Button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, meta.totalPages) }, (_, i) => {
                      const pageNum = i + 1;
                      return (
                        <Button
                          key={pageNum}
                          variant={page === pageNum ? "default" : "outline"}
                          onClick={() => setPage(pageNum)}
                          size="sm"
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => setPage(page + 1)}
                    disabled={page >= meta.totalPages}
                  >
                    {t('pagination.next')}
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      <OrderDetailsModal
        order={selectedOrder}
        isOpen={showOrderDetails}
        onClose={() => {
          setShowOrderDetails(false);
                  setSelectedOrder(null);
                }}
              />
    </div>
  );
}
