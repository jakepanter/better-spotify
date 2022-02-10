import React, {ChangeEvent, Component} from 'react';
import {Link} from "react-router-dom";
import './Dashboard.scss';
import {Layout, Layouts, Responsive, WidthProvider} from 'react-grid-layout';
import SavedTracks from "../SavedTracks/SavedTracks";
import Checkbox from "../Checkbox/Checkbox";
import Album from "../Album/Album";
import Playlist from "../Playlist/Playlist";
import Albums from "../Albums/Albums";
import Playlists from "../Playlists/Playlists";
import TagTracklist from "../TagTracklist/TagTracklist";
import TagsSystem from "../../utils/tags-system";
import {NotificationsService} from "../NotificationService/NotificationsService";

const ResponsiveGridLayout = WidthProvider(Responsive);

export interface DashboardItem {}

export interface IDashboardPlaylist extends DashboardItem {
  id: string;
}

export interface IDashboardAlbum extends DashboardItem {
  id: string;
}

export interface IDashboardChart extends DashboardItem {
  countryCode: CountryCode;
  chartType: ChartType;
  period: ChartPeriod;
}

export interface IDashboardTagTracklist extends DashboardItem {
  id: string;
}

interface IProps {
  editable: boolean;
}

interface IState {
  layouts: Layouts;
  playlists: IDashboardPlaylist[];
  albums: IDashboardAlbum[];
  charts: IDashboardChart[];
  tagTracklists: IDashboardTagTracklist[];
  showFavorites: boolean;
  showAlbums: boolean;
  showPlaylists: boolean;
  chartSelection: {
    countryCode: CountryCode,
    type: ChartType,
    period: ChartPeriod,
  };
  tagTracklistsSelection: string;
  width: number;
}

/**
 * A service with methods to add elements to the start page
 */
export class DashboardService {
  // Album methods
  static addAlbum(id: string) {
    const currentDashboard = DashboardService.getCurrentDashboardState();
    if (!currentDashboard.albums.some((a) => a.id === id)) {
      currentDashboard.albums.push({id: id});
      DashboardService.saveCurrentDashboardState(currentDashboard);

      NotificationsService.push('success', 'Added album to start page');
    }
  }

  static removeAlbum(id: string) {
    const currentDashboard = DashboardService.getCurrentDashboardState();
    const newAlbums = currentDashboard.albums.filter((a) => a.id !== id);
    DashboardService.saveCurrentDashboardState({...currentDashboard, albums: newAlbums});

    if (currentDashboard.albums.length !== newAlbums.length) {
      NotificationsService.push('success', 'Removed album from start page');
    }
  }

  static containsAlbum(id: string) {
    const currentDashboard = DashboardService.getCurrentDashboardState();
    return currentDashboard.albums.some((a) => a.id === id);
  }

  // Playlist methods
  static addPlaylist(id: string) {
    const currentDashboard = DashboardService.getCurrentDashboardState();
    if (!currentDashboard.playlists.some((a) => a.id === id)) {
      currentDashboard.playlists.push({id: id});
      DashboardService.saveCurrentDashboardState(currentDashboard);

      NotificationsService.push('success', 'Added playlist to start page');
    }
  }

  static removePlaylist(id: string) {
    const currentDashboard = DashboardService.getCurrentDashboardState();
    const newPlaylists = currentDashboard.playlists.filter((p) => p.id !== id);
    DashboardService.saveCurrentDashboardState({...currentDashboard, playlists: newPlaylists});

    if (currentDashboard.playlists.length !== newPlaylists.length) {
      NotificationsService.push('success', 'Removed playlist from start page');
    }
  }

  static containsPlaylist(id: string) {
    const currentDashboard = DashboardService.getCurrentDashboardState();
    return currentDashboard.playlists.some((p) => p.id === id);
  }

  // TagTracklists methods
  static removeTagTracklist(id: string) {
    const currentDashboard = DashboardService.getCurrentDashboardState();
    const newTagTracklists = currentDashboard.tagTracklists.filter((p) => p.id !== id);
    DashboardService.saveCurrentDashboardState({...currentDashboard, tagTracklists: newTagTracklists});

    if (currentDashboard.tagTracklists.length !== newTagTracklists.length) {
      NotificationsService.push('success', 'Removed tag tracklist from start page');
    }
  }

  // Helper methods
  static getCurrentDashboardState() {
    const currentDashboardString = localStorage.getItem('dashboardState')?.toString();
    if (currentDashboardString !== undefined) {
      return JSON.parse(currentDashboardString) as IState;
    }
    return DEFAULT_DASHBOARD_STATE;
  }

  private static saveCurrentDashboardState(dashboard: IState) {
    localStorage.setItem('dashboardState', JSON.stringify(dashboard));
  }
}

const DEFAULT_DASHBOARD_STATE: IState = {
  "layouts":
    {"md":[
      {"w":1,"h":2,"x":0,"y":0,"i":"albums","moved":false,"static":false},
      {"w":1,"h":2,"x":0,"y":2,"i":"playlists","moved":false,"static":false},
      {"w":1,"h":2,"x":1,"y":0,"i":"top-daily-global","moved":false,"static":false},
      {"w":1,"h":2,"x":1,"y":2,"i":"top-daily-DE","moved":false,"static":false}
    ],
    "xl":[
      {"w":2,"h":2,"x":2,"y":0,"i":"top-daily-de","moved":false,"static":false},
      {"w":2,"h":2,"x":0,"y":2,"i":"albums","moved":false,"static":false},
      {"w":2,"h":2,"x":0,"y":0,"i":"playlists","moved":false,"static":false},
      {"w":2,"h":2,"x":2,"y":2,"i":"top-daily-global","moved":false,"static":false}
    ],
    "sm":[
      {"w":1,"h":2,"x":0,"y":0,"i":"albums","moved":false,"static":false},
      {"w":1,"h":2,"x":0,"y":2,"i":"playlists","moved":false,"static":false},
      {"w":1,"h":2,"x":0,"y":4,"i":"top-daily-global","moved":false,"static":false},
      {"w":1,"h":1,"x":0,"y":6,"i":"top-daily-DE","moved":false,"static":false}
    ]},
  "albums":[],
  "playlists":[],
  "charts":[
    {"countryCode":"global","chartType":"top","period":"daily"},
    {"countryCode":"DE","chartType":"top","period":"daily"}
  ],
  "tagTracklists":[],
  "showFavorites":false,
  "showAlbums":true,
  "showPlaylists":true,
  "chartSelection":{"countryCode":"DE","type":"top","period":"daily"},
  "tagTracklistsSelection":"",
  "width":195
};

class Dashboard extends Component<IProps, IState> {
  private readonly containerRef = React.createRef<HTMLDivElement>();

  private pollStorage: any;

  constructor(props: IProps) {
    super(props);

    const storedState = localStorage.getItem('dashboardState')?.toString();
    let state = DEFAULT_DASHBOARD_STATE;
    if (storedState !== undefined) {
      state = JSON.parse(storedState);
    } else {
      localStorage.setItem('dashboardState', JSON.stringify(DEFAULT_DASHBOARD_STATE));
    }
    this.state = state;
  }

  // Albums
  private removeAlbum(id: string) {
    if (!confirm('Do you want to remove this widget?')) return;

    const {albums} = this.state;
    const newAlbums = albums.filter((a) => a.id !== id);
    this.updateAlbums(newAlbums);

    NotificationsService.push('success', 'Removed album from start page');
  }

  private updateAlbums(newAlbums: IDashboardAlbum[]) {
    this.setState(
      (state) => ({...state, albums: newAlbums}),
      () => this.saveState(),
    );
  }

  // Playlists
  private removePlaylist(id: string) {
    if (!confirm('Do you want to remove this widget?')) return;

    const {playlists} = this.state;
    const newPlaylists = playlists.filter((p) => p.id !== id);
    this.updatePlaylists(newPlaylists);

    NotificationsService.push('success', 'Removed playlist from start page');
  }

  private updatePlaylists(newPlaylists: IDashboardPlaylist[]) {
    this.setState(
      (state) => ({...state, playlists: newPlaylists}),
      () => this.saveState(),
    );
  }

  // Charts
  private addChart(countryCode: CountryCode, type: ChartType, period: ChartPeriod) {
    const {charts} = this.state;
    if (!charts.some(
      (c) => c.countryCode === countryCode && c.chartType === type && c.period === period)
        && chartExists(countryCode, type, period)
    ) {
      const newCharts = [...charts, {countryCode: countryCode, chartType: type, period}]
      this.updateCharts(newCharts);

      NotificationsService.push('success', 'Added chart to start page');
    }
  }

  private removeChart(countryCode: CountryCode, type: ChartType, period: ChartPeriod) {
    if (!confirm('Do you want to remove this widget?')) return;

    const {charts} = this.state;
    const newCharts = charts.filter((c) => !(c.countryCode === countryCode && c.chartType === type && c.period === period));
    this.updateCharts(newCharts);

    NotificationsService.push('success', 'Removed chart from start page');
  }

  private updateCharts(newCharts: IDashboardChart[]) {
    this.setState(
      (state) => ({...state, charts: newCharts}),
      () => this.saveState(),
    );
  }

  private addTagTracklist(id: string) {
    const { tagTracklists } = this.state;
    if (!tagTracklists.some((t) => t.id === id)) {
      const newTagTracklists = [...tagTracklists, { id }];
      this.updateTagTracklist(newTagTracklists);

      NotificationsService.push('success', 'Added tag tracklist to start page');
    }
  }

  private removeTagTracklist(id: string) {
    if (!confirm('Do you want to remove this widget?')) return;

    const { tagTracklists } = this.state;
    const newTagTracklists = tagTracklists.filter((t) => t.id !== id);
    this.updateTagTracklist(newTagTracklists);

    NotificationsService.push('success', 'Removed tag tracklist from start page');
  }

  private updateTagTracklist(newTagTracklists: IDashboardTagTracklist[]) {
    this.setState(
      (state) => ({...state, tagTracklists: newTagTracklists}),
      () => this.saveState(),
    )
  }

  // Save Layout
  private saveLayouts(layout: Layout[], layouts: Layouts) {
    this.setState(
      (state) => ({...state, layouts: layouts}),
      () => this.saveState(),
    );
  }

  private saveState() {
    localStorage.setItem('dashboardState', JSON.stringify(this.state));
  }

  // Charts form
  private updateChartSelection(e: ChangeEvent<HTMLSelectElement>, property: 'countryCode' | 'type' | 'period') {
    let newProp: {};
    switch (property) {
      case "countryCode":
        newProp = {countryCode: e.target.value}
        break;
      case "type":
        newProp = {type: e.target.value}
        break;
      case "period":
        newProp = {period: e.target.value}
        break;
    }

    this.setState(
      (state) => ({...state, chartSelection: {...state.chartSelection, ...newProp}}),
      () => this.saveState(),
    );
  }

  // TagTracklists form
  private updateTagTracklistSelection(e: ChangeEvent<HTMLSelectElement>) {
    this.setState(
      (state) => ({...state, tagTracklistsSelection: e.target.value}),
      () => this.saveState(),
    );
  }

  private showFavorites(value: boolean) {
    this.setState(
      (state) => ({...state, showFavorites: value}),
      () => this.saveState(),
    );

    if (value) {
      NotificationsService.push('success', 'Added favorites to start page');
    } else {
      NotificationsService.push('success', 'Removed favorites from start page');
    }
  }

  private showAlbums(value: boolean) {
    this.setState(
      (state) => ({...state, showAlbums: value}),
      () => this.saveState(),
    );

    if (value) {
      NotificationsService.push('success', 'Added albums to start page');
    } else {
      NotificationsService.push('success', 'Removed albums from start page');
    }
  }

  private showPlaylists(value: boolean) {
    this.setState(
      (state) => ({...state, showPlaylists: value}),
      () => this.saveState(),
    );

    if (value) {
      NotificationsService.push('success', 'Added playlists to start page');
    } else {
      NotificationsService.push('success', 'Removed playlists from start page');
    }
  }

  updateWidth = () => {
    const newWidth = this.containerRef.current?.clientWidth ?? 0;
    this.setState(
      (state) => ({...state, width: newWidth}),
      () => this.saveState(),
    );
  };
  componentDidMount() {
    this.updateWidth();
    // Resize listener
    window.addEventListener('resize', this.updateWidth);

    // Detect updates from DashboardService
    this.pollStorage = setInterval(() => {
      const {albums, playlists} = this.state;
      const savedState = DashboardService.getCurrentDashboardState();
      if (albums.length !== savedState.albums.length || playlists.length !== savedState.playlists.length) {
        this.setState((state) => ({...state, albums: savedState.albums, playlists: savedState.playlists}));
      }
    }, 50);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWidth);
    clearInterval(this.pollStorage);
  }

  // Render
  render() {
    const {
      layouts,
      albums,
      playlists,
      charts,
      tagTracklists,
      showFavorites,
      showAlbums,
      showPlaylists,
      chartSelection,
      tagTracklistsSelection,
      width,
    } = this.state;
    const { editable } = this.props;
    const tags = TagsSystem.getTags();

    const tagSelection = tagTracklistsSelection === '' ? (Object.keys(tags.availableTags).length === 0 ? '' : Object.entries(tags.availableTags)[0][0]) : tagTracklistsSelection;

    return (
      <div className={`DashboardContainer ${editable ? 'editable' : ''}`} ref={this.containerRef}>
        {editable ?
          <div className={'DashboardConfigurator'}>
            <h3>Customize startpage</h3>
            <p className={"infoCustomizeStartpage"}><span className="material-icons">info</span>Hover over the panels to move them according to your needs. The size of the panels can be changed in the lower right corner of each panel.</p>
            <div className={"DashboardCustomizeGrid"}>
              <div className={`${tagSelection.length === 0 ? "noTagAvailable" : ""} DashboardTagTracklistsForm`}>
                <h4>tag panels</h4>
                <p className={"addTagNote"}>Please <Link to="/settings">add a tag</Link> first</p>
                <div className={"DashboardTagTracklistsFormSelects"}>
                  <select
                    className={'input-select'}
                    value={tagSelection}
                    onChange={(e) => this.updateTagTracklistSelection(e)}
                  >
                    {Object.entries(tags.availableTags).map((t) => <option key={t[0]} value={t[0]}>{t[1].title}</option>)}
                  </select>
                </div>
                <div className={'DashboardTagTracklistsFormButtons'}>
                  <button
                    className={'button'}
                    disabled={tagSelection === ''}
                    onClick={() => this.addTagTracklist(tagSelection)}
                  >
                    Add Tag Tracklist
                  </button>
                  <button
                    className={'button'}
                    disabled={tagSelection === ''}
                    onClick={() => this.removeTagTracklist(tagSelection)}
                  >
                    Remove Tag Tracklist
                  </button>
                </div>
              </div>
              <div className={'DashboardChartsForm'}>
                <h4>chart panels</h4>
                <div className={'DashboardChartsFormSelects'}>
                  <select
                    className={'DashboardChartsCountryCode input-select'}
                    value={chartSelection.countryCode}
                    onChange={(e) => this.updateChartSelection(e, 'countryCode')}
                  >
                    {ALL_COUNTRY_CODES.map((code) => <option key={code} value={code}>{code}</option>)}
                  </select>
                  <select
                    className={'DashboardChartsType input-select'}
                    value={chartSelection.type}
                    onChange={(e) => this.updateChartSelection(e, 'type')}
                  >
                    {ALL_CHART_TYPES.map((code) => <option key={code} value={code}>{code}</option>)}
                  </select>
                  <select
                    className={'DashboardChartsPeriod input-select'}
                    value={chartSelection.period}
                    onChange={(e) => this.updateChartSelection(e, 'period')}
                  >
                    {ALL_CHART_PERIODS.map((code) => <option key={code} value={code}>{code}</option>)}
                  </select>
                </div>
                <div className={'DashboardChartsFormButtons'}>
                  <button
                    className={'button'}
                    disabled={!chartExists(chartSelection.countryCode, chartSelection.type, chartSelection.period)}
                    onClick={() => this.addChart(chartSelection.countryCode, chartSelection.type, chartSelection.period)}
                  >
                    Add Chart
                  </button>
                  <button
                    className={'button'}
                    disabled={!chartExists(chartSelection.countryCode, chartSelection.type, chartSelection.period)}
                    onClick={() => this.removeChart(chartSelection.countryCode, chartSelection.type, chartSelection.period)}
                  >
                    Remove Chart
                  </button>
                </div>
              </div>
              <div className={'DashboardSettingsForm'}>
                <h4>personal panels</h4>
                <Checkbox
                  checked={showFavorites}
                  label={'Show liked songs'}
                  onChange={(value) => this.showFavorites(value)}
                />
                <Checkbox
                  checked={showPlaylists}
                  label={'Show Playlists'}
                  onChange={(value) => this.showPlaylists(value)}
                />
                <Checkbox
                    checked={showAlbums}
                    label={'Show Albums'}
                    onChange={(value) => this.showAlbums(value)}
                />
              </div>
            </div>
          </div>
          : <></>
        }
        <ResponsiveGridLayout
          className={`Dashboard ${editable ? 'editable' : ''}`}
          layouts={layouts}
          breakpoints={{xl: 1600, md: 768, sm: 0}}
          cols={{xl: 4, md: 2, sm: 1}}
          rowHeight={400}
          isResizable={editable}
          isDraggable={editable}
          width={width}
          onLayoutChange={(layout, layouts) =>
            this.saveLayouts(layout, layouts)
          }
        >
          {showFavorites ?
            <div key={'favorites'} className={'DashboardItem'}>
              <button className={'RemoveButton'} onClick={() => confirm('Do you want to remove this widget?') ? this.showFavorites(false) : undefined}>
                <span className={'material-icons'}>close</span>
              </button>
              <SavedTracks headerStyle={'compact'}/>
            </div>
            : <></>
          }
          {showAlbums ?
            <div key={'albums'} className={'DashboardItem'}>
              <button className={'RemoveButton'} onClick={() => confirm('Do you want to remove this widget?') ? this.showAlbums(false) : undefined}>
                <span className={'material-icons'}>close</span>
              </button>
              <Albums />
            </div>
            : <></>
          }
          {showPlaylists ?
            <div key={'playlists'} className={'DashboardItem'}>
              <button className={'RemoveButton'} onClick={() => confirm('Do you want to remove this widget?') ? this.showPlaylists(false) : undefined}>
                <span className={'material-icons'}>close</span>
              </button>
              <Playlists />
            </div>
            : <></>
          }
          {albums.map((a) => <div key={a.id} className={'DashboardItem'}>
            <button className={'RemoveButton'} onClick={() => this.removeAlbum(a.id)}>
              <span className={'material-icons'}>close</span>
            </button>
            <Album id={a.id} headerStyle={'compact'}/>
          </div>)}
          {playlists.map((p) => <div key={p.id} className={'DashboardItem'}>
            <button className={'RemoveButton'} onClick={() => this.removePlaylist(p.id)}>
              <span className={'material-icons'}>close</span>
            </button>
            <Playlist id={p.id} headerStyle={'compact'}/>
          </div>)}
          {charts.map((c) => {
            const chartCode = `${c.chartType}-${c.period}-${c.countryCode}`;
            return (
              <div key={chartCode} className={'DashboardItem'}>
                <button className={'RemoveButton'} onClick={() => this.removeChart(c.countryCode, c.chartType, c.period)}>
                  <span className={'material-icons'}>close</span>
                </button>
                <Playlist id={getChartCode(c.countryCode, c.chartType, c.period)} headerStyle={'compact'}/>
              </div>
            );
          })}
          {tagTracklists &&
            tagTracklists.map((t) => (
              <div key={t.id} className={"DashboardItem"}>
                <button className={'RemoveButton'} onClick={() => this.removeTagTracklist(t.id)}>
                  <span className={'material-icons'}>close</span>
                </button>
                <TagTracklist id={t.id} headerStyle={"compact"} />
              </div>
            ))}
        </ResponsiveGridLayout>
      </div>
    );
  }
}

export default Dashboard;


// Chart types
type CountryCode =   'global' | 'EG' | 'AD' | 'AR' | 'AU' | 'BE' | 'BO' | 'BR' | 'BG' | 'CL' | 'CR' | 'DK' | 'DE' | 'DO'
  | 'EC' | 'SV' | 'EE' | 'FI' | 'FR' | 'GR' | 'GT' | 'HN' | 'IN' | 'ID' | 'IE' | 'IS' | 'IL' | 'IT' | 'JP' | 'CA' | 'CO'
  | 'LV' | 'LT' | 'LU' | 'MY' | 'MA' | 'MX' | 'NZ' | 'NI' | 'NL' | 'NO' | 'AT' | 'PA' | 'PY' | 'PE' | 'PH' | 'PL' | 'PT'
  | 'RO' | 'RU' | 'SA' | 'SE' | 'CH' | 'SG' | 'SK' | 'HK' | 'ES' | 'ZA' | 'KR' | 'TW' | 'TH' | 'CZ' | 'TR' | 'UA' | 'HU'
  | 'UY' | 'AE' | 'UK' | 'US' | 'VN' | 'CY';

const ALL_COUNTRY_CODES: ReadonlyArray<CountryCode> = [
  'global', 'EG', 'AD', 'AR', 'AU', 'BE', 'BO', 'BR', 'BG', 'CL', 'CR', 'DK', 'DE', 'DO', 'EC', 'SV', 'EE', 'FI', 'FR',
  'GR', 'GT', 'HN', 'IN', 'ID', 'IE', 'IS', 'IL', 'IT', 'JP', 'CA', 'CO', 'LV', 'LT', 'LU', 'MY', 'MA', 'MX', 'NZ',
  'NI', 'NL', 'NO', 'AT', 'PA', 'PY', 'PE', 'PH', 'PL', 'PT', 'RO', 'RU', 'SA', 'SE', 'CH', 'SG', 'SK', 'HK', 'ES',
  'ZA', 'KR', 'TW', 'TH', 'CZ', 'TR', 'UA', 'HU', 'UY', 'AE', 'UK', 'US', 'VN', 'CY'
];


type ChartType = 'top' | 'viral';

const ALL_CHART_TYPES: ReadonlyArray<ChartType> = ['top', 'viral'];


type ChartPeriod = 'daily' | 'weekly';

const ALL_CHART_PERIODS: ReadonlyArray<ChartPeriod> = ['daily', 'weekly'];


type ChartCode = [CountryCode, ChartType, ChartPeriod, string];

const CHART_CODES: ReadonlyArray<ChartCode> = [
  // Top daily charts
  ['global', 'top', 'daily', '37i9dQZEVXbMDoHDwVN2tF'],

  ['EG', 'top', 'daily', '37i9dQZEVXbLn7RQmT5Xv2'],
  ['AR', 'top', 'daily', '37i9dQZEVXbMMy2roB9myp'],
  ['AU', 'top', 'daily', '37i9dQZEVXbJPcfkRz0wJ0'],

  ['BE', 'top', 'daily', '37i9dQZEVXbJNSeeHswcKB'],
  ['BO', 'top', 'daily', '37i9dQZEVXbJqfMFK4d691'],
  ['BR', 'top', 'daily', '37i9dQZEVXbMXbN3EUUhlg'],
  ['BG', 'top', 'daily', '37i9dQZEVXbNfM2w2mq1B8'],

  ['CL', 'top', 'daily', '37i9dQZEVXbL0GavIqMTeb'],
  ['CR', 'top', 'daily', '37i9dQZEVXbMZAjGMynsQX'],
  ['DK', 'top', 'daily', '37i9dQZEVXbL3J0k32lWnN'],
  ['DE', 'top', 'daily', '37i9dQZEVXbJiZcmkrIHGU'],

  ['DO', 'top', 'daily', '37i9dQZEVXbKAbrMR8uuf7'],
  ['EC', 'top', 'daily', '37i9dQZEVXbJlM6nvL1nD1'],
  ['SV', 'top', 'daily', '37i9dQZEVXbLxoIml4MYkT'],
  ['EE', 'top', 'daily', '37i9dQZEVXbLesry2Qw2xS'],

  ['FI', 'top', 'daily', '37i9dQZEVXbMxcczTSoGwZ'],
  ['FR', 'top', 'daily', '37i9dQZEVXbIPWwFssbupI'],
  ['GR', 'top', 'daily', '37i9dQZEVXbJqdarpmTJDL'],
  ['GT', 'top', 'daily', '37i9dQZEVXbLy5tBFyQvd4'],

  ['HN', 'top', 'daily', '37i9dQZEVXbJp9wcIM9Eo5'],
  ['IN', 'top', 'daily', '37i9dQZEVXbLZ52XmnySJg'],
  ['ID', 'top', 'daily', '37i9dQZEVXbObFQZ3JLcXt'],
  ['IE', 'top', 'daily', '37i9dQZEVXbKM896FDX8L1'],

  ['IS', 'top', 'daily', '37i9dQZEVXbKMzVsSGQ49S'],
  ['IL', 'top', 'daily', '37i9dQZEVXbJ6IpvItkve3'],
  ['IT', 'top', 'daily', '37i9dQZEVXbIQnj7RRhdSX'],
  ['JP', 'top', 'daily', '37i9dQZEVXbKXQ4mDTEBXq'],

  ['CA', 'top', 'daily', '37i9dQZEVXbKj23U1GF4IR'],
  ['CO', 'top', 'daily', '37i9dQZEVXbOa2lmxNORXQ'],
  ['LV', 'top', 'daily', '37i9dQZEVXbJWuzDrTxbKS'],
  ['LT', 'top', 'daily', '37i9dQZEVXbMx56Rdq5lwc'],

  ['LU', 'top', 'daily', '37i9dQZEVXbKGcyg6TFGx6'],
  ['MY', 'top', 'daily', '37i9dQZEVXbJlfUljuZExa'],
  ['MA', 'top', 'daily', '37i9dQZEVXbJU9eQpX8gPT'],
  ['MX', 'top', 'daily', '37i9dQZEVXbO3qyFxbkOE1'],

  ['NZ', 'top', 'daily', '37i9dQZEVXbM8SIrkERIYl'],
  ['NI', 'top', 'daily', '37i9dQZEVXbISk8kxnzfCq'],
  ['NL', 'top', 'daily', '37i9dQZEVXbKCF6dqVpDkS'],
  ['NO', 'top', 'daily', '37i9dQZEVXbJvfa0Yxg7E7'],

  ['AT', 'top', 'daily', '37i9dQZEVXbKNHh6NIXu36'],
  ['PA', 'top', 'daily', '37i9dQZEVXbKypXHVwk1f0'],
  ['PY', 'top', 'daily', '37i9dQZEVXbNOUPGj7tW6T'],
  ['PE', 'top', 'daily', '37i9dQZEVXbJfdy5b0KP7W'],

  ['PH', 'top', 'daily', '37i9dQZEVXbNBz9cRCSFkY'],
  ['PL', 'top', 'daily', '37i9dQZEVXbN6itCcaL3Tt'],
  ['PT', 'top', 'daily', '37i9dQZEVXbKyJS56d1pgi'],
  ['RO', 'top', 'daily', '37i9dQZEVXbNZbJ6TZelCq'],

  ['RU', 'top', 'daily', '37i9dQZEVXbL8l7ra5vVdB'],
  ['SA', 'top', 'daily', '37i9dQZEVXbLrQBcXqUtaC'],
  ['SE', 'top', 'daily', '37i9dQZEVXbLoATJ81JYXz'],
  ['CH', 'top', 'daily', '37i9dQZEVXbJiyhoAPEfMK'],

  ['SG', 'top', 'daily', '37i9dQZEVXbK4gjvS1FjPY'],
  ['SK', 'top', 'daily', '37i9dQZEVXbKIVTPX9a2Sb'],
  ['HK', 'top', 'daily', '37i9dQZEVXbLwpL8TjsxOG'],
  ['ES', 'top', 'daily', '37i9dQZEVXbNFJfN1Vw8d9'],

  ['ZA', 'top', 'daily', '37i9dQZEVXbMH2jvi6jvjk'],
  ['KR', 'top', 'daily', '37i9dQZEVXbNxXF4SkHj9F'],
  ['TW', 'top', 'daily', '37i9dQZEVXbMnZEatlMSiu'],
  ['TH', 'top', 'daily', '37i9dQZEVXbMnz8KIWsvf9'],

  ['CZ', 'top', 'daily', '37i9dQZEVXbIP3c3fqVrJY'],
  ['TR', 'top', 'daily', '37i9dQZEVXbIVYVBNw9D5K'],
  ['UA', 'top', 'daily', '37i9dQZEVXbKkidEfWYRuD'],
  ['HU', 'top', 'daily', '37i9dQZEVXbNHwMxAkvmF8'],

  ['UY', 'top', 'daily', '37i9dQZEVXbMJJi3wgRbAy'],
  ['UA', 'top', 'daily', '37i9dQZEVXbM4UZuIrvHvA'],
  ['UK', 'top', 'daily', '37i9dQZEVXbLnolsZ8PSNw'],
  ['US', 'top', 'daily', '37i9dQZEVXbLRQDuF5jeBp'],

  ['VN', 'top', 'daily', '37i9dQZEVXbLdGSmz6xilI'],

  // Top weekly charts
  ['global', 'top', 'weekly', '37i9dQZEVXbNG2KDcFcKOF'],

  ['EG', 'top', 'weekly', '37i9dQZEVXbMy2EcFg5F9m'],
  ['AR', 'top', 'weekly', '37i9dQZEVXbKPTKrnFPD0G'],
  ['AU', 'top', 'weekly', '37i9dQZEVXbK4fwx2r07XW'],

  ['BE', 'top', 'weekly', '37i9dQZEVXbND4ZYa46PaA'],
  ['BR', 'top', 'weekly', '37i9dQZEVXbKzoK95AbRy9'],

  ['CL', 'top', 'weekly', '37i9dQZEVXbLJ0paT1JkgZ'],
  ['DK', 'top', 'weekly', '37i9dQZEVXbMw2iUtFR5Eq'],
  ['DE', 'top', 'weekly', '37i9dQZEVXbK8BKKMArIyl'],

  ['DO', 'top', 'weekly', '37i9dQZEVXbMPoK06pe7d6'],
  ['EC', 'top', 'weekly', '37i9dQZEVXbJPVQvqZqpcM'],

  ['FI', 'top', 'weekly', '37i9dQZEVXbJQ9kF73GOT2'],
  ['GT', 'top', 'weekly', '37i9dQZEVXbJHSzlHx2ZJU'],

  ['IN', 'top', 'weekly', '37i9dQZEVXbMWDif5SCBJq'],
  ['ID', 'top', 'weekly', '37i9dQZEVXbIZK8aUquyx8'],
  ['IE', 'top', 'weekly', '37i9dQZEVXbJIvhIOxXxdp'],

  ['IL', 'top', 'weekly', '37i9dQZEVXbJ5J1TrbkAF9'],
  ['IT', 'top', 'weekly', '37i9dQZEVXbJUPkgaWZcWG'],
  ['JP', 'top', 'weekly', '37i9dQZEVXbKqiTGXuCOsB'],

  ['CA', 'top', 'weekly', '37i9dQZEVXbMda2apknTqH'],
  ['CO', 'top', 'weekly', '37i9dQZEVXbL1Fl8vdBUba'],

  ['MY', 'top', 'weekly', '37i9dQZEVXbKcS4rq3mEhp'],
  ['MA', 'top', 'weekly', '37i9dQZEVXbNM8vS9cIqAG'],
  ['MX', 'top', 'weekly', '37i9dQZEVXbKUoIkUXteF6'],

  ['NZ', 'top', 'weekly', '37i9dQZEVXbIWlLQoMVEFp'],
  ['NL', 'top', 'weekly', '37i9dQZEVXbK4BFAukDzj3'],
  ['NO', 'top', 'weekly', '37i9dQZEVXbLWYFZ5CkSvr'],

  ['AT', 'top', 'weekly', '37i9dQZEVXbM1EaZ0igDlz'],
  ['PA', 'top', 'weekly', '37i9dQZEVXbNSiWnkYnziz'],
  ['PE', 'top', 'weekly', '37i9dQZEVXbMGcjiWgg253'],

  ['PH', 'top', 'weekly', '37i9dQZEVXbJVKdmjH0pON'],
  ['PL', 'top', 'weekly', '37i9dQZEVXbMZ5PAcNTDXd'],
  ['RO', 'top', 'weekly', '37i9dQZEVXbMeCoUmQDLUW'],

  ['RU', 'top', 'weekly', '37i9dQZEVXbNALwC1jxb5m'],
  ['SA', 'top', 'weekly', '37i9dQZEVXbO839WGRmpu1'],
  ['SE', 'top', 'weekly', '37i9dQZEVXbKVvfnL1Us06'],
  ['CH', 'top', 'weekly', '37i9dQZEVXbKx6qX9uN66j'],

  ['SG', 'top', 'weekly', '37i9dQZEVXbN66FupT0MuX'],
  ['SK', 'top', 'weekly', '37i9dQZEVXbMwW10JmAnzE'],
  ['HK', 'top', 'weekly', '37i9dQZEVXbMdvweCgpBAe'],
  ['ES', 'top', 'weekly', '37i9dQZEVXbJwoKy8qKpHG'],

  ['ZA', 'top', 'weekly', '37i9dQZEVXbJV3H3OfCN1z'],
  ['KR', 'top', 'weekly', '37i9dQZEVXbJZGli0rRP3r'],
  ['TW', 'top', 'weekly', '37i9dQZEVXbMVY2FDHm6NN'],
  ['TH', 'top', 'weekly', '37i9dQZEVXbJ7qiJCES5cj'],

  ['CZ', 'top', 'weekly', '37i9dQZEVXbLKI6MPixefZ'],
  ['TR', 'top', 'weekly', '37i9dQZEVXbJARRcHjHcAr'],
  ['UA', 'top', 'weekly', '37i9dQZEVXbNcoJZ65xktI'],
  ['HU', 'top', 'weekly', '37i9dQZEVXbMYsavqzfk6k'],

  ['UA', 'top', 'weekly', '37i9dQZEVXbIZQf3WEYSut'],
  ['UK', 'top', 'weekly', '37i9dQZEVXbMwmF30ppw50'],
  ['US', 'top', 'weekly', '37i9dQZEVXbLp5XoPON0wI'],

  ['VN', 'top', 'weekly', '37i9dQZEVXbKZyn1mKjmIl'],

  // Viral daily charts
  ['global', 'viral', 'daily', '37i9dQZEVXbLiRSasKsNU9'],

  ['EG', 'viral', 'daily', '37i9dQZEVXbJSvmuZN9Jja'],
  ['AD', 'viral', 'daily', '37i9dQZEVXbMxjQJh4Um8T'],
  ['AR', 'viral', 'daily', '37i9dQZEVXbJajpaXyaKll'],
  ['AU', 'viral', 'daily', '37i9dQZEVXbO5MSE9RdfN2'],

  ['BE', 'viral', 'daily', '37i9dQZEVXbJx9hUtTN0Sj'],
  ['BO', 'viral', 'daily', '37i9dQZEVXbMTKZuy8ORFV'],
  ['BR', 'viral', 'daily', '37i9dQZEVXbMOkSwG072hV'],
  ['BG', 'viral', 'daily', '37i9dQZEVXbJcpVBLdFV7m'],

  ['CL', 'viral', 'daily', '37i9dQZEVXbJs8e2vk15a8'],
  ['CR', 'viral', 'daily', '37i9dQZEVXbKOefHPXPMyf'],
  ['DK', 'viral', 'daily', '37i9dQZEVXbMA8BIYDeMkD'],
  ['DE', 'viral', 'daily', '37i9dQZEVXbNv6cjoMVCyg'],

  ['DO', 'viral', 'daily', '37i9dQZEVXbJWZV7aRNQck'],
  ['EC', 'viral', 'daily', '37i9dQZEVXbJpRQ294oZ9N'],
  ['SV', 'viral', 'daily', '37i9dQZEVXbLo3yC8XJf1e'],
  ['EE', 'viral', 'daily', '37i9dQZEVXbK4KA2JSuft7'],

  ['FI', 'viral', 'daily', '37i9dQZEVXbMBNcyQCfU4w'],
  ['FR', 'viral', 'daily', '37i9dQZEVXbJmRv5TqJW16'],
  ['GR', 'viral', 'daily', '37i9dQZEVXbLOov4J0GutU'],
  ['GT', 'viral', 'daily', '37i9dQZEVXbNF1heNYHDnE'],

  ['HN', 'viral', 'daily', '37i9dQZEVXbNpKdqfZ9Upp'],
  ['IN', 'viral', 'daily', '37i9dQZEVXbK4NvPi6Sxit'],
  ['ID', 'viral', 'daily', '37i9dQZEVXbKpV6RVDTWcZ'],
  ['IE', 'viral', 'daily', '37i9dQZEVXbLzhUVGQUCoe'],

  ['IS', 'viral', 'daily', '37i9dQZEVXbMHnoaLVkVuk'],
  ['IL', 'viral', 'daily', '37i9dQZEVXbNGlbFNNXxgC'],
  ['IT', 'viral', 'daily', '37i9dQZEVXbKbvcwe5owJ1'],
  ['JP', 'viral', 'daily', '37i9dQZEVXbINTEnbFeb8d'],

  ['CA', 'viral', 'daily', '37i9dQZEVXbKfIuOAZrk7G'],
  ['CO', 'viral', 'daily', '37i9dQZEVXbKrooeK9WSFF'],
  ['LV', 'viral', 'daily', '37i9dQZEVXbIUY6VUoboP4'],
  ['LT', 'viral', 'daily', '37i9dQZEVXbLDLOTfCtAUM'],

  ['LU', 'viral', 'daily', '37i9dQZEVXbJ9SRaVj0yDF'],
  ['MY', 'viral', 'daily', '37i9dQZEVXbLRmg3qDbY1H'],
  ['MA', 'viral', 'daily', '37i9dQZEVXbIVezQItttaL'],
  ['MX', 'viral', 'daily', '37i9dQZEVXbLuUZrygauiA'],

  ['NZ', 'viral', 'daily', '37i9dQZEVXbJ7gPAehey5W'],
  ['NI', 'viral', 'daily', '37i9dQZEVXbKgCVIE0PTOD'],
  ['NL', 'viral', 'daily', '37i9dQZEVXbMQaPQjt027d'],
  ['NO', 'viral', 'daily', '37i9dQZEVXbOcsE2WCaJa2'],

  ['AT', 'viral', 'daily', '37i9dQZEVXbKxYYIUIgn7V'],
  ['PA', 'viral', 'daily', '37i9dQZEVXbMIO7B1pcKUy'],
  ['PY', 'viral', 'daily', '37i9dQZEVXbNxY4E5g33Gy'],
  ['PE', 'viral', 'daily', '37i9dQZEVXbN7gfhgaomhA'],

  ['PH', 'viral', 'daily', '37i9dQZEVXbJv2Mvelmc3I'],
  ['PL', 'viral', 'daily', '37i9dQZEVXbNGGDnE9UFTF'],
  ['PT', 'viral', 'daily', '37i9dQZEVXbKHoaIcElSSA'],
  ['RO', 'viral', 'daily', '37i9dQZEVXbNwDVyEEfWV3'],

  ['RU', 'viral', 'daily', '37i9dQZEVXbMNKGj6aCCDm'],
  ['SA', 'viral', 'daily', '37i9dQZEVXbMq8xkWZE6se'],
  ['SE', 'viral', 'daily', '37i9dQZEVXbIPOivNiyjjS'],
  ['CH', 'viral', 'daily', '37i9dQZEVXbNjqq6Tw4Fb0'],

  ['SG', 'viral', 'daily', '37i9dQZEVXbJVi45MafAu0'],
  ['SK', 'viral', 'daily', '37i9dQZEVXbK3Iy2zvpfp4'],
  ['HK', 'viral', 'daily', '37i9dQZEVXbKXd6qahcpCg'],
  ['ES', 'viral', 'daily', '37i9dQZEVXbMfVLvbaC3bj'],

  ['ZA', 'viral', 'daily', '37i9dQZEVXbNaCk6h5bujZ'],
  ['KR', 'viral', 'daily', '37i9dQZEVXbM1H8L6Tttw9'],
  ['TW', 'viral', 'daily', '37i9dQZEVXbMGnTCc4Vx7v'],
  ['TH', 'viral', 'daily', '37i9dQZEVXbMnf7ONzeQWM'],

  ['CZ', 'viral', 'daily', '37i9dQZEVXbMBUm3g7j4Kb'],
  ['TR', 'viral', 'daily', '37i9dQZEVXbMIJZxwqzod6'],
  ['UA', 'viral', 'daily', '37i9dQZEVXbLwLH0YjrtGb'],
  ['HU', 'viral', 'daily', '37i9dQZEVXbLuey1EKVv9I'],

  ['UY', 'viral', 'daily', '37i9dQZEVXbM1qaaFAyPLz'],
  ['UA', 'viral', 'daily', '37i9dQZEVXbN6kflPvZZn0'],
  ['UK', 'viral', 'daily', '37i9dQZEVXbL3DLHfQeDmV'],
  ['US', 'viral', 'daily', '37i9dQZEVXbKuaTI1Z1Afx'],

  ['VN', 'viral', 'daily', '37i9dQZEVXbL1G1MbPav3j'],
  ['CY', 'viral', 'daily', '37i9dQZEVXbNBxnXSWuAcX'],
];

function getChartCode(countryCode: CountryCode, type: ChartType, period: ChartPeriod) {
  return CHART_CODES.filter((chartCode) => chartCode[0] === countryCode && chartCode[1] === type && chartCode[2] === period)[0][3] ?? null;
}

function chartExists(countryCode: CountryCode, type: ChartType, period: ChartPeriod) {
  return CHART_CODES.some((chartCode) => {
    if (chartCode) {
      return chartCode[0] === countryCode && chartCode[1] === type && chartCode[2] === period
    }
    return false;
  });
}

