# better-spotify

bootstrapped the MERN stack project with the help of this docs:
https://www.digitalocean.com/community/tutorials/getting-started-with-the-mern-stack


## setup environment
On https://developer.spotify.com/dashboard create a new application.
You will get a client ID and a client secret once your application is set up.
Click on 'Edit settings' and add `http://localhost:5000/api/callback` to Redirect URIs.


Copy `.env-example` file to a new `.env` file in the root directory.
Add the following lines with your Spotify developer credentials:

```
CLIENT_ID = 'YOUR_CLIENT_ID'
CLIENT_SECRET = 'YOUR_CLIENT_SECRET'
REDIRECT_URL = 'http://localhost:5000/api/callback'
```

## running the application

starting the node server & react client at the same time with:
`npm run dev`
in the root directory.