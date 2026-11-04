import '../features/portfolio/portfolio.css'
import PortfolioClient from '../features/portfolio/components/PortfolioClient'
import { getPortfolioContent } from '../../lib/portfolio/content'
import { getPortfolioJsonLd } from '../../lib/portfolio/jsonld'

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  const content = getPortfolioContent()
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(getPortfolioJsonLd(content)).replace(/</g, '\\u003c') }} />
    <PortfolioClient content={content}>{children}</PortfolioClient>
  </>
}
