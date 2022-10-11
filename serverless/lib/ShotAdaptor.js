const debug = require('debug')('chase:shot-adaptor')
const axios = require('axios')

const LAMBDA_ENDPOINT =
  'https://znvqcb3nb0.execute-api.us-east-1.amazonaws.com/prod'

const HTTP_POST_CONFIG = {
  headers: {
    'Content-Type': 'application/json; charset=UTF-8',
    'X-Accept': 'application/json',
  },
}

module.exports.main = (arg) => {
  const params = { url: arg.url, pocket_id: arg.pocket_id }
  debug(params)
  const data = JSON.stringify(params)
  const endpoint = `${LAMBDA_ENDPOINT}/shot`
  return axios.post(endpoint, data, HTTP_POST_CONFIG)
}
