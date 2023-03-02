<template>
	<v-card>
		<v-toolbar elevation="0" color="grey lighten-4">
			<v-toolbar-title>
				{{ $t("label.information") }}
			</v-toolbar-title>
			<v-spacer></v-spacer>
			<v-btn icon @click="closeDialog">
				<v-icon>mdi-close</v-icon>
			</v-btn>
		</v-toolbar>
		<vue-perfect-scrollbar class="h-[70vh]">
			<v-card-text>
				<v-row class="mt-4">
					<v-col cols="6">
						<!-- <m-text-field
						:label="$t('label.name')"
						:value="m_editedItem.roleName"
						:required="true"
						@value="
							(value) => {
								m_editedItem.roleName = value;
							}
						"
					>
					</m-text-field> -->
						<v-text-field
							hide-details
							v-model="m_editedItem.roleName"
							outlined
							dense
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
					<v-col cols="6">
						<v-select
							:menu-props="{ bot: true, offsetY: true }"
							v-model="m_editedItem.roleType"
							:items="['Admin', 'Normal User']"
							outlined
							dense
							:no-data-text="$t('message.no_results')"
						>
							<template v-slot:label>
								{{ $t("label.role_type") }}
								<span class="red--text">*</span>
							</template>
						</v-select>
					</v-col>
				</v-row>
				<v-row>
					<v-col>
						<v-checkbox
							v-model="m_editedItem.isAutoAdd"
							:label="$t('label.auto_add_new_member')"
						>
						</v-checkbox>
					</v-col>
				</v-row>
				<v-row>
					<v-col>
						<v-tabs color="blue darken-2" v-model="tab">
							<v-tab @click="tab = 'data'">
								<span class="text-black">
									{{ $t("tab.data") }}
								</span>
							</v-tab>
							<v-tab @click="tab = 'user'">
								<span class="text-black">
									{{ $t("tab.user") }}
								</span>
							</v-tab>
							<v-tab @click="tab = 'group'">
								<span class="text-black">
									{{ $t("tab.group") }}
								</span>
							</v-tab>
							<v-tab
								@click="tab = 'feature'"
								v-if="m_editedItem.roleType == 'Admin'"
							>
								<span class="text-black">
									{{ $t("tab.feature") }}
								</span>
							</v-tab>
						</v-tabs>
						<v-divider></v-divider>
						<v-tabs-items v-model="tab">
							<v-tab-item key="data">
								<v-row>
									<v-col cols="7">
										<vue-tab
											:tabs="[
												{
													key: 'module',
													title: $t(
														'tab.organization',
													),
												},
											]"
											:buttons="[]"
										></vue-tab>
										<vue-select-list
											:items="listOrganizatin"
											keyName="id"
											valueName="fullNameOrganizatin"
											:selected="s_org"
											@localUpdate="
												(v) => {
													s_org = v;
												}
											"
										></vue-select-list>
									</v-col>
									<v-col cols="5" v-if="s_org.length > 0">
										<vue-tab
											:tabs="[
												{
													key: 'module',
													title: $t('tab.module'),
												},
											]"
											:buttons="[]"
										></vue-tab>
										<div class="flex">
											<v-row>
												<v-col cols="6">
													<v-checkbox
														:label="
															$t('button.view')
														"
														v-model="
															roleOrganization.isView
														"
													>
													</v-checkbox>
												</v-col>
												<v-col cols="6">
													<v-checkbox
														:label="
															$t(
																'button.download',
															)
														"
														v-model="
															roleOrganization.isDownload
														"
													>
													</v-checkbox>
												</v-col>
											</v-row>

											<!-- <v-checkbox
												:label="$t('label.edit')"
												v-model="
													roleOrganization.isEdit
												"
											>
											</v-checkbox>
											<v-checkbox
												:label="$t('button.delete')"
												v-model="
													roleOrganization.isDelete
												"
											>
											</v-checkbox> -->
										</div>
									</v-col>
								</v-row>
								<v-row>
									<v-col cols="7">
										<vue-tab
											:tabs="[
												{
													key: 'module',
													title: $t(
														'tab.request_type',
													),
												},
											]"
											:buttons="[]"
										></vue-tab>
										<vue-select-list
											:items="listRequest"
											keyName="id"
											valueName="requestName"
											:selected="s_request"
											@localUpdate="
												(v) => {
													s_request = v;
												}
											"
										></vue-select-list>
									</v-col>
									<v-col cols="5" v-if="s_request.length > 0">
										<vue-tab
											:tabs="[
												{
													key: 'module',
													title: $t('tab.module'),
												},
											]"
											:buttons="[]"
										></vue-tab>
										<div class="flex justify-between">
											<v-checkbox
												:label="$t('button.view')"
												v-model="roleRequest.isView"
											>
											</v-checkbox>
											<v-checkbox
												:label="$t('label.edit')"
												v-model="roleRequest.isEdit"
											>
											</v-checkbox>
											<v-checkbox
												:label="$t('button.delete')"
												v-model="roleRequest.isDelete"
											>
											</v-checkbox>
											<v-checkbox
												:label="$t('button.download')"
												v-model="roleRequest.isDownload"
											>
											</v-checkbox>
										</div>
									</v-col>
								</v-row>
							</v-tab-item>
							<v-tab-item key="user">
								<v-row>
									<v-col cols="12">
										<vue-select-list
											:items="listUser"
											keyName="id"
											valueName="fullNameNEW"
											:selected="
												m_editedItem.userInfoDTOList
											"
											@localUpdate="
												(v) => {
													m_editedItem.userInfoDTOList =
														v;
												}
											"
											@scrollReachEnd="eventScrollUser"
										></vue-select-list>
									</v-col>
									<!-- <v-col cols="5">
									<vue-tab
										:tabs="[
											{
												key: 'module',
												title: $t('tab.module'),
											},
										]"
										:buttons="[]"
									></vue-tab>
									<div class="flex justify-between">
										<v-checkbox :label="$t('button.view')">
										</v-checkbox>
										<v-checkbox :label="$t('button.edit')">
										</v-checkbox>
										<v-checkbox
											:label="$t('button.delete')"
										>
										</v-checkbox>
										<v-checkbox
											:label="$t('button.download')"
										>
										</v-checkbox>
									</div>
								</v-col> -->
								</v-row>
							</v-tab-item>
							<v-tab-item key="group">
								<v-row>
									<v-col cols="12">
										<vue-select-list
											:items="listUserGroup"
											keyName="id"
											valueName="groupName"
											:selected="
												m_editedItem.userGroupDTOList
											"
											@localUpdate="
												(v) => {
													m_editedItem.userGroupDTOList =
														v;
												}
											"
										></vue-select-list>
									</v-col>
									<!-- <v-col cols="5">
									<vue-tab
										:tabs="[
											{
												key: 'module',
												title: $t('tab.module'),
											},
										]"
										:buttons="[]"
									></vue-tab>
									<div class="flex justify-between">
										<v-checkbox :label="$t('button.view')">
										</v-checkbox>
										<v-checkbox :label="$t('button.edit')">
										</v-checkbox>
										<v-checkbox
											:label="$t('button.delete')"
										>
										</v-checkbox>
										<v-checkbox
											:label="$t('button.download')"
										>
										</v-checkbox>
									</div>
								</v-col> -->
								</v-row>
							</v-tab-item>
							<v-tab-item key="feature">
								<v-row>
									<v-col cols="7">
										<vue-select-list
											:items="listFeature"
											keyName="id"
											valueName="featureName"
											:selected="m_editedItem.features"
											@localUpdate="
												(v) => {
													m_editedItem.features = v;
												}
											"
										></vue-select-list>
									</v-col>
									<v-col cols="5"> </v-col>
								</v-row>
							</v-tab-item>
						</v-tabs-items>
					</v-col>
				</v-row>
			</v-card-text>
		</vue-perfect-scrollbar>

		<v-card-actions class="white">
			<v-spacer></v-spacer>
			<v-btn
				elevation="0"
				color="blue darken-2"
				dark
				class="rounded-0"
				@click="save"
			>
				{{ $t("button.ok") }}
			</v-btn>
			<v-btn
				elevation="0"
				@click="closeDialog"
				color="grey lighten-4"
				class="rounded-0"
			>
				{{ $t("button.cancel") }}
			</v-btn>
		</v-card-actions>
	</v-card>
</template>

<script>
import globalService from "@/services/global.service";
import administratorAPI from "../administrator.api";
import constant from "@/common/constant";
import roleOrganizationDto from "@/models/roleOrganization.dto";
import roleRequestDto from "@/models/roleRequest.dto";

export default {
	props: { editedItem: {}, isEdit: Boolean },
	components: {},
	data() {
		return {
			user_current: this.getUserInfo(),
			itemId: this.$route.params.id,
			listRequest: [],
			listOrganizatin: [],
			listUser: [],
			listUserGroup: [],
			listFeature: [], // danh sách toàn bộ tính năng
			s_org: [],
			s_request: [],
			s_user: [],
			tab: false,
			m_editedItem: {
				created: null,
				createdDate: null,
				createdName: "",
				createdOrgName: "",
				createdRankName: "",
				id: null,
				isActive: true,
				isAutoAdd: false,
				isDelete: false,
				isHaveDelete: false,
				isHaveDownload: false,
				isHaveEdit: false,
				isHaveView: false,
				modified: null,
				modifiedDate: null,
				modifiedName: "",
				requestList: "",
				roleCode: "",
				roleName: "",
				roleType: "",
				tennant: null,
				tennantCode: "",
				tennantName: "",
				userGroupDTOList: [],
				userInfoDTOList: [],
				features: [],
			},
			defaultItem: {
				created: null,
				createdDate: null,
				createdName: "",
				createdOrgName: "",
				createdRankName: "",
				id: null,
				isActive: true,
				isAutoAdd: false,
				isDelete: false,
				isHaveDelete: false,
				isHaveDownload: false,
				isHaveEdit: false,
				isHaveView: false,
				modified: null,
				modifiedDate: null,
				modifiedName: "",
				requestList: "",
				roleCode: "",
				roleName: "",
				roleType: "",
				tennant: null,
				tennantCode: "",
				tennantName: "",
				userGroupDTOList: [],
				userInfoDTOList: [],
				features: [],
			},
			isLoadingOrg: false,
			isLoadingUser: false,
			isLoadingRequest: false,
			pageNumberOrg: 0,
			pageNumberUser: 0,
			pageNumberRequest: 0,
			roleOrganization: roleOrganizationDto,
			roleRequest: roleRequestDto,
			role: {},
			m_roleOrganization: null,
			m_roleRequest: null,
			arr_roleOrganization: [],
			arr_roleRequest: [],
			s_editedItem: {},
			unit_function: {
				isDelete: false,
				isDownload: false,
				isEdit: false,
				isView: false,
			},
		};
	},
	watch: {
		editedItem(value) {
			this.m_editedItem = value;

			if (value.requestList) {
				let requestArr = JSON.parse(value.requestList);
				this.s_request = [];
				this.s_request = [
					...this.listRequest.filter((ele) =>
						requestArr.some((ele1) => ele1 == ele?.id),
					),
				];
				let orgArr = JSON.parse(value.organizationList);
				this.s_org = [];
				this.s_org = [
					...this.listOrganizatin.filter((ele) =>
						orgArr.some((ele1) => ele1 == ele?.id),
					),
				];
			}
			if (this.m_editedItem.id) {
				this.getRoleOrganizationByIdRole();
				this.getRoleRequest();
			}

			// lấy thông tin feature
			if (this.m_editedItem.features) {
				this.m_editedItem.features = this.m_editedItem.features.map(
					(ele) => {
						return this.listFeature.find(
							(ele1) => ele.id == ele1.id,
						);
					},
				);
			}

			//this.load();
		},
		isEdit(val) {
			if (!val) {
				this.m_editedItem = Object.assign({}, this.defaultItem);
				this.tab = "data";
				this.s_org = [];
				this.s_request = [];
			}
		},
	},
	created() {
		this.s_editedItem = this.m_editedItem;
	},
	async mounted() {
		if (this.editedItem) {
			this.m_editedItem = this.editedItem;
		}
		await this.load();
		await this.loadFilter();
	},

	methods: {
		async load() {
			await this.getAllRequestV2();
			await this.getAllOrganzationV2();
			this.getAllUser();
			this.getAllUserGroup();
			this.getAllFeature();
			if (this.m_editedItem.id) {
				await this.getRoleOrganizationByIdRole();
				await this.getRoleRequest();
			}
		},
		async getAllRequest() {
			try {
				let reqBody = {
					isDelete: "false",
				};
				let response = await globalService.postData_Async(
					administratorAPI.API_GetRequestCustom(
						this.pageNumberRequest,
						constant.page_size,
					),
					reqBody,
				);
				if (!response) {
					return;
				}
				if (response.data.listData && response.data.listData.length) {
					response.data.listData.filter((entry) => {
						if (
							this.listRequest.indexOf(entry) != false &&
							!entry.isDelete
						) {
							this.listRequest.push(entry);
						}
					});
				}
				if (response.data.listData.length) {
					this.isLoadingRequest = false;
				} else {
					this.isLoadingRequest = true;
				}
			} catch (error) {
				console.log(error);
			}
		},
		async getAllRequestV2() {
			try {
				let response = await globalService.getData_Async(
					administratorAPI.API_GetAllRequestIgnoreFile(),
				);
				if (!response || !response.state) return;
				this.listRequest = response.data.filter((entry) => {
					return !entry.isDelete;
				});
			} catch (error) {
				this.toastError(error);
			}
		},
		async getAllOrganization() {
			try {
				let reqBody = {
					isDelete: "false",
				};
				let response = await globalService.postData_Async(
					administratorAPI.GetAllOrganization(
						this.pageNumberOrg,
						constant.page_size,
					),
					reqBody,
				);
				if (!response) {
					return this.toastError(this.$t("error.load"));
				}
				if (response.data.listData && response.data.listData.length) {
					response.data.listData.filter((entry) => {
						if (
							this.listOrganizatin.indexOf(entry) != false &&
							!entry.isDelete
						) {
							this.listOrganizatin.push(entry);
						}
					});
				}
				if (response.data.listData.length) {
					this.isLoadingOrg = false;
				} else {
					this.isLoadingOrg = true;
				}
			} catch (error) {
				console.log(error);
			}
		},
		async getAllOrganzationV2() {
			try {
				let response = await globalService.getData_Async(
					administratorAPI.API_FindAllOrganization(),
				);
				if (!response || !response.state) return;
				this.listOrganizatin = response.data.filter((entry) => {
					return !entry.isDelete;
				});

				// if (response.data && response.data.length) {
				// 	response.data.filter((entry) => {
				// 		entry.fullNameOrganizatin =
				// 			(entry?.organizationName
				// 				? entry?.organizationName
				// 				: "") +
				// 			(entry?.orgParentName
				// 				? " - " + entry?.orgParentName
				// 				: "");
				// 		if (this.listOrganizatin.indexOf(entry) != false) {
				// 			this.listOrganizatin.push(entry);
				// 		}
				// 	});
				// }

				if(this.listOrganizatin){
					this.listOrganizatin = this.listOrganizatin.map(ele => {
						ele.fullNameOrganizatin =
							(ele?.organizationName
								? ele?.organizationName
								: "") +
							(ele?.orgParentName
								? " - " + ele?.orgParentName
								: "");
						return ele;
					})
				}


				// console.log("s_org", this.s_org);

				// if(this.m_editedItem.userInfoDTOList){
				// 	this.m_editedItem.userInfoDTOList = this.m_editedItem.userInfoDTOList.map(ele => {
				// 		ele.fullNameOrganizatin = (ele?.organizationName ? ele?.organizationName : "") +
				// 			" - " +
				// 			(ele?.orgParentName ? ele?.orgParentName : "");
				// 		return ele;
				// 	})
				// }
			} catch (error) {
				this.toastError(error);
			}
		},
		async getAllUser() {
			try {
				let reqBody = {
					isDelete: "false",
				};
				let response = await globalService.postData_Async(
					administratorAPI.SearchAllUser(
						this.pageNumberUser,
						constant.page_size,
					),
					reqBody,
				);
				if (!response) {
					return;
				}
				if (response.data.listData && response.data.listData.length) {
					response.data.listData.filter((entry) => {
						entry.fullNameNEW =
							(entry?.fullName ? entry?.fullName : "") +
							" - " +
							(entry?.email ? entry?.email : "");
						if (this.listUser.indexOf(entry) != false) {
							this.listUser.push(entry);
						}
					});
				}
				if (response.data.listData.length) {
					this.isLoadingUser = false;
				} else {
					this.isLoadingUser = true;
				}

				// custom name show
				if (this.m_editedItem.userInfoDTOList) {
					this.m_editedItem.userInfoDTOList =
						this.m_editedItem.userInfoDTOList.map((ele) => {
							ele.fullNameNEW =
								(ele?.fullName ? ele?.fullName : "") +
								" - " +
								(ele?.email ? ele?.email : "");
							return ele;
						});
				}
			} catch (error) {
				console.log(error);
			}
		},
		async getAllUserGroup() {
			try {
				let response = await globalService.getData_Async(
					administratorAPI.API_GetAllUserGroup(),
				);
				if (!response || !response.state) return;
				this.listUserGroup = response.data.filter((entry) => {
					return !entry.isDelete;
				});
			} catch (error) {
				console.log(error);
			}
		},
		async getAllFeature() {
			try {
				let response = await globalService.getData_Async(
					administratorAPI.API_GetAllFeature(),
				);
				if (!response || !response.state) return;
				this.listFeature = response.data.filter((entry) => {
					return !entry.isDelete;
				});

				if (this.m_editedItem.features) {
					this.m_editedItem.features = this.m_editedItem.features.map(
						(ele) => {
							return this.listFeature.find(
								(ele1) => ele.id == ele1.id,
							);
						},
					);
				}
			} catch (error) {
				console.log(error);
			}
		},

		async getRoleOrganizationByIdRole() {
			try {
				let response = await globalService.getData_Async(
					administratorAPI.API_GetOne_Role_Organization(
						this.m_editedItem.id,
					),
				);
				if (!response || !response.state) return;

				this.m_roleOrganization = response.data;
				this.roleOrganization = Object.assign({}, response.data[0]);
			} catch (error) {
				console.log(error);
			}
		},
		async getRoleRequest() {
			try {
				let response = await globalService.getData_Async(
					administratorAPI.API_GetOne_Role_Request(
						this.m_editedItem.id,
					),
				);
				if (!response || !response.state) return;
				this.m_roleRequest = response.data;
				this.roleRequest = Object.assign({}, response.data[0]);
			} catch (error) {
				console.log(error);
			}
		},
		async save() {
			this.m_editedItem.roleName = this.m_editedItem.roleName.trim();
			let _arrRequestId = [];
			this.s_request.forEach((ele) => {
				_arrRequestId.push(ele.id);
			});

			let _arrOrgId = [];
			this.s_org.forEach((entry) => {
				_arrOrgId.push(entry.id);
			});
			this.m_editedItem.roleType = this.m_editedItem.roleType.trim();
			this.m_editedItem.requestList = JSON.stringify(_arrRequestId);
			this.m_editedItem.organizationList = JSON.stringify(_arrOrgId);
			if (!this.validRequiredText(this.m_editedItem.roleName)) {
				return this.toastError(this.$t("message.empty_roleName"));
			}
			if (!this.validRequiredText(this.m_editedItem.roleType)) {
				return this.toastError(this.$t("message.empty_roleType"));
			}
			let response;
			try {
				if (this.m_editedItem.id) {
					await this.updateRoleOrganization();
					await this.updateRoleRequest();
					await this.deleteRoleRequest();
					await this.deleteRoleOrganization();
					this.m_editedItem.modifiedDate = new Date();
					this.m_editedItem.modifiedName = this.user_current.fullName;

					response = await globalService.putData_Async(
						administratorAPI.API_UpdateRole(this.m_editedItem.id),
						this.m_editedItem,
					);

					if (!response) {
						return this.toastError(this.$t("message.update_error"));
					}
					// await this.updateRoleOrganization();
					// await this.updateRoleRequest();
					this.toastSuccess(this.$t("message.update_success"));
				} else {
					this.m_editedItem.createdDate = new Date();
					this.m_editedItem.createdName = this.user_current.fullName;
					this.m_editedItem.modifiedDate = new Date();
					this.m_editedItem.modifiedName = this.user_current.fullName;
					response = await globalService.postData_Async(
						administratorAPI.API_CreateRole(),
						this.m_editedItem,
					);
					this.role = response.data;
					if (!response) {
						return this.toastError(this.$t("message.add_error"));
					}
					await this.saveRoleOrganization();
					await this.saveRoleRequest();
					this.toastSuccess(this.$t("message.add_success"));
					// this.m_editedItem = {};
				}
				this.closeDialog();
			} catch (error) {
				this.toastError(error);
			}
		},
		eventScrollOrg(event) {
			if (!this.isLoadingOrg && event) {
				this.isLoadingOrg = true;
				this.pageNumberOrg = this.pageNumberOrg + 1;
				this.getAllOrganization();
			}
		},
		eventScrollRequest(event) {
			if (!this.isLoadingRequest && event) {
				this.isLoadingRequest = true;
				this.pageNumberRequest = this.pageNumberRequest + 1;
				this.getAllRequest();
			}
		},
		eventScrollUser(event) {
			if (!this.isLoadingUser && event) {
				this.isLoadingUser = true;
				this.pageNumberUser = this.pageNumberUser + 1;
				this.getAllUser();
			}
		},
		async saveRoleRequest() {
			for (let item of this.s_request) {
				try {
					let response;
					this.roleRequest.created = { id: this.user_current.id };
					this.roleRequest.role = { id: this.role.id };
					this.roleRequest.request = { id: item.id };

					response = await globalService.postData_Async(
						administratorAPI.API_Role_Request(),
						this.roleRequest,
					);
					if (!response) {
						return this.toastError(this.$t("message.add_error"));
					}
				} catch (error) {
					this.toastError(error);
				}
			}
		},
		async updateRoleRequest() {
			for (let item of this.s_request) {
				try {
					let response;
					this.roleRequest.id = null;
					this.roleRequest.created = { id: this.user_current.id };
					this.roleRequest.role = { id: this.m_editedItem.id };
					this.roleRequest.request = { id: item.id };
					response = await globalService.postData_Async(
						administratorAPI.API_Role_Request(),
						this.roleRequest,
					);
					if (!response) {
						return this.toastError(this.$t("message.add_error"));
					}
				} catch (error) {
					this.toastError(error);
				}
			}
		},
		async deleteRoleRequest() {
			try {
				let response = await globalService.deleteData_Async(
					administratorAPI.API_DeleteAll_Role_Request(),
					this.m_roleRequest,
				);
				if (!response) {
					return this.toastError(this.$t("message.update_error"));
				}
			} catch (error) {
				this.toastError(error);
			}
		},
		async deleteRoleOrganization() {
			try {
				let response = await globalService.deleteData_Async(
					administratorAPI.API_DeleteAll_Role_Organization(),
					this.m_roleOrganization.map((ele) => {
						return { id: ele.id };
					}),
				);
				if (!response) {
					return this.toastError(this.$t("message.update_error"));
				}
			} catch (error) {
				this.toastError(error);
			}
		},
		async saveRoleOrganization() {
			for (let item of this.s_org) {
				try {
					let response;
					this.roleOrganization.created = {
						id: this.user_current.id,
					};
					this.roleOrganization.role = { id: this.role.id };
					this.roleOrganization.organization = item;
					// this.roleOrganization.isEdit = unit_function.isEdit;
					// this.roleOrganization.isView = unit_function.isView;
					// this.roleOrganization.isDelete = unit_function.isDelete;
					// this.roleOrganization.isDownload = unit_function.isDownload;

					response = await globalService.postData_Async(
						administratorAPI.API_Role_Organization(),
						this.roleOrganization,
					);
					if (!response) {
						return this.toastError(this.$t("message.add_error"));
					}
				} catch (error) {
					this.toastError(error);
				}
			}
		},
		async updateRoleOrganization() {
			for (let item of this.s_org) {
				try {
					let response;
					this.roleOrganization.id = null;
					this.roleOrganization.created = {
						id: this.user_current.id,
					};
					this.roleOrganization.role = { id: this.m_editedItem.id };
					this.roleOrganization.organization = item;
					response = await globalService.postData_Async(
						administratorAPI.API_Role_Organization(),
						this.roleOrganization,
					);
					if (!response) {
						return this.toastError(this.$t("message.add_error"));
					}
				} catch (error) {
					this.toastError(error);
				}
			}
		},
		async loadFilter() {
			let requestArr = [];
			try {
				requestArr = JSON.parse(this.m_editedItem.requestList);
			} catch (err) {
				console.log(err);
			}
			this.s_request = [];

			this.s_request = [
				...this.listRequest.filter((ele) =>
					requestArr.some((ele1) => ele1 == ele?.id),
				),
			];
			let orgArr = JSON.parse(this.m_editedItem.organizationList);
			this.s_org = [];

			this.s_org = [
				...this.listOrganizatin.filter((ele) =>
					orgArr.some((ele1) => ele1 == ele?.id),
				),
			];
		},
	},
};
</script>

<style></style>
