<template>
	<v-card flat elevation="0" class="mt-4">
		<v-row>
			<v-dialog width="30vw" v-model="openConfirmResend" persistent>
				<v-card>
					<v-toolbar flat color="grey lighten-4 max-h-[2.5rem]">
						<v-toolbar-title class="mb-5">
							{{ $t("button.confirm_resend") }}
						</v-toolbar-title>
						<v-spacer></v-spacer>
						<!-- <v-btn icon @click="close" class="mb-5">
							<v-icon>mdi-close</v-icon>
						</v-btn> -->
					</v-toolbar>
					<v-card-actions class="white">
						<v-spacer></v-spacer>
						<v-btn
							color="blue darken-1"
							elevation="0"
							dark
							@click="approveResend()"
						>
							{{ $t("button.ok") }}
						</v-btn>
						<v-btn
							color="grey lighten-4"
							elevation="0"
							@click="close"
						>
							{{ $t("button.cancel") }}
						</v-btn>
					</v-card-actions>
				</v-card>
			</v-dialog>
		</v-row>
		<v-row>
			<!-- <v-col>
				{{$t('label.client')}}
				<span class="ml-8"
					><strong>{{ `Xem(${signData.numberView})` }}</strong></span
				>
				<span class="ml-8"
					><strong>{{ `In(${signData.numberPrint})` }}</strong></span
				>
				<span class="ml-8"
					><strong>{{
						`Ký số(${signData.numberSign})`
					}}</strong></span
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
								:rules="[rules.required]"
								:readonly="!FEATURE.BUTTON_RESEND && !showReSend && isDisable"
							>
								<template v-slot:label>
									{{ $t("label.name") }}
									<span class="text-red-600">{{
										$t("label.star")
									}}</span>
								</template>
							</v-text-field>
						</v-col>
						<v-col cols="12" md="3">
							<v-text-field
								v-model="item.email"
								outlined
								dense
								maxLength="255"
								:rules="[rules.required, rules.email]"
								:readonly="!FEATURE.BUTTON_RESEND && !showReSend && isDisable"
							>
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
								maxLength="13"
								:rules="[rules.required, rules.number]"
								:readonly="!FEATURE.BUTTON_RESEND && !showReSend && isDisable"
							>
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
								:readonly="!FEATURE.BUTTON_RESEND && !showReSend && isDisable"
							></v-text-field>
						</v-col>
						<v-col
							cols="1"
							md="1"
							class="d-flex"
							v-if="FEATURE.BUTTON_RESEND && showReSend && !isDisable"
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
		<v-row v-if="FEATURE.BUTTON_RESEND && showReSend">
			<v-col>
				<!-- <v-btn
					color="blue"
					rounded
					:dark="!isDisable"
					@click="saveSignData()"
					:disabled="isDisable"
					class="mr-2"
				>
					<v-icon> mdi-content-save</v-icon>
					{{ this.$t("button.save") }}
				</v-btn> -->
				<v-btn
					:disabled="isDisable"
					color="blue"
					rounded
					:dark="!isDisable"
					@click="handleResend()"
				>
					<v-icon> mdi-sync</v-icon>
					{{ this.$t("button.resend") }}
				</v-btn>
			</v-col>
		</v-row>
	</v-card>
</template>

<script>
import globalService from "@/services/global.service";
import administratorAPI from "../../administrator/administrator.api";
import SignDataDto from "@/models/sign-data.dto.js";
import {
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
export default {
	name: "ViewDigitalSignatureInfo",
	props: { requestDataId: { type: Number, default: 1557 } , showReSend: { type: Boolean, default: false} },
	watch: {
		isSaved(value) {
			this.m_isSaved = value;
			if (this.m_isSaved.state) {
				this.save();
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
			isReadOnly: true,
			isDisable: false,
			user_current: this.getUserInfo(),
			openConfirmResend: false,
			openSendMail: true,
			openSelectionReceiveUser: false,
			openSelectionCCUser: false,
			extensions: [
				History,
				Blockquote,
				Link,
				Underline,
				Strike,
				Italic,
				ListItem,
				BulletList,
				OrderedList,
				[
					Heading,
					{
						options: {
							levels: [1, 2, 3],
						},
					},
				],
				Bold,
				Code,
				HorizontalRule,
				Paragraph,
				HardBreak,
				Image,
				Table,
				TableCell,
				TableHeader,
				TableRow,
			],
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
			rules: {
				required: (value) => !!value || this.$t("message.msg_1"),
				number: (value) =>
					/^(0|[0-9]*)$/.test(value.trim()) ||
					this.$t("message.rule_phone_number_error"),
				email: (value) =>
					/^(([^<>()\\[\]\\.,;:\s@"]+(\.[^<>()\\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/.test(
						value.trim(),
					) || this.$t("message.rule_email_error"),
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

			customerName: "", // tên
			customerEmail: "", // địa chỉ email
			customerPhone: "", // số điện thoại
			customerAddress: "", // địa chỉ liên hệ

			ALL_MAILTEMPLATE: [],
			mailTemplateSelect: null,

			receiveUsers: [],
			allUser_: [],
			receiveUserFilters: [],
			listSign: [],
			listSignDefault: [],
			ccUsers: [],
			ccUserFilters: [],
			arrDeleteUser: [],

			content: "", // nội dung

			isOTP: false, // gửi OPT
			isPDF: false, // Đính kèm PDF

			signDataList: [], // thông tin ký (signData)
			signData: SignDataDto,
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
			this.getAllSignData();
			this.isCustomerStep();
		},
		cloneArray(targetArayy, sourceArray) {
			if (!sourceArray) return sourceArray;
			targetArayy = sourceArray.map((ele) => this.cloneObject({}, ele));
			return targetArayy;
		},
		cloneObject(targetObject, sourceObject) {
			if (!sourceObject) return null;
			targetObject = Object.assign({}, sourceObject);
			for (let prop in sourceObject) {
				if (typeof sourceObject[prop] == "object") {
					if (Array.isArray(sourceObject[prop])) {
						this.cloneArray([], sourceObject[prop]);
					} else {
						targetObject[prop] = this.cloneObject(
							targetObject[prop],
							sourceObject[prop],
						);
					}
				}
			}
			return targetObject;
		},
		async getAllSignData() {
			let response;
			try {
				response = await globalService.getData_Async(
					administratorAPI.API_GetAllSignDataByRequestData(
						this.requestDataId,
					),
				);
				if (!response || !response.state) {
					return [];
				}
				this.listSign = response.data;
				this.listSignDefault = this.cloneArray(
					this.listSignDefault,
					response.data,
				);
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
		async handleResend() {
			try {
				if (this.$refs?.form) {
					if (!this.$refs?.form.validate()) {
						return this.toastError(
							this.$t("message.digital_sign_information_error"),
						);
					}
				}
				this.openConfirmResend = true;
			} catch (error) {
				console.log(error);
			}
		},
		async approveResend() {
			try {

				if (this.$refs?.form) {
					if (!this.$refs?.form.validate()) {
						return this.toastError(
							this.$t("message.digital_sign_information_error"),
						);
					}
				}
				this.arrDeleteUser = [];

				// if (
				// 	JSON.stringify(this.listSign) !=
				// 	JSON.stringify(this.listSignDefault)
				// ) {
				// 	this.openConfirmResend = false;
				// 	return this.toastError(this.$t("message.error_save_first"));
				// }

				let response = await globalService.postData_Async(
					administratorAPI.API_ResendSigntureInfo(),
					{
						reason: "Đã gửi lại mail",
						userId: this.user_current.id,
						requestDataId: this.requestDataId,
						signDataList: this.listSign.map(ele => {
							ele.id = null;
							ele.requestData = {id: this.requestDataId};
							return ele;
						}),
					},
				);
				this.openConfirmResend = false;
				if (!response || !response.state) {
					return;
				}
				this.toastSuccess(this.$t("message.success"));
			} catch (error) {
				console.log(error);
			}
		},
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
			this.toastSuccess(this.$t("message.update_success"));
			this.arrDeleteUser = [];
		},
		async createSign(item, index) {
			item.createdDate = new Date();
			item.requestData = { id: this.requestDataId };
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
				this.listSignDefault = this.cloneArray(
					this.listSignDefault,
					this.listSign,
				);
			} catch (error) {
				console.log(error);
			}
		},
		async close() {
			this.openConfirmResend = false;
		},
		async isCustomerStep() {
			try {
				let response = await globalService.getData_Async(
					administratorAPI.API_GetCheckIsCustomerStep(
						this.requestDataId,
					),
				);
				if (!response || !response.state) {
					return;
				}
				// if return true => enable button
				this.isDisable = !response.data;
			} catch (error) {
				console.log(error);
			}
		},
		addUserSign(index) {
			let _obj = Object.assign({}, SignDataDto);
			this.listSign.splice(index + 1, 0, _obj);
		},
		removeUserSign(index) {
			if (this.listSign[index].id) {
				this.arrDeleteUser.push(this.listSign[index].id);
			}
			this.listSign.splice(index, 1);
		},
	},
};
</script>
<style></style>
