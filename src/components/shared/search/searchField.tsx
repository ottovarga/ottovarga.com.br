import React from 'react'
import algoliasearch from 'algoliasearch/lite'
import {
  InstantSearch,
  SearchBox,
  Hits,
  Stats,
  PoweredBy
} from 'react-instantsearch-dom'

import SearchResults from '@components/shared/search/searchResults'

import * as styles from './style.module.css'

const searchClient = algoliasearch(
  'OTAWGRNR3I',
  '74b3a625f498c279f812a36353a86cb2'
)

const searchField = () => {
  return (
    <InstantSearch searchClient={searchClient} indexName="Blog Otto">
      <SearchBox
        // @ts-ignore
        className={styles.searchInput}
        autoFocus={true}
        translations={{
          submitTitle: 'Submit your search query.',
          resetTitle: 'Clear your search query.',
          placeholder: 'Buscar'
        }}
        reset={<span></span>}
      />
      <div className="flex justify-between text-xs text-gray-500 my-4 items-center">
        <Stats
          translations={{
            stats(nbHits, timeSpentMS) {
              return `${nbHits} resultados encontrados em ${timeSpentMS}ms`
            }
          }}
        />
        <PoweredBy
          className={styles.poweredby}
          translations={{
            searchBy: 'Powered by'
          }}
        />
      </div>
      <Hits
        hitComponent={SearchResults}
        // @ts-ignore
        className={styles.searchResults}
      />
    </InstantSearch>
  )
}

export default searchField
