import React, { useContext, useEffect, useState } from "react";
import "@szhsin/react-menu/dist/index.css";
import AppContext from "../../AppContext";
import TracksMenu from "./TracksMenu";
import AddToPlaylistsMenu from "./AddToPlaylistsMenu";
import PlaylistMenu from "./PlaylistMenu";
import PlaylistsMenu from "./PlaylistsMenu";
import AlbumsMenu from "./AlbumsMenu";
import PlaylistTracksMenu from "./PlaylistTracksMenu";

type MenuProps = {
  type: String;
  data: any;
  positionX: number;
  positionY: number;
};

function ContextMenuWrapper(props: MenuProps) {
  const [anchorPoint, setAnchorPoint] = useState({
    x: props.positionX,
    y: props.positionY,
  });
  const state = useContext(AppContext);

  useEffect(() => {
    setAnchorPoint({ x: props.positionX, y: props.positionY });
  }, [props.positionX, props.positionY]);

  if (!state.contextMenu.isOpen) return null;

  if (props.type === "tracklist-album")
    return <TracksMenu data={props.data} anchorPoint={anchorPoint} />;
  else if (props.type === "tracklist-playlist")
    return <PlaylistTracksMenu data={props.data} anchorPoint={anchorPoint} />;
  else if (props.type === "tracklist-saved")
    return <TracksMenu data={props.data} anchorPoint={anchorPoint} />;
  else if (props.type === "tracklist-tags")
    return <TracksMenu data={props.data} anchorPoint={anchorPoint} />;
  else if (props.type === "tracklist-search")
    return <TracksMenu data={props.data} anchorPoint={anchorPoint} />;
  else if (props.type === "tracklist-songhistory")
    return <TracksMenu data={props.data} anchorPoint={anchorPoint} />;
  else if (props.type === "addToPlaylist")
    return <AddToPlaylistsMenu data={props.data} anchorPoint={anchorPoint} />;
  else if (props.type === "playlist")
    return <PlaylistMenu data={props.data} anchorPoint={anchorPoint} />;
  else if (props.type === "playlists")
    return <PlaylistsMenu data={props.data} anchorPoint={anchorPoint} />;
  else if (props.type === "albums")
    return <AlbumsMenu data={props.data} anchorPoint={anchorPoint} />;
  return null;
}

export default ContextMenuWrapper;
