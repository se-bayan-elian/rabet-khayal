"use client"

import { useState, useEffect, useMemo, useCallback } from "react";
import { useParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useProductsBySubCategoryQuery, useProductsQuery, ProductItem as APIProductItem } from "@/services";
import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "@/lib/axios";
import { useCartStore } from "@/store/cart-api";
import { useWishlistStore } from "@/store/wishlist";
import { AddToCartModal } from "@/components/cart/AddToCartModal";
import { AddToCartWithQuestionsModal } from "@/components/cart/AddToCartWithQuestionsModal";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  Search,
  Filter,
  Heart,
  ShoppingCart,
  Eye,
  Star,
  AlertCircle,
  RefreshCw,
  SlidersHorizontal,
  X,
  ChevronRight
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Using ProductItem from @/services

// Filter Panel Component - Separate component to prevent re-creation
const FilterPanel = ({ 
  filters, 
  t, 
  handleFilterChange, 
  handleClearFilters, 
  handleApplyFilters,
  isMobile = false ,
  dir = "ltr"
}: {
  filters: FilterState;
  t: any;
  handleFilterChange: (field: keyof FilterState, value: any) => void;
  handleClearFilters: () => void;
  handleApplyFilters: () => void;
  isMobile?: boolean;
  dir?: "ltr" | "rtl";
}) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-semibold brand-heading dark:text-white">{t("filters.title")}</h3>
      <Button variant="ghost" size="sm" onClick={handleClearFilters} className="text-brand-gold hover:bg-brand-gold/10 dark:text-amber-400 dark:hover:bg-amber-400/10">
        <X className="w-4 h-4 mr-1" />
        {t("filters.clear")}
      </Button>
    </div>

    {/* Search */}
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t("filters.search")}</label>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
        <Input
          placeholder={t("filters.search")}
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          className="pl-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100"
        />
      </div>
    </div>

    {/* Price Range */}
    <div className="space-y-4">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t("filters.priceRange")}</label>
      <div className="px-2">
        <Slider
          value={[filters.minPrice, filters.maxPrice]}
          onValueChange={([min, max]) => {
            handleFilterChange('minPrice', min);
            handleFilterChange('maxPrice', max);
          }}
          dir={dir}
          max={10000}
          min={0}
          step={50}
          className="w-full"
        />
      </div>
      <div className="flex gap-2">
        <div className="flex-1">
          <label className="text-xs text-gray-500 dark:text-gray-400">{t("filters.minPrice")}</label>
          <Input
            type="number"
            value={filters.minPrice}
            onChange={(e) => handleFilterChange('minPrice', Number(e.target.value))}
            className="mt-1 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>
        <div className="flex-1">
          <label className="text-xs text-gray-500 dark:text-gray-400">{t("filters.maxPrice")}</label>
          <Input
            type="number"
            value={filters.maxPrice}
            onChange={(e) => handleFilterChange('maxPrice', Number(e.target.value))}
            className="mt-1 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>
      </div>
    </div>

    {/* Sort By */}
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t("filters.sortBy")}</label>
      <Select dir={dir} value={filters.sortBy} onValueChange={(value) => handleFilterChange('sortBy', value)}>
        <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <SelectItem value="newest" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">{t("filters.sortOptions.newest")}</SelectItem>
          <SelectItem value="oldest" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">{t("filters.sortOptions.oldest")}</SelectItem>
          <SelectItem value="priceHigh" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">{t("filters.sortOptions.priceHigh")}</SelectItem>
          <SelectItem value="priceLow" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">{t("filters.sortOptions.priceLow")}</SelectItem>
          <SelectItem value="nameAZ" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">{t("filters.sortOptions.nameAZ")}</SelectItem>
          <SelectItem value="nameZA" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">{t("filters.sortOptions.nameZA")}</SelectItem>
        </SelectContent>
      </Select>
    </div>

    {/* Apply Button */}
    <Button onClick={handleApplyFilters} className="w-full btn-primary">
      {t("filters.apply")}
    </Button>
  </div>
);

interface SubcategoryItem {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  iconUrl?: string;
  category?: {
    id: string;
    name: string;
    imageUrl?: string;
  };
}

interface FilterState {
  search: string;
  minPrice: number;
  maxPrice: number;
  sortBy: string;
}

export default function SubcategoryPage() {
  const params = useParams();
  const t = useTranslations("subcategoryPage");
  const tCart = useTranslations("cart");
  const tWishlist = useTranslations("wishlist");
  const { subcategoryId, categoryId } = params;
  const locale = useLocale();
  const dir = locale === "ar" ? "rtl" : "ltr";

  const [filters, setFilters] = useState<FilterState>({
    search: "",
    minPrice: 0,
    maxPrice: 10000,
    sortBy: "newest"
  });

  const [appliedFilters, setAppliedFilters] = useState<FilterState>(filters);
  const [debouncedSearch, setDebouncedSearch] = useState(filters.search);

  // Cart and wishlist modal states
  const [showCartModal, setShowCartModal] = useState(false);
  const [cartModalProduct, setCartModalProduct] = useState<any>(null);
  const [cartModalQuantity, setCartModalQuantity] = useState(1);
  
  // Questions modal state
  const [showQuestionsModal, setShowQuestionsModal] = useState(false);
  const [questionsModalProduct, setQuestionsModalProduct] = useState<any>(null);

  // Store hooks
  const { addToCart, isLoading: cartLoading } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(filters.search);
    }, 300);

    return () => clearTimeout(timer);
  }, [filters.search]);

  // Auto-apply search when debounced search changes
  useEffect(() => {
    if (debouncedSearch !== appliedFilters.search) {
      setAppliedFilters(prev => ({ ...prev, search: debouncedSearch }));
    }
  }, [debouncedSearch, appliedFilters.search]);

  // Fetch subcategory data
  const { data: subcategoryData, isLoading: subcategoryLoading } = useQuery({
    queryKey: ['subcategory', subcategoryId],
    queryFn: async () => {
      const response = await axiosClient.get(`/categories/subcategories/${subcategoryId}`);
      return response.data.data as SubcategoryItem;
    },
    enabled: !!subcategoryId && !!categoryId
  });

  // Build query params for API
  const queryParams = {
    subcategoryId: subcategoryId as string,
    search: debouncedSearch || undefined,
    minPrice: appliedFilters.minPrice > 0 ? appliedFilters.minPrice : undefined,
    maxPrice: appliedFilters.maxPrice < 10000 ? appliedFilters.maxPrice : undefined,
    sort: getSortConfig(appliedFilters.sortBy),
    page: 1,
    limit: 12
  };

  const { data, isLoading, error, refetch } = useProductsBySubCategoryQuery(queryParams);

  // Transform products to add computed properties
  const rawProducts = (data?.data?.data || []) as APIProductItem[];
  const products = rawProducts.map((product: APIProductItem) => ({
    ...product,
    price: parseFloat(product.originalPrice),
    salePrice: product.discountedPrice ? parseFloat(product.discountedPrice) : undefined,
    isInStock: product.isAvailable !== false && (product.stock === undefined || product.stock > 0),
  }));

  const totalCount = data?.data?.meta?.total || 0;

  function getSortConfig(sortBy: string) {
    const sortConfigs: Record<string, any> = {
      newest: [{ field: "createdAt", direction: "DESC" }],
      oldest: [{ field: "createdAt", direction: "ASC" }],
      priceHigh: [{ field: "price", direction: "DESC" }],
      priceLow: [{ field: "price", direction: "ASC" }],
      nameAZ: [{ field: "name", direction: "ASC" }],
      nameZA: [{ field: "name", direction: "DESC" }],
    };
    return JSON.stringify(sortConfigs[sortBy] || sortConfigs.newest);
  }

  const handleApplyFilters = useCallback(() => {
    setAppliedFilters({ ...filters, search: debouncedSearch });
  }, [filters, debouncedSearch]);

  const handleClearFilters = useCallback(() => {
    const clearedFilters = {
      search: "",
      minPrice: 0,
      maxPrice: 10000,
      sortBy: "newest"
    };
    setFilters(clearedFilters);
    setAppliedFilters(clearedFilters);
    setDebouncedSearch("");
  }, []);

  const handleFilterChange = useCallback((field: keyof FilterState, value: any) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleAddToCart = async (product: APIProductItem & { price: number; salePrice?: number; isInStock: boolean }, quantity = 1) => {
    // Check if product has required questions
    const hasRequiredQuestions = product.questions && product.questions.some((q: any) => q.required);
    
    if (hasRequiredQuestions) {
      // Show questions modal
      setQuestionsModalProduct({
        id: product.id,
        name: product.name,
        description: product.description || product.subcategory?.description || "",
        price: parseFloat(product.originalPrice),
        salePrice: product.discountedPrice ? parseFloat(product.discountedPrice) : undefined,
        imageUrl: product.imageUrl || undefined,
        questions: product.questions
      });
      setShowQuestionsModal(true);
    } else {
      // Direct add to cart
    try {
      const cartItem = {
        id: product.id,
        productId: product.id,
        name: product.name,
        description: product.description || product.subcategory?.description || "",
        price: parseFloat(product.originalPrice),
        salePrice: product.discountedPrice ? parseFloat(product.discountedPrice) : undefined,
        unitPrice: product.discountedPrice ? parseFloat(product.discountedPrice) : parseFloat(product.originalPrice),
        imageUrl: product.imageUrl || undefined,
        customizations: [],
        customizationCost: 0,
      };

      await addToCart(cartItem, quantity);

      // Show success modal
      setCartModalProduct(cartItem);
      setCartModalQuantity(quantity);
      setShowCartModal(true);
    } catch (error) {
      console.error('Failed to add to cart:', error);
      }
    }
  };

  const handleWishlistToggle = (product: APIProductItem & { price: number; salePrice?: number; isInStock: boolean }) => {
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

  const handleAddToCartWithQuestions = async (product: any, quantity: number, customizations: any[], customizationCost: number) => {
    try {
      const cartItem = {
        id: product.id,
        productId: product.id,
        name: product.name,
        description: product.description || "",
        price: product.price,
        salePrice: product.salePrice,
        unitPrice: (product.salePrice || product.price) + customizationCost,
        imageUrl: product.imageUrl || undefined,
        customizations: customizations.length > 0 ? customizations : [],
        customizationCost: customizationCost,
        questions: product.questions, // ✅ FIX: Include questions for editing
      };

      console.log('SubcategoryPage: Adding to cart with customizations:', {
        productId: product.id,
        customizations,
        customizationCost,
        questions: product.questions
      });

      await addToCart(cartItem, quantity);

      // Show success modal
      setCartModalProduct(cartItem);
      setCartModalQuantity(quantity);
      setShowCartModal(true);
      setShowQuestionsModal(false);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };


  // Render stars function
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star 
            key={star}
            className={`w-3 h-3 ${
              star <= rating ? 'fill-yellow-400 text-yellow-400 dark:fill-amber-400 dark:text-amber-400' : 'text-gray-300 dark:text-gray-500'
            }`}
          />
        ))}
      </div>
    )
  }

  // Product Card Component
  const ProductCard = ({ product }: { product: APIProductItem & { price: number; salePrice?: number; isInStock: boolean } }) => {
    const price = parseFloat(product.originalPrice);
    const salePrice = product.discountedPrice ? parseFloat(product.discountedPrice) : undefined;
    const isOnSale = salePrice && salePrice < price;
    const finalPrice = isOnSale ? salePrice! : price;
    const isWishlisted = isInWishlist(product.id);
    const averageRating = product.averageRating || 0;
    const reviewCount = product.reviewCount || 0;

    return (
      <Card className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl dark:hover:shadow-gray-900/50 transition-all duration-500 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 border border-gray-200/50 dark:border-gray-700/50 hover:border-brand-gold/30 dark:hover:border-amber-400/30">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200 dark:from-gray-800 dark:via-gray-700 dark:to-gray-900">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-brand-gold/20 via-brand-navy/10 to-brand-gold/20 dark:from-amber-400/20 dark:via-gray-700 dark:to-amber-400/20 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-gold to-brand-navy dark:from-amber-400 dark:to-gray-600 shadow-lg" />
            </div>
          )}

          {/* Enhanced overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Subtle border gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-brand-gold/10 via-transparent to-brand-navy/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Action buttons */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
            <Button
              size="sm"
              variant="secondary"
              className="w-9 h-9 rounded-full bg-white/95 hover:bg-white shadow-lg backdrop-blur-sm border border-gray-200/50 hover:border-red-300 hover:shadow-red-100/50 dark:bg-gray-800/95 dark:hover:bg-gray-700 dark:border-gray-600/50 dark:hover:border-red-400/50"
              onClick={() => handleWishlistToggle(product)}
            >
              <Heart className={`w-4 h-4 transition-colors ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-700 hover:text-red-500 dark:text-gray-300 dark:hover:text-red-400'}`} />
            </Button>
            <Link href={`/products/${product.id}`}>
              <Button
                size="sm"
                variant="secondary"
                className="w-9 h-9 rounded-full bg-white/95 hover:bg-white shadow-lg backdrop-blur-sm border border-gray-200/50 hover:border-brand-gold/50 hover:shadow-brand-gold/20 dark:bg-gray-800/95 dark:hover:bg-gray-700 dark:border-gray-600/50 dark:hover:border-amber-400/50"
              >
                <Eye className="w-4 h-4 text-gray-700 hover:text-brand-navy dark:text-gray-300 dark:hover:text-amber-400 transition-colors" />
              </Button>
            </Link>
          </div>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            {isOnSale && (
              <Badge className="bg-gradient-to-r justify-center from-red-500 to-red-600 text-white font-bold px-3 py-1.5 text-xs shadow-lg border border-red-400/30">
                {t("products.sale")}
              </Badge>
            )}
            {product.isFeatured && (
              <Badge className="bg-gradient-to-r from-brand-gold to-yellow-400 text-brand-navy font-bold px-3 py-1.5 text-xs justify-center shadow-lg border border-yellow-300/30 dark:from-amber-400 dark:to-yellow-400 dark:text-gray-900 dark:border-amber-300/60 dark:shadow-amber-400/20">
                {t("products.featured")}
              </Badge>
            )}
            {!product.isInStock && (
              <Badge variant="secondary" className="bg-gradient-to-r from-gray-500 to-gray-600 text-white font-bold px-3 py-1.5 text-xs shadow-lg border border-gray-400/30">
                {t("products.outOfStock")}
              </Badge>
            )}
          </div>

          {/* Quick add to cart */}
          <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            <Button
              className="w-full bg-brand-navy hover:bg-brand-navy-light text-white font-semibold py-2.5 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:hover:bg-gray-700"
              disabled={!product.isInStock || cartLoading}
              onClick={() => handleAddToCart(product)}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              {cartLoading ? t("products.adding") : tCart("addToCart")}
            </Button>
          </div>
        </div>

        {/* Product Info */}
        <CardContent className="p-5 space-y-4 bg-gradient-to-b from-transparent to-gray-50/50 dark:to-gray-800/50">
          <div>
            <Link href={`/products/${product.id}`}>
              <h3 className="font-bold text-gray-900 dark:text-white line-clamp-2 group-hover:text-brand-gold dark:group-hover:text-amber-400 transition-colors cursor-pointer hover:underline text-lg leading-tight">
                {product.name}
              </h3>
            </Link>
            {product.description ? (
              <div
                className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mt-2 html-content leading-relaxed"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            ) : (
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mt-2 leading-relaxed">
                {product.subcategory?.description || product.name}
              </p>
            )}
          </div>

          {/* Reviews */}
          <div className="flex items-center gap-2">
            {renderStars(averageRating)}
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {reviewCount > 0 
                ? `${(+averageRating).toFixed(1)} (${reviewCount})`
                : t('products.noReviews')
              }
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-3">
            <span className="text-2xl font-black text-brand-navy dark:!text-amber-300">
              {finalPrice?.toFixed(2)} ﷼
            </span>
            {isOnSale && (
              <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                {price.toFixed(2)} ﷼
              </span>
            )}
          </div>
            
          {/* Stock status */}
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full shadow-sm ${product.isInStock ? 'bg-gradient-to-r from-green-400 to-green-500' : 'bg-gradient-to-r from-red-400 to-red-500'}`} />
            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${product.isInStock ? 'text-green-700 bg-green-100 dark:text-green-300 dark:bg-green-800/50 dark:border dark:border-green-600/30' : 'text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-800/50 dark:border dark:border-red-600/30'}`}>
              {product.isInStock ? t("products.inStock") : t("products.outOfStock")}
            </span>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen  bg-gray-50 dark:bg-gray-900">
      {/* Subcategory Banner */}
      {subcategoryLoading ? (
        <div className="relative h-64 md:h-80 bg-gray-100 dark:bg-gray-800">
          <Skeleton className="w-full h-full bg-gray-200 dark:bg-gray-700" />
          <div className="absolute bottom-6 left-6 right-6">
            <Skeleton className="h-8 w-64 mb-2 bg-gray-200 dark:bg-gray-700" />
            <Skeleton className="h-4 w-96 bg-gray-200 dark:bg-gray-700" />
          </div>
        </div>
      ) : subcategoryData ? (
        <div className="relative h-64 md:h-80 overflow-hidden">
          {subcategoryData.imageUrl ? (
            <>
              <Image
                src={subcategoryData.imageUrl}
                alt={subcategoryData.name}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-brand-navy via-brand-navy/80 to-brand-gold/20 dark:from-gray-900 dark:via-gray-800 dark:to-amber-400/20" />
          )}

          {/* Content overlay */}
          <div className="absolute inset-0 flex items-end">
            <div className="w-full p-4 sm:p-6 md:p-8">
              <div className="section-container">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-white/80 text-sm mb-3 overflow-hidden">
                      <Link href="/categories" className="hover:text-white transition-colors shrink-0 hover:underline">
                        {t('breadcrumb.categories')}
                      </Link>
                      <ChevronRight className="w-4 h-4 shrink-0 text-white/60" />
                      <span className="text-white font-medium truncate">{subcategoryData.name}</span>
                    </div>

                    {/* Title and description */}
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white mb-3 break-words">
                      {subcategoryData.name}
                    </h1>
                    {subcategoryData.description && (
                      <p className="text-white/90 text-base sm:text-lg max-w-2xl leading-relaxed">
                        {subcategoryData.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Main Content */}
      <div className="section-container !py-12 ">
        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold brand-heading dark:text-amber-100 mb-2">{t("pageTitle")}</h2>
          {!isLoading && (
            <p className="text-gray-600 dark:text-gray-400">
              {t("products.showing", { count: totalCount })}
            </p>
          )}
        </div>

        {/* Filters and Products Grid */}
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Desktop Filters */}
          <div className="hidden lg:block">
             <div className="sticky top-24 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
               <FilterPanel 
                 filters={filters}
                 t={t}
                 handleFilterChange={handleFilterChange}
                 handleClearFilters={handleClearFilters}
                 handleApplyFilters={handleApplyFilters}
                 dir={dir}
               />
            </div>
          </div>

          {/* Mobile Filter Button */}
          <div className="lg:hidden mb-6">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  {t("filters.title")}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 p-0 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                <SheetHeader className="p-6 pb-0">
                  <SheetTitle className="text-gray-900 dark:text-white">{t("filters.title")}</SheetTitle>
                </SheetHeader>
                <div className="p-6 pt-4">
                   <FilterPanel 
                     filters={filters}
                     t={t}
                     handleFilterChange={handleFilterChange}
                     handleClearFilters={handleClearFilters}
                     handleApplyFilters={handleApplyFilters}
                     isMobile={true}
                     dir={dir}
                   />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3 px-2 sm:px-0">
            {/* Loading State */}
            {isLoading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-2">
                {[...Array(12)].map((_, index) => (
                  <Card key={index} className="overflow-hidden bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    <Skeleton className="w-full aspect-square bg-gray-200 dark:bg-gray-700" />
                    <CardContent className="p-4 space-y-3">
                      <Skeleton className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700" />
                      <Skeleton className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700" />
                      <Skeleton className="h-6 w-full bg-gray-200 dark:bg-gray-700" />
                      <div className="flex justify-between">
                        <Skeleton className="h-6 w-16 bg-gray-200 dark:bg-gray-700" />
                        <Skeleton className="h-8 w-20 bg-gray-200 dark:bg-gray-700" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 mb-4">
                  <AlertCircle className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{t("error.title")}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{t("error.message")}</p>
                <Button onClick={() => refetch()} variant="outline" className="border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  {t("error.retry")}
                </Button>
              </div>
            )}

            {/* Products Grid */}
            {!isLoading && !error && products && (
              <>
                {products.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-2">
                    {products.map((product: APIProductItem & { price: number; salePrice?: number; isInStock: boolean }) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 mb-4">
                      <Search className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{t("noProducts.title")}</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">{t("noProducts.message")}</p>
                    <Button onClick={handleClearFilters} variant="outline" className="border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                      {t("noProducts.clearFilters")}
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Add to Cart Modal */}
      <AddToCartModal
        isOpen={showCartModal}
        onClose={() => setShowCartModal(false)}
        product={cartModalProduct}
        quantity={cartModalQuantity}
      />

      {/* Add to Cart with Questions Modal */}
      <AddToCartWithQuestionsModal
        isOpen={showQuestionsModal}
        onClose={() => setShowQuestionsModal(false)}
        product={questionsModalProduct}
        quantity={1}
        onAddToCart={handleAddToCartWithQuestions}
      />
    </div>
  );
}

                   