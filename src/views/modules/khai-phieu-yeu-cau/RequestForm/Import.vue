<template>
	<v-card elevation="0" class="overflow-auto">
		<v-row class="mt-2">
			<v-col cols="12" md="12">
				<div class="flex justify-end">
					<v-btn text class="p-0" @click="close">
						<v-icon> mdi-close </v-icon>
					</v-btn>
				</div>
			</v-col>
		</v-row>
		<v-col
			class="h-5/6 overflow-hidden px-7"
			style="box-sizing: border-box"
		>
			<v-row class="mt-4" :class="getClass_border_requestGroup()">
				<v-col cols="12" md="12" class="px-10">
					<div class="flex items-center justify-between">
						<h2 class="font-bold text-xl">{{$t("label.request_group")}}</h2>
						<v-spacer></v-spacer>
						<div class="w-96">
							<v-text-field
								v-if="!requestGroup"
								v-model="search_request_group"
								append-icon="mdi-magnify"
								outlined
								dense
								class="mt-2 mx-4"
								maxLength="255"
								rounded
								@keyup="findRequestGroup()"
							></v-text-field>
						</div>
					</div>
					<v-divider class="mt-4"></v-divider>
				</v-col>
				<v-col cols="12" md="12" class="px-10">
					<div
						v-for="(item, index) in requestGroups"
						:key="index"
						:hidden="toggle[index]"
					>
						<div class="flex gap-10 items-center justify-between">
							<div
								class="flex gap-4 items-center cursor-pointer"
								@click="selectRequestGroup(item, index)"
							>
								<img
									src="https://znews-stc.zdn.vn/static/topic/company/vincomretail.jpg"
									alt=""
									style="
										width: 80px;
										height: 80px;
										object-fit: cover;
									"
								/>
								<div
									class="flex flex-col gap-2 justify-between"
								>
									<span class="text-xl font-medium">{{
										item.requestGroupName
									}}</span>
									<span class="text-opacity-90">{{
										item.description
									}}</span>
								</div>
							</div>
							<v-btn
								v-if="requestGroup"
								elevation="0"
								class="rounded-pill"
								color="red darken-1"
								icon
								@click="deleteRequestGroupSeleted(item, index)"
							>
								<v-icon>mdi-close-circle</v-icon>
							</v-btn>
						</div>
						<v-divider class="mt-4"></v-divider>
					</div>
				</v-col>
			</v-row>
			<v-row
				class="mt-4"
				v-if="requestGroup"
				:class="getClass_border_requestType()"
			>
				<v-col cols="12" md="12" class="px-10">
					<div class="flex items-center justify-between">
						<h2 class="font-bold text-xl">{{$t("label.type_group")}}</h2>
						<v-spacer></v-spacer>
						<div class="w-96">
							<v-text-field
								v-if="!requestType"
								v-model="search_request_type"
								append-icon="mdi-magnify"
								outlined
								dense
								class="mt-2 mx-4"
								maxLength="255"
								rounded
								@keyup="findRequestType()"
							></v-text-field>
						</div>
					</div>
					<v-divider class="mt-4"></v-divider>
				</v-col>
				<v-col cols="12" md="12" class="px-10">
					<div
						v-for="(item, index) in requestTypes"
						:key="index"
						:hidden="toggle_request_type[index]"
					>
						<div class="flex gap-10 items-center justify-between">
							<div
								class="flex gap-4 items-center cursor-pointer"
								@click="selectRequestType(item, index)"
							>
								<img
									src="https://znews-stc.zdn.vn/static/topic/company/vincomretail.jpg"
									alt=""
									style="
										width: 80px;
										height: 80px;
										object-fit: cover;
									"
								/>
								<div
									class="flex flex-col gap-2 justify-between"
								>
									<span class="text-xl font-medium">{{
										item.requestTypeName
									}}</span>
									<span class="text-opacity-90">{{
										item.description
									}}</span>
								</div>
							</div>
							<v-btn
								v-if="requestType"
								elevation="0"
								class="rounded-pill"
								color="red darken-1"
								icon
								@click="deleteRequestTypeSeleted(item, index)"
							>
								<v-icon>mdi-close-circle</v-icon>
							</v-btn>
						</div>
						<v-divider class="mt-4"></v-divider>
					</div>
				</v-col>
			</v-row>
			<v-row class="mx-4" v-if="request">
				<v-col cols="12" sm="12" md="12" style="padding: 0">
					<h2 class="font-bold text-xl mt-4">{{$t("label.import_file")}}</h2>
					<div class="flex">
						<v-card-title
							>{{$t("label.download_file_template_exel")}}</v-card-title
						>

						<v-btn
							color="blue"
							text
							class="mt-4 my-0"
							dark
							elevation="0"
							@click="download()"
							>{{$t("button.download")}}</v-btn
						>
					</div>

					<v-card-text style="padding: 0">
						<v-container class="mt-4 p-0">
							<v-card
								elevation="0"
								dropzone
								:class="'bordered bordered-solid'"
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
								id="filesImport"
								type="file"
								accept=".csv"
								class="d-none"
								@change="handleFile($event)"
							/>
							<v-list>
								<v-list-item
									v-for="file in files"
									:key="file.name"
								>
									<v-list-item-icon>
										<v-icon>
											{{
												m_files_icon[
													file.type.toString()
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
						</v-container>
					</v-card-text>
				</v-col>
			</v-row>
			<v-row class="mt-4" v-if="request">
				<v-col cols="12" md="12" class="px-10">
					<!-- <v-card-title> Thông tin</v-card-title>
					<v-text-field
						label="Tiêu đề * "
						required
						outlined
						dense
						v-model="m_requestDataDto.title"
					></v-text-field> -->
					<div class="flex">
						<v-radio-group v-model="radios" mandatory row>
							<v-radio
								:label="$t('label.is_required_signature')"
								:value="$t('label.is_required_signature')"
								@click="radios1"
							></v-radio>
							<v-radio
								:label="$t('label.is_fresh_sign')"
								:value="$t('label.is_fresh_sign')"
								@click="radios2"
							></v-radio>
						</v-radio-group>
					</div>
					<!-- <v-textarea
						label="Mô tả"
						outlined
						v-model="m_requestDataDto.description"
					></v-textarea> -->
					<v-combobox
						:label="$t('label.template_form')"
						outlined
						dense
						v-model="listAttachmentFlieByRequest"
						:items="listAttachmentFlieByRequestAll"
						item-text="templateFormName"
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
								<v-icon small @click="parent.selectItem(item)">
								</v-icon>
							</v-chip>
						</template>
					</v-combobox>
					<v-combobox
						:label="$t('label.application_process')"
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
									{{ item.processName }}
								</span>
							</v-chip>
						</template>
					</v-combobox>
				</v-col>
			</v-row>
			<v-row class="mt-4 p-0">
				<v-col cols="12" md="12">
					<div class="float-right">
						<v-btn
							color="blue"
							class="mx-5 my-0"
							dark
							elevation="0"
							@click="saveRequetsData"
						>
							OK</v-btn
						>

						<v-btn @click="close" elevation="0"> Hủy</v-btn>
					</div>
				</v-col>
			</v-row>
		</v-col>
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

export default {
	name: "VSMFEImport",
	data() {
		return {
			test: null,
			test2: [],

			json_data: null,
			json_fields: [],
			json_meta: ["", ""],
			headExcl: "",
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
			manageStampInfoDto: ManageStampInfoDto,
			signDataDto: SignDataDto,
			search_request_group: "",
			search_request_type: "",
			json: ["Tiêu đề", "Mô tả"],
			fieldInForm: [],
			files: {},
			file: null,
			jsonSchemaForm: {
				type: "object",
				properties: {},
			},
			reader: new FileReader(),
			model: {},
			dataFileCSV: {},
			listAttachmentFlieRequest: [],
			tables: [],
			fields: [],
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
				this.requestGroupsAll = this.requestGroups;
				for (let i = 0; i < this.requestGroups.length; i++) {
					this.toggle.push(false);
				}
			} catch (error) {
				this.toastError(error);
				return;
			}
		},
		async getAttachmentFileRequest() {
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

				//this.listAttachmentFlieByRequestAll.push(...response.data);
			}
		},
		async handleRequestTypes(event) {
			this.requestType = event;
			if (this.requestType === null) {
				return;
			}

			if (this.requestType.id && this.requestGroup.id) {
				await this._request();
				await this.getListTemplateForms();
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
				this.requestTypesAll = this.requestTypes;
				for (let i = 0; i < this.requestTypes.length; i++) {
					this.toggle_request_type.push(false);
				}
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
					await this.getFieldInForm();
					this.listProcessInfos = this.request.processInfos[0];
					//this.$emit("save", this.request);
				}
			} catch (error) {
				this.toastError(error);
				return;
			}
		},
		async getFieldInForm() {
			let response;
			this.fields = [];
			try {
				response = await globalService.getData_Async(
					administratorAPI.API_FindFieldInForm(this.request.form.id),
				);
				if (!response || !response.state) {
					return [];
				}

				let data = response.data.filter((entry) => {
					return !entry.isDelete;
				});
				if (data.length > 0) {
					this.fieldInForm = data.sort(
						(e2, e1) => e2.order - e1.order,
					);
				}

				let objectSchema = { type: "object", properties: {} };
				let headers = {};
				for (let field of this.fieldInForm) {
					try {
						// code mới \\
						let fieldObject = JSON.parse(field.objectSchema);
						// let nameOfField = fieldObject.title.title.trim();
						let objectShemaOfField = {
							...fieldObject.title,
							"x-cols": fieldObject["x-cols"],
							"x-class": "px-2",
						};
						if (objectShemaOfField.readOnly)
							objectShemaOfField.readOnly = false;
						objectSchema.properties[fieldObject.title.id] =
							objectShemaOfField;

						// code cũ đọc chưa hiểu \\
						this.json_data = field.nameOfField;
						this.test = JSON.parse(field.objectSchema);
						let m_field = {
							id: this.test.title.id,
							fields: [],
						};
						if (!this.test.title.Headers) {
							this.json_meta.push(this.test.title.type);
						} else {
							headers = JSON.parse(this.test.title.Headers);
							if (headers) {
								this.json_meta.push(
									headers
										.map((e) => {
											return e.type;
										})
										.join("|"),
								);
								m_field.fields = headers.map((e) => {
									return e.value;
								});
							}
						}
						this.fields.push(m_field);
						this.json.push(this.json_data);
					} catch (e) {
						console.log(e);
					}
				}
				let jsonSchema = {};
				for (let field of this.test2) {
					jsonSchema[field.id] = field;
				}
				this.jsonSchemaForm.properties = jsonSchema;
				// code mới \\
				this.jsonSchemaForm = objectSchema;
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
		async getListTemplateForms() {
			if (this.request && this.request.templateForms) {
				this.listAttachmentFlieByRequest = [
					...this.request.templateForms,
				];
				this.listAttachmentFlieByRequestAll = [
					...this.request.templateForms,
				];
			}
			// for (let templateForm of this.request.templateForms) {
			// 	let response;

			// 	response = await globalService.getData_Async(
			// 		administratorAPI.API_GetAllAttachmentFileByTemplateFormId(
			// 			templateForm.id,
			// 		),
			// 	);
			// 	if (!response || !response.state) {
			// 		return [];
			// 	}
			// 	let listAttachmentTempLate = response.data.filter(
			// 		(ele) => !ele.requestData,
			// 	);
			// 	this.listAttachmentFlieByRequest.push(
			// 		...listAttachmentTempLate,
			// 	);
			// 	this.listAttachmentFlieByRequestAll.push(
			// 		...listAttachmentTempLate,
			// 	);

			// 	//this.listAttachmentFlieByRequestAll.push(...response.data);
			// }
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
			try {
				const data = this.m_CSVToArray(this.dataFileCSV);
				console.log(this.jsonSchemaForm);
				if (Array.isArray(data)) {
					for (let ele of data) {
						if (!ele.title) {
							continue;
						}
						await this.saveRequetsDataWithTemplate(
							ele.title,
							ele.description,
							JSON.stringify(ele.model),
							JSON.stringify(this.jsonSchemaForm),
						);
					}
					this.toastSuccess(this.$t("message.success"));
					this.close();
				}
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
			this.processDataDTO.created = this.userInfo;

			this.processDataDTO.createdDate = new Date();
			this.processDataDTO.isActive = this.listProcessInfos?.isActive;
			this.processDataDTO.isDelete = this.listProcessInfos?.isDelete;

			this.processDataDTO.modified = this.userInfo;
			this.processDataDTO.modifiedDate = new Date();
			this.processDataDTO.modifiedName =
				this.listProcessInfos?.modifiedName;
			this.processDataDTO.processDataCode =
				this.listProcessInfos?.processCode;
			this.processDataDTO.processDataName =
				this.listProcessInfos?.processName;
			this.processDataDTO.roundNumber = 1;
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
			await this.getStepInProcesses(this.listProcessInfos?.id);
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
			this.requestFormDataDto.modifiedDate =
				this.request.form.modifiedDate;
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
				this.requestStepData.step = { id: stepInProces?.step?.id };
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
				this.requestStepData.createdDate = stepInProces.createdDate;
				this.requestStepData.modifiedName = stepInProces.modifiedName;

				this.requestStepData.isDelete = stepInProces.isDelete;
				this.requestStepData.tennantCode = stepInProces.tennantCode;
				this.requestStepData.tennantName = stepInProces.tennantName;

				this.requestStepData.modifiedDate = stepInProces.modifiedDate;

				this.requestStepData.modified = {
					id: stepInProces.modified.id,
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

				this.requestStepData.isSendMail = stepInProces.isSendMail;
				this.requestStepData.isSendOTP = stepInProces.isSendOTP;
				this.requestStepData.mailTemplate = stepInProces.mailTemplate;
				this.requestStepData.roundNumber = 1;

				///////////////////////////////////////////
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
					(this.requestProcessHis.status = this.$t("status.drafting")),
					(this.requestProcessHis.stepData =
						this.listRequestStepData[0]);
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
			for (let i = 0; i < this.toggle.length; i++) {
				if (i == index) {
					this.toggle[i] = false;
				} else {
					this.toggle[i] = true;
				}
			}
			// this.toggle[index] = true;
			this.requestGroup = item;
			await this._requestTypes();
		},
		async selectRequestType(item, index) {
			for (let i = 0; i < this.toggle_request_type.length; i++) {
				if (i == index) {
					this.toggle_request_type[i] = false;
				} else {
					this.toggle_request_type[i] = true;
				}
			}
			this.requestType = item;
			// await this._requestTypes();
			if (this.requestType.id && this.requestGroup.id) {
				await this._request();
				await this.getListTemplateForms();
			}
		},

		deleteRequestGroupSeleted() {
			this.requestGroup = null;
			this.requestType = null;
			this.request = null;
			for (let i = 0; i < this.toggle.length; i++) {
				if (this.toggle[i] == true) {
					this.toggle[i] = false;
				}
			}
			for (let i = 0; i < this.toggle_request_type.length; i++) {
				if (this.toggle_request_type[i] == true) {
					this.toggle_request_type[i] = false;
				}
			}
		},
		deleteRequestTypeSeleted() {
			this.requestType = null;
			this.request = null;
			for (let i = 0; i < this.toggle_request_type.length; i++) {
				if (this.toggle_request_type[i] == true) {
					this.toggle_request_type[i] = false;
				}
			}
		},
		async createManageStampInfo() {
			let response;
			this.manageStampInfoDto.requestData = { id: this.requestData.id };
			response = await globalService.postData_Async(
				administratorAPI.API_createManageStampInfo(),
				this.manageStampInfoDto,
			);
			if (!response || !response.state) {
				{
					return;
				}
			}
		},
		async createSignData() {
			let response;

			this.signDataDto.requestData = { id: this.requestData.id };
			response = await globalService.postData_Async(
				administratorAPI.API_createSignData(),
				this.signDataDto,
			);
			if (!response || !response.state) {
				{
					return;
				}
			}
		},
		findRequestGroup() {
			if (this.search_request_group.length > 0) {
				this.requestGroups = this.requestGroupsAll.filter((entry) => {
					return entry.requestGroupName
						.toLocaleUpperCase()
						.includes(
							this.search_request_group.toLocaleUpperCase(),
						);
				});
			} else {
				this.requestGroups = this.requestGroupsAll;
			}
		},
		findRequestType() {
			if (this.search_request_type.length > 0) {
				this.requestTypes = this.requestTypesAll.filter((entry) => {
					return entry.requestTypeName
						.toLocaleUpperCase()
						.includes(this.search_request_type.toLocaleUpperCase());
				});
			} else {
				this.requestTypes = this.requestTypesAll;
			}
		},
		getClass_border_requestGroup() {
			return !this.requestGroup ? " rounded-md border-2" : "";
		},
		getClass_border_requestType() {
			return !this.requestType ? " rounded-md border-2" : "";
		},
		getFilenameExcel() {
			let str = "Bieu_mau_thong_tin" + new Date().getTime();
			return str;
		},

		download() {
			let csvContent =
				"data:text/csv;charset=utf-8,\uFEFF" +
				encodeURI(this.json.join(", ") + "\n" + this.json_meta);
			let link = document.createElement("a");
			link.setAttribute("href", csvContent);
			link.setAttribute("download", this.getFilenameExcel());
			document.body.appendChild(link); // Required for FF

			link.click(); // This will download the data file named "my_data.csv".
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
			let files = document.getElementById("filesImport");
			files.click();
		},
		remove(file) {
			let index = this.files.indexOf(file);
			this.files.splice(index, 1);
		},
		handleFileUpload(event) {
			this.file = event;
		},

		// import \\

		handleFile(e) {
			this.files = Array.from(e.target.files);
			try {
				let inputFile = e.target.files[0];
				let reader = new FileReader();
				reader.readAsText(inputFile);
				reader.onload = async (e) => {
					this.dataFileCSV = e.target.result;
				};
			} catch (e) {
				console.error(e);
			}
		},
		m_CSVToArray(CSV_string, delimiter) {
			delimiter = delimiter || ","; // user-supplied delimeter or default comma

			let pattern = new RegExp( // regular expression to parse the CSV values. // Delimiters:
				"(\\" +
					delimiter +
					"|\\r?\\n|\\r|^)" +
					// Quoted fields.
					'(?:"([^"]*(?:""[^"]*)*)"|' +
					// Standard fields.
					'([^"\\' +
					delimiter +
					"\\r\\n]*))",
				"gi",
			);

			let rows = [[]]; // array to hold our data. First row is column headers.
			// array to hold our individual pattern matching groups:
			let matches = false; // false if we don't find any matches
			// Loop until we no longer find a regular expression match
			while ((matches = pattern.exec(CSV_string))) {
				let matched_delimiter = matches[1]; // Get the matched delimiter
				// Check if the delimiter has a length (and is not the start of string)
				// and if it matches field delimiter. If not, it is a row delimiter.
				if (
					matched_delimiter.length &&
					matched_delimiter !== delimiter
				) {
					// Since this is a new row of data, add an empty row to the array.
					rows.push([]);
				}
				let matched_value;
				// Once we have eliminated the delimiter, check to see
				// what kind of value was captured (quoted or unquoted):
				if (matches[2]) {
					// found quoted value. unescape any double quotes.
					matched_value = matches[2].replace(
						new RegExp('""', "g"),
						'"',
					);
				} else {
					// found a non-quoted value
					matched_value = matches[3];
				}
				// Now that we have our value string, let's add
				// it to the data array.
				rows[rows.length - 1].push(matched_value);
			}
			let result = this.handleCSVArray(CSV_string, rows, delimiter);
			return result; // Return the parsed data Array
		},
		handleCSVArray(str, rows, delimiter = ",", tableDelimiter = "|") {
			let result = [];
			let headers = str
				.slice(0, str.indexOf("\n") - 1)
				.split(delimiter)
				.map((ele) => ele.trim());
			const lengthData = headers.length - 1; // biến dánh dấu số lượng field cần xuất hiện
			for (let rowIdx in rows) {
				let objectModel = { title: "", description: "", model: {} };
				if (rowIdx >= 2) {
					// đọc từ dòng số 2 trở đi
					let count = rows[rowIdx].length; // đếm số lần dấu ',' xuất hiện trong dữ liệu
					if (count < lengthData) break;
					let dataOfRow = rows[rowIdx];
					headers.forEach((ele, idx) => {
						if (idx == 0) {
							objectModel.title = dataOfRow[idx];
						} else if (idx == 1) {
							objectModel.description = dataOfRow[idx];
						} else if (this.fields[idx - 2]?.id) {
							if (`${dataOfRow[idx]}`.match("\n")) {
								let lines = `${dataOfRow[idx]}`.split("\n");
								let arr = [];
								for (let line of lines) {
									let values = line.split(tableDelimiter);
									let tmp = {};
									for (let index in values) {
										tmp[
											this.fields[idx - 2]?.fields[index]
										] = values[index];
									}
									arr.push(tmp);
								}
								objectModel.model[this.fields[idx - 2].id] =
									arr;
							} else if (isNaN(dataOfRow[idx])) {
								objectModel.model[
									this.fields[idx - 2].id
								] = `${dataOfRow[idx]}`;
							} else {
								objectModel.model[this.fields[idx - 2].id] =
									parseFloat(`${dataOfRow[idx]}`);
							}
						}
					});
					result.push(objectModel);
				}
			}
			return result;
		},
		csvToArray(str, delimiter = ",") {
			let result = [];
			let headers = str
				.slice(0, str.indexOf("\n") - 1)
				.split(delimiter)
				.map((ele) => ele.trim());
			const lengthData = headers.length - 1; // biến dánh dấu số lượng field cần xuất hiện
			const allRow = str.split(/\n/);
			for (let rowIdx in allRow) {
				let objectModel = { title: "", description: "", model: {} };
				if (rowIdx >= 2) {
					// đọc từ dòng số 2 trở đi
					let count = (allRow[rowIdx].match(/,/g) || []).length; // đếm số lần dấu ',' xuất hiện trong dữ liệu
					if (count < lengthData) break;
					let dataOfRow = allRow[rowIdx]
						.split(",")
						.map((ele) => ele.trim());
					headers.forEach((ele, idx) => {
						if (idx == 0) {
							objectModel.title = dataOfRow[idx];
						} else if (idx == 1) {
							objectModel.description = dataOfRow[idx];
						} else {
							if (isNaN(dataOfRow[idx])) {
								objectModel.model[ele] = `${dataOfRow[idx]}`;
							} else {
								objectModel.model[ele] = parseFloat(
									`${dataOfRow[idx]}`,
								);
							}
						}
					});
					result.push(objectModel);
				}
			}
			return result;
		},
		/**
		 * title		: tiêu đề của requetData
		 * description	: mô tả của requestData
		 * objectModel	: dữ liệu trong form
		 * objectSchema : jsonSchema của form (định dạng form)
		 */
		async saveRequetsDataWithTemplate(
			title,
			description,
			objectModel,
			objectSchema,
		) {
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
				this.m_requestDataDto.created = { id: this.user_info.id };
				this.m_requestDataDto.createdName = this.user_info.fullName;
				this.m_requestDataDto.createdDate = new Date();
				this.m_requestDataDto.createdOrgName =
					this.user_info.organization
						?.map((ele) => ele.organizationName)
						?.join(", ");
				this.m_requestDataDto.createdRankName = this.userInfo.ranks
					?.map((ele) => ele.rankName)
					?.join(", ");
				// lay api all status
				this.m_requestDataDto.statusName = this.$t("status.drafting");
				this.m_requestDataDto.status = { id: 1 };
				//this.m_requestDataDto.userInfos = this.listUserInfo;
				this.m_requestDataDto.requestGroup = {
					id: this.request?.requestGroup?.id,
				};
				this.m_requestDataDto.requestGroupCode =
					this.request.requestGroup.requestGroupCode;
				this.m_requestDataDto.requestGroupName =
					this.request.requestGroup.requestGroupName;
				this.m_requestDataDto.requestType = {
					id: this.request?.requestType?.id,
				};
				this.m_requestDataDto.requestTypeCode =
					this.request.requestType.requestTypeCode;
				this.m_requestDataDto.requestTypeName =
					this.request.requestType.requestTypeName;
				this.m_requestDataDto.signTypeName = this.radios;
				this.m_requestDataDto.signTypeCode = this.radio;
				this.m_requestDataDto.attachmentFileList =
					this.listAttachmentFlieRequest;
				this.m_requestDataDto.currentRound = 1;

				this.m_requestDataDto.title = title;
				this.m_requestDataDto.description = description;

				response = await globalService.postData_Async(
					administratorAPI.API_CreateRequestData(),
					this.m_requestDataDto,
				);

				if (!response || !response.state) {
					this.isSaving = false;
					return;
				}

				this.requestData = response.data;
				await this.saveFormDataWithTemplate(objectModel, objectSchema);
				await this.saveProcessDataV2();
				await this.saveStepData();
				await this.saveReqdataProcessHis();
				await this.createManageStampInfo();
				await this.createSignData();
			} catch (error) {
				this.isSaving = false;
				console.log(error);
			}
		},

		async saveFormDataWithTemplate(formdata, objectSchema) {
			this.requestFormDataDto.option = this.request.form.option;
			this.requestFormDataDto.formDataCode =
				this.request.form.formDataCode;
			this.requestFormDataDto.formDateName =
				this.request.form.formDateName;
			this.requestFormDataDto.objectSchema = objectSchema;

			this.requestFormDataDto.objectModel = formdata;

			this.requestFormDataDto.createdName = this.user_info.fullName;
			this.requestFormDataDto.createdDate = new Date();
			this.requestFormDataDto.createdOrgName =
				this.user_info.organizations
					?.map((ele) => ele.organizationName)
					?.join(", ");
			this.requestFormDataDto.createdRankName = this.user_info.ranks
				?.map((ele) => ele.rankName)
				?.join(", ");
			this.requestFormDataDto.modifiedName = this.user_info.fullName;
			this.requestFormDataDto.modifiedDate =
				this.request.form.modifiedDate;
			this.requestFormDataDto.isActive = this.request.form.isActive;
			this.requestFormDataDto.isDelete = this.request.form.isDelete;
			this.requestFormDataDto.tennantCode = this.request.form.tennantCode;
			this.requestFormDataDto.tennantName = this.request.form.tennantName;
			this.requestFormDataDto.created = { id: this.user_info.id };
			this.requestFormDataDto.modified = { id: this.user_info.id };
			this.requestFormDataDto.requestData = { id: this.requestData.id };
			this.requestFormDataDto.form = this.request.form;
			this.requestFormDataDto.mappingInfo = this.request.form.mappingInfo;

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
	},
};
</script>

<style lang="scss" scoped>
.v-menu__content {
	min-width: 1094 px !important;
}
</style>
