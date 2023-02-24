import constant from "@/common/constant";
// import vue from "@/main";
import authService from "@/modules/graph/services/auth.service";
import store from "@/store";
import AuthAPI from "@/views/modules/auth/auth.api";
import cryptojsService from "./cryptojs.service";
import globalService from "./global.service";

class UserService {
	static get SECRET() {
		return "+MbQeThWmZq4t7w!z%C*F)J@NcRfUjXn2r5u8x/A?D(G+KaPdSgVkYp3s6v9y$B&";
	}
	static get KEY() {
		return `APP_AUTH`;
	}
	getUserInfo() {
		let userInfo = null;
		try {
			let encrypted = localStorage.getItem(UserService.KEY);
			if (!encrypted) {
				return null;
			}
			userInfo = JSON.parse(
				cryptojsService.decrypt(encrypted, UserService.SECRET),
			);
			return userInfo;
		} catch (error) {
			console.log(error);
			return null;
		}
	}
	setUserInfo(userInfo) {
		try {
			localStorage.setItem(
				UserService.KEY,
				cryptojsService.encrypt(
					JSON.stringify(userInfo),
					UserService.SECRET,
				),
			);
		} catch (e) {
			console.log(e);
		}
	}
	async signOut() {
		try {
			let response = await globalService.getData_Async(
				AuthAPI.API_Logout(store.state.refreshToken),
			);
			console.log(response);
		} catch (e) {
			console.log(e);
		}
		localStorage.clear();
		sessionStorage.clear();
		authService.clearLocal();
		// vue.$router.push({ path: "/sign-in" });
	}

	/**
	 *
	 * @param {{state:Boolean,message:String,data:{accessToken:String,refreshToken:String,userInfo:{}}}} response
	 */
	store(response) {
		this.setUserInfo(response.data.userInfo);
		this.storeToken(response.data.accessToken, response.data.refreshToken);
	}
	storeToken(accessToken, refreshToken) {
		store.state.accessToken = accessToken;
		store.state.refreshToken = refreshToken;
		localStorage.setItem(constant.keys.accessToken, accessToken);
		localStorage.setItem(constant.keys.refreshToken, refreshToken);
		sessionStorage.setItem(constant.keys.accessToken, accessToken);
		sessionStorage.setItem(constant.keys.refreshToken, refreshToken);
	}
}

const userService = new UserService();
export default userService;
