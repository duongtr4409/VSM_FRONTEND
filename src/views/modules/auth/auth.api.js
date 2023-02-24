export default class AuthAPI {
	static API_GetUserByMicrosoftUsername(username) {
		return `/api/microsoft/${username}/_all/user-infos`;
	}
	static API_SaveUser() {
		return `/api/user-infos`;
	}
	static API_OAuth() {
		return `/api/oauth`;
	}
	static API_Authenicate() {
		return `/api/authenticate`;
	}
	static API_Logout(refreshToken) {
		return `/api/logout?refreshToken=${refreshToken}`;
	}
	static API_ReLogin(refreshToken) {
		return `/api/re-login?refreshToken=${refreshToken}`;
	}
    static API_Verify(){
        return `/api/verify`;
    }
}
