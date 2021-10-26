if (process.env.SPOTIFY_CLIENT_ID === undefined) throw new Error('SPOTIFY_CLIENT_ID in .env is undefined');
if (process.env.SPOTIFY_CLIENT_SECRET === undefined) throw new Error('SPOTIFY_CLIENT_SECRET in .env is undefined');
if (process.env.SPOTIFY_REDIRECT_URI === undefined) throw new Error('SPOTIFY_REDIRECT_URI in .env is undefined');
if (process.env.DB === undefined) throw new Error('DB in .env is undefined');
if (process.env.PORT === undefined) throw new Error('PORT in .env is undefined');

export default {
  general: {
    port: process.env.PORT,
  },
  spotify: {
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: process.env.SPOTIFY_REDIRECT_URI,
  },
  mongodb: {
    url: Number(process.env.PORT),
  },
};
