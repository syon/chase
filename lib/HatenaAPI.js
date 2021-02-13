import axios from 'axios'

const EP = 'https://hatena.now.sh/api'

class User {
  static getProfileImageURL(user) {
    const apiUrl = `https://cdn.profile-image.st-hatena.com/users/${user}/profile.png`
    return apiUrl
  }
}

class Bookmark {
  static async getEntryCount(url) {
    const apiUrl = `${EP}/bookmark/getEntryCount`
    const params = { url }
    const res = await axios.get(apiUrl, { params })
    return res.data
  }
}

export default {
  User,
  Bookmark,
}
