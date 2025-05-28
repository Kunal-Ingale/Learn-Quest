// utils/fetchYouTubePlaylist.ts
import axios from "axios";

export const fetchYouTubePlaylist = async (playlistId: string) => {
  const apiKey = process.env.YOUTUBE_API_KEY;

  const res = await axios.get(
    `https://www.googleapis.com/youtube/v3/playlistItems`, {
      params: {
        part: "snippet,contentDetails",
        maxResults: 50,
        playlistId,
        key: apiKey,
      },
    }
  );

  const items = res.data.items;

  const videos = items.map((item: any, index: number) => ({
    videoId: item.contentDetails.videoId,
    title: item.snippet.title,
    description: item.snippet.description,
    thumbnail: item.snippet.thumbnails?.high?.url,
    position: index + 1,
  }));

  return videos;
};
