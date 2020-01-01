const debug = require('debug')('chase:film')
const axios = require('axios')
const gm = require('gm').subClass({ imageMagick: true })
const AWS = require('aws-sdk')

const Libra = require('./Libra')

const s3 = new AWS.S3()

module.exports = class Film {
  constructor(arg) {
    const { url, pocketId, suggestedImgUrl } = arg
    Film.argGuard(arg)
    this.url = encodeURI(url)
    this.pocketId = pocketId
    this.s3Path = Film.makeS3Path(pocketId)
    this.suggestedImgUrl = suggestedImgUrl
    debug(this)
  }

  static argGuard(arg) {
    const url = encodeURI(arg.url)
    Film.guard(url)
    Film.guard(arg.pocketId, false, /^\d+$/)
  }

  static guard(str, allowBlank, regex) {
    if (typeof str === 'undefined') {
      throw new Error('Guard (Undefined)')
    }
    if (!allowBlank && str.trim().length === 0) {
      throw new Error('Guard (Blank)')
    }
    if (regex && !str.match(regex)) {
      throw new Error(`Guard (Regex): ${str} :: ${regex}`)
    }
  }

  static makeS3Path(pocketId) {
    if (!pocketId) return null
    const item10Id = `0000000000${pocketId}`.substr(-10, 10)
    const itemId3 = item10Id.slice(0, 3)
    return `items/thumbs/${itemId3}/${item10Id}.jpg`
  }

  async main() {
    return Film.s3Head(this.s3Path).then((judge) => {
      if (judge) return '(Skipped) Already exists.'
      debug('[main] S3 Path --', this.s3Path)
      try {
        return this.getImgUrl()
          .then((imgUrl) => {
            debug('[main] Detected image URL --', imgUrl)
            return Film.fetchImageBuffer(imgUrl)
          })
          .then((buf) => Film.convertImage(buf))
          .then((img) => Film.putImage(this.s3Path, img).promise())
          .catch((error) => {
            debug('[main:catch]', error)
            Film.putBlankImage(this.s3Path)
          })
      } catch (error) {
        Film.putBlankImage(this.s3Path)
        throw new Error(error)
      }
    })
  }

  static s3Head(s3path) {
    return new Promise((rv) => {
      const obj = {
        Bucket: process.env.BUCKET,
        Key: s3path
      }
      debug(obj)
      s3.headObject(obj, (err, data) => {
        if (err) {
          debug('Not found in S3')
          rv(false)
        }
        if (data) {
          debug('Already exists in S3')
          rv(true)
        }
      })
    })
  }

  getImgUrl() {
    debug('[getImgUrl]')
    return new Promise((rv, rj) => {
      debug('Fetching the site og:image...')
      const libra = new Libra({ url: this.url, pocketId: this.pocketId })
      libra.getInfo().then((info) => {
        debug(info)
        if (info.image) rv(info.image)
        if (Film.isValidSuggestedUrl(this.suggestedImgUrl)) {
          debug('Using suggested image...')
          rv(this.suggestedImgUrl)
        } else {
          rj(new Error('No image found.'))
        }
      })
    })
  }

  static isValidSuggestedUrl(suggestedImgUrl) {
    if (typeof suggestedImgUrl === 'undefined') {
      return false
    }
    if (suggestedImgUrl.trim() === '') {
      return false
    }
    return true
  }

  static fetchImageBuffer(imageUrl) {
    debug('[fetchImageBuffer]')
    return new Promise((rv, rj) => {
      axios(imageUrl, {
        responseType: 'arraybuffer'
      })
        .then((res) => res.data)
        .then((buffer) => {
          rv(buffer)
        })
        .catch((error) => {
          debug('[fetchImageBuffer:catch] Error')
          rj(error)
        })
    })
  }

  static convertImage(buf) {
    debug('[convertImage]-->>')
    return new Promise((rv, rj) => {
      try {
        gm(buf)
          .resize(420)
          .background('#fff')
          .flatten()
          .toBuffer('jpg', (err, buffer) => {
            if (err) {
              rj(err)
            }
            debug('[convertImage]<<--')
            rv(buffer)
          })
      } catch (error) {
        debug('[convertImage:catch] Error')
        rj(error)
      }
    })
  }

  static putImage(s3path, buffer) {
    debug(`[putImage] S3 (${s3path}):`, buffer)
    return s3.putObject(
      {
        Bucket: process.env.BUCKET,
        Key: s3path,
        Body: buffer
      },
      (err, data) => {
        if (err) {
          debug('[putImage] Error:', err)
        }
        if (data) {
          debug('[putImage] Success:', data)
        }
      }
    )
  }

  static putBlankImage(s3path) {
    debug('Fetch failed. Using blank image.')
    gm('./assets/blank.jpg').toBuffer('jpg', (err, buf) => {
      if (err) {
        debug(err)
        return
      }
      debug('Blank image Buffer --', buf)
      Film.putImage(s3path, buf)
    })
  }
}
