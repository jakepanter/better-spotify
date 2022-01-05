import React, { useEffect } from "react";
// import { API_URL } from "../../utils/constants";
import { ControlledMenu, MenuItem, useMenuState } from "@szhsin/react-menu";
import "./ContextMenu.scss"

type Props = {
    data: String[];
    anchorPoint: { x: number, y: number };
}

function PlaylistMenu(props: Props) {
    const { toggleMenu, ...menuProps } = useMenuState({ transition: true });

    useEffect(() => {
        toggleMenu(true);
    }, []);

    useEffect(() => {
        toggleMenu(true);
    }, [props.anchorPoint]);

    return (
        <ControlledMenu
            {...menuProps}
            anchorPoint={props.anchorPoint}
            onClose={() => toggleMenu(false)}
            >
            <MenuItem>Add to Playlist</MenuItem>
            <MenuItem>Delete</MenuItem>
        </ControlledMenu>
    )
}

export default PlaylistMenu