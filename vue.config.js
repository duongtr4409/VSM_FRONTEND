const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
	transpileDependencies: ["vuetify", "@koumoul/vjsf"],
	pluginOptions: {
		i18n: {
			locale: "vi",
			fallbackLocale: "vi",
			localeDir: "locales",
			enableInSFC: false,
			includeLocales: false,
			enableBridge: true,
		},
		buildVersion: {
			path: require("path").resolve("dist"), // build root dir
			env: require("process").env, // env obj
			cvs: "svn", // cvs type, git or svn
			versionPath: "", // version file parent dir, empty string for default
			name: "2022072801", // version file name, empty string for default
		},
	},
	configureWebpack: {},
	filenameHashing: true,
});
