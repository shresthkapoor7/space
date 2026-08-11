import type { Metadata } from 'next'
import { Space_Grotesk, Inter, JetBrains_Mono } from 'next/font/google'
import GlobalConsoleLog from './components/GlobalConsoleLog'
import BodyWrapper from './components/BodyWrapper'
import './globals.css'

const spaceGrotesk = Space_Grotesk({
    subsets: ['latin'],
    variable: '--font-space-grotesk',
    display: 'swap',
})

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
    subsets: ['latin'],
    variable: '--font-jetbrains',
    display: 'swap',
})

export const metadata: Metadata = {
    metadataBase: new URL('https://shresth.space'),
    title: 'shresth',
    description: 'personal website',
    openGraph: {
        title: 'shresth',
        description: 'personal website',
        url: 'https://shresth.space',
        siteName: 'shresth.space',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'shresth',
        description: 'personal website',
    },
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
            <body>
                <GlobalConsoleLog />
                <BodyWrapper>
                    {children}
                </BodyWrapper>
            </body>
        </html>
    )
}
