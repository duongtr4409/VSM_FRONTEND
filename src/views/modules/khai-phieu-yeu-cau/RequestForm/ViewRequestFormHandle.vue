<template>
	<v-card elevation="0" v-if="requestData">
		<v-row class="mx-0">
			<v-col cols="12" md="12">
				<v-card elevation="0">
					<div class="flex mb-2 pb-2">
						<strong class="my-2 mx-5">
							<v-icon class="font-bold mr-2" color="blue darken-1"
								>mdi-ticket-confirmation</v-icon
							>
							{{ requestData.requestDataCode }}
						</strong>
						<strong class="my-2 mx-5">
							<v-icon class="font-bold mr-2" color="blue darken-1"
								>mdi-collage</v-icon
							>
							{{ requestData.requestGroupName }}
						</strong>
						<strong
							class="my-2 mx-5"
							v-if="requestData.requestTypeName"
						>
							<v-icon class="font-bold mr-2" color="blue darken-1"
								>mdi-water-percent</v-icon
							>
							{{ requestData.requestTypeName }}
						</strong>
						<strong
							class="my-2 mx-5"
							v-if="requestData.signTypeName"
						>
							<v-icon class="font-bold mr-2" color="blue darken-1"
								>mdi-clipboard-text</v-icon
							>
							{{ requestData.signTypeName }}
						</strong>
						<strong
							class="my-2 mx-5"
							v-if="DEBUG || requestData.contractNumber"
						>
							<v-icon color="blue darken-1"
								>mdi-file-sign
							</v-icon>
							{{ requestData.contractNumber }}
							<v-chip color="blue darken-1" x-small dark>
								{{ $t("label.sap") }}
							</v-chip>
						</strong>
						<v-spacer></v-spacer>
						<v-btn
							x-small
							class="my-1 pr-1 mr-4 justify-end"
							fab
							outlined
							@click="backRedirect()"
						>
							<v-icon> mdi-arrow-left </v-icon>
						</v-btn>
						<!-- <v-spacer></v-spacer>
						<v-btn
							class="my-2 pr-2 justify-end"
							color="red"
							text
							icon
							@click="redirectBack()"
						>
							<v-icon> mdi-subdirectory-arrow-left </v-icon>
						</v-btn> -->
						<!-- /////// -->
						<!-- <v-btn class="mx-2 my-0" depressed>{{
								requestData.requestDataCode
							}}</v-btn>
							<v-btn class="mx-2 my-0" depressed>{{
								requestData.requestGroupName
							}}</v-btn>
							<v-btn class="mx-2 my-0" depressed>{{
								requestData.requestTypeName
							}}</v-btn>
							<v-btn class="mx-2 my-0" depressed>{{
								requestData.signTypeName
							}}</v-btn> -->
					</div>
					<v-row>
						<v-col cols="6">
							<v-tabs v-model="tab" color="primary">
								<v-tab key="Declaration">
									{{ $t('label.information') }}
								</v-tab>

								<!-- <v-tab key="Procedure">
									{{ "Quy Trình " }}
								</v-tab> -->
								<v-tab
									key="a"
									v-if="requestData.signTypeCode === '0'"
								>
									{{ $t("label.digital_sign_information") }}
								</v-tab>
								<v-tab
									key="b"
									v-if="requestData.signTypeCode === '1'"
								>
									{{ $t('label.manage_stamp') }}
								</v-tab>
							</v-tabs>
						</v-col>
						<v-col cols="6" md="6">
							<!-- <div class="float-right">
								<v-btn
									class="mx-2 my-0"
									text
									color="back"
									small
									rounded-pill
									@click="redirectBack()"
								>
									<v-icon>mdi-subdirectory-arrow-left</v-icon>
									Quay lại
								</v-btn>
							</div> -->
						</v-col>
					</v-row>
					<v-divider></v-divider>
					<v-col>
						<v-tabs-items v-model="tab">
							<v-tab-item key="Declaration">
								<ViewXulyPhieu
									:requestDataV2="requestData"
									:isSaved="isSaving"
								>
								</ViewXulyPhieu>
							</v-tab-item>

							<!-- <v-tab-item key="Procedure">
								<ViewProcedureVue
									:isSaved="isSaving"
									:requestDataV2="requestData.id"
								></ViewProcedureVue>
							</v-tab-item> -->
							<v-tab-item
								key="b"
								v-if="requestData.signTypeCode === '0'"
							>
								<ViewDigitalSigntureInfoVue
									:requestDataId="requestData.id"
								></ViewDigitalSigntureInfoVue>
							</v-tab-item>
							<v-tab-item
								key="a"
								v-if="requestData.signTypeCode === '1'"
							>
								<ViewManagerStamVue
									:requestDataId="requestData.id"
								></ViewManagerStamVue>
							</v-tab-item>
						</v-tabs-items>
					</v-col>
				</v-card>
			</v-col>
		</v-row>
	</v-card>
</template>

<script>
import globalService from "@/services/global.service";
import administratorAPI from "../../administrator/administrator.api";
import ViewXulyPhieu from "./ViewXulyphieu.vue";
import ViewManagerStamVue from "./ViewManagerStam.vue";
import ViewDigitalSigntureInfoVue from "./ViewDigitalSigntureInfo.vue";
export default {
	name: "VSMFEViewRequestFormHandle",
	components: {
		ViewXulyPhieu,
		ViewManagerStamVue,
		ViewDigitalSigntureInfoVue,
	},

	data() {
		return {
			idRequestData: null,
			requestData: null,
			tab: 0,
			isSaving: {
				state: 0,
				idRequestData: 0,
				idProcessData: 0,
			},
		};
	},
	created() {
		this.idRequestData = this.$router.currentRoute.params.id;
	},
	mounted() {
		this.initialize();
	},
	methods: {
		async initialize() {
			if (this.$router.currentRoute.params.id) {
				await this.getRequestData();
			}
		},
		async getRequestData() {
			let response;
			try {
				response = await globalService.getData_Async(
					administratorAPI.API_GetRequestDataByID(this.idRequestData),
				);
				if (!response || !response.state) {
					return this.toastError(this.$t("error.load"));
				}
				this.requestData = response.data;
			} catch (error) {
				this.toastError(error);
				return;
			}
		},
		save() {
			this.isSaving = { state: 1 };
		},
		backRedirect() {
			this.$router.push({
				path: "/phieu-yeu-cau/list-request-wait-approval",
			});
		},
	},
};
</script>

<style lang="scss" scoped></style>
