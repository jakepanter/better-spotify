import React, {useState} from "react";
import {NavLink} from "react-router-dom";
import './Sidebar.scss';

const Sidebar = () => {
    {/* Mobile toggle setup */}
    const [navbarOpen, setNavbarOpen] = useState(false);
    const handleToggle = () => {
        setNavbarOpen(!navbarOpen)
    }
    const closeMenu = () => {
        setNavbarOpen(false)
    }
    return (
        <div className={"left-side-panel"}>
            {/* Only visible in Mobile viewport */}
            <button className="mobileToggle" onClick={handleToggle}>{navbarOpen ?
                <p className="material-icons left-side-panel--icon">circle</p> :
                <p className="material-icons left-side-panel--icon">radio_button_unchecked</p>}
            </button>
            {/* Sidebar menu */}
            <ul className={`left-side-panel--list ${navbarOpen ? " showMenu" : ""}`}>
                <li className="column">
                    <NavLink activeClassName="active" className="button" to="/" onClick={() => closeMenu()} exact>
                        <span className="material-icons left-side-panel--icon">home</span>
                        <span className="left-side-panel--text">Home</span>
                    </NavLink>
                </li>
                <li className="column">
                    <NavLink activeClassName="active" className="button" to="/me/tracks" onClick={() => closeMenu()}
                             exact>
                        <span className="material-icons left-side-panel--icon">favorite</span>
                        <span className="left-side-panel--text">Favorites</span>
                    </NavLink>
                </li>
                <li className="column">
                    <NavLink activeClassName="active" className="button" to="/playlists" onClick={() => closeMenu()}
                             exact>
                        <span className="material-icons left-side-panel--icon">queue_music</span>
                        <span className="left-side-panel--text">Playlists</span>
                    </NavLink>
                </li>
                <li className="column">
                    <NavLink activeClassName="active" className="button" to="/collections/albums"
                             onClick={() => closeMenu()} exact>
                        <span className="material-icons left-side-panel--icon">library_music</span>
                        <span className="left-side-panel--text">Albums</span>
                    </NavLink>
                </li>
                <li className="column">
                    <NavLink activeClassName="active" className="button" to="/" onClick={() => closeMenu()} exact>
                        <span className="material-icons left-side-panel--icon">grid_view</span>
                        <span className="left-side-panel--text">Library</span>
                    </NavLink>
                </li>
                <li className="column">
                    <NavLink activeClassName="active" className="button" to="/discover" onClick={() => closeMenu()} exact>
                        <span className="material-icons left-side-panel--icon">manage_search</span>
                        <span className="left-side-panel--text">Discover</span>
                    </NavLink>
                </li>
                <li className="column">
                    <NavLink activeClassName="active" className="button" to="/" onClick={() => closeMenu()} exact>
                        <span className="material-icons left-side-panel--icon">queue</span>
                        <span className="left-side-panel--text">Queue</span>
                    </NavLink>
                </li>
            </ul>
        </div>
    )
}

export default Sidebar;