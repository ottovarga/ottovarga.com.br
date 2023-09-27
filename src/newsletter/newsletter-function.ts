import RSSParser from 'rss-parser'

import {
  formatContent,
  translateTitle,
  categorizePosts,
  categoriesCondition,
  translateContent,
  resumeContent,
  Feed
} from '@/newsletter/formatFeed'

import { postToSlack, FEEDS_URL } from '@/newsletter/postFeed'

import { triggerLogsSlack } from '@/newsletter/logs'

const DAY_IN_MILISECONDS = 1000 * 60 * 60 * 24
const TODAY_MIDNIGHT = new Date().setHours(0, 0, 0, 0)
const YESTERDAT_MIDNIGHT = TODAY_MIDNIGHT - DAY_IN_MILISECONDS

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
          return (
            item.isoDate >= new Date(YESTERDAT_MIDNIGHT).toISOString() &&
            item.isoDate < new Date(TODAY_MIDNIGHT).toISOString()
          )
        }
      )

      const items: Feed = await Promise.all(
        filteredItems.map(async (item: RSSParser.Item) => {
          const empty = {
            title: '',
            link: '',
            content: ''
          }

          const content = item.contentSnippet
            ? item.contentSnippet
            : item.content

          const formattedContent =
            feedObj.name === 'SeRoundTable'
              ? content
              : await formatContent(content, item.link)

          if (!formatContent) return empty

          const AICategories = await categorizePosts(formattedContent)

          if (!categoriesCondition(AICategories)) return empty

          const translatedContent = await translateContent(formattedContent)

          if (!translatedContent) return empty

          const resumedContent = await resumeContent(translatedContent)

          if (!resumedContent) return empty

          const formattedTitle = await translateTitle(item.title)

          return {
            title: formattedTitle,
            link: item.link,
            categories: AICategories,
            dateISO: item.isoDate,
            date: new Date(item.isoDate).toLocaleString('pt-BR', {
              timeZone: 'America/Sao_Paulo',
              dateStyle: 'medium'
            }),
            feedName: feedObj.name,
            content: resumedContent
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

  //log to slack
  await triggerLogsSlack()

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
