const LAMBDA_ENDPOINT = 'https://ua5uhzf79d.execute-api.us-east-1.amazonaws.com/dev';

async function thumb(arg) {
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
      // eslint-disable-next-line
      console.log(json);
      return json;
    }).catch((error) => {
      // eslint-disable-next-line
      console.log(arg, error);
      throw error;
    });
  return result;
}

export default {
  thumb,
};
