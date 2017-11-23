const LAMBDA_ENDPOINT = 'https://ua5uhzf79d.execute-api.us-east-1.amazonaws.com/dev';

function thumb(arg) {
  const { eid, url, image_suggested } = arg;
  fetch(`${LAMBDA_ENDPOINT}/libra/thumb`, {
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
    }).catch((ex) => {
      // eslint-disable-next-line
      console.log(arg, ex);
    });
}

export default {
  thumb,
};
