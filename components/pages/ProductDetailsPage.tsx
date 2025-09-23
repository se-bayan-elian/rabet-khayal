"use client"

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslations ,useLocale} from "next-intl";
import { useProductQuery, ProductItem, ProductQuestion, useRelatedProductsQuery, useProductReviewsQuery } from "@/services";
import { useCartStore } from "@/store/cart-api";
import { useWishlistStore } from "@/store/wishlist";
import { AddToCartModal } from "@/components/cart/AddToCartModal";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import ReviewsList from "@/components/reviews/ReviewsList";
import AddReviewModal from "@/components/reviews/AddReviewModal";
import EnhancedProductCard from "@/components/products/EnhancedProductCard";
import ProductCustomizationModal from "@/components/products/ProductCustomizationModal";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ImageUpload } from "@/components/ui/image-upload";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  ArrowLeft,
  Heart,
  ShoppingCart,
  Share2,
  Star,
  AlertCircle,
  CheckCircle,
  Upload,
  Tag,
  Weight,
  Package,
  MessageSquare,
  Eye,
  Plus,
  X,
  ZoomIn
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Dynamic schema builder based on product questions
const buildValidationSchema = (questions: ProductQuestion[]) => {
  const schemaObject: Record<string, z.ZodTypeAny> = {};

  questions.forEach((question) => {
    const fieldName = `question_${question.id}`;

    switch (question.type) {
      case 'select':
        if (question.required) {
          schemaObject[fieldName] = z.string().min(1, "Please select an option");
        } else {
          schemaObject[fieldName] = z.string().optional();
        }
        break;
      case 'text':
        if (question.required) {
          schemaObject[fieldName] = z.string().min(1, "Please enter text");
        } else {
          schemaObject[fieldName] = z.string().optional();
        }
        break;
      case 'note':
        if (question.required) {
          schemaObject[fieldName] = z.string().min(1, "Please add a note");
        } else {
          schemaObject[fieldName] = z.string().optional();
        }
        break;
      case 'checkbox':
        if (question.required) {
          schemaObject[fieldName] = z.array(z.string()).min(1, "Please select at least one option");
        } else {
          schemaObject[fieldName] = z.array(z.string()).optional();
        }
        break;
      case 'image':
        if (question.required) {
          schemaObject[fieldName] = z.union([
            z.string().min(1, "Please upload an image"),
            z.object({
              url: z.string(),
              publicId: z.string()
            })
          ]).refine((value) => {
            if (typeof value === 'string') {
              return value.length > 0;
            }
            return value && value.url && value.publicId;
          }, {
            message: "Please upload an image"
          });
        } else {
          schemaObject[fieldName] = z.union([
            z.string(),
            z.object({
              url: z.string(),
              publicId: z.string()
            }),
            z.undefined()
          ]).optional();
        }
        break;
    }
  });

  return z.object(schemaObject);
};

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const t = useTranslations("productDetails");
  const tCart = useTranslations("cart");
  const { productId } = params;
  const locale = useLocale();
  const dir = locale === "ar" ? "rtl" : "ltr";
  const [showCartModal, setShowCartModal] = useState(false);
  const [cartModalProduct, setCartModalProduct] = useState<any>(null);
  const [cartModalQuantity, setCartModalQuantity] = useState(1);
  const [quantity, setQuantity] = useState(1);
  const [showAddReviewModal, setShowAddReviewModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // TODO: Get from auth context

  const { data: product, isLoading, error } = useProductQuery(productId as string);
  const { addToCart, isLoading: cartLoading } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  // Related products
  const { data: relatedProducts = [] } = useRelatedProductsQuery(productId as string, 6);

  // Reviews
  const { data: reviewsData } = useProductReviewsQuery(productId as string, {
    page: 1,
    limit: 5,
    sort: 'newest'
  });

  // Build validation schema dynamically
  const validationSchema = product?.questions ? buildValidationSchema(product.questions) : z.object({});

  const { control, handleSubmit, watch, formState: { errors } } = useForm<any>({
    resolver: zodResolver(validationSchema),
    defaultValues: {}
  });

  const watchedValues = watch();

  // Calculate total price with extras
  const calculateTotalPrice = () => {
    if (!product) return 0;

    const basePrice = product.discountedPrice ?
      parseFloat(product.discountedPrice) : parseFloat(product.originalPrice);

    let extraCost = 0;

    product.questions?.forEach((question) => {
      const fieldName = `question_${question.id}`;
      const selectedValue = watchedValues[fieldName];

      if (selectedValue) {
        if (question.type === 'checkbox' && Array.isArray(selectedValue)) {
          selectedValue.forEach((answerId: string) => {
            const answer = question.answers.find(a => a.id === answerId);
            if (answer) extraCost += parseFloat(answer.extraPrice.toString());
          });
        } else if (typeof selectedValue === 'string') {
          const answer = question.answers.find(a => a.id === selectedValue);
          if (answer) extraCost += parseFloat(answer.extraPrice.toString());
        }
      }
    });

    return (basePrice + extraCost) * quantity;
  };

  const isWishlisted = product ? isInWishlist(product.id) : false;

  const handleAddToCart = async (formData: any) => {
    if (!product) return;

    try {
      // Prepare customization data from form responses
      const customizations: Array<{
        questionId: string;
        answerId?: string;
        textValue?: string;
        imagePublicId?: string;
      }> = [];

      product.questions?.forEach((question) => {
        const fieldName = `question_${question.id}`;
        const selectedValue = formData[fieldName];

        if (selectedValue) {
          if (question.type === 'checkbox' && Array.isArray(selectedValue)) {
            selectedValue.forEach((answerId: string) => {
              customizations.push({
                questionId: question.id,
                answerId: answerId,
              });
            });
          } else if (question.type === 'select') {
            customizations.push({
              questionId: question.id,
              answerId: selectedValue,
            });
          } else if (question.type === 'text' || question.type === 'note') {
            customizations.push({
              questionId: question.id,
              textValue: selectedValue,
            });
          } else if (question.type === 'image') {
            let imageValue;
            if (typeof selectedValue === 'object' && selectedValue) {
              // New format: object with url and publicId
              imageValue = selectedValue.publicId;
            } else if (typeof selectedValue === 'string' && selectedValue) {
              // Old format: just string (could be URL or publicId)
              imageValue = selectedValue;
            }

            if (imageValue) {
              customizations.push({
                questionId: question.id,
                imagePublicId: imageValue,
              });
            }
          }
        }
      });

      // Calculate customization cost
      let customizationCost = 0;
      customizations.forEach((customization) => {
        if (customization.answerId) {
          // Find the question and answer to get the extra price
          const question = product.questions?.find(q => q.id === customization.questionId);
          if (question) {
            const answer = question.answers.find(a => a.id === customization.answerId);
            if (answer) {
              customizationCost += parseFloat(answer.extraPrice.toString());
            }
          }
        }
      });

      const cartItem = {
        id: product.id, // Required by CartItem interface
        productId: product.id,
        name: product.name,
        description: product.description || product.subcategory?.description || "",
        price: parseFloat(product.originalPrice),
        salePrice: product.discountedPrice ? parseFloat(product.discountedPrice) : undefined,
        unitPrice: product.discountedPrice ? parseFloat(product.discountedPrice) : parseFloat(product.originalPrice),
        imageUrl: product.imageUrl || undefined,
        customizations, // Include the form responses
        customizationCost, // Include the calculated cost
        questions: product.questions || [], // Store questions for editing
      };

      await addToCart(cartItem, quantity);

      setCartModalProduct(cartItem);
      setCartModalQuantity(quantity);
      setShowCartModal(true);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  const handleWishlistToggle = () => {
    if (!product) return;

    const wishlistItem = {
      id: product.id,
      name: product.name,
      description: product.description || product.subcategory?.description || "",
      price: parseFloat(product.originalPrice),
      salePrice: product.discountedPrice ? parseFloat(product.discountedPrice) : undefined,
      imageUrl: product.imageUrl || undefined,
      addedAt: new Date().toISOString(),
    };

    toggleWishlist(wishlistItem);
  };

  const handleShare = async () => {
    if (!product) return;

    const shareUrl = window.location.href;
    const shareData = {
      title: product.name,
      text: product.description || product.subcategory?.description || "",
      url: shareUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(shareUrl);
        // You might want to show a toast notification here
        alert(t("share.linkCopied") || "Link copied to clipboard!");
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="section-container section-padding px-4 md:px-6 lg:px-8">
          <Skeleton className="h-6 w-24 mb-6 bg-gray-200 dark:bg-gray-700" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Skeleton className="aspect-square rounded-2xl bg-gray-200 dark:bg-gray-700" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4 bg-gray-200 dark:bg-gray-700" />
              <Skeleton className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700" />
              <Skeleton className="h-24 w-full bg-gray-200 dark:bg-gray-700" />
              <Skeleton className="h-12 w-32 bg-gray-200 dark:bg-gray-700" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="section-container text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-2xl font-bold mb-4 brand-heading dark:text-white">{t("notFound")}</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">{t("notFoundDesc")}</p>
            <Button onClick={() => router.back()} className="btn-primary">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t("goBack")}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const price = parseFloat(product.originalPrice);
  const salePrice = product.discountedPrice ? parseFloat(product.discountedPrice) : undefined;
  const isOnSale = salePrice && salePrice < price;
  const finalPrice = isOnSale ? salePrice! : price;
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="section-container section-padding px-4 md:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="text-gray-600 hover:text-brand-gold dark:text-gray-300 dark:hover:text-amber-400"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t("actions.backToProducts")}
          </Button>
        </div>

        <form onSubmit={handleSubmit(handleAddToCart)}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-6 md:px-6 lg:px-8">
            {/* Product Image */}
            <div className="space-y-4">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
                {product.imageUrl ? (
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                    <Package className="w-24 h-24 text-gray-400 dark:text-gray-500" />
                  </div>
                )}

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {isOnSale && (
                    <Badge className="bg-red-500 text-white font-bold">
                      {t("details.sale")}
                    </Badge>
                  )}
                  {product.isFeatured && (
                    <Badge className="bg-brand-gold text-brand-navy font-bold">
                      {t("details.featured")}
                    </Badge>
                  )}
                </div>

                {/* Action buttons */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    className="w-10 h-10 rounded-full bg-white/90 hover:bg-white dark:bg-gray-800/90 dark:hover:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-600"
                    onClick={handleWishlistToggle}
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-700 dark:text-gray-300'}`} />
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    className="w-10 h-10 rounded-full bg-white/90 hover:bg-white dark:bg-gray-800/90 dark:hover:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-600"
                    onClick={handleShare}
                  >
                    <Share2 className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              {/* Basic Info */}
              <div>
                <h1 className="text-3xl md:text-4xl font-bold brand-heading dark:text-amber-100 mb-2">
                  {product.name}
                </h1>

                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-brand-navy dark:!text-amber-300">
                      {finalPrice.toFixed(2)} ﷼
                    </span>
                    {isOnSale && (
                      <span className="text-lg text-gray-500 dark:text-gray-400 line-through">
                        {price.toFixed(2)} ﷼
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-sm font-medium text-green-700 dark:text-green-400">
                      {t("stock.inStock")}
                    </span>
                  </div>
                </div>

                {/* Product Details */}
                <div className="flex flex-wrap gap-4 mb-4">
                  {product.subcategory && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Tag className="w-4 h-4" />
                      <span>{t("details.category")}: {product.subcategory.name}</span>
                    </div>
                  )}
                </div>

                {(product.description || product.subcategory?.description) && (
                  <div
                    className="text-gray-600 dark:text-gray-400 leading-relaxed prose prose-sm max-w-none html-content"
                    dangerouslySetInnerHTML={{
                      __html: product.description || product.subcategory?.description || ""
                    }}
                  />
                )}
              </div>




            </div>
            {/* Flex container for quantity/actions and questions cards on large screens */}
          </div>
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 space-y-6 lg:space-y-0 md:px-6 lg:px-8">


            {/* Product Questions Card */}
            {product.questions && product.questions.length > 0 && (
              <Card className="lg:flex-1 border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-800">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-brand-navy dark:!text-amber-400">
                    <CheckCircle className="w-5 h-5 text-brand-gold dark:text-amber-400" />
                    {t("questions.title")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 pt-0">
                  {product.questions.map((question) => {
                    const fieldName = `question_${question.id}`;
                    const error = errors[fieldName];

                    return (
                      <div key={question.id} className="space-y-3">
                        <Label className="text-sm font-medium flex items-center gap-2 dark:text-gray-300">
                          {question.questionText}
                          {question.required ? (
                            <Badge variant="destructive" className="text-xs bg-red-500 text-white">
                              {t("questions.required")}
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="text-xs bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-300">
                              {t("questions.optional")}
                            </Badge>
                          )}
                        </Label>

                        {question.type === 'select' && (
                          <Controller
                            name={fieldName}
                            control={control}
                            render={({ field }) => (
                              <Select onValueChange={field.onChange} value={field.value} dir={dir}>
                                <SelectTrigger className={`bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:border-brand-gold focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/20 text-gray-900 dark:text-white ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""}`}>
                                  <SelectValue placeholder={t("questions.selectOption")} />
                                </SelectTrigger>
                                <SelectContent className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 shadow-lg">
                                  {question.answers.map((answer) => (
                                    <SelectItem
                                      key={answer.id}
                                      value={answer.id}
                                      className="hover:bg-brand-gold/10 focus:bg-brand-gold/10 dark:hover:bg-amber-400/10 dark:focus:bg-amber-400/10 text-gray-900 dark:text-white"
                                    >
                                      <div className="flex items-center justify-between w-full">
                                        <span>{answer.answerText}</span>
                                        {parseFloat(answer.extraPrice.toString()) > 0 && (
                                          <span className="text-xs text-brand-gold dark:text-amber-400 ml-2 font-medium">
                                            {" "} + {parseFloat(answer.extraPrice.toString()).toFixed(2)} ﷼
                                          </span>
                                        )}
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                          />
                        )}

                        {question.type === 'text' && (
                          <Controller
                            name={fieldName}
                            control={control}
                            render={({ field }) => (
                              <Input
                                {...field}
                                placeholder={t("questions.enterText")}
                                className={`bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:border-brand-gold focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/20 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""}`}
                              />
                            )}
                          />
                        )}

                        {question.type === 'note' && (
                          <Controller
                            name={fieldName}
                            control={control}
                            render={({ field }) => (
                              <Textarea
                                {...field}
                                placeholder={t("questions.addNote")}
                                className={`bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:border-brand-gold focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/20 resize-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""}`}
                                rows={3}
                              />
                            )}
                          />
                        )}

                        {question.type === 'checkbox' && (
                          <Controller
                            name={fieldName}
                            control={control}
                            render={({ field }) => (
                              <div className="space-y-2">
                                {question.answers.map((answer) => (
                                  <div key={answer.id} className="flex items-center space-x-2">
                                    <Checkbox
                                      id={`${fieldName}_${answer.id}`}
                                      checked={field.value?.includes(answer.id)}
                                      onCheckedChange={(checked) => {
                                        const current = field.value || [];
                                        if (checked) {
                                          field.onChange([...current, answer.id]);
                                        } else {
                                          field.onChange(current.filter((id: string) => id !== answer.id));
                                        }
                                      }}
                                    />
                                    <Label
                                      htmlFor={`${fieldName}_${answer.id}`}
                                      className="text-sm font-normal flex items-center gap-2 dark:text-gray-300"
                                    >
                                      {answer.answerText}
                                      {parseFloat(answer.extraPrice.toString()) > 0 && (
                                        <span className="text-xs text-brand-gold dark:text-amber-400">
                                          +﷼{parseFloat(answer.extraPrice.toString()).toFixed(2)}
                                        </span>
                                      )}
                                    </Label>
                                  </div>
                                ))}
                              </div>
                            )}
                          />
                        )}

                        {question.type === 'image' && (
                          <Controller
                            name={fieldName}
                            control={control}
                            render={({ field }) => {
                              // Handle both URL and publicId - store as object to maintain both
                              const currentValue = field.value;
                              let imageUrl, imagePublicId;

                              if (typeof currentValue === 'object' && currentValue) {
                                imageUrl = currentValue.url;
                                imagePublicId = currentValue.publicId;
                              } else if (typeof currentValue === 'string' && currentValue.startsWith('http')) {
                                imageUrl = currentValue;
                              } else if (typeof currentValue === 'string' && currentValue) {
                                imagePublicId = currentValue;
                              }

                              return (
                                <ImageUpload
                                  imageUrl={imageUrl}
                                  imagePublicId={imagePublicId}
                                  onImageChange={(url, publicId) => {
                                    // Store both URL and publicId for preview and submission
                                    field.onChange({ url, publicId });
                                  }}
                                  placeholder={t("uploadImage")}
                                  folder="product-question-images"
                                  required={question.required}
                                  error={error?.message as string}
                                />
                              );
                            }}
                          />
                        )}

                        {error && question.type !== 'image' && (
                          <Alert variant="destructive" className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
                            <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                            <AlertDescription className="text-red-700 dark:text-red-300">
                              {error?.message as string}
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            )}
            {/* Quantity and Actions Card */}
            <Card className="lg:flex-1 border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-800">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-brand-navy dark:!text-amber-400">
                  <ShoppingCart className="w-5 h-5 text-brand-gold dark:text-amber-400" />
                  {t("actions.orderDetails")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-0">
                {/* Quantity Controls */}
                <div className="flex items-center gap-4">
                  <Label htmlFor="quantity" className="text-sm font-medium dark:text-gray-300">
                    {t("quantity.label")}:
                  </Label>
                  <div className="flex items-center border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 hover:bg-brand-gold/10 text-gray-700 hover:text-brand-gold dark:text-gray-300 dark:hover:text-amber-400"
                    >
                      -
                    </Button>
                    <span className="px-4 py-2 min-w-[3rem] text-center font-medium dark:text-white">{quantity}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 hover:bg-brand-gold/10 text-gray-700 hover:text-brand-gold dark:text-gray-300 dark:hover:text-amber-400"
                    >
                      +
                    </Button>
                  </div>
                </div>

                {/* Total Price */}
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center justify-between text-lg font-semibold">
                    <span className="dark:text-gray-300">{t("price.totalPrice")}:</span>
                    <span className="text-brand-navy dark:!text-amber-300">{calculateTotalPrice().toFixed(2)} ﷼</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-2">
                  <Button
                    type="submit"
                    disabled={cartLoading}
                    className="flex-1 btn-primary"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    {cartLoading ? "Adding..." : t("actions.addToCart")}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleWishlistToggle}
                    className="border-brand-gold text-brand-navy hover:bg-brand-gold/10 dark:!border-amber-400 dark:!text-amber-400 dark:hover:bg-amber-400/10"
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </form>

        {/* Add to Cart Modal */}
        {/* Reviews Section */}
        {product && (
          <section className=" mx-auto md:px-6 lg:px-8 py-12  " id="reviews">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold brand-heading dark:text-amber-100">{t('reviews.title')}</h2>
              <Button
                onClick={() => setShowAddReviewModal(true)}
                className="btn-primary"
              >
                <Plus className="w-4 h-4 mr-2" />
                {t('reviews.addReview')}
              </Button>
            </div>
            <ReviewsList productId={product.id} />
          </section>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="max-w-6xl mx-auto px-4 py-12 border-t border-gray-200 dark:border-gray-700">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold brand-heading dark:text-amber-100 mb-4">{t('relatedProducts')}</h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg">{t('relatedProductsDesc')}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct: ProductItem) => (
                <EnhancedProductCard
                  key={relatedProduct.id}
                  product={relatedProduct}
                  showQuickActions={true}
                />
              ))}
            </div>
          </section>
        )}

        {/* Modals */}
        <AddToCartModal
          isOpen={showCartModal}
          onClose={() => setShowCartModal(false)}
          product={cartModalProduct}
          quantity={cartModalQuantity}
          totalPrice={calculateTotalPrice()}
        />

        {product && (
          <AddReviewModal
            isOpen={showAddReviewModal}
            onClose={() => setShowAddReviewModal(false)}
            productId={product.id}
            isAuthenticated={isAuthenticated}
            onAuthRequired={() => {
              // Handle authentication required - redirect to login or show auth modal
              alert('Please login to add a review')
            }}
          />
        )}
      </div>
    </div>
  );
}