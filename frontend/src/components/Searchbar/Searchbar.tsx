import React, { Component } from 'react';
import './Searchbar.scss';
import { API_URL } from '../../utils/constants';
import CoverPlaceholder from '../CoverPlaceholder/CoverPlaceholder';
import {Redirect} from 'react-router-dom';
import { getAuthHeader } from '../../helpers/api-helpers';

type Body = {
  context_uri: string | undefined,
  position_ms: number | undefined,
  offset?: {
    uri: string | undefined
  }
};

interface IProps {}

interface IState {
  redirect: boolean;
  value: string;
  results: any[];
}

class Searchbar extends Component<IProps, IState> {  
  constructor(props: IProps) {
    super(props);

    this.state = {
      redirect: false,
      value: '',
      results: [],
    };

    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.playSong = this.playSong.bind(this);
  }

  async handleKeyUp(e: any) {
    const value = e.target.value;
    const key = e.which;

    var searchbarResults = document.getElementById("SearchbarResultsID");
    if(searchbarResults != null)
      searchbarResults.style.display = 'block';

    this.setState((state) => ({...state, value: value}));

    if (key === 13 && value.trim() != '') {
      this.setState((state) => ({...state, value: value, redirect: true}));
    }
    else {
      this.setState((state) => ({...state, value: value, redirect: false}));
    }

    // Don't search if same input or no value
    if (this.state.value.trim() === value.trim()) return;

    if (value === '') {
      this.setState({value: '', results: []});
      return;
    }

    // Fetch results
    const authHeader = getAuthHeader();
    const data = await fetch(`${API_URL}api/spotify/searchtracks?query=${value}`, {
      headers: {
        'Authorization': authHeader
      }
    }).then(res => res.json());

    // Save to state
    this.setState((state) => ({...state, results: data.items}));
  }

  async playSong(id: string, context: string) {
    console.log(id, context);
    const body: Body = {
      context_uri: "spotify:album:" + context,
      position_ms: 0
    }
    body.offset = {
      uri: id
    }

    const authHeader = getAuthHeader();
    fetch(`${API_URL}api/spotify/me/player/play`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      body: JSON.stringify(body)
    }).then(response => response.json());
  }

  render() {
    const { redirect } = this.state;
    const autofill = this.state.results.map((track) =>
      <li key={track.uri} data-id={track.uri} className={'SearchbarResultItem'} onClick={() => this.playSong(track.uri, track.album?.id)}>
      {track.album !== undefined 
        ? <img height={32} width={32} src={track.album.images[2].url} alt={'Album Cover'} />
        : <CoverPlaceholder />
      }
        <span>{`${track.name} by ${track.artists[0].name}`}</span>
      </li>
    );

    if(redirect == true) {
      return (
        <div className={'Searchbar'}>
          <span className={'material-icons search-icon'}>search</span>
          <input className={'SearchbarInput'} type={'search'} placeholder={'Artist, Albums, Songs ...'} onKeyUp={this.handleKeyUp} />
        <Redirect to={`/search/${this.state.value}`}/>
        </div>
      );
    } 
    else {
      return (
        <div className={'Searchbar'}>
          <span className={'material-icons search-icon'}>search</span>
          <input className={'SearchbarInput'} type={'search'} placeholder={'Artist, Albums, Songs ...'} onKeyUp={this.handleKeyUp} />
          {this.state.results.length > 0 
            ?   
              <ul className={'SearchbarResults'}>
                  {autofill}
              </ul>
          : ''}
        </div>
      )   
    }
  }
}

export default Searchbar;
