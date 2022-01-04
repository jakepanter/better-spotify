import React, { useContext, useEffect, useState } from "react";
import { API_URL } from "../../utils/constants";
import { ControlledMenu, MenuItem, SubMenu, useMenuState } from "@szhsin/react-menu";
import { CurrentUsersProfileResponse, ListOfUsersPlaylistsResponse, PlaylistObjectSimplified } from "spotify-types";
import AppContext from "../../AppContext";

type Props = {
    data: String[];
    anchorPoint: { x: number, y: number };
  }

function TracksMenu(props: Props) {
    const [myPlaylists, setMyPlaylists] = useState<PlaylistObjectSimplified[]>();
    const { toggleMenu, ...menuProps } = useMenuState({ transition: true });
    const state = useContext(AppContext)

    useEffect(() => {
        toggleMenu(true);
        fetchMyPlaylists();
    }, []);

    useEffect(() => {
        toggleMenu(true);
    }, [props.anchorPoint]);

    const fetchMyPlaylists = async () => {
        const playlistsRequest: Promise<ListOfUsersPlaylistsResponse> = fetch(`${API_URL}api/spotify/playlists`)
            .then(async (res) => {
        return await res.json();
        });
        const meRequest: Promise<CurrentUsersProfileResponse> = fetch(
            `${API_URL}api/spotify/me`
        ).then(async (res) => {
        return await res.json();
        });
        Promise.all([playlistsRequest, meRequest]).then(([playlists, me]) => {
        setMyPlaylists(playlists.items.filter((list) => list.owner.id === me.id));
        });
    };

    const addToPlaylist = async (playlistId: String) => {
        state.setContextMenu({ ...state.contextMenu, isOpen: false })

        //HACKY: because props.tracks contains the trackUniqueId[] we have to remove the -id at the end from each track
        const tracks = props.data.map((track) => track.split("-")[0]);
        await fetch(
            `${API_URL}api/spotify/playlist/${playlistId}/add`,
            { 
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(tracks)
            }
        );
    };
  
    return (
        <ControlledMenu
            {...menuProps}
            anchorPoint={props.anchorPoint}
            onClose={() => toggleMenu(false)}
            >
            <MenuItem>Add to Queue</MenuItem>
            <SubMenu label={"Add to Playlist"}>
                {myPlaylists ? (
                myPlaylists.map((list) => (
                    <MenuItem
                    key={list.id}
                    onClick={() => {
                        addToPlaylist(list.id);
                    }}
                    >
                    {list.name}
                    </MenuItem>
                ))
                ) : (
                <MenuItem>Fetching Playlists...</MenuItem>
                )}
            </SubMenu>
            <MenuItem>Show Artist</MenuItem>
            <MenuItem>Show Album</MenuItem>
            <MenuItem>Download</MenuItem>
            <MenuItem>Like</MenuItem>
        </ControlledMenu>
    )
}

export default TracksMenu