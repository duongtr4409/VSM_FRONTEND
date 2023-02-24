<template>
	<v-card flat elevation="0">
		<BreadcrumbsVue />

		<v-dialog v-model="dialog.delete" max-width="fit-content">
			<DeleteDialogVue
				@close="closeDelete"
				@confirmDelete="onConfirmDelete"
			/>
		</v-dialog>
		<v-dialog v-model="dialog.import" width="60vw" persistent>
			<ImportVue
				:isShow="dialog.import"
				@close="onClose"
				@saveRequest="onSaveRequest"
				class="h-4/6"
			/>
		</v-dialog>
		<v-dialog v-model="dialog.creating" width="60vw" persistent>
			<NewRequestGroupV2Vue @close="onClose" class="h-4/6" />
		</v-dialog>
		<v-dialog v-model="dialog.approval" width="60vw" persistent>
			<ApprovalAllRequestVue
				:selected="selected"
				:isShow="dialog.approval"
				@result="getReult"
				@close="onClose"
			></ApprovalAllRequestVue>
		</v-dialog>
		<v-dialog v-model="dialog.results" max-width="60vw" persistent>
			<ResultVue :results="m_result" @close="onClose" />
		</v-dialog>
		<v-row>
			<v-col
				cols="12"
				md="12"
				class="d-flex w-full mt-3.5"
				style="justify-content: space-between"
			>
				<div class="d-flex">
					<div class="d-flex">
						<v-btn
							@click="openDialogCreate"
							text
							class="mb-4 mr-2 rounded"
						>
							<v-icon color="blue"> mdi-plus </v-icon>
							<span class="normal-case text-xs">
								{{ $t("button.create") }}</span
							>
						</v-btn>
						<v-btn
							text
							class="mb-4 mr-2 rounded"
							@click="openDialogImport()"
						>
							<v-icon color="blue"> mdi-arrow-up </v-icon>
							<span class="normal-case text-xs">
								{{ $t("button.import") }}</span
							>
						</v-btn>
						<v-btn
							text
							class="mb-4 mr-2 rounded"
							@click="deleteAll"
						>
							<v-icon color="red"> mdi-trash-can-outline </v-icon>
							<span class="normal-case text-xs">
								{{ $t("button.delete_all") }}</span
							>
						</v-btn>
					</div>
				</div>
				<div class="d-flex items-center">
					<v-btn text @click="openDialogAproval">
						<v-icon class="mr-2">mdi-check</v-icon>
						{{ $t("button.approval") }}
					</v-btn>
					<v-list-item>
						<vue-excel-xlsx
							:data="json_data"
							:file-name="getFilenameExcel()"
							:columns="json_fields"
							:file-type="'xlsx'"
							:sheet-name="'Phiếu đang soạn'"
						>
							<v-btn text tile color="green darken-1 text-xs">
								<v-icon color="green darken-1">
									mdi-microsoft-excel
								</v-icon>
								<span class="text-xs">
									{{ $t("label.export") }}
								</span>
							</v-btn>
						</vue-excel-xlsx>
					</v-list-item>
					<v-btn icon @click="isShowFilter = !isShowFilter">
						<v-icon color="green darken-1"
							>mdi-filter-outline
						</v-icon>
					</v-btn>
				</div>
			</v-col>
		</v-row>
		<v-data-table
			v-model="selected"
			:headers="headers"
			:items="listRequestData"
			item-key="id"
			show-select
			fixed-header
			height="400"
			:no-data-text="$t('message.no_results')"
			:no-results-text="$t('message.no_results')"
			:loading="requestDataLoading"
			:loading-text="$t('message.loading_text')"
		>
			<template v-slot:top>
				<v-row
					v-if="isShowFilter"
					class="d-flex justify-end pos-sticky grey lighten-2"
				>
					<v-col cols="4" class="my-[-1rem]">
						<v-text-field
							v-model.trim="s_requestDataCode"
							dense
							hide-details
							prepend-icon="mdi-magnify"
							maxLength="255"
							class="my-1 rounded-sm"
							:placeholder="$t('label.search')"
						>
						</v-text-field>
					</v-col>
					<v-col cols="8" class="my-[-1rem]">
						<v-row class="justify-end">
							<v-col cols="2">
								<v-text-field
									v-model.trim="s_landnumber"
									dense
									hide-details
									class="my-1 rounded-sm"
									maxLength="255"
									:placeholder="$t('label.land_number')"
								></v-text-field>
							</v-col>
							<v-col cols="2">
								<v-combobox
									v-model="s_requestDataName"
									dense
									:items="requestTypes"
									item-text="requestTypeName"
									clearable
									class="my-1 w-[10rem]"
									maxLength="255"
									:placeholder="$t('label.request_type')"
								></v-combobox>
							</v-col>
							<v-col cols="2">
								<v-select
									:menu-props="{ bot: true, offsetY: true }"
									v-model="s_statusName"
									class="rounded-sm"
									dense
									hide-details
									clearable
									item-text="statusName"
									:item-value="(item) => item.statusName"
									:items="ALL_STATUS"
									:placeholder="$t('label.status')"
								>
								</v-select>
							</v-col>
							<v-col cols="2">
								<v-text-field
									v-model.trim="s_approverName"
									dense
									hide-details
									class="rounded-sm"
									maxLength="255"
									:placeholder="$t('label.approve_name')"
								></v-text-field>
							</v-col>
							<v-col cols="2">
								<v-menu
									v-model.trim="showPicker"
									:close-on-content-click="false"
									transition="scale-transition"
									offset-y
								>
									<template v-slot:activator="{ on, attrs }">
										<v-text-field
											:value="formatDateFns"
											clearable
											:placeholder="
												$t('label.created_date')
											"
											readonly
											hide-details
											v-bind="attrs"
											v-on="on"
											@click:clear="s_createdDate = null"
											append-icon="mdi-calendar"
											dense
											class="rounded-sm"
										></v-text-field>
									</template>
									<v-date-picker
										v-model="s_createdDate"
										@change="showPicker = false"
										no-title
										scrollable
										range
									></v-date-picker>
								</v-menu>
							</v-col>
							<v-col cols="2">
								<v-menu
									v-model.trim="showExpiryPick"
									:close-on-content-click="false"
									transition="scale-transition"
									offset-y
								>
									<template v-slot:activator="{ on, attrs }">
										<v-text-field
											:value="formatDateExpiry"
											clearable
											:placeholder="
												$t('label.expire_date')
											"
											readonly
											hide-details
											v-bind="attrs"
											v-on="on"
											@click:clear="s_expire_date = null"
											append-icon="mdi-calendar"
											dense
											class="rounded-sm"
										></v-text-field>
									</template>
									<v-date-picker
										v-model="s_expire_date"
										@change="showExpiryPick = false"
										no-title
										scrollable
										range
									></v-date-picker>
								</v-menu>
							</v-col>
						</v-row>
					</v-col>
				</v-row>
			</template>

			<template v-slot:[`item.createdOrgName`]="{ item }">
				<span hidden class="d-none">
					{{ item.createdOrgName }}
				</span>
			</template>
			<template v-slot:[`item.contractExpireTime`]="{ item }">
				<span class="text-xs">
					{{ item.contractExpireTime | format_date }}
				</span>
			</template>

			<template v-slot:[`item.requestDataCode`]="{ item }">
				<v-tooltip bottom>
					<template v-slot:activator="{ on, attrs }">
						<router-link
							:to="{
								path: `/phieu-yeu-cau/${item.id}/chi-tiet`,
							}"
							class="mx-[-1rem] px-[-1rem]"
						>
							<span
								class="text-blue-400 text-xs d-block"
								v-bind="attrs"
								v-on="on"
							>
								{{ item.requestDataCode.slice(0, 15) }}
								<span v-if="item.requestDataCode.length > 15">
									...
								</span>
							</span>
						</router-link>
					</template>
					<span>
						{{ item.requestDataCode }}
					</span>
				</v-tooltip>
			</template>

			<template v-slot:[`item.title`]="{ item }">
				<v-tooltip bottom>
					<template v-slot:activator="{ on, attrs }">
						<router-link
							:to="{
								path: `/phieu-yeu-cau/${item.id}/chi-tiet`,
							}"
						>
							<span
								class="text-black text-xs"
								v-bind="attrs"
								v-on="on"
							>
								{{ item.title.slice(0, 30) }}
							</span>
							<span
								v-if="item.title.length > 30"
								class="text-black"
								>...</span
							>
						</router-link>
					</template>
					<span>{{ item.title }}</span>
				</v-tooltip>
			</template>
			<template v-slot:[`item.requestDataName`]="{ item }">
				<v-tooltip bottom>
					<template v-slot:activator="{ on, attrs }">
						<span
							class="text-black text-xs"
							v-bind="attrs"
							v-on="on"
						>
							{{ item.requestDataName.slice(0, 17) }}
						</span>
						<span
							v-if="item.requestDataName.length > 17"
							class="text-black"
							>...</span
						>
					</template>
					<span>{{ item.requestDataName }}</span>
				</v-tooltip>
			</template>
			<template v-slot:[`item.approverName`]="{ item }">
				<v-tooltip bottom v-if="item.approverName">
					<template v-slot:activator="{ on, attrs }">
						<span v-bind="attrs" v-on="on" class="text-xs">
							<v-avatar color="red darken-2 mr-1" size="20">
								<span class="white--text">
									{{ getAvatarText(item.approverName) }}
								</span>
							</v-avatar>
							{{ item.approverName }}
						</span>
					</template>
					<span class="text-xs">
						{{ item.approverName }}
						<span class="text-xs d-block m-0">
							{{ item.createdOrgName }}
						</span>
					</span>
				</v-tooltip>
			</template>
			<template v-slot:[`item.createdName`]="{ item }">
				<v-tooltip bottom>
					<template v-slot:activator="{ on, attrs }">
						<span v-bind="attrs" v-on="on" class="text-xs">
							<v-avatar color="red darken-2 mr-1" size="20">
								<span
									class="white--text"
									v-if="item.createdName"
								>
									{{ getAvatarText(item.createdName) }}
								</span>
							</v-avatar>
							{{ item.createdName }}
						</span>
					</template>
					<span class="text-xs">
						{{ item.createdName }}
						<span class="text-xs d-block m-0">
							{{ item.createdOrgName }}
						</span>
					</span>
				</v-tooltip>
			</template>
			<template
				v-for="header in headers.filter((header) =>
					header.hasOwnProperty('formatter'),
				)"
				v-slot:[`item.${header.value}`]="{ headers, value }"
			>
				{{ header.formatter(value) }}
			</template>
			<template v-slot:[`item.isActive`]="{ item }">
				<v-simple-checkbox
					v-model="item.isActive"
					disabled
				></v-simple-checkbox>
			</template>
			<template v-slot:[`item.statusName`]="{ item }">
				<span :style="{ color: getColor(item) }" class="text-xs">
					<span class="iconify" data-icon="mdi:brightness-1"></span>
					{{ item.statusName }}</span
				>
			</template>
			<template v-slot:[`item.plotOfLandNumber`]="{ item }">
				<span class="text-xs" v-if="item.plotOfLandNumber">
					{{ item.plotOfLandNumber }}
				</span>
			</template>
			<template v-slot:no-data>
				<h3>{{ $t("message.no_data") }}</h3>
			</template>
			<template v-slot:[`item.createdDate`]="{ item }">
				<span class="text-xs">
					{{ item.createdDate | format_date }}
				</span>
			</template>
		</v-data-table>
	</v-card>
</template>

<script>
import globalService from "@/services/global.service";
import administratorAPI from "../../administrator/administrator.api";
import moment from "moment";
import BreadcrumbsVue from "@/components/Breadcrumbs.vue";
import DeleteDialogVue from "@/components/DeleteDialog.vue";
import ImportVue from "../RequestForm/InportV2.vue";
import NewRequestGroupV2Vue from "../RequestForm/NewRequestGroupV2.vue";
import constant from "@/common/constant";
import ApprovalAllRequestVue from "../modulepopup/ApprovalAllRequest.vue";
import ResultVue from "../modulepopup/Result.vue";

export default {
	components: {
		BreadcrumbsVue,
		DeleteDialogVue,
		ImportVue,
		NewRequestGroupV2Vue,
		ApprovalAllRequestVue,
		ResultVue,
	},
	data() {
		return {
			totalCountData: 10, // tổng dữ liệu của bảng (số lượng record)
			numberPerPage: 10, // dữ liệu của 1 trang khi khởi tạo(số lượng record)
			requestDataLoading: false, // cờ đánh dấu có đang loading dữ liệu data table hay không
			pageSize: 20, // số lượng dữ liệu lấy ra ở lần call đầu tiên\
			isLoadAllDone: false, // cờ đánh dấu đã load all xong chưa
			isShowFilter: false,
			user_info: this.getUserInfo(),
			listRequestData: [],
			selected: [],
			m_result: [],
			dateFormat: "DD/MM/yyyy",
			dialogDelete: false,
			showPicker: false,
			showExpiryPick: false,
			s_createdDate: null,
			createdName: "",
			ALL_STATUS: [],
			s_title: "",
			s_requestDataName: "",
			s_approverName: "",
			s_statusName: [],
			s_createdOrgName: "",
			s_landnumber: "",
			s_expire_date: null,
			isDeleting: false,
			requestTypes: [],
			dialog: {
				delete: false,
				creating: false,
				import: false,
				approval: false,
				results: false,
			},
			json_fields: [],
			json_data: [],
			json_meta: [
				[
					{
						key: "charset",
						value: "utf-8",
					},
				],
			],
			filterItems: [
				this.$t("label.show_all"),
				this.$t("label.used"),
				this.$t("label.unused"),
			],
			isActive: this.$t("label.show_all"),
			s_requestDataCode: "",
			headers: [
				{
					text: this.$t("label.requestDataCode"),
					value: "requestDataCode",
				},
				{
					text: this.$t("label.title"),
					value: "title",
				},
				{
					text: this.$t("label.land_number"),
					value: "plotOfLandNumber",
					filter: (value) => {
						if (!this.s_landnumber) return true;
						if (!value) return;
						return this.nonAccentVietnamese(value)
							.toLocaleUpperCase()
							.includes(
								this.nonAccentVietnamese(this.s_landnumber)
									.trim()
									.toLocaleUpperCase(),
							);
					},
				},
				{
					text: this.$t("label.type_group"),
					value: "requestDataName",

					filter: (value) => {
						if (!this.s_requestDataName) return true;
						if (!value) return;
						this.s_requestDataName = this.s_requestDataName.trim();
						return this.nonAccentVietnamese(value)
							.toLocaleUpperCase()
							.includes(
								this.nonAccentVietnamese(
									this.s_requestDataName,
								).toLocaleUpperCase(),
							);
					},
				},
				{
					text: this.$t("label.status"),
					value: "statusName",
					filter: (value) => {
						if (!this.s_statusName) return true;
						if (!value) return;
						return this.nonAccentVietnamese(value)
							.toLocaleUpperCase()
							.includes(
								this.nonAccentVietnamese(
									this.s_statusName,
								).toLocaleUpperCase(),
							);
					},
				},
				{
					text: this.$t("label.approve_name"),
					value: "approverName",

					filter: (value) => {
						if (!this.s_approverName) return true;

						return this.nonAccentVietnamese(value)
							.toLocaleUpperCase()
							.includes(
								this.nonAccentVietnamese(
									this.s_approverName,
								).toLocaleUpperCase(),
							);
					},
				},
				{
					text: this.$t("label.editor_name"),
					value: "createdName",

					filter: (value) => {
						if (!this.createdName) return true;

						return this.nonAccentVietnamese(value)
							.toLocaleUpperCase()
							.includes(
								this.nonAccentVietnamese(
									this.createdName,
								).toLocaleUpperCase(),
							);
					},
				},
				{
					text: this.$t("label.created_date"),
					value: "createdDate",
					filter: (value) => {
						if (!this.s_createdDate) return true;
						let values = `${this.s_createdDate}`.split(
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
					text: this.$t("label.expire_date"),
					value: "contractExpireTime",
					filter: (value) => {
						if (!this.s_expire_date) return true;
						let values = `${this.s_expire_date}`.split(
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
			],
			listDefaultRequest: [],
		};
	},
	watch: {
		"dialog.delete"(val) {
			val || this.closeDelete();
		},

		s_requestDataCode(val) {
			val = val.trim();
			if (!val) {
				this.listRequestData = Object.assign(
					[],
					this.listDefaultRequest,
				);
			} else {
				this.listRequestData = this.listDefaultRequest.filter(
					(entry) => {
						return (
							this.nonAccentVietnamese(entry.requestDataCode)
								.toLocaleUpperCase()
								.includes(
									this.nonAccentVietnamese(
										val,
									).toLocaleUpperCase(),
								) ||
							this.nonAccentVietnamese(entry.title)
								.toLocaleUpperCase()
								.includes(
									this.nonAccentVietnamese(
										val,
									).toLocaleUpperCase(),
								)
						);
					},
				);
				this.json_data = this.listRequestData;
			}
		},
		selected(val) {
			if (!val.length) {
				this.json_data = this.listRequestData;
			} else {
				this.json_data = val;
			}
		},
		"dialog.import"(val) {
			if (!val) {
				//this.getAllRequestDrafting();
				this.getRequestData();
			}
		},
	},
	computed: {
		formatDateFns() {
			if (!this.s_createdDate) {
				return "";
			}
			let values = `${this.s_createdDate}`.split(
				constant.values.DATE_RANGE_SEPARATOR,
			);
			let result = [];
			result = values.map((x) => {
				return moment(x).format("DD/MM/yyyy");
			});
			return result.join("~");
		},
		formatDateExpiry() {
			if (!this.s_expire_date) {
				return "";
			}
			let values = `${this.s_expire_date}`.split(
				constant.values.DATE_RANGE_SEPARATOR,
			);
			let result = [];
			result = values.map((x) => {
				return moment(x).format("DD/MM/yyyy");
			});
			return result.join("~");
		},
	},
	async created() {
		await this.getAllStatus();
	},
	mounted() {
		//this.getAllRequestDrafting();
		this.getRequestData();
	},
	methods: {
		getRequestData() {
			this.requestDataLoading = true;
			this.getAllRequestDraftingPagingNonAsync();
			this.getAllRequestDraftingNonAsync();
			this.getTotalCountData();
		},
		getTotalCountData() {
			globalService
				.getData_NoAsync(
					administratorAPI.API_CountRequestDataDrafting(
						this.user_info.id,
					),
				)
				.then((response) => {
					if (
						!response ||
						response.status != 200 ||
						!response.data ||
						!response.data.state
					) {
						return;
					}
					this.totalCountData = response.data.data;
				});
		},
		getAllRequestDraftingNonAsync() {
			this.isLoadAllDone = false;
			this.requestTypes = [];
			globalService
				.getData_NoAsync(
					administratorAPI.API_GetRequestDrafting(this.user_info.id),
				)
				.then((response) => {
					if (
						!response ||
						response.status != 200 ||
						!response.data ||
						!response.data.state
					) {
						this.requestDataLoading = false;
						this.isLoadAllDone = true;
						return;
					}
					if (response.data.data.length > 0) {
						this.listRequestData = response.data.data.filter(
							(entry) => {
								entry.showAll = false;
								if (
									entry.requestType &&
									this.requestTypes.indexOf(
										entry.requestType?.requestTypeName,
									) == -1
								) {
									this.requestTypes.push(
										entry.requestType?.requestTypeName,
									);
								}
								return !entry.isDelete;
							},
						);
						this.listDefaultRequest = this.sortList(
							this.listRequestData,
						);
						this.json_fields = this.getJsonFields(this.headers);
						this.json_data = Object.assign(
							[],
							this.listRequestData,
						);
					}
					this.requestDataLoading = false;
					this.isLoadAllDone = true;
				});
		},
		getAllRequestDraftingPagingNonAsync() {
			this.requestTypes = [];
			globalService
				.getData_NoAsync(
					administratorAPI.API_GetRequestDraftingPaging(
						this.user_info.id,
						this.pageSize,
					),
				)
				.then((response) => {
					if (
						!response ||
						response.status != 200 ||
						!response.data ||
						!response.data.state
					) {
						return;
					}
					if (
						response.data.data.length > 0 &&
						this.isLoadAllDone == false
					) {
						this.listRequestData = response.data.data.filter(
							(entry) => {
								entry.showAll = false;
								if (
									entry.requestType &&
									this.requestTypes.indexOf(
										entry.requestType?.requestTypeName,
									) == -1
								) {
									this.requestTypes.push(
										entry.requestType?.requestTypeName,
									);
								}
								return !entry.isDelete;
							},
						);
						this.listDefaultRequest = this.sortList(
							this.listRequestData,
						);
						this.json_fields = this.getJsonFields(this.headers);
						this.json_data = Object.assign(
							[],
							this.listRequestData,
						);
					}
				});
		},
		async getReult(val) {
			this.m_result = [];
			this.m_result = val;
			//await this.getAllRequestDrafting();
			this.getRequestData();

			this.selected = [];
			this.openDialogResult();
		},
		openDialogResult() {
			this.dialog.results = true;
		},
		onSaveRequest() {
			//this.getAllRequestDrafting();
			this.getRequestData();
		},
		getColor(item) {
			if (!item.status?.id) return "#000000";
			let status = this.ALL_STATUS.find(
				(ele) => ele.id == item.status.id,
			);
			if (!status?.statusColor) return "#000000";
			return "#" + status.statusColor;
		},
		async getAllRequestDrafting() {
			this.requestTypes = [];
			let response = await globalService.getData_Async(
				administratorAPI.API_GetRequestDrafting(this.user_info.id),
			);
			if (!response || !response.state) {
				return this.toastError(this.$t("error.load"));
			}
			this.listRequestData = response.data.filter((entry) => {
				entry.showAll = false;
				if (
					entry.requestType &&
					this.requestTypes.indexOf(
						entry.requestType?.requestTypeName,
					) == -1
				) {
					this.requestTypes.push(entry.requestType?.requestTypeName);
				}
				return !entry.isDelete;
			});
			this.listDefaultRequest = this.sortList(this.listRequestData);
			this.json_fields = this.getJsonFields(this.headers);
			this.json_data = Object.assign([], this.listRequestData);
		},
		async getAllStatus() {
			let response = await globalService.getData_Async(
				administratorAPI.API_GetAllStatus(),
			);
			if (!response || !response.state) {
				return this.toastError(this.$t("error.load"));
			}
			this.ALL_STATUS = response.data.filter((entry) => {
				{
					return !entry.isDelete && entry.isActive;
				}
			});
		},
		deleteAll() {
			if (this.selected.length > 0) {
				this.dialog.delete = true;
			} else {
				this.toastError(this.$t("label.no_selected"));
			}
		},
		onConfirmDelete(value) {
			if (!value) {
				this.closeDelete();
			} else {
				if (this.selected) {
					this.deleteAllConfirm();
				}
			}
		},
		deleteItem(item) {
			this.selected = [item];
			this.dialog.delete = true;
		},
		closeDelete() {
			this.dialog.delete = false;
		},
		async deleteAllConfirm() {
			if (this.isDeleting) {
				return;
			}
			this.isDeleting = true;
			let response = await globalService.postData_Async(
				administratorAPI.API_DeleteAllRequestData(),
				this.selected,
			);
			if (!response.state) {
				this.toastError(response.message);
				return (this.isDeleting = false);
			}
			if (response.state) {
				this.isDeleting = true;
				this.toastSuccess(this.$t("message.delete_success"));
			}


			
				// load on frontend
			this.listRequestData = this.listRequestData.filter(ele => this.selected.every(ele1 => ele?.id != ele1.id));

			this.selected = [];
			this.isDeleting = false;
			//this.getAllRequestDrafting();
			this.isLoadAllDone = false;

				// load page real;
			this.requestDataLoading = true;
			this.getAllRequestDraftingNonAsync();
			this.getAllRequestDraftingPagingNonAsync();
			this.getTotalCountData();
			await this.closeDelete();
		},

		sortList(arr) {
			return arr.sort((a, b) => {
				return (
					moment(b.modifiedDate).toDate().getTime() -
					moment(a.modifiedDate).toDate().getTime()
				);
			});
		},
		getFilenameExcel() {
			let str = "Phieu_dang_soan_" + new Date().getTime();
			return str;
		},
		openDialogCreate() {
			this.dialog.creating = true;
		},
		openDialogImport() {
			this.dialog.import = true;
		},
		onClose() {
			this.dialog.creating = false;
			this.dialog.import = false;
			this.dialog.approval = false;
			this.dialog.results = false;
		},
		openDialogAproval() {
			if (this.selected && this.selected.length == 0) {
				return this.toastError(this.$t("label.no_selected"));
			} else {
				this.dialog.approval = true;
			}
		},
	},
	filters: {
		format_date: function (value) {
			if (!value) return null;
			return moment(value).format("DD/MM/yyyy");
		},
	},
};
</script>

<style lang="scss" scoped></style>
