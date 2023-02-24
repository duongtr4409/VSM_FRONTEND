// webpack.config.js
const { VueLoaderPlugin } = require("vue-loader");

module.exports = {
	mode: "development",
	module: {
		rules: [
			{
				test: /\.vue$/,
				loader: "vue-loader",
			},
			// this will apply to both plain `.js` files
			// AND `<script>` blocks in `.vue` files
			{
				test: /\.js$/,
				loader: "babel-loader",
			},
			// this will apply to both plain `.css` files
			// AND `<style>` blocks in `.vue` files
			{
				test: /\.css$/,
				use: ["vue-style-loader", "css-loader"],
			},
			{
				test: /\.sass$/,
				use: [
					"vue-style-loader",
					"css-loader",
					{
						loader: "sass-loader",
						// Requires sass-loader@^7.0.0
						options: {
							// This is the path to your variables
							data: "@import '@/assets/variables.scss'",
						},
					},
				],
			},
		],
	},
	plugins: [
		// make sure to include the plugin for the magic
		new VueLoaderPlugin(),
	],
};
