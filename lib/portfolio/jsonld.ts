import type { PortfolioContent } from './content'

const SITE_URL = 'https://shresth.space'
const NAME = 'Shresth Kapoor'

function plainText(value: string) {
  return value.replace(/\*\*(.+?)\*\*/g, '$1').replace(/\[([^\]]+)]\([^)]+\)/g, '$1').replace(/^_(.*)_$/, '$1').trim()
}

function absolute(href: string) {
  return href.startsWith('http') ? href : new URL(href, SITE_URL).toString()
}

export function getPortfolioJsonLd(content: PortfolioContent) {
  const sameAs = content.links.filter(link => link.href.startsWith('http')).map(link => link.href)
  const email = content.links.find(link => link.href.startsWith('mailto:'))?.href.replace(/^mailto:/, '')
  const personId = `${SITE_URL}/#person`

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: 'shresth.space',
        description: plainText(content.headline),
        inLanguage: 'en',
        publisher: { '@id': personId },
      },
      {
        '@type': 'Person',
        '@id': personId,
        name: NAME,
        url: SITE_URL,
        description: plainText(content.bio),
        email,
        sameAs,
        homeLocation: { '@type': 'Place', name: content.location },
        alumniOf: { '@type': 'CollegeOrUniversity', name: 'New York University' },
        mainEntityOfPage: { '@id': `${SITE_URL}/#website` },
      },
      ...content.building.filter(project => project.href !== '#').map(project => ({
        '@type': 'SoftwareApplication',
        name: project.title,
        description: plainText(project.description),
        url: absolute(project.href),
        author: { '@id': personId },
      })),
      ...content.research.map(entry => ({
        '@type': 'ScholarlyArticle',
        headline: entry.title,
        description: plainText(entry.description),
        url: absolute(entry.href),
        datePublished: plainText(entry.year),
        author: { '@id': personId },
      })),
      ...content.writing.map((post, index) => ({
        '@type': 'Article',
        headline: post.title,
        description: plainText(post.description),
        url: `${SITE_URL}/${index + 1}`,
        datePublished: plainText(post.date),
        image: post.coverImage,
        author: { '@id': personId },
      })),
    ],
  }
}
