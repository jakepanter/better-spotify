import React from "react";
import {useParams} from "react-router-dom";
import TagTracklist from "../../components/TagTracklist/TagTracklist";

function TagTracklistPage() {
  let params = useParams() as { id: string };

  return <TagTracklist id={params.id} headerStyle={'full'}/>;
}

export default TagTracklistPage;
