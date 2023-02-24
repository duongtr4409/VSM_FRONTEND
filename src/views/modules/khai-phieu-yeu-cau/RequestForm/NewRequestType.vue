<template>
	<v-card elevation="0" v-if="requestData">
		<!-- <vue-breadcrumbs /> -->
		<v-card elevation="0" flat class="mt-2">
			<div class="flex mb-2 pb-2">
				<!-- <v-btn class="mx-2 my-0" depressed text color="back">
					<v-icon class="mr-2">mdi-ticket-confirmation</v-icon>
					{{ requestData.requestDataCode }}</v-btn
				> -->
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
				<v-spacer> </v-spacer>
				<v-btn
					x-small
					class="my-1 pr-1 mr-4 justify-end"
					fab
					outlined
					@click="redirectBack()"
				>
					<v-icon> mdi-arrow-left </v-icon>
				</v-btn>
				<!-- <v-btn class="mx-2 my-0" depressed text color="back">
					<v-icon class="mr-2">mdi-collage</v-icon
					>{{ requestData.requestGroupName }}</v-btn
				>
				<v-btn
					:ripple="false"
					class="mx-2 my-0"
					depressed
					text
					color="back"
					v-if="requestData.requestTypeName"
				>
					<v-icon class="mr-2">mdi-water-percent</v-icon>
					{{ requestData.requestTypeName }}
				</v-btn>
				<v-btn
					class="mx-2 my-0"
					depressed
					text
					color="back"
					v-if="requestData.signTypeName"
				>
					<v-icon class="mr-2">mdi-clipboard-text</v-icon>
					{{ requestData.signTypeName }}
				</v-btn> -->
			</div>
			<v-row>
				<v-col cols="6" md="6">
					<v-tabs v-model="tab" color="blue darken-2">
						<!-- <v-tab key="Declaration">
							{{ "Thông tin" }}
						</v-tab> -->
						<v-tab key="duowngtora">
							{{ $t("title.information") }}
						</v-tab>

						<v-tab
							key="Procedure"
							v-if="!requestData.requestGroupName.includes(isCVD)"
						>
							{{ $t("label.process") }}
						</v-tab>
						<v-tab key="a" v-if="requestData.signTypeCode === '0'">
							{{ $t("label.digital_sign_information") }}
						</v-tab>
						<v-tab key="b" v-if="requestData.signTypeCode === '1'">
							{{ $t("label.manage_stamp") }}
						</v-tab>
					</v-tabs>
				</v-col>
				<v-col>
					<div class="float-right">
						<!-- <v-btn
							class="m-1"
							text
							color="back"
							rounded-pill
							@click="redirectBack()"
						>
							<v-icon>mdi-subdirectory-arrow-left</v-icon>
							Quay lại
						</v-btn> -->
						<v-btn
							class="m-1"
							text
							color="back"
							rounded-pill
							depressed
							@click="onOpenDeleteDialog"
						>
							<v-icon small class="mr-2">mdi-block-helper</v-icon>
							{{ $t("button.delete") }}
						</v-btn>
						<!-- <v-btn
									class="mx-2 my-0"
									text
									color="back"
									
									rounded-pill
									@click="processDocs"
								>
									<v-icon>mdi-file-document</v-icon>
									Xử lý công văn
								</v-btn> -->
						<v-btn
							v-if="!requestData.requestGroupName.includes(isCVD)"
							class="m-1"
							text
							color="back"
							rounded-pill
							depressed
							@click="openApprove"
						>
							<v-icon class="mr-2">mdi-check</v-icon>
							{{ $t("button.approval") }}
						</v-btn>
						<v-btn
							v-if="
								requestData.requestGroupName &&
								requestData.requestGroupName.includes(isCVD)
							"
							class="mx-2 my-0"
							text
							color="back"
							rounded-pill
							depressed
							@click="openApproveV2"
						>
							<v-icon class="mr-2">mdi-check</v-icon>
							{{ $t("label.approve") }}
						</v-btn>
						<v-btn
							v-if="
								requestData.requestGroupName &&
								requestData.requestGroupName.includes(isCVD)
							"
							class="m-1"
							text
							color="back"
							rounded-pill
							depressed
							@click="openProcessDocs"
						>
							<v-icon class="mr-2">mdi-pencil-circle</v-icon>
							{{ $t("button.dispatch_handling") }}
						</v-btn>
						<v-btn
							class="m-1 bg-[#0078D4]"
							dark
							text
							rounded-pill
							depressed
							@click="save()"
						>
							<v-icon>mdi-content-save</v-icon>

							{{ $t("button.save") }}
						</v-btn>
					</div>
				</v-col>
			</v-row>
			<v-divider></v-divider>
			<v-col>
				<v-tabs-items v-model="tab">
					<!-- <v-tab-item key="Declaration">
						<DeclarationV3
							:requestDataV2="requestData"
							:isSaved="isSaving"
						>
						</DeclarationV3>
					</v-tab-item> -->
					<v-tab-item key="duowngtora">
						<DeclarationV4
							:requestDataV2="requestData"
							:isSaved="isSaving"
							:m_Stamp="m_ManageStamp"
							:is_reload="reload"
							@save="onSaveDeclarationV4"
						>
						</DeclarationV4>
					</v-tab-item>

					<v-tab-item
						key="Procedure"
						v-if="!requestData.requestGroupName.includes(isCVD)"
					>
						<ProcedureV3
							:isSaved="isSaving"
							:requestDataV2="requestData"
							@save="onSaveProcedureV3"
						></ProcedureV3>
					</v-tab-item>
					<v-tab-item key="a" v-if="requestData.signTypeCode === '0'">
						<DigitalSignatureInfoVue
							:requestDataId="requestData"
							:isSaved="isSaving"
						></DigitalSignatureInfoVue>
					</v-tab-item>
					<v-tab-item key="b" v-if="requestData.signTypeCode === '1'">
						<ManagerStampVue
							:requestDataId="requestData"
							@handlerStamp="handleManageStamp"
							:isSaved="isSaving"
						></ManagerStampVue>
					</v-tab-item>
				</v-tabs-items>
			</v-col>
		</v-card>
		<v-dialog v-model="dialog.approve" width="60vw" persistent>
			<ApproveRequestFormVue
				persistent
				@save="saveData"
				:request="requestData"
				:isShow="dialog.approve"
				@close="onCloseDialog"
			/>
		</v-dialog>
		<v-dialog v-model="dialog.processDoc" width="60vw" persistent>
			<DocumentProcessVue
				persistent
				:request="requestData"
				@close="onCloseDialog"
			/>
		</v-dialog>
		<v-dialog v-model="dialog.sendEmail" width="60vw" persistent>
			<SendEmailVue
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
				
		<v-dialog v-model="dialog.delete" max-width="26vw" persistent >
			<DeleteDialogVue
				@close="onCloseDeleteDialog"
				@confirmDelete="onConfirmDeleteV2"
			/>
		</v-dialog>
		<v-dialog v-model="dialog.approveV2" width="60vw" persistent>
			<ApproveRequestFormCVDVue
				
				:request="requestData"
				@close="onCloseDialog"
			/>
		</v-dialog>
	</v-card>
</template>

<script>
import globalService from "@/services/global.service";
// import DeclarationV3 from "./DeclarationV3.vue";
import DeclarationV4 from "./DeclarationV4.vue";
import ProcedureV3 from "./ProcedureV3.vue";
import administratorAPI from "../../administrator/administrator.api";
import ApproveRequestFormVue from "./ApproveRequestForm.vue";
import DocumentProcessVue from "../modulepopup/DocumentProcess.vue";
import SendEmailVue from "../modulepopup/SendEmail.vue";
import SendNoticeVue from "../modulepopup/SendNotice.vue";
import ManagerStampVue from "./ManagerStamp.vue";
import DigitalSignatureInfoVue from "./DigitalSignatureInfo.vue";
import DeleteDialogVue from "@/components/DeleteDialog.vue";
import ApproveRequestFormCVDVue from "../modulepopup/ApproveRequestFormCVD.vue";

export default {
	name: "VSMFENewRequestType",
	components: {
		/*DeclarationV3,*/
		DeclarationV4,
		ProcedureV3,
		ApproveRequestFormVue,
		DocumentProcessVue,
		SendEmailVue,
		SendNoticeVue,
		ManagerStampVue,
		DigitalSignatureInfoVue,
		DeleteDialogVue,
		ApproveRequestFormCVDVue,
	},

	data() {
		return {
			idRequestData: null,
			requestData: null,
			m_ManageStamp: null,
			reload: false,
			dialog: {
				approve: false,
				processDoc: false,
				sendEmail: false,
				sendNotice: false,
				delete: false,
				approveV2: false,
				documentProcess: false,
			},
			tab: 0,
			isSaving: {
				state: 0,
				idRequestData: 0,
				idProcessData: 0,
			},
			isDeleting: false,
			isCVD: this.$t("enum.CVD"),
			approveRequestDto: null,
			save_DeclarationV4: false,
			save_ProcedureV3: false,
			user_info: this.getUserInfo(),
		};
	},
	watch: {
		tab(value) {
			console.log(value);
			this.isSaving = {};
		},
		"dialog.approve"(value) {
			if (!value) {
				this.initialize();
			}
		},
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
					this.toastError(this.$t("error.load"));
				}
				this.requestData = response.data;

				if (this.requestData.created.id != this.user_info.id) {
					this.requestData = null;
					this.toastError(this.$t("error.no_request"));
				}
			} catch (error) {
				this.toastError(error);
				return;
			}
		},
		save() {
			// this.toastSuccess(this.$t("message.update_success"));
			this.isSaving = { state: 1, manageStamp: this.m_ManageStamp };
		},
		openApprove() {
			this.dialog.approve = true;
		},
		openApproveV2() {
			this.dialog.approveV2 = true;
		},
		openProcessDocs() {
			this.dialog.processDoc = true;
		},
		sendEmail() {
			this.dialog.sendEmail = true;
		},
		sendNotice() {
			this.dialog.sendNotice = true;
		},
		onOpenDeleteDialog() {
			this.dialog.delete = true;
		},
		onCloseDeleteDialog() {
			this.dialog.delete = false;
		},
		openDocumentProcess() {
			this.dialog.documentProcess = true;
		},
		saveData(value) {
			if (value) {
				this.isSaving = { state: 1, manageStamp: this.m_ManageStamp };
				this.approveRequestDto = value;
			}
		},

		async onConfirmDelete() {
			if (this.isDeleting) {
				return;
			}
			this.isDeleting = true;
			const payload = [
				{
					id: this.idRequestData,
					isDelete: true,
				},
			];
			const response = await globalService.postData_Async(
				administratorAPI.API_DeleteAllRequestData(),
				payload,
			);
			if (!response.state) {
				this.toastError(response.message);
			}
			if (response.state) {
				this.isDeleting = true;
				this.toastSuccess(this.$t("message.delete_success"));
			}

			this.isDeleting = false;
			this.onCloseDeleteDialog();
			this.redirectBack();
		},
		async onConfirmDeleteV2() {
			const response = await globalService.deleteData_Async(
				administratorAPI.API_DeleteRequestData(this.idRequestData),
			);
			if (!response.state) {
				this.toastError(response.message);
			}
			if (response.state) {
				this.isDeleting = true;
				this.toastSuccess(this.$t("message.delete_success"));
			}

			this.onCloseDeleteDialog();
			this.redirectBack();
		},
		handleManageStamp(value) {
			this.m_ManageStamp = null;
			this.reload = true;
			this.m_ManageStamp = value;
		},
		onSaveDeclarationV4(value) {
			if (value) {
				this.save_DeclarationV4 = true;
				if (this.approveRequestDto) {
					this.approve_();
				}
			}
		},
		onSaveProcedureV3(value) {
			if (value) {
				this.save_ProcedureV3 = true;
				// if (this.approveRequestDto) {
				// 	this.approve_();
				// }
				this.reload = true;
			}
		},

		async approve_() {
			if (this.approveRequestDto.userId) {
				try {
					let response = await globalService.postData_Async(
						administratorAPI.API_Approve(),
						this.approveRequestDto,
					);
					if (!response || !response.state) {
						this.toastError(
							this.$t("message.approve_request_error"),
						);
						return;
					}
					this.toastSuccess(
						this.$t("message.approve_request_success"),
					);
					this.approveRequestDto = null;

					this.$router.push({
						path: `/phieu-yeu-cau/list-request-wait-approval`,
					});
				} catch (error) {
					console.log(error);
				}
			}
		},
	},
};
</script>

<style lang="scss" scoped></style>
