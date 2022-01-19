/* eslint-disable camelcase */
import { SpotifyPlayOptions } from './types';
import { API_URL } from '../../../utils/constants';
import { getAuthHeader } from '../../../helpers/api-helpers';

export async function checkTracksStatus(tracks: string | string[]) {
  const trackIds = Array.isArray(tracks) ? tracks : [tracks];

  const authHeader = getAuthHeader();
  return fetch(`${API_URL}api/spotify/me/tracks/contains?trackIds=${trackIds}`, {
    headers: {
      'Authorization': authHeader
    }
  })
      .then(res => res.json()).then(data => data.body);
}

export async function getDevices() {
  const authHeader = getAuthHeader();
  return fetch(`${API_URL}api/spotify/me/player/devices`, {
    headers: {
      'Authorization': authHeader
    }
  })
      .then(res => res.json()).then(data => data.body);
}

export async function getPlaybackState() {
  const authHeader = getAuthHeader();
  return fetch(`${API_URL}api/spotify/me/player`, {
    headers: {
      'Authorization': authHeader
    }
  })
      .then(d => {
        if (d.status === 204) return null;
        return d.json();
      }).then(data => data.body);
}

export async function pause() {
  return fetch(`${API_URL}api/spotify/me/player/pause`, { method: 'PUT' })
      .then(res => res.json()).then(data => data.body);
}

export async function play(
  { context_uri, deviceId, offset = 0, uris }: SpotifyPlayOptions,
) {
  let body;

  if (context_uri) {
    const isArtist = context_uri.indexOf('artist') >= 0;
    let position;

    /* istanbul ignore else */
    if (!isArtist) {
      position = { position: offset };
    }

    body = JSON.stringify({ device_id: deviceId, context_uri, offset: position });
  } else if (Array.isArray(uris) && uris.length) {
    body = JSON.stringify({ device_id: deviceId, uris, offset: { position: offset } });
  }

  return fetch(`${API_URL}api/spotify/me/player/play`, {
    body,
    method: 'PUT'
  }).then((res) => res.json()).then(data => data.body);
}

export async function previous() {
  return fetch(`${API_URL}api/spotify/me/player/previous`, { method: 'POST' })
      .then(res => res.json()).then(data => data.body);
}

export async function next() {
  return fetch(`${API_URL}api/spotify/me/player/next`, { method: 'POST' })
      .then((res) => res.json()).then(data => data.body);
}

export async function removeTracks(tracks: string | string[]) {
  const ids = Array.isArray(tracks) ? tracks : [tracks];

  return fetch(`${API_URL}api/spotify/me/tracks`, {
    body: JSON.stringify(ids),
    method: 'DELETE',
  });
}

export async function saveTracks(tracks: string | string[]) {
  const ids = Array.isArray(tracks) ? tracks : [tracks];

  return fetch(`${API_URL}api/spotify/me/tracks`, {
    body: JSON.stringify(ids),
    method: 'PUT',
  });
}

export async function seek(position: number) {
  return fetch(`${API_URL}api/spotify/me/player/seek?position=${position}`, {
    method: 'PUT',
  });
}

export async function setDevice(deviceId: string, shouldPlay?: boolean | undefined) {
  const body = JSON.stringify({ device_ids: [deviceId], play: shouldPlay })
  return fetch(`${API_URL}api/spotify/me/player`, {
    body,
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'PUT',
  });
}

export async function setVolume(volume: number) {
  return fetch(`${API_URL}api/spotify/volume?volume=${volume}`, {
    method: 'PUT',
  });
}
