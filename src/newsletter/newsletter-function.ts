import {
  formatContent,
  translateTitle,
  categorizePosts,
  categoriesCondition,
  translateContent,
  resumeContent
} from '@/newsletter/formatFeed'

import { getPosts } from '@/newsletter/rss'

import { postToSlack } from '@/newsletter/postFeed'

import { FEEDS_URL, scrapePosts } from '@/newsletter/scrape'

import { triggerLogsSlack } from '@/newsletter/logs'

const newsletter = async () => {
  const postsFeed = await getPosts(FEEDS_URL)

  const postsHTML = await scrapePosts(postsFeed)

  const feeds = await Promise.all(
    postsHTML.map(async postItem => {
      const formattedContent = await formatContent(postItem.body, postItem.url)

      if (!formatContent) return null

      const AICategories = await categorizePosts(formattedContent)

      if (!categoriesCondition(AICategories)) return null

      //const translatedContent = await translateContent(formattedContent)

      //if (!translatedContent) return null

      const resumedContent = await resumeContent(formattedContent)

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
