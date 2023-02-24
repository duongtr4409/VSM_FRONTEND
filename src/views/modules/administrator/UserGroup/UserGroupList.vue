<template>
	<v-card elevation="0">
		<BreadcrumbsVue />
		<v-data-table
			v-model="selected"
			:headers="headers"
			:items="groups"
			multi-sort
			show-select
			:no-results-text="$t('message.no_results')"
			@pagination="changePage($event)"
			:server-items-length="countAllItem"
			:page="eventPage.page"
		>
			<template v-slot:top="{ on, attrs }">
				<v-card-title class="p-0 w-full">
					<v-btn
						elevation="0"
						class="rounded-0 text-capitalize font-weight-regular"
						v-bind="attrs"
						v-on="on"
						to="tao-moi"
						text
						append
					>
						<v-icon small class="mr-2"> mdi-plus </v-icon>
						{{ $t("button.create") }}
					</v-btn>
					<v-btn
						elevation="0"
						class="rounded-0 text-capitalize font-weight-regular"
						text
						@click="deleteAll"
					>
						<v-icon small class="mr-2">
							mdi-trash-can-outline
						</v-icon>
						{{ $t("button.delete") }}
					</v-btn>
					<v-spacer></v-spacer>
					<v-btn icon @click="filterExist = !filterExist">
						<v-icon>mdi-filter </v-icon>
					</v-btn>
				</v-card-title>
				<v-divider></v-divider>
			</template>
			<template
				v-for="header in headers.filter((header) =>
					header.hasOwnProperty('formatter'),
				)"
				v-slot:[`item.${header.value}`]="{ headers, value }"
			>
				{{ header.formatter(value) }}
			</template>
			<template v-slot:[`item.createdName`]="{ item }">
				<template>
					<v-avatar color="red mr-2" size="28">
						<span class="white--text">
							{{ getAvatarText(item.createdName, 2) }}
						</span>
					</v-avatar>
					{{ item.createdName }}
				</template>
			</template>
			<template v-slot:[`item.roles`]="{ item }">
				<span v-if="item.roles.length > 0">
					<em v-for="role of item.roles" :key="role.id">
						{{ role.roleCode }} &nbsp;
					</em>
				</span>
			</template>
			<template v-slot:[`item.action`]="{ item }">
				<v-icon class="mr-2" color="blue" @click="editItem(item)">
					mdi-pencil-circle
				</v-icon>
				<v-icon color="error" @click="deleteItem(item)">
					mdi-close-circle
				</v-icon>
			</template>
			<template v-if="filterExist" v-slot:[`body.prepend`]>
				<v-divider></v-divider>
				<tr>
					<td></td>
					<td class="pl-0">
						<v-text-field
							v-model="groupUser_groupName"
							:label="$t('label.group_name')"
							outlined
							dense
							class="mt-2"
							maxLength="255"
							@keyup="filterByUserName($event)"
						></v-text-field>
					</td>
					<td class="pl-0">
						<v-text-field
							v-model="groupUser_description"
							:label="$t('label.description')"
							outlined
							dense
							class="mt-2"
							maxLength="255"
							@keyup="filterByDescription($event)"
						></v-text-field>
					</td>
					<td class="pl-0">
						<v-autocomplete
							v-model="groupUser_roles"
							item-text="roleCode"
							:items="filterRole"
							:label="$t('label.roles')"
							:item-value="(item) => item"
							class="mt-2"
							dense
							clearable
							outlined
							maxLength="255"
						>
						</v-autocomplete>
						<!-- <v-autocomplete
							v-model="groupUser_roles"
							item-text="roleCode"
							:items="filterRole"
							:item-value="(item) => item"
							class="mt-2"
							maxLength="255"
							dense
							outlined
							:no-data-text="$t('message.no_results')"
							clearable
					
						>
						</v-autocomplete> -->
					</td>
					<td class="pl-0">
						<v-text-field
							v-model="groupUser_created"
							:label="$t('label.created')"
							outlined
							dense
							class="mt-2"
							maxLength="255"
							@keyup="filterByCreatedName($event)"
						></v-text-field>
					</td>
					<td class="pl-0">
						<v-menu
							v-model="showPicker"
							:close-on-content-click="false"
							transition="scale-transition"
							offset-y
						>
							<template v-slot:activator="{ on, attrs }">
								<v-text-field
									:value="formatDateFns"
									clearable
									:label="$t('label.created_date')"
									readonly
									v-bind="attrs"
									v-on="on"
									@click:clear="clearFilterByCreatedDate()"
									append-icon="mdi-calendar"
									outlined
									dense
									class="mt-2"
								></v-text-field>
							</template>
							<v-date-picker
								v-model="groupUser_date_create"
								@change="filterByCreatedDate()"
								no-title
								scrollable
								range
							></v-date-picker>
						</v-menu>
					</td>
				</tr>
			</template>
		</v-data-table>
		<v-dialog v-model="dialog.delete" width="fit-content" persistent>
			<DeleteDialogVue @close="close" @confirmDelete="onConfirmDelete" />
		</v-dialog>
	</v-card>
</template>

<script>
import BreadcrumbsVue from "@/components/Breadcrumbs.vue";
import globalService from "@/services/global.service";
import administratorAPI from "../administrator.api";
import store from "@/store";
import DeleteDialogVue from "@/components/DeleteDialog.vue";
import moment from "moment";
import constant from "@/common/constant";

export default {
	name: "UserGroupListVue",
	components: { BreadcrumbsVue, DeleteDialogVue },
	data() {
		return {
			groupUser_groupName: "",
			groupUser_description: "",
			groupUser_roles: null,
			filterRole: [],
			groupUser_created: "",
			groupUser_date_create: null,
			showPicker: false,
			dialog: {
				delete: false,
			},
			headers: [
				{
					text: this.$t("label.group_name"),
					value: "groupName",
					width: "30vw",
					filter: (value) => {
						if (!this.groupUser_groupName) return true;
						if (!value) return;
						return this.nonAccentVietnamese(value)
							.toLocaleUpperCase()
							.includes(
								this.nonAccentVietnamese(
									this.groupUser_groupName,
								)
									.trim()
									.toLocaleUpperCase(),
							);
					},
				},

				{
					text: this.$t("label.description"),
					value: "description",
					width: "30vw",
					filter: (value) => {
						if (!this.groupUser_description) return true;
						if (!value) return;

						return this.nonAccentVietnamese(value)
							.toLocaleUpperCase()
							.includes(
								this.nonAccentVietnamese(
									this.groupUser_description,
								)
									.trim()
									.toLocaleUpperCase(),
							);
					},
				},
				{
					text: this.$t("label.roles"),
					value: "roles",
					width: "10vw",
					// filter: (value) => {
					// 	if (

					// 		this.groupUser_roles.trim() == ""
					// 	)
					// 		return true;
					// 	return value.filter((entry) => {
					// 		return entry.roleCode.includes(
					// 			this.groupUser_roles,
					// 		);
					// 	}).length;
					// },
				},
				{
					text: this.$t("label.created"),
					align: "start",
					value: "createdName",
					filter: (value) => {
						if (!this.groupUser_created) return true;
						if (!value) return;
						return this.nonAccentVietnamese(value)
							.toLocaleUpperCase()
							.includes(
								this.nonAccentVietnamese(this.groupUser_created)
									.trim()
									.toLocaleUpperCase(),
							);
					},
				},
				{
					text: this.$t("label.date_create"),
					value: "createdDate",

					formatter: (value) =>
						moment(value).isValid()
							? moment(value).format(this.dateFormat)
							: "",

					// filter: (value) => {
					// 	if (!this.groupUser_date_create) return true;
					// 	let values = `${this.groupUser_date_create}`.split(
					// 		constant.values.DATE_RANGE_SEPARATOR,
					// 	);
					// 	values = values
					// 		.map((x) => {
					// 			return moment(`${x}`).toDate().getTime();
					// 		})
					// 		.sort((a, b) => a - b);
					// 	let target = moment(value).toDate().getTime();
					// 	return (
					// 		target >= values[0] &&
					// 		target <=
					// 			values[values.length - 1] + 24 * 60 * 60 * 1000
					// 	);
					// },
				},
				{
					text: this.$t("label.actions"),
					sortale: false,
					value: "action",
				},
			],
			groups: [],
			selected: [],
			countAllItem: 0,
			eventPage: { page: 1 },
		};
	},
	async created() {
		store.state.loading = true;
		// await this.getAllUserGroup();
		await this.getAllRole();
	},
	mounted() {
		store.state.loading = false;
	},
	computed: {
		formatDateFns() {
			if (!this.groupUser_date_create) {
				return "";
			}
			let values = `${this.groupUser_date_create}`.split(
				constant.values.DATE_RANGE_SEPARATOR,
			);
			let result = [];
			result = values.map((x) => {
				return moment(x).format("DD/MM/yyyy");
			});
			return result.join("~");
		},
	},
	watch: {
		"dialog.delete"(val) {
			val || this.close();
		},
		groupUser_roles(val) {
			console.log(val);
			if (!val) {
				console.log(1);
			}
			this.getUserGroup(
				this.eventPage.page - 1,
				this.eventPage.itemsPerPage,
				this.groupUser_date_create
			);
		},
	},
	methods: {
		// async getAllUserGroup() {
		// 	let response;
		// 	try {
		// 		response = await globalService.getData_Async(
		// 			administratorAPI.API_GetAllUserGroup(),
		// 		);

		// 		this.preHandleResponse(response);
		// 		this.groups = response.data.filter((entry) => {
		// 			return !entry.isDelete;
		// 		});
		// 		this.sortList(this.groups);
		// 		console.log("this.groups", this.groups);
		// 	} catch (error) {
		// 		this.toastError(error);
		// 	}
		// },
		async getUserGroup(page, size, createdDate) {
			let _role = null;
			if (this.groupUser_roles) {
				console.log("this.groupUser_roles",this.groupUser_roles)

				_role = [{ id: this.groupUser_roles.id }];
			}
			let param = createdDate ? new Date(createdDate[1]).toISOString().split("T")[0] + "T23:59:59.999Z" : null;
			let reqBody = createdDate ? {
				isDelete: "false",
				isActive: "true",
				groupName: this.groupUser_groupName,
				description: this.groupUser_description,
				createdName: this.groupUser_created,
				roles: _role,
				createdDate: new Date(createdDate[0]).toISOString()
			} : {
				isDelete: "false",
				isActive: "true",
				groupName: this.groupUser_groupName,
				description: this.groupUser_description,
				createdName: this.groupUser_created,
				roles: _role,
			};
			try {
				let response = await globalService.postData_Async(
					administratorAPI.SearchAllUserGroupByDate(page, size, param),
					reqBody,
				);

				if (!response) {
					return this.toastError(this.$t("error.load"));
				}
				//this.countAllItem = parseInt(response.headers["x-total-count"]);
				this.countAllItem = response.data.total;

				this.groups = response.data.listData.filter((entry) => {
					entry.showAll = false;
					return entry;
				});
				this.groups = this.sortList(this.groups);
				// this.groups = this.sortList(this.groups);
			} catch (error) {
				console.log(error);
			}
		},
		async getAllRole() {
			try {
				let response = await globalService.getData_Async(
					administratorAPI.API_GetAllRole(),
				);
				if (!response || !response.state) {
					return;
				}
				this.filterRole = response.data.filter((entry) => {
					return !entry.isDelete;
				});
				// this.filterRole.unshift(this.$t("label.show_all"));
			} catch (error) {
				console.log(error);
			}
		},
		editItem(item) {
			this.$router.push({ path: `${item.id}`, append: true });
		},
		deleteItem(item) {
			this.selected = [item];
			this.dialog.delete = true;
		},
		onConfirmDelete(value) {
			if (!value) {
				this.close();
			} else {
				if (this.selected) {
					this.deleteConfirm();
				}
			}
		},

		sortList(arr) {
			return arr.sort((a, b) => {
				return (
					moment(b.createdDate).toDate().getTime() -
					moment(a.createdDate).toDate().getTime()
				);
			});
		},
		deleteAll() {
			if (this.selected.length > 0) {
				this.dialog.delete = true;
			} else {
				this.toastError(this.$t("label.no_selected"));
			}
		},
		async deleteConfirm() {
			this.selected = this.selected.map((x) => {
				x.isDelete = true;
				return x;
			});
			try {
				let response = await globalService.postData_Async(
					administratorAPI.API_SaveAllUserGroup(),
					this.selected,
				);
				if (!response || !response.state) {
					this.toastError(this.$t("message.delete_error"));
				} else {
					this.toastSuccess(this.$t("message.delete_success"));
				}
			} catch (error) {
				this.toastError(this.$t("error.load"));
			} finally {
				this.selected = [];
				// this.getAllUserGroup();
				this.getUserGroup(constant.page, constant.page_size, this.groupUser_date_create);
				this.close();
			}
		},
		close() {
			this.dialog.delete = false;
		},
		// changePage(event) {
		// 	this.getUserGroup(event.page - 1, event.itemsPerPage);
		// },
		changePage(event) {
			this.eventPage = event;
			if (event.itemsPerPage == -1) {
				event.itemsPerPage = 100;
			}
			this.getUserGroup(event.page - 1, event.itemsPerPage, this.groupUser_date_create);
			return;
		},
		filterByUserName(event) {
			if (
				event.code == constant.keys.enter ||
				event.keyCode == constant.keys.enter_keyCode ||
				!event.target.value
			) {
				this.eventPage.page = 1;
				this.getUserGroup(
					this.eventPage.page - 1,
					this.eventPage.itemsPerPage,
					this.groupUser_date_create
				);
			}
		},
		filterByDescription(event) {
			if (
				event.code == constant.keys.enter ||
				event.keyCode == constant.keys.enter_keyCode ||
				!event.target.value
			) {
				this.eventPage.page = 1;
				this.getUserGroup(
					this.eventPage.page - 1,
					this.eventPage.itemsPerPage,
					this.groupUser_date_create
				);
			}
		},
		filterByCreatedName(event) {
			if (
				event.code == constant.keys.enter ||
				event.keyCode == constant.keys.enter_keyCode ||
				!event.target.value
			) {
				this.eventPage.page = 1;
				this.getUserGroup(
					this.eventPage.page - 1,
					this.eventPage.itemsPerPage,
					this.groupUser_date_create
				);
			}
		},
		filterByCreatedDate(){
			this.showPicker = false;
			this.getUserGroup(this.eventPage.page - 1, this.eventPage.itemsPerPage, this.groupUser_date_create);
		},
		clearFilterByCreatedDate(){
			this.groupUser_date_create = null;
			this.getUserGroup(this.eventPage.page - 1, this.eventPage.itemsPerPage, this.groupUser_date_create);
		}
	},
};
</script>

<style></style>
