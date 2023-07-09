const webpack = require("webpack");

module.exports = function override(config) {
  const fallback = config.resolve.fallback || {};
  Object.assign(fallback, {
    // ...
    zlib: require.resolve("browserify-zlib"),
  });
};
