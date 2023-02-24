import constant from "@/common/constant";
import userService from "@/services/user.service";
import store from "@/store";
import axios from "axios";
import vue from "../main";
import app from "../main";
const instance = axios.create({
	baseURL: "/",
	config: {
		apiUrl: "",
	},
});

instance.interceptors.request.use(
	(config) => {
		app.$Progress.start();
		let accessToken = store.state.accessToken;
		if (!accessToken) {
			accessToken =
				localStorage.getItem(constant.keys.accessToken) ||
				sessionStorage.getItem(constant.keys.accessToken);
		}
		if (accessToken) {
			if (!config.headers) {
				config.headers = {};
			}
			config.headers.Authorization = `Bearer ${accessToken}`;
		}
		return config;
	},
	(error) => {
		console.error(error);
	},
);

instance.interceptors.response.use(
	(response) => {
		app.$Progress.finish();
		return Promise.resolve(response);
	},
	(error) => {
		app.$Progress.finish();
		const url = error.response?.config?.url;
		const status = error?.status || error?.response?.status;
		if (status == 403 || status == 401) {
			if (
				!`${url}`.includes("api/oauth") &&
				!`${url}`.includes("api/authenticate") &&
				!`${url}`.includes("api/logout")
			) {
				userService.signOut();
				vue.$router.push({ path: "/sign-in" });
				return;
			}
			return;
		}
		return Promise.reject(error);
	},
);
instance.defaults.headers.common["Authorization"] =
	sessionStorage.getItem(constant.keys.accessToken) || "";
export default instance;
