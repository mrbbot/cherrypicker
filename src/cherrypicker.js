const cheerio = require("cheerio");
const css = require("css");

function checkSelector(selector, markupFiles) {
  const pseudoIndex = selector.indexOf(":");
  if (pseudoIndex > -1) selector = selector.substring(0, pseudoIndex);
  return markupFiles.some(file => file.$(selector).length > 0);
}

function cherrypickNode(node, markupFiles) {
  let removedRules = 0;
  node.rules = node.rules.filter(rule => {
    if ("selectors" in rule) {
      rule.selectors = rule.selectors.filter(selector =>
        checkSelector(selector, markupFiles)
      );
      if (rule.selectors.length === 0) removedRules++;
      return rule.selectors.length !== 0;
    } else if ("rules" in rule) {
      removedRules += cherrypickNode(rule, markupFiles);
      return rule.rules.length !== 0;
    }
  });
  return removedRules;
}

function cherrypick(files) {
  let markupFiles = [];
  if ("html" in files) {
    markupFiles = markupFiles.concat(
      files["html"].map(file => ({
        $: cheerio.load(file.content)
      }))
    );
  }
  if("vue" in files) {
    markupFiles = markupFiles.concat(
      files["vue"]
        .map(file => cheerio.load(file.content))
        .map($ => $("template"))
        .filter($template => $template.get().length > 0)
        .map($template => ({
          $: cheerio.load($template.html())
        }))
    )
  }

  const cssFiles = files["css"] || [];
  cssFiles.forEach(cssFile => {
    // noinspection JSUndefinedPropertyAssignment
    cssFile.stylesheet = css.parse(cssFile.content);
    // noinspection JSUndefinedPropertyAssignment, JSUnresolvedVariable
    cssFile.removedRules = cherrypickNode(
      cssFile.stylesheet.stylesheet,
      markupFiles
    );
    // noinspection JSUndefinedPropertyAssignment
    cssFile.output = css.stringify(cssFile.stylesheet);
  });
  return cssFiles;
}

module.exports = cherrypick;
