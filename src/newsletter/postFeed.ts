import { formatFeed, Feed } from '@/newsletter/formatFeed'
import { FEEDS_URL } from '@/newsletter/scrape'

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
