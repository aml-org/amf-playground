'use strict'

var gulp = require('gulp')

var browserify = require('browserify')
var tsify = require('tsify')
var watchify = require('watchify')
var babelify = require('babelify')
var source = require('vinyl-source-stream')
var buffer = require('vinyl-buffer')
var gutil = require('gulp-util')
var sourcemaps = require('gulp-sourcemaps')
var browserSync = require('browser-sync').create()
var bower = require('gulp-bower')
var sass = require('gulp-sass')

gulp.task('bower', function () {
  return bower({cwd: 'docs'})
})

gulp.task('sass', function () {
  return gulp.src('./docs/scss/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./docs/css'))
})

const options = {'standalone': 'amf_playground'}
const bPlayground = watchify(browserify(options))
gulp.task('bundlePlayground', function () {
  return bPlayground
    .add([
      'src/playground/view_model.ts'
    ])
    .plugin(tsify, { target: 'es6' })
    .transform(babelify, { extensions: [ '.tsx', '.ts' ] })
    .bundle()
  // log errors if they happen
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source('amf_playground.js'))
  // optional, remove if you don't need to buffer file contents
    .pipe(buffer())
  // optional, remove if you dont want sourcemaps
    .pipe(sourcemaps.init({loadMaps: true})) // loads map from browserify file
  // Add transformation tasks to the pipeline here.
    .pipe(sourcemaps.write('./')) // writes .map file
    .pipe(gulp.dest('./docs/js'))
    .pipe(browserSync.stream({once: true}))

})

const optionsValidation = {'standalone': 'amf_playground_validation'}
const bValidation = watchify(browserify(optionsValidation))
gulp.task('bundleValidation', function () {
  return bValidation
    .add([
      'src/validation/view_model.ts'
    ])
    .plugin(tsify, { target: 'es5' })
  // .transform(babelify, { extensions: [ '.tsx', '.ts' ] })
    .bundle()
  // log errors if they happen
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source('amf_playground_validation.js'))
  // optional, remove if you don't need to buffer file contents
    .pipe(buffer())
  // optional, remove if you dont want sourcemaps
    .pipe(sourcemaps.init({loadMaps: true})) // loads map from browserify file
  // Add transformation tasks to the pipeline here.
    .pipe(sourcemaps.write('./')) // writes .map file
    .pipe(gulp.dest('./docs/js'))
    .pipe(browserSync.stream({once: true}))
})

const optionsDiff = {'standalone': 'amf_playground_diff'}
const bDiff = watchify(browserify(optionsDiff))
gulp.task('bundleDiff', function () {
  return bDiff
    .add([
      'src/diff/view_model.ts'
    ])
    .plugin(tsify, { target: 'es5' })
  // .transform(babelify, { extensions: [ '.tsx', '.ts' ] })
    .bundle()
  // log errors if they happen
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source('amf_playground_diff.js'))
  // optional, remove if you don't need to buffer file contents
    .pipe(buffer())
  // optional, remove if you dont want sourcemaps
    .pipe(sourcemaps.init({loadMaps: true})) // loads map from browserify file
  // Add transformation tasks to the pipeline here.
    .pipe(sourcemaps.write('./')) // writes .map file
    .pipe(gulp.dest('./docs/js'))
    .pipe(browserSync.stream({once: true}))
})

const optionsVocabularies = {'standalone': 'amf_playground_vocabs'}
const bVocabularies = watchify(browserify(optionsVocabularies))
gulp.task('bundleVocabularies', function () {
  return bVocabularies
    .add([
      'src/vocabularies/view_model.ts'
    ])
    .plugin(tsify, { target: 'es5' })
  // .transform(babelify, { extensions: [ '.tsx', '.ts' ] })
    .bundle()
  // log errors if they happen
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source('amf_playground_vocabs.js'))
  // optional, remove if you don't need to buffer file contents
    .pipe(buffer())
  // optional, remove if you dont want sourcemaps
    .pipe(sourcemaps.init({loadMaps: true})) // loads map from browserify file
  // Add transformation tasks to the pipeline here.
    .pipe(sourcemaps.write('./')) // writes .map file
    .pipe(gulp.dest('./docs/js'))
    .pipe(browserSync.stream({once: true}))
})

const optionsCustomValidation = {'standalone': 'amf_playground_custom_validation'}
const bCustomValidation = watchify(browserify(optionsCustomValidation))
gulp.task('bundleCustomValidation', function () {
  return bCustomValidation
    .add([
      'src/custom_validation/view_model.ts'
    ])
    .plugin(tsify, { target: 'es5' })
  // .transform(babelify, { extensions: [ '.tsx', '.ts' ] })
    .bundle()
  // log errors if they happen
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source('amf_playground_custom_validation.js'))
  // optional, remove if you don't need to buffer file contents
    .pipe(buffer())
  // optional, remove if you dont want sourcemaps
    .pipe(sourcemaps.init({loadMaps: true})) // loads map from browserify file
  // Add transformation tasks to the pipeline here.
    .pipe(sourcemaps.write('./')) // writes .map file
    .pipe(gulp.dest('./docs/js'))
    .pipe(browserSync.stream({once: true}))
})

gulp.task('servePlayground', gulp.series(
  'sass',
  'bower',
  'bundlePlayground',
  function () {
    browserSync.init({
      server: 'docs',
      startPath: '/playground.html'
    })
  }
))

gulp.task('serveValidation', gulp.series(
  'sass',
  'bower',
  'bundleValidation',
  function () {
    browserSync.init({
      server: 'docs',
      startPath: '/validation.html'
    })
  }
))

gulp.task('serveDiff', gulp.series(
  'sass',
  'bower',
  'bundleDiff',
  function () {
    browserSync.init({
      server: 'docs',
      startPath: '/diff.html'
    })
  }
))

gulp.task('serveVocabularies', gulp.series(
  'sass',
  'bower',
  'bundleVocabularies',
  function () {
    browserSync.init({
      server: 'docs',
      startPath: '/vocabularies.html'
    })
  }
))

gulp.task('serveCustomValidation', gulp.series(
  'sass',
  'bower',
  'bundleCustomValidation',
  function () {
    browserSync.init({
      server: 'docs',
      startPath: '/custom_validation.html'
    })
  }
))
