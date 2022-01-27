import React, { Component } from 'react';
import Slider from "rc-slider";
import {API_URL} from "../../utils/constants";
import { getAuthHeader } from '../../helpers/api-helpers';

interface IProps {}

interface IState {
    volume: number,
    volumeBeforeMuted: number
}

class Volume extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            volume: 100,
            volumeBeforeMuted: 100
        };

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange = (value: number) => {
        this.setVolume(value);
        this.setState({ volume: value })
    }

    handleMute = () => {
        if (this.state.volume > 0) {
            this.setVolume(0);
            this.setState({
                volumeBeforeMuted: this.state.volume,
                volume: 0,
            })
        } else {
            this.setVolume(this.state.volumeBeforeMuted);
            this.setState({
                volume: this.state.volumeBeforeMuted
            })
        }
    }

    setVolume = (value: number) => {
        const authHeader = getAuthHeader();
        return fetch(`${API_URL}api/spotify/volume?volume=${value}`, {
            method: 'PUT',
            headers: {
                'Authorization': authHeader
            }});
    }

    render() {

        const volumeIcon = this.state.volume > 0
            ? <span className={'material-icons'}>volume_up</span>
            : <span className={'material-icons'}>volume_off</span>;

        return (
            <>
                <button className={'settings-button'} onClick={this.handleMute}>
                    {volumeIcon}
                </button>
                <Slider className={'volume-slider'}
                        min={0}
                        max={100}
                        step={2}
                        value={this.state.volume}
                        onChange={this.handleChange}
                />
            </>
        );
    }
}

export default Volume;
