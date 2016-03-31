/// <binding AfterBuild='build' />

/*---------------------------------------------------------------------*/
/* --- Require --- */
/*---------------------------------------------------------------------*/
var gulp = require('gulp'),
    less = require('gulp-less'),
    gutil = require('gulp-util'),
    path = require('path'),
    order = require('gulp-order'),
    plumber = require('gulp-plumber'),
    promise = require('es6-promise').polyfill(),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    minifyCss = require('gulp-clean-css'),
    sequence = require('gulp-sequence'),
    del = require('del'),
    eslint = require('gulp-eslint'),
    csslint = require('gulp-csslint'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    autoprefixer = require('gulp-autoprefixer'),
    package = require('./package.json');

/*---------------------------------------------------------------------*/
/* --- Variables --- */
/*---------------------------------------------------------------------*/
var buildVersion = package.version,
    mainFileName = 'all',
    mainFolder = 'GneShared',
    shared = 'shared',
    errorLevels =
    {
        error: 'error',
        warning: 'warning'
    },
    src = path.join(__dirname, 'src'),
    distRoot = path.join(__dirname, 'dist'),
    dist = path.join(distRoot, buildVersion),
    folders = {
        src: {
            fonts: path.join(src, 'fonts'),
            images: path.join(src, 'images'),
            jqueryui: path.join(src, 'images', 'jquery-ui'),
            js: path.join(src, 'js'),
            style: path.join(src, 'style')
        },
        dist: {
            js: path.join(dist, 'js'),
            css: path.join(dist, 'css'),
            images: path.join(dist, 'images'),
            jqueryui: path.join(dist, 'css', 'images'),
            fonts: path.join(dist, 'fonts')
        },
        temp: path.join(__dirname, 'temp'),
        bin: path.join(__dirname, 'bin'),
        cdn: {
            version: path.join(buildVersion, '**', '*')
        }
    },
    files = {
        css: {
            all: {
                original: mainFileName + '.css',
                minified: mainFileName + '.min.css'
            },
            shared: {
                original: shared + '.css',
                minified: shared + '.min.css'
            }
        },
        js: {
            all: {
                original: mainFileName + '.js',
                minified: mainFileName + '.min.js'
            },
            shared: {
                original: shared + '.js',
                minified: shared + '.min.js'
            },
            library: {
                minified: 'library.min.js'
            },
            plugin: {
                minified: 'plugin.min.js'
            },
            jQuery: {
                minified: 'jquery.min.js',
                multiselect: 'jquery.multiselect.min.js'
            }
        },
        config: {
            web: 'web.config'
        }
    },
    paths = {
        src: {
            fonts: path.join(folders.src.fonts, '**', '*'),
            images: path.join(folders.src.images, '*'),
            jqueryui: path.join(folders.src.jqueryui, '*'),
            less: path.join(src, 'style', 'less', 'app', 'app.less'),
            css: path.join(src, 'style', 'css', '**', '*.min.css'),
            js: {
                library: path.join(folders.src.js, 'libraries', '**', '*.js'),
                plugin: path.join(folders.src.js, 'plugins', '**', '*.js'),
                shared: path.join(folders.src.js, shared, '**', '*.js'),
                jQuery: path.join('jQuery', files.js.jQuery.minified),
                multiselect: path.join('multiselect', files.js.jQuery.multiselect)
            }
        },
        dist: {
            css: {
                original: path.join(folders.dist.css, files.css.all.original)
            },
            fonts: path.join(dist, 'fonts', '**', '*'),
            images: path.join(dist, 'images', '*'),
            jqueryui: path.join(dist, 'css', 'images', '*'),
            config: path.join(distRoot, files.config.web),
            all: path.join(distRoot, '**', '*')
        },
        temp: {
            js: {
                minified: path.join(folders.temp, '*.min.js'),
                shared: path.join(folders.temp, files.js.shared.original)
            },
            css: {
                shared: {
                    original: path.join(folders.temp, files.css.shared.original),
                    minified: path.join(folders.temp, files.css.shared.minified)
                }
            },
            all: path.join(folders.temp, '*')
        },
        config: {
            web: path.join(folders.bin, '*.config')
        },
        cdn: {
            remote: path.join('\\\\ccp2mra', 'c$', mainFolder),
            local: path.join('C:', mainFolder)
        }
    },
    tasks = {
        minify: {
            css: 'minify-css',
            js: 'minify-js',
            images: 'minify-images',
            jqueryui: 'minify-jqueryui'
        },
        lint: {
            js: 'js-lint',
            css: 'css-lint'
        },
        bundles: {
            js: {
                library: 'bundle-libraries',
                plugin: 'bundle-plugins',
                shared: 'bundle-shared',
                all: 'bundle-js'
            },
            css: {
                all: 'bundle-css'
            }
        },
        lessToCss: 'less-to-css',
        clean: {
            build: 'clean-build',
            cdn: 'clean-cdn'
        },
        fonts: 'move-fonts',
        config: 'move-config',
        cdn: {
            local: 'publish-local',
            remote: '__publish-remote'
        }
    };

/*---------------------------------------------------------------------*/
/* --- Error Handling --- */
/*---------------------------------------------------------------------*/
function handleError(level, error) {
    gutil.log(error.message);
}

function onError(error) { handleError.call(this, errorLevels.error, error); }
function onWarning(error) { handleError.call(this, errorLevels.warning, error); }


/*---------------------------------------------------------------------*/
/* --- Build --- */
/*---------------------------------------------------------------------*/
gulp.task('build', sequence(
    tasks.clean.build,
    [tasks.lessToCss, tasks.bundles.js.library, tasks.bundles.js.plugin, tasks.bundles.js.shared],
    [tasks.lint.css, tasks.lint.js, tasks.fonts, tasks.config],
    [tasks.minify.css, tasks.minify.js, tasks.minify.images, tasks.minify.jqueryui],
    [tasks.bundles.js.all, tasks.bundles.css.all],
    tasks.cdn.local
));


/*---------------------------------------------------------------------*/
/* --- Publish --- */
/*---------------------------------------------------------------------*/
gulp.task(tasks.cdn.remote, function () {
    cleanCdn(paths.cdn.remote);

    console.log('Publishing to...Live');
    return gulp.src(paths.dist.all)
    .pipe(gulp.dest(paths.cdn.remote));
});

gulp.task(tasks.cdn.local, function () {
    cleanCdn(paths.cdn.local);

    return gulp.src(paths.dist.all)
        .pipe(gulp.dest(paths.cdn.local));
});

/*---------------------------------------------------------------------*/
/* --- Clean --- */
/*---------------------------------------------------------------------*/
gulp.task(tasks.clean.build, function () {
    return del([
        paths.dist.all,
        paths.temp.all
    ]);
});

/*---------------------------------------------------------------------*/
/* --- Less -> Css --- */
/*---------------------------------------------------------------------*/
gulp.task(tasks.lessToCss, function () {
    return gulp.src(paths.src.less)
        .pipe(plumber())
        .pipe(less())
        .pipe(rename(files.css.shared.original))
        .pipe(gulp.dest(folders.temp))
        .on(errorLevels.error, onWarning);
});

/*---------------------------------------------------------------------*/
/* --- Bundling --- */
/*---------------------------------------------------------------------*/
gulp.task(tasks.bundles.js.library, function () {
    return gulp.src(paths.src.js.library)
        .pipe(order([
            paths.src.js.jQuery,
            '*'
        ]))
        .pipe(concat(files.js.library.minified))
        .pipe(gulp.dest(folders.temp))
        .on(errorLevels.error, onError);
});

gulp.task(tasks.bundles.js.plugin, function () {
    return gulp.src(paths.src.js.plugin)
        .pipe(concat(files.js.plugin.minified))
        .pipe(gulp.dest(folders.temp))
        .on(errorLevels.error, onError);
});

gulp.task(tasks.bundles.js.shared, function () {
    return gulp.src(paths.src.js.shared)
        .pipe(concat(files.js.shared.original))
        .pipe(gulp.dest(folders.temp))
        .on(errorLevels.error, onError);
});

gulp.task(tasks.bundles.js.all, function () {
    return gulp.src(paths.temp.js.minified)
        .pipe(order([
            files.js.library.minified,
            files.js.plugin.minified,
            files.js.shared.minified
        ]))
        .pipe(concat(files.js.all.minified))
        .pipe(gulp.dest(folders.dist.js))
        .on(errorLevels.error, onError);
});

gulp.task(tasks.bundles.css.all, function () {
    return gulp.src([
            paths.src.css,
            paths.temp.css.shared.minified
    ])
        .pipe(concat(files.css.all.minified))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest(folders.dist.css))
        .on(errorLevels.error, onError);
});

/*---------------------------------------------------------------------*/
/* --- Linting --- */
/*---------------------------------------------------------------------*/
gulp.task(tasks.lint.css, function () {
    return gulp.src(paths.temp.css.shared.original)
        .pipe(csslint())
        .pipe(csslint.reporter())
        .on(errorLevels.error, onWarning);
});

gulp.task(tasks.lint.js, function () {
    return gulp.src(paths.temp.js.shared)
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError())
        .on(errorLevels.error, onWarning);
});

/*---------------------------------------------------------------------*/
/* --- Minify --- */
/*---------------------------------------------------------------------*/
gulp.task(tasks.minify.css, function () {
    return gulp.src(paths.temp.css.shared.original)
        .pipe(rename(files.css.shared.minified))
        .pipe(minifyCss())
        .pipe(gulp.dest(folders.temp))
        .on(errorLevels.error, onError);
});

gulp.task(tasks.minify.js, function () {
    return gulp.src(paths.temp.js.shared)
        //.pipe(uglify())
        .pipe(rename(files.js.shared.minified))
        .pipe(gulp.dest(folders.temp))
        .on(errorLevels.error, onError);
});

gulp.task(tasks.minify.images, function () {
    return gulp.src(paths.src.images)
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{ removeViewBox: false }],
            use: [pngquant()]
        }))
        .pipe(gulp.dest(folders.dist.images))
        .on(errorLevels.error, onError);
});

gulp.task(tasks.minify.jqueryui, function () {
    return gulp.src(paths.src.jqueryui)
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{ removeViewBox: false }],
            use: [pngquant()]
        }))
        .pipe(gulp.dest(folders.dist.jqueryui))
        .on(errorLevels.error, onError);
});

/*---------------------------------------------------------------------*/
/* --- Fonts --- */
/*---------------------------------------------------------------------*/
gulp.task(tasks.fonts, function () {
    return gulp.src(paths.src.fonts)
        .pipe(gulp.dest(folders.dist.fonts))
        .on(errorLevels.error, onError);
});

/*---------------------------------------------------------------------*/
/* --- Web.Config --- */
/*---------------------------------------------------------------------*/
gulp.task(tasks.config, function () {
    return gulp.src(paths.config.web)
        .pipe(rename(files.config.web))
        .pipe(gulp.dest(distRoot))
        .on(errorLevels.error, onError);
});

/*---------------------------------------------------------------------*/
/* --- Clean CDN --- */
/*---------------------------------------------------------------------*/
function cleanCdn(root) {
    var options = {
        force: 'true'
    };

    return del([
        path.join(root, folders.cdn.version)
    ], options);
};