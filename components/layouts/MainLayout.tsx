import React, { PropsWithChildren } from 'react'
import { Header } from '../header'
import { useTranslations } from 'next-intl'
import { Footer } from '../footer'

const MainLayout = ({ children }: PropsWithChildren) => {
  const headerT = useTranslations('header')
  const footerT = useTranslations('footer')
  const heroT = useTranslations('hero')

  return (
    <div className="min-h-screen">
      <Header
        services={headerT('services')}
        categories={headerT('categories')}
        about={headerT('about')}
        contact={headerT('contact')}

      />
      <main>
        {children}
      </main>
      <Footer
        company={footerT('company')}
        description={footerT('description')}
        quickLinks={footerT('quickLinks')}
        services={footerT('services')}
        newsletter={footerT('newsletter')}
        followUs={footerT('followUs')}
      />
    </div>
  )
}

export default MainLayout