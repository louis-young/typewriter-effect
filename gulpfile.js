var gulp = require("gulp");
var plumber = require("gulp-plumber");
var autoprefixer = require("gulp-autoprefixer");
var rename = require("gulp-rename");
var concat = require("gulp-concat");
var order = require("gulp-order");
var uglify = require("gulp-uglifyes");
var sass = require("gulp-sass");
var imagemin = require("gulp-imagemin");
var sourcemaps = require("gulp-sourcemaps");
var eslint = require("gulp-eslint");
var browserSync = require("browser-sync").create();
const del = require('del');
const zip = require('gulp-zip');
const sassLint = require('gulp-sass-lint');
const wait = require('gulp-wait');
const babel = require('gulp-babel');
const rollup = require('gulp-rollup');

/**
 * Data object to hold file paths.
 */

const paths = {
  src: {
    styles: "public_html/src/stylesheets/*.**",
    scripts: "public_html/src/scripts/main*.js",
    vendor: "public_html/src/scripts/vendor/*.js",
    frameworks: "public_html/src/scripts/vendor/frameworks/*.min.js",
    html: "public_html/src/*.html",
    assets: "public_html/src/assets/**/"
  },
  dist: {
    styles: "public_html/dist/stylesheets/",
    scripts: "public_html/dist/scripts/",
    vendor: "public_html/dist/scripts/vendor",
    frameworks: "public_html/dist/scripts/vendor/frameworks/",
    html: "public_html/dist/",
    assets: "public_html/dist/assets/"
  }
};

/**
 * Styles task.
 *
 * Compile Sass to CSS, autoprefix and minify the code.
 */

gulp.task("styles", function () {
  gulp
    .src(paths.src.styles)
    .pipe(wait(500))
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(autoprefixer())
    .pipe(browserSync.stream())
    .pipe(
      sass({
        outputStyle: "compressed",
        errLogToConsole: true,
        includePaths: "./public_html/src/stylesheets"
      })
    )
    .pipe(
      rename({
        suffix: ".min"
      })
    )
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(paths.dist.styles));
  browserSync.reload();
});

/**
 * JavaScript tasks.
 *
 * Transpile and minify JavaScript if building.
 */

gulp.task("scripts", function () {
  gulp
    .src(paths.src.scripts)
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
    .pipe(concat("main.js"))
    .pipe(rename({
      suffix: ".min"
    }))
    .pipe(order(["main.js", "main.*.js"]))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(paths.dist.scripts));
  browserSync.reload();
});

gulp.task("scripts:build", function () {
  gulp
    .src(paths.src.scripts)
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
    .pipe(concat("main.js"))
    .pipe(rollup({
      allowRealFiles: true, // !IMPORTANT, it avoids the hypothetical file system error
      entry: 'public_html/src/scripts/main.js',
      plugins: [
          babel({
              presets: ['es2015-rollup'],
              babelrc: false
          })
      ],
      format: 'umd',
      moduleName: 'testing'
  }))
    // .pipe(babel({
    //   "presets": ["@babel/preset-env"]
    // }))
    // .pipe(uglify({
    //   mangle: false,
    //   ecma: 6
    // }))
    .pipe(rename({
      suffix: ".min"
    }))
    .pipe(order(["main.js", "main.*.js"]))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(paths.dist.scripts));
  browserSync.reload();
});

gulp.task("vendor", function () {
  gulp
    .src(paths.src.vendor)
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(concat("vendor.js"))
    .pipe(rename({
      suffix: ".min"
    }))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(paths.dist.vendor));
  browserSync.reload();
});

gulp.task("vendor:build", function () {
  gulp
    .src(paths.src.vendor)
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(concat("vendor.js"))
    .pipe(rename({
      suffix: ".min"
    }))
    .pipe(uglify({
      mangle: false,
      ecma: 7
    }))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(paths.dist.vendor));
  browserSync.reload();
});

gulp.task("frameworks", function () {
  gulp
    .src(paths.src.frameworks)
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(concat("frameworks.js"))
    .pipe(rename({
      suffix: ".min"
    }))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(paths.dist.frameworks));
  browserSync.reload();
});

gulp.task("frameworks:build", function () {
  gulp
    .src(paths.src.frameworks)
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(concat("frameworks.js"))
    .pipe(rename({
      suffix: ".min"
    }))
    .pipe(uglify({
      mangle: false,
      ecma: 7
    }))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(paths.dist.frameworks));
  browserSync.reload();
});


/**
 * HTML task.
 *
 * Copy markup files to the distributable folder.
 */

gulp.task("html", function () {
  gulp.src(paths.src.html).pipe(gulp.dest(paths.dist.html));
  browserSync.reload();
});

/**
 * Assets task.
 *
 * Minify assets if building.
 */

gulp.task("assets", function () {
  gulp
    .src(paths.src.assets)
    .pipe(imagemin())
    .pipe(gulp.dest(paths.dist.assets));
});

/**
 * Runtime tasks.
 */

// Watch task.
gulp.task("watch", function () {
  browserSync.init({
    server: "./public_html/dist/",
    notify: false,
    scrollProportionally: false,
    logLevel: "silent"
  });
  gulp.watch("./public_html/src/*.html", ["html"]);
  gulp.watch("./public_html/src/stylesheets/**/*.scss", ["styles"]);
  gulp.watch("./public_html/src/scripts/*.js", ["scripts"]);
  gulp.watch("./public_html/src/scripts/vendor/*.js", ["vendor"]);
  gulp.watch("./public_html/src/scripts/vendor/frameworks/**.*", ["frameworks"]);
  gulp.watch("public_html/src/assets/**", ["assets"]);
});

// Run task.
gulp.task("run", function () {
  browserSync.init({
    server: "./public_html/dist/",
    notify: false,
    scrollProportionally: false,
    logLevel: "silent"
  });
  gulp.watch("./public_html/src/*.html", ["html"]);
  gulp.watch("./public_html/src/stylesheets/**/*.scss", ["styles"]);
  gulp.watch("./public_html/src/scripts/*.js", ["scripts:build"]);
  gulp.watch("./public_html/src/scripts/vendor/*.js", ["vendor:build"]);
  gulp.watch("./public_html/src/scripts/vendor/frameworks/**.*", ["frameworks:build"]);
  gulp.watch("public_html/src/assets/**", ["assets"]);
});

// Build task.
gulp.task("build", function () {
  gulp.start("html", "styles", "scripts:build", "vendor:build", "frameworks:build", "assets");
});

// Clean task.
gulp.task("clean", function () {
  return del('./public_html/dist/**', {
    force: true
  });
});

// Package task.
gulp.task('package', function () {
  return gulp.src('./public_html/src/**')
    .pipe(zip('dist.zip'))
    .pipe(gulp.dest('.'));
});