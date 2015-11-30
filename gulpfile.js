var gulp = require('gulp');
var browserify = require("browserify");
var through = require('through2');
var $ = require('gulp-load-plugins')({
    rename: {
        'gulp-server-livereload': 'server'
    }
});

var clean = function () {
    return gulp.src('./build')
        .pipe($.clean({force: true, read: false}));
};

var react = function () {
    var throughBrowserify = through.obj(function (file, enc, next) {
        browserify(file.path,
            {
                extensions: ['.jsx'],
                debug: true
            })
            .transform("babelify", {presets: ["es2015", "react"]})
            .bundle(function (err, res) {
                if (err) {
                    console.log('Browserify error: ' + err.message);
                } else {
                    file.path = file.path.slice(0, -1);
                    file.contents = res;
                    next(null, file);
                }
            });
    });
    return gulp.src('./src/**/*.jsx')
        .pipe(throughBrowserify)
        .pipe($.jshint())
        .pipe($.uglify())
        .pipe(gulp.dest('./build'));
};

var stylus = function () {
    return gulp.src('./src/web/css/**/*.styl')
        .pipe($.stylus())
        .pipe($.minifyCss())
        .pipe($.autoprefixer('last 2 version', 'ie 9'))
        .pipe(gulp.dest('./build/web/css'));
};

var html = function () {
    return gulp.src('./src/web/index.html')
        .pipe($.minifyHtml())
        .pipe(gulp.dest('./build/web'));
};

gulp.task('clean', clean);

gulp.task('stylus', ['clean'], stylus);
gulp.task('react', ['clean'], react);
gulp.task('assets', ['stylus', 'react']);

gulp.task('html', ['assets'], html);

gulp.task('react-watch', react);
gulp.task('watch', function () {
    gulp.watch('./src/**/*.jsx', ['react-watch']);
});

gulp.task('webserver', ['html'], function () {
    gulp.src('./build/web')
        .pipe($.server({
            defaultFile: 'index.html',
            livereload: true
        }));
});

gulp.task('default', ['webserver', 'watch']);
