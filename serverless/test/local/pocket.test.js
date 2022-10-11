const axios = require('axios')

// const EP = 'https://ua5uhzf79d.execute-api.us-east-1.amazonaws.com/dev'
const EP = 'http://localhost:3000/dev'

test('/pocket/oauth/request', async () => {
  const data = { redirect_uri: 'http://localhost' }
  const res = await axios.post(`${EP}/pocket/oauth/request`, data)
  expect(res.status).toBe(200)
})
