import { formatFeed, Feed } from '@/newsletter/formatFeed'

export const FEEDS_URL = [
  'http://feeds.seroundtable.com/SearchEngineRoundtable1',
  'https://moz.com/posts/rss/blog',
  'https://feeds.feedburner.com/blogspot/amDG',
  'https://www.searchenginewatch.com/feed/',
  'https://www.semrush.com/blog/feed/',
  'https://searchengineland.com/feed',
  'https://rss.searchenginejournal.com'
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

    await fetch(process.env.SLACK_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: `Fontes: ${FEEDS_URL.join(', ')}`
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
        text: `--------------------------------------------------------------------------------
                ------------------------------- FIM DO FEED -------------------------------
                --------------------------------------------------------------------------------`
      })
    })
  } catch (err) {
    console.log(err)
  }
}
