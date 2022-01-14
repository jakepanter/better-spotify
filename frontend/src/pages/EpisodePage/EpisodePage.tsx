import React from "react";
import {useParams} from "react-router-dom";
import Episode from "../../components/Episode/Episode";

function EpisodePage() {
  //get route params (:albumId)
  let params = useParams() as { id: string };

  return <Episode id={params.id}/>
}

export default EpisodePage;
