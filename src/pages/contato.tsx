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
      <Seo title="Contato | SEO Otto Varga" description="Página de contato" />
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
          <div className="lg:w-1/3 pr-4">
            <div className="prose xl:prose-lg mb-6 dark:prose-dark">
              <h2>Quer falar comigo? Mande uma mensagem!</h2>
            </div>
            <ContactForm />
          </div>
          <div className="lg:w-2/5 pl-4">
            <div className="prose xl:prose-lg mb-6 dark:prose-dark">
              <h2>Quando não estou em Home Office estou aqui:</h2>
            </div>
            <iframe
              title="Mapa da onSERP"
              className="lazyload"
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14702.144701820083!2d-43.1967135!3d-22.8935863!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0xfbadf598b9761f1a!2sonSERP%20Marketing%20-%20Ag%C3%AAncia%20de%20SEO%20e%20desenvolvimento%20de%20site%20e%20E-commerce!5e0!3m2!1spt-BR!2sbr!4v1610495507061!5m2!1spt-BR!2sbr"
              width="100%"
              height="250"
              loading="lazy"
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
