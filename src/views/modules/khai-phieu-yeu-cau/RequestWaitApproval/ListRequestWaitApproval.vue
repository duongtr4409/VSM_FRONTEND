<template>
	<v-card flat elevation="0">
		<BreadcrumbsVue />
		<v-dialog v-model="dialog.delete" max-width="fit-content" persistent>
			<DeleteDialogVue
				@close="closeDelete"
				@confirmDelete="onConfirmDelete"
			/>
		</v-dialog>
		<v-row>
			<v-col
				cols="12"
				md="12"
				class="d-flex w-full"
				style="justify-content: space-between"
			>
				<div class="d-flex">
					<div class="d-flex">
						<!-- <v-btn
							:to="{
								path: '/phieu-yeu-cau/tao-moi',
							}"
							text
							class="mb-4 mr-2 rounded"
						>
							<v-icon> mdi-plus </v-icon>
							{{ $t("button.create") }}
						</v-btn>
						<v-btn text class="mb-4 mr-2 rounded">
							<v-icon> mdi-arrow-up </v-icon>
							{{ $t("button.import") }}
						</v-btn>
						<v-btn
							text
							class="mb-4 mr-2 rounded"
							@click="deleteAll"
						>
							<v-icon> mdi-trash-can-outline </v-icon>
							{{ $t("button.delete_all") }}
						</v-btn> -->
					</div>
				</div>
				<div class="d-flex items-center">
					<v-list-item>
						<vue-excel-xlsx
							:data="json_data"
							:file-name="getFilenameExcel()"
							:columns="json_fields"
							:file-type="'xlsx'"
							:sheet-name="'Phiếu chờ phê duyệt'"
						>
							<!-- <v-btn text tile color="orange">
								<v-icon color="orange">
									mdi-swap-vertical
								</v-icon>
								Xuất excel
							</v-btn> -->
							<v-btn text tile color="green darken-1">
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
					class="d-flex justify-end pos-sticky grey lighten-2 mb-1"
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
									class="my-1 left-[-1rem] rounded-sm"
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
									hide-details
									:item-value="(item) => item.requestTypeName"
									clearable
									class="my-1 w-[10rem] rounded-sm"
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
									v-model="s_approverName"
									hide-details
									dense
									class="my-1 left-[-1rem] rounded-sm"
									maxLength="255"
									:placeholder="$t('label.approve_name')"
								></v-text-field>
							</v-col>
							<v-col cols="2">
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
											:placeholder="
												$t('label.created_date')
											"
											readonly
											v-bind="attrs"
											v-on="on"
											@click:clear="s_createdDate = null"
											append-icon="mdi-calendar"
											hide-details
											dense
											class="my-1 left-[-1rem] rounded-sm"
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
											class="my-1 left-[-1rem] rounded-sm"
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
			<template v-slot:[`item.plotOfLandNumber`]="{ item }">
				<span class="text-xs" v-if="item.plotOfLandNumber">
					{{ item.plotOfLandNumber }}
				</span>
			</template>
			<template v-slot:[`item.contractExpireTime`]="{ item }">
				<span class="text-xs">
					{{ item.contractExpireTime | format_date }}
				</span>
			</template>
			<template v-slot:[`item.createdOrgName`]="{ item }">
				<span hidden>
					{{ item.createdOrgName }}
				</span>
			</template>
			<template v-slot:[`item.requestDataCode`]="{ item }">
				<v-tooltip bottom>
					<template v-slot:activator="{ on, attrs }">
						<router-link
							:to="{
								path: `/phieu-yeu-cau/chi-tiet-phieu-cho-phe-duyet/${item.id}`,
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
								path: `/phieu-yeu-cau/chi-tiet-phieu-cho-phe-duyet/${item.id}`,
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

			<!-- <template v-slot:[`item.actions`]="{ item }">
				<v-menu bottom left>
					<template v-slot:activator="{ on, attrs }">
						<v-btn
							icon
							v-bind="attrs"
							v-on="on"
							class="float-right ml-[-2rem]"
						>
							<v-icon>mdi-dots-vertical</v-icon>
						</v-btn>
					</template>
					<v-list class="w-[120px]">
						<v-list-item
							:to="{
								path: `/phieu-yeu-cau/chi-tiet/${item.id}`,
							}"
						>
							<v-icon color="darken-2" class="pr-3">
								mdi-eye-circle-outline
							</v-icon>
							<v-list-item-title>
								{{ $t("button.view") }}
							</v-list-item-title>
						</v-list-item>

						
					</v-list>
				</v-menu>
			</template> -->
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
			<template v-slot:[`item.status.statusName`]="{ item }">
				<!-- <div
					class="pa-1 rounded-circle d-inline-block ml-2"
					:style="{ background: getColor(item) }"
				></div> -->
				<span :style="{ color: getColor(item) }" class="text-xs">
					<span class="iconify" data-icon="mdi:brightness-1"></span>
					{{ item.status.statusName }}</span
				>
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
import constant from "@/common/constant";

export default {
	components: { BreadcrumbsVue, DeleteDialogVue },
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
			dateFormat: "DD/MM/yyyy",
			dialogDelete: false,
			showPicker: false,
			s_createdDate: null,
			createdName: "",
			ALL_STATUS: [],
			s_title: "",
			s_requestDataName: "",
			s_approverName: "",
			s_statusName: "",
			s_createdOrgName: "",
			isDeleting: false,
			dialog: { delete: false },
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
			s_landnumber: "",
			s_expire_date: null,
			showExpiryPick: false,
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
					text: this.$t('label.type_group'),
					value: "requestDataName",

					filter: (value) => {
						if (!this.s_requestDataName) return true;
						if (!value) return;
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
					text: this.$t('label.status'),
					value: "status.statusName",

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
					text: this.$t('label.approve_name'),
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
					text: "",
					value: "createdOrgName",
					sortable: false,
					filter: (value) => {
						if (!this.s_createdOrgName) return true;

						return this.nonAccentVietnamese(value)
							.toLocaleUpperCase()
							.includes(
								this.nonAccentVietnamese(
									this.s_createdOrgName,
								).toLocaleUpperCase(),
							);
					},
				},
				{
					text: this.$t('label.editor_name'),
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
			requestTypes: [],
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
		//this.getAllRequestWaitApproval();
		this.getRequestData();
	},
	methods: {
		getRequestData() {
			this.requestDataLoading = true;
			this.getAllRequestWaitApprovalPagingNonAsync();
			this.getAllRequestWaitApprovalNonAsync();
			this.getTotalCountData();
		},
		getTotalCountData() {
			globalService
				.getData_NoAsync(
					administratorAPI.API_CountRequestDataWaitApproval(
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
		getAllRequestWaitApprovalNonAsync() {
			this.isLoadAllDone = false;
			this.requestTypes = [];
			globalService
				.getData_NoAsync(
					administratorAPI.API_GetRequestWaitApproval(
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
		getAllRequestWaitApprovalPagingNonAsync() {
			this.requestTypes = [];
			globalService
				.getData_NoAsync(
					administratorAPI.API_GetRequestWaitApprovalPaging(
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
		getColor(item) {
			if (!item.status) return "#9E9E9E";
			let status = this.ALL_STATUS.find(
				(ele) =>
					ele.statusName.toLocaleUpperCase().trim() ==
					item.status.statusName.toLocaleUpperCase().trim(),
			);
			if (!status?.statusColor) return "#9E9E9E";
			return "#" + status.statusColor;
		},
		async getAllRequestWaitApproval() {
			this.requestTypes = [];
			let response = await globalService.getData_Async(
				administratorAPI.API_GetRequestWaitApproval(this.user_info.id),
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
			this.sortList(this.ALL_STATUS);
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
			this.selected = this.selected.map((entry) => {
				entry.isDelete = true;
				return entry;
			});
			let response = await globalService.postData_Async(
				administratorAPI.API_DeleteAllRequestData(),
				this.selected,
			);
			if (!response.state) {
				this.toastError(response.message);
				this.isDeleting = false;
				return;
			}
			if (response.state) {
				this.isDeleting = true;
				this.toastSuccess(this.$t("message.delete_success"));
			}

			this.selected = [];
			this.isDeleting = false;
			//this.getAllRequestWaitApproval();
			
			let oldPageSize = this.pageSize;
			this.pageSize = 10;
			await this.getRequestData();
			this.pageSize = oldPageSize;

			this.closeDelete();
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
			let str = "Phieu_cho_phe_duyet_" + new Date().getTime();
			return str;
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

<style lang="scss" scoped>
.text-color {
	color: var(--status-color);
}
</style>
