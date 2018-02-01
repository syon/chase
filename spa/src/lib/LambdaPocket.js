import Consts from '@/Consts';
import URLSearchParams from 'url-search-params';

const debug = Debug('chase:lambda-pocket');
const ENDPOINT = Consts.LAMBDA_ENDPOINT.POCKET;
const REDIRECT_URI = `${location.origin}/chase/`;

async function getRequestToken() {
  debug('[getRequestToken]>>>>');
  const result = await fetch(`${ENDPOINT}/pocket/oauth/request`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      redirect_uri: REDIRECT_URI,
    }),
  })
    /* eslint-disable arrow-body-style */
    .then(res => res.json()).then((json) => {
      return {
        request_token: json.request_token,
        auth_uri: json.auth_uri,
      };
    })
    .catch(err => debug(err));
  debug('[getRequestToken]<<<<', result);
  return result;
}

async function getAccessToken(requestToken) {
  debug('[getAccessToken]>>>>', requestToken);
  const result = await fetch(`${ENDPOINT}/pocket/oauth/authorize`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      code: requestToken,
    }),
  })
    .then(res => res.json())
    .catch(err => debug(err));
  debug('[getAccessToken]<<<<', result);
  return result;
}

async function get(accessToken) {
  debug('[get]>>>>', accessToken);
  if (!accessToken) return { list: {} };
  const result = await fetch(`${ENDPOINT}/pocket/get`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      access_token: accessToken,
      count: 100,
      detailType: 'complete',
    }),
  })
    .then(res => res.json())
    .catch(err => debug(err));
  debug('[get]<<<<', result);
  return result;
}

async function progress(accessToken) {
  debug('[progress]>>>>', accessToken);
  if (!accessToken) return { list: {} };
  const result = await fetch(`${ENDPOINT}/pocket/progress`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      access_token: accessToken,
    }),
  })
    .then(res => res.json())
    .catch(err => debug(err));
  debug('[progress]<<<<', result);
  return result;
}

async function getByTag(accessToken, tag) {
  debug('[getByTag]>>>>', accessToken, tag);
  const result = await fetch(`${ENDPOINT}/pocket/get`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      access_token: accessToken,
      tag,
      count: 100,
      detailType: 'complete',
    }),
  })
    .then(res => res.json())
    .catch(err => debug(err));
  debug('[getByTag]<<<<', result);
  return result;
}

async function archive(accessToken, itemId) {
  debug('[archive]>>>>', accessToken, itemId);
  const q = new URLSearchParams();
  q.append('access_token', accessToken);
  q.append('item_id', itemId);
  const url = `${ENDPOINT}/pocket/send/archive?${q.toString()}`;
  const result = await fetch(url, {
    method: 'GET',
  })
    .then(res => res.json())
    .catch(err => debug(err));
  debug('[archive]<<<<', result);
  return result;
}

async function favorite(accessToken, itemId) {
  debug('[favorite]>>>>', accessToken, itemId);
  const q = new URLSearchParams();
  q.append('access_token', accessToken);
  q.append('item_id', itemId);
  const url = `${ENDPOINT}/pocket/send/favorite?${q.toString()}`;
  const result = await fetch(url, {
    method: 'GET',
  })
    .then(res => res.json())
    .catch(err => debug(err));
  debug('[favorite]<<<<', result);
  return result;
}

async function unfavorite(accessToken, itemId) {
  debug('[unfavorite]>>>>', accessToken, itemId);
  const q = new URLSearchParams();
  q.append('access_token', accessToken);
  q.append('item_id', itemId);
  const url = `${ENDPOINT}/pocket/send/unfavorite?${q.toString()}`;
  const result = await fetch(url, {
    method: 'GET',
  })
    .then(res => res.json())
    .catch(err => debug(err));
  debug('[unfavorite]<<<<', result);
  return result;
}

async function addTag(accessToken, itemId, tag) {
  debug('[addTag]>>>>', accessToken, itemId);
  const q = new URLSearchParams();
  q.append('access_token', accessToken);
  q.append('item_id', itemId);
  q.append('tag', tag);
  const url = `${ENDPOINT}/pocket/send/tags/add?${q.toString()}`;
  const result = await fetch(url, {
    method: 'GET',
  })
    .then(res => res.json())
    .catch(err => debug(err));
  debug('[addTag]<<<<', result);
  return result;
}

export default {
  getRequestToken,
  getAccessToken,
  get,
  progress,
  getByTag,
  archive,
  favorite,
  unfavorite,
  addTag,
};
