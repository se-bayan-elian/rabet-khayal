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
  Bell
} from "lucide-react"
import { useTheme } from "next-themes"
import Link from "next/link"
import { useLocale } from "next-intl"
import { usePathname } from "next/navigation"
import { routing } from "@/i18n/routing"
import { useTranslations } from 'next-intl'
import { useCategoriesQuery, useServicesQuery } from "@/services"
import { useCartStore } from '@/store/cart'
import { useWishlistStore } from '@/store/wishlist'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface HeaderProps {
  services: string
  categories: string
  about: string
  contact: string
  webDev: string
  mobileApps: string
  digitalMarketing: string
  branding: string
  electronics: string
  fashion: string
  homeGarden: string
  sports: string
  getConsultation: string
}

export function Header({
  services: servicesText,
  categories: categoriesText,
  about,
  contact,
  webDev,
  mobileApps,
  digitalMarketing,
  branding,
  electronics,
  fashion,
  homeGarden,
  sports
}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false) // Login state
  const [isScrolled, setIsScrolled] = useState(false)
  const { theme, setTheme } = useTheme()
  const locale = useLocale()
  const pathname = usePathname()
  const tHeader = useTranslations('header')
  const tServices = useTranslations('services')
  const tFooter = useTranslations('footer')

  // Store hooks for cart and wishlist
  const { cart } = useCartStore()
  const { items: wishlistItems } = useWishlistStore()
  const cartCount = cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0
  const wishlistCount = wishlistItems.length

  const { data: servicesApiData } = useServicesQuery({ limit: 8 })
  const servicesApi = servicesApiData?.data || []
  const { data: categoriesApi = [] } = useCategoriesQuery({ pagination: { page: 1, limit: 8 } })

  // Enhanced scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const services = [
    {
      icon: Code,
      title: tServices('web.title'),
      description: tServices('web.description'),
      href: "/services/web-development"
    },
    {
      icon: Palette,
      title: tServices('design.title'),
      description: tServices('design.description'),
      href: "/services/design"
    },
    {
      icon: BarChart3,
      title: tServices('marketing.title'),
      description: tServices('marketing.description'),
      href: "/services/digital-marketing"
    },
    {
      icon: Smartphone,
      title: tServices('mobile.title'),
      description: tServices('mobile.description'),
      href: "/services/mobile-apps"
    }
  ]

  const productCategories = [
    {
      icon: Package,
      title: "أختام ومهور",
      subcategories: [
        "أختام رسمية للشركات",
        "مهور شخصية",
        "أختام التواريخ",
        "أختام التوقيع"
      ]
    },
    {
      icon: ShoppingBag,
      title: "طباعة مخصصة",
      subcategories: [
        "فناجين وكؤوس",
        "تيشيرتات وملابس",
        "حقائب دعائية",
        "أقلام مطبوعة"
      ]
    },
    {
      icon: Monitor,
      title: "إعلانات ولوحات",
      subcategories: [
        "بنرات إعلانية",
        "لوحات محلات",
        "ستاند رول اب",
        "يافطات ضوئية"
      ]
    },
    {
      icon: Layers,
      title: "مطبوعات تجارية",
      subcategories: [
        "كروت أعمال",
        "بروشورات",
        "كتالوجات",
        "فولدرات وأظرف"
      ]
    }
  ]

  const navItems = [
    { label: tFooter('links.home'), href: "/" },
    { label: tFooter('links.about'), href: "#about" },
    { label: tFooter('links.portfolio'), href: "#portfolio" },
    { label: tFooter('links.contact'), href: "#contact" },
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
                <Sparkles className={`text-white transition-all duration-300 ${isScrolled ? 'w-5 h-5' : 'w-6 h-6'
                  } group-hover:rotate-12`} />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full animate-pulse bg-gradient-to-r from-amber-400 to-orange-500 shadow-lg"></div>
              <div className="absolute -bottom-1 -left-1 w-2 h-2 rounded-full animate-bounce bg-gradient-to-r from-blue-400 to-purple-500" style={{ animationDelay: '0.5s' }}></div>
            </div>
            <div className={`transition-all duration-300 ${isScrolled ? 'scale-90' : 'scale-100'}`}>
              <div className={`font-bold brand-heading text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-700 transition-all duration-300 ${isScrolled ? 'text-lg' : 'text-xl'
                }`}>ربط الخيال</div>
              <div className={`opacity-70 text-gray-600 dark:text-gray-300 transition-all duration-300 ${isScrolled ? 'text-[10px]' : 'text-xs'
                }`}>Link of Imagination</div>
            </div>
          </Link>

          {/* Enhanced Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8 rtl:space-x-reverse">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="relative text-gray-700 dark:text-gray-200 hover:text-amber-600 dark:hover:text-amber-400 font-medium transition-all duration-300 group"
                style={{ fontFamily: 'Tajawal, sans-serif' }}
              >
                {item.label}
                <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-400 to-orange-500 group-hover:w-full transition-all duration-500 ease-out"></span>
                <span className="absolute inset-0 rounded-lg bg-amber-50 dark:bg-amber-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></span>
              </Link>
            ))}

            {/* Enhanced Services Popover */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className="font-medium text-gray-700 dark:text-gray-200 hover:text-amber-600 dark:hover:text-amber-400 flex items-center gap-1 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-xl transition-all duration-300"
                  style={{ fontFamily: 'Tajawal, sans-serif' }}
                >
                  {tHeader('services')}
                  <ChevronDown className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-amber-100 dark:border-amber-900/20 shadow-2xl rounded-2xl overflow-hidden" align="center">
                <div className="p-6">
                  <div className="text-sm font-bold brand-heading mb-4 text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">{tHeader('services')}</div>
                  <div className="space-y-2">
                    {(servicesApi.length ? servicesApi : services).map((service: any, index: number) => {
                      const Icon = service.icon
                      const displayName = service.name || service.title
                      const serviceDescription = typeof service.description === 'string' ? service.description : service.description?.en || service.description?.ar || ''
                      return (
                        <Link
                          key={service.id || index}
                          href={service.href || `/services/${service.id}`}
                          className="flex items-start gap-3 p-3 rounded-xl hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 dark:hover:from-amber-900/20 dark:hover:to-orange-900/20 transition-all duration-300 group"
                        >
                          {service.iconUrl ? (
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300 overflow-hidden">
                              <img
                                src={service.iconUrl}
                                alt={displayName}
                                className="w-6 h-6 object-contain"
                              />
                            </div>
                          ) : Icon ? (
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                              <Icon className="w-5 h-5 text-white" />
                            </div>
                          ) : null}
                          <div className="flex-1">
                            <div className="font-semibold text-sm brand-heading text-gray-800 dark:text-gray-100 group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors duration-300">{displayName}</div>
                            {serviceDescription && (
                              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">{serviceDescription}</div>
                            )}
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            {/* Enhanced Products Popover */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className="font-medium text-gray-700 dark:text-gray-200 hover:text-amber-600 dark:hover:text-amber-400 flex items-center gap-1 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-xl transition-all duration-300"
                  style={{ fontFamily: 'Tajawal, sans-serif' }}
                >
                  {tFooter('links.products')}
                  <ChevronDown className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-96 p-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-amber-100 dark:border-amber-900/20 shadow-2xl rounded-2xl overflow-hidden" align="center">
                <div className="p-6">
                  <div className="text-sm font-bold brand-heading mb-4 text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">{tHeader('categories')}</div>
                  <div className="space-y-3">
                    {(categoriesApi.length ? categoriesApi : productCategories).map((category: any, index: number) => {
                      const Icon = category.icon
                      const name = category.title || category.name
                      return (
                        <div key={category.id || index} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 dark:hover:from-amber-900/20 dark:hover:to-orange-900/20 transition-all duration-300 cursor-pointer group">
                          {category.iconUrl ? (
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40 group-hover:from-amber-200 group-hover:to-orange-200 dark:group-hover:from-amber-800/60 dark:group-hover:to-orange-800/60 transition-all duration-300 overflow-hidden">
                              <img
                                src={category.iconUrl}
                                alt={name}
                                className="w-5 h-5 object-contain"
                              />
                            </div>
                          ) : Icon ? (
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40 group-hover:from-amber-200 group-hover:to-orange-200 dark:group-hover:from-amber-800/60 dark:group-hover:to-orange-800/60 transition-all duration-300">
                              <Icon className="w-4 h-4 text-amber-700 dark:text-amber-300" />
                            </div>
                          ) : null}
                          <div className="font-semibold text-sm brand-heading text-gray-800 dark:text-gray-100 group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors duration-300">{name}</div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </nav>

          {/* Enhanced Action Buttons */}
          <div className="hidden lg:flex items-center space-x-3 rtl:space-x-reverse">
            {/* Enhanced Wishlist Button */}
            <Link href="/wishlist">
              <Button variant="ghost" size="sm" className="relative p-2.5 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-xl transition-all duration-300 group">
                <div className="w-5 h-5 rounded-md bg-gradient-to-r from-pink-500 to-red-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <img
                    src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='white' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='1' d='M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z'/%3E%3C/svg%3E"
                    alt="Wishlist"
                    className="w-3 h-3"
                  />
                </div>
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-400 to-pink-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold text-[10px]">
                    {wishlistCount}
                  </span>
                )}
                <span className="sr-only">Wishlist</span>
              </Button>
            </Link>

            {/* Enhanced Cart Button */}
            <Link href="/cart">
              <Button variant="ghost" size="sm" className="relative p-2.5 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-xl transition-all duration-300 group">
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
            {isLoggedIn ? (
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
                  <DropdownMenuLabel style={{ fontFamily: 'Tajawal, sans-serif' }} className="text-amber-700 dark:text-amber-300">{tHeader('myAccount')}</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-amber-100 dark:bg-amber-900/20" />
                  <DropdownMenuItem style={{ fontFamily: 'Tajawal, sans-serif' }} className="hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg mx-1">
                    <User className="w-4 h-4 ml-2 text-amber-600 dark:text-amber-400" />
                    {tHeader('myProfile')}
                  </DropdownMenuItem>
                  <DropdownMenuItem style={{ fontFamily: 'Tajawal, sans-serif' }} className="hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg mx-1">
                    <ShoppingBag className="w-4 h-4 ml-2 text-amber-600 dark:text-amber-400" />
                    {tHeader('myOrders')}
                  </DropdownMenuItem>
                  <DropdownMenuItem style={{ fontFamily: 'Tajawal, sans-serif' }} className="hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg mx-1">
                    <Heart className="w-4 h-4 ml-2 text-amber-600 dark:text-amber-400" />
                    {tHeader('wishlist')}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-amber-100 dark:bg-amber-900/20" />
                  <DropdownMenuItem onClick={() => setIsLoggedIn(false)} style={{ fontFamily: 'Tajawal, sans-serif' }} className="hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg mx-1 text-red-600 dark:text-red-400">
                    {tHeader('logout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" size="sm" className="p-2.5 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-xl transition-all duration-300 group flex items-center gap-2" onClick={() => setIsLoggedIn(true)}>
                <div className="w-5 h-5 rounded-md bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <img
                    src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1'/%3E%3C/svg%3E"
                    alt="Login"
                    className="w-3 h-3"
                  />
                </div>
                <span style={{ fontFamily: 'Tajawal, sans-serif' }} className="text-gray-600 dark:text-gray-300 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors duration-300">{tHeader('login')}</span>
              </Button>
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
          <div className="lg:hidden flex items-center space-x-2 rtl:space-x-reverse">
            {/* Mobile Wishlist */}
            <Link href="/wishlist">
              <Button variant="ghost" size="sm" className="relative p-2 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-xl transition-all duration-300">
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
              <Button variant="ghost" size="sm" className="relative p-2 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-xl transition-all duration-300">
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
            <Button variant="ghost" size="sm" className="p-2 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-xl transition-all duration-300" onClick={() => setIsLoggedIn(!isLoggedIn)}>
              <div className="w-5 h-5 rounded-md bg-gradient-to-r from-green-500 to-teal-600 flex items-center justify-center shadow-lg">
                <img
                  src={isLoggedIn
                    ? "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'/%3E%3C/svg%3E"
                    : "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1'/%3E%3C/svg%3E"
                  }
                  alt={isLoggedIn ? "User Account" : "Login"}
                  className="w-3 h-3"
                />
              </div>
            </Button>

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
          <div className="lg:hidden border-t border-amber-100 dark:border-amber-900/20 py-6 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl rounded-b-2xl mt-2 shadow-2xl">
            <nav className="space-y-3">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block text-gray-700 dark:text-gray-200 hover:text-amber-600 dark:hover:text-amber-400 font-medium transition-all duration-300 p-3 rounded-xl hover:bg-amber-50 dark:hover:bg-amber-900/20"
                  style={{ fontFamily: 'Tajawal, sans-serif' }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-4 border-t border-amber-100 dark:border-amber-900/20">
                <div className="flex gap-3">
                  <Button variant="ghost" className="flex-1 text-gray-700 dark:text-gray-200 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-xl transition-all duration-300">
                    {tHeader('services')}
                  </Button>
                  <Button variant="ghost" className="flex-1 text-gray-700 dark:text-gray-200 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-xl transition-all duration-300">
                    {tFooter('links.products')}
                  </Button>
                </div>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}