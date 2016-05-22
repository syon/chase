var fs = require("fs");
var browserify = require("browserify");
browserify("babel/app.js")
  .transform("babelify", {presets: ["es2015", "react"]})
  .bundle()
  .pipe(fs.createWriteStream("public/js/bundle.js"));
