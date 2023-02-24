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
		<v-card-text class="white">
			<v-container>
				<v-form v-model="valid">
					<v-row>
						<v-col cols="12" sm="12" md="12">
							<v-textarea
								dense
								outlined
								v-model="approveRequestDto.reason"
								maxLength="500"
								hide-details
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
						<v-col cols="12" sm="12" md="12">
							<v-card
								elevation="0"
								dropzone
								:class="!isDragOver ? '' : 'background-active'"
								class="items-center p-0"
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
										{{ $t("Tải lên") }}
									</v-card-text>
									<v-divider vertical></v-divider>
									<v-icon class="mx-[8px] size-[24px]"
										>mdi-cloud-upload-outline
									</v-icon>
								</div>
							</v-card>
							<input
								ref="files"
								id="filesApproveAll"
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
				@click="approveRequest_All()"
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
import constant from "@/common/constant";

export default {
	name: "ApproveAllPopupVue",
	props: { selected: [] },
	watch: {
		selected(newValue) {
			this.m_selected = newValue;
			this.files = [];
			this.file_name = [];
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
			m_selected: [],
			list_requestId: [],
			results: [],
			isSaving: false,
		};
	},

	mounted() {},
	created() {
		this.m_selected = this.selected;
		this.approveRequestDto.reason = "";
	},

	methods: {
		close() {
			this.$emit("close", true);
			this.approveRequestDto.reason = "";
			this.approveRequestDto = Object.assign({}, ApproveDto);
			this.files = [];
			this.file_name = [];
			this.m_selected = [];
		},
		handleFileUpload(event) {
			this.file = event;
		},
		async approveRequest_All() {
			this.list_requestId = [];
			this.approveRequestDto.reason =
				this.approveRequestDto.reason.trim();
			this.results = [];

			for (const request of this.m_selected) {
				this.list_requestId.push(request.id);
			}
			if (!this.approveRequestDto.reason) {
				return this.toastError(this.$t("message.empty_requestContent"));
			}
			let reqBody = {
				action: "Agree",
				attachmentFileId: null,
				errorMessageReturn: this.$t("message.not_success"),
				listRequestDataId: this.list_requestId,
				reason: this.approveRequestDto.reason,
				statusId: null,
				successMessageReturn: this.$t("message.msg_12"),
				userId: this.user_info.id,
			};
			try {
				let response = await globalService.postData_Async(
					administratorAPI.API_ApproveAll(),
					reqBody,
				);

				if (!response) return;
				for (const item in response.data) {
					this.results.push({
						item: this.m_selected.find((entry) => {
							return entry.id == item;
						}),
						data: response.data[item]
							? this.$t("message.msg_12")
							: this.$t("message.not_success"),
					});
					if (response.data[item]) {
						await this.upload(item);
					}
				}
				this.$emit(constant.keys.close, this.results);
				this.close();
			} catch (error) {
				console.log(error);
			} finally {
				this.approveRequestDto.reason = "";
				this.approveRequestDto = Object.assign({}, ApproveDto);
				this.files = [];
				this.file_name = [];
				this.m_selected = [];
			}
		},
		// async approveRequest(item) {
		// 	if (!this.files.length == 0) {
		// 		await this.upload(item);
		// 	}
		// 	let response;
		// 	this.approveRequestDto.action = "Agree";
		// 	this.approveRequestDto.errorMessageReturn = this.$t(
		// 		"message.not_success",
		// 	);
		// 	this.approveRequestDto.requestDataId = item.id;
		// 	this.approveRequestDto.successMessageReturn =
		// 		this.$t("message.success");
		// 	this.approveRequestDto.userId = this.user_info.id;
		// 	this.approveRequestDto.attachmentFileId = this.attachmentFiles;
		// 	try {
		// 		response = await globalService.postData_Async(
		// 			administratorAPI.API_Approve(),
		// 			this.approveRequestDto,
		// 		);
		// 	} catch (error) {
		// 		console.log(error);
		// 	}
		// 	// if (!response || !response.state) {
		// 	// 	this.toastError(this.$t("message.not_success"));
		// 	// }
		// 	this.approveRequestDto.reason = "";
		// 	return response;
		// 	// this.toastSuccess("Phê duyệt phiếu thành công");
		// 	// this.approveRequestDto.reason = "";
		// 	// this.$emit("close", true);
		// 	// this.$router.push({
		// 	// 	path: `/phieu-yeu-cau/list-request-handle`,
		// 	// });
		// },
		handleFile(files) {
			if (this.file_name.indexOf(files.target.value) != -1) return;
			this.file_name.push(files.target.value);
			this.files = this.files.concat(Array.from(files.target.files));
			for (let file of this.files) {
				let ext = file.name.split(".").pop();
				let arr = ["docx", "pdf", "xlsx", "pptx","jpg", "jpeg"];

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
			let files = document.getElementById("filesApproveAll");
			files.click();
		},
		remove(file) {
			let index = this.files.indexOf(file);
			this.files.splice(index, 1);
		},
		async upload(id) {
			if (!this.files.length) {
				return;
			}
			let item = this.m_selected.find((ele) => ele.id == id);
			if (!item) {
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
							parentItemId: item.idDirectoryPath,
							userId: this.userInfo.id,
							requestDataId: item.id,
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
					// this.files = [];
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
