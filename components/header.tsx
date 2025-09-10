"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Menu,
  X,
  Sun,
  Moon,
  Globe,
  Sparkles,
  ChevronDown,
  Code,
  Palette,
  BarChart3,
  Smartphone,
  Monitor,
  ShoppingBag,
  Layers,
  Settings,
  Package,
  ShoppingCart,
  User,
  Heart,
  LogIn,
  Search,
  Bell,
  Box
} from "lucide-react"
import { useTheme } from "next-themes"
import Link from "next/link"
import { useTranslations, useLocale } from 'next-intl'
import { usePathname } from "next/navigation"
import { routing } from "@/i18n/routing"
import { useCategoriesQuery, useServicesQuery } from "@/services"
import { useCartStore } from '@/store/cart'
import { useWishlistStore } from '@/store/wishlist'
import { useAuth } from '@/contexts/AuthContext'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu"

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import Image from "next/image"

interface HeaderProps {
  services: string
  categories: string
  about: string
  contact: string

}

export function Header({
  services: servicesText,
  categories: categoriesText,
  about,
  contact,
}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isServicesOpen, setIsServicesOpen] = useState(false)
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const locale = useLocale()
  const pathname = usePathname()
  const tCompany = useTranslations('company')
  const tHeader = useTranslations('header')
  const tServices = useTranslations('services')
  const tFooter = useTranslations('footer')

  // Store hooks for cart and wishlist
  const { cart } = useCartStore()
  const { items: wishlistItems } = useWishlistStore()
  const cartCount = cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0
  const wishlistCount = wishlistItems.length

  // Auth hook
  const { user, isAuthenticated, isLoading, logout } = useAuth()
  
  // Use user from auth context directly to avoid infinite loops
  const currentUser = user

  const { data: servicesApiData } = useServicesQuery({ limit: 8 })
  const servicesApi = servicesApiData?.data || []
  const { data: categoriesApiData } = useCategoriesQuery({ pagination: { page: 1, limit: 8 } })
  const categoriesApi = categoriesApiData || []
  console.log(categoriesApi)
  // Enhanced scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])



  const navItems = [
    { label: tFooter('links.home'), href: "/" },
    { label: tFooter('links.about'), href: "/about" },
    { label: tFooter('links.contact'), href: "/contact" },
  ]

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled
        ? 'backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 shadow-2xl border-b border-amber-100/20'
        : 'backdrop-blur-md bg-white/95 dark:bg-gray-900/95 border-b border-transparent'
        }`}
    >
      <div className="section-container">
        <div className={`flex items-center justify-between transition-all duration-300 ${isScrolled ? 'h-16' : 'h-20'
          }`}>
          {/* Enhanced Logo */}
          <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse hover:opacity-80 transition-all duration-300 group">
            <div className="relative">
              <div className={`rounded-2xl flex items-center justify-center shadow-xl transition-all duration-300 ${isScrolled ? 'w-10 h-10' : 'w-12 h-12'
                }`}
                style={{
                  background: 'linear-gradient(135deg, #FFCC00 0%, #1C1C3C 100%)',
                  boxShadow: '0 10px 25px rgba(255, 204, 0, 0.3)'
                }}>
                <Image alt="logo" src={"/m-logo-white.png"} width={50} height={50} className={`text-white transition-all duration-300 ${isScrolled ? 'w-5 h-5' : 'w-6 h-6'
                  } group-hover:rotate-12`} />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full animate-pulse bg-gradient-to-r from-amber-400 to-orange-500 shadow-lg"></div>
              <div className="absolute -bottom-1 -left-1 w-2 h-2 rounded-full animate-bounce bg-gradient-to-r from-blue-400 to-purple-500" style={{ animationDelay: '0.5s' }}></div>
            </div>
            <div className={`transition-all duration-300 ${isScrolled ? 'scale-90' : 'scale-100'}`}>
              <div className={`hidden md:block font-bold brand-heading text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-700 transition-all duration-300 ${isScrolled ? 'text-lg' : 'text-xl'
                }`}>{tCompany('name')}</div>
              <div className={`opacity-70 text-gray-600 dark:text-gray-300 transition-all duration-300 ${isScrolled ? 'text-[10px]' : 'text-xs'
                } hidden sm:block`}>{tCompany('tagline')}</div>
            </div>
          </Link>

          {/* Enhanced Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8 rtl:space-x-reverse">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="relative text-gray-700 px-2 dark:text-gray-200 hover:text-amber-600 dark:hover:text-amber-400 font-medium transition-all duration-300 group"
                style={{ fontFamily: 'Tajawal, sans-serif' }}
              >
                {item.label}
                <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-400 to-orange-500 group-hover:w-full transition-all duration-500 ease-out"></span>
                <span className="absolute inset-0 rounded-lg bg-amber-50 dark:bg-amber-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></span>
              </Link>
            ))}

            {/* Enhanced Services HoverCard */}
            <HoverCard openDelay={0} closeDelay={100}>
              <HoverCardTrigger asChild>
                <Link
                  href="#"
                  className="relative px-2 text-gray-700 dark:text-gray-200 hover:text-amber-600 dark:hover:text-amber-400 font-medium transition-all duration-300 group flex items-center gap-1"
                  style={{ fontFamily: 'Tajawal, sans-serif' }}
                >
                  {tHeader('services')}
                  <ChevronDown className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" />
                  <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-400 to-orange-500 group-hover:w-full transition-all duration-500 ease-out"></span>
                  <span className="absolute inset-0 rounded-lg bg-amber-50 dark:bg-amber-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></span>
                </Link>
              </HoverCardTrigger>
              <HoverCardContent className="w-80 p-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-amber-100 dark:border-amber-900/20 shadow-2xl rounded-2xl overflow-hidden" align="center">
                <div className="p-6">
                  <div className="text-sm font-bold brand-heading mb-4 text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">{tHeader('services')}</div>
                  <div className="space-y-2">
                    {servicesApi.length && servicesApi?.filter((service: any) => service && typeof service === 'object').map((service: any, index: number) => {
                      const displayName = service?.name || service?.title || 'Service'
                      const serviceDescription = typeof service?.description === 'string' ? service.description : service?.description?.en || service?.description?.ar || ''
                      return (
                        <Link
                          key={service.id || index}
                          href={service.href || `/services/${service.id}`}
                          className="flex items-center gap-3 p-3 rounded-xl hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 dark:hover:from-amber-900/20 dark:hover:to-orange-900/20 transition-all duration-300 group"
                        >
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300 overflow-hidden">
                            {service.iconUrl || service.icon ? (
                              <img
                                src={service.iconUrl || service.icon}
                                alt={displayName}
                                className="w-6 h-6 object-contain"
                              />
                            ) : (
                              <Box className="w-6 h-6 text-white" />
                            )}
                          </div>
                            <div className="font-semibold text-sm brand-heading text-gray-800 dark:text-gray-100 group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors duration-300">{displayName}</div>
                          
                        </Link>
                      )
                    })}
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>

            {/* Enhanced Categories HoverCard */}
            <HoverCard openDelay={0} closeDelay={100}>
              <HoverCardTrigger asChild>
                <Link
                  href="#"
                  className="relative px-2 text-gray-700 dark:text-gray-200 hover:text-amber-600 dark:hover:text-amber-400 font-medium transition-all duration-300 group flex items-center gap-1"
                  style={{ fontFamily: 'Tajawal, sans-serif' }}
                >
                  {tFooter('links.products')}
                  <ChevronDown className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" />
                  <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-400 to-orange-500 group-hover:w-full transition-all duration-500 ease-out"></span>
                  <span className="absolute inset-0 rounded-lg bg-amber-50 dark:bg-amber-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></span>
                </Link>
              </HoverCardTrigger>
              <HoverCardContent className="w-[500px] p-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-amber-100 dark:border-amber-900/20 shadow-2xl rounded-2xl overflow-hidden" align="center">
                <div className="p-6">
                  <div className="text-sm font-bold brand-heading mb-4 text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">{tHeader('categories')}</div>
                  <div className="grid grid-cols-2 gap-4">
                    {categoriesApi.length > 0 && categoriesApi?.filter((category: any) => category && typeof category === 'object').map((category: any, index: number) => {
                      const name = category?.title || category?.name || 'Category'
                      const subcategories = category?.subcategories || []
                      return (
                        <div key={category.id || index} className="p-4 rounded-xl hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 dark:hover:from-amber-900/20 dark:hover:to-orange-900/20 transition-all duration-300 cursor-pointer group border border-transparent hover:border-amber-200 dark:hover:border-amber-800/30 shadow-sm hover:shadow-md">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40 group-hover:from-amber-200 group-hover:to-orange-200 dark:group-hover:from-amber-800/60 dark:group-hover:to-orange-800/60 transition-all duration-300 overflow-hidden shadow-md group-hover:shadow-lg">
                              {category.iconUrl ? (
                                <img
                                  src={category.iconUrl}
                                  alt={name}
                                  className="w-6 h-6 object-contain"
                                />
                              ) : (
                                <Package className="w-5 h-5 text-amber-700 dark:text-amber-300" />
                              )}
                            </div>

                            <div className="font-semibold text-sm brand-heading text-gray-800 dark:text-gray-100 group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors duration-300">{name}</div>
                          </div>

                          {subcategories.length > 0 && (
                            <div className="space-y-2">
                              {subcategories.slice(0, 3).map((subcategory: any, subIndex: number) => (
                                <Link
                                  key={subIndex}
                                  href={`/categories/${category.id}/subcategories/${subcategory.id}`}
                                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-gradient-to-r hover:from-amber-50/50 hover:to-orange-50/50 dark:hover:from-amber-900/10 dark:hover:to-orange-900/10 transition-all duration-300 group/subcategory"
                                >
                                  <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700/50 dark:to-gray-600/50 group-hover/subcategory:from-amber-100 group-hover/subcategory:to-orange-100 dark:group-hover/subcategory:from-amber-900/40 dark:group-hover/subcategory:to-orange-900/40 transition-all duration-300 overflow-hidden shadow-sm group-hover/subcategory:shadow-md">
                                    {subcategory.iconUrl ? (
                                      <img
                                        src={subcategory.iconUrl}
                                        alt={subcategory.name}
                                        className="w-4 h-4 object-contain"
                                      />
                                    ) : (
                                      <Package className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover/subcategory:text-amber-700 dark:group-hover/subcategory:text-amber-300 transition-colors duration-300" />
                                    )}
                                  </div>
                                  <div className="font-medium text-xs brand-heading text-gray-600 dark:text-gray-300 group-hover/subcategory:text-amber-700 dark:group-hover/subcategory:text-amber-300 transition-colors duration-300">
                                    {subcategory.name}
                                  </div>
                                </Link>
                              ))}
                              {subcategories.length > 3 && (
                                <div className="text-xs text-amber-600 dark:text-amber-400 font-medium px-2 py-1 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-center">
                                  +{subcategories.length - 3} أكثر
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          </nav>

          {/* Enhanced Action Buttons */}
          <div className="hidden lg:flex items-center space-x-3 rtl:space-x-reverse">
            {/* Enhanced Wishlist Button */}
            <Link href="/wishlist">
              <Button variant="ghost" size="sm" className="relative overflow-visible p-2.5 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-xl transition-all duration-300 group">
                <div className="w-5 h-5 rounded-md bg-gradient-to-r from-pink-500 to-red-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <img
                    src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='white' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='1' d='M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z'/%3E%3C/svg%3E"
                    alt="Wishlist"
                    className="w-3 h-3"
                  />
                </div>
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-400 to-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold text-[10px]">
                    {wishlistCount}
                  </span>
                )}
                <span className="sr-only">Wishlist</span>
              </Button>
            </Link>

            {/* Enhanced Cart Button */}
            <Link href="/cart">
              <Button variant="ghost" size="sm" className="relative overflow-visible p-2.5 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-xl transition-all duration-300 group">
                <div className="w-5 h-5 rounded-md bg-gradient-to-r from-amber-500 to-orange-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <img
                    src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.35 2.65A1 1 0 005 17h16M9 19a1 1 0 11-2 0 1 1 0 012 0zM19 19a1 1 0 11-2 0 1 1 0 012 0z'/%3E%3C/svg%3E"
                    alt="Shopping Cart"
                    className="w-3 h-3"
                  />
                </div>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg">
                    {cartCount}
                  </span>
                )}
                <span className="sr-only">Shopping cart</span>
              </Button>
            </Link>

            {/* Enhanced Login/User Button */}
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                <span className="sr-only">Loading...</span>
              </div>
            ) : isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="p-2.5 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-xl transition-all duration-300 group">
                    <div className="w-5 h-5 rounded-md bg-gradient-to-r from-green-500 to-teal-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <img
                        src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'/%3E%3C/svg%3E"
                        alt="User Account"
                        className="w-3 h-3"
                      />
                    </div>
                    <span className="sr-only">User account</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-amber-100 dark:border-amber-900/20 shadow-2xl rounded-xl">
                  <DropdownMenuLabel style={{ fontFamily: 'Tajawal, sans-serif' }} className="text-amber-700 dark:text-amber-300">
                    {currentUser?.firstName ? `${currentUser.firstName} ${currentUser.lastName || ''}`.trim() : tHeader('myAccount')}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-amber-100 dark:bg-amber-900/20" />
                  <DropdownMenuItem asChild style={{ fontFamily: 'Tajawal, sans-serif' }} className="hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg mx-1">
                    <Link href="/my-profile">
                      <User className="w-4 h-4 ml-2 text-amber-600 dark:text-amber-400" />
                      {tHeader('myProfile')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild style={{ fontFamily: 'Tajawal, sans-serif' }} className="hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg mx-1">
                    <Link href="/my-orders">
                      <ShoppingBag className="w-4 h-4 ml-2 text-amber-600 dark:text-amber-400" />
                      {tHeader('myOrders')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild style={{ fontFamily: 'Tajawal, sans-serif' }} className="hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg mx-1">
                    <Link href="/wishlist">
                      <Heart className="w-4 h-4 ml-2 text-amber-600 dark:text-amber-400" />
                      {tHeader('wishlist')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-amber-100 dark:bg-amber-900/20" />
                  <DropdownMenuItem onClick={logout} style={{ fontFamily: 'Tajawal, sans-serif' }} className="hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg mx-1 text-red-600 dark:text-red-400">
                    {tHeader('logout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <Button variant="ghost" size="sm" className="p-2.5 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-xl transition-all duration-300 group flex items-center gap-2">
                  <div className="w-5 h-5 rounded-md bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <img
                      src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1'/%3E%3C/svg%3E"
                      alt="Login"
                      className="w-3 h-3"
                    />
                  </div>
                  <span style={{ fontFamily: 'Tajawal, sans-serif' }} className="text-gray-600 dark:text-gray-300 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors duration-300">{tHeader('login')}</span>
                </Button>
              </Link>
            )}

            {/* Enhanced Language Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="w-9 px-0 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-xl transition-all duration-300 group">
                  <Globe className="h-4 w-4 text-gray-600 dark:text-gray-300 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors duration-300" />
                  <span className="sr-only">Toggle language</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-amber-100 dark:border-amber-900/20 shadow-2xl rounded-xl">
                {routing.locales.map((loc) => (
                  <DropdownMenuItem key={loc} asChild className="hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg mx-1">
                    <Link href={`/${loc}${pathname?.replace(/^\/[a-zA-Z-]+/, '') || ''}`}>
                      {loc === 'ar' ? 'العربية' : 'English'}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Enhanced Theme Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="w-9 px-0 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-xl transition-all duration-300 group">
                  <Sun className="h-4 w-4 rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0 text-gray-600 group-hover:text-amber-600" />
                  <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100 text-gray-300 dark:group-hover:text-amber-400" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-amber-100 dark:border-amber-900/20 shadow-2xl rounded-xl">
                <DropdownMenuItem onClick={() => setTheme("light")} className="hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg mx-1">
                  النمط الفاتح
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")} className="hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg mx-1">
                  النمط الداكن
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")} className="hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg mx-1">
                  تلقائي
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Enhanced Mobile Actions & Menu Button */}
          <div className="lg:hidden flex items-center space-x-1 rtl:space-x-reverse">
            {/* Mobile Wishlist */}
            <Link href="/wishlist">
              <Button variant="ghost" size="sm" className="relative overflow-visible p-2 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-xl transition-all duration-300">
                <div className="w-5 h-5 rounded-md bg-gradient-to-r from-pink-500 to-red-600 flex items-center justify-center shadow-lg">
                  <img
                    src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='white' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='1' d='M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z'/%3E%3C/svg%3E"
                    alt="Wishlist"
                    className="w-3 h-3"
                  />
                </div>
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-400 to-pink-500 text-white text-xs rounded-full w-3 h-3 flex items-center justify-center text-[8px] font-bold">
                    {wishlistCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* Mobile Cart */}
            <Link href="/cart">
              <Button variant="ghost" size="sm" className=" overflow-visible relative p-2 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-xl transition-all duration-300">
                <div className="w-5 h-5 rounded-md bg-gradient-to-r from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
                  <img
                    src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.35 2.65A1 1 0 005 17h16M9 19a1 1 0 11-2 0 1 1 0 012 0zM19 19a1 1 0 11-2 0 1 1 0 012 0z'/%3E%3C/svg%3E"
                    alt="Shopping Cart"
                    className="w-3 h-3"
                  />
                </div>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* Mobile Login */}
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                <span className="sr-only">Loading...</span>
              </div>
            ) : isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="p-2 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-xl transition-all duration-300">
                    <div className="w-5 h-5 rounded-md bg-gradient-to-r from-green-500 to-teal-600 flex items-center justify-center shadow-lg">
                      <img
                        src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'/%3E%3C/svg%3E"
                        alt="User Account"
                        className="w-3 h-3"
                      />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-amber-100 dark:border-amber-900/20 shadow-2xl rounded-xl">
                  <DropdownMenuLabel style={{ fontFamily: 'Tajawal, sans-serif' }} className="text-amber-700 dark:text-amber-300">
                    {currentUser?.firstName ? `${currentUser.firstName} ${currentUser.lastName || ''}`.trim() : tHeader('myAccount')}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-amber-100 dark:bg-amber-900/20" />
                  <DropdownMenuItem asChild style={{ fontFamily: 'Tajawal, sans-serif' }} className="hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg mx-1">
                    <Link href="/my-profile">
                      <User className="w-4 h-4 ml-2 text-amber-600 dark:text-amber-400" />
                      {tHeader('myProfile')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild style={{ fontFamily: 'Tajawal, sans-serif' }} className="hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg mx-1">
                    <Link href="/my-orders">
                      <ShoppingBag className="w-4 h-4 ml-2 text-amber-600 dark:text-amber-400" />
                      {tHeader('myOrders')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild style={{ fontFamily: 'Tajawal, sans-serif' }} className="hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg mx-1">
                    <Link href="/wishlist">
                      <Heart className="w-4 h-4 ml-2 text-amber-600 dark:text-amber-400" />
                      {tHeader('wishlist')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-amber-100 dark:bg-amber-900/20" />
                  <DropdownMenuItem onClick={logout} style={{ fontFamily: 'Tajawal, sans-serif' }} className="hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg mx-1 text-red-600 dark:text-red-400">
                    {tHeader('logout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <Button variant="ghost" size="sm" className="p-2 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-xl transition-all duration-300">
                  <div className="w-5 h-5 rounded-md bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                    <img
                      src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1'/%3E%3C/svg%3E"
                      alt="Login"
                      className="w-3 h-3"
                    />
                  </div>
                </Button>
              </Link>
            )}

            {/* Enhanced Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-xl transition-all duration-300"
            >
              {isMenuOpen ?
                <X className="h-6 w-6 text-gray-600 dark:text-gray-300 rotate-0 transition-transform duration-300" /> :
                <Menu className="h-6 w-6 text-gray-600 dark:text-gray-300 transition-transform duration-300" />
              }
            </Button>
          </div>
        </div>

        {/* Enhanced Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-amber-100 dark:border-amber-900/20 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-b-2xl mt-2 shadow-2xl">
            <nav className="p-4 space-y-2 max-h-[80vh] overflow-y-auto scrollbar-hide">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block text-gray-700 dark:text-gray-200 hover:text-amber-600 dark:hover:text-amber-400 font-medium transition-all duration-300 p-4 rounded-xl hover:bg-amber-50 dark:hover:bg-amber-900/20 active:scale-95"
                  style={{ fontFamily: 'Tajawal, sans-serif' }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-4 border-t border-amber-100 dark:border-amber-900/20">
                {/* Mobile Services Section */}
                <div className="mb-4">
                  <Button
                    variant="ghost"
                    className="w-full text-gray-700 dark:text-gray-200 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-xl transition-all duration-300 flex items-center justify-between"
                    onClick={() => setIsServicesOpen(!isServicesOpen)}
                  >
                    <span style={{ fontFamily: 'Tajawal, sans-serif' }}>{tHeader('services')}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isServicesOpen ? 'rotate-180' : ''}`} />
                  </Button>
                  {isServicesOpen && (
                    <div className="mt-3 space-y-2 pl-4">
                      {servicesApi.length && servicesApi?.filter((service: any) => service && typeof service === 'object').map((service: any, index: number) => {
                        const displayName = service?.name || service?.title || 'Service'
                        return (
                          <Link
                            key={service.id || index}
                            href={service.href || `/services/${service.id}`}
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-all duration-300 group/service"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40 group-hover/service:from-amber-200 group-hover/service:to-orange-200 dark:group-hover/service:from-amber-800/60 dark:group-hover/service:to-orange-800/60 transition-all duration-300 overflow-hidden shadow-sm group-hover/service:shadow-md">
                              {service.iconUrl || service.icon ? (
                                <img
                                  src={service.iconUrl || service.icon}
                                  alt={displayName}
                                  className="w-5 h-5 object-contain"
                                />
                              ) : (
                                <Box className="w-5 h-5 text-amber-700 dark:text-amber-300" />
                              )}
                            </div>
                            <div className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover/service:text-amber-700 dark:group-hover/service:text-amber-300 transition-colors duration-300">
                              {displayName}
                            </div>
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </div>

                {/* Mobile Categories Section */}
                <div>
                  <Button
                    variant="ghost"
                    className="w-full text-gray-700 dark:text-gray-200 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-xl transition-all duration-300 flex items-center justify-between"
                    onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                  >
                    <span style={{ fontFamily: 'Tajawal, sans-serif' }}>{tFooter('links.products')}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isCategoriesOpen ? 'rotate-180' : ''}`} />
                  </Button>
                  {isCategoriesOpen && (
                    <div className="mt-3 space-y-3 pl-4">
                      {categoriesApi.length && categoriesApi?.filter((category: any) => category && typeof category === 'object').map((category: any, index: number) => {
                        const name = category?.title || category?.name || 'Category'
                        const subcategories = category?.subcategories || []
                        return (
                          <div key={category.id || index} className="space-y-2 p-4 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-700/50 border border-gray-200 dark:border-gray-600 shadow-sm">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40 shadow-sm">
                                {category.iconUrl ? (
                                  <img
                                    src={category.iconUrl}
                                    alt={name}
                                    className="w-5 h-5 object-contain"
                                  />
                                ) : (
                                  <Package className="w-5 h-5 text-amber-700 dark:text-amber-300" />
                                )}
                              </div>
                              <div className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                                {name}
                              </div>
                            </div>
                            {subcategories.length > 0 && (
                              <div className="pl-2 space-y-1">
                                {subcategories.slice(0, 4).map((subcategory: any, subIndex: number) => (
                                  <Link
                                    key={subIndex}
                                    href={`/categories/${category.id}/subcategories/${subcategory.id}`}
                                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-all duration-300 group/subcategory active:scale-95"
                                    onClick={() => setIsMenuOpen(false)}
                                  >
                                    <div className="w-5 h-5 rounded-md flex items-center justify-center bg-gray-200 dark:bg-gray-600 group-hover/subcategory:bg-amber-200 dark:group-hover/subcategory:bg-amber-800/40 transition-colors duration-300 shadow-sm">
                                      {subcategory.iconUrl ? (
                                        <img
                                          src={subcategory.iconUrl}
                                          alt={subcategory.name}
                                          className="w-3 h-3 object-contain"
                                        />
                                      ) : (
                                        <Package className="w-3 h-3 text-gray-500 dark:text-gray-400 group-hover/subcategory:text-amber-600 dark:group-hover/subcategory:text-amber-400 transition-colors duration-300" />
                                      )}
                                    </div>
                                    <div className="text-xs font-medium text-gray-600 dark:text-gray-400 group-hover/subcategory:text-amber-700 dark:group-hover/subcategory:text-amber-300 transition-colors duration-300">
                                      {subcategory.name}
                                    </div>
                                  </Link>
                                ))}
                                {subcategories.length > 4 && (
                                  <div className="text-xs text-amber-600 dark:text-amber-400 font-medium px-3 py-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-center border border-amber-200 dark:border-amber-800/30">
                                    +{subcategories.length - 4} أكثر
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header >
  )
} 