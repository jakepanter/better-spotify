import React, { useRef, useState } from "react";
import "./Searchbar.scss";
import { API_URL } from "../../utils/constants";
import CoverPlaceholder from "../CoverPlaceholder/CoverPlaceholder";
import { getAuthHeader } from "../../helpers/api-helpers";
import { TrackObjectFull } from "spotify-types";
import useOutsideClick from "../../helpers/useOutsideClick";
import { useHistory } from "react-router-dom";

type Body = {
  context_uri: string | undefined;
  position_ms: number | undefined;
  offset?: {
    uri: string | undefined;
  };
};

function Searchbar() {
  const [value, setValue] = useState<string>("");
  const [result, setResult] = useState<TrackObjectFull[]>([]);
  const [showResults, setShowResults] = useState<boolean>(false);

  const history = useHistory();

  const ref = useRef<any>(null);
  useOutsideClick(ref, () => {
    setShowResults(false);
  });

  const focus = () => {
    if (value) setShowResults(true);
  };

  const handleKeyUp = async (e: any) => {
    const newValue = e.target.value;
    const key = e.which;

    const searchbarResults = document.getElementById("SearchbarResultsID");
    if (searchbarResults != null) searchbarResults.style.display = "block";

    setValue(newValue);

    if (key === 13 && newValue.trim() != "") {
      setValue(newValue);
      setShowResults(false);
      history.push(`/search/${value}`);
    } else {
      setValue(newValue);
    }

    // Don't search if same input or no value
    if (newValue.trim() === value.trim()) return;

    if (newValue === "") {
      setValue("");
      setResult([]);
      return;
    }

    // Fetch results
    const authHeader = getAuthHeader();
    const data = await fetch(`${API_URL}api/spotify/searchtracks?query=${newValue}`, {
      headers: {
        Authorization: authHeader,
      },
    }).then((res) => res.json());

    // Save to state
    setShowResults(true);
    setResult(data.items);
  };

  const playSong = async (id: string, context: string) => {
    setShowResults(false);
    const body: Body = {
      context_uri: "spotify:album:" + context,
      position_ms: 0,
    };
    body.offset = {
      uri: id,
    };

    const authHeader = getAuthHeader();
    fetch(`${API_URL}api/spotify/me/player/play`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      body: JSON.stringify(body),
    }).then((response) => response.json());
  };

  const autofill = result.map((track) => (
    <li
      key={track.uri}
      data-id={track.uri}
      className={"SearchbarResultItem"}
      onClick={() => playSong(track.uri, track.album?.id)}
    >
      {track.album !== undefined ? (
        <img height={32} width={32} src={track.album.images[2].url} alt={"Album Cover"} />
      ) : (
        <CoverPlaceholder />
      )}
      <span>{`${track.name} by ${track.artists[0].name}`}</span>
    </li>
  ));

  return (
    <>
      <div className={"Searchbar"} ref={ref}>
        <span className={"material-icons search-icon"}>search</span>
        <input
          className={"SearchbarInput"}
          type={"search"}
          placeholder={"Artist, Albums, Songs ..."}
          onKeyUp={handleKeyUp}
          onFocus={focus}
        />
        {result.length > 0 && showResults ? (
          <ul className={"SearchbarResults"}>
            <li className="SearchInfo">
              <span>Press Enter to get more detailed results</span>
              <span className="material-icons">keyboard_return</span>
            </li>
            {autofill}
          </ul>
        ) : (
          ""
        )}
      </div>
    </>
  );
}

export default Searchbar;
