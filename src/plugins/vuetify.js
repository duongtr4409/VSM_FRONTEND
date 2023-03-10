import i18n from "@/i18n";
import Vue from "vue";
import Vuetify from "vuetify/lib";

Vue.use(Vuetify);

const vuetify = new Vuetify({
	theme: {
		dark: false,
		themes: {
			dark: {},
			light: {
				primary: "#C62828",
				secondary: "#424242",
				accent: "#82B1FF",
				error: "#FF5252",
				info: "#2196F3",
				success: "#4CAF50",
				warning: "#FFC107",
			},
		},
	},
	lang: {
		t: (key, ...params) => i18n.t(key, params),
	},
});
export default vuetify;
