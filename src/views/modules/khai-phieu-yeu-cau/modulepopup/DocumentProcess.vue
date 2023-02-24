<template>
	<v-card>
		<v-dialog max-width="60vw" v-model="openUserInfosRequestData" persistent>
			<UserInfosRequestDataVue
				persistent
				@save="onSave"
				@close="onClose"
			></UserInfosRequestDataVue>
		</v-dialog>
		<v-toolbar color="grey lighten-4 max-h-[2.5rem]">
			<v-toolbar-title class="mb-5">
				{{ $t("button.dispatch_handling") }}
			</v-toolbar-title>
			<v-spacer></v-spacer>
			<v-btn icon @click="close" class="mb-5">
				<v-icon>mdi-close</v-icon>
			</v-btn>
		</v-toolbar>
		<v-card-text class="mt-2">
			<v-container>
				<v-row>
					<v-col cols="10" class="pb-0">
						<v-combobox
							v-model="userInfos"
							chips
							dense
							outlined
							hide-details
							class="pr-0"
							multiple
							readonly
						>
							<template v-slot:label>
								{{ $t("label.mail_template_receive") }}
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
									class="mt-2"
									close
									@click:close="removeUser(item)"
									outlined
								>
									<v-avatar color="red mr-2" size="30">
										<span class="white--text">
											{{
												getAvatarText(item.fullName, 2)
											}}
										</span>
									</v-avatar>
									<span class="pr-1">
										{{ item.fullName }}
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
					<v-col cols="2" class="pb-0">
						<v-btn
							icon
							color="blue"
							@click="editUserInfosRequestData(index)"
						>
							<v-icon>mdi-account-plus</v-icon>
						</v-btn>
					</v-col>
					<!-- <v-col cols="12" md="3" class="pl-0">
						<v-btn class="blue" dark @click="save()">
							{{ $t("label.transfer_handle") }}
						</v-btn>
					</v-col> -->
				</v-row>
				<!-- <v-row>
					<v-col cols="12" md="6">
						<v-select
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
				</v-row> -->
				<!--<v-row>
					 <v-col cols="12" md="6">
						<v-select
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
						<v-select
							dense
							outlined
							:items="listDispatchBook"
							:item-value="(item) => item"
							v-model="transferHandleDTO.dispatchBook"
							item-text="dispatchBookName"
							:label="$t('label.dispatch_book')"
						>
						</v-select>
					</v-col> 
				</v-row>-->
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
					<v-col class="pb-0">
						<m-date-picker
							:label="$t('label.processing_date')"
							:value="transferHandleDTO.expiredTime"
							format="DD/MM/yyyy"
							@value="(v) => (transferHandleDTO.expiredTime = v)"
						>
						</m-date-picker>
					</v-col>
				</v-row>
				<v-row>
					<v-col class="pb-0">
						<v-textarea
							outlined
							hide-details
							v-model="transferHandleDTO.content"
							dense
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

				<v-row v-if="!listTransferHandles.length == 0">
					<v-col cols="12" sm="12" md="12">
						<v-data-table
							v-model="selected"
							:headers="headers"
							:items="listTransferHandles"
							:single-select="singleSelect"
							item-key="id"
							loading="true"
							:loading-text="$t('label.loading')"
						>
							<template
								v-for="header in headers.filter((header) =>
									header.hasOwnProperty('formatter'),
								)"
								v-slot:[`item.${header.value}`]="{
									headers,
									value,
								}"
							>
								{{ header.formatter(value) }}
							</template>
							<template v-slot:no-data>
								<h3>{{ $t("message.no_data") }}</h3>
							</template>
							<template v-slot:[`item.createdName`]="{ item }">
								<template>
									<v-avatar color="red mr-2" size="20">
										<span class="white--text">
											{{
												getAvatarText(
													item.createdName,
													2,
												)
											}}
										</span>
									</v-avatar>
									{{ item.createdName }}
								</template>
							</template>
							<!-- <template v-slot:[`item.fileName`]="{ item }">
									<td>
										<span class="font-weight-bold">{{
											item.fileName
										}}</span>
										<v-menu offset-y>
											<template
												v-slot:activator="{ on, attrs }"
											>
												<v-btn
													icon
													v-bind="attrs"
													v-on="on"
												>
													<v-icon
														>mdi-dots-vertical</v-icon
													>
												</v-btn>
											</template>
										</v-menu>
									</td>
								</template> -->
						</v-data-table>
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
import UserInfosRequestDataVue from "../RequestForm/UserInfosRequestDataV2.vue";
import constant from "@/common/constant";
import TransferHandleDTO from "@/models/transfer-handle-resource.dto";
import ReqDataProcessHisDto from "@/models/req-data-process-his.dto";
import moment from "moment";

export default {
	props: { request: {} },
	components: { UserInfosRequestDataVue },
	watch: {
		request(newValue) {
			this.m_requestData = newValue;
			this.transferHandleDTO.content = "";
			this.transferHandleDTO = Object.assign({}, TransferHandleDTO);
			this.files = [];
		},
	},
	data() {
		return {
			isCVD: this.$t("enum.CVD"),
			stepData: [],
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
			headers: [
				{
					text: this.$t("label.mail_template_content"),
					value: "content",
					sortable: false,

					filter: (value) => {
						if (!this.content) return true;
						if (!value) return;
						return this.nonAccentVietnamese(value)
							.toLocaleUpperCase()
							.includes(
								this.nonAccentVietnamese(
									this.content,
								).toLocaleUpperCase(),
							);
					},
				},
				{
					text: this.$t("label.status"),
					value: "statusName",

					filter: (value) => {
						if (!this.templateFormName) return true;
						if (!value) return;
						return this.nonAccentVietnamese(value)
							.toLocaleUpperCase()
							.includes(
								this.nonAccentVietnamese(
									this.templateFormName,
								).toLocaleUpperCase(),
							);
					},
				},

				{
					text: this.$t("label.handler"),
					value: "createdName",

					filter: (value) => {
						if (!this.createdName) return true;

						return this.nonAccentVietnamese(value)
							.toLocaleUpperCase()
							.includes(
								this.nonAccentVietnamese(
									this.createdName,
								).toLocaleUpperCase(),
							);
					},
				},
				{
					text: this.$t("label.precessing_term_time"),
					value: "expiredTime",

					formatter: (x) =>
						x ? moment(x).format(this.dateFormat) : null,
					filter: (value) => {
						if (!this.expiredTime) return true;
						return value.includes(this.expiredTime);
					},
				},
				// {
				// 	text: this.$t("label.expired_time"),
				// 	value: "processDate",

				// 	formatter: (x) =>
				// 		x ? moment(x).format(this.dateFormat) : null,
				// 	filter: (value) => {
				// 		if (!this.processDate) return true;
				// 		return value.includes(this.processDate);
				// 	},
				// },

				{
					text: this.$t("label.update_time"),
					value: "modifiedDate",

					formatter: (x) =>
						x ? moment(x).format(this.dateFormat) : null,
					filter: (value) => {
						if (!this.createdDate) return true;
						return value.includes(this.createdDate);
					},
				},
			],
			file_name: [],
		};
	},
	created() {
		this.m_requestData = this.request;
		this.transferHandleDTO.content = "";
		this.transferHandleDTO = Object.assign({}, TransferHandleDTO);
		this.$Progress.start();
		this.load();
	},
	mounted() {

		this.$Progress.finish();
	},
	methods: {
		async load() {
			//this.getAllUser();

			// await this.getStatus();
			// await this.getOrganization();
			// await this.getDispatchBook();
			await this.getStepInProcessesByIdRequestData();
			await this.getAllTransferHandles();
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
			// 	this.userInfos = [];
			// 	this.userInfos = value;
		},
		onClose() {
			this.openUserInfosRequestData = false;
			// this.$emit("close", true);
			this.transferHandleDTO.content = "";
			this.files = [];
			this.file_name = [];
			this.itemIndex = -1;
		},
		close() {
			this.$emit("close", true);
			this.transferHandleDTO.content = "";
			this.transferHandleDTO = Object.assign({}, TransferHandleDTO);
			this.userInfos = [];
			this.files = [];
			this.file_name = [];
		},
		handleFileUpload(event) {
			this.file = event;
		},
		handleFile(files) {
			if (this.file_name.indexOf(files.target.value) != -1) return;
			this.file_name.push(files.target.value);
			this.files = this.files.concat(Array.from(files.target.files));
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
			let files = document.getElementById(constant.keys.files);
			files.click();
		},
		remove(file) {
			let index = this.files.indexOf(file);
			this.files.splice(index, 1);
		},

		async getAllUser() {
			if (!this.m_requestData || !this.m_requestData.id) return;
			try {
				let response = await globalService.getData_Async(
					administratorAPI.API_GetAllUserByRequest(
						this.m_requestData.id,
					),
				);
				if (!response || !response.state) return;
				this.listUser = response.data;
			} catch (error) {
				console.log(error);
			}
		},
		async getStatus() {
			try {
				let response = await globalService.getData_Async(
					administratorAPI.API_GetAllStatusTransferHandles(),
				);
				if (!response) return;
				this.listStatus = response.data.filter(
					(e) => e.isActive && !e.isDelete,
				);
			} catch (error) {
				console.log(error);
			}
		},
		async getOrganization() {
			try {
				let response = await globalService.getData_Async(
					administratorAPI.API_GetAllOrganization(),
				);
				if (!response) return;
				this.listOrganization = response.data.filter(
					(e) => e.isActive && !e.isDelete,
				);
			} catch (error) {
				console.log(error);
			}
		},
		async getDispatchBook() {
			try {
				let response = await globalService.getData_Async(
					administratorAPI.API_GetAllDispatchBook(),
				);
				if (!response) return;
				this.listDispatchBook = response.data.filter(
					(e) => e.isActive && !e.isDelete,
				);
			} catch (error) {
				console.log(error);
			}
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
		async save() {
			if (this.userInfos.length == 0) {
				this.toastError(
					this.$t("message.handler_has_not_been_selected"),
				);
				return;
			}
			this.m_requestData.userInfos.push(...this.userInfos);

			this.m_requestData.createdDate = new Date();
			this.m_requestData.modifiedDate = new Date();

			try {
				let response = await globalService.putData_Async(
					administratorAPI.API_UpdateRequestData(
						this.m_requestData.id,
					),
					this.m_requestData,
				);
				if (!response || !response.state) {
					return;
				}
				this.m_requestData = response.data;
			} catch (error) {
				console.log(error);
			}
			// if (response) {
			// this.toastSuccess(this.$t("message.successful_transfer"));
			// }
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
			if (this.userInfos.length == 0) {
				this.toastError(
					this.$t("message.handler_has_not_been_selected"),
				);
				return;
			}
			await this.save();

			this.transferHandleDTO.expiredTime = moment(
				this.transferHandleDTO.expiredTime,
			).toDate();

			let response;

			this.transferHandleDTO.statusName = "Chuyển xử lý";
			this.transferHandleDTO.createdName = this.user_info.fullName;

			this.transferHandleDTO.stepData = { id: this.stepInProcess[0]?.id };
			// if (this.m_requestData.requestGroupName.includes(this.isCVD)) {
			// 	this.transferHandleDTO.stepData = {
			// 		id: this.stepData[0]?.id,
			// 	};
			// }
			this.transferHandleDTO.modifiedName = this.user_info.fullName;
			try {
				response = await globalService.postData_Async(
					administratorAPI.API_CreateTransferHandle(),
					this.transferHandleDTO,
				);

				if (!response || !response.state) {
					this.toastError(this.$t("error.load"));
					return;
				}
			} catch (error) {
				console.log(error);
			}
			await this.saveReqdataProcessHis();

			this.toastSuccess(this.$t("message.successful_transfer"));
			await this.getAllTransferHandles();

			this.$emit("save", true);
			this.$emit("close", true);
			this.close();
		},
		async saveReqdataProcessHis() {
			let response;

			try {
				for (let userInfo of this.userInfos) {
					this.requestProcessHis.createDate = new Date();
					this.requestProcessHis.description =
						this.transferHandleDTO.content;
					this.requestProcessHis.organizationName = null;
					this.requestProcessHis.processDate = new Date();
					this.requestProcessHis.processer = userInfo;
					this.requestProcessHis.processerName = userInfo.fullName;
					this.requestProcessHis.rankName = null;
					this.requestProcessHis.requestData = {
						id: this.m_requestData.id,
					};
					this.requestProcessHis.isChild = true;

					this.requestProcessHis.status =
						this.transferHandleDTO.statusName;
					response = await globalService.postData_Async(
						administratorAPI.API_CreateReqdataProcessHis(),
						this.requestProcessHis,
					);
					if (!response || !response.state) {
						return;
					}
				}
			} catch (error) {
				this.toastError(error);
				return;
			}
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
				this.listTransferHandles = response.data.sort(
					(e1, e2) => e2.createDate - e1.createDate,
				);
			} catch (error) {
				this.toastError(error);
				return;
			}
		},
	},
};
</script>

<style></style>
