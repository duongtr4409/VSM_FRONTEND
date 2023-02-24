<template>
	<v-card elevation="0" ref="form">
		<v-toolbar flat color="grey lighten-4 max-h-[2.5rem]">
			<v-toolbar-title class="mb-5">
				{{ $t("button.answer") }}
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
								v-model="examineReplyDto.content"
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
						<v-col cols="12" sm="12" md="12" style="padding: 0">
							<v-card-text style="padding: 0">
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
											<v-card-text>
												{{ $t("button.upload") }}
											</v-card-text>
											<v-divider vertical></v-divider>
											<v-icon x-large class="ml-4"
												>mdi-cloud-upload-outline
											</v-icon>
										</div>
									</v-card>
									<input
										ref="files"
										id="filesAnswer"
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
																file.name.split(
																	".",
																)[
																	file.name.split(
																		".",
																	).length - 1
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
							</v-card-text>
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
import ConsultReplyDTO from "@/models/consultReply.dto";
import ReqDataProcessHisDto from "@/models/req-data-process-his.dto";
export default {
	name: "VsmFeAAnswerRequestform",
	props: { request: {} },
	watch: {
		request(newValue) {
			this.m_requestData = newValue;
			this.examineReplyDto.content = "";
			this.examineReplyDto = Object.assign({}, ConsultReplyDTO);
			this.files = [];
		},
	},

	data() {
		return {
			file: null,
			m_requestData: null,
			examineReplyDto: ConsultReplyDTO,
			user_info: this.getUserInfo(),
			attachmentFiles: [],
			files: [],
			file_name: [],
			consult: [],
			requestProcessHis: ReqDataProcessHisDto,
		};
	},

	mounted() {},
	created() {
		this.m_requestData = this.request;
		this.examineReplyDto.content = "";
		this.getConsultReply();
	},

	methods: {
		close() {
			this.$emit("close", true);
			this.examineReplyDto = Object.assign({}, ConsultReplyDTO);
			this.files = [];
			this.file_name = [];
			this.examineReplyDto.content = "";
		},
		handleFileUpload(event) {
			this.file = event;
		},
		async approveRequest() {
			this.examineReplyDto.content = this.examineReplyDto.content.trim();
			if (!this.examineReplyDto.content) {
				return this.toastError(this.$t("message.empty_requestContent"));
			}

			let response;
			// console.log("this.user_info.ranks[0].rankName",this.user_info.ranks[0].rankName);

			// this.examineReplyDto.rankName = this.user_info.ranks[0].rankName;
			this.examineReplyDto.replier = this.user_info;
			this.examineReplyDto.replyDate = new Date();
			this.examineReplyDto.replyName = this.user_info.fullName;
			this.examineReplyDto.sendDate = new Date();
			this.examineReplyDto.sendName = this.user_info.fullName;
			this.examineReplyDto.sender = this.user_info;
			this.examineReplyDto.consult = this.consult[0];
			this.examineReplyDto.attachFileList = JSON.stringify(
				this.attachmentFiles,
			);
			try {
				response = await globalService.postData_Async(
					administratorAPI.API_CreateConsultReply(),
					this.examineReplyDto,
				);
				if (!response || !response.state) {
					return this.toastError(this.$t("message.not_success"));
				}
				if (this.files.length > 0) {
					await this.upload();
				}
				this.toastSuccess(
					this.$t("message.answer_the_vote_successfully"),
				);
				await this.saveReqdataProcessHis();
				this.$emit("close", true);
			} catch (error) {
				console.log(error);
			} finally {
				this.examineReplyDto.content = "";
				this.examineReplyDto = Object.assign({}, ConsultReplyDTO);
				this.files = [];
			}
			// this.$router.push({
			// 	path: `/phieu-yeu-cau/list-request-handle`,
			// });

			this.examineReplyDto.content = "";
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
			let files = document.getElementById("filesAnswer");
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
				}
			} catch (error) {
				this.toastError(error);
			}
		},
		async getConsultReply() {
			let response;

			try {
				response = await globalService.getData_Async(
					administratorAPI.API_GetAllConsultByUserAndRequestData(
						this.user_info.id,
						this.m_requestData.id,
					),
				);
				if (!response || !response.state) {
					return;
				}

				this.consult = response.data;
			} catch (error) {
				this.toastError(error);
				return;
			}
		},
		async saveReqdataProcessHis() {
			let response;
			try {
				this.requestProcessHis.createDate = new Date();
				this.requestProcessHis.description =
					this.examineReplyDto.content;
				this.requestProcessHis.organizationName = null;
				this.requestProcessHis.processDate = new Date();
				this.requestProcessHis.processer = this.user_info;
				this.requestProcessHis.processerName = this.user_info.fullName;
				this.requestProcessHis.rankName = null;
				this.requestProcessHis.requestData = {
					id: this.m_requestData.id,
				};
				this.requestProcessHis.isChild = true;
				this.requestProcessHis.status = this.$t("button.answer");
				response = await globalService.postData_Async(
					administratorAPI.API_CreateReqdataProcessHis(),
					this.requestProcessHis,
				);
				if (!response || !response.state) {
					return;
				}
				if (response) {
					this.examineReplyDto = ConsultReplyDTO;
				}
			} catch (error) {
				this.toastError(error);
				return;
			}
		},
	},
};
</script>

<style lang="scss" scoped></style>
