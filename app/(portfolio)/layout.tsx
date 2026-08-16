import '../features/portfolio/portfolio.css'
import PortfolioClient from '../features/portfolio/components/PortfolioClient'
import { getPortfolioContent } from '../../lib/portfolio/content'

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return <PortfolioClient content={getPortfolioContent()}>{children}</PortfolioClient>
}
