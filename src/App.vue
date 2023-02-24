<template>
	<v-app>
		<!-- <v-img
			v-if="!isAuthenticated()"
			src="/img/backgrounds/bg-3.jpg"
			height="100%"
			class="absolute"
			style="position: absolute; height: 100%"
		/> -->
		<AppBar v-if="isAuthenticated() && store.state.config.appBar"></AppBar>
		<NavigationDrawersVue v-if="isAuthenticated()"></NavigationDrawersVue>
		<v-main>
			<v-progress-linear
				:active="loading"
				indeterminate
				color="red darken-2"
			>
			</v-progress-linear>
			<!-- <vue-sign-in v-if="!isAuthenticated()"></vue-sign-in> -->
			<router-view></router-view>
		</v-main>
		<vue-progress-bar></vue-progress-bar>
		<v-overlay :value="loading" z-index="9999" class="cursor-wait">
			<v-progress-circular indeterminate size="64"></v-progress-circular>
		</v-overlay>
	</v-app>
</template>

<script>
import AppBar from "./views/layout/AppBar.vue";
import NavigationDrawersVue from "./views/layout/NavigationDrawers.vue";
import userService from "./services/user.service";
import store from "./store";
import { mapState } from "vuex";
export default {
	name: "App",
	components: { NavigationDrawersVue, AppBar },
	data() {
		return {
			user: () => {
				return userService.getUserInfo();
			},
			isAuthenticated: () => {
				return userService.getUserInfo() != null;
			},
			store: store,
		};
	},
	created() {
		this.$Progress.start();
	},
	watch: {},
	computed: {
		...mapState(["loading", "refCount"]),
	},
	mounted() {
		this.$Progress.finish();
		this.initialize();
	},
	methods: {},
};
</script>
