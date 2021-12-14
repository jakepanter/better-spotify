import React from "react";
import {useParams} from "react-router-dom";
import Playlist from "../../components/Playlist/Playlist";

function PlaylistPage() {
  //get route params (:playlistId)
  let params = useParams() as { id: string };

  return <Playlist id={params.id} />
}

export default PlaylistPage;
