import { JSDOM } from 'jsdom'
import fetch from 'node-fetch'
import { Configuration, OpenAIApi } from 'openai'
import { Readability } from '@mozilla/readability'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})

export type Feed = {
  title: string
  link: string
  categories: string | string[]
  date: string
  content: string
}[]

export async function formatContent(text: string, url: string) {
  if (text.length > 500) return text

  const formattedURL = url.includes('google.com') ? `${url}?hl=pt-br` : url

  try {
    const pageHTML = await fetch(formattedURL).then(res => res.text())
    const jsdom = new JSDOM(pageHTML, {
      url: formattedURL
    })

    const reader = new Readability(jsdom.window.document, {
      disableJSONLD: true
    })

    const article = reader.parse().textContent.replace('\n\n', '\n')

    const openai = new OpenAIApi(configuration)

    const openaiResponse = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: `Faça um breve resumo do seguinte conteúdo (até 100 palavras): ${article}`
        }
      ],
      temperature: 0.8
    })

    const content = openaiResponse.data.choices[0].message.content

    return content
  } catch (err) {
    console.log(url, err)
    return null
  }
}

export function postToSlack(feed: Feed[]) {
  fetch(process.env.SLACK_WEBHOOK_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      text: formatFeed(feed)
    })
  })
}

function formatFeed(feed: Feed[]) {
  const flattened = feed.flat()

  let finalString = ''

  flattened.forEach((content, index) => {
    finalString += `Notícia ${index + 1}:\n`
    finalString += `*${content.title}*\n${content.content}\n`
    finalString += `${content.date}\n`
    finalString += `Link: ${content.link}\n\n-----------\n\n`
  })

  return finalString
}
