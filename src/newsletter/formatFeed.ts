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

    let openaiResponse = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: `Traduza o seguinte texto para portugês: ${article}`
        }
      ],
      temperature: 0
    })

    const translation = openaiResponse.data.choices[0].message.content

    openaiResponse = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: `Faça um breve resumo do seguinte conteúdo (até 100 palavras): ${translation}`
        }
      ],
      temperature: 0.5
    })

    const content = openaiResponse.data.choices[0].message.content

    return content
  } catch (err) {
    console.log(url, err)
    return null
  }
}

export async function postToSlack(feed: Feed[]) {
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

const formatFeed: (feed: Feed[]) => string[] = (feed: Feed[]) => {
  const flattened = feed.flat()

  let finalStringArr = []

  flattened.forEach((content, index) => {
    finalStringArr[index] = ''
    finalStringArr[index] += `Notícia ${index + 1}:\n`
    finalStringArr[index] += `*${content.title}*\n${content.content}\n`
    finalStringArr[index] += `${content.date}\n`
    finalStringArr[index] += `Link: ${content.link}\n\n-----------\n\n`
  })

  return finalStringArr
}
