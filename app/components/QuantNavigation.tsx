'use client'

import React, { useEffect, useState } from 'react'

const API_URL = `/api/quote`

export default function QuantNavigation() {
  const [prices, setPrices] = useState<any>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => {
        setPrices(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const fallbackText =
    'quant notes ~ | '

  const tickerText = loading || !prices.bitcoin || !prices.ethereum
    ? fallbackText
    : `BTC: $${prices.bitcoin?.usd?.toFixed(2) ?? '?'}\u00A0|\u00A0ETH: $${prices.ethereum?.usd?.toFixed(2) ?? '?'}\u00A0|\u00A0quant notes ~\u00A0|\u00A0`

  return (
    <div className="quant-ticker-container">
      <div className="quant-ticker">
        <span>{tickerText}</span>
        <span>{tickerText}</span>
      </div>
    </div>
  )
}