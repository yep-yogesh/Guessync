import fetch from 'node-fetch';
import getYoutubeVideoId from './getYoutubeVideoId.js';

function shuffleArray(array) {
  return array
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

export async function getSongsFromSpotifyPlaylist(playlistId, accessToken, count = 15) {
  const allTracks = [];
  let offset = 0;
  const limit = 100;

  while (true) {
    const url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=${limit}&offset=${offset}`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    const data = await res.json();
    const items = data.items || [];

    allTracks.push(...items);

    if (items.length < limit) break;

    offset += limit;
  }

  const shuffled = shuffleArray(allTracks).slice(0, count);

  const songs = await Promise.all(
    shuffled.map(async (item) => {
      const track = item.track;
      const songName = track.name;
      const artistName = track.artists?.[0]?.name || "";
      const composer = track.artists.map(a => a.name).join(", ");
      const movie = track.album.name;
      const cover = track.album.images?.[0]?.url || "";

      const videoId = await getYoutubeVideoId(`${songName} ${artistName}`);

      return {
        song: songName,
        movie,
        composer,
        cover,
        videoId
      };
    })
  );

  return songs;
}
