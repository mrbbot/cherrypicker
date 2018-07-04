# DEPRECATED: please use [postcss-cherrypicker](https://github.com/mrbbot/postcss-cherrypicker) instead

# Cherrypicker Loader
## Installation
Install the loader, and the core library, using npm or Yarn.
```bash
npm install cherrypicker-loader cherrypicker

yarn add cherrypicker-loader cherrypicker
```

## Usage
After any pre-processors but before `css-loader` add the following rule:
```js
{
  loader: "cherrypicker-loader",
  options: {
    markupFiles: ["*.html"]
  }
}
```

If you only have one set of markup files, you can use a single string instead of an array of them.

Your webpack config should then look something like this:
```js
module.exports = {
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [
                    "style-loader",
                    "css-loader",
                    {
                        loader: "cherrypicker-loader",
                        options: {
                            markupFiles: ["*.html"]
                        }
                    },
                    "sass-loader"
                ]
            }
        ]
    }
};
```
