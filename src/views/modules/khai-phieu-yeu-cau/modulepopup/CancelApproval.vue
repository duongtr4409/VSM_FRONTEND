<template>
	<v-card elevation="0" ref="form">
		<v-toolbar flat color="grey lighten-4 max-h-[2.5rem]">
			<v-toolbar-title class="mb-5">
				{{ $t("button.cancelApproval") }}
			</v-toolbar-title>
			<v-spacer></v-spacer>
			<v-btn icon @click="close" class="mb-5">
				<v-icon>mdi-close</v-icon>
			</v-btn>
		</v-toolbar>
		<v-card-text class="white">
			<v-container>
				<v-form v-model="valid">
					<v-row>
						<v-col cols="12" sm="12" md="12">
							<v-textarea
								dense
								outlined
								hide-details
								v-model="approveRequestDto.reason"
								maxLength="500"
							>
								<template v-slot:label>
									{{ $t("label.mail_template_content") }}
									<span class="text-red-600">
										{{ $t("label.star") }}
									</span>
								</template>
							</v-textarea>
						</v-col>

						<v-col cols="12" sm="12" md="12">
							<v-card
								elevation="0"
								dropzone
								:class="
									!isDragOver
										? 'bordered bordered-solid'
										: 'bordered bordered-dashed background-active'
								"
								class="items-center p-0"
								@drop="onDrop($event)"
								@dragenter="onDragEnter($event)"
								@dragleave="onDragLeave($event)"
								@dragover="onDragOver($event)"
								@dragend="onDragEnd($event)"
								@click="onClick($event)"
							>
								<div
									class="
										d-flex
										justify-space-between
										border-2
										px-2
									"
								>
									<v-card-text>
										{{ $t("title.upload_file") }}
									</v-card-text>
									<v-divider vertical></v-divider>
									<v-icon x-large class="ml-4"
										>mdi-cloud-upload-outline
									</v-icon>
								</div>
							</v-card>
							<input
								ref="files"
								id="filesCancelAppr"
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
			</v-container>
		</v-card-text>
		<v-card-actions class="white">
			<v-spacer></v-spacer>
			<v-btn
				color="blue darken-1"
				elevation="0"
				dark
				@click="checkConfirm()"
			>
				{{ $t("button.ok") }}
			</v-btn>
			<v-btn color="grey lighten-4" elevation="0" @click="close">
				{{ $t("button.cancel") }}
			</v-btn>
		</v-card-actions>
		<v-dialog width="40vw" v-model="openConfirm" persistent>
			<v-card>
				<v-toolbar flat color="grey lighten-4 max-h-[2.5rem]">
					<v-card-title class="mb-5">
						{{ $t("button.confirm_Sap") }}
					</v-card-title>
				</v-toolbar>
				<v-divider> </v-divider>
				<v-card-actions class="white">
					<v-spacer></v-spacer>
					<v-btn
						color="blue darken-1"
						elevation="0"
						dark
						@click="approveRequest()"
					>
						{{ $t("button.continue_PD") }}
					</v-btn>
					<v-btn
						color="grey lighten-4"
						elevation="0"
						@click="closeConfirm()"
					>
						{{ $t("button.return") }}
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</v-card>
</template>

<script>
import globalService from "@/services/global.service";
import administratorAPI from "../../administrator/administrator.api";
import ApproveDto from "@/models/approve.dto";
import ReqDataProcessHisDto from "@/models/req-data-process-his.dto";
export default {
	name: "VSMFECancelApproval",
	props: { request: {} },
	watch: {
		request(newValue) {
			this.m_requestData = newValue;
			this.approveRequestDto.reason = "";
			this.approveRequestDto = Object.assign({}, ApproveDto);
			this.files = [];
			this.file_name = [];
		},
	},

	data() {
		return {
			openConfirm: false,

			file: null,
			m_requestData: null,
			approveRequestDto: ApproveDto,
			user_info: this.getUserInfo(),
			attachmentFiles: [],
			files: [],
			file_name: [],
			requestProcessHis: ReqDataProcessHisDto,
		};
	},

	mounted() {},
	created() {
		this.m_requestData = this.request;
	},

	methods: {
		close() {
			this.$emit("close", true);
			this.files = [];
			this.file_name = [];
			this.approveRequestDto.reason = "";
			this.approveRequestDto = Object.assign({}, ApproveDto);
		},
		checkConfirm() {
			if (
				this.m_requestData.contractNumber &&
				this.m_requestData.resultSyncContract == true
			) {
				return (this.openConfirm = true);
			}
			this.approveRequest();
		},
		handleFileUpload(event) {
			this.file = event;
		},
		async approveRequest() {
			this.openConfirm = false;

			try {
				let response;
				this.approveRequestDto.action = "CancelApprove";
				this.approveRequestDto.errorMessageReturn =
					this.$t("error.fail");
				this.approveRequestDto.requestDataId = this.m_requestData.id;
				this.approveRequestDto.successMessageReturn = this.$t(
					"message.cancellation_of_successful_vote_approval",
				);
				this.approveRequestDto.userId = this.user_info.id;
				this.approveRequestDto.attachmentFileId = this.attachmentFiles;
				if (this.approveRequestDto.reason.trim() == "") {
					return this.toastError(this.$t("error.content_not_empty"));
				}
				response = await globalService.postData_Async(
					administratorAPI.API_Approve(),
					this.approveRequestDto,
				);
				// await this.saveReqdataProcessHis();

				if (!response || !response.state) {
					return this.toastError(this.$t("message.not_success"));
				}
				if (this.files.length > 0) {
					await this.upload();
				}
				if (response) {
					this.toastSuccess(
						this.$t(
							"message.cancellation_of_successful_vote_approval",
						),
					);
				}
				this.approveRequestDto = Object.assign({}, ApproveDto);
				this.$emit("close", true);
				this.close();
				this.$router.push({
					path: `/phieu-yeu-cau/list-request-handle`,
				});

				this.approveRequestDto.reason = "";
			} catch (error) {
				this.toastError(error);
			} finally {
				this.approveRequestDto.reason = "";
				this.approveRequestDto = Object.assign({}, ApproveDto);
				this.files = [];
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
			let files = document.getElementById("filesCancelAppr");
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
						return this.toastError(response.message);
					}
					this.attachmentFiles.push(response.data.id);
					this.files = [];
				}
			} catch (error) {
				this.toastError(error);
			}
		},
		async saveReqdataProcessHis() {
			let response;
			try {
				this.requestProcessHis.createDate = new Date();
				this.requestProcessHis.description =
					this.approveRequestDto.reason;
				this.requestProcessHis.organizationName = null;
				this.requestProcessHis.processDate = new Date();
				this.requestProcessHis.processer = this.user_info;
				this.requestProcessHis.processerName = this.user_info.fullName;
				this.requestProcessHis.rankName = null;
				this.requestProcessHis.requestData = {
					id: this.m_requestData.id,
				};
				this.requestProcessHis.isChild = true;
				this.requestProcessHis.status = this.$t(
					"button.cancelApproval",
				);
				response = await globalService.postData_Async(
					administratorAPI.API_CreateReqdataProcessHis(),
					this.requestProcessHis,
				);
				if (!response || !response.state) {
					return;
				}
			} catch (error) {
				this.toastError(error);
				return;
			}
		},
		async closeConfirm() {
			this.openConfirm = false;
		},
	},
};
</script>

<style lang="scss" scoped></style>
