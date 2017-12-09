import URLSearchParams from 'url-search-params';
import Debug from 'debug';

const debug = Debug('chase:lambda-film');
const LAMBDA_ENDPOINT = 'https://znvqcb3nb0.execute-api.us-east-1.amazonaws.com/prod';

async function film(arg) {
  if (!arg || !arg.eid) return null;
  debug('[film]>>>>', arg);
  const { eid, url } = arg;
  const q = new URLSearchParams();
  q.append('url', url);
  q.append('pocket_id', eid);
  const result = await fetch(`${LAMBDA_ENDPOINT}/film?${q.toString()}`, {
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
  debug(result);
  debug('[film]<<<<', result);
  return result;
}

export default {
  film,
};
