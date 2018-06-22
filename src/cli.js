const promisify = f => (...args) => new Promise((resolve, reject) =>
    f.apply(null, [...args, (err, result) => err ? reject(err) : resolve(result)]));

const cli = require("cli").enable("glob");
const fs = require("fs");
const mkdirp = promisify(require("mkdirp"));
const path = require("path");
const {filter, reduce} = require("asyncro");
const cherrypick = require("./cherrypicker");

const stats = promisify(fs.stat);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const glob = promisify(cli.glob);

const cwd = process.cwd();

(async function () {
    let argFilePaths = await reduce(cli.args, async (argFilePaths, arg) => argFilePaths.concat(await glob(arg)), []);
    argFilePaths = await filter(argFilePaths, async (argFile) => !((await stats(argFile)).isDirectory()));

    const files = await reduce(argFilePaths, async (files, filePath) => {
        const ext = filePath.substring(filePath.lastIndexOf(".") + 1);
        files[ext] = files[ext] || [];
        files[ext].push({
            path: filePath,
            content: await readFile(filePath, {encoding: "utf-8"}),
        });
        return files;
    }, {});
    console.log(files);

    const cherrypickedCssFiles = cherrypick(files["html"] || [], files["css"] || []);

    for(let cssFile of cherrypickedCssFiles) {
        cssFile.cherrypickedPath = path.resolve("cherrypicked" + path.resolve(cssFile.path).substring(cwd.length));
        await mkdirp(path.dirname(cssFile.cherrypickedPath));
        await writeFile(cssFile.cherrypickedPath, cssFile.output, {encoding: "utf-8"});
    }
})();