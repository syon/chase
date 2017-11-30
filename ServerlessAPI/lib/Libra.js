const axios = require('axios')
const cheerio = require('cheerio')
const fs = require('fs')
const execSync = require('child_process').execSync
const debug = require('debug')('chase:libra')

module.exports = class Libra {
  constructor(url) {
    this.url = encodeURI(url)
  }

  getInfo() {
    const config = { responseType: 'arraybuffer', timeout: 3000 }
    return axios.get(this.url, config).then(res => {
        return res.data
      }).then(html => {
        const encoding = this.detectEncoding(html)
        debug('Detected Encoding:', encoding)
        if (encoding && encoding.toUpperCase() !== 'UTF-8') {
          fs.writeFileSync('/tmp/doc.html', html)
          const cmd = `iconv -f ${encoding} -t utf-8 /tmp/doc.html`
          return execSync(cmd).toString()
        } else {
          return html.toString()
        }
      }).then(html => {
        const standardProps = this.extractStandardProps(html)
        const metaProps = this.extractMetaProps(html)
        const site_name = this.resolveSiteName(metaProps)
        const title = this.resolveTitle(standardProps, metaProps)
        const description = this.resolveDesc(standardProps, metaProps)
        const image = this.resolveImageUrl(metaProps)
        return { site_name, title, description, image }
      }).catch(error => {
        debug('Error on axios in Libra.getInfo')
        debug(error)
        return {
          site_name: '',
          title: '',
          description: '',
          image: '',
        }
      })
  }

  detectEncoding(html) {
    const $ = cheerio.load(html)
    // Pattern: <meta charset="utf-8">
    const cs = $('meta[charset]').attr('charset')
    if (cs) return cs
    // Pattern: <meta http-equiv="Content-Type" content="text/html charset=UTF-8">
    const q1 = 'meta[http-equiv="Content-Type"]'
    const q2 = 'meta[http-equiv="content-type"]'
    const ct = $(`${q1}, ${q2}`).attr('content')
    console.log(ct)
    if (ct) {
      const m = ct.match(/charset=([\w-]*)/)
      if (m && m[1]) return m[1]
    }
    return 'UTF-8'
  }

  resolveSiteName(metaProps) {
    const ogSiteName = this.getMetaPropContent(metaProps, 'og:site_name')
    if (ogSiteName) return ogSiteName
    return ''
  }

  resolveTitle(standardProps, metaProps) {
    const ogTitle = this.getMetaPropContent(metaProps, 'og:title')
    if (ogTitle) return ogTitle
    return standardProps.title
  }

  resolveDesc(standardProps, metaProps) {
    const ogDesc = this.getMetaPropContent(metaProps, 'og:description')
    if (ogDesc) return ogDesc
    return standardProps.description
  }

  resolveImageUrl(metaProps) {
    const ogImage = this.getMetaPropContent(metaProps, 'og:image')
    if (ogImage) return ogImage
    return ''
  }

  getMetaPropContent(metaProps, propKey) {
    const mpObj = metaProps.find((d, i, arr) => {
      return d[propKey]
    })
    if (mpObj) return mpObj[propKey]
    return ''
  }

  getMetaProps(url) {
    return fetch(url).then(res => {
        if (res.ok) { return res.text() }
      }).then(html => {
        const metaProps = this.extractMetaProps(html)
        return metaProps
      }).catch(e => {
        throw e
      })
  }

  extractMetaProps(html) {
    const $ = cheerio.load(html)
    let results = []
    $('meta').each((i, el) => {
      const property = $(el).attr('property')
      const content = $(el).attr('content')
      if (property && content) {
        debug({ [property]: content })
        results.push({ [property]: content })
      }
    })
    results.sort((a,b) => {
      if (Object.keys(a)[0] < Object.keys(b)[0]) return -1
      if (Object.keys(a)[0] > Object.keys(b)[0]) return 1
      return 0
    })
    debug(results)
    return results
  }

  extractStandardProps(html) {
    const $ = cheerio.load(html)
    const title = $('head title').text()
    const description = $('head meta[name="description"]').attr('content')
    return { title, description }
  }

}
