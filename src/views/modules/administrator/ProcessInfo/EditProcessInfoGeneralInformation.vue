<template>
	<v-card elevation="0" class="p-2 mt-4">
		<v-form ref="form" class="mt-4">
			<v-row>
				<v-col cols="12" sm="6" md="6">
					<v-text-field
						ref="processName"
						v-model="m_processInfoDto.processName"
						outlined
						dense
						required
						:error-messages="errorProcessName"
						@keyup="onchangeProcessName"
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
				<v-col cols="12" sm="6" md="6">
					<v-text-field
						ref="description"
						v-model="m_processInfoDto.description"
						outlined
						dense
						:label="$t('label.description')"
						maxLength="255"
					></v-text-field>
				</v-col>
			</v-row>
			<!-- <v-row>
				<v-col cols="12" sm="12" md="12">
					<v-checkbox
						v-model="m_processInfoDto.isActive"
						outlined
						dense
						:label="$t('label.is_active')"
					></v-checkbox>
				</v-col>
			</v-row> -->
			<v-row class="mt-2">
				<v-col cols="12" md="12">
					<strong>{{ $t("label.organization_applicable") }}</strong>
					<v-divider class="mb-2"></v-divider>
				</v-col>
				<v-col cols="12" md="6">
					<vue-select-list
						:items="organizations"
						keyName="id"
						valueName="organizationName"
						:selected="m_processInfoDto.organizations"
						@localUpdate="
							(v) => {
								m_processInfoDto.organizations = v;
							}
						"
					></vue-select-list>
				</v-col>
			</v-row>
			<!-- <v-row class="mt-5">
				<v-col cols="12" md="12">
					<strong>{{ $t("label.type_request_apply") }}</strong>
					<v-divider class="mb-2"></v-divider>
				</v-col>
				<v-col cols="12" md="6">
					<vue-select-list
						:items="requestTypes"
						keyName="id"
						valueName="requestName"
						:selected="m_processInfoDto.requestDTOS"
						@localUpdate="
							(v) => {
								m_processInfoDto.requestDTOS = v;
							}
						"
					></vue-select-list>
				</v-col>
			</v-row> -->
		</v-form>
	</v-card>
</template>

<script>
import ProcessInfoDTO from "@/models/process-info.dto";
import globalService from "@/services/global.service";
import administratorAPI from "../administrator.api";
export default {
	name: "EditProcessInfoGeneralInformationVue",
	components: {},
	props: {
		processInfoDto: ProcessInfoDTO,
		isSaved: {},
	},
	data() {
		return {
			maxLengthRules: [
				(v) =>
					(typeof v !== "object" && v.length < 255) ||
					this.$t("error.max_length_255"),
			],
			m_processInfoDto: ProcessInfoDTO,
			organizations: [],
			s_organization: [],
			sl_organization: [],
			requestTypes: [],
			s_requestTypes: [],
			sl_requestTypes: [],
			formHasErrors: false,
			search_org: "",
			search_req: "",
			search_org_selected: "",
			search_req_selected: "",
			isSaving: false,
			errorProcessName: "",
			selectedItemOrg: [],
			removedItemOrg: [],
			selectedOrg: [],
			removedOrg: [],
			selectedItemReq: [],
			removedItemReq: [],
			selectedReq: [],
			removedReq: [],
			m_isSaved: 0,
			url: this.$route.path,
		};
	},
	watch: {
		processInfoDto(value) {
			this.m_processInfoDto = value;
		},
		"m_processInfoDto.organizations"(value, oldValue) {
			if (oldValue.length == value.length) return;
			this.m_processInfoDto.organizations = value.filter((entry) => {
				if (typeof entry == "object") {
					return true;
				}
			});
		},
		"m_processInfoDto.requestDTOS"(value, oldValue) {
			if (oldValue.length == value.length) return;
			this.m_processInfoDto.requestDTOS = value.filter((entry) => {
				if (typeof entry == "object") {
					return true;
				}
			});
		},
		m_processInfoDto(val) {
			val || this.resetProcessInfo();
		},
		async isSaved(value) {
			this.m_isSaved = value;
			if (this.m_isSaved.state == 1) {
				this.save();
			}
		},
	},
	created() {
		this.$Progress.start();
		this.m_isSaved = this.isSaved;
		this.init();
		// if (!this.$route.params.id) {
		// 	console.log("reset");
		// 	this.m_processInfoDto.requestDTOS = [];
		// 	this.resetProcessInfo();
		// }
	},
	mounted() {
		this.$Progress.finish();
	},
	computed: {
		form() {
			return {
				processName: this.m_processInfoDto.processName,
			};
		},
	},
	methods: {
		async init() {
			this.m_processInfoDto = this.processInfoDto;
			await this._organizations();
			//await this._requestTypes();
		},
		remove(item) {
			let index = this.m_processInfoDto.organizations.indexOf(item);
			this.m_processInfoDto.organizations.splice(index, 1);
		},
		async _organizations() {
			let response;
			try {
				response = await globalService.getData_Async(
					administratorAPI.API_FindAllOrganization(),
				);
				if (!response) {
					return this.toastError(this.$t("error.load"));
				}
				if (!response.state) {
					return this.toastError(this.$t("error.load"));
				}
				this.organizations = response.data.filter((entry) => {
					return !entry.isDelete && entry.isActive;
				});
				this.s_organization = Object.assign([], this.organizations);
			} catch (error) {
				this.toastError(error.message);
			}
		},
		async _requestTypes() {
			let response;
			try {
				response = await globalService.getData_Async(
					administratorAPI.API_GetAllRequestIgnoreField(true),
				);
				if (!response) {
					return this.toastError(this.$t("error.load"));
				}
				if (!response.state) {
					return this.toastError(this.$t("error.load"));
				}
				this.requestTypes = response.data.filter((entry) => {
					return !entry.isDelete && entry.isActive;
				});
				this.s_requestTypes = Object.assign([], this.requestTypes);
			} catch (error) {
				this.toastError(error.message);
			}
		},
		async save() {
			this.m_processInfoDto.processName =
				this.m_processInfoDto.processName.trim();
			this.m_processInfoDto.description =
				this.m_processInfoDto.description.trim();
			this.formHasErrors = false;
			let editing = !!this.m_processInfoDto.id;
			for (let key of Object.keys(this.form)) {
				if (!this.form[key]) {
					this.formHasErrors = true;
					this.$refs[key].focus();
				}
				this.$refs[key].validate(true);
			}
			if (this.m_processInfoDto.processName.trim() == "") {
				this.errorProcessName = this.$t("message.msg_1");
				return this.toastError(this.$t("error.empty_processName"));
			}
			if (this.formHasErrors) {
				return this.toastError(this.$t("error.validate"));
			}
			if (this.isSaving) {
				return;
			}
			if (this.m_processInfoDto.processName.trim().length > 255) {
				return this.toastError(
					this.$t("message.maxlength_required_255"),
				);
			}
			this.isSaving = true;
			if (!this.m_processInfoDto.id) {
				this.m_processInfoDto.created = this.getUserInfo();
				this.m_processInfoDto.createdDate = new Date();
				this.m_processInfoDto.createdName = this.getUserInfo().fullName;
			}
			this.m_processInfoDto.modified = this.getUserInfo();
			this.m_processInfoDto.modifiedDate = new Date();
			this.m_processInfoDto.modifiedName = this.getUserInfo().fullName;
			let response;
			try {
				if (editing) {
					let id = this.$route.params.id;
					if (!id) {
						id = this.m_processInfoDto.id;
					}
					this.m_processInfoDto.modified = this.getUserInfo();
					this.m_processInfoDto.created = this.getUserInfo();
					response = await globalService.putData_Async(
						administratorAPI.API_UpdateProcessInfo(id),
						this.m_processInfoDto,
					);
					if (!response || !response.state) {
						this.toastError(this.$t("message.update_error"));
						return;
					}
					if (this.m_isSaved.tabs == 0) {
						this.toastSuccess(this.$t("message.update_success"));
					}
				} else {
					response = await globalService.postData_Async(
						administratorAPI.API_SaveProcessInfo(),
						this.m_processInfoDto,
					);
					if (!response || !response.state) {
						this.toastError(this.$t("message.add_error"));
						return;
					}
					if (this.m_isSaved.tabs == 0) {
						this.toastSuccess(this.$t("message.add_success"));
					}
				}
				this.m_isSaved = { state: 2, tabs: 1 };
				this.$emit("state", Object.assign({}, this.m_isSaved));
				this.$emit(
					"onSaveProcessInfoDto",
					Object.assign({}, response.data),
				);
			} catch (error) {
				this.toastError(error);
			} finally {
				this.isSaving = false;
				// this.m_processInfoDto = ProcessInfoDTO;
				this.errorProcessName = "";
			}
		},
		onchangeProcessName() {
			this.errorProcessName = "";
		},
		resetProcessInfo() {
			this.m_processInfoDto = ProcessInfoDTO;
		},
	},
};
</script>

<style></style>
