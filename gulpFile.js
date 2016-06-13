'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var useref = require('gulp-useref');
var uglify =require('gulp-uglify');
var concat = require('gulp-concat');
var gulpif = require('gulp-if');
var minifycss = require('gulp-minify-css');
var del = require('del');
var minifyHTML = require("gulp-minify-html");
var htmlReplace = require("gulp-html-replace");
var plumber = require("gulp-plumber");
var webserver = require("gulp-webserver");


gulp.task("webserver", function () {
    return gulp.src("build").pipe(webserver({
        host: "localhost",
        port: 8888,
        livereload: true,
        open: true,
        https: false
    }));
});

var sources = {
    libJSfiles : ["app/js/lib/angular.js",
        "app/js/lib/angular-ui-router.js"],
    srcJSfiles :["app/**/*.js","!app/js/lib/angular.js","!app/js/lib/angular-ui-router.js","!app/js/app.js"],
    configFiles : ["app/js/app.js"],
    srchtmlfile: [ "app/**/*.html", "!app/index.html"],
    srcCssFiles : ["app/css/*.css"]
};

gulp.task("clean", function (cb) {
    return del([ "build" ], cb);
});

gulp.task('srcCss-build',function () {
    return gulp.src(sources.srcCssFiles)
        .pipe(gulp.dest("build/css"))
});


gulp.task('lib.js-build',function () {
    return gulp.src(sources.libJSfiles)
        .pipe(plumber()).pipe(uglify())
        .pipe(concat('lib.min.js'))
        .pipe(gulp.dest("build/lib/js/"))
});

gulp.task('src.js-build',function () {
    return gulp.src(sources.srcJSfiles)
        .pipe(concat('all.min.js'))
        .pipe(gulp.dest("build/js/"))
});

gulp.task('config.js-build',function () {
    return gulp.src(sources.configFiles)
        .pipe(plumber())
        .pipe(gulp.dest("build/config/js/"))
});

gulp.task('src.html-build',function () {
    return gulp.src(sources.srchtmlfile)
        .pipe(plumber())
        .pipe(gulp.dest("build/"))
});

gulp.task('index.html',function () {
    return gulp.src('app/index.html')
        .pipe(plumber())
        .pipe(gulp.dest("build/"))
});

gulp.task('index.html-build',function () {
    var ver = (new Date()).getTime();
    return gulp.src('app/index.html')
        .pipe(plumber())
        .pipe(htmlReplace({
            'libjs':{
                src:'lib/js/lib.min.js',
                tpl:'<script src="%s"></script>'
            },
            'srcjs': {
                src : ["config/js/app.js?ver="+ver,"js/all.min.js?ver="+ver],
                tpl:'<script src="%s"></script>'
            },

            'srcCss': ['css/bootstrap.css','css/styles.css']

        }))
        .pipe(
            gulp.dest("build/"))

});

gulp.task('sass', function () {
    return gulp.src('app/scss/**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.reload({
            stream: true
        }))
});
gulp.task('watch',['browserSync','sass'], function () {
    gulp.watch('app/scss/**/*.scss', ['sass']);
    gulp.watch('app/**/*.html', browserSync.reload);
    gulp.watch('app/**/*.js',browserSync.reload);
});

gulp.task('browserSync',function () {
    browserSync.init({
        server:{
            baseDir : 'app'
        }
    })
});
gulp.task("run",  ["lib.js-build","src.js-build","config.js-build","src.html-build","index.html-build","srcCss-build","webserver"], function () {
});

gulp.task("build", ["clean","lib.js-build","src.js-build","config.js-build","src.html-build","index.html-build","srcCss-build"], function () {
});

