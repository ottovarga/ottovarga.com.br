import React from 'react'

import Layout from '@components/layout'
import SearchField from '@components/shared/search/searchField'

import Arrow from '@svg/arrow.svg'

import Seo from '@components/infra/seo'

const search: React.FC = () => {
  return (
    <Layout>
      <Seo title="Buscar | Gustavo Rocha" />
      <div className="container">
        <div className="flex justify-center py-16 px-4">
          <div className="xl:w-4/5">
            <div className="flex justify-between mb-8 items-center">
              <h1 className="text-3xl font-display font-bold">Buscar</h1>
              <button
                aria-label="Voltar para a página anterior"
                className="text-gray-700 dark:text-gray-300 flex items-center"
                onClick={() => history.back()}
              >
                <Arrow className="transform-gpu rotate-180 w-4 ml-0 mr-2 fill-current" />
                <span>Voltar</span>
              </button>
            </div>
            <SearchField />
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default search
