<template>
	<v-card elevation="0">
		<v-row class="mt-4 px-4">
			<v-col cols="12" md="12">
				<!-- <v-row>
					<v-col cols="12">
						<v-combobox
							v-model="manageStampInfo.status"
							:items="ALL_ITEM_STATUS_PROCESS"
							label="Trạng thái xử lý"
							outlined
							hide-details
							readonly
							dense
						></v-combobox>
					</v-col>
				</v-row> -->
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
					<v-col cols="12">
						<v-row>
							<v-col cols="12">
								<v-row>
									<v-col cols="12" md="3">
										<v-text-field
											v-model="manageStampInfo.name"
											outlined
											hide-details
											dense
											readonly
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
											v-model="manageStampInfo.email"
											outlined
											dense
											hide-details
											readonly
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
											v-model="
												manageStampInfo.phoneNumber
											"
											outlined
											dense
											hide-details
											readonly
											maxLength="10"
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
											v-model="manageStampInfo.address"
											:label="$t('label.contact_address')"
											outlined
											dense
											hide-details
											maxLength="255"
											readonly
										></v-text-field>
									</v-col>
								</v-row>
							</v-col>
						</v-row>
					</v-col>
				</v-row>
				<v-row>
					<v-col cols="12">
						<v-row>
							<v-col cols="12" md="12">
								<v-textarea
									outlined
									name="Nội dung"
									readonly
									hide-details
									v-model="manageStampInfo.content"
								>
									<template v-slot:label>
										{{ $t("label.mail_template_content") }}
										<span class="text-red-600">{{
											$t("label.star")
										}}</span>
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
									label="Số lượng bản"
									v-model="manageStampInfo.copiesNumber"
									outlined
									dense
									hide-details
									readonly
								></v-text-field>
							</v-col>
							<v-col cols="12" md="6">
								<v-combobox
									v-model="manageStampInfo.stamp"
									outlined
									item-text="stampName"
									:label="$t('label.com_stamp')"
									readonly
									hide-details
									dense
									return-object
								></v-combobox>
							</v-col>
						</v-row>
					</v-col>
				</v-row>

				<v-row>
					<v-col cols="12">
						<v-row>
							<v-col cols="12">
								<v-combobox
									v-model="manageStampInfo.orgStorages"
									item-text="organizationName"
									chips
									hide-selected
									:label="$t('label.storage')"
									hide-details
									readonly
									multiple
									dense
									outlined
								>
									<template
										v-slot:selection="{ attrs, item }"
									>
										<v-chip
											v-bind="attrs"
											class="mt-2"
											close
										>
											{{ item.organizationName }}
										</v-chip>
									</template>
								</v-combobox>
							</v-col>
						</v-row>
					</v-col>
				</v-row>

				<v-row>
					<v-col cols="12">
						<v-row>
							<v-col cols="12" md="6">
								<v-text-field
									:label="$t('label.storage_code')"
									v-model="manageStampInfo.storageCode"
									outlined
									dense
									hide-details
									readonly
								></v-text-field>
							</v-col>
							<v-col cols="12" md="6">
								<v-text-field
									:label="$t('label.storage_location')"
									v-model="manageStampInfo.storagePosition"
									outlined
									dense
									hide-details
									readonly
								></v-text-field>
							</v-col>
						</v-row>
					</v-col>
				</v-row>

				<v-row>
					<v-col cols="12">
						<v-row>
							<v-col cols="6" sm="6" md="6">
								<v-text-field
									:label="$t('label.stamp_date')"
									v-model="manageStampInfo.stampDate"
									append-icon="mdi-calendar"
									hide-details
									dense
									outlined
									:readonly="true"
								>
								</v-text-field>
							</v-col>
							<v-col cols="6" sm="6" md="6">
								<v-text-field
									:label="$t('label.submit_sign_date')"
									v-model="manageStampInfo.submitSignDate"
									append-icon="mdi-calendar"
									hide-details
									dense
									outlined
									:readonly="true"
								>
								</v-text-field>
							</v-col>
						</v-row>
					</v-col>
				</v-row>
				<v-row>
					<v-col cols="12">
						<v-row>
							<v-col cols="12" sm="6" md="6">
								<v-text-field
									:label="$t('label.receive_date')"
									v-model="manageStampInfo.receiveDate"
									append-icon="mdi-calendar"
									hide-details
									dense
									outlined
									:readonly="true"
								>
								</v-text-field>
							</v-col>
							<v-col cols="12" sm="6" md="6">
								<v-text-field
									:label="$t('label.expired_date_storage')"
									v-model="manageStampInfo.expiredDateStorage"
									append-icon="mdi-calendar"
									hide-details
									dense
									outlined
									:readonly="true"
								>
								</v-text-field>
							</v-col>
						</v-row>
					</v-col>
				</v-row>
				<v-row>
					<v-col cols="12">
						<v-row>
							<v-col cols="12" sm="6" md="6">
								<v-text-field
									:label="$t('label.original_due_date')"
									v-model="manageStampInfo.expiredDateReturn"
									append-icon="mdi-calendar"
									hide-details
									dense
									outlined
									:readonly="true"
								>
								</v-text-field>
							</v-col>
							<v-col cols="12" sm="6" md="6">
								<v-text-field
									:label="$t('label.original_return_date')"
									hide-details
									dense
									outlined
									:readonly="true"
									v-model="manageStampInfo.returnDate"
									append-icon="mdi-calendar"
								>
								</v-text-field>
							</v-col>
						</v-row>
					</v-col>
				</v-row>
				<v-row>
					<v-col cols="12">
						<v-row>
							<v-col cols="6">
								<v-combobox
									v-model="manageStampInfo.orgReturn"
									:items="allOrganization_"
									item-text="organizationName"
									:label="$t('label.payment_department')"
									outlined
									hide-details
									dense
									readonly
								></v-combobox>
							</v-col>
						</v-row>
					</v-col>
				</v-row>

				<v-row>
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
							</v-list-item>
						</v-list-item-group>
					</v-list>
				</v-row>
			</v-col>
		</v-row>
	</v-card>
</template>

<script>
import globalService from "@/services/global.service";
import administratorAPI from "../../administrator/administrator.api";
import ManageStampInfo from "@/models/manage-stamp-info.dto";
import moment from "moment";
import SignDto from "@/models/sign.dto";
export default {
	components: {},
	name: "ViewManagerStamp",
	props: { requestDataId: { type: Number } },
	watch: {
		requestStepDataList(value) {
			this.m_requestStepDataList = value;
		},
		// "manageStampInfo.expiredDateReturn"(value) {
		// 	if (value) {
		// 		this.manageStampInfo.expiredDateReturn = moment(value).format(
		// 			this.date_Format,
		// 		);
		// 	}
		// },
		// "manageStampInfo.stampDate"(value) {
		// 	if (value) {
		// 		this.manageStampInfo.stampDate = moment(value).format(
		// 			this.date_Format,
		// 		);
		// 	}
		// },
		// "manageStampInfo.returnDate"(value) {
		// 	if (value) {
		// 		this.manageStampInfo.returnDate = moment(value).format(
		// 			this.date_Format,
		// 		);
		// 	}
		// },
	},

	data() {
		return {
			showDate1: false,
			showDate2: false,
			showDate3: false,
			dateFormat: "DD/MM/yyyy",
			tabs: [{ key: "information", title: this.$t("label.information") }],
			buttons: [
				{
					icon: "mdi-arrow-left-top",
					title: this.$t("button.back"),
					color: "black",
					transparent: true,
					dark: false,
					event: this.back,
				},
			],
			date_Format: "DD/MM/yyyy",
			rules: {
				required: (value) => !!value || "Vui lòng nhập thông tin.",
				number: (value) => {
					if (!value) return true;
					const pattern = /^(0|[1-9][0-9]*)$/;
					return (
						pattern.test((value + "").trim()) ||
						"Vui lòng nhập ký tự số."
					);
				},
			},
			ALL_ITEM_STATUS_PROCESS: [],
			itemStatusProcessSelect: null,
			content: "",
			numberOfCopies: null,
			stampCompany: null,
			signData: SignDto,
			organizations: [], // nơi lưu
			allOrganization_: [],
			organizationFilters: [],

			dateStamp: new Date(
				Date.now() - new Date().getTimezoneOffset() * 60000,
			)
				.toISOString()
				.substr(0, 10), // ngày đóng dấu

			expiryDateReturn: null,
			manageStampInfo: ManageStampInfo,

			attachmentFileList: [], // danh sách file tải lên
			allStamps: [],
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
			await this.getAllStamps();
			await this.getAllOrganization();
			await this.getAllManageStampByRequestData();
			await this.getAllSignData();
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
				this.allOrganization_ = response.data;
				this.organizationFilters = this.allOrganization_;
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
						this.requestDataId,
					),
				);
				if (!response || !response.state) {
					return [];
				}
				if (response.data.length > 0) {
					this.manageStampInfo = response.data[0];
					let s_orgReturn = this.allOrganization_.find((entry) => {
						return entry.id == this.manageStampInfo?.orgReturn?.id;
					});
					/*let s_orgStorage = this.allOrganization_.find((entry) => {
						return entry.id == this.manageStampInfo?.orgStorages?.id;
					});*/
					let s_orgStorage = this.manageStampInfo?.orgStorages.map(
						(ele) => {
							return this.allOrganization_.find(
								(ele1) => ele1?.id == ele?.id,
							);
						},
					);
					let s_stamp = this.allStamps.find((entry) => {
						return entry.id == this.manageStampInfo?.stamp?.id;
					});
					if (s_stamp) {
						this.manageStampInfo.stamp = s_stamp;
					}
					if (s_orgReturn) {
						this.manageStampInfo.orgReturn = s_orgReturn;
					}
					if (s_orgStorage) {
						this.manageStampInfo.orgStorages = s_orgStorage;
					}
				}
				if (this.manageStampInfo.stampDate) {
					this.manageStampInfo.stampDate = moment(
						this.manageStampInfo.stampDate,
					).format(this.date_Format);
				}
				if (this.manageStampInfo.returnDate) {
					this.manageStampInfo.returnDate = moment(
						this.manageStampInfo.returnDate,
					).format(this.date_Format);
				}
				if (this.manageStampInfo.expiredDateReturn) {
					this.manageStampInfo.expiredDateReturn = moment(
						this.manageStampInfo.expiredDateReturn,
					).format(this.date_Format);
				}
				if (this.manageStampInfo.submitSignDate) {
					this.manageStampInfo.submitSignDate = moment(
						this.manageStampInfo.submitSignDate,
					).format(this.date_Format);
				}
				if (this.manageStampInfo.receiveDate) {
					this.manageStampInfo.receiveDate = moment(
						this.manageStampInfo.receiveDate,
					).format(this.date_Format);
				}
				if (this.manageStampInfo.expiredDateStorage) {
					this.manageStampInfo.expiredDateStorage = moment(
						this.manageStampInfo.expiredDateStorage,
					).format(this.date_Format);
				}
				this.getAllAttachmentFile();
			} catch (error) {
				this.toastError(error);
				return;
			}
		},
	},
};
</script>

<style></style>
