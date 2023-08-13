import type {
  Handler,
  HandlerResponse,
  HandlerEvent,
  HandlerContext
} from '@netlify/functions'

const handler: Handler = async function (
  event: HandlerEvent,
  context: HandlerContext
) {
  return {
    statusCode: 200,
    body: JSON.stringify(event)
  }
}

export { handler }
