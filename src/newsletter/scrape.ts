import fetch from 'node-fetch'
import { logFunction, logError } from '@/newsletter/logs'

export const FEEDS_URL = [
  {
    name: 'SeRoundTable',
    url: 'http://feeds.seroundtable.com/SearchEngineRoundtable1'
  },
  { name: 'Moz', url: 'https://moz.com/posts/rss/blog' },
  {
    name: 'GoogleSearchCentralBlog',
    url: 'https://feeds.feedburner.com/blogspot/amDG'
  },
  { name: 'SearchEngineWatch', url: 'https://www.searchenginewatch.com/feed/' },
  { name: 'Semrush', url: 'https://www.semrush.com/blog/feed/' },
  { name: 'SearchEngineLand', url: 'https://www.searchengineland.com/feed/' },
  { name: 'Ahrefs', url: 'https://ahrefs.com/blog/feed/' },
  { name: 'ScreamingFrog', url: 'https://www.screamingfrog.co.uk/feed/' },
  { name: 'SearchEngineJournal', url: 'https://rss.searchenginejournal.com' }
]

type ApifyReturn = {
  url: string
  body: string
}[]

type scrapePostsReturn = {
  url: string
  body: string
  title: string
  isoDate: string
  feedName: string
}[]

export async function scrapePosts(postOBJ: Omit<scrapePostsReturn, 'body'>) {
  let htmlItems: scrapePostsReturn

  const urlsArr = postOBJ.map(({ url }) => {
    return {
      url: url.includes('google.com') ? `${url}?hl=pt-br` : url
    }
  })

  try {
    // run task
    const run = await fetch(
      `https://api.apify.com/v2/actor-tasks/gustavo_onserp~newsletter/run-sync?token=${process.env.APIFY_TOKEN}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          startUrls: urlsArr
        })
      }
    )

    if (!run.ok) {
      throw new Error('Erro ao rodar task', { cause: run.statusText })
    }

    //get dataset items
    const data = await fetch(
      `https://api.apify.com/v2/actor-tasks/gustavo_onserp~newsletter/runs/last/dataset/items?token=${process.env.APIFY_TOKEN}`
    )

    if (!data.ok) {
      throw new Error('Erro ao buscar dados', { cause: data.statusText })
    }

    const scrapeItems: ApifyReturn = await data.json()

    // match urls returned from apify with urls from feed
    htmlItems = scrapeItems.map(item => {
      const feedItem = postOBJ.find(({ url }) => url === item.url)

      return {
        ...item,
        title: feedItem.title,
        isoDate: feedItem.isoDate,
        feedName: feedItem.feedName
      }
    })
  } catch (err) {
    console.log('Erro ao formatar conteúdo: ', postOBJ, err)
    logError('Erro ao formatar conteúdo:', err)
  } finally {
    logFunction(
      'scrape',
      { postOBJ },
      htmlItems.map(item => {
        return {
          url: item.url,
          title: item.title,
          isoDate: item.isoDate,
          feedName: item.feedName,
          body: item.body.substring(0, 200)
        }
      })
    )
  }

  return htmlItems
}
