import type { Handler, HandlerEvent, HandlerContext } from '@netlify/functions'

import newsletter from '@/newsletter/newsletter-function'

const handler: Handler = async function (
  _event: HandlerEvent,
  _context: HandlerContext
) {
  const newsletterResponse = await newsletter()

  return {
    statusCode: 200,
    body: JSON.stringify(newsletterResponse)
  }
}

export { handler }
