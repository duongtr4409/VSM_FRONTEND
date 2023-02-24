<template>
	<v-card elevation="0">
		<BreadcrumbsVue />
		<v-row>
			<v-col cols="12" md="8"
				><v-tabs v-model="tab" color="primary">
					<!-- <v-tab key="general_information">
						{{ $t("tab.general_information") }}
					</v-tab> -->
					<v-tab key="general_informationV2">
						{{ $t("tab.general_information") }}
					</v-tab>
					<v-tab :disabled="!requestDto.id" key="detail">
						{{ $t("tab.configuration_form") }}
					</v-tab>
					<v-tab :disabled="!requestDto.id" key="editfilename" v-if="FEATURE.IMPORT_CODE_FILE_NAME">
						{{ $t("title.rule_configuration_file") }}
					</v-tab>
	
					<!-- <v-tab :disabled="!requestDto.id" key="storage">
						{{ $t("tab.storage") }}
					</v-tab> -->
					<v-tab :disabled="!requestDto.id" key="cauhinhbieumau">
						{{ $t("label.configuration_Temp") }}
					</v-tab>
					<v-tab :disabled="!requestDto.id" key="cauhinhsap">
						{{ $t("label.configuration_SAP") }}
					</v-tab>
				</v-tabs>
			</v-col>
			<v-col cols="12" md="4">
				<v-btn
					class="float-right rounded-0"
					text
					to="/quan-tri/quan-tri-nhom-loai-yeu-cau"
				>
					<v-icon> mdi-keyboard-backspace</v-icon>
					{{ $t("button.back") }}
				</v-btn>
			</v-col>
		</v-row>
		<v-divider></v-divider>
		<v-tabs-items v-model="tab">
			<!-- <v-tab-item key="general_information">
				<EditRequestGeneralInformationVue
					:requestDto="requestDto"
					@save="onSaveRequestDto"
				/>
			</v-tab-item> -->
			<v-tab-item key="general_informationV2">
				<EditRequestGeneralInformationV2Vue
					:requestDto="requestDto"
					:requestGroupCreate="
						requestGroupCreate ? requestGroupCreate : null
					"
					@save="onSaveRequestV2Dto"
				/>
			</v-tab-item>
			<v-tab-item v-if="!!requestDto.id" key="detail">
				<EditRequestDetailVue
					:requestDto="requestDto"
					@save="onSaveForm"
				/>
			</v-tab-item>
			<v-tab-item
				v-if="!!requestDto.id && !!requestDto.form && FEATURE.IMPORT_CODE_FILE_NAME"
				key="editfilename"
			>
				<EditFileNameVue
					:requestDto="requestDto"
					@save="onSaveFileName"
				/>
			</v-tab-item>
			<!-- <v-tab-item v-if="!!requestDto.id" key="storage">
				<EditRequestStorageVue
					:requestDto="requestDto"
					@save="onSaveForm"
				/>
			</v-tab-item> -->
			<v-tab-item
				v-if="!!requestDto.id && !!requestDto.form"
				key="cauhinhbieumau"
			>
				<CauHinhBieuMauVue
					:requestDto="requestDto"
					:Form="form"
					@save="onSaveTemplate"
				/>
			</v-tab-item>
			<v-tab-item
				v-if="!!requestDto.id && !!requestDto.form"
				key="cauhinhsap"
			>
				<CauHinhSAPVue
					:requestDto="requestDto"
					:form="requestDto.form"
					@save="onSaveSharp"
				/>
			</v-tab-item>
		</v-tabs-items>
	</v-card>
</template>

<script>
import EditRequestDetailVue from "./EditRequestDetail.vue";
// import EditRequestGeneralInformationVue from "./EditRequestGeneralInformation.vue";
import EditRequestGeneralInformationV2Vue from "./EditRequestGeneralInformationV2.vue";
import CauHinhBieuMauVue from "./CauHinhBieuMau.vue";
import RequestDto from "@/models/request.dto";
import globalService from "@/services/global.service";
import administratorAPI from "../administrator.api";
// import EditRequestStorageVue from "./EditRequestStorage.vue";
import BreadcrumbsVue from "@/components/Breadcrumbs.vue";
import CauHinhSAPVue from "./CauHinhSAP.vue";
import EditFileNameVue from './EditFileName.vue';


export default {
	name: "EditRequestVue",
	components: {
		// EditRequestGeneralInformationVue,
		EditRequestGeneralInformationV2Vue,
		EditRequestDetailVue,
		// EditRequestStorageVue,
		EditFileNameVue,
		CauHinhBieuMauVue,
		CauHinhSAPVue,
		BreadcrumbsVue,
	},
	data() {
		return {
			requiredRules: [(v) => !!v || this.$t("message.msg_1")],
			requestDto: RequestDto,
			tab: null,
			requestGroups: [],
			requestTypes: [],
			processInfos: [],
			templateForms: [],
			response_EForm_Id: null,
			form: [],
			requestGroupCreate: null,
		};
	},

	created() {
		this.$Progress.start();
		this.init();
		if (this.$router.currentRoute.params.data) {
			this.requestGroupCreate = this.$router.currentRoute.params.data;
		}
	},
	mounted() {
		this.$Progress.finish();
	},
	methods: {
		async init() {
			await this.getRequest();
		},
		async getRequest() {
			if (!this.$router.currentRoute.params.id) {
				this.requestDto = {
					created: null,
					createdDate: new Date(),
					createdName: "",
					description: "",
					directoryPath: "",
					form: null,
					id: null,
					isActive: true,
					isDelete: false,
					modified: null,
					modifiedDate: new Date(),
					modifiedName: "",
					numberRequestData: 0,
					processInfo: null,
					requestCode: "",
					requestGroup: null,
					requestName: "",
					requestType: null,
					templateForms: [],
					tennant: null,
					tennantCode: "",
					tennantName: "",
				};
				return;
			} else {
				let response;
				try {
					response = await globalService.getData_Async(
						administratorAPI.API_GetRequest(
							this.$router.currentRoute.params.id,
						),
					);
					if (!response || !response.state) {
						return this.toastError(this.$t("error.load"));
					}
					this.requestDto = response.data;
					// this.m_update();
				} catch (error) {
					// //this.toastError(error);
				}
			}
		},	
		onSaveRequestDto(value) {
			this.requestDto = value;
			this.tab = 1;
		},
		onSaveRequestV2Dto(value) {
			this.requestDto = value;
			this.tab = 1;
		},
		onSaveForm(value) {
			if (value.save) {
				this.response_EForm_Id = value.eformId;
				this.form = value.form_;
				this.tab = 2;
				this.saveRequest();
			}
		},
		onSaveFileName(value) {
			if (value) {
				this.requestDto = value;
			}
		},
		onSaveTemplate(value) {
			console.log(value);
		},
		onSaveSharp(value) {
			console.log(value);
		},
		async saveRequest() {
			try {
				this.requestDto.form = {
					id: null,
				};
				this.requestDto.form.id = this.response_EForm_Id;
				let response_quest = await globalService.putData_Async(
					"/api/requests/" + this.requestDto.id,
					this.requestDto,
				);
				if (response_quest.state) {
					this.toastSuccess(this.$t("message.success"));
				} else {
					this.toastError(this.$t("message.error"));
				}
			} catch (error) {
				console.log(error);
			}
		},
	},
};
</script>

<style></style>
