import React from "react";
import {useParams} from "react-router-dom";
import Artist from "../../components/Artist/Artist";

function ArtistPage() {
    //get route params (:albumId)
    let params = useParams() as { id: string };

    return <Artist id={params.id} key={params.id}/>
}

export default ArtistPage;
