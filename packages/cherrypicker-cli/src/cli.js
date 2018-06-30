const { promisify, loadFiles } = require("cherrypicker-utils");

const cli = require("cli");
const { min } = cli.parse({
  min: ["m", "Minify css after cherrypicking", "bool", false]
});

const mkdirp = promisify(require("mkdirp"));
const writeFile = promisify(require("fs").writeFile);
const path = require("path");
const cherrypick = require("cherrypicker-core");
const cwd = process.cwd();
const postcss = require("postcss");
const cssnano = require("cssnano");
const minifier = postcss([cssnano]);
const chalk = require("chalk");
const filesize = require("filesize");

(async function() {
  const files = await loadFiles(cli.args);
  const cherrypickedCssFiles = await cherrypick(files);
  for (const cssFile of cherrypickedCssFiles) {
    cssFile.cherrypickedPath = path.resolve(
      "cherrypicked" + path.resolve(cssFile.path).substring(cwd.length)
    );

    if (min) {
      cssFile.output = (await minifier.process(cssFile.output, {
        from: path.resolve(cwd, cssFile.path),
        to: cssFile.cherrypickedPath
      })).css;
    }

    await mkdirp(path.dirname(cssFile.cherrypickedPath));
    await writeFile(cssFile.cherrypickedPath, cssFile.output, {
      encoding: "utf-8"
    });

    const inBytes = cssFile.content.length;
    const outBytes = cssFile.output.length;

    // noinspection JSUnresolvedFunction
    console.log(
      `${chalk.blue(`${cssFile.path}:`)} ${chalk.red(
        filesize(inBytes)
      )} -> ${chalk.green(filesize(outBytes))} (${Math.round(
        (outBytes / inBytes) * 100
      )}%) ${chalk.gray(
        `[${cssFile.removedRules} rule${
          cssFile.removedRules !== 1 ? "s" : ""
        } removed]`
      )}`
    );
  }
})();
