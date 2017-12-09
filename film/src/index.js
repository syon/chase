const setup = require('./starter-kit/setup');
const AWS = require('aws-sdk');

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
  console.log(`URL: ${pocketId}`);
  const page = await browser.newPage();
  page.setViewport({width: 1024, height: 768});
  await page.goto(url);
  const buf = await page.screenshot();
  await page.close();
  await s3Put(pocketId, buf);
  return 'done.';
};

function s3Put(pocketId, buf) {
  return new Promise((rv, rj) => {
    const obj = {
      Bucket: 'syon-chase',
      Key: `films/${pocketId}/pc.png`,
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
