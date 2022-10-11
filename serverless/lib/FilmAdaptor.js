const Film = require('./Film')

module.exports.main = (arg) => {
  const params = {
    url: arg.url,
    pocketId: arg.pocket_id,
    suggestedImgUrl: arg.image_suggested,
  }
  const film = new Film(params)
  return film.main()
}
