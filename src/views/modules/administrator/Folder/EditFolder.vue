<template>
	<v-card elevation="0">
		<v-toolbar elevation="0" color="grey lighten-4">
			<v-toolbar-title>
				{{
					!m_item.id
						? $t("title.create_folder")
						: $t("title.edit_folder")
				}}</v-toolbar-title
			>
			<v-spacer></v-spacer>
			<v-btn icon @click="close">
				<v-icon>mdi-close</v-icon>
			</v-btn>
		</v-toolbar>
		<vue-perfect-scrollbar class="h-[42rem]">
			<v-card-text>
				<v-container>
					<v-form ref="form">
						<v-row>
							<v-col cols="12">
								<!-- <m-text-field
									:label="$t('label.name')"
									:required="true"
									:value="m_item.fileName"
									@value="
										(value) => {
											m_item.fileName = value;
										}
									"
								>
								</m-text-field> -->
								<v-text-field
									hide-details
									:label="$t('label.name')"
									v-model="m_item.fileName"
									outlined
									dense
									maxLength="255"
								>
								<template v-slot:label>
									{{
										$t(
											"label.name",
										)
									}}
									<span
										class="text-red-600"
										>{{
											$t("label.star")
										}}</span
									>
								</template>
								</v-text-field>
							</v-col>
							<v-col cols="12">
								<m-textarea
									:label="$t('label.description')"
									:value="m_item.description"
									@value="
										(value) => {
											m_item.description = value;
										}
									"
								>
								</m-textarea>
							</v-col>
							<!-- <v-col cols="12">
								<m-select
									dense
									:value="m_item.pathInHandBook"
									@value="(v) => (m_item.pathInHandBook = v)"
									outlined
									:items="[
										'Vingroup',
										'VCR',
										'Vinhome',
										'Vinpearl',
									]"
									clearable
									:no-data-text="$t('message.no_results')"
									:label="$t('label.data_room')"
									:required="true"
								>
								</m-select>
							</v-col> -->
						</v-row>
						<v-row>
							<v-col>
								<vue-tab
									:tabs="[
										{
											key: 'view',
											title: $t('button.view'),
										},
									]"
									:buttons="[]"
								></vue-tab>
								<vue-select-list
									:items="list_userInfo"
									:selected="user_view"
									keyName="id"
									valueName="fullName"
									@localUpdate="
										(v) => {
											user_view = v;
										}
									"
								></vue-select-list>
							</v-col>
						</v-row>
						<v-row>
							<v-col>
								<vue-tab
									:tabs="[
										{
											key: 'edit',
											title: $t('button.edit'),
										},
									]"
									:buttons="[]"
								></vue-tab>
								<vue-select-list
									:items="list_userInfo"
									:selected="user_edit"
									keyName="id"
									valueName="fullName"
									@localUpdate="
										(v) => {
											user_edit = v;
										}
									"
								></vue-select-list>
							</v-col>
						</v-row>
						<v-row>
							<v-col>
								<vue-tab
									:tabs="[
										{
											key: 'delete',
											title: $t('button.delete'),
										},
									]"
									:buttons="[]"
								></vue-tab>
								<vue-select-list
									:items="list_userInfo"
									:selected="user_delete"
									keyName="id"
									valueName="fullName"
									@localUpdate="
										(v) => {
											user_delete = v;
										}
									"
								></vue-select-list>
							</v-col>
						</v-row>
					</v-form>
				</v-container>
			</v-card-text>
		</vue-perfect-scrollbar>
		<v-card-actions>
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
import administratorAPI from "../administrator.api";
// import AttachmentPermisitionDTO from "@/models/attachment-permisstion.js";
export default {
	name: "EditFolderVue",
	props: { item: {}, parent: {} },
	data() {
		return {
			m_item: {
				id: null,
				contentType: "",
				fileBase64: "",
				fileName: "",
				isFolder: 1,
				needEncrypt: true,
				parentId: 0,
				createdId: this.getUserInfo().id,
				description: "",
				pathInHandBook: "",
			},
			m_defaultItem: {
				id: null,
				contentType: "",
				fileBase64: "",
				fileName: "",
				isFolder: 1,
				needEncrypt: true,
				parentId: 0,
				createdId: this.getUserInfo().id,
				description: "",
				pathInHandBook: "",
			},
			user_view: [],
			user_edit: [],
			user_delete: [],
			m_parent: {},
			list_userInfo: [],
			user_info: this.getUserInfo(),				// user hiện tại
			attachmentPermisionList : [],				// thông tin quyền
		};
	},
	watch: {
		item(value) {
			// this.$refs.form.reset();
			this.m_item = Object.assign({}, value);

				// cập nhật lại thông tin của popup
			this.initialize();
		},
		parent(value) {
			this.m_parent = value;
		},
	},
	created() {},
	mounted() {
		this.$refs.form.reset();
		this.initialize();
	},
	computed: {},
	methods: {
		close() {
			this.m_item = Object.assign({}, this.m_defaultItem);
			this.closeDialog();
		},
		async initialize() {
			this.m_item = this.item;
			this.m_parent = this.parent;
			await this.getAllUser();
		},
		async getAllUser() {
			let response = await globalService.getData_Async(
				administratorAPI.API_GetAllUserInfo(),
			);
			if (!response || !response.state) return;
			this.list_userInfo = response.data.filter(ele => !ele.isDelete && ele.isActive).sort( (e1, e2) => e1.fullName.localeCompare(e2.fullName));
			await this.getAttachmentPermision();
		},
		async getAttachmentPermision(){
			if(!this.m_item.id) return;
			let response = await globalService.getData_Async(
				administratorAPI.API_GetAll_ByAttachment_Attachment_Permisition(this.m_item.id),
			);
			if (!response || !response.state) return;
			this.attachmentPermisionList = response.data;
			this.user_view = response.data ? response.data.filter(ele => ele.isView).map(ele => this.list_userInfo.find(ele1 => ele1.id == ele.userInfo?.id)) : [];
			this.user_edit = response.data ? response.data.filter(ele => ele.isEdit).map(ele => this.list_userInfo.find(ele1 => ele1.id == ele.userInfo?.id)) : []; 
			this.user_delete = response.data ? response.data.filter(ele => ele.isDelete).map(ele => this.list_userInfo.find(ele1 => ele1.id == ele.userInfo?.id)) : [];
		},
		async save() {
			if (!this.m_parent || !this.m_parent.id) {
				return this.toastError(this.$t("error.missing_information"));
			}

			if (!this.validRequiredText(this.m_item.fileName.trim())) {
				return this.toastError(this.$t("message.empty_fileName"));
			}

			// if (
			// 	this.m_item.description.length > 0 &&
			// 	!this.validText(this.m_item.description)
			// ) {
			// 	return this.toastError(this.$t("error.invalid"));
			// }
			this.m_item.modified = this.getUserInfo();
			this.m_item.modifiedDate = new Date();
			this.m_item.modifiedName = this.getUserInfo().fullName;
			let response;
			try {
				if (!this.m_item.id) {
					// response = await globalService.postData_Async(
					// 	administratorAPI.API_CreateFolder(),
					// 	{
					// 		contentType: "",
					// 		fileBase64: "",
					// 		fileName: this.m_item.fileName,
					// 		isFolder: 1,
					// 		needEncrypt: true,
					// 		parentId: this.m_parent.idInFileService,
					// 		createdId: this.getUserInfo().id,
					// 	},
					// );

					response = await globalService.postData_Async(
						administratorAPI.API_Create365Folder(),
						{
							createdId: this.userInfo.id,
							folderName: `${this.m_item.fileName?.trim()}`,
							parentId: this.m_parent ? this.m_parent.id : 0,
							parentItemId: "",
							description: `${this.m_item.description?.trim()}`,
						},
					);
					if (!response || !response.state) {
						return this.toastError(this.$t("message.add_error"));
					}
				

					// lưu thông tin phân quyền \\
					let permisionAttachmentList = this.convertListAttachmentPermisition(response.data.id);

					let responsePermision;
					responsePermision = await globalService.postData_Async(
						administratorAPI.API_Save_Attachment_Permisition(),
						permisionAttachmentList,
					);
					if (!responsePermision || !responsePermision.state) {
						return this.toastError(this.$t("message.add_error"));
					}

					this.toastSuccess(this.$t("message.add_success"));
				} else {
					// response = await globalService.putData_Async(
					// 	administratorAPI.API_RenameFolder(
					// 		this.m_item.id,
					// 		this.m_item.fileName,
					// 	),
					// 	{},
					// );
					response = await globalService.putData_Async(
						administratorAPI.API_Save365Folder(
							this.m_item.id,
							this.m_item.fileName?.trim(),
						),
						{},
					);
					if (!response || !response.state) return;
					response = await globalService.putData_Async(
						administratorAPI.API_UpdateAttachmentFile(
							this.m_item.id,
						),
						this.m_item,
					);
					if (!response || !response.state) {
						return this.toastError(this.$t("message.update_error"));
					}


					// cập nhật lại thông tin phân quyền
					let responseDelete;
					responseDelete = await globalService.deleteData_Async(
						administratorAPI.API_DeleteAll_Attachment_Permisition(),
						this.attachmentPermisionList,
					);
					if (!responseDelete || !responseDelete.state) {
						return this.toastError(this.$t("message.update_error"));
					}

					let attachmentPermisionList = this.convertListAttachmentPermisition(this.m_item.id);
					let responsePermision;
					responsePermision = await globalService.postData_Async(
						administratorAPI.API_Save_Attachment_Permisition(),
						attachmentPermisionList,
					);
					if (!responsePermision || !responsePermision.state) {
						return this.toastError(this.$t("message.add_error"));
					}

					this.toastSuccess(this.$t("message.update_success"));
				}

				this.close();
				this.$emit("reload", true);
				// this.saveDialog();
			} catch (error) {
				this.toastError(error);
			}
		},

		convertListAttachmentPermisition(attachmentFileId){
			let permisionAttachmentList = [];
			this.user_view.forEach(ele => {
				if(!permisionAttachmentList.some(ele1 => ele1.userInfo?.id == ele.id)){
					let attachmentPermision = {};
					attachmentPermision.userInfo = {id: ele.id};
					attachmentPermision.attachmentFile = {id: attachmentFileId};
					attachmentPermision.isView = true;
					attachmentPermision.isEdit = false;
					attachmentPermision.isDelete = false;
					attachmentPermision.created = {id: this.userInfo?.id};
					attachmentPermision.createdName = this.userInfo?.fullName;
					attachmentPermision.createdOrgName = this.userInfo?.organizations ? this.userInfo?.organizations?.map(ele2 => ele2.organizationName).join(', ') : "";
					attachmentPermision.createdRankName = this.userInfo?.ranks ? this.userInfo?.ranks?.map(ele2 => ele2.rankName).join(', ') : "";
					attachmentPermision.createdDate = new Date();
					attachmentPermision.modified = {id: this.userInfo?.id};
					attachmentPermision.modifiedName = this.userInfo?.fullName;
					attachmentPermision.modifiedDate = new Date();
					permisionAttachmentList.push(attachmentPermision);
				}else{
					let index = permisionAttachmentList.findIndex(ele1 => ele1.userInfo?.id == ele.id);
					if(index > -1){
						permisionAttachmentList[index].isView = true;
						permisionAttachmentList[index].modified = {id: this.userInfo?.id};
						permisionAttachmentList[index].modifiedName = this.userInfo?.fullName;
						permisionAttachmentList[index].modifiedDate = new Date();
					}
				}
			});

			this.user_edit.forEach(ele => {
				if(!permisionAttachmentList.some(ele1 => ele1.userInfo?.id == ele.id)){
					let attachmentPermision = {};
					attachmentPermision.userInfo = {id: ele.id};
					attachmentPermision.attachmentFile = {id: attachmentFileId};
					attachmentPermision.isEdit = true;
					attachmentPermision.isDelete = false;
					attachmentPermision.isView = false;
					attachmentPermision.created = {id: this.userInfo?.id};
					attachmentPermision.createdName = this.userInfo?.fullName;
					attachmentPermision.createdOrgName = this.userInfo?.organizations ? this.userInfo?.organizations?.map(ele2 => ele2.organizationName).join(', ') : "";
					attachmentPermision.createdRankName = this.userInfo?.ranks ? this.userInfo?.ranks?.map(ele2 => ele2.rankName).join(', ') : "";
					attachmentPermision.createdDate = new Date();
					attachmentPermision.modified = {id: this.userInfo?.id};
					attachmentPermision.modifiedName = this.userInfo?.fullName;
					attachmentPermision.modifiedDate = new Date();
					permisionAttachmentList.push(attachmentPermision);
				}else{
					let index = permisionAttachmentList.findIndex(ele1 => ele1.userInfo?.id == ele.id);
					if(index > -1){
						permisionAttachmentList[index].isEdit = true;
						permisionAttachmentList[index].modified = {id: this.userInfo?.id};
						permisionAttachmentList[index].modifiedName = this.userInfo?.fullName;
						permisionAttachmentList[index].modifiedDate = new Date();
					}
				}
			})
			
			this.user_delete.forEach(ele => {
				if(!permisionAttachmentList.some(ele1 => ele1.userInfo?.id == ele.id)){
					let attachmentPermision = {};
					attachmentPermision.userInfo = {id: ele.id};
					attachmentPermision.attachmentFile = {id: attachmentFileId};
					attachmentPermision.isDelete = true;
					attachmentPermision.isView = false;
					attachmentPermision.isEdit = false;
					attachmentPermision.created = {id: this.userInfo?.id};
					attachmentPermision.createdName = this.userInfo?.fullName;
					attachmentPermision.createdOrgName = this.userInfo?.organizations ? this.userInfo?.organizations?.map(ele2 => ele2.organizationName).join(', ') : "";
					attachmentPermision.createdRankName = this.userInfo?.ranks ? this.userInfo?.ranks?.map(ele2 => ele2.rankName).join(', ') : "";
					attachmentPermision.createdDate = new Date();
					attachmentPermision.modified = {id: this.userInfo?.id};
					attachmentPermision.modifiedName = this.userInfo?.fullName;
					attachmentPermision.modifiedDate = new Date();
					permisionAttachmentList.push(attachmentPermision);
				}else{
					let index = permisionAttachmentList.findIndex(ele1 => ele1.userInfo?.id == ele.id);
					if(index > -1){
						permisionAttachmentList[index].isDelete = true;
						permisionAttachmentList[index].modified = {id: this.userInfo?.id};
						permisionAttachmentList[index].modifiedName = this.userInfo?.fullName;
						permisionAttachmentList[index].modifiedDate = new Date();
					}
				}
			})
			return permisionAttachmentList;
		},
	},
};
</script>

<style></style>
