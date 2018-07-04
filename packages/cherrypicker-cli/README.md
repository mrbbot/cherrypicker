# DEPRECATED: please use [postcss-cherrypicker](https://github.com/mrbbot/postcss-cherrypicker) instead

# Cherrypicker CLI
## Installation
Install it globally using npm or Yarn.
```bash
npm install -g cherrypicker-cli

yarn global add cherrypicker-cli
```
## Usage
Then use the `cherrypicker` command in your project directory.

```bash
cherrypicker index.html css/*.css
```

This will create a `cherrypicked` folder containing the cherrypicked result.

The arguments to the command, which can be in any order, are the files you would like Cherrypicker to consider.

Stylesheets with the `.css` extension will be checked against markup files with the `.html` or `.vue` extensions and any styles that don't appear in the markup will be removed.

Optionally, you can use the `--min` flag to minify the output for a greater size reduction.