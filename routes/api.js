const express = require('express');
const router = express.Router();
const querystring = require('querystring');
const request = require('request');
const Song = require('../models/song');
const config = require('../utils/config');
require('dotenv').config();

clientId = process.env.CLIENT_ID;
clientSecret = process.env.CLIENT_SECRET;
redirectUri = process.env.REDIRECT_URL;
stateKey = 'spotify_auth_state';

router.get('/login', (req, res, next) => {
    const state = config.generateRandomString(16);
    res.cookie(stateKey, state);

    // your application requests authorization
    // all scopes [ugc-image-upload, playlist-modify-private, playlist-read-private, playlist-modify-public, playlist-read-collaborative, user-read-private, user-read-email, user-read-playback-state, user-modify-playback-state, user-read-currently-playing, user-library-modify, user-library-read, user-read-playback-position, user-read-recently-played, user-top-read, app-remote-control, streaming, user-follow-modify, user-follow-read]
    // const scope = 'user-read-private user-read-email user-library-read';
    const scope = 'ugc-image-upload, playlist-modify-private, playlist-read-private, playlist-modify-public, playlist-read-collaborative, user-read-private, user-read-email, user-read-playback-state, user-modify-playback-state, user-read-currently-playing, user-library-modify, user-library-read, user-read-playback-position, user-read-recently-played, user-top-read, app-remote-control, streaming, user-follow-modify, user-follow-read';
    res.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: clientId,
            scope: scope,
            redirect_uri: redirectUri,
            state: state
        }));
});

router.get('/callback', (req, res, next) => {
    const code = req.query.code || null;
    const state = req.query.state || null;
    const storedState = req.cookies ? req.cookies[stateKey] : null;

    if (state === null || state !== storedState) {
        res.redirect('/#' +
            querystring.stringify({
                error: 'state_mismatch'
            }));
    } else {
        res.clearCookie(stateKey);
        const authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            form: {
                code: code,
                redirect_uri: redirectUri,
                grant_type: 'authorization_code'
            },
            headers: {
                'Authorization': 'Basic ' + (new Buffer(clientId + ':' + clientSecret).toString('base64'))
            },
            json: true
        };

        request.post(authOptions, function(error, response, body) {
            if (!error && response.statusCode === 200) {

                const access_token = body.access_token,
                    refresh_token = body.refresh_token;

                const options = {
                    url: 'https://api.spotify.com/v1/me',
                    headers: { 'Authorization': 'Bearer ' + access_token },
                    json: true
                };

                // use the access token to access the Spotify Web API
                request.get(options, function(error, response, body) {
                    console.log(body);
                });

                // we can also pass the token to the browser to make requests from there
                res.redirect('http://localhost:3000/#' +
                    querystring.stringify({
                        access_token: access_token,
                        refresh_token: refresh_token
                    }));
            } else {
                res.redirect('/#' +
                    querystring.stringify({
                        error: 'invalid_token'
                    }));
            }
        });
    }
});

router.get('/refresh_token', (req, res, next) => {
    const refresh_token = req.query.refresh_token;
    const authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: { 'Authorization': 'Basic ' + (new Buffer(clientId + ':' + clientSecret).toString('base64')) },
        form: {
            grant_type: 'refresh_token',
            refresh_token: refresh_token
        },
        json: true
    };

    request.post(authOptions, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            const access_token = body.access_token;
            res.send({
                'access_token': access_token
            });
        }
    });
});

router.get('/songs', (req, res, next) => {
    Song.find()
        .then(data => res.json(data))
        .catch(next);
});

router.post('/songs', (req, res, next) => {
    if (req.body.name) {
        Song.create(req.body)
            .then(data => res.json(data))
            .catch(next);
    } else {
        res.json({
            error: 'The input field is empty',
        });
    }
});

router.delete('/songs/:id', (req, res, next) => {
    Song.findOneAndDelete({ _id: req.params.id })
        .then(data => res.json(data))
        .catch(next);
});

module.exports = router;