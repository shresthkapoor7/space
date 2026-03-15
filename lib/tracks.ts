export interface Track {
  id: number
  title: string
  artist: string
  youtubeUrl?: string
}

export const sampleTracks: Track[] = [
  { id: 1, title: "Thru the night", artist: "Jack Harlow", youtubeUrl: "https://www.youtube.com/watch?v=wPrEkA_gQp4" },
  { id: 2, title: "No Pole", artist: "Don Toliver", youtubeUrl: "https://www.youtube.com/watch?v=A5mURRozXtg" },
  { id: 3, title: "DUMBO", artist: "Travis Scott", youtubeUrl: "https://www.youtube.com/watch?v=pyLs2dk9aVU" },
  { id: 4, title: "Freak", artist: "Doja Cat", youtubeUrl: "https://www.youtube.com/watch?v=Wc9_dsv5YYA" },
  { id: 5, title: "Double Take", artist: "Dhruv", youtubeUrl: "https://youtu.be/R8FHtIhWqNo" },
]
