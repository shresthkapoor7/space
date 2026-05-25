'use client'

import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import { sampleTracks, type Track } from './tracks'

declare global {
  interface Window {
    YT: any
    onYouTubeIframeAPIReady: () => void
  }
}

export function extractYouTubeId(url: string) {
  const match = url.match(/^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/)
  return match && match[7].length === 11 ? match[7] : null
}

export function useYouTubeMusicPlayer(tracks: Track[] = sampleTracks) {
  const [currentlyPlaying, setCurrentlyPlaying] = useState<number | null>(null)
  const [isPaused, setIsPaused] = useState(true)
  const [youtubePlayer, setYoutubePlayer] = useState<any>(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  const playerElementId = useId().replace(/:/g, '')
  const playNextTrackRef = useRef<() => void>(() => {})

  const currentTrack = useMemo(
    () => tracks.find((track) => track.id === currentlyPlaying) ?? null,
    [tracks, currentlyPlaying]
  )

  const currentVideoId = currentTrack?.youtubeUrl ? extractYouTubeId(currentTrack.youtubeUrl) : null

  const createYouTubePlayer = useCallback(() => {
    if (!window.YT || !window.YT.Player || youtubePlayer) return

    const playerElement = document.getElementById(playerElementId)
    if (!playerElement) {
      window.setTimeout(createYouTubePlayer, 100)
      return
    }

    new window.YT.Player(playerElementId, {
      height: '1',
      width: '1',
      playerVars: {
        controls: 0,
        modestbranding: 1,
        rel: 0,
        showinfo: 0,
        fs: 0,
        cc_load_policy: 0,
        iv_load_policy: 3,
        autohide: 1,
        disablekb: 1,
        playsinline: 1,
      },
      events: {
        onReady: (event: any) => setYoutubePlayer(event.target),
        onStateChange: (event: any) => {
          if (event.data === window.YT.PlayerState.PLAYING) {
            setIsPaused(false)
          } else if (event.data === window.YT.PlayerState.PAUSED) {
            setIsPaused(true)
          } else if (event.data === window.YT.PlayerState.ENDED) {
            window.setTimeout(() => playNextTrackRef.current?.(), 100)
          }
        },
      },
    })
  }, [playerElementId, youtubePlayer])

  useEffect(() => {
    if (window.YT && window.YT.Player && !youtubePlayer) {
      createYouTubePlayer()
      return
    }

    if (!window.YT) {
      const tag = document.createElement('script')
      tag.src = 'https://www.youtube.com/iframe_api'
      const firstScript = document.getElementsByTagName('script')[0]
      firstScript.parentNode?.insertBefore(tag, firstScript)
      window.onYouTubeIframeAPIReady = () => createYouTubePlayer()
    } else if (!youtubePlayer) {
      createYouTubePlayer()
    }
  }, [createYouTubePlayer, youtubePlayer])

  const playTrack = useCallback((track: Track) => {
    if (!track.youtubeUrl || !youtubePlayer) return

    if (currentlyPlaying === track.id) {
      if (isPaused) {
        youtubePlayer.playVideo()
        setIsPaused(false)
      } else {
        youtubePlayer.pauseVideo()
        setIsPaused(true)
      }
      return
    }

    const videoId = extractYouTubeId(track.youtubeUrl)
    if (!videoId) return

    youtubePlayer.loadVideoById(videoId)
    setCurrentlyPlaying(track.id)
    setIsPaused(false)
  }, [currentlyPlaying, isPaused, youtubePlayer])

  const togglePlayPause = useCallback(() => {
    if (!youtubePlayer) return

    if (!currentTrack) {
      const firstTrack = tracks.find((track) => track.youtubeUrl)
      if (firstTrack) playTrack(firstTrack)
      return
    }

    if (isPaused) {
      youtubePlayer.playVideo()
      setIsPaused(false)
    } else {
      youtubePlayer.pauseVideo()
      setIsPaused(true)
    }
  }, [currentTrack, isPaused, playTrack, tracks, youtubePlayer])

  const playNextTrack = useCallback(() => {
    if (!youtubePlayer || !tracks.length) return

    const currentIndex = tracks.findIndex((track) => track.id === currentlyPlaying)
    const nextTrack = tracks[currentIndex === -1 ? 0 : (currentIndex + 1) % tracks.length]
    if (!nextTrack?.youtubeUrl) return

    const videoId = extractYouTubeId(nextTrack.youtubeUrl)
    if (!videoId) return

    youtubePlayer.loadVideoById(videoId)
    setCurrentlyPlaying(nextTrack.id)
    setIsPaused(false)
  }, [currentlyPlaying, tracks, youtubePlayer])

  const playPreviousTrack = useCallback(() => {
    if (!youtubePlayer || !tracks.length) return

    const currentIndex = tracks.findIndex((track) => track.id === currentlyPlaying)
    const previousIndex = currentIndex <= 0 ? tracks.length - 1 : currentIndex - 1
    const previousTrack = tracks[currentIndex === -1 ? 0 : previousIndex]
    if (!previousTrack?.youtubeUrl) return

    const videoId = extractYouTubeId(previousTrack.youtubeUrl)
    if (!videoId) return

    youtubePlayer.loadVideoById(videoId)
    setCurrentlyPlaying(previousTrack.id)
    setIsPaused(false)
  }, [currentlyPlaying, tracks, youtubePlayer])

  const seekToPercent = useCallback((percent: number) => {
    if (!youtubePlayer || !duration) return
    const nextTime = Math.max(0, Math.min(duration, (percent / 100) * duration))
    youtubePlayer.seekTo(nextTime, true)
    setCurrentTime(nextTime)
  }, [duration, youtubePlayer])

  useEffect(() => {
    playNextTrackRef.current = playNextTrack
  }, [playNextTrack])

  useEffect(() => {
    if (!youtubePlayer || !currentTrack) {
      setCurrentTime(0)
      setDuration(0)
      return
    }

    const syncProgress = () => {
      const nextDuration = Number(youtubePlayer.getDuration?.() ?? 0)
      const nextCurrentTime = Number(youtubePlayer.getCurrentTime?.() ?? 0)
      if (!Number.isNaN(nextDuration)) setDuration(nextDuration)
      if (!Number.isNaN(nextCurrentTime)) setCurrentTime(nextCurrentTime)
    }

    syncProgress()
    const intervalId = window.setInterval(syncProgress, 250)
    return () => window.clearInterval(intervalId)
  }, [currentTrack, youtubePlayer, isPaused])

  return {
    tracks,
    currentTrack,
    currentVideoId,
    currentlyPlaying,
    isPaused,
    currentTime,
    duration,
    progressPercent: duration > 0 ? (currentTime / duration) * 100 : 0,
    playerElementId,
    playTrack,
    playNextTrack,
    playPreviousTrack,
    seekToPercent,
    togglePlayPause,
  }
}
