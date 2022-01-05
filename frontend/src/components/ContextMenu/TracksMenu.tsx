import React, { useContext, useEffect } from "react";
import { API_URL } from "../../utils/constants";
import { ControlledMenu, MenuItem, SubMenu, useMenuState } from "@szhsin/react-menu";
import { CurrentUsersProfileResponse, ListOfUsersPlaylistsResponse } from "spotify-types";
import AppContext from "../../AppContext";
import useSWR from "swr";
import "./ContextMenu.scss"

type Props = {
    data: String[];
    anchorPoint: { x: number, y: number };
}

const fetcher = (url: any) => fetch(url).then(r => r.json())

function TracksMenu(props: Props) {
    const { toggleMenu, ...menuProps } = useMenuState({ transition: true });
    const state = useContext(AppContext)

    const { data: playlists , error: playlistsError } = useSWR<ListOfUsersPlaylistsResponse>(`${API_URL}api/spotify/playlists`, fetcher);
    const { data: me , error: meError } = useSWR<CurrentUsersProfileResponse>(`${API_URL}api/spotify/me`, fetcher);

    useEffect(() => {
        toggleMenu(true);
    }, []);

    useEffect(() => {
        toggleMenu(true);
    }, [props.anchorPoint]);

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

    if(playlistsError || meError) return <p>error</p>
  
    return (
        <ControlledMenu
            {...menuProps}
            anchorPoint={props.anchorPoint}
            onClose={() => toggleMenu(false)}
            >
            <MenuItem>Add to Queue</MenuItem>
            <SubMenu label={"Add to Playlist"}>
                {playlists && me ? (
                playlists.items
                .filter((list) => list.owner.id === me.id)
                .map((list) => (
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