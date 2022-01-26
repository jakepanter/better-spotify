import React from "react";
import {useParams} from "react-router-dom";
import Show from "../../components/Show/Show";

function ShowPage() {
  //get route params (:showId)
  let params = useParams() as { id: string };

  return <Show id={params.id} key={params.id} headerStyle={'full'} />
}

export default ShowPage;
