<template>
	<v-card elevation="0" ref="form">
		<v-toolbar flat color="grey lighten-4 max-h-[2.5rem]">
			<v-toolbar-title class="mb-5"> Trình phê duyệt</v-toolbar-title>
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
								v-model="approveRequestDto.reason"
								dense
								outlined
								hide-details
								maxLength="500"
							>
								<template v-slot:label>
									{{ $t("label.mail_template_content") }}
									<span class="text-red-600">{{
										$t("label.star")
									}}</span>
								</template>
							</v-textarea>
						</v-col>
						<v-container class="mt-2 p-0">
							<!-- <v-card
										elevation="0"
										dropzone
										:class="
											!isDragOver
												? 'bordered bordered-solid'
												: 'bordered bordered-dashed background-active'
										"
										class="w-40 items-center p-0"
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
												{{ $t("button.upload") }}
											</v-card-text>
											<v-divider vertical></v-divider>
											<v-icon x-large class="ml-4"
												>mdi-cloud-upload-outline
											</v-icon>
										</div>
									</v-card> -->
							<!-- <input
										ref="files"
										id="files"
										type="file"
										class="d-none"
										multiple
										@change="handleFile($event)"
									/> -->
							<label for="approveFiles">
								<v-card elevation="0">
									<div
										class="
											d-flex
											justify-space-between
											border-2
											px-2
										"
									>
										<v-card-text>
											{{ $t("button.upload") }}
										</v-card-text>
										<v-divider vertical></v-divider>
										<v-icon x-large class="ml-4"
											>mdi-cloud-upload-outline
										</v-icon>
									</div>
								</v-card>
							</label>
							<input
								ref="approveFiles"
								id="approveFiles"
								type="file"
								class="sr-only"
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
import constant from "@/common/constant";
import VuePerfectScrollbar from "vue-perfect-scrollbar";
export default {
	name: "VsmFeApprovalAllRequest",
	comments: { VuePerfectScrollbar },
	props: { selected: {}, isShow: Boolean },
	watch: {
		selected(val) {
			this.m_selected = val;
			this.approveRequestDto.reason = "";
			this.approveRequestDto = Object.assign({}, ApproveDto);
		},
		isShow(val) {
			this.showDialog = val;
			if (val) {
				this.approveRequestDto.reason = "";
				this.approveRequestDto = Object.assign({}, ApproveDto);
				this.files = [];
				this.file_name = [];
			}
		},
		showDialog: function (value) {
			if (value) {
				this.approveRequestDto = Object.assign({}, ApproveDto);
				this.approveRequestDto.reason = "";
				this.files = [];
				this.file_name = [];
			}
		},
	},

	data() {
		return {
			m_selected: [],
			file: null,
			m_requestData: null,
			approveRequestDto: ApproveDto,
			user_info: this.getUserInfo(),
			attachmentFiles: [],
			files: [],
			file_name: [],
			results: [],
			showDialog: false,
		};
	},

	mounted() {},
	created() {
		this.m_selected = this.selected;
		this.approveRequestDto = Object.assign({}, ApproveDto);
		this.showDialog = this.isShow;
	},

	methods: {
		close() {
			this.files = [];
			this.file_name = [];
			this.approveRequestDto.reason = "";
			this.approveRequestDto = Object.assign({}, ApproveDto);
			this.$emit("close", true);
		},

		async approveRequest() {
			if (this.approveRequestDto.reason?.trim() == "") {
				return this.toastError(this.$t("message.empty_requestContent"));
			}

			try {
				let response;
				this.results = [];

				// this.toastSuccess("Kí thành công");
				for (const request of this.m_selected) {
					this.approveRequestDto.action = "Send";
					this.approveRequestDto.errorMessageReturn = this.$t(
						"error.approval_fail",
					);
					this.approveRequestDto.requestDataId = request.id;
					this.approveRequestDto.successMessageReturn = this.$t(
						"message.approve_request_success",
					);
					this.approveRequestDto.userId = this.user_info.id;
					response = await globalService.postData_Async(
						administratorAPI.API_Approve(),
						this.approveRequestDto,
					);
					if (!response) return;
					if (this.files?.length) {
						await this.upload(request);
					}
					this.results.push({
						item: this.m_selected.find((entry) => {
							return entry.id == request.id;
						}),
						data: response.state
							? this.$t("message.msg_5")
							: this.$t("message.approve_request_error"),
					});
				}

				this.$emit(constant.keys.result, this.results);

				this.$emit("success", true);
				this.approveRequestDto.reason = "";
				this.files = [];
				this.$emit("close", true);
				this.close();
			} catch (error) {
				console.log(error);
			} finally {
				this.approveRequestDto.reason = "";
				this.approveRequestDto = Object.assign({}, ApproveDto);
				this.files = [];
				this.file_name = [];
				// this.m_selected = [];
			}

			// this.$router.push({
			// 	path: `/phieu-yeu-cau/list-request-wait-approval`,
			// });
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
			let files = document.getElementById(constant.keys.files);
			files.click();
		},
		remove(file) {
			let index = this.files.indexOf(file);
			this.files.splice(index, 1);
		},
		async upload(request) {
			if (!this.files.length) {
				return;
			}
			let response;
			try {
				for (let file of this.files) {
					response = await globalService.uploadData_Async(
						administratorAPI.API_UploadFile365(),
						file,
						{
							parentItemId: request?.idDirectoryPath,
							userId: this.userInfo.id,
							requestDataId: request.id,
						},
					);
					if (!response) {
						return this.toastError(this.$t("error.upload_file"));
					}
					if (!response.state) {
						return this.toastError(response.message);
					}
					this.attachmentFiles.push(response.data);
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
