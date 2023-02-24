<template>
	<v-card>
		<v-dialog max-width="60vw" v-model="openUserInfosRequestData" persistent>
			<UserInfosRequestData
				@save="onSave"
				@close="onClose"
			></UserInfosRequestData>
		</v-dialog>
		<v-row>
			<v-col cols="12" md="3">
				<!-- <v-select
					:menu-props="{ bot: true, offsetY: true }"
					v-model="s_processData"
					item-text="processDataName"
					:items="listProcessData"
					:item-value="(item) => item"
					outlined
					dense
				></v-select> -->
				<v-combobox
					maxLength="255"
					:label="$t('label.application_process')"
					outlined
					hide-details
					dense
					height="45px"
					v-model="s_processData"
					:items="listProcessData"
					item-text="processDataName"
					class="pt-5"
				>
					<template v-slot:label>
						{{ $t("label.application_process") }}
						<span class="text-red-600">{{ $t("label.star") }}</span>
					</template>
					<!-- <template
						v-slot:selection="{ attrs, item, parent, selected }"
					>
						<v-chip
							v-if="item === Object(item)"
							v-bind="attrs"
							:input-value="selected"
							label
							class="mt-2 rounded-pill"
						>
							<span class="text-black">
								{{ item.processDataName }}
							</span>
							<v-icon small @click="parent.selectItem(item)">
							</v-icon>
						</v-chip>
					</template> -->
				</v-combobox>
			</v-col>
			<v-col>
				<v-btn class="float-right" text @click="restoreStepInProcess">
					<v-icon>mdi-restart</v-icon>
					{{ $t("button.restore") }}
				</v-btn>
			</v-col>
		</v-row>
		<v-divider></v-divider>
		<v-row>
			<v-col>
				<v-card-text v-if="stepInProcess && stepInProcess.length > 0">
					<VuePerfectScrollbar class="scroll-area">
						<v-timeline align-top dense class="mx-40">
							<Container>
								<v-timeline-item
									v-for="(items, index) in stepInProcess"
									:key="items.id"
									small
									fill-dot
									left
									color="green darken-5"
								>
									<template v-slot:icon>
										<div class="gr_button">
											<v-btn
												class="red"
												dark
												small
												icon
												@click="removeRow(index)"
											>
												<v-icon>
													mdi-trash-can-outline
												</v-icon>
											</v-btn>
											<v-btn
												class="blue mt-1"
												dark
												small
												icon
												@click="addColumn(index)"
											>
												<v-icon> mdi-plus </v-icon>
											</v-btn>
										</div>
									</template>
									<div class="mb-2">
										<span
											class="
												text-h6 text-white
												rounded-pill
												green
												lighten-2
												px-10
												py-2
											"
										>
											Bước {{ index + 1 }}
										</span>
									</div>
									<Container>
										<v-card
											v-bind:class="{
												['rounded bordered ' +
												getClass(index)]: true,
											}"
											@click="clickToEdit(items)"
											:id="`step` + index"
										>
											<v-card-text>
												<v-form>
													<template>
														<v-row
															class="p-2"
															dense
														>
															<v-col
																cols="2"
																md="2"
															>
																{{
																	$t(
																		"label.processingTerm",
																	)
																}}
															</v-col>
															<v-col
																cols="2"
																md="2"
															>
																<v-text-field
																	solo
																	outlined
																	dense
																	:rules="[
																		rules.required,
																		rules.regex
																	]"
																	v-model="
																		items.processingTerm
																	"
																	:suffix="
																		$t(
																			'label.hours',
																		)
																	"
																>
																</v-text-field>
															</v-col>
															<v-col
																cols="1"
																md="1"
															>
															</v-col>
															<v-col
																cols="1"
																md="1"
															>
																{{
																	$t(
																		"label.step_name",
																	)
																}}
															</v-col>
															<v-col>
																<v-text-field
																	hide-details
																	v-model="
																		items.stepDataName
																	"
																	solo
																	:rules="[
																		rules.required,

																	]"
																	outlined
																	dense
																	maxLength="255"
																>
																</v-text-field>
																<!-- <span
                                  class="w-4"
                                  v-if="
                                    items.id
                                  "
                                >
                                  <v-select :menu-props="{ bot: true, offsetY: true }"
                                    v-model="
                                      items.stepDataName
                                    "
                                    :items="
                                      steps
                                    "
                                    item-text="stepName"
                                    hide-selected
                                    solo
                                    outlined
                                    dense
                                    clearable
                                  >
                                  </v-select>
                                </span>-->
															</v-col>
														</v-row>

														<v-row
															class="px-2"
															dense
														>
															<v-col
																cols="2"
																md="2"
															>
																{{
																	$t(
																		"label.handler",
																	)
																}}
															</v-col>
															<v-col
																cols="1"
																md="1"
															>
																<v-btn icon>
																	<v-icon
																		color="blue"
																		class="
																			text--blue
																		"
																		@click="
																			editUserInfosRequestData(
																				index,
																			)
																		"
																	>
																		mdi-account-plus
																	</v-icon>
																</v-btn>
															</v-col>
															<v-col>
																<span
																	v-for="(
																		item,
																		index
																	) of items.userInfos"
																	:key="
																		item.id
																	"
																>
																	<v-chip
																		color="grey lighten-5"
																		close
																		@click:close="
																			items.userInfos.splice(
																				index,
																				1,
																			)
																		"
																	>
																		<v-avatar
																			color="indigo mr-2"
																			size="36"
																		>
																			<span
																				class="
																					white--text
																				"
																			>
																				{{
																					getAvatarText(
																						item.fullName,
																					)
																				}}
																			</span>
																		</v-avatar>
																		{{
																			item.fullName
																		}}
																	</v-chip>
																</span>
															</v-col>
														</v-row>
													</template>
												</v-form>
											</v-card-text>
										</v-card>
									</Container>
								</v-timeline-item>
							</Container>
						</v-timeline>
					</VuePerfectScrollbar>
				</v-card-text>
			</v-col>
		</v-row>
	</v-card>
</template>

<script>
import globalService from "@/services/global.service";
import administratorAPI from "../../administrator/administrator.api";
import { Container } from "vue-dndrop";
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import UserInfosRequestData from "./UserInfosRequestDataV2.vue";
import StepDataDto from "@/models/step-data.dto";
import ProcessDataDTO from "@/models/process-data.dto";

export default {
	name: "VSMFEProcedureV3",
	components: {
		Container,
		VuePerfectScrollbar,
		UserInfosRequestData,
	},
	props: { requestDataV2: {}, isSaved: {} },
	watch: {
		requestDataV2(newValue) {
			this.m_requestDto = newValue;
		},
		async isSaved(value) {
			this.m_isSaved = value;
			if (this.m_isSaved.state) {
				await this.getStatusOfRequestData();
				if (!this.isStatusRequestData) {
					this.toastError(this.$t("error.no_request"));
					return;
				}
				await this.save();
			}
		},
		// s_processData() {
		// 	this.selectProcessData();
		// },
		s_processData(val) {
			if (val) {
				this.getStepInProcessesByID(val.id);
				this.checkSave++;
			}
		},
	},
	data() {
		return {
			itemIndex: -1,
			openFileRequestData: false,
			openUserInfosRequestData: false,
			m_requestDto: null,
			stepInProcess: [],
			defaultStepInProcess: [],
			s_processData: null,
			indexItems: 0,
			userFilters: [],
			showUser: [],
			arrDeleteStep: [],
			steps: [],
			defaultItem: StepDataDto,
			is_add: false,
			requestProcessData: [],
			rules: {
				required: (value) => !!value || this.$t("error.not_empty"),
				regex: (value) =>
					/^[0-9]{1,3}(\.[0-9]{1})?$/.test(value.trim()) ||
					this.$t("error.wrong_format_000_0"),
			},
			isSaving: false,
			statusRequestData: "",
			isStatusRequestData: false,
			STATUS_TRALAI_CODE: this.$t("status_code.Reject"),
			STATUS_DANGSOAN_CODE: this.$t("status_code.dang_soan"),
			listProcessInfos: [],
			listProcessData: [],
			processDataDTO: ProcessDataDTO,
			user_info: this.getUserInfo(),
			stepInProcesInFo: [],
			listRequestStepData: [],
			requestStepData: {},
			processData: null,
			checkSave: 0,
		};
	},
	async created() {
		this.m_requestDto = this.requestDataV2;
	},

	mounted() {
		this.load();
		this.m_isSaved = this.isSaved;
	},
	updated() {},
	methods: {
		async load() {
			//await this.getAllStep();
			await this.getProcessInfos();
			await this.getAllByProcesInfoId();
			await this.getStepInProcesses();
		},
		editUserInfosRequestData(index) {
			this.openUserInfosRequestData = true;
			this.itemIndex = index;
		},
		onClose() {
			this.openUserInfosRequestData = false;
			this.itemIndex = -1;
		},
		async getAllStep() {
			try {
				let response = await globalService.getData_Async(
					administratorAPI.API_GetAllSteps(),
				);
				if (!response) {
					return;
				}
				if (!response.state) {
					return;
				}
				this.steps = response.data.filter((entry) => {
					return !entry.isDelete && entry.isActive;
				});
				let emptyOb = {
					stepName: this.$t("label.empty"),
					id: null,
				};
				this.steps.unshift(emptyOb);
			} catch (error) {
				this.toastError(error);
				return;
			}
		},
		async getStepInProcesses() {
			let response;
			try {
				response = await globalService.getData_Async(
					administratorAPI.API_GetByCurrentSteps(
						this.m_requestDto.id,
					),
				);
				if (!response || !response.state) {
					return;
				}

				this.defaultStepInProcess = response.data.sort((a, b) => {
					return a.stepOrder - b.stepOrder;
				});
				this.stepInProcess = this.cloneArray(
					this.stepInProcess,
					this.defaultStepInProcess,
				);
				this.stepInProcess = this.stepInProcess.sort((a, b) => {
					return a.stepOrder - b.stepOrder;
				});
				this.listDeleteStepData = this.stepInProcess;
			} catch (error) {
				this.toastError(error);
				return;
			}
		},
		// async getStepInProcessesById() {
		// 	let response;
		// 	try {
		// 		response = await globalService.getData_Async(
		// 			administratorAPI.API_GetByCurrentSteps(
		// 				this.m_requestDto.id,
		// 			),
		// 		);
		// 		if (!response || !response.state) {
		// 			return;
		// 		}

		// 		this.defaultStepInProcess = response.data.sort((a, b) => {
		// 			return a.stepOrder - b.stepOrder;
		// 		});
		// 		this.stepInProcess = this.cloneArray(
		// 			this.stepInProcess,
		// 			this.defaultStepInProcess,
		// 		);
		// 		this.stepInProcess = this.stepInProcess.sort((a, b) => {
		// 			return a.stepOrder - b.stepOrder;
		// 		});
		// 	} catch (error) {
		// 		this.toastError(error);
		// 		return;
		// 	}
		// },

		clickToEdit(items) {
			if (!items) return;
			this.indexItems = this.stepInProcess.indexOf(items);
		},
		getClass(index) {
			return this.indexItems == index
				? "grey lighten-2"
				: "grey lighten-3";
		},
		selectHandler(item, index) {
			this.stepInProcess[index].userInfos.push(item);
		},
		remove(item) {
			if (
				!this.stepInProcess[this.indexItems].userInfos ||
				this.stepInProcess[this.indexItems].userInfos.length == 0
			) {
				return;
			}
			this.stepInProcess[this.indexItems].userInfos.splice(
				this.stepInProcess[this.indexItems].userInfos.indexOf(item),
				1,
			);
			this.stepInProcess[this.indexItems].userInfos = [
				...this.stepInProcess[this.indexItems].userInfos,
			];
		},
		restoreStepInProcess() {
			this.stepInProcess = this.cloneArray(
				this.stepInProcess,
				this.defaultStepInProcess,
			);
			this.arrDeleteStep = [];
			// if (this.requestProcessData.length > 0) {
			// 	this.s_processData = this.requestProcessData[0];
			// }
		},
		cloneArray(targetArayy, sourceArray) {
			if (!sourceArray) return sourceArray;
			targetArayy = sourceArray.map((ele) => this.cloneObject({}, ele));
			return targetArayy;
		},
		cloneObject(targetObject, sourceObject) {
			if (!sourceObject) return null;
			targetObject = Object.assign({}, sourceObject);
			for (let prop in sourceObject) {
				if (typeof sourceObject[prop] == "object") {
					if (Array.isArray(sourceObject[prop])) {
						targetObject[prop] = this.cloneArray(
							[],
							sourceObject[prop],
						);
					} else {
						targetObject[prop] = this.cloneObject(
							targetObject[prop],
							sourceObject[prop],
						);
					}
				}
			}
			return targetObject;
		},
		selectStepInProcess(item, index) {
			this.stepInProcess[index] = {
				...this.stepInProcess[index],
				...item,
			};
			this.stepInProcess[index].stepDataName = item.stepName;
			this.clickToEdit(this.stepInProcess[index]);
		},
		addColumn(index) {
			this.defaultItem.processData =
				this.defaultStepInProcess[0].processData;
			this.stepInProcess.splice(
				index + 1,
				0,
				Object.assign({}, this.defaultItem),
			);
			this.clickToEdit(this.stepInProcess[this.stepInProcess.length - 1]);
			this.is_add = true;
		},
		scrollToView(index) {
			let test = document.getElementById("step" + index);
			if (test[0]) test[0].scrollIntoView();
		},
		// async selectProcessData() {
		// 	if (!this.s_processData || !this.s_processData.id) return;
		// 	try {
		// 		let response = await globalService.getData_Async(
		// 			administratorAPI.API_GetStepDataByIdProcessData(
		// 				this.s_processData.id,
		// 			),
		// 		);
		// 		if (!response || !response.state) return;
		// 		this.stepInProcess = response.data.sort((a, b) => {
		// 			return a.stepOrder - b.stepOrder;
		// 		});
		// 	} catch (error) {
		// 		this.toastError(error);
		// 	}
		// },
		async getAllByProcesInfoId() {
			let response;
			try {
				response = await globalService.getData_Async(
					administratorAPI.API_FindProcessesDataByID(
						this.m_requestDto.id,
					),
				);

				if (!response || !response.state) {
					return;
				}
				this.requestProcessData = response.data;
				if (this.requestProcessData.length > 0) {
					this.s_processData = this.requestProcessData[0];
				}
			
			} catch (error) {
				this.toastError(error);
				return;
			}
		},
		// async getStepInProcessesByIdProcessData() {
		// 	let response;
		// 	try {
		// 		response = await globalService.getData_Async(
		// 			administratorAPI.API_GetSteepDataByIdRequest(
		// 				this.s_processData.id,
		// 			),
		// 		);
		// 		if (!response || !response.state) {
		// 			return;
		// 		}

		// 		this.defaultStepInProcess = response.data;
		// 		this.stepInProcess = this.cloneArray(
		// 			this.stepInProcess,
		// 			this.defaultStepInProcess,
		// 		);
		// 	} catch (error) {
		// 		this.toastError(error);
		// 		return;
		// 	}
		// },
		async getProcessInfos() {
			let response;
			try {
				response = await globalService.getData_Async(
					administratorAPI.API_GetRequest(
						this.m_requestDto.request.id,
					),
				);
				if (!response || !response.state) {
					return;
				}

				this.listProcessInfos = response.data.processInfos;
				

				for (let item of this.listProcessInfos) {
					var processDataDTOTemp = {};
					processDataDTOTemp.id = item.id;
					processDataDTOTemp.created = {
						id: this.user_info.id,
					};

					processDataDTOTemp.createdDate = new Date();
					processDataDTOTemp.isActive = item.isActive;
					processDataDTOTemp.isDelete = item.isDelete;

					processDataDTOTemp.modified = {
						id: this.user_info.id,
					};

					processDataDTOTemp.modifiedDate = item.modifiedDate;
					processDataDTOTemp.modifiedName = item.modifiedName;
					processDataDTOTemp.processDataCode = item.processCode;
					processDataDTOTemp.processDataName = item.processName;
					processDataDTOTemp.roundNumber = 1;
					processDataDTOTemp.requestData = {
						id: this.m_requestDto.id,
					};
					this.listProcessData.push(processDataDTOTemp);
				}
				
			} catch (error) {
				console.error(error);
				this.toastError(error);
				return;
			}
		},
		mergeArray(sourceArray, mergeArray) {
			if (!sourceArray) return mergeArray;
			if (!mergeArray) return sourceArray;
			let result = [...sourceArray];
			mergeArray.forEach((ele) => {
				if (!sourceArray.some((ele1) => ele1.id == ele.id))
					result.push(ele);
			});
			return result;
		},
		onSave(value) {
			if (this.stepInProcess[this.itemIndex].userInfos.length == 0) {
				this.stepInProcess[this.itemIndex].userInfos = value;
			} else {
				this.stepInProcess[this.itemIndex].userInfos = this.mergeArray(
					this.stepInProcess[this.itemIndex].userInfos,
					value,
				);
			}
			value = null;
		},
		removeRow(index) {
			this.arrDeleteStep.push(this.stepInProcess[index]);
			this.stepInProcess.splice(index, 1);
		},
		async save() {
			if (this.checkSave > 1) {
				await this.saveChange();
			} else {
				await this.saveNoChange();
			}
		},
		async saveChange() {
			for (let step of this.stepInProcess) {
					step.stepDataName = step.stepDataName.trim();
					if (step.stepDataName == "") {
						this.toastError(
							this.$t("message.error_step_in_process"),
						);
						this.isSaving = false;
						return;
					}
					
				}
			this.defaultStepInProcess = this.stepInProcess;
			// this.isSaving = false;
			// if (this.arrDeleteStep.length > 0) {
			// 	for (const step of this.arrDeleteStep) {
			// 		if (step.id) {
			// 			try {
			// 				let response = await globalService.deleteData_Async(
			// 					administratorAPI.API_DeleteStepData(step.id),
			// 				);
			// 				if (!response || !response.state) {
			// 					this.isSaving = true;
			// 					return this.toastError(this.$t("error.delete"));
			// 				}
			// 			} catch (error) {
			// 				this.toastError(error);
			// 			}
			// 		}
			// 	}
			// }
			// this.arrDeleteStep = [];
			
			for (const step of this.listDeleteStepData) {
				if (step.id) {
					try {
						let response = await globalService.deleteData_Async(
							administratorAPI.API_DeleteStepData(step.id),
						);
						if (!response || !response.state) {
							this.isSaving = true;
							return this.toastError(this.$t("error.delete"));
						}
					} catch (error) {
						this.toastError(error);
					}
				}
			}
			for (const step of this.requestProcessData) {
				if (step.id) {
					try {
						let response = await globalService.deleteData_Async(
							administratorAPI.API_DeleteProcessData(step.id),
						);
						if (!response || !response.state) {
							this.isSaving = true;
							return this.toastError(this.$t("error.delete"));
						}
					} catch (error) {
						this.toastError(error);
					}
				}
			}
			await this.saveProcessDataV2();
			try {
				if (this.isSaving) {
					this.toastError(this.$t("message.update_error"));
					return;
				}
				this.isSaving = true;
				let stt = 1;

				for (let step of this.stepInProcess) {
					step.processData = {
						id: this.processData?.id,
					};
					step.stepDataName = step.stepDataName.trim();
					step.stepOrder = stt;
					if (step.stepDataName == "") {
						this.toastError(
							this.$t("message.error_step_in_process"),
						);
						this.isSaving = false;
						return;
					}
					let response;
					step.createdDate = new Date();
					step.modifiedDate = new Date();
					step.requestData.id = this.m_requestDto.id;
					step.userInfos = step?.userInfos?.map((ele) => {
						if (ele?.userInfo) return { id: ele?.userInfo?.id };
						return { id: ele?.id };
					});

					response = await globalService.postData_Async(
						administratorAPI.API_CreateStepData(),
						step,
					);
					if (!response || !response.state) {
						this.isSaving = false;
						return;
					}
					step = response.data;
					stt++;
				}
				this.checkSave = 0;
				this.isSaving = false;
				
				this.$emit("save", true);
			} catch (error) {
				this.toastError(error);
			} finally {
				this.load();
				this.isSaving = false;
			}

			// this.toastSuccess(this.$t("message.update_success"));
		},
		async getStatusOfRequestData() {
			try {
				let response;
				response = await globalService.getData_Async(
					administratorAPI.API_GetRequestByStatus(
						this.m_requestDto.id,
					),
				);
				if (!response || !response.state) {
					return [];
				}

				this.statusRequestData = response.data.status.statusCode;
				if (
					this.statusRequestData == this.STATUS_DANGSOAN_CODE ||
					this.statusRequestData == this.STATUS_TRALAI_CODE
				) {
					this.isStatusRequestData = true;
				}
			} catch (error) {
				this.toastError(error);
				return;
			}
		},
		async getStepInProcessesByID(item) {
			this.listRequestStepData = [];
			let response;
			try {
				response = await globalService.getData_Async(
					administratorAPI.API_FindStepInProcessesByID(item),
				);
				if (!response || !response.state) {
					return;
				}
				this.stepInProcesInFo = response.data.sort((a, b) => {
					return a.stepOrder - b.stepOrder;
				});
				for (let stepInProces of this.stepInProcesInFo) {
					var requestStepData = {};
					requestStepData.isActive = false;
					requestStepData.created = { id: this.user_info.id };
					requestStepData.createdOrgName =
						this.user_info?.organizations
							?.map((ele) => ele.organizationName)
							?.join(", ");
					requestStepData.createdRankName = this.user_info.ranks
						?.map((ele) => ele.rankName)
						?.join(", ");
					requestStepData.step = { id: stepInProces.step?.id };
					requestStepData.processData = {
						id: this.processData?.id,
					};
					requestStepData.requestData = {
						id: this.requestData?.id,
					};
					requestStepData.stepInProcess = {
						id: stepInProces.id,
					};
					requestStepData.stepOrder = stepInProces.stepOrder;
					requestStepData.stepDataCode =
						stepInProces.stepInProcessCode;
					requestStepData.stepDataName =
						stepInProces.stepInProcessName;
					requestStepData.processingTerm =
						stepInProces.processingTerm;
					requestStepData.precessingTermTime =
						stepInProces.precessingTermTime;
					requestStepData.isRequiredSignature =
						stepInProces.isRequiredSignature;
					requestStepData.isBack = stepInProces.isBack;
					requestStepData.isAuthorizedApproval =
						stepInProces.isAuthorizedApproval;
					requestStepData.isExamine = stepInProces.isExamine;
					requestStepData.isEdit = stepInProces.isEdit;
					requestStepData.isRequestModify =
						stepInProces.isRequestModify;
					requestStepData.isSendMail = stepInProces.isSendMail;
					requestStepData.isProcessRecover =
						stepInProces.isProcessRecover;
					requestStepData.isCreateTfsTask =
						stepInProces.isCreateTfsTask;
					requestStepData.organizationCode =
						stepInProces.organization?.organizationCode;
					requestStepData.organizationName =
						stepInProces.organization?.organizationName;
					requestStepData.rankCode = stepInProces.rankCode;
					requestStepData.rankName = stepInProces.rankName;
					requestStepData.description = stepInProces.description;
					requestStepData.createdName = stepInProces.createdName;
					requestStepData.createdDate = new Date();
					requestStepData.modifiedName = stepInProces.modifiedName;
					requestStepData.isDelete = stepInProces.isDelete;
					requestStepData.tennantCode = stepInProces.tennantCode;
					requestStepData.tennantName = stepInProces.tennantName;
					requestStepData.modifiedDate = new Date();
					requestStepData.modified = {
						id: this.user_info.id,
					};
					requestStepData.optionDeny = stepInProces.optionDeny;
					requestStepData.isAddHistory = stepInProces.isAddHistory;
					requestStepData.isAddQRCode = stepInProces.isAddQRCode;
					requestStepData.isAddWaterMark =
						stepInProces.isAddWaterMark;
					requestStepData.isApprove = stepInProces.isApprove;
					requestStepData.isAttachFilePDF =
						stepInProces.isAttachFilePDF;
					requestStepData.isAuthorizedApproval =
						stepInProces.isAuthorizedApproval;
					requestStepData.isAutoSendMail =
						stepInProces.isAutoSendMail;
					requestStepData.isChangeStatus =
						stepInProces.isChangeStatus;
					requestStepData.isCreateContract =
						stepInProces.isCreateContract;
					requestStepData.isCreateOTPLink =
						stepInProces.isCreateOTPLink;
					requestStepData.isCreateOfficalDispath =
						stepInProces.isCreateOfficalDispath;
					requestStepData.isCreateReport =
						stepInProces.isCreateReport;
					requestStepData.isDeny = stepInProces.isDeny;
					requestStepData.isExportPDF = stepInProces.isExportPDF;
					requestStepData.isManageStamp = stepInProces.isManageStamp;
					requestStepData.isRecall = stepInProces.isRecall;
					requestStepData.isSaveDoc = stepInProces.isSaveDoc;
					requestStepData.isProcessSaveDoc =
						stepInProces.isProcessSaveDoc;
					requestStepData.isSendMail = stepInProces.isSendMail;
					requestStepData.isSendOTP = stepInProces.isSendOTP;
					requestStepData.mailTemplate = stepInProces.mailTemplate;
					requestStepData.roundNumber = 1;
					requestStepData.isSendMailCustomer =
						stepInProces.isSendMailCustomer;

					requestStepData.mailTemplateCustomer =
						stepInProces?.mailTemplateCustomer
							? { id: stepInProces.mailTemplateCustomer?.id }
							: null;
					requestStepData.isConsult = stepInProces.isConsult;
					requestStepData.isSendNoticePriority =
						stepInProces.isSendNoticePriority;
					requestStepData.userInfos = stepInProces.userInStepDTOs;

					this.listRequestStepData.push(requestStepData);
				}

				this.defaultStepInProcess = this.listRequestStepData.sort(
					(a, b) => {
						return a.stepOrder - b.stepOrder;
					},
				);
				this.stepInProcess = this.listRequestStepData;
				this.stepInProcess = this.cloneArray(
					this.stepInProcess,
					this.defaultStepInProcess,
				);
				this.stepInProcess = this.stepInProcess.sort((a, b) => {
					return a.stepOrder - b.stepOrder;
				});
			} catch (error) {
				this.toastError(error);
				return;
			}
		},
		async saveProcessDataV2() {
			let response;
			this.s_processData.id = null;
			response = await globalService.postData_Async(
				administratorAPI.API_CreateProcessData(),
				this.s_processData,
			);
			if (!response || !response.state) {
				{
					return;
				}
			}
			this.processData = response.data;
		},
		async saveNoChange() {
			this.defaultStepInProcess = this.stepInProcess;
			this.isSaving = false;
			if (this.arrDeleteStep.length > 0) {
				for (const step of this.arrDeleteStep) {
					if (step.id) {
						try {
							let response = await globalService.deleteData_Async(
								administratorAPI.API_DeleteStepData(step.id),
							);
							if (!response || !response.state) {
								this.isSaving = true;
								return this.toastError(this.$t("error.delete"));
							}
						} catch (error) {
							this.toastError(error);
						}
					}
				}
			}
			this.arrDeleteStep = [];
			try {
				if (this.isSaving) {
					this.toastError(this.$t("message.update_error"));
					return;
				}
				this.isSaving = true;
				let stt = 1;
				for (let stepInProces of this.stepInProcess) {
					stepInProces.stepDataName =
						stepInProces.stepDataName.trim();
					stepInProces.stepOrder = stt;
					if (stepInProces.stepDataName == "") {
						this.toastError(
							this.$t("message.error_step_in_process"),
						);

						this.isSaving = false;
						return;
					}
					let response;
					stepInProces.createdDate = new Date();
					if (stepInProces.id) {
						stepInProces.modifiedDate = new Date();
						response = await globalService.putData_Async(
							administratorAPI.API_UpDateStepData(
								stepInProces.id,
							),
							stepInProces,
						);
					} else {
						stepInProces.requestData.id = this.m_requestDto.id;
						response = await globalService.postData_Async(
							administratorAPI.API_CreateStepData(
								stepInProces.id,
							),
							stepInProces,
						);
					}
					if (!response || !response.state) {
						this.isSaving = false;
						return;
					}
					stepInProces = response.data;
					stt++;
				}
				this.checkSave = 0;
				this.isSaving = false;
				this.$emit("save", true);
			} catch (error) {
				this.toastError(error);
			} finally {
				this.load();
				this.isSaving = false;
			}

			// this.toastSuccess(this.$t("message.update_success"));
		},
	},
};
</script>

<style lang="scss" scoped>
.scroll-area {
	max-height: 100vh;
}
.gr_button {
	display: grid !important;
	position: absolute;
	top: 5rem;
}
</style>
