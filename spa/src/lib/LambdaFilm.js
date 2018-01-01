import Debug from 'debug';

const debug = Debug('chase:lambda-shot');
const LAMBDA_ENDPOINT = 'https://znvqcb3nb0.execute-api.us-east-1.amazonaws.com/prod';

async function shot(arg) {
  if (!arg || !arg.eid) return null;
  debug('[shot]>>>>', arg);
  const { eid, url } = arg;
  const result = await fetch(`${LAMBDA_ENDPOINT}/shot`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      pocket_id: eid,
      url,
    }),
  }).then((response) => {
    if (response.ok) {
      return response.json();
    }
    throw response;
  }).catch((e) => {
    debug(eid, url, e);
    throw e;
  });
  debug('[shot]<<<<', result);
  return result;
}

export default {
  shot,
};
