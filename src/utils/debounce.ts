/**
 * Debounce a fn by a given number of ms
 *
 * @see {@link https://medium.com/@TCAS3/debounce-deep-dive-javascript-es6-e6f8d983b7a1}
 * @param {function} fn Function you want to debounce
 * @param {number} time Amount in ms to debounce. Defaults to 100ms
 * @returns {function} Your function debounced by given ms
 */
const debounce = (fn: () => any, time = 100) => {
  let timeout: ReturnType<typeof setTimeout>

  return function () {
    const functionCall = () => fn.apply(this, arguments)

    clearTimeout(timeout)
    timeout = setTimeout(functionCall, time)
  }
}

export default debounce
