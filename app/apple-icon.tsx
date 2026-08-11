import { ImageResponse } from 'next/og'

// PNG app icon (apple-touch-icon). Link-preview crawlers that ignore the SVG
// favicon pick this up. Matches app/icon.svg — a ringed planet on a dark tile.
export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#111111',
                }}
            >
                <svg width="132" height="132" viewBox="0 0 32 32">
                    <ellipse
                        cx="16"
                        cy="16"
                        rx="13"
                        ry="4.6"
                        fill="none"
                        stroke="#ffffff"
                        strokeWidth={2}
                        transform="rotate(-20 16 16)"
                    />
                    <circle cx="16" cy="16" r="6.2" fill="#111111" />
                    <circle cx="16" cy="16" r="6.2" fill="#ffffff" />
                    <circle cx="13.6" cy="13.6" r="1.7" fill="#111111" />
                </svg>
            </div>
        ),
        { ...size }
    )
}
