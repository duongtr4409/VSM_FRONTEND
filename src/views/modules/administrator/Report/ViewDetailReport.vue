<template>
	<v-card v-if="requestData">
		<!-- <vue-breadcrumbs /> -->
		<v-dialog v-model="dialog.sendInformation" width="60vw" persistent>
			<SendInformationRequestFormVue
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
		<v-dialog v-model="dialog.cancelApproval" width="60vw" persistent>
			<CancelApprovalVue
				persistent
				:request="requestData"
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
		<v-dialog v-model="dialog.recovery" width="60vw" persistent>
			<RecoveryRequestVue
				persistent
				:request="requestData"
				@redirect="backRedirect"
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
		<v-dialog v-model="dialog.documentProcessing" width="60vw" persistent>
			<DocumenProcessV2Vue
				persistent
				:request="requestData"
				@close="onCloseDialog"
			/>
		</v-dialog>
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
						<!-- <v-spacer></v-spacer> -->
						<!-- <v-btn
							class="my-2 pr-2 justify-end"
							color="red"
							text
							icon
							@click="redirectBack()"
						>
							<v-icon> mdi-subdirectory-arrow-left </v-icon>
						</v-btn> -->
						<!-- /////// -->
						<!-- <v-btn text class="mx-2 my-0" depressed>
									<v-icon class="mr-[8px]">
										mdi-ticket-confirmation
									</v-icon>
									{{ requestData.requestDataCode }}
								</v-btn>
								<v-btn text class="mx-2 my-0" depressed>
									<v-icon class="mr-[8px]"
										>mdi-view-grid
									</v-icon>
									<span class="normal-case">{{
										requestData.requestGroupName
									}}</span>
								</v-btn>
								<v-btn text class="mx-2 my-0" depressed>
									<v-icon class="mr-[8px]">
										mdi-water
									</v-icon>

									<span class="normal-case">{{
										requestData.requestTypeName
									}}</span>
								</v-btn>
								<v-btn text class="mx-2 my-0" depressed>
									<v-icon class="mr-[8px]"
										>mdi-clipboard-text</v-icon
									>
									<span class="normal-case">{{
										requestData.signTypeName
									}}</span>
								</v-btn> -->
					</div>
					<v-row>
						<v-col cols="6">
							<v-tabs v-model="tab" color="blue darken-2">
								<v-tab key="Declaration">
									<span class="normal-case">{{
										$t('label.information')
									}}</span>
								</v-tab>

								<!-- <v-tab key="Procedure">
									<span class="normal-case">{{
										"Quy Trình "
									}}</span>
								</v-tab> -->
								<v-tab
									key="b"
									v-if="requestData.signTypeCode === '0'"
								>
									<span class="normal-case">{{
										$t("label.digital_sign_information")
									}}</span>
								</v-tab>
								<v-tab
									key="a"
									v-if="requestData.signTypeCode === '1'"
								>
									<span class="normal-case">{{
										$t('label.manage_stamp')
									}}</span>
								</v-tab>
							</v-tabs>
						</v-col>
						<v-col cols="6" md="6">
							<!-- <div class="float-right">
								<v-btn
									v-if="
										examine &&
										!examine.length == 0 &&
										!requestData.isDone
									"
									class="mx-2 my-0"
									text
									color="back"
									@click="openSendInformation()"
								>
									<v-icon>mdi-content-paste</v-icon>
									{{ this.$t("button.send_information") }}
								</v-btn>
								<v-btn
									v-if="
										!consult.length == 0 &&
										!requestData.isDone
									"
									class="mx-2 my-0"
									text
									color="back"
									@click="openAnswer()"
								>
									<v-icon>mdi-pencil-circle</v-icon>
									{{ this.$t("button.answer") }}
								</v-btn>
								<v-btn
									v-if="
										requestData.isDone && isCancelApproval
									"
									class="mx-2 my-0"
									text
									color="back"
									@click="cancelApproval()"
								>
									<v-icon>mdi-export</v-icon>
									{{ this.$t("button.cancelApproval") }}
								</v-btn>
								<v-btn
									v-if="bntCreaterReall"
									class="mx-2 my-0"
									text
									color="back"
									@click="openRecovery()"
								>
									<v-icon>mdi-close-octagon</v-icon>
									{{ this.$t("button.recoveryCancel") }}
								</v-btn>

								<v-btn
									v-if="bntProcessRecover && !bntCreaterReall"
									class="mx-2 my-0"
									text
									color="back"
									@click="openPleaseRecovery()"
								>
									<v-icon>mdi-comment-text</v-icon>
									{{ this.$t("button.pleaseRecovery") }}
								</v-btn>
								<v-btn
									v-if="
										listTransferHandles.length > 0 &&
										isDocmentProcess
									"
									class="mx-2 my-0"
									text
									color="back"
									@click="openDocumentProcessing()"
								>
									<v-icon>mdi-comment-text</v-icon>
									{{ this.$t("button.document_processing") }}
								</v-btn>
							</div> -->
						</v-col>
					</v-row>
					<v-divider></v-divider>
					<v-col>
						<v-tabs-items v-model="tab">
							<v-tab-item key="Declaration">
								<ViewDeclarationVue
									:requestDataV2="requestData"
									:isSaved="isSaving"
									:isLoad="isLoading"
								>
								</ViewDeclarationVue>
							</v-tab-item>

							<!-- <v-tab-item key="Procedure">
								<ViewProcedureVue
									:isSaved="isSaving"
									:requestDataV2="requestData"
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
import ViewDeclarationVue from "./ViewDeclarationStatistic.vue";
// import ViewDeclarationVue from "../../khai-phieu-yeu-cau/RequestForm/ViewDeclaration.vue";
import ViewManagerStamVue from "../../khai-phieu-yeu-cau/RequestForm/ViewManagerStam.vue";
import ViewDigitalSigntureInfoVue from "../../khai-phieu-yeu-cau/RequestForm/ViewDigitalSigntureInfo.vue";
import SendInformationRequestFormVue from "../../khai-phieu-yeu-cau/modulepopup/SendInformationRequestForm.vue";
import AnswerRequestFormVue from "../../khai-phieu-yeu-cau/modulepopup/AnswerRequestForm.vue";
import CancelApprovalVue from "../../khai-phieu-yeu-cau/modulepopup/CancelApproval.vue";
import RecoveryRequestVue from "../../khai-phieu-yeu-cau/modulepopup/RecoveryRequest.vue";
import PleaseRecoveryRequestVue from "../../khai-phieu-yeu-cau/modulepopup/PleaseRecoveryRequest.vue";
import DocumenProcessV2Vue from "../../khai-phieu-yeu-cau/modulepopup/DocumenProcessV2.vue";
import ResendProcessVue from "../../khai-phieu-yeu-cau/modulepopup/ResendProcess.vue";
// import ViewDeclarationVue from "./ViewDeclaration.vue";
// import ViewManagerStamVue from "./ViewManagerStam.vue";
// import ViewDigitalSigntureInfoVue from "./ViewDigitalSigntureInfo.vue";
// import SendInformationRequestFormVue from "../modulepopup/SendInformationRequestForm.vue";
// import AnswerRequestFormVue from "../modulepopup/AnswerRequestForm.vue";
// import CancelApprovalVue from "../modulepopup/CancelApproval.vue";
// import RecoveryRequestVue from "../modulepopup/RecoveryRequest.vue";
// import PleaseRecoveryRequestVue from "../modulepopup/PleaseRecoveryRequest.vue";
// import DocumenProcessV2Vue from "../modulepopup/DocumenProcessV2.vue";
// import ResendProcessVue from "../modulepopup/ResendProcess.vue";
export default {
	name: "VSMFEViewDetailReport",
	components: {
		ViewDeclarationVue,
		ViewManagerStamVue,
		ViewDigitalSigntureInfoVue,
		SendInformationRequestFormVue,
		AnswerRequestFormVue,
		CancelApprovalVue,
		RecoveryRequestVue,
		PleaseRecoveryRequestVue,
		DocumenProcessV2Vue,
		ResendProcessVue,
	},

	data() {
		return {
			idRequestData: null,
			requestData: null,
			tab: 0,
			isLoading: true,
			isSaving: {
				state: 0,
				idRequestData: 0,
				idProcessData: 0,
			},
			dialog: {
				sendInformation: false,
				answer: false,
				cancelApproval: false,
				processDoc: false,
				recovery: false,
				pleaseRecovery: false,
				documentProcessing: false,
			},
			examine: [],
			consult: [],
			user_info: this.getUserInfo(),
			ALL_STATUS: [],
			bntRetun: false,
			bntCreaterReall: false,
			bntCancelApproval: false,
			bntProcessRecover: false,
			STATUS_TRALAI_CODE: this.$t("status_code.Reject"),
			STATUS_CHOXULY_CODE: this.$t("status_code.choxuly"),
			STATUS_HUYPHEDUYET_CODE: this.$t("status_code.CancelApprove"),
			requestRecall: [],
			stepInProcess: [],
			stepInProcessAll: [],
			stepDatas: [],
			listTransferHandles: [],
			isDocmentProcess: false,
			isCancelApproval: false,
			stepInProcessTest: [],
			isProcessRecover: [],
			isXoatxet: false,
		};
	},
	created() {
		if (this.$router.currentRoute.params.id) {
			this.idRequestData = this.$router.currentRoute.params.id;
		}
	},
	async mounted() {
		await this.initialize();
	},
	watch: {
		"dialog.sendInformation"(val) {
			this.isLoading = val;
		},
		"dialog.answer"(val) {
			this.isLoading = val;
		},
		"dialog.cancelApproval"(val) {
			this.isLoading = val;
		},
		"dialog.recovery"(val) {
			this.isLoading = val;
		},
		"dialog.documentProcessing"(val) {
			this.isLoading = val;
		},
		"dialog.pleaseRecovery"(val) {
			this.isLoading = val;
		},
		"dialog.processDoc"(val) {
			this.isLoading = val;
		},
	},
	methods: {
		async initialize() {
			if (this.$router.currentRoute.params.id) {
				await this.getRequestData();
				await this.getListStepData();
			
				// if (this.requestData && this.requestData.id) {
				// 	this.getConsultReply();
				// 	this.getExamineReply();
				// 	this.getAllStatus();
				// 	this.getStepDataCurrentByIdRequestData();
				// 	this.getRequestRecall();
				// }
				if (
					this.requestData &&
					this.requestData.id &&
					!this.$router.currentRoute.fullPath.includes(
						"phieu-cho-phe-duyet",
					)
				) {
					this.getConsultReply();
					this.getExamineReply();
					this.getAllStatus();
					this.getStepDataCurrentByIdRequestDataV2();
					this.getRequestRecall();
				}
				if (
					(this.requestData &&
						this.requestData.id &&
						this.$router.currentRoute.fullPath.includes(
							"phieu-cho-phe-duyet",
						)) ||
					this.requestData.isDone
				) {
					this.getStepDataCurrentByIdRequestData();
				}
			}
		},
		getAllTransferHandles() {
			globalService
				.getData_NoAsync(
					administratorAPI.API_GetAllTransferHandles(
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
					this.listTransferHandles = response.data.data.sort(
						(e1, e2) => e2.createdDate - e1.createdDate,
					);

					if (
						this.listTransferHandles[0]?.stepData?.id ==
							this.stepInProcess[0]?.id &&
						this.requestData.userInfos.find(
							(ele) => ele.id == this.user_info.id,
						)
					) {
						this.isDocmentProcess = true;
					}
				});
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
				// if (
				// 	this.requestData.userInfos.find(
				// 		(ele) => ele.id == this.user_info.id,
				// 	)
				// ) {
				// 	this.requestData = null;
				// 	this.toastError(this.$t("error.no_request"));
				// }
				// if (this.requestData.userInfos == this.user_info.id) {

				// }
			} catch (error) {
				this.toastError(error);
				return;
			}
		},
		openSendInformation() {
			this.dialog.sendInformation = true;
		},
		openAnswer() {
			this.dialog.answer = true;
		},
		cancelApproval() {
			this.dialog.cancelApproval = true;
		},

		openRecovery() {
			this.dialog.recovery = true;
		},
		openPleaseRecovery() {
			this.dialog.pleaseRecovery = true;
		},
		openDocumentProcessing() {
			this.dialog.documentProcessing = true;
		},
		openProcessDoc() {
			this.dialog.processDoc = true;
		},
		async getStepDataCurrentByIdRequestData() {
			await globalService
				.getData_NoAsync(
					administratorAPI.API_GetByCurrentSteps(this.requestData.id),
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
					this.stepInProcess = response.data.data.filter(
						(ele) => ele.isActive && ele.stepOrder,
					);

					this.stepInProcessTest = response.data.data;

					if (
						(this.requestData.created.id == this.user_info.id &&
							this.requestData.status.statusCode ==
								this.STATUS_CHOXULY_CODE) ||
						this.requestData.status.statusCode ==
							this.STATUS_HUYPHEDUYET_CODE
					) {
						this.bntCreaterReall = true;
					}

					let currenStepDate = response.data.data.find(
						(ele) => ele.isActive,
					);
					if (currenStepDate) {
						this.isProcessRecover = response.data.data.filter(
							(e) => {
								let result =
									e.stepOrder < currenStepDate.stepOrder
										? true
										: false;
								result =
									result &&
									e.userInfos.some(
										(e) => e.id == this.user_info.id,
									);
								return result;
							},
						);
					}

				
					if (
						this.isProcessRecover.length > 0 &&
						this.isProcessRecover[0].isProcessRecover
					) {
						this.bntProcessRecover = true;
					}
					if (this.stepInProcess.length == 0) {
						this.stepInProcessAll = response.data.data.filter(
							(ele) => !ele.isActive && ele.stepOrder,
						);

						let item = this.stepInProcessAll.length;

						if (
							this.stepInProcessAll[item - 1].userInfos.find(
								(ele) => ele.id == this.user_info.id,
							)
						) {
							this.isCancelApproval = true;
						}
					}
				});
			this.getAllTransferHandles();
		},
		async getStepDataCurrentByIdRequestDataV2() {
			await globalService
				.getData_NoAsync(
					administratorAPI.API_GetByCurrentSteps(this.requestData.id),
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
					this.stepInProcess = response.data.data.filter(
						(ele) => ele.isActive && ele.stepOrder,
					);

					this.stepInProcessTest = response.data.data;

					// if (
					// 	(this.requestData.created.id == this.user_info.id &&
					// 		this.requestData.status.statusCode ==
					// 			this.STATUS_CHOXULY_CODE) ||
					// 	this.requestData.status.statusCode ==
					// 		this.STATUS_HUYPHEDUYET_CODE
					// ) {
					// 	this.bntCreaterReall = true;
					// }

					let currenStepDate = response.data.data.find(
						(ele) => ele.isActive,
					);
					if (currenStepDate) {
						this.isProcessRecover = response.data.data.filter(
							(e) => {
								let result =
									e.stepOrder < currenStepDate.stepOrder
										? true
										: false;
								result =
									result &&
									e.userInfos.some(
										(e) => e.id == this.user_info.id,
									);
								return result;
							},
						);
					}

				
					if (
						this.isProcessRecover.length > 0 &&
						this.isProcessRecover[0].isProcessRecover
					) {
						this.bntProcessRecover = true;
					}
					if (this.stepInProcess.length == 0) {
						this.stepInProcessAll = response.data.data.filter(
							(ele) => !ele.isActive && ele.stepOrder,
						);

						let item = this.stepInProcessAll.length;

						if (
							this.stepInProcessAll[item - 1].userInfos.find(
								(ele) => ele.id == this.user_info.id,
							)
						) {
							this.isCancelApproval = true;
						}
					}
				});
			this.getAllTransferHandles();
		},
		async getListStepData() {
			globalService
				.getData_NoAsync(
					administratorAPI.API_GetByCurrentSteps(this.requestData.id),
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
					this.stepDatas = response.data.data.sort(
						(e1, e2) => e1.stepOrder - e2.stepOrder,
					);
				});
		},
		getConsultReply() {
			globalService
				.getData_NoAsync(
					administratorAPI.API_GetAllConsultByUserAndRequestData(
						this.user_info.id,
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
					this.consult = response.data.data.sort(
						(e1, e2) => e2.id - e1.id,
					);
				});
		},
		getExamineReply() {
			globalService
				.getData_NoAsync(
					administratorAPI.API_GetAllByUserAndRequestData(
						this.user_info.id,
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
					this.examine = response.data.data.sort(
						(e1, e2) => e2.id - e1.id,
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
					if (
						this.requestData.status.statusCode ==
						this.STATUS_TRALAI_CODE
					) {
						this.bntRetun = true;
					}
				});
		},
		getRequestRecall() {
			if (this.requestData.id) {
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
					});
			}
		},
		backRedirect() {
			this.$router.go(-1);
			// this.$router.push({
			// 	path: "/phieu-yeu-cau/list-request-wait-approval",
			// });
		},
	},
};
</script>

<style lang="scss" scoped></style>
