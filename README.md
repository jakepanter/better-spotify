# better-spotify

## Project Structure

Frontend and backend are two independent npm packages.

The code for the frontend is in `/frontend`, the code for the backend in `/backend`.

## Setup

To set up the project, go to the root folder and run `npm run setup`.
This will set up both the backend and frontend.

Don't forget to fill in the .env files in the frontend and backend.
To get the Spotify credentials go to https://developer.spotify.com/dashboard and create a new application.
You will get a client ID and a client secret once your application is set up.
Click on 'Edit settings' and add `http://localhost:5000/api/spotify/authorization-code-grant` to Redirect URIs.

After that you can run `npm start` in the root to start frontend and backend in watch mode or independently in their directories.

For development please ensure to use the linter with the provided configs.

## Deployment

TODO
