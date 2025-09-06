import fs from 'fs'
import path from 'path'

export interface Post {
  id: number
  date: string
  title: string
  content: string
  pinned?: boolean
  dateForSorting: Date
}

// Parse front matter from markdown content
function parseFrontMatter(fileContent: string) {
  const frontMatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)/
  const match = fileContent.match(frontMatterRegex)

  if (!match) {
    throw new Error('No front matter found')
  }

  const frontMatterText = match[1]
  const content = match[2]

  // Parse YAML-like front matter
  const metadata: any = {}
  frontMatterText.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split(':')
    if (key && valueParts.length > 0) {
      const value = valueParts.join(':').trim().replace(/['"]/g, '')
      metadata[key.trim()] = value
    }
  })

  return { metadata, content }
}

// Format date for display
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }
  return date.toLocaleDateString('en-GB', options)
}

// Read markdown files from a directory
export function readMarkdownFiles(category: string): Post[] {
  const contentDir = path.join(process.cwd(), 'content', category)

  if (!fs.existsSync(contentDir)) {
    return []
  }

  const files = fs.readdirSync(contentDir).filter(file => file.endsWith('.md'))

  const posts: Post[] = files.map(file => {
    const filePath = path.join(contentDir, file)
    const fileContent = fs.readFileSync(filePath, 'utf8')

    const { metadata, content } = parseFrontMatter(fileContent)

    return {
      id: parseInt(metadata.id) || 0,
      date: formatDate(metadata.date) || '',
      title: metadata.title || '',
      content: content.trim(),
      pinned: metadata.pinned === 'true',
      dateForSorting: new Date(metadata.date)
    }
  })

  // Sort posts: pinned first, then by date (newest first)
  return posts.sort((a, b) => {
    // Pinned posts always come first
    if (a.pinned && !b.pinned) return -1
    if (!a.pinned && b.pinned) return 1

    // If both are pinned or both are not pinned, sort by date (newest first)
    return b.dateForSorting.getTime() - a.dateForSorting.getTime()
  })
}

// Get posts for specific categories
export function getmathPosts(): Post[] {
  return readMarkdownFiles('math')
}

export function getFinancePosts(): Post[] {
  return readMarkdownFiles('finance')
}

export function getMLPosts(): Post[] {
  return readMarkdownFiles('ml')
}

export function getStrandsPosts(): Post[] {
  return readMarkdownFiles('strands')
}

export function getProjectPosts(): Post[] {
  return readMarkdownFiles('project')
}

export function getHomePosts(): Post[] {
  return readMarkdownFiles('home')
}