const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode:"production",
  entry: path.resolve(__dirname,"src/main.js"),
  output:{
    path: path.resolve(__dirname,"dist"),
    filename:"main.js"
  },
  
};

/*


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