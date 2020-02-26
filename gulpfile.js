"use strict";

var _require = require("gulp"),
  src = _require.src,
  dest = _require.dest,
  parallel = _require.parallel;

var eslint = require("gulp-eslint");
var babel = require("gulp-babel");
var rename = require("gulp-rename");

function lint() {
  return (
    src(["**/*.js", "!node_modules/**"]) // eslint() attaches the lint output to the "eslint" property
      // of the file object so it can be used by other modules.
      .pipe(eslint()) // eslint.format() outputs the lint results to the console.
      // Alternatively use eslint.formatEach() (see Docs).
      .pipe(eslint.format()) // To have the process exit with an error code (1) on
      // lint error, return the stream and pipe to failAfterError last.
      .pipe(eslint.failAfterError())
      .pipe(
        eslint.results(function(results) {
          // Called once for all ESLint results.
          console.log("Total Results: ".concat(results.length));
          console.log("Total Warnings: ".concat(results.warningCount));
          console.log("Total Errors: ".concat(results.errorCount));
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
    .pipe(rename({ extname: ".es5.js" }))
    .pipe(dest("dist"));
}

exports.lint = lint;
exports.transpile = transpile;
exports["default"] = parallel(lint, transpile);
