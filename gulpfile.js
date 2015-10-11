var gulp = require('gulp');

var dest = 'static';
var src = 'frontend';

gulp.task('copy', function () {
    gulp.src(src + "/world/*")
        .pipe(gulp.dest(dest + "/world"));
});

gulp.task('default', function() {
    // place code for your default task here
});