<template>
	<v-card elevation="0">
		<BreadcrumbsVue />
		<v-dialog v-model="dialog.view" persistent width="fit-content">
			<v-card>
				<v-toolbar>
					<v-toolbar-title>
						{{ $t("label.detail") }}
					</v-toolbar-title>
					<v-spacer></v-spacer>
					<v-btn icon @click="dialog.view = false">
						<v-icon>mdi-close</v-icon>
					</v-btn>
				</v-toolbar>
				<VuePerfectScrollbar class="h-70">
					<v-card-text>
						<v-container>
							<v-list-item-content>
								<v-list-item-title class="mb-2 pt-2"
									><strong>{{ $t("label.code_form") }}</strong
									>:
									<em>{{ editedItem.templateFormCode }}</em>
								</v-list-item-title>
								<v-list-item-title class="mb-2 pt-2"
									><strong>{{ $t("label.name_form") }}</strong
									>:
									<em>{{
										editedItem.templateFormName
									}}</em></v-list-item-title
								>

								<v-list-item-title class="mb-2 pt-2"
									><strong>{{ $t("label.created_name") }}</strong>
									:
									<em>
										{{ editedItem.createdName }}
									</em>
								</v-list-item-title>
								<v-list-item-title class="mb-2 pt-2"
									><strong>{{ $t("label.created_date") }}</strong
									>:
									<em>{{
										editedItem.createdDate
									}}</em></v-list-item-title
								>
								<v-list-item-title class="mb-2 pt-2"
									><strong>{{ $t("label.modified_date") }}</strong
									>:
									<em>{{
										editedItem.modifiedDate
									}}</em></v-list-item-title
								>
								<v-list-item-title class="mb-2 pt-2">
									<v-checkbox
										v-model="editedItem.isActive"
										:label="$t('label.is_active')"
										disabled
									>
									</v-checkbox>
								</v-list-item-title>
								<pdf
									v-if="
										files[editedItem.id] &&
										files[editedItem.id].fileExtension ==
											'pdf'
									"
									:src="_downloadFileUrl(editedItem)"
								></pdf>
								<VueDocPreview
									v-else-if="downloadFileUrl(editedItem)"
									:value="downloadFileUrl(editedItem)"
									type="office"
								></VueDocPreview>
								<span v-else>
									{{ $t("error.can_not_support") }}
								</span>
							</v-list-item-content>
						</v-container>
					</v-card-text>
				</VuePerfectScrollbar>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn
						elevation="0"
						color="red"
						dark
						class="rounded-pill"
						@click="closeView"
					>
						<v-icon>mdi-close</v-icon>
						{{ $t("button.close") }}
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
		<v-dialog v-model="dialog.delete" persistent width="fit-content">
			<DeleteDialogVue
				@close="onCloseDialog"
				@confirmDelete="onConfirmDelete"
			/>
		</v-dialog>
		<v-dialog v-model="dialog.edit" persistent width="60vw">
			<EditTemplateFormVue
				:templateFormDto="editedItem"
				:oldFile="files[editedItem.id]"
				@close="onClose"
				@save="onSaveTemplateForm"
			/>
		</v-dialog>
		<v-data-table
			:items-per-page="itemperpage"
			:page="numberPage"
			v-model="selected"
			:headers="headers"
			:items="templates"
			:single-select="singleSelect"
			item-key="id"
			show-select
			class="grey lighten-5"
			:search="search"
			:custom-filter="customFilter"
			:loading="!templates"
			:loading-text="$t('label.loading')"
			:no-data-text="$t('message.no_data')"
			:no-results-text="$t('message.no_results')"
			@pagination="logEvent($event)"
		>
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
						class="rounded-pill text-none font-weight-regular"
						v-bind="attrs"
						v-on="on"
						to="tao-moi"
						text
						append
					>
						<v-icon small class="mr-2"> mdi-plus </v-icon>
						{{ $t("button.create") }}
						<v-icon small class="mr-2">mdi-menu-down</v-icon>
					</v-btn>
					<v-btn
						elevation="0"
						class="rounded-pill text-none font-weight-regular"
						@click="deleteAll"
						text
					>
						<v-icon small class="mr-2">mdi-delete-outline</v-icon>
						{{ $t("button.delete_all") }}
					</v-btn>
					<v-spacer></v-spacer>
					<v-btn icon @click="filterExist = !filterExist">
						<v-icon>mdi-filter </v-icon>
					</v-btn>
				</v-card-title>
				<v-divider></v-divider>
			</template>

			<template v-slot:[`body.prepend`]>
				<v-divider></v-divider>
				<tr v-if="filterExist">
					<td></td>
					<td class="pl-0">
						<v-text-field
							v-model="templateFormName"
							type="string"
							outlined
							dense
							class="mt-2"
							:label="$t('label.name_form')"
							@keyup="onKeyUpSearchForTemplateFormName"
							:error-messages="errorMessageSearchTemplateFormName"
							maxLength="255"
						></v-text-field>
					</td>
					<td class="pl-0">
						<v-text-field
							v-model="s_file"
							type="string"
							outlined
							dense
							class="mt-2"
							:label="$t('label.file')"
							maxLength="255"
						></v-text-field>
					</td>
					<td class="pl-0">
						<v-select
							:menu-props="{ bot: true, offsetY: true }"
							maxLength="255"
							v-model="organizations"
							:items="filterOrganization"
							item-text="organizationName"
							:item-value="(item) => item.organizationName"
							:label="$t('label.organization_applicable')"
							class="mt-2"
							dense
							outlined
							:no-data-text="$t('message.no_results')"
						></v-select>
					</td>
					<td class="pl-0">
						<v-select
							:menu-props="{ bot: true, offsetY: true }"
							maxLength="255"
							v-model="s_request"
							item-text="requestName"
							:items="filterRequest"
							:label="$t('label.type_request_apply')"
							:item-value="(item) => item.requestName"
							class="mt-2"
							dense
							outlined
							:no-data-text="$t('message.no_results')"
						></v-select>
					</td>
					<td class="pl-0">
						<v-text-field
							v-model="modifiedName"
							outlined
							dense
							class="mt-2"
							:label="$t('label.modified_name')"
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
									:value="formatDate(modifiedDate)"
									clearable
									:label="$t('label.s_modified_date')"
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
							></v-date-picker>
						</v-menu>
					</td>
					<td></td>
				</tr>
			</template>
			<template v-slot:[`item.actions`]="{ item }">
				<div class="d-flex" style="min-width: fit-content">
					<v-btn color="blue darken-1" icon @click="editItemV2(item)">
						<v-icon> mdi-pencil-circle </v-icon>
						
					</v-btn>
					<v-btn color="red darken-1" icon @click="deleteItem(item)">
						<v-icon> mdi-close-circle </v-icon>
					</v-btn>
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

			<template v-slot:[`item.requestDTOS`]="{ item, index }">
				<template v-if="item.showReq">
					<v-chip
						v-for="(request, index) of item.requestDTOS"
						:key="index"
						v-bind="item"
					>
						{{ request.requestName }}
					</v-chip>
				</template>
				<template v-else>
					<div
						v-for="(request, key) of item.requestDTOS"
						v-bind="item"
						:key="key"
					>
						<v-chip v-if="key < 1">
							{{ request.requestName }}
						</v-chip>
					</div>
				</template>
				<span
					v-if="item.requestDTOS.length > 2 && !item.showReq"
					@click="toggle_request(index)"
				>
					<a href="#"><em>{{$t('button.details')}}</em></a>
				</span>
				<span
					v-if="item.requestDTOS.length > 2 && item.showReq"
					@click="toggle_request(index)"
				>
					<a href="#"><em>{{$t('button.hide')}}</em></a>
				</span>
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
						:key="key"
					>
						<v-chip v-if="key < 1">
							{{ organization.organizationName }}
						</v-chip>
					</div>
				</template>
				<span
					v-if="item.organizations.length > 2 && !item.showAll"
					@click="toggle_detail(index)"
				>
					<a href="#"><em>{{$t('button.details')}}</em></a>
				</span>
				<span
					v-if="item.organizations.length > 2 && item.showAll"
					@click="toggle_detail(index)"
				>
					<a href="#"><em>{{$t('button.hide')}}</em></a>
				</span>
			</template>
			<!-- <template v-slot:[`item.modifiedName`]="{ item }">
				<template>
					<v-avatar color="red darken-2 mr-2" size="28">
						<span class="white--text">
							{{ getAvatarText(item.modifiedName, 2) }}
						</span>
					</v-avatar>
					{{ item.modifiedName }}
				</template>
			</template> -->
		</v-data-table>
	</v-card>
</template>
<script>
import globalService from "@/services/global.service";
import moment from "moment";
import EditTemplateFormVue from "./EditTemplateForm.vue";
import VueDocPreview from "vue-doc-preview";
import administratorAPI from "../administrator.api";
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import DeleteDialogVue from "@/components/DeleteDialog.vue";
import BreadcrumbsVue from "@/components/Breadcrumbs.vue";
import pdf from "pdfvuer";
export default {
	name: "ListFormVue",
	components: {
		EditTemplateFormVue,
		VueDocPreview,
		VuePerfectScrollbar,
		DeleteDialogVue,
		BreadcrumbsVue,
		pdf,
	},
	data() {
		return {
			filterOrganization: [],

			s_request: this.$t("label.show_all"),
			filterRequest: [],
			itemperpage: 10,
			numberPage: 1,
			listOrganizatin: [],
			errorMessage: "",
			errorMessageDes: "",
			errorMessageSearchTemplateFormCode: "",
			errorMessageSearchTemplateFormName: "",
			errorMessageSearchCreatedName: "",
			errorMessageSearchAll: "",
			user_current: this.getUserInfo(),
			templateFormCode: "",
			templateFormName: "",
			createdName: "",
			dateFormat: "DD/MM/yyyy",
			createdDate: null,
			modifiedDate: null,
			modifiedName: null,
			description: null,
			s_file: "",
			isActive: this.$t("label.show_all"),
			filterItems: [
				this.$t("label.show_all"),
				this.$t("label.used"),
				this.$t("label.unused"),
			],
			organizations: this.$t("label.show_all"),
			singleSelect: false,
			selected: [],
			dialog: {
				view: false,
				edit: false,
				delete: false,
			},
			updateItem: {},
			search: "",
			isDeleting: false,
			isSaving: false,
			showPicker: false,
			showModifyDatePicker: false,

			listIndexAfterFillter: [],
			headers: [
				{
					text: this.$t("label.name_form"),
					value: "templateFormName",
					filter: (value) => {
						if (!this.templateFormName || !value) return true;

						return value
							.toLocaleUpperCase()
							.includes(
								this.templateFormName
									.trim()
									.toLocaleUpperCase()
									.replace(/\s+/g, " "),
							);
					},
				},
				{
					text: this.$t("label.file"),
					value: "attachmentFileDTOS[0].fileName",
					filter: (value) => {
						if (!this.s_file || !value) return true;

						return this.nonAccentVietnamese(value)
							.toLocaleUpperCase()
							.includes(
								this.nonAccentVietnamese(this.s_file)
									.trim()
									.toLocaleUpperCase(),
							);
					},
				},
				{
					text: this.$t("label.organization_applicable"),
					value: "organizations",
					width: "15vw",
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
					text: this.$t("label.type_request_apply"),
					value: "requestDTOS",
					width: "15vw",
					filter: (value) => {
						if (this.s_request == this.$t("label.show_all"))
							return true;
						return value.filter((entry) => {
							return entry.requestName.includes(this.s_request);
						}).length;
					},
				},
				{
					text: this.$t("label.modified_name"),
					value: "modifiedName",
					filter: (value) => {
						if (!this.modifiedName || !value) return true;

						return value
							.toLocaleUpperCase()
							.includes(
								this.modifiedName
									.trim()
									.toLocaleUpperCase()
									.replace(/\s+/g, " "),
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
						return value.includes(this.modifiedDate);
					},
				},
				{
					text: this.$t("label.manipulation"),
					value: "actions",
					sortable: false,
				},
			],
			templates: [],
			editedIndex: -1,
			editedItem: {
				id: null,
				templateFormCode: "",
				templateFormName: "",
				fileExtension: "",
				path: "",
				fullPath: "",
				ofice365Path: "",
				description: "",
				createdId: null,
				createdName: "",
				createdDate: null,
				modifiedId: null,
				modifiedName: "",
				modifiedDate: null,
				isActive: true,
				isDelete: false,
				organizations: [],
			},
			defaultItem: {
				id: null,
				templateFormCode: "",
				templateFormName: "",
				fileExtension: "",
				path: "",
				fullPath: "",
				ofice365Path: "",
				description: "",
				createdId: null,
				createdName: "",
				createdDate: null,
				modifiedId: null,
				modifiedName: "",
				modifiedDate: null,
				isActive: true,
				isDelete: false,
				organizations: [],
			},

			/**
			 * @var AttachmentFileDto[] files
			 */
			files: {},
		};
	},

	computed: {
		formTitle() {
			return this.editedIndex === -1
				? this.$t("title.create_form")
				: this.$t("title.edit_form");
		},
		form() {
			return {
				templateFormName: this.editedItem.templateFormName,
			};
		},
		formatDateFns() {
			return this.createdDate
				? moment(this.createdDate).format(this.dateFormat)
				: "";
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

	created() {
		this.initialize();
		this.getAllOrganization();
		// this.getAllRequest();
	},

	methods: {
		// async getAllRequest() {
		// 	try {
		// 		let response = await globalService.getData_Async(
		// 			administratorAPI.API_GetAllRequestIgnoreFile(),
		// 		);
		// 		if (!response || !response.state) return;
		// 		this.filterRequest = response.data.filter((entry) => {
		// 			return !entry.isDelete;
		// 		});
		// 		this.filterRequest.unshift(this.$t("label.show_all"));
		// 	} catch (error) {
		// 		this.toastError(error);
		// 	}
		// },
		async getAllOrganization() {
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
		async initialize() {
			this.files = {};
			let response = await globalService.getData_Async(
				administratorAPI.API_GetAllTemplateFormIgoneField(),
			);
			if (!response.state) {
				return;
			}
			this.templates = response.data.filter((entry) => {
				entry.showAll = false;
				entry.showReq = false;

				return !entry.isDelete;
			});
			this.filterRequest = response.data.map((entry) => {
				if(entry.requestDTOS.length > 0){

					return entry.requestDTOS;
				}
				return
			});
			this.filterRequest.unshift(this.$t("label.show_all"));
			// console.log("this.filterRequest", this.filterRequest)
			this.sortList(this.templates);
		},
		editItemV2(item) {
			console.log("item",item)
			this.$router.push({ path: `${item.id}`, append: true });
		},
		deleteItem(item) {
			this.selected = [item];
			this.editedIndex = this.templates.indexOf(item);
			this.editedItem = Object.assign({}, item);
			this.dialog.delete = true;
		},

		async deleteItemConfirm() {
			this.updateItem.isDelete = true;
			let response = await globalService.putData_Async(
				"/api/template-forms/" + this.updateItem.id,
				this.updateItem,
			);
			if (!response.state) {
				this.toastError(this.$t("message.delete_error"));
			} else {
				this.toastSuccess(this.$t("message.delete_success"));
			}
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
		toggle_detail(index) {
			if (this.listIndexAfterFillter.length != 0)
				index = this.listIndexAfterFillter[index];
			else index = (this.numberPage - 1) * this.itemperpage + index;
			this.templates[index].showAll = !this.templates[index].showAll;
		},
		toggle_request(index) {
			if (this.listIndexAfterFillter.length != 0)
				index = this.listIndexAfterFillter[index];
			else index = (this.numberPage - 1) * this.itemperpage + index;
			this.templates[index].showReq = !this.templates[index].showReq;
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
			let response = await globalService.postData_Async(
				"/api/_save/template-forms/",
				this.selected,
			);
			if (!response.state) {
				this.toastError(response.message);
			}
			if (response.state) {
				this.isDeleting = true;
				this.toastSuccess(this.$t("message.delete_success"));
			}

			this.selected = [];
			this.isDeleting = false;
			this.initialize();
			this.closeDeleteAll();
		},

		close() {
			this.dialog.edit = false;
			this.errorMessage = "";
			this.errorMessageDes = "";
			this.$nextTick(() => {
				this.editedItem = Object.assign({}, this.defaultItem);
				this.editedIndex = -1;
			});
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
				this.editedItem.templateFormName != "" ||
				this.editedItem.templateFormName.length < 255
			) {
				this.errorMessage = "";
			}
			if (this.editedItem.templateFormName.length > 255) {
				this.errorMessage = this.$t("message.maxlength_required_255");
			}
		},
		onKeyUpDes() {
			if (
				this.editedItem.description != "" ||
				this.editedItem.description.length < 255
			) {
				this.errorMessageDes = "";
			}
			if (this.editedItem.description.length > 255) {
				this.errorMessageDes = this.$t(
					"message.maxlength_required_255",
				);
			}
		},
		onKeyUpSearchForTemplateFormCode() {
			if (
				this.templateFormCode != "" ||
				this.templateFormCode.length < 255
			) {
				this.errorMessageSearchTemplateFormCode = "";
			}
			if (this.templateFormCode.length > 255) {
				this.errorMessageSearchTemplateFormCode = this.$t(
					"message.maxlength_required_255",
				);
			}
		},
		logEvent(event) {
			this.numberPage = event.page;
			this.itemperpage = event.itemsPerPage;
		},
		onKeyUpSearchForTemplateFormName() {
			if (
				this.templateFormName != "" ||
				this.templateFormName.length < 255
			) {
				this.errorMessageSearchTemplateFormName = "";
			}
			if (this.templateFormName.length > 255) {
				this.errorMessageSearchTemplateFormName = this.$t(
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
		onSaveTemplateForm(value) {
			let index = this.templates.findIndex((entry) => {
				return entry.id == value.id;
			});
			if (index == -1) {
				this.templates.push(value);
			} else {
				this.templates[index] = value;
			}
			this.onSaveDialog();
			this.initialize();
		},
		onClose(value) {
			if (value) {
				this.dialog.edit = false;
				this.dialog.view = false;
				this.dialog.delete = false;
			}
		},
		_downloadFileUrl(item) {
			if (!item || !item.id) {
				return;
			}
			if (!this.files[item.id]) {
				return;
			}
			let description = JSON.parse(this.files[item.id].description);
			return administratorAPI.FullAPI_DownloadFile(
				this.files[item.id].idInFileService,
				encodeURIComponent(this.files[item.id].fileName),
				this.files[item.id].fileExtension,
				description.contentType,
			);
		},
		downloadFileUrl(item) {
			if (!item || !item.id) {
				return;
			}
			if (!this.files[item.id]) {
				return;
			}
			return this._downloadFileUrl(item);
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
		formatDate(value, dateFormat = "DD/MM/yyyy") {
			if (!value) {
				return "";
			}
			return moment(value).format(dateFormat);
		}
	},
};
</script>
