import React, { useEffect, useState } from "react";
import { AlbumObjectSimplified, ArtistsAlbumsResponse } from "spotify-types";
import { API_URL } from "../../utils/constants";
import { useParams } from "react-router-dom";
import { getAuthHeader } from "../../helpers/api-helpers";
import Card from "../Card/Card";

let header: string = "Albums";

export default function ArtistAlbums() {
  let params = useParams() as { id: string; type?: string };
  const id = params.id;
  const type = params.type;

  // for displaying correct header on the page
  if (type === "album") {
    header = "Albums";
  } else if (type === "single") {
    header = "Singles";
  } else if (type == "appears_on") {
    header = "Appears On";
  } else {
    header = "Compilations";
  }

  const [albums, setAlbums] = useState<ArtistsAlbumsResponse>();
  const [albumItems, setAlbumItems] = useState<AlbumObjectSimplified[]>([]);
  const [nextAlbumURL, setNextAlbumURL] = useState<string>(
    `${API_URL}api/spotify/artist/${id}/albums?market=${localStorage.getItem(
      "country"
    )}&include_groups=${type}`
  );

  // fetch albums
  async function fetchAlbums(url: string) {
    const authHeader = getAuthHeader();
    const allAlbums: ArtistsAlbumsResponse = await fetch(url, {
      headers: {
        Authorization: authHeader,
      },
    }).then((res) => res.json());
    setAlbums(allAlbums);
    const arr: AlbumObjectSimplified[] = [...albumItems, ...allAlbums.items];
    setAlbumItems(arr);
  }

  const onScrollAlbums = (e: any) => {
    const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (albums && bottom && albums.next !== null) {
      const limit = albums.limit;
      const offset = albums.offset + limit;
      const url = `${API_URL}api/spotify/artist/${id}/albums?market=DE&include_groups=${type}&offset=${offset}&limit=${limit}`;
      setNextAlbumURL(url);
    }
  };

  const handleRightClick = () => {
    console.log("yee");
  };

  const allAlbums = albumItems.map((album, index) => (
    <Card
      key={album.id + index}
      item={album.id}
      linkTo={`/album/${album.id}`}
      imageUrl={album.images[0] !== null ? album.images[0].url : ""}
      title={album.name}
      subtitle={album.artists}
      handleRightClick={handleRightClick}
    />
  ));

  // when the value of nextAlbumURL changes, call fetchAlbums(nextAlbumURL)
  useEffect(() => {
    fetchAlbums(nextAlbumURL);
  }, [nextAlbumURL]);

  return (
    <>
      {albumItems.length > 0 ? (
        <div style={{ overflow: "hidden auto" }}>
          <h2>{header}</h2>
          <div className={"Content"}>
            <ul className={"CoverList"} onScroll={onScrollAlbums}>
              {allAlbums}
            </ul>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
