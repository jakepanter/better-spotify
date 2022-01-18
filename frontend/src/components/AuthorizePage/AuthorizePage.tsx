import React from 'react';
import './AuthorizePage.scss';
import {API_URL} from "../../utils/constants";


function authorize() {
    fetch(`${API_URL}api/spotify/get-auth-url`)
        .then((res) => res.text())
        .then((url) => {
            console.log(url);
            window.location.href = url;
        });
}

const AuthorizePage = () => {
    return (
        <div className={"AuthorizePage"}>
            <div className={"column"}>
                <button className="button" onClick={authorize}>
                    Log in with Spotify
                </button>
            </div>
            <div className={"column"}>
                <button className="button" onClick={authorize}>
                    Log in with Spotify
                </button>
            </div>
        </div>
    )
}
export default AuthorizePage;