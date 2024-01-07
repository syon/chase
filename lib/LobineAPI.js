import axios from 'axios'

const EP = 'http://localhost:3456/api'
// const EP = 'https://lobine-core-syon.vercel.app/api'

export default class LobineAPI {
  static async postWid(url) {
    const apiUrl = `${EP}/entries`
    const data = { url }
    const res = await axios.post(apiUrl, data)
    return res.data
  }
}
