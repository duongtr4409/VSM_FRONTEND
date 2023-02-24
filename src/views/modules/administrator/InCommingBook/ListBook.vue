<template>
	<v-card elevation="0" class="p-2">
		<BreadcrumbsVue />
		<v-data-table
			v-model="selected"
			:headers="headers"
			:items="listBook"
			:items-per-page="itemperpage"
			:page="numberPage"
			multi-sort
			show-select
			item-key="id"
			class="grey lighten-5"
			loading="true"
			:loading-text="$t('label.loading')"
			:no-data-text="$t('message.no_data')"
			:no-results-text="$t('message.no_results')"
		>
			<template v-slot:[`item.dispatchBookOrgs`]="{ item, index }">
				<template v-if="item.showAll">
					<v-chip
						v-for="organization of item.dispatchBookOrgs"
						:key="organization.id"
						v-bind="item"
					>
						{{ organization.organizationName }}
					</v-chip>
				</template>
				<template v-else>
					<div
						v-for="(organization, key) of item.dispatchBookOrgs"
						v-bind="item"
						:key="organization.id"
					>
						<v-chip v-if="key < 1">
							{{ organization.organizationName }}
						</v-chip>
					</div>
				</template>
				<span
					v-if="item.dispatchBookOrgs.length > 1 && !item.showAll"
					@click="toggle_detail(index)"
				>
					<a href="#"
						><em> {{ $t("button.details") }}</em></a
					>
				</span>
				<span
					v-if="item.dispatchBookOrgs.length > 1 && item.showAll"
					@click="toggle_detail(index)"
				>
					<a href="#"
						><em> {{ $t("button.hide") }}</em></a
					>
				</span>
			</template>
			<template v-slot:[`item.modifiedName`]="{ item }">
				<template>
					<v-avatar color="red mr-2" size="28">
						<span class="white--text">
							{{ getAvatarText(item.modifiedName, 2) }}
						</span>
					</v-avatar>
					{{ item.modifiedName }}
				</template>
			</template>
			<template
				v-for="header in headers.filter((header) =>
					header.hasOwnProperty('formatter'),
				)"
				v-slot:[`item.${header.value}`]="{ headers, value }"
			>
				{{ header.formatter(value) }}
			</template>
			<template v-slot:top>
				<v-toolbar flat>
					<v-dialog v-model="dialog.edit" width="60vw" persistent>
						<template v-slot:activator="{ on, attrs }">
							<v-card-title class="w-full">
								<!-- <v-btn
									text
									class="
										rounded-0
										text-none
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
										text-none
										font-weight-regular
									"
									v-bind="attrs"
									@click="
										editedItem = Object.assign(
											{},
											defaultItem,
										)
									"
									v-on="on"
								>
									<v-icon small class="mr-2">
										mdi-plus
									</v-icon>
									{{ $t("button.create") }}
									<v-icon small class="mr-2"
										>mdi-menu-down</v-icon
									>
								</v-btn>
								<v-btn
									class="
										rounded-0
										text-none
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
						<EditBook
							:editedItem="editedItem"
							
				@close="onClose"

						/>
					</v-dialog>
					<v-dialog v-model="dialog.delete" width="fit-content" persistent>
						<DeleteDialogVue
							@close="onCloseDialog"
							@confirmDelete="onConfirmDelete"
						/>
					</v-dialog>
				</v-toolbar>
			</template>
			<template v-slot:[`body.prepend`]>
				<v-divider></v-divider>
				<tr v-if="filterExist">
					<td></td>
					<td class="pl-0">
						<v-text-field
							v-model="s_incomingBookName"
							type="string"
							:label="$t('label.name')"
							class="mt-2 rounded-pill"
							outlined
							dense
							maxLength="255"
						></v-text-field>
					</td>
					<td class="pl-0">
						<v-autocomplete
							v-model="organizations"
							:items="filterOrganization"
							item-text="organizationName"
							:item-value="(item) => item.organizationName"
							:label="$t('label.organize_use')"
							class="mt-2 rounded-pill"
							dense
							outlined
							:no-data-text="$t('message.no_results')"
							maxLength="255"
						></v-autocomplete>
					</td>
					<td class="pl-0">
						<v-text-field
							v-model="s_description"
							type="string"
							:label="$t('label.description')"
							class="mt-2 rounded-pill"
							outlined
							dense
							maxLength="255"
						></v-text-field>
					</td>
					<td class="pl-0">
						<v-text-field
							v-model="s_modifiedName"
							type="string"
							:label="$t('label.modified_name')"
							class="mt-2 rounded-pill"
							outlined
							dense
							maxLength="255"
						></v-text-field>
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
									class="mt-2 rounded-pill"
									readonly
									v-bind="attrs"
									v-on="on"
									@click:clear="s_modifiedDate = null"
									outlined
									dense
								></v-text-field>
							</template>
							<v-date-picker
								v-model="s_modifiedDate"
								@change="showModifyDatePicker = false"
								no-title
								scrollable
							></v-date-picker>
						</v-menu>
					</td>
					<td></td>
				</tr>
			</template>

			<template v-slot:[`item.actions`]="{ item }">
				<div class="d-flex" style="min-width: fit-content">
					<!-- <v-icon
						small
						class="mr-2"
						@click="viewItem(item)"
						color="blue darken-1"
						dark
					>
						mdi-eye
					</v-icon> -->
					<v-icon
						class="mr-2"
						@click="editItem(item)"
						color="blue darken-1"
						dark
					>
						mdi-pencil-circle
					</v-icon>
					<v-icon icon color="red" @click="deleteItem(item)">
						mdi-close-circle
					</v-icon>
				</div>
			</template>
		</v-data-table>
	</v-card>
</template>

<script>
import DeleteDialogVue from "@/components/DeleteDialog.vue";
import BreadcrumbsVue from "@/components/Breadcrumbs.vue";
import moment from "moment";
import globalService from "@/services/global.service";
import administratorAPI from "../administrator.api";
import EditBook from "./EditBook.vue";
export default {
	components: {
		DeleteDialogVue,
		BreadcrumbsVue,
		EditBook,
	},
	data() {
		return {
			showModifyDatePicker: false,
			s_modifiedDate: null,
			s_incomingBookCode: "",
			s_incomingBookName: "",
			s_modifiedName: "",
			s_description: "",
			s_tong: 0,
			isActive: this.$t("label.show_all"),
			filterItems: [
				this.$t("label.show_all"),
				this.$t("label.used"),
				this.$t("label.unused"),
			],
			organizations: this.$t("label.show_all"),
			filterOrganization: [],
			listBook: [],
			selected: [],
			editedIndex: -1,
			dateFormat: "DD/MM/yyyy",
			defaultItem: {
				createdDate: null,
				createdName: "",
				createdOrgName: "",
				createdRankName: "",
				creater: null,
				description: "",
				dispatchBookCode: "",
				dispatchBookName: "",
				dispatchBookOrgs: [],
				dispatchBookTypeCode: "",
				dispatchBookTypeName: "",
				id: null,
				isActive: true,
				isDelete: false,
				modifiedDDate: null,
				modifiedName: "",
				modifier: null,
				organization: null,
				organizationCode: "",
				organizationName: "",
				totalDoc: 0,
			},
			editedItem: {
				createdDate: null,
				createdName: "",
				createdOrgName: "",
				createdRankName: "",
				creater: null,
				description: "",
				dispatchBookCode: "",
				dispatchBookName: "",
				dispatchBookOrgs: [],
				dispatchBookTypeCode: "",
				dispatchBookTypeName: "",
				id: null,
				isActive: true,
				isDelete: false,
				modifiedDDate: null,
				modifiedName: "",
				modifier: null,
				organization: null,
				organizationCode: "",
				organizationName: "",
				totalDoc: 0,
			},
			listIndexAfterFillter: [],
			itemperpage: 10,
			numberPage: 1,
			headers: [
				{
					width: "10vw",
					text: this.$t("label.name"),
					value: "dispatchBookName",
					filter: (value) => {
						if (!this.s_incomingBookName.trim()) return true;
						if (!value) return;
						return this.nonAccentVietnamese(value)
							.toLocaleUpperCase()
							.includes(
								this.nonAccentVietnamese(
									this.s_incomingBookName,
								)
									.toLocaleUpperCase()
									.trim(),
							);
					},
				},

				{
					text: this.$t("label.organize_use"),
					value: "dispatchBookOrgs",
					width: "10vw",

					filter: (value) => {
						if (this.organizations == this.$t("label.show_all"))
							return true;
						return value.filter((entry) => {
							return entry.organizationName.includes(
								this.organizations,
							);
						}).length;
					},
				},
				{
					width: "30vw",
					text: this.$t("label.description"),
					value: "description",
					filter: (value) => {
						if (!this.s_description.trim()) return true;
						if (!value) return;
						return this.nonAccentVietnamese(value)
							.toLocaleUpperCase()
							.includes(
								this.nonAccentVietnamese(this.s_description)
									.toLocaleUpperCase()
									.trim(),
							);
					},
				},

				{
					text: this.$t("label.modified_name"),
					value: "modifiedName",
					filter: (value) => {
						if (!this.s_modifiedName || !this.s_modifiedName.trim())
							return true;
						if (!value) return;
						return this.nonAccentVietnamese(value)
							.toLocaleUpperCase()
							.includes(
								this.nonAccentVietnamese(this.s_modifiedName)
									.toLocaleUpperCase()
									.trim(),
							);
					},
				},
				{
					text: this.$t("label.modified_date"),
					value: "modifiedDDate",
					formatter: (x) =>
						x ? moment(x).format(this.dateFormat) : null,
					filter: (value) => {
						if (!this.s_modifiedDate) return true;
						return value.includes(this.s_modifiedDate);
					},
				},
				{
					// width: "6rem",
					text: this.$t("label.manipulation"),
					value: "actions",
					sortable: false,
				},
			],
			dialog: {
				edit: false,
				delete: false,
			},
		};
	},
	created() {
		this.$Progress.start();
		this.load();
	},
	mounted() {
		this.$Progress.finish();
	},
	watch: {
		"dialog.edit"(val) {
			if (!val) {
				this.load();
				this.editedItem = Object.assign({}, this.defaultItem);
				

			}
		},
	},
	computed: {
		formatModifyDateFns() {
			return this.s_modifiedDate
				? moment(this.s_modifiedDate).format(this.dateFormat)
				: "";
		},
	},
	methods: {
		async load() {
			try {
				let response = await globalService.getData_Async(
					administratorAPI.API_GetBook(),
				);
				if (!response || !response.state) return;
				this.listBook = response.data.filter((entry) => {
					entry.showAll = false;
					return !entry.isDelete;
				});
				this.listBook = this.sortList(this.listBook);
				this.getAllOrganzation();
			} catch (error) {
				console.log(error);
			}
		},
		async getAllOrganzation() {
			try {
				let response = await globalService.getData_Async(
					administratorAPI.API_FindAllOrganization(),
				);
				if (!response || !response.state) return;
				this.filterOrganization = response.data.filter((entry) => {
					return !entry.isDelete;
				});
				this.filterOrganization.unshift(this.$t("label.show_all"));
			} catch (error) {
				this.toastError(error);
			}
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
		deleteAll() {
			if (this.selected.length > 0) {
				this.dialog.delete = true;
			} else {
				this.toastError(this.$t("label.no_selected"));
			}
		},
		async deleteAllConfirm() {
			if (this.isDeleting) {
				return;
			}
			this.isDeleting = true;
			this.selected = this.selected.map((x) => {
				x.isDelete = true;
				return x;
			});
			try {
				let response = await globalService.postData_Async(
					administratorAPI.API_DeleteAllDispatchBook(),
					this.selected,
				);
				if (!response || !response.state) {
					this.isDeleting = false;
					this.toastError(this.$t("message.delete_error"));
				} else {
					this.toastSuccess(this.$t("message.delete_success"));
				}
			} catch (error) {
				this.toastError(this.$t("error.load"));
			} finally {
				this.selected = [];
				this.isDeleting = false;
				this.load();
				this.close();
			}
		},
		onClose() { 
				this.dialog.edit = false;

		},
		
		close() {
			this.$nextTick(() => {
				this.editedItem = Object.assign({}, this.defaultItem);
				this.editedIndex = -1;
			});
			this.editedItem = {};
			this.dialog.edit = false;
			this.dialog.delete = false;
		},
		editItem(item) {
			this.editedIndex = this.listBook.indexOf(item);
			this.editedItem = Object.assign({}, item);
			this.dialog.edit = true;
		},
		deleteItem(item) {
			this.selected = [item];
			this.editedItem = Object.assign({}, item);
			this.dialog.delete = true;
		},
		sortList(arr) {
			return arr.sort((a, b) => {
				return (
					moment(b.createdDate).toDate().getTime() -
					moment(a.createdDate).toDate().getTime()
				);
			});
		},
		toggle_detail(index) {
			if (this.listIndexAfterFillter.length != 0)
				index = this.listIndexAfterFillter[index];
			else index = (this.numberPage - 1) * this.itemperpage + index;
			this.listBook[index].showAll = !this.listBook[index].showAll;
		},
	},
};
</script>

<style></style>
