import React from "react";
import {useParams} from "react-router-dom";
import Album from "../../components/Album/Album";

function AlbumPage() {
  //get route params (:albumId)
  let params = useParams() as { id: string };

  return <Album id={params.id} headerStyle={'full'} />
}

export default AlbumPage;
