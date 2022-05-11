const path = require('path');
const WebpackObfuscator = require('webpack-obfuscator');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  mode:"production",
  entry: {
    main: path.resolve(__dirname,"src/main.js"),
    bots: path.resolve(__dirname,"src/bots.js"),
  },
  output:{
    path: path.resolve(__dirname,"dist"),
    filename:"[name].js"
  },optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        test: /\.js(\?.*)?$/i,
      }),
    ],
  }
};

/*





,module:{
    rules: [
      {
          test: /\.js$/,
          enforce: 'post',
          use: { 
              loader: WebpackObfuscator.loader, 
              options: {
                  rotateStringArray: true
              }
          }
      }
    ],
  },
  plugins: [
    new WebpackObfuscator({
        rotateStringArray: true
    }, [])
  ]





plugins: [
    new HtmlWebpackPlugin({
      template: 'src/bots.html',
      filename: "bots.html"
    }),
  ]
 module: {
    rules: [
      {
        test: /\.txt$/,
        use: [
          {
            loader: 'html-loader',
            options: {minimise: true}
          }
        ]
      },
    ]
  },


*/