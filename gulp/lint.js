'use strict';
var gulp = require('gulp');
var gulpLoadPlugins = require('gulp-load-plugins');
var browserSync = require('browser-sync');

var $ = gulpLoadPlugins();
var reload = browserSync.reload;

function lint(files, options) {
  return function() {
    return gulp.src(files)
      .pipe(reload({
        stream: true,
        once: true
      }))
      .pipe($.eslint(options))
      .pipe($.eslint.format())
      .pipe($.if(!browserSync.active, $.eslint.failAfterError()));
  };
}

var lintOptions = {
    "rules": {
      "camelcase": 1,
      "comma-dangle": 2,
      "quotes": 0
    },
    "globals": {
      "jQuery": false,
      "$": true
    }
  },
  testLintOptions = lintOptions;

testLintOptions.env = {
  mocha: true
};

gulp.task('lint', lint('app/scripts/**/*.js', lintOptions));
gulp.task('lint:test', lint('test/spec/**/*.js', testLintOptions));
