"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Sparkles, Send } from "lucide-react"
import Link from "next/link"
import { useTranslations } from 'next-intl'

interface FooterProps {
  company: string
  description: string
  quickLinks: string
  services: string
  newsletter: string
  followUs: string
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
  const quickLinks = [
    { name: t('links.home'), href: "/" },
    { name: t('links.products'), href: "/products" },
    { name: t('links.portfolio'), href: "#portfolio" },
    { name: t('links.about'), href: "#about" },
    { name: t('links.contact'), href: "#contact" }
  ]

  const services = [
    t('services'),
    t('company'),
  ]
  const localizedServices = [
    t('services'),
  ]

  const socialLinks = [
    { name: "Facebook", icon: Facebook, href: "#" },
    { name: "Twitter", icon: Twitter, href: "#" },
    { name: "Instagram", icon: Instagram, href: "#" },
    { name: "LinkedIn", icon: Linkedin, href: "#" }
  ]

  return (
    <footer className="footer-enhanced">
      <div className="section-container">
        <div className="footer-content">

          {/* Company Info */}
          <div className="footer-section">
            <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse hover:opacity-80 transition-opacity mb-6">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, var(--brand-gold), var(--brand-gold-dark))' }}>
                <Sparkles className="w-6 h-6 text-white" />
              </div>
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
                <span className="text-gray-300">+966 50 123 4567</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: 'rgba(255, 204, 0, 0.2)' }}>
                  <Mail className="w-4 h-4 text-yellow-400" />
                </div>
                <span className="text-gray-300">info@linkimagination.com</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: 'rgba(255, 204, 0, 0.2)' }}>
                  <MapPin className="w-4 h-4 text-yellow-400" />
                </div>
                <span className="text-gray-300">الرياض، المملكة العربية السعودية</span>
              </div>
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
              {[t('services')].map((service, index) => (
                <li key={index} style={{ color: 'var(--brand-gray-300)' }}>
                  {service}
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
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3623.952446394948!2d46.67203887491216!3d24.69134785395158!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e2f03890d489399%3A0xba974d1c98e79fd5!2sRiyadh%20Saudi%20Arabia!5e0!3m2!1sen!2sus!4v1680000000000!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Company Location"
                ></iframe>
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
                        color: 'var(--brand-gray-300)'
                      }}
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  )
                })}
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
              <Link href="#" className="transition-colors duration-300" style={{ color: 'var(--brand-gray-400)' }}>
                {t('bottom.privacy')}
              </Link>
              <Link href="#" className="transition-colors duration-300" style={{ color: 'var(--brand-gray-400)' }}>
                {t('bottom.terms')}
              </Link>
              <Link href="#" className="transition-colors duration-300" style={{ color: 'var(--brand-gray-400)' }}>
                {t('bottom.cookies')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
