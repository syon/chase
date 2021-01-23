import axios from 'axios'

const EP = 'https://hatena.now.sh/api'

export default class HatenaAPI {
  static async getEntryCount(url) {
    const apiUrl = `${EP}/bookmark/getEntryCount`
    const params = { url }
    const res = await axios.get(apiUrl, { params })
    return res.data
  }
}
