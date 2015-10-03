'use strict';

var gulp = require('gulp');
var gulpLoadPlugins = require('gulp-load-plugins');
var del = require('del');

var $ = gulpLoadPlugins();


gulp.task('build', ['lint', 'html', 'images', 'fonts', 'extras'], function() {
  return gulp.src('dist/**/*').pipe($.size({title: 'build', gzip: true}));
});


gulp.task('clean', del.bind(null, ['.tmp', 'dist']));
