<template>
	<v-card>
		<v-dialog max-width="60vw" v-model="openUserInfosRequestData" persistent>
			<UserInfosRequestDataVue
				@save="onSave"
				@close="onClose"
			></UserInfosRequestDataVue>
		</v-dialog>
		<v-toolbar color="grey lighten-4">
			<v-toolbar-title>
				{{ $t("button.dispatch_handling") }}
			</v-toolbar-title>
			<v-spacer></v-spacer>
			<v-btn icon @click="close">
				<v-icon>mdi-close</v-icon>
			</v-btn>
		</v-toolbar>
		<v-card-text class="mt-4">
			<v-container>
				<v-row>
					<v-col cols="12" md="6">
						<v-select
							:menu-props="{ bot: true, offsetY: true }"
							dense
							outlined
							:items="listStatus"
							:item-value="(item) => item"
							v-model="transferHandleDTO.statusTransferHandle"
							item-text="statusName"
							:label="$t('label.status_process')"
							clearable
						></v-select>
					</v-col>
				</v-row>
				<v-row>
					<!-- <v-col cols="12" md="6">
						<v-select :menu-props="{ bot: true, offsetY: true }"
							dense
							outlined
							:items="listOrganization"
							:label="$t('label.organize_use')"
							clearable
							:item-value="(item) => item"
							v-model="transferHandleDTO.organization"
							item-text="organizationName"
						></v-select>
					</v-col> -->
					<!-- <v-col cols="12" md="6">
						<v-select :menu-props="{ bot: true, offsetY: true }"
							dense
							outlined
							:items="listDispatchBook"
							:item-value="(item) => item"
							v-model="transferHandleDTO.dispatchBook"
							item-text="dispatchBookName"
							:label="$t('label.dispatch_book')"
						>
						</v-select>
					</v-col> -->
				</v-row>
				<v-row>
					<!-- <v-col cols="12" md="6">
						<m-date-picker
							:label="$t('label.d_processing_term')"
							:value="transferHandleDTO.processDate"
							format="DD/MM/yyyy"
							@value="(v) => (transferHandleDTO.processDate = v)"
						>
						</m-date-picker>
					</v-col> -->
					<!-- <v-col cols="12" md="12">
						<m-date-picker
							:label="$t('label.processing_date')"
							:value="transferHandleDTO.expiredTime"
							format="DD/MM/yyyy"
							@value="(v) => (transferHandleDTO.expiredTime = v)"
						>
						</m-date-picker>
					</v-col> -->
				</v-row>
				<v-row>
					<v-col class="pb-0">
						<v-textarea
							outlined
							v-model="transferHandleDTO.content"
							dense
							hide-details
							maxLength="500"
						>
							<template v-slot:label>
								{{ $t("label.mail_template_content") }}
								<span class="text-red-600">{{
									$t("label.star")
								}}</span>
							</template>
						</v-textarea>
					</v-col>
				</v-row>
			</v-container>
		</v-card-text>
		<v-card-actions>
			<v-spacer></v-spacer>
			<v-btn
				elevation="0"
				color="blue darken-2"
				dark
				class="rounded-0"
				@click="saveTransfer()"
			>
				{{ $t("button.ok") }}
			</v-btn>
			<v-btn
				elevation="0"
				color="grey lighten-4"
				class="rounded-0"
				@click="close"
			>
				{{ $t("button.cancel") }}
			</v-btn>
		</v-card-actions>
	</v-card>
</template>

<script>
import globalService from "@/services/global.service";
import administratorAPI from "../../administrator/administrator.api";
import TransferHandleDTO from "@/models/transfer-handle-resource.dto";
import ReqDataProcessHisDto from "@/models/req-data-process-his.dto";

export default {
	name: "DocumenProcessV2Vue",

	props: { request: {} },
	components: {},
	watch: {
		request(newValue) {
			this.m_requestData = newValue;
		},
	},
	data() {
		return {
			m_requestData: null,
			selected: [],
			listUser: [],
			listStatus: [],
			listDispatchBook: [],
			selected_DispatchBook: null,
			search: "",
			selected_status: null,

			user_info: this.getUserInfo(),
			openUserInfosRequestData: false,
			userInfos: [],
			listOrganization: [],
			selected_Organization: null,
			files: [],
			attachmentFiles: [],
			file: null,
			stepInProcess: [],
			transferHandleDTO: TransferHandleDTO,
			id_requestdataProcessHis: null,
			requestdataProcessHis: null,
			m_requestdataProcessHis: null,
			requestProcessHis: ReqDataProcessHisDto,
			listTransferHandles: [],
			dateFormat: "DD/MM/yyyy h:mm",
			singleSelect: false,
			stepData: [],
			isCVD: this.$t("enum.CVD"),
		};
	},
	created() {
		this.m_requestData = this.request;

		this.$Progress.start();
		this.load();
	},
	mounted() {
		this.$Progress.finish();
	},
	methods: {
		async load() {
			//this.getAllUser();

			await this.getStatus();
			// await this.getOrganization();
			// await this.getDispatchBook();
			await this.getStepInProcessesByIdRequestData();
			// await this.getAllTransferHandles();
		},
		editUserInfosRequestData(index) {
			this.openUserInfosRequestData = true;
			this.itemIndex = index;
		},
		removeUser(item) {
			this.userInfos.splice(this.userInfos.indexOf(item), 1);
		},
		onSave(value) {
			// this.userInfos.push(...value);
			this.userInfos = this.mergeArray(this.userInfos, value);
		},
		onClose() {
			this.openUserInfosRequestData = false;
			this.itemIndex = -1;
		},
		close() {
			this.$emit("close", true);
		},

		async getAllUser() {
			if (!this.m_requestData || !this.m_requestData.id) return;
			let response = await globalService.getData_Async(
				administratorAPI.API_GetAllUserByRequest(this.m_requestData.id),
			);
			if (!response || !response.state) return;
			this.listUser = response.data;
		},
		async getStatus() {
			let response = await globalService.getData_Async(
				administratorAPI.API_GetAllStatusTransferHandles(),
			);
			if (!response) return;
			this.listStatus = response.data.filter(
				(e) => e.isActive && !e.isDelete,
			);
		},

		async getStepInProcessesByIdRequestData() {
			let response;
			try {
				response = await globalService.getData_Async(
					administratorAPI.API_GetByCurrentSteps(
						this.m_requestData.id,
					),
				);
				if (!response || !response.state) {
					return;
				}
				this.stepInProcess = response.data.filter((ele) => {
					return ele.isActive;
				});
				this.stepData = response.data;
			} catch (error) {
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
		async saveTransfer() {
			// this.transferHandleDTO.expiredTime = moment(
			// 	this.transferHandleDTO.expiredTime,
			// ).toDate();
			// this.transferHandleDTO.expiredTime = new Date();

			let response;
			// this.transferHandleDTO.attachFileList = JSON.stringify(
			// 	this.attachmentFiles,
			// );

			this.transferHandleDTO.statusName =
				this.transferHandleDTO.statusTransferHandle.statusName;
			this.transferHandleDTO.createdName = this.user_info.fullName;
			// if (this.transferHandleDTO.organization) {
			// 	this.transferHandleDTO.orgName =
			// 		this.transferHandleDTO.organization.orgParentName;
			// 	this.transferHandleDTO.orgCode =
			// 		this.transferHandleDTO.organization.orgParentCode;
			// }
			// if (this.transferHandleDTO.dispatchBook) {
			// 	this.transferHandleDTO.dispatchBookCode =
			// 		this.transferHandleDTO.dispatchBook.organizationCode;
			// 	this.transferHandleDTO.dispatchBookName =
			// 		this.transferHandleDTO.dispatchBook.organizationName;
			// }
			this.transferHandleDTO.stepData = { id: this.stepInProcess[0]?.id };
			if (this.m_requestData.requestGroupName.includes(this.isCVD)) {
				this.transferHandleDTO.stepData = {
					id: this.stepData[0]?.id,
				};
			}

			this.transferHandleDTO.modifiedName = this.user_info.fullName;
			try {
				response = await globalService.postData_Async(
					administratorAPI.API_CreateTransferHandle(),
					this.transferHandleDTO,
				);
			} catch (error) {
				console.log(error);
			}
			if (!response || !response.state) {
				this.toastError(this.$t("message.not_success"));
				return;
			}
			this.transferHandleDTO.statusTransferHandle = null;
			this.transferHandleDTO.content = "";
			this.toastSuccess(this.$t("message.successful_transfer"));

			this.$emit("close", true);
		},

		async getAllTransferHandles() {
			let response;
			try {
				response = await globalService.getData_Async(
					administratorAPI.API_GetAllTransferHandles(
						this.m_requestData.id,
					),
				);
				if (!response || !response.state) {
					return;
				}
				this.listTransferHandles = response.data;
			} catch (error) {
				this.toastError(error);
				return;
			}
		},
	},
};
</script>

<style></style>
