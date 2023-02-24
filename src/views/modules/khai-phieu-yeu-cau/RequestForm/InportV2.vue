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
									<span class="text-xl font-medium">{{
										item.requestGroupName
									}}</span>
									<span class="text-opacity-90">{{
										item.description
									}}</span>
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
									@keyup="findRequestType()"
								></v-text-field>
							</div>
						</div>
						<v-divider class="mt-1"></v-divider>
					</v-col>
					<div v-if="noRequestResult" class="text-center">
						Không có dữ liệu
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
									<span class="text-xl font-medium">{{
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
						<v-divider class="mt-2"></v-divider>
					</div>
				</v-row>
				<v-row class="mt-2" v-if="request">
					<v-col cols="12">
						<div>
							<h2 class="font-bold text-xl mt-1">
								{{ $t("label.add_new") }}
							</h2>
							<div class="d-flex mt-2">
								<span class="text-xl mr-5">
									{{
										$t("label.download_file_template_exel")
									}}
								</span>

								<v-btn
									color="blue"
									text
									dark
									elevation="0"
									@click="download()"
									>{{ $t("button.download") }}</v-btn
								>
							</div>

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
										border-[1px]
										p-2
									"
								>
									<span class="text-blue-500 ml-2">
										{{ $t("button.upload") }}</span
									>
									<v-divider vertical></v-divider>
									<v-icon class="mr-2"
										>mdi-cloud-upload-outline
									</v-icon>
								</div>
							</v-card>
							<input
								ref="files"
								id="filesImportV2"
								type="file"
								accept=".xlsx"
								class="d-none"
								@change="handleFile($event)"
							/>
							<v-list v-if="!!files.length">
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
						</div>
						<!-- <v-card-title
							>{{ $t("label.information") }}
						</v-card-title>
						<v-text-field
							maxLength="255"
							required
							outlined
							dense
							v-model="m_requestDataDto.title"
						>
							<template v-slot:label>
								{{ $t("label.mail_template_subject") }}
								<span class="text-red-600">{{
									$t("label.star")
								}}</span>
							</template>
						</v-text-field> -->

						<div class="flex" v-if="!isCvanTtrinh">
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

						<v-combobox
							maxLength="255"
							:label="$t('label.template_form')"
							outlined
							v-model="listAttachmentFlieByRequest"
							:items="listAttachmentFlieByRequestAll"
							item-text="templateFormName"
							chips
							hide-selected
							clearable
							multiple
							class="mt-2"
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
							height="45px"
							v-model="listProcessInfos"
							:items="request.processInfos"
							item-text="processName"
							clearable
						>
							<template
								v-slot:selection="{ attrs, item, selected }"
							>
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
				{{ $t("button.cancel") }}
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
import xlsx from "json-as-xlsx";
import * as XLSX from "xlsx";
import moment from "moment";
import FieldData from "@/models/field-data.dto";
import constant from "@/common/constant";
import numeral from "@/plugins/numeral";
import ExprEval from "expr-eval";
export default {
	name: "InportV2Vue",
	props: { isShow: Boolean },
	data() {
		return {
			test: null,
			test2: [],
			m_isShow: false,
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
			event: null,
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
			isCVD: this.$t("enum.CVD"),
			isCvanTtrinh: false,
			noRequestResult: false,
			noResult: false,
			groupId: [],
			listrequest: [],
			fieldData: FieldData,
			fieldDataAll: [],
			createTime: new Date(),
		};
	},

	mounted() {
		this.initialize();
	},
	watch: {
		isShow(val) {
			this.m_isShow = val;
			if (this.m_isShow) {
				this.request = null;
				this.requestGroup = null;
				this.toggle = [];
				for (let i = 0; i < this.requestGroups.length; i++) {
					this.toggle.push(false);
				}
			}
		},
	},
	methods: {
		async initialize() {
			this.request = null;
			this.requestGroup = null;
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
				this.listAttachmentFlieRequest = listAttachmentTempLate;

				//this.listAttachmentFlieByRequestAll.push(...response.data);
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
		rowToObject(row, delimeter = ".") {
			let result = {};
			for (let key in row) {
				if (!`${key}`.includes(delimeter)) {
					result[key] = row[key];
				} else {
					let headers = `${key}`.split(delimeter);
					if (headers.length < 2) {
						continue;
					}
					if (!result[headers[0]]) {
						result[headers[0]] = [{}];
					}
					try {
						result[headers[0]][0][[headers[1]]] = row[key];
					} catch (e) {
						console.log(e);
					}
				}
			}
			return result;
		},
		handleSheet(data) {
			let result = [];
			for (let i in data) {
				if (i == 0) {
					continue;
				}
				let rows = data[i];
				let row = this.rowToObject(rows);
				if (this.FEATURE.IMPORT_BY_BRAND_CODE) {
					if (!row[constant.keys.brand] && row[constant.keys.title]) {
						// this.toastError(
						// 	this.$t("error.missing_brand_code") +
						// 		" " +
						// 		(parseInt(i) + 2),
						// );
						result.push(row);
						continue;
					} else if (
						!row[constant.keys.title] &&
						row[constant.keys.brand] !=
							data[i - 1][constant.keys.brand]
					) {
						this.toastError(
							this.$t("error.wrong_brand_code") +
								" " +
								(parseInt(i) + 2),
						);
						this.deleteRequestTypeSeleted();

						return false;
					}
					let findIndex = result.findIndex(
						(e) =>
							e[constant.keys.brand] == row[constant.keys.brand],
					);
					if (findIndex < 0) {
						result.push(row);
						continue;
					}
					for (let key in row) {
						if (
							result[findIndex][key] instanceof Array &&
							row[key] instanceof Array
						) {
							result[findIndex][key] = result[findIndex][
								key
							].concat(Array.from(row[key]));
						}
					}
				} else {
					if (!row?.title) {
						let last = result.pop();
						if (!last) {
							continue;
						}
						for (let key in row) {
							if (!last[key]) {
								last[key] = row[key];
							} else {
								if (
									last[key] instanceof Array &&
									row[key] instanceof Array
								) {
									last[key] = last[key].concat(
										Array.from(row[key]),
									);
								}
							}
						}
						result.push(last);
					} else {
						result.push(row);
					}
				}
				// if (!this.jsonSchemaForm?.properties[key]?.Headers) {
				// 	console.log(this.jsonSchemaForm[key]);
				// } else {
				// 	try {
				// 		let headers = JSON.parse(
				// 			this.jsonSchemaForm.properties[key].Headers,
				// 		);
				// 		let tmp = {};
				// 		let arr = [];
				// 		let rows = `${row[key]}`.split("\n");
				// 		for (let line in rows) {
				// 			let values = `${line}`.split(delimeter);
				// 			for (let index in values) {
				// 				tmp[headers[index]?.value] = values[index];
				// 			}
				// 			arr.push(arr);
				// 		}
				// 		data[i][key] = arr;
				// 	} catch (error) {
				// 		console.log(error);
				// 	}
				// }
			}
			return result;
		},
		async saveRequetsData() {
			if (!this.request) return;
			try {
				if (!this.files.length > 0) {
					return this.toastError(this.$t("error.no_file"));
				}
				// const data = this.m_CSVToArray(this.dataFileCSV);
				let content = await this.excelFileToJSON(this.files[0]);
				let data;
				for (let sheetName in content) {
					if (content[sheetName]?.length < 2) {
						continue;
					}
					data = Array.from(this.handleSheet(content[sheetName]));
				}
				if (!data) {
					this.toastError(this.$t("error.no_data"));
					return;
				}
				// data.shift();
				this.createTime = new Date();
				if (Array.isArray(data) && data.length > 0) {
					await this.getAttachmentFileRequest();
					for (let ele of data) {
						if (!ele.title) {
							continue;
						}
						await this.saveRequetsDataWithTemplate(
							ele.title,
							ele.description,
							JSON.stringify(ele),
							JSON.stringify(this.jsonSchemaForm),
						);
					}
					this.close();
					this.toastSuccess(this.$t("message.import_success"));
					this.deleteRequestTypeSeleted();

					this.$emit("saveRequest");
				}
			} catch (error) {
				this.toastError(error);
			} finally {
				this.files = [];
				this.event.target.value = null;
				this.request = null;
				this.requestGroup = null;
				this.requestTypes = [];
				for (let i = 0; i < this.requestGroups.length; i++) {
					this.toggle.push(false);
				}
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
					id: processInfo?.created.id,
				};

				this.processDataDTO.createdDate = new Date();
				this.processDataDTO.isActive = processInfo.isActive;
				this.processDataDTO.isDelete = processInfo.isDelete;

				this.processDataDTO.modified = {
					id: processInfo.modified?.id,
				};

				this.processDataDTO.modifiedDate = new Date();
				this.processDataDTO.modifiedName = processInfo.modifiedName;
				this.processDataDTO.processDataCode = processInfo.processCode;
				this.processDataDTO.processDataName = processInfo.processName;

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

				await this.getStepInProcesses(processInfo?.id);
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
			await this.getStepInProcesses(this.listProcessInfos?.id);
		},

		async saveStepData() {
			for (let stepInProces of this.stepInProcess) {
				this.requestStepData.isActive = false;
				if (this.requestData.requestGroupName.includes(this.isCVD)) {
					this.requestStepData.isActive = true;
				}
				this.requestStepData.created = { id: this.user_info?.id };
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
				this.requestStepData.stepInProcess = { id: stepInProces?.id };
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
					id: this.user_info?.id,
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
				///////////////////////////////////////////
				this.requestStepData.userInfos =
					stepInProces.userInStepDTOs.map((entry) => {
						return { id: entry.userInfo?.id };
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
			// this.toastSuccess(this.$t("message.add_success"));
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
				this.requestProcessHis.description = this.$t("label.editor");
				this.requestProcessHis.organizationName = null;
				this.requestProcessHis.processDate = new Date();
				this.requestProcessHis.processer = this.user_info;
				this.requestProcessHis.processerName = this.user_info.fullName;
				this.requestProcessHis.rankName = null;
				this.requestProcessHis.requestData = {
					id: this.requestData?.id,
				};
				this.requestProcessHis.status = this.$t("status.drafting");
				this.requestProcessHis.isChild = false;
				this.requestProcessHis.stepData = null;
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
				if (entry == item?.id) {
					isLoad = true;
				}
			});
			if (!isLoad && item.id) {
				let response = await globalService.getData_Async(
					administratorAPI.API_GetRequestByRqGroupId(item?.id),
				);
				if (!response || !response.state) return;
				this.listrequest = this.listrequest.concat(response.data);
			}
			this.groupId.push(item?.id);

			// if (this.listrequest.length == 0) {
			// 	await this._request();
			// }
			this.requestTypes = [];
			this.isCvanTtrinh = false;
			for (let i = 0; i < this.toggle.length; i++) {
				if (i === index) {
					this.toggle[i] = false;
				} else {
					this.toggle[i] = true;
				}
			}
			// this.toggle[index] = true;
			this.requestGroup = item;
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
					element.requestGroup?.id == this.requestGroup?.id &&
					!element.isDelete
				) {
					return this.requestTypes.push(element);
				}
			});
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
			this.request = item;

			if (item.processInfos && item.processInfos.length > 0) {
				this.listProcessInfos = item.processInfos[0];
			} else {
				this.listProcessInfos = [];
			}
			let _template = await globalService.getData_Async(
				administratorAPI.API_GetTemplateByRequestId(this.request?.id),
			);
			let _form = await globalService.getData_Async(
				administratorAPI.API_GetFormByRequestId(this.request?.id),
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
			if (this.request?.id && this.requestGroup?.id) {
				await this.getListTemplateForms();
				await this.getFieldInForm();

				if (
					this.listProcessInfos.length === 0 ||
					this.listAttachmentFlieByRequestAll.length === 0
				) {
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
		async createManageStampInfo(objectModel = {}) {
			if (
				!objectModel?.customer &&
				!Array.isArray(objectModel?.customer)
			) {
				return;
			}
			for (let customer of objectModel?.customer) {
				let response;
				this.manageStampInfoDto.requestData = {
					id: this.requestData?.id,
				};
				this.manageStampInfoDto.email = customer?.email;
				this.manageStampInfoDto.phoneNumber = customer?.phone;
				this.manageStampInfoDto.address = customer?.address;
				this.manageStampInfoDto.name = customer?.name;
				response = await globalService.postData_Async(
					administratorAPI.API_createManageStampInfo(),
					this.manageStampInfoDto,
				);
				if (!response || !response.state) {
					return;
				}
				this.manageStampInfoDto.email = "";
				this.manageStampInfoDto.phoneNumber = "";
				this.manageStampInfoDto.address = "";
				this.manageStampInfoDto.name = "";
			}
		},
		async createSignData(objectModel = {}) {
			if (!objectModel?.customer) {
				return;
			}
			for (let customer of objectModel?.customer) {
				let response;
				this.signDataDto.requestData = { id: this.requestData?.id };
				this.signDataDto.phoneNumber = customer?.phone;
				this.signDataDto.email = customer?.email;
				this.signDataDto.address = customer?.address;
				this.signDataDto.signName = customer?.name;
				response = await globalService.postData_Async(
					administratorAPI.API_createSignData(),
					this.signDataDto,
				);
				if (!response || !response.state) {
					return;
				}
				this.signDataDto.phoneNumber = "";
				this.signDataDto.email = "";
				this.signDataDto.address = "";
				this.signDataDto.signName = "";
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
					return this.nonAccentVietnamese(entry.requestTypeName)
						.toLocaleUpperCase()
						.includes(
							this.nonAccentVietnamese(this.search_request_type)
								.trim()
								.toLocaleUpperCase(),
						);
				});
				if (this.requestTypes.length === 0) {
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
			return !this.requestType ? " rounded-md border-2" : "";
		},
		getFilenameExcel() {
			let str = "Bieu_mau_thong_tin" + new Date().getTime();
			return str;
		},
		jsonSchemaToTemplate(columns, content, properties) {
			for (let key in properties) {
				if (!properties[key].Headers) {
					let tmp = Object.assign({}, properties[key]);
					tmp.label = key;
					tmp.value = key;
					columns.push(tmp);
					content[key] = tmp.title;
				} else {
					let headers = JSON.parse(properties[key].Headers);
					content[`${key}`] = {};
					for (let header of headers) {
						columns.push({
							label: `${key}.${header.value}`,
							value: `${key}.${header.value}`,
						});
						content[`${key}`][`${header.value}`] = `${header.text}`;
					}
				}
			}
		},
		download() {
			let settings = {
				fileName: this.requestType?.requestTypeName, // Name of the resulting spreadsheet
			};
			let data = {
				sheet: this.$t("label.information_form"),
			};
			try {
				let columns = [];
				let content = {};
				columns.push({
					label: "title",
					value: "title",
				});
				columns.push({
					label: "description",
					value: "description",
				});
				columns.push({
					label: "customer.name",
					value: "customer.name",
				});
				columns.push({
					label: "customer.email",
					value: "customer.email",
				});
				columns.push({
					label: "customer.phone",
					value: "customer.phone",
				});
				columns.push({
					label: "customer.address",
					value: "customer.address",
				});
				columns.push({
					label: "customer.address",
					value: "customer.address",
				});
				columns.push({
					label: constant.keys.brand,
					value: constant.keys.brand,
				});
				content["title"] = this.$t("label.title");
				content["description"] = this.$t("label.description");
				content["customer"] = {};
				content["customer"]["name"] = this.$t("label.customer_name");
				content["customer"]["email"] = this.$t("label.customer_email");
				content["customer"]["phone"] = this.$t("label.customer_phone");
				content["customer"]["address"] = this.$t(
					"label.customer_address",
				);
				content[constant.keys.brand] = this.$t("label.brand_code");
				this.jsonSchemaToTemplate(
					columns,
					content,
					this.jsonSchemaForm.properties,
				);
				data.columns = columns;
				data.content = [content];
				xlsx([data], settings);
			} catch (e) {
				console.log(e);
			}
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
			let files = document.getElementById("filesImportV2");
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

		async handleFile(e) {
			this.files = Array.from(e.target.files);
			try {
				this.event = e;
				e.target.value = null;
			} catch (error) {
				console.log(error);
			}
		},
		excelFileToJSON(file) {
			let reader = new FileReader();
			return new Promise((resolve, reject) => {
				reader.onerror = function () {
					reader.abort();
					reject();
				};
				reader.onload = function (e) {
					let data = e.target.result;
					let workbook = XLSX.read(data, {
						type: "binary",
					});
					let result = {};
					workbook.SheetNames.forEach(function (sheetName) {
						let roa = XLSX.utils.sheet_to_row_object_array(
							workbook.Sheets[sheetName],
						);
						if (roa.length > 0) {
							result[sheetName] = roa;
						}
					});
					resolve(result);
				};
				reader.readAsBinaryString(file);
			});
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
							if (`${dataOfRow[idx]}`.match(tableDelimiter)) {
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
		async saveRequetsDataWithTemplate(title, description, objectModel) {
			if (!this.request) return;

			let response;
			if (this.isSaving) {
				return;
			}
			try {
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
				this.m_requestDataDto.statusName = this.$t("status.drafting");
				this.m_requestDataDto.status = { id: 1 };
				this.m_requestDataDto.plotOfLandNumber = moment(
					this.createTime,
				).format("yyyyMMDDHHmmss");
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
					this.listAttachmentFlieRequest;
				this.m_requestDataDto.currentRound = 1;
				this.m_requestDataDto.requestGroup = {
					id: this.request.requestGroup.id,
				};
				this.m_requestDataDto.requestType = {
					id: this.request.requestType.id,
				};
				if (this.isCvanTtrinh) {
					this.radio = null;
					this.m_requestDataDto.signTypeCode = null;
					this.m_requestDataDto.signTypeName = null;
				}
				this.m_requestDataDto.dataRoomDriveId =
					this.request?.dataRoomDriveId;
				this.m_requestDataDto.dataRoomId = this.request?.dataRoomId;
				this.m_requestDataDto.dataRoomPath = this.request?.dataRoomPath;
				this.m_requestDataDto.ruleGenerateAttachName =
					this.request?.ruleGenerateAttachName;
				this.m_requestDataDto.title = title;
				this.m_requestDataDto.description = description;
				response = await globalService.postData_Async(
					administratorAPI.API_CreateRequestData(),
					this.m_requestDataDto,
				);

				if (!response || !response.state) {
					this.toastError(this.$t("message.add_error"));
					return (this.isSaving = false);
				}
				this.m_requestDataDto.description = "";
				this.m_requestDataDto.title = "";
				this.m_requestDataDto.plotOfLandNumber = "";

				this.requestData = response.data;
				if (this.radio == 0) {
					await this.createSignData(JSON.parse(objectModel));
				}
				if (this.radio == 1) {
					await this.createManageStampInfo(JSON.parse(objectModel));
				}
				await this.saveFormDataWithTemplate();
				console.log("duc 123");
				await this.saveFieldData(JSON.parse(objectModel));
				await this.saveProcessDataV2();
				await this.saveStepData();
				await this.saveReqdataProcessHis();
				// if (!this.isCvanTtrinh) {
				// }
			} catch (error) {
				this.isSaving = false;
				console.log(error);
			}
		},

		async saveFormDataWithTemplate() {
			// this.requestFormDataDto.objectSchema = objectSchema;
			// this.requestFormDataDto.objectModel = formdata;
			this.requestFormDataDto.option = this.request.form.option;
			this.requestFormDataDto.formDataCode =
				this.request.form.formDataCode;
			this.requestFormDataDto.formDateName =
				this.request.form.formDateName;
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
				{
					return;
				}
			}
			this.fromData = response.data;
		},
		async saveFieldData(objectModel) {
			let parser = new ExprEval.Parser();
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
				this.fieldData.fieldDataCode = this.getIdFromValue(
					field.nameOfField,
				);
				try {
					let schema = JSON.parse(field.objectSchema);
					this.fieldData.tennantCode = JSON.parse(field.objectSchema)
						.title.Headers
						? "truong_bang"
						: JSON.parse(field.objectSchema).title.upload_ext
						? "truong_file"
						: JSON.parse(field.objectSchema).title.type ==
								"number" &&
						  !JSON.parse(field.objectSchema).title.double
						? "number"
						: JSON.parse(field.objectSchema).title.type ==
								"number" &&
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
						: JSON.parse(field.objectSchema).title.type ==
								"number" &&
						  !JSON.parse(field.objectSchema).title.double
						? "number"
						: JSON.parse(field.objectSchema).title.type ==
								"number" &&
						  JSON.parse(field.objectSchema).title.double
						? "double"
						: JSON.parse(field.objectSchema).title.type == "boolean"
						? "boolean"
						: "";
					this.fieldData.objectModel = objectModel[schema.title.id];
					if (
						schema.title.type == constant.type.number &&
						!schema.title.double
					) {
						this.fieldData.objectModel = numeral(
							objectModel[schema.title.id],
						).format();
					}
					if (schema.title.format == constant.type.date) {
						if (isNaN(objectModel[schema.title.id])) {
							this.fieldData.objectModel =
								objectModel[schema.title.id];
						} else {
							this.fieldData.objectModel = moment(
								(objectModel[schema.title.id] - (25567 + 1)) *
									86400 *
									1000,
							).format(this.$t("format.date"));
						}
					}
					if (
						schema.title.Headers &&
						Array.isArray(objectModel[schema.title.id])
					) {
						let headers = JSON.parse(schema.title.Headers);
						let hasSumRow = false;
						let sumRow = {
							sumRow: true,
						};
						for (let header of headers) {
							let stt = 1;
							let sum = 0;
							for (let row of objectModel[schema.title.id]) {
								if (header.type == constant.type.number) {
									row[header.value] = numeral(
										row[header.value],
									).format();
								}
								if (header.type == constant.type.date) {
									if (!isNaN(row[header.value])) {
										row[header.value] = moment(
											(row[header.value] - (25567 + 1)) *
												86400 *
												1000,
										).format(this.$t("format.date"));
									}
								}
								if (header.value2) {
									try {
										let tmp = Object.assign({}, row);
										tmp = this.formatPropsToNumber(tmp);
										row[header.value] = parser.evaluate(
											header.value2,
											tmp,
										);
										row[header.value] = numeral(
											row[header.value],
										).format();
									} catch (e) {
										console.log(e);
									}
								}
								if (header.sum) {
									hasSumRow = true;
									sum += numeral(row[header.value]).value();
								}
								if (header.stt) {
									row[header.value] = stt;
									stt++;
								}
							}
							if (header.sum) {
								sumRow[header.value] =
									this.$t("label.total") +
									": " +
									numeral(sum).format();
							} else {
								sumRow[header.value] = "";
							}
						}
						if (this.FEATURE.SUM_TOTAL_IN_TABLE && hasSumRow) {
							objectModel[schema.title.id].push(sumRow);
						}
						this.fieldData.objectModel = JSON.stringify(
							objectModel[schema.title.id],
						);
					}
					// (this.fieldData.objectModel =
					// 	typeof objectModel[key] == "object"
					// 		? JSON.stringify(objectModel[key])
					// 		: objectModel[key]),
					this.fieldDataAll.push(this.fieldData);
				} catch (e) {
					console.log(e);
				}
			}
			let response;
			response = await globalService.postData_Async(
				administratorAPI.API_CreateAllFieldDataByRequestDataId(),
				this.fieldDataAll,
			);

			if (!response || !response.state) {
				return;
			}
			await this.UpdateFieldData(response.data);
			response = null;
			this.fieldDataAll = [];
		},
		async UpdateFieldData(value) {
			try {
				let response;

				response = await globalService.postData_Async(
					administratorAPI.API_UpdateAllFieldDataByRequestDataId_SaveAll(
						this.requestData.id,
						true,
					),
					value,
				);

				if (!response) {
					return [];
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
	min-width: 1094px !important;
}
</style>
