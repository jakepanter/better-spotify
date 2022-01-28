import * as React from 'react';

import { px, styled } from '../styles';
import { StyledProps, StylesOptions } from '../types/common';
import { getAuthHeader } from '../../../../helpers/api-helpers';
import {API_URL} from "../../../../utils/constants";
import {useSelector} from "react-redux";

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

interface PlaybackState {
  playback: {
    paused: boolean;
    position: number;
    repeatMode: number;
    shuffle: boolean;
    currentTrackId: string;
  }
}

export default function Shuffle (props: Props) {

  const playback = useSelector((state: PlaybackState) => state.playback);

  const handleClickToggleShuffle = () => {
    const shuffleState = !playback.shuffle;
    const authHeader = getAuthHeader();
    fetch(`${API_URL}api/spotify/me/player/shuffle?state=${shuffleState}`, {
      method: 'PUT',
      headers: {
        'Authorization': authHeader
      }
    });
  };

  const {
    styles: { altColor, bgColor, color },
    title,
  } = props;

  return (
      <Wrapper
          style={{
            altColor,
            bgColor,
            color
          }}
      >
        <>
          {playback.shuffle && (
              <button
                  aria-label={title}
                  onClick={handleClickToggleShuffle}
                  title={title}
                  type="button"
                  className={'shuffle-active'}
              >
                <span className={'material-icons'}>shuffle_on</span>
              </button>
          )}
          {!playback.shuffle && (
              <button
                  aria-label={title}
                  onClick={handleClickToggleShuffle}
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
