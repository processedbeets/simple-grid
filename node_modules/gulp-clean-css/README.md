# gulp-clean-css

> Minify files with CleanCSS

# DEPRECATED

This package is marked as deprecated. Please use [jonathanepollack/gulp-minify-css](https://github.com/jonathanepollack/gulp-minify-css) instead.

# Installation

```
npm install --save-dev gulp-clean-css
```

# Usage

```javascript
var minify = require('gulp-clean-css');

gulp.task('compress', function() {
  return gulp.src('assets/stylesheets/*.css')
    .pipe(minify())
    .pipe(gulp.dest('dist'))
});
```

# Credits

This package is heavily inspired (actually it's a clone..) by [terinjokes/gulp-uglify](https://github.com/terinjokes/gulp-uglify).  

Also take a look at [jonathanepollack/gulp-minify-css](https://github.com/jonathanepollack/gulp-minify-css). The only reason I made this clone is the fact that Node was throwing some low-level errors..
