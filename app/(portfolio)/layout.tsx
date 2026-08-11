import NewDemoClient from '../newdemo/NewDemoClient'
import { getNewDemoContent } from '../../lib/newdemo'

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return <NewDemoClient content={getNewDemoContent()}>{children}</NewDemoClient>
}
