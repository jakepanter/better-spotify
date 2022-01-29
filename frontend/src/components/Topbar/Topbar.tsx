import React, {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import "./Topbar.scss";
import Searchbar from "../Searchbar/Searchbar";
import 'rc-slider/assets/index.css';
import Volume from "./Volume";
import {API_URL} from "../../utils/constants";
import {getAuthHeader} from '../../helpers/api-helpers';

function authorize() {
    fetch(`${API_URL}api/spotify/get-auth-url`)
        .then((res) => res.text())
        .then((url) => {
            console.log(url);
            window.location.href = url;
        });
}

interface IProps {
    onChangeEditable: () => void,
    editable: boolean,
    onChangeLightmode: () => void,
    lightTheme: boolean
}

const Topbar = (props: IProps) => {
    const toggleEditable = () => {
        props.onChangeEditable();
    }

    const toggleLightmode = () => {
        props.onChangeLightmode();
    }

    const [image, setImage] = useState<string>('');

    useEffect(() => {
        async function getProfilePicture() {
            const authHeader = getAuthHeader();
            const res = await fetch(`${API_URL}api/spotify/me`, {
                headers: {
                    'Authorization': authHeader
                }
            }).then((res) => res.json());
            if (res.images && res.images.length > 0) setImage(res.images[0].url)
            //save country of user in local storage
            localStorage.setItem("country", res.country)
        }

        getProfilePicture();
    }, []);

    const customizeButton = () => {
        if (useLocation().pathname === "/") return true;
    };

    return (
        <div className={`top-bar ${customizeButton() ? 'customize-start' : ''}`}>
            <div className={'top-bar-item search'} title={"Search for music, podcasts, albums ..."}>
                <Searchbar/>
            </div>
            <div className={'top-bar-item volume'}>
                <Volume/>
                <div className={"lightModeToggle"}>
                    <span className={'material-icons light'}>light_mode</span>
                    <div className={"switch"}>
                        <label className={"switchLabel"}>
                            <input type="checkbox" onChange={toggleLightmode}/>
                            <span className={"slider round"}/>
                        </label>
                    </div>
                    <span className={'material-icons dark'}>nightlight_round</span>
                </div>
            </div>
            <div className={'top-bar-item settings'}>
                <button className={'settings-button customize-button'} onClick={toggleEditable}
                        title={"Customize start page"}>
                    <span className={'material-icons'}>{props.editable ? "close" : "edit"}</span>
                </button>
                <button className={'settings-button'} onClick={authorize} title={"Log out"}>
                    <span className={'material-icons'}>login</span>
                </button>

                {image != ''
                    ? <button className={'settings-button profile-image'} title={"Profile"}>
                        <img src={image} alt={'profile'}/>
                    </button>
                    : <button className={'settings-button'}>
                        <span className={'material-icons'}>account_circle</span>
                    </button>
                }
            </div>
        </div>
    );
}

export default Topbar;
