import React from 'react'
import { Link } from 'gatsby'
import { Highlight } from 'react-instantsearch-dom'
import { Hit, BasicDoc } from 'react-instantsearch-core'

const searchResults: React.ComponentType<{ hit: Hit<BasicDoc> }> = ({
  hit
}) => {
  const { objectID, title, date, image } = hit

  return (
    <div key={objectID}>
      <Link to={`/${objectID}`}>
        <h3 className="text-xl mb-1 font-display font-bold">
          <Highlight hit={hit} attribute="title" tagName="b" />
        </h3>
        <p className="text-xs text-gray-500 mb-4">{date}</p>

        <div className="flex justify-between">
          {image && (
            <img src={image} alt={title} className="w-32 mr-4" loading="lazy" />
          )}
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <Highlight hit={hit} attribute="excerpt" tagName="b" />
          </p>
        </div>
      </Link>
    </div>
  )
}

export default searchResults
