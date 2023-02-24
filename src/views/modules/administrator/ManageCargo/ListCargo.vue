<template>
	<v-card flat elevation="0">
		<BreadcrumbsVue />
		<v-dialog v-model="dialog.delete" persistent width="fit-content">
			<DeleteDialogVue
				@close="onCloseDialog"
				@confirmDelete="onConfirmDelete"
			/>
		</v-dialog>
		<v-dialog width="70vw" v-model="dialog.edit" persistent>
			<CreateCargo
				@close="onClosePopup"
				@isLoadList="is_LoadList"
			></CreateCargo>
		</v-dialog>
		<v-dialog width="70vw" v-model="dialog.view" persistent>
			<EditCargoVue
				@close="onCloseEdit"
				:idMailSelect="selected_Item"
				:isLoad="dialog.view"
				@isLoadList="is_LoadList"
			></EditCargoVue>
		</v-dialog>

		<v-data-table
			:items="listCargo"
			:headers="headers"
			show-select
			v-model="selected"
			multi-sort
			@pagination="changePage($event)"
			:server-items-length="countAllItem"
			:page="eventPage.page"
			:no-results-text="$t('message.no_results')"
		>
			<template v-slot:[`item.fullName`]="{ item }">
				<v-tooltip bottom>
					<template v-slot:activator="{ on, attrs }">
						<span
							class="text-black text-xs"
							v-bind="attrs"
							v-on="on"
						>
							{{ item.fullName.slice(0, 30) }}
						</span>
						<span
							v-if="item.fullName.length > 30"
							class="text-black"
							>...</span
						>
					</template>
					<span>{{ item.fullName }}</span>
				</v-tooltip>
			</template>
			<template v-slot:[`item.modifiedName`]="{ item }">
				<template>
					<v-avatar color="red darken-2 mr-2" size="28">
						<span class="white--text">
							{{ getAvatarText(item.modifiedName, 2) }}
						</span>
					</v-avatar>
					{{ item.modifiedName }}
				</template>
			</template>

			<template v-slot:top="{ on, attrs }">
				<v-card-title class="p-0 w-full">
					<v-btn
						elevation="0"
						class="rounded-pill text-capitalize font-weight-regular"
						v-bind="attrs"
						v-on="on"
						@click="editCargo"
						text
						append
					>
						<v-icon small class="mr-2"> mdi-plus</v-icon>
						{{ $t("button.create") }}
					</v-btn>
					<v-btn
						elevation="0"
						class="rounded-pill text-capitalize font-weight-regular"
						@click="deleteAll"
						text
					>
						<v-icon small class="mr-2">
							mdi-trash-can-outline
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
					<v-btn color="blue darken-1" icon @click="editItem(item)">
						<v-icon small> mdi-pencil </v-icon>
					</v-btn>
					<v-btn color="red darken-1" icon @click="deleteItem(item)">
						<v-icon small> mdi-trash-can-outline </v-icon>
					</v-btn>
				</div>
			</template>
			<template v-if="filterExist" v-slot:[`body.prepend`]>
				<v-divider></v-divider>
				<tr>
					<td></td>
					<td class="pl-0">
						<v-text-field
							v-model="s_shortName"
							:label="$t('label.cargo_name')"
							outlined
							dense
							class="mt-2 rounded-pill"
							maxLength="255"
							@keyup="filterByUserName($event)"

						></v-text-field>
					</td>
					<td class="pl-0">
						<v-text-field
							v-model="s_description"
							:label="$t('label.description')"
							outlined
							dense
							class="mt-2 rounded-pill"
							maxLength="255"
							@keyup="filterByDescription($event)"

						></v-text-field>
					</td>
					<td class="pl-0">
						<v-text-field
							v-model="s_modified_name"
							:label="$t('label.modified_name')"
							outlined
							dense
							class="mt-2 rounded-pill"
							maxLength="255"
							@keyup="filterByCreatedName($event)"

						></v-text-field>
					</td>

					<td class="pl-0">
						<v-menu
							v-model="showModifyDatePicker"
							:close-on-content-click="false"
							class="mt-10"
						>
							<template v-slot:activator="{ on, attrs }">
								<v-text-field
									:value="formatModifiedDate"
									clearable
									:label="$t('label.modified_date')"
									readonly
									v-bind="attrs"
									v-on="on"
									@click:clear="clearFilterByModifiedDate()"
									outlined
									dense
									class="mt-2 rounded-pill"
								></v-text-field>
							</template>
							<v-date-picker
								v-model="s_modified_date"
								@change="filterByModifiedDate()"
								no-title
								scrollable
								range
							></v-date-picker>
						</v-menu>
					</td>
					<td></td>
				</tr>
			</template>
		</v-data-table>
	</v-card>
</template>

<script>
import DeleteDialogVue from "@/components/DeleteDialog.vue";
import globalService from "@/services/global.service";
import administratorAPI from "../administrator.api";
import BreadcrumbsVue from "@/components/Breadcrumbs.vue";
import moment from "moment";
import constant from "@/common/constant";
import CreateCargo from "./CreateCargo.vue";
import EditCargoVue from "./EditCargo.vue";

export default {
	name: "ManageCargoVue",
	components: { BreadcrumbsVue, DeleteDialogVue, CreateCargo, EditCargoVue },
	data() {
		return {
			countAllItem: 0,
			eventPage: { page: 1 },
			editedIndex: -1,
			selected_Item: null,
			isDelete: false,
			isDeleting: false,
			selected: [],
			dialog: {
				view: false,
				edit: false,
				delete: false,
			},
			user_current: this.getUserInfo(),
			filterExist: false,
			showModifyDatePicker: false,
			dateFormat: "DD/MM/yyyy",
			s_shortName: "",
			s_description: "",
			s_modified_name: "",
			s_modified_date: null,
			headers: [
				{
					text: this.$t("label.cargo_name"),
					value: "fullName",
					filter: (value) => {
						if (!this.s_shortName || !value) return true;

						return this.nonAccentVietnamese(value)
							.toLocaleUpperCase()
							.includes(
								this.nonAccentVietnamese(this.s_shortName)
									.trim()
									.toLocaleUpperCase(),
							);
					},
				},
				{
					text: this.$t("label.description"),
					value: "description",
					filter: (value) => {
						if (!this.s_description || !value) return true;

						return this.nonAccentVietnamese(value)
							.toLocaleUpperCase()
							.includes(
								this.nonAccentVietnamese(this.s_description)
									.trim()
									.toLocaleUpperCase(),
							);
					},
				},
				{
					text: this.$t("label.modified_name"),
					value: "modifiedName",
					filter: (value) => {
						if (!this.s_modified_name || !value) return true;

						return this.nonAccentVietnamese(value)
							.toLocaleUpperCase()
							.includes(
								this.nonAccentVietnamese(this.s_modified_name)
									.trim()
									.toLocaleUpperCase(),
							);
					},
				},

				{
					text: this.$t("label.modified_date"),
					value: "modifiedDate",
					formatter: (x) =>
						x ? moment(x).format(this.dateFormat) : null,
					// filter: (value) => {
					// 	if (!this.s_modified_date) return true;
					// 	let values = `${this.s_modified_date}`.split(
					// 		constant.values.DATE_RANGE_SEPARATOR,
					// 	);
					// 	values = values
					// 		.map((x) => {
					// 			return moment(x).toDate().getTime();
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
					text: this.$t("label.manipulation"),
					value: "actions",
					sortable: false,
				},
			],
			listCargo: [],
		};
	},
	computed: {
		formatModifiedDate() {
			if (!this.s_modified_date) {
				return null;
			}
			let values = `${this.s_modified_date}`.split(
				constant.values.DATE_RANGE_SEPARATOR,
			);
			let result = [];
			result = values.map((x) => {
				return moment(x).format("DD/MM/yyyy");
			});
			return result.join("~");
		},
	},
	created() {
		// this.load();
	},
	methods: {
		load() {
			this.getAllCargo();
		},
		async getAllCargo(page, size, modifiedDate) {
			let param = modifiedDate ? new Date(modifiedDate[1]).toISOString().split("T")[0] + "T23:59:59.999Z" : null;
			let reqBody = {
				isDelete: "false",
				isActive: "true",
				fullName: this.s_shortName,
				modifiedName: this.s_modified_name,
				description: this.s_description||null,
				modifiedDate: modifiedDate ? new Date(modifiedDate[0]).toISOString() : ""
				// roles: _role,
			};
			try {
				let response = await globalService.postData_Async(
					administratorAPI.SearchAllCargoByCreatedDate(page, size, param),
					reqBody,
				);
				this.countAllItem = response.data.total;

				// if (!response || !response.state) {
				// 	this.toastError(this.$t("error.load"));
				// 	return;
				// }
				this.listCargo = response.data.listData.filter((entry) => {
					entry.showAll = false;
					return entry;
				});

				this.listCargo = this.sortList(this.listCargo);
			} catch (error) {
				console.log(error);
			}
		},
		// sortList(arr) {
		// 	if (arr.length == 0) return;
		// 	return arr.sort((a, b) => {
		// 		return a.modifiedDate - b.modifiedDate;
		// 	});
		// },
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
				this.toastError(this.$t("message.alert_no_selected"));
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
		async deleteAllConfirm() {
			if (this.isDeleting) {
				return;
			}
			this.isDeleting = true;
			// this.selected = this.selected.map((entry) => {
			// 	entry.isDelete = true;
			// 	return entry;
			// });
			this.selected.isDelete = true;
			for (let itemSelected of this.selected) {
				itemSelected.isDelete = true;
				try {
					let response = await globalService.putData_Async(
						administratorAPI.API_Delete_UpDateCentralized(
							itemSelected.id,
						),
						itemSelected,
					);
					if (!response.state) {
						this.toastError(response.message);
					}
					if (response.state) {
						this.isDeleting = true;
					}
				} catch (error) {
					console.log(error);
				}
			}

			this.toastSuccess(this.$t("message.delete_success"));
			this.selected = [];
			this.isDeleting = false;
			this.load();
			this.closeDeleteAll();
		},
		closeDeleteAll() {
			this.dialog.delete = false;
		},
		deleteItem(item) {
			this.selected = [item];
			// this.editedIndex = this.templateMails.indexOf(item);
			// this.editedItem = Object.assign({}, item);
			this.dialog.delete = true;
		},
		editCargo() {
			this.dialog.edit = true;
		},
		onClosePopup() {
			this.dialog.edit = false;
		},
		onCloseEdit(value) {
			this.dialog.view = value;
		},
		editItem(item) {
			this.selected_Item = item.id;
			this.dialog.view = true;
		},
		is_LoadList() {
			this.load();
		},
		changePage(event) {
			this.eventPage = event;
			if (event.itemsPerPage == -1) {
				event.itemsPerPage = 100;
			}
			this.getAllCargo(event.page - 1, event.itemsPerPage, this.s_modified_date);
			return;
		},
		filterByUserName(event) {
			if (
				event.code == constant.keys.enter ||
				event.keyCode == constant.keys.enter_keyCode ||
				!event.target.value
			) {
				this.eventPage.page = 1;
				this.getAllCargo(
					this.eventPage.page - 1,
					this.eventPage.itemsPerPage,
					this.s_modified_date
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
				this.getAllCargo(
					this.eventPage.page - 1,
					this.eventPage.itemsPerPage,
					this.s_modified_date
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
				this.getAllCargo(
					this.eventPage.page - 1,
					this.eventPage.itemsPerPage,
					this.s_modified_date
				);
			}
		},
		filterByModifiedDate(){
			this.showModifyDatePicker = false;
			this.getAllCargo(this.eventPage.page - 1, this.eventPage.itemsPerPage, this.s_modified_date);
		},
		clearFilterByModifiedDate(){
			this.s_modified_date = null;
			this.eventPage.page = 1;
				this.getAllCargo(
					this.eventPage.page - 1,
					this.eventPage.itemsPerPage,
					this.s_modified_date
				);
		}
	},
};
</script>

<style></style>
