import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  // CoinGecko endpoint for BTC and ETH in USD
  const url = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd';
  try {
    const response = await fetch(url);
    if (!response.ok) {
      return new Response(JSON.stringify({ error: 'Failed to fetch from CoinGecko' }), { status: response.status });
    }
    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Cache-Control': 's-maxage=30' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}