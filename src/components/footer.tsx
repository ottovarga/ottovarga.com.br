import React from 'react'
import { Link } from 'gatsby'

import InstagramIcon from '@svg/instagram.svg'
import TwitterIcon from '@svg/twitter.svg'
import GithubIcon from '@svg/github.svg'

const footer: React.FC = () => {
  return (
    <footer>
      <div className="container pb-12 px-4">
        <div className="flex flex-wrap items-center justify-between text-sm text-gray-700 dark:text-gray-300">
          <div className="mb-4 md:mb-0">
            <p>
              Copyright © 2020, Gustavo Rocha. Todos os direitos reservados.{' '}
              <Link className="hover:underline" to="/politica-de-privacidade">
                Política de privacidade.
              </Link>
            </p>
            <p>
              Orgulhosamente feito com{' '}
              <a
                href="https://gatsbyjs.com"
                rel="noopener noreferrer"
                target="_blank"
                className="hover:underline"
              >
                Gatsby
              </a>
              . Hospedado na{' '}
              <a
                href="https://netlify.com"
                rel="noopener noreferrer"
                target="_blank"
                className="hover:underline"
              >
                Netlify
              </a>
              .
            </p>
          </div>
          <div className="grid gap-x-3 grid-cols-3">
            <a
              href="https://instagram.com/gus.andradr"
              rel="noopener noreferrer"
              target="_blank"
            >
              <InstagramIcon />
            </a>
            <a
              href="https://twitter.com/tavogus0"
              rel="noopener noreferrer"
              target="_blank"
            >
              <TwitterIcon />
            </a>
            <a
              href="https://github.com/gustavo-a"
              rel="noopener noreferrer"
              target="_blank"
            >
              <GithubIcon />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default footer
