import type { Metadata } from 'next'
import GlobalConsoleLog from './components/GlobalConsoleLog'
import BodyWrapper from './components/BodyWrapper'
import LayoutContent from './components/LayoutContent'
import './globals.css'

export const metadata: Metadata = {
    title: 'Σpace',
    description: 'notes dump',
    icons: {
        icon: '/icon.jpg',
        apple: '/icon.jpg',
        shortcut: '/icon.jpg',
    },
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
                    <LayoutContent>
                        {children}
                    </LayoutContent>
                </BodyWrapper>
            </body>
        </html>
    )
}
