<template>
	<v-card elevation="0">
		<BreadcrumbsVue />
		<v-dialog v-model="dialog.delete" persistent width="fit-content">
			<DeleteDialogVue
				@close="onCloseDialog"
				@confirmDelete="onConfirmDelete"
			/>
		</v-dialog>
		<v-dialog max-width="60vw" persistent v-model="editRequestGroupDialog">
			<EditRequestGroupVue @close="onClose" @save="onSaveRequestGroup" />
		</v-dialog>
		<v-card> </v-card>

		<v-col>
			<div class="flex gap-4">
				<span
					>{{ $t("label.show_all") }}
					<v-icon>mdi-menu-down</v-icon>
				</span>
				<v-divider vertical></v-divider>
				<v-menu offset-y>
					<template v-slot:activator="{ on, attrs }">
						<span v-bind="attrs" v-on="on">
							<v-icon>mdi-plus</v-icon>
							{{ $t("button.create") }}
							<v-icon>mdi-menu-down</v-icon>
						</span>
					</template>
					<v-list>
						<v-list-item @click="openEditRequestGroup()">
							<v-list-item-title class="text-black">
								<v-icon>mdi-flip-to-front</v-icon>
								{{ $t("label.request_group") }}
							</v-list-item-title>
						</v-list-item>
						<v-list-item>
							<router-link
								:to="{
									path: '/quan-tri/loai-yeu-cau/tao-moi',
								}"
							>
								<v-list-item-title class="text-black">
									<v-icon>mdi-shape-plus</v-icon>
									{{ $t("label.type_group") }}
								</v-list-item-title>
							</router-link>
						</v-list-item>
					</v-list>
				</v-menu>
				<v-divider vertical></v-divider>
				<span @click="deleteAll" class="cursor-pointer">
					<v-icon>mdi-delete-outline</v-icon>
					{{ $t("button.delete") }}
				</span>
				<v-spacer></v-spacer>
				<v-btn icon @click="filterExist = !filterExist">
					<v-icon>mdi-filter </v-icon>
				</v-btn>
			</div>
		</v-col>
		<v-data-table
			v-model="selected_group"
			:headers="headers_group"
			:items="requests_group"
			:single-select="singleSelect"
			item-key="id"
			show-select
			:search="search"
			:custom-filter="customFilter"
			loading="true"
			:loading-text="$t('label.loading')"
			:show-expand="true"
			@item-expanded="expanded($event.item)"
			class="grey lighten-3"
			:hide-default-footer="requests_group.length < 10 ? true : false"
			:no-data-text="this.$t('message.no_data')"
			hide-default-header
		>
			<template v-slot:top>
				<v-row class="mb-2">
					<v-col cols="1"></v-col>
					<v-col cols="2">{{ $t("label.type_group") }}</v-col>
					<v-col cols="2">{{ $t("label.processing_process") }}</v-col>
					<v-col cols="2">{{
						$t("label.organization_applicable")
					}}</v-col>
					<v-col cols="2">{{ $t("label.modified_name") }}</v-col>
					<v-col cols="2">{{ $t("label.modified_date") }}</v-col>
					<v-col cols="1"></v-col>
				</v-row>
				<v-divider></v-divider>
			</template>
			<template v-slot:[`item.requestGroupName`]="{ item }">
				<div class="w-96">
					<span class="text-black"
						>{{ item.requestGroupName.slice(0, 30) }}

						<span v-if="item.requestGroupName.length > 20">
							...
						</span>
					</span>
					<span
						class="text-black float-right cursor-pointer"
						@click="shareData(item)"
					>
						<v-icon>mdi-plus</v-icon>
						{{ $t("button.create") }}
					</span>
				</div>
			</template>
			<template v-slot:[`body.prepend`]>
				<td
					:colspan="headers_group.length + 1"
					style="padding: 0"
					class="bg-white"
					v-if="filterExist"
				>
					<v-row class="w-full m-0 p-0 flex items-center">
						<v-col cols="1" class="pl-7"></v-col>

						<v-col cols="2">
							<v-text-field
								v-model="requestName"
								type="string"
								outlined
								dense
								class="mt-2"
								:label="$t('label.name')"
								@keyup="onKeyUpSearchForRequestName"
								maxLength="255"
							>
							</v-text-field>
						</v-col>
						<v-col cols="2">
							<v-select
								:menu-props="{
									bot: true,
									offsetY: true,
									maxWidth: '15%',
								}"
								v-model="processInfos"
								:items="listProcess"
								item-text="processName"
								:item-value="(item) => item.processName"
								:label="$t('label.process')"
								class="mt-2"
								dense
								outlined
								:no-data-text="$t('message.no_results')"
							></v-select>
						</v-col>
						<v-col cols="2">
							<v-select
								:menu-props="{
									bot: true,
									offsetY: true,
									maxWidth: '15%',
								}"
								v-model="organization"
								:items="filterOrganization"
								item-text="organizationName"
								:item-value="(item) => item.organizationName"
								:label="$t('label.organize_use')"
								class="mt-2"
								dense
								outlined
								:no-data-text="$t('message.no_results')"
							></v-select>
						</v-col>
						<v-col cols="2">
							<v-text-field
								v-model="modifiedName"
								type="string"
								outlined
								dense
								class="mt-2"
								:label="$t('label.f_modified_name')"
								@keyup="onKeyUpSearchForCreatedName"
								maxLength="255"
							></v-text-field>
						</v-col>

						<v-col cols="2">
							<v-menu
								v-model="showModifyDatePicker"
								:close-on-content-click="false"
								max-width="290"
							>
								<template v-slot:activator="{ on, attrs }">
									<v-text-field
										:value="formatModifyDateFns"
										clearable
										:label="$t('label.s_modified_date')"
										class="mt-2"
										readonly
										v-bind="attrs"
										v-on="on"
										@click:clear="modifiedDate = ''"
										outlined
										dense
									>
									</v-text-field>
								</template>
								<v-date-picker
									v-model="modifiedDate"
									@change="showModifyDatePicker = false"
									header-color="white"
								></v-date-picker>
							</v-menu>
						</v-col>

						<v-col cols="1"></v-col>
					</v-row>
					<v-divider></v-divider>
				</td>
			</template>
			<template v-slot:expanded-item="{ item }">
				<td
					:colspan="headers_group.length + 1"
					style="padding: 0"
					class="bg-white"
					v-if="getRequestTypeByRequestGroup(item).length > 0"
				>
					<v-row
						v-for="(
							itemRequest, index
						) in getRequestTypeByRequestGroup(item)"
						:key="index"
						class="w-full m-0 p-0 flex items-center"
					>
						<v-col cols="1" class="pl-3">
							<v-checkbox @click="selectItem_(itemRequest)">
							</v-checkbox>
						</v-col>
						<v-col cols="2">
							{{ itemRequest.requestName }}
						</v-col>
						<v-col cols="2" v-if="!itemRequest.showAllProcess">
							{{
								processing_Process(itemRequest.processInfos)[0]
							}}
							<span
								v-if="
									processing_Process(itemRequest.processInfos)
										.length > 1
								"
								@click="
									itemRequest.showAllProcess =
										!itemRequest.showAllProcess
								"
								class="text-blue-500 cursor-pointer"
								>...{{ $t("button.details") }}</span
							>
						</v-col>
						<v-col cols="2" v-if="itemRequest.showAllProcess">
							{{
								processing_Process(
									itemRequest.processInfos,
								).join(", ")
							}}
							<span
								@click="
									itemRequest.showAllProcess =
										!itemRequest.showAllProcess
								"
								class="text-blue-500 cursor-pointer"
								>{{ $t("button.hide") }}</span
							>
						</v-col>
						<v-col cols="2" v-if="!itemRequest.showAll">
							{{
								processing_Organization(
									itemRequest.processInfos,
								)[0]
							}}
							<span
								v-if="
									processing_Organization(
										itemRequest.processInfos,
									).length > 1
								"
								@click="
									itemRequest.showAll = !itemRequest.showAll
								"
								class="text-blue-500 cursor-pointer"
							>
								...{{ $t("button.details") }}
							</span>
						</v-col>
						<v-col cols="2" v-if="itemRequest.showAll">
							{{
								processing_Organization(
									itemRequest.processInfos,
								).join(", ")
							}}
							<span
								@click="
									itemRequest.showAll = !itemRequest.showAll
								"
								class="text-blue-500 cursor-pointer"
							>
								{{ $t("button.hide") }}
							</span>
						</v-col>
						<v-col cols="2">
							<v-avatar color="red darken-2 mr-2" size="28">
								<span class="white--text">
									{{
										getAvatarText(
											itemRequest.modifiedName,
											2,
										)
									}}
								</span>
							</v-avatar>
							<span class="w-80">
								{{ itemRequest.modifiedName }}
							</span>
						</v-col>
						<v-col cols="2">
							{{ moment__(itemRequest.modifiedDate) }}
						</v-col>
						<v-col cols="1">
							<div class="flex">
								<v-btn
									icon
									class="mr-2"
									color="blue darken-1"
									:to="{
										path: `loai-yeu-cau/${itemRequest.id}`,
									}"
								>
									<v-icon> mdi-pencil-circle </v-icon>
								</v-btn>
								<v-btn
									icon
									color="red"
									@click="deleteItem(itemRequest)"
								>
									<v-icon> mdi-close-circle </v-icon>
								</v-btn>
							</div>
						</v-col>
						<v-col
							cols="12"
							v-if="
								getRequestTypeByRequestGroup(item).length - 1 !=
								index
							"
						>
							<v-divider></v-divider>
						</v-col>
					</v-row>
				</td>
				<td
					:colspan="headers_group.length + 1"
					style="padding: 0"
					class="bg-white text-center"
					v-else
				>
					{{ $t("message.no_data") }}
				</td>
			</template>
		</v-data-table>
	</v-card>
</template>
<script>
import globalService from "@/services/global.service";
import moment from "moment";
import constant from "@/common/constant.js";
import administratorAPI from "../administrator.api";
import DeleteDialogVue from "@/components/DeleteDialog.vue";
import BreadcrumbsVue from "@/components/Breadcrumbs.vue";
import EditRequestGroupVue from "../RequestGroup/EditRequestGroup.vue";
export default {
	name: "QuanTriNhomLoaiYeuCau",
	components: { DeleteDialogVue, BreadcrumbsVue, EditRequestGroupVue },
	data() {
		return {
			errorMessageSearchRequestCode: "",
			errorMessageSearchRequestName: "",
			errorMessageSearchCreatedDate: "",
			errorMessageSearchAll: "",
			user_current: this.getUserInfo(),
			requestCode: "",
			requestName: "",
			createdName: "",
			createdDate: null,
			modifiedDate: "",
			dateFormat: "DD/MM/yyyy",
			isActive: this.$t("label.show_all"),
			organization: this.$t("label.show_all"),
			processInfos: this.$t("label.show_all"),
			singleSelect: false,
			showPicker: false,
			showModifyDatePicker: false,
			editRequestGroupDialog: false,
			selected: [],
			selected_group: [],
			dialog: {
				view: false,
				edit: false,
				delete: false,
				dropdown: false,
			},
			updateItem: {},
			filterItems: [
				this.$t("label.show_all"),
				this.$t("label.used"),
				this.$t("label.unused"),
			],
			items: [],
			search: "",
			modifiedName: "",
			isDeleting: false,
			isDeleting_group: false,
			isSaving: false,
			itemsDropdown: [
				{ title: this.$t("label.type_group") },
				{ title: this.$t("label.request_group") },
			],
			headers_group: [
				{
					text: this.$t("label.type_group"),
					value: "requestGroupName",
					width: "20%",
				},
				{
					text: this.$t("label.processing_process"),
					value: "processInfos",
					width: "20%",
				},
				{
					text: this.$t("label.organization_applicable"),
					value: "",
					width: "20%",
				},

				{
					text: this.$t("label.modified_name"),
					value: "",
					width: "20%",
				},

				{
					text: this.$t("label.modified_date"),
					value: "",
					width: "10%",
				},
				{ text: "", value: "data-table-expand", width: "5%" },
			],
			requests_group: [],
			requests: [],
			errorMessageSearchCreatedName: "",
			filterOrganization: [],
			listProcess: [],
			listRquestInRequestGroup: {},
		};
	},
	watch: {
		dialog(val) {
			val || this.close();
		},
		dialogDelete(val) {
			val || this.closeDelete();
		},
		dialogView(val) {
			val || this.closeView();
		},
		dialogDeleteAll(val) {
			val || this.closeDeleteAll();
		},
	},

	computed: {
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

	async created() {
		// await this.$Progress.start();
		await this.initialize();
	},
	async mounted() {
		// await this.$Progress.finish();
	},

	methods: {
		async initialize() {
			try {
				await this.getRequestGroup();
				this.getAllOrganzation();
				this.getAllProcess();
			} catch (error) {
				this.toastError(error);
			}
		},
		async getRequestGroup() {
			try {
				let response;
				response = await globalService.getData_Async(
					administratorAPI.API_GetAllRequestGroup(),
				);
				if (!response || !response.state) return;
				this.requests_group = response.data.filter((entry) => {
					return !entry.isDelete && entry.isActive;
				});
				this.sortList(this.requests_group);
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

		async getAllProcess() {
			try {
				let response = await globalService.getData_Async(
					administratorAPI.API_GetAllProcessInfoIgnoreFile(),
				);
				if (!response || !response.state) {
					return;
				}
				this.listProcess = response.data.filter((entry) => {
					return !entry.isDelete;
				});
				this.listProcess.unshift(this.$t("label.show_all"));
				this.listProcess = this.sortList(this.listProcess);
			} catch (error) {
				console.log(error);
			}
		},

		deleteItem(item) {
			this.selected = [item];
			this.dialog.delete = true;
		},

		async deleteItemConfirm() {
			this.selected = this.selected.map((entry) => {
				entry.isDelete = true;
				return entry;
			});
			let response;
			try {
				response = await globalService.postData_Async(
					administratorAPI.API_SaveAllRequest(),
					this.selected,
				);
				if (!response || !response.state) {
					this.toastError(this.$t("message.error"));
				}
				for (let item of this.selected) {
					let index = this.requests.indexOf(item);
					this.requests.splice(index, 1);
				}
				this.selected = [];
				this.toastSuccess(this.$t("message.success"));
				this.closeDelete();
			} catch (error) {
				this.toastError(error);
			}
		},
		closeDelete() {
			this.dialog.delete = false;
		},
		closeDeleteAll() {
			this.dialog.delete = false;
		},

		customFilter(value, search, item) {
			return !!search && this.match(item, search);
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
			if (this.selected.length > 0 || this.selected_group.length > 0) {
				this.dialog.delete = true;
			} else {
				this.toastError(this.$t("message.alert_no_selected"));
			}
		},
		onKeyUpSearchForRequestCode() {
			if (this.requestCode != "" || this.requestCode.length < 255) {
				this.errorMessageSearchRequestCode = "";
			}
			if (this.requestCode.length > 255) {
				this.errorMessageSearchRequestCode = this.$t(
					"message.maxlength_required_255",
				);
			}
		},
		onKeyUpSearchForRequestName() {
			if (this.requestName != "" || this.requestName.length < 255) {
				this.errorMessageSearchRequestName = "";
			}
			if (this.requestName.length > 255) {
				this.errorMessageSearchRequestName = this.$t(
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
		async deleteAllConfirm() {
			try {
				if (this.isDeleting) {
					return;
				}
				this.isDeleting = true;
				this.selected = this.selected.map((entry) => {
					entry.isDelete = true;
					return entry;
				});
				let response = await globalService.postData_Async(
					"/api/_save/requests/",
					this.selected,
				);
				if (response.state) {
					this.isDeleting = true;
					this.toastSuccess(this.$t("success.delete"));
				} else {
					this.toastError(this.$t("message.error"));
				}
				this.requests = this.requests.filter(
					(ele) =>
						ele?.requestGroup?.id !=
						this.selected[0].requestGroup.id,
				);
				this.listRquestInRequestGroup[
					`${this.selected[0].requestGroup.id}`
				] = false;
				await this.expanded(this.selected[0].requestGroup);
				this.selected = [];
				this.isDeleting = false;
				this.closeDeleteAll();

			} catch (error) {
				console.log(error);
			}
		},
		onConfirmDelete(value) {
			if (!value) {
				this.onCloseDialog();
			} else {
				if (this.selected.length > 0) {
					this.deleteAllConfirm();
				}
				if (this.selected_group.length > 0) {
					this.deleteAllConfirm_Group();
				}
			}
		},
		async deleteAllConfirm_Group() {
			if (this.isDeleting_group) {
				return;
			}
			this.isDeleting_group = true;
			this.selected_group = this.selected_group.map((entry) => {
				entry.isDelete = true;
				return entry;
			});
			let response;
			try {
				response = await globalService.postData_Async(
					"/api/_save/request-groups/",
					this.selected_group,
				);
				if (response.state) {
					this.isDeleting_group = true;
					this.toastSuccess(this.$t("success.delete"));
				}

				if (!response || !response.state) {
					this.toastError(this.$t("message.error"));
				}

				this.selected_group = [];
				this.isDeleting_group = false;
				this.initialize();
				this.closeDeleteAll();
			} catch (error) {
				console.log(error);
			}
		},
		openDropDown() {
			this.dialog.dropdown = true;
		},
		processing_Process(processInfo) {
			let processName = [];
			if (processInfo && processInfo.length > 0) {
				for (let i = 0; i < processInfo.length; i++) {
					processName.push(processInfo[i].processName);
				}
			}
			return processName;
		},
		processing_Organization(processInfo) {
			let organization = [];
			if (processInfo && processInfo.length > 0) {
				for (let i = 0; i < processInfo.length; i++) {
					if (processInfo[i].organizations.length > 0) {
						for (
							let j = 0;
							j < processInfo[i].organizations.length;
							j++
						) {
							if (
								!organization.includes(
									processInfo[i].organizations[j]
										.organizationName,
								)
							) {
								organization.push(
									processInfo[i].organizations[j]
										.organizationName,
								);
							}
						}
					}
				}
			}
			return organization;
		},
		getRequestTypeByRequestGroup(item) {
			let list = [];
			let listFilter = [];
			if (this.requests && this.requests.length > 0) {
				for (let i = 0; i < this.requests.length; i++) {
					if (this.requests[i].requestGroup.id == item.id) {
						list.push(this.requests[i]);
						listFilter = list;
						if (this.requestName != "") {
							listFilter = listFilter.filter((entry) => {
								return this.nonAccentVietnamese(
									entry.requestName.toLocaleUpperCase(),
								).includes(
									this.nonAccentVietnamese(
										this.requestName.toLocaleUpperCase(),
									),
								);
							});
						}
						if (this.modifiedName != "") {
							listFilter = listFilter.filter((entry) => {
								return this.nonAccentVietnamese(
									entry.modified.fullName.toLocaleUpperCase(),
								).includes(
									this.nonAccentVietnamese(
										this.modifiedName.toLocaleUpperCase(),
									),
								);
							});
						}
						if (
							this.organization.length > 0 &&
							this.organization != this.$t("label.show_all")
						) {
							listFilter = listFilter.filter((entry) => {
								return this.processing_Organization(
									entry.processInfos,
								)
									.join(",")
									.includes(this.organization);
							});
						}
						if (
							this.processInfos.length > 0 &&
							this.processInfos != this.$t("label.show_all")
						) {
							listFilter = listFilter.filter((entry) => {
								return this.processing_Process(
									entry.processInfos,
								)
									.join(",")
									.includes(this.processInfos);
							});
						}
						if (this.modifiedDate != "") {
							listFilter = listFilter.filter((entry) => {
								return (
									moment(entry.modifiedDate).format(
										this.dateFormat,
									) ==
									moment(this.modifiedDate).format(
										this.dateFormat,
									)
								);
							});
						}
					}
				}
			}

			return listFilter;
		},
		openEditRequestGroup() {
			this.editRequestGroupDialog = true;
		},
		onClose(value) {
			if (value) {
				this.editRequestGroupDialog = false;
			}
		},
		onSaveRequestGroup(value) {
			console.log(value);
			this.initialize();
		},
		selectItem_(item) {
			let index = this.selected.indexOf(item);
			if (index == -1) {
				this.selected.push(item);
				// return;
			} else {
				this.selected.splice(index, 1);
				// return;
			}
		},
		moment__(x) {
			return x ? moment(x).format(this.dateFormat) : null;
		},
		shareData(item) {
			this.$router.push({
				name: "Thêm mới loại yêu cầu 1",
				params: { data: item },
			});
		},
		async expanded(item) {
			try {
				if (!this.listRquestInRequestGroup[`${item.id}`]) {
					let response = await globalService.getData_Async(
						administratorAPI.API_GetRequestByRqGroupId(item.id),
					);
					if (!response) {
						return;
					}
					response.data = response.data.filter((entry) => {
						entry.showAll = false;
						entry.showAllProcess = false;
						entry.modifiedName = entry.modified.fullName;
						return !entry.isDelete;
					});
					this.listRquestInRequestGroup[`${item.id}`] = item.id;
					this.requests.push(...response.data);
				}
				return;
			} catch (error) {
				console.log(error);
			}
		},
	},

	filters: constant.filters,
};
</script>
<style>
.v-picker__title__btn--active {
	display: none;
}
.p-style {
	width: 320px;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}
</style>
