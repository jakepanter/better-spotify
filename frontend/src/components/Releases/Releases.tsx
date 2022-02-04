import React, { useEffect, useState } from "react";
import { ListOfNewReleasesResponse, AlbumObjectSimplified } from "spotify-types";
import { API_URL } from "../../utils/constants";
import "./Releases.scss";
import { formatTimeDiff } from "../../utils/functions";
import { getAuthHeader } from "../../helpers/api-helpers";
import Card from "../Card/Card";

const limit = 24;

export default function Releases() {
  // The list of releases (albums)
  const [releases, setReleases] = useState<ListOfNewReleasesResponse>();
  // The list of releases (albums)
  const [albums, setAlbums] = useState<AlbumObjectSimplified[]>([]);
  const [offset, setOffset] = useState<number>(0);

  // Fetch more album tracks if necessary
  useEffect(() => {
    fetchTrackData(offset);
  }, [offset]);

  async function fetchTrackData(offset: number) {
    const authHeader = getAuthHeader();
    //get users country
    const country = localStorage.getItem("country");
    const data: ListOfNewReleasesResponse = await fetch(
      `${API_URL}api/spotify/browse/new-releases?limit=${limit}&country=${country}&offset=${offset}`,
      {
        headers: {
          Authorization: authHeader,
        },
      }
    ).then((res) => res.json());
    setReleases(data);
    // Save new tracks
    const arr: AlbumObjectSimplified[] = [...albums, ...data.albums.items];
    setAlbums(arr);
  }

  const handleRightClick = () => {
    console.log("clicked");
  };

  //fetch next albums when you reach the bottom of the current list
  const onScroll = (e: any) => {
    const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (bottom && releases && offset !== releases.albums.total) {
      const limit = releases.albums.limit;
      const offset = Number(releases.albums.offset) + Number(limit);
      setOffset(offset);
    }
  };

  if (!releases || !albums) return <p>loading...</p>;
  const releasedAlbums = albums.map((album) => {
    return (
      <Card
        key={album.id}
        item={album.id}
        linkTo={`/album/${album.id}`}
        imageUrl={album.images.length > 0 ? album.images[0].url : ""}
        title={album.name}
        subtitle={album.artists}
        subsubtitle={formatTimeDiff(new Date(album.release_date).getTime(), Date.now())}
        handleRightClick={handleRightClick}
      />
    );
  });

  return (
    <div className={"Releases"}>
      <div className={"Content"} onScroll={onScroll}>
        <div className={"CoverList"}>{releasedAlbums}</div>
      </div>
    </div>
  );
}
