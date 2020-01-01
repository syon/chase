const axios = require('axios')

const EP = 'https://ua5uhzf79d.execute-api.us-east-1.amazonaws.com/dev'

test('/libra/info', async () => {
  const params = { url: 'http://www.mangataisho.com/', pocket_id: '0008386476' }
  const res = await axios.get(`${EP}/libra/info`, { params })
  console.log(res.data)
  expect(res.status).toBe(200)
})
