var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var clean = require('gulp-clean');

var dest = 'static';
var src = 'frontend';

var toCopy = [
    src + "/index.html",
    src + "/styles.css"
];

var vendors = [
    "node_modules/svg-pan-zoom/dist/svg-pan-zoom.min.js"
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
    return gulp.src(src + "/**/*.js")
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

gulp.task('default', ["clean"], function() {
    gulp.run(["copy", "copy-world", "js", "js-vendors"]);
});

gulp.task('watch', ["clean"], function() {
    gulp.run(["copy", "copy-world", "js", "js-vendors"]);

    gulp.watch(src + "/**/*.js", ["js"]);
    gulp.watch(toCopy, ["copy"]);
    gulp.watch(src + "/world/*2", ["copy-world"]);
});

