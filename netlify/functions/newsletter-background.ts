import type {
  BackgroundHandler,
  HandlerEvent,
  HandlerContext
} from '@netlify/functions'

import RSSParser from 'rss-parser'

import { formatContent, postToSlack } from '@/newsletter/formatFeed'

const FEEDS_URL = [
  //'http://feeds.seroundtable.com/SearchEngineRoundtable1',
  'https://moz.com/posts/rss/blog',
  'https://feeds.feedburner.com/blogspot/amDG',
  //'https://www.searchenginewatch.com/feed/',
  //'https://www.semrush.com/blog/feed/',
  //'https://searchengineland.com/feed',
  'https://rss.searchenginejournal.com'
]

const handler: BackgroundHandler = function (
  _event: HandlerEvent,
  _context: HandlerContext
) {
  ;(async () => {
    let parser = new RSSParser()

    const feeds = await Promise.all(
      FEEDS_URL.map(async url => {
        const feed = await parser.parseURL(url)

        const items = await Promise.all(
          feed.items.slice(1, 5).map(async item => {
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
            .filter(item => item.title && item.link && item.content)
            // get items from five days ago
            .filter(
              item =>
                item.date >
                new Date(Date.now() - 24 * 60 * 60 * 1000 * 5).toISOString()
            )
        )
      })
    )

    console.log(feeds)

    //post to slack
    await postToSlack(feeds)
  })()
}

export { handler }
