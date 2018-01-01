import Debug from 'debug';
import Consts from '@/Consts';

const debug = Debug('chase:lambda-user');
const ENDPOINT = Consts.LAMBDA_ENDPOINT.POCKET;

async function register(arg) {
  if (!arg || !arg.accesstoken) return null;
  debug('[register]>>>>', arg);
  const { accesstoken } = arg;
  const result = await fetch(`${ENDPOINT}/user/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      accesstoken,
    }),
  }).then((response) => {
    if (response.ok) {
      return response.json();
    }
    throw response;
  }).catch((e) => {
    debug(accesstoken, e);
    throw e;
  });
  debug(result);
  debug('[register]<<<<', result);
  return result;
}

export default {
  register,
};
