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
        <h1 className="text-5xl font-bold mb-4">
            CONFIRME SEU CADASTRO NO EMAIL
          </h1>
          <br/>
          <p className="text-lg mb-4">
            Falta muito pouco, basta confirmar sua inscrição no seu e-mail!
          </p>
          <p className="text-lg mb-4">
            Não esqueça de conferir na sua caixa de Spam.
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
