import { JSDOM } from 'jsdom'
import fetch from 'node-fetch'
import { Configuration, OpenAIApi } from 'openai'
import { Readability } from '@mozilla/readability'

const GENERAL_TOPICS = [
  // incluir
  'SEO',
  'Link Building',
  'Content Marketing',
  'Ecommerce SEO',
  'SEO Software',
  'Web Development',
  'Google Analytics',
  'Google Tag Manager',
  'Content Strategy',
  'AI',

  // excluir
  'Ecommerce',
  'Social Media',
  'Product Design',
  'Product Management',
  'Product Strategy',
  'Google Ads',
  'Google AdWords',
  'Google AdSense',
  'Web Design'
]

const VALID_TOPICS = [
  'SEO',
  'Link Building',
  'Content Marketing',
  'Ecommerce SEO',
  'SEO Software',
  'Web Development',
  'Google Analytics',
  'Google Tag Manager',
  'Content Strategy',
  'AI'
]

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})

const openai = new OpenAIApi(configuration)

export type FeedItem = {
  title: string
  link: string
  categories?: string[]
  date?: string
  dateISO?: string
  feedName?: string
  content: string
}

export type Feed = FeedItem[]

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

    return article.substring(0, 15999)
  } catch (err) {
    console.log('Erro ao formatar conteúdo: ', url, err)
    return null
  }
}

export async function resumeContent(text: string) {
  try {
    let openaiResponse = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo-16k',
      messages: [
        {
          role: 'user',
          content: `Resuma o conteúdo considerando as seguintes informações: O conteúdo resumido deverá ter tom jornalístico e propósito informacional e deverá ter no máximo 80 palavras. Caso o resumo fale sobre nginx, explique detalhadamente por que você está resumindo esse conteúdo, como se fosse fazer uma engenharia reversa. Conteúdo: ${text}`
        }
      ],
      temperature: 0.5
    })

    const abstract = openaiResponse.data.choices[0].message.content

    return abstract
  } catch (err) {
    console.log('Erro ao resumir conteúdo: ', err)
    return null
  }
}

export async function translateContent(text: string) {
  const language = await detectLanguage(text)

  if (language.includes('pt')) return text

  try {
    let openaiResponse = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo-16k',
      messages: [
        {
          role: 'user',
          content: `Traduza o seguinte texto para portugês: ${text}`
        }
      ],
      temperature: 0
    })

    const translation = openaiResponse.data.choices[0].message.content

    return translation
  } catch (err) {
    console.log('Erro ao traduzir conteúdo: ', err)
    return null
  }
}

export async function detectLanguage(text: string) {
  try {
    let openaiResponse = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo-16k',
      messages: [
        {
          role: 'user',
          content: `Determine o idioma do seguinte conteúdo:\n${text}\n\n
          A resposta deve ser apenas o código do idioma no formato ISO 639-1`
        }
      ],
      temperature: 0,
      max_tokens: 5
    })

    const language = openaiResponse.data.choices[0].message.content

    return language
  } catch (err) {
    console.log('Erro ao detectar idioma: ', err)
    return null
  }
}

export async function translateTitle(title: string) {
  try {
    let openaiResponse = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo-16k',
      messages: [
        {
          role: 'user',
          content: `Traduza o seguinte texto para portugês: ${title}`
        }
      ],
      temperature: 0
    })

    const translation = openaiResponse.data.choices[0].message.content

    return translation
  } catch (err) {
    console.log('Erro ao traduzir título: ', title, err)
    return title
  }
}

export async function categorizePosts(postContent: string) {
  try {
    let openaiResponse = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo-16k',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant.'
        },
        {
          role: 'user',
          content: `Atribua multiplos tópicos como um array da lista de tópicos fornecida abaixo para o seguinte conteúdo:
            Conteúdo: ${postContent}
            Tópicos: ${GENERAL_TOPICS.join(', ')}
            A resposta deve estar no formato 'topics = ['']'
          `
        }
      ],
      temperature: 0.1,
      max_tokens: 150,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0.6
    })

    const response = JSON.stringify(
      openaiResponse.data.choices[0].message.content
    )
    const generatedTopics = response
      .match(/\[([^[\]]*)\]/)[1]
      .match(/'[^']*'/g)
      .map(topic => topic.slice(1, -1))

    return generatedTopics
  } catch (err) {
    console.log('Erro ao categorizar post: ', err)
    return ['']
  }
}

export const formatFeed: (feed: Feed) => string[] = (feed: Feed) => {
  let finalStringArr = []

  feed.forEach((content, index) => {
    finalStringArr[index] = ''
    finalStringArr[index] += `Notícia ${index + 1}:\n\n`
    finalStringArr[index] += `Data: ${content.date}\n`
    finalStringArr[index] += `*${
      content.title
    }*\nCategorias: ${content.categories.join(', ')}\n\n${content.content}\n\n`
    finalStringArr[index] += `Via @${content.feedName}\n\n`
    finalStringArr[
      index
    ] += `Link da notícia completa: ${content.link}\n\n-----------\n\n`
  })

  return finalStringArr
}

export function categoriesCondition(categories: string[]) {
  // return true if any item in categories array is equal any value in valid topics
  return categories.some(category => VALID_TOPICS.includes(category))
}
