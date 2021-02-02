const { SPOTIFY_CLIENT_ID, SPOTIFY_REDIRECT_URI } = process.env
const constants = require('../constants.js')

exports.handler = function (event, context) {
  return {
    statusCode: 301,
    headers: {
      Location: `https://accounts.spotify.com/authorize?response_type=code&client_id=${SPOTIFY_CLIENT_ID}&scope=${
        constants.scopes
      }&redirect_uri=${encodeURIComponent(SPOTIFY_REDIRECT_URI)}`,
    },
  }
}
