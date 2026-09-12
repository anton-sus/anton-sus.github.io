const { src, dest, series, watch, parallel } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const browserSync = require('browser-sync').create();
const sourcemaps = require('gulp-sourcemaps');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const ts = require('gulp-typescript');
const fs = require('fs');

const SRC = 'src';
const PATHS = {
  src: SRC,
  dist: 'dist',
  scss: `${SRC}/scss/**/*.scss`,
  js: `${SRC}/scripts/**/*.js`,
  ts: `${SRC}/scripts/**/*.ts`,
  html: `${SRC}/**/*.html`,
  images: `${SRC}/assets/**/*.*`
};

// Компиляция SASS
function buildSass() {
  return src(PATHS.scss)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(sourcemaps.write('.'))
    .pipe(dest(`${PATHS.dist}/css`))
    .pipe(browserSync.stream());
}

// Сборка JavaScript
function buildJs() {
  return src(PATHS.js)
    .pipe(concat('app.js'))
    .pipe(uglify())
    .pipe(dest(`${PATHS.dist}/js`))
    .pipe(browserSync.stream());
}

// Компиляция TypeScript
function buildTs() {
  return src(PATHS.ts)
    .pipe(ts())
    .pipe(dest(`${PATHS.dist}/js`))
    .pipe(browserSync.stream());
}

// Обработка HTML
function buildHtml() {
  return src(PATHS.html)
    .pipe(dest(PATHS.dist))
    .pipe(browserSync.stream());
}

// Копирование статики
function copyAssets() {
  return src(PATHS.images)
    .pipe(dest(`${PATHS.dist}/assets`));
}

// Очистка dist
function cleanDist(done) {
  fs.rm(PATHS.dist, { recursive: true, force: true }, done);
}

// Запуск сервера
function serve() {
  browserSync.init({
    server: {
      baseDir: PATHS.dist
    },
    listen: '127.0.0.1',
    host: '127.0.0.1',
    port: 3000,
    notify: false,
    open: false
  });

  watch(PATHS.scss, buildSass);
  watch(PATHS.js, buildJs);
  watch(PATHS.ts, buildTs);
  watch(PATHS.html, buildHtml);
  watch(PATHS.images, copyAssets);
}

// Production сборка
exports.build = series(
  cleanDist,
  parallel(buildSass, buildJs, buildTs, buildHtml, copyAssets)
);

// Dev сервер
exports.default = series(
  cleanDist,
  parallel(buildSass, buildJs, buildTs, buildHtml, copyAssets),
  serve
);
