const { src, dest, parallel } = require("gulp");
const eslint = require("gulp-eslint");

function lint() {
  return (
    src(["**/*.js", "!node_modules/**"])
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

exports.lint = lint;
exports.default = parallel(lint);
