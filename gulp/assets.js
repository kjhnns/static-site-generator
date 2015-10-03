'use strict';

var gulp = require('gulp');
var gulpLoadPlugins = require('gulp-load-plugins');
var browserSync = require('browser-sync');

var $ = gulpLoadPlugins();
var reload = browserSync.reload;

gulp.task('styles', function() {
  return gulp.src('app/styles/*.scss')
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.sass.sync({
      outputStyle: 'expanded',
      precision: 10,
      includePaths: ['.']
    }).on('error', $.sass.logError))
    .pipe($.autoprefixer({browsers: ['last 1 version']}))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('.tmp/styles'))
    .pipe(reload({stream: true}));
});


gulp.task('include', function() {
  return gulp.src('app/*.tpl')
    .pipe($.fileInclude())
    .pipe($.rename({
      extname: ''
    }))
    .pipe($.rename({
      extname: '.html'
    }))
    .pipe(gulp.dest(".tmp"))
    .pipe(reload({stream: true}));
});

gulp.task('html', ['styles', 'include'], function() {
  var assets = $.useref.assets({searchPath: ['.tmp', 'app', '.']});

  return gulp.src(['.tmp/*.html'])
    .pipe(assets)
    .pipe($.if('*.js', $.uglify()))
    .pipe($.if('*.css', $.minifyCss({compatibility: '*'})))
    .pipe(assets.restore())
    .pipe($.useref())
    .pipe($.if('*.html', $.minifyHtml({conditionals: true, loose: true})))
    .pipe(gulp.dest('dist'));
});


gulp.task('images', function() {
  return gulp.src('app/images/**/*')
    .pipe($.if($.if.isFile, $.cache($.imagemin({
      progressive: true,
      interlaced: true,
      // don't remove IDs from SVGs, they are often used
      // as hooks for embedding and styling
      svgoPlugins: [{cleanupIDs: false}]
    }))
    .on('error', function (err) {
      console.log(err);
      this.end();
    })))
    .pipe(gulp.dest('dist/images'));
});

gulp.task('fonts', function() {
  return gulp.src(require('main-bower-files')({
    filter: '**/*.{eot,svg,ttf,woff,woff2}'
  }).concat('app/fonts/**/*'))
    .pipe(gulp.dest('.tmp/fonts'))
    .pipe(gulp.dest('dist/fonts'));
});

gulp.task('extras', function() {
  return gulp.src([
    'app/*.*',
    '!app/*.tpl',
    '!app/*.html'
  ], {
    dot: true
  }).pipe(gulp.dest('dist'));
});
