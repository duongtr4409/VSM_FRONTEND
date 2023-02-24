import vue from "@/main";
import globalService from "@/services/global.service";
import store from "@/store";
import * as msal from "@azure/msal-browser";
class AuthService {
	constructor() {
		this.configured = false;
		this.msalApp = null;
	}
	async configure(clientId, tenantId = []) {
		if (this.configured) {
			return;
		}

		if (!clientId) {
			return;
		}
		let loginPath = "common";
		let temp = Array.from(tenantId);
		if (temp.length > 0) {
			loginPath = temp.pop();
		}
		const config = {
			auth: {
				clientId: clientId,
				redirectUri: window.location.origin,
				authority: `https://login.microsoftonline.com/${loginPath}`,
			},
			cache: {
				cacheLocation: "localStorage",
			},
		};

		this.msalApp = new msal.PublicClientApplication(config);
		this.configured = true;
	}

	clientId() {
		if (!this.msalApp) {
			return null;
		}

		return this.msalApp.config.auth.clientId;
	}

	async login(
		scopes = ["user.read", "openid", "profile", "email", "Sites.Read.All"],
	) {
		if (!this.isConfigured) {
			this.configure(
				store.state.config.azureAppId,
				store.state.config.tenantId,
			);
		}
		if (!this.msalApp) {
			return;
		}
		// await this.msalApp.loginRedirect({ scopes });
		await this.msalApp.loginPopup({
			scopes,
			prompt: "select_account",
		});
	}

	logout() {
		if (!this.msalApp) {
			return;
		}

		this.msalApp.logoutPopup();
	}

	user() {
		if (!this.msalApp) {
			return null;
		}

		const currentAccounts = this.msalApp.getAllAccounts();
		if (!currentAccounts || currentAccounts.length === 0) {
			// No user signed in
			return null;
		} else if (currentAccounts.length > 1) {
			return currentAccounts[0];
		} else {
			return currentAccounts[0];
		}
	}

	async acquireToken(scopes = ["user.read"]) {
		if (!this.msalApp) {
			this.configure(
				store.state.config.azureAppId,
				store.state.config.tenantId,
			);
		}
		if (!this.msalApp) {
			return null;
		}

		const accessTokenRequest = {
			scopes,
			account: this.user(),
		};

		let tokenResp;
		try {
			tokenResp = await this.msalApp.acquireTokenSilent(
				accessTokenRequest,
			);
		} catch (err) {
			tokenResp = await this.msalApp.acquireTokenPopup(
				accessTokenRequest,
			);
		}

		if (!tokenResp.accessToken) {
			throw new Error(vue.$t("error.access_token"));
		}

		return tokenResp.accessToken;
	}

	async Sites_ListSites(scopes = ["Sites.Read.All"]) {
		if (!this.isConfigured) {
			this.configure(
				store.state.config.azureAppId,
				store.state.config.tenantId,
			);
		}
		if (!this.msalApp) {
			return null;
		}
		let accessToken = await this.acquireToken(scopes);
		if (!accessToken) {
			return null;
		}
		let result = await this.callApi(accessToken, "sites/root");
		console.log(result);
	}

	async callApi(accessToken, url) {
		let headers = new Headers();
		let bearer = "Bearer " + accessToken;
		headers.append("Authorization", bearer);
		let graphEndpoint = `https://graph.microsoft.com/v1.0/${url}`;
		let response = await globalService.getDataOutside_Async(
			graphEndpoint,
			headers,
		);
		return response;
	}

	clearLocal() {
		if (this.msalApp) {
			for (let entry of Object.entries(localStorage)) {
				let key = entry[0];
				if (key.includes("login.windows")) {
					localStorage.removeItem(key);
				}
			}
		}
	}
	get isConfigured() {
		return this.configured;
	}
}
const authService = new AuthService();
export default authService;
