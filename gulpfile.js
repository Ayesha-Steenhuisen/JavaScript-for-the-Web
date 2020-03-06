const {
  src,
  dest,
  parallel,
  series,
} = require("gulp");

const eslint = require("gulp-eslint");
const babel = require("gulp-babel");
const rename = require("gulp-rename");
const uglify = require("gulp-uglify-es").default;
const copy = require("gulp-copy");

function lint() {
  return (
    src(["**/*.js", "!node_modules/**", "!gulpfile.js"])
    // eslint() attaches the lint output to the "eslint" property
    // of the file object so it can be used by other modules.
    .pipe(eslint())
    // eslint.format() outputs the lint results to the console.
    // Alternatively use eslint.formatEach() (see Docs).
    .pipe(eslint.format())
    // To have the process exit with an error code (1) on
    // lint error, return the stream and pipe to failAfterError last.
    .pipe(eslint.failAfterError())
    .pipe(
      eslint.results(results => {
        // Called once for all ESLint results.
        console.log(`Total Results: ${results.length}`);
        console.log(`Total Warnings: ${results.warningCount}`);
        console.log(`Total Errors: ${results.errorCount}`);
      })
    )
  );
}

function transpile() {
  return src(["functions.js", "blog.js"])
    .pipe(
      babel({
        presets: ["@babel/preset-env"],
        plugins: ["@babel/transform-runtime"]
      })
    )
    .pipe(dest("dist"));
}

function minify() {
  return src(["dist/*.js"])
    .pipe(uglify())
    .pipe(rename({
      extname: '.min.js'
    }))
    .pipe(dest("dist"))
}

function cp() {
  return src(['*.html', 'images/*'])
    .pipe(copy('dist'))
}

exports.lint = lint;
exports.transpile = transpile;
exports.minify = minify;
exports.copy = cp;
exports.default = parallel(lint, series(transpile, minify), cp);