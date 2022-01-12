import React, {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import "./Topbar.scss";
import Searchbar from "../Searchbar/Searchbar";
import 'rc-slider/assets/index.css';
import Volume from "./Volume";
import {API_URL} from "../../utils/constants";

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
    editable: boolean
}

const Topbar = (props: IProps) => {
    const toggleEditable = () => {
        props.onChangeEditable();
    }

    const [image, setImage] = useState<string>('');

    useEffect(() => {
        async function getProfilePicture() {
            const res = await fetch(`${API_URL}api/spotify/me`)
                .then((res) => res.json());
            if (res.images && res.images.length > 0) setImage(res.images[0].url)
            console.log(image)
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
            </div>
            <div className={'top-bar-item settings'}>
                <button className={'settings-button customize-button'} onClick={toggleEditable} title={"Customize start page"}>
                    <span className={'material-icons'}>{props.editable ? "close" : "edit"}</span>
                </button>
                <button className={'settings-button'} title={"Notifications"}>
                    <span className={'material-icons'}>notifications</span>
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
