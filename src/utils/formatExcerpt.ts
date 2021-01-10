export default function formatExcerpt(str: string, limit: number) {
  const cleanExerpt = str.replace(/(<([^>]+)>)/gi, '').replace('[&hellip;]', '')
  if (cleanExerpt.length > limit) {
    return `${cleanExerpt.substring(0, limit)}...`
  } else {
    return cleanExerpt
  }
}
