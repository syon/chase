const setup = require('./starter-kit/setup');
const AWS = require('aws-sdk');
const ua = require('useragent-generator');

const s3 = new AWS.S3();

exports.handler = async (event, context, callback) => {
  // For keeping the browser launch
  context.callbackWaitsForEmptyEventLoop = false;
  // Use Uploaded Fontcache
  process.env.HOME = process.env.LAMBDA_TASK_ROOT;
  const browser = await setup.getBrowser();
  exports.run(browser, event).then(
    (result) => callback(null, result)
  ).catch(
    (err) => callback(err)
  );
};

exports.run = async (browser, event) => {
  const {url, pocket_id: pocketId} = event;
  console.log('_________ exports.run _________');
  console.log(`URL: ${url}`);
  console.log(`PocketID: ${pocketId}`);
  // Check already exists
  const page = await browser.newPage();
  const hasD = await s3Head(pocketId, 'desktop');
  if (!hasD) {
    // Capture desktop
    page.setViewport({width: 1024, height: 768});
    await page.goto(url);
    const buf = await page.screenshot();
    await s3Put(pocketId, buf, 'desktop');
  }
  const hasM = await s3Head(pocketId, 'mobile');
  if (!hasM) {
    // Capture mobile
    page.setViewport({width: 375, height: 667, isMobile: true});
    page.setUserAgent(ua.chrome.iOS(11));
    await page.goto(url);
    await sleep(1000);
    const buf2 = await page.screenshot();
    await s3Put(pocketId, buf2, 'mobile');
  }
  await page.close();
  return 'done.';
};

async function sleep(ms) {
  return await new Promise((r) => setTimeout(r, ms));
}

function s3Head(pocketId, kind) {
  return new Promise((rv, rj) => {
    const obj = {
      Bucket: 'syon-chase',
      Key: `films/${pocketId}/${kind}.png`,
    };
    s3.headObject(obj, (err, data) => {
      if (err) {
        // Not found
        rv(false);
      }
      if (data) {
        // Exists
        rv(true);
      }
    });
  });
}

function s3Put(pocketId, buf, kind) {
  return new Promise((rv, rj) => {
    const obj = {
      Bucket: 'syon-chase',
      Key: `films/${pocketId}/${kind}.png`,
      Body: buf,
    };
    console.log(`Saving object... ${obj.Key} (${buf.length} Bytes)`);
    // require('fs').writeFile('zzzzz.png', buf, (e)=>{});
    s3.putObject(obj, (err, data) => {
      if (err) {
        rj(err);
      }
      if (data) {
        console.log('Saved!');
        rv(data);
      }
    });
  });
}
