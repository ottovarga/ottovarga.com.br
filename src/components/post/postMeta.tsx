import React from 'react'
import { Link } from 'gatsby'
interface Props {
  readingTime: number
  date: string
  tags: Tag[]
}

export type Tag = {
  name: string
  slug: string
}

const postMeta: React.FC<Props> = ({ readingTime, date, tags }) => {
  function formatReadingTime(time: number) {
    const roundTime = Math.round(time)

    return roundTime > 1
      ? `${roundTime} minutos de leitura`
      : `${roundTime} minuto de leitura`
  }

  return (
    <div className="text-sm text-gray-600 dark:text-gray-300 transition-colors mb-4">
      <div className="mb-2">
        tags:{' '}
        {tags &&
          tags.map(({ name, slug }, index, array) => (
            <span key={slug}>
              <Link className="hover:underline" to={`/tag/${slug}`}>
                {name}
              </Link>
              {array.length - 1 > index && <span>{', '}</span>}
            </span>
          ))}
      </div>
      <div className="flex justify-between">
        <div>
          {date} • {formatReadingTime(readingTime)}
        </div>
      </div>
    </div>
  )
}

export default React.memo(postMeta)
