var properties = {
  port: 8080, // LiveReload server port
  folders: {
    build: '../', // Deploy folder
    src: 'source', // Dev folder
  }
}

var plugins = {
  js: [
    'bower_components/jquery/dist/jquery.min.js',
  ],
  css: [
    'bower_components/normalize-scss/normalize.css',
  ]
}

var
  gulp = require('gulp'),
  connect = require('gulp-connect'),
  sourcemaps = require('gulp-sourcemaps'),
  concat = require('gulp-concat'),
  jade = require('gulp-jade'),
  sass = require('gulp-sass'),
  prefix = require('gulp-autoprefixer')
  babel = require('gulp-babel'),
  //uglify = require('gulp-uglify'),
  watch = require('gulp-watch');
  //cleanCSS = require('gulp-clean-css');

function onError (err) {
  console.log(err);
  this.emit('end');
}

gulp.task('scripts', function() {
  return gulp.src([
      properties.folders.src + '/scripts/main.js',
    ])
    .pipe(sourcemaps.init())
    //.pipe(uglify())
    .pipe(concat('main.js'))
    .pipe(babel())
    .on('error', onError)
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(properties.folders.build + '/scripts'))
    .pipe(connect.reload());
});

gulp.task('vendor', function () {
	gulp.src(plugins.css)
	  .pipe(concat('vendor.css'))
	  .pipe(gulp.dest(properties.folders.build + '/styles/'));
	gulp.src(plugins.js)
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest(properties.folders.build + '/scripts/'));
});

gulp.task('jade', function() {
	gulp.src(properties.folders.src + '/views/*.jade')
		.pipe(jade({
			pretty: true
		}))
    .on('error', onError)
		.pipe(gulp.dest(properties.folders.build))
    .on('end', function(){
      gulp.src(properties.folders.build + '/**/*.html')
        .pipe(connect.reload());
    });
});

gulp.task('sass', function () {
	gulp.src(properties.folders.src + '/styles/main.scss')
    .pipe(sourcemaps.init())
		.pipe(sass.sync().on('error', sass.logError))
		.pipe(prefix("last 3 version", "> 1%", "ie 8", "ie 7"))
    //.pipe(cleanCSS({compatibility: 'ie9'}))
    .pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(properties.folders.build + '/styles'))
		.pipe(connect.reload());
});

gulp.task('server', function() {
  connect.server({
    port: properties.port,
		root: properties.folders.build,
		livereload: true
	});
});

gulp.task('watch', function() {
	watch(properties.folders.src + '/views/**/*.jade', function() {
    gulp.start('jade');
	});
	watch(properties.folders.src + '/styles/**/*.scss', function() {
    gulp.start('sass');
	});
	watch(properties.folders.src + '/scripts/**/*.js', function() {
    gulp.start('scripts');
	});
});

gulp.task('default', ['server', 'jade', 'scripts', 'vendor', 'sass', 'watch']);
