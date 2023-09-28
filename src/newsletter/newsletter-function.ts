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

import { postToSlack } from '@/newsletter/postFeed'

import { FEEDS_URL, scrapePosts } from '@/newsletter/scrape'

import { triggerLogsSlack } from '@/newsletter/logs'

const DAY_IN_MILISECONDS = 1000 * 60 * 60 * 24
const TODAY_MIDNIGHT = new Date().setHours(0, 0, 0, 0)
const YESTERDAT_MIDNIGHT = TODAY_MIDNIGHT - DAY_IN_MILISECONDS

const newsletter = async () => {
  let parser = new RSSParser()

  const postsHTML = await Promise.all(
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

      let posts = filteredItems.map((item: RSSParser.Item) => {
        return {
          url: item.link,
          title: item.title,
          isoDate: item.isoDate,
          feedName: feedObj.name
        }
      })

      return await scrapePosts(posts)
    })
  ).then(res => res.flat())

  const feeds = await Promise.all(
    postsHTML.map(async postItem => {
      const formattedContent = await formatContent(postItem.body, postItem.url)

      if (!formatContent) return null

      const AICategories = await categorizePosts(formattedContent)

      if (!categoriesCondition(AICategories)) return null

      const translatedContent = await translateContent(formattedContent)

      if (!translatedContent) return null

      const resumedContent = await resumeContent(translatedContent)

      if (!resumedContent) return null

      const formattedTitle = await translateTitle(postItem.title)

      return {
        title: formattedTitle,
        link: postItem.url,
        categories: AICategories,
        dateISO: postItem.isoDate,
        date: new Date(postItem.isoDate).toLocaleString('pt-BR', {
          timeZone: 'America/Sao_Paulo',
          dateStyle: 'medium'
        }),
        feedName: postItem.feedName,
        content: resumedContent
      }
    })
  )
    .then(items => items.filter(item => item !== null && item !== undefined))
    .then(items =>
      items.sort((a, b) => {
        return new Date(a.dateISO).getTime() - new Date(b.dateISO).getTime()
      })
    )

  //post to slack
  await postToSlack(feeds)

  //log to slack
  await triggerLogsSlack()

  return feeds
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
