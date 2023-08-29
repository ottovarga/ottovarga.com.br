import React from 'react'
import Layout from '@components/layout'
import Seo from '@components/infra/seo'
import { Link } from 'gatsby'

const NotFoundPage = () => (
  <div>
    <Layout>
      <Seo title="Confirmação de Cadastro | OV SEO" />
      <div className="flex justify-center items-center mt-32 max-w-2xl mx-auto px-4">
        <div className="text-center">
          <p className="text-lg mb-4">
            Recebi seu cadastro, agora basta confirmar a inscrição no seu e-mail!
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
