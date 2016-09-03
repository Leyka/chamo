var gulp = require('gulp'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    cssmin = require('gulp-cssmin');

gulp.task('jsmin', function(){
    return gulp.src(['./public/javascripts/utils.js', './public/javascripts/app.js'])
        .pipe(concat('app.concat.js'))
        .pipe(gulp.dest('./public/dist'))
        .pipe(rename('app.min.js'))
        .pipe(uglify({mangle: {toplevel: true}}))
        .pipe(gulp.dest('./public/dist'));
});

gulp.task('cssmin', function () {
    gulp.src('./public/stylesheets/style.css')
        .pipe(cssmin())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./public/dist'));
});

gulp.task('default', ['jsmin', 'cssmin'], function(){});
