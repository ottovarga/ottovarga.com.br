import React from 'react'
import { Link } from 'gatsby'

interface Props {
  link: string
  name: string
  classes?: string[]
  rel?: string | null
  title?: string | null
  target?: string | null
}

const menu: React.FC<Props> = ({ link, name, classes, target, rel, title }) => {
  const formatRel = (
    target: string | null | undefined,
    rel: string | null | undefined
  ) => {
    if (target && !rel) {
      return `noopener noreferrer`
    } else if (target && rel) {
      return `noopener noreferrer ${rel}`
    } else {
      return ``
    }
  }
  return (
    <li className={`inline-block mx-1 md:mx-3 ${classes?.join(' ')}`}>
      <Link
        className="px-2 hover:underline lowercase"
        to={link}
        target={target ? target : ''}
        rel={formatRel(target, rel)}
        title={title ? title : ''}
      >
        {name}
      </Link>
    </li>
  )
}

export default menu
