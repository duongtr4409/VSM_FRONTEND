<template>
	<v-card flat elevation="0">
		<Breadcrumbs />
		<v-dialog v-model="dialog.creating" width="60vw" persistent>
			<NewRequestGroupV2Vue @close="onClose" class="h-4/6" />
		</v-dialog>
		<v-card-title>
			<v-row class="p-0 w-full">
				<!-- <router-link
					:to="{
						path: '/phieu-yeu-cau/tao-moi',
					}"
					style="text-decoration: none; margin-right: 1rem"
					color="blue darken-1"
					dark
					text
				>
					<v-btn class="mb-4 mr-2 rounded" text>
						<v-icon> mdi-plus </v-icon>
						{{ $t("button.create") }}
						<v-icon>mdi-menu-down</v-icon>
					</v-btn>
				</router-link> -->
				<!-- <v-btn class="mb-4 mr-2 rounded" text @click="openDialogCreate">
					<v-icon color="blue"> mdi-plus </v-icon>
					<span class="text-xs">
						{{ $t("button.create") }}
					</span>
					<v-icon>mdi-menu-down</v-icon>
				</v-btn>
				<v-btn class="mb-4 mr-2 rounded" text @click="deleteAll">
					<v-icon color="red"> mdi-delete-outline </v-icon>
					<span class="text-xs">
						{{ $t("button.delete_all") }}
					</span>
				</v-btn> -->
				<v-spacer></v-spacer>
				<vue-excel-xlsx
					:data="json_data"
					:file-name="getFilenameExcel()"
					:columns="json_fields"
					:file-type="'xlsx'"
					:sheet-name="headExcl"
				>
					<v-btn text tile color="green darken-1">
						<v-icon color="green darken-1">
							mdi-microsoft-excel
						</v-icon>
						{{ $t("label.export") }}
					</v-btn>
				</vue-excel-xlsx>
				<v-btn class="mt-1" icon @click="filterExist = !filterExist">
					<v-icon color="green">mdi-filter-outline </v-icon>
				</v-btn>
				<!-- <v-spacer></v-spacer>
					<v-text-field
						v-model="search"
						append-icon="mdi-magnify"
						:label="$t('title.search')"
						outlined
						dense
						single-line
						class="my-1 left-[-1rem] rounded-sm mx-4"
					></v-text-field> -->
			</v-row>
		</v-card-title>
		<v-dialog v-model="dialog.delete" max-width="fit-content" persistent>
			<DeleteDialogVue
				@close="closeDelete"
				@confirmDelete="onConfirmDelete"
			/>
		</v-dialog>
		<v-data-table
			v-model="selected"
			:headers="headers"
			:items="listRequestData"
			item-key="id"
			show-select
			fixed-header
			height="400"
			:search="search"
			:custom-filter="customFilter"
			:no-results-text="$t('message.no_results')"
			:no-data-text="$t('message.no_results')"
			:loading="requestDataLoading"
			:loading-text="$t('message.loading_text')"
		>
			<template v-slot:[`item.requestDataCode`]="{ item }">
				<v-tooltip bottom>
					<template v-slot:activator="{ on, attrs }">
						<router-link
							:to="{
								path: `/phieu-yeu-cau/chi-tiet/${item.id}`,
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
								path: `/phieu-yeu-cau/chi-tiet/${item.id}`,
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
			<template v-slot:[`item.plotOfLandNumber`]="{ item }">
				<span class="text-xs" v-if="item.plotOfLandNumber">
					{{ item.plotOfLandNumber }}
				</span>
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
							class="float-right"
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
							<v-icon color=" darken-2" class="pr-3">
								mdi-eye-circle-outline
							</v-icon>

							<v-list-item-title>
								{{ $t("button.view") }}
							</v-list-item-title>
						</v-list-item>

						<v-list-item
							:to="{
								path: `/phieu-yeu-cau/${item.id}/chi-tiet`,
							}"
						>
							<v-icon color=" darken-2" class="pr-3">
								mdi-pencil-circle-outline
							</v-icon>

							<v-list-item-title>
								{{ $t("button.edit") }}
							</v-list-item-title>
						</v-list-item>
						<v-list-item @click="deleteItem(item)">
							<v-icon color=" darken-2" class="pr-3">
								mdi-delete-circle-outline
							</v-icon>

							<v-list-item-title>
								{{ $t("button.delete") }}
							</v-list-item-title>
						</v-list-item>
					</v-list>
				</v-menu>
			</template> -->
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
			<template v-slot:[`item.createdOrgName`]="{ item }">
				<span hidden>
					{{ item.createdOrgName }}
				</span>
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

			<template v-slot:top>
				<v-row
					v-if="filterExist"
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
									v-model.trim="s_approverName"
									type="string"
									dense
									hide-details
									class="my-1 left-[-1rem] rounded-sm"
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
			<!-- <template v-slot:[`item.actions`]="{ item }">
				<v-btn
					icon
					class="mr-2"
					color="blue darken-1"
					:to="{ path: `/phieu-yeu-cau/${item.id}/chi-tiet` }"
				>
					<v-icon> mdi-pencil-circle </v-icon>
				</v-btn>
				<v-btn icon color="red" @click="deleteItem(item)">
					<v-icon> mdi-close-circle </v-icon>
				</v-btn>
			</template> -->
			<!-- <template
				v-for="header in headers.filter((header) =>
					header.hasOwnProperty('formatter'),
				)"
				v-slot:[`item.${header.value}`]="{ headers, value }"
			>
				{{ header.formatter(value) }}
			</template> -->
			<!-- <template v-slot:[`item.isActive`]="{ item }">
				<v-simple-checkbox
					v-model="item.isActive"
					disabled
				></v-simple-checkbox>
			</template> -->
			<template v-slot:no-data>
				<h3>{{ $t("message.no_data") }}</h3>
			</template>
			<template v-slot:[`item.createdDate`]="{ item }">
				<span class="text-xs">
					{{ item.createdDate | format_date }}
				</span>
			</template>
			<template v-slot:[`item.contractExpireTime`]="{ item }">
				<span class="text-xs">
					{{ item.contractExpireTime | format_date }}
				</span>
			</template>
		</v-data-table>
		<v-dialog v-model="dialog.deny" max-width="60vw" persistent>
			<v-card>
				<v-toolbar>
					<v-toolbar-title> {{ $t("label.deny") }} </v-toolbar-title>
					<v-spacer></v-spacer>
					<v-btn icon @click="closeDialog">
						<v-icon>mdi-close</v-icon>
					</v-btn>
				</v-toolbar>
				<v-card-text class="mt-5">
					<v-textarea
						:label="$t('label.comment_note')"
						outlined
						dense
						single-line
					>
					</v-textarea>
					<v-file-input
						:label="$t('button.upload')"
						outlined
						dense
						single-line
					></v-file-input>
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="red" dark @click="closeDialog">
						<v-icon>mdi-close</v-icon>
						{{ $t("button.close") }}
					</v-btn>
					<v-btn color="blue" dark>
						<v-icon>mdi-backup-restore</v-icon>
						{{ $t("label.deny") }}
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
		<v-dialog v-model="dialog.requestmodify" max-width="60vw" persistent>
			<v-card>
				<v-toolbar>
					<v-toolbar-title>
						{{ $t("button.modify_request") }}
					</v-toolbar-title>
					<v-spacer></v-spacer>
					<v-btn icon @click="closeDialog">
						<v-icon>mdi-close</v-icon>
					</v-btn>
				</v-toolbar>
				<v-card-text class="mt-5">
					<v-textarea
						label="Ý kiến/Ghi chú"
						outlined
						dense
						single-line
					>
					</v-textarea>
					<v-file-input
						:label="$t('button.upload')"
						outlined
						dense
						single-line
					></v-file-input>
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="red" dark @click="closeDialog">
						<v-icon>mdi-close</v-icon>
						{{$t("button.close")}}
					</v-btn>
					<v-btn color="blue" dark>
						<v-icon>mdi-swap-horizontal</v-icon>
						{{$t("button.modify_request")}}
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
		<v-dialog v-model="dialog.approve" max-width="60vw" persistent>
			<v-card>
				<v-toolbar>
					<v-toolbar-title> {{$t("label.approve")}} </v-toolbar-title>
					<v-spacer></v-spacer>
					<v-btn icon @click="closeDialog">
						<v-icon>mdi-close</v-icon>
					</v-btn>
				</v-toolbar>
				<v-card-text class="mt-5">
					<v-textarea
						:label="$t('label.comment_note')"
						outlined
						dense
						single-line
					>
					</v-textarea>
					<v-file-input
						:label="$t('button.upload')"
						outlined
						dense
						single-line
					></v-file-input>
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="red" dark @click="closeDialog">
						<v-icon>mdi-close</v-icon>
						{{$t("button.close")}}
					</v-btn>
					<v-btn color="blue" dark>
						<v-icon>mdi-check</v-icon>
						{{$t("label.approve")}}
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</v-card>
</template>

<script>
import globalService from "@/services/global.service";
import moment from "moment";
import administratorAPI from "../../administrator/administrator.api";
import Breadcrumbs from "@/components/Breadcrumbs.vue";
import DeleteDialogVue from "@/components/DeleteDialog.vue";
import NewRequestGroupV2Vue from "./NewRequestGroupV2.vue";
import constant from "@/common/constant";

export default {
	components: { Breadcrumbs, DeleteDialogVue, NewRequestGroupV2Vue },
	name: "VsmFeListrequestform",

	data() {
		return {
			totalCountData: 10,			// tổng dữ liệu của bảng (số lượng record)
			numberPerPage: 10,			// dữ liệu của 1 trang khi khởi tạo(số lượng record)
			requestDataLoading: false,	// cờ đánh dấu có đang loading dữ liệu data table hay không
			pageSize : 20,				// số lượng dữ liệu lấy ra ở lần call đầu tiên\
			isLoadAllDone: false,		// cờ đánh dấu đã load all xong chưa
			user_info: this.getUserInfo(),
			listRequestData: [],
			showPicker: false,
			dialogDeleteAll: false,
			selected: [],
			s_title: "",
			s_approverName: "",
			s_statusName: "",
			s_createdOrgName: "",
			s_requestDataCode: "",
			s_landnumber: "",
			ALL_STATUS: [],
			headers: [
				{
					text: this.$t("label.requestDataCode"),
					value: "requestDataCode",

					filter: (value) => {
						if (!this.requestDataCode) return true;
						if (!value) return;
						return this.nonAccentVietnamese(value)
							.toLocaleUpperCase()
							.includes(
								this.nonAccentVietnamese(
									this.requestDataCode,
								).toLocaleUpperCase(),
							);
					},
				},
				{
					text: this.$t("label.title"),
					value: "title",

					filter: (value) => {
						if (!this.s_title) return true;
						if (!value) return;
						this.s_title = this.s_title.trim();
						return this.nonAccentVietnamese(value)
							.toLocaleUpperCase()
							.includes(
								this.nonAccentVietnamese(
									this.s_title,
								).toLocaleUpperCase(),
							);
					},
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
					value: "status.statusName",

					filter: (value) => {
						// if (this.isActive == this.$t("label.used")) {
						// 	return value == true;
						// }
						// if (this.isActive == this.$t("label.unused")) {
						// 	return value == false;
						// }
						// return true;
						if (!this.s_statusName) return true;
						if (!value) return;
						return this.nonAccentVietnamese(value)
							.toLocaleUpperCase() == this.nonAccentVietnamese(this.s_statusName).toLocaleUpperCase()
						// return this.nonAccentVietnamese(value)
						// 	.toLocaleUpperCase()
						// 	.includes(
						// 		this.nonAccentVietnamese(
						// 			this.s_statusName,
						// 		).toLocaleUpperCase(),
						// 	);
					},
				},
				{
					text: this.$t("label.approverName"),
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
				// {
				// 	text: this.$t("label.manipulation"),

				// 	value: "actions",
				// 	sortable: false,
				// },
			],
			items: [],
			search: "",
			singleSelect: false,
			requestDataCode: "",
			requestDataName: "",
			isDeleting: false,
			createdName: "",
			s_createdDate: null,
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
			dateFormat: "DD/MM/yyyy",
			isActive: this.$t("label.show_all"),
			userId: null,
			dialog: {
				delete: false,
				deny: false,
				approve: false,
				requestmodify: false,
				creating: false,
			},
			s_requestDataName: "",
			requestFilter: [],
			requestAll: [],
			s_expire_date: null,
			showExpiryPick: false,
			requestOverdue: [],
			requestAboutExpỉe: [],
			allSelect: true,
			filterInprocess: false,
			filterOverdue: false,
			filterAboutExpire: false,
			headExcl: "",
			requestInprocess: false,
			requestOver: false,
			requestAbout: false,
			listDefaultRequest: [],
			requestTypes: [],
		};
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
	watch: {
		dialog(val) {
			val || this.close();
		},
		"dialog.delete"(val) {
			val || this.closeDelete();
		},
		dialogView(val) {
			val || this.closeView();
		},
		dialogDeleteAll(val) {
			val || this.closeDeleteAll();
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
	mounted() {
		// this.getRequestForm();
		this.getRequestData();
	},
	async created() {
		await this.getAllStatus();
	},

	methods: {
		getRequestData(){
			this.requestDataLoading = true;
			this.getRequestFormPagingNonAsync();
			this.getRequestFormNonAsync();
			this.getTotalCountData();
		},
		getTotalCountData(){
			globalService.getData_NoAsync(
				administratorAPI.API_CountRequestDataDrafting(this.user_info.id)
			).then((response) => {
				if(!response ||
					response.status != 200 ||
					!response.data ||
					!response.data.state){
						return;
					}
				this.totalCountData = response.data.data;
			});
		},
		getRequestFormNonAsync(){
			this.requestTypes = [];
			this.requestInprocess = false;
			this.requestOver = false;
			this.requestAbout = false;
			globalService.getData_NoAsync(
				administratorAPI.API_GetAllRequestDataV2(this.user_info.id)
			).then((response) => {
				if(!response ||
					response.status != 200 ||
					!response.data ||
					!response.data.state){
						this.requestDataLoading = false;
						this.isLoadAllDone = true;
						return;
					}
				if(response.data.data.length > 0){
					this.requestAll = response.data.data.filter((entry) => {
						if (entry.requestTypeName) {
							this.requestTypes.push(
								entry.requestType?.requestTypeName,
							);
						}
						return !entry.isDelete;
					});
					this.listRequestData = Object.assign([], this.requestAll);
					this.listDefaultRequest = this.sortList(this.listRequestData);
					this.headExcl = this.$t("label.list_of_tickets");
					this.json_fields = this.getJsonFields(this.headers);
					this.json_data = Object.assign([], this.listRequestData);
				}	
				this.requestDataLoading = false;
				this.isLoadAllDone = true;
			});

		},
		getRequestFormPagingNonAsync(){
			this.requestTypes = [];
			this.requestInprocess = false;
			this.requestOver = false;
			this.requestAbout = false;
			globalService.getData_NoAsync(
				administratorAPI.API_GetRequestOfUserPaging(this.user_info.id, this.pageSize)
			).then((response) => {
				if(!response ||
					response.status != 200 ||
					!response.data ||
					!response.data.state){
						return;
					}
				if(response.data.data.length > 0 && this.isLoadAllDone == false){
					this.requestAll = response.data.data.filter((entry) => {
						if (entry.requestTypeName) {
							this.requestTypes.push(
								entry.requestType?.requestTypeName,
							);
						}
						return !entry.isDelete;
					});
					this.listRequestData = Object.assign([], this.requestAll);
					this.listDefaultRequest = this.sortList(this.listRequestData);
					this.headExcl = this.$t("label.list_of_tickets");
					this.json_fields = this.getJsonFields(this.headers);
					this.json_data = Object.assign([], this.listRequestData);
				}
			});

		},

		async getRequestForm() {
			this.requestTypes = [];
			this.requestInprocess = false;
			this.requestOver = false;
			this.requestAbout = false;
			let response;
			try {
				response = await globalService.getData_Async(
					administratorAPI.API_GetAllRequestDataV2(this.user_info.id),
				);

				// response = await globalService.getData_Async(
				// 	administratorAPI.API_GetAllByUserIdRequestData(
				// 		this.user_info.id,
				// 	),
				// );

				if (!response || !response.state) {
					this.toastError(this.$t("error.load"));
				}

				this.requestAll = response.data.filter((entry) => {
					if (entry.requestTypeName) {
						this.requestTypes.push(
							entry.requestType?.requestTypeName,
						);
					}
					return !entry.isDelete;
				});
				this.listRequestData = Object.assign([], this.requestAll);
				this.listDefaultRequest = this.sortList(this.listRequestData);
				this.headExcl = this.$t("label.list_of_tickets");
				this.json_fields = this.getJsonFields(this.headers);
				this.json_data = Object.assign([], this.listRequestData);
			} catch (error) {
				this.toastError(error);
				return;
			}
		},
		closeDelete() {
			this.dialog.delete = false;
		},

		closeDeleteAll() {
			this.dialogDeleteAll = false;
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
		sortList(arr) {
			return arr.sort((a, b) => {
				return (
					moment(b.modifiedDate).toDate().getTime() -
					moment(a.modifiedDate).toDate().getTime()
				);
			});
		},
		customFilter(value, search, item) {
			return !!search && this.match(item, search);
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
			}
			if (response.state) {
				this.isDeleting = true;
				this.toastSuccess(this.$t("message.delete_success"));
			}

			this.selected = [];
			this.isDeleting = false;
			// this.getRequestForm();
			this.getRequestData();

			this.closeDelete();
		},
		openDenyDialog() {
			this.dialog.deny = true;
		},
		openApproveDialog() {
			this.dialog.approve = true;
		},
		openRequestModifyDialog() {
			this.dialog.requestmodify = true;
		},
		closeDialog() {
			this.dialog.deny = false;
			this.dialog.approve = false;
			this.dialog.requestmodify = false;
		},

		getClassAllSelect() {
			if (this.allSelect) {
				return "blue darken-1";
			}
			return "";
		},
		getClassFilterInprocess() {
			if (this.filterInprocess) {
				return "blue darken-1";
			}
			return "";
		},
		getClassFilterAboutExpire() {
			if (this.filterAboutExpire) {
				return "blue darken-1";
			}
			return "";
		},
		getClassFilterOverdue() {
			if (this.filterOverdue) {
				return "blue darken-1";
			}
			return "";
		},
		getFilenameExcel() {
			let str = "Phieu_yeu_cau_" + new Date().getTime();
			return str;
		},
		getColor(item) {
			if (!item.status?.id) return "#000000";
			let status = this.ALL_STATUS.find(
				(ele) => ele.id == item.status.id,
			);
			if (!status?.statusColor) return "#000000";
			return "#" + status.statusColor;
		},
		getColorV2(item) {
			if (!item.status) return "#9E9E9E";
			let status = this.ALL_STATUS.find(
				(ele) =>
					ele.statusName.toLocaleUpperCase().trim() ==
					item.status.toLocaleUpperCase().trim(),
			);
			if (!status?.statusColor) return "#9E9E9E";
			return "#" + status.statusColor;
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
		openDialogCreate() {
			this.dialog.creating = true;
		},
		onClose() {
			this.dialog.creating = false;
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
