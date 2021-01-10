import React from 'react'
import { Link } from 'gatsby'

type Tag = {
  node: {
    name: string
    slug: string
  }
}

interface Props {
  tags: Tag[]
}

const headline: React.FC<Props> = ({ tags }) => {
  return (
    <div>
      <h3 className="text-3xl font-display mb-4">tags</h3>
      <ul>
        {tags.map(({ node: { name, slug } }) => (
          <li key={slug} className="mb-2">
            <Link to={`/tag/${slug}`}>{name}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default headline
