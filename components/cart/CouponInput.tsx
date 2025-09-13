"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Tag,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
  Percent,
  DollarSign
} from "lucide-react"
import { useTranslations } from "next-intl"
import { useCartStore } from "@/store/cart"

export function CouponInput() {
  const t = useTranslations('cart')
  const [couponCode, setCouponCode] = useState("")
  const {
    cart,
    couponStatus,
    applyCoupon,
    removeCoupon
  } = useCartStore()

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return

    const result = await applyCoupon(couponCode.trim().toUpperCase())

    if (result.success) {
      setCouponCode("")
    }
  }

  const handleRemoveCoupon = () => {
    removeCoupon()
    setCouponCode("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleApplyCoupon()
    }
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-brand-gold" />
            <h3 className="font-semibold text-gray-900">
              {t('coupon.title', { default: 'Coupon Code' })}
            </h3>
          </div>

          {/* Applied Coupon Display */}
          {cart.appliedCoupon && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        {cart.appliedCoupon.code}
                      </Badge>
                      <div className="flex items-center text-sm text-green-700">
                        {cart.appliedCoupon.discountType === 'percentage' ? (
                          <>
                            <Percent className="w-3 h-3 mr-1 rtl:mr-0 rtl:ml-1" />
                            {(cart.appliedCoupon.discount / cart.subtotal * 100).toFixed(0)}{t('coupon.percentageOff')}
                          </>
                        ) : (
                          <>
                            <DollarSign className="w-3 h-3 mr-1 rtl:mr-0 rtl:ml-1" />
                            ﷼{cart.appliedCoupon.discount.toFixed(2)} {t('coupon.dollarOff')}
                          </>
                        )}
                      </div>
                    </div>
                    {cart.appliedCoupon.description && (
                      <p className="text-sm text-green-600 mt-1">
                        {cart.appliedCoupon.description}
                      </p>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveCoupon}
                  className="text-green-600 hover:text-green-700 hover:bg-green-100"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Coupon Input */}
          {!cart.appliedCoupon && (
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input
                  placeholder={t('coupon.placeholder', { default: 'Enter coupon code' })}
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  onKeyPress={handleKeyPress}
                  disabled={couponStatus.isValidating}
                  className="flex-1 text-start rtl:text-right"
                  dir="auto"
                />
                <Button
                  onClick={handleApplyCoupon}
                  disabled={!couponCode.trim() || couponStatus.isValidating}
                  className="px-6"
                >
                  {couponStatus.isValidating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    t('coupon.apply', { default: 'Apply' })
                  )}
                </Button>
              </div>

              {/* Error Message */}
              {couponStatus.error && (
                <div className="flex items-center gap-2 text-sm text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  {couponStatus.error}
                </div>
              )}

              {/* Help Text */}
              <p className="text-xs text-gray-500">
                {t('coupon.helpText', {
                  default: 'Enter your coupon code to get a discount on your order'
                })}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
