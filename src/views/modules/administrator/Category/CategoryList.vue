<template>
	<v-card elevation="0">
		<BreadcrumbsVue />
		<v-dialog v-model="dialog.delete" persistent max-width="fit-content">
			<DeleteDialogVue
				@close="onClose"
				@confirmDelete="onConfirmDelete"
			/>
		</v-dialog>
		<v-dialog v-model="dialog.edit" persistent max-width="40vw">
			<EditCategoryVue
				:categoryGroupDto="selectedItem"
				:categoryGroupDtos="raw"
				:edit="dialog.edit"
				@save="initialize"
				@cancel="closeEditDialog"
			>
			</EditCategoryVue>
		</v-dialog>
		<template>
			<v-card-title>
				<v-btn
					elevation="0"
					text
					class="rounded-0 text-none font-weight-regular"
					@click="editCategoryGroup"
				>
					<v-icon small class="mr-2">mdi-plus</v-icon>
					{{ $t("button.insert") }}
				</v-btn>
				<v-btn
					v-if="selected.length > 0"
					elevation="0"
					text
					class="rounded-0"
					@click.stop="deleteAll"
				>
					<v-icon>mdi-trash-can-outline</v-icon>
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
			>
				<template v-slot:prepend="{ item, open }">
					<v-icon v-if="item.children && item.children.length">
						{{ open ? "mdi-folder-open" : "mdi-folder" }}
					</v-icon>
				</template>
				<template v-slot:label="{ item }">
					<span
						v-if="item.name.length > 120 && !item.showAllText"
						:key="item.name"
					>
						{{ item.name.slice(0, 120) }}
						<a href="#" @click="showText(item)">
							{{ $t("button.details") }}
						</a>
					</span>
					<span
						v-if="item.name.length > 120 && item.showAllText"
						:key="item.name"
					>
						{{ item.name }}
						<a href="#" @click="hideText(item)">
							{{ $t("button.hide") }}
						</a>
					</span>
					<span
						@click="clickToLog($event, item, _loadchild)"
						v-if="item.name.length <= 120"
					>
						{{ item.name }}
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
							<v-list-item @click="createChild(item)">
								<v-list-item-icon>
									<v-icon color="green darken-2">
										mdi-plus-circle
									</v-icon>
								</v-list-item-icon>
								<v-list-item-title>{{
									$t("button.add")
								}}</v-list-item-title>
							</v-list-item>
							<v-list-item @click="editCategoryGroup(item)">
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
			</v-treeview>
		</v-card-text>
	</v-card>
</template>

<script>
import globalService from "@/services/global.service";
import administratorAPI from "@/views/modules/administrator/administrator.api";
import EditCategoryVue from "./EditCategory.vue";
import DeleteDialogVue from "@/components/DeleteDialog.vue";
import BreadcrumbsVue from "@/components/Breadcrumbs.vue";
import Vue from 'vue';
export default {
	name: "CategoryList",
	components: { EditCategoryVue, DeleteDialogVue, BreadcrumbsVue },

	data() {
		return {
			loading: true,
			dialog: {
				edit: false,
				delete: false,
			},
			search: "",
			selected: [],
			selectedParent: [],
			root: [],
			selectedItem: {},
			raw: [],
			showAllText: false,
		};
	},
	created() {
		this.$Progress.start();
	},
	async mounted() {
		this.$Progress.finish();
		this.getAllRoot();
		// this.initialize();
	},
	watch: {
		"dialog.edit"(val) {
			if (!val) {
				this.getAllRoot();
			}
		},
	},
	methods: {
		async getAllRoot() {
			let response;
			try {
				response = await globalService.getData_Async(
					administratorAPI.API_GetMaxLevelCategory(),
				);
				if (!response || !response.state) {
					return this.toastError(this.$t("error.load"));
				}
				this.root = response.data.map((ele) => {
					ele.children = [];
					return ele;
				});
				this.raw = this.root;
			} catch (error) {
				console.log(error);
			}
		},
		initialize() {
			this.dialog.edit = false;
			this.dialog.delete = false;
			try {
				globalService
					.getData_NoAsync(
						administratorAPI.API_GetAllCategoryGroup(true),
					)
					.then((response) => {
						if (!response) return;
						this.raw = response.data.data.filter((entry) => {
							return !entry.isDelete;
						});
					});
				// this.root = response.data
				// 	.filter((entry) => {
				// 		entry.showAllText = false;
				// 		return !entry.parent && !entry.isDelete;
				// 	})
				// 	.map((entry) => {
				// 		return { ...entry, children: [] };
				// 	});
				// let children = response.data.filter((entry) => {
				// 	return !!entry.parent && !entry.isDelete;
				// });
				// let rerun = [];
				// for (let child of children) {
				// 	let parent = this.findParent(child.parent.id, this.root);
				// 	if (!parent) {
				// 		if (
				// 			children.find((entry) => {
				// 				return child.parent.id == entry.id;
				// 			})
				// 		) {
				// 			rerun.push(child);
				// 		}
				// 		continue;
				// 	}
				// 	if (!child.children) {
				// 		child.children = [];
				// 	}
				// 	parent.children.push(child);
				// }
				// for (let child of rerun) {
				// 	let parent = this.findParent(child.parent.id, this.root);
				// 	if (!parent) {
				// 		if (
				// 			children.find((entry) => {
				// 				return child.parentId == entry.id;
				// 			})
				// 		) {
				// 			rerun.push(child);
				// 		}
				// 		continue;
				// 	}
				// 	if (!child.children) {
				// 		child.children = [];
				// 	}
				// 	parent.children.push(child);
				// }
				// this.finishLoad();
			} catch (error) {
				this.errorLoad(error);
			}
		},
		findParent(parentId, root) {
			for (let entry of root) {
				if (entry.id == parentId) {
					return entry;
				}
				if (!entry.children || !entry.children.length) {
					continue;
				}
				let result = this.findParent(parentId, entry.children);
				if (!result) {
					continue;
				} else {
					return result;
				}
			}
		},
		deleteItem(item) {
			this.selected = [...[item.id]];
			this.selectedParent.push(item);
			this.dialog.delete = true;
		},
		async onConfirmDelete() {
			let response;
			try {
				let data = this.raw
					.filter((entry) => {
						return this.selected.includes(entry.id);
					})
					.map((entry) => {
						entry.isDelete = true;
						return entry;
					});

				data = data.concat(this.selectedParent);

				response = await globalService.postData_Async(
					administratorAPI.API_SaveAllCategoryGroup(),
					data,
				);
				if (!response) {
					return this.toastError(this.$t("error.delete"));
				}
				if (!response.state) {
					return this.toastError(this.$t("error.delete"));
				}

				this.toast(this.$t("success.delete"));

				this.closeDelete();
				this.getAllRoot();

				this.initialize();
			} catch (error) {
				this.toastError(error);
			}
		},
		closeDelete() {
			this.selectedParent = [];
			this.dialog.delete = false;
			this.getAllRoot();
		},
		deleteAll() {
			this.dialog.delete = true;
		},
		editCategoryGroup(item) {
			if (!item) {
				this.selectedItem = {};
			} else {
				this.selected = [...[item]];
				this.selectedItem = item;
			}
			// this.selectedItem.children = null;
			this.dialog.edit = true;
		},
		createChild(parent) {
			this.selectedItem = {};
			this.selectedItem.parent = parent;

			this.dialog.edit = true;
		},
		closeEditDialog(value) {
			if (value) {
				this.dialog.edit = false;
			}
		},
		showText(item) {
			this.$nextTick(() => {
				item.showAllText = !item.showAllText;
				this.$forceUpdate();
			});
		},
		hideText(item) {
			this.$nextTick(() => {
				item.showAllText = !item.showAllText;
				this.$forceUpdate();
			});
		},
		async clickToLog(event, item, callback) {
			if (item && item.click) {
				return;
			}
			item.click = true;

			let response = await globalService.getData_Async(
				administratorAPI.API_GetAllChildCategory(item.id),
			);

			if (!response || !response.state) {
				return;
			}
			this.raw = this.raw.concat(
				response.data.filter((ele) => {
					// return !ele.isDelete && ele.isActive;
					return !ele.isDelete;
				}),
			);

			// item.children = (item.children ? item.children : []).concat(
			// 	response.data.filter((ele) => {
			// 		// return !ele.isDelete && ele.isActive;
			// 		return !ele.isDelete;
			// 	}),
			// );
			Vue.set(item, 'children', (item.children ? item.children : []).concat(
				response.data.filter((ele) => {
					// return !ele.isDelete && ele.isActive;
					return !ele.isDelete;
				}),
			));

			event.target.click();

			if (response.data.length == 50) {
				callback(item, 1, item.id);
			}
		},
		_loadchild(item, page, id) {
			globalService
				.getData_NoAsync(
					administratorAPI.API_GetAllChildCategory(id, page),
				)
				.then((response) => {
					if (!response) {
						return;
					}
					this.raw = this.raw.concat(
						response.data.data.filter((ele) => {
							// return !ele.isDelete && ele.isActive;
							return !ele.isDelete;
						}),
					);
					// item.children = (item.children ? item.children : []).concat(
					// 	response.data.data.filter((ele) => {
					// 		// return !ele.isDelete && ele.isActive;
					// 		return !ele.isDelete;
					// 	}),
					// );
					Vue.set(item, 'children', (item.children ? item.children : []).concat(
						response.data.data.filter((ele) => {
							// return !ele.isDelete && ele.isActive;
							return !ele.isDelete;
						}),
					));

					if (response.data.data.length == 50) {
						page++;
						this._loadchild(item, page, id);
					}
				})
				.catch((err) => {
					console.error(err);
				});
		},
		onClose() {
			this.dialog.delete = false;
			this.getAllRoot();
		},
	},
};
</script>

<style></style>
