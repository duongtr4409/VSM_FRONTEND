<template>
	<v-card elevation="0" flat>
		<v-row>
			<v-dialog width="60vw" v-model="openSelectionReceiveUser" persistent>
				<UserInfosRequestData
					@save="onSaveReceiveUser"
					@close="onCloseReceiveUser"
				></UserInfosRequestData>
			</v-dialog>
		</v-row>
		<v-row>
			<v-dialog width="60vw" v-model="openSelectionCCUser" persistent>
				<UserInfosRequestData
					@save="onSaveCCUser"
					@close="onCloseCCUser"
				></UserInfosRequestData>
			</v-dialog>
		</v-row>
		<form>
			<v-row class="mt-4">
				<!-- <v-col cols="3">
					<v-select
						:menu-props="{ bot: true, offsetY: true }"
						v-model="signData.status"
						:items="ALL_ITEM_STATUS_PROCESS"
						:label="$t('label.status')"
						outlined
						dense
					></v-select>
				</v-col> -->
				<!-- <v-col>
					{{$t("label.client")}}
					<span class="ml-8"
						><strong>{{ `Xem(${signData.numberView})` }}</strong></span
					>
					<span class="ml-8"
						><strong>{{ `In(${signData.numberPrint})` }}</strong></span
					>
					<span class="ml-8"
						><strong>{{ `Ký số(${signData.numberSign})` }}</strong></span
					>
					<span class="ml-8"
						><strong>{{
							`Tải xuống(${signData.numberDownload})`
						}}</strong></span
					>
				</v-col> -->
			</v-row>
			<v-row>
				<v-col cols="12">
					<v-form v-model="valid" ref="form">
						<v-row v-for="(item, index) of listSign" :key="index">
							<v-col cols="12" md="3">
								<v-text-field
									v-model="item.signName"
									outlined
									dense
									maxLength="255"
									:readonly="isReadOnly"
									:rules="
										[rules.required]
									"
									>
									<!-- :error-messages="testRequild[index]"
									@keyup="keyUpName(index)"
									@change="keyUpName(index)" -->
									<template v-slot:label>
										{{ $t("label.name") }}
										<span class="text-red-600">{{
											$t("label.star")
										}} </span>
									</template>
								</v-text-field>
							</v-col>
							<v-col cols="12" md="3">
								<v-text-field
									v-model="item.email"
									outlined
									dense
									maxLength="255"
									:readonly="isReadOnly"
									:rules="
										[rules.required,
										rules.email
										]
									"
									>
									<!-- :error-messages="errorMessageEmail[index]"
									@keyup="keyUpEmail(index)"
									@change="keyUpEmail(index)" -->
									<template v-slot:label>
										{{ $t("label.email_address") }}
										<span class="text-red-600">{{
											$t("label.star")
										}}</span>
									</template>
								</v-text-field>
							</v-col>
							<v-col cols="12" md="2">
								<v-text-field
									v-model="item.phoneNumber"
									outlined
									dense
									maxLength="12"
									:readonly="isReadOnly"
									:rules="
										[rules.required,
										rules.number
										]
									"
									>
									<!-- :error-messages="errorPhoneNumber[index]"
									@keyup="keyUpPhoneNumber(index)"
									@change="keyUpPhoneNumber(index)" -->
									<template v-slot:label>
										{{ $t("label.numberphone") }}
										<span class="text-red-600">{{
											$t("label.star")
										}}</span>
									</template>
								</v-text-field>
							</v-col>
							<v-col cols="12" md="3">
								<v-text-field
									:label="$t('label.contact_address')"
									v-model="item.address"
									outlined
									dense
									maxLength="255"
									:readonly="isReadOnly"
								></v-text-field>
							</v-col>
							<v-col
								cols="1"
								md="1"
								v-if="!isReadOnly"
								class="d-flex"
							>
								<v-btn
									icon
									class="red mr-4"
									dark
									small
									v-if="listSign.length > 1"
									@click="removeUserSign(index)"
								>
									<v-icon>mdi-close</v-icon>
								</v-btn>
								<v-btn
									icon
									class="blue"
									dark
									@click="addUserSign(index)"
									small
								>
									<v-icon>mdi-plus</v-icon>
								</v-btn>
							</v-col>
						</v-row>
					</v-form>
				</v-col>
			</v-row>
			<!-- <v-row>
				<v-col cols="12">
					<v-btn
						color="blue darken-2"
						dark
						class="rounded-0"
						@click="saveSignData"
					>
						<v-icon>{{ "mdi-content-save" }}</v-icon>
						{{ $t("button.update") }}
					</v-btn>
				</v-col>
			</v-row> -->
		</form>
	</v-card>
</template>

<script>
import globalService from "@/services/global.service";
import administratorAPI from "../../administrator/administrator.api";
import UserInfosRequestData from "./UserInfosRequestData.vue";
import SignDataDto from "@/models/sign-data.dto.js";
import ReqDataProcessHisDto from "@/models/req-data-process-his.dto";
export default {
	components: { UserInfosRequestData },
	name: "DigitalSignatureInfo",
	props: { requestDataId: {}, isSaved: {} },
	watch: {
		async isSaved(value) {
			this.m_isSaved = value;
			if (this.m_isSaved.state) {
				await this.saveSignData();
			}
		},
		mailTemplateSelect(newValue) {
			this.receiveUsers = newValue?.receiverDefault
				? JSON.parse(newValue?.receiverDefault)
				: [];
			if (this.receiveUsers)
				this.receiveUserFilters = this.filerUser(
					this.receiveUserFilters,
					this.receiveUsers,
				);
			this.ccUsers = newValue?.ccerDefault
				? JSON.parse(newValue?.ccerDefault)
				: [];
			if (this.ccUsers)
				this.ccUserFilters = this.filerUser(
					this.ccUserFilters,
					this.ccUsers,
				);
			this.content = newValue.contentFile;
		},
	},

	data() {
		return {
			testRequild: [],
			errorMessageEmail: [],
			errorPhoneNumber: [],
			isccEmailAccepted: true,
			stringArray2: [],
			stringArray: [],
			row: 2,
			isEmailAccepted: true,
			requestProcessHis: ReqDataProcessHisDto,
			user_info: this.getUserInfo(),
			openSelectionReceiveUser: false,
			openSelectionCCUser: false,
			regex: /^(([^<>()\\[\]\\.,;:\s@"]+(\.[^<>()\\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/,
			is_email: false,
			showDate1: false,
			showDate2: false,
			showDate3: false,
			tabs: [{ key: "information", title: this.$t("label.information") }],
			buttons: [
				{
					icon: "mdi-content-save",
					title: this.$t("button.save"),
					color: "blue darken-2",
					transparent: false,
					dark: true,
					event: this.save,
				},
				{
					icon: "mdi-trash-can-outline",
					title: this.$t("button.delete"),
					color: "black",
					transparent: true,
					dark: false,
					event: this.delete,
				},
				{
					icon: "mdi-arrow-left-top",
					title: this.$t("button.back"),
					color: "black",
					transparent: true,
					dark: false,
					event: this.back,
				},
			],
			// rules: {
			// 	required: (value) => !!value || "Vui lòng nhập thông tin.",
			// 	number: (value) => {
			// 		if (!value) return true;
			// 		const pattern = /^(0|[1-9][0-9]*)$/;
			// 		return (
			// 			pattern.test((value + "").trim()) ||
			// 			this.$t("message.please_enter_numeric_characters")
			// 		);
			// 	},
			// },
			rules: {
				required: (value) => !!value || this.$t("message.msg_1"),
				number: (value) => /^(0|[0-9]*)$/.test(value.trim()) || this.$t("message.rule_phone_number_error"),
				email: (value) => /^(([^<>()\\[\]\\.,;:\s@"]+(\.[^<>()\\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/.test(value.trim()) || this.$t("message.rule_email_error")
			},
			valid: null,
			ALL_ITEM_STATUS_PROCESS: [],
			itemStatusProcessSelect: null,

			dateStamp: new Date(
				Date.now() - new Date().getTimezoneOffset() * 60000,
			)
				.toISOString()
				.substr(0, 10), // ngày đóng dấu

			expiryDateReturn: null,
			dateReturn: null,
			organizationReturn: null, // bộ phận trả

			fileUploadInfo: [], // file upload
			regexNumber: /^[0-9]*$/,
			customerName: "", // tên
			customerEmail: "", // địa chỉ email
			customerPhone: "", // số điện thoại
			customerAddress: "", // địa chỉ liên hệ
			arrDeleteUser: [],
			ALL_MAILTEMPLATE: [],
			mailTemplateSelect: null,

			receiveUsers: [],
			allUser_: [],
			receiveUserFilters: [],

			ccUsers: [],
			ccUserFilters: [],

			content: "", // nội dung

			isOTP: false, // gửi OPT
			isPDF: false, // Đính kèm PDF

			signDataList: [], // thông tin ký (signData)
			signData: SignDataDto,
			listSign: [],
			signDataDefault: SignDataDto,
			isReadOnly: true,
		};
	},
	created() {
		this.ALL_ITEM_STATUS_PROCESS = [
			"Chưa có hợp đồng",
			"Đã có hợp đồng, chưa gửi cho khách hàng",
			"Đã có hợp đồng, đã gửi cho khách hàng",
			"Đã có hợp đồng, Khách hàng đã ký",
			"Đã có hợp đồng, Đã nhận được hợp đồng có chữ ký của khách hàng",
		];
	},
	mounted() {
		this.initialize();
	},

	methods: {
		async initialize() {
			this.addUserSign(0);
			console.log("this.requestDataId?.status",this.requestDataId?.status);
			if (
				this.requestDataId?.created?.id == this.user_info.id &&
				(this.requestDataId?.status?.id == 1 ||this.requestDataId?.status?.id == 6) 
			) {
				this.isReadOnly = false;
			}
			this.getAllSignData();
		},
		async handleButtonClick(event) {
			await event();
		},
		async getAllSignData() {
			let response;
			try {
				response = await globalService.getData_Async(
					administratorAPI.API_GetAllSignDataByRequestData(
						this.requestDataId?.id,
					),
				);
				if (!response || !response.state) {
					return [];
				}
				this.listSign = response.data.sort((a, b) => {
					return a.id - b.id;
				});
				this.signData = this.listSign[0];
			} catch (error) {
				this.toastError(error);
				return;
			}
		},
		/**
		 * Hàm thực hiện loại bỏ các phần tử của mảng source mà đã tồn tại ở mảng target
		 * @param {*} source: mảng nguồn
		 * @param {*} target: mảng chứa phần tử cần loại bỏ
		 */
		filerUser(source = [], target = []) {
			return source.filter(
				(ele) => !target.some((ele1) => ele.id == ele1.id),
			);
		},
		// async save() {
		// 	if (this.m_requestStepDataList.length == 0) {
		// 		this.toastError(this.$t("message.update_error"));
		// 		return;
		// 	}

		// 	for (let stepInProces of this.m_requestStepDataList) {
		// 		let response = await globalService.putData_Async(
		// 			administratorAPI.API_UpDateStepData(stepInProces.id),
		// 			stepInProces,
		// 		);

		// 		if (!response || !response.state) {
		// 			return;
		// 		}
		// 	}
		// },
		async saveSignData() {
			if (this.$refs?.form) {
					if (!this.$refs?.form.validate()) {
						return this.toastError(
							this.$t("message.digital_sign_information_error"),
						);
					}
				}
			if (this.arrDeleteUser.length) {
				for (const item of this.arrDeleteUser) {
					let response = await globalService.deleteData_Async(
						administratorAPI.API_updateSignData(item),
					);
					if (!response || !response.state) {
						continue;
					}
				}
			}

			if (this.listSign.length) {
				for (const index in this.listSign) {
					let item = this.listSign[index];
					if (
						!this.validRequiredText(item.signName) ||
						!this.validRequiredText(item.email) ||
						!this.validRequiredText(item.phoneNumber)
					) {
						continue;
					}
					await this.createSign(item, index);
				}
			}
			this.arrDeleteUser = [];
			// if (this.signData) {
			// 	this.signData.signName = this.signData.signName.trim();
			// 	this.signData.address = this.signData.address.trim();
			// 	this.signData.email = this.signData.email.trim();
			// 	this.signData.phoneNumber = this.signData.phoneNumber.trim();
			// 	// if (!this.validRequiredText(this.signData.signName)) {
			// 	// 	//return this.toastError(this.$t("error.empty_signName"));
			// 	// 	return (this.testRequild = this.$t("error.empty_signName"));
			// 	// }
			// 	// if (!this.validRequiredText(this.signData.email)) {
			// 	// 	//return this.toastError(this.$t("error.empty_signName"));
			// 	// 	return (this.errorMessageEmail[] =
			// 	// 		this.$t("user_valid.email"));
			// 	// }
			// 	// if (!this.validRequiredText(this.signData.phoneNumber)) {
			// 	// 	//return this.toastError(this.$t("error.empty_signName"));
			// 	// 	return (this.errorPhoneNumber = this.$t(
			// 	// 		"user_valid.businessPhones",
			// 	// 	));
			// 	// }

			// 	// if (!Number.isInteger(this.signData.phoneNumber * 1)) {
			// 	// 	return this.toastError(
			// 	// 		this.$t("error.invalid_phoneNumber"),
			// 	// 	);
			// 	// }
			// 	// if (!this.signData.phoneNumber) {
			// 	// 	return this.toastError(
			// 	// 		this.$t("user_valid.businessPhones"),
			// 	// 	);
			// 	// }

			// 	let response = await globalService.putData_Async(
			// 		administratorAPI.API_updateSignData(this.signData.id),
			// 		this.signData,
			// 	);
			// 	if (!response || !response.state) {
			// 		this.toastError(this.$t("message.update_error"));
			// 		return;
			// 	}
			// 	this.signData = response.data;
			// 	this.toastSuccess(this.$t("message.update_success"));
			// }
		},
		removeItem(index, item) {
			this.m_requestStepDataList[index].userInfos =
				this.m_requestStepDataList[index].userInfos.filter((entry) => {
					if (entry.id != item.id) return entry;
				});
		},

		async removeReceiveUserHandler() {
			this.receiveUserFilters = Object.assign([], this.allUser_);
			this.receiveUsers = [];
		},
		selectHandlerReceiveUser(item) {
			this.receiveUsers.push(item);
		},
		removeReceiveUser(item) {
			this.receiveUsers.splice(this.receiveUsers.indexOf(item), 1);
		},
		async removeCCUserHandler() {
			this.ccUserFilters = Object.assign([], this.allUser_);
			this.ccUsers = [];
		},
		selectHandlerCCUser(item) {
			this.ccUsers.push(item);
		},
		removeCCUser(item) {
			this.ccUsers.splice(this.ccUsers.indexOf(item), 1);
		},

		// popup
		onCloseReceiveUser() {
			this.openSelectionReceiveUser = false;
		},
		onOpenReceiveUser() {
			this.openSelectionReceiveUser = true;
		},
		onSaveReceiveUser(userSelectedList) {
			this.receiveUsers = userSelectedList;
			if (this.receiveUsers)
				this.receiveUserFilters = this.filerUser(
					this.receiveUserFilters,
					this.receiveUsers,
				);
		},
		openPopupSelectionReceiveUser() {
			this.openSelectionReceiveUser = true;
		},
		onCloseCCUser() {
			this.openSelectionCCUser = false;
		},
		onOpenCCUser() {
			this.openSelectionCCUser = true;
		},
		onSaveCCUser(userSelectedList) {
			this.ccUsers = userSelectedList;
			if (this.ccUsers)
				this.ccUserFilters = this.filerUser(
					this.ccUserFilters,
					this.ccUsers,
				);
		},
		openPopupSelectionCCUser() {
			this.openSelectionCCUser = true;
		},
		async sendMail() {
			this.stringArray = this.receiveUsers.filter(function (e) {
				return typeof e == "string";
			});

			for (let i = 0; i < this.stringArray.length; i++) {
				if (!this.regex.test(this.stringArray[i])) {
					this.isEmailAccepted = false;
					break;
				}
			}

			if (this.isEmailAccepted == false) {
				this.isEmailAccepted = true;
				return this.toastError(
					this.$t("user_valid.receiveUsers_format"),
				);
			}

			this.stringArray2 = this.ccUsers.filter(function (e) {
				return typeof e == "string";
			});

			for (let i = 0; i < this.stringArray2.length; i++) {
				if (!this.regex.test(this.stringArray2[i])) {
					this.isccEmailAccepted = false;
					break;
				}
			}
			if (this.isccEmailAccepted == false) {
				this.isccEmailAccepted = true;
				return this.toastError(this.$t("user_valid.ccUsers_format"));
			}
			let emailTo = this.receiveUsers.map((ele) => {
				if (ele.id) return ele.email;
				return ele;
			});
			let emailCC = this.ccUsers.map((ele) => {
				if (ele.id) return ele.email;
				return ele;
			});
			let response = await globalService.uploadData_Async2(
				administratorAPI.API_SendMail365(),
				{},
				{
					content: this.mailTemplateSelect.contentFile,
					emailAddressCC: emailCC,
					emailAddressTo: emailTo,
					subject: this.mailTemplateSelect.subject,
					addFile: this.isPDF,
					addOTP: this.isOTP,
					requestDataId: this.requestDataId?.id,
				},
			);
			if (!response || !response.state) {
				this.toastError(this.$t("message.update_error"));
				return;
			}
			//await this.saveReqdataProcessHis();
			this.toastSuccess(this.$t("message.send_mail_succss"));
		},
		async saveReqdataProcessHis() {
			let response;
			try {
				this.requestProcessHis.createDate = new Date();
				this.requestProcessHis.description =
					this.approveRequestDto.reason;
				(this.requestProcessHis.organizationName = null),
					(this.requestProcessHis.processDate = new Date());
				this.requestProcessHis.processer = this.user_info;
				this.requestProcessHis.processerName = this.user_info.fullName;
				this.requestProcessHis.rankName = null;
				(this.requestProcessHis.requestData = {
					id: this.m_requestData.id,
				}),
					(this.requestProcessHis.isChild = true);
				(this.requestProcessHis.status = this.$t("status.sendmail")),
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
		keyUpName(index) {
			if (this.listSign[index].signName.trim() == "") {
				this.testRequild[index] = this.$t("message.msg_1");
			}
			if (this.listSign[index].signName.trim() != "") {
				this.testRequild[index] = "";
			}
		},
		keyUpEmail(index) {
			if (!this.listSign[index].email.trim()) {
				this.errorMessageEmail[index] = this.$t("message.msg_1");
			} else if (!this.regex.test(this.listSign[index].email?.trim())) {
				this.errorMessageEmail[index] = this.$t(
					"user_valid.email_format",
				);
			} else {
				this.errorMessageEmail[index] = "";
			}
		},
		keyUpPhoneNumber(index) {
			if (this.listSign[index].phoneNumber.trim() == "") {
				this.errorPhoneNumber[index] = this.$t(
					"user_valid.businessPhones",
				);
			}

			if (this.listSign[index].phoneNumber.trim() != "") {
				this.errorPhoneNumber[index] = "";
			}
			if (!this.regexNumber.test(this.listSign[index].phoneNumber)) {
				this.errorPhoneNumber[index] = this.$t(
					"error.invalid_phoneNumber",
				);
			} else {
				this.errorPhoneNumber[index] = "";
			}
		},
		addUserSign(index) {
			let _obj = Object.assign({}, SignDataDto);
			this.listSign.splice(index + 1, 0, _obj);
			console.log("this.listSign",this.listSign);
		},
		removeUserSign(index) {
			if (this.listSign[index].id) {
				this.arrDeleteUser.push(this.listSign[index].id);
			}
			this.listSign.splice(index, 1);
		},

		async createSign(item, index) {
			item.createdDate = new Date();
			item.requestData = { id: this.requestDataId?.id };
			let response;
			try {
				if (!item.id) {
					response = await globalService.postData_Async(
						administratorAPI.API_createSignData(),
						item,
					);
				} else {
					response = await globalService.putData_Async(
						administratorAPI.API_updateSignData(item.id),
						item,
					);
				}
				this.listSign[index] = response.data;
			} catch (error) {
				console.log(error);
			}
			if (!response || !response.state) {
				return;
			}
		},
	},
};
</script>
<style></style>
