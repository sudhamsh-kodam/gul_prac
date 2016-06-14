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
var watch = require("gulp-watch");


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
        "app/js/lib/angular-ui-router.js",
        "app/js/lib/jquery.js",
        "app/js/lib/bootstrap.js",
        "app/js/lib/ui-bootstrap.js"
    ],
    srcJSfiles :["app/**/*.js","!app/js/lib/angular.js","!app/js/lib/angular-ui-router.js",
        "!app/js/app.js","!app/js/lib/bootstrap.js","!app/js/lib/jquery.js","!app/js/lib/ui-bootstrap.js"],
    configFiles : ["app/js/app.js"],
    srchtmlfile: [ "app/**/*.html", "!app/index.html"],
    srcCssFiles : ["app/css/*.css"]
};

gulp.task("clean", function (cb) {
    return del([ "build" ], cb);
});

gulp.task('srcCss-build',function () {
    return gulp.src(sources.srcCssFiles)
        .pipe(watch(sources.srcCssFiles,function () {
            gulp.src(sources.srcCssFiles)
                .pipe(gulp.dest("build/css"))
        }))
        .pipe(gulp.dest("build/css"))
});


gulp.task('lib.js-build',function () {
    return gulp.src(sources.libJSfiles)
        .pipe(plumber())
        .pipe(gulp.dest("build/lib/js/"))
});

gulp.task('src.js-build',function () {
    return gulp.src(sources.srcJSfiles)
        .pipe(watch(sources.srcJSfiles,function () {
            gulp.src(sources.srcJSfiles)
                .pipe(gulp.dest("build/js/"))
        }))
        .pipe(gulp.dest("build/js/"))
});

gulp.task('config.js-build',function () {
    return gulp.src(sources.configFiles)
        .pipe(watch(sources.configFiles,function () {
            gulp.src(sources.configFiles)
        }))
        .pipe(plumber())
        .pipe(gulp.dest("build/config/js/"))
});

gulp.task('src.html-build',function () {
    return gulp.src(sources.srchtmlfile)
        .pipe(watch(sources.srchtmlfile),function () {
            gulp.src(sources.srchtmlfile)
                .pipe(plumber())
                .pipe(gulp.dest("build/"))
        })
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
                src:['lib/js/angular.js',
                    'lib/js/angular-ui-router.js',
                    'lib/js/jquery.js',
                    'lib/js/bootstrap.js',
                    'lib/js/ui-bootstrap.js'
                ],
                tpl:'<script src="%s"></script>'
            },
            'srcjs': {
                src : ["config/js/app.js?ver="+ver,"js/views/login/logCtrl.js?ver="+ver,"js/views/main/mainCtrl.js?ver="+ver],
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
gulp.task('watch',['sass'], function () {
    gulp.watch('app/scss/**/*.scss', ['sass']);
    gulp.watch('app/**/*.html', browserSync.reload);
    gulp.watch('app/**/*.js',browserSync.reload);
});

/*gulp.task('browserSync',function () {
    browserSync.init({
        server:{
            baseDir : 'app'
        }
    })
});*/
gulp.task("run",  ["lib.js-build","src.js-build","config.js-build","src.html-build","index.html-build","srcCss-build","webserver","watch"], function () {
});

gulp.task("build", ["lib.js-build","src.js-build","config.js-build","src.html-build","index.html-build","srcCss-build"], function () {
});

