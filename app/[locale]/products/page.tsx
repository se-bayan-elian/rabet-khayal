'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Code, Palette, BarChart3, Zap, Shield, Users, Heart, Star, CheckCircle, Globe, Smartphone, Monitor, PenTool, Camera, Megaphone, Target, TrendingUp } from 'lucide-react';

const ProductsPage = () => {
  const services = [
    {
      category: "تطوير المواقع",
      icon: <Code className="w-8 h-8" />,
      description: "حلول تطوير مواقع متقدمة ومتجاوبة",
      services: [
        { name: "مواقع الشركات", price: "من 2,500 ريال", features: ["تصميم احترافي", "متجاوب", "لوحة تحكم", "SEO محسن"] },
        { name: "متاجر إلكترونية", price: "من 4,500 ريال", features: ["نظام دفع آمن", "إدارة المخزون", "تتبع الطلبات", "تحليلات مفصلة"] },
        { name: "مواقع مخصصة", price: "حسب المتطلبات", features: ["حلول مبتكرة", "تقنيات حديثة", "أداء عالي", "دعم مستمر"] }
      ]
    },
    {
      category: "التصميم والعلامة التجارية",
      icon: <Palette className="w-8 h-8" />,
      description: "تصاميم إبداعية تعكس هوية علامتك التجارية",
      services: [
        { name: "تصميم الهوية البصرية", price: "من 1,500 ريال", features: ["شعار احترافي", "دليل الهوية", "قوالب التصميم", "ألوان وخطوط"] },
        { name: "تصميم المطبوعات", price: "من 500 ريال", features: ["كروت أعمال", "بروشورات", "لافتات", "مواد إعلانية"] },
        { name: "تصميم الواجهات", price: "من 2,000 ريال", features: ["UI/UX Design", "نماذج تفاعلية", "اختبار المستخدم", "تحسين التجربة"] }
      ]
    },
    {
      category: "التسويق الرقمي",
      icon: <BarChart3 className="w-8 h-8" />,
      description: "استراتيجيات تسويقية متقدمة لنمو عملك",
      services: [
        { name: "إدارة وسائل التواصل", price: "من 1,200 ريال/شهرياً", features: ["إنشاء المحتوى", "جدولة المنشورات", "تفاعل مع العملاء", "تحليل الأداء"] },
        { name: "إعلانات جوجل", price: "من 800 ريال/شهرياً", features: ["بحث الكلمات المفتاحية", "إنشاء الحملات", "تحسين الإعلانات", "تقارير شاملة"] },
        { name: "تحسين محركات البحث", price: "من 1,000 ريال/شهرياً", features: ["تحليل الموقع", "تحسين المحتوى", "بناء الروابط", "متابعة التصنيف"] }
      ]
    },
    {
      category: "التطبيقات المحمولة",
      icon: <Smartphone className="w-8 h-8" />,
      description: "تطبيقات ذكية لنظامي iOS و Android",
      services: [
        { name: "تطبيقات الأعمال", price: "من 8,000 ريال", features: ["نظام إدارة", "تقارير مالية", "إشعارات ذكية", "أمان عالي"] },
        { name: "تطبيقات التجارة", price: "من 12,000 ريال", features: ["واجهة متجر", "نظام دفع", "تتبع الطلبات", "برنامج ولاء"] },
        { name: "تطبيقات مخصصة", price: "حسب المتطلبات", features: ["فكرة مبتكرة", "تقنيات متطورة", "اختبار شامل", "نشر في المتاجر"] }
      ]
    },
    {
      category: "الاستشارات التقنية",
      icon: <Users className="w-8 h-8" />,
      description: "خبرة تقنية متخصصة لحلول عملك",
      services: [
        { name: "تحليل الأعمال", price: "من 2,000 ريال", features: ["دراسة الاحتياجات", "تحليل السوق", "خطة التنفيذ", "توقعات النمو"] },
        { name: "الأمن السيبراني", price: "من 3,000 ريال", features: ["فحص الثغرات", "خطة الحماية", "تدريب الموظفين", "مراقبة مستمرة"] },
        { name: "التحول الرقمي", price: "حسب النطاق", features: ["تقييم الوضع الحالي", "استراتيجية التحول", "تنفيذ التقنيات", "قياس النتائج"] }
      ]
    }
  ];

  const features = [
    { icon: <Shield className="w-6 h-6" />, title: "أمان عالي", desc: "حماية متقدمة لبياناتك" },
    { icon: <Zap className="w-6 h-6" />, title: "أداء سريع", desc: "سرعة استجابة فائقة" },
    { icon: <Heart className="w-6 h-6" />, title: "دعم مستمر", desc: "خدمة عملاء على مدار الساعة" },
    { icon: <Star className="w-6 h-6" />, title: "جودة عالية", desc: "معايير احترافية متقدمة" }
  ];

  return (
    <div className="pt-20" style={{ background: 'var(--brand-bg)' }}>
      {/* Hero Section */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-6xl mx-auto">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full"
            style={{ background: 'var(--brand-accent)', color: 'var(--brand-navy)' }}>
            <Star className="w-5 h-5" />
            <span className="font-semibold">خدماتنا المتميزة</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6" style={{ color: 'var(--brand-navy)' }}>
            حلول <span className="brand-text">متكاملة</span>
            <br />لنجاح مشروعك
          </h1>

          <p className="text-xl mb-10 max-w-3xl mx-auto" style={{ color: 'var(--brand-gray)' }}>
            نقدم مجموعة شاملة من الخدمات التقنية والإبداعية لتحقيق أهدافك وتطوير أعمالك بأعلى المعايير المهنية
          </p>

          <div className="flex flex-wrap justify-center gap-6 mb-16">
            {features.map((feature, index) => (
              <div key={index} className="card-elegant p-6 flex items-center gap-4 hover:scale-105 transition-transform duration-300">
                <div className="flex-shrink-0 p-3 rounded-full" style={{ background: 'var(--brand-accent)' }}>
                  <div style={{ color: 'var(--brand-navy)' }}>{feature.icon}</div>
                </div>
                <div className="text-right">
                  <h3 className="font-bold text-lg" style={{ color: 'var(--brand-navy)' }}>{feature.title}</h3>
                  <p className="text-sm" style={{ color: 'var(--brand-gray)' }}>{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid gap-8">
            {services.map((category, categoryIndex) => (
              <div key={categoryIndex} className="fade-in">
                {/* Category Header */}
                <div className="text-center mb-12">
                  <div className="inline-flex items-center gap-4 mb-4">
                    <div className="p-4 rounded-full" style={{ background: 'var(--brand-accent)', color: 'var(--brand-navy)' }}>
                      {category.icon}
                    </div>
                    <div className="text-right">
                      <h2 className="text-3xl font-bold" style={{ color: 'var(--brand-navy)' }}>{category.category}</h2>
                      <p className="text-lg" style={{ color: 'var(--brand-gray)' }}>{category.description}</p>
                    </div>
                  </div>
                </div>

                {/* Services Cards */}
                <div className="grid md:grid-cols-3 gap-8 mb-16">
                  {category.services.map((service, serviceIndex) => (
                    <Card key={serviceIndex} className="card-elegant hover:scale-105 transition-all duration-300 border-0 shadow-lg">
                      <CardHeader className="pb-4">
                        <CardTitle className="text-xl font-bold" style={{ color: 'var(--brand-navy)' }}>{service.name}</CardTitle>
                        <div className="text-2xl font-bold brand-text">{service.price}</div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <ul className="space-y-3">
                          {service.features.map((feature, featureIndex) => (
                            <li key={featureIndex} className="flex items-center gap-3">
                              <CheckCircle className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--brand-gold)' }} />
                              <span style={{ color: 'var(--brand-gray)' }}>{feature}</span>
                            </li>
                          ))}
                        </ul>
                        <Button className="btn-creative w-full mt-6">
                          طلب الخدمة
                          <ArrowRight className="w-4 h-4 mr-2" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="card-elegant p-12 rounded-3xl relative overflow-hidden">
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 left-0 w-32 h-32 rounded-full" style={{ background: 'var(--brand-gold)' }}></div>
              <div className="absolute bottom-0 right-0 w-24 h-24 rounded-full" style={{ background: 'var(--brand-navy)' }}></div>
            </div>

            <div className="relative z-10">
              <h2 className="text-4xl font-bold mb-6" style={{ color: 'var(--brand-navy)' }}>
                جاهز للبدء في مشروعك؟
              </h2>
              <p className="text-xl mb-8" style={{ color: 'var(--brand-gray)' }}>
                احصل على استشارة مجانية واكتشف كيف يمكننا مساعدتك في تحقيق أهدافك
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button size="lg" className="btn-creative px-10 py-4 text-lg font-bold">
                  <Users className="w-6 h-6 mr-3" />
                  استشارة مجانية
                </Button>
                <Button size="lg" variant="outline" className="px-10 py-4 text-lg font-bold border-2"
                  style={{ borderColor: 'var(--brand-gold)', color: 'var(--brand-navy)' }}>
                  تواصل معنا
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductsPage;
