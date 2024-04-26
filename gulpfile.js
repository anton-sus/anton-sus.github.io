const { src, dest, series, watch, parallel } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const browserSync = require('browser-sync').create();
const clean = require('gulp-clean');
const sourcemaps = require('gulp-sourcemaps');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const ts = require("gulp-typescript");

const SRC = "src";
const PATHS = {
    src: SRC,
    dist: 'dist',
    scss: `${SRC}/scss/**/*.scss`,
    js: `${SRC}/scripts/**/*.js`,
    ts: `${SRC}/scripts/**/*.ts`,
    html: `${SRC}/**/*.html`,
    images: `${SRC}/assets/**/*.*`
};

// Таск компиляции SASS в CSS
function buildSass() {
    return src(PATHS.scss)
        .pipe(sourcemaps.init())
        .pipe(sass({ includePaths: ['./node_modules'] }).on('error', sass.logError))
        .pipe(
            postcss([
                autoprefixer({
                    grid: true,
                    overrideBrowserslist: ['last 2 versions']
                }),
                cssnano()
            ])
        )
        .pipe(sourcemaps.write())
        .pipe(dest('src/css'))
        .pipe(dest('dist/css'))
        .pipe(browserSync.stream());
}

// Таск компиляции и сборки JavaScript файлов
function buildJs() {
    return src(PATHS.js)
        .pipe(concat('bundle.js'))
        .pipe(uglify())
        .pipe(dest(`${PATHS.src}/js`))
        .pipe(dest(`${PATHS.dist}/js`))
        .pipe(browserSync.stream());
}

// Таск компиляции TypeScript в JavaScript
function buildTs() {
    return src(PATHS.ts)
      .pipe(
        ts({
          target: "ES5",
          module: "CommonJS",
        })
      )
      .pipe(dest(`${PATHS.src}/js`))
      .pipe(dest(`${PATHS.dist}/js`))
      .pipe(browserSync.stream());
  }

// Таск работы с html файлами
function buildHtml() {
    return src(PATHS.html)
        .pipe(dest(PATHS.dist))
        .pipe(browserSync.stream());
}


// Таск копирования статичных файлов
function copy() {
    return src([PATHS.images], { base: PATHS.src }).pipe(dest(PATHS.dist));
}

// Таск очистки dist
function cleanDist() {
    return src('dist', { allowEmpty: true }).pipe(clean());
}

// Таск отслеживания изменения файлов
function serve() {
    watch(PATHS.scss, buildSass);
    watch(PATHS.html, buildHtml);
    watch(PATHS.js, buildJs);
    watch(PATHS.ts, buildTs);
}

// Создание дев-сервера
function createDevServer() {
    browserSync.init({
        server: PATHS.src,
        notify: false
    })
}

// exports.build = series(cleanDist, buildSass, buildHtml, copy);
// exports.default = series(buildSass, buildJs, buildTs, parallel(createDevServer, serve));

exports.build = series(
    cleanDist,
    parallel(buildSass, buildJs, buildTs, buildHtml, copy)
  );
  exports.default = series(
    parallel(buildSass, buildJs, buildTs, buildHtml, copy),
    parallel(createDevServer, serve)
  );
  
