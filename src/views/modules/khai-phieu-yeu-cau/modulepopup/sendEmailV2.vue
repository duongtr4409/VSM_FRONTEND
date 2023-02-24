<template>
	<v-card elevation="0" ref="form">
		<v-dialog max-width="60vw" v-model="openUserInfosRequestData" persistent>
			<UserInfosRequestDataVue
				@save="onSave"
				@close="onClose"
			></UserInfosRequestDataVue>
		</v-dialog>
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
		<v-toolbar flat color="grey lighten-4">
			<v-toolbar-title> {{ $t("button.send_email") }} </v-toolbar-title>
			<v-spacer></v-spacer>
			<v-btn icon @click="close">
				<v-icon>mdi-close</v-icon>
			</v-btn>
		</v-toolbar>
		<v-card-text class="white">
			<v-container>
				<v-form v-model="valid">
					<v-row>
						<v-col cols="12">
							<v-row>
								<v-col cols="12">
									<v-row>
										<v-col cols="6">
											<v-combobox
												v-model="mailTemplateSelect"
												:items="ALL_MAILTEMPLATE"
												item-text="mailTemplateName"
												:label="$t('label.form_email')"
												outlined
												dense
											>
											</v-combobox>
										</v-col>
									</v-row>
								</v-col>
							</v-row>

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
										:label="
											$t(`label.mail_template_receive`)
										"
										multiple
										dense
										outlined
										@click:clear="removeReceiveUserHandler"
									>
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
																sanitizeText(item.fullName +
																' <br/> ' +
																(item.email
																	? item.email
																	: ''))
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

								<v-col cols="12" md="1">
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
								</v-col>
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
										hide-selected
										:label="$t(`label.mail_template_cc`)"
										multiple
										dense
										outlined
										@click:clear="removeCCUserHandler"
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
																sanitizeText(item.fullName +
																' <br/> ' +
																(item.email
																	? item.email
																	: ''))
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

								<v-col cols="12" md="1">
									<v-btn icon>
										<v-icon
											color="blue"
											class="text--blue"
											@click="openPopupSelectionCCUser()"
										>
											mdi-account-plus
										</v-icon>
									</v-btn>
								</v-col>
							</v-row>

							<v-row>
								<v-col cols="12">
									<v-row>
										<v-col cols="12" md="12">
											<tiptap-vuetify
												v-model="content"
												:extensions="extensions"
												placeholder=""
												min-height="400"
												:card-props="{
													flat: true,
													outlined: true,
												}"
											/>
										</v-col>
									</v-row>
								</v-col>
							</v-row>

							<v-row>
								<v-col cols="12">
									<v-row>
										<v-col cols="12" md="12" class="p-8">
											<v-row>
												<v-checkbox
													v-model="isOTP"
													:label="
														$t('label.send_otp')
													"
												></v-checkbox>
											</v-row>
											<v-row>
												<v-checkbox
													v-model="isPDF"
													:label="
														$t('label.attach_pdf')
													"
												></v-checkbox>
											</v-row>
										</v-col>
									</v-row>
								</v-col>
							</v-row>

							<v-row> </v-row>
						</v-col>
						<v-col cols="12" sm="12" md="12" style="padding: 0">
							<v-card-text style="padding: 0">
								<v-container class="mt-4 p-0">
									<v-card
										elevation="0"
										dropzone
										:class="
											!isDragOver
												? 'bordered bordered-solid'
												: 'bordered bordered-dashed background-active'
										"
										class="w-40 items-center p-0"
										@drop="onDrop($event)"
										@dragenter="onDragEnter($event)"
										@dragleave="onDragLeave($event)"
										@dragover="onDragOver($event)"
										@dragend="onDragEnd($event)"
										@click="onClick($event)"
									>
										<div
											class="
												d-flex
												justify-space-between
												border-2
												px-2
											"
										>
											<v-card-text>
												{{ $t("button.upload") }}
											</v-card-text>
											<v-divider vertical></v-divider>
											<v-icon x-large class="ml-4"
												>mdi-cloud-upload-outline
											</v-icon>
										</div>
									</v-card>
									<input
										ref="files"
										id="filesSendMailV2"
										type="file"
										accept=".xlsx,.docx,.pptx,.pdf"
										class="d-none"
										multiple
										@change="handleFile($event)"
									/>
									<VuePerfectScrollbar class="h-60">
										<v-list>
											<v-list-item
												v-for="file in files"
												:key="file.name"
											>
												<v-list-item-icon>
													<!-- <v-icon>
														{{
															m_files_icon[
																file.type
															]
														}}
													</v-icon> -->
													<v-icon>
														{{
															m_files_icon[
																file.name.split(
																	".",
																)[
																	file.name.split(
																		".",
																	).length - 1
																]
															]
														}}
													</v-icon>
												</v-list-item-icon>
												<v-list-item-title>
													{{ file.name }}
												</v-list-item-title>
												<v-list-item-icon>
													<v-icon
														color="red darken-2"
														@click="remove(file)"
													>
														mdi-delete-circle
													</v-icon>
												</v-list-item-icon>
											</v-list-item>
										</v-list>
									</VuePerfectScrollbar>
								</v-container>
							</v-card-text>
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
import MailCustomRestDto from "@/models/mailCustomRest.dto";
import UserInfosRequestDataVue from "../RequestForm/UserInfosRequestData.vue";
import UserInfosRequestData from "../RequestForm/UserInfosRequestData.vue";
import {
	TiptapVuetify,
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
	name: "VsmFeSendEmailV2",
	props: { request: {} },
	components: {
		UserInfosRequestDataVue,
		UserInfosRequestData,
		TiptapVuetify,
	},
	watch: {
		request(newValue) {
			this.m_requestData = newValue;
			this.mailCustomRestDto = Object.assign({}, MailCustomRestDto);
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
			this.subject = newValue.subject;
		},
	},

	data() {
		return {
			openSendMail: true,
			openSelectionReceiveUser: false,
			openSelectionCCUser: false,
			//

			isDragOver: false,
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

			//
			file: null,
			m_requestData: null,
			mailCustomRestDto: MailCustomRestDto,
			user_info: this.getUserInfo(),
			attachmentFiles: [],
			files: [],
			openUserInfosRequestData: false,
			userInfos: [],
			templateMails: [],

			//
			ALL_MAILTEMPLATE: [],
			mailTemplateSelect: null,

			receiveUsers: [],
			allUser_: [],
			receiveUserFilters: [],

			ccUsers: [],
			ccUserFilters: [],

			content: "", // nội dung

			isOTP: false, // gửi OPT
			isPDF: false, // Đính kèm PDF,
			subject: "",
		};
	},

	mounted() {
		this.initialize();
	},
	created() {
		this.m_requestData = this.request;
		// console.log("this.m_requestData", this.m_requestData);
		this.getAllEmail();
	},

	methods: {
		async initialize() {
			// this.getAllUser();
			// this.getAllMailTemplate();
			// this.getAllSignData();
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
		async getAllMailTemplate() {
			let response;
			try {
				response = await globalService.getData_Async(
					administratorAPI.API_GetAllMailTemplate(),
				);
				if (!response || !response.state) {
					return [];
				}
				this.ALL_MAILTEMPLATE = response.data.filter((entry) => {
					return !entry.isDelete && entry.isActive;
				});
			} catch (error) {
				this.toastError(error);
				return;
			}
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
				this.signDataList = response.data;
				this.signData = this.signDataList[0];
			} catch (error) {
				this.toastError(error);
				return;
			}
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
		//
		removeUser(item) {
			this.userInfos.splice(this.userInfos.indexOf(item), 1);
		},
		onSave(value) {
			this.userInfos = [value[0]];
			// console.log("this.userInfos", this.userInfos);
		},
		close() {
			this.$emit("close", true);
		},
		handleFileUpload(event) {
			this.file = event;
		},
		async approveRequest() {
			// console.log("Trình phê duyệt");
			let response;
			let emailAddressTo_ = [];
			let emailAddressCC_ = [];
			if (this.receiveUsers.length > 0) {
				for (let i = 0; i < this.receiveUsers.length; i++) {
					emailAddressTo_.push(this.receiveUsers[i].email);
				}
			}
			if (this.ccUsers.length > 0) {
				for (let i = 0; i < this.ccUsers.length; i++) {
					emailAddressCC_.push(this.ccUsers[i].email);
				}
			}
			// this.mailCustomRestDto.attachmentFile =
			// 	this.m_requestData.attachmentFiles;
			// this.mailCustomRestDto.emailAddressBCC = this.m_requestData.attachmentFiles;
			this.mailCustomRestDto.emailAddressCC = emailAddressCC_;
			this.mailCustomRestDto.emailAddressFrom = this.user_info.email;
			this.mailCustomRestDto.emailAddressTo = emailAddressTo_;
			this.mailCustomRestDto.content = this.content;
			this.mailCustomRestDto.props = null;
			this.mailCustomRestDto.subject = this.subject;
			// this.mailCustomRestDto.subject = this.m_requestData.attachmentFiles;
			// this.mailCustomRestDto.templateName = this.m_requestData.attachmentFiles;
			try {
				response = await globalService.uploadDataParamater_Async(
					administratorAPI.API_MailCustomRest(),
					this.files,
					this.mailCustomRestDto,
				);
			} catch (error) {
				console.log(error);
			}
			if (!response || !response.state) {
				return this.toastError(this.$t("error.load"));
			}
			this.toastSuccess(this.$t("message.review_request_successful"));
			this.$emit("close", true);
			this.mailCustomRestDto = Object.assign({}, MailCustomRestDto);
			this.$router.push({
				path: `/phieu-yeu-cau/list-request-handle`,
			});
		},
		handleFile(files) {
			// console.log("files: ", files);
			for (let i in Array.from(files.target.files)) {
				if(!this.files.find(ele => (ele.name == Array.from(files.target.files)[i].name))) {
					this.files.push(Array.from(files.target.files)[i])					
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
			// console.log("files: ", this.files);
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
			let files = document.getElementById("filesSendMailV2");
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
					this.attachmentFiles.push(response.data);
					// console.log("response file", response);
					this.files = [];
					//this.$emit(constant.keys.upload, true);
				}
				this.$emit("save", this.attachmentFiles);
				this.closeDialog();
			} catch (error) {
				this.toastError(error);
			}
		},
		async getAllEmail() {
			try {
				let response = await globalService.getData_Async(
					administratorAPI.API_GetAllMailTemplate(),
				);
				if (!response.state) {
					return;
				}
				this.templateMails = response.data.filter((entry) => {
					return !entry.isDelete;
				});
			} catch (error) {
				console.log(error);
			}
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
		//
		filerUser(source = [], target = []) {
			return source.filter(
				(ele) => !target.some((ele1) => ele.id == ele1.id),
			);
		},
	},
};
</script>

<style lang="scss" scoped></style>
