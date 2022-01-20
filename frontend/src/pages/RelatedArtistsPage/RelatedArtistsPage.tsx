import React from "react";
import {useParams} from "react-router-dom";
import RelatedArtists from "../../components/RelatedArtists/RelatedArtists";

function RelatedArtistsPage() {
    //get route params
    let params = useParams() as { id: string };

    return <RelatedArtists id={params.id} />
}

export default RelatedArtistsPage;

