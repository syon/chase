require("dotenv").config();
const Film = require("../lib/Film");

test("film.main", async () => {
  const params = {
    url: "http://example.com",
    pocketId: "0",
    suggestedImgUrl: null
  };
  const film = new Film(params);
  const r = await film.main();
  console.log(r);
});

test("Film.putBlankImage", async () => {
  const s3path = "blankimagetest";
  Film.putBlankImage(s3path);
});
