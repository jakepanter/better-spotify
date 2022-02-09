import React, { useEffect, useState } from "react";
import { ArtistsAlbumsResponse, AlbumObjectSimplified } from "spotify-types";
import { API_URL } from "../../utils/constants";
import Album from "../Album/Album";
import { getAuthHeader } from "../../helpers/api-helpers";
import "./Discography.scss";

// The fetching limit, can be adjusted by changing this value
const limit = 5;

interface IProps {
  id: string;
}

export default function Discography(props: IProps) {
  const { id } = props;
  const [albums, setAlbums] = useState<ArtistsAlbumsResponse>();
  const [albumItems, setAlbumItems] = useState<AlbumObjectSimplified[]>([]);
  const [nextAlbumURL, setNextAlbumURL] = useState<string>(
    `${API_URL}api/spotify/artist/${id}/albums?country=${localStorage.getItem(
      "country"
    )}&limit=${limit}&include_groups=album,single`
  );

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

  if (!albums && !albumItems) return <p>loading...</p>;

  const allAlbums = albumItems.map((album, index) => {
    return <Album id={album.id} headerStyle={"full"} multipleAlbums={index} key={album.id} />;
  });

  const onScroll = (e: any) => {
    const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (bottom && albums && albums.next !== null) {
      const limit = albums.limit;
      const offset = albums.offset + limit;
      const url = `${API_URL}api/spotify/artist/${id}/albums?country="DE"&offset=${offset}&limit=${limit}&market=DE&include_groups=album,single`;
      setNextAlbumURL(url);
    }
  };

  // when the value of nextAlbumURL changes, call fetchAlbums(nextAlbumURL)
  useEffect(() => {
    fetchAlbums(nextAlbumURL);
  }, [nextAlbumURL]);

  return (
    <div className={"Discography"}>
      <h2 className="Header">Discography</h2>
      <div className="Content" onScroll={onScroll}>
        {allAlbums}
      </div>
    </div>
  );
}
