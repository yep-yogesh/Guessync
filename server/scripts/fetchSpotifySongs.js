import fetch from 'node-fetch';
import getYoutubeVideoId from './getYoutubeVideoId.js';

export async function getSongsFromSpotifyPlaylist(playlistId, accessToken) {
  let songs = [];
  let nextUrl = `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=100`;

  while (nextUrl) {
    const res = await fetch(nextUrl, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    const data = await res.json();
    const items = data.items || [];

    for (let item of items) {
      const track = item.track;
      if (!track) continue;

      const songName = track.name;
      const artistName = track.artists?.[0]?.name || "";
      const composer = track.artists.map(a => a.name).join(", ");
      const movie = track.album.name;
      const cover = track.album.images?.[0]?.url || "";

      const videoId = await getYoutubeVideoId(`${songName} ${artistName}`);

      songs.push({
        song: songName,
        movie,
        composer,
        cover,
        videoId
      });
    }

    nextUrl = data.next;
  }
  const shuffled = songs.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 10);
}
