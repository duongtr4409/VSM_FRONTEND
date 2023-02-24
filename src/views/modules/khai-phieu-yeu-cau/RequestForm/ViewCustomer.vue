<template>
	<v-card elevation="0" class="h-[100vh]">
		<!-- <vue-breadcrumbs /> -->
		<v-dialog
			v-model="openDigitalSignRequestForm"
			max-width="60vw"
			persistent
		>
			<DigitalSignRequestFormVue
				persistent
				:request="m_requestDataDto"
				:otp="accuracyOTP"
				:param="param"
				@close="onCloseDialog"
				@saveSigned="onSigned"
			/>
		</v-dialog>
		<v-dialog v-model="openDeny" width="60vw" persistent>
			<RefuseRequestFormV2Vue
				persistent
				:request="m_requestDataDto"
				:otp="accuracyOTP"
				:param="param"
				@closedeny="onCloseDialogDeny"
				@saveDenyed="onDenyed"
			/>
		</v-dialog>
		<v-dialog v-model="dialogAccuracy" persistent max-width="60vw">
			<v-card elevation="0" class="p-4">
				<v-card-title class="font-bold mb-4">
					{{ $t("label.enter_otp") }}
				</v-card-title>
				<v-text-field
					class="mt-4"
					v-model="accuracyOTP"
					:label="$t('label.enter_otp')"
					outlined
					dense
				>
				</v-text-field>
				<v-spacer></v-spacer>
				<v-btn
					dark
					elevation="0"
					color="blue darken-2"
					class="rounded-none"
					@click="accuracyOTP_()"
				>
					{{ $t("button.accuracy") }}
				</v-btn>
				<v-btn
					v-if="FEATURE.RESEND_OTP"
					elevation="0"
					text
					class="mx-2"
					:disabled="
						!(new Date().getTime() > lastTime + 5 * 60 * 1000)
					"
					@click="sendOtp()"
				>
					{{ $t("button.send_otp") }}
				</v-btn>
			</v-card>
		</v-dialog>
		<v-container>
			<v-row :disabled="dialogAccuracy">
				<v-col cols="12">
					<div class="flex">
						<v-btn class="mx-2 my-0" depressed text color="black">
							<v-icon>mdi-equal-box</v-icon
							><span v-if="m_requestDataDto.requestDataCode">{{
								m_requestDataDto.requestDataCode
							}}</span>
						</v-btn>
						<v-btn class="mx-2 my-0" depressed text color="black">
							<v-icon>mdi-collage</v-icon
							><span v-if="m_requestDataDto.requestGroupName">{{
								m_requestDataDto.requestGroupName
							}}</span>
						</v-btn>
						<v-btn class="mx-2 my-0" depressed text color="black">
							<v-icon>mdi-folder-open</v-icon
							><span v-if="m_requestDataDto.requestTypeName">{{
								m_requestDataDto.requestTypeName
							}}</span>
						</v-btn>
					</div>
				</v-col>
				<v-col cols="12" class="mx-2">
					<v-row>
						<v-col cols="12">
							<vue-tab
								:tab="tab"
								@tab="(v) => (tab = v)"
								:tabs="tabs"
								:buttons="buttons"
								@buttonClick="handleButtonClick"
							></vue-tab>
						</v-col>
					</v-row>
					<v-row>
						<v-col cols="8" class="m-0 p-0">
							<v-tabs-items v-model="tab" class="m-0 p-0">
								<v-tab-item key="information">
									<v-card class="p-0 m-0">
										<v-row>
											<v-col cols="12">
												<v-select
													:menu-props="{
														bot: true,
														offsetY: true,
													}"
													v-model="attachmentFile"
													:items="listFilePdf"
													item-text="fileName"
													:item-value="(item) => item"
													outlined
													dense
												>
												</v-select>
											</v-col>
										</v-row>
										<v-row>
											<v-col cols="12" md="12" id="app">
												<v-skeleton-loader
													v-if="!previewLink"
													class="mx-auto"
													width="100%"
													type="card"
												></v-skeleton-loader>
												<iframe
													ref="file_views"
													id="file_views"
													name="file_views"
													v-if="previewLink"
													:src="
														previewLink +
														'&amp;action=embedview'
													"
													width="100%"
													height="750"
													frameborder="0"
													title=""
												>
												</iframe>
											</v-col>
										</v-row>
									</v-card>
								</v-tab-item>
							</v-tabs-items>
						</v-col>
						<v-divider vertical></v-divider>
						<v-col cols="4" class="p-0" v-if="!dialogAccuracy">
							<vue-perfect-scrollbar
								class="h-[65vh] p-2 border border-solid rounded"
							>
								<span
									v-for="item of listHistoryRequest"
									:key="item.id"
									class="d-flex text-sm"
								>
									<span>
										<span class="font-bold">
											{{ item.sendName }}
										</span>
										<span v-if="item.organizationName">
											({{ item.organizationName }})
										</span>
										<br />
										<span class="text-xs">
											{{ item.sendDate | format_date }}
										</span>
									</span>
									:
									<span
										v-html="sanitizeText(item.content)"
										class="
											table_tiptap
											min-w-[10rem]
											h-[fit-content]
										"
									></span>
								</span>
							</vue-perfect-scrollbar>
							<tiptap-vuetify
								v-model="content"
								:extensions="extensions"
								:placeholder="$t('label.exchange') + '...'"
								min-height="100"
								class="mb-4 mt-2"
							/>
							<div class="flex justify-end">
								<span class="text-sm mt-2 mr-5">
									{{ $t("label.update_at")
									}}{{ update_at | format_date }}
								</span>
								<v-btn
									@click="getHisTrade()"
									color="blue"
									dark
									class="mr-5"
								>
									{{ $t("button.refresh") }}
								</v-btn>
								<v-btn elevation="0" @click="send">
									{{ $t("button.send") }}
								</v-btn>
							</div>
						</v-col>
					</v-row>
				</v-col>
			</v-row>
		</v-container>
	</v-card>
</template>

<script>
import globalService from "@/services/global.service";
import customerAPI from "../../administrator/customer.api";
import RequestDataDto from "@/models/request-data.dto";
import AttachmentFileDto from "@/models/attachment-file.dto";
import SignDataDto from "@/models/sign-data.dto";
import DigitalSignRequestFormVue from "../modulepopup/DigitalSignRequestFormV2.vue";
import moment from "moment";

// import print from "print-js";
import {
	// component
	TiptapVuetify,
	// extensions
	Heading,
	Bold,
	Italic,
	Strike,
	Underline,
	Code,
	Paragraph,
	BulletList,
	OrderedList,
	ListItem,
	Link,
	Blockquote,
	HardBreak,
	HorizontalRule,
	History,
	Image,
	Table,
	TableCell,
	TableHeader,
	TableRow,
} from "tiptap-vuetify";
import store from "@/store";
import constant from "@/common/constant";
import InformationInExchangeDto from "@/models/informationInExchange.dto";
import RefuseRequestFormV2Vue from "../modulepopup/RefuseRequestFormV2.vue";
import ApproveDto from "@/models/approve.dto";
export default {
	name: "VSMFEViewCustomer",
	components: {
		DigitalSignRequestFormVue,
		TiptapVuetify,
		RefuseRequestFormV2Vue,
	},
	data() {
		return {
			m_requestDataDto: RequestDataDto,
			openDigitalSignRequestForm: false,
			openDeny: false,
			dialogAccuracy: true,
			tab: 0,
			extensions: [
				History,
				Table,
				TableCell,
				TableHeader,
				TableRow,
				Blockquote,
				Link,
				Underline,
				Strike,
				Italic,
				ListItem, // if you need to use a list (BulletList, OrderedList)
				BulletList,
				OrderedList,
				Image,
				[
					Heading,
					{
						// Options that fall into the tiptap's extension
						options: {
							levels: [1, 2, 3],
						},
					},
				],
				Bold,
				Link,
				Code,
				HorizontalRule,
				Paragraph,
				HardBreak, // line break on Shift + Ctrl + Enter
			],
			tabs: [{ key: "information", title: this.$t("title.information") }],
			buttons: [
				{
					icon: "mdi-printer",
					title: this.$t("button.print"),
					color: "",
					transparent: true,
					dark: false,
					event: this.printMethod,
				},
				// {
				// 	icon: "mdi-download",
				// 	title: this.$t("Tải xuống"),
				// 	color: "",
				// 	transparent: true,
				// 	dark: false,
				// 	event: this.downloadFileMethod,
				// },
			],
			param: this.$router.currentRoute.params.id,
			accuracyOTP: null,
			listAllOptByRequestDataId: [],
			// listTemplateForm: [],
			previewLink: "",
			attachmentFile: Object.assign({}, AttachmentFileDto),
			listHistoryRequest: [],
			userTrade: InformationInExchangeDto,
			user_info: this.getUserInfo(),
			signData: Object.assign({}, SignDataDto),
			isDownload: false,
			downloadFileLink: "",
			isQR: false,
			content: "",
			isWater: false,
			procesHisTemps: [],
			update_at: null,
			listFilePdf: [],
			lastTime: 0,
			approveRequestDto: ApproveDto,
		};
	},
	watch: {
		attachmentFile: async function (value) {
			let response;
			try {
				let id = value.id;
				response = await globalService.getData_Async(
					customerAPI.API_GetPreviewLink(id, this.accuracyOTP),
				);
				if (!response || !response.state) {
					return;
				}
				this.previewLink = response.data;
			} catch {
				return;
			}
		},
		signData(value) {
			if (value.numberSign > 0) {
				this.buttons = [
					// {
					// 	icon: "mdi-check",
					// 	title: this.$t("button.confirming"),
					// 	color: "",
					// 	transparent: true,
					// 	dark: false,
					// 	event: this.digitalSignTure,
					// 	isShow: false,
					// },
					{
						icon: "mdi-printer",
						title: this.$t("button.print"),
						color: "",
						transparent: true,
						dark: false,
						event: this.printMethod,
					},
					{
						icon: "mdi-download",
						title: this.$t("button.download"),
						color: "",
						transparent: true,
						dark: false,
						event: this.downloadFileMethod,
					},
				];
			}
		},
		openDigitalSignRequestForm(val) {
			if (!val) {
				this.getHisTrade();
			}
			this.getSignData(this.param);
		},
	},

	mounted() {
		this.param = this.$router.currentRoute.params.id;
	},
	async created() {
		await this.init();
	},
	methods: {
		async printMethod() {
			// let name = encodeURI(this.attachmentFile.fileName);
			let _url = store.state.config.apiUrl;
			let isPdf = true;
			if (
				this.attachmentFile.fileExtension.toLocaleLowerCase() == "pdf"
			) {
				isPdf = false;
			}
			var req = new XMLHttpRequest();
			req.open(
				"GET",
				`${_url}/customer/api/file/office365/download/exported.pdf?PDF=${isPdf}&addHistory=false&addQrCode=true&addWatermark=true&attachmentFileId=${this.attachmentFile.id}&otp=${this.accuracyOTP}`,
				true,
			);
			let accessToken = store.state.accessToken;
			if (!accessToken) {
				accessToken =
					localStorage.getItem(constant.keys.accessToken) ||
					sessionStorage.getItem(constant.keys.accessToken);
			}
			req.responseType = "blob";
			req.setRequestHeader(
				"Content-type",
				"application/x-www-form-urlencoded",
			);
			req.setRequestHeader("Authorization", `Bearer ${accessToken}`);

			req.onload = function (event) {
				console.log(event);
				var blob = new Blob([req.response], {
					type: "application/pdf",
				}); //this make the magic
				var blobURL = URL.createObjectURL(blob);

				let iframe = document.createElement("iframe"); //load content in an iframe to print later
				document.body.appendChild(iframe);

				iframe.style.display = "none";
				iframe.src = blobURL;
				iframe.onload = function () {
					setTimeout(function () {
						iframe.focus();
						iframe.contentWindow.print();
					}, 1);
				};
			};
			req.send();
			await this.setNumberPrintSignData();
			// this.$refs.file_views
			// let _url = store.state.config.apiUrl;
			// let isPdf = true;
			// if (
			// 	this.attachmentFile.fileExtension.toLocaleLowerCase() == "pdf"
			// ) {
			// 	isPdf = false;
			// }

			// return print(
			// 	`${_url}/api/file/office365/download/${name}?PDF=${isPdf}&addHistory=false&addQrCode=true&addWatermark=true&attachmentFileId=${this.attachmentFile.id}`,
			// );
		},
		async init() {
			//await this.findRquestData();
		},
		async getCurrentStep() {
			let response = await globalService.getData_Async(
				customerAPI.API_GetCurrentStep(this.param, this.accuracyOTP),
			);
			if (!response || !response.state) {
				return;
			}
			if (response.data) {
				this.buttons = [
					// {
					// 	icon: "mdi-check",
					// 	title: this.$t("label.is_required_signature"),
					// 	color: "",
					// 	transparent: true,
					// 	dark: false,
					// 	event: this.digitalSignTure,
					// },
					{
						icon: "mdi-printer",
						title: this.$t("button.print"),
						color: "",
						transparent: true,
						dark: false,
						event: this.printMethod,
					},
					{
						icon: "mdi-clipboard-outline",
						title: this.$t("button.return"),
						color: "",
						transparent: true,
						dark: false,
						event: this.deny,
					},
					{
						icon: "mdi-check",
						title: this.$t("button.confirming"),
						color: "",
						transparent: true,
						dark: false,
						event: this.digitalSignTure,
					},
				];
			}
			if (this.signData.numberSign > 0) {
					this.buttons = [
						{
							icon: "mdi-printer",
							title: this.$t("button.print"),
							color: "",
							transparent: true,
							dark: false,
							event: this.printMethod,
						},
						{
							icon: "mdi-download",
							title: this.$t("button.download"),
							color: "",
							transparent: true,
							dark: false,
							event: this.downloadFileMethod,
						},
					];
				}
		},
		async accuracyOTP_() {
			try {
				let response = await globalService.getData_Async(
					customerAPI.API_GetCheckOtp(this.param, this.accuracyOTP),
				);
				if (response.state) {
					this.dialogAccuracy = false;
					await this.findRquestData();
					await this.getHisTrade();
					await this.setNumberViewSignData();
					this.attachmentFile = this.listFilePdf[0];
					if (this.m_requestDataDto && this.m_requestDataDto.id) {
						this.getCurrentStep();
					}
				}
				if (!response.state) {
					this.toastError(this.$t("message.wrong_otp_code"));
				}
			} catch (error) {
				this.toastError(error);
			}
		},
		async findRquestData() {
			try {
				let response = await globalService.getData_Async(
					customerAPI.API_GetRequestDataByID(
						this.param,
						this.accuracyOTP,
					),
				);
				if (!response || !response.state) {
					return;
				}
				this.m_requestDataDto = response.data;
				await this.getSignData(this.param);
				if (this.signData.numberSign > 0) {
					this.listFilePdf = await this.getAllFile();
				} else {
					await this.filePdfViewCustomer();
				}
			} catch (error) {
				console.log(error);
			}
		},
		async downloadFileUsingGET() {
			try {
				// console.log(this.attachmentFile);
				let response = await globalService.getData_Async(
					customerAPI.API_DownloadFileUsingGET(
						this.attachmentFile.fileName,
						this.attachmentFile.id,
						this.attachmentFile.fileType,
						this.accuracyOTP,
					),
				);
				this.downloadFileLink = response.data;
			} catch (error) {
				console.log(error);
			}
		},
		async getHisTrade() {
			let response;
			this.listHistoryRequest = [];
			try {
				response = await globalService.getData_Async(
					customerAPI.API_GetHisTradeRequestData(
						this.param,
						this.accuracyOTP,
					),
				);
				if (!response || !response.state) {
					return this.toastError(this.$t("error.history_chat_error"));
				}
				response.data.filter((entry) => {
					if (
						entry.informationType &&
						entry.informationType.includes(constant.type.customer)
					) {
						this.listHistoryRequest.push(entry);
					}
				});
				this.listHistoryRequest = this.sortHisTrade(
					this.listHistoryRequest,
				);
				this.update_at = new Date();
			} catch (e) {
				console.log(e);
			}
		},
		async send() {
			this.userTrade.content = this.content;
			this.userTrade.sendDate = new Date();
			this.userTrade.requestData = this.m_requestDataDto;

			let response;
			try {
				this.userTrade.informationType = constant.type.customer;
				this.userTrade.sender = null;
				this.userTrade.sendName = this.$t("label.guest");
				response = await globalService.postData_Async(
					customerAPI.API_Chat(this.accuracyOTP),
					this.userTrade,
				);
				if (!response || !response.state) {
					return;
				}
			} catch (error) {
				console.log(error);
			}
			await this.getHisTrade();
			this.userTrade = Object.assign({}, InformationInExchangeDto);
			this.content = "";
		},
		async downloadFileMethod() {
			await this.save();
		},
		async save() {
			if (!this.attachmentFile) {
				return this.toastError(
					this.$t("message.no_download_file_selected"),
				);
			}
			let param = {
				PDF: true,

				addHistory: false,
				addQrCode: this.isQR,
				addWatermark: this.isWater,
				itemId: this.attachmentFile.itemId365,
			};

			let fileName = this.attachmentFile.fileName.split(".")[0];
			fileName = encodeURIComponent(
				`${fileName}`.replaceAll(/[^a-zA-Z]+/gi, "_"),
			);
			let fileExtension = this.attachmentFile.fileExtension;
			if (fileExtension == "pdf") param.PDF = false;
			if (param.PDF) fileExtension = "pdf";

			let urlDownload =
				store.state.config.apiUrl +
				customerAPI.API_DownloadFile365(
					param,
					fileName,
					fileExtension,
					this.accuracyOTP,
				);
			window.open(urlDownload, "_blank");
			await this.setNumberDownloadSignData();
			this.toastSuccess(this.$t("message.upload_file_successfully"));
			this.$emit("close", true);
		},
		async filePdfViewCustomer() {
			try {
				// let response = await globalService.getData_Async(
				// 	`/api/_view_file_customer/${this.m_requestDataDto.id}/request-data`,
				// );
				// let response = await globalService.getData_Async(
				// 	customerAPI.API_GetAllAttachmentFileByRequestDataId(
				// 		this.m_requestDataDto.id,
				// 		this.accuracyOTP,
				// 	),
				// );
				let response = await globalService.getData_Async(
					customerAPI.API_GetFileCutomerView(
						this.param,
						this.accuracyOTP,
					),
				);
				if (!response || !response.state) {
					return;
				}
				this.listFilePdf = response.data;
			} catch (error) {
				console.log(error);
			}
		},
		async getAllFile() {
			let response;
			try {
				response = await globalService.getData_Async(
					customerAPI.API_GetAllAttachmentFileByRequestDataId(
						this.param,
						this.accuracyOTP,
					),
				);
				if (!response || !response.state) {
					return [];
				}
				return response.data.filter((e) => {
					if (e.signOfFile) {
						return e;
					}
				});
			} catch (error) {
				console.log(error);
				return [];
			}
		},
		digitalSignTure() {
			this.openDigitalSignRequestForm = true;
		},
		deny() {
			this.openDeny = true;
		},
		async onCloseDialog(value) {
			this.openDigitalSignRequestForm = false;
			if (!value) {
				// this.toastError(this.$t("error.sign"));
				console.log(value);
			} else {
				// await this.saveSignCounter();
				this.listFilePdf = await this.getAllFile();
			}
			this.attachmentFile = this.listFilePdf[0];
		},
		async onCloseDialogDeny() {
			this.openDeny = false;
			// if (!value) {
			// 	console.log(value);
			// } else {

			// 	this.listFilePdf = await this.getAllFile();
			// }
			this.attachmentFile = this.listFilePdf[0];
		},
		async onSigned() {
			await this.init();
			//ki xong chi con in va tai xuong
			this.buttons = [
				// {
				// 	icon: "mdi-check",
				// 	title: this.$t("label.is_required_signature"),
				// 	color: "",
				// 	transparent: true,
				// 	dark: false,
				// 	event: this.digitalSignTure,
				// },
				{
					icon: "mdi-printer",
					title: this.$t("button.print"),
					color: "",
					transparent: true,
					dark: false,
					event: this.printMethod,
				},
				{
					icon: "mdi-download",
					title: this.$t("button.download"),
					color: "",
					transparent: true,
					dark: false,
					event: this.downloadFileMethod,
				},
			];
		},
		async onDenyed() {
			await this.init();
			this.buttons = [
				// {
				// 	icon: "mdi-check",
				// 	title: this.$t("label.is_required_signature"),
				// 	color: "",
				// 	transparent: true,
				// 	dark: false,
				// 	event: this.digitalSignTure,
				// },
				// {
				// 	icon: "mdi-printer",
				// 	title: this.$t("button.print"),
				// 	color: "",
				// 	transparent: true,
				// 	dark: false,
				// 	event: this.printMethod,
				// },
				// {
				// 	icon: "mdi-download",
				// 	title: this.$t("button.download"),
				// 	color: "",
				// 	transparent: true,
				// 	dark: false,
				// 	event: this.downloadFileMethod,
				// },
			];
		},
		async getSignData(requestDataId) {
			try {
				// let response = await globalService.getData_Async(
				// 	`/api/request-data/${requestDataId}/_all/sign-data`,
				// );
				let response = await globalService.getData_Async(
					customerAPI.API_GetSignDataOfRequestData(
						requestDataId,
						this.accuracyOTP,
					),
				);
				if (!response || !response.state) {
					return;
				}
				if (!response.data) {
					return;
				}
				this.signData = response.data;

				
			} catch (error) {
				console.log(error);
			}
		},
		async setNumberDownloadSignData() {
			try {
				if (this.signData.numberDownload != null) {
					this.signData.numberDownload =
						this.signData.numberDownload + 1;
				}
				if (this.signData.numberDownload == null) {
					this.signData.numberDownload = 0;
					this.signData.numberDownload =
						this.signData.numberDownload + 1;
				}
				this.signData.userInfo = this.userInfo;
				// let response = await globalService.putData_Async(
				// 	`/api/sign-data/${this.signData.id}`,
				// 	this.signData,
				// );
				let response = await globalService.putData_Async(
					customerAPI.API_UpdateSignData(
						this.signData.id,
						this.accuracyOTP,
					),
					this.signData,
				);
				this.signData = response.data;
			} catch (error) {
				console.log(error);
			}
		},
		async setNumberPrintSignData() {
			try {
				if (this.signData.numberPrint != null) {
					this.signData.numberPrint = this.signData.numberPrint + 1;
				}
				if (this.signData.numberPrint == null) {
					this.signData.numberPrint = 0;
					this.signData.numberPrint = this.signData.numberPrint + 1;
				}
				this.signData.userInfo = this.userInfo;
				// let response = await globalService.putData_Async(
				// 	`/api/sign-data/${this.signData.id}`,
				// 	this.signData,
				// );
				let response = await globalService.putData_Async(
					customerAPI.API_UpdateSignData(
						this.signData.id,
						this.accuracyOTP,
					),
					this.signData,
				);
				this.signData = response.data;
			} catch (error) {
				console.log(error);
			}
		},
		async setNumberViewSignData() {
			try {
				if (this.signData.numberView != null) {
					this.signData.numberView = this.signData.numberView + 1;
				}
				if (this.signData.numberView == null) {
					this.signData.numberView = 0;
					this.signData.numberView = this.signData.numberView + 1;
				}
				this.signData.userInfo = this.userInfo;
				// let response = await globalService.putData_Async(
				// 	`/api/sign-data/${this.signData.id}`,
				// 	this.signData,
				// );
				let response = await globalService.putData_Async(
					customerAPI.API_UpdateSignData(
						this.signData.id,
						this.accuracyOTP,
					),
					this.signData,
				);
				this.signData = response.data;
			} catch (error) {
				console.log(error);
			}
		},

		async saveSignCounter() {
			try {
				if (this.signData.numberSign != null) {
					this.signData.numberSign = this.signData.numberSign + 1;
				}
				if (this.signData.numberSign == null) {
					this.signData.numberSign = 0;
					this.signData.numberSign = this.signData.numberSign + 1;
				}
				// let response = await globalService.putData_Async(
				// 	`/api/sign-data/${this.signData.id}`,
				// 	this.signData,
				// );
				let response = await globalService.putData_Async(
					customerAPI.API_UpdateSignData(
						this.signData.id,
						this.accuracyOTP,
					),
					this.signData,
				);
				if (!response || !response.state) {
					return;
				}
				this.signData = response.data;
			} catch (error) {
				console.log(error);
			}
		},
		sortHisTrade(arr) {
			return arr.sort((a, b) => {
				return (
					moment(a.sendDate).toDate().getTime() -
					moment(b.sendDate).toDate().getTime()
				);
			});
		},
		sendOtp() {
			globalService
				.getData_NoAsync(customerAPI.API_SendOTP(this.param))
				.then((response) => {
					if (
						!response ||
						!response.status ||
						response.status != 200
					) {
						this.toastError(this.$t("error.send_otp"));
						return;
					}
					if (!response.data.state) {
						this.toastError(response.data.data);
						return;
					}
					this.toastSuccess(this.$t("success.send_otp"));
					this.lastTime = new Date().getTime();
				});
		},
		// async approveRequest() {
		// 	if (this.approveRequestDto.reason?.trim() == "") {
		// 		return this.toastError(this.$t("message.empty_requestContent"));
		// 	}
		// 	if (this.files?.length) {
		// 		await this.upload();
		// 	}
		// 	 let response;
		// 	this.approveRequestDto.action = "Send";
		// 	this.approveRequestDto.errorMessageReturn =
		// 		this.$t("error.approval_fail");
		// 	this.approveRequestDto.requestDataId = this.m_requestDataDto.id;
		// 	this.approveRequestDto.successMessageReturn =
		// 		this.$t("message.approve_request_success");
		// 	this.approveRequestDto.userId = this.user_info.id;
		// 	response = await globalService.postData_Async(
		// 		administratorAPI.API_Approve(),
		// 		this.approveRequestDto,
		// 	);
		// 	if (!response || !response.state) {
		// 		this.toastError(this.$t("message.approve_request_error"));
		// 		return;
		// 	}
		// 	this.toastSuccess(this.$t("message.approve_request_success"));
		// 	this.$emit("save", this.approveRequestDto);
		// 	this.approveRequestDto = Object.assign({}, ApproveDto);
		// 	this.$emit("close", true);
		// 	this.close();

		// },
	},
	filters: {
		format_date: function (value) {
			return moment(value).format(constant.format.date_hours);
		},
	},
};
</script>

<style lang="scss">
.table_tiptap > table > tbody > tr > td {
	padding: 4px 16px;
	border: 1px solid rgb(206, 206, 206);
}
.table_tiptap > table > tbody > tr > th {
	padding: 4px 16px;
	border: 1px solid rgb(206, 206, 206);
}
.table_tiptap > table > tbody > tr > td > p {
	margin: 0px;
}
.table_tiptap > table > tbody > tr > th > p {
	margin: 0px;
}
</style>
