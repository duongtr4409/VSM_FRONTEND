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
			:search="search"
			:custom-filter="customFilter"
		>
			<template v-slot:[`item.createdName`]="{ item }">
				<template>
					<v-avatar color="red darken-2 mr-2" size="28">
						<span class="white--text">
							{{ getAvatarText(item.createdName, 2) }}
						</span>
					</v-avatar>
					{{ item.createdName }}
				</template>
			</template>
			<template v-slot:top>
				<v-dialog v-model="dialog.edit" persistent width="60vw">
					<template v-slot:activator="{ on, attrs }">
						<v-card-title class="p-0 w-full">
							<v-btn
								class="
									rounded-pill
									text-capitalize
									font-weight-regular
								"
								elevation="0"
								v-bind="attrs"
								v-on="on"
								text
								@click="editItem(defaultItem)"
							>
								<v-icon small class="mr-2"> mdi-plus </v-icon>
								{{ $t("button.create") }}
								<v-icon small class="mr-2">
									mdi-menu-down
								</v-icon>
							</v-btn>
							<v-btn
								elevation="0"
								text
								@click="deleteAll"
								class="
									rounded-pill
									text-capitalize
									font-weight-regular
								"
							>
								<v-icon small class="mr-2">
									mdi-delete-outline
								</v-icon>
								{{ $t("button.delete_all") }}
							</v-btn>
							<v-spacer></v-spacer>
							<v-btn icon @click="filterExist = !filterExist">
								<v-icon>mdi-filter </v-icon>
							</v-btn>
						</v-card-title>
						<v-divider></v-divider>
					</template>

					<v-card>
						<v-toolbar flat color="grey lighten-4">
							<v-toolbar-title>
								{{ $t("label.information") }}
							</v-toolbar-title>
							<v-spacer></v-spacer>
							<v-btn icon @click="dialog.edit = false">
								<v-icon>mdi-close</v-icon>
							</v-btn>
						</v-toolbar>

						<v-card-text class="mt-3">
							<v-container>
								<v-form v-model="valid">
									<v-row>
										<v-col cols="12" sm="12" md="12">
											<v-text-field
												:label="$t('label.name_title')"
												ref="rankName"
												v-model="editedItem.rankName"
												outlined
												hide-details
												dense
												maxLength="255"
												:disabled="dialog.view"

											>
												<template v-slot:label>
													{{ $t("label.name_title") }}
													<span class="text-red-600">
														{{ $t("label.star") }}
													</span>
												</template>
											</v-text-field>
										</v-col>
										<!-- <v-col cols="12" sm="12" md="12" v-if="dialog.edit">
											<v-autocomplete
												
												:label="$t('report.unit_list')"
												outlined
												dense
												v-model="list_Organizations"
												:items="listOrganizations"
												item-text="organizationName"
												clearable
												multiple
												:item-value="(val) => val"
											>
											</v-autocomplete>
										</v-col> -->
										<v-col cols="12" sm="12" md="12">
											<v-autocomplete
												
												:label="$t('report.unit_list')"
												outlined
												dense
												v-model="list_Organizations"
												:items="listOrganizations"
												item-text="organizationName"
												clearable
												multiple
												:item-value="(val) => val"
												:disabled="dialog.view"
											>
											</v-autocomplete>
										</v-col>
									</v-row>
								</v-form>
							</v-container>
						</v-card-text>

						<v-card-actions>
							<v-spacer></v-spacer>
							<v-btn
								v-if="dialog.edit && !dialog.view"
								elevation="0"
								color="blue darken-2"
								dark
								class="rounded-0"
								@click="save"
							>
								{{ $t("button.ok") }}
							</v-btn>
							<v-btn
								elevation="0"
								color="grey lighten-4"
								class="rounded-0"
								@click="close"
							>
								{{ $t("button.cancel") }}
							</v-btn>
						</v-card-actions>
					</v-card>
				</v-dialog>
			</template>

			<template v-slot:[`body.prepend`]>
				<v-divider></v-divider>
				<tr v-if="filterExist">
					<td></td>
					<td class="pl-0">
						<v-text-field
							v-model="rankCode"
							type="string"
							outlined
							dense
							class="mt-2"
							:label="$t('label.rank_code')"
							@keyup="onKeyUpSearchForRankCode"
							:error-messages="errorMessageSearchRankCode"
							maxLength="255"
						></v-text-field>
					</td>
					<td class="pl-0">
						<v-text-field
							v-model="rankName"
							type="string"
							outlined
							dense
							class="mt-2"
							:label="$t('label.rank_name')"
							@keyup="onKeyUpSearchForRankName"
							:error-messages="errorMessageSearchRankName"
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
					<td class="pl-0">
						<v-menu
							v-model="showModifyDatePicker"
							:close-on-content-click="false"
							max-width="290"
						>
							<template v-slot:activator="{ on, attrs }">
								<v-text-field
									:value="formatModifyDateFns"
									clearable
									:label="$t('label.modified_date')"
									class="mt-2"
									readonly
									v-bind="attrs"
									v-on="on"
									@click:clear="modifiedDate = null"
									outlined
									dense
								></v-text-field>
							</template>
							<v-date-picker
								v-model="modifiedDate"
								@change="showModifyDatePicker = false"
								no-title
								scrollable
								range
							></v-date-picker>
						</v-menu>
					</td>
					<td class="pl-0">
						<v-select
							:menu-props="{ bot: true, offsetY: true }"
							v-model="isActive"
							:items="filterItems"
							outlined
							dense
							class="mt-2"
							:label="$t('label.is_active')"
							:no-data-text="$t('message.no_results')"
						></v-select>
					</td>
					<td></td>
				</tr>
			</template>
			<template v-slot:[`item.rankName`]="{ item }">
				<v-tooltip bottom>
					<template v-slot:activator="{ on, attrs }">
						<span v-bind="attrs" v-on="on">
							{{ item.rankName.slice(0, 30) }}
							<span v-if="item.rankName.length > 20"> ... </span>
						</span>
					</template>
					<span>
						{{ item.rankName }}
					</span>
				</v-tooltip>
			</template>
			<template v-slot:[`item.actions`]="{ item }">
				<div class="d-flex" style="min-width: fit-content">
					<v-icon
						class="mr-2"
						color="blue darken-1"
						@click="viewItem(item)"
					>
						mdi-eye-circle
					</v-icon>
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
			<template
				v-for="header in headers.filter((header) =>
					header.hasOwnProperty('formatter'),
				)"
				v-slot:[`item.${header.value}`]="{ headers, value }"
			>
				{{ header.formatter(value) }}
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
import administratorAPI from "../administrator.api";
import constant from "@/common/constant";


export default {
	name: "RankManegement",
	components: { DeleteDialogVue, BreadcrumbsVue },
	data() {
		return {
			errorMessage: "",
			errorMessageSearchRankCode: "",
			errorMessageSearchRankName: "",
			errorMessageSearchCreatedName: "",
			errorMessageSearchAll: "",
			user_current: this.getUserInfo(),
			rankCode: "",
			rankName: "",
			dateFormat: "DD/MM/yyyy",
			createdDate: null,
			modifiedDate: null,
			createdName: "",
			isActive: this.$t("label.show_all"),
			filterItems: [
				this.$t("label.show_all"),
				this.$t("label.used"),
				this.$t("label.unused"),
			],
			singleSelect: false,
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
					text: this.$t("label.code_title"),
					value: "rankCode",
					filter: (value) => {
						if (!this.rankCode || !value) return true;

						return this.nonAccentVietnamese(value)
							.toLocaleUpperCase()
							.includes(
								this.nonAccentVietnamese(this.rankCode)
									.trim()
									.toLocaleUpperCase()
									.replace(/\s+/g, " "),
							);
					},
				},
				{
					text: this.$t("label.name_title"),
					value: "rankName",
					filter: (value) => {
						if (!this.rankName || !value) return true;

						return this.nonAccentVietnamese(value)
							.toLocaleUpperCase()
							.includes(
								this.nonAccentVietnamese(this.rankName)
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
				// {
				// 	text: this.$t("label.created_date"),
				// 	value: "createdDate",
				// 	formatter: (x) =>
				// 		x ? moment(x).format(this.dateFormat) : null,
				// 	filter: (value) => {
				// 		if (!this.createdDate) return true;
				// 		return value.includes(this.createdDate);
				// 	},
				// },
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
				{
					text: this.$t("label.modified_date"),
					value: "modifiedDate",
					formatter: (x) =>
						x ? moment(x).format(this.dateFormat) : null,
					filter: (value) => {
						if (!this.modifiedDate) return true;
						let values = `${this.modifiedDate}`.split(
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
				
				{
					text: this.$t("label.is_active"),
					value: "isActive",
					filter: (value) => {
						if (this.isActive == this.$t("label.used")) {
							return value == true;
						}
						if (this.isActive == this.$t("label.unused")) {
							return value == false;
						}
						return true;
					},
				},
				{
					text: this.$t("label.manipulation"),
					value: "actions",
					sortable: false,
				},
			],
			desserts: [],
			editedIndex: -1,
			editedItem: {
				id: null,
				rankCode: "",
				rankName: "",
				createdId: null,
				createdName: "",
				createdDate: null,
				modifiedId: null,
				modifiedName: "",
				modifiedDate: null,
				isActive: true,
				isDelete: false,
				userInfos: [],
				organizationIds: null,
			},
			defaultItem: {
				id: null,
				rankCode: "",
				rankName: "",
				createdId: null,
				createdName: "",
				createdDate: null,
				modifiedId: null,
				modifiedName: "",
				modifiedDate: null,
				isActive: true,
				isDelete: false,
				userInfos: [],
				organizationIds: null,
			},
			listOrganizations: null,
			list_Organizations: [],
		};
	},

	computed: {
		formTitle() {
			return this.editedIndex === -1
				? this.$t("title.create_rank")
				: this.$t("title.edit_rank");
		},
		form() {
			return {
				rankName: this.editedItem.rankName,
			};
		},
		// formatDateFns() {
		// 	return this.createdDate
		// 		? moment(this.createdDate).format(this.dateFormat)
		// 		: "";
		// },
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
			if (!this.modifiedDate) {
				return "";
			}
			let values = `${this.modifiedDate}`.split(
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
					administratorAPI.API_GetAllRank(),
				);
				if (!response.state) {
					return;
				}
				this.desserts = response.data;
				this.desserts = response.data.filter((entry) => {
					return entry.isDelete == false;
				});
			} catch (error) {
				console.log(error);
			}
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
			await this.getAllOrganize();
		},

		async editItem(item) {
			await this.getAllOrganizaionByRankInOrg(item.id);
			this.editedIndex = this.desserts.indexOf(item);
			this.editedItem = Object.assign({}, item);
			this.dialog.edit = true;
		},
		 async viewItem(item) {
			await this.getAllOrganizaionByRankInOrg(item.id);

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
					`/api/ranks/${this.editedItem.id}`,
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
					"/api/_save/ranks/",
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
			this.dialog.view = false;

			this.errorMessage = "";
			this.$nextTick(() => {
				this.editedItem = Object.assign({}, this.defaultItem);
				this.editedIndex = -1;
			});
			this.list_Organizations = []
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
		},

		closeDeleteAll() {
			this.dialog.delete = false;
		},
		onKeyUp() {
			if (
				this.editedItem.rankName != "" ||
				this.editedItem.rankName.length < 255
			) {
				this.errorMessage = "";
			}
			if (this.editedItem.rankName.length > 255) {
				this.errorMessage = this.$t("message.maxlength_required_255");
			}
		},
		onKeyUpSearchForRankCode() {
			if (this.rankCode != "" || this.rankCode.length < 255) {
				this.errorMessageSearchRankCode = "";
			}
			if (this.rankCode.length > 255) {
				this.errorMessageSearchRankCode = this.$t(
					"message.maxlength_required_255",
				);
			}
		},
		onKeyUpSearchForRankName() {
			if (this.rankName != "" || this.rankName.length < 255) {
				this.errorMessageSearchRankName = "";
			}
			if (this.rankName.length > 255) {
				this.errorMessageSearchRankName = this.$t(
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
		async save() {
			if (this.editedItem.rankName?.trim().length == 0) {
				return this.toastError(this.$t("cargo_valid.fullNamenull"));
			}
			if (this.isSaving) {
				return;
			}
			this.isSaving = true;
			this.editedItem.rankName = this.editedItem.rankName
				.trim()
				.replace(/\s+/g, " ");

			let response;
			try {
				if (this.editedIndex > -1) {
					this.editedItem.createdName = this.user_current.fullName;
					this.editedItem.modifiedDate = new Date();
					this.editedItem.modifiedName = this.user_current.fullName;
					this.editedItem.organizationIds =
						this.list_Organizations.map((e) => e.id);

					response = await globalService.putData_Async(
						`/api/ranks/${this.editedItem.id}`,
						this.editedItem,
					);
				} else {
					this.editedItem.organizationIds =
						this.list_Organizations.map((e) => e.id);
					this.editedItem.createdName = this.user_current.fullName;
					this.editedItem.modifiedDate = new Date();
					this.editedItem.createdDate = new Date();
					this.editedItem.modifiedName = this.user_current.fullName;
					response = await globalService.postData_Async(
						"/api/ranks",
						this.editedItem,
					);
				}
				if (response.state) {
					this.toastSuccess(this.$t("message.update_success"));
				} else {
					this.toastError(this.$t("message.update_error"));
				}
			} catch (error) {
				this.toastError(this.$t("message.update_error"));
			} finally {
				this.isSaving = false;
				this.initialize();
				this.close();
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
		onConfirmDelete(value) {
			if (!value) {
				this.onCloseDialog();
			} else {
				if (this.selected) {
					this.deleteAllConfirm();
				}
			}
		},
		async getAllOrganize() {
			try {
				let response = await globalService.getData_Async(
					administratorAPI.API_FindAllOrganization(),
				);
				if (!response || !response.state) {
					return;
				}
				this.listOrganizations = response.data.filter((entry) => {
					return !entry.isDelete && entry.isActive;
				});
			} catch (error) {
				this.toastError(error);
			}
		},
		async getAllOrganizaionByRankInOrg(value) {
			try {
				let response = await globalService.getData_Async(
					administratorAPI.API_GetAllOrganizaionByRankInOrg(value),
				);
				if (!response || !response.state) {
					return;
				}
				// this.list_Organizations = this.listOrganizations.filter(ele => {
				// 	if(response.data.findIndex(ele1 => ele.id == ele1.id) > -1) return true;
				// 	return false;
				// });

				this.list_Organizations = response.data.map(ele => {
					return this.listOrganizations.find(ele1 => ele1.id == ele.id);
				})

			} catch (error) {
				this.toastError(error);
			}
		},
	},
};
</script>
