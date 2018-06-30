const { loadFiles } = require("cherrypicker-utils");
const cherrypick = require("cherrypicker-core");

async function transform(cssSource, markupFilePaths, webpack) {
  const files = await loadFiles(markupFilePaths);

  [...(files.html || []), ...(files.vue || [])].forEach(file => {
    // noinspection JSUnresolvedFunction
    webpack.addDependency(file.path);
  });

  files.css = [
    {
      path: "webpack",
      content: cssSource
    }
  ];

  // noinspection JSUnresolvedFunction
  const cherrypicked = cherrypick(files).find(file => file.path === "webpack");
  return cherrypicked.output;
}

module.exports = function(source) {
  // noinspection JSUnresolvedFunction
  this.cacheable();

  const callback = this.async();

  // noinspection JSUnresolvedVariable
  const markupFilePaths =
    "markupFiles" in this.query
      ? Array.isArray(this.query.markupFiles)
        ? this.query.markupFiles
        : [this.query.markupFiles]
      : [];

  transform(source, markupFilePaths, this).then(result => {
    callback(null, result);
  });
};
