import React, { Component } from 'react';
import { ChartPeriod, ChartType, CountryCode, getChatCode } from '../DashboardAvailableComponents';
import { DashboardItem } from '../DashboardAvailableComponents';

interface IProps extends DashboardItem {
  countryCode: CountryCode;
  type: ChartType;
  period: ChartPeriod;
}

interface IState {}

class DashboardChartComponent extends Component<IProps, IState> {
  private playlistCode: string;

  constructor(props: IProps) {
    super(props);

    this.playlistCode = getChatCode(this.props.countryCode, this.props.type, this.props.period);
  }

  render() {
    const { key } = this.props;
    return <div key={key} className={'dashboard-item'}>Chart</div>;
  }
}

export default DashboardChartComponent;
