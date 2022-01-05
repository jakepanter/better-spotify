import React, { useEffect, useState } from "react";
import "@szhsin/react-menu/dist/index.css";
import TracksMenu from "./TracksMenu";
import AddToPlaylistsMenu from "./AddToPlaylistsMenu";
import PlaylistMenu from "./PlaylistMenu";

type MenuProps = {
  type: String;
  data: String[];
  positionX: number;
  positionY: number;
}

function ContextMenuWrapper(props: MenuProps) {
  const [anchorPoint, setAnchorPoint] = useState({
    x: props.positionX,
    y: props.positionY,
  });

  useEffect(() => {
    setAnchorPoint({ x: props.positionX, y: props.positionY})
  }, [props.positionX, props.positionY])
  
  if (props.type === "tracks") return <TracksMenu data={props.data} anchorPoint={anchorPoint}/>
  else if (props.type === "addToPlaylist") return <AddToPlaylistsMenu data={props.data} anchorPoint={anchorPoint}/>
  else if (props.type === "playlist") return <PlaylistMenu data={props.data} anchorPoint={anchorPoint}/>
  return null
}

export default ContextMenuWrapper;
