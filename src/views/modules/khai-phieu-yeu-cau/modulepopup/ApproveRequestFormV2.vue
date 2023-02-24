<template>
	<v-card elevation="0" ref="form">
		<v-toolbar flat color="grey lighten-4 max-h-[2.5rem]">
			<v-toolbar-title class="mb-5">
				{{ $t("label.approve") }}
			</v-toolbar-title>
			<v-spacer></v-spacer>
			<v-btn icon @click="close" class="mb-5">
				<v-icon>mdi-close</v-icon>
			</v-btn>
		</v-toolbar>
		<v-card-text class="white mt-2">
			<v-form v-model="valid">
				<v-row>
					<v-col cols="12" sm="12" md="12">
						<v-textarea
							dense
							outlined
							v-model="approveRequestDto.reason"
							hide-details
							maxLength="500"
						>
							<template v-slot:label>
								{{ $t("label.mail_template_content") }}
								<span class="red--text">
									{{ $t("label.star") }}
								</span>
							</template>
						</v-textarea>
					</v-col>
					<!-- <v-col cols="12" sm="12" md="12">
							<v-file-input
								ref="file"
								:label="$t('label.attachment_file')"
								outlined
								dense
								@change="handleFileUpload($event)"
								:error-messages="errorMessageFile"
								chips
								multiple
								small-chips
								truncate-length="20"
							>
							</v-file-input>
						</v-col> -->
					<v-col>
						<v-card
							elevation="0"
							dropzone
							:class="!isDragOver ? '' : 'background-active'"
							class="items-center"
							@drop="onDrop($event)"
							@dragenter="onDragEnter($event)"
							@dragleave="onDragLeave($event)"
							@dragover="onDragOver($event)"
							@dragend="onDragEnd($event)"
							@click="onClick($event)"
							style="box-sizing: border-box"
						>
							<div
								class="
									d-flex
									justify-space-between
									border-2
									px-2
								"
							>
								<v-card-text class="pl-0">
									{{ $t("label.upload_file") }}
								</v-card-text>
								<v-divider vertical></v-divider>
								<v-icon class="mx-[8px] size-[24px]"
									>mdi-cloud-upload-outline
								</v-icon>
							</div>
						</v-card>
						<input
							ref="files"
							id="filesApprove"
							type="file"
							accept=".xlsx,.docx,.pptx,.pdf"
							class="d-none"
							multiple
							@change="handleFile($event)"
						/>
						<vue-perfect-scrollbar>
							<v-list>
								<v-list-item
									v-for="file in files"
									:key="file.name"
								>
									<v-list-item-icon>
										<!-- <v-icon>
														{{
															m_files_icon[
																file.type
															]
														}}
													</v-icon> -->
										<v-icon>
											{{
												m_files_icon[
													file.name.split(".")[
														file.name.split(".")
															.length - 1
													]
												]
											}}
										</v-icon>
									</v-list-item-icon>
									<v-list-item-title>
										{{ file.name }}
									</v-list-item-title>
									<v-list-item-icon>
										<v-icon
											color="red darken-2"
											@click="remove(file)"
										>
											mdi-delete-circle
										</v-icon>
									</v-list-item-icon>
								</v-list-item>
							</v-list>
						</vue-perfect-scrollbar>
					</v-col>
				</v-row>
			</v-form>
		</v-card-text>
		<v-card-actions class="white">
			<v-spacer></v-spacer>
			<v-btn
				color="blue darken-1"
				elevation="0"
				dark
				@click="approveRequest()"
			>
				{{ $t("button.ok") }}
			</v-btn>
			<v-btn color="grey lighten-4" elevation="0" @click="close">
				{{ $t("button.cancel") }}
			</v-btn>
		</v-card-actions>
	</v-card>
</template>

<script>
import globalService from "@/services/global.service";
import administratorAPI from "../../administrator/administrator.api";
import ApproveDto from "@/models/approve.dto";
import store from "@/store";
import moment from "moment";
import constant from "@/common/constant";
export default {
	name: "VsmFeApproverequestformPopupV2",
	props: {
		request: {},
		listStepData: [],
		stepDataOne: {},
		objectModel: {},
		isShow: Boolean,
	},
	watch: {
		request(newValue) {
			this.m_requestData = newValue;
			this.approveRequestDto.reason = "";
			this.approveRequestDto = Object.assign({}, ApproveDto);
		},
		listStepData(newValue) {
			this.stepList = newValue;
		},
		stepDataOne(newValue) {
			this.stepInProcessIsActive = newValue;
		},
		objectModel(value) {
			console.log(value);
			this.m_objectModel = Object.assign({}, value);
		},
		isShow(val) {
			console.log(val);
			if (!val) {
				this.approveRequestDto.reason = "";
				this.approveRequestDto = Object.assign({}, ApproveDto);
				this.files = [];
			}
		},
	},

	data() {
		return {
			file: null,
			m_requestData: null,
			approveRequestDto: ApproveDto,
			user_info: this.getUserInfo(),
			attachmentFiles: [],
			files: [],
			file_name: [],
			stepList: [],
			indexStepInProcess: 0,
			stepInProcessIsActive: {},
			m_objectModel: {},
			formatFields: [
				"sign_date",
				"valid_from",
				"valid_to",
				"cash_flow_from",
				"end_of_term",
				"v020_valid_from",
				"v020_valid_to",
			],
			numberFields: [
				"square",
				"price_per_month",
				"condition_amount",
				"frequency",
			],
			stringFields: [
				"tenancy_law",
				"construction_price",
				"s100_unit_price",
				"v020_unit_price",
			],
		};
	},

	mounted() {
		// await this.getStepDataCurrentByIdRequestData();
		this.m_requestData = this.request;
		if (this.isShow) {
			this.approveRequestDto = Object.assign({}, ApproveDto);
		}
		this.approveRequestDto.reason = "";
		this.stepList = this.listStepData;
		this.stepInProcessIsActive = this.stepDataOne;
		this.indexStepInProcess = this.stepList.length;
		this.m_objectModel = Object.assign({}, this.objectModel);
	},
	created() {},

	methods: {
		close() {
			this.approveRequestDto.reason = "";
			this.approveRequestDto = Object.assign({}, ApproveDto);
			this.files = [];
			this.file_name = [];
			this.$emit("close", true);
		},
		handleFileUpload(event) {
			this.file = event;
		},
		async approveRequest() {
			try {
				this.approveRequestDto.reason =
					this.approveRequestDto?.reason.trim();
				if (this.approveRequestDto.reason == "") {
					return this.toastError(
						this.$t("message.empty_requestContent"),
					);
				}

				let response;
				this.approveRequestDto.action = "Agree";
				if (
					this.stepInProcessIsActive &&
					this.stepInProcessIsActive.stepOrder ==
						this.indexStepInProcess
				) {
					this.approveRequestDto.action = "Approve";
				}
				this.approveRequestDto.errorMessageReturn =
					this.$t("error.fail");
				this.approveRequestDto.requestDataId = this.m_requestData.id;
				this.approveRequestDto.successMessageReturn =
					this.$t("message.success");
				this.approveRequestDto.userId = this.user_info.id;
				this.approveRequestDto.attachmentFileId = this.attachmentFiles;
				response = await globalService.postData_Async(
					administratorAPI.API_Approve(),
					this.approveRequestDto,
				);
				if (!response || !response.state) {
					return this.toastError(
						this.approveRequestDto.errorMessageReturn,
					);
				}
				if (!this.files.length == 0) {
					await this.upload();
				}
				if (this.approveRequestDto.action == "Approve") {
					if (
						/*!this.m_requestData?.contractNumber &&*/
						this.m_requestData?.sapMapping
					) {
						if (store.state.config.syncWithBackend) {
							let messsageError = null;

							let sapResponse =
								await globalService.postData_Async(
									administratorAPI.API_SAPSyncContractRequestData(
										this.m_requestData.id,
									),
								);

							this.m_requestData.resultSyncContract = true;

							if (!sapResponse || sapResponse.state) {
								messsageError = this.$t("error.sap_sync");
								this.m_requestData.resultSyncContract = false;
							}
							if (!sapResponse.data || !sapResponse.data.res) {
								messsageError =
									this.$t("error.sap_sync") +
									`${
										sapResponse.data?.mess
											? sapResponse.data?.mess
											: ""
									}`;
								this.m_requestData.resultSyncContract = false;
							}

							if (messsageError) {
								this.toastError(messsageError);
							}

							this.m_requestData.contractNumber =
								sapResponse.data.mess;
							this.m_requestData.modifiedDate = new Date();

							let updateRequestDataResponse =
								await globalService.putData_Async(
									administratorAPI.API_UpdateRequestDataContractNumber(
										this.m_requestData.id,
									),
									this.m_requestData,
								);
							if (
								!updateRequestDataResponse ||
								!updateRequestDataResponse.state
							) {
								console.log(updateRequestDataResponse);
							} else {
								this.m_requestData =
									updateRequestDataResponse.data;
							}
						} else {
							let sapMapping = JSON.parse(
								this.m_requestData.sapMapping,
							);
							let body = {};
							console.log(this.objectModel);
							for (let key in sapMapping) {
								body[key] = sapMapping[key]?.value;
								if (!this.objectModel[sapMapping[key]?.value]) {
									continue;
								}
								body[key] =
									this.objectModel[sapMapping[key]?.value];
								if (this.formatFields.includes(key)) {
									let date = moment(
										this.objectModel[
											sapMapping[key]?.value
										],
									);
									if (!date.isValid()) {
										continue;
									}
									date = date.format(
										constant.format.mule_date,
									);
									body[key] = `${date}`.replaceAll("-", "");
								}
								if (this.numberFields.includes(key)) {
									try {
										body[key] = parseFloat(`${body[key]}`);
									} catch (e) {
										console.log(e);
										body[key] = 1;
									}
								}
								if (this.stringFields.includes(key)) {
									body[key] = `${body[key]}`;
								}
							}
							let sapResponse =
								await globalService.postData_Async(
									administratorAPI.API_SAPSyncContract(),
									//PROD
									{
										body: body,
										headers: {
											api_key:
												"eOPh9QMopl95HuxtZFo2TJaZw1erjHeor",
											client_id:
												"cd71e2507d2c4812bbaecb25ec377610",
											client_secret:
												"C02808548cb74BB0858F5417BE525aBc",
											// "Content-Type": "application/json",
										},
										httpMethod: "POST",
										url:
											store.state.config.sapUrl ||
											"https://api.vincom.com.vn/api/vcr/v1/sap-re/contract",
										// "http://10.111.125.141:8090/api/vcr/v1/sap-re/contract",
									},
									// //UAT
									// {
									// 	body: body,
									// 	headers: {
									// 		api_key:
									// 			"eOSksAf4S2eIjPYQczptNUFqzhzEz3wNH",
									// 		client_id:
									// 			"38e87dac09d34257b2ca3a0ebf873237",
									// 		client_secret:
									// 			"B4a4d4966BA8467d8366409D61411863",
									// 		// "Content-Type": "application/json",
									// 	},
									// 	httpMethod: "POST",
									// 	url:
									// 		store.state.config.sapUrl ||
									// 		"http://10.111.125.141:8090/api/vcr/v1/sap-re/contract",
									// },
								);
							if (!sapResponse) {
								console.log(sapResponse);
								this.toastError(this.$t("error.sap_sync"));
							} else {
								console.log(sapResponse);
								try {
									let sapResult = JSON.parse(
										sapResponse.data,
									);
									if (!sapResult.ev_contract) {
										this.toastError(sapResult?.ev_message);
									} else {
										this.m_requestData.contractNumber =
											sapResult.ev_contract;
										this.m_requestData.modifiedDate =
											new Date();
										let updateRequestDataResponse =
											await globalService.putData_Async(
												administratorAPI.API_UpdateRequestDataContractNumber(
													this.m_requestData.id,
												),
												this.m_requestData,
											);
										if (
											!updateRequestDataResponse ||
											!updateRequestDataResponse.state
										) {
											console.log(
												updateRequestDataResponse,
											);
										} else {
											this.m_requestData =
												updateRequestDataResponse.data;
										}
									}
								} catch (e) {
									console.log(e);
								}
							}
						}
					}
				}
				this.toastSuccess(this.$t("label.successful_vote_approval"));
				this.$emit("close", true);
				this.approveRequestDto = Object.assign({}, ApproveDto);
				this.close();
				this.$router.push({
					path: `/phieu-yeu-cau/list-request-handle`,
				});
			} catch (error) {
				this.toastError(error);
			} finally {
				this.approveRequestDto.reason = "";
				this.approveRequestDto = Object.assign({}, ApproveDto);
				this.files = [];
			}
		},

		async getStepDataCurrentByIdRequestData() {
			let response;
			try {
				response = await globalService.getData_Async(
					administratorAPI.API_GetByCurrentSteps(
						this.m_requestData.id,
					),
				);
				if (!response || !response.state) {
					return;
				}
				this.stepInProcessIsActive = response.data.find(
					(ele) => ele.isActive,
				);
				this.indexStepInProcess = response.data.length;
			} catch (error) {
				this.toastError(error);
				return;
			}
		},
		handleFile(files) {
			if (this.file_name.indexOf(files.target.value) != -1) return;
			this.file_name.push(files.target.value);
			this.files = this.files.concat(Array.from(files.target.files));
			for (let file of this.files) {
				let ext = file.name.split(".").pop();
				let arr = ["docx", "pdf", "xlsx", "pptx", "jpg", "jpeg"];
				if (!arr.includes(ext)) {
					return (
						this.toastError(this.$t("error.extFile")),
						(this.files = null)
					);
				}
			}
			files.target.value = null;
		},
		onDrop(event) {
			event.preventDefault();
			this.isDragOver = false;
			if (event.dataTransfer) {
				this.files = Array.from(event.dataTransfer.files);
			}
		},
		onDragEnd(event) {
			event.preventDefault();
			this.isDragOver = false;
		},
		onDragEnter(event) {
			event.preventDefault();
			this.isDragOver = true;
		},
		onDragLeave(event) {
			event.preventDefault();
			this.isDragOver = false;
		},
		onDragOver(event) {
			event.preventDefault();
			this.isDragOver = true;
		},
		onClick(event) {
			event.preventDefault();
			let files = document.getElementById("filesApprove");
			files.click();
		},
		remove(file) {
			let index = this.files.indexOf(file);
			this.files.splice(index, 1);
		},
		async upload() {
			if (!this.files) {
				return;
			}

			let response;
			try {
				for (let file of this.files) {
					response = await globalService.uploadData_Async(
						administratorAPI.API_UploadFile365(),
						file,
						{
							parentItemId: this.m_requestData.idDirectoryPath,
							userId: this.userInfo.id,
							requestDataId: this.m_requestData.id,
						},
					);
					if (!response) {
						return this.toastError(this.$t("error.upload_file"));
					}
					if (!response.state) {
						return this.toastError(this.$t("error.upload_file"));
					}
					this.attachmentFiles.push(response.data.id);
					// console.log("response file", response);
					this.files = [];
					//this.$emit(constant.keys.upload, true);
				}
				// this.$emit("save", this.attachmentFiles);
				// this.closeDialog();
			} catch (error) {
				this.toastError(error);
			}
		},
	},
};
</script>

<style lang="scss" scoped></style>
