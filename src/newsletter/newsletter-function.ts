import RSSParser from 'rss-parser'

import {
  formatContent,
  formatTitle,
  categorizePosts,
  categoriesCondition,
  Feed
} from '@/newsletter/formatFeed'

import { postToSlack, FEEDS_URL } from '@/newsletter/postFeed'

const DAY_IN_MILISECONDS = 1000 * 60 * 60 * 24
const YESTERDAT_MIDNIGHT = new Date().setHours(0, 0, 0, 0) - DAY_IN_MILISECONDS

const newsletter = async () => {
  let parser = new RSSParser()

  const feeds = await Promise.all(
    FEEDS_URL.map(async feedObj => {
      const feed = await parser.parseURL(feedObj.url)

      //filter posts by date and category
      const filteredItems: {
        [key: string]: any
      } & RSSParser.Item = await asyncFilter(
        feed.items,
        async (item: RSSParser.Item) => {
          const dateCondition =
            item.isoDate > new Date(YESTERDAT_MIDNIGHT).toISOString()

          if (!dateCondition) return false

          const AICategories = await categorizePosts(item.content)

          return categoriesCondition(AICategories)
        }
      )

      console.log(filteredItems)

      const items: Feed = await Promise.all(
        filteredItems.map(async (item: RSSParser.Item) => {
          const formattedContent = await formatContent(
            item.contentSnippet ? item.contentSnippet : item.content,
            item.link
          )

          const formattedTitle = await formatTitle(item.title)

          return {
            title: formattedTitle,
            link: item.link,
            dateISO: item.isoDate,
            date: new Date(item.isoDate).toLocaleString('pt-BR', {
              timeZone: 'America/Sao_Paulo',
              dateStyle: 'medium'
            }),
            feedName: feedObj.name,
            content: formattedContent
          }
        })
      )

      return items.filter(item => item.title && item.link && item.content)
    })
  )

  const flatOrderedFeeds = feeds.flat().sort((a, b) => {
    return new Date(a.dateISO).getTime() - new Date(b.dateISO).getTime()
  })

  //post to slack
  await postToSlack(flatOrderedFeeds)

  console.log('tarefa concluída')

  return flatOrderedFeeds
}

export default newsletter

const asyncFilter = async (
  arr: any[],
  predicate: (value: any, index?: number, array?: any[]) => unknown
) =>
  arr.reduce(
    async (memo, e) => ((await predicate(e)) ? [...(await memo), e] : memo),
    []
  )
