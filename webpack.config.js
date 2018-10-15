const path = require('path');
const webpack = require('webpack');

module.exports = {
	entry: {
		// Each entry in here would declare a file that needs to be transpiled
		// and included in the extension source.
		// For example, you could add a background script like:
		// background: './src/background.js',
		popup: './src/containers/popup.tsx'
	},
	output: {
		path: path.join(path.resolve(__dirname), 'extension', 'dist'),
		filename: '[name].js'
	},
	module: {
		rules: [
			{
				exclude: /node_modules/,
				test: /\.tsx?$/,
				use: ['ts-loader']
			}
		]
	},
	resolve: {
		extensions: ['.ts', '.tsx'],
		modules: ['src', 'node_modules']
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify('production')
		})
	],
	node: {
		global: true
	},
	devtool: 'sourcemap'
};
