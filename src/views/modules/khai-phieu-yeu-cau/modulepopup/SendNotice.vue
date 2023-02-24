<template>
	<v-card elevation="0" ref="form">
		<v-toolbar flat color="grey lighten-4 max-h-[2.5rem]">
			<v-toolbar-title class="mb-5"> Gửi thông báo khẩn </v-toolbar-title>
			<v-spacer></v-spacer>
			<v-btn icon @click="close" class="mb-5">
				<v-icon>mdi-close</v-icon>
			</v-btn>
		</v-toolbar>
		<v-dialog width="60vw" v-model="openSelectionReceiveUser" persistent>
			<UserInfosRequestData
				@save="onSaveReceiveUser"
				@close="onCloseReceiveUser"
			></UserInfosRequestData>
		</v-dialog>

		<v-dialog width="60vw" v-model="openSelectionCCUser" persistent>
			<UserInfosRequestData
				@save="onSaveCCUser"
				@close="onCloseCCUser"
			></UserInfosRequestData>
		</v-dialog>

		<v-card-text class="white">
			<v-container>
				<v-form v-model="valid">
					<v-row>
						<v-col cols="12" sm="12" md="12">
							<v-row>
								<v-col cols="12" md="11">
									<v-combobox
										v-model="receiveUsers"
										:items="receiveUserFilters"
										item-text="fullName"
										:item-value="(item) => item"
										chips
										clearable
										hide-selected
										multiple
										hide-details
										dense
										outlined
										@click:clear="removeReceiveUserHandler"
										maxLength="255"
									>
										<template v-slot:label>
											{{
												$t(
													"label.mail_template_receive",
												)
											}}
											<span class="red--text">
												{{ $t("label.star") }}
											</span>
										</template>
										<template v-slot:item="{ item }">
											<v-list-item
												@click="
													selectHandlerReceiveUser(
														item,
													)
												"
												class="m-1"
											>
												<v-chip>
													<v-list-item-avatar>
														<v-avatar
															color="indigo mr-2"
															size="36"
														>
															<span
																class="
																	white--text
																"
																v-if="
																	!item.avatar
																"
															>
																{{
																	getAvatarText(
																		item.fullName,
																	)
																}}
															</span>
															<v-img
																v-if="
																	item.avatar
																"
																:src="
																	item.avatar
																"
															>
															</v-img>
														</v-avatar>
													</v-list-item-avatar>
													<v-list-item-content>
														<v-list-item-title
															v-html="
																sanitizeText(
																	item.fullName +
																		' <br/> ' +
																		(item.email
																			? item.email
																			: ''),
																)
															"
														>
														</v-list-item-title>
														<v-list-item-subtitle
															v-if="
																receiveUsers &&
																receiveUsers.fullName
															"
														>
															{{
																receiveUsers.fullName
															}}
														</v-list-item-subtitle>
													</v-list-item-content>
												</v-chip>
											</v-list-item>
										</template>
										<template
											v-slot:selection="{ attrs, item }"
										>
											<v-chip
												v-if="typeof item == 'object'"
												v-bind="attrs"
												class="mt-2"
												close
												@click:close="
													removeReceiveUser(item)
												"
											>
												<v-avatar
													color="indigo mr-2"
													size="36"
												>
													<span
														class="white--text"
														v-if="!item.avatar"
													>
														{{
															getAvatarText(
																item.fullName,
															)
														}}
													</span>
													<v-img
														v-if="item.avatar"
														:src="item.avatar"
													>
													</v-img>
												</v-avatar>
												<v-list-item>
													<v-list-item-content>
														<v-list-item-title>
															{{ item.fullName }}
														</v-list-item-title>
														<v-list-item-subtitle>
															{{ item.email }}
														</v-list-item-subtitle>
													</v-list-item-content>
												</v-list-item>
											</v-chip>
											<v-chip
												v-else
												v-bind="attrs"
												class="mt-2"
												close
												@click:close="
													removeReceiveUser(item)
												"
											>
												<v-avatar
													color="indigo mr-2"
													size="36"
												>
													<span
														class="white--text"
														v-if="!item.avatar"
													>
														{{
															getAvatarText(item)
														}}
													</span>
													<v-img
														v-if="item.avatar"
														:src="item.avatar"
													>
													</v-img>
												</v-avatar>
												<v-list-item>
													<v-list-item-content>
														<v-list-item-title>
															{{ item }}
														</v-list-item-title>
														<v-list-item-subtitle>
															{{ item }}
														</v-list-item-subtitle>
													</v-list-item-content>
												</v-list-item>
											</v-chip>
										</template>
									</v-combobox>
								</v-col>

								<!-- <v-col cols="12" md="1">
									<v-btn icon>
										<v-icon
											color="blue"
											class="text--blue"
											@click="
												openPopupSelectionReceiveUser()
											"
										>
											mdi-account-plus
										</v-icon>
									</v-btn>
								</v-col> -->
							</v-row>

							<v-row>
								<v-col cols="12" md="11">
									<v-combobox
										v-model="ccUsers"
										:items="ccUserFilters"
										item-text="fullName"
										:item-value="(item) => item"
										chips
										clearable
										hide-details
										hide-selected
										:label="$t(`label.mail_template_cc`)"
										multiple
										dense
										outlined
										@click:clear="removeCCUserHandler"
										maxLength="255"
									>
										<template v-slot:item="{ item }">
											<v-list-item
												@click="
													selectHandlerCCUser(item)
												"
												class="m-1"
											>
												<v-chip>
													<v-list-item-avatar>
														<v-avatar
															color="indigo mr-2"
															size="36"
														>
															<span
																class="
																	white--text
																"
																v-if="
																	!item.avatar
																"
															>
																{{
																	getAvatarText(
																		item.fullName,
																	)
																}}
															</span>
															<v-img
																v-if="
																	item.avatar
																"
																:src="
																	item.avatar
																"
															>
															</v-img>
														</v-avatar>
													</v-list-item-avatar>
													<v-list-item-content>
														<v-list-item-title
															v-html="
																sanitizeText(
																	item.fullName +
																		' <br/> ' +
																		(item.email
																			? item.email
																			: ''),
																)
															"
														>
														</v-list-item-title>
														<v-list-item-subtitle
															v-if="
																ccUsers &&
																ccUsers.fullName
															"
														>
															{{
																ccUsers.fullName
															}}
															{{ ccUsers.email }}
														</v-list-item-subtitle>
													</v-list-item-content>
												</v-chip>
											</v-list-item>
										</template>
										<template
											v-slot:selection="{ attrs, item }"
										>
											<v-chip
												v-if="typeof item == 'object'"
												v-bind="attrs"
												class="mt-2"
												close
												@click:close="
													removeCCUser(item)
												"
											>
												<v-avatar
													color="indigo mr-2"
													size="36"
												>
													<span
														class="white--text"
														v-if="!item.avatar"
													>
														{{
															getAvatarText(
																item.fullName,
															)
														}}
													</span>
													<v-img
														v-if="item.avatar"
														:src="item.avatar"
													>
													</v-img>
												</v-avatar>
												<v-list-item>
													<v-list-item-content>
														<v-list-item-title>
															{{ item.fullName }}
														</v-list-item-title>
														<v-list-item-subtitle>
															{{ item.email }}
														</v-list-item-subtitle>
													</v-list-item-content>
												</v-list-item>
											</v-chip>
											<v-chip
												v-else
												v-bind="attrs"
												class="mt-2"
												close
												@click:close="
													removeCCUser(item)
												"
											>
												<v-avatar
													color="indigo mr-2"
													size="32"
												>
													<span
														class="white--text"
														v-if="!item.avatar"
													>
														{{
															getAvatarText(item)
														}}
													</span>
													<v-img
														v-if="item.avatar"
														:src="item.avatar"
													>
													</v-img>
												</v-avatar>
												<v-list-item>
													<v-list-item-content>
														<v-list-item-title>
															{{ item }}
														</v-list-item-title>
														<v-list-item-subtitle>
															{{ item }}
														</v-list-item-subtitle>
													</v-list-item-content>
												</v-list-item>
											</v-chip>
										</template>
									</v-combobox>
								</v-col>

								<!-- <v-col cols="12" md="1">
									<v-btn icon>
										<v-icon
											color="blue"
											class="text--blue"
											@click="openPopupSelectionCCUser()"
										>
											mdi-account-plus
										</v-icon>
									</v-btn>
								</v-col> -->
							</v-row>
						</v-col>
						<v-col cols="12" sm="12" md="12">
							<v-textarea
								dense
								outlined
								v-model="mailCustomRestDto.content"
								maxLength="500"
							>
								<template v-slot:label>
									{{ $t("label.mail_template_content") }}
								</template>
							</v-textarea>
						</v-col>
					</v-row>
				</v-form>
			</v-container>
		</v-card-text>
		<v-card-actions class="white">
			<v-spacer></v-spacer>
			<v-btn color="blue darken-1" elevation="0" dark @click="sendMail()">
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
import MailCustomRestDto from "@/models/mailCustomRest.dto";
import UserInfosRequestData from "../RequestForm/UserInfosRequestData.vue";
import ReqDataProcessHisDto from "@/models/req-data-process-his.dto";
export default {
	name: "VsmFeReviewrequestformV2",
	props: { request: {} },
	components: { UserInfosRequestData },
	watch: {
		request(newValue) {
			this.m_requestData = newValue;
			this.mailCustomRestDto.content = "";
			this.mailCustomRestDto = Object.assign({}, MailCustomRestDto);
		},
	},

	data() {
		return {
			requestProcessHis: ReqDataProcessHisDto,

			stringArray: [],
			isccEmailAccepted: true,
			stringArray2: [],
			openSelectionReceiveUser: false,
			openSelectionCCUser: false,
			file: null,
			m_requestData: null,
			mailCustomRestDto: MailCustomRestDto,
			user_info: this.getUserInfo(),
			attachmentFiles: [],
			openUserInfosRequestData: false,
			userInfos: [],
			//
			receiveUsers: [],
			allUser_: [],
			receiveUserFilters: [],

			ccUsers: [],
			ccUserFilters: [],

			content: "", // nội dung

			subject: "",
			regex: /^(([^<>()\\[\]\\.,;:\s@"]+(\.[^<>()\\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/,
		};
	},

	mounted() {
		this.initialize();
	},
	created() {
		this.m_requestData = this.request;
	},

	methods: {
		async initialize() {
			// this.getAllUser();
		},
		async getAllUser() {
			let response;
			try {
				response = await globalService.getData_Async(
					administratorAPI.API_GetAllUserInfos(),
				);
				if (!response || !response.state) {
					return [];
				}
				this.allUser_ = response.data.filter((entry) => {
					return !entry.isDelete && entry.isActive;
				});
				this.receiveUserFilters = this.allUser_;
				this.ccUserFilters = this.allUser_;
			} catch (error) {
				this.toastError(error);
				return;
			}
		},
		removeUser(item) {
			this.userInfos.splice(this.userInfos.indexOf(item), 1);
		},

		close() {
			this.mailCustomRestDto.content = "";
			this.receiveUsers = [];
			this.ccUsers = [];
			this.$emit("close", true);
		},
		handleFileUpload(event) {
			this.file = event;
		},
		async approveRequest() {},
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
					content: this.content,
					emailAddressCC: emailCC,
					emailAddressTo: emailTo,
					subject: this.content,
					requestDataId: this.m_requestData.id,
					addFile: false,
					addOTP: false,
				},
			);
			if (!response || !response.state) {
				this.toastError(this.$t("message.update_error"));
				return;
			}
			this.toastSuccess(this.$t("message.send_mail_succss"));
			await this.saveReqdataProcessHis();
			this.$emit("close", true);
			this.close();
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

		//

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

		//

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
		//
		filerUser(source = [], target = []) {
			return source.filter(
				(ele) => !target.some((ele1) => ele.id == ele1.id),
			);
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
				this.requestProcessHis.requestData = {
					id: this.m_requestData.id,
				};
				this.requestProcessHis.isChild = true;
				this.requestProcessHis.status = this.$t("button.send_notice");
				response = await globalService.postData_Async(
					administratorAPI.API_CreateReqdataProcessHis(),
					this.requestProcessHis,
				);
				console.log("response",response);
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
