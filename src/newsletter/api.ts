import { Configuration, OpenAIApi } from 'openai'
import { sleep } from '@/utils/async'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})

export const openai = new OpenAIApi(configuration)

interface OpenAIApiWithRateLimit extends OpenAIApi {
  createChatCompletionWithRateLimit: (
    ...args: Parameters<OpenAIApi['createChatCompletion']>
  ) => ReturnType<OpenAIApi['createChatCompletion']>
}

export const createChatCompletionWithRateLimit: OpenAIApiWithRateLimit['createChatCompletionWithRateLimit'] = async (
  ...args
) => {
  const res = await openai.createChatCompletion(...args)

  const remaining = res.headers['x-ratelimit-remaining-tokens']
  const reset = res.headers['x-ratelimit-reset-tokens']

  // to number
  if (remaining && reset) {
    const remainingNumber = Number(remaining)
    const resetNumber = reset.includes('s')
      ? Number(reset.replace('s', '')) * 1000
      : Number(reset.replace('ms', ''))

    // limit = 180000
    if (remainingNumber <= 10000) {
      console.log(
        `Sleeping for ${resetNumber}ms, remaining tokens: ${remainingNumber}`
      )
      await sleep(resetNumber)
    }
  }

  return res
}

/* export const fecthWithRateLimit = async (...args: Parameters<typeof fetch>) => {
  const res = await fetch(...args)
  const remaining = res.headers.get('x-ratelimit-remaining-tokens')
  const reset = res.headers.get('x-ratelimit-reset-tokens')

  // to number
  if (remaining && reset) {
    const remainingNumber = Number(remaining)
    const resetNumber = reset.includes('s')
      ? Number(reset.replace('s', '')) * 1000
      : Number(reset.replace('ms', ''))

    // limit = 180000
    if (remainingNumber <= 10000) {
      console.log(
        `Sleeping for ${resetNumber}ms, remaining tokens: ${remainingNumber}`
      )
      await sleep(resetNumber)
    }
  }

  return res
}
 */
