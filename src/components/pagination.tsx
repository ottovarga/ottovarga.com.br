import React from 'react'
import { Link } from 'gatsby'

import Arrow from '@svg/arrow.svg'

const pagination = ({ pageContext, pathPrefix }) => {
  const {
    previousPagePath,
    nextPagePath,
    pageNumber,
    numberOfPages
  } = pageContext

  return (
    <div className="container mx-auto px-4 pb-16">
      <nav className="pagination" role="navigation">
        <div>
          {previousPagePath && (
            <div className="inline-block">
              <Link to={previousPagePath} rel="prev">
                <div className="font-display text-xl flex">
                  <Arrow
                    width={20}
                    className="transform rotate-180 mr-4 fill-current text-black"
                  />
                  página anterior
                </div>
              </Link>
            </div>
          )}
          {nextPagePath && (
            <div className="inline-block">
              <Link to={nextPagePath} rel="next">
                <div className="font-display text-xl flex">
                  próxima página{' '}
                  <Arrow
                    width={20}
                    className="fill-current text-black ml-4 dark:text-white"
                  />
                </div>
              </Link>
            </div>
          )}
        </div>
      </nav>
    </div>
  )
}

export default pagination
