import React from 'react'
import { Link } from 'gatsby'

import InstagramIcon from '@svg/instagram.svg'
import Linkedin from '@svg/linkedin.svg'

const footer: React.FC = () => {
  return (
    <footer>
      <div className="container pb-12 px-4">
        <div className="flex flex-wrap items-center justify-between text-sm text-gray-700 dark:text-gray-300">
          <div className="mb-4 md:mb-0">
            <p>
              Copyright © 2020, Otto Varga. Todos os direitos reservados.{' '}
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
                href="https://vercel.com"
                rel="noopener noreferrer"
                target="_blank"
                className="hover:underline"
              >
                Vercel
              </a>
              .
            </p>
          </div>
          <div className="grid gap-x-3 grid-cols-2">
            <a
              href="https://instagram.com/ottovarga.88"
              rel="noopener noreferrer"
              target="_blank"
              className="text-gray-600 dark:text-gray-400 hover:opacity-80 fill-current"
            >
              <InstagramIcon />
            </a>
            <a
              href="https://www.linkedin.com/in/ottovarga/"
              rel="noopener noreferrer"
              target="_blank"
              className="text-gray-600 dark:text-gray-400 hover:opacity-80 fill-current"
            >
              <Linkedin />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default footer
