<template>
	<v-card elevation="0" ref="form">
		<v-toolbar flat color="grey lighten-4 max-h-[2.5rem]">
			<v-toolbar-title class="mb-5">
				{{ $t("label.deny") }}</v-toolbar-title
			>
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
								v-if="isDeny"
								:menu-props="{ bot: true, offsetY: true }"
								dense
								outlined
								hide-details
								:items="liststepInProcess"
								:item-value="(item) => item"
								v-model="stepData"
								item-text="stepDataName"
								:label="$t('label.step_list')"
							>
							</v-select>
						</v-col>
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
import customerAPI from "../../administrator/customer.api";
import ApproveDto from "@/models/approve.dto";

export default {
	name: "VsmFeRefuserequestform",
	// props: { request: {} },
    props: { request: {},  otp: { default: "" }, param: { default : ""} },
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
			stepInProcess: [],
			liststepInProcess: [],
			isDeny: false,
			stepData: null,
			file_name: [],
            m_otp: "",
		};
	},

	mounted() {
		//this.getStepInProcesses();
        this.m_otp = this.otp;
	},
	created() {
		this.m_requestData = this.request;
		this.approveRequestDto.reason = "";
        this.m_otp = this.otp;
		this.approveRequestDto = Object.assign({}, ApproveDto);
	},

	methods: {
		close() {
			this.approveRequestDto.reason = "";
			this.approveRequestDto = Object.assign({}, ApproveDto);
			this.files = [];
			this.file_name = [];
			this.$emit("closedeny", true);
		},
		handleFileUpload(event) {
			this.file = event;
		},
		async approveRequest() {
			try {
				this.approveRequestDto.reason =
					this.approveRequestDto.reason.trim();
				let response;
				this.approveRequestDto.action = "Reject";
				this.approveRequestDto.errorMessageReturn = this.$t(
					"message.reject_the_failed",
				);
				this.approveRequestDto.requestDataId = this.m_requestData.id;
				this.approveRequestDto.successMessageReturn = this.$t(
					"message.reject_success",
				);
				this.approveRequestDto.attachmentFileId = this.attachmentFiles;


				response = await globalService.postData_Async(
                    customerAPI.API_ProcessAnonymous(
							this.m_otp,
						),
						{
							action: 'Reject',
							requestData: this.param
						}
				);
				if (!response || !response.state) {
                    this.$emit("saveDenyed", false);
                    this.$emit("closedeny", false);
					return this.toastError(this.$t("message.not_success"));
				}
                this.$emit("saveDenyed", true);
                this.$emit("closedeny", true);
				
				this.toastSuccess(this.approveRequestDto.successMessageReturn);

				this.close();
				// this.$router.push({
				// 	path: `/phieu-yeu-cau/list-request-handle`,
				// });
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
			let files = document.getElementById("filesRefuse");
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
		async getStepInProcesses() {
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

				this.stepInProcess = response.data.filter(
					(ele) => ele.isActive && ele.stepOrder,
				);
				this.liststepInProcess = response.data.filter(
					(ele) =>
						!ele.isActive &&
						ele.stepOrder < this.stepInProcess[0].stepOrder,
				);
				if (this.stepInProcess[0].optionDeny > 0) {
					this.isDeny = true;
				}
			} catch (error) {
				this.toastError(error);
				return;
			}
		},
		async UpdateStepData() {
			let response;
			this.stepInProcess[0].optionDeny = this.stepData.stepOrder;

			try {
				response = await globalService.putData_Async(
					administratorAPI.API_UpDateStepData(
						this.stepInProcess[0].id,
					),
					this.stepInProcess[0],
				);
				if (!response || !response.state) {
					return;
				}

				// this.stepInProcess = response.data.find((ele) => ele.isActive);
			} catch (error) {
				this.toastError(error);
				return;
			}
		},
	},
};
</script>

<style lang="scss" scoped></style>
