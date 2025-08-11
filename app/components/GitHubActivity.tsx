'use client'

import { useState, useEffect } from 'react'

interface GitHubCommitDay {
  date: string
  count: number
  level: number
}

interface GitHubActivityProps {
  username: string
}

interface CachedData {
  data: GitHubCommitDay[]
  timestamp: number
  username: string
}

export default function GitHubActivity({ username }: GitHubActivityProps) {
  const [commitData, setCommitData] = useState<GitHubCommitDay[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hoveredDay, setHoveredDay] = useState<GitHubCommitDay | null>(null)

  // Cache duration: 1 hour (3600000 ms)
  const CACHE_DURATION = 60 * 60 * 1000

  useEffect(() => {
    fetchCommitData()
  }, [username])

  const getCacheKey = (username: string) => `github-contributions-${username}`

  const getCachedData = (username: string): GitHubCommitDay[] | null => {
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
    } catch (error) {
      console.error('Error reading GitHub cache:', error)
      return null
    }
  }

  const setCachedData = (username: string, data: GitHubCommitDay[]) => {
    try {
      const cacheData: CachedData = {
        data,
        timestamp: Date.now(),
        username
      }
      localStorage.setItem(getCacheKey(username), JSON.stringify(cacheData))
    } catch (error) {
      console.error('Error caching GitHub data:', error)
    }
  }

  const fetchCommitData = async () => {
    setIsLoading(true)
    setError(null)

    const cachedData = getCachedData(username)
    if (cachedData) {
      setCommitData(cachedData)
      setIsLoading(false)
      return
    }

    try {
      const commitMap = await fetchGitHubContributions(username)

      setCachedData(username, commitMap)
      setCommitData(commitMap)
    } catch (err) {
      console.error('GitHub contributions fetch failed:', err)
      setError(err instanceof Error ? err.message : 'Failed to load contributions')

      const oldCachedData = getExpiredCachedData(username)
      if (oldCachedData) {
        setCommitData(oldCachedData)
        setError(null)
      } else {
        setCommitData([])
      }
    } finally {
      setIsLoading(false)
    }
  }

  const getExpiredCachedData = (username: string): GitHubCommitDay[] | null => {
    try {
      const cached = localStorage.getItem(getCacheKey(username))
      if (!cached) return null

      const cachedData: CachedData = JSON.parse(cached)
      if (cachedData.username === username && cachedData.data) {
        return cachedData.data
      }
      return null
    } catch (error) {
      return null
    }
  }

  const fetchGitHubContributions = async (username: string): Promise<GitHubCommitDay[]> => {
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(endDate.getDate() - 90)

    const fromDate = startDate.toISOString().split('T')[0]
    const toDate = endDate.toISOString().split('T')[0]

    const contributionsUrl = `https://github.com/users/${username}/contributions?from=${fromDate}&to=${toDate}`

    try {
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(contributionsUrl)}`
      const response = await fetch(proxyUrl)

      if (!response.ok) {
        throw new Error(`CORS proxy error: ${response.status}`)
      }

      const data = await response.json()
      const html = data.contents

      return parseContributionData(html, startDate, endDate)
    } catch (err) {
      console.error('CORS proxy failed, trying direct approach:', err)

      throw new Error('Could not fetch GitHub contributions page')
    }
  }

  const parseContributionData = (html: string, startDate: Date, endDate: Date): GitHubCommitDay[] => {
    const data: GitHubCommitDay[] = []
    const currentDate = new Date(startDate)

    const contributionPattern = /(\d+)\s+contributions?\s+on\s+([A-Za-z]+\s+\d+(?:st|nd|rd|th))/g
    const noContributionPattern = /No\s+contributions\s+on\s+([A-Za-z]+\s+\d+(?:st|nd|rd|th))/g

    const contributionMap: { [key: string]: number } = {}

    let match
    while ((match = contributionPattern.exec(html)) !== null) {
      const count = parseInt(match[1])
      const dateStr = match[2]
      contributionMap[dateStr] = count
    }

    while ((match = noContributionPattern.exec(html)) !== null) {
      const dateStr = match[1]
      contributionMap[dateStr] = 0
    }

    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split('T')[0]
      const monthName = currentDate.toLocaleDateString('en-US', { month: 'long' })
      const day = currentDate.getDate()
      const ordinal = getOrdinal(day)
      const lookupKey = `${monthName} ${day}${ordinal}`

      const count = contributionMap[lookupKey] || 0
      let level = 0

      if (count > 0) {
        if (count >= 10) level = 4
        else if (count >= 7) level = 3
        else if (count >= 4) level = 2
        else level = 1
      }

      data.push({
        date: dateStr,
        count,
        level
      })

      currentDate.setDate(currentDate.getDate() + 1)
    }

    return data
  }

  const getOrdinal = (day: number): string => {
    if (day >= 11 && day <= 13) return 'th'
    switch (day % 10) {
      case 1: return 'st'
      case 2: return 'nd'
      case 3: return 'rd'
      default: return 'th'
    }
  }

  const processEventsToCommitMap = (events: any[]) => {
    const activityCounts: { [date: string]: number } = {}
    const commitCounts: { [date: string]: number } = {}

    events.forEach(event => {
      const date = new Date(event.created_at).toISOString().split('T')[0]

      switch (event.type) {
        case 'PushEvent':
          if (event.payload.commits) {
            const commits = event.payload.commits.length
            commitCounts[date] = (commitCounts[date] || 0) + commits
            activityCounts[date] = (activityCounts[date] || 0) + commits
          }
          break
        case 'PullRequestEvent':
        case 'IssuesEvent':
        case 'CreateEvent':
        case 'ReleaseEvent':
        case 'ForkEvent':
          activityCounts[date] = (activityCounts[date] || 0) + 1
          break
        default:
          activityCounts[date] = (activityCounts[date] || 0) + 0.5
          break
      }
    })

    const maxDays = 90
    const today = new Date()
    const data: GitHubCommitDay[] = []

    for (let i = maxDays - 1; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]

      const activityCount = activityCounts[dateStr] || 0
      const commitCount = commitCounts[dateStr] || 0

      const count = Math.round(activityCount)
      let level = 0

      if (count > 0) {
        if (commitCount > 0) {
          level = Math.min(4, Math.max(1, Math.ceil(commitCount / 2) + 1))
        } else {
          level = Math.min(3, Math.ceil(activityCount))
        }
      }

      data.push({
        date: dateStr,
        count: commitCount > 0 ? commitCount : count,
        level
      })
    }

    return data
  }

  const getCommitMapData = () => {
    const weeks: GitHubCommitDay[][] = []
    const daysInWeek: GitHubCommitDay[] = []

    commitData.forEach((day, index) => {
      daysInWeek.push(day)

      // If we have 7 days or it's the last day, complete the week
      if (daysInWeek.length === 7 || index === commitData.length - 1) {
        // Fill incomplete week with empty days if needed
        while (daysInWeek.length < 7) {
          const lastDate = new Date(daysInWeek[daysInWeek.length - 1].date)
          lastDate.setDate(lastDate.getDate() + 1)
          daysInWeek.push({
            date: lastDate.toISOString().split('T')[0],
            count: 0,
            level: 0
          })
        }
        weeks.push([...daysInWeek])
        daysInWeek.length = 0
      }
    })

    return weeks
  }

  const getMonthLabels = () => {
    const labels: { month: string; weekIndex: number }[] = []
    const weeks = getCommitMapData()

    weeks.forEach((week, weekIndex) => {
      const firstDay = new Date(week[0].date)
      const monthName = firstDay.toLocaleDateString('en-US', { month: 'short' })

      // Add label if it's the first week or month changed
      if (weekIndex === 0 || (weekIndex > 0 &&
        new Date(weeks[weekIndex - 1][0].date).getMonth() !== firstDay.getMonth())) {
        labels.push({ month: monthName, weekIndex })
      }
    })

    return labels
  }

  const getCommitLevelClass = (level: number) => {
    switch (level) {
      case 0: return 'commit-level-0'
      case 1: return 'commit-level-1'
      case 2: return 'commit-level-2'
      case 3: return 'commit-level-3'
      case 4: return 'commit-level-4'
      default: return 'commit-level-0'
    }
  }

  const getDayLabel = (dayIndex: number) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    return days[dayIndex]
  }

  const handleDayHover = (day: GitHubCommitDay) => {
    setHoveredDay(day)
  }

  const handleDayLeave = () => {
    setHoveredDay(null)
  }

  const formatTooltipDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const formatCommitText = (count: number) => {
    if (count === 0) return 'No contributions'
    if (count === 1) return '1 contribution'
    return `${count} contributions`
  }

  if (isLoading) {
    return (
      <>
        <div className="section-header">
          <h4>GitHub Activity</h4>
          <a
            href={`https://github.com/${username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="github-profile-link"
            aria-label="View GitHub profile"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
        <div style={{ padding: '20px 16px', color: '#666', textAlign: 'center' }}>
          Loading commit data...
        </div>
      </>
    )
  }

  return (
    <>
      <div className="section-header">
        <h4>GitHub Activity</h4>
        <a
          href={`https://github.com/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="github-profile-link"
          aria-label="View GitHub profile"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      </div>

      <div className="github-commit-map">
        {error && commitData.length === 0 && (
          <div style={{ padding: '16px', textAlign: 'center' }}>
            <img
              src="https://media1.tenor.com/m/rec5dlPBK2cAAAAd/mr-bean-waiting.gif"
              alt="Mr. Bean waiting"
              style={{
                width: '120px',
                height: 'auto',
                borderRadius: '8px',
                marginBottom: '12px'
              }}
            />
            <div style={{ color: '#888', fontSize: '0.75rem', marginBottom: '8px' }}>
              Still waiting for GitHub...
            </div>
            <div style={{ color: '#666', fontSize: '0.7rem' }}>
              Unable to load contribution data
            </div>
          </div>
        )}

        {/* Only show the commit map if we have data */}
        {commitData.length > 0 && (
          <>
            {/* Month labels */}
            <div className="commit-map-months">
              {getMonthLabels().map((label, index) => (
                <div
                  key={index}
                  className="month-label"
                  style={{
                    position: 'absolute',
                    left: `${label.weekIndex * 15 + 20}px`,
                    fontSize: '0.65rem',
                    color: '#666'
                  }}
                >
                  {label.month}
                </div>
              ))}
            </div>

            {/* Day labels and grid */}
            <div className="commit-map-container">
              <div className="commit-map-grid">
                {/* Day labels column */}
                <div className="day-labels-column">
                  {['', 'Mon', '', 'Wed', '', 'Fri', ''].map((label, index) => (
                    <div key={index} className="day-label">
                      {label}
                    </div>
                  ))}
                </div>

                {/* Weeks columns */}
                <div className="weeks-container">
                  {getCommitMapData().map((week, weekIndex) => (
                    <div key={weekIndex} className="week-column">
                      {week.map((day, dayIndex) => (
                        <div
                          key={`${day.date}-${dayIndex}`}
                          className={`commit-day ${getCommitLevelClass(day.level)}`}
                          onMouseEnter={() => handleDayHover(day)}
                          onMouseLeave={handleDayLeave}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="commit-map-legend">
              <span style={{ fontSize: '0.7rem', color: '#666' }}>Less</span>
              <div className="legend-squares">
                <div className="commit-day commit-level-0" />
                <div className="commit-day commit-level-1" />
                <div className="commit-day commit-level-2" />
                <div className="commit-day commit-level-3" />
                <div className="commit-day commit-level-4" />
              </div>
              <span style={{ fontSize: '0.7rem', color: '#666' }}>More</span>
            </div>

            {/* Tooltip area below legend */}
            <div className="commit-tooltip-area">
              <div className="tooltip-info">
                {hoveredDay ? (
                  <>
                    <div className="tooltip-contributions">
                      {formatCommitText(hoveredDay.count)}
                    </div>
                    <div className="tooltip-date">
                      {formatTooltipDate(hoveredDay.date)}
                    </div>
                  </>
                ) : (
                  <div className="tooltip-placeholder">
                    Hover over squares to see details
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}
