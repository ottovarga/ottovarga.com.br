import { parse } from 'node-html-parser'
import fetch from 'node-fetch'

export async function formatContent(text: string, url: string) {
  if (text.length > 500) return text

  try {
    const pageHTML = await fetch(url).then(res => res.text())
    const body = parse(pageHTML).querySelector('body')
    const bodyHTML = body.innerHTML

    return bodyHTML
  } catch (err) {
    console.log(err)
    return 'trocar'
  }
}
