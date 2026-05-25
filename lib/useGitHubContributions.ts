'use client'

import { useEffect, useMemo, useState } from 'react'

export interface GitHubCommitDay {
  date: string
  count: number
  level: number
}

interface CachedData {
  data: GitHubCommitDay[]
  timestamp: number
  username: string
}

const CACHE_DURATION = 60 * 60 * 1000

function getCacheKey(username: string) {
  return `github-contributions-${username}`
}

function getCachedData(username: string): GitHubCommitDay[] | null {
  try {
    const cached = localStorage.getItem(getCacheKey(username))
    if (!cached) return null

    const cachedData: CachedData = JSON.parse(cached)
    const now = Date.now()

    if (
      cachedData.timestamp &&
      cachedData.username === username &&
      (now - cachedData.timestamp) < CACHE_DURATION
    ) {
      return cachedData.data
    }

    localStorage.removeItem(getCacheKey(username))
    return null
  } catch {
    return null
  }
}

function getExpiredCachedData(username: string): GitHubCommitDay[] | null {
  try {
    const cached = localStorage.getItem(getCacheKey(username))
    if (!cached) return null

    const cachedData: CachedData = JSON.parse(cached)
    if (cachedData.username === username && cachedData.data) {
      return cachedData.data
    }
    return null
  } catch {
    return null
  }
}

function setCachedData(username: string, data: GitHubCommitDay[]) {
  try {
    const cacheData: CachedData = {
      data,
      timestamp: Date.now(),
      username,
    }
    localStorage.setItem(getCacheKey(username), JSON.stringify(cacheData))
  } catch {}
}

async function fetchGitHubContributions(username: string): Promise<GitHubCommitDay[]> {
  const apiUrl = `https://github-contributions-api.jogruber.de/v4/${username}?y=last`
  const response = await fetch(apiUrl)

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status}`)
  }

  const data = await response.json()
  const ninetyDaysAgo = new Date()
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)
  const ninetyDaysAgoStr = ninetyDaysAgo.toISOString().split('T')[0]

  return data.contributions.filter((day: GitHubCommitDay) => day.date >= ninetyDaysAgoStr)
}

export function useGitHubContributions(username: string) {
  const [commitData, setCommitData] = useState<GitHubCommitDay[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setIsLoading(true)
      setError(null)

      const cachedData = getCachedData(username)
      if (cachedData) {
        if (!cancelled) {
          setCommitData(cachedData)
          setIsLoading(false)
        }
        return
      }

      try {
        const fetchedData = await fetchGitHubContributions(username)
        setCachedData(username, fetchedData)
        if (!cancelled) setCommitData(fetchedData)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load contributions'
        const oldCachedData = getExpiredCachedData(username)
        if (!cancelled) {
          setError(message)
          setCommitData(oldCachedData ?? [])
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [username])

  const summary = useMemo(() => {
    if (!commitData.length) {
      return { count: null as number | null, label: 'loading…' }
    }

    const latestDay = [...commitData].sort((a, b) => b.date.localeCompare(a.date))[0]
    const count = latestDay?.count ?? 0
    const dayLabel = count === 0 ? 'today' : 'today'
    const commitLabel = count === 1 ? 'commit' : 'commits'
    return {
      count,
      label: `${count} ${commitLabel} · ${dayLabel}`,
    }
  }, [commitData])

  return {
    commitData,
    isLoading,
    error,
    summary,
  }
}
