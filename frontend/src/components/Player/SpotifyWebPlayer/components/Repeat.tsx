import * as React from 'react';

import { px, styled } from '../styles';
import { StyledProps, StylesOptions } from '../types/common';
import { getAuthHeader } from '../../../../helpers/api-helpers';
import {API_URL} from "../../../../utils/constants";
import {useSelector} from "react-redux";
import {PlaybackState} from "../../../../utils/playbackSlice";

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
  'DevicesRSWP1',
);

export default function Repeat (props: Props) {

  const playback = useSelector((state: PlaybackState) => state.playback);

  const handleClickToggleShuffle = () => {
    const newRepeatMode = playback.repeatMode + 1;
    let repeatState;
    if (newRepeatMode === 1) repeatState = 'context';
    else if (newRepeatMode === 2) repeatState = 'track';
    else repeatState = 'off';
    const authHeader = getAuthHeader();
    fetch(`${API_URL}api/spotify/me/player/repeat?state=${repeatState}`, {
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
          {playback.repeatMode === 0 && (
              <button
                  aria-label={title}
                  onClick={handleClickToggleShuffle}
                  title={title}
                  type="button"
              >
                <span className={'material-icons'}>repeat</span>
              </button>
          )}
          {playback.repeatMode === 1 && (
              <button
                  aria-label={title}
                  onClick={handleClickToggleShuffle}
                  title={title}
                  type="button"
                  className={'shuffle-active'}
              >
                <span className={'material-icons'}>repeat_on</span>
              </button>
          )}
          {playback.repeatMode === 2 && (
              <button
                  aria-label={title}
                  onClick={handleClickToggleShuffle}
                  title={title}
                  type="button"
                  className={'shuffle-active'}
              >
                <span className={'material-icons'}>repeat_one_on</span>
              </button>
          )}
        </>
      </Wrapper>
  );
}
