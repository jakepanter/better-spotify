import React, { Component } from 'react';
import { DashboardItem } from '../DashboardAvailableComponents';

interface IProps extends DashboardItem {
  code: string;
}

interface IState {}

class DashboardPlaylistComponent extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
  }

  render() {
    const { key, code } = this.props;
    return <div key={key} className={'dashboard-item'}>Playlist {code}</div>;
  }
}

export default DashboardPlaylistComponent;
