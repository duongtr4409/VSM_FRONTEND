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
				:categoryGroupDtos="root"
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
					elevation="0"
					text
					class="rounded-0 text-none font-weight-regular"
					@click.stop="deleteAll"
				>
					<v-icon small class="mr-2">mdi-trash-can-outline</v-icon>

					{{ $t("button.delete_all") }}
				</v-btn>
				<v-btn
					elevation="0"
					class="rounded-pill text-capitalize font-weight-regular"
					@click="openImportCargo"
					text
				>
					<v-icon color="blue"> mdi-arrow-up </v-icon>
					<span class="normal-case text-xs">
						{{ $t("button.import") }}</span
					>
				</v-btn>
			</v-card-title>
		</template>
		<v-data-table
			v-model="selected_group"
			:headers="headers_group"
			:items="root"
			:single-expand="singleExpand"
			item-key="id"
			show-select
			loading="true"
			:loading-text="$t('label.loading')"
			:show-expand="true"
			@item-expanded="clickToLog($event.item)"
			class="grey lighten-3"
			:hide-default-footer="root < 10 ? true : false"
			:no-data-text="this.$t('message.no_data')"
			hide-default-header
		>
			<template v-slot:top>
				<v-row class="mb-2">
					<v-col cols="1"></v-col>
					<v-col cols="2">{{
						$t("label.name_category_parent")
					}}</v-col>
					<v-col cols="2">{{ $t("label.manipulation") }}</v-col>
				</v-row>
				<v-divider></v-divider>
			</template>
			<template v-slot:[`item.name`]="{ item }">
				<div class="w-96">
					<span class="text-black"
						>{{ item.name.slice(0, 30) }}

						<span v-if="item.name.length > 20"> ... </span>
					</span>
					<v-btn
						icon
						color="red"
						@click="deleteItem(item)"
						class="text-black float-right cursor-pointer"
					>
						<v-icon> mdi-close-circle </v-icon>
					</v-btn>
					<v-btn
						icon
						color="blue darken-1"
						@click="editCategoryGroup(item)"
						class="text-black float-right cursor-pointer"
					>
						<v-icon> mdi-pencil-circle </v-icon>
					</v-btn>

					<v-btn
						icon
						color="green darken-2"
						@click="createChild(item)"
						class="text-black float-right cursor-pointer"
					>
						<v-icon> mdi-plus-circle</v-icon>
					</v-btn>
					<!-- <span
						class="text-black float-right cursor-pointer"
						@click="shareData(item)"
					>
						<v-icon>mdi-plus</v-icon>
						{{ $t("button.create") }}
					</span> -->
				</div>
			</template>
			<template v-slot:expanded-item="{ item }">
				<td
					:colspan="headers_group.length + 1"
					style="padding: 0"
					class="bg-white"
				>
					<v-data-table
						v-if="item.children >= 0"
						:headers="headers_child"
						:items="findItem(item)"
						:server-items-length="countAllItem"
						@pagination="changePage($event, item)"
						:page="eventPage.page"
						:no-results-text="$t('message.no_results')"
						multi-sort
					>
						<template v-slot:[`item.actions`]="{ item }">
							<div class="d-flex" style="min-width: fit-content">
								<v-btn
									color="blue darken-1"
									dark
									icon
									@click="editCategoryGroup(item)"
								>
									<v-icon> mdi-pencil-circle </v-icon>
								</v-btn>
								<v-btn
									icon
									color="red darken-1"
									dark
									@click="deleteItem(item)"
								>
									<v-icon> mdi-close-circle </v-icon>
								</v-btn>
							</div>
						</template>
					</v-data-table>
				</td>
			</template>
		</v-data-table>
		<v-dialog width="50vw" v-model="openImport" persistent>
			<v-card elevation="0">
				<v-toolbar flat color="grey lighten-4 max-h-[2.5rem]">
					<v-toolbar-title class="mb-5">
						{{ $t("button.import_cargo") }}</v-toolbar-title
					>
					<v-spacer></v-spacer>
					<v-btn icon @click="close" class="mb-5">
						<v-icon>mdi-close</v-icon>
					</v-btn>
				</v-toolbar>
				<v-card-text class="white mt-5">
					<v-container>
						<v-form>
							<v-col cols="12">
								<v-select
									:menu-props="{ bot: true, offsetY: true }"
									:items="list_form_digitalSignture"
									item-text="name_DigitalSignture"
									:label="$t('label.choose_goods')"
									outlined
									:item-value="
										(item) => item.id_DigitalSignture
									"
									dense
									hide-details
									v-model="listCargo"
								>
									<template v-slot:label>
										{{ $t("label.choose_goods") }}
										<span class="text-red-600">{{
											$t("label.star")
										}}</span>
									</template>
								</v-select>
							</v-col>
							<v-col>
								<v-row>
									<v-container class="mt-2 p-0">
										<label for="approveFiles">
											<v-card elevation="0">
												<div
													class="
														d-flex
														justify-space-between
														border-2
														px-2
													"
												>
													<v-card-text>
														{{
															$t("button.upload")
														}}
													</v-card-text>
													<v-divider
														vertical
													></v-divider>
													<v-icon x-large class="ml-4"
														>mdi-cloud-upload-outline
													</v-icon>
												</div>
											</v-card>
										</label>
										<input
											ref="approveFiles"
											id="approveFiles"
											type="file"
											class="sr-only"
											multiple
											@change="handleFile($event)"
										/>
										<VuePerfectScrollbar class="h-60">
											<v-list>
												<v-list-item
													v-for="file in files"
													:key="file.name"
												>
													<v-list-item-icon>
														<v-icon>
															{{
																m_files_icon[
																	file.name.split(
																		".",
																	)[
																		file.name.split(
																			".",
																		)
																			.length -
																			1
																	]
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
															@click="
																remove(file)
															"
														>
															mdi-delete-circle
														</v-icon>
													</v-list-item-icon>
												</v-list-item>
											</v-list>
										</VuePerfectScrollbar>
									</v-container>
								</v-row>
							</v-col>
						</v-form>
					</v-container>
				</v-card-text>
				<v-card-actions class="white">
					<v-spacer></v-spacer>
					<v-btn
						color="blue darken-1"
						elevation="0"
						dark
						@click="chekImport()"
					>
						{{ $t("button.ok") }}
					</v-btn>
					<v-btn color="grey lighten-4" elevation="0" @click="close">
						{{ $t("button.cancel") }}
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</v-card>
</template>

<script>
import globalService from "@/services/global.service";
import administratorAPI from "../administrator.api";
import EditCategoryVue from "./EditCategory.vue";
import DeleteDialogVue from "@/components/DeleteDialog.vue";
import BreadcrumbsVue from "@/components/Breadcrumbs.vue";

export default {
	name: "VSMFECategoryListV2",
	components: { EditCategoryVue, DeleteDialogVue, BreadcrumbsVue },

	data() {
		return {
			root: [],
			selectedItem: {},
			headers_group: [
				{
					text: this.$t("label.name_category_parent"),
					value: "name",
					width: "20%",
				},
				{
					text: this.$t("label.manipulation"),
					value: "actions",
					width: "20%",
				},
				{ text: "", value: "data-table-expand", width: "5%" },
			],
			headers_child: [
				{
					text: "",
					value: "",
					width: "7%",
				},
				{
					text: this.$t("label.name_category_children"),
					value: "name",
					width: "83%",
				},
				{
					text: this.$t("label.manipulation"),
					value: "actions",
					width: "10%",
				},
			],
			requests_group: [],
			list_all: [],
			eventPage: { page: 1 },
			listCategory: [],
			countAllItem: 0,
			singleExpand: true,
			dialog: {
				edit: false,
				delete: false,
			},
			selected_group: [],
			selectedParent: [],
			openImport: false,
			files: [],

			list_form_digitalSignture: [
				{
					id_DigitalSignture: 1,
					name_DigitalSignture: this.$t("label.goods_and_services"),
				},
				{
					id_DigitalSignture: 0,
					name_DigitalSignture: this.$t("label.list_of_goods_me"),
				},
			],
			listCargo: 3,
			loadImport: null,
		};
	},
	watch: {
		"dialog.edit"(val) {
			if (!val) {
				this.getAllRoot();
			}
		},
	},

	mounted() {
		this.getAllRoot();
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
			} catch (error) {
				console.log(error);
			}
		},
		async clickToLog(item) {
			this.loadImport = item;
			await this.getCountAllCategory(item.id);
			let response = await globalService.getData_Async(
				administratorAPI.API_GetAllChildCategory(item.id),
			);
			if (!response || !response.state) {
				return;
			}
			response.data = response.data.filter((entry) => {
				return !entry.isDelete;
			});
			this.changePage(event, item);
		},
		changePage(event, item) {
			this.eventPage = event;
			if (event.itemsPerPage == -1) {
				event.itemsPerPage = 10;
			}
			this.getAllCategory(item, event.page - 1, event.itemsPerPage);
			return;
		},
		findItem(item) {
			let list_view = this.list_all.filter((ele) => {
				return ele.parent.id == item.id;
			});
			return list_view;
		},
		async getAllCategory(item, page, size) {
			try {
				let response = await globalService.getData_NoAsync(
					administratorAPI.SearchAllCategoryGroup(
						item.id,
						page,
						size,
					),
				);
				this.listCategory = response.data.data;
				this.list_all = this.listCategory;
				this.findItem(item);
			} catch (error) {
				console.log(error);
			}
		},
		async getCountAllCategory(id) {
			let response = await globalService.getData_Async(
				administratorAPI.countAllChildPageable(id),
			);
			if (!response || !response.state) {
				return;
			}
			this.countAllItem = response.data;
		},

		editCategoryGroup(item) {
			if (!item) {
				this.selectedItem = {};
			} else {
				this.selected_group = [...[item]];
				this.selectedItem = Object.assign({}, item);
			}
			this.dialog.edit = true;
		},
		onClose() {
			this.dialog.delete = false;
			this.getAllRoot();
		},
		closeEditDialog(value) {
			if (value) {
				this.dialog.edit = false;
			}
		},
		deleteAll() {
			if (this.selected_group.length > 0) {
				this.dialog.delete = true;
			} else {
				this.toastError(this.$t("message.alert_no_selected"));
			}
		},
		deleteItem(item) {
			this.selected_group = [...[item.id]];
			this.selectedParent.push(item);
			this.dialog.delete = true;
		},
		async onConfirmDelete() {
			let response;
			try {
				let data = this.root
					.filter((entry) => {
						return this.selected_group.includes(entry.id);
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
				if (this.selectedParent[0]?.parent) {
					this.clickToLog(this.selectedParent[0]?.parent);
				}
				this.closeDelete();
				this.getAllRoot();

				//this.initialize();
			} catch (error) {
				this.toastError(error);
			}
		},
		createChild(parent) {
			this.selectedItem = {};
			this.selectedItem.parent = parent;
			this.dialog.edit = true;
		},
		closeDelete() {
			this.selectedParent = [];
			this.dialog.delete = false;
			this.getAllRoot();
		},
		initialize() {
			this.dialog.edit = false;
			this.dialog.delete = false;
			if (this.selectedItem?.parent) {
				this.clickToLog(this.selectedItem?.parent);
			}
			this.getAllRoot();
		},
		openImportCargo() {
			this.openImport = true;
		},
		handleFile(files) {
			for (let i in Array.from(files.target.files)) {
				if (
					!this.files.find(
						(ele) =>
							ele.name == Array.from(files.target.files)[i].name,
					)
				) {
					this.files.push(Array.from(files.target.files)[i]);
				}
			}
			for (let file of this.files) {
				let ext = file.name.split(".").pop();
				let arr = ["xlsx"];
				if (!arr.includes(ext)) {
					return (
						this.toastError(this.$t("message.err_format_file")),
						(this.files = [])
					);
				}
			}

			files.target.value = null;
		},
		remove(file) {
			let index = this.files.indexOf(file);
			this.files.splice(index, 1);
		},
		close() {
			this.openImport = false;
			this.listCargo = 3;
			this.files = [];
		},
		async importCargo() {
			if (!this.files.length > 0) {
				return this.toastError(this.$t("error.empty_files"));
			}
			let response;

			try {
				for (let file of this.files) {
					response = await globalService.uploadData_Async(
						administratorAPI.API_ImportCargo(),
						file,
						{},
					);
					if (!response) {
						return this.toastError(this.$t("error.upload_file"));
					}
					if (!response.state) {
						return this.toastError(response.message);
					}
					this.files = [];
				}
				this.toastSuccess(this.$t("message.import_success"));

				this.close();
				
			 
					this.clickToLog(this.loadImport);
				
			} catch (error) {
				this.toastError(error);
			}
		},
		async importCargo_Me() {
			if (!this.files.length > 0) {
				return this.toastError(this.$t("error.empty_files"));
			}

			let response;
			try {
				for (let file of this.files) {
					response = await globalService.uploadData_Async(
						administratorAPI.API_ImportCargo_Me(),
						file,
						{},
					);
					if (!response) {
						return this.toastError(this.$t("error.upload_file"));
					}
					if (!response.state) {
						return this.toastError(response.message);
					}
					this.files = [];
				}
				this.toastSuccess(this.$t("message.import_success"));

				this.close();
					this.clickToLog(this.loadImport);
			} catch (error) {
				this.toastError(error);
			}
		},
		async chekImport() {
			if (this.listCargo == 3) {
				return this.toastError(this.$t("message.alert_no_selected"));
			}
			if (this.listCargo == 1) {
				await this.importCargo();
			} else {
				await this.importCargo_Me();
			}
		},
	},
};
</script>

