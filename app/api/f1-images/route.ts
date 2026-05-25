import { promises as fs } from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'

const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif'])

export async function GET() {
  try {
    const dirPath = path.join(process.cwd(), 'public', 'images', 'f1')
    const entries = await fs.readdir(dirPath, { withFileTypes: true })

    const images = entries
      .filter((entry) => entry.isFile())
      .map((entry) => entry.name)
      .filter((name) => IMAGE_EXTENSIONS.has(path.extname(name).toLowerCase()))
      .sort((a, b) => a.localeCompare(b))
      .map((name) => `/images/f1/${name}`)

    return NextResponse.json({ images }, {
      headers: { 'Cache-Control': 's-maxage=300, stale-while-revalidate=86400' },
    })
  } catch {
    return NextResponse.json({ images: [] }, { status: 500 })
  }
}
