<template>
	<v-card elevation="0" ref="form">
		<v-toolbar flat color="grey lighten-4 max-h-[2.5rem]">
			<v-toolbar-title class="mb-5"> Xin thu hồi </v-toolbar-title>
			<v-spacer></v-spacer>
			<v-btn icon @click="close" class="mb-5">
				<v-icon>mdi-close</v-icon>
			</v-btn>
		</v-toolbar>
		<v-card-text class="white">
			<v-container>
				<v-form v-model="valid">
					<v-row>
						<v-col cols="12" md="12">
							<v-select
								:menu-props="{ bot: true, offsetY: true }"
								dense
								outlined
								hide-details
								:items="stepInProcess"
								:item-value="(item) => item"
								v-model="liststepInProcess"
								item-text="stepDataName"
								:label="$t('label.step_list')"
							>
							</v-select>
						</v-col>
						<v-col cols="12" sm="12" md="12">
							<v-textarea
								dense
								outlined
								hide-details
								v-model="requestRecallDto.reason"
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
import RequestRecallDto from "@/models/requestRecall.dto";
import constant from "@/common/constant";
import ReqDataProcessHisDto from "@/models/req-data-process-his.dto";
export default {
	name: "VSMFEPleaseRecoveryRequest",
	props: { request: {} },
	components: {},
	watch: {
		request(newValue) {
			this.m_requestData = newValue;
			this.requestRecallDto.reason = "";
			this.requestRecallDto = Object.assign({}, RequestRecallDto);
		},
	},

	data() {
		return {
			file: null,
			m_requestData: null,
			requestRecallDto: RequestRecallDto,
			user_info: this.getUserInfo(),
			attachmentFiles: [],
			files: [],
			file_name: [],
			openUserInfosRequestData: false,
			userInfos: [],
			stepInProcess: [],
			liststepInProcess: {},
			requestProcessHis: ReqDataProcessHisDto,
		};
	},

	mounted() {},
	created() {
		this.m_requestData = this.request;
		this.load();
	},

	methods: {
		load() {
			this.getStepDataCurrentByIdRequestData();
		},
		removeUser(item) {
			this.userInfos.splice(this.userInfos.indexOf(item), 1);
		},
		onSave(value) {
			this.userInfos = [value[0]];
		},
		close() {
			this.$emit("close", true);
			this.requestRecallDto.reason = "";
			this.requestRecallDto = Object.assign({}, ReqDataProcessHisDto);
			this.files = [];
			this.file_name = [];
		},
		handleFileUpload(event) {
			this.file = event;
		},
		async approveRequest() {
			try {
				let response;
				this.requestRecallDto.recaller = this.user_info;
				this.requestRecallDto.createdName = this.user_info.fullName;
				this.requestRecallDto.requestData = {
					id: this.m_requestData.id,
				};
				this.requestRecallDto.stepData = this.liststepInProcess;

				response = await globalService.postData_Async(
					administratorAPI.API_CreateRequestRecall(),
					this.requestRecallDto,
				);
				if (!response || !response.state) {
					return this.toastError(this.$t("message.not_success"));
				}
				this.toastSuccess(this.$t("message.please_recover_successfully"));

				await this.saveReqdataProcessHis();
				this.$emit("close", true);
				this.close();
				this.$router.push({
					path: `/phieu-yeu-cau/list-request-handle`,
				});
			} catch (error) {
				this.toastError(error);
			} finally {
				this.requestRecallDto = Object.assign({}, ReqDataProcessHisDto);
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
			let files = document.getElementById(constant.keys.files);
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
					//this.$emit(constant.keys.upload, true);
				}
				// this.$emit("save", this.attachmentFiles);
			} catch (error) {
				this.toastError(error);
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
				let currenStepDate = response.data.find((ele) => ele.isActive);
				this.stepInProcess = response.data.filter((e) => {
					console.log("currenStepDate", currenStepDate);
					let result =
						e.stepOrder < currenStepDate.stepOrder ? true : false;
					result =
						result &&
						e.userInfos.some((e) => e.id == this.user_info.id);
					return result;
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
					this.requestRecallDto.reason;
				this.requestProcessHis.organizationName = null;
				this.requestProcessHis.processDate = new Date();
				this.requestProcessHis.processer = this.user_info;
				this.requestProcessHis.processerName = this.user_info.fullName;
				this.requestProcessHis.rankName = null;
				this.requestProcessHis.requestData = {
					id: this.m_requestData.id,
				};
				this.requestProcessHis.isChild = true;
				this.requestProcessHis.status = this.$t("message.please_recover");
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
	},
};
</script>

<style lang="scss" scoped></style>
