<template>
	<v-card elevation="0" ref="form">
		<v-dialog max-width="60vw" v-model="openUserInfosRequestData">
			<UserInfosRequestDataVue
				@save="onSave"
				@close="onClose"
			></UserInfosRequestDataVue>
		</v-dialog>
		<v-toolbar flat color="grey lighten-4 max-h-[2.5rem]">
			<v-toolbar-title class="mb-5">
				{{ $t("label.is_examine") }}
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
							<v-row>
								<v-col cols="12" md="11">
									<!-- <v-autocomplete
										multiple
										dense
										outlined
										:items="listUser"
										keyName="id"
										item-text="fullName"
										label="Người nhận"
										clearable
									>
										<template v-slot:label>
											Người nhận
											<span class="red--text">*</span>
										</template>
									</v-autocomplete> -->
									<v-combobox
										v-model="userInfos"
										chips
										dense
										multiple
										outlined
										hide-details
									>
										<template v-slot:label>
											{{ $t("label.handler") }}
											<span class="red--text">*</span>
										</template>
										<template
											v-slot:selection="{
												attrs,
												item,
												parent,
												selected,
											}"
										>
											<v-chip
												v-if="item === Object(item)"
												v-bind="attrs"
												:input-value="selected"
												class="mt-2"
												close
												@click:close="removeUser(item)"
												outlined
											>
												<v-avatar
													color="red mr-2"
													size="30"
												>
													<span class="white--text">
														{{
															getAvatarText(
																item.fullName,
																2,
															)
														}}
													</span>
												</v-avatar>
												<span class="pr-2">
													{{ item.fullName }}
												</span>
												<v-icon
													small
													@click="
														parent.selectItem(item)
													"
												>
												</v-icon>
											</v-chip>
										</template>
									</v-combobox>
								</v-col>
								<v-col cols="12" md="1">
									<v-btn
										icon
										color="blue"
										@click="editUserInfosRequestData(index)"
									>
										<v-icon left>mdi-account-plus</v-icon>
									</v-btn>
								</v-col>
							</v-row>
						</v-col>
						<v-col cols="12" sm="12" md="12">
							<v-textarea
								dense
								outlined
								v-model="examineRequestDto.content"
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
											<v-card-text class="pl-0">
												<p
													class="
														text-[18px]
														text-[#454545]
													"
												>
													{{ $t("button.upload") }}
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
										id="filesReview"
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
import ExamineDto from "@/models/examine.dto";
import UserInfosRequestDataVue from "../RequestForm/UserInfosRequestData.vue";
import ReqDataProcessHisDto from "@/models/req-data-process-his.dto";
// import RequestDataDto from "@/models/request-data.dto";

export default {
	name: "VsmFeReviewrequestformV2",
	props: { request: {}, stepdatas: [] },
	components: { UserInfosRequestDataVue },
	watch: {
		request(newValue) {
			this.m_requestData = newValue;
			this.examineRequestDto.content = "";
			this.examineRequestDto = Object.assign({}, ExamineDto);
		},
		stepdatas(value) {
			this.stepInProcess = value;
		},
	},

	data() {
		return {
			file: null,
			m_requestData: null,
			examineRequestDto: ExamineDto,
			user_info: this.getUserInfo(),
			attachmentFiles: [],
			files: [],
			openUserInfosRequestData: false,
			userInfos: [],
			stepInProcess: [],
			requestProcessHis: ReqDataProcessHisDto,
			file_name: [],
		};
	},

	mounted() {},
	created() {
		this.m_requestData = this.request;
		this.examineRequestDto.content = "";
		this.load();
		this.stepInProcess = this.stepdatas;
	},

	methods: {
		load() {
			this.getStepInProcessesByIdRequestData();
		},
		removeUser(item) {
			this.userInfos.splice(this.userInfos.indexOf(item), 1);
		},
		onSave(value) {
			// this.userInfos = [value[0]];
			// this.userInfos = this.mergeArray(this.userInfos, value);
			this.userInfos = [];
			this.userInfos = value;
		},
		close() {
			this.userInfos = [];
			this.examineRequestDto.content = "";
			this.examineRequestDto = Object.assign({}, ExamineDto);
			this.files = [];
			this.file_name = [];
			this.$emit("close", true);
		},
		handleFileUpload(event) {
			this.file = event;
		},
		async approveRequest() {
			try {
				if (this.userInfos.length < 1) {
					return this.toastError(
						this.$t("label.empty_mail_template_receive"),
					);
				}
				this.examineRequestDto.content =
					this.examineRequestDto.content.trim();
				if (!this.examineRequestDto.content) {
					return this.toastError(
						this.$t("message.empty_requestContent"),
					);
				}

				let response;
				this.examineRequestDto.sender = this.user_info;
				this.examineRequestDto.sendDate = new Date();
				this.examineRequestDto.sendName = this.user_info.fullName;
				this.examineRequestDto.receiver = this.userInfos[0];
				this.examineRequestDto.receiveName = this.userInfos[0].fullName;
				this.examineRequestDto.stepData = this.stepInProcess[0];
				this.examineRequestDto.attachFileList = JSON.stringify(
					this.attachmentFiles,
				);

				response = await globalService.postData_Async(
					administratorAPI.API_Examine(),
					this.examineRequestDto,
				);
				if (!response || !response.state) {
					return this.toastError(this.$t("message.not_success"));
				}
				if (!this.files.length == 0) {
					await this.upload();
				}
				this.toastSuccess(this.$t("message.review_request_successful"));

				await this.updateRequestData();
				await this.saveReqdataProcessHis();
				this.$emit("save", true);
				this.$emit("close", true);
				this.examineRequestDto = Object.assign({}, ExamineDto);
				this.close();

				// this.$router.push({
				// 	path: `/phieu-yeu-cau/list-request-handle`,
				// });
			} catch (error) {
				this.toastError(error);
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
			let files = document.getElementById("filesReview");
			files.click();
		},
		remove(file) {
			let index = this.files.indexOf(file);
			this.files.splice(index, 1);
		},
		editUserInfosRequestData(index) {
			this.openUserInfosRequestData = true;
			this.itemIndex = index;
		},
		onClose() {
			this.openUserInfosRequestData = false;
			this.itemIndex = -1;
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
					this.files = [];
					//this.$emit(constant.keys.upload, true);
				}
				// this.$emit("save", this.attachmentFiles);
				// this.closeDialog();
			} catch (error) {
				this.toastError(error);
			}
		},
		async getStepInProcessesByIdRequestData() {
			let response;
			try {
				response = await globalService.getData_Async(
					administratorAPI.API_GetSteepDataByIdRequest(
						this.m_requestData.id,
					),
				);
				if (!response || !response.state) {
					return;
				}
				this.stepInProcess = response.data.filter((ele) => {
					return ele.isActive;
				});
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
					this.examineRequestDto.content;
				this.requestProcessHis.organizationName = "";
				this.requestProcessHis.processDate = new Date();
				if (this.userInfos.length == 0) {
					return;
				}
				this.requestProcessHis.processer = this.userInfos[0];
				this.requestProcessHis.processerName =
					this.userInfos[0].fullName;
				this.requestProcessHis.rankName = null;
				this.requestProcessHis.requestData = {
					id: this.m_requestData.id,
				};
				this.requestProcessHis.isChild = true;
				this.requestProcessHis.status = this.$t(
					"message.sended_review_request",
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

		mergeArray(sourceArray, mergeArray) {
			if (!sourceArray) return mergeArray;
			if (!mergeArray) return sourceArray;
			let result = [...sourceArray];
			mergeArray.forEach((ele) => {
				if (!sourceArray.some((ele1) => ele1.id == ele.id))
					result.push(ele);
			});
			return result;
		},

		async updateRequestData() {
			try {
				let response;
				this.m_requestData.userInfos.push(...this.userInfos);
				this.m_requestData.createdDate = new Date();
				response = await globalService.putData_Async(
					administratorAPI.API_UpdateRequestData(
						this.m_requestData.id,
					),
					this.m_requestData,
				);
				if (!response || !response.state) {
					this.toastError(this.$t("error.load"));
				}
				this.toastSuccess(this.$t("message.update_success"));
			} catch (error) {
				this.toastError("1");
			}
		},
	},
};
</script>

<style lang="scss" scoped></style>
