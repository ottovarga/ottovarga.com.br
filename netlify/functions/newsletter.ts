import type {
  Handler,
  HandlerResponse,
  HandlerEvent,
  HandlerContext
} from '@netlify/functions'

import RSSParser from 'rss-parser'

import { formatContent } from '@/newsletter/formatFeed'

const FEEDS_URL = [
  'http://feeds.seroundtable.com/SearchEngineRoundtable1',
  'https://moz.com/posts/rss/blog',
  'https://feeds.feedburner.com/blogspot/amDG',
  'https://www.searchenginewatch.com/feed/',
  'https://www.semrush.com/blog/feed/',
  'https://searchengineland.com/feed',
  'https://rss.searchenginejournal.com'
]

const handler: Handler = async function (
  event: HandlerEvent,
  context: HandlerContext
) {
  let parser = new RSSParser()

  const feeds = await Promise.all(
    FEEDS_URL.map(async url => {
      const feed = await parser.parseURL(url)

      const items = await Promise.all(
        feed.items.map(async item => {
          const formattedContent = await formatContent(
            item.contentSnippet ? item.contentSnippet : item.content,
            item.link
          )

          return {
            title: item.title,
            link: item.link,
            categories: item.categories ? item.categories : '',
            date: item.isoDate,
            content: formattedContent
          }
        })
      )

      return (
        items
          .filter(item => item.title && item.link)
          // get items from five days ago
          .filter(
            item =>
              item.date >
              new Date(Date.now() - 24 * 60 * 60 * 1000 * 5).toISOString()
          )
      )
    })
  )

  return {
    statusCode: 200,
    body: JSON.stringify(feeds)
  }
}

export { handler }
