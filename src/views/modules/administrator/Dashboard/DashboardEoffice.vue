<template>
	<div class="mx-5">
		<!-- <BreadcrumbsVue /> -->
		<v-row>
			<v-col cols="6">
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
					class="pt-4"
				>
				</v-autocomplete>
			</v-col>
			<v-col cols="4" class="pt-8" v-if="list_Organizations.length > 0">
				<v-btn
					text
					tile
					color="blue darken-1"
					@click="seachOrganizations"
				>
					<v-icon color="blue darken-1"> mdi-search-web </v-icon>
					{{ $t("title.apply") }}
				</v-btn>
			</v-col>
		</v-row>
		<v-row>
			<v-card
				flat
				class="
					rounded-0
					mx-2
					my-1
					green
					darken-4
					max-h-[11rem]
					w-[9.5rem]
					p-5
				"
				dark
				:to="{
					path: '/phieu-yeu-cau/list-request',
				}"
			>
				<p class="text-xl">
					{{ $t("label.total") }}
				</p>

				<p class="text-5xl">
					{{ countRequestAll }}
				</p>
			</v-card>
			<!-- <v-card
						flat
						class="rounded-0 mx-2 my-1 light-blue lighten-1 max-h-[11rem] w-[9.5rem] p-5"
					>
						<p class="text-xl">
							{{ $t("label.in_week") }}
						</p>
						<p class="text-5xl">
							{{ countAllThisWeek }}
						</p>
					</v-card> -->
			<v-card
				flat
				class="
					rounded-0
					mx-2
					my-1
					yellow
					darken-2
					max-h-[11rem]
					w-[9.5rem]
					p-5
				"
				:to="{
					path: '/phieu-yeu-cau/list-request-handle',
				}"
			>
				<p class="text-xl text-zinc-800">
					{{ $t("label.about_expired") }}
				</p>
				<p class="text-5xl text-zinc-800">
					{{ countRequestAboutTo }}
				</p>
			</v-card>
			<v-card
				flat
				class="
					rounded-0
					mx-2
					my-1
					red
					darken-1
					max-h-[11rem]
					w-[9.5rem]
					p-5
				"
				:to="{
					path: '/phieu-yeu-cau/list-request-handle',
				}"
			>
				<p class="text-xl text-zinc-800">
					{{ $t("label.overdue") }}
				</p>
				<p class="text-5xl text-zinc-800">
					{{ countRequestOver }}
				</p>
			</v-card>
			<v-card
				flat
				class="
					rounded-0
					mx-2
					my-1
					green
					darken-3
					max-h-[11rem]
					w-[9.5rem]
					p-5
				"
				:to="{
					path: '/phieu-yeu-cau/list-request-handle',
				}"
			>
				<p class="text-xl text-zinc-800">
					{{ $t("label.inprocess") }}
				</p>
				<p class="text-5xl text-zinc-800">
					{{ countRequestHandle }}
				</p>
			</v-card>
			<v-card
				flat
				class="
					rounded-0
					mx-2
					my-1
					light-blue
					accent-4
					max-h-[11rem]
					w-[9.5rem]
					p-5
				"
				:to="{
					path: '/phieu-yeu-cau/list-request-give-back',
				}"
			>
				<p class="text-xl text-zinc-800">
					{{ $t("label.rejected") }}
				</p>
				<p class="text-5xl text-zinc-800">
					{{ countReject }}
				</p>
			</v-card>
		</v-row>

		<v-row v-if="!user_infor.leader">
			<v-col cols="12" md="6">
				<v-card flat outlined elevation="0" class="p-4" id="chart_line">
					<v-row class="justify-between p-1">
						<router-link
							:to="{
								path: '/phieu-yeu-cau/list-request-handle',
							}"
						>
							<span class="text-lg text-blue-400">
								{{ $t("label.doc_need_process") }}
							</span>
						</router-link>
						<span class="d-flex float-right">
							<v-menu
								v-model="menu_left"
								:close-on-content-click="false"
								max-width="290"
								offset-y
							>
								<template v-slot:activator="{ on, attrs }">
									<v-text-field
										:value="formatModifyDateFns"
										readonly
										v-bind="attrs"
										v-on="on"
										append-icon="mdi-calendar"
										@click:clear="s_date_left = null"
										outlined
										dense
										:placeholder="$t('label.date')"
										class="mr-2"
										clearable
									></v-text-field>
								</template>
								<v-date-picker
									v-model="s_date_left"
									@change="changeGetbyDay()"
									no-title
									scrollable
									range
								></v-date-picker>
							</v-menu>
							<v-select
								:menu-props="{
									bot: true,
									offsetY: true,
								}"
								outlined
								dense
								item-text="requestGroupName"
								:items="listRequest"
								:item-value="(item) => item"
								v-model="s_request_left"
							>
							</v-select>
						</span>
					</v-row>
					<apexchart
						ref="chart_line"
						type="line"
						height="300"
						:options="chartOptions_line"
						:series="series_line"
					>
					</apexchart>
				</v-card>
			</v-col>
			<v-col cols="12" md="6">
				<v-card
					elevation="0"
					flat
					outlined
					class="w-full p-4"
					id="chart_donut"
				>
					<v-row class="justify-between p-1">
						<router-link
							:to="{
								path: '/phieu-yeu-cau/list-request',
							}"
						>
							<span class="text-lg text-blue-400">
								{{ $t("label.filter_by_status") }}
							</span>
						</router-link>
						<span class="d-flex float-right">
							<v-select
								:menu-props="{
									bot: true,
									offsetY: true,
								}"
								outlined
								dense
								:placeholder="$t('tab.group')"
								item-text="requestGroupName"
								:items="listRequest"
								:item-value="(item) => item"
								v-model="s_request_right"
								class="mr-2"
							>
								<!-- <template v-slot:item="{ item }">
										<span @click="selectRequestRight(item)">
											{{ item.requestGroupName }}
										</span>
									</template> -->
							</v-select>
							<v-menu
								v-model="menu_right"
								:close-on-content-click="false"
								max-width="290"
								offset-y
							>
								<template v-slot:activator="{ on, attrs }">
									<v-text-field
										:value="formatModifyDateFnsRight"
										readonly
										v-bind="attrs"
										v-on="on"
										append-icon="mdi-calendar"
										@click:clear="s_date_right = null"
										outlined
										dense
										:placeholder="$t('label.date')"
									></v-text-field>
								</template>
								<v-date-picker
									v-model="s_date_right"
									@change="changeGetbyStatus()"
									no-title
									scrollable
									range
								></v-date-picker>
							</v-menu>
						</span>
					</v-row>
					<apexchart
						ref="chart_donut"
						type="donut"
						height="310"
						:options="chartOptions_donut_right"
						:series="series_donut_right"
					></apexchart>
				</v-card>
			</v-col>
		</v-row>
		<v-row v-if="user_infor.leader">
			<v-col cols="12" md="6">
				<v-card
					flat
					elevation="0"
					outlined
					class="border w-full p-4"
					id="chart_bar_ld"
				>
					<v-row class="justify-between p-1">
						<router-link
							:to="{
								path: '/phieu-yeu-cau/list-request-handle',
							}"
						>
							<span class="text-lg text-blue-400">
								{{ $t("label.inprocess") }}
							</span>
						</router-link>
						<span class="d-flex float-right">
							<v-menu
								v-model="menu_date_canxuly"
								:close-on-content-click="false"
								max-width="200"
							>
								<template v-slot:activator="{ on, attrs }">
									<v-text-field
										:value="formatModifyDateCanXuly"
										readonly
										v-bind="attrs"
										v-on="on"
										append-icon="mdi-calendar"
										@click:clear="date_canxuly = null"
										outlined
										dense
									></v-text-field>
								</template>
								<v-date-picker
									v-model="date_canxuly"
									@change="changeCanXuly()"
									no-title
									scrollable
									range
								></v-date-picker>
							</v-menu>
							<v-select
								:menu-props="{
									bot: true,
									offsetY: true,
								}"
								outlined
								dense
								:label="$t('label.organize_use')"
								item-text="organizationName"
								:items="listOrganization"
								class="ml-5 w-1"
								:item-value="(item) => item"
								v-model="s_organization_left"
							>
							</v-select>
							<v-select
								:menu-props="{
									bot: true,
									offsetY: true,
								}"
								v-model="tyep_chart_canxuly"
								outlined
								dense
								:items="listType_chart"
								:item-value="(item) => item.key"
								item-text="name"
								:label="$t('label.type_chart')"
								class="ml-5 w-1"
							>
							</v-select>
						</span>
					</v-row>
					<apexchart
						ref="chart_bar_canXuly"
						:type="tyep_chart_canxuly"
						:options="chartOption_canXuly"
						:series="series_canXuly"
					>
					</apexchart>
				</v-card>
			</v-col>
			<v-col cols="12" md="6">
				<v-card flat outlined class="w-full p-4 border-2">
					<v-row class="justify-between p-1">
						<router-link
							:to="{
								path: '/phieu-yeu-cau/list-request',
							}"
						>
							<span class="text-lg text-blue-400">
								{{ $t("label.status") }}
							</span>
						</router-link>
						<span class="d-flex float-right">
							<v-select
								:menu-props="{
									bot: true,
									offsetY: true,
								}"
								outlined
								dense
								:label="$t('label.status')"
								item-text="statusName"
								:items="list_status"
								:item-value="(item) => item"
								class="mr-5 w-1"
								v-model="s_status"
							>
							</v-select>
							<v-select
								:menu-props="{
									bot: true,
									offsetY: true,
								}"
								v-model="tyep_chart"
								outlined
								dense
								:items="listType_chart"
								:item-value="(item) => item.key"
								item-text="name"
								:label="$t('label.type_chart')"
								class="mr-5 w-1"
							>
							</v-select>
						</span>
					</v-row>
					<apexchart
						ref="chart_donut_trangthai"
						:type="tyep_chart"
						:options="chartOption_trangthai"
						:series="series_trangthai"
					></apexchart>
				</v-card>
			</v-col>
			<v-col cols="12" md="6">
				<v-card flat outlined elevation="0" class="w-full p-4">
					<v-row class="justify-between p-1">
						<router-link
							:to="{
								path: '/phieu-yeu-cau/list-request-handle',
							}"
						>
							<span class="text-lg text-blue-400">
								{{ $t("label.request_need_process") }}
							</span>
						</router-link>

						<span class="d-flex float-right">
							<v-menu
								v-model="menu_date_phieucanxuly"
								:close-on-content-click="false"
								max-width="290"
							>
								<template v-slot:activator="{ on, attrs }">
									<v-text-field
										:value="formatModifyDatePhieuCanXuly"
										readonly
										v-bind="attrs"
										v-on="on"
										append-icon="mdi-calendar"
										@click:clear="date_phieucanxukly = null"
										outlined
										dense
									></v-text-field>
								</template>
								<v-date-picker
									v-model="date_phieucanxukly"
									@change="changedatePhieucanxuly()"
									no-title
									scrollable
									range
								></v-date-picker>
							</v-menu>
						</span>
					</v-row>
					<apexchart
						ref="chart_bar_day"
						type="bar"
						height="400"
						:options="chartOption_canXulybyday"
						:series="series_canXulybyday"
					>
					</apexchart>
				</v-card>
			</v-col>
			<v-col cols="12" md="6">
				<v-card elevation="0" flat outlined class="w-full p-4">
					<v-row class="justify-between p-1">
						<router-link
							:to="{
								path: '/phieu-yeu-cau/list-request-handle',
							}"
						>
							<span class="text-lg text-blue-400">
								{{ $t("label.request_need_process") }}
							</span>
						</router-link>

						<span class="d-flex float-right">
							<v-select
								:menu-props="{
									bot: true,
									offsetY: true,
								}"
								outlined
								dense
								:label="$t('label.organize_use')"
								item-text="organizationName"
								:items="listOrganization"
								:item-value="(item) => item"
								class="mr-5 w-1"
								v-model="s_request_right"
							>
								<template v-slot:item="{ item }">
									<span
										@click="
											selectRequestChartTrangThai(item)
										"
									>
										{{ item.organizationName }}
									</span>
								</template>
							</v-select>
						</span>
					</v-row>
					<apexchart
						ref="chart_bar_status"
						class="p-2"
						type="bar"
						height="400"
						:options="chartOption_canXulybystatus"
						:series="series_canXulybystatus"
					></apexchart>
				</v-card>
			</v-col>
		</v-row>
	</div>
</template>
<script>
import VueApexCharts from "vue-apexcharts";
import globalService from "@/services/global.service";
import administratorAPI from "../administrator.api";
import moment from "moment";
import constant from "@/common/constant";
export default {
	name: "DashboardEoffice",
	components: {
		apexchart: VueApexCharts,
	},
	data() {
		return {
			user_infor: this.getUserInfo(),
			menu_left: false,
			date_canxuly: null,
			menu_date_canxuly: false,
			menu_date_phieucanxuly: false,
			date_phieucanxukly: null,
			menu_right: false,
			s_request_left: null,
			s_request_right: null,
			s_organization_left: null,
			isNV: false,
			countRequestAboutTo: 0,
			countRequestOver: 0,
			countRequestHandle: 0,
			countRequestDrafting: 0,
			series_line: [
				{
					name: "Phiếu",
					data: [],
				},
			],
			chartOptions_line: {
				chart: {
					height: 200,
					type: "line",
				},
				colors: ["#77B6EA", "#545454"],
				dataLabels: {
					enabled: true,
				},
				stroke: {
					curve: "smooth",
				},
				grid: {
					borderColor: "#e7e7e7",
					row: {
						colors: ["#f3f3f3", "transparent"],
						opacity: 0.5,
					},
				},
				xaxis: {
					categories: [],
				},
				legend: {
					position: "top",
					horizontalAlign: "right",
				},
			},

			series_donut_right: [],
			chartOptions_donut_right: {
				labels: [
					this.$t("label.inprocess"),
					this.$t("label.about_expired"),
					this.$t("label.overdue"),
					this.$t("label.drafting"),
					this.$t("label.wait_approve"),
				],
				fill: {
					opacity: 1,
				},
				colors: ["#03A9F4", "#F44336", "#9C27B0", "#4CAF50", "#FF9800"],
				chart: {
					type: "donut",
					width: 200,
				},
				legend: {
					position: "right",
					horizontalAlign: "right",
					offsetX: 10,
					height: 150,
				},
			},
			listRequest: [],
			series_canXuly: [],
			chartOption_canXuly: {
				chart: {
					type: "bar",
					height: 300,
					stacked: true,
					toolbar: {
						show: false,
						tools: {
							download: false,
						},
					},
				},
				plotOptions: {
					bar: {
						horizontal: true,
					},
				},
				xaxis: {
					categories: [],
				},

				fill: {
					opacity: 1,
				},
				legend: {
					show: false,
				},
			},
			series_trangthai: [44, 55, 41, 17, 15],
			chartOption_trangthai: {
				labels: [
					"Bộ phận văn thư",
					"Bộ phận pháp chế",
					"Bộ phận sale",
					"Bộ phận vận hành",
					"Bộ phận quản lý",
				],
				chart: {
					type: "donut",
				},
				responsive: [
					{
						breakpoint: 480,
						options: {
							chart: {
								width: 200,
							},
							legend: {
								position: "bottom",
							},
						},
					},
				],
			},
			series_canXulybyday: [
				{
					data: [44, 55, 41, 37],
				},
				{
					data: [53, 32, 33, 52],
				},
				{
					data: [12, 17, 11, 9],
				},
				{
					data: [9, 7, 5, 8],
				},
				{
					data: [25, 12, 19, 32],
				},
			],
			chartOption_canXulybyday: {
				chart: {
					type: "bar",
					height: 400,
					stacked: true,
					toolbar: {
						// show: false,
						tools: {
							download: false,
						},
					},
				},
				plotOptions: {
					bar: {
						horizontal: true,
					},
				},
				xaxis: {
					categories: [
						"Nguyễn Văn A",
						"Nguyễn Văn B",
						"Nguyễn Văn C",
						"Nguyễn Văn D",
					],
				},

				fill: {
					opacity: 1,
				},
				legend: {
					show: false,
				},
			},
			series_canXulybystatus: [
				{
					data: [44, 55, 41, 37],
				},
				{
					data: [53, 32, 33, 52],
				},
				{
					data: [12, 17, 11, 9],
				},
				{
					data: [9, 7, 5, 8],
				},
				{
					data: [25, 12, 19, 32],
				},
			],
			chartOption_canXulybystatus: {
				chart: {
					type: "bar",
					height: 400,
					stacked: true,
					toolbar: {
						// show: false,
						tools: {
							download: false,
						},
					},
				},
				plotOptions: {
					bar: {
						horizontal: true,
					},
				},
				xaxis: {
					categories: [
						"Nguyễn Văn A",
						"Nguyễn Văn B",
						"Nguyễn Văn C",
						"Nguyễn Văn D",
					],
				},

				fill: {
					opacity: 1,
				},
				legend: {
					show: false,
				},
			},
			s_date_left: null,
			s_date_right: null,
			dateFormat: "MM/DD/yyyy",
			countRequestAll: 0,
			countAllThisWeek: 0,
			countAllNextWeek: 0,
			countReject: 0,
			startDay: null,
			endDay: null,
			listRequestByDay: [],

			listRequestByStatus: [],
			getByDay: {
				endDate: new Date(),
				requestGroupId: -1,
				startDate: new Date(),
				userId: -1,
				organizationIds: null,
			},
			getByStatus: {
				endDate: new Date(),
				requestGroupId: -1,
				startDate: new Date(),
				userId: -1,
				organizationIds: null,
			},
			getCanxulyByDay: {
				endDate: null,
				organizationId: 0,
				requestGroupId: 0,
				startDate: null,
				userId: this.getUserInfo().id,
			},
			dayFormat: "DD/MM",
			list_status: [],
			s_status: null,
			listType_chart: [
				{ name: this.$t("label.chart_donut"), key: "donut" },
				{ name: this.$t("label.chart_bar"), key: "bar" },
				{ name: this.$t("label.chart_line"), key: "line" },
			],
			tyep_chart: "donut",
			tyep_chart_canxuly: "bar",
			listOrganization: [],
			response_CanXuLy: [],
			listOrganizations: [],
			list_Organizations: [],
			listBodyAPI: {
				endDate: null,
				organizationId: null,
				organizationIds: null,
				requestGroupId: null,
				startDate: null,
				userId: this.getUserInfo().id,
			},
		};
	},
	computed: {
		formatModifyDateCanXuly() {
			if (!this.date_canxuly) {
				return "";
			}
			let values = `${this.date_canxuly}`.split(
				constant.values.DATE_RANGE_SEPARATOR,
			);
			let result = [];
			result = values.map((x) => {
				return moment(x).format("DD/MM/yyyy");
			});
			return result.join("~");
		},
		formatModifyDateFns() {
			if (!this.s_date_left) {
				return "";
			}
			let values = `${this.s_date_left}`.split(
				constant.values.DATE_RANGE_SEPARATOR,
			);
			let result = [];
			result = values.map((x) => {
				return moment(x).format("DD/MM/yyyy");
			});
			console.log("result", result);
			return result.join("~");
		},
		formatModifyDatePhieuCanXuly() {
			if (!this.s_date_left) {
				return "";
			}
			let values = `${this.s_date_left}`.split(
				constant.values.DATE_RANGE_SEPARATOR,
			);
			let result = [];
			result = values.map((x) => {
				return moment(x).format("DD/MM/yyyy");
			});
			return result.join("~");
		},
		formatModifyDateFnsRight() {
			if (!this.s_date_right) {
				return "";
			}
			let values = `${this.s_date_right}`.split(
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
		s_request_left(val) {
			///so van ban can xu ly
			this.s_request_left = val;
			this.getByDay.requestGroupId = val.id;
			this.getCountByDay();
		},
		s_request_right(val) {
			//phan loai theo trang thai
			this.s_request_right = val;
			this.getByStatus.requestGroupId = val.id;
			this.getCountByStatus();
		},
		s_organization_left(val) {
			this.s_organization_left = val;
			this.response_CanXuLy = [];
			this.getAllWithIdLead(val.id);
		},
		tyep_chart_canxuly(val) {
			this.tyep_chart_canxuly = val;
			if (val.includes("line")) {
				this.changeChartPhieuCanXuly();
			} else if (val.includes("donut")) {
				this.toastError(this.$t("error.error_type_chart"));
				this.tyep_chart_canxuly = "bar";
			} else {
				this.getAllWithIdLead();
			}
		},
		async list_Organizations(val) {
			if (val.length == 0) {
				(this.listBodyAPI = {
					endDate: null,
					organizationId: null,
					organizationIds: null,
					requestGroupId: null,
					startDate: null,
					userId: this.getUserInfo().id,
				}),
					(this.getByDay = {
						endDate: new Date(),
						requestGroupId: -1,
						startDate: new Date(),
						userId: -1,
						organizationIds: null,
					}),
					(this.getByStatus = {
						endDate: new Date(),
						requestGroupId: -1,
						startDate: new Date(),
						userId: -1,
						organizationIds: null,
					}),
					await this.load();
			}
		},
	},
	async mounted() {
		await this.load();
	},
	methods: {
		async load() {
			await this.getStartEndOfWeek();
			await this.GetAllOrganization();
			if (this.user_infor.leader) {
				this.getCanxulyByDay.startDate = this.startDay;
				this.getCanxulyByDay.requestGroupId = -1;
				this.getCanxulyByDay.endDate = this.endDay;
				this.getCanxulyByDay.userId = this.user_infor?.id;
				await this.getAllWithIdLead();
				await this.getAllOrganization();
			} else {
				// await this.countAllRequest();
				await this.countRequestAboutToExpire();
				await this.countRequestOverdue();
				await this.countRequestNeedHandle();
				await this.getRequestThisWeek();
				await this.getRequestNextWeek();
				this.getCountReject();
				this.getAllRequest();
				this.getAllStatus();
				// await this.getCountByDay();
			}
		},
		async getAllOrganization() {
			let response = await globalService.getData_Async(
				administratorAPI.API_GetOrganizationDashboard(
					this.user_infor?.leader.id,
				),
			);
			if (!response || !response.state) return;
			this.listOrganization = response.data;
		},
		async getAllWithIdLead(id_org = null) {
			this.chartOption_canXuly.xaxis.categories = [];
			this.series_canXuly = [];
			if (!id_org) {
				id_org = this.user_infor?.leader.id;
			}
			this.getCanxulyByDay.organizationId = id_org;
			let response;
			try {
				if (!this.response_CanXuLy.length) {
					response = await globalService.postData_Async(
						administratorAPI.API_DashboardLead(),
						this.getCanxulyByDay,
					);
					if (!response || !response.state) return;
					this.response_CanXuLy = response.data;
				}
			} catch (error) {
				console.log(error);
			}
			if (this.response_CanXuLy && this.response_CanXuLy.length > 0) {
				for (const ele of this.response_CanXuLy[0].listStatistic) {
					this.series_canXuly.push({
						name: ele.name,
						data: [],
					});
				}
			}
			this.response_CanXuLy.forEach((entry) => {
				this.chartOption_canXuly.xaxis.categories.push(entry.name);
				for (let i = 0; i < entry.listStatistic.length; i++) {
					this.series_canXuly[i].data.push(
						entry.listStatistic[i].count,
					);
				}
			});
			if (this.$refs.chart_bar_canXuly) {
				this.$refs.chart_bar_canXuly.updateOptions({
					xaxis: {
						categories: this.chartOption_canXuly.xaxis.categories,
					},
				});
			}
		},
		async getAllStatus() {
			try {
				let response = await globalService.getData_Async(
					administratorAPI.API_GetAllStatus(),
				);
				if (!response || !response.state) return;
				this.list_status = response.data.filter((entry) => {
					return !entry.isDelete;
				});
				this.list_status.unshift({ id: -1, statusName: "Tất cả" });
			} catch (error) {
				console.log(error);
			}
		},
		async countAllRequest() {
			try {
				let response = await globalService.getData_Async(
					administratorAPI.API_CountRequestDataOfUser(
						this.user_infor.id,
					),
				);
				if (!response || !response.state) {
					return;
				}
				this.countRequestAll = response.data;
			} catch (error) {
				console.log(error);
			}
		},
		async countRequestDataDrafting() {
			try {
				let response = await globalService.getData_Async(
					administratorAPI.API_GetCountRequestDrafting(
						this.user_infor.id,
					),
				);
				if (!response || !response.state) {
					return this.toastError(this.$t("error.load"));
				}
				this.countRequestDrafting = response.data;
			} catch (error) {
				console.log(error);
			}
		},
		async countRequestAboutToExpire() {
			try {
				let response = await globalService.postData_Async(
					administratorAPI.API_CountAboutToExpire(),
					this.listBodyAPI,
				);
				if (!response || !response.state) {
					return this.toastError(this.$t("error.load"));
				}
				this.countRequestAboutTo = response.data;
			} catch (error) {
				console.log(error);
			}
		},
		async countRequestOverdue() {
			try {
				let response = await globalService.postData_Async(
					administratorAPI.API_CountOverdue(),
					this.listBodyAPI,
				);
				if (!response || !response.state) {
					return this.toastError(this.$t("error.load"));
				}
				this.countRequestOver = response.data;
			} catch (error) {
				console.log(error);
			}
		},
		async countRequestNeedHandle() {
			try {
				let response = await globalService.postData_Async(
					administratorAPI.API_CountAllNeedHandle(),
					this.listBodyAPI,
				);
				if (!response || !response.state) {
					return this.toastError(this.$t("error.load"));
				}
				this.countRequestHandle = response.data;
			} catch (error) {
				console.log(error);
			}
		},
		getCountReject() {
			globalService
				.postData_NoAsync(
					administratorAPI.API_CountAllGiveBack(),
					this.listBodyAPI,
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
					this.countReject = response.data.data;
					this.countRequestAll =
						this.countRequestAboutTo +
						this.countRequestOver +
						this.countRequestHandle +
						this.countReject;
				});
		},
		async getAllRequest() {
			try {
				let response = await globalService.getData_Async(
					administratorAPI.API_GetAllRequestGroup(),
				);
				if (!response || !response.state) return;
				this.listRequest = response.data.filter((entry) => {
					return !entry.isDelete && entry.isActive;
				});
				this.listRequest.unshift({
					id: -1,
					requestGroupName: "Tất cả",
				});
				this.s_request_left = this.s_request_right =
					this.listRequest[0];
			} catch (error) {
				console.log(error);
			}
		},
		getStartEndOfWeek() {
			this.startDay = moment().startOf("isoWeek").toDate();
			this.endDay = moment().endOf("isoWeek").toDate();
			let start = moment(
				new Date(this.startDay).setUTCHours(0, 0, 0),
			).toDate();
			let end = moment(
				new Date(this.endDay).setUTCHours(0, 0, 0),
			).toDate();
			this.getByDay.startDate = start;
			this.getByDay.endDate = end;
			this.getByDay.userId = this.user_infor.id;
			this.getByStatus.startDate = start;
			this.getByStatus.userId = this.user_infor.id;
			this.getByStatus.endDate = end;
		},
		async getRequestThisWeek() {
			let _obj = {
				endDate: moment(this.endDay).toDate().setUTCDate(0, 0, 0, 0),
				requestGroupId: -1,
				startDate: moment(this.startDay)
					.toDate()
					.setUTCDate(0, 0, 0, 0),
				userId: this.user_infor.id,
			};
			try {
				let response = await globalService.postData_Async(
					administratorAPI.API_GetStatistic(),
					_obj,
				);
				if (!response || !response.state) return;
				this.countAllThisWeek = response.data;
			} catch (error) {
				console.log(error);
			}
		},
		async changeGetbyDay() {
			this.getByDay.startDate = moment(
				new Date(this.s_date_left[0]).setUTCHours(0, 0, 0, 0),
			).toDate();
			this.getByDay.endDate = moment(
				new Date(this.s_date_left[1]).setUTCHours(0, 0, 0, 0),
			).toDate();
			this.menu_left = false;
			await this.getCountByDay();
		},
		async getCountByDay() {
			console.log("getCountByDay");
			this.series_line[0].data = [];
			this.chartOptions_line.xaxis.categories = [];
			try {
				let response = await globalService.postData_Async(
					administratorAPI.API_GetStatisticByDay(),
					this.getByDay,
				);
				if (!response || !response.state) return;
				this.listRequestByDay = this.sortListDashboard(response.data);
				this.listRequestByDay.forEach((ele) => {
					this.series_line[0].data.push(ele.count);
					this.chartOptions_line.xaxis.categories.push(
						moment(ele.name).format(this.dayFormat).toString(),
					);
				});
				if (this.$refs.chart_line) {
					this.$refs.chart_line.updateOptions({
						xaxis: {
							categories: this.chartOptions_line.xaxis.categories,
						},
					});
				}
			} catch (error) {
				console.log(error);
			}
		},
		async changeGetbyStatus() {
			this.getByStatus.startDate = moment(
				new Date(this.s_date_right[0]).setUTCHours(0, 0, 0, 0),
			).toDate();
			this.getByStatus.endDate = moment(
				new Date(this.s_date_right[1]).setUTCHours(0, 0, 0, 0),
			).toDate();
			this.menu_right = false;
			await this.getCountByStatus();
		},
		async getCountByStatus() {
			console.log("getCountByStatus");

			this.series_donut_right = [];
			this.chartOptions_donut_right.labels = [];
			try {
				let response = await globalService.postData_Async(
					administratorAPI.API_GetStatisticByStatus(),
					this.getByStatus,
				);
				if (!response || !response.state) return;
				this.listRequestByStatus = response.data;
				this.listRequestByStatus.forEach((ele) => {
					this.series_donut_right.push(ele.count);
					this.chartOptions_donut_right.labels.push(ele.name);
				});
			} catch (error) {
				console.log(error);
			}
		},
		sortListDashboard(arrRequest) {
			return arrRequest.sort((a, b) => {
				return (
					moment(a.name).toDate().getTime() -
					moment(b.name).toDate().getTime()
				);
			});
		},
		async getRequestNextWeek() {
			let start = moment(this.startDay)
				.toDate()
				.setDate(moment(this.startDay).toDate().getDate() + 7);
			let end = moment(this.endDay)
				.toDate()
				.setDate(moment(this.endDay).toDate().getDate() + 7);

			let _obj = {
				endDate: moment(end).toDate().setUTCHours(0, 0, 0, 0),
				requestGroupId: -1,
				startDate: moment(start).toDate().setUTCHours(0, 0, 0, 0),
				userId: this.user_infor.id,
			};
			console.log("_obj 222", _obj);
			try {
				let response = await globalService.postData_Async(
					administratorAPI.API_GetStatistic(),
					_obj,
				);
				if (!response || !response.state) return;
				this.countAllNextWeek = response.data;
			} catch (error) {
				console.log(error);
			}
		},
		changeCanXuly() {
			this.menu_date_canxuly = false;
			this.response_CanXuLy = [];
			this.getCanxulyByDay.startDate = moment(
				new Date(this.date_canxuly[0]).setUTCHours(0, 0, 0, 0),
			).toDate();
			this.getCanxulyByDay.endDate = moment(
				new Date(this.date_canxuly[1]).setUTCHours(0, 0, 0, 0),
			).toDate();
			if (this.tyep_chart_canxuly == "bar") {
				this.getAllWithIdLead();
			} else {
				this.tyep_chart_canxuly = "bar";
			}
		},
		changeChartPhieuCanXuly() {
			this.chartOption_canXuly.xaxis.categories = [];
			this.series_canXuly = [];
			if (this.response_CanXuLy && this.response_CanXuLy.length > 0) {
				for (const ele of this.response_CanXuLy[0].listStatistic) {
					this.chartOption_canXuly.xaxis.categories.push(ele.name);
				}
				for (const entry of this.response_CanXuLy) {
					let _obj = {
						name: entry.name,
						data: [],
					};
					for (const _count of entry.listStatistic) {
						_obj.data.push(_count.count);
					}
					this.series_canXuly.push(_obj);
				}
			}
			if (this.$refs.chart_bar_canXuly) {
				this.$refs.chart_bar_canXuly.updateOptions({
					xaxis: {
						categories: this.chartOption_canXuly.xaxis.categories,
					},
				});
			}
		},
		changedatePhieucanxuly() {},
		selectRequestChartTrangThai(item) {
			console.log(item);
		},
		async GetAllOrganization() {
			try {
				let response = await globalService.getData_Async(
					administratorAPI.API_GetAllOrganizationWithRole(
						this.user_infor.id,
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
		async seachOrganizations() {
			console.log("list_Organizations 1995", this.list_Organizations);
			this.getByDay.organizationIds = this.list_Organizations.map(
				(e) => e.id,
			);
			this.getByStatus.organizationIds = this.list_Organizations.map(
				(e) => e.id,
			);
			this.listBodyAPI.organizationIds = this.list_Organizations.map(
				(e) => e.id,
			);
			await this.getCountByDay();
			await this.getCountByStatus();
			await this.countRequestAboutToExpire();
			await this.countRequestOverdue();
			await this.countRequestNeedHandle();
			this.getCountReject();
		},
	},
};
</script>
<style scoped>
.w-1 {
	min-width: 10rem;
}
.v-menu__content {
	max-width: 20vw !important;
}
</style>
