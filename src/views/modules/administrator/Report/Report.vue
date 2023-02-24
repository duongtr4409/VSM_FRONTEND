<template>
	<v-card flat elevation="0">
		<v-row>
			<v-col cols="12" md="12" class="d-flex w-full justify-end">
				<div class="d-flex">
					<v-list-item>
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
						<v-btn icon @click="onclickFilter">
							<v-icon color="green darken-1"
								>mdi-filter-outline
							</v-icon>
						</v-btn>
					</v-list-item>
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
			height="420"
			:custom-filter="filterCustom"
			:no-data-text="$t('message.no_results')"
			:no-results-text="$t('message.no_results')"
		>
			<template v-slot:top>
				<v-row>
					<v-col cols="3">
						<v-autocomplete
							maxLength="255"
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
							<!-- <template
								v-slot:selection="{
									attrs,
									item,
									parent,
									selected,
								}"
							>
								<v-chip
									v-if="item === Object(item)"
									v-bind="attrs"
									:input-value="selected"
									label
									class="mt-2 rounded-pill"
								>
									<v-avatar color="red mr-2" size="26">
										<span class="white--text">
											{{
												getAvatarText(
													item.organizationName,
													2,
												)
											}}
										</span>
									</v-avatar>
									<span class="pr-2">
										{{ item.organizationName }}
									</span>
									<v-icon
										small
										@click="parent.selectItem(item)"
									>
									</v-icon>
								</v-chip>
							</template> -->
						</v-autocomplete>
					</v-col>
					<v-col cols="3">
						<v-autocomplete
							maxLength="255"
							:label="$t('report.request_type')"
							outlined
							dense
							v-model="requestsGroup"
							:items="list_requests_group"
							item-text="requestName"
							clearable
							:item-value="(val) => val"
						>
							<!-- <template
									v-slot:selection="{
										attrs,
										item,
										parent,
										selected,
									}"
									v-if="requestsGroup"
								>
									<v-chip
										v-if="item === Object(item)"
										v-bind="attrs"
										:input-value="selected"
										label
										class="mt-2 rounded-pill"
									>
										<v-avatar color="red mr-2" size="26">
											<span class="white--text">
												{{
													getAvatarText(
														item.requestName,
														2,
													)
												}}
											</span>
										</v-avatar>
										<span class="pr-2">
											{{ item.requestName }}
										</span>
										<v-icon
											small
											@click="parent.selectItem(item)"
										>
										</v-icon>
									</v-chip>
								</template> -->
						</v-autocomplete>
					</v-col>
				</v-row>

				<v-row
					v-if="isFilter"
					class="
						d-flex
						justify-end
						pos-sticky
						grey
						lighten-2
						pb-2
						mb-1
					"
				>
					<v-col cols="2" class="my-[-1rem]">
						<v-text-field
							v-model="s_search"
							hide-details
							prepend-icon="mdi-magnify"
							dense
							:placeholder="$t('label.search')"
							maxLength="255"
						>
						</v-text-field>
					</v-col>
					<v-col cols="10">
						<v-row>
							<v-col cols="2" class="my-[-1rem]">
								<v-text-field
									v-model.trim="s_landnumber"
									dense
									hide-details
									class="my-1 rounded-sm"
									maxLength="255"
									:placeholder="$t('label.land_number')"
								></v-text-field>
							</v-col>
							<v-col cols="2" class="my-[-1rem]">
								<v-select
									:menu-props="{
										bot: true,
										offsetY: true,
									}"
									class="rounded-sm w-[15rem]"
									dense
									hide-details
									v-model="s_requestType"
									clearable
									:item-value="(item) => item"
									item-text="requestTypeName"
									:items="listRequestType"
									:placeholder="$t('tab.request_type')"
								>
								</v-select>
							</v-col>
							<v-col cols="2" class="my-[-1rem]">
								<v-select
									:menu-props="{
										bot: true,
										offsetY: true,
									}"
									v-model="s_statusName"
									class="rounded-sm w-[17rem]"
									dense
									multiple
									hide-details
									clearable
									item-text="statusName"
									:item-value="(item) => item.statusName"
									:items="ALL_STATUS"
									:placeholder="$t('label.status')"
									@change="filterByStatus()"
								>
									<!-- <template v-slot:[`item`]="{ item }">
						<span hidden>{{ item.statusName }}</span>
					</template> -->
									<template
										v-slot:selection="{ item, index }"
									>
										<span v-if="index === 0">
											{{ item.statusName }}
										</span>
										<span
											v-if="index === 1"
											class="text-caption"
										>
											(+{{ s_statusName.length - 1 }})
										</span>
									</template>
								</v-select>
							</v-col>

							<v-col cols="1" class="my-[-1rem]">
								<v-autocomplete
									class="rounded-sm w-[15rem]"
									dense
									v-model="s_organizationName"
									hide-details
									:items="listOrganization"
									clearable
									:placeholder="$t('label.organize_use')"
									@change="filterByOrganization()"
									maxLength="255"
								>
								</v-autocomplete>
							</v-col>
							<v-col cols="1" class="my-[-1rem]">
								<v-text-field
									class="rounded-sm w-[15rem]"
									dense
									v-model="s_excutor"
									hide-details
									clearable
									:placeholder="$t('label.excutor')"
									@change="filterByUser()"
									maxLength="255"
								>
								</v-text-field>
							</v-col>
							<v-col cols="2" class="my-[-1rem]">
								<v-menu
									v-model="showPickerExpiry"
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
											@click:clear="createdDate = null"
											append-icon="mdi-calendar"
											dense
											class="rounded-sm w-[15rem]"
										></v-text-field>
									</template>
									<v-date-picker
										v-model="createdDate"
										@change="filterByExpiryDay()"
										no-title
										scrollable
										range
									></v-date-picker>
								</v-menu>
							</v-col>
							<v-col cols="2" class="my-[-1rem]">
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
											@click:clear="s_expiry_date = null"
											append-icon="mdi-calendar"
											dense
											class="rounded-sm w-[15rem]"
										></v-text-field>
									</template>
									<v-date-picker
										v-model="s_expiry_date"
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
				<v-row
					v-for="(compareDto, index) of requestbody.compareDtos"
					:key="index"
				>
					<v-col cols="3" v-if="requestsGroup">
						<v-autocomplete
							maxLength="255"
							outlined
							dense
							v-model="compareDto.field"
							:items="listField"
							item-text="fieldInFormName"
							clearable
							hide-details
							:item-value="(val) => val"
						>
							<template v-slot:label>
								{{ $t("report.status_field") }}
								<span class="text-red-600">{{
									$t("label.star")
								}}</span>
							</template>
						</v-autocomplete>
					</v-col>

					<v-col cols="3" v-if="requestsGroup">
						<v-autocomplete
							maxLength="255"
							:label="$t('report.argument')"
							outlined
							dense
							v-model="compareDto.operatorObject"
							:items="operatorList"
							item-text="name"
							clearable
							hide-details
							:item-value="(val) => val"
						>
							<template v-slot:label>
								{{ $t("report.argument") }}
								<span class="text-red-600">{{
									$t("label.star")
								}}</span>
							</template>
						</v-autocomplete>
					</v-col>
					<v-col cols="4" v-if="requestsGroup">
						<!-- <v-btn text tile color="blue darken-1">
								<v-icon color="blue darken-1">
									mdi-search-web
								</v-icon>
								{{ $t("title.search") }}
							</v-btn> -->
						<v-text-field
							v-model="compareDto.value"
							append-icon="mdi-magnify"
							:label="$t('title.search')"
							hide-details
							class="mx-4"
							@keyup="customFilter($event)"
							dense
							outlined
							:readonly="isReadOnly"
						></v-text-field>
					</v-col>
					<v-col
						cols="1"
						md="1"
						v-if="!isReadOnly && requestsGroup"
						class="d-flex"
					>
						<v-btn
							icon
							class="red mr-4"
							dark
							small
							v-if="requestbody.compareDtos.length > 1"
							@click="removeOperator(index)"
						>
							<v-icon>mdi-close</v-icon>
						</v-btn>
						<v-btn
							icon
							class="blue"
							dark
							@click="addOperator(index)"
							small
						>
							<v-icon>mdi-plus</v-icon>
						</v-btn>
					</v-col>
				</v-row>

				<!-- <v-expansion-panels v-if="s_requestType">
					<v-expansion-panel>
						<v-expansion-panel-header
							class="grey lighten-4 py-[-1rem] max-h-[1.5rem]"
						>
							Filter
						</v-expansion-panel-header>
						<v-expansion-panel-content class="p-0">
							<v-row>
								<v-col cols="12" md="10">
									<div
										class="m-0 p-0 d-flex"
										v-for="(item, index) of optionsFilter"
										:key="item.name"
									>
										<v-row cols="12" md="12" class="d-flex">
											<v-col cols="12" md="3">
												<v-checkbox
													input-value="true"
													:label="item.text"
													:v-model="item.name"
													@change="
														removeItemFilter(index)
													"
												>
													{{ item }}
												</v-checkbox>
											</v-col>
											<v-col cols="12" md="3" class="p-0">
												<v-menu
													v-if="
														item.name.includes(
															'Date',
														)
													"
													ref="menu"
													v-model="showPicker"
													:close-on-content-click="
														false
													"
													:return-value.sync="
														item.val
													"
													transition="scale-transition"
													offset-y
													min-width="auto"
												>
													<template
														v-slot:activator="{
															on,
															attrs,
														}"
													>
														<v-text-field
															v-model="item.val"
															:label="item.text"
															append-icon="mdi-calendar"
															readonly
															outlined
															hide-details
															clearable
															@click:clear="
																item.val = null
															"
															v-bind="attrs"
															v-on="on"
														></v-text-field>
													</template>
													<v-date-picker
														v-model="item.val"
														no-title
														scrollable
														@change="applyFilter()"
													>
													</v-date-picker>
												</v-menu>
												<v-text-field
													hide-details
													v-if="
														!item.name.includes(
															'Date',
														)
													"
													:label="item.text"
													outlined
													dense
													v-model="item.val"
													@keyup="applyFilter()"
												></v-text-field>
											
											</v-col>
										</v-row>
									</div>
								</v-col>

								<v-col>
									<div class="float-right align-top">
										<v-combobox
											:items="listOptionsFilter"
											dense
											multiple
											:label="'Add filter'"
											clearable
											hide-details
											single-line
											class="m-0 p-0"
											outlined
											hide-selected
										>
											<template v-slot:item="{ item }">
												<v-list-item
													@click="selectFilter(item)"
													class="m-1"
												>
													{{ item.text }}
												</v-list-item>
											</template>
										</v-combobox>
									</div>
								</v-col>
							</v-row>
						</v-expansion-panel-content>
					</v-expansion-panel>
				</v-expansion-panels> -->
			</template>

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
			<template v-slot:[`item.contractExpireTime`]="{ item }">
				<span class="text-xs">
					{{ item.contractExpireTime | format_date }}
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
			<template v-slot:[`item.statusName`]="{ item }">
				<!-- <div
						class="pa-1 -circle d-inline-block"
						:style="{ background: getColor(item) }"
					></div> -->
				<span :style="{ color: getColor(item) }" class="text-xs">
					<span class="iconify" data-icon="mdi:brightness-1"></span>
					{{ item.statusName }}</span
				>
			</template>
			<template v-slot:[`item.createdOrgName`]="{ item }">
				<span hidden class="d-none">
					{{ item.createdOrgName }}
				</span>
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
import moment from "moment";
import administratorAPI from "../../administrator/administrator.api";
import constant from "@/common/constant";
export default {
	components: {},
	name: "ReportVue",

	data() {
		return {
			user_info: this.getUserInfo(),
			listRequestData: [],
			showPicker: false,
			dialogDeleteAll: false,
			showExpiryPick: false,
			s_search: "",
			isFilter: false,
			selected: [],
			s_requestTypeName: "",
			s_landnumber: "",
			s_requestType: null,
			s_requestDataCode: "",
			s_fullName: "",
			s_excutor: "",
			s_organizationName: "",
			s_statusName: [],
			s_createdOrgName: "",
			showPickerExpiry: false,
			ALL_STATUS: [],
			headers: [
				{
					text: this.$t("label.requestDataCode"),
					value: "requestDataCode",
					filter: (value) => {
						if (!this.s_requestDataCode.trim()) return true;
						if (!value) return;
						this.s_requestDataCode = this.s_requestDataCode.trim();
						return this.nonAccentVietnamese(value)
							.toLocaleUpperCase()
							.includes(
								this.nonAccentVietnamese(
									this.s_requestDataCode,
								).toLocaleUpperCase(),
							);
					},
				},
				{
					text: "Tiêu đề",
					value: "title",
					filter: (value) => {
						if (!this.s_title) return true;
						if (!value) return;
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
					text: "Loại yêu cầu",
					value: "requestDataName",
					filter: (value) => {
						if (!this.s_requestType) return true;
						if (!value) return;
						this.s_requestType = this.s_requestType.trim();
						return this.nonAccentVietnamese(value)
							.toLocaleUpperCase()
							.includes(
								this.nonAccentVietnamese(
									this.s_requestType,
								).toLocaleUpperCase(),
							);
					},
				},
				{
					text: this.$t("label.status"),
					value: "statusName",
					filter: (value) => {
						if (this.s_statusName.length == 0) return true;
						if (!value) return;
						return this.s_statusName.filter((ele) => {
							return this.nonAccentVietnamese(value)
								.toLocaleUpperCase()
								.includes(
									this.nonAccentVietnamese(
										ele,
									).toLocaleUpperCase(),
								);
						});
					},
				},
				// {
				// 	text: "",
				// 	value: "createdOrgName",
				// 	sortable: false,
				// 	filter: (value) => {
				// 		if (!this.s_organizationName) return true;

				// 		return this.nonAccentVietnamese(value)
				// 			.toLocaleUpperCase()
				// 			.includes(
				// 				this.nonAccentVietnamese(
				// 					this.s_organizationName,
				// 				).toLocaleUpperCase(),
				// 			);
				// 	},
				// },
				{
					text: this.$t("label.created_name"),
					value: "createdName",
					filter: (value) => {
						if (!this.s_excutor) return true;

						return this.nonAccentVietnamese(value)
							.toLocaleUpperCase()
							.includes(
								this.nonAccentVietnamese(
									this.s_excutor,
								).toLocaleUpperCase(),
							);
					},
				},
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
					text: this.$t("label.expire_date"),
					value: "contractExpireTime",
					formatter: (value) =>
						moment(value).isValid()
							? moment(value).format(this.dateFormat)
							: "",

					filter: (value) => {
						if (!this.s_expiry_date) return true;
						let values = `${this.s_expiry_date}`.split(
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
			items: [],
			search: "",
			singleSelect: false,
			isDeleting: false,
			createdName: "",
			createdDate: null,
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
			requestFilter: [],
			requestAll: [],
			s_request: null,
			allSelect: true,
			filterInprocess: false,
			filterOverdue: false,
			filterAboutExpire: false,
			headExcl: "",
			requestInprocess: false,
			requestOver: false,
			s_expiry_date: null,
			requestAbout: false,
			listRequestType: [],
			listOrganization: [],
			listUser: [],
			listOptionsFilter: [
				{
					name: "requestDataCode",
					text: "Mã phiếu yêu cầu",
					val: "",
				},
			],
			optionsFilter: [],
			listOrganizations: [],
			list_Organizations: [],
			requestsGroup: {},
			list_requests_group: [],
			listField: [],
			dataField: null,
			operatorList: [
				{ name: "Nhỏ hơn hoặc bằng", value: "LESSTHANOREQUAL" },
				{ name: "Lớn hơn hoặc bằng", value: "GREATERTHENOREQUAL" },
				{ name: "Chứa", value: "CONTAIN" },
			],
			operator: null,
			searchRequest: null,
			listData: null,
			isReadOnly: true,
			requestbody: {
				requestId: null,
				organizationIds: null,
				compareDtos: [
					// {
					//  operatorObject: null
					// 	operator: null,
					// 	fieldCode: null,
					// 	value: null,
					// 	field: {},
					// },
				],
			},
		};
	},
	computed: {
		formatDateFns() {
			if (!this.createdDate) {
				return null;
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
		formatDateExpiry() {
			if (!this.s_expiry_date) {
				return null;
			}
			let values = `${this.s_expiry_date}`.split(
				constant.values.DATE_RANGE_SEPARATOR,
			);
			let result = [];
			result = values.map((x) => {
				return moment(x).format("DD/MM/yyyy");
			});
			return result.join("~");
		},
		formatValueDate(val) {
			return moment(val).format(this.dateFormat);
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
		"optionsFilter.length"(val) {
			val || this.applyFilter();
		},
		selected(val) {
			console.log("val", val);

			this.json_data = val;
		},
		s_search(val) {
			val = val.trim();
			if (!val) {
				this.listRequestData = Object.assign([], this.requestAll);
			} else {
				this.listRequestData = this.requestAll.filter((entry) => {
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
				});
				this.json_data = this.listRequestData;
			}
		},
		s_statusName(val) {
			if (val.length == 0) {
				this.listRequestData = Object.assign([], this.requestAll);
			} else {
				this.listRequestData = [];
				let newArr = this.s_statusName.map((entry) => {
					return this.requestAll.filter((ele) => {
						if (
							this.nonAccentVietnamese(ele.statusName)
								.toLocaleUpperCase()
								.includes(
									this.nonAccentVietnamese(
										entry,
									).toLocaleUpperCase(),
								)
						) {
							return ele;
						}
					});
				});
				if (newArr.length > 0) {
					for (const singleArr of newArr) {
						this.listRequestData =
							this.listRequestData.concat(singleArr);
					}
				}
			}
		},
		requestsGroup(val) {
			if (val) {
				this.dataField = null;
				this.operator = null;
				if (this.isFilter) {
					this.isFilter = false;
				}
				//this.requestbody.compareDtos = null;
				this.requestbody.compareDtos = [];
				this.addOperator();

				return this.getAllFileInFormOfRequest();
			}
		},
	},
	mounted() {},
	async created() {
		this.load();
	},

	methods: {
		async load() {
			// this.getAllRequestType();
			this.getAllStatus();
			this.getRequestData();
			await this.GetAllOrganization();
			await this.getRequestGroup();
			//this.addUserSign(0);
			this.isReadOnly = false;

			//await this.getAllFileInFormOfRequest();
			// console.log("requestsGroup",this.requestsGroup);
		},
		async getAllRequestType() {
			try {
				let response = await globalService.getData_Async(
					administratorAPI.API_GetAllRequestType(),
				);
				if (!response || !response.state) return;
				this.listRequestType = response.data.filter((entry) => {
					return !entry.isDelete;
				});
			} catch (error) {
				console.log(error);
			}
		},
		async getRequestData() {
			this.listRequestType = [];
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
					if (
						entry.requestType &&
						this.listRequestType.indexOf(entry.requestType) != false
					) {
						this.listRequestType.push(
							entry.requestType?.requestTypeName,
						);
					}
					if (
						entry.createdOrgName &&
						this.listOrganization.indexOf(entry.createdOrgName) !=
							false
					) {
						this.listOrganization.push(entry.createdOrgName);
					}
					return !entry.isDelete;
				});

				this.listRequestData = Object.assign([], this.requestAll);
				this.listRequestData = this.sortList(this.listRequestData);
				this.headExcl = "Danh sách phiếu yêu cầu";
				this.json_fields = this.getJsonFields(this.headers);
				this.json_data = this.listRequestData;
			} catch (error) {
				this.toastError(error);
				return;
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
		// customFilter(value, search, item) {
		// 	return !!search && this.match(item, search);
		// },
		allRequest() {
			this.selected = [];
			this.allSelect = true;
			this.filterInprocess = false;
			this.filterOverdue = false;
			this.filterAboutExpire = false;
			this.listRequestData = Object.assign([], this.requestAll);
			this.headExcl = "Danh sách phiếu yêu cầu";
		},
		getFilenameExcel() {
			let str = "Phieu_yeu_cau_" + new Date().getTime();
			return str;
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
		async getAllStatus() {
			try {
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
			} catch (error) {
				console.log(error);
			}
			this.ALL_STATUS = this.sortList(this.ALL_STATUS);
		},
		filterByStatus() {
			this.json_data = this.json_data.filter((entry) => {
				return this.nonAccentVietnamese(entry.statusName)
					.toLocaleUpperCase()
					.includes(
						this.nonAccentVietnamese(
							this.s_statusName,
						).toLocaleUpperCase(),
					);
			});
		},
		async filterByRequestType() {
			if (!this.s_requestType) {
				return;
			}
			let response;
			try {
				response = await globalService.getData_Async(
					administratorAPI.API_FindOneRequesrtByID(
						this.s_requestType.id,
					),
				);
				if (!response || !response.state) {
					this.toastError(
						this.$t(
							"message.this_request_type_is_not_fully_configured",
						),
					);
				} else {
					this.s_request = response.data.filter((entry) => {
						return !entry.isDelete;
					});
				}
				if (this.s_request.length > 0) {
					this.s_request = this.s_request[0];
				}
			} catch (error) {
				console.log(error);
			}
			let fieldInForm;
			this.listOptionsFilter = [];
			if (this.s_request.form) {
				try {
					response = await globalService.getData_Async(
						administratorAPI.API_FindFieldInForm(
							this.s_request.form.id,
						),
					);
					if (!response || !response.state) {
						return [];
					}
				} catch (error) {
					console.log(error);
				}
				let data = response.data;
				if (data.length > 0) {
					fieldInForm = data.sort((e2, e1) => e2.order - e1.order);
				}
				for (let field of fieldInForm) {
					let _Obj = {
						name: "nameOfField" + field.id,
						text: "",
						val: "",
					};
					_Obj.text = field.nameOfField;
					_Obj.val = "";
					this.listOptionsFilter.push(_Obj);
				}
				// let objectSchema = { type: "object", properties: {} };
				// for (let field of fieldInForm) {
				// 	// code mới \\
				// 	let fieldObject = JSON.parse(field.objectSchema);
				// 	let nameOfField = fieldObject.title.title.trim();
				// 	let objectShemaOfField = {
				// 		...fieldObject.title,
				// 		"x-cols": fieldObject["x-cols"],
				// 		"x-class": "px-2",
				// 	};
				// 	if (objectShemaOfField.readOnly)
				// 		objectShemaOfField.readOnly = false;

				// 	if (objectSchema.properties[nameOfField]) {
				// 		nameOfField = nameOfField + "1";
				// 	}
				// 	objectSchema.properties[nameOfField] = objectShemaOfField;
				// };
			}
			this.json_data = this.json_data.filter((entry) => {
				return this.nonAccentVietnamese(entry.requestDataName)
					.toLocaleUpperCase()
					.includes(
						this.nonAccentVietnamese(
							this.s_requestType.requestTypeName,
						).toLocaleUpperCase(),
					);
			});
			// this.requestAll = Object.assign([], this.json_data);
		},
		filterByOrganization() {
			// if (!this.s_organizationName) {
			// 	this.listRequestData = Object.assign([], this.requestAll);
			// }
			this.json_data = this.json_data.filter((entry) => {
				return this.nonAccentVietnamese(entry.createdOrgName)
					.toLocaleUpperCase()
					.includes(
						this.nonAccentVietnamese(
							this.s_organizationName,
						).toLocaleUpperCase(),
					);
			});
		},
		filterByUser() {
			this.json_data = this.json_data.filter((entry) => {
				return this.nonAccentVietnamese(entry.createdName)
					.toLocaleUpperCase()
					.includes(
						this.nonAccentVietnamese(
							this.s_excutor,
						).toLocaleUpperCase(),
					);
			});
		},
		filterByExpiryDay() {
			this.showPickerExpiry = false;
			this.json_data = this.json_data.filter((entry) => {
				if (!this.createdDate) return true;
				let values = `${this.createdDate}`.split(
					constant.values.DATE_RANGE_SEPARATOR,
				);
				values = values
					.map((x) => {
						return moment(`${x}`).toDate().getTime();
					})
					.sort((a, b) => a - b);
				let target = moment(entry).toDate().getTime();
				return (
					target >= values[0] &&
					target <= values[values.length - 1] + 24 * 60 * 60 * 1000
				);
			});
		},
		selectFilter(item) {
			if (this.optionsFilter.indexOf(item) > -1) return;
			this.optionsFilter.push(item);
		},
		removeItemFilter(index) {
			this.optionsFilter.splice(index, 1);
		},
		applyFilter() {
			this.showPicker = false;
			if (this.optionsFilter.length > 0) {
				for (const filter of this.optionsFilter) {
					if (filter.name.includes("Date") && filter.val) {
						this.listRequestData = this.listRequestData.filter(
							(entry) => {
								if (!entry.createdDate) return;
								if (!filter.val) return true;
								return entry.createdDate.includes(filter.val);
							},
						);
						this.json_data = this.json_data.filter((entry) => {
							if (!entry.createdDate) return;
							if (!filter.val) return true;
							return entry.createdDate.includes(filter.val);
						});
					} else if (
						filter.name.includes("GroupName") &&
						filter.val
					) {
						this.listRequestData = this.listRequestData.filter(
							(entry) => {
								if (!entry.requestGroupName) return;
								if (!filter.val) return true;
								return this.nonAccentVietnamese(
									entry.requestGroupName,
								).includes(
									this.nonAccentVietnamese(filter.val).trim(),
								);
							},
						);
						this.json_data = this.json_data.filter((entry) => {
							if (!entry.requestGroupName) return;
							if (!filter.val) return true;
							return this.nonAccentVietnamese(
								entry.requestGroupName,
							).includes(
								this.nonAccentVietnamese(filter.val).trim(),
							);
						});
					} else if (
						filter.name.includes("GroupCode") &&
						filter.val
					) {
						this.listRequestData = this.listRequestData.filter(
							(entry) => {
								if (!entry.requestGroupCode) return;
								if (!filter.val) return true;
								return this.nonAccentVietnamese(
									entry.requestGroupCode,
								).includes(
									this.nonAccentVietnamese(filter.val).trim(),
								);
							},
						);
						this.json_data = this.json_data.filter((entry) => {
							if (!entry.requestGroupCode) return;
							if (!filter.val) return true;
							return this.nonAccentVietnamese(
								entry.requestGroupCode,
							).includes(
								this.nonAccentVietnamese(filter.val).trim(),
							);
						});
					} else if (filter.name.includes("DataCode") && filter.val) {
						this.listRequestData = this.listRequestData.filter(
							(entry) => {
								if (!entry.requestDataCode) return;
								if (!filter.val) return true;
								return this.nonAccentVietnamese(
									entry.requestDataCode,
								).includes(
									this.nonAccentVietnamese(filter.val).trim(),
								);
							},
						);
						this.json_data = this.json_data.filter((entry) => {
							if (!entry.requestDataCode) return;
							if (!filter.val) return true;
							return this.nonAccentVietnamese(
								entry.requestDataCode,
							).includes(
								this.nonAccentVietnamese(filter.val).trim(),
							);
						});
					} else if (
						filter.name.includes("createdName") &&
						filter.val
					) {
						this.listRequestData = this.listRequestData.filter(
							(entry) => {
								if (!entry.createdName) return;
								if (!filter.val) return true;

								return this.nonAccentVietnamese(
									entry.createdName,
								).includes(
									this.nonAccentVietnamese(filter.val).trim(),
								);
							},
						);
						this.json_data = this.json_data.filter((entry) => {
							if (!entry.createdName) return;
							if (!filter.val) return true;

							return this.nonAccentVietnamese(
								entry.createdName,
							).includes(
								this.nonAccentVietnamese(filter.val).trim(),
							);
						});
					}
				}
			} else {
				this.listRequestData = Object.assign([], this.requestAll);
				this.json_data = Object.assign([], this.listRequestData);
			}
		},
		filterCustom(value, search, item) {
			console.log("item", item);
			if (!search) return true;
			if (!value) return;
			// return this.nonAccentVietnamese(value.toString())
			// 	.toLocaleUpperCase()
			// 	.includes(this.nonAccentVietnamese(search).toLocaleUpperCase());
			return value;
		},
		async GetAllOrganization() {
			try {
				let response = await globalService.getData_Async(
					administratorAPI.API_GetAllOrganizationWithRole(
						this.user_info.id,
					),
				);
				if (!response || !response.state) {
					return;
				}
				this.listOrganizations = response.data.filter((entry) => {
					return !entry.isDelete;
				});
			} catch (error) {
				console.log(error);
			}
		},
		async getRequestGroup() {
			try {
				let response;
				response = await globalService.getData_Async(
					administratorAPI.API_GetAllRequestWithRole(
						this.user_info.id,
					),
				);
				if (!response || !response.state) return;
				this.list_requests_group = response.data;
				// this.sortList(this.requests_group);
			} catch (error) {
				console.log(error);
			}
		},
		async getAllFileInFormOfRequest() {
			try {
				let response;
				response = await globalService.getData_Async(
					administratorAPI.API_GetAllFileInFormOfRequest(
						this.requestsGroup.id,
					),
				);
				if (!response || !response.state) {
					this.listField = null;
					return ;
				}
				this.listField = response.data;
			} catch (error) {
				console.log(error);
			}
		},
		async getAllRequestDataStatistic() {
			try {
				let response;
				for (let item of this.requestbody.compareDtos) {
					if (!item.field) {
						return this.toastError(
							this.$t("report.no_status_field"),
						);
					}
					if (!item.operatorObject) {
						return this.toastError(this.$t("report.no_argument"));
					}
				}
				this.requestbody = {
					requestId: this.requestsGroup.id,
					organizationIds: this.list_Organizations.map((e) => e.id),

					compareDtos: this.requestbody.compareDtos.map((ele) => {
						ele.operator = ele.operatorObject.value;
						ele.fieldCode = ele.field.fieldInFormCode;
						return ele;
					}),
				};
				response = await globalService.postData_Async(
					administratorAPI.API_GetAllRequestDataStatistic(),
					this.requestbody,
				);
				if (!response || !response.state)
					return this.toastError(this.$t("error.fail"));
				this.listRequestData = response.data;
				this.json_data = this.listRequestData;
			} catch (error) {
				console.log(error);
			}
		},
		customFilter(event) {
			if (
				event.code == constant.keys.enter ||
				event.keyCode == constant.keys.enter_keyCode
			) {
				this.getAllRequestDataStatistic();
			}
		},
		removeOperator(index) {
			// if (this.listSign[index].id) {
			// 	this.arrDeleteUser.push(this.listSign[index].id);
			// }
			// this.listSign.splice(index, 1);`
			this.requestbody.compareDtos.splice(index, 1);
			//console.log("this.requestbody.compareDtos",this.requestbody.compareDtos)
		},
		addOperator() {
			let compareDto = {
				operator: null,
				operatorObject: null,
				fieldCode: null,
				value: null,
				field: null,
			};
			this.requestbody.compareDtos.push(compareDto);
		},
		onclickFilter() {
			this.isFilter = !this.isFilter;
			this.requestsGroup = null;
			
		},
	},
	filters: {
		format_date: function (value) {
			return moment(value).format("DD/MM/yyyy");
		},
	},
};
</script>
<style>
.pos-sticky {
	position: -webkit-sticky;
	position: sticky;
	top: 0;
}
</style>
