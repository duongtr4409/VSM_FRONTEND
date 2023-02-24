<template>
	<v-card elevation="0">
		<BreadcrumbsVue />
		<v-dialog v-model="dialog.delete" persistent width="fit-content">
			<DeleteDialogVue
				@close="onCloseDialog"
				@confirmDelete="onConfirmDelete"
			/>
		</v-dialog>

		<v-data-table
			v-model="selected"
			:headers="headers"
			:items="desserts"
			:single-select="singleSelect"
			item-key="id"
			show-select
			class="grey lighten-5"
		>
			<template v-slot:top>
				<v-dialog v-model="dialog.edit" persistent width="80vw">
					<template v-slot:activator="{ on, attrs }">
						<v-card-title class="w-full">
							<!-- <v-btn
								text
								class="
									rounded-0
									text-capitalize
									font-weight-regular
								"
							>
								{{ $t("label.show_all") }}
								<v-icon small class="mr-2">
									mdi-menu-down
								</v-icon>
							</v-btn> -->
							<v-btn
								text
								class="
									rounded-0
									text-capitalize
									font-weight-regular
								"
								v-bind="attrs"
								v-on="on"
							>
								<v-icon small class="mr-2"> mdi-plus </v-icon>
								{{ $t("button.create") }}
								<v-icon small class="mr-2"
									>mdi-menu-down</v-icon
								>
							</v-btn>
							<v-btn
								class="
									rounded-0
									text-capitalize
									font-weight-regular
								"
								text
								@click="deleteAll"
							>
								<v-icon small class="mr-2"
									>mdi-delete-outline</v-icon
								>
								{{ $t("button.delete_all") }}
							</v-btn>
							<v-spacer></v-spacer>
							<v-btn icon @click="filterExist = !filterExist">
								<v-icon>mdi-filter </v-icon>
							</v-btn>
						</v-card-title>
					</template>
					<EditRoleVue
						:editedItem="editedItem"
						:isEdit="dialog.edit"
						@close="onCloseDialog"
					/>
				</v-dialog>
			</template>
			<template v-slot:[`body.prepend`]>
				<v-divider></v-divider>
				<tr v-if="filterExist">
					<td></td>
					<td class="pl-0">
						<v-text-field
							v-model="roleCode"
							type="string"
							outlined
							dense
							class="mt-2"
							:label="$t('label.name')"
							@keyup="onKeyUpSearchForRoleCode"
							:error-messages="errorMessageSearchRoleCode"
							maxLength="255"
						></v-text-field>
					</td>
					<td class="pl-0">
						<v-text-field
							v-model="roleName"
							type="string"
							outlined
							dense
							class="mt-2"
							:label="$t('label.role_type')"
							@keyup="onKeyUpSearchForRoleName"
							:error-messages="errorMessageSearchRoleName"
							maxLength="255"
						></v-text-field>
					</td>
					<td class="pl-0">
						<v-text-field
							v-model="createdName"
							type="string"
							outlined
							dense
							class="mt-2"
							:label="$t('label.created_name')"
							@keyup="onKeyUpSearchForCreatedName"
							:error-messages="errorMessageSearchCreatedName"
							maxLength="255"
						></v-text-field>
					</td>
					<td class="pl-0">
						<v-menu
							v-model="showPicker"
							:close-on-content-click="false"
							max-width="290"
						>
							<template v-slot:activator="{ on, attrs }">
								<v-text-field
									:value="formatDateFns"
									clearable
									:label="$t('label.created_date')"
									class="mt-2"
									readonly
									v-bind="attrs"
									v-on="on"
									@click:clear="createdDate = null"
									outlined
									dense
								></v-text-field>
							</template>
							<v-date-picker
								v-model="createdDate"
								@change="showPicker = false"
								no-title
								scrollable
								range
							></v-date-picker>
						</v-menu>
					</td>
					<td></td>
				</tr>
			</template>

			<template
				v-for="header in headers.filter((header) =>
					header.hasOwnProperty('formatter'),
				)"
				v-slot:[`item.${header.value}`]="{ headers, value }"
			>
				{{ header.formatter(value) }}
			</template>

			<template v-slot:[`item.actions`]="{ item }">
				<div class="d-flex" style="min-width: fit-content">
					<v-icon
						class="mr-2"
						color="blue darken-1"
						@click="editItem(item)"
					>
						mdi-pencil-circle
					</v-icon>
					<v-icon color="red" @click="deleteItem(item)">
						mdi-close-circle
					</v-icon>
				</div>
			</template>
			<template v-slot:no-data
				><h1>{{ $t("message.no_data") }}</h1></template
			>
			<template v-slot:no-results
				><h1>{{ $t("message.no_results") }}</h1>
			</template>
			<template v-slot:[`item.isActive`]="{ item }">
				<v-simple-checkbox
					v-model="item.isActive"
					disabled
				></v-simple-checkbox>
			</template>
		</v-data-table>
	</v-card>
</template>
<script>
import globalService from "@/services/global.service";
import moment from "moment";
import DeleteDialogVue from "@/components/DeleteDialog.vue";
import BreadcrumbsVue from "@/components/Breadcrumbs.vue";
import EditRoleVue from "./EditRole.vue";
import constant from "@/common/constant";
import administratorAPI from "../administrator.api";
export default {
	name: "RoleManagement",
	components: { DeleteDialogVue, BreadcrumbsVue, EditRoleVue },
	data() {
		return {
			filterExist: false,
			errorMessage: "",
			errorMessageSearchRoleCode: "",
			errorMessageSearchRoleName: "",
			errorMessageSearchCreatedName: "",
			errorMessageSearchAll: "",
			user_current: this.getUserInfo(),
			roleCode: "",
			roleName: "",
			createdName: "",
			dateFormat: "DD/MM/yyyy",
			createdDate: null,
			modifiedDate: null,
			singleSelect: false,
			isActive: this.$t("label.show_all"),
			filterItems: [
				this.$t("label.show_all"),
				this.$t("label.used"),
				this.$t("label.unused"),
			],
			selected: [],
			dialog: {
				view: false,
				edit: false,
				delete: false,
			},
			search: "",
			items: [],
			isSaving: false,
			isDeleting: false,
			showPicker: false,
			showModifyDatePicker: false,
			headers: [
				{
					text: this.$t("label.name"),
					value: "roleName",
					filter: (value) => {
						if (!this.roleCode || !value) return true;

						return this.nonAccentVietnamese(value)
							.toLocaleUpperCase()
							.includes(
								this.nonAccentVietnamese(this.roleCode)
									.trim()
									.toLocaleUpperCase()
									.replace(/\s+/g, " "),
							);
					},
				},
				{
					text: this.$t("label.role_type"),
					value: "roleType",
					filter: (value) => {
						if (!this.roleName || !value) return true;

						return this.nonAccentVietnamese(value)
							.toLocaleUpperCase()
							.includes(
								this.nonAccentVietnamese(this.roleName)
									.trim()
									.toLocaleUpperCase()
									.replace(/\s+/g, " "),
							);
					},
				},
				{
					text: this.$t("label.created_name"),
					value: "createdName",
					filter: (value) => {
						if (!this.createdName || !value) return true;

						return this.nonAccentVietnamese(value)
							.toLocaleUpperCase()
							.includes(
								this.nonAccentVietnamese(this.createdName)
									.trim()
									.toLocaleUpperCase()
									.replace(/\s+/g, " "),
							);
					},
				},
				{
					text: this.$t("label.created_date"),
					value: "createdDate",
					formatter: (x) =>
						x ? moment(x).format(this.dateFormat) : null,
					filter: (value) => {
						if (!this.createdDate) return true;
						let values = `${this.createdDate}`.split(
							constant.values.DATE_RANGE_SEPARATOR,
						);
						values = values
							.map((x) => {
								return moment(`${x}`).toDate().getTime();
							})
							.sort((a, b) => a - b);
						let target = moment(value).toDate().getTime();
						return (
							target >= values[0] &&
							target <=
							values[values.length - 1] + 24 * 60 * 60 * 1000
						);
					},
				},
				// {
				// 	text: this.$t("label.modified_date"),
				// 	value: "modifiedDate",
				// 	formatter: (x) =>
				// 		x ? moment(x).format(this.dateFormat) : null,
				// 	filter: (value) => {
				// 		if (!this.modifiedDate) return true;
				// 		return value.includes(this.modifiedDate);
				// 	},
				// },
				{
					text: this.$t("label.manipulation"),
					value: "actions",
					sortable: false,
				},
			],
			desserts: [],
			editedIndex: -1,
			editedItem: {
				created: null,
				createdDate: null,
				createdName: "",
				createdOrgName: "",
				createdRankName: "",
				id: null,
				isActive: true,
				isAutoAdd: false,
				isDelete: false,
				isHaveDelete: false,
				isHaveDownload: false,
				isHaveEdit: false,
				isHaveView: false,
				modified: null,
				modifiedDate: null,
				modifiedName: "",
				requestList: "",
				roleCode: "",
				roleName: "",
				roleType: "",
				tennant: null,
				tennantCode: "",
				tennantName: "",
				userGroupDTOList: [],
				userInfoDTOList: [],
			},
			defaultItem: {
				created: null,
				createdDate: null,
				createdName: "",
				createdOrgName: "",
				createdRankName: "",
				id: null,
				isActive: true,
				isAutoAdd: false,
				isDelete: false,
				isHaveDelete: false,
				isHaveDownload: false,
				isHaveEdit: false,
				isHaveView: false,
				modified: null,
				modifiedDate: null,
				modifiedName: "",
				requestList: "",
				roleCode: "",
				roleName: "",
				roleType: "",
				tennant: null,
				tennantCode: "",
				tennantName: "",
				userGroupDTOList: [],
				userInfoDTOList: [],
			},
			
		};
	},

	computed: {
		formTitle() {
			return this.editedIndex === -1
				? this.$t("title.create_role")
				: this.$t("title.edit_role");
		},
		form() {
			return {
				roleName: this.editedItem.roleName,
			};
		},
		formatDateFns() {
			if (!this.createdDate) {
				return "";
			}
			let values = `${this.createdDate}`.split(
				constant.values.DATE_RANGE_SEPARATOR,
			);
			let result = [];
			result = values.map((x) => {
				return moment(x).format("DD/MM/yyyy");
			});
			return result.join("~");
		},
		formatModifyDateFns() {
			return this.modifiedDate
				? moment(this.modifiedDate).format(this.dateFormat)
				: "";
		},
	},

	watch: {
		"dialog.edit"(val) {
			val || this.close();
		},
		"dialog.delete"(val) {
			val || this.closeDelete();
		},
		"dialog.view"(val) {
			val || this.closeView();
		},
	},
	async created() {
		this.$Progress.start();
		this.initialize();
	},
	mounted() {
		this.$Progress.finish();
	},

	methods: {
		async initialize() {
			try {
				let response = await globalService.getData_Async(
					administratorAPI.API_GetAllRole(),
				);
				if (!response.state) {
					return;
				}
				this.desserts = response.data;
				this.desserts = response.data.filter((entry) => {
					return entry.isDelete == false;
				});
				this.desserts = this.sortList(this.desserts);
				this.items = [
					{
						text: "Home",
						disable: false,
						href: "/Home",
					},
					{
						text: this.$t(`title.title_management`),
						disable: true,
					},
				];
			} catch (error) {
				console.log(error);
			}
		},

		editItem(item) {
			this.editedIndex = this.desserts.indexOf(item);
			this.editedItem = Object.assign({}, item);
			this.dialog.edit = true;
		},
		viewItem(item) {
			this.editedIndex = this.desserts.indexOf(item);
			this.editedItem = Object.assign({}, item);
			this.editedItem.createdDate = moment(
				this.editedItem.createdDate,
			).format(this.dateFormat);
			this.editedItem.modifiedDate = moment(
				this.editedItem.modifiedDate,
			).format(this.dateFormat);
			this.dialog.edit = true;
			this.dialog.view = true;
		},

		deleteItem(item) {
			this.selected = [item];
			this.editedIndex = this.desserts.indexOf(item);
			this.editedItem = Object.assign({}, item);
			this.dialog.delete = true;
		},

		async deleteItemConfirm() {
			if (this.isDeleting) {
				return;
			}
			this.isDeleting = true;
			try {
				let response = await globalService.deleteData_Async(
					`/api/roles/${this.editedItem.id}`,
					this.editedItem,
				);
				if (!response.state) {
					this.isDeleting = true;
					this.toastError(this.$t("message.delete_error"));
				} else {
					this.toastSuccess(this.$t("message.delete_success"));
				}
			} catch (error) {
				console.log(error);
			}
			this.isDeleting = false;
			this.initialize();
			this.closeDelete();
		},
		deleteAll() {
			if (this.selected.length > 0) {
				this.dialog.delete = true;
			} else {
				this.toastError(this.$t("message.alert_no_selected"));
			}
		},
		async deleteAllConfirm() {
			if (this.isDeleting) {
				return;
			}
			this.isDeleting = true;
			this.selected = this.selected.map((entry) => {
				entry.isDelete = true;
				return entry;
			});
			try {
				let response = await globalService.postData_Async(
					administratorAPI.API_DeleteRole(),
					this.selected,
				);
				if (response.state) {
					this.isDeleting = true;
					this.toastSuccess(this.$t("message.delete_success"));
				} else {
					this.toastError(this.$t("message.delete_error"));
				}
			} catch (error) {
				console.log(error);
			}
			this.selected = [];
			this.isDeleting = false;
			this.initialize();
			this.closeDeleteAll();
		},

		close() {
			this.dialog.edit = false;
			this.errorMessage = "";
			this.$nextTick(() => {
				this.editedItem = Object.assign({}, this.defaultItem);
				this.editedIndex = -1;
			});
			this.initialize();
		},
		closeView() {
			this.dialog.view = false;
			this.$nextTick(() => {
				this.editedItem = Object.assign({}, this.defaultItem);
				this.editedIndex = -1;
			});
		},

		closeDelete() {
			this.dialog.delete = false;
			this.$nextTick(() => {
				this.editedItem = Object.assign({}, this.defaultItem);
				this.editedIndex = -1;
			});
			this.initialize();
		},

		closeDeleteAll() {
			this.dialog.delete = false;
		},
		onKeyUp() {
			if (
				this.editedItem.roleName != "" ||
				this.editedItem.roleName.length < 255
			) {
				this.errorMessage = "";
			}
			if (this.editedItem.roleName.length > 255) {
				this.errorMessage = this.$t("message.maxlength_required_255");
			}
		},
		onKeyUpSearchForRoleCode() {
			if (this.roleCode != "" || this.roleCode.length < 255) {
				this.errorMessageSearchRoleCode = "";
			}
			if (this.roleCode.length > 255) {
				this.errorMessageSearchRoleCode = this.$t(
					"message.maxlength_required_255",
				);
			}
		},
		onKeyUpSearchForRoleName() {
			if (this.roleName != "" || this.roleName.length < 255) {
				this.errorMessageSearchRoleName = "";
			}
			if (this.roleName.length > 255) {
				this.errorMessageSearchRoleName = this.$t(
					"message.maxlength_required_255",
				);
			}
		},
		onKeyUpSearchForCreatedName() {
			if (this.createdName != "" || this.createdName.length < 255) {
				this.errorMessageSearchCreatedName = "";
			}
			if (this.createdName.length > 255) {
				this.errorMessageSearchCreatedName = this.$t(
					"message.maxlength_required_255",
				);
			}
		},

		onKeyUpForSearchAll() {
			if (this.search != "" || this.search.length < 255) {
				this.errorMessageSearchAll = "";
			}
			if (this.search.length > 255) {
				this.errorMessageSearchAll = this.$t(
					"message.maxlength_required_255",
				);
			}
		},
		customFilter(value, search, item) {
			return (
				!!search && this.match(item, search.trim().replace(/\s+/g, " "))
			);
		},
		sortList(arr) {
			return arr.sort((a, b) => {
				return (
					moment(b.createdDate).toDate().getTime() -
					moment(a.createdDate).toDate().getTime()
				);
			});
		},
		onConfirmDelete(value) {
			if (!value) {
				this.onCloseDialog();
			} else {
				if (this.selected) {
					this.deleteAllConfirm();
				}
			}
		},
	},
};
</script>
<style>
tbody tr:nth-of-type(odd) {
	background-color: #ffffff;
}
.v-picker__title__btn--active {
	display: none;
}
</style>
