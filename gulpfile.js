var gulp = require('gulp'),
  sass = require('gulp-sass'),
  uglify = require('gulp-uglify'),
  minifycss = require('gulp-minify-css'),
  fileinclude = require('gulp-file-include'),
  rename = require('gulp-rename'),
  notify = require('gulp-notify'),
  livereload = require('gulp-livereload'),
  lr = require('tiny-lr'),
  connect = require('gulp-connect'),
  autoprefixer = require('gulp-autoprefixer'),
  server = lr(),
  path = require('path');

var paths = {
  source: './src/',
  dist: './dist/',

  css: 'css/',
  js: 'js/',
  assets: 'assets/'
};

// fileinclude: grab partials from templates and render out html files
// ==========================================
gulp.task('fileinclude', function() {
  return gulp.src(path.join(paths.source, '*.tpl'))
    .pipe(fileinclude())
    .pipe(rename({
      extname: ''
    }))
    .pipe(rename({
      extname: '.html'
    }))
    .pipe(gulp.dest(paths.dist))
    .pipe(livereload(server))
    .pipe(notify({
      message: 'fileinclude'
    }));
});

//  Sass: compile sass to css task - uses Libsass
//===========================================
gulp.task('sass', function() {
  return gulp.src(path.join(paths.source, paths.css, '*.scss'))
    .pipe(sass({
      style: 'expanded',
      sourceComments: 'map',
      errLogToConsole: true
    }))
    .pipe(minifycss({
      compatibility: 'ie8'
    }))
    .pipe(autoprefixer('last 2 version', '> 1%', 'ie 8', 'ie 9'))
    .pipe(gulp.dest(path.join(paths.dist, paths.css)))
    .pipe(livereload(server))
    .pipe(notify({
      message: 'sass'
    }));
});

//  uglify js files
//===========================================
gulp.task('uglify', function() {
  return gulp.src(path.join(paths.source, paths.js, '*.js'))
    .pipe(uglify({
      mangle: true
    }))
    .pipe(gulp.dest(path.join(paths.dist, paths.js)))
    .pipe(livereload(server))
    .pipe(notify({
      message: 'uglify'
    }));
});

//  moving assets files
//===========================================
gulp.task('assets', function() {
  return gulp.src(path.join(paths.source, paths.assets, '*'))
    .pipe(gulp.dest(path.join(paths.dist, paths.assets)))
    .pipe(livereload(server))
    .pipe(notify({
      message: 'assets'
    }));

});


//  Connect: sever task
//===========================================
gulp.task('connect', function() {
  connect.server({
    port: 1337,
    root: [__dirname],
    livereload: false
  });
});

//  Watch and Livereload using Libsass
//===========================================
gulp.task('watch', function() {
  // Listen on port 35729
  server.listen(35729, function(err) {
    if (err) {
      return console.error(err);
      //TODO use notify to log a message on Sass compile fail and Beep
    }

    //Watch task for sass
    gulp.watch(path.join(paths.source, paths.css, '**/*.scss'), ['sass']);

    //Watch task for js
    gulp.watch(path.join(paths.source, paths.js, '**/*.js'), ['uglify']);

    // watch task for gulp-includes
    gulp.watch(path.join(paths.source, '**/*.html'), ['fileinclude']);

  });
});


//  Default Gulp Task
//===========================================
gulp.task('default', ['fileinclude', 'sass', 'uglify', 'assets', 'connect', 'watch'], function() {

});
