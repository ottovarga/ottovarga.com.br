import { formatFeed, Feed } from '@/newsletter/formatFeed'

export async function postToSlack(feed: Feed) {
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
}
