import { notFound } from 'next/navigation'
import { getNewDemoContent } from '../../../lib/newdemo'

export default function PortfolioPostPage({ params }: { params: { id: string } }) {
  const id = Number(params.id)
  const writing = getNewDemoContent().writing

  if (!Number.isInteger(id) || String(id) !== params.id || id < 1 || id > writing.length) {
    notFound()
  }

  return null
}
