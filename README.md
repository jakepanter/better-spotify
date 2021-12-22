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

To deploy the application to the staging server inside HTW VPN follow these steps:
* Copy your _.env_ to a file named _.env.staging_ and change the variable `REACT_APP_API_URL` inside to `https://s-potify.fun/`
* Connect to **HTW VPN**
* Run `deploy_to_server.sh` bash script
* It will create builds for backend and frontend and then deploy these on the server
* You will be prompted the servers password for user `local` twice in the process
* Next go to [https://s-potify.fun](https://s-potify.fun/) _(from within HTW VPN)_ to check the application
* You will most probably be warned about an unsecure connection, you need to allow this in order to view the site



Credits to @gilbarbara for building a [TS Spotify Playback SDK Wrapper for React](https://github.com/gilbarbara/react-spotify-web-playback)