/* analytics.js */
import Analytics, { AnalyticsInstance } from 'analytics'
import gtagManagerPlugin from '@analytics/google-tag-manager'

const analytics = Analytics({
  plugins: [
    gtagManagerPlugin({
      containerId: 'GTM-TM8FGSJ'
    })
  ]
})

declare global {
  interface Window {
    Analytics: AnalyticsInstance
  }
}

// Set to global so analytics plugin will work with Gatsby
if (typeof window !== 'undefined') {
  window.Analytics = analytics
}

/* export for consumption in your components for .track & .identify calls */
export default analytics
