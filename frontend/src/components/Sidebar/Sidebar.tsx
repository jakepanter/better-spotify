import React from "react";
import './Sidebar.scss';
import {NavLink} from "react-router-dom";

const Sidebar = () => {
    return (
        <ul className="left-side-panel">
            <li>
                <NavLink exact activeClassName="active" className="button" to="/">
                    <span className="material-icons left-side-panel--icon">home</span>
                    <span className="left-side-panel--text">Home</span>
                </NavLink>
            </li>
            <li>
                <NavLink activeClassName="active" className="button" to="/me/tracks">
                    <span className="material-icons left-side-panel--icon">favorite</span>
                    <span className="left-side-panel--text">Favorites</span>
                </NavLink>
            </li>
            <li className="hiddenMenu">
                <NavLink activeClassName="active" className="button" to="/playlists">
                    <span className="material-icons left-side-panel--icon">queue_music</span>
                    <span className="left-side-panel--text">Playlists</span>
                </NavLink>
            </li>
            <li className="hiddenMenu">
                <NavLink activeClassName="active" className="button" to="/collections/albums">
                    <span className="material-icons left-side-panel--icon">library_music</span>
                    <span className="left-side-panel--text">Albums</span>
                </NavLink>
            </li>
            <li className="hiddenMenu">
                <NavLink exact activeClassName="active" className="button" to="/">
                    <span className="material-icons left-side-panel--icon">grid_view</span>
                    <span className="left-side-panel--text">Library</span>
                </NavLink>
            </li>
            <li className="hiddenMenu">
                <NavLink exact activeClassName="active" className="button" to="/">
                    <span className="material-icons left-side-panel--icon">manage_search</span>
                    <span className="left-side-panel--text">Discover</span>
                </NavLink>
            </li>
            <li className="hiddenMenu">
                <NavLink exact activeClassName="active" className="button" to="/">
                    <span className="material-icons left-side-panel--icon">queue</span>
                    <span className="left-side-panel--text">Queue</span>
                </NavLink>
            </li>
        </ul>
    )
}

export default Sidebar;