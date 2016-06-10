/* ES5 */
var gulp = require('gulp'),
    fs = require('fs'),
    source = require('vinyl-source-stream'),
    babelify = require('babelify'),
    browserify = require('browserify'),
    minifyify = require('minifyify'),
    watchify = require('watchify'),
    less = require('gulp-less'),
    path = require('path');

var bundler = browserify({
  entries: ['babel/app.js'],
  transform: [[babelify, {presets: ["es2015", "react"]}]],
  debug: true // sourcemapping
});

gulp.task('browserify', function () {
  bundler.plugin('minifyify', {map: 'map.json', output: './public/js/map.json'});
  bundler.bundle().pipe(fs.createWriteStream("public/js/bundle.js"));
});

gulp.task('watch', function () {
  var watcher = watchify(bundler);
  return watcher
    .on('update', function () {
      var updateStart = Date.now();
      watcher.bundle()
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('./public/js/'));
      console.log('Updated in ', (Date.now() - updateStart) + 'ms');
    })
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('./public/js/'));
});

gulp.task('less', function () {
  return gulp.src('./less/**/*.less')
    .pipe(less({
      paths: [ path.join(__dirname, 'less', 'includes') ]
    }))
    .pipe(gulp.dest('./public/css'));
});

gulp.task('default', ['watch', 'less']);
gulp.task('bundle', ['browserify', 'less']);
