const webpack = require('webpack');
const path = require('path');

module.exports = {
  webpack: {
    alias: {
      'src': path.resolve(__dirname, 'src/'),
      '@': path.resolve(__dirname, 'src/')
    },
    configure: (webpackConfig) => {
      // Add fallbacks for Node.js core modules
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        "stream": require.resolve("stream-browserify"),
        "buffer": require.resolve("buffer"),
        "process": require.resolve("process/browser.js"),
        "process/browser": require.resolve("process/browser.js"),
        "crypto": false,
        "http": false,
        "https": false,
        "zlib": false,
        "url": false,
        "util": false,
        "path": false,
        "fs": false,
        "net": false,
        "tls": false,
        "os": false
      };

      // Add plugins to provide global variables
      webpackConfig.plugins.push(
        new webpack.ProvidePlugin({
          process: 'process/browser.js',
          Buffer: ['buffer', 'Buffer']
        })
      );

      // Ignore source map warnings
      webpackConfig.ignoreWarnings = [/Failed to parse source map/];

      return webpackConfig;
    }
  }
};
