"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Cookie,
  Shield,
  BarChart,
  Target,
  Settings,
  Info,
  CheckCircle,
  AlertTriangle,
  Save,
  Calendar,
  ArrowLeft,
  Eye,
  Database,
  Zap
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function CookiesPage() {
  const t = useTranslations('cookies');
  const router = useRouter();

  const [preferences, setPreferences] = useState({
    necessary: true, // Always required
    analytics: true,
    marketing: false,
    personalization: true,
  });

  const [hasChanges, setHasChanges] = useState(false);

  const cookieTypes = [
    {
      id: 'necessary',
      icon: Shield,
      title: t('types.necessary.title'),
      description: t('types.necessary.description'),
      examples: t('types.necessary.examples'),
      required: true,
      color: 'bg-green-100 text-green-600',
      badgeColor: 'bg-green-100 text-green-800',
    },
    {
      id: 'analytics',
      icon: BarChart,
      title: t('types.analytics.title'),
      description: t('types.analytics.description'),
      examples: t('types.analytics.examples'),
      required: false,
      color: 'bg-blue-100 text-blue-600',
      badgeColor: 'bg-blue-100 text-blue-800',
    },
    {
      id: 'marketing',
      icon: Target,
      title: t('types.marketing.title'),
      description: t('types.marketing.description'),
      examples: t('types.marketing.examples'),
      required: false,
      color: 'bg-purple-100 text-purple-600',
      badgeColor: 'bg-purple-100 text-purple-800',
    },
    {
      id: 'personalization',
      icon: Settings,
      title: t('types.personalization.title'),
      description: t('types.personalization.description'),
      examples: t('types.personalization.examples'),
      required: false,
      color: 'bg-orange-100 text-orange-600',
      badgeColor: 'bg-orange-100 text-orange-800',
    },
  ];

  const handlePreferenceChange = (type: string, value: boolean) => {
    if (type === 'necessary') return; // Cannot be disabled

    setPreferences(prev => ({
      ...prev,
      [type]: value,
    }));
    setHasChanges(true);
  };

  const handleSavePreferences = () => {
    // Here you would save to localStorage or send to your analytics service
    localStorage.setItem('cookiePreferences', JSON.stringify(preferences));
    setHasChanges(false);
    toast.success(t('preferences.saved'));
  };

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
      personalization: true,
    };
    setPreferences(allAccepted);
    localStorage.setItem('cookiePreferences', JSON.stringify(allAccepted));
    toast.success(t('preferences.allAccepted'));
  };

  const handleRejectOptional = () => {
    const onlyNecessary = {
      necessary: true,
      analytics: false,
      marketing: false,
      personalization: false,
    };
    setPreferences(onlyNecessary);
    localStorage.setItem('cookiePreferences', JSON.stringify(onlyNecessary));
    toast.success(t('preferences.onlyNecessary'));
  };

  return (
    <div className="min-h-screen pt-20" style={{ background: 'var(--brand-bg)' }}>
      <div className="section-padding">
        <div className="section-container">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center shadow-lg"
              style={{ background: 'linear-gradient(135deg, var(--brand-gold), var(--brand-navy))' }}>
              <Cookie className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold brand-heading mb-4">{t('title')}</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
              {t('subtitle')}
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              <span>{t('lastUpdated')}: {new Date().toLocaleDateString()}</span>
            </div>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="text-lg">{t('quickActions')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    onClick={handleAcceptAll}
                    className="w-full btn-primary"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    {t('acceptAll')}
                  </Button>
                  <Button
                    onClick={handleRejectOptional}
                    variant="outline"
                    className="w-full"
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    {t('rejectOptional')}
                  </Button>
                  {hasChanges && (
                    <Button
                      onClick={handleSavePreferences}
                      variant="outline"
                      className="w-full"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {t('savePreferences')}
                    </Button>
                  )}
                  <Separator />
                  <nav className="space-y-2">
                    <a href="#what-are-cookies" className="block text-sm text-blue-600 hover:text-blue-500">
                      {t('nav.whatAreCookies')}
                    </a>
                    <a href="#how-we-use" className="block text-sm text-blue-600 hover:text-blue-500">
                      {t('nav.howWeUse')}
                    </a>
                    <a href="#cookie-types" className="block text-sm text-blue-600 hover:text-blue-500">
                      {t('nav.cookieTypes')}
                    </a>
                    <a href="#manage-preferences" className="block text-sm text-blue-600 hover:text-blue-500">
                      {t('nav.managePreferences')}
                    </a>
                  </nav>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-8">
              {/* Introduction */}
              <Card id="what-are-cookies" className="scroll-mt-24">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <Info className="w-6 h-6 text-blue-600" />
                    {t('sections.whatAreCookies.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-gray max-w-none">
                    <p className="text-lg leading-relaxed text-gray-700 mb-4">
                      {t('sections.whatAreCookies.description')}
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      {t('sections.whatAreCookies.details')}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* How We Use Cookies */}
              <Card id="how-we-use" className="scroll-mt-24">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <Eye className="w-6 h-6 text-green-600" />
                    {t('sections.howWeUse.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                          <Zap className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold mb-1">{t('sections.howWeUse.performance.title')}</h4>
                          <p className="text-sm text-gray-600">{t('sections.howWeUse.performance.description')}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
                          <Settings className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold mb-1">{t('sections.howWeUse.functionality.title')}</h4>
                          <p className="text-sm text-gray-600">{t('sections.howWeUse.functionality.description')}</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center shrink-0">
                          <BarChart className="w-4 h-4 text-purple-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold mb-1">{t('sections.howWeUse.analytics.title')}</h4>
                          <p className="text-sm text-gray-600">{t('sections.howWeUse.analytics.description')}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center shrink-0">
                          <Target className="w-4 h-4 text-orange-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold mb-1">{t('sections.howWeUse.marketing.title')}</h4>
                          <p className="text-sm text-gray-600">{t('sections.howWeUse.marketing.description')}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Cookie Types */}
              <Card id="cookie-types" className="scroll-mt-24">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <Database className="w-6 h-6 text-purple-600" />
                    {t('sections.cookieTypes.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {cookieTypes.map((type, index) => (
                      <div key={type.id} className="border rounded-xl p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-4 flex-1">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${type.color}`}>
                              <type.icon className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-semibold">{type.title}</h3>
                                {type.required ? (
                                  <Badge className="bg-gray-100 text-gray-800">
                                    {t('required')}
                                  </Badge>
                                ) : (
                                  <Badge variant="outline">
                                    {t('optional')}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-gray-600 mb-3">{type.description}</p>
                              <div className="text-sm text-gray-500">
                                <strong>{t('examples')}:</strong> {type.examples}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <Switch
                              checked={preferences[type.id as keyof typeof preferences]}
                              onCheckedChange={(checked) => handlePreferenceChange(type.id, checked)}
                              disabled={type.required}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Manage Preferences */}
              <Card id="manage-preferences" className="scroll-mt-24">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <Settings className="w-6 h-6 text-green-600" />
                    {t('sections.managePreferences.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        {t('sections.managePreferences.description')}
                      </AlertDescription>
                    </Alert>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3">{t('sections.managePreferences.browserSettings.title')}</h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                          <li>• {t('sections.managePreferences.browserSettings.chrome')}</li>
                          <li>• {t('sections.managePreferences.browserSettings.firefox')}</li>
                          <li>• {t('sections.managePreferences.browserSettings.safari')}</li>
                          <li>• {t('sections.managePreferences.browserSettings.edge')}</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-3">{t('sections.managePreferences.thirdParty.title')}</h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                          <li>• <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-500">Google Analytics Opt-out</a></li>
                          <li>• <a href="http://optout.aboutads.info/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-500">Digital Advertising Alliance</a></li>
                          <li>• <a href="http://www.youronlinechoices.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-500">Your Online Choices</a></li>
                        </ul>
                      </div>
                    </div>

                    {hasChanges && (
                      <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          {t('sections.managePreferences.unsavedChanges')}
                        </AlertDescription>
                      </Alert>
                    )}

                    <div className="flex gap-4">
                      <Button onClick={handleSavePreferences} className="btn-primary">
                        <Save className="w-4 h-4 mr-2" />
                        {t('savePreferences')}
                      </Button>
                      <Button onClick={handleAcceptAll} variant="outline">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        {t('acceptAll')}
                      </Button>
                      <Button onClick={handleRejectOptional} variant="outline">
                        <Shield className="w-4 h-4 mr-2" />
                        {t('rejectOptional')}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Navigation */}
              <div className="flex flex-col sm:flex-row gap-4 pt-8">
                <Button
                  variant="outline"
                  onClick={() => router.back()}
                  className="gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  {t('goBack')}
                </Button>
                <Button asChild className="btn-primary">
                  <Link href="/contact">{t('contactUs')}</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
