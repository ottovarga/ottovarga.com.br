import type {
  BackgroundHandler,
  HandlerEvent,
  HandlerContext
} from '@netlify/functions'

import RSSParser from 'rss-parser'

import { formatContent } from '@/newsletter/formatFeed'
import { postToSlack } from '@/newsletter/postFeed'

const DAY_IN_MILISECONDS = 1000 * 60 * 60 * 24

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
              dateISO: item.isoDate,
              date: item.pubDate,
              content: formattedContent
            }
          })
        )

        return (
          items
            .filter(item => item.title && item.link && item.content)
            // get items from yesterday
            .filter(
              item =>
                item.dateISO >
                new Date(Date.now() - DAY_IN_MILISECONDS).toISOString()
            )
        )
      })
    )

    const flatOrderedFeeds = feeds.flat().sort((a, b) => {
      return new Date(a.dateISO).getTime() - new Date(b.dateISO).getTime()
    })

    //post to slack
    await postToSlack(flatOrderedFeeds)
  })()
}

export { handler }
