import fetch from 'node-fetch';

export default async function getYoutubeVideoId(query) {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const encodedQuery = encodeURIComponent(query);

  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodedQuery}&key=${apiKey}&type=video&maxResults=1`;

  const res = await fetch(url);
  const data = await res.json();

  const videoId = data.items?.[0]?.id?.videoId || null;
  return videoId;
}
