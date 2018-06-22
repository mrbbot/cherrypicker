const cheerio = require("cheerio");
const css = require("css");

function checkSelector(selector, htmlFiles) {
    let pseudoIndex = selector.indexOf(":");
    if (pseudoIndex > -1) selector = selector.substring(0, pseudoIndex);
    return htmlFiles.some(htmlFile => htmlFile.$(selector).length > 0);
}

function cherrypickNode(node, htmlFiles) {
    let removedRules = 0;
    node.rules = node.rules.filter(rule => {
        if ("selectors" in rule) {
            rule.selectors = rule.selectors.filter(selector => checkSelector(selector, htmlFiles));
            if(rule.selectors.length === 0) removedRules++;
            return rule.selectors.length !== 0;
        } else if ("rules" in rule) {
            removedRules += cherrypickNode(rule, htmlFiles);
            return rule.rules.length !== 0;
        }
    });
    return removedRules;
}

function cherrypick(htmlFiles, cssFiles) {
    htmlFiles.forEach(htmlFile => htmlFile.$ = cheerio.load(htmlFile.content));
    cssFiles.forEach(cssFile => {
        cssFile.stylesheet = css.parse(cssFile.content);
        // noinspection JSUnresolvedVariable
        cssFile.removedRules = cherrypickNode(cssFile.stylesheet.stylesheet, htmlFiles);
        cssFile.output = css.stringify(cssFile.stylesheet);
    });
    return cssFiles;
}

module.exports = cherrypick;