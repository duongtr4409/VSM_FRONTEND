<template>
	<v-card elevation="0" class="mt-4">
		<!-- <v-row >
			<v-col cols="12">
				Khách hàng:
				<span class="ml-8">
					<b>{{ `Xem(${signData.numberView})` }}</b>
				</span>
				<span class="ml-8">
					<b>{{ `In(${signData.numberPrint})` }}</b>
				</span>
				<span class="ml-8">
					<b>{{ `Tải xuống(${signData.numberDownload})` }}</b>
				</span>
			</v-col>
		</v-row> -->
		<v-row>
			<v-col cols="11">
				<v-row>
					<v-col cols="12" md="3">
						<v-text-field
							hide-details
							v-model="manageStampInfo.name"
							outlined
							dense
							maxLength="255"
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
							hide-details
							v-model="manageStampInfo.email"
							outlined
							dense
							maxLength="255"
						>
							<template v-slot:label>
								{{ $t("label.email_address") }}
								<span class="text-red-600">{{
									$t("label.star")
								}}</span>
							</template>
						</v-text-field>
					</v-col>
					<v-col cols="12" md="3">
						<v-text-field
							hide-details
							v-model="manageStampInfo.phoneNumber"
							outlined
							dense
							maxLength="12"
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
							hide-details
							v-model="manageStampInfo.address"
							:label="$t('label.contact_address')"
							outlined
							dense
							maxLength="255"
						></v-text-field>
					</v-col>
				</v-row>
			</v-col>
			<v-col cols="1" md="1" v-if="!isReadOnly">
				<v-btn icon class="blue" dark @click="addUserStamp" small>
					<v-icon>mdi-plus</v-icon>
				</v-btn>
			</v-col>
		</v-row>

		<vue-perfect-scrollbar
			class="mt-2 w-full max-h-[10rem]"
			v-if="listUserStamp.length > 0"
		>
			<v-row
				class="mt-2 mb-1"
				v-for="(item, index) of listUserStamp"
				:key="index"
			>
				<v-col cols="11">
					<v-row>
						<v-col cols="12" md="3">
							<v-text-field
								hide-details
								v-model="item.name"
								outlined
								dense
								maxLength="255"
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
								hide-details
								v-model="item.email"
								outlined
								dense
								maxLength="255"
							>
								<template v-slot:label>
									{{ $t("label.email_address") }}
									<span class="text-red-600">{{
										$t("label.star")
									}}</span>
								</template>
							</v-text-field>
						</v-col>
						<v-col cols="12" md="3">
							<v-text-field
								hide-details
								v-model="item.phoneNumber"
								outlined
								dense
								maxLength="12"
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
								hide-details
								v-model="item.address"
								:label="$t('label.contact_address')"
								outlined
								dense
								maxLength="255"
							></v-text-field>
						</v-col>
					</v-row>
				</v-col>
				<v-col cols="1" v-if="!isReadOnly">
					<v-btn
						icon
						class="red"
						dark
						small
						@click="removeUserStamp(index)"
					>
						<v-icon>mdi-close</v-icon>
					</v-btn>
				</v-col>
			</v-row>
		</vue-perfect-scrollbar>
		<v-row class="mt-2">
			<v-col cols="12">
				<v-row>
					<v-col cols="12">
						<v-row>
							<v-col cols="12" md="12">
								<v-textarea
									hide-details
									maxLength="500"
									outlined
									:label="$t('label.mail_template_content')"
									v-model="manageStampInfo.content"
								>
									<template v-slot:label>
										{{ $t("label.mail_template_content") }}
									</template>
								</v-textarea>
							</v-col>
						</v-row>
					</v-col>
				</v-row>

				<v-row>
					<v-col cols="12">
						<v-row>
							<v-col cols="12" md="6">
								<v-text-field
									hide-details
									:label="$t('label.amount')"
									v-model="manageStampInfo.copiesNumber"
									outlined
									dense
									maxLength="12"
								></v-text-field>
							</v-col>
							<v-col cols="12" md="6">
								<v-select
									:menu-props="{ bot: true, offsetY: true }"
									hide-details
									v-model="manageStampInfo.stamp"
									:items="allStamps"
									item-text="stampName"
									:label="$t('label.com_stamp')"
									outlined
									dense
									:no-data-text="$t('message.no_results')"
									return-object
									clearable
								>
								</v-select>
							</v-col>
						</v-row>
					</v-col>
				</v-row>

				<v-row>
					<v-col cols="12">
						<v-row>
							<v-col cols="12">
								<v-select
									:menu-props="{
										bot: true,
										offsetY: true,
										maxWidth: '850',
									}"
									hide-details
									v-model="manageStampInfo.orgStorages"
									:items="organizationFilters"
									item-text="organizationName"
									:item-value="(item) => item"
									chips
									clearable
									hide-selected
									:label="$t('label.storage')"
									multiple
									dense
									outlined
									@click:clear="
										removeOrganizationHandler(item)
									"
								>
									<template v-slot:selection="{ item }">
										<v-chip
											class="mt-1"
											v-if="item && item.id"
										>
											{{ item.organizationName }}
										</v-chip>
									</template>
								</v-select>
							</v-col>
						</v-row>
					</v-col>
				</v-row>

				<v-row>
					<v-col cols="12">
						<v-row>
							<v-col cols="12" md="6">
								<v-text-field
									hide-details
									maxLength="255"
									v-model="manageStampInfo.storageCode"
									outlined
									dense
								>
									<template v-slot:label>
										{{ $t("label.storage_code") }}
									</template>
								</v-text-field>
							</v-col>
							<v-col cols="12" md="6">
								<v-text-field
									hide-details
									:label="$t('label.storage_location')"
									v-model="manageStampInfo.storagePosition"
									outlined
									dense
									maxLength="255"
								></v-text-field>
							</v-col>
						</v-row>
					</v-col>
				</v-row>

				<v-row>
					<v-col cols="12">
						<v-row>
							<v-col cols="12" sm="6" md="6">
								<m-date-picker
									:label="$t('label.stamp_date')"
									:value="manageStampInfo.stampDate"
									@value="
										(v) => (manageStampInfo.stampDate = v)
									"
									:format="dateFormat"
									:required="false"
								>
								</m-date-picker>
							</v-col>
							<v-col cols="12" sm="6" md="6">
								<m-date-picker
									:label="$t('label.submit_sign_date')"
									:value="manageStampInfo.submitSignDate"
									@value="
										(v) =>
											(manageStampInfo.submitSignDate = v)
									"
									:format="dateFormat"
									:required="false"
								>
								</m-date-picker>
							</v-col>
						</v-row>
					</v-col>
				</v-row>
				<v-row>
					<v-col cols="12">
						<v-row>
							<v-col cols="12" sm="6" md="6">
								<m-date-picker
									:label="$t('label.receive_date')"
									:value="manageStampInfo.receiveDate"
									@value="
										(v) => (manageStampInfo.receiveDate = v)
									"
									:format="dateFormat"
									:required="false"
								>
								</m-date-picker>
							</v-col>
							<v-col cols="12" sm="6" md="6">
								<m-date-picker
									:label="$t('label.expired_date_storage')"
									:value="manageStampInfo.expiredDateStorage"
									@value="
										(v) =>
											(manageStampInfo.expiredDateStorage =
												v)
									"
									:format="dateFormat"
									:required="false"
								>
								</m-date-picker>
							</v-col>
						</v-row>
					</v-col>
				</v-row>

				<v-row>
					<v-col cols="12">
						<v-row>
							<v-col cols="12" sm="6" md="6">
								<m-date-picker
									:label="$t('label.original_due_date')"
									:value="manageStampInfo.expiredDateReturn"
									@value="
										(v) =>
											(manageStampInfo.expiredDateReturn =
												v)
									"
									:format="dateFormat"
									:required="true"
								>
								</m-date-picker>
							</v-col>
							<v-col cols="12" sm="6" md="6">
								<m-date-picker
									:label="$t('label.original_return_date')"
									:required="false"
									:format="dateFormat"
									:value="manageStampInfo.returnDate"
									@value="
										(v) => (manageStampInfo.returnDate = v)
									"
								>
								</m-date-picker>
							</v-col>
						</v-row>
					</v-col>
				</v-row>

				<v-row>
					<v-col cols="12">
						<v-row>
							<v-col cols="6">
								<v-select
									:menu-props="{ bot: true, offsetY: true }"
									hide-details
									v-model="manageStampInfo.orgReturn"
									:items="allOrganization_"
									item-text="organizationName"
									:label="$t('label.payment_department')"
									outlined
									dense
									:no-data-text="$t('message.no_results')"
									return-object
								></v-select>
							</v-col>
						</v-row>
					</v-col>
				</v-row>

				<v-row>
					<v-col cols="12">
						<v-row>
							<v-col cols="2">
								<v-file-input
									hide-details
									outlined
									dense
									v-model="fileUploadInfo"
									append-icon="mdi-cloud-upload-outline"
									prepend-icon=""
									:label="$t('button.upload')"
									@change="handleFile($event)"
								></v-file-input>
							</v-col>
						</v-row>
					</v-col>
					<v-list flat>
						<v-list-item-group :v-model="1" color="indigo">
							<v-list-item
								v-for="(item, i) in attachmentFileList"
								:key="i"
							>
								<v-list-item-icon>
									<v-icon>
										{{ m_files_icon[item.fileExtension] }}
									</v-icon>
								</v-list-item-icon>

								<v-list-item-content>
									<v-list-item-title
										v-text="item.fileName"
									></v-list-item-title>
								</v-list-item-content>

								<v-list-item-icon
									@click="deleteAttachmentFile(item)"
								>
									<v-icon> mdi-close-circle </v-icon>
								</v-list-item-icon>
							</v-list-item>
						</v-list-item-group>
					</v-list>
				</v-row>

				<v-row>
					<v-col cols="12">
						<v-btn
							:color="'blue darken-2'"
							:dark="true"
							width="140"
							class="rounded-0 mt-4"
							@click="saveManageStampInfo()"
						>
							<v-icon>{{ "mdi-content-save" }}</v-icon>
							{{ $t("button.update") }}
						</v-btn>
					</v-col>
				</v-row>
			</v-col>

			<v-divider vertical></v-divider>
			<v-col cols="12" md="6">
				<div></div>
			</v-col>
		</v-row>
	</v-card>
</template>

<script>
import globalService from "@/services/global.service";
import administratorAPI from "../../administrator/administrator.api";
import ManageStampInfo from "@/models/manage-stamp-info.dto";
import moment from "moment";
import constant from "@/common/constant";
import SignDto from "@/models/sign.dto";

export default {
	components: {},
	name: "ManagerStamp",
	props: { requestDataId: {}, isSaved: {} },
	watch: {
		isSaved(value) {
			this.m_isSaved = value;
			if (this.m_isSaved.state) {
				this.saveManageStampInfo();
			}
		},
	},

	data() {
		return {
			allStamps: [],
			showDate1: false,
			mailTemplateSelect: null,
			isOTP: false,
			receiveUsers: [],

			showDate2: false,
			showDate3: false,
			dateFormat: "DD/MM/yyyy",
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
				required: (value) => !!value || this.$t("error.required"),
				number: (value) => {
					if (!value) return true;
					const pattern = /^(0|[1-9][0-9]*)$/;
					return (
						pattern.test((value + "").trim()) ||
						this.$t("message.please_enter_numeric_characters")
					);
				},
			},
			ALL_ITEM_STATUS_PROCESS: [],
			itemStatusProcessSelect: null,
			content: "",
			numberOfCopies: null,
			stampCompany: null,
			user_current: this.getUserInfo(),
			allOrganization_: [],
			organizationFilters: [],

			archiveCode: "", // mã lưu trữ
			archiveLocation: "", // vị trí lưu trữ
			signData: SignDto,
			expiryDateReturn: null,
			dateReturn: null,
			organizationReturn: null, // bộ phận trả
			listUserStamp: [],
			fileUploadInfo: [], // file upload
			isReadOnly: true,
			manageStampInfoList: [], // thông tin đóng Dấu
			manageStampInfo: ManageStampInfo,
			date_Format: "yyyy-MM-DD",
			arrDeleteStamp: [],
			attachmentFileList: [], // danh sách file tải lên
			regex: /^(([^<>()\\[\]\\.,;:\s@"]+(\.[^<>()\\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/,
		};
	},
	created() {
		this.ALL_ITEM_STATUS_PROCESS = [
			"Chưa có hợp đồng",
			"Đã có hợp đồng, chưa gửi cho khách hàng",
			"Đã có hợp đồng, đã gửi cho khách hàng",
			"Đã có hợp đồng, Khách hàng đã ký",
			"Đã có hợp đồng, Đã nhận được hợp đồng có chữ ký của khách hàng",
			"Đã nộp bản gốc",
			"Chưa nộp bản gốc",
			"Quá hạn nộp bản gốc",
		];
	},
	mounted() {
		this.initialize();
		this.m_isSaved = this.isSaved;
	},

	methods: {
		async initialize() {
			if (
				this.requestDataId?.created?.id == this.user_current.id &&
				this.requestDataId?.status?.id == 1
			) {
				this.isReadOnly = false;
			}
			await this.getAllOrganization();
			await this.getAllStamps();
			await this.getAllManageStampByRequestData();
			await this.getAllSignData();
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
				this.signData = response.data[0];
			} catch (error) {
				this.toastError(error);
				return;
			}
		},
		async getAllStamps() {
			let response;
			try {
				response = await globalService.getData_Async(
					administratorAPI.API_GetAllStamp(),
				);
				if (!response || !response.state) {
					return;
				}
				this.allStamps = response.data.filter((entry) => {
					return !entry.isDelete;
				});
			} catch (error) {
				return this.toastError(error);
			}
		},
		async getAllOrganization() {
			let response;
			try {
				response = await globalService.getData_Async(
					administratorAPI.API_FindAllOrganization(),
				);
				if (!response || !response.state) {
					return [];
				}
				this.allOrganization_ = response.data.filter((entry) => {
					return !entry.isDelete;
				});
				this.organizationFilters = Object.assign(
					[],
					this.allOrganization_,
				);
			} catch (error) {
				this.toastError(error);
				return;
			}
		},
		async getAllAttachmentFile() {
			let response;
			try {
				response = await globalService.getData_Async(
					administratorAPI.API_GetAllAttachmentFileByManageStampInfoId(
						this.manageStampInfo.id,
					),
				);
				if (!response || !response.state) {
					return [];
				}
				this.attachmentFileList = response.data;
			} catch (error) {
				this.toastError(error);
				return;
			}
		},
		async getAllManageStampByRequestData() {
			let response;
			try {
				response = await globalService.getData_Async(
					administratorAPI.API_GetAllManageStampInfoByRequestData(
						this.requestDataId?.id,
					),
				);

				if (!response || !response.state) {
					return [];
				}
				if (response.data.length == 0) {
					return;
				}
				this.listUserStamp = response.data.sort((a, b) => {
					return a.id - b.id;
				});
				this.manageStampInfo = this.listUserStamp[0];
				this.listUserStamp.shift();
				let s_orgReturn = this.allOrganization_.find((entry) => {
					return entry.id == this.manageStampInfo?.orgReturn?.id;
				});
				let s_stamp = this.allStamps.find((entry) => {
					return entry.id == this.manageStampInfo?.stamp?.id;
				});
				if (s_stamp) {
					this.manageStampInfo.stamp = s_stamp;
				}
				if (s_orgReturn) {
					this.manageStampInfo.orgReturn = s_orgReturn;
				}
				this.getAllAttachmentFile();
			} catch (error) {
				this.toastError(error);
				return;
			}
		},

		async removeOrganizationHandler() {
			this.organizationFilters = Object.assign([], this.allOrganization_);
			this.manageStampInfo.orgStorages = [];
		},

		async handleFile(event) {
			if (!event || !event.name) {
				return;
			}

			let response;
			try {
				response = await globalService.upload_Async(
					administratorAPI.API_UploadManageStampCloud(
						this.requestDataId?.id,
						this.user_current.id,
					),
					event,
				);
				if (!response) {
					this.toastError(response);
					return;
				}
				if (!response.state) {
					this.toastError(response.messgage);
					return;
				}
				let attachmentFile = response.data;
				attachmentFile.requestData = { id: this.requestDataId?.id };
				attachmentFile.manageStampInfo = {
					id: this.manageStampInfo?.id,
				};
				response = await globalService.putData_Async(
					administratorAPI.API_UpdateAttachmentFile(
						attachmentFile.id,
						this.user_current.id,
					),
					attachmentFile,
				);
				this.fileUploadInfo = [];
				this.getAllAttachmentFile();
			} catch (error) {
				this.toastError(error);
			}
		},

		async saveManageStampInfo() {
			// for (let items of this.listUserStamp) {
			// 	if (items.id == -1) {
			// 		console.log("vao");
			// 		items = {
			// 			id: null,
			// 			name: items.name,
			// 			email: items.email,
			// 			phoneNumber: items.phoneNumber,
			// 			address: items.address,
			// 			...this.manageStampInfo,
			// 		};
			// 	} else {
			// 		items = {
			// 			name: items.name,
			// 			email: items.email,
			// 			phoneNumber: items.phoneNumber,
			// 			address: items.address,
			// 			...this.manageStampInfo,
			// 		};
			// 	}
			// }
			// if (this.listUserStamp.length) {
			// 	console.log(this.manageStampInfo);
			// 	return console.log(this.listUserStamp);
			// }
			this.manageStampInfo.storagePosition = this.manageStampInfo?.storagePosition.trim();
			this.manageStampInfo.content = this.manageStampInfo?.content.trim();
			this.manageStampInfo.storageCode =
				this.manageStampInfo?.storageCode.trim();
			if (!this.manageStampInfo.name) {
				return this.toastError(this.$t("error.empty_signName"));
			}
			if (!this.manageStampInfo.email.trim()) {
				return this.toastError(this.$t("user_valid.email"));
			}
			if (!this.regex.test(this.manageStampInfo.email)) {
				return this.toastError(this.$t("user_valid.email_format"));
			}
			if (!this.manageStampInfo.phoneNumber.trim()) {
				return this.toastError(this.$t("user_valid.businessPhones"));
			}
			if (!Number.isInteger(this.manageStampInfo.phoneNumber * 1)) {
				return this.toastError(this.$t("error.invalid_phoneNumber"));
			}
			if (!this.manageStampInfo.expiredDateReturn) {
				return this.toastError(
					this.$t("message.empty_expiredDateReturn"),
				);
			}
			if (!Number.isInteger(this.manageStampInfo.copiesNumber * 1)) {
				return this.toastError(this.$t("error.valid_soluong"));
			}
			if (this.manageStampInfo.copiesNumber < 0) {
				return this.toastError(this.$t("error.invalid_copiesNumber"));
			}
			let responseDelete;
			if (this.arrDeleteStamp.length) {
				for (let item of this.arrDeleteStamp) {
					responseDelete = await globalService.deleteData_Async(
						administratorAPI.API_updateManageStampInfo(item),
					);
					if (!responseDelete || !responseDelete.state) {
						continue;
					}
				}
			}
			// // if (!this.manageStampInfo.phoneNumber) {
			// // 	return this.toastError(
			// // 		this.$t("user_valid.businessPhones"),
			// // 	);
			// // }

			// // if (!this.manageStampInfo.content) {
			// // 	return this.toastError(this.$t("message.empty_requestContent"));
			// // }
			// // if (!this.validRequiredText(this.manageStampInfo.storageCode)) {
			// // 	return this.toastError(this.$t("message.empty_storageCode"));
			// // }

			// // if (!this.manageStampInfo.stampDate) {
			// // 	return this.toastError(this.$t("message.empty_stampDate"));
			// // }

			// // if (!this.manageStampInfo.returnDate) {
			// // 	return this.toastError(this.$t("message.empty_returnDate"));
			// // }
			if (this.manageStampInfo) {
				this.manageStampInfo.stampDate = moment(
					this.manageStampInfo.stampDate,
				).toDate();
				this.manageStampInfo.returnDate = moment(
					this.manageStampInfo.returnDate,
				).toDate();
				this.manageStampInfo.expiredDateReturn = moment(
					this.manageStampInfo.expiredDateReturn,
				).toDate();
				this.manageStampInfo.submitSignDate = moment(
					this.manageStampInfo.submitSignDate,
				).toDate();
				this.manageStampInfo.receiveDate = moment(
					this.manageStampInfo.receiveDate,
				).toDate();
				this.manageStampInfo.expiredDateStorage = moment(
					this.manageStampInfo.expiredDateStorage,
				).toDate();
				let response;

				for (let items of this.listUserStamp) {
					let tempObj = Object.assign({}, items);
					if (!items.id) {
						tempObj = {
							...this.manageStampInfo,
						};

						tempObj.id = null;
						tempObj.name = items.name;
						tempObj.email = items.email;
						tempObj.phoneNumber = items.phoneNumber;
						tempObj.address = items.address;
						if (!tempObj.name) {
							return this.toastError(
								this.$t("error.empty_signName"),
							);
						}
						if (!tempObj.email.trim()) {
							return this.toastError(this.$t("user_valid.email"));
						}
						if (!this.regex.test(tempObj.email)) {
							return this.toastError(
								this.$t("user_valid.email_format"),
							);
						}
						if (!tempObj.phoneNumber.trim()) {
							return this.toastError(
								this.$t("user_valid.businessPhones"),
							);
						}

						response = await globalService.postData_Async(
							administratorAPI.API_createManageStampInfo(),
							tempObj,
						);
					} else {
						tempObj = {
							...this.manageStampInfo,
						};
						tempObj.id = items.id;
						tempObj.name = items.name;
						tempObj.email = items.email;
						tempObj.phoneNumber = items.phoneNumber;
						tempObj.address = items.address;
						if (!tempObj.name) {
							return this.toastError(
								this.$t("error.empty_signName"),
							);
						}
						if (!tempObj.email.trim()) {
							return this.toastError(this.$t("user_valid.email"));
						}
						if (!this.regex.test(tempObj.email)) {
							return this.toastError(
								this.$t("user_valid.email_format"),
							);
						}
						if (!tempObj.phoneNumber.trim()) {
							return this.toastError(
								this.$t("user_valid.businessPhones"),
							);
						}
						response = await globalService.putData_Async(
							administratorAPI.API_updateManageStampInfo(
								tempObj.id,
							),
							tempObj,
						);
					}
					if (!response || !response.state) {
						continue;
					}
				}
				response = await globalService.putData_Async(
					administratorAPI.API_updateManageStampInfo(
						this.manageStampInfo.id,
					),
					this.manageStampInfo,
				);
				if (!response || !response.state) {
					this.toastError(this.$t("message.update_error"));
					return;
				}

				this.manageStampInfo.stampDate = moment(
					this.manageStampInfo.stampDate,
				).format(this.date_Format);
				this.manageStampInfo.returnDate = moment(
					this.manageStampInfo.returnDate,
				).format(this.date_Format);
				this.manageStampInfo.expiredDateReturn = moment(
					this.manageStampInfo.expiredDateReturn,
				).format(this.date_Format);
				this.$emit(constant.keys.handlerStamp, this.manageStampInfo);
				this.arrDeleteStamp = [];
				this.getAllManageStampByRequestData();
				this.getAllAttachmentFile();
				this.toastSuccess(this.$t("message.update_success"));
			}
		},

		async deleteAttachmentFile(itemAttachmentDelete) {
			if (!itemAttachmentDelete.id) return;
			let response = await globalService.deleteData_Async(
				administratorAPI.API_DeleteAttachmentFile(
					itemAttachmentDelete.id,
				),
			);
			if (!response || !response.state) {
				this.toastError(this.$t("message.delete_error"));
				return;
			}
			this.toastSuccess(this.$t("message.delete_success"));
			this.getAllAttachmentFile();
		},
		selectHandlerReceiveUser(item) {
			this.receiveUsers.push(item);
		},
		removeReceiveUser(item) {
			this.receiveUsers.splice(this.receiveUsers.indexOf(item), 1);
		},
		addUserStamp() {
			let _obj = Object.assign({}, this.manageStampInfo);
			_obj.name = "";
			_obj.email = "";
			_obj.phoneNumber = "";
			_obj.address = "";
			_obj.id = null;
			this.listUserStamp.push(_obj);
		},
		removeUserStamp(index) {
			if (this.listUserStamp[index].id) {
				this.arrDeleteStamp.push(this.listUserStamp[index].id);
			}
			this.listUserStamp.splice(index, 1);
		},
	},
};
</script>

<style></style>
