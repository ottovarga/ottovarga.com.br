import React from 'react'
import { Link } from 'gatsby'

import { SinglePostProps } from '@components/post/single/singlePost'

interface Props {
  posts: {
    nodes: Array<SinglePostProps>
  }
}

const relatedPosts: React.FC<Props> = ({ posts }) => {
  return (
    <div className="flex flex-wrap justify-between">
      {posts.nodes.map(({ title, slug }) => (
        <Link
          className="hover:underline font-display text-lg mb-2"
          to={`/${slug}`}
          key={slug}
        >
          {title}
        </Link>
      ))}
    </div>
  )
}

export default relatedPosts
