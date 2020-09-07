const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require('path');

module.exports = {
  entry: "./bootstrap.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bootstrap.js",
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: ['babel-loader'],
        exclude: /node_modules/,
      },
    ],
  },  
  mode: "development",
  devServer: {
    contentBase: path.resolve(__dirname, "public")
  },  
  plugins: [
    new CopyWebpackPlugin(['index.html'])
  ],
};
