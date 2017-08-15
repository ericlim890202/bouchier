var gulp = require('gulp'),
    uglify = require('gulp-uglify');
    CleanCSS = require('gulp-clean-css');


gulp.task('scripts',function(){
    gulp.src('apps/controllers/*.js')
        .pipe(uglify()) 
        .pipe(gulp.dest('dist/minjs/controllers'));
});

gulp.task('test',function(){
    gulp.src('scripts/**/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('dist/test2'));
});

gulp.task('styles', function() {
    gulp.src('assets/styles/*.css')
        .pipe(CleanCSS())
        .pipe(gulp.dest('dist/mincss'));
});

gulp.task('default', ['scripts', 'styles']);

// NEED TO ADD TO GULP

// minify css - easy way to minify all in different folders?
// bundle all js and css files into one for dist
