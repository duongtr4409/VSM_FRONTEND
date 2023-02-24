<template>
	<v-card elevation="0">
		<v-toolbar elevation="0" class="grey lighten-4 max-h-[2.5rem]">
			<v-spacer></v-spacer>
			<v-btn icon @click="close" class="mb-5">
				<v-icon>mdi-close</v-icon>
			</v-btn>
		</v-toolbar>
		<vue-perfect-scrollbar class="h-[70vh] px-3">
			<v-card-text>
				<v-row :class="getClass_border_requestGroup()">
					<v-col cols="12">
						<div class="flex items-center justify-between">
							<h2 class="font-bold text-xl">
								{{ $t("label.request_group") }}
							</h2>
							<v-spacer></v-spacer>
							<div>
								<v-text-field
									v-if="!requestGroup"
									v-model="search_request_group"
									append-icon="mdi-magnify"
									hide-details
									outlined
									dense
									single-line
									rounded
									maxLength="255"
									@keyup="findRequestGroup()"
								></v-text-field>
							</div>
						</div>
						<v-divider class="mt-1"></v-divider>
					</v-col>
					<div v-if="noResult" class="text-center">
						{{ $t("message.no_data") }}
					</div>

					<div
						v-for="(item, index) in requestGroups"
						:key="index"
						:hidden="toggle[index]"
						class="w-full px-4"
					>
						<div class="flex items-center justify-between">
							<div
								class="flex gap-4 items-center cursor-pointer"
								@click="selectRequestGroup(item, index)"
							>
								<img
									src="/img/backgrounds/VRE.jpg"
									alt=""
									style="
										width: 4rem;
										height: 4rem;
										object-fit: contain;
									"
								/>
								<div class="flex flex-col">
									<span class="text-lg font-medium">
										{{ item.requestGroupName }}
									</span>
									<span class="text-opacity-90">
										{{ item.description }}
									</span>
									<div
										class="
											flex
											items-center
											justify-between
										"
										v-if="request"
									>
										<span class="text-base font-medium">{{
											request.requestName
										}}</span>
										<span class="text-sm text-opacity-90">{{
											request.description
										}}</span>
										<v-btn
											v-if="request"
											elevation="0"
											class="rounded-pill left-9"
											color="red darken-1"
											icon
											@click="
												deleteRequestTypeSeleted(
													item,
													index,
												)
											"
										>
											<v-icon>mdi-close-circle</v-icon>
										</v-btn>
									</div>
								</div>
							</div>
							<v-btn
								v-if="requestGroup"
								elevation="0"
								class="rounded-pill bottom-5"
								color="red darken-1"
								icon
								@click="deleteRequestGroupSeleted(item, index)"
							>
								<v-icon>mdi-close-circle</v-icon>
							</v-btn>
						</div>

						<v-divider class="mt-1"></v-divider>
					</div>
				</v-row>
				<v-row
					v-if="requestGroup && !request"
					:class="getClass_border_requestType()"
				>
					<v-col cols="12" class="mb-[-0.5rem]">
						<div class="flex items-center justify-between">
							<h2 class="font-bold text-xl">
								{{ $t("label.type_group") }}
							</h2>
							<v-spacer></v-spacer>
							<div>
								<v-text-field
									v-if="!request"
									v-model="search_request_type"
									append-icon="mdi-magnify"
									outlined
									hide-details
									dense
									maxLength="255"
									rounded
									single-line
									@keyup="findRequestType()"
								></v-text-field>
							</div>
						</div>
						<v-divider class="mt-1"></v-divider>
					</v-col>
					<div v-if="noRequestResult" class="text-center">
						{{ $t("message.no_data") }}
					</div>
					<div
						v-for="(item, index) in requestTypes"
						:key="index"
						:hidden="toggle_request_type[index]"
						class="w-full px-4"
					>
						<div class="flex items-center justify-between">
							<div
								class="flex gap-4 items-center cursor-pointer"
								@click="selectRequestType(item, index)"
							>
								<img
									src="/img/backgrounds/VRE.jpg"
									alt=""
									style="
										width: 4rem;
										height: 4rem;
										object-fit: contain;
									"
								/>
								<div class="flex flex-col">
									<span class="text-lg font-medium">{{
										item.requestName
									}}</span>
									<span class="text-opacity-90">{{
										item.description
									}}</span>
								</div>
							</div>
							<v-btn
								v-if="request"
								elevation="0"
								class="rounded-pill"
								color="red darken-1"
								icon
								@click="deleteRequestTypeSeleted(item, index)"
							>
								<v-icon>mdi-close-circle</v-icon>
							</v-btn>
						</div>
						<v-divider></v-divider>
					</div>
				</v-row>
				<v-row v-if="request">
					<v-col cols="12">
						<p class="text-xl font-medium p-0">
							{{ $t("label.information") }}
						</p>
						<v-text-field
							maxLength="255"
							required
							outlined
							hide-details
							dense
							v-model="m_requestDataDto.title"
						>
							<template v-slot:label>
								{{ $t("label.mail_template_subject") }}
								<span class="text-red-600">{{
									$t("label.star")
								}}</span>
							</template>
						</v-text-field>

						<div class="flex" v-if="!isCvanTtrinh">
							<v-radio-group v-model="radios" mandatory row>
								<v-radio
									label="Ký số"
									value="Ký số"
									@click="radios1"
								></v-radio>
								<v-radio
									label="Ký tươi"
									value="Ký tươi"
									@click="radios2"
								></v-radio>
							</v-radio-group>
						</div>
						<!-- <v-textarea
							maxLength="500"
							label="Mô tả"
							outlined
							v-model="m_requestDataDto.description"
						></v-textarea> -->
						<tiptap-vuetify
							v-model="m_requestDataDto.description"
							:extensions="extensions"
							:placeholder="$t('label.description') + '...'"
							min-height="150"
							class="mb-4 mt-2"
						/>
						<!-- <div :v-html="m_requestDataDto.description">
						</div> -->
						<v-combobox
							maxLength="255"
							label="Biểu mẫu"
							outlined
							dense
							v-model="listAttachmentFlieByRequest"
							:items="listAttachmentFlieByRequestAll"
							item-text="templateFormName"
							chips
							clearable
							multiple
							><template
								v-slot:selection="{
									attrs,
									item,
									parent,
									selected,
								}"
							>
								<v-chip
									v-if="item === Object(item)"
									v-bind="attrs"
									:input-value="selected"
									label
									class="mt-2 rounded-pill"
								>
									<v-avatar color="red mr-2" size="26">
										<span class="white--text">
											{{
												getAvatarText(
													item.templateFormName,
													2,
												)
											}}
										</span>
									</v-avatar>
									<span class="pr-2">
										{{ item.templateFormName }}
									</span>
									<v-icon
										small
										@click="parent.selectItem(item)"
									>
									</v-icon>
								</v-chip>
							</template>
						</v-combobox>
						<v-combobox
							maxLength="255"
							:label="$t('label.application_process')"
							outlined
							hide-details
							dense
							height="45px"
							v-model="listProcessInfos"
							:items="request.processInfos"
							item-text="processName"
							clearable
						>
							<template v-slot:label>
								{{ $t("label.application_process") }}
								<span class="text-red-600">{{
									$t("label.star")
								}}</span>
							</template>
							<template
								v-slot:selection="{
									attrs,
									item,
									parent,
									selected,
								}"
							>
								<v-chip
									v-if="item === Object(item)"
									v-bind="attrs"
									:input-value="selected"
									label
									class="mt-2 rounded-pill"
								>
									<span class="text-black">
										{{ item.processName }}
									</span>
									<v-icon
										small
										@click="parent.selectItem(item)"
									>
									</v-icon>
								</v-chip>
							</template>
						</v-combobox>
					</v-col>
				</v-row>
			</v-card-text>
		</vue-perfect-scrollbar>
		<v-card-actions>
			<v-spacer></v-spacer>
			<v-btn
				v-if="request"
				color="blue darken-2"
				class="rounded-0"
				dark
				elevation="0"
				@click="saveRequetsData"
			>
				{{ $t("button.ok") }}
			</v-btn>
			<v-btn
				color="grey lighten-4"
				class="rounded-0"
				@click="close"
				elevation="0"
			>
				{{ $t("button.close") }}
			</v-btn>
		</v-card-actions>
	</v-card>
</template>

<script>
import RequestFormDataDto from "@/models/form-data.dto";
import ProcessDataDTO from "@/models/process-data.dto";
import RequestDataDto from "@/models/request-data.dto";
import StepDataDto from "@/models/step-data.dto";
import globalService from "@/services/global.service";
import administratorAPI from "../../administrator/administrator.api";
import ReqDataProcessHisDto from "@/models/req-data-process-his.dto";
import ManageStampInfoDto from "@/models/manage-stamp-info.dto";
import SignDataDto from "@/models/sign-data.dto";
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
import FieldData from "@/models/field-data.dto";
import moment from "moment";
export default {
	name: "NewRequestGroupVue",
	components: {
		TiptapVuetify,
	},
	props: { isCreating: Boolean },
	watch: {
		isCreating(value) {
			this.isCreate = value;
			if (this.isCreate) {
				this.initialize();
				this.listrequest = [];
				this.groupId = [];
			}
			this.m_requestDataDto.title = "";
			this.m_requestDataDto.description = "";
			this.m_requestDataDto = Object.assign({}, RequestDataDto);
		},
	},
	data() {
		return {
			noRequestResult: false,
			isCreate: false,
			noResult: false,
			requestGroup: null,
			requestGroups: [],
			requestGroupsAll: [],
			toggle: [],
			toggle_request_type: [],
			requestTypes: [],
			requestTypesAll: [],
			requestType: null,
			request: null,
			radios: null,
			radio: 0,
			isCvanTtrinh: false,
			// isCvanDen: false,
			listAttachmentFlieByRequest: [],
			listAttachmentFlieByRequestAll: [],
			user_info: this.getUserInfo(),
			m_requestDataDto: RequestDataDto,
			processDataDTO: ProcessDataDTO,
			stepInProcess: [],
			requestFormDataDto: RequestFormDataDto,
			processData: null,
			fromData: null,
			listProcessInfos: [],
			requestStepData: StepDataDto,
			requestProcessHis: ReqDataProcessHisDto,
			listRequestStepData: [],
			listUserInfos: {},
			manageStampInfoDto: ManageStampInfoDto,
			signDataDto: SignDataDto,
			search_request_group: "",
			search_request_type: "",
			listAttachmentFlieRequest: [],
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
				// Link,
				Code,
				HorizontalRule,
				Paragraph,
				HardBreak, // line break on Shift + Ctrl + Enter
			],
			listrequest: [],
			fieldInForm: null,
			fieldData: FieldData,
			groupId: [],
			isCVD: this.$t("enum.CVD"),
			fieldDataAll: [],
		};
	},

	mounted() {
		this.initialize();
		this.isCreate = this.isCreating;
	},
	destroyed() {
		this.deleteRequestTypeSeleted();
		this.deleteRequestGroupSeleted();
		// this.m_requestDataDto = Object.assign({}, this.RequestDataDto);
		this.radios = this.radios1;
		this.isCvanTtrinh = false;
		// this.isCvanDen = false;
		this.listAttachmentFlieByRequest = [];
		this.listAttachmentFlieByRequestAll = [];
		this.m_requestDataDto = Object.assign({}, RequestDataDto);
		this.processDataDTO = Object.assign({}, ProcessDataDTO);
		this.stepInProcess = [];
		this.requestFormDataDto = Object.assign({}, RequestFormDataDto);
		this.processData = null;
		this.fromData = null;
		this.listProcessInfos = [];
		this.requestStepData = Object.assign({}, StepDataDto);
		this.requestProcessHis = Object.assign({}, ReqDataProcessHisDto);
		this.listRequestStepData = [];
		this.manageStampInfoDto = Object.assign({}, ManageStampInfoDto);
		this.signDataDto = Object.assign({}, SignDataDto);
		this.search_request_group = "";
		this.search_request_type = "";

		this.listAttachmentFlieRequest = [];
		this.fieldInForm = null;
		this.fieldData = Object.assign({}, FieldData);
	},
	methods: {
		async initialize() {
			this.m_requestDataDto.title = "";
			this.m_requestDataDto.description = "";
			this.m_requestDataDto = Object.assign({}, RequestDataDto);
			await this._requestGroups();
			// this._request();
		},
		async _requestGroups() {
			let response;
			try {
				response = await globalService.getData_Async(
					administratorAPI.API_GetAllRequestGroupOfUser(),
				);
				if (!response || !response.state) {
					this.toastError(this.$t("error.invalid_role"));
					return;
				}
				if (response.data.length < 1) {
					this.toastError(this.$t("error.invalid_role"));
					return;
				}
				this.requestGroups = response.data
					.filter((entry) => {
						return !entry.isDelete && entry.isActive;
					})
					.sort(function (a, b) {
						return (
							moment(a?.modifiedDate).toDate().getTime() -
							moment(b?.modifiedDate).toDate().getTime()
						);
					});
				this.requestGroupsAll = this.requestGroups;
				for (let i in this.requestGroups) {
					this.toggle[i] = false;
				}
			} catch (error) {
				this.toastError(error);
				return;
			}
		},
		// async _requestTypes() {
		// 	let response;
		// 	try {
		// 		response = await globalService.getData_Async(
		// 			administratorAPI.API_GetAllRequestIgnoreFile(
		// 				this.requestGroup.id,
		// 			),
		// 		);
		// 		if (!response || !response.state) {
		// 			return [];
		// 		}

		// 		this.requestTypes = response.data.filter((entry) => {
		// 			return !entry.isDelete;
		// 		});
		// 		this.requestTypesAll = this.requestTypes;
		// 		for (let i = 0; i < this.requestTypes.length; i++) {
		// 			this.toggle_request_type.push(false);
		// 		}
		// 	} catch (error) {
		// 		this.toastError(error);
		// 		return [];
		// 	}
		// },
		async _request() {
			try {
				let response = await globalService.getData_Async(
					administratorAPI.API_GetAllRequestIgnoreFile(),
				);
				if (!response || !response.state) {
					return this.toastError(this.$t("error.load"));
				}
				this.listrequest = response.data.filter((entry) => {
					return !entry.isDelete && entry.isActive;
				});
			} catch (error) {
				this.toastError(error);
				return null;
			}
		},
		clearRequestGroup() {
			this.requestType = null;
			this.requestTypes = [];
			this.request = null;
		},
		clearForm() {
			this.deleteRequestTypeSeleted();
			this.deleteRequestGroupSeleted();
			// this.m_requestDataDto = Object.assign({}, this.RequestDataDto);
			this.radios = this.radios1;
			this.isCvanTtrinh = false;
			// this.isCvanDen = false;
			this.listAttachmentFlieByRequest = [];
			this.listAttachmentFlieByRequestAll = [];
			this.m_requestDataDto = Object.assign({}, RequestDataDto);
			this.processDataDTO = Object.assign({}, ProcessDataDTO);
			this.stepInProcess = [];
			this.requestFormDataDto = Object.assign({}, RequestFormDataDto);
			this.processData = null;
			this.fromData = null;
			this.listProcessInfos = [];
			this.requestStepData = Object.assign({}, StepDataDto);
			this.requestProcessHis = Object.assign({}, ReqDataProcessHisDto);
			this.listRequestStepData = [];
			this.manageStampInfoDto = Object.assign({}, ManageStampInfoDto);
			this.signDataDto = Object.assign({}, SignDataDto);
			this.search_request_group = "";
			this.search_request_type = "";

			this.listAttachmentFlieRequest = [];
			this.fieldInForm = null;
			this.fieldData = Object.assign({}, FieldData);
			this.m_requestDataDto.title = "";
			this.m_requestDataDto = Object.assign({}, RequestDataDto);
			this.request = null;
			this.requestGroup = null;
			for (let i in this.requestGroups) {
				this.toggle[i] = false;
			}
		},
		async getListTemplateForms() {
			if (this.request && this.request.templateForms) {
				this.listAttachmentFlieByRequest = [
					...this.request.templateForms,
				];
				this.listAttachmentFlieByRequestAll = [
					...this.request.templateForms,
				];
				if (this.requestGroup.requestGroupName.includes(this.isCVD)) {
					this.listAttachmentFlieByRequest = [];
				}
			}
		},
		async getAttachmentFileRequest() {
			this.listAttachmentFlieRequest = [];
			for (let templateForm of this.listAttachmentFlieByRequest) {
				let response;

				response = await globalService.getData_Async(
					administratorAPI.API_GetAllAttachmentFileByTemplateFormId(
						templateForm.id,
					),
				);
				if (!response || !response.state) {
					return [];
				}
				let listAttachmentTempLate = response.data.filter(
					(ele) => !ele.requestData,
				);
				this.listAttachmentFlieRequest.push(...listAttachmentTempLate);
			}
		},

		deselectTemplateForm(item) {
			this.listAttachmentFlieByRequest.splice(
				this.listAttachmentFlieByRequest.indexOf(item),
				1,
			);
		},
		async saveRequetsData() {
			if (!this.request) return;

			let response;
			if (this.isSaving) {
				return;
			}
			await this.getAttachmentFileRequest();
			try {
				this.m_requestDataDto.title =
					this.m_requestDataDto.title?.trim();
				if (!this.validRequiredText(this.m_requestDataDto.title)) {
					return this.toastError(this.$t("message.empty_title"));
				}
				if (!this.listProcessInfos) {
					return this.toastError(this.$t("label.no_process"));
				}
				this.m_requestDataDto.description = this.m_requestDataDto
					.description
					? this.m_requestDataDto.description.trim()
					: "";
				this.m_requestDataDto.modified = { id: this.user_info.id };
				this.m_requestDataDto.modifiedName = new Date();
				this.m_requestDataDto.modifiedDate = new Date();
				this.m_requestDataDto.requestDataName =
					this.request.requestName;
				this.m_requestDataDto.requestDataCode =
					this.request.requestCode;
				this.m_requestDataDto.request = { id: this.request.id };
				this.m_requestDataDto.created = this.user_info;
				this.m_requestDataDto.createdName = this.user_info.fullName;
				this.m_requestDataDto.createdDate = new Date();
				this.m_requestDataDto.createdOrgName =
					this.user_info.organizations
						?.map((ele) => ele.organizationName)
						?.join(", ");
				this.m_requestDataDto.createdRankName = this.userInfo.ranks
					?.map((ele) => ele.rankName)
					?.join(", ");
				// lay api all status
				this.m_requestDataDto.statusName = this.$t("label.drafting");
				this.m_requestDataDto.status = { id: 1 };
				this.m_requestDataDto.plotOfLandNumber = null;
				//this.m_requestDataDto.userInfos = this.listUserInfo;
				this.m_requestDataDto.requestGroupCode =
					this.request.requestGroup.requestGroupCode;
				this.m_requestDataDto.requestGroupName =
					this.request.requestGroup.requestGroupName;
				this.m_requestDataDto.requestTypeCode =
					this.request.requestType.requestTypeCode;
				this.m_requestDataDto.requestTypeName =
					this.request.requestType.requestTypeName;
				this.m_requestDataDto.sapMapping = this.request.sapMapping;
				this.m_requestDataDto.signTypeName = this.radios;
				this.m_requestDataDto.signTypeCode = this.radio;
				this.m_requestDataDto.attachmentFileList =
					this.listAttachmentFlieRequest;
				this.m_requestDataDto.currentRound = 1;
				this.m_requestDataDto.requestGroup = {
					id: this.request.requestGroup.id,
				};
				this.m_requestDataDto.requestType = {
					id: this.request.requestType.id,
				};
				this.m_requestDataDto.sapMapping = this.request?.sapMapping;
				// if (this.isCvanDen) {
				// 	this.m_requestDataDto.statusName = this.$t(
				// 		"status.need_process",
				// 	);
				// 	this.m_requestDataDto.status = { id: 2 };
				// }
				this.m_requestDataDto.dataRoomDriveId =
					this.request?.dataRoomDriveId;
				this.m_requestDataDto.dataRoomId = this.request?.dataRoomId;
				this.m_requestDataDto.dataRoomPath = this.request?.dataRoomPath;
				this.m_requestDataDto.ruleGenerateAttachName =
					this.request?.ruleGenerateAttachName;
				if (this.isCvanTtrinh) {
					this.radio = null;
					this.m_requestDataDto.signTypeCode = null;
					this.m_requestDataDto.signTypeName = null;
				}
				response = await globalService.postData_Async(
					administratorAPI.API_CreateRequestData(),
					this.m_requestDataDto,
				);

				if (!response || !response.state) {
					this.toastError(this.$t("message.add_error"));

					return (this.isSaving = false);
				}

				this.requestData = response.data;
				await this.saveProcessDataV2();
				await this.saveFormData();
				await this.getFieldInForm();
				await this.saveFieldData();
				await this.saveStepData();
				await this.saveReqdataProcessHis();
				if (!this.isCvanTtrinh) {
					await this.createManageStampInfo();
					await this.createSignData();
				}
				this.$emit("close", true);
				this.toastSuccess(this.$t("message.add_success"));
				this.clearForm();
				this.m_requestDataDto.description = "";
				this.m_requestDataDto.title = "";
				location.href = `/phieu-yeu-cau/${this.requestData?.id}/chi-tiet`;
			} catch (error) {
				this.toastError(error);
			} finally {
				// this.m_requestDataDto.title = "";
				// this.m_requestDataDto = Object.assign({}, RequestDataDto);
				// this.request = null;
				// this.requestGroup = null;
				// for (let i in this.requestGroups) {
				// 	this.toggle[i] = false;
				// }
			}
		},
		async getStepInProcesses(item) {
			let response;
			try {
				response = await globalService.getData_Async(
					administratorAPI.API_FindStepInProcessesByID(item),
				);
				if (!response || !response.state) {
					return;
				}
				this.stepInProcess = response.data.sort((a, b) => {
					return a.stepOrder - b.stepOrder;
				});
			} catch (error) {
				this.toastError(error);
				return;
			}
		},

		async saveProcessDataV2() {
			let response;
			this.processDataDTO.created = {
				id: this.user_info.id,
			};

			this.processDataDTO.createdDate = new Date();
			this.processDataDTO.isActive = this.listProcessInfos.isActive;
			this.processDataDTO.isDelete = this.listProcessInfos.isDelete;

			this.processDataDTO.modified = {
				id: this.user_info.id,
			};

			this.processDataDTO.modifiedDate =
				this.listProcessInfos.modifiedDate;
			this.processDataDTO.modifiedName =
				this.listProcessInfos.modifiedName;
			this.processDataDTO.processDataCode =
				this.listProcessInfos.processCode;
			this.processDataDTO.processDataName =
				this.listProcessInfos.processName;
			this.processDataDTO.roundNumber = 1;
			this.processDataDTO.requestData = { id: this.requestData?.id };
			response = await globalService.postData_Async(
				administratorAPI.API_CreateProcessData(),
				this.processDataDTO,
			);
			if (!response || !response.state) {
				{
					return;
				}
			}
			this.processData = response.data;
			await this.getStepInProcesses(this.listProcessInfos.id);
		},
		async saveFormData() {
			if (this.request.form == null) {
				return;
			}
			this.requestFormDataDto.option = this.request.form.option;
			this.requestFormDataDto.formDataCode =
				this.request.form.formDataCode;
			this.requestFormDataDto.formDateName =
				this.request.form.formDateName;
			// this.requestFormDataDto.objectSchema =
			// 	this.request.form.objectSchema;
			// this.requestFormDataDto.objectSchema =
			// 	this.request.form.objectSchema;

			// this.requestFormDataDto.objectSchema = JSON.stringify(
			// 	await this.getFieldInForm(),
			// );

			this.requestFormDataDto.objectModel = this.request.form.objectModel
				? this.request.form.objectModel
				: "{}";
			this.requestFormDataDto.createdName = this.request.form.createdName;
			this.requestFormDataDto.createdDate = new Date();
			this.requestFormDataDto.modifiedName =
				this.request.form.modifiedName;
			this.requestFormDataDto.modifiedDate =
				this.request.form.modifiedDate;
			this.requestFormDataDto.isActive = this.request.form.isActive;
			this.requestFormDataDto.isDelete = this.request.form.isDelete;
			this.requestFormDataDto.tennantCode = this.request.form.tennantCode;
			this.requestFormDataDto.tennantName = this.request.form.tennantName;
			this.requestFormDataDto.created = {
				id: this.user_info.id,
			};
			this.requestFormDataDto.modified = {
				id: this.user_info.id,
			};

			this.requestFormDataDto.requestData = {
				id: this.requestData?.id,
			};
			this.requestFormDataDto.form = { id: this.request.form.id };
			let response = await globalService.postData_Async(
				administratorAPI.API_CreateFormData(),
				this.requestFormDataDto,
			);
			if (!response || !response.state) {
				return;
			}
			this.fromData = response.data;
		},
		async saveStepData() {
			for (let stepInProces of this.stepInProcess) {
				this.requestStepData.isActive = false;
				if (this.requestData.requestGroupName.includes(this.isCVD)) {
					this.requestStepData.isActive = true;
				}
				this.requestStepData.created = { id: this.user_info.id };
				this.requestStepData.createdOrgName =
					this.user_info?.organizations
						?.map((ele) => ele.organizationName)
						?.join(", ");
				this.requestStepData.createdRankName = this.user_info.ranks
					?.map((ele) => ele.rankName)
					?.join(", ");
				this.requestStepData.step = { id: stepInProces.step?.id };
				this.requestStepData.processData = {
					id: this.processData?.id,
				};
				this.requestStepData.requestData = {
					id: this.requestData?.id,
				};
				this.requestStepData.stepInProcess = { id: stepInProces.id };
				// this.requestStepData = [...stepInProces];
				this.requestStepData.stepOrder = stepInProces.stepOrder;
				this.requestStepData.stepDataCode =
					stepInProces.stepInProcessCode;
				this.requestStepData.stepDataName =
					stepInProces.stepInProcessName;
				this.requestStepData.processingTerm =
					stepInProces.processingTerm;
				this.requestStepData.precessingTermTime =
					stepInProces.precessingTermTime;
				this.requestStepData.isRequiredSignature =
					stepInProces.isRequiredSignature;
				this.requestStepData.isBack = stepInProces.isBack;
				this.requestStepData.isAuthorizedApproval =
					stepInProces.isAuthorizedApproval;
				this.requestStepData.isExamine = stepInProces.isExamine;
				this.requestStepData.isEdit = stepInProces.isEdit;
				this.requestStepData.isRequestModify =
					stepInProces.isRequestModify;
				this.requestStepData.isSendMail = stepInProces.isSendMail;
				this.requestStepData.isProcessRecover =
					stepInProces.isProcessRecover;
				this.requestStepData.isCreateTfsTask =
					stepInProces.isCreateTfsTask;
				this.requestStepData.organizationCode =
					stepInProces.organization?.organizationCode;
				this.requestStepData.organizationName =
					stepInProces.organization?.organizationName;
				this.requestStepData.rankCode = stepInProces.rankCode;
				this.requestStepData.rankName = stepInProces.rankName;
				this.requestStepData.description = stepInProces.description;
				this.requestStepData.createdName = stepInProces.createdName;
				this.requestStepData.createdDate = new Date();
				this.requestStepData.modifiedName = stepInProces.modifiedName;
				this.requestStepData.isDelete = stepInProces.isDelete;
				this.requestStepData.tennantCode = stepInProces.tennantCode;
				this.requestStepData.tennantName = stepInProces.tennantName;
				this.requestStepData.modifiedDate = new Date();
				this.requestStepData.modified = {
					id: this.user_info.id,
				};
				this.requestStepData.optionDeny = stepInProces.optionDeny;
				this.requestStepData.isAddHistory = stepInProces.isAddHistory;
				this.requestStepData.isAddQRCode = stepInProces.isAddQRCode;
				this.requestStepData.isAddWaterMark =
					stepInProces.isAddWaterMark;
				this.requestStepData.isApprove = stepInProces.isApprove;
				this.requestStepData.isAttachFilePDF =
					stepInProces.isAttachFilePDF;
				this.requestStepData.isAuthorizedApproval =
					stepInProces.isAuthorizedApproval;
				this.requestStepData.isAutoSendMail =
					stepInProces.isAutoSendMail;
				this.requestStepData.isChangeStatus =
					stepInProces.isChangeStatus;
				this.requestStepData.isCreateContract =
					stepInProces.isCreateContract;
				this.requestStepData.isCreateOTPLink =
					stepInProces.isCreateOTPLink;
				this.requestStepData.isCreateOfficalDispath =
					stepInProces.isCreateOfficalDispath;
				this.requestStepData.isCreateReport =
					stepInProces.isCreateReport;
				this.requestStepData.isDeny = stepInProces.isDeny;
				this.requestStepData.isExportPDF = stepInProces.isExportPDF;
				this.requestStepData.isManageStamp = stepInProces.isManageStamp;
				this.requestStepData.isRecall = stepInProces.isRecall;
				this.requestStepData.isSaveDoc = stepInProces.isSaveDoc;
				this.requestStepData.isProcessSaveDoc =
					stepInProces.isProcessSaveDoc;
				this.requestStepData.isSendMail = stepInProces.isSendMail;
				this.requestStepData.isSendOTP = stepInProces.isSendOTP;
				this.requestStepData.mailTemplate = stepInProces.mailTemplate;
				this.requestStepData.roundNumber = 1;
				this.requestStepData.isSendMailCustomer =
					stepInProces.isSendMailCustomer;
				// this.requestStepData.mailTemplateCustomer = {
				// 	id: stepInProces.mailTemplateCustomer.id,
				// };
				this.requestStepData.mailTemplateCustomer =
					stepInProces?.mailTemplateCustomer
						? { id: stepInProces.mailTemplateCustomer?.id }
						: null;
				this.requestStepData.isConsult = stepInProces.isConsult;
				this.requestStepData.isSendNoticePriority =
					stepInProces.isSendNoticePriority;
				///////////////////////////////////////////
				this.requestStepData.userInfos =
					stepInProces.userInStepDTOs.map((entry) => {
						return { id: entry.userInfo.id };
					});
				if (this.requestData.requestGroupName.includes(this.isCVD)) {
					this.requestStepData.userInfos.push(this.user_info);
				}

				let response = await globalService.postData_Async(
					administratorAPI.API_CreateStepData(),
					this.requestStepData,
				);

				if (!response || !response.state) {
					return;
				}
				this.listRequestStepData.push(response.data);
			}
			this.toastSuccess(this.$t("message.add_success"));
		},
		radios1() {
			this.radio = 0;
		},
		radios2() {
			this.radio = 1;
		},
		openExit() {
			this.$router.push({
				path: `/phieu-yeu-cau/list-request`,
			});
		},
		close() {
			this.clearForm();
			this.m_requestDataDto.title = "";
			this.m_requestDataDto.description = "";
			this.m_requestDataDto = Object.assign({}, RequestDataDto);
			this.request = null;
			this.requestGroup = null;
			for (let i in this.requestGroups) {
				this.toggle[i] = false;
			}
			this.$emit("close", true);
		},
		async saveReqdataProcessHis() {
			let response;
			try {
				this.requestProcessHis.createDate = new Date();
				this.requestProcessHis.description = this.$t("label.editor");
				this.requestProcessHis.organizationName = null;
				this.requestProcessHis.processDate = new Date();
				this.requestProcessHis.processer = this.user_info;
				this.requestProcessHis.processerName = this.user_info.fullName;
				this.requestProcessHis.rankName = null;
				this.requestProcessHis.requestData = {
					id: this.requestData?.id,
				};
				this.requestProcessHis.status = this.$t("label.drafting");

				this.requestProcessHis.isChild = false;
				// (this.requestProcessHis.stepData =
				// 	this.listRequestStepData.find(
				// 		(e) => e.isActive == true,
				// 	));
				this.requestProcessHis.stepData = null;

				// this.requestProcessHis.tennantCode =;
				// this.requestProcessHis.tennantId =;
				// this.requestProcessHis.tennantName =;

				response = await globalService.postData_Async(
					administratorAPI.API_CreateReqdataProcessHis(),
					this.requestProcessHis,
				);
				if (!response || !response.state) {
					return;
				}
			} catch (error) {
				this.toastError(error);
				return;
			}
		},
		async selectRequestGroup(item, index) {
			let isLoad = false;
			this.groupId.find((entry) => {
				if (entry == item.id) {
					isLoad = true;
				}
			});
			if (!isLoad) {
				let response = await globalService.getData_Async(
					administratorAPI.API_GetRequestByRqGroupIdV2(item.id),
				);
				if (!response || !response.state) return;
				this.listrequest = this.listrequest.concat(response.data);
			}
			this.groupId.push(item.id);

			// if (this.listrequest.length == 0) {
			// 	await this._request();
			// }
			this.requestTypes = [];
			this.isCvanTtrinh = false;
			// this.isCvanDen = false;
			for (let i = 0; i < this.toggle.length; i++) {
				if (i === index) {
					this.toggle[i] = false;
				} else {
					this.toggle[i] = true;
				}
			}
			// this.toggle[index] = true;
			this.requestGroup = item;
			// if (
			// 	this.requestGroup &&
			// 	this.requestGroup.requestGroupName.toLocaleUpperCase() ==
			// 		this.$t("enum.CVD").toLocaleUpperCase()
			// ) {
			// 	this.isCvanDen = true;
			// }
			if (
				this.requestGroup &&
				(this.requestGroup.requestGroupName.toLocaleUpperCase() ==
					this.$t("enum.CVD").toLocaleUpperCase() ||
					this.requestGroup.requestGroupName.toLocaleUpperCase() ==
						this.$t("enum.TT").toLocaleUpperCase())
			) {
				this.isCvanTtrinh = true;
			}
			for (let i = 0; i < this.listrequest.length; i++) {
				this.toggle_request_type.push(false);
			}
			this.listrequest.forEach((element) => {
				if (
					element.requestGroup &&
					element.requestGroup.id == this.requestGroup.id &&
					!element.isDelete
				) {
					return this.requestTypes.push(element);
				}
			});
			this.requestTypesAll = this.requestTypes;

			// await this._request();
		},
		async selectRequestType(item, index) {
			if (this.request) {
				return;
			}
			this.isSaving = false;
			for (let i = 0; i < this.toggle_request_type.length; i++) {
				this.toggle_request_type[i] = i !== index;
			}
			this.toggle_request_type[index] = false;
			//taọ request
			this.request = item;
			console.log("	this.request 1995", this.request);

			if (item.processInfos && item.processInfos.length > 0) {
				this.listProcessInfos = item.processInfos[0];
			} else {
				this.listProcessInfos = [];
			}
			let _template = await globalService.getData_Async(
				administratorAPI.API_GetTemplateByRequestId(this.request.id),
			);
			let _form = await globalService.getData_Async(
				administratorAPI.API_GetFormByRequestId(this.request.id),
			);
			if (!_form || !_form.state) {
				this.request.form = null;
			} else {
				this.request.form = _form.data[0];
			}

			if (!_template || !_template.state) {
				this.request.templateForms = [];
			} else {
				this.request.templateForms = _template.data;
			}
			if (this.request.id && this.requestGroup.id) {
				await this.getListTemplateForms();
				if (this.listProcessInfos.length === 0) {
					this.toastError(
						this.$t(
							"message.this_request_type_is_not_fully_configured",
						),
					);
					this.isSaving = true;
				}
			}
		},

		deleteRequestGroupSeleted() {
			this.requestGroup = null;
			this.requestType = null;
			this.request = null;
			for (let i = 0; i < this.toggle.length; i++) {
				this.toggle[i] = false;
			}
			for (let i = 0; i < this.toggle_request_type.length; i++) {
				this.toggle_request_type[i] = false;
			}
		},
		deleteRequestTypeSeleted() {
			this.request = null;
			for (let i = 0; i < this.toggle_request_type.length; i++) {
				this.toggle_request_type[i] = false;
			}
		},
		async createManageStampInfo() {
			let response;
			this.manageStampInfoDto.requestData = { id: this.requestData?.id };
			response = await globalService.postData_Async(
				administratorAPI.API_createManageStampInfo(),
				this.manageStampInfoDto,
			);
			if (!response || !response.state) {
				return;
			}
		},
		async createSignData() {
			let response;

			this.signDataDto.requestData = { id: this.requestData?.id };
			response = await globalService.postData_Async(
				administratorAPI.API_createSignData(),
				this.signDataDto,
			);

			if (!response || !response.state) {
				return;
			}
		},
		findRequestGroup() {
			this.noResult = false;
			if (this.search_request_group.length > 0) {
				// this.search_request_group = this.search_request_group.trim();
				this.requestGroups = this.requestGroupsAll.filter((entry) => {
					return this.nonAccentVietnamese(entry.requestGroupName)
						.toLocaleUpperCase()
						.includes(
							this.nonAccentVietnamese(this.search_request_group)
								.trim()
								.toLocaleUpperCase(),
						);
				});
				if (this.requestGroups.length == 0) {
					this.noResult = true;
				}
			} else {
				this.requestGroups = this.requestGroupsAll;
				this.noResult = false;
			}
		},
		findRequestType() {
			this.noRequestResult = false;

			if (this.search_request_type.length > 0) {
				this.requestTypes = this.requestTypesAll.filter((entry) => {
					return this.nonAccentVietnamese(entry.requestName)
						.toLocaleUpperCase()
						.includes(
							this.nonAccentVietnamese(this.search_request_type)
								.trim()
								.toLocaleUpperCase(),
						);
				});
				if (this.requestTypes.length == 0) {
					this.noRequestResult = true;
				}
			} else {
				this.requestTypes = this.requestTypesAll;
				this.noRequestResult = false;
			}
		},
		getClass_border_requestGroup() {
			return !this.requestGroup ? " rounded-md border-2" : "";
		},
		getClass_border_requestType() {
			return !this.request ? " rounded-md border-2" : "";
		},
		async getFieldInForm() {
			let response;
			try {
				if (this.request.form) {
					response = await globalService.getData_Async(
						administratorAPI.API_FindFieldInForm(
							this.request.form.id,
						),
					);
					if (!response || !response.state) {
						return [];
					}

					// let data = response.data.filter((entry) => {
					// 	return !entry.isDelete;
					// });
					let data = response.data;
					if (data.length > 0) {
						this.fieldInForm = data.sort(
							(e2, e1) => e2.order - e1.order,
						);
					}
					let objectSchema = { type: "object", properties: {} };
					for (let field of this.fieldInForm) {
						// code mới \\
						let fieldObject = JSON.parse(field.objectSchema);
						// let nameOfField = fieldObject.title.title.trim();
						let fieldId = `${fieldObject.title.id}`.trim();
						if (objectSchema.properties[fieldId]) {
							fieldId = this.getIdFromValue(
								`${fieldObject.title.title}`.trim(),
							);
						}
						let objectShemaOfField = {
							...fieldObject.title,
							"x-cols": fieldObject["x-cols"],
							"x-class": "px-2",
						};
						if (objectShemaOfField.readOnly)
							objectShemaOfField.readOnly = false;

						if (objectSchema.properties[fieldId]) {
							fieldId = fieldId + "1";
						}
						objectSchema.properties[fieldId] = objectShemaOfField;
					}
					// code mới \\
					return objectSchema;
				}
			} catch (error) {
				this.toastError(error);
				return null;
			}
		},
		async saveFieldData() {
			for (const field of this.fieldInForm) {
				this.fieldData = Object.assign({}, FieldData);
				this.fieldData.created = { id: this.user_info.id };
				this.fieldData.createdDate = new Date();
				this.fieldData.modified = null;
				this.fieldData.modifiedDate = new Date();
				this.fieldData.order = field.order;
				this.fieldData.objectSchema = field.objectSchema;
				this.fieldData.nameOfField = field.nameOfField;
				this.fieldData.row = field.row;
				this.fieldData.col = field.col;
				this.fieldData.option = field.option;
				this.fieldData.description = field.description;
				this.fieldData.requestData = { id: this.requestData?.id };
				this.fieldData.fieldDataName = field.nameOfField;
				// this.fieldData.fieldDataCode = this.getIdFromValue(
				// 	field.nameOfField,
				// );
				this.fieldData.fieldDataCode = field.fieldInFormCode;
				this.fieldData.tennantCode = JSON.parse(field.objectSchema)
					.title.Headers
					? "truong_bang"
					: JSON.parse(field.objectSchema).title.upload_ext
					? "truong_file"
					: JSON.parse(field.objectSchema).title.type == "number" &&
					  !JSON.parse(field.objectSchema).title.double
					? "number"
					: JSON.parse(field.objectSchema).title.type == "number" &&
					  JSON.parse(field.objectSchema).title.double
					? "double"
					: JSON.parse(field.objectSchema).title.type == "boolean"
					? "boolean"
					: "";
				this.fieldData.tennantName = JSON.parse(field.objectSchema)
					.title.Headers
					? "truong_bang"
					: JSON.parse(field.objectSchema).title.upload_ext
					? "truong_file"
					: JSON.parse(field.objectSchema).title.type == "number" &&
					  !JSON.parse(field.objectSchema).title.double
					? "number"
					: JSON.parse(field.objectSchema).title.type == "number" &&
					  JSON.parse(field.objectSchema).title.double
					? "double"
					: JSON.parse(field.objectSchema).title.type == "boolean"
					? "boolean"
					: "";
				this.fieldDataAll.push(this.fieldData);

				// let response;
				// response = await globalService.postData_Async(
				// 	administratorAPI.API_CreateFieldData(),
				// 	this.fieldData,
				// );

				// if (!response || !response.state) {
				// 	return;
				// }
			}
			let response;
			response = await globalService.postData_Async(
				administratorAPI.API_CreateAllFieldDataByRequestDataId(),
				this.fieldDataAll,
			);

			if (!response || !response.state) {
				return;
			}
		},
	},
};
</script>

<style lang="scss" scoped>
.v-menu__content {
	min-width: 1094px !important;
}
</style>
