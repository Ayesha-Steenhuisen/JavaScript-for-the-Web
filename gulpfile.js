const { src, dest, parallel, series, watch } = require("gulp");

const eslint = require("gulp-eslint");
const babel = require("gulp-babel");
const rename = require("gulp-rename");
const uglify = require("gulp-uglify-es").default;
const copy = require("gulp-copy");
const browserSync = require("browser-sync").create();
const reload = browserSync.reload;

function lint() {
  return (
    src(["blog.js", "functions.js"])
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
  return src(["dist/blog.js", "dist/functions.js"])
    .pipe(uglify())
    .pipe(
      rename({
        extname: ".min.js"
      })
    )
    .pipe(dest("dist"));
}

function cp() {
  // images/
  //   image.jpg
  //   image_two.jpg
  //   icons/icon.svg
  // images/* -> ['image.jpg', 'image_two.jpg']
  // images/**/* -> ['image.jpg', 'image_two.jpg', 'icons/icon.svg']
  // **/* any directory inside images (in this example, anything with a star is the root directory)
  return src(["index.html", "blog.html", "images/*"]).pipe(copy("dist"));
}

function watcher() {
  // Glob -> regex pattern
  // Regular Expressions -> regex
  watch(["blog.js", "function.js"], series(transpile, minify));

  // Assets/Resources
  watch(["index.html", "blog.html", "images/*"], series(cp));
}

function serve() {
  browserSync.init({
    server: {
      baseDir: "./dist"
    }
  });

  watch("dist/*").on("change", reload);
}

const build = parallel(lint, series(transpile, minify), cp);

exports.lint = lint;
exports.transpile = transpile;
exports.minify = minify;
exports.copy = cp;
exports.watcher = watcher;
exports.serve = serve;
exports.build = build;
exports.default = parallel(series(build, serve), watcher);
