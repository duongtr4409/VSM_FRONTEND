<template>
	<v-card>
		<v-toolbar color="grey lighten-4" elevation="0">
			<v-toolbar-title> {{ $t("label.export_file") }} </v-toolbar-title>
			<v-spacer></v-spacer>
			<v-btn icon @click="close()">
				<v-icon>mdi-close</v-icon>
			</v-btn>
		</v-toolbar>
		<v-card-text class="mt-4">
			<v-container>
				<v-row>
					<v-col>
						<v-textarea outlined v-model="content" maxLength="500">
							<template v-slot:label>
								{{ $t("label.mail_template_content") }}
							</template>
						</v-textarea>
					</v-col>
				</v-row>

				<v-row>
					<v-col>
						<v-checkbox
							v-if="stepData.isAddQRCode"
							v-model="isQR"
							:label="$t('label.qr_code')"
						>
						</v-checkbox>
					</v-col>
				</v-row>
				<v-row>
					<v-col>
						<v-checkbox
							v-if="stepData.isAddWaterMark"
							v-model="isWater"
							label="Watermark"
						>
						</v-checkbox>
					</v-col>
				</v-row>
			</v-container>
		</v-card-text>
		<v-card-actions>
			<v-spacer></v-spacer>
			<v-btn
				elevation="0"
				color="blue darken-2"
				dark
				class="rounded-0"
				@click="save()"
			>
				{{ $t("button.ok") }}
			</v-btn>
			<v-btn
				elevation="0"
				color="grey lighten-4"
				class="rounded-0"
				@click="close()"
			>
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
import store from "@/store";
import ReqDataProcessHisDto from "@/models/req-data-process-his.dto";
export default {
	name: "VSMFEExportfile",
	props: { requestDataV2: {}, attachmentFile: {}, stepDataRequest: {} },
	watch: {
		requestDataV2(newValue) {
			this.m_requestData = newValue;
		},
		attachmentFile(value) {
			this.itemAttachmentFile = value;
		},
		stepDataRequest(value) {
			this.stepData = value;
		},
	},
	data() {
		return {
			stepData: {},
			itemAttachmentFile: {},
			file: null,
			m_requestData: null,
			approveRequestDto: ApproveDto,
			user_info: this.getUserInfo(),
			files: [],
			isQR: false,
			isWater: false,
			requestProcessHis: ReqDataProcessHisDto,
			content: "",
		};
	},
	created() {
		this.m_requestData = this.requestDataV2;
		this.itemAttachmentFile = this.attachmentFile;
		this.stepData = this.stepDataRequest;

		this.files = [];
	},

	methods: {
		close() {
			this.$emit("close", true);
			this.content = null;
			this.isQR = false;
			this.isWater = false;
		},
		handleFileUpload(event) {
			this.file = event;
		},
		handleFile(files) {
			for (let i in Array.from(files.target.files)) {
				if (
					!this.files.find(
						(ele) =>
							ele.name == Array.from(files.target.files)[i].name,
					)
				) {
					this.files.push(Array.from(files.target.files)[i]);
				}
			}
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

		async save() {
			let param = {
				PDF: true,
				addHistory: false,
				addQrCode: this.isQR,
				addWatermark: this.isWater,
				// itemId: this.itemAttachmentFile.itemId365,
				attachmentFileId: this.itemAttachmentFile.id,
				userId: this.user_info?.id,
			};
			let fileName = encodeURIComponent(
				`${this.itemAttachmentFile.fileName.split(".")[0]}`.replaceAll(
					/[^a-zA-Z]+/gi,
					"_",
				),
			);
			let fileExtension = this.itemAttachmentFile.fileExtension;
			if (fileExtension == "pdf") param.PDF = false;
			if (param.PDF) fileExtension = "pdf";
			let urlDownload =
				store.state.config.apiUrl +
				administratorAPI.API_DownloadFile365(
					param,
					fileName,
					fileExtension,
				);
			
			//window.open(urlDownload, "_blank");
			let accessToken = store.state.accessToken;
			if (!accessToken) {
				accessToken =
					localStorage.getItem(constant.keys.accessToken) ||
					sessionStorage.getItem(constant.keys.accessToken);
			}
			let xhr = new XMLHttpRequest();
			xhr.open('GET', urlDownload);
			xhr.onreadystatechange = function(){
				if (xhr.readyState === xhr.DONE) {
					try{
						if (xhr.status === 200) {
							// this.response is a Blob, because we set responseType above
							let data_url = URL.createObjectURL(xhr.response);
							// console.log('data_url: ', data_url);
							// window.open(data_url, "_blank");
							let downloadLink = document.createElement("a");
							downloadLink.href = data_url;
							downloadLink.download = fileName + "." + fileExtension;
							document.body.appendChild(downloadLink);
							downloadLink.click();
							document.body.removeChild(downloadLink);
						} else {
							this.toastError(this.$t('error.load_file'));
						}
					}catch(e){
						this.toastError(this.$t('error.load_file'));
					}
				}
			};
			xhr.responseType = 'blob';
			xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
			xhr.send();



			this.content = null;
			this.isQR = false;
			this.isWater = false;
			this.toastSuccess(this.$t("message.upload_file_successfully"));
			this.$emit("close", true);
		},
		async saveReqdataProcessHis() {
			let response;
			try {
				this.requestProcessHis.createDate = new Date();
				this.requestProcessHis.description = this.content;
				(this.requestProcessHis.organizationName = null),
					(this.requestProcessHis.processDate = new Date());
				this.requestProcessHis.processer = this.user_info;
				this.requestProcessHis.processerName = this.user_info.fullName;
				this.requestProcessHis.rankName = null;
				(this.requestProcessHis.requestData = {
					id: this.m_requestData.id,
				}),
					(this.requestProcessHis.status =
						this.transferHandleDTO.statusTransferHandle.statusName),
					(response = await globalService.postData_Async(
						administratorAPI.API_CreateReqdataProcessHis(),
						this.requestProcessHis,
					));
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
