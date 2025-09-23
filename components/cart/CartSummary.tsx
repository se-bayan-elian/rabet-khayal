"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  ShoppingCart,
  Truck,
  Tag,
  ArrowRight,
  Info
} from "lucide-react"
import { useTranslations } from "next-intl"
import { useCartStore } from "@/store/cart-api"
import Link from "next/link"

interface CartSummaryProps {
  showCheckoutButton?: boolean;
  className?: string;
}

export function CartSummary({ showCheckoutButton = true, className }: CartSummaryProps) {
  const t = useTranslations('cart')
  const { cart } = useCartStore()

  if (cart.totalItems === 0) {
    return (
      <Card className={className}>
        <CardContent className="p-6 text-center">
          <ShoppingCart className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">
            {t('empty', { default: 'Your cart is empty' })}
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          {t('summary.title', { default: 'Order Summary' })}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Items Count */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">
            {t('summary.items', { default: 'Items' })} ({cart.totalItems})
          </span>
          <span className="font-medium">
            ﷼{cart.subtotal.toFixed(2)}
          </span>
        </div>

        {/* Coupon Discount */}
        {cart.appliedCoupon && (
          <div className="flex justify-between text-sm">
            <div className="flex items-center gap-2 text-green-600">
              <Tag className="w-4 h-4" />
              <span>
                {t('summary.couponDiscount', { default: 'Coupon Discount' })}
              </span>
              <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                {cart.appliedCoupon.code}
              </Badge>
            </div>
            <span className="font-medium text-green-600">
              -﷼{cart.couponDiscount.toFixed(2)}
            </span>
          </div>
        )}

        {/* Delivery */}
        <div className="flex justify-between text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <Truck className="w-4 h-4" />
            <span>
              {t('summary.delivery', { default: 'Delivery' })}
            </span>
            {cart.deliveryCost === 0 && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                {t('summary.free', { default: 'Free' })}
              </Badge>
            )}
          </div>
          <span className="font-medium">
            {cart.deliveryCost === 0 
              ? t('summary.free', { default: 'Free' })
              : `﷼${cart.deliveryCost.toFixed(2)}`
            }
          </span>
        </div>

        {/* Delivery Type Info */}
        <div className="flex items-start gap-2 text-xs text-gray-500 bg-gray-50 p-2 rounded">
          <Info className="w-3 h-3 mt-0.5" />
          <span>
            {cart.deliveryType === 'company' 
              ? t('summary.deliveryCompany', { 
                  default: 'Pick up from company location - Free' 
                })
              : t('summary.deliveryHome', { 
                  default: 'Home delivery - Charges may apply based on location' 
                })
            }
          </span>
        </div>

        <Separator />

        {/* Total */}
        <div className="flex justify-between text-lg font-bold">
          <span>{t('summary.total', { default: 'Total' })}</span>
          <span className="text-brand-navy">
            ﷼{cart.totalPrice.toFixed(2)}
          </span>
        </div>

        {/* Savings Display */}
        {cart.couponDiscount > 0 && (
          <div className="text-center text-sm text-green-600 bg-green-50 p-2 rounded">
            🎉 {t('summary.savings', { 
              default: 'You saved ${{amount}}!',
              amount: `﷼${cart.couponDiscount.toFixed(2)}`
            })}
          </div>
        )}

        {/* Checkout Button */}
        {showCheckoutButton && (
          <div className="pt-2">
            <Link href="/checkout">
              <Button className="w-full btn-primary text-lg py-3">
                <ArrowRight className="w-5 h-5 mr-2" />
                {t('summary.checkout', { default: 'Proceed to Checkout' })}
              </Button>
            </Link>
          </div>
        )}

        {/* Security Note */}
        <div className="text-xs text-gray-500 text-center">
          {t('summary.security', { 
            default: 'Secure checkout with SSL encryption' 
          })}
        </div>
      </CardContent>
    </Card>
  )
}
