import React from 'react'
import Layout from '@components/layout'
import Seo from '@components/infra/seo'

const NotFoundPage = () => (
  <div>
    <Layout>
      <Seo title="Página não encontrada | Gustavo Rocha" />
      <div className="flex justify-center items-center mt-32 max-w-2xl mx-auto px-4">
        <div className="text-center">
          <h1 className="text-5xl font-display font-bold mb-4">
            404: Página não encontrada
          </h1>
          <p className="text-lg">
            Parace que alguma coisa deu errado aí... Volte algumas casas e
            aguarde novamente a sua vez de jogar.
          </p>
        </div>
      </div>
    </Layout>
  </div>
)

export default NotFoundPage
