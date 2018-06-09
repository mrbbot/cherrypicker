const cheerio = require("cheerio");
const css = require("css");
const fs = require("fs");

let $ = cheerio.load(fs.readFileSync("test.html", { encoding: "UTF-8" }));
let stylesheet = css.parse(fs.readFileSync("test.css", { encoding: "UTF-8" }));

function checkSelector(selector) {
    let pseudoIndex = selector.indexOf(":");
    if(pseudoIndex > -1) selector = selector.substring(0, pseudoIndex);
    return $(selector).length > 0;
}

function cherrypickNode(node) {
    node.rules = node.rules.filter(rule => {
        if("selectors" in rule) {
            rule.selectors = rule.selectors.filter(checkSelector);
            return rule.selectors.length !== 0;
        } else if("rules" in rule) {
            cherrypickNode(rule);
            return rule.rules.length !== 0;
        }
    });
}

// noinspection JSUnresolvedVariable
cherrypickNode(stylesheet.stylesheet);

console.log(css.stringify(stylesheet));