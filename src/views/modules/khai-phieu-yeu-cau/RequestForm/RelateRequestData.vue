<template>
	<v-card v-if="listRequestData" flat elevation="0">
		<v-toolbar elevation="0" class="grey lighten-4 max-h-[2rem]">
			<v-spacer></v-spacer>
			<v-btn icon @click="close" class="mb-8 left-[1rem]">
				<v-icon>mdi-close</v-icon>
			</v-btn>
		</v-toolbar>
		<v-data-table
			v-model="selected"
			:headers="headers"
			:items="listRequestData"
			:single-select="singleSelect"
			item-key="id"
			show-select
			class="px-4"
			:no-data-text="$t('message.no_results')"
			:no-results-text="$t('message.no_results')"
		>
			<template v-slot:[`item.approverName`]="{ item }">
				<v-tooltip bottom v-if="item.approverName" class="w-[10vw]">
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
			<template v-slot:[`item.statusName`]="{ item }">
				<span :style="{ color: getColor(item) }" class="text-xs">{{
					item.statusName
				}}</span>
			</template>

			<template v-slot:[`item.createdOrgName`]="{ item }">
				<v-tooltip bottom v-if="item.createdOrgName">
					<template v-slot:activator="{ on, attrs }">
						<span v-bind="attrs" v-on="on" class="text-xs">
							<v-avatar color="red darken-2 mr-1" size="20">
								<span class="white--text">
									{{ getAvatarText(item.createdOrgName) }}
								</span>
							</v-avatar>
							{{ item.createdOrgName.slice(0, 15)
							}}<span
								v-if="item.requestTypeName.length > 15"
								class="text-black"
								>...</span
							>
						</span>
					</template>
					<span class="text-xs">
						{{ item.createdOrgName }}
					</span>
				</v-tooltip>
			</template>

			<template v-slot:top>
				<div class="flex items-center">
					<span class="text-lg p-1">
						{{$t("label.select_the_relevant_request_form")}}
					</span>
					<v-spacer></v-spacer>
					<v-card-title>
						<v-menu
							v-model="showPickerTitle"
							:close-on-content-click="false"
							transition="scale-transition"
							offset-y
						>
							<template v-slot:activator="{ on, attrs }">
								<v-text-field
									:value="formatRangeDate"
									clearable
									:placeholder="$t('label.Period')"
									readonly
									v-bind="attrs"
									hide-details
									v-on="on"
									@click:clear="range_date = null"
									append-icon="mdi-calendar"
									dense
									class=""
								></v-text-field>
							</template>
							<v-date-picker
								v-model="range_date"
								@change="showPicker = false"
								no-title
								scrollable
								range
							></v-date-picker> </v-menu
					></v-card-title>

					<v-text-field
						maxLength="255"
						v-model="search"
						append-icon="mdi-magnify"
						hide-details
						dense
						class=""
						:no-data-text="$t('message.no_results')"
						@keyup="customFilter()"
					></v-text-field>
					<!-- <v-btn icon @click="filterExist = !filterExist">
						<v-icon>mdi-filter </v-icon>
					</v-btn> -->
				</div>
			</template>
			<template v-slot:[`item.requestTypeName`]="{ item }">
				<v-tooltip bottom>
					<template v-slot:activator="{ on, attrs }">
						<span
							class="text-black text-xs"
							v-bind="attrs"
							v-on="on"
						>
							{{ item.requestTypeName.slice(0, 17) }}
						</span>
						<span
							v-if="item.requestTypeName.length > 17"
							class="text-black"
							>...</span
						>
					</template>
					<span>{{ item.requestTypeName }}</span>
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
			<template v-slot:[`body.prepend`]>
				<tr v-if="filterExist">
					<td></td>
					<td>
						<v-text-field
							v-model="s_title"
							:placeholder="$t('label.mail_template_subject')"
							dense
							class="ml-[-1rem] w-[15vw]"
							hide-details
							maxLength="255"
						></v-text-field>
					</td>
					<td>
						<v-select
							:menu-props="{ bot: true, offsetY: true }"
							:items="ALL_STATUS"
							item-text="statusName"
							:item-value="(item) => item.statusName"
							:placeholder="$t('label.status')"
							dense
							class="ml-[-1rem] w-[10vw]"
							hide-details
							maxLength="255"
							v-model="s_status"
							:no-data-text="$t('message.no_results')"
						></v-select>
					</td>
					<td>
						<v-text-field
							v-model="s_createdOrgName"
							maxLength="255"
							hide-details
							dense
							class="ml-[-1rem]"
							:placeholder="$t('label.s_createdOrgName')"
						></v-text-field>
					</td>

					<td>
						<v-select
							:menu-props="{ bot: true, offsetY: true }"
							:items="requestAll"
							item-text="requestTypeName"
							:item-value="(item) => item.requestTypeName"
							:placeholder="$t('label.type_group')"
							dense
							class="ml-[-1rem]"
							hide-details
							v-model="s_requestType"
						></v-select>
					</td>
					<td>
						<v-text-field
							:placeholder="$t('label.approverName')"
							dense
							hide-details
							class="ml-[-1rem] w-[10vw]"
							maxLength="255"
							v-model="s_approverName"
						></v-text-field>
					</td>
					<td>
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
									:placeholder="$t('label.created_date')"
									readonly
									v-bind="attrs"
									class="ml-[-1rem] w-[10vw]"
									v-on="on"
									hide-details
									@click:clear="s_approverDate = null"
									append-icon="mdi-calendar"
									dense
								></v-text-field>
							</template>
							<v-date-picker
								v-model="s_approverDate"
								@change="showPicker = false"
								no-title
								scrollable
								range
							></v-date-picker>
						</v-menu>
					</td>
				</tr>
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
		<v-divider></v-divider>

		<v-card-actions class="white">
			<v-spacer></v-spacer>
			<v-btn
				elevation="0"
				color="blue darken-2"
				dark
				class="rounded-0"
				@click="Save"
			>
				{{ $t("button.ok") }}</v-btn
			>

			<v-btn
				elevation="0"
				color="grey lighten-4"
				class="rounded-0"
				@click="close"
			>
				{{ $t("button.cancel") }}</v-btn
			>
		</v-card-actions>
	</v-card>
</template>

<script>
import globalService from "@/services/global.service";
import administratorAPI from "../../administrator/administrator.api";
import moment from "moment";
import constant from "@/common/constant";

export default {
	name: "VSMFERelateRequestData",

	data() {
		return {
			showPickerTitle: false,
			defaultListRequest: [],
			s_createdOrgName: "",
			s_title: "",
			search: "",
			range_date: null,
			s_status: this.$t("label.show_all"),
			s_requestGroup: this.$t("label.show_all"),
			s_requestType: this.$t("label.show_all"),
			s_approverName: "",
			user_info: this.getUserInfo(),
			requestAll: [],
			items: [],
			singleSelect: false,
			selected: [],
			dateFormat: "DD/MM/yyyy",
			listRequestData: [],
			s_approverDate: null,
			showPicker: false,
			ALL_STATUS: [],
			headers: [
				{
					text: this.$t("label.title"),
					value: "title",
					sortable: false,

					filter: (value) => {
						this.s_approverName = this.s_approverName
							? this.s_approverName.trim()
							: "";
						if (
							this.s_title == this.$t("label.show_all") ||
							this.s_title.length < 1
						)
							return true;
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
					text: this.$t("label.status"),
					value: "statusName",

					filter: (value) => {
						if (this.s_status == this.$t("label.show_all"))
							return true;

						return value.includes(this.s_status);
					},
				},

				{
					text: this.$t("label.s_createdOrgName"),
					value: "createdOrgName",

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
					text: this.$t("label.type_group"),
					value: "requestTypeName",

					filter: (value) => {
						if (this.s_requestType == this.$t("label.show_all"))
							return true;

						return value.includes(this.s_requestType);
					},
				},
				{
					text: this.$t("label.approverName"),
					value: "approverName",

					filter: (value) => {
						this.s_approverName = this.s_approverName
							? this.s_approverName.trim()
							: "";
						if (
							this.s_approverName == this.$t("label.show_all") ||
							this.s_approverName.length < 1
						)
							return true;

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
					text: this.$t("title.date_create"),
					value: "createdDate",

					formatter: (value) =>
						moment(value).isValid()
							? moment(value).format(this.dateFormat)
							: "",

					filter: (value) => {
						if (!this.s_approverDate && !this.range_date)
							return true;
						let values = `${this.s_approverDate}`.split(
							constant.values.DATE_RANGE_SEPARATOR,
						);
						let values1 = `${this.range_date}`.split(
							constant.values.DATE_RANGE_SEPARATOR,
						);
						values = values
							.map((x) => {
								return moment(`${x}`).toDate().getTime();
							})
							.sort((a, b) => a - b);
						values1 = values1
							.map((x) => {
								return moment(`${x}`).toDate().getTime();
							})
							.sort((a, b) => a - b);
						let target = moment(value).toDate().getTime();
						return (
							(target >= values[0] &&
								target <=
									values[values.length - 1] +
										24 * 60 * 60 * 1000) ||
							(target >= values1[0] &&
								target <=
									values1[values1.length - 1] +
										24 * 60 * 60 * 1000)
						);
					},
				},
			],
		};
	},

	mounted() {
		this.getAllRequestData();
		this.getAllStatus();
	},
	computed: {
		formatDateFns() {
			if (!this.s_approverDate) {
				return "";
			}
			let values = `${this.s_approverDate}`.split(
				constant.values.DATE_RANGE_SEPARATOR,
			);
			let result = [];
			result = values.map((x) => {
				return moment(x).format("DD/MM/yyyy");
			});
			return result.join("~");
		},
		formatRangeDate() {
			if (!this.range_date) {
				return "";
			}
			let values = `${this.range_date}`.split(
				constant.values.DATE_RANGE_SEPARATOR,
			);
			let result = [];
			result = values.map((x) => {
				return moment(x).format("DD/MM/yyyy");
			});
			return result.join("~");
		},
	},
	methods: {
		close() {
			this.selected = [];
			this.$emit("close", true);
		},
		async getAllRequestData() {
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
					entry.showAll = false;
					return !entry.isDelete;
				});
				this.defaultListRequest = response.data.filter((entry) => {
					return !entry.isDelete;
				});
				this.listRequestData = Object.assign([], this.requestAll);
				this.requestAll.unshift(this.$t("label.show_all"));
			} catch (error) {
				this.toastError(error);
				return;
			}
		},

		async Save() {
			if (!this.selected.length) {
				return this.toastError(this.$t("label.no_selected"));
			}
			await this.$emit("saveRelate", this.selected);
			await this.$emit("close", true);
			this.close();
		},
		customFilter() {
			this.listRequestData = Object.assign([], this.defaultListRequest);
			if (this.search.trim() == "") {
				return;
			}
			this.listRequestData = this.defaultListRequest.filter((entry) => {
				return (
					entry.title.length > 0 &&
					this.nonAccentVietnamese(
						entry.title.toLocaleUpperCase(),
					).includes(
						this.nonAccentVietnamese(
							this.search.toLocaleUpperCase(),
						),
					)
				);
			});
		},
		getAllStatus() {
			globalService
				.getData_NoAsync(administratorAPI.API_GetAllStatus())
				.then((response) => {
					if (
						!response ||
						response.status != 200 ||
						!response.data ||
						!response.data.state
					) {
						return;
					}
					this.ALL_STATUS = response.data.data.filter((entry) => {
						{
							return !entry.isDelete && entry.isActive;
						}
					});
					this.ALL_STATUS.unshift({
						id: -1,
						statusName: this.$t("label.show_all"),
					});
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
	},
	filters: {
		format_date: function (value) {
			return moment(value).format("DD/MM/yyyy");
		},
	},
};
</script>

<style lang="scss" scoped></style>
