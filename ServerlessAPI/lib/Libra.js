const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const { execSync } = require('child_process');
const debug = require('debug')('chase:libra');
const AWS = require('aws-sdk');

const s3 = new AWS.S3();

module.exports = class Libra {
  constructor({ url, pocketId }) {
    this.url = encodeURI(url);
    this.s3Path = Libra.makeS3Path(pocketId);
    debug(this);
  }

  static makeS3Path(pocketId) {
    if (!pocketId) return null;
    const item10Id = `0000000000${pocketId}`.substr(-10, 10);
    const itemId3 = item10Id.slice(0, 3);
    return `items/libra/${itemId3}/${item10Id}.json`;
  }

  getInfo() {
    const config = { responseType: 'arraybuffer', timeout: 3000 };
    return axios.get(this.url, config)
      .then(res => res.data)
      .then((html) => {
        let encoding = Libra.detectEncoding(html);
        encoding = encoding.replace(/x-sjis/i, 'shift_jis');
        debug('Detected Encoding:', encoding);
        if (encoding && encoding.toUpperCase() !== 'UTF-8') {
          fs.writeFileSync('/tmp/doc.html', html);
          const cmd = `iconv -f ${encoding} -t utf-8 /tmp/doc.html`;
          return execSync(cmd).toString();
        }
        return html.toString();
      })
      .then((html) => {
        const standardProps = Libra.extractStandardProps(html);
        const metaProps = Libra.extractMetaProps(html);
        const siteName = Libra.resolveSiteName(metaProps);
        const title = Libra.resolveTitle(standardProps, metaProps);
        const description = Libra.resolveDesc(standardProps, metaProps);
        const image = Libra.resolveImageUrl(metaProps);
        return {
          site_name: siteName, title, description, image,
        };
      })
      .then((info) => {
        this.putInfoS3(info);
        return info;
      })
      .catch((error) => {
        debug('Error on axios in Libra.getInfo');
        debug(error);
        return {
          site_name: '',
          title: '',
          description: '',
          image: '',
        };
      });
  }

  putInfoS3(info) {
    debug('[putInfoS3]', this.s3Path);
    if (this.s3Path) {
      const obj = {
        Bucket: process.env.BUCKET,
        Key: this.s3Path,
        Body: JSON.stringify(info, null, 2),
      };
      s3.putObject(obj, (err, data) => {
        if (err) { debug('Error:', err); }
        if (data) { debug('Success:', data); }
      });
    }
  }

  static detectEncoding(html) {
    const $ = cheerio.load(html);
    // Pattern: <meta charset="utf-8">
    const cs = $('meta[charset]').attr('charset');
    if (cs) return cs;
    // Pattern: <meta http-equiv="Content-Type" content="text/html charset=UTF-8">
    const q1 = 'meta[http-equiv="Content-Type"]';
    const q2 = 'meta[http-equiv="content-type"]';
    const ct = $(`${q1}, ${q2}`).attr('content');
    debug(ct);
    if (ct) {
      const m = ct.match(/charset=([\w-]*)/);
      if (m && m[1]) return m[1];
    }
    return 'UTF-8';
  }

  static resolveSiteName(metaProps) {
    const ogSiteName = Libra.getMetaPropContent(metaProps, 'og:site_name');
    if (ogSiteName) return ogSiteName;
    return '';
  }

  static resolveTitle(standardProps, metaProps) {
    const ogTitle = Libra.getMetaPropContent(metaProps, 'og:title');
    if (ogTitle) return ogTitle;
    return standardProps.title;
  }

  static resolveDesc(standardProps, metaProps) {
    const ogDesc = Libra.getMetaPropContent(metaProps, 'og:description');
    if (ogDesc) return ogDesc;
    return standardProps.description;
  }

  static resolveImageUrl(metaProps) {
    const ogImage = Libra.getMetaPropContent(metaProps, 'og:image');
    if (ogImage) return ogImage;
    return '';
  }

  static getMetaPropContent(metaProps, propKey) {
    const mpObj = metaProps.find(d => d[propKey]);
    if (mpObj) return mpObj[propKey];
    return '';
  }

  static extractMetaProps(html) {
    const $ = cheerio.load(html);
    const results = [];
    $('meta').each((i, el) => {
      const property = $(el).attr('property');
      const content = $(el).attr('content');
      if (property && content) {
        debug({ [property]: content });
        results.push({ [property]: content });
      }
    });
    results.sort((a, b) => {
      if (Object.keys(a)[0] < Object.keys(b)[0]) return -1;
      if (Object.keys(a)[0] > Object.keys(b)[0]) return 1;
      return 0;
    });
    debug(results);
    return results;
  }

  static extractStandardProps(html) {
    const $ = cheerio.load(html);
    const title = $('head title').text();
    const description = $('head meta[name="description"]').attr('content');
    return { title, description };
  }
};
