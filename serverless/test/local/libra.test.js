require('dotenv').config()
const Film = require('../../lib/Film')

test('film.main', async () => {
  const params = {
    url: 'https://anond.hatelabo.jp/20200102163416',
    pocketId: '2840521172',
    suggestedImgUrl: null
  }
  const film = new Film(params)
  const r = await film.main()
  console.log(r)
})

// test('Film.putBlankImage', async () => {
//   const s3path = 'blankimagetest'
//   Film.putBlankImage(s3path)
// })
