<template>
	<v-card elevation="0">
		<vue-breadcrumbs></vue-breadcrumbs>
		<v-dialog v-model="dialog.delete" persistent max-width="fit-content">
			<vue-delete-dialog
				@close="onCloseDialog"
				@confirmDelete="onConfirmDelete"
			></vue-delete-dialog>
		</v-dialog>
		<v-dialog v-model="dialog.edit" persistent max-width="50vw">
			<v-card>
				<v-toolbar elevation="0" color="grey lighten-3">
					<v-toolbar-title>
						{{ $t("title.organization_information") }}
					</v-toolbar-title>
					<v-spacer></v-spacer>
					<v-btn icon @click="close">
						<v-icon>mdi-close</v-icon>
					</v-btn>
				</v-toolbar>
				<v-card-text>
					<v-container>
						<v-row>
							<v-col cols="12">
								<v-text-field
									:label="$t('organization.organizationName')"
									v-model="editedItem.organizationName"
									outlined
									dense
									hide-details
									:required="true"
									maxLength="250"
								>
									<template v-slot:label>
										{{
											$t("organization.organizationName")
										}}
										<span class="red--text">*</span>
									</template>
								</v-text-field>
								<v-textarea
									:label="$t('label.description')"
									v-model="editedItem.description"
									hide-details
									outlined
									dense
									class="mt-2"
									maxLength="500"
								></v-textarea>
								<v-autocomplete
									v-model="editedItem.orgParent"
									:items="listOrg"
									clearable
									:label="$t('organization.orgParent')"
									outlined
									dense
									item-text="organizationName"
									:item-value="(item) => item"
									itemid="id"
									class="mt-2"
									:no-data-text="$t('message.no_results')"
								></v-autocomplete>
							</v-col>
						</v-row>
					</v-container>
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn
						elevation="0"
						color="blue darken-2"
						class="rounded-0"
						dark
						@click="save"
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
		</v-dialog>
		<template>
			<v-card-title>
				<v-btn
					class="rounded-pill text-capitalize font-weight-regular"
					elevation="0"
					text
					@click="dialog.edit = true"
				>
					<v-icon small class="mr-2">mdi-plus-circle</v-icon>
					{{ $t("button.insert") }}
				</v-btn>
				<v-btn
					class="rounded-pill text-capitalize font-weight-regular"
					elevation="0"
					@click="sync"
					text
				>
					<v-icon small class="mr-2">mdi-cloud-sync-outline </v-icon>
					{{ $t("button.sync") }}
				</v-btn>
				<v-btn
					class="rounded-pill text-capitalize font-weight-regular"
					v-if="selected.length > 0"
					elevation="0"
					text
					@click="deleteItem()"
				>
					<v-icon small class="mr-2">mdi-trash-can-outline</v-icon>
					{{ $t("button.delete_all") }}
				</v-btn>
			</v-card-title>
		</template>
		<v-card-text>
			<v-treeview
				v-model="selected"
				selectable
				selection-type="independent"
				:items="root"
				open-on-click
				return-object
			>
				<template v-slot:prepend="{ item, open }">
					<v-icon v-if="item.children && item.children.length">
						{{ open ? "mdi-folder-open" : "mdi-folder" }}
					</v-icon>
					<!-- <v-icon >
						{{ "mdi-account"}}
					</v-icon> -->
					<span v-if ="(item.tennantCode ==='SYNC365')">
					<v-avatar color="red darken-2 mr-2" size="20">
						<span class="white--text">
							{{ getAvatarText("A D",2) }}
						</span>
					</v-avatar>
					</span>
					
				</template>
				<template v-slot:label="{ item }">
					<span
						v-if="item.organizationName.length > 50 && !showAllText"
					>
						{{ item.organizationName.slice(0, 50) }}
						<a href="#" @click="showAllText = !showAllText">
							{{ $t("button.details") }}
						</a>
					</span>
					<span
						v-if="item.organizationName.length > 50 && showAllText"
						style="white-space: normal"
					>
						{{ item.organizationName }}
						<a href="#" @click="showAllText = !showAllText">
							{{ $t("button.hide") }}
						</a>
					</span>
					<span v-if="item.organizationName.length <= 50">
						{{ item.organizationName }}
					</span>
					<v-menu
						transition="slide-y-transition"
						bottom
						open-on-click
					>
						<template v-slot:activator="{ on, attrs }">
							<v-btn
								color="grey darken-2"
								dark
								icon
								v-bind="attrs"
								v-on="on"
							>
								<v-icon>mdi-dots-vertical</v-icon>
							</v-btn>
						</template>
						<v-list>
							<v-list-item @click="createItem(item)">
								<v-list-item-icon>
									<v-icon color="green darken-2">
										mdi-plus-circle
									</v-icon>
								</v-list-item-icon>
								<v-list-item-title>{{
									$t("button.insert")
								}}</v-list-item-title>
							</v-list-item>
							<v-list-item @click="editItem(item)" v-if ="!(item.tennantCode ==='SYNC365')">
								<v-list-item-icon>
									<v-icon color="blue darken-2">
										mdi-pencil
									</v-icon>
								</v-list-item-icon>
								<v-list-item-title>{{
									$t("button.edit")
								}}</v-list-item-title>
							</v-list-item>
							<v-list-item @click="deleteItem(item)">
								<v-list-item-icon>
									<v-icon color="red darken-2">
										mdi-trash-can-outline
									</v-icon>
								</v-list-item-icon>
								<v-list-item-title color="red darken-2">{{
									$t("button.delete")
								}}</v-list-item-title>
							</v-list-item>
						</v-list>
					</v-menu>
					<v-divider></v-divider>
				</template>
				<!-- <template v-slot:[`item.organizationName`]="{ item }">
					<v-avatar color="red darken-2 mr-2" size="28">
						<span class="white--text">
							{{ getAvatarText(item.organizationName, 2) }}
						</span>
					</v-avatar>
			</template> -->
		
				
			</v-treeview>
		</v-card-text>
	</v-card>
</template>

<script>
import globalService from "@/services/global.service";
import administratorAPI from "../administrator.api";
export default {
	name: "OrgchartListVue",
	data() {
		return {
			user_current: this.getUserInfo(),
			selected: [],
			dialog: {
				edit: false,
				delete: false,
			},
			isSaving: false,
			editedItem: {
				id: null,
				organizationCode: "",
				organizationName: "",
				orgParentCode: "",
				orgParentName: "",
				createdId: null,
				createdName: "",
				createdDate: null,
				modifiedId: null,
				modifiedName: "",
				modifiedDate: null,
				isActive: true,
				orgParent: null,
				childOrganization: [],
				isDelete: false,
				description: "",
			},
			defaultItem: {
				id: null,
				organizationCode: "",
				organizationName: "",
				orgParentCode: "",
				orgParentName: "",
				createdId: null,
				createdName: "",
				createdDate: null,
				modifiedId: null,
				modifiedName: "",
				modifiedDate: null,
				isActive: true,
				orgParent: null,
				childOrganization: [],
				isDelete: false,
				description: "",
			},
			listOrgParrent: [],
			root: [],
			raw: [],
			showAllText: false,
			listOrg: [],
			isDeleting: false,
		};
	},
	watch: {
		"dialog.edit"(value) {
			if (value) {
				this.m_update(this.editedItem);
			}
		},
	},
	created() {
		this.load();
	},
	methods: {
		load() {
			this.getCustomAllOrg();
			this.getAllOrg();
		},
		async getAllOrg() {
			let response = await globalService.getData_Async(
				administratorAPI.API_FindAllOrganization(),
			);
			if (!response || !response.state) {
				return;
			}
			this.listOrg = response.data.filter((entry) => {
				return !entry.isDelete;
			});

			this.listOrgParrent = response.data.filter((entry) => {
				return !entry.isDelete;
			});
		},
		async getCustomAllOrg() {
			let response = await globalService.getData_Async(
				administratorAPI.API_FindCustomAllOrganization(),
			);
			if (!response || !response.state) {
				return;
			}

			this.root = response.data
				.filter((entry) => {
					return !entry.orgParent && !entry.isDelete;
				})
				.map((entry) => {
					// return { ...entry, children: entry.childOrganization };
					return this.mapArray(entry);
				});
		},
		mapArray(source) {
			for (let key in source) {
				if (key == "childOrganization") {
					source.childOrganization = source.childOrganization.filter(
						(ele) => !ele.isDelete,
					);
					for (let childElement of source[key]) {
						this.mapArray(childElement);
					}
					source["children"] = source[key];
				}
			}
			return source;
		},
		async save() {
			this.editedItem.organizationName = this.editedItem.organizationName
				? this.editedItem.organizationName.trim()
				: "";

			this.editedItem.description = this.editedItem.description
				? this.editedItem.description.trim()
				: "";

			if (!this.validRequiredText(this.editedItem.organizationName)) {
				return this.toastError(this.$t("error.empty_orgName"));
			}
			if (
				this.editedItem.description &&
				this.editedItem.description.trim().length > 500
			) {
				return this.toastError(this.$t("error.invalid"));
			}
			if (this.isSaving) {
				return;
			}

			this.isSaving = true;
			let response;
			this.editedItem.modifiedName = this.user_current.fullName;
			this.editedItem.modifiedDate = new Date();
			try {
				if (this.editedItem.id) {
					response = await globalService.putData_Async(
						administratorAPI.API_UpdateOrganization(
							this.editedItem.id,
						),
						this.editedItem,
					);
					if (!response || !response.state) {
						return this.toastError(this.$t("message.update_error"));
					}
					this.toastSuccess(this.$t("message.update_success"));
				} else {
					this.editedItem.createdName = this.user_current.fullName;
					this.editedItem.createdDate = new Date();
					response = await globalService.postData_Async(
						administratorAPI.API_CreateOrganization(),
						this.editedItem,
					);
					if (!response || !response.state) {
						this.isSaving = false;
						return this.toastError(this.$t("message.add_error"));
					}
					this.toastSuccess(this.$t("message.add_success"));
				}
				this.isSaving = false;
				this.close();
			} catch (error) {
				this.toastError(this.$t("message.update_error"));
			}
		},
		///////////
		createItem(item) {
			this.editedItem = Object.assign({}, this.defaultItem);
			this.editedItem.orgParent = this.listOrg.find((entry) => {
				return entry.id == item.id;
			});
			this.dialog.edit = true;
		},
		editItem(item) {
			this.dialog.edit = true;
			this.editedItem = Object.assign({}, item);
			if (!this.editedItem.orgParent) return;
			this.editedItem.orgParent = this.listOrg.find((entry) => {
				return entry.id == this.editedItem.orgParent?.id;
			});
		},
		close() {
			this.dialog.edit = false;
			this.dialog.delete = false;
			this.editedItem = Object.assign({}, this.defaultItem);
			this.load();
		},
		deleteItem(value) {
			this.dialog.delete = true;
			if (value) {
				this.selected = [value];
			}
		},
		async m_update(value) {
			try {
				let response = await globalService.getData_Async(
					administratorAPI.API_GetChildOrg(value.id),
				);
				if (!response || !response.state) return;
				let temp = response.data.filter((entry) => {
					return !entry.isDelete;
				});
				this.listOrg = this.listOrgParrent.filter((e1) => {
					return !temp.some((e2) => e1.id == e2.id);
				});
			} catch (error) {
				console.log(error);
			}
		},
		onConfirmDelete(value) {
			if (!value) {
				this.onCloseDialog();
			} else {
				if (this.selected) {
					this.deleteAllConfirm();
				}
			}
		},
		async deleteAllConfirm() {
			if (this.isDeleting) {
				return;
			}
			this.isDeleting = true;
			this.selected = this.selected.map((entry) => {
				entry.isDelete = true;
				return entry;
			});
			try {
				let response = await globalService.postData_Async(
					administratorAPI.API_SaveAllOrganization(),
					this.selected,
				);
				if (response.state) {
					this.isDeleting = true;
					this.toastSuccess(this.$t("message.delete_success"));
				} else {
					this.toastError(this.$t("message.delete_error"));
				}
				this.selected = [];
				this.isDeleting = false;
				this.close();
			} catch (error) {
				this.toastError(this.$t("message.delete_error"));
			}
		},
		async sync() {
			let response;
			try {
				response = await globalService.postData_Async(
					administratorAPI.API_SyncUsers(this.userInfo.id),
					{},
				);
				if (!response || !response.state) {
					this.toastError(this.$t("error.sync"));
					return;
				}
				this.toastSuccess(this.$t("success.sync"));
				this.getCustomAllOrg();
			} catch (error) {
				console.error(error);
			}
		},
	},
};
</script>

<style>
.v-menu__content {
	max-width: 20vw !important;
}
</style>
