interface SitemapOptions<T> {
  query: string
  resolveSiteUrl: () => string
  resolvePages: (
    data: T
  ) => Array<{
    path: string
    slug?: string
    modifiedGmt?: string
    nodeType?: string // Para incluir o tipo, se necessário
  }>
  serialize: (
    item: ReturnType<SitemapOptions<T>['resolvePages']>[0]
  ) => {
    url: string
    lastmod?: string
    changefreq?:
      | 'always'
      | 'hourly'
      | 'daily'
      | 'weekly'
      | 'monthly'
      | 'yearly'
      | 'never'
    priority?: number
  }
  excludes: string[]
}

const sitemapOptions: SitemapOptions<{
  allSitePage: {
    nodes: Pick<Queries.SitePage, 'path'>[]
  }
  allWpContentNode: {
    nodes: Pick<Queries.WpContentNode, 'slug' | 'nodeType' | 'modifiedGmt'>[]
  }
}> = {
  query: `
  {
    allSitePage {
      nodes {
        path
      }
    }
    allWpContentNode(
      filter: {nodeType: {in: ["Post", "Page", "WebStory"]}}
    ) {
      nodes {
        ... on WpPost {
          slug
          modifiedGmt
          nodeType
        }
        ... on WpPage {
          slug
          modifiedGmt
          nodeType
        }

        ... on WpWebStory {
          slug
          modifiedGmt
          nodeType
        }

      }
    }
  }`,
  resolveSiteUrl: () => 'https://ottovarga.com.br',
  resolvePages: ({
    allSitePage: { nodes: allPages },
    allWpContentNode: { nodes: allWpContentNodes }
  }) => {
    const wpNodeMap = {
      ...allWpContentNodes.reduce((acc, node) => {
        const { slug } = node

        switch (node.nodeType) {
          case 'WebStory':
            acc[`/webstory/${slug}/`] = node
            break

          default:
            // Page or Service
            acc[`/${slug}/`] = node
            break
        }

        return acc
      }, {} as Record<string, typeof allWpContentNodes[0]>)
    }

    const addPages = [
      ...allPages,
      ...allWpContentNodes
        .filter(item => item.nodeType === 'WebStory')
        .map(item => ({ ...item, path: `/webstory/${item.slug}/` }))
    ]

    const paths = addPages.map(page => {
      // normalize this type of node
      const node = wpNodeMap[page.path]
        ? {
            slug:
              wpNodeMap[page.path].slug ??
              (wpNodeMap[page.path].slug as string),
            modifiedGmt:
              wpNodeMap[page.path].modifiedGmt ??
              (wpNodeMap[page.path].modifiedGmt as string),
            nodeType:
              wpNodeMap[page.path].nodeType ??
              (wpNodeMap[page.path].nodeType as string)
          }
        : {}

      return { ...page, ...node }
    })

    return paths
  },
  serialize: ({ path, modifiedGmt, nodeType }) => {
    const sitemap = {
      url: path,
      lastmod: modifiedGmt || new Date().toISOString(),
      priority: 0.8,
      ...(nodeType === 'Category' || nodeType === 'Tag'
        ? {
            changefreq: 'daily' as 'daily',
            priority: 0.5
          }
        : {}),
      ...(nodeType === 'Post'
        ? {
            changefreq: 'monthly' as 'monthly',
            priority: 0.9
          }
        : {})
    }

    return sitemap
  },
  excludes: [
    '/preview',
    '/preview/*',
    '/preview/**/*',
    '/blog/preview/*',
    '/blog/preview',
    '/blog/preview/**/*',
    '/blog/preview/**',
    '/home',
    '/home/',
    '/sucesso',
    '/sucesso/'
  ]
}

export default sitemapOptions
