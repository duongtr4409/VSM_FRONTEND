<template>
	<v-card  elevation="0" class="p-2">
		<BreadcrumbsVue />
			<v-dialog width="96vw" v-model="openPopup" persistent>
				<EditTemplateMailV2
					@close="onClosePopup"
					@load="onReLoad"
					:idMailSelect="selected_Item ? selected_Item.id : null"
				></EditTemplateMailV2>
			</v-dialog>

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
									<em>{{ editedItem.mailTemplateCode }}</em>
								</v-list-item-title>
								<v-list-item-title class="mb-2 pt-2"
									><strong>{{ $t("label.name_form") }}</strong
									>:
									<em>{{
										editedItem.mailTemplateName
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
									><strong>{{ $t("label.modified_name") }}</strong
									>:
									<em>{{
										editedItem.modifiedName
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
			v-model="selected"
			:headers="headers"
			:items="templateMails"
			:single-select="singleSelect"
			item-key="id"
			show-select
			class="grey lighten-5"
			:search="search"
			:custom-filter="customFilter"
			:loading="!templateMails"
			:loading-text="$t('label.loading')"
			:no-data-text="$t('message.no_data')"
			:no-results-text="$t('message.no_results')"
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
			<template v-slot:[`item.processInfos`]="{ item }">
				<template v-if="item.showAll">
					<v-chip
						v-for="process of item.processInfos"
						:key="process.id"
						v-bind="item"
					>
						{{ process.processName }}
					</v-chip>
				</template>
				<template v-else>
					<div
						v-for="(process, key) of item.processInfos"
						v-bind="item"
						:key="process.id"
					>
						<v-chip v-if="key < 1">
							{{ process.processName.slice(0, 40) }}
						</v-chip>
					</div>
				</template>
				<span
					v-if="item.processInfos.length > 1 && !item.showAll"
					@click="item.showAll = !item.showAll"
				>
					<a href="#"><em>Chi tiết</em></a>
				</span>
				<span
					v-if="item.processInfos.length > 1 && item.showAll"
					@click="item.showAll = !item.showAll"
				>
					<a href="#"><em>Ẩn</em></a>
				</span>
			</template>
			<template v-slot:top="{ on, attrs }">
				<v-card-title class="p-0 w-full">
					<v-btn
						elevation="0"
						class="rounded-pill text-capitalize font-weight-regular"
						v-bind="attrs"
						v-on="on"
						@click="editItemV2"
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

			<template v-slot:[`body.prepend`]>
				<v-divider></v-divider>
				<tr v-if="filterExist">
					<td></td>
					<td class="pl-0">
						<v-text-field
							v-model="mailTemplateName"
							type="string"
							outlined
							dense
							class="mt-2"
							:label="$t('label.name_form')"
							@keyup="onKeyUpSearchForTemplateFormName"
							:error-messages="errorMessageSearchTemplateMailName"
							maxLength="255"
							rounded
						></v-text-field>
					</td>
					<!-- <td>
						<v-text-field
							v-model="description"
							type="string"
							outlined
							dense
							class="mt-2"
							:label="$t('label.description')"
							maxLength="255"
						></v-text-field>
					</td> -->
					<td class="pl-0">
						<v-select
							:menu-props="{ bot: true, offsetY: true }"
							v-model="processInfos"
							:items="filterProcessInfos"
							item-text="processName"
							:item-value="(item) => item.processName"
							:label="$t('label.process_used')"
							class="mt-2"
							dense
							outlined
							:no-data-text="$t('message.no_results')"
							rounded
						></v-select>
					</td>
					<td class="pl-0">
						<v-select
							:menu-props="{ bot: true, offsetY: true }"
							v-model="organizations"
							:items="filterOrganization"
							item-text="organizationName"
							:item-value="(item) => item.organizationName"
							:label="$t('label.organize_use')"
							class="mt-2"
							dense
							outlined
							:no-data-text="$t('message.no_results')"
							rounded
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
							rounded
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
									:label="$t('label.modified_date')"
									class="mt-2"
									readonly
									v-bind="attrs"
									v-on="on"
									@click:clear="modifiedDate = null"
									outlined
									dense
									rounded
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
				<div class="d-flex p-2" style="min-width: fit-content">
					<v-btn color="blue darken-1" icon @click="editItemV2(item)">
						<v-icon small> mdi-pencil </v-icon>
					</v-btn>
					<v-btn color="red darken-1" icon @click="deleteItem(item)">
						<v-icon small> mdi-trash-can-outline </v-icon>
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
		</v-data-table>
	</v-card>
</template>
<script>
import globalService from "@/services/global.service";
import moment from "moment";
import EditTemplateFormVue from "./EditTemplateForm.vue";
import EditTemplateMailV2 from "./EditTemplateMailV2.vue";
import VueDocPreview from "vue-doc-preview";
import administratorAPI from "../administrator.api";
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import DeleteDialogVue from "@/components/DeleteDialog.vue";
import BreadcrumbsVue from "@/components/Breadcrumbs.vue";
import pdf from "pdfvuer";
export default {
	name: "ListTemplateMailVue",
	components: {
		EditTemplateFormVue,
		VueDocPreview,
		VuePerfectScrollbar,
		DeleteDialogVue,
		BreadcrumbsVue,
		pdf,
		EditTemplateMailV2,
	},
	data() {
		return {
			selected_Item: null, // biến chứa item đã chọn để mở popup
			openPopup: false, // biến để ẩn hiện popup
			errorMessage: "",
			errorMessageDes: "",
			errorMessageSearchTemplateMailCode: "",
			errorMessageSearchTemplateMailName: "",
			errorMessageSearchCreatedName: "",
			errorMessageSearchAll: "",
			user_current: this.getUserInfo(),
			mailTemplateCode: "",
			mailTemplateName: "",
			createdName: "",
			dateFormat: "DD/MM/yyyy",
			createdDate: null,
			modifiedDate: null,
			modifiedName: null,
			description: null,
			processInfos: this.$t("label.show_all"),
			organizations: this.$t("label.show_all"),
			filterOrganization: [],
			filterProcessInfos: [],
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
			updateItem: {},
			search: "",
			isDeleting: false,
			isSaving: false,
			showPicker: false,
			showModifyDatePicker: false,
			headers: [
				{
					text: this.$t("label.mail_template_name"),
					value: "mailTemplateName",
					filter: (value) => {
						if (!this.mailTemplateName || !value) return true;

						return value
							.toLocaleUpperCase()
							.includes(
								this.mailTemplateName
									.trim()
									.toLocaleUpperCase()
									.replace(/\s+/g, " "),
							);
					},
				},
				{
					text: this.$t("label.process_used"),
					value: "processInfos",
					filter: (value) => {
						if (this.processInfos == this.$t("label.show_all"))
							return true;
						return value.filter((entry) => {
							return entry.processName.includes(
								this.processInfos,
							);
						}).length;
					},
				},
				{
					text: this.$t("label.organization_unit"),
					value: "organizations",
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
			templateMails: [],
			editedIndex: -1,
			editedItem: {
				id: null,
				mailTemplateCode: "",
				mailTemplateName: "",
				subject: "",
				contentFile: "",
				mappingInfo: "",
				description: "",
				createdId: null,
				createdName: "",
				createdOrgName: "",
				createdRankName: "",
				createdDate: null,
				modifiedId: null,
				modifiedName: "",
				modifiedDate: null,
				isActive: true,
				isDelete: false,
			},
			defaultItem: {
				id: null,
				mailTemplateCode: "",
				mailTemplateName: "",
				subject: "",
				contentFile: "",
				mappingInfo: "",
				description: "",
				createdId: null,
				createdName: "",
				createdOrgName: "",
				createdRankName: "",
				createdDate: null,
				modifiedId: null,
				modifiedName: "",
				modifiedDate: null,
				isActive: true,
				isDelete: false,
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
		this.init();
	},

	methods: {
		async init() {
			await this.getAllOrganzation();
			await this.getAllProcess();
		},
		async initialize() {
			this.files = {};
			try {
				let response = await globalService.getData_Async(
					administratorAPI.API_GetAllMailTemplate(),
				);
				if (!response.state) {
					return;
				}
				this.templateMails = response.data.filter((entry) => {
					entry.showAll = false;
					return !entry.isDelete;
				});
			} catch (error) {
				console.log(error);
			}
			this.templateMails = this.sortList(this.templateMails);
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

		async getAllProcess() {
			try {
				let response = await globalService.getData_Async(
					administratorAPI.API_GetAllProcessInfoIgnoreFile(),
				);
				if (!response || !response.state) {
					return;
				}
				this.filterProcessInfos = response.data.filter((entry) => {
					return !entry.isDelete;
				});
			} catch (error) {
				console.log(error);
			}
			this.filterProcessInfos.unshift(this.$t("label.show_all"));
			this.filterProcessInfos = this.sortList(this.filterProcessInfos);
		},
		editItemV2(item) {
			this.openPopup = true;
			this.selected_Item = item;
			console.log(582, item.id);
			// this.$router.push({ path: `${item.id}`, append: true });
		},
		async editItem(item) {
			this.editedIndex = this.templateMails.indexOf(item);
			this.editedItem = Object.assign({}, item);
			if (this.editedItem.id && !this.files[this.editedItem.id]) {
				let response;
				try {
					response = await globalService.getData_Async(
						administratorAPI.API_GetAllAttachmentFileByTemplateFormId(
							item.id,
						),
					);
					if (!response) {
						this.toastError(this.$t("error.load_file"));
					} else if (!response.state) {
						this.toastError(response.messgage);
					}
					{
						let array = response.data;
						array.sort((a, b) => b.id - a.id);
						this.files[item.id] = array[0];
					}
				} catch (error) {
					// this.toastError(error);
				}
			}
			this.dialog.edit = true;
		},
		async viewItem(item) {
			this.editedIndex = this.templateMails.indexOf(item);
			this.editedItem = Object.assign({}, item);
			if (!this.files[this.editedItem.id]) {
				let response;
				try {
					response = await globalService.getData_Async(
						administratorAPI.API_GetAllAttachmentFileByTemplateFormId(
							item.id,
						),
					);
					if (!response) {
						this.toastError(this.$t("error.load_file"));
					} else if (!response.state) {
						this.toastError(response.messgage);
					}
					{
						let array = response.data;
						array.sort((a, b) => b.id - a.id);
						this.files[item.id] = array[0];
					}
				} catch (error) {
					this.toastError(error);
				}
			}
			this.editedItem.createdDate = moment(
				this.editedItem.createdDate,
			).format(this.dateFormat);
			this.editedItem.modifiedDate = moment(
				this.editedItem.modifiedDate,
			).format(this.dateFormat);
			this.dialog.view = true;
		},

		deleteItem(item) {
			this.selected = [item];
			this.editedIndex = this.templateMails.indexOf(item);
			this.editedItem = Object.assign({}, item);
			this.dialog.delete = true;
		},

		async deleteItemConfirm() {
			this.updateItem.isDelete = true;
			try {
				let response = await globalService.putData_Async(
					"/api/mail-templates/" + this.updateItem.id,
					this.updateItem,
				);
				if (!response.state) {
					this.toastError(this.$t("message.delete_error"));
				} else {
					this.toastSuccess(this.$t("message.delete_success"));
				}
			} catch (error) {
				console.log(error);
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
					"/api/_save/mail-templates",
					this.selected,
				);
				if (!response.state) {
					this.toastError(response.message);
				}
				if (response.state) {
					this.isDeleting = true;
					this.toastSuccess(this.$t("message.delete_success"));
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
				this.mailTemplateCode != "" ||
				this.mailTemplateCode.length < 255
			) {
				this.errorMessageSearchTemplateMailCode = "";
			}
			if (this.mailTemplateCode.length > 255) {
				this.errorMessageSearchTemplateMailCode = this.$t(
					"message.maxlength_required_255",
				);
			}
		},
		onKeyUpSearchForTemplateFormName() {
			if (
				this.mailTemplateName != "" ||
				this.mailTemplateName.length < 255
			) {
				this.errorMessageSearchTemplateMailName = "";
			}
			if (this.mailTemplateName.length > 255) {
				this.errorMessageSearchTemplateMailName = this.$t(
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
			let index = this.templateMails.findIndex((entry) => {
				return entry.id == value.id;
			});
			if (index == -1) {
				this.templateMails.push(value);
			} else {
				this.templateMails[index] = value;
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
		},
		onClosePopup(event) {
			this.openPopup = event;
		},
		onReLoad(event) {
			if (event) {
				this.initialize();
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
