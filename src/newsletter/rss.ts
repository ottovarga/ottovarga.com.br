import RSSParser from 'rss-parser'

import { FEEDS_URL, scrapePostsProps } from '@/newsletter/scrape'
import { asyncFilter } from '@/utils/async'

const DAY_IN_MILISECONDS = 1000 * 60 * 60 * 24
const TODAY_MIDNIGHT = new Date().setHours(0, 0, 0, 0)
const YESTERDAT_MIDNIGHT = TODAY_MIDNIGHT - DAY_IN_MILISECONDS

export async function getFeed(url: string) {
  let parser = new RSSParser()

  const feed = await parser.parseURL(url)

  return feed
}

export async function getPosts(feed: typeof FEEDS_URL) {
  const postsHTML = await Promise.all(
    feed.map(async feedObj => {
      const feed = await getFeed(feedObj.url)

      const filteredItems: {
        [key: string]: any
      } & RSSParser.Item = await asyncFilter(
        feed.items,
        async (item: RSSParser.Item) => {
          return (
            item.isoDate >= new Date(YESTERDAT_MIDNIGHT).toISOString() &&
            item.isoDate < new Date(TODAY_MIDNIGHT).toISOString()
          )
        }
      )

      const posts: scrapePostsProps = filteredItems.map(
        (item: RSSParser.Item) => {
          return {
            url: item.link,
            title: item.title,
            isoDate: item.isoDate,
            feedName: feedObj.name
          }
        }
      )

      return posts
    })
  ).then(res => res.flat())

  return postsHTML
}
