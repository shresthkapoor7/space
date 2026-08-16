import fs from 'fs'
import path from 'path'

export interface PortfolioLink {
  label: string
  href: string
}

export interface PortfolioResearch {
  title: string
  href: string
  year: string
  description: string
  metadata: string
}

export interface PortfolioPost {
  title: string
  meta: string
  date: string
  read: string
  description: string
  coverImage?: string
  body: string[]
}

export interface PortfolioContent {
  greeting: string
  headline: string
  bio: string
  links: PortfolioLink[]
  toolkit: { icons: string[]; description: string }
  research: PortfolioResearch[]
  building: Array<{ title: string; description: string; href: string; linkLabel: string }>
  writing: PortfolioPost[]
  offTheClock: string
  track: string
  copyright: string
  location: string
  stickers: Array<{ label: string; mediaSrc?: string; caption?: string; previewLabel?: string }>
}

type Metadata = Record<string, string>

function parseDocument(source: string) {
  const match = source.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/)
  if (!match) throw new Error('content/portfolio.md needs front matter enclosed by ---')

  const metadata: Metadata = {}
  for (const line of match[1].split('\n')) {
    const separator = line.indexOf(':')
    if (separator === -1) continue
    const key = line.slice(0, separator).trim()
    const value = line.slice(separator + 1).trim().replace(/^['"]|['"]$/g, '')
    metadata[key] = value
  }

  return { metadata, body: match[2].trim() }
}

function getSection(document: string, title: string) {
  const escapedTitle = title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const heading = new RegExp(`^## ${escapedTitle}\\n`, 'm').exec(document)
  if (!heading || heading.index === undefined) throw new Error(`content/portfolio.md is missing its "## ${title}" section`)

  const sectionStart = heading.index + heading[0].length
  const remainder = document.slice(sectionStart)
  const nextSection = remainder.search(/^## /m)
  return remainder.slice(0, nextSection === -1 ? undefined : nextSection).trim()
}

function paragraphs(block: string) {
  return block.split(/\n\s*\n/).map(item => item.trim()).filter(Boolean)
}

function headingBlocks(section: string) {
  return section.split(/^### /m).slice(1).map(block => {
    const [heading, ...content] = block.split('\n')
    return { heading: heading.trim(), content: content.join('\n').trim() }
  })
}

function parseLinkHeading(value: string) {
  const match = value.match(/^\[(.+)]\((.+)\)$/)
  return match ? { title: match[1], href: match[2] } : { title: value, href: '#' }
}

function removeInlineMarkdown(value: string) {
  return value.replace(/^_(.*)_$/, '$1').replace(/\*\*(.+?)\*\*/g, '$1')
}

export function getPortfolioContent(): PortfolioContent {
  const rawMarkdown = getPortfolioMarkdown()
  const { metadata, body } = parseDocument(rawMarkdown)
  const toolkitParts = paragraphs(getSection(body, 'toolkit'))
  const research = headingBlocks(getSection(body, 'selected research')).map(({ heading, content }) => {
    const parts = paragraphs(content)
    const link = parseLinkHeading(heading)
    return { title: link.title, href: link.href, year: removeInlineMarkdown(parts[0] || ''), description: parts[1] || '', metadata: parts[2] || '' }
  })
  const building = headingBlocks(getSection(body, 'currently building')).map(({ heading, content }) => {
    const parts = paragraphs(content)
    const link = parts[1]?.match(/^\[(.+)]\((.+)\)$/)
    return { title: heading, description: parts[0] || '', href: link?.[2] || '#', linkLabel: link?.[1] || '' }
  })
  if (!building.length) throw new Error('content/portfolio.md needs a "###" entry under currently building')
  const writing = headingBlocks(getSection(body, 'writing')).map(({ heading, content }) => {
    const parts = paragraphs(content)
    const [meta = '', date = '', read = ''] = removeInlineMarkdown(parts[0] || '').split(' · ').map(value => value.trim())
    const postBody = parts.slice(2)
    const coverImage = postBody[0]?.match(/^!\[[^\]]*]\((https?:\/\/[^\s)]+)\)$/)?.[1]
    return { title: heading, meta, date, read, description: parts[1] || '', coverImage, body: coverImage ? postBody.slice(1) : postBody }
  })
  const stickerMedia = Object.fromEntries((metadata.sticker_media || '').split('|').map(item => {
    const [label, mediaSrc] = item.split('=').map(value => value.trim())
    return [label, mediaSrc]
  }).filter(([label, mediaSrc]) => label && mediaSrc))
  const stickerCaptions = Object.fromEntries((metadata.sticker_captions || '').split('|').map(item => {
    const [label, caption] = item.split('=').map(value => value.trim())
    return [label, caption]
  }).filter(([label, caption]) => label && caption))
  const stickerPreviewLabels = Object.fromEntries((metadata.sticker_previews || '').split('|').map(item => {
    const [label, previewLabel] = item.split('=').map(value => value.trim())
    return [label, previewLabel]
  }).filter(([label, previewLabel]) => label && previewLabel))

  return {
    greeting: metadata.greeting || '', headline: metadata.headline || '', bio: metadata.bio || '',
    links: [
      { label: 'email', href: metadata.email || '#' }, { label: 'github', href: metadata.github || '#' },
      { label: 'linkedin', href: metadata.linkedin || '#' }, { label: 'twitter', href: metadata.twitter || '#' }
    ],
    toolkit: {
      icons: ((toolkitParts[0] || '').match(/`([^`]+)`/g) || []).map(match => match.slice(1, -1)),
      description: toolkitParts[1] || '',
    },
    research,
    building,
    writing,
    offTheClock: getSection(body, 'off the clock'),
    track: metadata.track || '', copyright: metadata.copyright || '', location: metadata.location || '',
    stickers: (metadata.stickers || '').split('|').map(value => value.trim()).filter(Boolean).map(label => ({ label, mediaSrc: stickerMedia[label], caption: stickerCaptions[label], previewLabel: stickerPreviewLabels[label] })),
  }
}

export function getPortfolioMarkdown() {
  return fs.readFileSync(path.join(process.cwd(), 'content', 'portfolio.md'), 'utf8')
}
