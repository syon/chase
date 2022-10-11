const axios = require('axios')

// const EP = 'https://ua5uhzf79d.execute-api.us-east-1.amazonaws.com/dev'
const EP = 'http://localhost:3000/dev'

test('/libra/info', async () => {
  const params = { url: 'http://www.mangataisho.com/', pocket_id: '0008386476' }
  const res = await axios.get(`${EP}/libra/info`, { params })
  console.log(res.data)
  expect(res.status).toBe(200)
})

test('/libra/thumb', async () => {
  const data = {
    url: 'https://anond.hatelabo.jp/20200102163416',
    pocket_id: '2840521172',
  }
  const res = await axios.post(`${EP}/libra/thumb`, data)
  console.log(res.data)
  expect(res.status).toBe(200)
})
