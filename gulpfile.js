'use strict'

const gulp = require('gulp')

const browserify = require('browserify')
const tsify = require('tsify')
const babelify = require('babelify')
const source = require('vinyl-source-stream')
const buffer = require('vinyl-buffer')
const sourcemaps = require('gulp-sourcemaps')
const browserSync = require('browser-sync').create()
const sass = require('gulp-sass')
const cleanCSS = require('gulp-clean-css')
const log = require('fancy-log')

function bundleHandler (name) {
  return function bundle () {
    return browserify({ standalone: name })
      .add([
        `./src/${name}/view_model.ts`
      ])
      .plugin(tsify)
      .transform(babelify, { extensions: ['.tsx', '.ts'] })
      .bundle().on('error', log)
      .pipe(source(`${name}.js`))
      .pipe(buffer())
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('./docs/js'))
      .pipe(browserSync.stream({ once: true }))
  }
}

function serveHandler (name) {
  return function serve () {
    return browserSync.init({
      server: 'docs',
      startPath: `/${name}.html`
    })
  }
}

function watchHandler (name, bundlerName) {
  return function watch () {
    gulp.watch(
      [
        `./src/${name}/*.ts`,
        './src/main/*.ts'
      ],
      gulp.series(bundlerName, 'browserSyncReload')
    )
    gulp.watch(
      './docs/scss/**/*.scss',
      gulp.series('css', 'browserSyncReload')
    )
  }
}

gulp.task('browserSyncReload', function (done) {
  browserSync.reload()
  done()
})

gulp.task('css', function () {
  return gulp
    .src('./docs/scss/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(cleanCSS({ level: { 2: { all: true } } }))
    .pipe(gulp.dest('./docs/css'))
})

/* Bundlers */
gulp.task('bundleValidation', bundleHandler('validation'))
gulp.task('bundleVisualization', bundleHandler('visualization'))

/* Servers  */
gulp.task('serveValidation', gulp.series(
  'css',
  'bundleValidation',
  gulp.parallel(
    serveHandler('validation'),
    watchHandler('validation', 'bundleValidation')
  )
))

gulp.task('serveVisualization', gulp.series(
  'css',
  'bundleVisualization',
  gulp.parallel(
    serveHandler('visualization'),
    watchHandler('visualization', 'bundleVisualization')
  )
))

/* Bundle all the demos */
gulp.task('bundleAll', gulp.series(
  'css',
  'bundleValidation',
  'bundleVisualization'
))
