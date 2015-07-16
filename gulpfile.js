/*!
 * https://markgoodyear.com/2014/01/getting-started-with-gulp/
 * gulp
 * $ npm install gulp-ruby-sass gulp-autoprefixer gulp-minify-css gulp-jshint gulp-concat gulp-uglify gulp-imagemin gulp-notify gulp-rename gulp-livereload gulp-cache del --save-dev
 */
 
// Load plugins
var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    del = require('del'),
    jasmine = require('gulp-jasmine'),
    jasmine_node = require('jasmine-node'),
    reporters = require('jasmine-reporters');

// Styles
gulp.task('styles', function() {
  return sass('src/styles/css/style.scss')
    .pipe(autoprefixer('last 2 version'))
    // .pipe(sass({sourcemap: true, sourcemapPath: './sass/'}))
    .on('error', function (err) { console.log(err.message); })
    .pipe(minifycss())
    .pipe(gulp.dest('dist/styles/css'))
    .pipe(notify({ message: 'Styles task complete' }));
});

// Scripts
gulp.task('scripts', function() {
  return gulp.src('src/scripts/**/*.js')
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'))
    .pipe(concat('app.js'))
    .pipe(gulp.dest('dist/scripts'))
    .pipe(rename({ suffix: '.min' }))
    // .pipe(uglify())  // crashes - uglify error.
    // .on('error', function(){
    //   //do whatever here
    // })
    .pipe(gulp.dest('dist/scripts'))
    .pipe(notify({ message: 'Scripts task complete' }));
});
 
// Images
gulp.task('images', function() {
  return gulp.src('src/images/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest('dist/images/'))
    .pipe(notify({ message: 'Images task complete' }));
});

// Clean
gulp.task('clean', function(cb) {
    del(['dist/styles/css', 'dist/scripts/js', 'dist/images/img'], cb)
});
 
// Default task
gulp.task('default', ['clean'], function() {
  gulp.start('styles', 'scripts', 'images');
});
 
// Watch
gulp.task('watch', function() {
 
  // Watch .scss files
  gulp.watch('src/styles/**/*.scss', ['styles']);
 
  // Watch .js files
  gulp.watch('src/scripts/**/*.js', ['scripts']);
 
  // Watch image files
  gulp.watch('src/images/**/*', ['images']);
 
  // Create LiveReload server
  livereload.listen();

  // Watch any files in dist/, reload on change
  gulp.watch(['dist/**', 'dist/**/**']).on('change', livereload.changed)

});

// Gulp reference

// jasmineBrowser = require('gulp-jasmine-browser'),
// source = require('vinyl-source-stream'),
// browserify = require('browserify'),
// watchify = require('watchify'),
// reactify = require('reactify'), 
// gulpif = require('gulp-if'),
// streamify = require('gulp-streamify'),
// notify = require('gulp-notify'),
// cssmin = require('gulp-cssmin'),
// gutil = require('gulp-util'),
// shell = require('gulp-shell'),
// glob = require('glob'),

// jasminePhantomJs = require('gulp-jasmine2-phantomjs')

// browserifyTask({
//   development: true,
//   src: './src/main.js',
//   dest: './dist/'
// });

// cssTask({
//   development: true,
//   src: './styles/**/*.css',
//   dest: './dist'
// });

// gulp.task('specs', function() {
//   return gulp.src('src/spec/**/*')
//     .pipe(gulp.dest('dist/spec'))
//     .pipe(notify({ message: 'Specs task complete' }));
// });

// gulp.watch(['spec/**', 'spec/**/**']).on('change', redoTests);


// function redoTests() {
//   console.log("Run Tests");
//   gulp.src('spec/test/test.spec.js')
//     .pipe(jasmine({
//         reporter: new reporters.JUnitXmlReporter()
//     }));
// }


// gulp.task('test', function () {
//     return gulp.src('spec/tests/test.spec.js')
//         .pipe(jasmine({
//             reporter: new reporters.JUnitXmlReporter()
//         }));
// });



// gulp.task('deploy', function () {

//   browserifyTask({
//     development: false,
//     src: './src/main.js',
//     dest: './dist/'
//   });
  
//   cssTask({
//     development: false,
//     src: './styles/**/*.css',
//     dest: './dist'
//   });

// });

// Runs the test with phantomJS and produces XML files
// that can be used with f.ex. jenkins
// gulp.task('test', function () {
//     return gulp.src('./dist/spec/testrunner-phantomjs.html')
//       .pipe(jasminePhantomJs());
// });


  // return gulp.src('src/scripts/**/*.js')
  //   .pipe(jshint('.jshintrc'))
  //   .pipe(jshint.reporter('default'))
  //   .pipe(concat('app.js'))
  //   .pipe(gulp.dest('dist/scripts'))
  //   .pipe(rename({ suffix: '.min' }))
  //   // .pipe(uglify())  // crashes - uglify error.
  //   // .on('error', function(){
  //   //   //do whatever here
  //   // })
  //   .pipe(gulp.dest('dist/scripts'))
  //   .pipe(notify({ message: 'Scripts task complete' }));


// gulp.task('jasmine', function() {
//   var filesForTest = [ 'src/spec/*.js','src/spec/**/*.js', 'src/spec/*.spec.js','src/spec/**/*.spec.js'];
//   return gulp.src(filesForTest)
//     .pipe(gulp.watch(filesForTest))
//     .pipe(jasmineBrowser.specRunner())
//     .pipe(jasmineBrowser.server({port: 8888}));
// });

// gulp.task('jasmine-phantom', function() {
//   var filesForTest = [ 'src/spec/*.js','src/spec/**/*.js', 'src/spec/*.spec.js','src/spec/**/*.spec.js'];
//   return gulp.src(filesForTest)
//     .pipe(jasmineBrowser.specRunner({console: true}))
//     .pipe(jasmineBrowser.headless());
// });


// We create an array of dependencies. These are NPM modules you have
// installed in node_modules. Think: "require('react')" or "require('underscore')"
// var dependencies = [
//     'react' // react is part of this boilerplate
// ];

// Now this task both runs your workflow and deploys the code,
// so you will see "options.development" being used to differenciate
// what to do
// var browserifyTask = function (options) {

//   /* First we define our application bundler. This bundle is the
//      files you create in the "app" folder */
//     var appBundler = browserify({
//         entries: [options.src], // The entry file, normally "main.js"
//         transform: [reactify], // Convert JSX style
//         debug: options.development, // Sourcemapping
//         cache: {}, 
//         packageCache: {}, 
//         fullPaths: true // Requirement of watchify
//     });

//     /* We set our dependencies as externals of our app bundler.
//      For some reason it does not work to set these in the options above */
//   appBundler.external(options.development ? dependencies : []);
  
//   /* This is the actual rebundle process of our application bundle. It produces
//     a "main.js" file in our "build" folder. */
//   var rebundle = function () {
//     var start = Date.now();
//     console.log('Building APP bundle');
//     appBundler.bundle()
//       .on('error', gutil.log)
//       .pipe(source('main.js'))
//       .pipe(gulpif(!options.development, streamify(uglify())))
//       .pipe(gulp.dest(options.dest))
//       .pipe(gulpif(options.development, livereload())) // It notifies livereload about a change if you use it
//       .pipe(notify(function () {
//         console.log('APP bundle built in ' + (Date.now() - start) + 'ms');
//       }));
//   };

//   /* When we are developing we want to watch for changes and
//     trigger a rebundle */
//   if (options.development) {
//     appBundler = watchify(appBundler);
//     appBundler.on('update', rebundle);
//   }
  
//   // And trigger the initial bundling
//   rebundle();

//   if (options.development) {

//     // We need to find all our test files to pass to our test bundler
//     var testFiles = glob.sync('./src/spec/*.spec.js');
//     // var testFiles = glob.sync('./specs/**/*-spec.js');
    
//     /* This bundle will include all the test files and whatever modules
//        they require from the application */
//     var testBundler = browserify({
//       entries: testFiles,
//       debug: true,
//       transform: [reactify],
//       cache: {}, packageCache: {}, fullPaths: true // Requirement of watchify
//     });

//     // Again we tell this bundle about our external dependencies
//     testBundler.external(dependencies);

//     /* Now this is the actual bundle process that ends up in a "specs.js" file
//       in our "build" folder */
//     var rebundleTests = function () {
//       var start = Date.now();
//       console.log('Building TEST bundle');
//       testBundler.bundle()
//         .on('error', gutil.log)
//         .pipe(source('spec/specs.js'))
//         .pipe(gulp.dest(options.dest))
//         .pipe(livereload()) // Every time it rebundles it triggers livereload
//         .pipe(notify(function () {
//           console.log('TEST bundle built in ' + (Date.now() - start) + 'ms');
//         }));
//     };
    
//     // We watch our test bundle
//     testBundler = watchify(testBundler);
    
//     // We make sure it rebundles on file change
//     testBundler.on('update', rebundleTests);
    
//     // Then we create the first bundle
//     rebundleTests();

//     /* And now we have to create our third bundle, which are our external dependencies,
//       or vendors. This is React JS, underscore, jQuery etc. We only do this when developing
//       as our deployed code will be one file with all application files and vendors */
//     var vendorsBundler = browserify({
//       debug: true, // It is nice to have sourcemapping when developing
//       require: dependencies
//     });
    
//     /* We only run the vendor bundler once, as we do not care about changes here,
//       as there are none */
//     var start = new Date();
//     console.log('Building VENDORS bundle');
//     vendorsBundler.bundle()
//       .on('error', gutil.log)
//       .pipe(source('scripts/vendors.js'))
//       .pipe(gulpif(!options.development, streamify(uglify())))
//       .pipe(gulp.dest(options.dest))
//       .pipe(notify(function () {
//         console.log('VENDORS bundle built in ' + (Date.now() - start) + 'ms');
//       }));
    
//   }
  
// }

// // We also have a simple css task here that you can replace with
// // SaSS, Less or whatever
// var cssTask = function (options) {
//     if (options.development) {
//       var run = function () {
//         gulp.src(options.src)
//           .pipe(concat('style.css'))
//           .pipe(gulp.dest(options.dest));
//       };
//       run();
//       gulp.watch(options.src, run);
//     } else {
//       gulp.src(options.src)
//         .pipe(concat('style.css'))
//         .pipe(cssmin())
//         .pipe(gulp.dest(options.dest));   
//     }
// }

