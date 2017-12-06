import URLSearchParams from 'url-search-params';
import Debug from 'debug';

const debug = Debug('chase:lambda-libra');
const LAMBDA_ENDPOINT = 'https://ua5uhzf79d.execute-api.us-east-1.amazonaws.com/dev';

async function info(arg) {
  debug('[info]>>>>');
  const { eid, url } = arg;
  const q = new URLSearchParams();
  q.append('url', url);
  q.append('pocket_id', eid);
  const pageinfo = await fetch(`${LAMBDA_ENDPOINT}/libra/info?${q.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((response) => {
    if (response.ok) {
      return response.json();
    }
    throw response;
  }).catch((e) => {
    debug(eid, url, e);
    throw e;
  });
  debug(pageinfo);
  debug('[info]<<<<', pageinfo);
  return pageinfo;
}

async function thumb(arg) {
  debug('[thumb]>>>>');
  const { eid, url, image_suggested } = arg;
  const result = await fetch(`${LAMBDA_ENDPOINT}/libra/thumb`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      pocket_id: eid,
      url,
      image_suggested,
    }),
  })
    .then(res => res.json()).then((json) => {
      debug(json);
      return json;
    }).catch((error) => {
      debug(arg, error);
      throw error;
    });
  debug('[thumb]<<<<', result);
  return result;
}

export default {
  info,
  thumb,
};
