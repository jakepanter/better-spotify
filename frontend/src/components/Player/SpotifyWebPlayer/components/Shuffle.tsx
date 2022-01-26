import * as React from 'react';

import { px, styled } from '../styles';
import { StyledProps, StylesOptions } from '../types/common';
import { getAuthHeader } from '../../../../helpers/api-helpers';
import {API_URL} from "../../../../utils/constants";

interface Props {
  currentDeviceId?: string;
  deviceId?: string;
  // eslint-disable-next-line no-unused-vars
  onClickDevice: (deviceId: string) => any;
  active: boolean;
  playerPosition: string;
  styles: StylesOptions;
  title: string;
}

export interface State {
  isActive: boolean;
}

const Wrapper = styled('div')(
  {
    'pointer-events': 'all',
    position: 'relative',
    zIndex: 20,

    '> div': {
      display: 'flex',
      flexDirection: 'column',
      padding: px(8),
      position: 'absolute',
      right: `-${px(3)}`,

      button: {
        display: 'block',
        padding: px(8),
        whiteSpace: 'nowrap',

        '&.rswp__devices__active': {
          fontWeight: 'bold',
        },
      },
    },

    '> button': {
      fontSize: px(26),
    },
  },
  ({ style }: StyledProps) => ({
    '> button': {
      color: style.c,
    },
    '> div': {
      backgroundColor: style.bgColor,
      boxShadow: style.altColor ? `1px 1px 10px ${style.altColor}` : 'none',
      [style.p]: '120%',
      button: {
        color: style.c,
      },
    },
  }),
  'DevicesRSWP',
);

export default class Shuffle extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      isActive: props.active,
    };
  }

  componentDidMount() {
    const authHeader = getAuthHeader();
    fetch(`${API_URL}api/spotify/me/player/shuffle?state=${this.state.isActive}`, {
      headers: {
        'Authorization': authHeader
      }
    });
  }

  private handleClickToggleShuffle = () => {
    const shuffleState = !this.state.isActive;
    this.setState(state => ({ isActive: !state.isActive }));
    const authHeader = getAuthHeader();
    fetch(`${API_URL}api/spotify/me/player/shuffle?state=${shuffleState}`, {
      method: 'PUT',
      headers: {
        'Authorization': authHeader
      }
    });
  };

  public render() {
    const { isActive } = this.state;
    const {
      styles: { altColor, bgColor, color },
      title,
    } = this.props;

    return (
      <Wrapper
        style={{
          altColor,
          bgColor,
          color
        }}
      >
          <>
            {isActive && (
                <button
                    aria-label={title}
                    onClick={this.handleClickToggleShuffle}
                    title={title}
                    type="button"
                    className={'shuffle-active'}
                >
                  <span className={'material-icons'}>shuffle_on</span>
                </button>
            )}
            {!isActive && (
                <button
                    aria-label={title}
                    onClick={this.handleClickToggleShuffle}
                    title={title}
                    type="button"
                >
                  <span className={'material-icons'}>shuffle</span>
                </button>
            )}
          </>
      </Wrapper>
    );
  }
}
