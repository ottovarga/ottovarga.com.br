import type {
  BackgroundHandler,
  HandlerEvent,
  HandlerContext
} from '@netlify/functions'

import newsletter from '@/newsletter/newsletter-function'

const handler: BackgroundHandler = function (
  _event: HandlerEvent,
  _context: HandlerContext
) {
  newsletter()
}

export { handler }
