require('dotenv').config()
const PocketAdaptor = require('../../lib/PocketAdaptor')

test('PocketAdaptor.pocketOauthRequest', async () => {
  const params = { redirect_uri: 'http://localhost' }
  const r = await PocketAdaptor.pocketOauthRequest(params)
  console.log(r)
  expect(r.request_token).toMatch(/[\w-]{30}/)
  expect(r.auth_uri).toMatch(/^https:\/\/getpocket.com/)
})

/** このタイミングで auth_uri にアクセスして認可“待ち”の状態にする */
/** 手動でリクエストトークンを変数にコピペして実行 */

test('PocketAdaptor.pocketOauthAuthorize', async () => {
  const code = '1111aaaa-a1a1-b2b2-223d-2bda52'
  const params = { code: code }
  const r = await PocketAdaptor.pocketOauthAuthorize(params)
  console.log(r)
  expect(r.access_token).toMatch(/[\w-]{30}/)
  expect(r.username).toBeTruthy()
})
