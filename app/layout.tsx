import type { Metadata } from 'next'
import GlobalConsoleLog from './components/GlobalConsoleLog'
import BodyWrapper from './components/BodyWrapper'
import LayoutContent from './components/LayoutContent'
import CursorDust from './components/CursorDust'
import './globals.css'

export const metadata: Metadata = {
    title: 'Shresth Kapoor',
    description: 'notes dump',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body>
                <GlobalConsoleLog />
                <BodyWrapper>
                    <CursorDust />
                    <LayoutContent>
                        {children}
                    </LayoutContent>
                </BodyWrapper>
            </body>
        </html>
    )
}
