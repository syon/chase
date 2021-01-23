import axios from 'axios'

const EP = 'https://api.lobine.app'

export default class LobineAPI {
  static async postWid(url) {
    const apiUrl = `${EP}/wid`
    const data = { url }
    const res = await axios.post(apiUrl, data)
    return res.data
  }
}
