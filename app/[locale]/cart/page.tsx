
"use client"

import { useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useCartStore, DeliveryOption } from "@/store/cart-api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { EditCustomizationModal } from "@/components/cart/EditCustomizationModal";
import {
  ShoppingCart,
  Minus,
  Plus,
  Trash2,
  ArrowLeft,
  CreditCard,
  Package,
  Image as ImageIcon,
  FileText,
  CheckSquare,
  Type,
  Edit3,
  MapPin,
  Truck,
  Building,
  ExternalLink,
  AlertCircle,
  Navigation,
  Tag,
  CheckCircle,
  X,
  Percent,
  DollarSign,
  Loader2
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { CartItem, CartItemCustomization, CartState } from "@/store/cart-api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-profile";

// Component to display customizations
function CustomizationDisplay({ customizations, questions }: { customizations: CartItemCustomization[]; questions?: any[] }) {
  const t = useTranslations("cart");

  if (!customizations || customizations.length === 0) return null;

  // Helper function to find question and answer text
  const getCustomizationDisplay = (customization: CartItemCustomization) => {
    // Use stored question text if available, otherwise fall back to finding by ID
    const questionText = customization.questionText || 
      questions?.find(q => q.id === customization.questionId)?.questionText || 
      `Question ${customization.questionId}`;

    if (customization.textValue) {
      return {
        icon: <Type className="w-3 h-3" />,
        text: `${questionText}: ${customization.textValue}`
      };
    }

    if (customization.answerId) {
      // Use stored answer text if available, otherwise find by ID
      let answerText = customization.answerText;
      if (!answerText) {
        const question = questions?.find(q => q.id === customization.questionId);
        const answer = question?.answers?.find((a: any) => a.id === customization.answerId);
        answerText = answer?.answerText || customization.answerId;
      }
      
      return {
        icon: <CheckSquare className="w-3 h-3" />,
        text: `${questionText}: ${answerText}`
      };
    }

    if (customization.imagePublicId || customization.imageUrl) {
      const imageUrl = customization.imageUrl;
      return {
        icon: <ImageIcon className="w-3 h-3" />,
        text: questionText,
        imageUrl: imageUrl
      };
    }

    return null;
  };

  return (
    <div className="mt-2 space-y-1">
      <p className="text-xs font-medium text-gray-600">{t("customizations")}:</p>
      {customizations.map((customization, index) => {
        const display = getCustomizationDisplay(customization);
        if (!display) return null;

        return (
          <div key={index} className="flex items-start gap-2 text-xs text-gray-500 dark:text-gray-400">
            {display.icon}
            <div className="flex-1">
              <span className="line-clamp-2">{display.text}</span>
              {display.imageUrl && (
                <div className="mt-1">
                  <a 
                    href={display.imageUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-brand-gold dark:text-amber-400 hover:text-brand-navy dark:hover:text-amber-300 underline"
                  >
                    <ExternalLink className="w-3 h-3" />
                    View Image
                  </a>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Component for cart item
function CartItemComponent({ item, onEditCustomizations }: {
  item: CartItem;
  onEditCustomizations: (item: CartItem) => void;
}) {
  const t = useTranslations("cart");
  const { updateQuantity, removeFromCart, isLoading } = useCartStore();

  const basePrice = item.unitPrice || item.salePrice || item.price;
  const customizationCost = item.customizationCost || 0;
  const itemPrice = basePrice + customizationCost;
  const totalPrice = itemPrice * item.quantity;
  const isOnSale = item.salePrice && item.salePrice < item.price;

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1) return;
    await updateQuantity(item.id, newQuantity);
  };

  const handleRemove = async () => {
    await removeFromCart(item.id);
  };

  return (
    <Card className="overflow-hidden dark:bg-gray-800 dark:border-gray-700">
      <CardContent className="p-4">
        <div className="flex gap-4">
          {/* Product Image */}
          <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 shrink-0">
            {item.imageUrl ? (
              <Image
                src={item.imageUrl}
                alt={item.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center">
                <Package className="w-8 h-8 text-gray-400 dark:text-gray-500" />
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 leading-tight">
                  {item.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-1 mt-1"
                dangerouslySetInnerHTML={{ __html: item.description }}
                >
                </p>

                {/* Customizations */}
                {item.customizations && (
                  <CustomizationDisplay
                    customizations={item.customizations}
                    questions={item.questions}
                  />
                )}

                {/* Price */}
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-brand-navy dark:!text-brand-gold">
                        {(+itemPrice).toFixed(2)} ﷼
                      </span>
                      {isOnSale && (
                        <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                        {(+item.price).toFixed(2)} ﷼
                        </span>
                      )}
                      {isOnSale && (
                        <Badge className="bg-red-500 dark:bg-red-600 text-white text-xs">
                          {t("sale")}
                        </Badge>
                      )}
                    </div>
                    {customizationCost > 0 && (
                      <span className="text-xs text-brand-gold">
                        +{(+customizationCost).toFixed(2)} ﷼ {t("customizations")}
                      </span>
                    )}
                  </div>
                </div>

                {/* Edit Customizations Button */}
                {item.questions && item.questions.length > 0 ? (() => {
                  const requiredQuestions = item.questions.filter(q => q.required);
                  const currentCustomizations = item.customizations || [];
                  const hasUnansweredRequired = requiredQuestions.some(question =>
                    !currentCustomizations.some(c =>
                      c.questionId === question.id && (
                        c.answerId ||
                        c.textValue?.trim() ||
                        c.imagePublicId
                      )
                    )
                  );

                  return (
                    <div className="mt-2 space-y-2">
                      {hasUnansweredRequired && (
                        <Alert className="border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20 py-2">
                          <AlertCircle className="h-3 w-3 text-orange-600 dark:text-orange-400" />
                          <AlertDescription className="text-xs text-orange-800 dark:text-orange-200">
                            {t("requiredCustomizationsMissing")}
                          </AlertDescription>
                        </Alert>
                      )}
                      <Button
                        variant={hasUnansweredRequired ? "default" : "outline"}
                        size="sm"
                        onClick={() => onEditCustomizations(item)}
                        className={`text-xs ${hasUnansweredRequired
                          ? "bg-orange-600 dark:bg-orange-700 text-white hover:bg-orange-700 dark:hover:bg-orange-800"
                          : "border-brand-gold text-brand-navy dark:!text-brand-gold hover:bg-brand-gold/10 dark:hover:bg-brand-gold/20"
                          }`}
                      >
                        <Edit3 className="w-3 h-3 mr-1" />
                        {hasUnansweredRequired ? t("completeCustomizations") : t("editCustomizations")}
                      </Button>
                    </div>
                  );
                })() : null}
              </div>

              {/* Remove Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRemove}
                disabled={isLoading}
                className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            {/* Quantity Controls and Total */}
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  {t("quantity")}:
                </span>
                <div className="flex items-center border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuantityChange(item.quantity - 1)}
                    disabled={isLoading || item.quantity <= 1}
                    className="px-3 hover:bg-brand-gold/10 dark:hover:bg-brand-gold/20 text-gray-700 dark:text-gray-300 hover:text-brand-navy dark:hover:text-brand-gold"
                  >
                    <Minus className="w-3 h-3" />
                  </Button>
                  <span className="px-4 py-2 min-w-[3rem] text-center font-medium text-gray-900 dark:text-gray-100">
                    {item.quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuantityChange(item.quantity + 1)}
                    disabled={isLoading}
                    className="px-3 hover:bg-brand-gold/10 dark:hover:bg-brand-gold/20 text-gray-700 dark:text-gray-300 hover:text-brand-navy dark:hover:text-brand-gold"
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              {/* Item Total */}
              <div className="text-right">
                <p className="text-sm text-gray-600 dark:text-gray-300">{t("itemTotal")}:</p>
                <p className="text-lg font-bold text-brand-navy dark:!text-brand-gold">
                  {(+totalPrice).toFixed(2)} ﷼
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function CartPage() {
  const t = useTranslations("cart");
  const router = useRouter();
  const locale = useLocale();
  const {
    cart,
    isLoading,
    isInitialized,
    clearCart,
    deliveryOptions,
    setDeliveryType,
    setDeliveryOption,
    setDeliveryAddress,
    fetchDeliveryOptions,
    updateItemCustomizations,
    couponStatus,
    applyCoupon,
    removeCoupon,
    createOrder,
    setLoggedIn
  } = useCartStore();
  
  // Use main auth state (same as header)
  const { isAuthenticated } = useAuth();
  
  const [isClearing, setIsClearing] = useState(false);
  const [editingItem, setEditingItem] = useState<CartItem | null>(null);
  const [companyMapUrl] = useState("https://maps.google.com/maps?q=Your+Company+Address"); // Replace with actual company location
  const [localDeliveryAddress, setLocalDeliveryAddress] = useState("");
  const [addressError, setAddressError] = useState("");
  const [customizationError, setCustomizationError] = useState("");
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);

  const dir = locale === "ar" ? "rtl" : "ltr";

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;

    const result = await applyCoupon(couponCode.trim().toUpperCase(), locale);

    if (result.success) {
      setCouponCode("");
    }
  };

  const handleCheckout = async () => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      // Show localized toast notification
      toast.error(t('errors.authenticationRequired'), {
        description: t('errors.loginRequiredDescription'),
      });
      const callbackUrl = encodeURIComponent(`/${locale}/cart`);
       router.push(`/${locale}/login?callback=${callbackUrl}`);
      return;
    }

    const customizationValidation = validateCustomizations();
    if (!validateDeliveryAddress() || !customizationValidation.isValid) {
      if (!customizationValidation.isValid) {
        setCustomizationError(customizationValidation.message || "");
      }
      return;
    }

    setIsCreatingOrder(true);
    try {
      // Create order from cart
      const orderId = await createOrder('visa'); // Default payment method, you can make this selectable
      
      // Navigate to my orders page
      router.push(`/${locale}/my-orders`);
      
    } catch (error) {
      console.error('Failed to create order:', error);
      alert('Failed to create order. Please try again.');
    } finally {
      setIsCreatingOrder(false);
    }
  };
  // Sync cart store auth state with main auth state
  useEffect(() => {
    setLoggedIn(isAuthenticated);
  }, [isAuthenticated, setLoggedIn]);

  // Sync local delivery address with cart store
  useEffect(() => {
    setLocalDeliveryAddress(cart.deliveryAddress || "");
  }, [cart.deliveryAddress]);

  // Fetch delivery options on mount
  useEffect(() => {
    fetchDeliveryOptions();
  }, [fetchDeliveryOptions]);

  const handleClearCart = async () => {
    setIsClearing(true);
    try {
      await clearCart();
    } finally {
      setIsClearing(false);
    }
  };

  const handleEditCustomizations = (item: CartItem) => {
    setEditingItem(item);
  };

  const handleSaveCustomizations = async (customizations: CartItemCustomization[], customizationCost: number) => {
    if (editingItem) {
      await updateItemCustomizations(editingItem.productId, customizations, customizationCost);
      setEditingItem(null);
    }
  };

  const handleDeliveryTypeChange = (type: 'company' | 'home') => {
    setDeliveryType(type);
    if (type === 'company') {
      setAddressError("");
      setLocalDeliveryAddress("");
      setDeliveryAddress("");
    }
  };

  const handleDeliveryOptionChange = (optionId: string) => {
    const option = deliveryOptions.find(opt => opt.id === optionId);
    if (option) {
      setDeliveryOption(option);
    }
  };

  const validateDeliveryAddress = () => {
    if (cart.deliveryType === 'home' && !localDeliveryAddress.trim()) {
      setAddressError(t("addressRequired"));
      return false;
    }
    setAddressError("");
    return true;
  };

  // Validate required customizations for all cart items
  const validateCustomizations = () => {
    for (const item of cart.items) {
      if (item.questions && item.questions.length > 0) {
        const requiredQuestions = item.questions.filter(q => q.required);
        const currentCustomizations = item.customizations || [];

        for (const question of requiredQuestions) {
          const hasAnswer = currentCustomizations.some(c =>
            c.questionId === question.id && (
              c.answerId ||
              c.textValue?.trim() ||
              c.imagePublicId
            )
          );

          if (!hasAnswer) {
            return {
              isValid: false,
              message: t("missingRequiredCustomization", {
                product: item.name,
                question: question.questionText
              })
            };
          }
        }
      }
    }
    return { isValid: true };
  };

  const handleAddressChange = (address: string) => {
    setLocalDeliveryAddress(address);
    setDeliveryAddress(address);
    if (addressError) setAddressError("");
  };

  const handleGetCurrentLocation = async () => {
    if (!navigator.geolocation) {
      setAddressError(t("geolocationNotSupported"));
      return;
    }

    setIsGettingLocation(true);
    setAddressError("");

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        });
      });

      const { latitude, longitude } = position.coords;

      // Create Google Maps link directly instead of trying to get address name
      const googleMapsUrl = `https://maps.google.com/?q=${latitude},${longitude}`;
      handleAddressChange(googleMapsUrl);
    } catch (error) {
      console.error('Error getting location:', error);
      setAddressError(t("locationAccessDenied"));
    } finally {
      setIsGettingLocation(false);
    }
  };

  // Calculate subtotal (items only)
  const subtotal = cart.items.reduce((sum, item) => {
    const basePrice = item.unitPrice || item.salePrice || item.price;
    const customizationCost = item.customizationCost || 0;
    const itemTotal = (basePrice + customizationCost) * item.quantity;
    return sum + itemTotal;
  }, 0);

  // Show loading state while cart is initializing
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="section-container section-padding px-4 md:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/" passHref>
              <Button variant="ghost" className="text-gray-600 dark:text-gray-300 hover:text-brand-navy dark:hover:!text-brand-gold">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t("backToShopping")}
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold brand-heading dark:text-white">{t("title")}</h1>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-32 mt-2"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                  <div className="flex gap-4">
                    <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/4"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 sticky top-4">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2 mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </div>
                <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mt-6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="section-container section-padding px-4 md:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link href="/" passHref>
              <Button variant="ghost" className="text-gray-600 dark:text-gray-300 hover:text-brand-navy dark:hover:!text-brand-gold">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t("backToShopping")}
              </Button>
            </Link>
          </div>

          {/* Empty Cart */}
          <div className="max-w-md mx-auto text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
              <ShoppingCart className="w-10 h-10 text-gray-400 dark:text-gray-500" />
            </div>
            <h2 className="text-2xl font-bold mb-4 brand-heading dark:text-white">{t("emptyCart")}</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">{t("emptyCartDescription")}</p>
            <Link href="/" passHref>
              <Button className="btn-primary">
                {t("startShopping")}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="section-container section-padding px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/" passHref>
              <Button variant="ghost" className="text-gray-600 dark:text-gray-300 hover:text-brand-navy dark:hover:text-brand-gold">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t("backToShopping")}
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold brand-heading dark:text-white">{t("title")}</h1>
              <p className="text-gray-600 dark:text-gray-300">
                {t("itemsCount", { count: cart.totalItems })}
              </p>
            </div>
          </div>

          {cart.items.length > 0 && (
            <Button
              variant="outline"
              onClick={handleClearCart}
              disabled={isClearing}
              className="text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              {isClearing ? t("clearing") : t("clearCart")}
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <CartItemComponent
                key={`${item.productId}-${JSON.stringify(item.customizations)}`}
                item={item}
                onEditCustomizations={handleEditCustomizations}
              />
            ))}

            {/* Delivery Options */}
            <Card className="mt-6 dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                  <Truck className="w-5 h-5 text-brand-gold" />
                  {t("deliveryOptions")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <RadioGroup
                  value={cart.deliveryType}
                  onValueChange={handleDeliveryTypeChange}
                  className="space-y-4"
                  dir={dir}
                >
                  {/* Company Pickup */}
                  <div className="flex items-center gap-3 border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <RadioGroupItem value="company" id="company" />
                    <Label htmlFor="company" className="flex-1 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Building className="w-5 h-5 text-brand-navy dark:text-brand-gold" />
                          <div className="text-start rtl:text-right">
                            <div className="font-medium text-gray-900 dark:text-gray-100">{t("pickupFromCompany")}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-300">{t("pickupFromCompanyDesc")}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">{t("free")}</Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.preventDefault();
                              window.open(companyMapUrl, '_blank');
                            }}
                            className="text-brand-navy dark:!text-brand-gold hover:text-brand-gold dark:hover:text-brand-gold/80"
                          >
                            <MapPin className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1" />
                            <ExternalLink className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </Label>
                  </div>

                  {/* Home Delivery */}
                  <div className="flex items-center gap-3 border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <RadioGroupItem value="home" id="home" />
                    <Label htmlFor="home" className="flex-1 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Truck className="w-5 h-5 text-brand-navy dark:!text-brand-gold" />
                          <div className="text-start rtl:text-right">
                            <div className="font-medium text-gray-900 dark:text-gray-100">{t("homeDelivery")}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-300">{t("homeDeliveryDesc")}</div>
                          </div>
                        </div>
                        {cart.deliveryType === 'home' && cart.selectedDeliveryOption && (
                          <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800">
                            {cart.selectedDeliveryOption.cost.toFixed(2)} ﷼
                          </Badge>
                        )}
                      </div>
                    </Label>
                  </div>
                </RadioGroup>

                {/* Delivery Options Selection */}
                {cart.deliveryType === 'home' && deliveryOptions.length > 0 && (
                  <div className="mt-4 pl-8 rtl:pl-0 rtl:pr-8">
                    <Label className="text-sm font-medium mb-2 block text-start rtl:text-right text-gray-700 dark:text-gray-300">
                      {t("selectDeliveryOption")}:
                    </Label>
                    <Select
                      value={cart.selectedDeliveryOption?.id || ""}
                      onValueChange={handleDeliveryOptionChange}
                      dir={dir}
                    >
                      <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:border-brand-gold focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 transition-colors text-start rtl:text-right text-gray-900 dark:text-gray-100">
                        <SelectValue placeholder={t("chooseDeliveryOption")} />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 shadow-lg rounded-lg">
                        {deliveryOptions.map((option) => (
                          <SelectItem
                            key={option.id}
                            value={option.id!}
                            className="hover:bg-brand-gold/10 dark:hover:bg-brand-gold/20 focus:bg-brand-gold/10 dark:focus:bg-brand-gold/20 cursor-pointer p-3"
                          >
                            <div className="flex items-center justify-between w-full">
                              <div className="flex-1 text-start rtl:text-right">
                                <div className="font-medium text-gray-900 dark:text-gray-100">{option.name}</div>
                                {option.description && (
                                  <div className="text-xs text-gray-600 dark:text-gray-300 mt-1">{option.description}</div>
                                )}
                                {option.estimatedDays && (
                                  <div className="text-xs text-brand-gold mt-1">
                                    {t("estimatedDays", { days: option.estimatedDays })}
                                  </div>
                                )}
                              </div>
                              <div className="ml-4 rtl:ml-0 rtl:mr-4 text-right rtl:text-left">
                                <span className="font-bold text-brand-navy dark:!text-brand-gold">
                                  {option.cost.toFixed(2)} ﷼
                                </span>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  {t("deliveryCost")}
                                </div>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Delivery Address */}
                {cart.deliveryType === 'home' && (
                  <div className="mt-4 space-y-3">
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-brand-gold" />
                        {t("deliveryAddress")} <span className="text-red-500 dark:text-red-400">*</span>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleGetCurrentLocation}
                        disabled={isGettingLocation}
                        className="text-xs h-8 px-3 border-brand-gold dark:border-brand-gold text-brand-navy dark:!text-brand-gold hover:bg-brand-gold/10 dark:hover:bg-brand-gold/20"
                      >
                        <Navigation className={`w-3 h-3 mr-1 rtl:mr-0 rtl:ml-1 ${isGettingLocation ? 'animate-pulse' : ''}`} />
                        {isGettingLocation ? t("gettingLocation") : t("useMyLocation")}
                      </Button>
                    </Label>
                    <div className="space-y-2">
                      <Textarea
                        placeholder={t("enterDeliveryAddress")}
                        value={localDeliveryAddress}
                        onChange={(e) => handleAddressChange(e.target.value)}
                        className={`min-h-[80px] bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:border-brand-gold focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 transition-colors text-start rtl:text-right text-gray-900 dark:text-gray-100 ${addressError ? "border-red-500 dark:border-red-500 focus:border-red-500 focus:ring-red-200 dark:focus:ring-red-200" : ""
                          }`}
                        rows={3}
                        dir="auto"
                      />
                      <div className="text-xs text-gray-500 dark:text-gray-400 text-start rtl:text-right">
                        {t("addressHelp")}
                      </div>
                      {addressError && (
                        <Alert variant="destructive" className="py-2">
                          <AlertDescription className="text-sm">
                            {addressError}
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4 dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                  <ShoppingCart className="w-5 h-5 text-brand-gold" />
                  {t("orderSummary")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Summary Items */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-300">{t("subtotal")}:</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">{subtotal.toFixed(2)} ﷼</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-300">{t("delivery")}:</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {cart.deliveryType === 'company' ? (
                        <span className="text-green-600 dark:text-green-400">{t("free")}</span>
                      ) : cart.selectedDeliveryOption ? (
                        `${cart.selectedDeliveryOption.cost.toFixed(2)} ﷼`
                      ) : (
                        t("selectDeliveryOption")
                      )}
                    </span>
                  </div>
                  {cart.deliveryType === 'home' && cart.selectedDeliveryOption && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 pl-4">
                      {cart.selectedDeliveryOption.name}
                      {cart.selectedDeliveryOption.estimatedDays && (
                        <span> - {t("estimatedDays", { days: cart.selectedDeliveryOption.estimatedDays })}</span>
                      )}
                    </div>
                  )}
                  {cart.appliedCoupon && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-300">
                        {t("couponDiscount")} ({cart.appliedCoupon.code}):
                      </span>
                      <span className="font-medium text-green-600 dark:text-green-400">
                        -{cart.appliedCoupon.discountType === 'percentage' ? `${(cart.appliedCoupon.discount / subtotal * 100).toFixed(0)}%` : `﷼${cart.appliedCoupon.discount.toFixed(2)}`}
                      </span>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Coupon Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Tag className="w-5 h-5 text-brand-gold" />
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                      {t('coupon.title')}
                    </h3>
                  </div>

                  {/* Applied Coupon Display */}
                  {cart.appliedCoupon && (
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                          <div>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                                {cart.appliedCoupon.code}
                              </Badge>
                              <div className="flex items-center text-sm text-green-700 dark:text-green-300">
                                {cart.appliedCoupon.discountType === 'percentage' ? (
                                  <>
                                    <Percent className="w-3 h-3 mr-1 rtl:mr-0 rtl:ml-1" />
                                    {(cart.appliedCoupon.discount / subtotal * 100).toFixed(0)}{t('coupon.percentageOff')}
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
                              <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                                {cart.appliedCoupon.description}
                              </p>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            removeCoupon();
                            setCouponCode("");
                          }}
                          className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/20"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Authentication Notice */}
                  {!isAuthenticated && (
                    <Alert className="border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20">
                      <AlertCircle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                      <AlertDescription className="text-orange-800 dark:text-orange-200">
                        {t("errors.authenticationRequired")}
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Coupon Input */}
                  {!cart.appliedCoupon && (
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <Input
                          placeholder={t('coupon.placeholder')}
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              handleApplyCoupon();
                            }
                          }}
                          disabled={couponStatus.isValidating || !isAuthenticated}
                          className="flex-1 text-start rtl:text-right bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                          dir="auto"
                        />
                        <Button
                          onClick={handleApplyCoupon}
                          disabled={!couponCode.trim() || couponStatus.isValidating || !isAuthenticated}
                          className="px-6"
                        >
                          {couponStatus.isValidating ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            t('coupon.apply')
                          )}
                        </Button>
                      </div>

                      {/* Error Message */}
                      {couponStatus.error && (
                        <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                          <AlertCircle className="w-4 h-4" />
                          {couponStatus.error}
                        </div>
                      )}

                      {/* Help Text */}
                      <p className="text-xs text-gray-500 dark:text-gray-400 text-start rtl:text-right">
                        {t('coupon.helpText')}
                      </p>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Total */}
                <div className="flex justify-between">
                  <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">{t("total")}:</span>
                  <span className="text-xl font-bold text-brand-navy dark:!text-brand-gold">
                    {cart.totalPrice?.toFixed(2)} ﷼
                  </span>
                </div>

                {/* Address Validation Warning */}
                {cart.deliveryType === 'home' && !localDeliveryAddress.trim() && (
                  <Alert className="border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20">
                    <MapPin className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                    <AlertDescription className="text-orange-800 dark:text-orange-200">
                      {t("addressRequired")}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Customization Validation Warning */}
                {(() => {
                  const customizationValidation = validateCustomizations();
                  if (!customizationValidation.isValid) {
                    return (
                      <Alert className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
                        <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                        <AlertDescription className="text-red-800 dark:text-red-200">
                          {customizationValidation.message}
                        </AlertDescription>
                      </Alert>
                    );
                  }
                  return null;
                })()}

                {/* Checkout Button */}
                <Button
                  className="w-full btn-primary"
                  size="lg"
                  disabled={
                    isCreatingOrder ||
                    (cart.deliveryType === 'home' && !localDeliveryAddress.trim()) ||
                    !validateCustomizations().isValid
                  }
                  onClick={handleCheckout}
                >
                  {isCreatingOrder ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                  <CreditCard className="w-4 h-4 mr-2" />
                  )}
                  {isCreatingOrder ? t("creatingOrder") : t("proceedToCheckout")}
                </Button>

                {/* Security Info */}
                <Alert className="bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600">
                  <AlertDescription className="text-xs text-center text-gray-600 dark:text-gray-300">
                    {t("secureCheckout")}
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Edit Customization Modal */}
        {editingItem && (
          <EditCustomizationModal
            isOpen={!!editingItem}
            onClose={() => setEditingItem(null)}
            cartItem={editingItem}
            onSave={handleSaveCustomizations}
          />
        )}
      </div>
    </div>
  );
}