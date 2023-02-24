<template>
	<v-card elevation="0">
		<BreadcrumbsVue />
		<TabVue
			:tabs="tabs"
			:buttons="buttons"
			@buttonClick="handleButtonClick"
		/>
		<v-row class="mt-4 px-4">
			<v-col cols="12" md="4">
				<v-row>
					<v-col cols="12">
						<v-text-field
							v-model="templateForm.templateFormName"
							:error-messages="errorMessageTemplateName"
							@change="changeTemplateName()"
							@keyup="changeTemplateName()"
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
					<v-col cols="12">
						<v-file-input
							outlined
							dense
							append-icon="mdi-cloud-upload-outline"
							accept=".doc,.docx,.pdf,.xls,.xlsx"
							prepend-icon=""
							@change="handleFile($event)"
							@click:clear="onChangeDelete()"
							:value="
								templateForm.attachmentFileDTOS.length > 0
									? current
									: null
							"
						>
							<template v-slot:label>
								{{ $t("label.upload") }}
								<span class="text-red-600">{{
									$t("label.star")
								}}</span>
							</template>
						</v-file-input>
					</v-col>
					<v-col cols="12">
						<v-combobox
							v-model="templateForm.organizations"
							:items="listOrganizatin"
							item-text="organizationName"
							multiple
							chips
							outlined
							dense
							required
							prepend-inner-icon="mdi-magnify"
							:menu-props="{ maxWidth: '572px' }"
							maxLength="255"
							:error-messages="errorMessageOrganizations"
							@change="changeOrganiaztion()"
							@keyup="changeOrganiaztion()"
						>
							<template v-slot:label>
								{{ $t("label.organization_applicable") }}
								<span class="text-red-600">{{
									$t("label.star")
								}}</span>
							</template>
							<template v-slot:selection="{ attrs, item }">
								<v-chip
									class="ma-2"
									close
									v-bind="attrs"
									@click:close="deselectOrg(item)"
								>
									{{ item.organizationName }}
								</v-chip>
							</template>
						</v-combobox>
					</v-col>
				</v-row>
				<v-row>
					<v-col cols="12">
						<v-btn
							text
							class="
								rounded-0
								text-capitalize
								font-weight-regular
							"
							@click="appendItem()"
						>
							<v-icon small class="mr-2"> mdi-plus </v-icon>
							{{ $t("button.create") }}
						</v-btn>
						<v-btn
							text
							class="
								rounded-0
								text-capitalize
								font-weight-regular
							"
							@click="delete_item_select"
						>
							<v-icon small class="mr-2">
								mdi-trash-can-outline
							</v-icon>
							{{ $t("button.delete") }}
						</v-btn>
					</v-col>
				</v-row>
				<v-divider></v-divider>
				<v-row>
					<v-col cols="12">
						<v-data-table
							v-model="selected"
							show-select
							:hide-default-footer="
								items.length < 10 ? true : false
							"
							:headers="headers"
							:items="items"
							:no-data-text="this.$t('message.no_data')"
							item-key="id"
						>
							<template v-slot:[`item.action`]="{ item }">
								<v-btn
									icon
									v-if="editing != item"
									@click="edit(item)"
								>
									<v-icon>mdi-pencil-circle </v-icon>
								</v-btn>
								<v-btn icon v-else @click="update">
									<v-icon>mdi-checkbox-marked-circle </v-icon>
								</v-btn>
								<v-btn icon @click="deleteItem(item)">
									<v-icon>mdi-delete-circle </v-icon>
								</v-btn>
							</template>
							<template v-slot:[`item.name`]="{ item }">
								<span v-if="editing != item">
									{{ item.name }}
								</span>
								<v-text-field
									v-else
									v-model="mapping.name"
									class="mt-2"
									outlined
									dense
								>
									<template v-slot:label>
										{{ $t("label.position_in_file") }}
										<span class="text-red-600">{{
											$t("label.star")
										}}</span>
									</template>
								</v-text-field>
							</template>
							<template v-slot:[`item.position`]="{ item }">
								<span v-if="editing != item">
									{{ item.position }}
								</span>
								<v-text-field
									v-else
									v-model="mapping.position"
									class="mt-2"
									outlined
									dense
									:error-messages="
										errorMessageMappingPositionEdit
									"
									readonly
									@keyup="changePositionEdit()"
								>
									<template v-slot:label>
										{{ $t("label.position_in_file") }}
										<span class="text-red-600">{{
											$t("label.star")
										}}</span>
									</template>
								</v-text-field>
							</template>
							<template v-if="creating" v-slot:[`body.append`]>
								<tr>
									<td></td>
									<td>
										<v-text-field
											v-model="mapping.name"
											class="mt-2"
											:error-messages="
												errorMessageMappingName
											"
											maxLength="255"
											outlined
											dense
											@keyup="changeName()"
										>
											<template v-slot:label>
												{{ $t("label.n_information") }}
												<span class="text-red-600">{{
													$t("label.star")
												}}</span>
											</template>
										</v-text-field>
									</td>
									<td>
										<v-text-field
											v-model="mapping.position"
											class="mt-2"
											:error-messages="
												errorMessageMappingPosition
											"
											maxLength="255"
											outlined
											dense
											@change="changePosition()"
										>
											<template v-slot:label>
												{{
													$t("label.position_in_file")
												}}
												<span class="text-red-600">{{
													$t("label.star")
												}}</span>
											</template>
										</v-text-field>
									</td>
									<td>
										<v-btn icon @click="add">
											<v-icon>mdi-plus-circle</v-icon>
										</v-btn>
									</td>
								</tr>
							</template>
						</v-data-table>
					</v-col>
				</v-row>
			</v-col>
			<v-divider vertical></v-divider>
			<v-col cols="12" md="8">
				<v-skeleton-loader
					v-if="!previewLink"
					class="mx-auto"
					width="100%"
					type="card"
				></v-skeleton-loader>

				<v-btn
					v-if="previewLink"
					fab
					x-small
					color="blue darken-2"
					dark
					@click="openEdit"
				>
					<v-icon>mdi-pencil</v-icon>
				</v-btn>
				<iframe
					v-if="previewLink"
					:src="previewLink + '&amp;action=embedview'"
					width="100%"
					height="750"
					:title="templateForm.templateFormName"
					class="-mt-12"
					>This is an embedded
					<a target="_blank" href="https://office.com"
						>Microsoft Office</a
					>
					document, powered by
					<a target="_blank" href="https://office.com/webapps"
						>Office</a
					>.</iframe
				>
			</v-col>
		</v-row>
	</v-card>
</template>

<script>
import BreadcrumbsVue from "@/components/Breadcrumbs.vue";
import TabVue from "@/components/Tab.vue";
import TemplateFormDto from "@/models/template-form.dto";
import globalService from "@/services/global.service";
import administratorAPI from "../administrator.api";

export default {
	name: "EditTempalteFormV2Vue",
	components: { BreadcrumbsVue, TabVue },
	computed: {
		items() {
			try {
				return JSON.parse(this.templateForm.mappingInfo);
			} catch {
				return [];
			}
		},
	},
	watch: {
		"templateForm.attachmentFileDTOS": async function (value) {
			let response;
			try {
				// console.log("templateForm.attachmentFileDTOS", value);
				// let id = value[value.length - 1].id;
				let id = value.find((ele) => !ele.requestData).id;
				response = await globalService.getData_Async(
					administratorAPI.API_GetPreviewLink(id),
				);
				if (!response || !response.state) {
					return;
				}
				this.previewLink = response.data;
				this.items = JSON.parse(this.templateForm.mappingInfo);
			} catch {
				return;
			}
		},
		"mapping.name": function (value) {
			this.mapping.position = `{{${this.getIdFromValue(value)}}}`;
		},
	},
	data() {
		return {
			current: new File([""], "", {
				type: "text/plain",
			}),
			selected: [],
			listOrganizatin: [],
			isFile: false,
			isUpload: false,
			tabs: [{ key: "information", title: this.$t("label.information") }],
			buttons: [
				{
					icon: "mdi-content-save",
					title: this.$t("button.save"),
					color: "blue darken-2",
					transparent: false,
					dark: true,
					event: this.save,
				},
				{
					icon: "mdi-trash-can-outline",
					title: this.$t("button.delete"),
					color: "black",
					transparent: true,
					dark: false,
					event: this.delete,
				},
				{
					icon: "mdi-arrow-left-top",
					title: this.$t("button.back"),
					color: "black",
					transparent: true,
					dark: false,
					event: this.back,
				},
			],
			templateForm: Object.assign({}, TemplateFormDto),
			headers: [
				{
					text: this.$t("label.n_information"),
					align: "start",
					value: "name",
				},
				{
					text: this.$t("label.position_in_file"),
					value: "position",
				},
				{
					text: this.$t("label.manipulation"),
					sortable: false,
					value: "action",
				},
			],
			creating: false,
			editing: null,
			mapping: {
				name: "",
				position: "",
				id: null,
			},
			previewLink: "",
			errorMessageMappingName: "",
			errorMessageMappingPosition: "",
			errorMessageMappingNameEdit: "",
			errorMessageMappingPositionEdit: "",
			errorMessageTemplateName: "",
			errorMessageOrganizations: "",
			event_file: null,
			isSendFile: false,
		};
	},
	async created() {
		await this.initialize();
		await this.getAllOrganization();
	},
	mounted() {},
	methods: {
		async getAllOrganization() {
			let response = await globalService.getData_Async(
				administratorAPI.API_FindAllOrganization(),
			);
			if (!response || !response.state) return;
			this.listOrganizatin = response.data.filter((entry) => {
				return !entry.isDelete;
			});
		},
		async initialize() {
			if (!this.$router.currentRoute.params.id) {
				this.templateForm = Object.assign({}, TemplateFormDto);
				this.current = null;
				this.buttons = [
					{
						icon: "mdi-content-save",
						title: this.$t("button.save"),
						color: "blue darken-2",
						transparent: false,
						dark: true,
						event: this.save,
					},
					// {
					// 	icon: "mdi-trash-can-outline",
					// 	title: this.$t("button.delete"),
					// 	color: "black",
					// 	transparent: true,
					// 	dark: false,
					// 	event: this.delete,
					// },
					{
						icon: "mdi-arrow-left-top",
						title: this.$t("button.back"),
						color: "black",
						transparent: true,
						dark: false,
						event: this.back,
					},
				];
			} else {
				let response;
				try {
					response = await globalService.getData_Async(
						administratorAPI.API_GetTemplateForm(
							this.$router.currentRoute.params.id,
						),
					);
					if (!response || !response.state) {
						this.$router.push({ path: "./" });
						return;
					}
					this.templateForm = response.data;
					if (this.templateForm.attachmentFileDTOS.length > 0) {
						this.isFile = true;
						(this.current = new File(
							[
								this.templateForm.attachmentFileDTOS[0].fileName.split(
									".",
								)[0],
							],
							this.templateForm.attachmentFileDTOS[0].fileName,
							{
								type: "text/plain",
							},
						)),
							(this.previewLink =
								this.templateForm.attachmentFileDTOS[0].ofice365Path);
					}
				} catch (error) {
					this.$router.push({ path: "./" });
				}
			}
		},
		async handleButtonClick(event) {
			await event();
		},
		async handleFile(event) {
			if (!event) {
				return;
			}
			// let check = await this.onChangeDelete();
			// if (!check) {
			// 	this.toastError(this.$t("message.update_error"));
			// 	return;
			let ext = event.name.split(".").pop();

			let arr = ["docx", "pdf", "xlsx", "jpg", "pptx"];
			if (!arr.includes(ext)) {
				return this.toastError(this.$t("error.extFile")),this.isFile = false;
			}
			// }
			this.event_file = event;
			this.isFile = true;
			let canUpload = true;

			if (!this.templateForm.id) {
				canUpload = await this.save(false);
			}
			if (!canUpload) {
				return;
			}

			let response;
			try {
				// if (this.templateForm.attachmentFileDTOS.length) {
				// 	for (let item of this.templateForm.attachmentFileDTOS) {
				// 		response = await globalService.deleteData_Async(
				// 			administratorAPI.API_DeleteAttachmentFile(item.id),
				// 		);
				// 		if (!response || !response.state) {
				// 			return this.toastError(response);
				// 		}
				// 	}
				// }
				response = await globalService.upload_Async(
					administratorAPI.API_UploadTemplateFileCloud(
						this.templateForm.id,
					),
					event,
				);
				if (!response) {
					this.toastError(response);
					return;
				}
				if (!response.state) {
					this.toastError(response.messgage);
					return;
				}
				if (!this.templateForm.attachmentFileDTOS) {
					this.templateForm.attachmentFileDTOS = [];
				}
				this.templateForm.attachmentFileDTOS = [response.data];
				//this.previewLink = response.data;
				if (response) {
					this.isSendFile = true;
				}
			} catch (error) {
				this.toastError(error);
			}
		},

		async save() {
			this.templateForm.templateFormName =
				this.templateForm.templateFormName.trim();
			if (this.templateForm.templateFormName.trim().length == 0) {
				this.errorMessageTemplateName = this.$t("message.msg_1");
				return false;
			}
			if (this.templateForm.organizations.length == 0) {
				this.errorMessageOrganizations = this.$t("message.msg_1");
				return false;
			}

			if (!this.isFile) {
				this.toastError(this.$t("error.empty_uploadFile"));
				return false;
			}
			this.templateForm.modified = this.getUserInfo();
			this.templateForm.modifiedDate = new Date();
			this.templateForm.modifiedName = this.getUserInfo().fullName;
			if (!this.templateForm.id) {
				this.templateForm.created = this.getUserInfo();
				this.templateForm.createdDate = new Date();
				this.templateForm.createdName = this.getUserInfo().fullName;
			}

			let response;
			try {
				if (!this.templateForm.id) {
					response = await globalService.postData_Async(
						administratorAPI.API_CreateTemplateForm(),
						this.templateForm,
					);
					if (!response || !response.state) {
						return this.toastError(this.$t("message.add_error"));
					}
					this.toastSuccess(this.$t("message.update_success"));
					
				} else {
					response = await globalService.putData_Async(
						administratorAPI.API_SaveTemplateForm(
							this.templateForm.id,
						),
						this.templateForm,
					);
					if (!response || !response.data) {
						return this.toastError(this.$t("message.update_error"));
					}
					this.toastSuccess(this.$t("message.update_success"));
					this.initialize();
				}
				this.templateForm = response.data;
				if (this.templateForm.id && !this.isSendFile) {
					this.handleFile(this.event_file);
				}
				this.$router.push({
					path: `/quan-tri/bieu-mau/${this.templateForm.id}`,
					append: true,
				});
				// this.initialize();
				return true;
			} catch (error) {
				this.toastError(error);
				return false;
			}
		},
		async delete() {
			let response;
			try {
				this.templateForm.isDelete = true;
				response = await globalService.putData_Async(
					administratorAPI.API_SaveTemplateForm(this.templateForm.id),
					this.templateForm,
				);
				if (!response) {
					this.toastError(this.$t("error.delete"));
					return;
				}
				if (!response.state) {
					this.toastError(response.messgage);
					return;
				}
				this.toastError(this.$t("message.delete_success"));
				this.$router.push({ path: "." });
			} catch (error) {
				return;
			}
		},
		back() {
			this.$router.push({ path: "." });
		},
		appendItem() {
			this.creating = true;
			this.editing = null;
			this.mapping = { name: "", position: "", id: null };
		},
		add() {
			let temp = [];
			try {
				temp = JSON.parse(this.templateForm.mappingInfo);
			} catch (error) {
				temp = [];
			}

			this.mapping.name = this.mapping.name.trim();
			this.mapping.position = this.mapping.position.trim();
			this.mapping.id =
				this.mapping.name.trim() + this.mapping.position.trim();
			if (this.mapping.name.trim().length == 0) {
				return (this.errorMessageMappingName =
					this.$t("message.msg_1"));
			}
			if (this.mapping.name.trim().length > 0) {
				this.errorMessageMappingName = "";
			}
			if (this.mapping.position.trim().length == 0) {
				return (this.errorMessageMappingPosition =
					this.$t("message.msg_1"));
			}
			if (this.mapping.position.trim().length > 0) {
				this.errorMessageMappingPosition = "";
			}
			if (this.mapping.name) {
				let check_name = temp.some((entry) => {
					if (!entry.name) return;
					return entry.name
						.toLocaleUpperCase()
						.match(this.mapping.name.toLocaleUpperCase().trim());
				});
				if (check_name) {
					this.toastError("Tên này đã được sử dụng");
					return;
				}
			}
			temp.push(this.mapping);
			this.items.push(this.mapping);
			this.templateForm.mappingInfo = JSON.stringify(temp);
			this.mapping = { name: "", position: "" };
		},
		edit(item) {
			this.editing = item;
			this.mapping = item;
			this.creating = false;
		},
		update() {
			let temp = [];
			try {
				temp = JSON.parse(this.templateForm.mappingInfo);
			} catch (error) {
				temp = [];
			}
			this.mapping.name = this.mapping.name.trim();
			if (this.mapping.name.trim().length == 0) {
				return (this.errorMessageMappingName = this.toastError(
					"Tên thông tin không được để trống !",
				));
			}
			if (this.mapping.name) {
				let check_name = temp.some((entry) => {
					if (!entry.name) return;
					return entry.name
						.toLocaleUpperCase()
						.match(this.mapping.name.toLocaleUpperCase().trim());
				});
				if (check_name) {
					this.toastError("Tên này đã được sử dụng");
					return;
				}
			}
			// if (this.mapping.name.trim().length > 0) {
			// 	this.errorMessageMappingName = "";
			// }
			// if (this.mapping.position.trim().length == 0) {
			// 	return (this.errorMessageMappingPositionEdit =
			// 		this.$t("message.msg_1"));
			// }
			// if (this.mapping.position.trim().length > 0) {
			// 	this.errorMessageMappingPositionEdit = "";
			// }

			this.templateForm.mappingInfo = JSON.stringify(this.items);
			this.creating = false;
			this.editing = null;
		},

		/**
		 * @return {Array}
		 */
		_items() {
			try {
				return JSON.parse(this.templateForm.mappingInfo);
			} catch (error) {
				return [];
			}
		},
		deleteItem(item) {
			let index;
			for (let i = 0; i < this.items.length; i++) {
				if (
					this.items[i].name == item.name &&
					this.items[i].position == item.position
				) {
					index = i;
				}
			}
			this.items.splice(index, 1);
			this.templateForm.mappingInfo = JSON.stringify(this.items);
		},
		openEdit() {
			if (!this.templateForm.attachmentFileDTOS[0].ofice365Path) {
				this.toastError("error.unavaiable");
				return;
			}
			window.open(
				this.templateForm.attachmentFileDTOS[0].ofice365Path,
				"_blank",
			);
		},
		async onChangeDelete() {
			// console.log("this.templateForm.attachmentFileDTOS", this.templateForm.attachmentFileDTOS);
			this.isFile = false;
			this.isSendFile = false;
			let response;
			if (this.templateForm.attachmentFileDTOS.length) {
				for (let item of this.templateForm.attachmentFileDTOS) {
					response = await globalService.deleteData_Async(
						administratorAPI.API_DeleteAttachmentFile(item.id),
					);
					if (!response || !response.state) {
						return false;
					}
				}
			}
			// this.templateForm.attachmentFileDTOS = [];
			this.previewLink = "";
			return true;
		},
		changeName() {
			if (this.mapping.name.trim().length > 0) {
				this.errorMessageMappingName = "";
			}
		},
		changePosition() {
			if (this.mapping.position.trim().length > 0) {
				this.errorMessageMappingPosition = "";
			}
		},
		changeNameEdit() {
			if (this.mapping.name.trim().length > 0) {
				this.errorMessageMappingName = "";
			}
		},
		changePositionEdit() {
			if (this.mapping.position.trim().length > 0) {
				this.errorMessageMappingPosition = "";
			}
		},
		deselectOrg(item) {
			this.templateForm.organizations.splice(
				this.templateForm.organizations.indexOf(item),
				1,
			);
		},
		delete_item_select() {
			for (let i = 0; i < this.selected.length; i++) {
				this.deleteItem(this.selected[i]);
			}
			this.selected = [];
		},
		changeTemplateName() {
			if (this.templateForm.templateFormName.length > 0) {
				this.errorMessageTemplateName = "";
			}
		},
		changeOrganiaztion() {
			if (this.templateForm.organizations.length > 0) {
				this.errorMessageOrganizations = "";
			}
		},
	},
};
</script>

<style></style>
