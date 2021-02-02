const fetch = require('node-fetch')
const constants = require('../constants')

const {
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
  SPOTIFY_REDIRECT_URI,
} = process.env

// 'https://accounts.spotify.com/api/token'
exports.handler = async function (event) {
  const { code } = event.queryStringParameters
  const data = await fetch(
    `https://accounts.spotify.com/api/token?grant_type=authorization_code&code=${code}&redirect_uri=${SPOTIFY_REDIRECT_URI}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(
          `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`
        ).toString('base64')}`,
      },
    }
  ).then(res => res.json())
  console
  return {
    statusCode: 200,
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  }
}
