var gulp = require('gulp');
var sass = require('gulp-sass');
var prefix = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync');
var useref = require('gulp-useref'); 
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var minifyCSS = require('gulp-minify-css');
//var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var runSequence = require('run-sequence');
var plumber = require('gulp-plumber');
var notify = require('gulp-notify'); //Error message
var uncss = require('gulp-uncss'); // Delites idle css
//var spritesmith = require('gulp.spritesmith'); // Spritemaker
var nunjucksRender = require('gulp-nunjucks-render');
var sassbeautify = require('gulp-sassbeautify');


// Pre-Development Tasks 
// -----------------

// Moves awesome-fonts to app/fonts before coding
// gulp.task('awesome', function() {
//     return gulp.src('bower_components/font-awesome/fonts/**.*')
//         .pipe(gulp.dest('./app/fonts'));
// });

// Spritemaker
// gulp.task('sprite', function () {
//   var spriteData = gulp.src('app/img/sprites/*.png').pipe(spritesmith({
//     imgName: 'sprite.png',
//     cssName: 'sprite.css'
//   }));
//   return spriteData.pipe(gulp.dest('app/img/'));
// });


// Development Tasks 
// -----------------
// Start browserSync server
gulp.task('browserSync', function() {
  browserSync({
    server: {
      baseDir: 'app/'
    },
    browser: 'chrome'
  })
})

//Plumber prevents Gulp crash in case of mistake
function customPlumber(errTitle) {
  return plumber({
    errorHandler: notify.onError({
      // Customizing error title
      title: errTitle || "Error running Sass",
      message: "Error: <%= error.message %>",
      sound: "true"
    })
  });
}

// Nunjucks rendering function - 17.09.2017
gulp.task('render', function () {
  return gulp.src('app/pages/**/*.nunjucks')
    .pipe(nunjucksRender({
      path: ['app/templates/'] // String or Array
    }))
    .pipe(gulp.dest('app'));
});

// Seems Doesn't work 5 Sept 2015 on Minit
// So, it's the second try 9 Dec 2015
// https://www.npmjs.com/package/gulp-sassbeautify
gulp.task('beautify-scss', function () {
  gulp.src('app/scss/*.scss')
    .pipe(sassbeautify())
    .pipe(gulp.dest('app'))
})

// Gulp Sass Task 
gulp.task('sass', function() {
  return gulp.src('app/scss/**/*.scss')
  // Checks for errors all plugins with custom plumber
    .pipe(customPlumber())
   // Initializes sourcemaps
    .pipe(sourcemaps.init())
   // Autoprefixer
    .pipe(prefix({
            browsers: ['last 2 versions'],
            cascade: false
        }))
    .pipe(sass({
      errLogToConsole: true
      }))
       // Delites idle css properties
    // .pipe(uncss({
    //         html: ['app/*.html']
    //     }))
    // Writes sourcemaps into the CSS file
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('app/css'))
     // Reloading the stream
    .pipe(browserSync.reload({
          stream: true
    }));
    
})

// Watchers
gulp.task('watch', function() {
  gulp.watch('app/scss/**/*.scss', ['sass']);
  gulp.watch('app/pages/**/*.nunjucks', ['render']);
  gulp.watch('app/templates/**/*.nunjucks', ['render']);
  gulp.watch('app/scss/**/*.scss', ['beautify-scss']);
  gulp.watch('app/*.html').on('change', browserSync.reload);
  gulp.watch('app/css/*.css').on('change', browserSync.reload);
  gulp.watch('app/js/**/*.js', browserSync.reload); 
})

// Gulp default task
gulp.task('default',[
  'sass', 
  'beautify-scss',
   'render', 
   'browserSync',
    'watch'
    ]);


// Optimization Tasks 
// ------------------

// Build Sequences
gulp.task('build', function(callback) {
  runSequence('clean:dist', 
    ['sass', 'useref', 'images', 'fonts'],
    callback
  )
})



// Optimizing CSS and JavaScript 
gulp.task('useref', function() {
  var assets = useref.assets();

  return gulp.src('app/*.html')
    .pipe(assets)
    // Minifies only if it's a CSS file
    .pipe(gulpIf('*.css', minifyCSS()))
    // Uglifies only if it's a Javascript file
    .pipe(gulpIf('*.js', uglify()))
    .pipe(assets.restore())
    .pipe(useref())
    .pipe(gulp.dest('dist'))
});

// Optimizing Images 
// gulp.task('images', function() {
//   return gulp.src('app/img/*.+(png|jpg|jpeg|gif|svg)')
  // Caching images that ran through imagemin
//   .pipe(cache(imagemin({
//       interlaced: true,
//     })))
//   .pipe(gulp.dest('dist/img'))
// });

// Copying fonts 
gulp.task('fonts', function() {
  return gulp.src('app/fonts/**/*')
  .pipe(gulp.dest('dist/fonts'))
})

// Cleaning 
gulp.task('clean', function(callback) {
  del('dist');
  return cache.clearAll(callback);
})

gulp.task('clean:dist', function(callback) {
  del(['dist/**/*', '!dist/img', '!dist/img/**/*'], callback)
});


