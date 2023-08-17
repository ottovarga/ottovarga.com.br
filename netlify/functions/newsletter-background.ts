import type {
  BackgroundHandler,
  HandlerEvent,
  HandlerContext
} from '@netlify/functions'

import RSSParser from 'rss-parser'

import {
  formatContent,
  formatTitle,
  categorizePosts,
  categoriesCondition
} from '@/newsletter/formatFeed'
import { postToSlack, FEEDS_URL } from '@/newsletter/postFeed'

const DAY_IN_MILISECONDS = 1000 * 60 * 60 * 24

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

            const formattedTitle = await formatTitle(item.title)

            const AICategories = await categorizePosts(item.content)

            return {
              title: formattedTitle,
              link: item.link,
              categories: AICategories,
              dateISO: item.isoDate,
              date: new Date(item.isoDate).toLocaleString('pt-BR', {
                timeZone: 'America/Sao_Paulo',
                dateStyle: 'medium'
              }),
              content: formattedContent
            }
          })
        )

        return (
          items
            .filter(item => item.title && item.link && item.content)
            //filter categories
            .filter(item => {
              console.log(
                'filtro categorias: ',
                categoriesCondition(item.categories)
              )
              return categoriesCondition(item.categories)
            })
            // get items from yesterday
            .filter(
              item =>
                item.dateISO >
                new Date(
                  new Date().setHours(0, 0, 0, 0) - DAY_IN_MILISECONDS
                ).toISOString()
            )
        )
      })
    )

    const flatOrderedFeeds = feeds.flat().sort((a, b) => {
      return new Date(a.dateISO).getTime() - new Date(b.dateISO).getTime()
    })

    console.log(flatOrderedFeeds)

    //post to slack
    await postToSlack(flatOrderedFeeds)

    console.log('tarefa concluída')
  })()
}

export { handler }
