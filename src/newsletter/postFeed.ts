import { formatFeed, Feed } from '@/newsletter/formatFeed'

export const FEEDS_URL = [
  {
    name: 'SeRoundTable',
    url: 'http://feeds.seroundtable.com/SearchEngineRoundtable1'
  }
  /* { name: 'Moz', url: 'https://moz.com/posts/rss/blog' },
  {
    name: 'GoogleSearchCentralBlog',
    url: 'https://feeds.feedburner.com/blogspot/amDG'
  },
  { name: 'SearchEngineWatch', url: 'https://www.searchenginewatch.com/feed/' },
  { name: 'Semrush', url: 'https://www.semrush.com/blog/feed/' },
  { name: 'SearchEngineLand', url: 'https://www.searchengineland.com/feed/' },
  { name: 'Ahrefs', url: 'https://ahrefs.com/blog/feed/' },
  { name: 'ScreamingFrog', url: 'https://www.screamingfrog.co.uk/feed/' },
  { name: 'SearchEngineJournal', url: 'https://rss.searchenginejournal.com' } */
]

export async function postToSlack(feed: Feed) {
  try {
    await fetch(process.env.SLACK_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: `SEO News ${new Date().toLocaleString('pt-BR', {
          timeZone: 'America/Sao_Paulo',
          dateStyle: 'short'
        })}`
      })
    })

    for (const item of formatFeed(feed)) {
      await fetch(process.env.SLACK_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: item
        })
      })
    }

    await fetch(process.env.SLACK_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: `Fontes: ${FEEDS_URL.map(feed => feed.url).join(', ')}`
      })
    })

    await fetch(process.env.SLACK_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: `--------------------------------------------------------------------------------
------------------------------- FIM DO FEED -------------------------------
--------------------------------------------------------------------------------`
      })
    })
  } catch (err) {
    console.log(err)
  }
}
