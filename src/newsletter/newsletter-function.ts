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
  console.log('Starting newsletter function')
  const postsFeed = await getPosts(FEEDS_URL)
  console.log('Post feed fetched')

  console.log('Scraping posts')
  const postsHTML = await scrapePosts(postsFeed)
  console.log('Posts scraped\n\n')

  let feeds: Feed = []

  console.log('Formatting posts')
  for (const postItem of postsHTML) {
    console.log(`Formatting post ${postItem.url}`)

    const formattedContent = await formatContent(postItem.body, postItem.url)

    if (!formatContent) continue

    const AICategories = await categorizePosts(formattedContent)

    if (!categoriesCondition(AICategories)) continue

    const translatedContent = await translateContent(formattedContent)

    if (!translatedContent) continue

    const resumedContent = await resumeContent(translatedContent)

    if (!resumedContent) continue

    const formattedTitle = await translateTitle(postItem.title)

    if (!formattedTitle) continue

    console.log(`Post formatted\n\n`)

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

  console.log('Sorting and filtering posts')
  feeds = feeds.filter(item => item !== null && item !== undefined)
  feeds = feeds.sort((a, b) => {
    return new Date(a.dateISO).getTime() - new Date(b.dateISO).getTime()
  })

  console.log('Posts sorted and filtered\n\n')

  //post to slack
  await postToSlack(feeds)

  //log to slack
  await triggerLogsSlack()

  return feeds
}

export default newsletter
