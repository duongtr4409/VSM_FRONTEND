<template>
	<v-card>
		<vue-perfect-scrollbar>
			<v-card-text>
				<v-container>
					<TabVue
						:tabs="tabs"
						:buttons="buttons"
						@buttonClick="handleButtonClick"
					/>
					<v-row class="mt-4">
						<v-col cols="6">
							<!-- <m-text-field
								:label="$t('label.name')"
								:value="m_editedItem.dispatchBookName"
								@value="
									(value) => {
										m_editedItem.dispatchBookName = value;
									}
								"
								:required="true"
							>
							</m-text-field> -->
							<v-text-field
								hide-details
								v-model="m_editedItem.dispatchBookName"
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
						<v-col>
							<v-text-field
								:label="$t('label.description')"
								v-model="m_editedItem.description"
								maxLength="255"
								outlined
								dense
							>
							</v-text-field>
						</v-col>
					</v-row>

					<vue-tab
						:tabs="[
							{
								key: $t('label.organization_management'),
								title: $t('label.organization_management'),
							},
						]"
						:buttons="[]"
					></vue-tab>
					<v-row class="mt-4">
						<v-col cols="12" md="12">
							<vue-select-list
								:items="listOrganization"
								:selected="m_editedItem.dispatchBookOrgs"
								:doAction="action"
								keyName="id"
								valueName="organizationName"
								@localUpdate="
									(v) => {
										m_editedItem.dispatchBookOrgs = v;
									}
								"
							></vue-select-list>
						</v-col>
					</v-row>
				</v-container>
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
				@click="close"
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
import TabVue from "@/components/Tab.vue";

export default {
	props: { editedItem: {} },
	components: { TabVue },
	data() {
		return {
			buttons: [
				{
					icon: "mdi-close",
					title: "",
					color: "black",
					transparent: true,
					dark: false,
					event: this.close,
				},
			],
			tabs: [
				{ key: "information", title: this.$t("title.all_information") },
			],
			organizations: [],
			selectedItemOrg: [],
			s_organization: [],
			sl_organization: [],
			removedItemOrg: [],
			selectedOrg: [],
			removedOrg: [],
			search_org: "",
			search_org_selected: "",
			user_current: this.getUserInfo(),
			itemId: this.$route.params.id,
			listOrganization: [],
			m_editedItem: {
				createdDate: null,
				createdName: "",
				createdOrgName: "",
				createdRankName: "",
				creater: null,
				description: "",
				dispatchBookCode: "",
				dispatchBookName: "",
				dispatchBookOrgs: [],
				dispatchBookTypeCode: "",
				dispatchBookTypeName: "",
				id: null,
				isActive: true,
				isDelete: false,
				modifiedDDate: null,
				modifiedName: "",
				modifier: null,
				organization: null,
				organizationCode: "",
				organizationName: "",
				totalDoc: 0,
			},
			action: "",
		};
	},
	watch: {
		editedItem(value) {
			this.m_editedItem = value;
			if (this.m_editedItem.dispatchBookName.trim() == "") {
				this.m_editedItem.dispatchBookName = " ";
			}
		},
	},
	async created() {
		await this.init();
		this.m_editedItem = this.editedItem;
	},
	methods: {
		async init() {
			this.getAllOrganzation();
		},

		async getAllOrganzation() {
			try {
				let response = await globalService.getData_Async(
					administratorAPI.API_FindAllOrganization(),
				);
				if (!response || !response.state) return;
				this.listOrganization = response.data.filter((entry) => {
					return !entry.isDelete;
				});
			} catch (error) {
				this.toastError(error);
			}
		},
		async save() {
			this.m_editedItem.dispatchBookName =
				this.m_editedItem.dispatchBookName.trim();
			this.m_editedItem.description =
				this.m_editedItem.description.trim();
			if (this.m_editedItem.dispatchBookName == "") {
				return this.toastError(this.$t("error.empty_signName"));
			}
			let response;

			this.m_editedItem.modified = this.user_current;
			this.m_editedItem.modifiedName = this.user_current.fullName;
			this.m_editedItem.modifiedDDate = new Date();
			try {
				if (this.m_editedItem.id) {
					response = await globalService.putData_Async(
						administratorAPI.API_UpdateDispatchBook(
							this.m_editedItem.id,
						),
						this.m_editedItem,
					);
					if (!response || !response.state) {
						return this.toastError(this.$t("message.update_error"));
					}
					this.toastSuccess(this.$t("message.update_success"));
				} else {
					this.m_editedItem.creater = this.user_current;
					this.m_editedItem.createdName = this.user_current.fullName;
					this.m_editedItem.createdDate = new Date();
					response = await globalService.postData_Async(
						administratorAPI.API_CreateDispatchBook(),
						this.m_editedItem,
					);
					if (!response || !response.state) {
						return this.toastError(this.$t("message.add_error"));
					}
					this.toastSuccess(this.$t("message.add_success"));
					this.cleadData();
				}

				this.closeDialog();
			} catch (error) {
				this.toastError(error);
			}
		},
		cleadData() {
			this.m_editedItem = Object.assign({}, this.m_editedItem);
			this.organizationName = "";
			this.m_editedItem.dispatchBookOrgs = [];
			this.action =
				"resetFilter" + new Date().getTime() + Math.random() * 1000000;
		},
		close() {
			this.$emit("close", true);
			this.cleadData();
		},
	},
};
</script>

<style></style>
