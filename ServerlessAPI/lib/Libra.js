const axios = require('axios');
const cheerio = require('cheerio');

module.exports = class Libra {
  constructor(url) {
    this.url = encodeURI(url)
  }

  getInfo() {
    return axios(this.url).then(res => {
        return res.data
      }).then(html => {
        const standardProps = this.extractStandardProps(html)
        const metaProps = this.extractMetaProps(html)
        const site_name = this.resolveSiteName(metaProps)
        const title = this.resolveTitle(standardProps, metaProps)
        const description = this.resolveDesc(standardProps, metaProps)
        const image = this.resolveImageUrl(metaProps)
        return { site_name, title, description, image }
      });
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
    $('head meta').each((i, el) => {
      const property = $(el).attr('property')
      const content = $(el).attr('content')
      if (property && content) {
        results.push({ [property]: content })
      }
    })
    results.sort((a,b) => {
      if (Object.keys(a)[0] < Object.keys(b)[0]) return -1
      if (Object.keys(a)[0] > Object.keys(b)[0]) return 1
      return 0
    })
    return results
  }

  extractStandardProps(html) {
    const $ = cheerio.load(html)
    const title = $('head title').text()
    const description = $('head meta[name="description"]').attr('content')
    return { title, description }
  }

}
