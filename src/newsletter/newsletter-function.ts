import {
  formatContent,
  translateTitle,
  categorizePosts,
  categoriesCondition,
  translateContent,
  resumeContent,
  Feed
} from '@/newsletter/formatFeed'

import { getPosts } from '@/newsletter/rss'

import { postToSlack } from '@/newsletter/postFeed'

import { FEEDS_URL, scrapePosts } from '@/newsletter/scrape'

import { triggerLogsSlack } from '@/newsletter/logs'

const newsletter = async () => {
  const postsFeed = await getPosts(FEEDS_URL)

  const postsHTML = await scrapePosts(postsFeed)

  let feeds: Feed = []

  for (const postItem of postsHTML) {
    const formattedContent = await formatContent(postItem.body, postItem.url)

    if (!formatContent) continue

    const AICategories = await categorizePosts(formattedContent)

    if (!categoriesCondition(AICategories)) continue

    const translatedContent = await translateContent(formattedContent)

    if (!translatedContent) continue

    const resumedContent = await resumeContent(translatedContent)

    if (!resumedContent) continue

    const formattedTitle = await translateTitle(postItem.title)

    feeds.push({
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
    })
  }

  feeds = feeds.filter(item => item !== null && item !== undefined)
  feeds = feeds.sort((a, b) => {
    return new Date(a.dateISO).getTime() - new Date(b.dateISO).getTime()
  })

  //post to slack
  await postToSlack(feeds)

  //log to slack
  await triggerLogsSlack()

  return feeds
}

export default newsletter
