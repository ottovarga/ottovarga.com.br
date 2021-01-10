function hexToRgb(hex) {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i
  hex = hex.replace(shorthandRegex, function (m, r, g, b) {
    return r + r + g + g + b + b
  })

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        red: parseInt(result[1], 16),
        green: parseInt(result[2], 16),
        blue: parseInt(result[3], 16)
      }
    : null
}

function makeShadow(name, rgb) {
  const obj = {}

  const nameWithDash = name ? `${name}-` : ''
  const defaultName = name || 'DEFAULT'

  obj[`${nameWithDash}xs`] = `0 0 0 1px rgba(${rgb}, 0.05)`
  obj[`${nameWithDash}sm`] = `0 1px 2px 0 rgba(${rgb}, 0.05)`
  obj[
    defaultName
  ] = `0 1px 3px 0 rgba(${rgb}, 0.1), 0 1px 2px 0 rgba(${rgb}, 0.06)`
  obj[
    `${nameWithDash}md`
  ] = `0 4px 6px -1px rgba(${rgb}, 0.1), 0 2px 4px -1px rgba(${rgb}, 0.06)`
  obj[
    `${nameWithDash}lg`
  ] = `0 10px 15px -3px rgba(${rgb}, 0.1), 0 4px 6px -2px rgba(${rgb}, 0.05)`
  obj[
    `${nameWithDash}xl`
  ] = `0 20px 25px -5px rgba(${rgb}, 0.1), 0 10px 10px -5px rgba(${rgb}, 0.04)`
  obj[`${nameWithDash}2xl`] = `0 25px 50px -12px rgba(${rgb}, 0.25)`
  obj[`${nameWithDash}inner`] = `inset 0 2px 4px 0 rgba(${rgb}, 0.06)`
  return obj
}

function buildShadowPalette(theme) {
  // default tailwindcss black shadows
  const defaultPalette = {
    ...makeShadow('', '0, 0, 0'),
    outline: '0 0 0 3px rgba(66, 153, 225, 0.5)',
    none: 'none'
  }

  const coloredShadowPalette = Object.values(
    Object.entries(theme('colors')).reduce((acc, curr) => {
      const [k, v] = curr
      if (
        typeof v === 'string' &&
        v !== 'transparent' &&
        v !== 'currentColor'
      ) {
        const { red, green, blue } = hexToRgb(v)
        acc[k] = makeShadow(k, `${red}, ${green}, ${blue}`)
      }
      if (typeof v === 'object') {
        Object.entries(v).forEach(([_k, _v]) => {
          const { red, green, blue } = hexToRgb(_v)
          acc[`${k}-${_k}`] = makeShadow(
            `${k}-${_k}`,
            `${red}, ${green}, ${blue}`
          )
        })
      }
      return acc
    }, {})
  )

  return coloredShadowPalette.reduce(
    (acc, cur) => ({ ...acc, ...cur }),
    defaultPalette
  )
}

module.exports = {
  purge: ['./src/**/*.{js,ts,jsx,tsx}', './pages/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px'
    },
    boxShadow: theme => {
      return {
        ...buildShadowPalette(theme)
      }
    },
    extend: {
      container: {
        center: true
      },
      colors: {},

      fontFamily: {
        body: ['Open Sans', 'Helvetica', 'sans-serif'],
        display: ['Hind', 'Verdana', 'Arial', 'sans-serif']
      },
      typography: theme => ({
        DEFAULT: {
          css: {
            a: {
              color: theme('colors.blue.500'),
              textDecoration: 'none',
              '&:hover': {
                color: theme('colors.blue.500'),
                textDecoration: 'underline'
              }
            }
          }
        },
        dark: {
          css: {
            color: theme('colors.gray.300'),
            a: {
              color: theme('colors.green.500'),
              textDecoration: 'none',
              '&:hover': {
                color: theme('colors.green.500'),
                textDecoration: 'underline'
              }
            },

            h1: {
              color: theme('colors.gray.300')
            },
            h2: {
              color: theme('colors.gray.300')
            },
            h3: {
              color: theme('colors.gray.300')
            },
            h4: {
              color: theme('colors.gray.300')
            },
            h5: {
              color: theme('colors.gray.300')
            },
            h6: {
              color: theme('colors.gray.300')
            },
            blockquote: {
              color: theme('colors.gray.300')
            },

            strong: {
              color: theme('colors.gray.300')
            },

            code: {
              color: theme('colors.gray.300')
            },

            figcaption: {
              color: theme('colors.gray.500')
            }
          }
        }
      })
    }
  },
  variants: {
    extend: {
      typography: ['dark'],
      boxShadow: ['dark']
    }
  },
  plugins: [require('@tailwindcss/typography')]
}
