
import fetch from 'node-fetch';

let cachedToken = null;
let expiresAt = 0;

export async function getSpotifyAccessToken() {
  const now = Date.now();

  if (cachedToken && now < expiresAt) {
    return cachedToken;
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: "grant_type=client_credentials"
  });

  const data = await res.json();

  if (data.access_token) {
    cachedToken = data.access_token;
    expiresAt = now + (data.expires_in * 1000) - 60000;
    return cachedToken;
  } else {
    throw new Error("Failed to fetch Spotify access token");
  }
}
