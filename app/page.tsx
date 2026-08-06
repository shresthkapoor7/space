import type { Metadata } from 'next'
import './new/new.css'
import PortfolioClient from './new/PortfolioClient'

export const metadata: Metadata = {
  title: 'shresth',
}

export default function RootPage() {
  return <PortfolioClient />
}
