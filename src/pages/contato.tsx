import React from 'react'
import Layout from '@components/layout'

import Headline from '@components/shared/headline'
import Seo from '@components/infra/seo'
import { Breadcrumb } from 'gatsby-plugin-breadcrumb'
import { PageProps } from 'gatsby'

import ContactForm from '@components/shared/contactForm'

interface Props {
  pageContext: PageProps
}

const contato: React.FC<Props> = ({ pageContext }) => {
  const {
    //@ts-ignore
    breadcrumb: { crumbs }
  } = pageContext

  return (
    <Layout>
      <Seo title="Contato | Gustavo Rocha" description="Página de contato" />
      <div className="container mt-12 mb-12 md:mt-24 md:mb-20 px-4">
        <div className="flex">
          <div className="w-full lg:w-5/12">
            <Headline title="Contato" />
            <Breadcrumb
              className="text-sm"
              crumbs={crumbs}
              crumbLabel="Contato"
            />
          </div>
        </div>
      </div>
      <div className="container px-4 mb-32">
        <div className="flex flex-wrap justify-between">
          <div className="lg:w-1/3">
            <div className="prose xl:prose-lg mb-6 dark:prose-dark">
              <p>Vamos falar de negócios?</p>
            </div>
            <ContactForm />
          </div>
          <div className="lg:w-2/3">
            <div className="prose xl:prose-lg mb-6 dark:prose-dark">
              <p>Vamos falar de negócios?</p>
            </div>
            <iframe
              title="Mapa da onSERP"
              className="lazyload"
              data-src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2062.8247832679263!2d-43.19824160541615!3d-22.893595152937078!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x997f39486a3fe1%3A0x5a573411f8484262!2sAQWA%20Corporate!5e0!3m2!1spt-BR!2sbr!4v1597104386481!5m2!1spt-BR!2sbr"
              width="100%"
              height="250"
              style={{ border: 0 }}
              frameBorder="0"
              allowFullScreen={false}
              aria-hidden="false"
              tabIndex={0}
            ></iframe>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default contato
