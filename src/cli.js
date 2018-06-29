const { promisify, loadFiles } = require("./utils");

const cli = require("cli");
const mkdirp = promisify(require("mkdirp"));
const writeFile = promisify(require("fs").writeFile);
const path = require("path");
const cherrypick = require("./cherrypicker");
const cwd = process.cwd();
const chalk = require("chalk");
const filesize = require("filesize");

(async function() {
  const files = await loadFiles(cli.args);
  const cherrypickedCssFiles = cherrypick(files);
  for (const cssFile of cherrypickedCssFiles) {
    cssFile.cherrypickedPath = path.resolve(
      "cherrypicked" + path.resolve(cssFile.path).substring(cwd.length)
    );
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
      )} -> ${chalk.green(filesize(outBytes))} (${Math.floor(
        ((inBytes - outBytes) / inBytes) * 100
      )}%) ${chalk.gray(
        `[${cssFile.removedRules} rule${
          cssFile.removedRules !== 1 ? "s" : ""
        } removed]`
      )}`
    );
  }

  //TODO: Add some nice output on removed rules, and size savings
})();
