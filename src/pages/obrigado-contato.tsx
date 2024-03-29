import React from 'react'
import Layout from '@components/layout'
import Seo from '@components/infra/seo'
import { Link } from 'gatsby'

const NotFoundPage = () => (
  <div>
    <Layout>
      <Seo title="Confirmação de Cadastro | SEO Otto Varga" />
      <div className="flex justify-center items-center mt-32 max-w-2xl mx-auto px-4">
        <div className="text-center">
          <p className="text-lg mb-4">
            Obrigado pelo contato! Responderei o mais breve possível.
          </p>
          <p>
            <Link className="underline" to="/">
              Voltar para Home
            </Link>
          </p>
        </div>
      </div>
    </Layout>
  </div>
)

export default NotFoundPage
