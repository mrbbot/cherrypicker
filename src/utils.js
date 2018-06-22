const promisify = f => (...args) => new Promise((resolve, reject) =>
    f.apply(null, [...args, (err, result) => err ? reject(err) : resolve(result)]));

const {reduce, filter} = require("asyncro");
const fs = require("fs");
const path = require("path");

const glob = promisify(require("glob"));
const stats = promisify(fs.stat);
const readFile = promisify(fs.readFile);

async function loadFiles(paths) {
    let filePaths = await reduce(paths, async (argFilePaths, arg) => argFilePaths.concat(await glob(arg)), []);
    filePaths = await filter(filePaths, async (argFile) => !((await stats(argFile)).isDirectory()));

    return await reduce(filePaths, async (files, filePath) => {
        const ext = filePath.substring(filePath.lastIndexOf(".") + 1);
        files[ext] = files[ext] || [];
        files[ext].push({
            path: filePath,
            content: await readFile(filePath, {encoding: "utf-8"}),
        });
        return files;
    }, {});
}

const getDirs = src => fs.readdirSync(src).filter(file => fs.statSync(path.join(src, file)).isDirectory());

module.exports = {
    promisify,
    loadFiles,
    getDirs
};