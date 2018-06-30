function isCssRule(test) {
  return (
    test.test(".css") ||
    test.test(".postcss") ||
    test.test(".scss") ||
    test.test(".sass") ||
    test.test(".less") ||
    test.test(".styl")
  );
}

const cherrypickerLoaderRule = {
  loader: "cherrypicker-loader",
  options: {
    markupFiles: ["src/**/*.vue", "public/*.html"]
  }
};

module.exports = api => {
  const production = process.env.NODE_ENV === "production" || true;

  if (production) {
    // noinspection JSUnresolvedFunction
    api.configureWebpack(webpackConfig => {
      webpackConfig.module.rules.forEach(rule => {
        if (isCssRule(rule.test)) {
          rule.oneOf.forEach(oneOfRule => {
            //Insert rule just after postcss-loader
            const postCssIndex = oneOfRule.use.findIndex(
              usedRule => usedRule.loader === "postcss-loader"
            );
            oneOfRule.use.splice(postCssIndex, 0, cherrypickerLoaderRule);
          });
        }
      });
    });
  }
};
