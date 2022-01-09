import React from "react";
import Discography from "../../components/Discography/Discography";
import {useParams} from "react-router";



function DiscographyPage() {
    //get route params (:albumId)
    let params = useParams() as { id: string };

    return <Discography id={params.id} />
}

export default DiscographyPage;
