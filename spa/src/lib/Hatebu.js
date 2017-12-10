import Debug from 'debug';
import fetchJsonp from 'fetch-jsonp';

const debug = Debug('chase:hatebu');

async function fetch(targetUrl) {
  debug('[film]>>>>', targetUrl);
  const url = `https://b.hatena.ne.jp/entry/jsonlite/?url=${targetUrl}`;
  const result = await fetchJsonp(url)
    .then((r) => {
      if (r.ok) return r.json();
      return null;
    });
  debug('[film]<<<<', result);
  return result;
}

export default {
  fetch,
};
