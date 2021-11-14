import React, {Component} from 'react';
import './TrackList.scss';

interface IProps {
  label?: string;
  icon?: string;
  style?: string;
  onClick?: () => void;
}

interface IState {}

class TrackList extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
  }

  render() {
    return <div>{/*TODO*/}</div>;
  }
}

export default TrackList;
