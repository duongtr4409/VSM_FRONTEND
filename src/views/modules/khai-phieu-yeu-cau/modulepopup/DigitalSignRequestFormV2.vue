<template>
	<v-card elevation="0" ref="form">
		<v-toolbar flat color="grey lighten-4 max-h-[2.5rem]">
			<v-toolbar-title class="mb-5">
				{{ $t("button.confirming") }}
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
								v-model="signDto.reason"
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
							<v-select
								:menu-props="{ bot: true, offsetY: true }"
								:items="list_form_digitalSignture"
								item-text="name_DigitalSignture"
								:label="$t('label.select_digital_signture')"
								outlined
								:item-value="(item) => item.id_DigitalSignture"
								dense
								v-model="signDto.signType"
							>
							</v-select>
						</v-col>

						<!-- <v-col cols="12" sm="12" md="12">
								<v-text-field
									:label="
										$t('label.rental_code_phone_number')
									"
									outlined
									dense
								></v-text-field>
							</v-col> -->
						<v-col
							v-if="signDto.signType == signType.SOFT"
							cols="12"
							sm="12"
							md="12"
						>
							<v-text-field
								:label="$t('title.password')"
								outlined
								dense
								v-model="signDto.password"
								type="password"
							>
							</v-text-field>
						</v-col>
						<v-col
							v-if="signDto.signType == signType.SIM"
							cols="12"
							sm="12"
							md="12"
						>
							<v-text-field
								:label="$t('label.numberphone')"
								outlined
								dense
								v-model="numberPhone"
								prefix="(+84)"
							></v-text-field>
						</v-col>
						<v-col
							cols="12"
							sm="12"
							md="12"
							v-if="signDto.signType == signType.SOFT"
						>
							<v-text-field
								:label="$t('label.sign_position')"
								outlined
								dense
								v-model="signDto.symbol"
							>
							</v-text-field>
						</v-col>
						<v-col
							cols="12"
							sm="12"
							md="12"
							v-if="signDto.signType == signType.TOKEN"
						>
							<v-select
								:menu-props="{ bot: true, offsetY: true }"
								:items="tokenType"
								item-text="name_TokenType"
								:label="$t('label.select_token_type')"
								outlined
								:item-value="(item) => item.id_TokenType"
								dense
								v-model="tokenChoice"
							></v-select>
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
				class="rounded-0"
				@click="sign()"
			>
				{{ $t("button.ok") }}
			</v-btn>
			<v-btn
				color="grey lighten-4"
				elevation="0"
				class="rounded-0"
				@click="close"
			>
				{{ $t("button.cancel") }}
			</v-btn>
		</v-card-actions>
	</v-card>
</template>

<script>
import globalService from "@/services/global.service";
import SignDto from "@/models/sign.dto";
import constant from "@/common/constant";
import ReqDataProcessHisDto from "@/models/req-data-process-his.dto";
import SIGN_TYPE from "@/common/SIGN_TYPE";
import signApi from "@/views/modules/khai-phieu-yeu-cau/sign.api";
import customerAPI from "../../administrator/customer.api";
export default {
	name: "VSMFEDigitalSignRequestFormV2",
	menu: false,
	props: {
		request: {},
		signData: {},
		otp: { default: "" },
		param: { default: "" },
	},
	watch: {
		async request(newValue) {
			this.m_requestData = newValue;
			this.signDto.reason = "";
			this.signDto.password = "";
			this.signDto.msisdn = "";
			this.signDto = Object.assign({}, SignDto);
			this.files = [];
		},
		signData(value) {
			this.m_signData = value;
		},
	},

	data() {
		return {
			isDragOver: false,
			requestProcessHis: ReqDataProcessHisDto,
			signType: SIGN_TYPE,
			time: "",
			expiryDate: "",
			file: null,
			m_requestData: null,
			signDto: SignDto,
			attachmentFiles: [],
			files: [],
			file_name: [],
			listSignture: [],
			list_form_digitalSignture: [
				{
					id_DigitalSignture: SIGN_TYPE.SIM,
					name_DigitalSignture: this.$t("label.sign_sim"),
				},
				{
					id_DigitalSignture: SIGN_TYPE.TOKEN,
					name_DigitalSignture: this.$t("label.sign_token"),
				},
			],
			form_digitalSignture: "",
			signFiles: [],
			imageSign:
				"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",
			tokenType: [
				// {
				// 	id_TokenType: SIGN_TYPE.SIGN_TYPE_TOKEN.VIETTEL,
				// 	name_TokenType: this.$t("label.sign_token_viettel"),
				// },
				{
					id_TokenType: SIGN_TYPE.SIGN_TYPE_TOKEN.MOBIFONE,
					name_TokenType: this.$t("label.sign_token_mobifone"),
				},
			], // danh s??ch ki???u k?? tocken
			tokenChoice: "",
			m_otp: "",
		};
	},

	async mounted() {
		this.m_signData = this.signData;
		this.m_otp = this.otp;
	},
	created() {
		this.m_requestData = this.request;
		this.m_otp = this.otp;
	},

	methods: {
		close() {
			this.signDto.reason = "";
			this.signDto.password = "";
			this.signDto.msisdn = "";
			this.file_name = [];
			this.files = [];
			this.signDto = Object.assign({}, SignDto);
			this.$emit("close", false);
		},
		handleFileUpload(event) {
			this.file = event;
		},
		async sign() {
			let response;
			if (this.signDto.reason.trim() == "") {
				return this.toastError(this.$t("error.content_not_empty"));
			}
			try {
				let signed = false;
				if (this.signDto.signType == SIGN_TYPE.TOKEN) {
					if (
						this.tokenChoice == SIGN_TYPE.SIGN_TYPE_TOKEN.MOBIFONE
					) {
						signed = await this.signTokenMofiFone();
					} else if (
						this.tokenChoice == SIGN_TYPE.SIGN_TYPE_TOKEN.VIETTEL
					) {
						signed = await this.signTokenViettel();
					}
					if (!signed) {
						this.toastError(this.$t("error.sign"));
						//this.$emit("saveSigned", false);
						this.$emit("close", false);
						return;
					}
					let response_approve = await globalService.postData_Async(
						customerAPI.API_ProcessAnonymous(this.m_otp),
						{
							action: "Agree",
							requestData: this.param,
						},
					);
					if (!response_approve || !response_approve.state) {
						this.toastError(this.$t("error.fail"));
						//this.$emit("saveSigned", false);

						this.$emit("close", false);
						return;
					}
					this.toastSuccess(this.$t("label.signed_successfully_approve"));
					this.$emit("saveSigned", true);
					this.$emit("close", true);
				} else if (
					this.signDto.signType == SIGN_TYPE.SIM &&
					this.m_requestData
				) {
					if (this.numberPhone) {
						let startIndex = this.numberPhone.charAt(0);
						let checkNumberPhone = this.numberPhone.slice(0, 2);
						if (startIndex == 0) {
							this.signDto.msisdn =
								"84" + this.numberPhone.slice(1);
							this.numberPhone = this.numberPhone.slice(1);
						} else if (checkNumberPhone == "84") {
							this.signDto.msisdn = this.numberPhone;
							this.numberPhone = this.numberPhone.slice(2);
						} else {
							this.signDto.msisdn = "84" + this.numberPhone;
						}
					}
					this.signDto.requestDataList = [this.m_requestData.id];
					this.signDto.userId = null;
					response = await globalService.postData_Async(
						customerAPI.API_SignAnonymous(this.m_otp),
						this.signDto,
					);
					// if (!response) {
					// 	return this.toastError(this.$t("error.sign"));
					// }
					// if (!response.state) {
					// 	return this.toastError(response.messgage);
					// }
					if (!response || !response.state) {
						this.toastError(this.$t("error.sign"));
						//this.$emit("saveSigned", false);

						this.$emit("close", false);
						return;
					}
					let response_approve = await globalService.postData_Async(
						customerAPI.API_ProcessAnonymous(this.m_otp),
						{
							action: "Agree",
							requestData: this.param,
						},
					);
					if (!response_approve || !response_approve.state) {
						this.toastError(this.$t("error.fail"));
						//this.$emit("saveSigned", false);

						this.$emit("close", false);
						return;
					}

					this.toastSuccess(this.$t("label.signed_successfully_approve"));
					this.$emit("saveSigned", true);

					this.$emit("close", true);
				}
			} catch (error) {
				this.toastError(error);
				return;
			} finally {
				this.files = [];
				this.file_name = [];
				this.signDto.reason = "";
				this.numberPhone = "";
				this.signDto.password = "";
				this.signDto.msisdn = "";
				this.signDto = Object.assign({}, SignDto);
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

		async getFiles() {
			let response;
			this.signFiles = [];
			response = await globalService.getData_Async(
				customerAPI.API_GetAllAttachmentFileByRequestDataIdHasSign(
					this.param /*this.m_requestData.id*/,
					this.m_otp,
				),
			);
			if (!response || !response.state) {
				this.toastError(this.$t("error.load_file"));
				return [];
			}
			this.signFiles = response.data;
			// let raw = response.data.filter(
			// 	(ele) => ele.tennantCode != "CUSTOMER",
			// );
			// let signed = response.data.filter(
			// 	(ele) => ele.signOfFile && ele.tennantCode != "CUSTOMER",
			// );
			// this.signFiles = [];
			// for (let file of raw) {
			// 	let index = signed.findIndex((e) =>
			// 		`${e.signOfFile}`.includes(`${file.id}`),
			// 	);
			// 	if (index >= 0) {
			// 		continue;
			// 	}
			// 	this.signFiles.push(file);
			// }
		},

		async signTokenMofiFone() {
			try {
				let responseCert = await globalService.getDataOutside_Async(
					signApi.MobiFone_GetCert(),
				);
				if (!responseCert) {
					this.toastError(
						this.$t("message.need_install_token_plugin"),
					);
					return false;
				}
				await this.getFiles();
				for (let file of this.signFiles) {
					let res = await globalService.getData_Async(
						customerAPI.API_GetHashFile(file.id, this.m_otp),
					);
					let dataSign = {
						fileData: res.data ? res.data : "",
						certSerial: responseCert.Serial,
						signDate: null,
						fieldName: "",
						typeSign: "4",
						page: "1",
						px: 0,
						py: 0,
						pw: 100,
						ph: 100,
						imageData: constant.signedImage,
					};
					let signed = await globalService.postDataOutside_Async(
						signApi.MobiFone_SignPDF(),
						dataSign,
					);
					if (!signed || !signed.Status || signed.Status != 2) {
						return false;
					}
					if (!signed || !signed.FileDataSigned) {
						this.toastError(
							this.$t("message.need_install_token_plugin"),
						);
						return false;
					}
					if (this.m_requestData) {
						this.signDto.requestDataId = this.m_requestData.id;
					}
					this.signDto.fileDataBase64 = signed.FileDataSigned;
					this.signDto.attachmentFileId = file.id;
					this.signDto.userId = null;
					let response = await globalService.postData_Async(
						customerAPI.API_SignAnonymous(this.m_otp),
						this.signDto,
					);
					if (!response || !response.state) {
						return false;
					}
				}
				return true;
			} catch (error) {
				console.log(error);
				return false;
			}
		},

		async signTokenViettel() {
			try {
				let responseToken = await globalService.getDataOutside_Async(
					signApi.Viettel_GetToken(),
				);
				if (!responseToken) {
					this.toastError(
						this.$t("message.need_install_token_plugin"),
					);
					return false;
				}

				let responseCert = await globalService.postDataOutside_Async(
					signApi.Viettel_GetCert(),
					{ token: responseToken },
				);
				if (!responseCert) {
					this.toastError(
						this.$t("message.need_install_token_plugin"),
					);
					return false;
				}

				await this.getFiles();
				for (let file of this.signFiles) {
					let res = await globalService.getData_Async(
						customerAPI.API_GetHashFile(file.id, this.m_otp),
					);
					let dataSign = {
						token: responseToken,
						serialNumber: responseCert,
						data: res.data,
					};
					let signed = await globalService.postDataOutside_Async(
						signApi.Viettel_SignHash(),
						dataSign,
					);

					if (!signed) {
						console.log("signTokenViettel() signed: ", signed);
						return false;
					}

					if (!signed || !signed.FileDataSigned) {
						this.toastError(
							this.$t("message.need_install_token_plugin"),
						);
						return false;
					}
					if (this.m_requestData) {
						this.signDto.requestDataId = this.m_requestData.id;
					}
					this.signDto.userId = null;
					this.signDto.fileDataBase64 = signed.FileDataSigned;
					this.signDto.attachmentFileId = file.id;
					let response = await globalService.postData_Async(
						customerAPI.API_SignAnonymous(this.m_otp),
						this.signDto,
					);
					if (!response || response.state) {
						this.toastError(this.$t("error.sign"));
						return false;
					}
					return true;
				}
			} catch (error) {
				console.log(error);
				return false;
			}
			return false;
		},
	},
};
</script>

<style lang="scss" scoped></style>
