import Vue from "vue";
import Vuex from "vuex";
import globalService from "../services/global.service";
import app from "@/main";
import constant from "@/common/constant";
Vue.use(Vuex);

const store = new Vuex.Store({
	state: {
		initialized: false,
		refCount: 0,
		loading: false,
		config: {
			apiUrl: "",
			theme: {},
			encrypt: false,
			azureAppId: "",
			appBar: false,
			tenantId: [],
			// sapUrl: "http://10.111.125.141:8090/api/vcr/v1/sap-re/contract", //UAT
			sapUrl: "https://api.vincom.com.vn/api/vcr/v1/sap-re/contract", //PROD
			rootSite:
				"vingroupjsc.sharepoint.com,67ea0c57-202c-42ab-ad16-096093f182f3,5e889fea-cd7d-4166-893b-fd7dd36c0cce",
			syncWithBackend: false,
			features: {
				loadByList: false,
			},
		},
		accessToken: "",
		refreshToken: "",
	},
	getters: {},
	mutations: {
		loading(state, loading) {
			if (loading) {
				state.refCount++;
				state.loading = true;
			} else if (state.refCount > 0) {
				state.refCount--;
				state.loading = state.refCount > 0;
			}
		},
	},
	config: {
		apiUrl: "",
	},
	actions: {
		async initialize() {
			let response;
			try {
				response = await globalService.getLocalData_Async(
					"/json/config.json?v=" + new Date().getTime(),
				);
				if (!response) {
					return;
				}
				this.state.initialized = true;
				this.state.config = response;
				response = await globalService.getData_Async(
					`/api/theme-configs/1`,
				);
				if (!response) {
					return;
				}
				if (!response.state) {
					return;
				}
				this.state.config.theme = response.data;
				this.state.accessToken = localStorage.getItem(
					constant.keys.accessToken,
				);
				this.state.refreshToken = localStorage.getItem(
					constant.keys.refreshToken,
				);
				app.$vuetify.theme.themes.light = response.data;
			} catch (error) {
				console.log(error);
			}
		},
	},
	modules: {},
});
export default store;
