var gulp = require('gulp'),
    gutil = require('gulp-util'),
    sass = require('gulp-sass'),
    rubysass = require('gulp-ruby-sass'),
    fileinclude = require('gulp-file-include'),
    rename = require('gulp-rename'),
    notify = require('gulp-notify'),
    livereload = require('gulp-livereload'),
    lr = require('tiny-lr'),
    connect = require('gulp-connect'),
    plumber = require('gulp-plumber'),
    autoprefixer = require('gulp-autoprefixer'),
    server = lr(),
    path = require("path");

var paths = {
  templates: './templates/',
  sass: 'css/source/'
};

// fileinclude: grab partials from templates and render out html files
// ==========================================
gulp.task('fileinclude', function() {
  return  gulp.src(path.join(paths.templates, '*.tpl.html'))
    .pipe(fileinclude())
    .pipe(rename({
      extname: ""
     }))
    .pipe(rename({
      extname: ".html"
     }))
    .pipe(gulp.dest('./'))
    .pipe(livereload(server))
    .pipe(notify({ message: 'Includes: included' }));
});

//  Sass: compile sass to css task - uses Libsass
//===========================================
gulp.task('sass', function() {
  return gulp.src(path.join(paths.sass, '*.scss'))
    .pipe(sass({ style: 'expanded', sourceComments: 'map', errLogToConsole: true}))
    .pipe(autoprefixer('last 2 version', "> 1%", 'ie 8', 'ie 9'))
    .pipe(gulp.dest('css'))
    .pipe(livereload(server))
    .pipe(notify({ message: 'LibSass files dropped!' }));
});

//  Sass: compile sass to css task
//===========================================
gulp.task('rubysass', function() {
  return gulp.src(path.join(paths.sass, '*.scss'))
    .pipe(plumber())
    .pipe(rubysass({ sourcemap: true, style: 'expanded'}))
    .pipe(autoprefixer('last 2 version', "> 1%", 'ie 8', 'ie 9'))
    .pipe(gulp.dest('css'))
    .pipe(livereload(server))
    .pipe(notify({ message: 'Ruby Sass files dropped!' }));
});


//  Connect: sever task
//===========================================
gulp.task('connect', connect.server({
  port: 1337,
  root: [__dirname],
  livereload: false
}));

function watchStuff(task) {
  // Listen on port 35729
  server.listen(35729, function (err) {
    if (err) {
      return console.error(err) 
      //TODO use notify to log a message on Sass compile fail and Beep
    };

    //Watch task for sass
    gulp.watch(path.join(paths.sass, '**/*.scss'), [task]);

    // watch task for gulp-includes
    gulp.watch(path.join(paths.templates, '**/*.html'), ['fileinclude']);

  });
}

//  Watch and Livereload using Libsass
//===========================================
gulp.task('watch', function() {

 watchStuff('sass');

});

//  Watch and Livereload using RUBY Sass
//===========================================
gulp.task('rubywatch', function() {

 watchStuff('rubysass');

});


//  Default Gulp Task
//===========================================
gulp.task('default', ['fileinclude', 'sass', 'connect', 'watch'], function() {

});

gulp.task('useruby', ['fileinclude', 'rubysass', 'connect', 'rubywatch'], function() {

});
