"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, Phone, MapPin, Sparkles, Send, CreditCard, Shield } from "lucide-react"
import Link from "next/link"
import { useTranslations } from 'next-intl'
import { useFeaturedServicesQuery } from '@/services'
import { useQuery } from '@tanstack/react-query'
import { axiosClient } from '@/lib/axios'
import Image from "next/image"

// Social Media SVG Icons
const FacebookIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
)

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
)

const TwitterIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
)

const LinkedInIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
)

const YouTubeIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
)

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
  </svg>
)

const TelegramIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
  </svg>
)

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
  </svg>
)

const SnapchatIcon = ({ 
  size = 24, 
  color = "#bdaaaa", 
  className = "",
  ...props 
}) => (
  <svg
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
      <g transform="translate(-380.000000, -7560.000000)" fill={"currentColor"}>
        <g transform="translate(56.000000, 160.000000)">
          <path d="M334.125531,7419 C332.838531,7419 332.277531,7418.71061 331.183531,7417.92743 C330.193531,7417.21913 329.558531,7416.82957 327.720531,7417.19283 C327.003531,7417.33449 327.017531,7417.26973 326.863531,7416.55333 C326.781531,7416.17591 326.722531,7415.94622 326.582531,7415.92396 C325.089531,7415.69123 324.206531,7415.3472 324.030531,7414.93133 C323.946531,7414.73098 324.046531,7414.57313 324.200531,7414.54682 C326.147531,7414.22303 327.721531,7412.58888 328.404531,7410.97902 C328.406531,7410.97497 328.407531,7410.97092 328.409531,7410.96789 C328.582531,7410.61374 328.616531,7410.30816 328.512531,7410.05924 C328.277531,7409.49867 327.520531,7409.3813 326.977531,7409.16274 C326.603531,7409.01298 325.988531,7408.69728 326.070531,7408.26219 C326.145531,7407.86352 326.784531,7407.61055 327.126531,7407.77245 C327.985531,7408.18023 328.673531,7408.05577 328.879531,7407.86352 C328.869531,7407.66823 328.999531,7407.45675 328.999531,7407.25843 C328.999531,7405.87927 328.651531,7404.16316 329.085531,7403.17963 C330.958531,7398.92984 337.206531,7398.95109 339.069531,7403.17761 C339.503531,7404.16215 339.396531,7405.87927 339.310531,7407.26045 L339.306531,7407.32622 C339.294531,7407.51341 339.283531,7407.69049 339.274531,7407.8625 C339.314531,7407.89994 339.475531,7408.02946 339.804531,7408.04261 C340.083531,7408.03148 340.405531,7407.94042 340.759531,7407.77245 C341.176531,7407.57514 341.927531,7407.87768 341.935531,7408.33099 C341.939531,7408.54247 341.784531,7408.85817 341.021531,7409.16274 C340.480531,7409.37927 339.721531,7409.49867 339.487531,7410.05924 C339.382531,7410.30816 339.416531,7410.61374 339.589531,7410.96688 C339.591531,7410.97092 339.592531,7410.97497 339.594531,7410.97902 C339.647531,7411.1055 340.932531,7414.06923 343.798531,7414.54682 C343.919531,7414.56706 344.006531,7414.67634 343.999531,7414.79979 C343.996531,7414.84431 343.986531,7414.88883 343.967531,7414.93234 C343.792531,7415.34619 342.910531,7415.68921 341.416531,7415.92193 C341.276531,7415.9442 341.217531,7416.17389 341.136531,7416.54929 C341.013531,7417.11997 341.032531,7417.31627 340.278531,7417.16652 C338.460531,7416.80832 337.771531,7417.24139 336.816531,7417.9244 C336.112531,7418.4283 335.316531,7419 334.125531,7419" />
        </g>
      </g>
    </g>
  </svg>
);

interface FooterProps {
  company: string
  description: string
  quickLinks: string
  services: string
  newsletter: string
  followUs: string
}

// Social media settings API query
const useSocialMediaSettings = () => {
  return useQuery({
    queryKey: ['socialMediaSettings'],
    queryFn: async () => {
      const response = await axiosClient.get('/settings/social')
      return response.data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function Footer({
  company,
  description,
  quickLinks: quickLinksTitle,
  services: servicesTitle,
  newsletter,
  followUs
}: FooterProps) {
  const t = useTranslations('footer')
  const { data: featuredServices } = useFeaturedServicesQuery(6) // Get more services for footer
  const { data: socialSettings } = useSocialMediaSettings()
  const quickLinks = [
    { name: t('links.home'), href: "/" },
    { name: t('links.products'), href: "/products" },
    { name: t('links.services'), href: "/services" },
    { name: t('links.categories'), href: "/categories" },
    { name: t('links.about'), href: "/about" },
    { name: t('links.contact'), href: "/contact" }
  ]

  // Map services from API to footer links
  const footerServices = featuredServices && featuredServices.length > 0
    ? featuredServices.slice(0, 6).map((service: any) => {
      const serviceName = typeof service.name === 'string' ? service.name : service.name?.en || service.name?.ar || 'Service'
      return {
        name: serviceName,
        href: `/services/${service.id}`
      }
    }) : []


  // Map social media settings from API
  const socialLinks = socialSettings?.data ? [
    ...(socialSettings.data.facebookUrl ? [{ name: "Facebook", icon: FacebookIcon, href: socialSettings.data.facebookUrl }] : []),
    ...(socialSettings.data.instagramUrl ? [{ name: "Instagram", icon: InstagramIcon, href: socialSettings.data.instagramUrl }] : []),
    ...(socialSettings.data.twitterUrl ? [{ name: "X (Twitter)", icon: TwitterIcon, href: socialSettings.data.twitterUrl }] : []),
    ...(socialSettings.data.linkedinUrl ? [{ name: "LinkedIn", icon: LinkedInIcon, href: socialSettings.data.linkedinUrl }] : []),
    ...(socialSettings.data.youtubeUrl ? [{ name: "YouTube", icon: YouTubeIcon, href: socialSettings.data.youtubeUrl }] : []),
    ...(socialSettings.data.whatsappNumber ? [{ name: "WhatsApp", icon: WhatsAppIcon, href:  socialSettings.data.whatsappNumber}] : []),
    ...(socialSettings.data.telegramUrl ? [{ name: "Telegram", icon: TelegramIcon, href: socialSettings.data.telegramUrl }] : []),
    ...(socialSettings.data.tiktokUrl ? [{ name: "TikTok", icon: TikTokIcon, href: socialSettings.data.tiktokUrl }] : []),
    ...(socialSettings.data.snapchatUrl ? [{ name: "Snapchat", icon: SnapchatIcon, href: socialSettings.data.snapchatUrl }] : [])
  ] : [
    { name: "Facebook", icon: FacebookIcon, href: "#" },
    { name: "X (Twitter)", icon: TwitterIcon, href: "#" },
    { name: "Instagram", icon: InstagramIcon, href: "#" },
    { name: "LinkedIn", icon: LinkedInIcon, href: "#" }
  ]

  return (
    <footer className="footer-enhanced">
      <div className="section-container">
        <div className="footer-content">

          {/* Company Info */}
          <div className="footer-section">
            <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse hover:opacity-80 transition-opacity mb-6">
              {/* <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, var(--brand-gold), var(--brand-gold-dark))' }}>
                <Sparkles className="w-6 h-6 text-white" />
              </div> */}
              <Image 
                src={"/m-logo-white.png"}
                alt={company}
                width={48}
                height={48}
                className="w-12 h-12 rounded-xl flex items-center justify-center"
              />
              <div className="text-2xl font-bold text-white">
                {company}
              </div>
            </Link>

            <p className="leading-relaxed text-gray-300 mb-6">
              {description}
            </p>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: 'rgba(255, 204, 0, 0.2)' }}>
                  <Phone className="w-4 h-4 text-yellow-400" />
                </div>
                <span className="text-gray-300" dir="ltr">+966 502 663 328</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: 'rgba(255, 204, 0, 0.2)' }}>
                  <Mail className="w-4 h-4 text-yellow-400" />
                </div>
                <span className="text-gray-300">rabtalk23@gmail.com</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: 'rgba(255, 204, 0, 0.2)' }}>
                  <MapPin className="w-4 h-4 text-yellow-400" />
                </div>
                <span className="text-gray-300 flex-1">{t('addressText')}</span>
              </div>
            </div>
            {/* Social Links */}
            <div className="flex gap-3 pt-4">
                <div className="sr-only">{t('followUs')}</div>
                {socialLinks.map((social, index) => {
                  const Icon = social.icon
                  return (
                    <a
                      key={index}
                      href={social.href}
                      className="w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 hover:scale-110"
                      style={{
                        borderColor: 'var(--brand-gray-600)',
                        color: 'var(--brand-gray-200)'
                      }}
                    >
                      <Icon className="w-5 h-5 text-gray-200" />
                    </a>
                  )
                })}
              </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h3 className="text-xl font-bold mb-6 brand-text">{quickLinksTitle}</h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="transition-all duration-300 hover:translate-x-2 inline-block"
                    style={{ color: 'var(--brand-gray-300)' }}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="footer-section">
            <h3 className="text-xl font-bold mb-6 brand-text">{servicesTitle}</h3>
            <ul className="space-y-3">
              {footerServices?.map((service, index) => (
                <li key={index}>
                  <Link
                    href={service.href}
                    className="transition-all duration-300 hover:translate-x-2 inline-block"
                    style={{ color: 'var(--brand-gray-300)' }}
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>


          {/* Location Map */}
          <div className="footer-section">
            <h3 className="text-xl font-bold mb-6 brand-text">{t('location', { default: 'Our Location' })}</h3>
            <p className="mb-4" style={{ color: 'var(--brand-gray-300)' }}>
              {t('locationDesc', { default: 'Visit our office or get in touch with us' })}
            </p>
            <div className="space-y-4">
              {/* Embedded Map */}
              <div className="w-full h-48 rounded-lg overflow-hidden border border-gray-600">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3624.7435780725514!2d46.803523!3d24.70134!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMjTCsDQyJzA0LjgiTiA0NsKwNDgnMTIuNyJF!5e0!3m2!1sen!2s!4v1757328557598!5m2!1sen!2s"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Company Location"
                ></iframe>
              </div>

              

              {/* Payment Method Icons */}
              <div className="flex gap-3">
                <div className="sr-only">{t('paymentMethods.title')}</div>
                {/* Mada */}
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center border-2 transition-all duration-300 hover:scale-110 cursor-pointer"
                  style={{
                    borderColor: 'var(--brand-gray-600)',
                    background: 'rgba(255, 255, 255, 0.95)',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                  }}
                  title={t('paymentMethods.mada')}
                >
                  <Image src="/mada.png" alt={t('paymentMethods.mada')} width={28} height={28} className="object-contain" />
                </div>

                {/* Visa */}
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center border-2 transition-all duration-300 hover:scale-110 cursor-pointer"
                  style={{
                    borderColor: 'var(--brand-gray-600)',
                    background: 'rgba(255, 255, 255, 0.95)',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                  }}
                  title={t('paymentMethods.visa')}
                >
                  <Image src="/visa.png" alt={t('paymentMethods.visa')} width={28} height={28} className="object-contain" />
                </div>

                {/* Mastercard */}
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center border-2 transition-all duration-300 hover:scale-110 cursor-pointer"
                  style={{
                    borderColor: 'var(--brand-gray-600)',
                    background: 'rgba(255, 255, 255, 0.95)',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                  }}
                  title={t('paymentMethods.mastercard')}
                >
                  <Image src="/master.png" alt={t('paymentMethods.mastercard')} width={28} height={28} className="object-contain" />
                </div>

                {/* Amex */}
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center border-2 transition-all duration-300 hover:scale-110 cursor-pointer"
                  style={{
                    borderColor: 'var(--brand-gray-600)',
                    background: 'rgba(255, 255, 255, 0.95)',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                  }}
                  title={t('paymentMethods.amex')}
                >
                  <Image src="/amex.png" alt={t('paymentMethods.amex')} width={28} height={28} className="object-contain" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t pt-8" style={{ borderColor: 'var(--brand-gray-600)' }}>
        <div className="section-container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div style={{ color: 'var(--brand-gray-400)' }}>
              {t('bottom.copyright', { year: new Date().getFullYear(), company })}
            </div>
            <div className="flex gap-6 text-sm">
              <Link href="/privacy-policy" className="transition-colors duration-300" style={{ color: 'var(--brand-gray-400)' }}>
                {t('bottom.privacy')}
              </Link>
              <Link href="/terms-and-conditions" className="transition-colors duration-300" style={{ color: 'var(--brand-gray-400)' }}>
                {t('bottom.terms')}
              </Link>
              <Link href="/cookie-policy" className="transition-colors duration-300" style={{ color: 'var(--brand-gray-400)' }}>
                {t('bottom.cookies')}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Floating WhatsApp Button */}
      {socialSettings?.data?.whatsappNumber && (
        <div className="fixed bottom-6 right-6 z-50">
          <a
            href={`https://wa.me/${socialSettings.data.whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex items-center justify-center w-16 h-16 bg-green-500 hover:bg-green-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 whatsapp-float"
          >
            {/* Main button content */}
            <div className="relative z-10">
              <WhatsAppIcon className="w-8 h-8 text-white" />
            </div>
            
            {/* Tooltip */}
            <div className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <div className="bg-gray-900 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap">
                {t('whatsappTooltip', { default: 'تواصل معنا عبر واتساب' })}
                <div className="absolute left-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-l-gray-900"></div>
              </div>
            </div>
          </a>
        </div>
      )}
    </footer>
  )
}
