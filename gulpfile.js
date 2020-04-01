const gulp = require('gulp');
const gulpTS = require('gulp-typescript');
const gulpNodemon = require('gulp-nodemon');
const del = require('del');
const path = require('path');

const tsProject = gulpTS.createProject('tsconfig.json');

const build = function(cb) {
  del.sync(['./build/**/*.*']);
  gulp.src('./src/**/*.yml').pipe(gulp.dest('build/'));

  const tsCompile = gulp.src('./src/**/*.ts')
    .pipe(tsProject());
  tsCompile.js
    .pipe(gulp.dest('build/'));

  cb();
}

function watch(cb) {
  gulp.watch('./src/**/*.ts', build);
  cb();
}

function start(cb) {
  gulpNodemon({
    script: './build/index.js',
    watch: './build/',
  });
  cb();
}

exports.build = build;
exports.watch = gulp.series(build, watch);
exports.start = start;