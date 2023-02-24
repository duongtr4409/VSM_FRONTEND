<template>
	<v-card elevation="0">
		<BreadcrumbsVue />
		<v-dialog persistent v-model="dialog.editFolderDialog" max-width="60vw">
			<EditFolderVue
				:item="editedItem"
				:parent="parent"
				@close="onCloseDialog"
				@save="onSaveDialog"
				@reload="onSave"
			/>
		</v-dialog>
		<v-dialog
			persistent
			v-model="dialog.deleteConfirmDialog"
			width="fit-content"
		>
			<DeleteDialogVue
				@close="onCloseDialog"
				@confirmDelete="m_onConfirmDelete"
			/>
		</v-dialog>
		<v-dialog persistent v-model="dialog.uploadFileDialog" max-width="60vw">
			<UploadFileVue
				:parent="selected"
				@close="onCloseDialog"
				@upload="onUpload"
			/>
		</v-dialog>
		<v-dialog persistent v-model="dialog.viewFileDialog">
			<ViewFileVue :file="selectedFile" @close="onCloseDialog" />
		</v-dialog>
		<v-card elevation="0">
			<v-card-title>
				<v-btn
					text
					class="rounded-0 text-none font-weight-regular"
					@click="edit({}, selected)"
				>
					<v-icon small class="mr-2">mdi-plus</v-icon
					>{{ $t("button.insert") }}
				</v-btn>
				<v-btn
					text
					class="rounded-0 text-capitalize font-weight-regular"
					@click="dialog.uploadFileDialog = true"
				>
					<v-icon small class="mr-2"
						>mdi-cloud-upload-outline
					</v-icon>
					{{ $t("button.update_btn") }}
				</v-btn>
				<!-- <v-btn text class="rounded-0 text-none font-weight-regular">
					<v-icon small class="mr-2">mdi-cloud-sync</v-icon
					>{{ $t("button.sync") }}
				</v-btn> -->
				<v-btn
					text
					class="rounded-0 text-capitalize font-weight-regular"
					@click="dialog.deleteConfirmDialog = true"
				>
					<v-icon small class="mr-2">mdi-trash-can-outline </v-icon>
					{{ $t("button.delete") }}
				</v-btn>
				<v-spacer></v-spacer>
			</v-card-title>
		</v-card>
		<v-card elevation="0">
			<v-row>
				<v-col cols="12" md="3">
					<VuePerfectScrollbar class="h-[100vh]">
						<ul>
							<tree-item-file
								:item="root"
								@toggle="onToggle"
							></tree-item-file>
						</ul>
					</VuePerfectScrollbar>
				</v-col>
				<v-divider vertical></v-divider>
				<v-col>
					<v-toolbar elevation="0">
						<v-btn icon @click="back">
							<v-icon>mdi-arrow-left </v-icon>
						</v-btn>
						<v-breadcrumbs v-if="path" :items="[root, ...path]">
							<template v-slot:item="{ item }">
								<v-breadcrumbs-item
									v-if="item && item.fileName"
								>
									{{ item.fileName }}
								</v-breadcrumbs-item>
							</template>
						</v-breadcrumbs>
					</v-toolbar>
					<v-divider></v-divider>
					<VuePerfectScrollbar>
						<v-skeleton-loader
							v-if="!selected || !selected.children"
							type="table-heading, list-item-two-line, image, table-tfoot"
						></v-skeleton-loader>
						<v-data-table
							v-if="selected && selected.children"
							v-model="selectedList"
							:headers="headers"
							:items="selected.children"
							item-key="id"
							show-select
							:items-per-page="20"
						>
							<template
								v-slot:[`header.fileExtension`]="{ header }"
							>
								<v-icon>mdi-file-outline</v-icon
								>{{ header.text }}
							</template>
							<template v-slot:[`item.fileExtension`]="{ item }">
								<td>
									<v-icon v-if="!item.isFolder">
										{{ m_files_icon[item.fileExtension] }}
									</v-icon>
									<v-icon v-else color="yellow darken-2">
										{{ m_files_icon[""] }}
									</v-icon>
								</td>
							</template>
							<template v-slot:[`item.fileName`]="{ item }">
								<td
									class="cursor-pointer"
									@dblclick="onToggle(item)"
								>
									<span
										class="underline"
										v-if="
											item &&
											item.fileName.length > 50 &&
											!item.isShow
										"
									>
										{{ item.fileName.slice(0, 50) }}...
									</span>
									<span
										class="underline"
										v-if="
											item &&
											item.fileName.length > 50 &&
											item.isShow
										"
									>
										{{ item.fileName }}
									</span>
									<span
										class="underline"
										v-if="
											item && item.fileName.length <= 50
										"
									>
										{{ item.fileName }}
									</span>
									<span
										class="underline"
										v-if="
											item &&
											item.fileName.length > 50 &&
											!item.isShow
										"
									>
										<v-btn
											color="orange"
											text
											@click="item.isShow = !item.isShow"
										>
											{{ $t("button.details") }}
										</v-btn>
									</span>
									<span
										class="underline"
										v-if="
											item &&
											item.fileName.length > 50 &&
											item.isShow
										"
									>
										<v-btn
											color="orange"
											text
											@click="item.isShow = !item.isShow"
										>
											{{ $t("button.hide") }}
										</v-btn>
									</span>
								</td>
							</template>
							<template v-slot:[`item.fileSize`]="{ item }">
								<td>
									<span v-if="!item.isFolder">
										{{ _displayFileSize(item) }}
									</span>
								</td>
							</template>
							<!-- <template v-slot:[`item.modified`]="{ item }">
								<m-user-chip :item="item.modified" />
							</template> -->
							<template v-slot:[`item.modifiedDate`]="{ item }">
								<td>
									{{
										moment(item.modifiedDate).format(
											dateTimeFormat,
										)
									}}
								</td>
							</template>
							<template v-slot:[`item.actions`]="{ item }">
								<td>
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
										<v-list>
											<v-list-item
												v-if="item.isFolder && checkPermisition(item.id, ACTION_EDIT)"
												@click="edit({}, item)"
											>
												<v-list-item-icon>
													<v-icon
														color="green darken-2"
													>
														mdi-plus-circle
													</v-icon>
												</v-list-item-icon>
												<v-list-item-title>
													{{
														$t(
															"button.create_folder",
														)
													}}
												</v-list-item-title>
											</v-list-item>
											<v-list-item
												v-if="!item.isFolder && checkPermisition(item.id, ACTION_VIEW)"
												@click="viewFile(item)"
											>
												<v-list-item-icon>
													<v-icon
														color="green darken-2"
													>
														mdi-eye-circle
													</v-icon>
												</v-list-item-icon>
												<v-list-item-title>
													{{ $t("button.view") }}
												</v-list-item-title>
											</v-list-item>
											<v-list-item
												v-if="!item.isFolder && checkPermisition(item.id, ACTION_EDIT)"
												@click="editFile(item)"
											>
												<v-list-item-icon>
													<v-icon
														color="green darken-2"
													>
														mdi-pencil-circle
													</v-icon>
												</v-list-item-icon>
												<v-list-item-title>
													{{
														$t("button.edit_online")
													}}
												</v-list-item-title>
											</v-list-item>
											<v-list-item v-if="checkPermisition(item.id, ACTION_EDIT)"
												@click="edit(item, selected)"
											>
												<v-list-item-icon>
													<v-icon
														color="blue darken-2"
													>
														mdi-pencil-circle
													</v-icon>
												</v-list-item-icon>
												<v-list-item-title>
													{{ $t("button.edit_info") }}
												</v-list-item-title>
											</v-list-item>
											<v-list-item
												v-if="checkPermisition(item.id, ACTION_DELETE)"
												@click="deleteItem(item)"
											>
												<v-list-item-icon>
													<v-icon
														color="red darken-2"
													>
														mdi-delete-circle
													</v-icon>
												</v-list-item-icon>
												<v-list-item-title>
													{{ $t("button.delete") }}
												</v-list-item-title>
											</v-list-item>
										</v-list>
									</v-menu>
								</td>
							</template>
						</v-data-table>
					</VuePerfectScrollbar>
				</v-col>
			</v-row>
		</v-card>
	</v-card>
</template>

<script>
import BreadcrumbsVue from "@/components/Breadcrumbs.vue";
import EditFolderVue from "../Folder/EditFolder.vue";
import DeleteDialogVue from "@/components/DeleteDialog.vue";
import Vue from "vue";
import constant from "@/common/constant";
import globalService from "@/services/global.service";
import administratorAPI from "../administrator.api";
import moment from "moment";
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import UploadFileVue from "./UploadFile.vue";
import ViewFileVue from "./ViewFile.vue";
import graphService from "@/modules/graph/services/graph.service";
// import authService from "@/modules/graph/services/auth.service";

export default {
	name: "FileManagerVue",
	components: {
		BreadcrumbsVue,
		EditFolderVue,
		DeleteDialogVue,
		VuePerfectScrollbar,
		UploadFileVue,
		ViewFileVue,
	},
	data() {
		return {
			user_info: this.getUserInfo(),
			dateTimeFormat: "DD/MM/yyyy",
			moment: moment,
			dialog: {
				editFolderDialog: false,
				deleteConfirmDialog: false,
				uploadFileDialog: false,
				viewFileDialog: false,
			},

			root: {
				idInFileService: "017bd09e-4377-4b1b-bd0e-f8e55114e6db",
				fileName: "root",
				fileExtension: "",
				isFolder: true,
				children: [],
			},
			selected: {},
			editedItem: {},
			parent: {},
			active: [],
			openSync: [],
			path: [],
			selectedFile: {},
			editWindow: null,
			interval: null,
			idInMicrosoft: null,
			headers: [
				{ text: "", value: "fileExtension" },
				{ text: this.$t("label.name"), value: "fileName" },
				{ value: "actions" },
				{
					text: this.$t("label.data_room"),
					value: "pathInHandBook",
				},
				{ text: this.$t("label.size"), value: "fileSize" },
				{ text: this.$t("label.modified_name"), value: "modifiedName" },
				{ text: this.$t("label.last_update"), value: "modifiedDate" },
			],
			selectedList: [],
			isLoadRoot: false,
			listAllFile: [],
			listPermisionOfFile: {},			// object chứa thông tin quyền của user với folder(file)  : { idFile: [quyền với file]} vd : {123: [EDIT, DELETE, VIEW]}
			listPermisionOfUser: [],			// thông tin phân quyền file của user hiện tại
			ACTION_VIEW: "VIEW",				// hằng số Xem
			ACTION_EDIT: "EDIT",				// hằng số Sửa
			ACTION_DELETE: "DELETE",			// hằng số Xóa 
		};
	},
	watch: {
		selected(value) {
			if (this.root) {
				this.path = this.getPath(this.root.children, value);
			}
		},
		selectedFile() {
			this.idInMicrosoft = false;
		},
	},
	created() {},
	async mounted() {
		await this.initialize();
	},
	computed: {},
	methods: {
		async initialize() {
			await this.getAllAttachmentPermisitionOfUser();		// lấy thông tin quyền truy cập lưu trữ của user hiện tại
			let response;
			try {
				response = await globalService.getData_Async(
					administratorAPI.API_GetRootFolder(),
					{},
					() => {},
					false,
				);
				if (!this.preHandleResponse(response)) {
					return;
				}
				this.root = response.data;
				this.onToggle(this.root);
			} catch (error) {
				this.toastError(error);
			}
		},
		async edit(item, parent) {
			this.dialog.editFolderDialog = true;
			this.editedItem = item;
			this.parent = parent;
		},
		deleteItem(item) {
			this.dialog.deleteConfirmDialog = true;
			this.selectedList = [item];
			// this.editedItem = item;
		},
		async onConfirmDelete(value) {
			if (value) {
				this.onCloseDialog();
				let response;
				try {
					if (this.editedItem.isFolder) {
						response = await globalService.deleteData_Async(
							administratorAPI.API_Delete365Folder(
								this.editedItem.id,
							),
						);
					} else {
						response = await globalService.deleteData_Async(
							administratorAPI.API_Delete365File(
								this.editedItem.id,
							),
						);
					}
					if (!response) {
						return this.toastError(this.$t("error.delete"));
					}
					if (!response.state) {
						return this.toastError(response.message);
					}
					this.toastSuccess(this.$t("success.delete"));
					await this.onToggle(this.root);
				} catch (error) {
					this.toastError(error);
				}
			}
		},
		async m_onConfirmDelete(value) {
			let parrentDeleteId = 0;
			if (this.selectedList.length == 0) {
				this.toastError(this.$t("label.no_selected"));
				this.dialog.deleteConfirmDialog = false;
				return;
			}
			if (value) {
				let response;
				try {
					for (let item of this.selectedList) {
						if (item.isFolder) {
							response = await globalService.deleteData_Async(
								administratorAPI.API_Delete365Folder(item.id),
							);
						} else {
							response = await globalService.deleteData_Async(
								administratorAPI.API_Delete365File(item.id),
							);
						}
						if (!response || !response.state) {
							this.toastError(this.$t("error.delete"));
						}
						if(item.id) parrentDeleteId = item.parentId
					}
					// this.initialize();
					this.selectedList = [];
				} catch (error) {
					this.toastError(error);
				} finally {
					this.onCloseDialog();
					// await this.onToggle(this.root);
					let parent = this.listAllFile.find(ele => ele.id == parrentDeleteId);
					if(parent)
						await this.onToggle(parent);
				}
			}
		},
		async _loadChild(item) {
			let response;
			try {
				response = await globalService.getData_Async(
					administratorAPI.API_Get365FolderContent(item.id),
					{},
					() => {},
					false,
				);
				if (!response) {
					return this.toastError(this.$t("error.load"));
				}
				if (!response.state) {
					return this.toastError(response.message);
				}
				response.data.forEach((entry) => {
					entry.isShow = false;
				});
				
				let childOfParent = response.data.filter(ele => {			// biến chứa những phần tử là con trực tiếp của item
					return ele.parentId == item.id;
				});

				let temp = response.data.filter(ele => {		// biến chứa những phần tử ko phải là con trực tiếp của item
					return ele.parentId != item.id;
				});

				childOfParent.forEach(ele => {
					Vue.set(ele, constant.keys.children, temp.filter(ele1 => {
						return ele1.parentId == ele.id;
					})).sort();	
				});
				
				if(item == this.root){		// TH là root -> cập nhật biến all
					this.listAllFile = response.data;
					this.listAllFile.push(this.root);
				}

				childOfParent = childOfParent.sort( (e1, e2) => { 
						if(!e1 || !e2 ) return 1;
						else{
							return new Date(e2.modifiedDate).getTime() - new Date(e1.modifiedDate).getTime();
						}
					});

				return childOfParent;
			} catch (error) {
				this.toastError(error);
			}
		},
		async loadChild(item) {
			this.selected = item;
			let children = await this._loadChild(item);
			item.children = [children];
		},
		async onToggle(value) {
			// if (value && !value.isFolder) {
			// 	this.selectedFile = value;
			// 	return;
			// }
			// this.selected = value;
			// let children = await this._loadChild(value);
			// if (children) {
			// 	Vue.set(value, constant.keys.children, children);
			// }
			// for (let child of children) {
			// 	if (!child.isFolder) {
			// 		continue;
			// 	}
			// 	let tmp = await this._loadChild(child);
			// 	Vue.set(child, constant.keys.children, tmp);
			// }

			if (value && !value.isFolder) {
				this.selectedFile = value;
				return;
			}
			this.selected = value;
			let children = await this._loadChild(value);

			if (children) {
				Vue.set(value, constant.keys.children, children);
			}

				// cập nhật quyền \\
			this.updatePermisition(value)
			
			// for (let child of children) {
			// 	if (!child.isFolder) {
			// 		continue;
			// 	}
			// 	let tmp = await this._loadChild(child);
			// 	Vue.set(child, constant.keys.children, tmp);
			// }
		},
		async onSelect(value) {
			this.selected = value;
		},
		onSave(value) {
			if (value) {
				this.initialize();
			}
		},
		async onSaveDialog() {
			this.onCloseDialog();
			this.selected = this.parent;
			// await this.onToggle(this.root);
			this.initialize();
		},
		async back() {
			let items = this.getPath(this.root.children, this.selected);
			if (!items || items.length < 2) {
				this.selected = this.root;
				return;
			}
			this.selected = items[items.length - 2];
			await this.onToggle(this.selected);
		},
		async viewFile(item) {
			this.selectedFile = item;
			this.dialog.viewFileDialog = true;
		},
		async editFile(item) {
			this.selectedFile = item;
			if (!item.ofice365Path) {
				return this.toastError(this.$t("error.system_not_response"));
			}
			try {
				// if (!authService.user()) {
				// 	await authService.login();
				// }
				window.open(item.ofice365Path, "_blank");
				// let description = JSON.parse(item.description);
				// let fileResponse = await globalService.downloadBlob_Async(
				// 	administratorAPI.FullAPI_DownloadFileById(
				// 		item.idInFileService,
				// 		description.contentType,
				// 	),
				// );
				// if (!fileResponse) {
				// 	return this.toastError(this.$t("error.load_file"));
				// }
				// let uploadResponse = await graphService.uploadFile(
				// 	`${item.fileName}.` +
				// 		this.convertContentTypeToFileExtension(
				// 			description.contentType,
				// 		),
				// 	fileResponse,
				// );

				// if (!uploadResponse) {
				// 	return this.toastError("error.upload_to_office_365");
				// }
				// this.idInMicrosoft = uploadResponse.id;
				// this.editWindow = window.open(
				// 	uploadResponse.webUrl,
				// 	"targetWindow",
				// 	`toolbar=no,
				// 	location=no,
				// 	status=no,
				// 	menubar=no,
				// 	scrollbars=yes,
				// 	resizable=yes,
				// 	width=1600,
				// 	height=800`,
				// );
				// let handler = this._handle;
				// this.interval = setInterval(handler, constant.values.interval);
			} catch (error) {
				this.toastError(error);
			}
		},
		async _handle() {
			if (!this.editWindow) {
				return;
			}
			if (!this.editWindow.closed) {
				return;
			}
			if (!this.idInMicrosoft) {
				return;
			}
			clearInterval(this.interval);
			await this.sync();
		},
		async sync() {
			try {
				let getUrlResponse = await graphService.getDownloadUrlByFileId(
					this.idInMicrosoft,
				);
				if (!getUrlResponse) {
					return this.toastError(
						this.$t("error.download_from_office_365"),
					);
				}
				let downloadResponse = await globalService.downloadBlob_Async(
					getUrlResponse.data["@microsoft.graph.downloadUrl"],
				);
				if (!downloadResponse) {
					return this.toastError(
						this.$t("error.download_from_office_365"),
					);
				}
				let updateResponse = await globalService.updateFile_Async(
					administratorAPI.API_UpdateFile(
						this.selectedFile.idInFileService,
					),
					downloadResponse,
				);

				if (!updateResponse) {
					return this.toastError(this.$t("message.update_error"));
				}
				if (!updateResponse.state) {
					return this.toastError(updateResponse.message);
				}
				this.editWindow.close();
			} catch (error) {
				this.toastError(error);
			}
		},
		async onUpload(value) {
			if (value) {
				this.onCloseDialog();
				await this.onToggle(this.selected);
			}
		},
		_displayFileSize(item) {
			if (!item) {
				return;
			}
			if (item.isFolder) {
				return;
			}
			// let description = JSON.parse(item.description);
			return this.displayFileSize(item.fileSize);
		},
		async getAllAttachmentPermisitionOfUser(){
			let response = await globalService.getData_Async(
				administratorAPI.API_GetAll_Attachment_Permisition(this.user_info.id)
			);
			if(!response || !response?.data) return;
			this.listPermisionOfUser = [];
			this.listPermisionOfUser = response.data;
		},
		/**
		 * Hàm thực hiện kiểm tra có quyền với attachemntFile hay không
		 * 	attachmentFileId: id của file cần kiểm tra
		 * 	action: hành động kiểm tra
		 * true: có quyền | false: không có
		 */
		checkPermisition(attachmentFileId, action){
			if(this.listPermisionOfFile[attachmentFileId]){
				return this.listPermisionOfFile[attachmentFileId].some(ele => ele == action);
			}else{
				return false;
			}
		},
		/**
		 * Hàm thực hiện update quyền cho folder (gồm cả các folder con) để hiển thị các thao tác tương ứng
		 * @param {*} item 
		 */
		updatePermisition(item){
			// cập nhật thông tin quyền truy cập File
			if(item?.id){
				let permision = [];
				if(this.listPermisionOfFile[item?.parentId]){		// lấy quyền từ folder cha truyền cho
					permision = [...this.listPermisionOfFile[item?.parentId]]
				}
				let permisionOfUserInFile = this.listPermisionOfUser.find(ele => ele?.attachmentFile?.id == item.id);
				if(permisionOfUserInFile?.isDelete && !permision.some(ele => ele == this.ACTION_DELETE)) permision.push(this.ACTION_DELETE);
				if(permisionOfUserInFile?.isEdit && !permision.some(ele => ele == this.ACTION_EDIT)) permision.push(this.ACTION_EDIT);
				if(permisionOfUserInFile?.isView && !permision.some(ele => ele == this.ACTION_VIEW)) permision.push(this.ACTION_VIEW);
				if(this.listPermisionOfFile[item.id]){
					Vue.set(this.listPermisionOfFile, item.id, permision);
				}else{
					Vue.set(this.listPermisionOfFile, item.id, permision);
				}
				
				// cập nhật quyền cho các folder con theo quyền của folder cha
				if(item?.children){
					for(let value of item?.children){
						if(this.listPermisionOfFile[value.id]){
							Vue.set(this.listPermisionOfFile, value.id, permision);
						}else{
							Vue.set(this.listPermisionOfFile, value.id, permision);
						}
						// nếu được phân quyền trực tiếp -> dùng quyền của chính nó + với quền của folder cha
						let permisionOfUserInFileValue = this.listPermisionOfUser.find(ele => ele?.attachmentFile?.id == value.id);
						if(permisionOfUserInFileValue){
							let permisionOfValue = [...permision];
							if(permisionOfUserInFileValue?.isDelete && !permisionOfValue.some(ele => ele == this.ACTION_DELETE)) permisionOfValue.push(this.ACTION_DELETE);
							if(permisionOfUserInFileValue?.isEdit && !permisionOfValue.some(ele => ele == this.ACTION_EDIT)) permisionOfValue.push(this.ACTION_EDIT);
							if(permisionOfUserInFileValue?.isView && !permisionOfValue.some(ele => ele == this.ACTION_VIEW)) permisionOfValue.push(this.ACTION_VIEW);
							Vue.set(this.listPermisionOfFile, value.id, permisionOfValue);
						}
					}

				}
			}
		},
	},
};
</script>

<style></style>
