<template>
	<v-card elevation="0" ref="form">
		<v-toolbar flat color="grey lighten-4 max-h-[2.5rem]">
			<v-toolbar-title class="mb-5"> {{ $t("button.return") }} </v-toolbar-title>
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
						<v-container class="p-0">
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
									<v-card-text class="pl-0">
										<p class="text-[18px] text-[#454545]">
											{{ $t("title.upload_file") }}
										</p>
									</v-card-text>
									<v-divider vertical></v-divider>
									<v-icon class="mx-[8px] size-[24px]"
										>mdi-cloud-upload-outline
									</v-icon>
								</div>
							</v-card>
							<input
								ref="files"
								id="filesReturn"
								type="file"
								accept=".xlsx,.docx,.pptx,.pdf"
								class="d-none"
								multiple
								@change="handleFile($event)"
							/>
							<VuePerfectScrollbar class="h-60">
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
							</VuePerfectScrollbar>
						</v-container>
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

export default {
	name: "VsmFeReturnrequestformV2",
	props: { request: {} },
	watch: {
		request(newValue) {
			this.m_requestData = newValue;
			this.approveRequestDto.reason = "";
			this.approveRequestDto = Object.assign({}, ApproveDto);
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
		};
	},

	mounted() {},
	created() {
		this.m_requestData = this.request;
		this.approveRequestDto.reason = "";
	},

	methods: {
		close() {
			this.$emit("close", true);
			this.approveRequestDto.reason = "";
			this.files = [];
			this.file_name = [];
			this.approveRequestDto = Object.assign({}, ApproveDto);
		},
		handleFileUpload(event) {
			this.file = event;
		},
		async approveRequest() {
			try {
				this.approveRequestDto.reason =
					this.approveRequestDto.reason.trim();
				if (!this.approveRequestDto.reason) {
					return this.toastError(
						this.$t("message.empty_requestContent"),
					);
				}

				let response;
				this.approveRequestDto.action = "Reject";
				this.approveRequestDto.errorMessageReturn =
					this.$t("error.fail");
				this.approveRequestDto.requestDataId = this.m_requestData.id;
				this.approveRequestDto.successMessageReturn = this.$t(
					"message.return_the_ticket_successfully",
				);
				this.approveRequestDto.userId = this.user_info.id;
				this.approveRequestDto.attachmentFileId = this.attachmentFiles;
				try {
					response = await globalService.postData_Async(
						administratorAPI.API_Approve(),
						this.approveRequestDto,
					);
				} catch (error) {
					console.log(error);
				}
				if (!response || !response.state) {
					return this.toastError(this.$t("message.not_success"));
				}
				if (this.files.length > 0) {
					await this.upload();
				}
				this.toastSuccess(
					this.$t("message.return_the_ticket_successfully"),
				);
				this.$emit("close", true);
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
			let files = document.getElementById("filesReturn");
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
					// console.log("file", file);
					// console.log("this.requestData: ", this.requestData);
					response = await globalService.uploadData_Async(
						administratorAPI.API_UploadFile365(),
						file,
						{
							parentItemId: this.m_requestData?.idDirectoryPath,
							userId: this.userInfo.id,
							requestDataId: this.m_requestData?.id,
						},
					);
					if (!response) {
						return this.toastError(this.$t("error.upload_file"));
					}
					if (!response.state) {
						return this.toastError(response.message);
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
