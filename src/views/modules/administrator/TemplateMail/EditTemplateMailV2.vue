<template>
	<v-card elevation="0" class="overflow-y-hidden">
		<v-toolbar flat color="grey lighten-4">
			<v-toolbar-title> {{ $t("title.create_folder") }}</v-toolbar-title>
			<v-spacer></v-spacer>
			<v-btn icon @click="close">
				<v-icon>mdi-close</v-icon>
			</v-btn>
		</v-toolbar>
		<!-- <BreadcrumbsVue />
		<TabVue :tabs="tabs" /> -->
		<v-row>
			<v-dialog
				width="60vw"
				v-model="openSelectionReceiveUser"
				persistent
			>
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
		<v-row class="mt-4 px-4">
			<v-col cols="12" md="7">
				<v-row>
					<v-col cols="12" md="11">
						<v-text-field
							dense
							outlined
							:label="$t('label.name')"
							v-model="mailTemplate.mailTemplateName"
							required
							maxLength="255"
						>
							<template v-slot:label>
								{{ $t("label.name") }}
								<span class="text-red-600">
									{{ $t("label.star") }}
								</span>
							</template>
						</v-text-field>
					</v-col>
				</v-row>

				<v-row>
					<v-col cols="12" md="11">
						<v-combobox
							maxLength="255"
							v-model="receiveUsers"
							:items="receiveUserFilters"
							item-text="fullName"
							:item-value="(item) => item"
							chips
							clearable
							hide-selected
							:label="$t(`label.mail_template_receive`)"
							multiple
							dense
							outlined
							@click:clear="removeReceiveUserHandler"
						>
							<template v-slot:item="{ item }">
								<v-list-item
									@click="selectHandlerReceiveUser(item)"
									class="m-1"
								>
									<v-chip>
										<v-list-item-avatar>
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
												{{ receiveUsers.fullName }}
											</v-list-item-subtitle>
										</v-list-item-content>
									</v-chip>
								</v-list-item>
							</template>
							<template v-slot:selection="{ attrs, item }">
								<v-chip
									v-if="typeof item == 'object'"
									v-bind="attrs"
									class="mt-2"
									close
									@click:close="removeReceiveUser(item)"
								>
									<v-avatar color="indigo mr-2" size="36">
										<span
											class="white--text"
											v-if="!item.avatar"
										>
											{{ getAvatarText(item.fullName) }}
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
									@click:close="removeReceiveUser(item)"
								>
									<v-avatar color="indigo mr-2" size="36">
										<span
											class="white--text"
											v-if="!item.avatar"
										>
											{{ getAvatarText(item) }}
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
								@click="openPopupSelectionReceiveUser()"
							>
								mdi-account-plus
							</v-icon>
						</v-btn>
					</v-col>
				</v-row>

				<v-row>
					<v-col cols="12" md="11">
						<v-combobox
							maxLength="255"
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
									@click="selectHandlerCCUser(item)"
									class="m-1"
								>
									<v-chip>
										<v-list-item-avatar>
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
													ccUsers && ccUsers.fullName
												"
											>
												{{ ccUsers.fullName }}
												{{ ccUsers.email }}
											</v-list-item-subtitle>
										</v-list-item-content>
									</v-chip>
								</v-list-item>
							</template>
							<template v-slot:selection="{ attrs, item }">
								<v-chip
									v-if="typeof item == 'object'"
									v-bind="attrs"
									class="mt-2"
									close
									@click:close="removeCCUser(item)"
								>
									<v-avatar color="indigo mr-2" size="36">
										<span
											class="white--text"
											v-if="!item.avatar"
										>
											{{ getAvatarText(item.fullName) }}
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
									@click:close="removeCCUser(item)"
								>
									<v-avatar color="indigo mr-2" size="36">
										<span
											class="white--text"
											v-if="!item.avatar"
										>
											{{ getAvatarText(item) }}
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
					<v-col cols="12" md="11">
						<v-text-field
							maxLength="255"
							dense
							outlined
							:label="$t('label.mail_template_subject')"
							v-model="mailTemplate.subject"
						></v-text-field>
					</v-col>
				</v-row>

				<v-row>
					<v-col cols="12" md="11">
						<tiptap-vuetify
							v-model="mailTemplate.content"
							:extensions="extensions"
							placeholder="N???i dung ???"
							min-height="300"
							:card-props="{
								flat: true,
								outlined: true,
							}"
						/>
					</v-col>
				</v-row>

				<!-- <v-row>
					<v-col cols="12">
						<tiptap-vuetify
							v-model="mailTemplate.footer"
							:extensions="extensions"
							placeholder="Write something ???"
							min-height="300"
							:card-props="{
								flat: true,
								outlined: true,
							}"
						/>
					</v-col>
				</v-row> -->
				<v-row>
					<v-col>
						<span class="text-red-600">
							Ch?? ??: <br />
							1. ????? tr??nh m???t n???i dung mail, vui l??ng kh??ng vi???t
							chu???i k?? t??? kh??ng d???u trong []. VD: [heloworld],
							[hello_word] <br />
							2. C?? ph??p g??n bi???n v??o mail
							[ma_truong_du_lieu_trong_form] <br />
							V?? d??? hi???n th??? tr?????ng danh s??ch kh??ch h??ng trong
							form bi???u m???u: - T??n kh??ch h??ng: [ten_khach_hang]
						</span>
					</v-col>
				</v-row>
				<v-col cols="12">
					<v-col cols="12" md="3">
						<v-file-input
							ref="inputFile"
							id="inputFile"
							v-model="fileInfo"
							outlined
							dense
							append-icon="mdi-cloud-upload-outline"
							prepend-icon=""
							:label="$t('label.upload')"
							@change="handleFile($event)"
						></v-file-input>
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

								<v-list-item-icon @click="deleteFile(item)">
									<v-icon> mdi-close-circle </v-icon>
								</v-list-item-icon>
							</v-list-item>
						</v-list-item-group>
					</v-list>
				</v-col>
				<v-col cols="12">
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn
							elevation="0"
							dark
							@click="save"
							class="blue darkken-2 rounded-0"
						>
							{{ $t("button.ok") }}
						</v-btn>
						<v-btn
							elevation="0"
							@click="cancel"
							class="grey lighten-2 rounded-0"
						>
							{{ $t("button.cancel") }}
						</v-btn>
					</v-card-actions>
				</v-col>

				<!-- <v-row>
					<v-col cols="12">
						<v-btn text class="rounded-0" @click="appendItem()">
							<v-icon> mdi-plus-circle </v-icon>
							{{ $t("button.create") }}
						</v-btn>
						<v-btn text class="rounded-0">
							<v-icon> mdi-trash-can-outline </v-icon>
							{{ $t("button.delete") }}
						</v-btn>
					</v-col>
				</v-row>
				<v-divider></v-divider> -->
				<!-- <v-row>
					<v-card-title>Th??ng Tin bindding d??? li???u</v-card-title>
					<v-col cols="12">
						<v-btn text class="rounded-0" @click="appendItem()">
							<v-icon> mdi-plus-circle </v-icon>
							{{ $t("button.create") }}
						</v-btn>
						<v-btn text class="rounded-0">
							<v-icon> mdi-trash-can-outline </v-icon>
							{{ $t("button.delete") }}
						</v-btn>
					</v-col>
				</v-row>
				<v-col cols="12">
					<v-data-table
						show-select
						hide-default-footer
						:headers="headers"
						:items="items"
					>
						<template v-slot:[`item.action`]="{ item }">
							<v-btn
								icon
								v-if="editing != item"
								@click="edit(item)"
							>
								<v-icon>mdi-pencil-circle </v-icon>
							</v-btn>
							<v-btn icon v-else @click="update">
								<v-icon>mdi-checkbox-marked-circle </v-icon>
							</v-btn>
							<v-btn icon @click="deleteItem(item)">
								<v-icon>mdi-delete-circle </v-icon>
							</v-btn>
						</template>
						<template v-slot:[`item.name`]="{ item }">
							<span v-if="editing != item">
								{{ item.name }}
							</span>
							<m-text-field
								v-else
								:label="`K?? hi???u trong mail`"
								:value="mapping.name"
								@value="(v) => (mapping.name = v)"
								class="mt-2"
							/>
						</template>
						<template v-slot:[`item.valueBinding`]="{ item }">
							<span v-if="editing != item">
								{{ item.valueBinding }}
							</span>
							<m-text-field
								v-else
								:label="`Gi?? tr??? thay th???`"
								:value="mapping.valueBinding"
								@value="(v) => (mapping.valueBinding = v)"
								class="mt-2"
							/>
						</template>
						<template v-if="creating" v-slot:[`body.append`]>
							<tr>
								<td></td>
								<td>
									<m-text-field
										:label="`K?? hi???u trong mail`"
										:value="mapping.name"
										@value="(v) => (mapping.name = v)"
										class="mt-4"
										required
									/>
								</td>
								<td>
									<v-combobox
										v-model="select"
										:items="ALL_VALUE_BINDING"
										item-text="name"
										:label="`Gi?? tr??? thay th???`"
										outlined
										clearable
										dense
										class="mt-4"
									></v-combobox>
								</td>
								<td>
									<v-btn icon @click="add">
										<v-icon>mdi-plus-circle</v-icon>
									</v-btn>
								</td>
							</tr>
						</template>
					</v-data-table>
				</v-col> -->
				<!-- <v-col cols="12" md="12" class="mt-12 text-right">
					<v-btn
						:color="'blue darken-2'"
						:dark="true"
						width="80"
						class="rounded-0 mt-4"
						@click="save"
					>
						<v-icon>{{ "mdi-content-save" }}</v-icon>
						{{ $t("button.ok") }}
					</v-btn>
					<v-btn
						:color="'grey lighten-2'"
						:dark="false"
						width="80"
						class="rounded-0 mt-4 ml-4"
						@click="cancel"
					>
						{{ $t("button.cancel") }}
					</v-btn>
				</v-col> -->
			</v-col>
			<!-- <v-divider vertical></v-divider> -->
			<v-col cols="12" md="5">
				<v-card outlined class="d-flex h-full items-center">
					<v-col cols="12" md="12">
						<div
							v-html="sanitizeText(mailTemplate.contentFile)"
							class="table_tiptap"
						></div>
					</v-col>
				</v-card>
			</v-col>
		</v-row>
	</v-card>
</template>

<script>
// import BreadcrumbsVue from "@/components/Breadcrumbs.vue";
// import TabVue from "@/components/Tab.vue";
import store from "@/store";
import TemplateFormDto from "@/models/template-form.dto";
import MailTemplateDto from "@/models/mail-template.dto";
import globalService from "@/services/global.service";
import UserInfosRequestData from "../../khai-phieu-yeu-cau/RequestForm/UserInfosRequestData.vue";
import administratorAPI from "../administrator.api";
import {
	TiptapVuetify,
	// Heading,
	Bold,
	Italic,
	Strike,
	Underline,
	Code,
	Paragraph,
	// BulletList,
	// OrderedList,
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
	props: {
		idMailSelect: { type: Number },
	},
	name: "EditTempalteFormV2Vue",
	components: {
		/*BreadcrumbsVue, TabVue,*/ TiptapVuetify,
		UserInfosRequestData,
	},
	computed: {
		items() {
			try {
				return JSON.parse(this.templateForm.mappingInfo);
			} catch {
				return [];
			}
		},
	},
	watch: {
		idMailSelect: async function (value) {
			if (!value) {
				this.clearData();
			} else {
				let response;
				try {
					response = await globalService.getData_Async(
						administratorAPI.API_GetMailTemplate(value),
					);
					if (!response || !response.state) {
						this.$router.push({ path: "./" });
						return;
					}
					this.mailTemplate = response.data;
					this.receiveUsers = this.mailTemplate.receiverDefault
						? JSON.parse(this.mailTemplate.receiverDefault)
						: [];
					this.ccUsers = this.mailTemplate.ccerDefault
						? JSON.parse(this.mailTemplate.ccerDefault)
						: [];
					// if (this.mailTemplate.pathFile)
					// 	this.fileUploadInfo = {
					// 		name: this.mailTemplate.pathFile,
					// 	};	fake file ????nh k??m
				} catch (error) {
					this.$router.push({ path: "./" });
				}
				this.getAllAttachmentFile();
			}
			this.getAllUser();
		},
		"templateForm.attachmentFileDTOS": async function (value) {
			let response;
			try {
				let id = value[0].id;
				response = await globalService.getData_Async(
					administratorAPI.API_GetPreviewLink(id),
				);
				if (!response || !response.state) {
					return;
				}
				this.previewLink = response.data;
			} catch {
				return;
			}
		},
		"mailTemplate.content"(value) {
			this.mailTemplate.contentFile =
				(value ? value : "") +
				(this.mailTemplate.footer ? this.mailTemplate.footer : "");
		},
		"mailTemplate.footer"(value) {
			this.mailTemplate.contentFile =
				(this.mailTemplate.content ? this.mailTemplate.content : "") +
				(value ? value : "");
			return value;
		},
	},
	data() {
		return {
			sizeOfFile: 0, // dung l?????ng upload hi???n t???i
			maxSizeOfFile: 20971520, // dung l?????ng t???i ??a cho ph??p g???i file
			stringArray: [],
			stringArray2: [],
			isEmailAccepted: true,
			ALL_VALUE_BINDING: [], // danh m???c gi?? tr??? thay th???

			fileInfo: null, // th??ng tin file t???i l??n
			current_userInfo: this.getUserInfo(), // user ??ang ????ng nh???p
			attachmentFileList: [], // file ????nh k??m hi???n th???
			attachmentFileListSave: [], // file ????nh k??m c???n l??u
			attachmentFileListDelete: [], // danh s??ch file b???m x??a
			openSelectionReceiveUser: false, // popup
			openSelectionCCUser: false,
			fileSize: 0,

			tabs: [{ key: "information", title: this.$t("label.information") }],
			// buttons: [
			// 	{
			// 		icon: "mdi-content-save",
			// 		title: this.$t("button.save"),
			// 		color: "blue darken-2",
			// 		transparent: false,
			// 		dark: true,
			// 		event: this.save,
			// 	},
			// 	{
			// 		icon: "mdi-trash-can-outline",
			// 		title: this.$t("button.delete"),
			// 		color: "black",
			// 		transparent: true,
			// 		dark: false,
			// 		event: this.delete,
			// 	},
			// 	{
			// 		icon: "mdi-arrow-left-top",
			// 		title: this.$t("button.back"),
			// 		color: "black",
			// 		transparent: true,
			// 		dark: false,
			// 		event: this.back,
			// 	},
			// ],
			templateForm: Object.assign({}, TemplateFormDto),
			mailTemplate: Object.assign({}, MailTemplateDto),
			headers: [
				{
					text: `K?? hi???u trong mail`,
					align: "start",
					value: "name",
				},
				{
					text: `Gi?? tr??? thay th???`,
					align: "start",
					value: "valueBinding",
				},
				{
					text: this.$t("label.manipulation"),
					align: "start",
					sortable: false,
					value: "action",
				},
			],
			creating: false,
			editing: false,
			mapping: {
				name: "",
				valueBinding: "",
			},
			previewLink: "",

			receiveUsers: [],
			allUser_: [],
			receiveUserFilters: [],

			ccUsers: [],
			ccUserFilters: [],

			fileUploadInfo: [],

			extensions: [
				History,
				Blockquote,
				Link,
				Underline,
				Strike,
				Italic,
				ListItem,
				// BulletList,
				// OrderedList,
				// [
				// 	Heading,
				// 	{
				// 		options: {
				// 			levels: [1, 2, 3],
				// 		},
				// 	},
				// ],
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
			content: "",
			regex: /^(([^<>()\\[\]\\.,;:\s@"]+(\.[^<>()\\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/,
		};
	},
	async created() {
		console.log(808, "vao create");
		this.ALL_VALUE_BINDING = [
			{
				name: "M?? phi???u y??u c???u",
				valueBinding: "requestData.requestDataCode",
			},
			{
				name: "T??n phi???u y??u c???u",
				valueBinding: "requestData.requestDataName",
			},
			{
				name: "????n v??? tr??nh phi???u",
				valueBinding: "requestData.createdOrgName",
			},
			{
				name: "Ng?????i tr??nh phi???u",
				valueBinding: "requestData.createdName",
			},
		];
		store.state.loading = true;
		await this.initialize();
	},
	mounted() {
		console.log(830);
		store.state.loading = false;
	},
	methods: {
		async initialize() {
			if (!this.idMailSelect) {
				this.templateForm = Object.assign({}, TemplateFormDto);
				this.mailTemplate = Object.assign({}, MailTemplateDto);
			} else {
				let response;
				try {
					response = await globalService.getData_Async(
						administratorAPI.API_GetMailTemplate(this.idMailSelect),
					);
					if (!response || !response.state) {
						this.$router.push({ path: "./" });
						return;
					}
					this.mailTemplate = response.data;
					this.receiveUsers = this.mailTemplate.receiverDefault
						? JSON.parse(this.mailTemplate.receiverDefault)
						: [];
					this.ccUsers = this.mailTemplate.ccerDefault
						? JSON.parse(this.mailTemplate.ccerDefault)
						: [];
					// if (this.mailTemplate.pathFile)
					// 	this.fileUploadInfo = {
					// 		name: this.mailTemplate.pathFile,
					// 	};	fake file ????nh k??m
				} catch (error) {
					this.$router.push({ path: "./" });
				}
				this.getAllAttachmentFile();
			}
			this.getAllUser();
		},
		async getAllAttachmentFile() {
			let response;
			try {
				response = await globalService.getData_Async(
					administratorAPI.API_GetAllAttachmentFileByMailTemplateId(
						this.mailTemplate.id,
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
		async getAllUser() {
			try {
				let response = await globalService.getData_Async(
					administratorAPI.API_GetAllUserInfo(),
				);
				if (!response || !response.state) {
					return;
				}
				this.allUser_ = response.data.filter((entry) => {
					return !entry.isDelete && entry.isActive;
				});
				this.receiveUserFilters = this.allUser_;
				this.ccUserFilters = this.allUser_;
				if (this.receiveUsers)
					this.receiveUserFilters = this.filerUser(
						this.receiveUserFilters,
						this.receiveUsers,
					);
				if (this.ccUsers)
					this.ccUserFilters = this.filerUser(
						this.ccUserFilters,
						this.ccUsers,
					);
			} catch (error) {
				this.toastError(error);
			}
		},
		/**
		 * H??m th???c hi???n lo???i b??? c??c ph???n t??? c???a m???ng source m?? ???? t???n t???i ??? m???ng target
		 * @param {*} source: m???ng ngu???n
		 * @param {*} target: m???ng ch???a ph???n t??? c???n lo???i b???
		 */
		filerUser(source = [], target = []) {
			return source.filter(
				(ele) => !target.some((ele1) => ele.id == ele1.id),
			);
		},
		async handleButtonClick(event) {
			await event();
		},
		// async handleFile(event) {
		// 	if (event) {
		// 		this.fileUploadInfo = event;
		// 		this.mailTemplate.pathFile = this.fileUploadInfo.name
		// 			? this.fileUploadInfo.name
		// 			: "";
		// 	}
		// 	// if (!event) {
		// 	// 	return;
		// 	// }
		// 	// let canUpload = true;
		// 	// if (!this.templateForm.id) {
		// 	// 	canUpload = await this.save();
		// 	// }
		// 	// if (!canUpload) {
		// 	// 	return;
		// 	// }
		// 	// let response;
		// 	// try {
		// 	// 	response = await globalService.upload_Async(
		// 	// 		administratorAPI.API_UploadTemplateFileCloud(
		// 	// 			this.templateForm.id,
		// 	// 		),
		// 	// 		event,
		// 	// 	);
		// 	// 	if (!response) {
		// 	// 		this.toastError(response);
		// 	// 		return;
		// 	// 	}
		// 	// 	if (!response.state) {
		// 	// 		this.toastError(response.messgage);
		// 	// 		return;
		// 	// 	}
		// 	// 	if (!this.templateForm.attachmentFileDTOS) {
		// 	// 		this.templateForm.attachmentFileDTOS = [];
		// 	// 	}
		// 	// 	this.templateForm.attachmentFileDTOS.push(response.data);
		// 	// } catch (error) {
		// 	// 	this.toastError(error);
		// 	// }
		// },
		async save() {
			this.mailTemplate.mailTemplateName =
				this.mailTemplate.mailTemplateName.trim();
			this.mailTemplate.subject = this.mailTemplate.subject.trim();
			// this.receiveUsers = this.receiveUsers.trim();

			if (!this.validRequiredText(this.mailTemplate.mailTemplateName)) {
				return this.toastError(this.$t("message.empty_templateName"));
			}
			this.stringArray = this.receiveUsers.filter(function (e) {
				return typeof e == "string";
			});
			for (let i = 0; i < this.stringArray.length; i++) {
				if (!this.regex.test(this.stringArray[i])) {
					return this.toastError(
						this.$t("message.incorrect_mailTemplateReceive"),
					);
				}
			}
			// console.log(this.isEmailAccepted);
			// if (this.isEmailAccepted == false) {
			// 	this.isEmailAccepted = true;
			// 	return this.toastError(
			// 		this.$t("message.incorrect_mailTemplateReceive"),
			// 	);
			// }

			if (this.isEmailAccepted == false) {
				this.isEmailAccepted = true;
				return this.toastError(
					this.$t("message.incorrect_mailTemplateReceive"),
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
			this.mailTemplate.content = this.mailTemplate.content.trim();
			// if (!this.validRequiredText(this.receiveUsers)) {
			// 	return this.toastError(
			// 		this.$t("message.empty_mail_template_receive"),
			// 	);
			// }

			this.mailTemplate.modified = this.getUserInfo();
			this.mailTemplate.modifiedDate = new Date();
			this.mailTemplate.modifiedName = this.getUserInfo().fullName;
			this.mailTemplate.contentFile =
				(this.mailTemplate.content ? this.mailTemplate.content : "") +
				(this.mailTemplate.footer ? this.mailTemplate.footer : "");
			this.mailTemplate.receiverDefault = JSON.stringify(
				this.receiveUsers,
				// this.receiveUsers.map((ele) => {
				// 	if (typeof ele == "object") return ele.email;
				// 	else return ele;
				// }),
			);
			this.mailTemplate.ccerDefault = JSON.stringify(
				this.ccUsers,
				// this.ccUsers.map((ele) => {
				// 	if (typeof ele == "object") return ele.email;
				// 	else return ele;
				// }),
			);
			if (!this.mailTemplate.id) {
				this.mailTemplate.created = this.getUserInfo();
				this.mailTemplate.createdDate = new Date();
				this.mailTemplate.createdName = this.getUserInfo().fullName;
			}
			let response;
			try {
				if (!this.mailTemplate.id) {
					response = await globalService.postData_Async(
						administratorAPI.API_CreateMailTemplate(),
						this.mailTemplate,
					);
				} else {
					response = await globalService.putData_Async(
						administratorAPI.API_SaveMailTemplate(
							this.mailTemplate.id,
						),
						this.mailTemplate,
					);
				}
				if (!response) {
					this.toastError(response);
					return false;
				}
				if (!response.state) {
					this.toastError(response.message);
					return false;
				}

				// hi???n th??? th??ng b??o
				this.mailTemplate = response.data;
				this.toastSuccess(response.message);

				await this.saveChangeAttachment(); // th???c hi???n l??u th??ng tin thay ?????i c???a file

				this.reloadList();
				this.close();
				return true;
			} catch (error) {
				this.toastError(error);
				return false;
			}
		},
		async cancel() {
			// h???y b??? c??c thao t??c li??n quan ?????n file + ????ng m??n h??nh v??? m??n danh s??ch
			if (this.attachmentFileListSave) {
				for (let attachmentFile of this.attachmentFileListSave) {
					let response = await globalService.deleteData_Async(
						administratorAPI.API_DeleteAttachmentFile(
							attachmentFile.id,
						),
					);
					if (!response) {
						this.toastError(response);
						return;
					}
					if (!response.state) {
						this.toastError(response.messgage);
						return;
					}
				}
			}
			this.close();
			// this.$router.push({ path: "/quan-tri/email" });
		},
		async delete() {
			let response;
			try {
				response = await globalService.deleteData_Async(
					administratorAPI.API_DeleteTemplateForm(
						this.templateForm.id,
					),
				);
				if (!response) {
					this.toastError(response);
					return;
				}
				if (!response.state) {
					this.toastError(response.messgage);
					return;
				}
				this.$router.push({ path: "." });
			} catch (error) {
				this.toastError(error);
			}
		},
		back() {
			this.$router.push({ path: "./" });
		},
		appendItem() {
			this.creating = true;
			this.editing = null;
			this.mapping = { name: "", valueBinding: "" };
		},
		add() {
			let temp = [];
			try {
				temp = JSON.parse(this.templateForm.mappingInfo);
			} catch (error) {
				temp = [];
			}
			temp.push(this.mapping);
			this.templateForm.mappingInfo = JSON.stringify(temp);
			this.mapping = { name: "", valueBinding: "" };
		},
		edit(item) {
			this.editing = item;
			this.mapping = item;
			this.creating = false;
		},
		update() {
			this.templateForm.mappingInfo = JSON.stringify(this.items);
			this.creating = false;
			this.editing = null;
		},

		/**
		 * @return {Array}
		 */
		_items() {
			try {
				return JSON.parse(this.templateForm.mappingInfo);
			} catch (error) {
				return [];
			}
		},
		deleteItem(item) {
			let items = this._items();
			let index = items.indexOf(item);
			items.splice(index, 1);
			this.templateForm.mappingInfo = JSON.stringify(items);
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

		// file ????nh k??m
		async handleFile(event) {
			if (!this.checkFileSize(event.size))
				return this.toastError(this.$t("error.maxFileSize"));
			if (!event) {
				return;
			}
			let ext = event.name.split(".").pop();
			let arr = ["docx", "pdf", "xlsx", "pptx"];
			if (!arr.includes(ext)) {
				return this.toastError(this.$t("error.extFile"));
			}
			let response;
			try {
				response = await globalService.upload_Async(
					administratorAPI.API_UploadMailTemplateCloud(
						this.current_userInfo.id,
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
				this.attachmentFileListSave.push(attachmentFile);
				this.attachmentFileList.push(attachmentFile);
				this.fileInfo = null;
				// attachmentFile.requestData = null;
				// attachmentFile.mailTemplate = {
				// 	id: this.mailTemplate.id,
				// };
				// response = await globalService.putData_Async(
				// 	administratorAPI.API_UpdateAttachmentFile(
				// 		attachmentFile.id,
				// 	),
				// 	attachmentFile,
				// );
				//this.fileUploadInfo = [];
				//this.getAllAttachmentFile();
				this.sizeOfFile += event.size;
			} catch (error) {
				this.toastError(error);
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
			this.sizeOfFile -= itemAttachmentDelete.fileSize;
		},
		deleteFile(item) {
			this.attachmentFileListDelete.push(item);
			this.attachmentFileList.splice(
				this.attachmentFileList.indexOf(item),
				1,
			);
			this.attachmentFileListSave.splice(
				this.attachmentFileListSave.indexOf(item),
				1,
			);
			this.sizeOfFile -= item.fileSize;
		},
		async saveChangeAttachment() {
			// th???c hi???n l??u c??c thay ?????i v??? file
			if (this.attachmentFileListSave) {
				this.attachmentFileListSave = this.attachmentFileListSave.map(
					(ele) => {
						ele.mailTemplate = {
							id: this.mailTemplate.id,
						};
						return ele;
					},
				);
				for (let attachment of this.attachmentFileListSave) {
					let response = await globalService.putData_Async(
						administratorAPI.API_UpdateAttachmentFile(
							attachment.id,
						),
						attachment,
					);
					if (!response) {
						this.toastError(response);
					}
					if (!response.state) {
						this.toastError(response.message);
					}
				}
			}
			if (this.attachmentFileListDelete) {
				this.attachmentFileListDelete.forEach((ele) => {
					this.deleteAttachmentFile(ele);
				});
			}
			this.attachmentFileListSave = [];
			this.attachmentFileListDelete = [];
		},

		// popup
		onCloseReceiveUser() {
			this.openSelectionReceiveUser = false;
		},
		onOpenReceiveUser() {
			this.openSelectionReceiveUser = true;
		},
		onSaveReceiveUser(userSelectedList) {
			if (!this.receiveUsers) this.receiveUsers = [];
			this.receiveUsers.push(...userSelectedList);
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
			if (!this.ccUsers) this.ccUsers = [];
			this.ccUsers.push(...userSelectedList);
			if (this.ccUsers)
				this.ccUserFilters = this.filerUser(
					this.ccUserFilters,
					this.ccUsers,
				);
		},
		openPopupSelectionCCUser() {
			this.openSelectionCCUser = true;
		},

		// quay v??? trang list
		gotoList() {
			this.$router.push({ path: "/quan-tri/quy-trinh" });
		},
		close() {
			if (this.idMailSelect) {
				return this.$emit("close", false);
			}
			this.clearData();
			this.$emit("close", false);
		},
		reloadList() {
			this.$emit("load", true);
		},
		clearData() {
			this.templateForm = Object.assign({}, TemplateFormDto);
			this.mailTemplate = Object.assign({}, MailTemplateDto);
			this.receiveUsers = this.mailTemplate.receiverDefault
				? JSON.parse(this.mailTemplate.receiverDefault)
				: [];
			this.ccUsers = this.mailTemplate.ccerDefault
				? JSON.parse(this.mailTemplate.ccerDefault)
				: [];
			this.attachmentFileList = [];
			this.attachmentFileListSave = [];
			this.attachmentFileListDelete = [];
		},
		checkFileSize(fileSize) {
			return this.maxSizeOfFile >= this.sizeOfFile + fileSize;
		},
	},
};
</script>

<style lang="scss">
.table_tiptap > table > tbody > tr > td {
	padding: 10px 16px;
	border: 1px solid rgb(43, 42, 42);
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
.table_tiptap > table {
	width: 100%;
}
</style>
