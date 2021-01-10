import React from 'react'
import { useLocation } from '@reach/router'

import {
  EmailShareButton,
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  EmailIcon,
  FacebookIcon,
  LinkedinIcon,
  TwitterIcon,
  WhatsappIcon
} from 'react-share'

interface Props {
  iconClass?: string
  linkClass?: string
  size: number
  round: boolean
  bgStyle: object
  className?: string
}

const sharer: React.FC<Props> = ({
  iconClass,
  linkClass,
  size,
  round,
  bgStyle,
  className
}) => {
  const { pathname } = useLocation()

  const currentUrl = `https://onserp.com.br${pathname}`

  const shareIconsOptions = {
    size,
    round,
    bgStyle,
    className: iconClass
  }

  return (
    <div
      id="blog-sharer"
      className={`${className} transition-all duration-200`}
    >
      <EmailShareButton
        url={currentUrl}
        className={linkClass}
        title="Compartilhar por email"
        aria-label="Compartilhar por email"
      >
        <EmailIcon {...shareIconsOptions} />
      </EmailShareButton>
      <FacebookShareButton
        url={currentUrl}
        className={linkClass}
        title="Compartilhar no Facebook"
        aria-label="Compartilhar no Facebook"
      >
        <FacebookIcon {...shareIconsOptions} />
      </FacebookShareButton>
      <LinkedinShareButton
        url={currentUrl}
        className={linkClass}
        aria-label="Compartilhar no LinkedIn"
      >
        <LinkedinIcon {...shareIconsOptions} />
      </LinkedinShareButton>
      <TwitterShareButton
        url={currentUrl}
        className={linkClass}
        aria-label="Compartilhar no Twitter"
      >
        <TwitterIcon {...shareIconsOptions} />
      </TwitterShareButton>
      <WhatsappShareButton
        url={currentUrl}
        className={linkClass}
        aria-label="Compartilhar por Whatsapp"
      >
        <WhatsappIcon {...shareIconsOptions} />
      </WhatsappShareButton>
    </div>
  )
}

export default sharer
