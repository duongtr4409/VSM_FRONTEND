<template>
	<v-card elevation="0" class="p-2 rounded">
		<BreadcrumbsVue />
		<v-dialog v-model="dialog.delete" width="fit-content">
			<DeleteDialogVue
				@close="onCloseDialog"
				@confirmDelete="onConfirmDelete"
			/>
		</v-dialog>
		<v-data-table
			v-model="selected"
			:headers="headers"
			:items="desserts"
			:search="search"
			:custom-filter="customFilter"
			item-key="id"
			multi-sort
			show-select
			:page="eventPage.page"
			:server-items-length="countAllItem"
			:no-results-text="$t('message.no_results')"
			@pagination="changePage($event)"
		>
			<template v-slot:top>
				<v-card-title class="p-0 w-full">
					<v-btn
						elevation="0"
						class="
							text-capitalize
							font-weight-regular
							mb-4
							mr-2
							white
						"
						to="quy-trinh/tao-moi-v2"
					>
						<v-icon small class="mr-2"> mdi-plus </v-icon>
						{{ $t("button.create") }}
						<v-icon small class="mr-2"> mdi-menu-down </v-icon>
					</v-btn>
					<v-btn
						elevation="0"
						class="
							text-capitalize
							font-weight-regular
							mb-4
							mr-2
							white
						"
						@click="deleteAll"
					>
						<v-icon small class="mr-2"> mdi-delete-outline </v-icon>
						{{ $t("button.delete_all") }}
					</v-btn>
					<v-spacer></v-spacer>
					<!-- <v-text-field
						v-model="search"
						:label="$t('title.search')"
						outlined
						dense
						class="mt-2 mx-4"
						:rules="[
							() =>
								search.trim().length <= 255 ||
								$t('error.max_length_255'),
						]"
					></v-text-field> -->
					<v-btn icon @click="filterExist = !filterExist">
						<v-icon>mdi-filter </v-icon>
					</v-btn>
				</v-card-title>
			</template>
			<template v-slot:no-results
				><h1>{{ $t("message.no_results") }}</h1>
			</template>
			<template v-slot:no-data
				><h1>{{ $t("message.no_data") }}</h1></template
			>
			<template v-slot:[`item.isActive`]="{ item }">
				<v-simple-checkbox
					v-model="item.isActive"
					disabled
				></v-simple-checkbox>
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
			<template
				v-for="header in headers.filter((header) =>
					header.hasOwnProperty('formatter'),
				)"
				v-slot:[`item.${header.value}`]="{ headers, value }"
			>
				{{ header.formatter(value) }}
			</template>
			<template v-slot:[`item.organizations`]="{ item, index }">
				<template v-if="item.showAll">
					<v-chip
						v-for="organization of item.organizations"
						:key="organization.id"
						v-bind="item"
					>
						{{ organization.organizationName }}
					</v-chip>
				</template>
				<template v-else>
					<div
						v-for="(organization, key) of item.organizations"
						v-bind="item"
						:key="organization.id"
					>
						<v-chip v-if="key < 1">
							{{ organization.organizationName.slice(0, 40) }}
						</v-chip>
					</div>
				</template>
				<span
					v-if="item.organizations.length > 1 && !item.showAll"
					@click="toggle_detail(index)"
				>
					<a href="#">
						<em>
							{{ $t("button.show") }}
						</em>
					</a>
				</span>
				<span
					v-if="item.organizations.length > 1 && item.showAll"
					@click="toggle_detail(index)"
				>
					<a href="#">
						<em>
							{{ $t("button.hide") }}
						</em>
					</a>
				</span>
			</template>
			<template v-slot:[`item.requestDTOS`]="{ item, index }">
				<template v-if="item.showReq">
					<v-chip
						v-for="request of item.requestDTOS"
						:key="request.id"
						v-bind="item"
					>
						{{ request.requestName.slice(0, 40) }}
					</v-chip>
				</template>
				<template v-else>
					<div
						v-for="(request, key) of item.requestDTOS"
						v-bind="item"
						:key="request.id"
					>
						<v-chip v-if="key < 1">
							{{ request.requestName }}
						</v-chip>
					</div>
				</template>
				<span
					v-if="item.requestDTOS.length > 1 && !item.showReq"
					@click="toggle_request(index)"
				>
					<a href="#"
						><em>{{ $t("button.show") }}</em></a
					>
				</span>
				<span
					v-if="item.requestDTOS.length > 1 && item.showReq"
					@click="toggle_request(index)"
				>
					<a href="#"
						><em>{{ $t("button.hide") }}</em></a
					>
				</span>
			</template>
			<template v-slot:[`item.processName`]="{ item }">
				<template
					v-if="
						item.processName.trim().length >
							constant.length_process_name && !item.showName
					"
				>
					<span>
						{{
							item.processName.slice(
								0,
								constant.length_process_name,
							)
						}}
					</span>
					<span @click="toggle_show_name(item)">
						<a href="#"
							><em>{{ $t("button.show") }}</em></a
						>
					</span>
				</template>
				<template
					v-if="
						item.processName.trim().length >
							constant.length_process_name && item.showName
					"
				>
					<span>{{ item.processName }}</span>
					<span @click="toggle_show_name(item)">
						<a href="#"
							><em>{{ $t("button.hide") }}</em></a
						>
					</span>
				</template>
				<template
					v-if="
						item.processName.trim().length <=
						constant.length_process_name
					"
				>
					<span>
						{{ item.processName }}
					</span>
				</template>
			</template>
			<template v-slot:[`body.prepend`]>
				<v-divider></v-divider>
				<tr v-if="filterExist">
					<td></td>

					<td class="pl-0">
						<v-text-field
							v-model="s_processName"
							type="string"
							:label="$t('label.process_name')"
							:rules="[
								() =>
									s_processName.trim().length <= 255 ||
									$t('error.max_length_255'),
							]"
							maxLength="255"
							class="mt-2"
							dense
							outlined
							@keyup="fiterByProcessName($event)"
						></v-text-field>
					</td>
					<td class="pl-0">
						<v-autocomplete
						v-model="s_request"
							maxLength="255"
							item-text="requestName"
							:items="filterRequest"
							:label="$t('label.type_request_apply')"
							:item-value="(item) => item"
							class="mt-2"
							dense
							outlined
							:no-data-text="$t('message.no_results')"
							clearable

						></v-autocomplete>
					</td>
					<td class="pl-0">
						<!-- <v-autocomplete
							maxLength="255"
							v-model="s_organizations"
							:items="filterOrganization"
							item-text="organizationName"
							:item-value="(item) => item.organizationName"
							:label="$t('label.organization_applicable')"
							class="mt-2"
							dense
							outlined
							:no-data-text="$t('message.no_results')"
						></v-autocomplete> -->
						<v-autocomplete
							v-model="s_organizations"
							item-text="organizationName"
							:items="filterOrganization"
							:label="$t('label.organization_applicable')"
							:item-value="(item) => item"
							class="mt-2"
							dense
							clearable
							outlined
							maxLength="255"
						>
						</v-autocomplete>
					</td>

					<td class="pl-0">
						<v-text-field
							v-model="s_modifiedName"
							type="string"
							:label="$t('label.modified_name')"
							:rules="[
								() =>
									s_modifiedName.trim().length <= 255 ||
									$t('error.max_length_255'),
							]"
							maxLength="255"
							class="mt-2"
							dense
							outlined
							@keyup="fiterByCreatedName($event)"
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
									:value="formatModifyDateFns"
									clearable
									:label="$t('label.modified_date')"
									readonly
									v-bind="attrs"
									v-on="on"
									@click:clear="clearFilterByModifiedDate()"
									class="mt-2"
									dense
									outlined
								></v-text-field>
							</template>
							<v-date-picker
								v-model="modifiedDate"
								@change="filterByModifiedDate()"
								no-title
								scrollable
								range
							></v-date-picker>
						</v-menu>
					</td>
					<!-- <td class="">
						<v-select
							v-model="isActive"
							:items="filterItems"
							:label="$t('label.is_active')"
							class="mt-2 rounded-pill"
							dense
							outlined
						></v-select>
					</td> -->

					<td></td>
				</tr>
			</template>
			<template v-slot:[`item.actions`]="{ item }">
				<div class="d-flex" style="min-width: fit-content">
					<!-- <v-btn
						icon
						dark
						x-small
						color="blue darken-1"
						:to="{
							path: `/administrator/quy-trinh/view/${item.id}`,
						}"
					>
						<v-icon small> mdi-eye </v-icon>
					</v-btn> -->

					<v-btn
						color="blue darken-1"
						dark
						icon
						:to="{ path: `/administrator/quy-trinh/${item.id}` }"
					>
						<v-icon> mdi-pencil-circle </v-icon>
					</v-btn>
					<v-btn
						icon
						color="red darken-1"
						dark
						@click="deleteItem(item)"
					>
						<v-icon> mdi-close-circle </v-icon>
					</v-btn>
				</div>
			</template>
		</v-data-table>
	</v-card>
</template>
<script>
import globalService from "@/services/global.service";
// import VuePerfectScrollbar from "vue-perfect-scrollbar";
import moment from "moment";
import "@koumoul/vjsf/lib/VJsf.css";
import "@koumoul/vjsf/lib/deps/third-party.js";
import constant from "@/common/constant.js";
import administratorAPI from "../administrator.api";
import DeleteDialogVue from "@/components/DeleteDialog.vue";
import BreadcrumbsVue from "@/components/Breadcrumbs.vue";
export default {
	name: "ListProcess",
	components: {
		// VuePerfectScrollbar,
		DeleteDialogVue,
		BreadcrumbsVue,
	},
	data() {
		return {
			showCreateDatePicker: false,
			showModifyDatePicker: false,
			itemperpage: 10,
			numberPage: 1,
			dateFormat: "DD/MM/yyyy",
			createdDate: null,
			modifiedDate: null,
			s_createdName: "",
			s_modifiedName: "",
			s_organizations: null,
			s_request: null,
			isActive: this.$t("label.show_all"),
			filterItems: [
				this.$t("label.show_all"),
				this.$t("label.used"),
				this.$t("label.unused"),
			],
			filterOrganization: [],
			filterRequest: [],
			s_description: "",
			s_processName: "",
			s_processCode: "",
			stepSelected: [],
			user_in_step: [],
			modelslt: {},
			updateItem: {},
			search: "",
			stepInProcess: {},
			singleSelect: false,
			dialog: {
				delete: false,
			},
			selected: [],
			items: [],
			itemDelete: {},
			headers: [
				{
					text: this.$t("label.process_name"),
					value: "processName",
					width: "20vw",
					filter: (value) => {
						if (!this.s_processName || !value) return true;

						return this.nonAccentVietnamese(value)
							.toLocaleUpperCase()
							.includes(
								this.nonAccentVietnamese(this.s_processName)
									.trim()
									.toLocaleUpperCase(),
							);
					},
				},

				{
					text: this.$t("label.type_request_apply"),
					value: "requestDTOS",
					width: "20vw",
					// filter: (value) => {
					// 	if (this.s_request == this.$t("label.show_all"))
					// 		return true;
					// 	return value.filter((entry) => {
					// 		return entry.requestName.includes(this.s_request);
					// 	}).length;
					// },
				},
				{
					text: this.$t("label.organization_applicable"),
					value: "organizations",
					width: "20vw",
					// filter: (value) => {
					// 	if (this.organizations == this.$t("label.show_all"))
					// 		return true;
					// 	return value.filter((entry) => {
					// 		return entry.organizationName.includes(
					// 			this.organizations,
					// 		);
					// 	}).length;
					// },
				},
				{
					text: this.$t("label.modified_name"),
					value: "modifiedName",
					filter: (value) => {
						if (!this.s_modifiedName || !value) return true;

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
					value: "modifiedDate",
					formatter: (x) =>
						x ? moment(x).format(this.dateFormat) : null,
					// filter: (value) => {
					// 	if (!this.modifiedDate || !value) return true;
					// 	return value.includes(this.modifiedDate);
					// },
					// sort: (a, b) => {
					// 	return (
					// 		moment(b).toDate().getTime() -
					// 		moment(a).toDate().getTime()
					// 	);
					// },
				},

				{
					text: this.$t("label.manipulation"),
					value: "actions",
					sortable: false,
				},
			],
			desserts: [],
			editedIndex: -1,
			indexItems: 0,
			editedItem: {
				createdDate: new Date(),
				createdId: null,
				createdName: "",
				description: "",
				id: null,
				isActive: false,
				isDelete: false,
				modifiedDate: null,
				modifiedId: null,
				modifiedName: "",
				numberRequest: 0,
				processCode: "",
				processName: "",
			},
			defaultItem: {
				createdDate: new Date(),
				createdId: null,
				createdName: "",
				description: "",
				id: null,
				isActive: false,
				isDelete: false,
				modifiedDate: null,
				modifiedId: null,
				modifiedName: "",
				numberRequest: 0,
				processCode: "",
				processName: "",
			},
			arrShow: [],
			constant: constant,
			countAllItem: 0,
			eventPage: { page: 1 },
			listIndexAfterFillter: [],
		};
	},

	computed: {
		isEdit() {
			return this.editedIndex === -1 ? false : true;
		},
		formatDateFns() {
			return this.createdDate
				? moment(this.createdDate).format(this.dateFormat)
				: "";
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
		dialog(val) {
			val || this.close();
		},
		dialogDelete(val) {
			val || this.closeDelete();
		},
		filterExist(val) {
			if (
				val &&
				this.filterRequest.length == 0 &&
				this.filterOrganization.length == 0
			) {
				this.getAllOrganzation();
				this.getAllRequest();
			}
		},
		s_organizations(val) {
			console.log(val);
			if (!val) {
				console.log(1);
			}
			this.getAllProcessInfo(
				this.eventPage.page - 1,
				this.eventPage.itemsPerPage,
				this.modifiedDate
			);
		},
		s_request(val) {
			console.log(val);
			if (!val) {
				console.log(1);
			}
			this.getAllProcessInfo(
				this.eventPage.page - 1,
				this.eventPage.itemsPerPage,
				this.modifiedDate
			);
		},
	},

	created() {
		this.$Progress.start();
		// this.initialize();
	},
	mounted() {
		this.$Progress.finish();
	},
	methods: {
		async getAllOrganzation() {
			try {
				let response = await globalService.getData_Async(
					administratorAPI.API_FindAllOrganization(),
				);
				if (!response || !response.state) return;
				this.filterOrganization = response.data.filter((entry) => {
					return !entry.isDelete;
				});
				// this.filterOrganization.unshift(this.$t("label.show_all"));
			} catch (error) {
				this.toastError(error);
			}
		},
		async getAllRequest() {
			try {
				let response = await globalService.getData_Async(
					administratorAPI.API_GetAllRequestIgnoreField(true),
				);
				if (!response || !response.state) return;
				this.filterRequest = response.data.filter((entry) => {
					return !entry.isDelete;
				});
				// this.filterRequest.unshift(this.$t("label.show_all"));
			} catch (error) {
				this.toastError(error);
			}
		},
		async initialize() {
			try {
				let response = await globalService.getData_Async(
					administratorAPI.API_GetAllProcessInfo(),
				);
				if (!response || !response.state) {
					return;
				}
				this.desserts = response.data.filter((entry) => {
					entry.showAll = false;
					entry.showName = false;
					entry.showReq = false;
					return !entry.isDelete;
				});
			} catch (error) {
				console.log(error);
			}
			this.desserts = this.sortList(this.desserts);
		},

		deleteItem(item) {
			this.selected = [item];
			this.updateItem = item;
			this.dialog.delete = true;
		},

		// async deleteItemConfirm() {
		// 	this.updateItem.isDelete = true;
		// 	let response = await globalService.putData_Async(
		// 		administratorAPI.API_UpdateProcessInfo(this.updateItem.id),
		// 		this.updateItem,
		// 	);
		// 	if (!response.state) {
		// 		this.toastError(this.$t("message.delete_error"));
		// 		this.closeDelete();
		// 		return;
		// 	} else {
		// 		this.toastSuccess(this.$t("message.delete_success"));
		// 	}
		// 	this.initialize();
		// 	this.closeDelete();
		// },
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
			try {
				this.selected = this.selected.map((x) => {
					x.isDelete = true;
					return x;
				});
				let response = await globalService.postData_Async(
					administratorAPI.API_DeleteAllProcessInfo(),
					this.selected,
				);
				if (!response) {
					this.toastError(this.$t("message.delete_error"));
					return;
				}
				if (!response.state) {
					this.toastError(response.message);
					this.isDeleting = false;
					return;
				} else {
					this.toastSuccess(this.$t("message.delete_success"));
				}
			} catch (error) {
				this.toastError(error);
			} finally {
				this.selected = [];
				this.isDeleting = false;
				//this.initialize();
				this.getAllProcessInfo(
					this.eventPage.page - 1,
					this.eventPage.itemsPerPage,
					this.modifiedDate
				);
				this.closeDeleteAll();
			}
		},

		// close() {
		// 	this.dialog = false;
		// 	this.$nextTick(() => {
		// 		this.editedItem = Object.assign({}, this.defaultItem);
		// 		this.editedIndex = -1;
		// 	});
		// },

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
		sortList(arr) {
			return arr.sort((a, b) => {
				return (
					moment(b.createdDate).toDate().getTime() -
					moment(a.createdDate).toDate().getTime()
				);
			});
		},
		customFilter(value, search, item) {
			return !!search && this.match(item, search);
		},
		toggle_detail(index) {
			if (this.listIndexAfterFillter.length != 0)
				index = this.listIndexAfterFillter[index];
			else index = (this.numberPage - 1) * this.itemperpage + index;
			this.desserts[index].showAll = !this.desserts[index].showAll;
		},

		toggle_request(index) {
			if (this.listIndexAfterFillter.length != 0)
				index = this.listIndexAfterFillter[index];
			else index = (this.numberPage - 1) * this.itemperpage + index;
			this.desserts[index].showReq = !this.desserts[index].showReq;
		},
		toggle_show_name(item) {
			item.showName = !item.showName;
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
		async getAllProcessInfo(page, size, modifiedDate) {
			//
			let _organizations = null;
			if (this.s_organizations) {
				_organizations = [{ id: this.s_organizations.id }];
			}
			let _s_request = null;
			let param = modifiedDate ? new Date(modifiedDate[1]).toISOString().split("T")[0] + "T23:59:59.999Z" : null;
			if (this.s_request) {
				_s_request = [{ id: this.s_request.id }];
			}
			let response;
			let reqBody = {
				isDelete: "false",
				isActive: "true",
				processName: this.s_processName,
				createdName: this.s_createdName,
				organizations: _organizations,
				requestDTOS: _s_request,
				modifiedName:this.s_modifiedName,
				modifiedDate: modifiedDate ? new Date(modifiedDate[0]).toISOString() : ""
			};
			try {
				response = await globalService.postData_Async(
					administratorAPI.SearchAllProcessInfoByModifiedDate(page, size, param),
					reqBody,
				);
				if (!response || !response.state) {
					return this.toastError(this.$t("error.load"));
				}
				this.countAllItem = response.data.total;
				this.desserts = response.data.listData.filter((entry) => {
					entry.showAll = false;
					entry.showName = false;
					entry.showReq = false;
					return !entry.isDelete;
				});
				this.desserts = this.sortList(this.desserts);
			} catch (error) {
				console.log(error);
			}
			// this.listUserInfo = this.sortList(this.listUserInfo);
		},
		changePage(event) {
			this.eventPage = event;
			if (event.itemsPerPage == -1) {
				event.itemsPerPage = 100;
			}
			this.getAllProcessInfo(event.page - 1, event.itemsPerPage, this.modifiedDate);
		},
		fiterByProcessName(event) {
			if (
				event.code == constant.keys.enter ||
				event.keyCode == constant.keys.enter_keyCode ||
				!event.target.value
			) {
				this.getAllProcessInfo(
					this.eventPage.page - 1,
					this.eventPage.itemsPerPage,
					this.modifiedDate
				);
				this.eventPage.page = 1;
			}
		},
		fiterByCreatedName(event) {
			if (
				event.code == constant.keys.enter ||
				event.keyCode == constant.keys.enter_keyCode ||
				!event.target.value
			) {
				this.getAllProcessInfo(
					this.eventPage.page - 1,
					this.eventPage.itemsPerPage,
				);
				this.eventPage.page = 1;
			}
		},
		filterByModifiedDate(){
			this.showModifyDatePicker = false;
			this.getAllProcessInfo(this.eventPage.page - 1, this.eventPage.itemsPerPage, this.modifiedDate);
		},
		clearFilterByModifiedDate(){
			this.modifiedDate = null;
			this.eventPage.page = 1;
				this.getAllProcessInfo(
					this.eventPage.page - 1,
					this.eventPage.itemsPerPage,
					this.modifiedDate
				);
		}
	},
	filters: constant.filters,
};
</script>
<style>
.v-picker__title__btn--active {
	display: none;
}
.v-menu__content {
	max-width: 20vw !important;
}
</style>
