import { JSDOM } from 'jsdom'
import { Configuration, OpenAIApi } from 'openai'
import fetch from 'node-fetch'
import { Readability } from '@mozilla/readability'
import { logFunction, logError } from '@/newsletter/logs'

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

export async function formatContent(pageHTML: string, url: string) {
  let article = pageHTML

  try {
    const jsdom = new JSDOM(pageHTML, {
      url
    })

    const reader = new Readability(jsdom.window.document, {
      disableJSONLD: true
    })

    article = reader
      .parse()
      .textContent.replace('\n\n', '\n')
      .substring(0, 15999)
  } catch (err) {
    console.log('Erro ao formatar conteúdo: ', url, err)
    logError('Erro ao formatar conteúdo:', err)

    article = ''
  } finally {
    logFunction(
      'formatContent',
      { pageHTML: pageHTML.substring(0, 200), url },
      article.substring(0, 200)
    )
  }

  return article
}

export async function resumeContent(text: string) {
  let abstract = text

  if (text.length <= 500) {
    logFunction(
      'resumeContent',
      { text: text.substring(0, 200) },
      text.substring(0, 200)
    )
    return text
  }

  try {
    let openaiResponse = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo-16k',
      messages: [
        {
          role: 'user',
          content: `Resuma o conteúdo considerando as seguintes informações: O conteúdo resumido deverá ter tom jornalístico e propósito informacional e deverá ter no máximo 80 palavras. Conteúdo: ${text}`
        }
      ],
      temperature: 0.5
    })

    abstract = openaiResponse.data.choices[0].message.content
  } catch (err) {
    console.log('Erro ao resumir conteúdo: ', err)
    logError('Erro ao resumir conteúdo: ', err)

    abstract = ''
  } finally {
    logFunction(
      'resumeContent',
      { text: text.substring(0, 200) },
      abstract.substring(0, 200)
    )
  }

  return abstract
}

export async function translateContent(text: string) {
  const language = await detectLanguage(text)

  if (language.includes('pt')) {
    logFunction('translateContent', { text }, text)
    return text
  }

  let translation = text

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

    translation = openaiResponse.data.choices[0].message.content
  } catch (err) {
    console.log('Erro ao traduzir conteúdo: ', err)
    logError('Erro ao traduzir conteúdo: ', err)

    translation = ''
  } finally {
    logFunction(
      'translateContent',
      { text: text.substring(0, 200) },
      translation.substring(0, 200)
    )
  }

  return translation
}

export async function detectLanguage(text: string) {
  let language = ''

  try {
    let openaiResponse = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo-16k',
      messages: [
        {
          role: 'user',
          content: `Determine o idioma do seguinte conteúdo:\n${text}\n\n
          A resposta deve estar no formato ISO 639-1, sem nenhum comentário adicional, apenas o código do idioma. Exemplo: 'en' ou 'pt'`
        }
      ],
      temperature: 0,
      max_tokens: 2 //en ou pt
    })

    language = openaiResponse.data.choices[0].message.content
  } catch (err) {
    console.log('Erro ao detectar idioma: ', err)
    logError('Erro ao detectar idioma: ', err)
  } finally {
    logFunction('detectLanguage', { text: text.substring(0, 200) }, language)
  }

  return language
}

export async function translateTitle(title: string) {
  let translation = title

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

    translation = openaiResponse.data.choices[0].message.content
  } catch (err) {
    console.log('Erro ao traduzir título: ', title, err)
    logError('Erro ao traduzir título: ', err)
  } finally {
    logFunction(
      'translateTitle',
      { title: title.substring(0, 200) },
      translation.substring(0, 200)
    )
  }

  return translation
}

export async function categorizePosts(postContent: string) {
  let categories = ['']

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

    categories = generatedTopics
  } catch (err) {
    console.log('Erro ao categorizar post: ', err)
    logError('Erro ao categorizar post: ', err)
  } finally {
    logFunction(
      'categorizePosts',
      { postContent: postContent.substring(0, 200) },
      categories
    )
  }

  return categories
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
