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
              <p>
                Tem alguma dúvida, solicitaçao de orçamento ou quer bater um
                papo? Chama ae!
              </p>
            </div>
            <ContactForm />
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default contato
