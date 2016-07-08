var path = require('path');
var webpack = require('webpack')
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var config = {
	  entry: {
        bundle: ["./app/entry/index"],
        vendor: ['react', 'react-dom', 'redux', 'redux-thunk'],
    },
  
   output: {
      path:path.resolve(__dirname, "public/javascripts"),
      filename: '[name].min.js',
   },
  
   module: {
      loaders: [
         {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loader: 'babel',    
            query: {
               presets: ['es2015', 'react']
            }
         },

         {
          test: /\.css$/, loader: ExtractTextPlugin.extract('style-loader','css-loader')
         },

         {
          test: /\.less$/, 
          loader: ExtractTextPlugin.extract("style-loader","css-loader!less-loader")
         },

         {
            test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
            loader: 'url',
            query: {
               limit: 10000
            }
         }
      ]
   },
	 plugins: [
        new ExtractTextPlugin("../stylesheets/style.css"),
        new webpack.optimize.CommonsChunkPlugin('vendor', 'common.min.js'),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': '"production"'
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
            warnings: false
        }
    })
    ]
}

module.exports = config;