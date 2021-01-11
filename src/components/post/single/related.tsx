import React from 'react'
import Post from '@components/post/post'

import { SinglePostProps } from '@components/post/single/singlePost'

interface Props {
  posts: any
}

const relatedPosts: React.FC<Props> = ({ posts }) => {
  return (
    <div className="grid grid-cols-3 gap-8">
      {posts.nodes.map(({ title, date, slug, uri }) => (
        <Post key={slug} cardType="short" title={title} date={date} url={uri} />
      ))}
    </div>
  )
}

export default relatedPosts
