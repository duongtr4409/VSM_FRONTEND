<template>
	<v-card
		class="ma-auto mt-15"
		max-width="500"
		transition="scroll-y-transition"
	>
		<v-img class="" contain src="/img/backgrounds/VRE.jpg"></v-img>
		<!-- <v-card-title>{{ $t("title.sign_in") }}</v-card-title> -->
		<v-card-text>
			<v-container class="p-5">
				<template v-if="!signInAsGuest">
					<v-row>
						<v-col>
							<v-btn
								elevation="0"
								width="100%"
								black
								x-large
								color="primary darken-1"
								class="
									bg-gradient-to-r
									from-[#8C1015]
									to-[#E55C64]
									darken-1
									text-[#50d71e]
								"
								@click="signInOnMicrosoft"
							>
								{{ $t("button.sign_in") }}
							</v-btn>
						</v-col>
						<v-col>
							<v-btn
								elevation="0"
								width="100%"
								x-large
								outlined
								color="primary darken-1"
								class="mt-4"
								@click="signInAsGuest = true"
							>
								{{ $t("button.sign_in_client") }}
							</v-btn>
						</v-col>
					</v-row>
					<v-row>
						<v-col class="text-center">
							{{ $t("label.user_manual") }}
						</v-col>
					</v-row>
					<v-row>
						<v-col class="text-center">
							<span color="red darken-2">
								{{ $t("label.app_portfolio") }}
							</span>
						</v-col>
					</v-row>
					<v-row>
						<v-col cols="12" md="6">
							<v-img
								src="/img/badge/google-play-badge-2.png"
							></v-img>
						</v-col>
						<v-col cols="12" md="6">
							<v-img
								src="/img/badge/app-store-badge-2.png"
							></v-img>
						</v-col>
					</v-row>
				</template>
				<!-- <v-row class="mt-6">
					<v-col cols="4">
						<v-divider class="mt-2"></v-divider>
					</v-col>
					<v-col cols="4">
						<span>{{ $t("label.sign_in_with_username") }} </span>
					</v-col>
					<v-col cols="4">
						<v-divider class="mt-2"></v-divider>
					</v-col>
				</v-row> -->
				<v-form v-else-if="verifying" ref="form">
					<v-otp-input v-model="otp" default length="4" type="number">
					</v-otp-input>
					<p>{{ $t("message.otp_verify") }}</p>
					<v-btn
						dark
						width="100% "
						x-large
						color="primary darken-1"
						class="
							bg-gradient-to-r
							from-[#8C1015]
							to-[#E55C64]
							darken-1
							text-[#50d71e]
						"
						type="submit"
						@click="verify($event)"
					>
						{{ $t("button.verify") }}
						<!-- <v-icon> mdi-arrow-right </v-icon> -->
					</v-btn>
				</v-form>
				<v-form
					v-else
					ref="form"
					v-model="valid"
					lazy-validation
					@submit="signIn($event)"
					@input="handleInput"
				>
					{{ $t("title.email") }}
					<span class="text-red-600">
						{{ $t("label.star") }}
					</span>
					<v-text-field
						v-model="username"
						:value="safeUsername"
						:error-messages="usernameError"
						dense
						outlined
						maxLength="255"
					>
					</v-text-field>
					{{ $t("title.password") }}
					<span class="text-red-600">
						{{ $t("label.star") }}
					</span>
					<v-text-field
						v-model="password"
						:value="safePassword"
						:append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
						:type="showPassword ? 'text' : 'password'"
						:error-messages="passwordError"
						@click:append="showPassword = !showPassword"
						dense
						outlined
						maxLength="255"
					></v-text-field>
					<v-checkbox
						:label="$t('label.remember_me')"
						v-model="rememberMe"
					></v-checkbox>
					<v-btn
						dark
						width="100% "
						x-large
						color="primary darken-1"
						class="
							bg-gradient-to-r
							from-[#8C1015]
							to-[#E55C64]
							darken-1
							text-[#50d71e]
						"
						type="submit"
						@click="signIn($event)"
					>
						{{ $t("button.sign_in") }}
						<!-- <v-icon> mdi-arrow-right </v-icon> -->
					</v-btn>
					<v-btn
						dark
						width="100% "
						x-large
						color="primary darken-1"
						outlined
						class="mt-4"
						@click="signInAsGuest = false"
					>
						{{ $t("button.back") }}
						<!-- <v-icon> mdi-arrow-right </v-icon> -->
					</v-btn>
				</v-form>
			</v-container>
		</v-card-text>
	</v-card>
</template>

<script>
import globalService from "@/services/global.service";
import userService from "@/services/user.service";
import authService from "@/modules/graph/services/auth.service";
import AuthAPI from "./auth.api";
import constant from "@/common/constant";
export default {
	name: "SignInVue",
	data() {
		return {
			valid: true,
			username: "",
			password: "",
			rememberMe: false,
			showPassword: false,
			selection: 1,
			askPassword: false,
			file: null,
			usernameError: "",
			passwordError: "",
			signInAsGuest: false,
			m_input: false,
			verifying: false,
			otp: "",
		};
	},
	watch: {
		username(value) {
			if (!value) {
				this.usernameError = this.$t("error.required");
			} else if (!this.validateUsername(value)) {
				this.usernameError = this.$t("error.invalid_username");
			} else if (`${value}`.length > constant.values.MAX_LENGTH) {
				this.usernameError = this.$t("validator.max_length_255");
			} else {
				this.usernameError = "";
			}
			value = `${value}`
				.trim()
				.substring(0, constant.values.MAX_LENGTH - 1);
		},
		password(value) {
			if (!value) {
				this.passwordError = this.$t("error.required");
			} else if (!this.validatePassword(value)) {
				this.passwordError = this.$t("error.invalid_password");
			} else if (`${value}`.length > constant.values.MAX_LENGTH) {
				this.passwordError = this.$t("validator.max_length_255");
			} else {
				this.passwordError = "";
			}
			value = `${value}`
				.trim()
				.substring(0, constant.values.MAX_LENGTH - 1);
		},
	},
	computed: {
		safeUsername() {
			return `${this.username}`
				.trim()
				.substring(0, constant.values.MAX_LENGTH - 1);
		},
		safePassword() {
			return `${this.password}`
				.trim()
				.substring(0, constant.values.MAX_LENGTH - 1);
		},
	},
	mounted() {},
	methods: {
		back() {
			this.askPassword = false;
		},
		async signIn(event = false) {
			event.preventDefault();
			if (!this.m_input) {
				return;
			}
			let response;
			this.password = this.password.trim();

			try {
				response = await globalService.postData_Async(
					AuthAPI.API_Authenicate(),
					// "/api/user-infos/1",
					{
						username: this.username,
						password: this.password,
						rememberMe: this.rememberMe,
					},
				);
				if (!response) {
					this.toastError(this.$t("error.authenicate"));
					return;
				}
				if (!response.state) {
					this.toastError(this.$t("error.authenicate"));
					return;
				}
				// userService.store({
				// 	state: true,
				// 	message: "",
				// 	data: {
				// 		accessToken: "",
				// 		refreshToken: "",
				// 		userInfo: response.data,
				// 	},
				// });
				// userService.store(response);
				// this.$router.push({ path: "/" });
				this.verifying = true;
			} catch (error) {
				console.log(error);
				this.verifying = false;
			}
		},
		async signInOnMicrosoft() {
			try {
				await authService.login();
				let token = await authService.acquireToken();
				if (!token) {
					return;
				}
				let user = authService.user();
				console.log(user);
				let response = await globalService.postData_Async(
					AuthAPI.API_OAuth(),
					{
						token: token,
						user: user,
					},
				);
				if (!response || !response.state) {
					return this.toastError("error.authenicate");
				}
				userService.store(response);
				this.$router.push({ path: "/" });
			} catch (err) {
				console.log(err);
				this.toastError(err);
			}
		},
		handleInput(e) {
			this.m_input = e;
		},
		async verify(event) {
            event.preventDefault();
			if (!this.otp) {
				return;
			}
			let response;
			try {
				response = await globalService.postData_Async(
					AuthAPI.API_Verify(),
					{
						username: this.username,
						password: this.password,
						rememberMe: this.rememberMe,
                        token: this.otp,
					},
				);
				if (!response) {
					this.toastError(this.$t("error.verify"));
					return;
				}
				if (!response.state) {
					this.toastError(this.$t("error.verify"));
					return;
				}
				userService.store(response);
				this.$router.push({ path: "/" });
			} catch (error) {
				console.log(error);
				this.verifying = false;
			}
		},
	},
};
</script>
