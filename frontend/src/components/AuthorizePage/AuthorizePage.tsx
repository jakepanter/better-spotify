import React from 'react';
import './AuthorizePage.scss';
import {API_URL} from "../../utils/constants";
import { Link } from 'react-router-dom';


function authorize() {
    fetch(`${API_URL}api/spotify/get-auth-url`)
        .then((res) => res.text())
        .then((url) => {
            console.log(url);
            window.location.href = url;
        });
}


function AuthorizePage() {
    const [checked, setChecked] = React.useState(false);
    const handleChange = () => {
        setChecked(!checked);
    };

    return (
        <div className={"AuthorizePage"}>
            <div className={"AuthorizePageInner"}>
                <div>
                    <img className={"AuthorizePageLogo"} src="logo512.png"/>
                    <h1 className={"headlineBetterSpotify"}>Better<span className="non-colored-headline">Spotify</span></h1>
                </div>
                <div>
                    <label>
                        <input type={"checkbox"}
                               checked={checked}
                               onChange={handleChange}/>
                        <p>
                            By registering you agree to our <Link to={"/privacypolicy"}>privacy policy</Link>. On the following page you will be informed
                            about the terms and conditions of spotify.
                        </p>
                    </label>
                </div>
                <button className={`button ${checked ? " " : "ApprovalRequired"}`} onClick={authorize}>
                    Log in with Spotify
                </button>
            </div>
        </div>
    )
}

export default AuthorizePage;