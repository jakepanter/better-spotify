import React, { Component } from 'react';
// import { API_URL } from '../../utils/constants';
import Slider from "rc-slider";

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
        this.setState({ volume: value })
    }

    handleMute = () => {
        if (this.state.volume > 0) {
            this.setState({
                volumeBeforeMuted: this.state.volume,
                volume: 0,
            })
        } else {
            this.setState({
                volume: this.state.volumeBeforeMuted
            })
        }
    }

    render() {

        const volumeIcon = this.state.volume > 0
            ? <span className={'material-icons'}>volume_up</span>
            : <span className={'material-icons'}>volume_off</span>;

        return (
            <>
                <Slider className={'volume-slider'} min={0} max={100} step={1} value={this.state.volume} onChange={this.handleChange} />
                <button className={'settings-button'} onClick={this.handleMute}>
                    {volumeIcon}
                </button>
            </>
        );
    }
}

export default Volume;
