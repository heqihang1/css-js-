const autoprefixer = require("autoprefixer");
const postcssCustomProperties = require("postcss-custom-properties");
const pxtorem = require("postcss-pxtorem");
const package = require("./package.json");

module.exports = {
  plugins: [
    autoprefixer({
      // grid: true,
      grid: "autoplace",
      overrideBrowserslist: package.browserslist,
    }),
    pxtorem({
      rootValue: 100,
      unitPrecision: 5,
      propList: [
        // "font",
        "font-size",
        "line-height",
        // "letter-spacing",
        "width",
        "max-width",
        "min-width",
        "height",
        "max-height",
        "min-height",
        "padding",
        "padding-top",
        "padding-right",
        "padding-bottom",
        "padding-left",
        "margin",
        "margin-top",
        "margin-right",
        "margin-left",
        "margin-bottom",
        "top",
        "bottom",
        "left",
        "right"
      ],
      selectorBlackList: [],
      replace: true,
      mediaQuery: false,
      minPixelValue: 0,
    }),
    postcssCustomProperties({
      // preserve: false,
    }),
  ],
};
