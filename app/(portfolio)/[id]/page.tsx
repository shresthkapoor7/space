import { notFound } from 'next/navigation'
import { getPortfolioContent } from '../../../lib/portfolio/content'

export default function PortfolioPostPage({ params }: { params: { id: string } }) {
  const id = Number(params.id)
  const writing = getPortfolioContent().writing

  if (!Number.isInteger(id) || String(id) !== params.id || id < 1 || id > writing.length) {
    notFound()
  }

  return null
}
