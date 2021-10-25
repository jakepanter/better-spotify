import React from 'react';
import './App.css';
import queryString from 'query-string';
import axios from 'axios';

export default class App extends React.Component {

    state = {
        access_token: '',
        refresh_token: '',
        profile: {},
    };

    componentDidMount() {
        this.setState({
            access_token: queryString.parse(window.location.hash).access_token,
            refresh_token: queryString.parse(window.location.hash).refresh_token,
        });

        const params = {
            method: 'get',
            url: 'https://api.spotify.com/v1/me',
            headers: {
                'Athorization': 'Bearer ' + this.state.access_token
            }
        }
        axios(params).then(result => {
            this.setState({profile: result.data})
            console.log('profile');
            console.log(this.state.profile);
        })
    }

    render() {
        return (
            <div className="App">
                <a
                    className="App-link"
                    href="http://localhost:5000/api/login"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Login with Spotify
                </a>

                <p>Logged in as:</p>
                <p>{ Object.keys(this.state.profile).toString() }</p>
                <p>access_token: {queryString.parse(window.location.hash).access_token}</p>
                <p>refresh_token: {queryString.parse(window.location.hash).refresh_token}</p>
            </div>
        );
    }
}
