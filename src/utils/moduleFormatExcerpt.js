module.exports = function formatExcerpt(str, limit) {
  const cleanExerpt = str.replace(/(<([^>]+)>)/gi, '').replace('[&hellip;]', '')
  if (cleanExerpt.length > limit) {
    return `${cleanExerpt.substring(0, limit)}...`
  } else {
    return cleanExerpt
  }
}
