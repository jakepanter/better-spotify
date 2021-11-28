import React, {Component} from 'react';
import './Dashboard.scss';
import GridLayout, {Layout} from 'react-grid-layout';

export interface DashboardProps {
  components: ReadonlyArray<DashboardItem>;
  editable: boolean;
}

export interface DashboardItem extends Layout {
  //i: string;
  //x: number;
  //y: number;
  //w: number;
  //h: number;
  type: DasboardItemType;
}

export type DasboardItemType = 'player' | 'playlists' | 'queue' | 'friendActivity' | 'chart' | 'releases' | 'recentlyPlayed' | 'podcasts' | 'followedArtists' | 'albums' | 'playlist' | 'radio' | 'lyrics' | 'audiobook' | 'favorites' | 'search' | 'sidebar';

export interface IDashboardPlayer extends DashboardItem {
  type: 'player';
}

export interface IDashboardPlaylists extends DashboardItem {
  type: 'playlists';
}

export interface IDashboardQueue extends DashboardItem {
  type: 'queue';
}

export interface IDashboardFriendActivity extends DashboardItem {
  type: 'friendActivity';
}

interface IState {
  layout: Layout[];
  editable: boolean;
}

class Dashboard extends Component<DashboardProps, IState> {
  constructor(props: DashboardProps) {
    super(props);

    this.state = {
      layout: [
        {i: 'a', x: 0, y: 0, w: 1, h: 2, static: true},
        {i: 'b', x: 1, y: 0, w: 2, h: 2, minW: 2, maxW: 2},
        {i: 'c', x: 0, y: 2, w: 1, h: 2}
      ],
      editable: props.editable,
    };
  }

  saveLayout(newLayout: Layout[]) {
    console.log(newLayout);
    this.setState((state) => ({...state, layout: newLayout}));
  }

  render() {
    console.log(this.props.children);
    const { layout, editable } = this.state;

    return <GridLayout
      className={'Dashboard'}
      layout={layout}
      cols={2}
      rowHeight={100}
      isResizable={editable}
      isDraggable={editable}
      width={document.body.clientWidth}
      onDragStop={(e) => this.saveLayout(e)}
    >
      <div key="a" className={'DashboardItem'}>a</div>
      <div key="b" className={'DashboardItem'}>b</div>
      <div key="c" className={'DashboardItem'}>c</div>

    </GridLayout>;
  }
}

export default Dashboard;
