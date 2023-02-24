<template>
	<v-card flat elevation="0" v-if="requestData">
		<!-- <vue-breadcrumbs /> -->

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
			<strong class="my-2 mx-5" v-if="requestData.requestTypeName">
				<v-icon class="font-bold mr-2" color="blue darken-1"
					>mdi-water-percent</v-icon
				>
				{{ requestData.requestTypeName }}
			</strong>
			<strong class="my-2 mx-5" v-if="requestData.signTypeName">
				<v-icon class="font-bold mr-2" color="blue darken-1"
					>mdi-clipboard-text</v-icon
				>
				{{ requestData.signTypeName }}
			</strong>
			<strong
				class="my-2 mx-5"
				v-if="DEBUG || requestData.contractNumber"
			>
				<v-icon color="blue darken-1">mdi-file-sign </v-icon>
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
				@click="redirectBack()"
			>
				<v-icon> mdi-arrow-left </v-icon>
			</v-btn>
			<!--<v-btn
				class="my-2 pr-2 justify-end grey lighten-2"
				color="red"
				text
				icon
				@click="redirectBack()"
			>
				<v-icon> mdi-subdirectory-arrow-left </v-icon>
			</v-btn> -->
			<!-- ///////// -->
			<!-- <v-btn class="mx-2 my-0" depressed text color="back">
					<v-icon>mdi-equal-box</v-icon
					>{{ requestData.requestDataCode }}
				</v-btn>
				<v-btn class="mx-2 my-0" depressed text color="back">
					<v-icon>mdi-collage</v-icon
					>{{ requestData.requestGroupName }}
				</v-btn>
				<v-btn class="mx-2 my-0" depressed text color="back">
					<v-icon>mdi-folder-open</v-icon
					>{{ requestData.requestTypeName }}
				</v-btn>
				<v-btn
					class="mx-2 my-0"
					depressed
					text
					color="back"
					v-if="requestData.signTypeName"
				>
					<v-icon>mdi-image-filter-frames</v-icon>
					{{ requestData.signTypeName }}
				</v-btn> -->
		</div>

		<v-row>
			<v-col cols="12" class="mt-[-1rem]">
				<vue-tab-2
					:tab="tab"
					@tab="(v) => (tab = v)"
					:tabs="tabs"
					:buttons="buttons"
					@buttonClick="handleButtonClick"
				></vue-tab-2>
			</v-col>
		</v-row>
		<v-col>
			<v-tabs-items v-model="tab">
				<v-tab-item key="Declaration">
					<XulyPhieuVue
						:requestDataV2="requestData"
						:is_reload="reload"
						:isSaved="isSaving"
						:m_Stamp="m_ManageStamp"
						:isShow="isShowDialog"
						@objectModel="updateObjectModel"
					>
					</XulyPhieuVue>
				</v-tab-item>
				<v-tab-item
					v-if="
						requestData.signTypeCode &&
						`${requestData.signTypeCode}`.includes('1')
					"
				>
					<ManagerStampVue
						:requestDataId="requestData"
						@handlerStamp="handleManageStamp"
					></ManagerStampVue>
				</v-tab-item>
				<v-tab-item
					v-if="
						requestData.signTypeCode &&
						`${requestData.signTypeCode}`.includes('0')
					"
				>
					<DigitalSignatureInfoVue
						:requestDataId="requestData"
					></DigitalSignatureInfoVue>
				</v-tab-item>
			</v-tabs-items>
		</v-col>

		<v-dialog v-model="dialog.review" width="60vw" persistent>
			<ReviewRequestFormVue
				:request="requestData"
				:stepdatas="stepDatas"
				@close="onCloseDialog"
				@save="onSaveReview"
			/>
		</v-dialog>
		<v-dialog v-model="dialog.refuse" width="60vw" persistent>
			<RefuseRequestFormVue
				persistent
				:request="requestData"
				@close="onCloseDialog"
			/>
		</v-dialog>
		<v-dialog v-model="dialog.status" width="60vw" persistent>
			<StatusRequestFormVue
				persistent
				:request="requestData"
				@close="onCloseDialog"
			/>
		</v-dialog>
		<v-dialog v-model="dialog.askForOpinions" width="60vw" persistent>
			<AskForOpinionsRequestFormVue
				persistent
				:request="requestData"
				@close="onCloseDialog"
			/>
		</v-dialog>
		<v-dialog v-model="dialog.answer" width="60vw" persistent>
			<AnswerRequestFormVue
				persistent
				:request="requestData"
				@close="onCloseDialog"
			/>
		</v-dialog>
		<v-dialog v-model="dialog.documentProcess" width="60vw" persistent>
			<DocumentProcessVue
				persistent
				:request="requestData"
				@close="onCloseDialog"
				@save="onDocumentProcess"
			/>
		</v-dialog>
		<v-dialog v-model="dialog.sendInformation" width="60vw" persistent>
			<SendInformationRequestFormVue
				persistent
				:request="requestData"
				@close="onCloseDialog"
			/>
		</v-dialog>
		<v-dialog v-model="dialog.createOtp" width="60vw" persistent>
			<CreateOTPVue
				persistent
				:request="requestData"
				@close="onCloseDialog"
			/>
		</v-dialog>
		<v-dialog v-model="dialog.signture" width="60vw" persistent>
			<DigitalSignRequestFormVue
				:isShow="dialog.signture"
				persistent
				:request="requestData"
				@close="onCloseDialog"
			/>
		</v-dialog>
		<v-dialog v-model="dialog.return" width="60vw" persistent>
			<ReturnRequestFormVue
				persistent
				:request="requestData"
				@close="onCloseDialog"
			/>
		</v-dialog>
		<v-dialog v-model="dialog.approve" width="60vw" persistent>
			<ApproveRequestFormV2Vue
				persistent
				:request="requestData"
				:listStepData="listAllStepData"
				:stepDataOne="stepData"
				:isShow="dialog.approve"
				:objectModel="objectModel"
				@close="onCloseDialog"
			/>
		</v-dialog>
		<v-dialog v-model="dialog.processDoc" width="60vw" persistent>
			<ResendProcessVue
				persistent
				:request="requestData"
				@close="onCloseDialog"
			/>
		</v-dialog>
		<v-dialog v-model="dialog.sendEmail" width="60vw" persistent>
			<SendEmailV2Vue
				persistent
				:request="requestData"
				@close="onCloseDialog"
			/>
		</v-dialog>
		<v-dialog v-model="dialog.sendNotice" width="60vw" persistent>
			<SendNoticeVue
				persistent
				:request="requestData"
				@close="onCloseDialog"
			/>
		</v-dialog>
		<v-dialog v-model="dialog.exportFile" width="60vw" persistent>
			<ExportFile
				persistent
				:request="requestData"
				@close="onCloseDialog"
			/>
		</v-dialog>
		<v-dialog v-model="dialog.recovery" width="60vw" persistent>
			<RecoveryRequestVue
				persistent
				:request="requestData"
				@close="onCloseDialog"
			/>
		</v-dialog>
		<v-dialog v-model="dialog.cancelApproval" width="60vw" persistent>
			<CancelApprovalVue
				persistent
				:request="requestData"
				@close="onCloseDialog"
			/>
		</v-dialog>
		<v-dialog v-model="dialog.pleaseRecovery" width="60vw" persistent>
			<PleaseRecoveryRequestVue
				persistent
				:request="requestData"
				@close="onCloseDialog"
			/>
		</v-dialog>
	</v-card>
</template>

<script>
import globalService from "@/services/global.service";
import administratorAPI from "../../administrator/administrator.api";
import ReviewRequestFormVue from "../modulepopup/ReviewRequestForm.vue";
import RefuseRequestFormVue from "../modulepopup/RefuseRequestForm.vue";
import StatusRequestFormVue from "../modulepopup/StatusRequestForm.vue";
import AskForOpinionsRequestFormVue from "../modulepopup/AskForOpinionsRequestForm.vue";
import AnswerRequestFormVue from "../modulepopup/AnswerRequestForm.vue";
import DigitalSignRequestFormVue from "../modulepopup/DigitalSignRequestForm.vue";
import ReturnRequestFormVue from "../modulepopup/ReturnRequestForm.vue";
import ApproveRequestFormV2Vue from "../modulepopup/ApproveRequestFormV2.vue";
import ResendProcessVue from "../modulepopup/ResendProcess.vue";
import DocumentProcessVue from "../modulepopup/DocumentProcess.vue";
import SendInformationRequestFormVue from "../modulepopup/SendInformationRequestForm.vue";
import CreateOTPVue from "../modulepopup/CreateOTP.vue";
import SendEmailV2Vue from "../modulepopup/sendEmailV2.vue";
import SendNoticeVue from "../modulepopup/SendNotice.vue";
import ManagerStampVue from "./ManagerStamp.vue";
import DigitalSignatureInfoVue from "./DigitalSignatureInfo.vue";
import XulyPhieuVue from "./XulyPhieu.vue";
import ExportFile from "../modulepopup/Exportfile.vue";
import RecoveryRequestVue from "../modulepopup/PleaseRecoveryRequestV2.vue";
import CancelApprovalVue from "../modulepopup/CancelApproval.vue";
import PleaseRecoveryRequestVue from "../modulepopup/PleaseRecoveryRequest.vue";

export default {
	name: "VSMFENewRequestTypeV2",
	components: {
		XulyPhieuVue,
		ApproveRequestFormV2Vue,
		ResendProcessVue,
		AskForOpinionsRequestFormVue,
		AnswerRequestFormVue,
		DocumentProcessVue,
		SendInformationRequestFormVue,
		CreateOTPVue,
		ReviewRequestFormVue,
		RefuseRequestFormVue,
		StatusRequestFormVue,
		DigitalSignRequestFormVue,
		ReturnRequestFormVue,
		SendEmailV2Vue,
		SendNoticeVue,
		ManagerStampVue,
		DigitalSignatureInfoVue,
		ExportFile,
		RecoveryRequestVue,
		CancelApprovalVue,
		PleaseRecoveryRequestVue,
	},

	data() {
		return {
			requestRecall: [],
			user_info: this.getUserInfo(),

			//
			isReview: false,
			isDocumentProcess: false,

			stepData: {},
			stepDatas: [], // bước hiện tại của quy trình
			idRequestData: null,
			requestData: null,
			dialog: {
				approve: false,
				processDoc: false,
				sendEmail: false,
				sendNotice: false,
				return: false,
				review: false,
				signture: false,
				refuse: false,
				status: false,
				askForOpinions: false,
				answer: false,
				documentProcess: false,
				sendInformation: false,
				createOtp: false,
				exportFile: false,
				cancelApproval: false,
				recovery: false,
				pleaseRecovery: false,
			},
			m_ManageStamp: null,
			reload: false,
			tab: 0,
			listAllStepData: [],
			isSaving: {
				state: 0,
				idRequestData: 0,
				idProcessData: 0,
			},
			isShowDialog: { state: false },
			tabs: [
				{ key: "Declaration", title: this.$t("title.create_folder") },
				// // { key: "Procedure", title: this.$t("tab.process_") },
				// { key: "b", title: this.$t("label.digital_sign_information") },
				// { key: "a", title: this.$t("label.manage_stamp") },
			],
			buttons: [
				// {
				// 	name: "isApprove",
				// 	icon: "mdi-content-save-all",
				// 	title: this.$t("button.save"),
				// 	color: "blue",
				// 	transparent: true,
				// 	dark: false,
				// 	event: this.save,
				// 	isShow: false,
				// },
				// {
				// 	icon: "mdi-subdirectory-arrow-left",
				// 	title: this.$t("button.back"),
				// 	color: "red",
				// 	transparent: true,
				// 	dark: false,
				// 	event: this.redirectBack,
				// 	isShow: true,
				// },
				{
					name: "isExamine",
					icon: "mdi-clipboard-outline",
					title: this.$t("label.request_review"),
					color: "",
					transparent: true,
					dark: false,
					event: this.openRequestReview,
				},
				{
					name: "isDeny",
					icon: "mdi-clipboard-outline",
					title: this.$t("label.deny"),
					color: "",
					transparent: true,
					dark: false,
					event: this.openRefuse,
					isShow: false,
				},
				// {
				// 	icon: "mdi-email",
				// 	title: this.$t("button.send_email"),
				// 	color: "",
				// 	transparent: true,
				// 	dark: false,
				// 	event: this.sendEmail,
				// },
				{
					icon: "mdi-sync",
					title: this.$t("button.resend_process"),
					color: "",
					transparent: true,
					dark: false,
					event: this.processDoc,
					isShow: false,
				},
				{
					name: "isSendNoticePriority",
					icon: "mdi-comment-alert-outline",
					title: this.$t("button.send_notice"),
					color: "",
					transparent: true,
					dark: false,
					event: this.sendNotice,
					isShow: true,
				},
				{
					name: "isRequiredSignature",
					icon: "mdi-clipboard-account",
					title: this.$t("label.is_required_signature"),
					color: "",
					transparent: true,
					dark: false,
					event: this.openSignature,
					isShow: false,
				},
				{
					name: "isBack",
					icon: "mdi-block-helper",
					title: this.$t("button.return"),
					color: "",
					transparent: true,
					dark: false,
					event: this.openReturn,
					isShow: false,
				},
				{
					name: "isApprove",
					icon: "mdi-check",
					title: this.$t("label.approve"),
					color: "",
					transparent: true,
					dark: false,
					event: this.openApprove,
					isShow: false,
				},
				// {
				// 	icon: "mdi-pencil-circle",
				// 	title: this.$t("label.edit_status"),
				// 	color: "",
				// 	transparent: true,
				// 	dark: false,
				// 	event: this.openStatus,
				// },
				{
					icon: "mdi-pencil-circle",
					title: this.$t("label.ask_for_opinions"),
					color: "",
					transparent: true,
					dark: false,
					event: this.openAskForOpinions,
					isShow: false,
					name: "isConsult",
				},
				{
					icon: "mdi-pencil-circle",
					title: this.$t("button.answer"),
					color: "",
					transparent: true,
					dark: false,
					event: this.openAnswer,
					isShow: false,
				},
				{
					name: "isProcessSaveDoc",
					icon: "mdi-pencil-circle",
					title: this.$t("button.dispatch_handling"),
					color: "",
					transparent: true,
					dark: false,
					event: this.openDocumentProcess,
					isShow: false,
				},
				{
					icon: "mdi-content-paste",
					title: this.$t("button.send_information"),
					color: "",
					transparent: true,
					dark: false,
					event: this.openSendInformation,
					isShow: false,
				},
				{
					name: "isCreateOTPLink",
					icon: "mdi-content-paste",
					title: this.$t("button.create_otp"),
					color: "",
					transparent: true,
					dark: false,
					event: this.openCreateOTP,
					isShow: false,
				},
				// {
				// 	name: "isExportPDF",
				// 	icon: "mdi-export",
				// 	title: this.$t("button.export_file"),
				// 	color: "",
				// 	transparent: true,
				// 	dark: false,
				// 	event: this.exportFile,
				// 	isShow: true,

				// },
				{
					icon: "mdi-export",
					title: this.$t("button.cancelApproval"),
					color: "",
					transparent: true,
					dark: false,
					event: this.cancelApproval,
					isShow: false,
				},
				// {
				// 	icon: "mdi-export",
				// 	title: this.$t("button.recovery"),
				// 	color: "",
				// 	transparent: true,
				// 	dark: false,
				// 	event: this.recovery,
				// 	isShow: false,
				// },
				{
					icon: "mdi-export",
					title: this.$t("button.pleaseRecovery"),
					color: "",
					transparent: true,
					dark: false,
					event: this.pleaseRecovery,
					isShow: false,
					// name: "isProcessRecover",
				},
			],
			objectModel: {},
		};
	},
	watch: {
		"dialog.approve"(value) {
			this.isShowDialog = { state: value };
			// this.initialize();
		},

		"dialog.processDoc"(value) {
			this.isShowDialog = { state: value };
			if (!value) {
				this.initialize();
			}
		},
		"dialog.sendEmail"(value) {
			this.isShowDialog = { state: value };
			// if (!value) {
			// 	this.initialize();
			// }
		},
		"dialog.sendNotice"(value) {
			this.isShowDialog = { state: value };
			// if (!value) {
			// 	this.initialize();
			// }
		},
		"dialog.return"(value) {
			this.isShowDialog = { state: value };
			// if (!value) {
			// 	this.initialize();
			// }
		},
		"dialog.review"(value) {
			this.isShowDialog = { state: value };
			if (!value) {
				this.initialize();
			}
		},
		"dialog.signture"(value) {
			this.isShowDialog = { state: value };
			// if (!value) {
			// 	this.initialize();
			// }
		},
		"dialog.refuse"(value) {
			this.isShowDialog = { state: value };
			// if (!value) {
			// 	this.initialize();
			// }
		},
		"dialog.status"(value) {
			this.isShowDialog = { state: value };
			// if (!value) {
			// 	this.initialize();
			// }
		},
		"dialog.askForOpinions"(value) {
			this.isShowDialog = { state: value };
			if (!value) {
				this.initialize();
			}
		},
		"dialog.answer"(value) {
			this.isShowDialog = { state: value };
			if (!value) {
				this.initialize();
			}
		},
		"dialog.documentProcess"(value) {
			this.isShowDialog = { state: value };
			// if (!value) {
			// 	this.initialize();
			// }
		},
		"dialog.sendInformation"(value) {
			this.isShowDialog = { state: value };
			// if (!value) {
			// 	this.initialize();
			// }
		},
		"dialog.createOtp"(value) {
			this.isShowDialog = { state: value };
			// if (!value) {
			// 	this.initialize();
			// }
		},
		"dialog.exportFile"(value) {
			this.isShowDialog = { state: value };
			// if (!value) {
			// 	this.initialize();
			// }
		},
		"dialog.cancelApproval"(value) {
			this.isShowDialog = { state: value };
			// if (!value) {
			// 	this.initialize();
			// }
		},
		"dialog.recovery"(value) {
			this.isShowDialog = { state: value };
			// if (!value) {
			// 	this.initialize();
			// }
		},
		"dialog.pleaseRecovery"(value) {
			this.isShowDialog = { state: value };
			// if (!value) {
			// 	this.initialize();
			// }
		},
	},
	created() {
		this.idRequestData = this.$router.currentRoute.params.id;
	},
	async mounted() {
		await this.initialize();
	},
	methods: {
		async initialize() {
			if (this.$router.currentRoute.params.id) {
				await this.getRequestData();
				this.getStepInProcessesByIdRequestData();
				this.getRequestRecall();
			}
		},
		async getRequestData() {
			let response;
			try {
				response = await globalService.getData_Async(
					administratorAPI.API_GetRequestDataByID(this.idRequestData),
				);
				if (!response || !response.state) {
					this.toastError(this.$t("error.load"));
				}
				this.requestData = response.data;
				if (this.requestData?.signTypeCode == "1") {
					this.tabs = [
						{
							key: "Declaration",
							title: this.$t("title.create_folder"),
						},
						// { key: "Procedure", title: this.$t("tab.process_") },
						// { key: "b", title: this.$t("label.digital_sign_information") },
						{ key: "a", title: this.$t("label.manage_stamp") },
					];
				}
				if (this.requestData?.signTypeCode == "0") {
					this.tabs = [
						{
							key: "Declaration",
							title: this.$t("title.create_folder"),
						},
						// { key: "Procedure", title: this.$t("tab.process_") },
						{
							key: "b",
							title: this.$t("label.digital_sign_information"),
						},
						// { key: "a", title: this.$t("label.manage_stamp") },
					];
				}

				// if (
				// 	this.requestData.userInfos.find(
				// 		(ele) => ele.id != this.user_info.id,
				// 	)
				// ) {
				// 	this.requestData = null;

				// 	this.toastError(this.$t("error.no_request"));
				// }
				
			} catch (error) {
				this.toastError(error);
				return;
			}
		},
		async getRequestRecall() {
			globalService
				.getData_NoAsync(
					administratorAPI.API_GetAllRequestRecallByRequestData(
						this.requestData.id,
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
					this.requestRecall = response.data.data.sort(
						(e1, e2) => e2.id - e1.id,
					);
					if (
						this.requestRecall[0] &&
						!this.requestRecall[0].processer
					) {
						this.buttons.push({
							icon: "mdi-export",
							title: this.$t("button.recovery"),
							color: "",
							transparent: true,
							dark: false,
							event: this.recovery,
							isShow: true,
						});
					}
				});
		},
		showButton() {
			if (!this.stepData) return;
			this.buttons = this.buttons.map((ele) => {
				if (this.stepData[ele.name]) {
					ele.isShow = true;
				} else if (this.stepData[ele.name] == undefined) {
					ele.isShow = !!ele.isShow;
				} else {
					ele.isShow = false;
				}
				return ele;
			});
		},
		save() {
			this.isSaving = { state: 1 };
		},
		openApprove() {
			this.dialog.approve = true;
		},
		openStatus() {
			this.dialog.status = true;
		},
		openAskForOpinions() {
			this.dialog.askForOpinions = true;
		},
		openAnswer() {
			this.dialog.answer = true;
		},
		openDocumentProcess() {
			this.dialog.documentProcess = true;
		},
		openSendInformation() {
			this.dialog.sendInformation = true;
		},
		openCreateOTP() {
			this.dialog.createOtp = true;
		},
		openRequestReview() {
			this.dialog.review = true;
		},
		openRefuse() {
			this.dialog.refuse = true;
		},
		openSignature() {
			this.dialog.signture = true;
		},
		openReturn() {
			this.dialog.return = true;
		},
		processDoc() {
			this.dialog.processDoc = true;
		},
		sendEmail() {
			this.dialog.sendEmail = true;
		},
		sendNotice() {
			this.dialog.sendNotice = true;
		},
		exportFile() {
			this.dialog.exportFile = true;
		},
		recovery() {
			this.dialog.recovery = true;
		},
		cancelApproval() {
			this.dialog.cancelApproval = true;
		},
		pleaseRecovery() {
			this.dialog.pleaseRecovery = true;
		},
		async handleButtonClick(event) {
			await event();
		},
		async getStepInProcessesByIdRequestData() {
			globalService
				.getData_NoAsync(
					administratorAPI.API_GetByCurrentSteps(this.idRequestData),
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
					this.listAllStepData = response.data.data;
					this.stepDatas = response.data.data.filter((ele) => {
						return ele.isActive;
					});

					this.stepData = this.stepDatas[0];
					this.showButton();
				});
		},
		handleManageStamp(value) {
			this.m_ManageStamp = null;
			this.reload = true;
			this.m_ManageStamp = value;
		},
		onSaveReview(value) {
			if (value) {
				this.isReview = true;
			}
		},
		onDocumentProcess(value) {
			if (value) {
				this.isDocumentProcess = true;
			}
		},
		updateObjectModel(value) {
			this.objectModel = value;
		},
	},
};
</script>

<style lang="scss" scoped></style>
