import React, { Component } from 'react';
import './Searchbar.scss';
import { API_URL } from '../../utils/constants';
import CoverPlaceholder from '../CoverPlaceholder/CoverPlaceholder';

interface IProps {}

interface IState {
  value: string;
  results: any[];
}

class Searchbar extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      value: '',
      results: [],
    };

    this.handleKeyUp = this.handleKeyUp.bind(this);
  }

  async handleKeyUp(e: any) {
    const value = e.target.value;
    const key = e.which;

    this.setState((state) => ({...state, value: value}));

    if (key === 13) {
      // Perform proper search
      // TODO
      alert(this.state.value);
    }

    // Don't search if same input or no value
    if (this.state.value.trim() === value.trim()) return;

    if (value === '') {
      this.setState({value: '', results: []});
      return;
    }

    // Fetch results
    const data = await fetch(`${API_URL}api/spotify/search?query=${value}`).then(res => res.json());

    // Save to state
    this.setState((state) => ({...state, results: data.items}));
  }

  search() {
    // TODO
    alert(this.state.value);
  }

  render() {
    const autofill = this.state.results.map((track) =>
      <li key={track.uri} className={'SearchbarResultItem'}>
      {track.album !== undefined 
        ? <img height={32} width={32} src={track.album.images[2].url} alt={'Album Cover'} />
        : <CoverPlaceholder />
      }
        <span>{`${track.name} by ${track.artists[0].name}`}</span>
      </li>
    );

    return (
      <div className={'Searchbar'}>
        <span className={'material-icons search-icon'}>search</span>
        <input className={'SearchbarInput'} type={'search'} placeholder={'Artist, Albums, Songs ...'} onKeyUp={this.handleKeyUp} />
        {this.state.results.length > 0
        ? <ul className={'SearchbarResults'}>
              {autofill}
            </ul>
        : ''}

      </div>
    );
  }
}

export default Searchbar;
