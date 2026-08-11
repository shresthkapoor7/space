import { ImageResponse } from 'next/og'

// Large link-preview card (og:image / twitter summary_large_image).
// Matches app/icon.svg — a ringed planet on a dark tile.
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'shresth.space'

export default function OpengraphImage() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#ffffff',
                    padding: 80,
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 148,
                        height: 148,
                        borderRadius: 28,
                        background: '#111111',
                    }}
                >
                    <svg width="104" height="104" viewBox="0 0 32 32">
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
                <div
                    style={{
                        fontSize: 82,
                        fontWeight: 700,
                        color: '#111111',
                        marginTop: 40,
                    }}
                >
                    shresth
                </div>
                <div
                    style={{
                        fontSize: 30,
                        color: '#555555',
                        marginTop: 14,
                    }}
                >
                    shresth.space
                </div>
            </div>
        ),
        { ...size }
    )
}
