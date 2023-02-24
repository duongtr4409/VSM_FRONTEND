import constant from "@/common/constant";
import store from "@/store";
import AxiosStatic from "../plugins/axios";
import userService from "./user.service";

export class GlobalService {
	static get headers() {
		let accessToken = store.state.accessToken;
		if (!accessToken) {
			accessToken =
				localStorage.getItem(constant.keys.accessToken) ||
				sessionStorage.getItem(constant.keys.accessToken);
		}
		let _headers = {
			"Content-Type": "application/json",
			Authorization: `Bearer ${accessToken}`,
		};
		return _headers;
	}
	static get defaultConfig() {
		let accessToken = store.state.accessToken;
		if (!accessToken) {
			accessToken =
				localStorage.getItem(constant.keys.accessToken) ||
				sessionStorage.getItem(constant.keys.accessToken);
		}
		let _headers = {
			"Content-Type": "application/json",
			Authorization: `Bearer ${accessToken}`,
		};
		return _headers;
	}
	onReject(error) {
		const url = error.response?.config?.url;
		const status = error.status || error.response?.status;
		if (status === 403 || status === 401) {
			if (
				!url.endsWith("api/oauth") &&
				!url.endsWith("api/authenticate")
			) {
				userService.signOut();
			}
		}
	}
	constructor() {
		this.axios = AxiosStatic;
	}
	async getLocalData_Async(
		url,
		config = GlobalService.defaultConfig,
		reject = (error) => {
			this.onReject(error);
		},
		showLoading = true,
	) {
		if (showLoading) {
			store.commit(constant.keys.loading, true);
		}

		let _url = await Promise.resolve(url);
		let response;
		try {
			response = await this.axios(
				{
					url: _url,
					method: "GET",
				},
				config,
			);
			return response.data;
		} catch (reason) {
			if (reject instanceof Function) {
				return reject(reason);
			}
			return null;
		} finally {
			if (showLoading) {
				store.commit(constant.keys.loading, false);
			}
		}
	}

	async getLocalData_NoAsync(
		url,
		config = GlobalService.defaultConfig,
		reject = (error) => {
			this.onReject(error);
		},
		showLoading = false,
	) {
		if (showLoading) {
			store.commit(constant.keys.loading, true);
		}
		return this.axios(
			{
				url: url,
				method: "GET",
			},
			config,
		).catch((e) => {
			reject(e);
			if (showLoading) {
				store.commit(constant.keys.loading, false);
			}
		});
	}

	/**
	 *
	 * @param {string} url
	 * @param {object} config
	 * @param {Function} reject
	 * @returns {{state:false,messgage:"",data:{}}}
	 */
	async getData_Async(
		url,
		config = GlobalService.defaultConfig,
		reject = (error) => {
			this.onReject(error);
		},
		showLoading = true,
	) {
		if (showLoading) {
			store.commit(constant.keys.loading, true);
		}
		let _url = await Promise.resolve(store.state.config.apiUrl + url);
		let response;
		let accessToken = store.state.accessToken;
		if (!accessToken) {
			accessToken =
				localStorage.getItem(constant.keys.accessToken) ||
				sessionStorage.getItem(constant.keys.accessToken);
		}
		try {
			response = await this.axios({
				url: _url,
				method: "GET",
				headers: {
					Authorization: "Bearer " + accessToken,
				},
				config,
			});
			return response.data;
		} catch (rs) {
			if (reject instanceof Function) {
				return reject(rs);
			}
			return null;
		} finally {
			if (showLoading) {
				store.commit(constant.keys.loading, false);
			}
		}
	}
	async getData_AsyncWithHeader(
		url,
		config = GlobalService.defaultConfig,
		reject = (error) => {
			this.onReject(error);
		},
		showLoading = true,
	) {
		if (showLoading) {
			store.commit(constant.keys.loading, true);
		}
		let _url = await Promise.resolve(store.state.config.apiUrl + url);
		let response;
		try {
			response = await this.axios(
				{
					url: _url,
					method: "GET",
				},
				config,
			);
			return response;
		} catch (rs) {
			if (reject instanceof Function) {
				return reject(rs);
			}
			return null;
		} finally {
			if (showLoading) {
				store.commit(constant.keys.loading, false);
			}
		}
	}
	/**
	 *
	 * @param {string} url
	 * @param {Object} config
	 * @param {Function} reject
	 * @returns
	 */
	async getDataOutside_Async(
		url,
		config = GlobalService.defaultConfig,
		reject = (error) => {
			this.onReject(error);
		},
		showLoading = true,
	) {
		if (showLoading) {
			store.commit(constant.keys.loading, true);
		}
		let _url = await Promise.resolve(url);
		let response;
		try {
			response = await this.axios(
				{
					url: _url,
					method: "GET",
				},
				config,
			);
			return response.data;
		} catch (rs) {
			if (reject instanceof Function) {
				return reject(rs);
			}
			return null;
		} finally {
			if (showLoading) {
				store.commit(constant.keys.loading, false);
			}
		}
	}

	/**
	 *
	 * @param {string} url
	 * @param {Object} config
	 * @param {Function} reject
	 * @returns
	 */
	async downloadStream_Async(
		url,
		config = GlobalService.defaultConfig,
		reject = (error) => {
			this.onReject(error);
		},
		showLoading = true,
	) {
		if (showLoading) {
			store.commit(constant.keys.loading, true);
		}
		let _url = await Promise.resolve(url);
		let response;
		try {
			response = await this.axios(
				{
					url: _url,
					method: "GET",

					responseType: "stream",
				},
				config,
			);
			return response.data;
		} catch (rs) {
			if (reject instanceof Function) {
				return reject(rs);
			}
			return null;
		} finally {
			if (showLoading) {
				store.commit(constant.keys.loading, false);
			}
		}
	}

	/**
	 *
	 * @param {string} url
	 * @param {Object} config
	 * @param {Function} reject
	 * @returns
	 */
	async downloadBlob_Async(
		url,
		config = GlobalService.defaultConfig,
		reject = (error) => {
			this.onReject(error);
		},
		showLoading = true,
	) {
		if (showLoading) {
			store.commit(constant.keys.loading, true);
		}
		let _url = await Promise.resolve(url);
		let response;
		try {
			response = await this.axios(
				{
					url: _url,
					method: "GET",

					responseType: "blob",
				},
				config,
			);
			return response.data;
		} catch (rs) {
			if (reject instanceof Function) {
				return reject(rs);
			}
			return null;
		} finally {
			if (showLoading) {
				store.commit(constant.keys.loading, false);
			}
		}
	}

	/**
	 * @param {string} url
	 * @param {object} data
	 * @param {object} config
	 * @param {function} reject
	 * @returns {{state:false,messgage:"",data:{}}}
	 */
	async postData_Async(
		url,
		data,
		config = GlobalService.defaultConfig,
		reject = (error) => {
			this.onReject(error);
		},
		showLoading = true,
	) {
		if (showLoading) {
			store.commit(constant.keys.loading, true);
		}
		let _url = await Promise.resolve(store.state.config.apiUrl + url);
		let response;
		try {
			response = await this.axios(
				{
					url: _url,
					method: "POST",
					data: data,
				},
				config,
			);
			return response.data;
		} catch (reason) {
			if (reject instanceof Function) {
				return reject(reason);
			}
			return null;
		} finally {
			if (showLoading) {
				store.commit(constant.keys.loading, false);
			}
		}
	}

	/**
	 * @param {string} url
	 * @param {object} data
	 * @param {object} config
	 * @param {function} reject
	 * @returns {{state:false,messgage:"",data:{}}}
	 */
	async postDataOutside_Async(
		url,
		data,
		config = GlobalService.defaultConfig,
		reject = (error) => {
			this.onReject(error);
		},
		showLoading = true,
	) {
		if (showLoading) {
			store.commit(constant.keys.loading, true);
		}
		let _url = await Promise.resolve(url);
		let response;
		try {
			response = await this.axios(
				{
					url: _url,
					method: "POST",
					data: data,
				},
				config,
			);
			return response.data;
		} catch (reason) {
			if (reject instanceof Function) {
				return reject(reason);
			}
			return null;
		} finally {
			if (showLoading) {
				store.commit(constant.keys.loading, false);
			}
		}
	}

	getData_NoAsync(
		url,
		config = GlobalService.defaultConfig,
		reject = (error) => {
			this.onReject(error);
		},
		showLoading = false,
	) {
		if (showLoading) {
			store.commit(constant.keys.loading, true);
		}
		let _url = store.state.config.apiUrl + url;
		return this.axios.get(_url, config).catch((reason) => {
			if (showLoading) {
				store.commit(constant.keys.loading, false);
			}
			if (reject instanceof Function) {
				return reject(reason);
			}
			return null;
		});
	}
	postData_NoAsync(
		url,
		data,
		config = GlobalService.defaultConfig,
		reject = (error) => {
			this.onReject(error);
		},
		showLoading = false,
	) {
		if (showLoading) {
			store.commit(constant.keys.loading, true);
		}
		let _url = store.state.config.apiUrl + url;
		return this.axios.post(_url, data, config).catch((rs) => {
			if (showLoading) {
				store.commit(constant.keys.loading, false);
			}
			if (reject instanceof Function) {
				return reject(rs);
			}
			return null;
		});
	}

	/**
	 * @param {string} url
	 * @param {object} data
	 * @param {object} config
	 * @param {function} reject
	 * @returns {{state:false,messgage:"",data:{}}}
	 */
	async putData_Async(
		url,
		data,
		config = GlobalService.defaultConfig,
		reject = (error) => {
			this.onReject(error);
		},
		showLoading = true,
	) {
		if (showLoading) {
			store.commit(constant.keys.loading, true);
		}
		let response;
		try {
			let _url = await Promise.resolve(store.state.config.apiUrl + url);
			response = await this.axios(
				{
					url: _url,
					method: "PUT",
					data: data,
				},
				config,
			);
			return response.data;
		} catch (reason) {
			if (reject instanceof Function) {
				return reject(reason);
			}
			return null;
		} finally {
			if (showLoading) {
				store.commit(constant.keys.loading, false);
			}
		}
	}

	putData_NoAsync(
		url,
		data,
		config = GlobalService.defaultConfig,
		reject = (error) => {
			this.onReject(error);
		},
		showLoading = false,
	) {
		if (showLoading) {
			store.commit(constant.keys.loading, true);
		}
		let _url = store.state.config.apiUrl + url;
		return this.axios.put(_url, data, config).catch((rs) => {
			if (showLoading) {
				store.commit(constant.keys.loading, false);
			}
			reject(rs);
		});
	}

	/**
	 * @param {string} url
	 * @param {object} data
	 * @param {object} config
	 * @param {function} reject
	 * @returns {{state:false,messgage:"",data:{}}}
	 */
	async deleteData_Async(
		url,
		data = {},
		config = GlobalService.defaultConfig,
		reject = (error) => {
			this.onReject(error);
		},
		showLoading = true,
	) {
		if (showLoading) {
			store.commit(constant.keys.loading, true);
		}
		let response;
		try {
			let _url = await Promise.resolve(store.state.config.apiUrl + url);
			response = await this.axios(
				{
					url: _url,
					method: "DELETE",
					data: data,
				},
				config,
			);
			return response.data;
		} catch (rs) {
			if (reject instanceof Function) {
				return reject(rs);
			}
			return null;
		} finally {
			if (showLoading) {
				store.commit(constant.keys.loading, false);
			}
		}
	}

	deleteData_NoAsync(
		url,
		config = GlobalService.defaultConfig,
		reject = (error) => {
			this.onReject(error);
		},
		showLoading = false,
	) {
		if (showLoading) {
			store.commit(constant.keys.loading, true);
		}
		let _url = store.state.config.apiUrl + url;
		return this.axios.delete(_url, config).catch((rs) => {
			if (showLoading) {
				store.commit(constant.keys.loading, false);
			}
			reject(rs);
		});
	}

	/**
	 * @param {string} url
	 * @param {object} data
	 * @param {object} config
	 * @param {function} reject
	 * @returns {{state:false,messgage:"",data:{}}}
	 */
	async patchData_Async(
		url,
		data,
		config = GlobalService.defaultConfig,
		reject = (error) => {
			this.onReject(error);
		},
		showLoading = true,
	) {
		if (showLoading) {
			store.commit(constant.keys.loading, true);
		}
		let _url = await Promise.resolve(url);
		let response;
		try {
			response = await this.axios(
				{
					url: _url,
					method: "PATCH",
					data: data,
				},
				config,
			);
			return response.data;
		} catch (rs) {
			if (reject instanceof Function) {
				return reject(rs);
			}
			return null;
		} finally {
			if (showLoading) {
				store.commit(constant.keys.loading, false);
			}
		}
	}

	patchData_NoAsync(
		url,
		data,
		config = GlobalService.defaultConfig,
		reject = (error) => {
			this.onReject(error);
		},
		showLoading = false,
	) {
		if (showLoading) {
			store.commit(constant.keys.loading, true);
		}
		let _url = store.state.config.apiUrl + url;
		this.axios.patch(_url, data, config).catch((rs) => {
			if (showLoading) {
				store.commit(constant.keys.loading, false);
			}
			reject(rs);
		});
	}

	/**
	 *
	 * @param {string} url
	 * @param {File} file
	 * @param {AxiosRequestConfig} config
	 * @param {Function} reject
	 * @returns {{state:false,messgage:"",data:{}}}
	 */
	async upload_Async(
		url,
		file,
		config = GlobalService.defaultConfig,
		reject = (error) => {
			this.onReject(error);
		},
		showLoading = true,
	) {
		if (showLoading) {
			store.commit(constant.keys.loading, true);
		}
		let _url = await Promise.resolve(store.state.config.apiUrl + url);
		let response;
		let formData = new FormData();
		formData.append("file", file);
		try {
			response = await this.axios(
				{
					url: _url,
					method: "POST",
					data: formData,
				},
				config,
			);
			return response.data;
		} catch (error) {
			reject(error);
		} finally {
			if (showLoading) {
				store.commit(constant.keys.loading, false);
			}
		}
	}

	/**
	 *
	 * @param {string} url
	 * @param {File} file
	 * @param {Object} data
	 * @param {AxiosRequestConfig} config
	 * @param {Function} reject
	 * @returns {{state:false,messgage:"",data:{}}}
	 */
	async uploadData_Async(
		url,
		file,
		data,
		config = GlobalService.defaultConfig,
		reject = (error) => {
			this.onReject(error);
		},
		showLoading = true,
	) {
		if (showLoading) {
			store.commit(constant.keys.loading, true);
		}
		let _url = await Promise.resolve(store.state.config.apiUrl + url);
		let response;
		let formData = new FormData();
		formData.append(constant.keys.file, file);
		for (let key of Object.keys(data)) {
			formData.append(key, JSON.stringify(data[key]));
		}
		try {
			response = await this.axios(
				{
					url: _url,
					method: "POST",
					data: formData,
				},
				config,
			);
			return response.data;
		} catch (error) {
			reject(error);
		} finally {
			if (showLoading) {
				store.commit(constant.keys.loading, false);
			}
		}
	}
	async uploadData_Async2(
		url,
		file,
		data,
		config = {},
		reject = (error) => {
			this.onReject(error);
		},
		showLoading = true,
	) {
		if (showLoading) {
			store.commit(constant.keys.loading, true);
		}
		let _url = await Promise.resolve(store.state.config.apiUrl + url);
		let response;
		let formData = new FormData();
		formData.append(constant.keys.file, file);
		for (let key of Object.keys(data)) {
			formData.append(key, data[key]);
		}
		try {
			response = await this.axios(
				{
					url: _url,
					method: "POST",
					data: formData,
				},
				config,
			);
			return response.data;
		} catch (error) {
			reject(error);
		} finally {
			if (showLoading) {
				store.commit(constant.keys.loading, false);
			}
		}
	}

	/**
	 *
	 * @param {string} url
	 * @param {File} file
	 * @param {Object} data
	 * @param {AxiosRequestConfig} config
	 * @param {Function} reject
	 * @returns {{state:false,messgage:"",data:{}}}
	 */
	async uploadDataParamater_Async(
		url,
		file,
		data,
		config = GlobalService.defaultConfig,
		reject = (error) => {
			this.onReject(error);
		},
		showLoading = true,
	) {
		if (showLoading) {
			store.commit(constant.keys.loading, true);
		}
		let _url = await Promise.resolve(store.state.config.apiUrl + url);
		let response;
		let formData = new FormData();
		formData.append(constant.keys.file, file);
		try {
			response = await this.axios(
				{
					url: _url,
					method: "POST",
					data: formData,

					params: data,
				},
				config,
			);
			return response.data;
		} catch (error) {
			reject(error);
		} finally {
			if (showLoading) {
				store.commit(constant.keys.loading, false);
			}
		}
	}

	async updateFile_Async(
		url,
		file,
		config = GlobalService.defaultConfig,
		reject = (error) => {
			this.onReject(error);
		},
		showLoading = true,
	) {
		if (showLoading) {
			store.commit(constant.keys.loading, true);
		}
		let _url = await Promise.resolve(store.state.config.apiUrl + url);
		let response;
		let formData = new FormData();
		formData.append(constant.keys.file, file);
		try {
			response = await this.axios(
				{
					url: _url,
					method: "PUT",
					data: formData,
				},
				config,
			);
			return response.data;
		} catch (error) {
			reject(error);
		} finally {
			if (showLoading) {
				store.commit(constant.keys.loading, false);
			}
		}
	}
}

const globalService = new GlobalService();

export default globalService;
