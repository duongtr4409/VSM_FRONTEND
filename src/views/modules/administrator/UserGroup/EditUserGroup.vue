<template>
	<v-card elevation="0">
		<BreadcrumbsVue />
		<TabVue
			:tabs="tabs"
			:buttons="buttons"
			@buttonClick="handleButtonClick"
		/>
		<v-row class="mt-2">
			<v-col cols="12" md="6">
				<!-- <m-text-field
					:label="$t('label.group_name')"
					:value="group.groupName"
					@value="(v) => (group.groupName = v)"
					:required="true"
				>
				</m-text-field> -->
				<v-text-field
					hide-details
					v-model="group.groupName"
					outlined
					dense
					maxLength="255"
				>
					<template v-slot:label>
						{{ $t("label.group_name") }}
						<span class="text-red-600">{{ $t("label.star") }}</span>
					</template>
				</v-text-field>
			</v-col>
			<v-col cols="12" md="6">
				<!-- <m-text-field
					:label="$t('label.description')"
					:value="group.description"
					@value="(v) => (group.description = v)"
				>
				</m-text-field> -->
				<v-text-field
					hide-details
					v-model="group.description"
					outlined
					dense
					maxLength="255"
				>
					<template v-slot:label>
						{{ $t("label.description") }}
					</template>
				</v-text-field>
			</v-col>
		</v-row>
		<v-row class="mt-2">
			<v-checkbox
				class="ml-2"
				v-model="group.isActive"
				:label="`Tự động thêm người dùng mới`"
			></v-checkbox>
		</v-row>
		<TabVue
			:tabs="[{ key: 'user', title: $t('label.user') }]"
			:buttons="[]"
		/>
		<v-row>
			<v-col cols="12">
				<SelectListVue
					:items="users"
					:selected="group.userInfos"
					keyName="id"
					valueName="fullName"
					@localUpdate="
						(v) => {
							group.userInfos = v;
						}
					"
					@scrollReachEnd="eventScroll"
				/>
			</v-col>
		</v-row>
		<TabVue
			:tabs="[{ key: 'role', title: $t('label.roles') }]"
			:buttons="[]"
		/>
		<v-row>
			<v-col cols="12">
				<SelectListVue
					:items="roles"
					:selected="group.roles"
					keyName="id"
					valueName="roleName"
					@localUpdate="
						(v) => {
							group.roles = v;
						}
					"
				/>
			</v-col>
		</v-row>
	</v-card>
</template>

<script>
import TabVue from "@/components/Tab.vue";
import BreadcrumbsVue from "@/components/Breadcrumbs.vue";
import store from "@/store";
import UserGroupDto from "@/models/user-group.dto";
import SelectListVue from "@/components/SelectList.vue";
import globalService from "@/services/global.service";
import administratorAPI from "../administrator.api";
import constant from "@/common/constant";

export default {
	name: "EditUserGroupVue",
	components: { TabVue, BreadcrumbsVue, SelectListVue },
	data() {
		return {
			tabs: [{ key: "information", title: this.$t("label.information") }],
			buttons: [
				{
					icon: "mdi-content-save",
					title: this.$t("button.save"),
					color: "blue darken-2",
					transparent: false,
					dark: true,
					event: this.save,
				},
				// {
				// 	icon: "mdi-trash-can-outline",
				// 	title: this.$t("button.delete"),
				// 	color: "black",
				// 	transparent: true,
				// 	dark: false,
				// 	event: this.delete,
				// },
				{
					icon: "mdi-arrow-left-top",
					title: this.$t("button.back"),
					color: "black",
					transparent: true,
					dark: false,
					event: this.redirectBack,
				},
			],
			group: {
				groupName: "",
				description: "",
			},
			users: [],
			roles: [],
			pageNumber: 0,
			isLoading: false,
		};
	},
	async created() {
		store.state.loading = true;
		this.group = Object.assign({}, UserGroupDto);
		await this.getAllUser();
		await this.getAllRole();
		await this.initialize();
	},
	async mounted() {
		store.state.loading = false;
	},
	methods: {
		async handleButtonClick(event) {
			await event();
		},
		back() {
			this.$router.push({ path: "." });
		},
		async getAllUser() {
			let response;

			try {
				let reqBody = {
					isDelete: "false",
				};
				response = await globalService.postData_Async(
					administratorAPI.SearchAllUser(
						this.pageNumber,
						constant.page_size,
					),
					reqBody,
				);
				if (!response) {
					return;
				}
				if (response.data.listData && response.data.listData.length) {
					response.data.listData.filter((entry) => {
						if (this.users.indexOf(entry) != false) {
							this.users.push(entry);
						}
					});
				}
				if (response.data.listData.length) {
					this.isLoading = false;
				} else {
					this.isLoading = true;
				}
			} catch (error) {
				this.toastError(error);
			}
		},
		async getAllRole() {
			let response;
			try {
				response = await globalService.getData_Async(
					administratorAPI.API_GetAllRole(),
				);
				if (!response) {
					return;
				}
				this.roles = response.data.filter((x) => !x.isDelete);
			} catch (error) {
				this.toastError(error);
			}
		},
		async handleUser(value) {
			this.group.userInfos = value;
		},
		async handleRole(value) {
			this.group.roles = value;
		},
		async save() {
			this.group.groupName = this.group.groupName
				? `${this.group.groupName}`.trim()
				: "";
			this.group.description = this.group.description
				? `${this.group.description}`.trim()
				: "";
			if (!this.validRequiredText(this.group.groupName)) {
				this.toastError(this.$t("error.group_name"));
				return;
			}
			if (!this.validText(this.group.description)) {
				return;
			}
			let response;
			if (!this.group.id) {
				this.group.createdDate = new Date();
				this.group.createdName = this.getUserInfo().fullName;
			}
			this.group.modifiedDate = new Date();
			this.group.modifiedName = this.getUserInfo().fullName;
			try {
				if (!this.group.id) {
					response = await globalService.postData_Async(
						administratorAPI.API_CreateUserGroup(),
						this.group,
					);
					if (!response || !response.state) {
						this.toastError(this.$t("message.add_error"));
					} else {
						this.toastSuccess(this.$t("message.add_success"));
					}
				} else {
					response = await globalService.putData_Async(
						administratorAPI.API_SaveUserGroup(this.group.id),
						this.group,
					);
					if (!response || !response.state) {
						this.toastError(this.$t("message.update_error"));
					} else {
						this.toastSuccess(this.$t("message.update_success"));
					}
				}
				if (!this.preHandleResponse(response)) {
					return;
				}
				this.group = response.data;
			} catch (error) {
				this.toastError(error);
			}
		},
		async delete() {
			if (!this.group.id) {
				this.$router.push({ path: "." });
				return;
			}
			let response;
			this.group.isDelete = true;
			try {
				response = await globalService.putData_Async(
					administratorAPI.API_SaveUserGroup(this.group.id),
					this.group,
				);
				if (!this.preHandleResponse(response)) {
					return;
				}
				this.$router.push({ path: "." });
			} catch (error) {
				this.toastError(error);
			}
		},
		async initialize() {
			if (!this.$router.currentRoute.params.id) {
				return;
			}
			let response;
			try {
				response = await globalService.getData_Async(
					administratorAPI.API_GetUserGroup(
						this.$router.currentRoute.params.id,
					),
				);
				if (!this.preHandleResponse(response)) {
					return;
				}
				this.group = response.data;
				for (let user of this.group.userInfos) {
					let index = this.users.indexOf(user);
					this.users.splice(index, 1);
				}
				for (let role of this.group.roles) {
					let index = this.roles.indexOf(role);
					this.roles.splice(index, 1);
				}
			} catch (error) {
				this.toastError(error);
			}
		},
		eventScroll(event) {
			if (!this.isLoading && event) {
				this.isLoading = true;
				this.pageNumber = this.pageNumber + 1;
				this.getAllUser();
			}
		},
	},
};
</script>

<style></style>
