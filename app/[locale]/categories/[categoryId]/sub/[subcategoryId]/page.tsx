"use client"

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useProductsBySubCategoryQuery, useProductsQuery, ProductItem as APIProductItem } from "@/services";
import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "@/lib/axios";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";
import { AddToCartModal } from "@/components/cart/AddToCartModal";
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

  const [filters, setFilters] = useState<FilterState>({
    search: "",
    minPrice: 0,
    maxPrice: 10000,
    sortBy: "newest"
  });

  const [appliedFilters, setAppliedFilters] = useState<FilterState>(filters);

  // Cart and wishlist modal states
  const [showCartModal, setShowCartModal] = useState(false);
  const [cartModalProduct, setCartModalProduct] = useState<any>(null);
  const [cartModalQuantity, setCartModalQuantity] = useState(1);

  // Store hooks
  const { addToCart, isLoading: cartLoading } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();

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
    search: appliedFilters.search || undefined,
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

  const handleApplyFilters = () => {
    setAppliedFilters({ ...filters });
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      search: "",
      minPrice: 0,
      maxPrice: 10000,
      sortBy: "newest"
    };
    setFilters(clearedFilters);
    setAppliedFilters(clearedFilters);
  };

  const handleAddToCart = async (product: APIProductItem & { price: number; salePrice?: number; isInStock: boolean }, quantity = 1) => {
    try {
      const cartItem = {
        id: product.id,
        productId: product.id,
        name: product.name,
        description: product.description || product.subcategory?.description || "",
        price: parseFloat(product.originalPrice),
        salePrice: product.discountedPrice ? parseFloat(product.discountedPrice) : undefined,
        imageUrl: product.imageUrl || undefined,
      };

      await addToCart(cartItem, quantity);

      // Show success modal
      setCartModalProduct(cartItem);
      setCartModalQuantity(quantity);
      setShowCartModal(true);
    } catch (error) {
      console.error('Failed to add to cart:', error);
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

  // Filter Panel Component
  const FilterPanel = ({ isMobile = false }) => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold brand-heading">{t("filters.title")}</h3>
        <Button variant="ghost" size="sm" onClick={handleClearFilters} className="text-brand-gold hover:bg-brand-gold/10">
          <X className="w-4 h-4 mr-1" />
          {t("filters.clear")}
        </Button>
      </div>

      {/* Search */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">{t("filters.search")}</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder={t("filters.search")}
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            className="pl-10"
          />
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-4">
        <label className="text-sm font-medium text-gray-700">{t("filters.priceRange")}</label>
        <div className="px-2">
          <Slider
            value={[filters.minPrice, filters.maxPrice]}
            onValueChange={([min, max]) => setFilters(prev => ({ ...prev, minPrice: min, maxPrice: max }))}
            max={10000}
            min={0}
            step={50}
            className="w-full"
          />
        </div>
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="text-xs text-gray-500">{t("filters.minPrice")}</label>
            <Input
              type="number"
              value={filters.minPrice}
              onChange={(e) => setFilters(prev => ({ ...prev, minPrice: Number(e.target.value) }))}
              className="mt-1"
            />
          </div>
          <div className="flex-1">
            <label className="text-xs text-gray-500">{t("filters.maxPrice")}</label>
            <Input
              type="number"
              value={filters.maxPrice}
              onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: Number(e.target.value) }))}
              className="mt-1"
            />
          </div>
        </div>
      </div>

      {/* Sort By */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">{t("filters.sortBy")}</label>
        <Select value={filters.sortBy} onValueChange={(value) => setFilters(prev => ({ ...prev, sortBy: value }))}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">{t("filters.sortOptions.newest")}</SelectItem>
            <SelectItem value="oldest">{t("filters.sortOptions.oldest")}</SelectItem>
            <SelectItem value="priceHigh">{t("filters.sortOptions.priceHigh")}</SelectItem>
            <SelectItem value="priceLow">{t("filters.sortOptions.priceLow")}</SelectItem>
            <SelectItem value="nameAZ">{t("filters.sortOptions.nameAZ")}</SelectItem>
            <SelectItem value="nameZA">{t("filters.sortOptions.nameZA")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Apply Button */}
      <Button onClick={handleApplyFilters} className="w-full btn-primary">
        {t("filters.apply")}
      </Button>
    </div>
  );

  // Product Card Component
  const ProductCard = ({ product }: { product: APIProductItem & { price: number; salePrice?: number; isInStock: boolean } }) => {
    const price = parseFloat(product.originalPrice);
    const salePrice = product.discountedPrice ? parseFloat(product.discountedPrice) : undefined;
    const isOnSale = salePrice && salePrice < price;
    const finalPrice = isOnSale ? salePrice! : price;
    const isWishlisted = isInWishlist(product.id);

    return (
      <Card className="group relative overflow-hidden rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 bg-white border-0">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-gray-300" />
            </div>
          )}

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Action buttons */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
            <Button
              size="sm"
              variant="secondary"
              className="w-9 h-9 rounded-full bg-white/90 hover:bg-white shadow-lg backdrop-blur-sm"
              onClick={() => handleWishlistToggle(product)}
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-700'}`} />
            </Button>
            <Link href={`/products/${product.id}`}>
              <Button
                size="sm"
                variant="secondary"
                className="w-9 h-9 rounded-full bg-white/90 hover:bg-white shadow-lg backdrop-blur-sm"
              >
                <Eye className="w-4 h-4 text-gray-700" />
              </Button>
            </Link>
          </div>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            {isOnSale && (
              <Badge className="bg-red-500 text-white font-bold px-2 py-1 text-xs">
                {t("products.sale")}
              </Badge>
            )}
            {product.isFeatured && (
              <Badge className="bg-brand-gold text-brand-navy font-bold px-2 py-1 text-xs">
                {t("products.featured")}
              </Badge>
            )}
            {!product.isInStock && (
              <Badge variant="secondary" className="bg-gray-500 text-white font-bold px-2 py-1 text-xs">
                {t("products.outOfStock")}
              </Badge>
            )}
          </div>

          {/* Quick add to cart */}
          <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            <Button
              className="w-full btn-primary backdrop-blur-sm"
              disabled={!product.isInStock || cartLoading}
              onClick={() => handleAddToCart(product)}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              {cartLoading ? "Adding..." : tCart("addToCart")}
            </Button>
          </div>
        </div>

        {/* Product Info */}
        <CardContent className="p-4 space-y-3">
          <div>
            <Link href={`/products/${product.id}`}>
              <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-brand-navy transition-colors cursor-pointer hover:underline">
                {product.name}
              </h3>
            </Link>
            {product.description ? (
              <div
                className="text-sm text-gray-600 line-clamp-2 mt-1"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            ) : (
              <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                {product.subcategory?.description || product.name}
              </p>
            )}
          </div>

          {/* Product Features */}
          <div className="flex flex-wrap gap-1">
            {product.isFeatured && (
              <Badge variant="secondary" className="bg-brand-gold/10 text-brand-navy text-xs">
                {t("products.featured")}
              </Badge>
            )}
          </div>

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-brand-navy">
              ${finalPrice?.toFixed(2)}
            </span>
            {isOnSale && (
              <span className="text-sm text-gray-500 line-through">
                ${price.toFixed(2)}
              </span>
            )}
          </div>

          {/* Stock status */}
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${product.isInStock ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className={`text-xs font-medium ${product.isInStock ? 'text-green-700' : 'text-red-700'}`}>
              {product.isInStock ? t("products.inStock") : t("products.outOfStock")}
            </span>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Subcategory Banner */}
      {subcategoryLoading ? (
        <div className="relative h-64 md:h-80 bg-gray-100">
          <Skeleton className="w-full h-full" />
          <div className="absolute bottom-6 left-6 right-6">
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
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
            <div className="w-full h-full bg-gradient-to-br from-brand-navy via-brand-navy/80 to-brand-gold/20" />
          )}

          {/* Content overlay */}
          <div className="absolute inset-0 flex items-end">
            <div className="w-full p-4 sm:p-6 md:p-8">
              <div className="section-container">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-white/80 text-sm mb-3 overflow-hidden">
                      <Link href="/categories" className="hover:text-white transition-colors shrink-0">
                        {subcategoryData.category?.name || "Categories"}
                      </Link>
                      <ChevronRight className="w-4 h-4 shrink-0" />
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
      <div className="section-container py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold brand-heading mb-2">{t("pageTitle")}</h2>
          {!isLoading && (
            <p className="text-gray-600">
              {t("products.showing", { count: totalCount })}
            </p>
          )}
        </div>

        {/* Filters and Products Grid */}
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Desktop Filters */}
          <div className="hidden lg:block">
            <div className="sticky top-24">
              <FilterPanel />
            </div>
          </div>

          {/* Mobile Filter Button */}
          <div className="lg:hidden mb-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full">
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  {t("filters.title")}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 p-0">
                <SheetHeader className="p-6 pb-0">
                  <SheetTitle>{t("filters.title")}</SheetTitle>
                </SheetHeader>
                <div className="p-6 pt-4">
                  <FilterPanel isMobile={true} />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {/* Loading State */}
            {isLoading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(12)].map((_, index) => (
                  <Card key={index} className="overflow-hidden">
                    <Skeleton className="w-full aspect-square" />
                    <CardContent className="p-4 space-y-3">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-6 w-full" />
                      <div className="flex justify-between">
                        <Skeleton className="h-6 w-16" />
                        <Skeleton className="h-8 w-20" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-600 mb-4">
                  <AlertCircle className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{t("error.title")}</h3>
                <p className="text-gray-600 mb-4">{t("error.message")}</p>
                <Button onClick={() => refetch()} variant="outline">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  {t("error.retry")}
                </Button>
              </div>
            )}

            {/* Products Grid */}
            {!isLoading && !error && products && (
              <>
                {products.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product: APIProductItem & { price: number; salePrice?: number; isInStock: boolean }) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 text-gray-400 mb-4">
                      <Search className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{t("noProducts.title")}</h3>
                    <p className="text-gray-600 mb-4">{t("noProducts.message")}</p>
                    <Button onClick={handleClearFilters} variant="outline">
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
    </div>
  );
}
