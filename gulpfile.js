var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var clean = require('gulp-clean');
var templatecache = require('gulp-angular-templatecache');

var dest = 'static';
var src = 'frontend';

var toCopy = [
    src + "/index.html"
];

var css = [
    //"node_modules/foundation-sites/css/normalize.min.css",
    "node_modules/foundation-sites/css/foundation.min.css",
    src + "/styles.css"
];

var vendors = [
    "node_modules/jquery/dist/jquery.min.js",
    "node_modules/svg-pan-zoom/dist/svg-pan-zoom.min.js",
    "node_modules/angular/angular.min.js",
    "node_modules/angular-route/angular-route.min.js",
    "node_modules/foundation-sites/js/foundation/foundation.js",
    "node_modules/foundation-sites/js/foundation/foundation.topbar.js"
];

gulp.task('clean', function () {
    return gulp.src(dest, {read: false})
        .pipe(clean());
});

gulp.task('copy', function () {
    return gulp.src(toCopy)
        .pipe(gulp.dest(dest));
});

gulp.task('copy-world', function () {
    return gulp.src(src + "/world/*")
        .pipe(gulp.dest(dest + "/world"));
});

gulp.task('js', function () {
    return gulp.src(src + "/js/**/*.js")
        .pipe(sourcemaps.init())
        .pipe(concat('app.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(dest + "/js"));
});

gulp.task('js-vendors', function () {
    return gulp.src(vendors)
        .pipe(concat('vendors.js'))
        .pipe(gulp.dest(dest + "/js"));
});

gulp.task('css', function () {
    return gulp.src(css)
        .pipe(concat('styles.css'))
        .pipe(gulp.dest(dest));
});

gulp.task('templates', function () {
    return gulp.src(src + "/js/**/*.html")
        .pipe(templatecache('templates.js', {standalone: true}))
        .pipe(gulp.dest(dest + "/js"));
});

gulp.task('default', ["clean"], function() {
    gulp.run(["copy", "copy-world", "js", "js-vendors", "css", "templates"]);
});

gulp.task('watch', ["clean"], function() {
    gulp.run(["copy", "copy-world", "js", "js-vendors", "css", "templates"]);

    gulp.watch(src + "/**/*.js", ["js"]);
    gulp.watch(src + "/**/*.html", ["templates"]);
    gulp.watch(toCopy, ["copy"]);
    gulp.watch(css, ["css"]);
    gulp.watch(src + "/world/*", ["copy-world"]);
});

