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
  }).then(res => res.json());
}

export async function getDevices() {
  const authHeader = getAuthHeader();
  return fetch(`${API_URL}api/spotify/me/player/devices`, {
    headers: {
      'Authorization': authHeader
    }
  }).then(res => res.json());
}

export async function getPlaybackState() {
  const authHeader = getAuthHeader();
  return fetch(`${API_URL}api/spotify/me/player`, {
    headers: {
      'Authorization': authHeader
    }
  }).then(d => {
        if (d.status === 204) return null;
        return d.json();
      }).then(data => data.body);
}

export async function pause() {
  const authHeader = getAuthHeader();
  return fetch(`${API_URL}api/spotify/me/player/pause`, {
    headers: {
      'Authorization': authHeader
    },
    method: 'PUT' }).then(res => res.json());
}

export async function play(
  { context_uri, deviceId, offset = 0, uris }: SpotifyPlayOptions,
) {
  const authHeader = getAuthHeader();
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
    method: 'PUT',
    headers: {
      'Authorization': authHeader
    }
  });
}

export async function previous() {
  const authHeader = getAuthHeader();
  return fetch(`${API_URL}api/spotify/me/player/previous`, {
    method: 'POST',
    headers: {
      'Authorization': authHeader
    }}).then(res => res.json());
}

export async function next() {
  const authHeader = getAuthHeader();
  return fetch(`${API_URL}api/spotify/me/player/next`, {
    method: 'POST',
    headers: {
      'Authorization': authHeader
    }}).then((res) => res.json());
}

export async function removeTracks(tracks: string | string[]) {
  const authHeader = getAuthHeader();
  const ids = Array.isArray(tracks) ? tracks : [tracks];

  return fetch(`${API_URL}api/spotify/me/tracks`, {
    body: JSON.stringify(ids),
    method: 'DELETE',
    headers: {
      'Authorization': authHeader
    }
  });
}

export async function saveTracks(tracks: string | string[]) {
  const authHeader = getAuthHeader();
  const ids = Array.isArray(tracks) ? tracks : [tracks];

  return fetch(`${API_URL}api/spotify/me/tracks`, {
    body: JSON.stringify(ids),
    method: 'PUT',
    headers: {
      'Authorization': authHeader
    }
  });
}

export async function seek(position: number) {
  const authHeader = getAuthHeader();
  return fetch(`${API_URL}api/spotify/me/player/seek?position=${position}`, {
    method: 'PUT',
    headers: {
      'Authorization': authHeader
    }
  });
}

export async function setDevice(deviceId: string, shouldPlay?: boolean | undefined) {
  const authHeader = getAuthHeader();
  const body = JSON.stringify({ device_ids: [deviceId], play: shouldPlay })
  return fetch(`${API_URL}api/spotify/me/player`, {
    body,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': authHeader
    },
    method: 'PUT',
  });
}

export async function setVolume(volume: number) {
  const authHeader = getAuthHeader();
  return fetch(`${API_URL}api/spotify/volume?volume=${volume}`, {
    method: 'PUT',
    headers: {
      'Authorization': authHeader
    }
  });
}
