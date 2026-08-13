export interface Track {
  id: number
  title: string
  artist: string
  youtubeUrl?: string
}

export const sampleTracks: Track[] = [
  { id: 3, title: "Timeless", artist: "The Weekend, Playboi Carti", youtubeUrl: "https://www.youtube.com/watch?v=5EpyN_6dqyk" },
  { id: 2, title: "Nights", artist: "Frank Ocean", youtubeUrl: "https://www.youtube.com/watch?v=r4l9bFqgMaQ" },
  { id: 1, title: "September", artist: "Earth, Wind & Fire", youtubeUrl: "https://www.youtube.com/watch?v=AWXub7E5moM" },
  { id: 4, title: "Freak", artist: "Doja Cat", youtubeUrl: "https://www.youtube.com/watch?v=Wc9_dsv5YYA" },
  { id: 5, title: "Double Take", artist: "Dhruv", youtubeUrl: "https://youtu.be/R8FHtIhWqNo" },
]
