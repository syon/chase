const debug = require('debug')('chase:shot-adaptor');
const axios = require('axios');

const LAMBDA_ENDPOINT = 'https://znvqcb3nb0.execute-api.us-east-1.amazonaws.com/prod';

module.exports.main = (arg) => {
  debug(arg);
  const { url, pocket_id: pid } = arg;
  return axios.get(`${LAMBDA_ENDPOINT}/film`, {
    params: {
      url,
      pocket_id: pid,
    },
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
