<template>
	<v-card elevation="0" class="p-2">
		<v-dialog max-width="60vw" persistent v-model="editRequestGroupDialog">
			<EditRequestGroupVue @close="onClose" @save="onSaveRequestGroup" />
		</v-dialog>
		<v-dialog max-width="60vw" persistent v-model="editRequestTypeDialog">
			<EditRequestTypeVue @close="onClose" @save="onSaveRequestType" />
		</v-dialog>
		<v-dialog width="80vw" v-model="dialogSite" persistent>
			<ListSite @close="onClose" @saveSite="onSaveSite"> </ListSite>
		</v-dialog>
		<v-form ref="form" class="mt-4">
			<v-row @click="closeList()">
				<v-col cols="6">
					<v-row class="mt-2">
						<v-col cols="11" md="11">
							<strong>
								{{ $t("label.request_group") }}
								<span class="text-red-500">
									{{ $t("label.star") }}
								</span>
							</strong>
							<v-divider class="mb-2"></v-divider>
						</v-col>
						<v-col cols="11" md="11">
							<v-combobox
								ref="requestGroup"
								v-model="m_requestDto.requestGroup"
								:items="requestGroups"
								item-text="requestGroupName"
								outlined
								prepend-inner-icon="mdi-magnify"
								dense
								@change="changeRG"
								required
								:error-messages="errorMessageRequestGroupName"
								maxLength="255"
							>
								<template v-slot:label>
									{{ $t("label.request_group") }}
									<span class="text-red-500">
										{{ $t("label.star") }}
									</span>
								</template>
							</v-combobox>
						</v-col>
						<v-col cols="1" md="1">
							<v-btn
								icon
								color="blue darken-1"
								@click="openEditRequestGroup()"
							>
								<v-icon>mdi-plus-circle</v-icon>
							</v-btn>
						</v-col>
					</v-row>
				</v-col>
				<v-col cols="6">
					<v-row class="mt-2">
						<v-col cols="11" md="11">
							<strong>
								{{ $t("Loại yêu cầu") }}
								<span class="text-red-500">
									{{ $t("label.star") }}
								</span>
							</strong>
							<v-divider class="mb-2"></v-divider>
						</v-col>

						<v-col cols="11" md="11">
							<v-combobox
								ref="requestType"
								v-model="m_requestDto.requestType"
								:items="requestTypes"
								item-text="requestTypeName"
								outlined
								dense
								@change="changeRT"
								required
								prepend-inner-icon="mdi-magnify"
								:error-messages="errorMessageRequestTypeName"
								maxLength="255"
							>
								<template v-slot:label>
									{{ $t("label.request_type") }}
									<span class="text-red-500">
										{{ $t("label.star") }}
									</span>
								</template>
							</v-combobox>
						</v-col>
						<v-col cols="1" md="1">
							<v-btn
								icon
								color="blue darken-1"
								@click="openEditRequestType()"
							>
								<v-icon>mdi-plus-circle</v-icon>
							</v-btn>
						</v-col>
					</v-row>
				</v-col>
			</v-row>
			<v-row v-if="FEATURE.ADD_DATA_ROOM">
				<v-col cols="6">
					<v-row>
						<v-col>
							<strong>
								{{ $t("label.config_dr") }}
							</strong>
							<v-divider class="mb-2"></v-divider>
						</v-col>
					</v-row>
					<v-row>
						<v-col cols="11">
							<v-text-field
								readonly
								outlined
								dense
								hide-details
								@click="openDialogSite"
								placeholder="--Chọn--"
								v-model="m_requestDto.dataRoomPath"
							>
							</v-text-field>
						</v-col>
						<v-col cols="1" md="1">
							<v-btn
								icon
								color="blue darken-1"
								@click="openDialogSite"
							>
								<v-icon>mdi-plus-circle</v-icon>
							</v-btn>
						</v-col>
					</v-row>
				</v-col>
			</v-row>
			<v-row @click="closeList()">
				<v-col cols="6">
					<v-row class="mt-2">
						<v-col cols="11" md="11">
							<strong
								>{{ $t("label.application_process") }}
								<span class="text-red-500">
									{{ $t("label.star") }}
								</span>
							</strong>
							<v-divider class="mb-2"></v-divider>
						</v-col>
						<v-col cols="11">
							<vue-select-list
								:items="processInfos"
								:selected="m_requestDto.processInfos"
								keyName="id"
								valueName="processName"
								@localUpdate="
									(v) => {
										m_requestDto.processInfos = v;
									}
								"
								@scrollReachEnd="loadProcessInfo"
							>
							</vue-select-list>
						</v-col>
					</v-row>
				</v-col>
				<v-col cols="6">
					<v-row class="mt-2">
						<v-col cols="11" md="11">
							<strong>
								{{ $t("label.application_form") }}
								<!-- <span class="text-red-500">
									{{ $t("label.star") }}
								</span> -->
							</strong>
							<v-divider class="mb-2"></v-divider>
						</v-col>
						<v-col cols="11">
							<vue-select-list
								:items="templateForms"
								:selected="m_requestDto.templateForms"
								keyName="id"
								valueName="templateFormName"
								@localUpdate="
									(v) => {
										m_requestDto.templateForms = v;
									}
								"
								@scrollReachEnd="loadTemplateForms"
							>
							</vue-select-list>
						</v-col>
					</v-row>
				</v-col>
			</v-row>
			<v-row @click="closeList()">
				<v-col cols="6">
					<v-row class="mt-2">
						<v-col cols="11" md="11">
							<strong>
								{{ $t("label.code_generation_rules") }}
								<span class="text-red-500">
									{{ $t("label.star") }}
								</span>
							</strong>
							<v-divider class="mb-2"></v-divider>
						</v-col>
						<v-col cols="11" sm="11" md="11">
							<div class="rounded border-2 p-2 w-full">
								<v-chip
									class="m-2"
									v-for="(item, index) in ruleGenerateCodes"
									:key="index + item"
								>
									{{ item }}
									<v-icon @click="delete_item_list(index)"
										>mdi-close-circle</v-icon
									>
								</v-chip>
								<v-text-field
									v-model="upKeyCode"
									@keyup="keyUpRule($event)"
									dense
									:outlined="false"
									@click="
										toggleList();
										action($event);
										false;
									"
								></v-text-field>
							</div>
							<div>
								<span>{{ $t("") }}</span>
							</div>
							<v-card
								elevation="2"
								v-if="toggle_list"
								class="
									generateCodeOption
									overflow-scroll overflow-x-hidden
									h-80
								"
								@click="
									action($event);
									false;
								"
							>
								<v-list-item-group>
									<v-list-item
										v-for="(item, i) in generateCodeOption"
										:key="i"
										@click="clickItem(item)"
									>
										{{ item }}
									</v-list-item>
								</v-list-item-group>
							</v-card>
						</v-col>
					</v-row>
				</v-col>
				<!-- <v-col cols="6" v-if="!FEATURE.IMPORT_CODE_FILE_NAME">
					<v-row class="mt-2">
						<v-col cols="11" md="11">
							<strong>
								{{ $t("label.code_generation_filename") }}
							</strong>
							<v-divider class="mb-2"></v-divider>
						</v-col>
						<v-col
							cols="11"
							sm="11"
							md="11"
							class="ruleGenerateCodes"
						>
							<div class="rounded border-2 p-2 w-full">
								<v-chip
									class="m-2"
									v-for="(
										item, index
									) in ruleGenerateCodeFileName"
									:key="index + item"
								>
									{{ item }}
									<v-icon
										@click="
											delete_item_code_filename(index)
										"
										>mdi-close-circle</v-icon
									>
								</v-chip>
								<v-text-field
									v-model="textCodeFileName"
									@keyup="keyUpRuleFilename($event)"
									dense
									:outlined="false"
									@click="
										toggleListCodeFilename();
										action($event);
										false;
									"
								></v-text-field>
							</div>
							<div>
								<span>{{ $t("") }}</span>
							</div>
							<v-card
								elevation="2"
								v-if="toggle_list_code_filename"
								class="
									generateCodeOption
									overflow-scroll overflow-x-hidden
									h-80
								"
								@click="
									action($event);
									false;
								"
							>
								<v-list-item-group>
									<v-list-item
										v-for="(
											item, i
										) in generateCodeFilename"
										:key="i"
										@click="clickItemCodeFilename(item)"
									>
										{{ item }}
									</v-list-item>
								</v-list-item-group>
							</v-card>
						</v-col>
					</v-row>
				</v-col> -->
			</v-row>
			<v-row>
				<v-col>
					<v-spacer></v-spacer>
					<v-btn
						color="blue darken-1"
						dark
						class="rounded-0"
						@click="save()"
					>
						<v-icon> mdi-content-save</v-icon>
						{{ $t("button.save") }}
					</v-btn></v-col
				>
			</v-row>
		</v-form>
	</v-card>
</template>

<script>
import RequestDto from "@/models/request.dto";
import globalService from "@/services/global.service";
import administratorAPI from "../administrator.api";
import EditRequestGroupVue from "../RequestGroup/EditRequestGroup.vue";
import EditRequestTypeVue from "../RequestType/EditRequestType.vue";
import moment from "moment";
import constant from "@/common/constant";
import ListSite from "../../khai-phieu-yeu-cau/ViewSites/ListSite.vue";
import store from "@/store";
export default {
	name: "EditprocessInfosGeneralInformationVue",
	components: {
		EditRequestGroupVue,
		EditRequestTypeVue,
		ListSite,
	},
	props: {
		requestDto: {},
		isSaved: {},
		requestGroupCreate: {},
	},
	data() {
		return {
			upKeyCode: "",
			textCodeFileName: "",
			toggle_list: false,
			toggle_list_code_filename: false,
			requestGroups: [],
			requestTypes: [],
			ruleGenerateCodes: [],
			// ruleGenerateCodeFileName: [],
			generateCodeOption: [],
			generateCodeFilename: [],
			//
			errorMessageRequestGroupName: "",
			errorMessageRequestTypeName: "",
			errorMessageRuleGenerateCode: "",
			////
			editRequestGroupDialog: false,
			editRequestTypeDialog: false,
			editTemplateFormDialog: false,
			templateFormGridDialog: false,
			dialogSite: false,
			maxLengthRules: [
				(v) =>
					(typeof v !== "object" && v.length < 255) ||
					this.$t("error.max_length_255"),
			],
			m_requestDto: RequestDto,
			processInfos: [],
			templateForms: [],
			isSaving: false,
			errorrequestName: "",
			m_isSaved: 0,
			m_requestGroupCreate: null,
			listRequesst: [],
			isRequestUsed: false,
			processInfoPage: 0,
			templateFormPage: 0,
			isLoading: false,
			pageNumber: 0,
			pageNumberTemp: 0,
			formError: false,
		};
	},
	watch: {
		requestDto(value) {
			if (value) {
				this.m_requestDto = value;
			}
		},
		requestGroupCreate(value) {
			if (value) {
				this.m_requestGroupCreate = value;
				this.m_requestDto.requestGroup = this.m_requestGroupCreate;
			}
		},
		"m_requestDto.processInfos"(value, oldValue) {
			if (!value) {
				value = [];
				this.m_requestDto.processInfos = [];
			}
			if (oldValue.length == value.length) return;
			this.m_requestDto.processInfos = value.filter((entry) => {
				if (typeof entry == "object") {
					return true;
				}
			});
		},
		"m_requestDto.templateForms"(value, oldValue) {
			if (oldValue.length == value.length) return;
			this.m_requestDto.templateForms = value.filter((entry) => {
				if (typeof entry == "object") {
					return true;
				}
			});
		},
		async isSaved(value) {
			this.m_isSaved = value;
			if (this.m_isSaved.state == 1) {
				this.save();
			}
		},
		m_requestDto(val) {
			val || this.resetRequestDto();
			if (val) {
				this.ruleGenerateCodes = [];
				// this.ruleGenerateCodeFileName = [];
				if (
					this.m_requestDto.ruleGenerateCode &&
					this.m_requestDto.ruleGenerateCode.length > 0
				) {
					let arr = this.m_requestDto.ruleGenerateCode
						.split("$")
						.filter((ele) => ele.length > 0);
					for (let i in arr) {
						let itemTextCode = arr[i];
						if (
							itemTextCode[0] == "{" &&
							itemTextCode[itemTextCode.length - 1] != "}"
						) {
							let index = itemTextCode.indexOf("}");
							this.ruleGenerateCodes.push(
								itemTextCode.slice(1, index),
							);
							this.ruleGenerateCodes.push(
								itemTextCode.slice(
									index + 1,
									itemTextCode.length,
								),
							);
						}
						if (
							itemTextCode[0] == "{" &&
							itemTextCode[itemTextCode.length - 1] == "}"
						) {
							this.ruleGenerateCodes.push(
								itemTextCode.slice(1, itemTextCode.length - 1),
							);
						}
						if (
							itemTextCode[0] != "{" &&
							itemTextCode[itemTextCode.length - 1] == "}"
						) {
							let index = itemTextCode.indexOf("{");
							this.ruleGenerateCodes.push(
								itemTextCode.slice(0, index),
							);
							this.ruleGenerateCodes.push(
								itemTextCode.slice(
									index,
									itemTextCode.length - 1,
								),
							);
						}
						if (
							itemTextCode[0] != "{" &&
							itemTextCode[itemTextCode.length - 1] != "}"
						) {
							this.ruleGenerateCodes.push(
								itemTextCode.slice(0, itemTextCode.length),
							);
						}
					}
					this.ruleGenerateCodes = this.ruleGenerateCodes.filter(
						(ele) => ele.length > 0,
					);
				}
				// if (
				// 	this.m_requestDto.ruleGenerateAttachName &&
				// 	this.m_requestDto.ruleGenerateAttachName.length > 0
				// ) {
				// 	let arr = this.m_requestDto.ruleGenerateAttachName
				// 		.split("$")
				// 		.filter((ele) => ele.length > 0);
				// 	for (let i in arr) {
				// 		let itemTextCode = arr[i];
				// 		if (
				// 			itemTextCode[0] == "{" &&
				// 			itemTextCode[itemTextCode.length - 1] != "}"
				// 		) {
				// 			let index = itemTextCode.indexOf("}");
				// 			this.ruleGenerateCodeFileName.push(
				// 				itemTextCode.slice(1, index),
				// 			);
				// 			this.ruleGenerateCodeFileName.push(
				// 				itemTextCode.slice(
				// 					index + 1,
				// 					itemTextCode.length,
				// 				),
				// 			);
				// 		}
				// 		if (
				// 			itemTextCode[0] == "{" &&
				// 			itemTextCode[itemTextCode.length - 1] == "}"
				// 		) {
				// 			this.ruleGenerateCodeFileName.push(
				// 				itemTextCode.slice(1, itemTextCode.length - 1),
				// 			);
				// 		}
				// 		if (
				// 			itemTextCode[0] != "{" &&
				// 			itemTextCode[itemTextCode.length - 1] == "}"
				// 		) {
				// 			let index = itemTextCode.indexOf("{");
				// 			this.ruleGenerateCodeFileName.push(
				// 				itemTextCode.slice(0, index),
				// 			);
				// 			this.ruleGenerateCodeFileName.push(
				// 				itemTextCode.slice(
				// 					index,
				// 					itemTextCode.length - 1,
				// 				),
				// 			);
				// 		}
				// 		if (
				// 			itemTextCode[0] != "{" &&
				// 			itemTextCode[itemTextCode.length - 1] != "}"
				// 		) {
				// 			this.ruleGenerateCodeFileName.push(
				// 				itemTextCode.slice(0, itemTextCode.length),
				// 			);
				// 		}
				// 	}
				// 	this.ruleGenerateCodeFileName = this.ruleGenerateCodeFileName.filter(
				// 		(ele) => ele.length > 0,
				// 	);
				// }
			}
		},
	},
	created() {
		this.$Progress.start();
		this.m_isSaved = this.isSaved;
		this.init();
	},
	mounted() {
		this.$Progress.finish();
	},
	computed: {
		form() {
			return {
				requestGroup: this.m_requestDto.requestGroup,
				requestType: this.m_requestDto.requestType,
			};
		},
	},
	methods: {
		async init() {
			this.m_requestDto = this.requestDto;
			this.m_requestGroupCreate = this.requestGroupCreate;
			if (this.m_requestGroupCreate != null) {
				this.m_requestDto.requestGroup = this.m_requestGroupCreate;
			}
			await this._requestGroups();
			await this._requestTypes();
			await this.getAllgenerateCodeOption();
			// await this.getAllCodeAttachName();
			await this.getAllProcessInfoCustom();
			await this.getAllTemplateCustom();
			// this.processInfos = await this._processInfos();
			// this.templateForms = await this._templateForms();
		},
		// async getAllCodeAttachName() {
		// 	try {
		// 		let response = await globalService.getData_Async(
		// 			administratorAPI.API_GetCodeAttachName(),
		// 		);
		// 		if (!response || !response.state) {
		// 			return;
		// 		}
		// 		this.generateCodeFilename = response.data;
		// 	} catch (error) {
		// 		console.log(error);
		// 	}
		// },
		remove(item) {
			let index = this.m_requestDto.processInfos.indexOf(item);
			this.m_requestDto.processInfos.splice(index, 1);
		},
		async _processInfos() {
			let response;
			try {
				response = await globalService.getData_Async(
					administratorAPI.API_GetAllProcessInfoIgnoreFile(),
				);
				if (!response) {
					return this.toastError(this.$t("error.load"));
				}
				if (!response.state) {
					return this.toastError(this.$t("error.load"));
				}
				return response.data.filter((entry) => {
					return !entry.isDelete && entry.isActive;
				});
			} catch (error) {
				this.toastError(error.message);
			}
		},
		async _templateForms() {
			let response;
			try {
				response = await globalService.getData_Async(
					administratorAPI.API_GetAllTemplateFormIgoneField(),
				);
				if (!response) {
					return this.toastError(this.$t("error.load"));
				}
				if (!response.state) {
					return this.toastError(this.$t("error.load"));
				}
				return response.data.filter((entry) => {
					return !entry.isDelete && entry.isActive;
				});
			} catch (error) {
				this.toastError(error.message);
			}
		},

		resetRequestDto() {
			this.m_requestDto = RequestDto;
		},

		onClose(value) {
			if (value) {
				this.editRequestGroupDialog = false;
				this.editRequestTypeDialog = false;
				this.editTemplateFormDialog = false;
				this.templateFormGridDialog = false;
				this.dialogSite = false;
			}
		},
		onSaveRequestGroup(value) {
			this.requestGroups.push(value);
			this._requestGroups();
		},
		onSaveRequestType(value) {
			this.requestTypes.push(value);
			this._requestTypes();
		},

		async _requestGroups() {
			let response;
			try {
				response = await globalService.getData_Async(
					administratorAPI.API_GetAllRequestGroup(),
				);
				if (!response) {
					return [];
				}
				if (!response.state) {
					return [];
				}
				this.requestGroups = response.data.filter((entry) => {
					return !entry.isDelete && entry.isActive;
				});
				this.requestGroups_full = response.data.filter((entry) => {
					return !entry.isDelete;
				});
				this.requestGroups = this.sortList(this.requestGroups);
			} catch (error) {
				this.toastError(error);
				return [];
			}
		},

		async _requestTypes() {
			let response;
			try {
				response = await globalService.getData_Async(
					administratorAPI.API_GetAllRequestType(),
				);
				if (!response) {
					return [];
				}
				if (!response.state) {
					return [];
				}
				this.requestTypes = response.data.filter((entry) => {
					return !entry.isDelete && entry.isActive;
				});
				this.requestTypes_full = response.data.filter((entry) => {
					return !entry.isDelete;
				});
				this.requestTypes = this.sortList(this.requestTypes);
			} catch (error) {
				this.toastError(error);
				return [];
			}
		},

		//
		openEditRequestGroup() {
			this.editRequestGroupDialog = true;
		},

		openEditRequestType() {
			this.editRequestTypeDialog = true;
		},

		//
		sortList(arr) {
			return arr.sort((a, b) => {
				return (
					moment(b.createdDate).toDate().getTime() -
					moment(a.createdDate).toDate().getTime()
				);
			});
		},

		///
		deselectGenerateCode(item) {
			this.ruleGenerateCodes.splice(
				this.ruleGenerateCodes.indexOf(item),
				1,
			);
		},
		//

		async getAllgenerateCodeOption() {
			let response;
			try {
				response = await globalService.getData_Async(
					"/api/_all/generate-code-option",
				);
				if (!response) {
					return this.toastError(this.$t("error.load"));
				}
				if (!response.state) {
					return this.toastError(this.$t("error.load"));
				}
				this.generateCodeOption = response.data;
				// console.log("this.generateCodeOption", this.generateCodeOption)
			} catch (error) {
				this.toastError(error.message);
			}
		},

		/// save

		async save() {
			this.formError = false;
			for (let key of Object.keys(this.form)) {
				if (
					!this.form[key] ||
					this.form[key] == null ||
					typeof this.form[key] !== "object"
				) {
					this.formError = true;
					this.$refs[key].focus();
				}

				this.$refs[key].validate(true);
				if (this.formError) {
					if (key == "requestGroup") {
						return (this.errorMessageRequestGroupName =
							this.$t("message.msg_1"));
					}
					if (key == "requestType") {
						return (this.errorMessageRequestTypeName =
							this.$t("message.msg_1"));
					}
				}
			}
			// if (this.ruleGenerateCodes.length == 0) {
			// 	return (this.errorMessageRuleGenerateCode =
			// 		this.$t("message.msg_1"));
			// }

			if (this.m_requestDto.processInfos.length == 0) {
				return this.toastError(
					this.$t(
						"message.the_application_process_cannot_be_left_blank",
					),
				);
			}

			if (
				this.ruleGenerateCodes.length == 0 &&
				this.m_requestDto.requestGroup.requestGroupName !=
					this.$t("enum.CVD")
			) {
				return this.toastError(
					this.$t("message.code_generation_rules_cannot_be_empty"),
				);
			}

			// if (this.m_requestDto.templateForms.length == 0) {
			// 	return this.toastError(
			// 		this.$t("message.application_form_cannot_be_empty"),
			// 	);
			// }

			if (this.isRequestUsed) {
				this.errorMessageRequestTypeName = this.$t(
					"message.this_request_type_has_been_configured",
				);
				return;
			}

			let response;
			let editing = !!this.m_requestDto.id;
			if (this.isSaving) {
				return;
			}
			this.isSaving = true;
			this.m_requestDto.modified = this.getUserInfo();
			this.m_requestDto.modifiedDate = new Date();
			this.m_requestDto.requestName =
				this.m_requestDto.requestType.requestTypeName;
			try {
				if (editing) {
					// this.ruleGenerateCodes = this.ruleGenerateCodes.map(
					// 	(ele) => (ele = "${" + ele + "}"),
					// );
					if (this.ruleGenerateCodes.length > 0) {
						for (let i in this.ruleGenerateCodes) {
							if (
								this.generateCodeOption.indexOf(
									this.ruleGenerateCodes[i],
								) != -1
							) {
								this.ruleGenerateCodes[i] =
									"${" + this.ruleGenerateCodes[i] + "}";
							}
						}
					}
					this.m_requestDto.ruleGenerateCode =
						this.ruleGenerateCodes.join("");

					// if (this.ruleGenerateCodeFileName.length > 0) {
					// 	for (let i in this.ruleGenerateCodeFileName) {
					// 		if (
					// 			this.generateCodeOption.indexOf(
					// 				this.ruleGenerateCodeFileName[i],
					// 			) != -1
					// 		) {
					// 			this.ruleGenerateCodeFileName[i] =
					// 				"${" +
					// 				this.ruleGenerateCodeFileName[i] +
					// 				"}";
					// 		}
					// 	}
					// }
					// this.m_requestDto.ruleGenerateAttachName =
					// 	this.ruleGenerateCodeFileName.join("");
					response = await globalService.putData_Async(
						administratorAPI.API_SaveRequest(this.m_requestDto.id),
						this.m_requestDto,
					);
					if (!response) {
						return this.toastError(this.$t("message.update_error"));
					}
					if (!response.state) {
						return this.toastError(this.$t("message.update_error"));
					}
					this.toastSuccess(this.$t("message.update_success"));
				} else {
					// this.ruleGenerateCodes = this.ruleGenerateCodes.map(
					// 	(ele) => (ele = "${" + ele + "}"),
					// );
					if (this.ruleGenerateCodes.length > 0) {
						for (let i in this.ruleGenerateCodes) {
							if (
								this.generateCodeOption.indexOf(
									this.ruleGenerateCodes[i],
								) != -1
							) {
								this.ruleGenerateCodes[i] =
									"${" + this.ruleGenerateCodes[i] + "}";
							}
						}
					}
					// if (this.ruleGenerateCodeFileName.length > 0) {
					// 	for (let i in this.ruleGenerateCodeFileName) {
					// 		if (
					// 			this.generateCodeOption.indexOf(
					// 				this.ruleGenerateCodeFileName[i],
					// 			) != -1
					// 		) {
					// 			this.ruleGenerateCodeFileName[i] =
					// 				"${" +
					// 				this.ruleGenerateCodeFileName[i] +
					// 				"}";
					// 		}
					// 	}
					// }
					// this.m_requestDto.ruleGenerateAttachName =
					// 	this.ruleGenerateCodeFileName.join("");
					this.m_requestDto.ruleGenerateCode =
						this.ruleGenerateCodes.join("");
					this.m_requestDto.created = this.getUserInfo();
					this.m_requestDto.createdName =
						this.getUserInfo().createdName;
					this.m_requestDto.createdDate = new Date();
					response = await globalService.postData_Async(
						administratorAPI.API_CreateRequest(),
						this.m_requestDto,
					);
					if (!response) {
						return this.toastError(this.$t("message.add_error"));
					}
					if (!response.state) {
						return this.toastError(this.$t("message.add_error"));
					}
					this.toastSuccess(this.$t("message.add_success"));
				}

				this.m_requestDto = response.data;
				this.$emit("save", this.m_requestDto);
			} catch (error) {
				this.toastError(error);
			} finally {
				this.isSaving = false;
			}
		},

		///

		changeRG() {
			let check = 0;
			for (const requestGroup of this.requestGroups) {
				check = 0;
				if (
					this.m_requestDto.requestGroup ==
					requestGroup.requestGroupName
				) {
					this.m_requestDto.requestGroup = requestGroup;
					check = check + 1;
					break;
				}
			}
			if (
				check == 0 &&
				typeof this.m_requestDto.requestGroup == "string" &&
				this.m_requestDto.requestGroup.length > 0
			) {
				this.errorMessageRequestGroupName = this.$t(
					"error.correct_information",
				);
			}
			if (typeof this.m_requestDto.requestGroup == "object") {
				this.errorMessageRequestGroupName = "";
			}
		},
		changeRT() {
			let check = 0;
			for (const requestType of this.requestTypes) {
				check = 0;
				if (
					this.m_requestDto.requestType == requestType.requestTypeName
				) {
					this.m_requestDto.requestType = requestType;
					check = check + 1;
					break;
				}
			}
			if (
				check == 0 &&
				typeof this.m_requestDto.requestType == "string" &&
				this.m_requestDto.requestType.length > 0
			) {
				this.errorMessageRequestTypeName = this.$t(
					"error.correct_information",
				);
			}
			if (typeof this.m_requestDto.requestType == "object") {
				this.errorMessageRequestTypeName = "";
			}

			this.checkRequestIsUsed(this.m_requestDto.requestType.id);
		},
		changeRule() {
			if (this.ruleGenerateCodes.length == 0) {
				this.errorMessageRuleGenerateCode = this.$t(
					"error.correct_information",
				);
			}
			if (this.ruleGenerateCodes.length > 0) {
				this.errorMessageRuleGenerateCode = "";
			}
		},
		async checkRequestIsUsed(id) {
			if (!id) {
				return;
			}

			try {
				let response = await globalService.getData_Async(
					administratorAPI.API_CheckExistRequestByRequestType(id),
				);
				if (!response.data) {
					this.errorMessageRequestTypeName = "";
					this.isRequestUsed = false;
					return false;
				}
				if (response.data && response.data.id != this.m_requestDto.id) {
					this.errorMessageRequestTypeName = this.$t(
						"message.this_request_type_has_been_configured",
					);
					this.isRequestUsed = true;
					return true;
				}
			} catch (error) {
				this.toastError(error);
			}
		},
		clickItem(item) {
			this.ruleGenerateCodes.push(item);
		},
		// clickItemCodeFilename(item) {
		// 	this.ruleGenerateCodeFileName.push(item);
		// },
		toggleList() {
			this.toggle_list = true;
		},
		toggleListCodeFilename() {
			this.toggle_list_code_filename = true;
		},
		delete_item_list(index) {
			this.ruleGenerateCodes.splice(index, 1);
		},
		// delete_item_code_filename(index) {
		// 	this.ruleGenerateCodeFileName.splice(index, 1);
		// },
		async keyUpRule(event) {
			if (event.keyCode == 13 && event.target.value.trim().length > 0) {
				await this.ruleGenerateCodes.push(event.target.value);
				this.upKeyCode = "";
			}
		},
		// keyUpRuleFilename(event) {
		// 	if (event.keyCode == 13 && event.target.value.trim().length > 0) {
		// 		this.ruleGenerateCodeFileName.push(event.target.value);
		// 		this.textCodeFileName = "";
		// 	}
		// },
		action(event) {
			event.stopPropagation();
		},
		closeList() {
			this.toggle_list = false;
			this.toggle_list_code_filename = false;
		},
		closeListCodeFileName() {
			this.toggle_list = false;
		},
		loadProcessInfo(event) {
			if (!this.isLoading && event) {
				this.isLoading = true;
				this.pageNumber = this.pageNumber + 1;
				this.getAllProcessInfoCustom();
			}
		},
		async getAllProcessInfoCustom() {
			let response;

			try {
				let reqBody = {
					isDelete: "false",
				};
				response = await globalService.postData_Async(
					administratorAPI.API_GetAllProcessInfoCustom(
						this.pageNumber,
						constant.page_size,
					),
					reqBody,
				);
				if (!response) {
					return;
				}
				if (response.data.listData && response.data.listData.length) {
					response.data.listData.filter((entry) => {
						if (this.processInfos.indexOf(entry) != false) {
							this.processInfos.push(entry);
						}
					});
				}
				if (response.data.listData.length) {
					this.isLoading = false;
				} else {
					this.isLoading = true;
				}
			} catch (error) {
				this.toastError(error);
			}
		},
		loadTemplateForms(event) {
			if (!this.isLoading && event) {
				this.isLoading = true;
				this.pageNumberTemp = this.pageNumberTemp + 1;
				this.getAllTemplateCustom();
			}
		},
		async getAllTemplateCustom() {
			let response;

			try {
				let reqBody = {
					isDelete: "false",
				};
				response = await globalService.postData_Async(
					administratorAPI.API_GetAllTemplateCustom(
						this.pageNumberTemp,
						constant.page_size,
					),
					reqBody,
				);
				if (!response) {
					return;
				}
				if (response.data.listData && response.data.listData.length) {
					response.data.listData.filter((entry) => {
						if (this.templateForms.indexOf(entry) != false) {
							this.templateForms.push(entry);
						}
					});
				}
				if (response.data.listData.length) {
					this.isLoading = false;
				} else {
					this.isLoading = true;
				}
			} catch (error) {
				this.toastError(error);
			}
		},
		openDialogSite() {
			this.dialogSite = true;
		},
		onSaveSite(value) {
			if (!value) return;
			this.m_requestDto.dataRoomPath = null;
			this.m_requestDto.dataRoomId = value.id;
			this.m_requestDto.dataRoomPath = value.webUrl;
			if (value.parentReference) {
				this.m_requestDto.dataRoomDriveId =
					value.parentReference?.driveId;
			}
			if (store.state.config.features.loadByList) {
				if (value.drive) {
					this.m_requestDto.dataRoomId = value.drive.id;
					this.m_requestDto.dataRoomPath = value.drive.webUrl;
					if (value.drive.parentReference) {
						this.m_requestDto.dataRoomDriveId =
							value.drive.parentReference?.driveId;
					}
				}
				if (value.driveItem) {
					this.m_requestDto.dataRoomId = value.driveItem.id;
					this.m_requestDto.dataRoomPath = value.driveItem.webUrl;
					if (value.driveItem.parentReference) {
						this.m_requestDto.dataRoomDriveId =
							value.driveItem.parentReference?.driveId;
					}
				}
			}
		},
	},
};
</script>

<style>
/* .ruleGenerateCodes{
	position: relative;
}

.generateCodeOption {
	position: absolute;
	top: 50%;
	right: 0;
	left: 0;
	background: white;
} */
</style>
