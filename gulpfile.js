'use strict';

var gulp = require('gulp');
var karma = require('karma');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var jshint = require('gulp-jshint');

gulp.task('karma', function (done) {
  karma.server.start({
    configFile: __dirname + '/karma.conf.js'
  }, done);
});

gulp.task('jshint', function () {
  return gulp.src('./!(*min*).js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('build', ['karma', 'jshint'], function () {
  return gulp.src('./angular-stash.js')
    .pipe(uglify())
    .pipe(rename('angular-stash.min.js'))
    .pipe(gulp.dest('./'));
});