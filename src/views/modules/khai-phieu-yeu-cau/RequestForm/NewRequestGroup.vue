<template>
	<v-card elevation="0">
		<vue-perfect-scrollbar class="h-5/6">
			<v-row class="mt-4">
				<v-col cols="12" md="12" class="px-10">
					<v-card-title>{{$t("label.request_group")}}</v-card-title>
					<v-combobox
						v-model="requestGroup"
						:items="requestGroups"
						item-text="requestGroupName"
						background-color="#fff"
						class="text-red pt-2"
						clearable
						@click:clear="clearRequestGroup()"
						@change="handleRequestGroup($event)"
						:placeholder="$t('label.select_request_group')"
					>
						<template
							v-slot:selection="{ attrs, item, parent, selected }"
						>
							<v-chip
								v-if="item === Object(item)"
								v-bind="attrs"
								:input-value="selected"
								label
								class="ma-2 rounded"
							>
								<span class="text-black">
									{{
													
														item.requestGroupName,

									}}
								</span>

								<span class="pr-2">
									{{ item.fullName }}
								</span>
								<v-icon small @click="parent.selectItem(item)">
								</v-icon>
							</v-chip>
						</template>
					</v-combobox>
				</v-col>
			</v-row>
			<v-row class="mt-4" v-if="requestGroup">
				<v-col cols="12" md="12" class="px-10">
					<v-card-title>{{$t("label.type_group")}} </v-card-title>
					<v-combobox
						v-model="requestType"
						:items="requestTypes"
						item-text="requestTypeName"
						background-color="#fff"
						clearable
						@change="handleRequestTypes($event)"
						@click:clear="clearForm()"
						:placeholder="$t('label.select_request_type')"
					>
						<template
							v-slot:selection="{ attrs, item, parent, selected }"
						>
							<v-chip
								v-if="item === Object(item)"
								v-bind="attrs"
								:input-value="selected"
								label
								class="ma-2 rounded"
							>
								<span class="text-black">
									{{
													
														item.requestTypeName,

									}}
								</span>

								<span class="pr-2">
									{{ item.fullName }}
								</span>
								<v-icon small @click="parent.selectItem(item)">
								</v-icon>
							</v-chip>
						</template>
					</v-combobox>
				</v-col>
			</v-row>
			<v-row class="mt-4" v-if="request">
				<v-col cols="12" md="12" class="px-10">
					<v-card-title> Th??ng tin</v-card-title>
					<v-text-field
						label="Ti??u ????? * "
						required
						outlined
						dense
						v-model="m_requestDataDto.title"
					></v-text-field>
					<div class="flex">
						<v-radio-group v-model="radios" mandatory row>
							<v-radio
								label="K?? s???"
								value="K?? s???"
								@click="radios1"
							></v-radio>
							<v-radio
								label="K?? t????i"
								value="K?? t????i"
								@click="radios2"
							></v-radio>
						</v-radio-group>
					</div>
					<v-textarea
						label="M?? t???"
						outlined
						v-model="m_requestDataDto.description"
					></v-textarea>
					<v-combobox
						label="File m???u"
						outlined
						dense
						v-model="listAttachmentFlieByRequest"
						:items="listAttachmentFlieByRequestAll"
						item-text="fileName"
						chips
						hide-selected
						clearable
						multiple
						><template
							v-slot:selection="{ attrs, item, parent, selected }"
						>
							<v-chip
								v-if="item === Object(item)"
								v-bind="attrs"
								:input-value="selected"
								label
								class="ma-2 rounded-pill"
								close
								@click:close="deselectTemplateForm(item)"
							>
								<v-avatar color="red mr-2" size="30">
									<span class="white--text">
										{{ getAvatarText(item.fileName, 2) }}
									</span>
								</v-avatar>
								<span class="pr-2">
									{{ item.fileName }}
								</span>
								<v-icon small @click="parent.selectItem(item)">
								</v-icon>
							</v-chip>
						</template>
					</v-combobox>
					<v-combobox
						label="Quy tr??nh ??p d???ng"
						outlined
						dense
						v-model="listProcessInfos"
						:items="request.processInfos"
						item-text="processName"
					>
						<template v-slot:selection="{ attrs, item, selected }">
							<v-chip
								v-if="item === Object(item)"
								v-bind="attrs"
								:input-value="selected"
								label
								class="ma-2 rounded-pill"
							>
								<span class="text-black">
									{{
													
														item.processName,

									}}
								</span>
								<!-- 
							<span class="pr-2">
								{{ item.fullName}}
							</span>
							<v-icon small @click="parent.selectItem(item)">
							</v-icon> -->
							</v-chip>
						</template>
					</v-combobox>
				</v-col>
			</v-row>
			<v-row class="mt-4">
				<v-col cols="12" md="12" class="px-10">
					<div class="float-right">
						<v-btn
							color="blue"
							class="mx-5 my-0"
							dark
							@click="saveRequetsData"
						>
							OK</v-btn
						>

						<v-btn @click="close"> H???y</v-btn>
					</div>
				</v-col>
			</v-row>
		</vue-perfect-scrollbar>
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

export default {
	name: "NewRequestGroupVue",
	data() {
		return {
			requestGroup: null,
			requestGroups: [],
			requestTypes: [],
			requestType: null,
			request: null,
			radios: null,
			radio: 0,

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
		};
	},

	mounted() {
		this.initialize();
	},

	methods: {
		async initialize() {
			await this._requestGroups();
		},
		async _requestGroups() {
			let response;
			try {
				response = await globalService.getData_Async(
					administratorAPI.API_GetAllRequestGroup(),
				);
				if (!response || !response.state) {
					return [];
				}

				this.requestGroups = response.data.filter((entry) => {
					return !entry.isDelete;
				});
			} catch (error) {
				this.toastError(error);
				return;
			}
		},
		async handleRequestTypes(event) {
			this.requestType = event;
			if (this.requestType === null) {
				return;
			}

			if (this.requestType.id && this.requestGroup.id) {
				await this._request();
				await this.getAttachmentFileRequest();
			}

			return;
		},
		async handleRequestGroup(event) {
			this.requestGroup = event;
			if (this.requestGroup === null) {
				return;
			}
			await this._requestTypes();
		},
		async _requestTypes() {
			let response;
			try {
				response = await globalService.getData_Async(
					administratorAPI.API_GetAllRequestTypeByRequestGroupId(
						this.requestGroup.id,
					),
				);
				if (!response || !response.state) {
					return [];
				}

				this.requestTypes = response.data.filter((entry) => {
					return !entry.isDelete;
				});
			} catch (error) {
				this.toastError(error);
				return [];
			}
		},
		async _request() {
			try {
				let response = await globalService.getData_Async(
					administratorAPI.API_FindOneRequesrtByID(
						this.requestType.id,
					),
				);
				if (!response || !response.state) {
					return this.toastError(this.$t("error.load"));
				}
				let requests;
				requests = response.data.filter((entry) => {
					return !entry.isDelete;
				});

				if (requests.length > 0) {
					this.request = requests[0];
					this.listProcessInfos = this.request.processInfos[0];
					//this.$emit("save", this.request);
				}
			} catch (error) {
				this.toastError(error);
				return;
			}
		},
		clearRequestGroup() {
			this.requestType = null;
			this.requestTypes = [];
			this.request = null;
		},
		clearForm() {
			this.request = null;
		},
		async getAttachmentFileRequest() {
			for (let templateForm of this.request.templateForms) {
				let response;
				let response_ = [];
				response = await globalService.getData_Async(
					administratorAPI.API_GetAllAttachmentFileByTemplateFormId(
						templateForm.id,
					),
				);
				if (!response || !response.state) {
					return [];
				}
				for (let i = 0; i < response.data.length; i++) {
					if (response_.indexOf(response.data[i]) == -1) {
						response_.push(response.data[i]);
					}
				}
				this.listAttachmentFlieByRequest.push(...response_);
				this.listAttachmentFlieByRequestAll.push(...response_);
			}
		},
		// removeItem(index, item) {
		// 	this.listAttachmentFlieByRequest[index] =
		// 		this.listAttachmentFlieByRequest[index].filter((entry) => {
		// 			if (entry.id != item.id) return entry;
		// 		});
		// },
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
			try {
				this.m_requestDataDto.modified = { id: this.user_info.id };
				this.m_requestDataDto.modifiedName = new Date();
				this.m_requestDataDto.requestDataName =
					this.request.requestName;
				this.m_requestDataDto.requestDataCode =
					this.request.requestCode;
				this.m_requestDataDto.request = { id: this.request.id };
				this.m_requestDataDto.created = this.user_info;
				this.m_requestDataDto.createdName = this.user_info.fullName;
				this.m_requestDataDto.createdDate = new Date();
				// lay api all status
				this.m_requestDataDto.statusName = "??ang So???n";
				this.m_requestDataDto.status = { id: 1 };
				//this.m_requestDataDto.userInfos = this.listUserInfo;
				this.m_requestDataDto.requestGroupCode =
					this.request.requestGroup.requestGroupCode;
				this.m_requestDataDto.requestGroupName =
					this.request.requestGroup.requestGroupName;
				this.m_requestDataDto.requestTypeCode =
					this.request.requestType.requestTypeCode;
				this.m_requestDataDto.requestTypeName =
					this.request.requestType.requestTypeName;
				this.m_requestDataDto.signTypeName = this.radios;
				this.m_requestDataDto.signTypeCode = this.radio;
				this.m_requestDataDto.attachmentFileList =
					this.listAttachmentFlieByRequest;

				response = await globalService.postData_Async(
					administratorAPI.API_CreateRequestData(),
					this.m_requestDataDto,
				);

				if (!response || !response.state)
					return (this.isSaving = false);

				this.requestData = response.data;
				await this.saveProcessData();
				await this.saveFormData();
				await this.saveReqdataProcessHis();
				this.$emit("close", true);
				this.toastSuccess(this.$t("message.add_success"));

				this.$router.push({
					path: `/phieu-yeu-cau/${this.requestData.id}/chi-tiet`,
				});
			} catch (error) {
				this.toastError(error);
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
				this.stepInProcess = response.data;
			} catch (error) {
				this.toastError(error);
				return;
			}
		},
		async saveProcessData() {
			let response;
			for (let processInfo of this.request.processInfos) {
				this.processDataDTO.created = {
					id: processInfo.created.id,
				};

				this.processDataDTO.createdDate = new Date();
				this.processDataDTO.isActive = processInfo.isActive;
				this.processDataDTO.isDelete = processInfo.isDelete;

				this.processDataDTO.modified = {
					id: processInfo.modified.id,
				};

				this.processDataDTO.modifiedDate = new Date();
				this.processDataDTO.modifiedName = processInfo.modifiedName;
				this.processDataDTO.processDataCode = processInfo.processCode;
				this.processDataDTO.processDataName = processInfo.processName;

				this.processDataDTO.requestData = { id: this.requestData.id };

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
				await this.getStepInProcesses(processInfo.id);
				await this.saveStepData();
			}
		},
		async saveProcessDataV2() {
			let response;
			this.processDataDTO.created = {
				id: this.listProcessInfos.created.id,
			};

			this.processDataDTO.createdDate = new Date();
			this.processDataDTO.isActive = this.listProcessInfos.isActive;
			this.processDataDTO.isDelete = this.listProcessInfos.isDelete;

			this.processDataDTO.modified = {
				id: this.listProcessInfos.modified.id,
			};
			this.processDataDTO.modifiedDate = new Date();
			this.processDataDTO.modifiedName =
				this.listProcessInfos.modifiedName;
			this.processDataDTO.processDataCode =
				this.listProcessInfos.processCode;
			this.processDataDTO.processDataName =
				this.listProcessInfos.processName;

			this.processDataDTO.requestData = { id: this.requestData.id };
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
			this.requestFormDataDto.option = this.request.form.option;
			this.requestFormDataDto.formDataCode =
				this.request.form.formDataCode;
			this.requestFormDataDto.formDateName =
				this.request.form.formDateName;
			this.requestFormDataDto.objectSchema =
				this.request.form.objectSchema;
			this.requestFormDataDto.objectModel = this.request.form.objectModel;
			this.requestFormDataDto.createdName = this.request.form.createdName;
			this.requestFormDataDto.createdDate = new Date();
			this.requestFormDataDto.modifiedName =
				this.request.form.modifiedName;
			this.requestFormDataDto.modifiedDate = new Date();
			this.requestFormDataDto.isActive = this.request.form.isActive;
			this.requestFormDataDto.isDelete = this.request.form.isDelete;
			this.requestFormDataDto.tennantCode = this.request.form.tennantCode;
			this.requestFormDataDto.tennantName = this.request.form.tennantName;
			this.requestFormDataDto.created = {
				id: this.request.form.created.id,
			};
			this.requestFormDataDto.modified = {
				id: this.request.form.modified.id,
			};

			this.requestFormDataDto.requestData = {
				id: this.requestData.id,
			};
			this.requestFormDataDto.form = this.request.form;

			let response = await globalService.postData_Async(
				administratorAPI.API_CreateFormData(),
				this.requestFormDataDto,
			);
			if (!response || !response.state) {
				{
					return;
				}
			}
			this.fromData = response.data;
		},
		async saveStepData() {
			for (let stepInProces of this.stepInProcess) {
				this.requestStepData.isActive = false;
				this.requestStepData.created = { id: this.user_info.id };
				this.requestStepData.step = { id: stepInProces.step.id };
				this.requestStepData.processData = {
					id: this.processData.id,
				};
				this.requestStepData.requestData = {
					id: this.requestData.id,
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
					id: stepInProces.modified.id,
				};
				this.requestStepData.userInfos =
					stepInProces.userInStepDTOs.map((entry) => {
						return { id: entry.userInfo.id };
					});

				let response = await globalService.postData_Async(
					administratorAPI.API_CreateStepData(),
					this.requestStepData,
				);

				if (!response || !response.state) {
					return;
				}
				this.listRequestStepData = response.data;
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
			this.$emit("close", true);
		},
		async saveReqdataProcessHis() {
			let response;
			try {
				this.requestProcessHis.createDate = new Date();
				this.requestProcessHis.description =
					this.m_requestDataDto.description;
				(this.requestProcessHis.organizationName = null),
					(this.requestProcessHis.processDate = new Date());
				this.requestProcessHis.processer = this.user_info;
				this.requestProcessHis.processerName = this.user_info.fullName;
				this.requestProcessHis.rankName = null;
				(this.requestProcessHis.requestData = {
					id: this.requestData.id,
				}),
					(this.requestProcessHis.status = "??ang So???n"),
					(this.requestProcessHis.stepData =
						this.listRequestStepData);

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
	},
};
</script>

<style lang="scss" scoped>
.v-menu__content {
	min-width: 1094 px !important;
}
</style>
