import Debug from 'debug';

const debug = Debug('chase:lambda-user');
const LAMBDA_ENDPOINT = 'https://ua5uhzf79d.execute-api.us-east-1.amazonaws.com/dev';

async function register(arg) {
  if (!arg || !arg.accesstoken) return null;
  debug('[register]>>>>', arg);
  const { accesstoken } = arg;
  const result = await fetch(`${LAMBDA_ENDPOINT}/user/register`, {
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
