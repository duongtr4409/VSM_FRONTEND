<template>
	<v-card elevation="0">
		<v-dialog v-model="dialog.formOption" max-width="60vw" persistent>
			<FormOption
				@close="onClose"
				@save="onSaveFile"
				:requestDto="m_requestDto"
			/>
		</v-dialog>
		<v-row class="mt-4 px-4">
			<v-col>
				<div class="flex gap-4">
					<v-menu offset-y>
						<template v-slot:activator="{ on, attrs }">
							<span
								v-bind="attrs"
								v-on="on"
								@click="openSelectFormOption()"
							>
								<v-icon>mdi-plus</v-icon>
								{{ $t("button.create") }}
								<v-icon>mdi-menu-down</v-icon>
							</span>
						</template>
					</v-menu>
					<v-divider vertical></v-divider>
					<span @click="delete_">
						<v-icon>mdi-delete-outline</v-icon>
						{{ $t("button.delete") }}
					</span>
				</div>
			</v-col>
			<v-col>
				<v-btn
					color="blue darken-1"
					dark
					class="m-2 rounded float-right"
					@click="save()"
				>
					<v-icon> mdi-content-save </v-icon>
					{{ $t("button.save") }}
				</v-btn>
			</v-col>
		</v-row>
		<v-divider></v-divider>
		<v-row class="mt-4 px-4">
			<v-col cols="12" md="4">
				<v-row>
					<v-col>
						<v-combobox
							v-model="templateForm"
							:items="templates"
							item-text="templateFormName"
							outlined
							dense
							required
							maxLength="255"
						>
							<template v-slot:label>
								{{ $t("label.select_template_form") }}
							</template>
						</v-combobox>
					</v-col>
				</v-row>
				<v-row>
					<v-col cols="12">
						<v-btn text class="rounded-0" @click="appendItem()">
							<v-icon> mdi-plus </v-icon>
							{{ $t("button.create") }}
						</v-btn>
						<v-btn
							text
							class="rounded-0"
							@click="delete_item_select"
						>
							<v-icon> mdi-delete-outline </v-icon>
							{{ $t("button.delete") }}
						</v-btn>
					</v-col>
				</v-row>
				<v-divider></v-divider>
				<v-row>
					<v-col cols="12">
						<v-data-table
							v-model="selected"
							:single-select="singleSelect"
							show-select
							:hide-default-footer="
								items.length < 10 ? true : false
							"
							:headers="headers"
							:items="items"
							item-key="position"
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
							<template v-slot:[`item.position`]="{ item }">
								<span v-if="editing != item">
									{{ item.position }}
								</span>
								<v-select
									:menu-props="{ bot: true, offsetY: true }"
									v-if="editing == item"
									:items="list_field_tempalteform"
									item-text="name"
									:item-value="(item) => item.name"
									:label="$t('label.select_field')"
									dense
									outlined
									v-model="item.position"
									:no-data-text="$t('message.no_results')"
									:error-messages="
										errorMessageMappingPositionEdit
									"
									@keyup="changePositionEdit()"
									@change="changePositionEdit()"
								></v-select>
							</template>
							<template v-slot:[`item.name`]="{ item }">
								<span v-if="editing != item">
									{{ item.name }}
								</span>
								<v-select
									:menu-props="{ bot: true, offsetY: true }"
									v-if="editing == item"
									:items="list_field_form"
									item-text="id_name"
									:item-value="(item) => item.id_name"
									:label="$t('label.select_field')"
									v-model="item.name"
									dense
									outlined
									:no-data-text="$t('message.no_results')"
									:error-messages="
										errorMessageMappingNameEdit
									"
									@keyup="changeNameEdit()"
									@change="changeNameEdit()"
								>
								</v-select>
							</template>
							<template v-if="creating" v-slot:[`body.append`]>
								<tr class="mt-2">
									<td></td>
									<td>
										<v-select
											:menu-props="{
												bot: true,
												offsetY: true,
											}"
											:items="list_field_form"
											item-text="id_name"
											:item-value="(item) => item.id_name"
											v-model="mapping.name"
											dense
											outlined
											:no-data-text="
												$t('message.no_results')
											"
											:error-messages="
												errorMessageMappingName
											"
											@keyup="changeName()"
											@change="changeName()"
										></v-select>
									</td>
									<td>
										<v-select
											:menu-props="{
												bot: true,
												offsetY: true,
											}"
											:items="list_field_tempalteform"
											item-text="name"
											:item-value="(item) => item.name"
											dense
											outlined
											v-model="mapping.position"
											:no-data-text="
												$t('message.no_results')
											"
											:error-messages="
												errorMessageMappingPosition
											"
											@change="changePosition()"
											@:key="changePosition()"
										></v-select>
									</td>
									<td>
										<v-btn icon @click="add">
											<v-icon>mdi-plus-circle</v-icon>
										</v-btn>
									</td>
								</tr>
							</template>
							<template v-slot:no-data
								><h1>{{ $t("message.no_data") }}</h1></template
							>
							<template v-slot:no-results
								><h1>{{ $t("message.no_results") }}</h1>
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
				<iframe
					v-if="previewLink"
					:src="previewLink + '&amp;action=embedview'"
					width="100%"
					height="750"
					frameborder="0"
					title=""
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
import store from "@/store";
import TemplateFormDto from "@/models/template-form.dto";
import globalService from "@/services/global.service";
import administratorAPI from "../administrator.api";
import FormOption from "../FormOption/FormOption.vue";
import RequestDto from "@/models/request.dto";

export default {
	name: "EditTempalteFormV2Vue",
	components: { FormOption },
	props: {
		Form: {},
		requestDto: {},
	},
	computed: {},
	watch: {
		templateForm: async function (value) {
			try {
				let response = await globalService.getData_Async(
					`/api/template-form/${this.templateForm.id}/_all/attachment-files`,
				);
				this.templateForm.attachmentFileDTOS = response.data;
			} catch (error) {
				console.log(error);
			}
			let response;
			try {
				try {
					let id = value.attachmentFileDTOS.find(
						(ele) => !ele.requestData,
					).id;

					response = await globalService.getData_Async(
						administratorAPI.API_GetPreviewLink(id),
					);
					if (!response || !response.state) {
						return (this.previewLink = "");
					}
					if (response) {
						this.previewLink = response.data;
					}
				} catch (e) {
					console.log(e);
				}

				try {
					this.list_field_tempalteform = JSON.parse(
						this.templateForm.mappingInfo,
					);
				} catch (error) {
					console.log(error);
				}

				try {
					let response_Rquest = await globalService.getData_Async(
						administratorAPI.API_GetRequest(this.m_requestDto.id),
					);
					if (response_Rquest && response_Rquest.data.mappingInfo) {
						let obj = JSON.parse(response_Rquest.data.mappingInfo);
						if (obj[`${value.id}`]) {
							this.items = obj[`${value.id}`];
						} else {
							this.items = [];
						}
					}
				} catch (error) {
					console.log(error);
				}
				this.this.getFormForm();
			} catch {
				return;
			}
		},
		Form(value) {
			this.form = value;
		},
		requestDto(value) {
			this.m_requestDto = value;
		},
	},
	data() {
		return {
			singleSelect: false,
			selected: [],
			m_requestDto: RequestDto,
			form: [],
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
			m_template: Object.assign({}, TemplateFormDto),
			headers: [
				{
					text: this.$t("label.data_field_form"),
					align: "start",
					value: "name",
				},
				{
					text: this.$t("label.data_field_template"),
					// align: "start",
					value: "position",
				},
				{
					text: this.$t("label.manipulation"),
					// align: "start",
					sortable: false,
					value: "action",
				},
			],
			creating: false,
			editing: false,
			mapping: {
				name: "",
				position: "",
			},
			previewLink: "",
			templates: [],
			items: [],
			dialog: {
				formOption: false,
			},
			list_field_form: [],
			list_field_tempalteform: [],
			errorMessageMappingName: "",
			errorMessageMappingPosition: "",
			errorMessageMappingNameEdit: "",
			errorMessageMappingPositionEdit: "",
		};
	},
	async created() {
		store.state.loading = false;
		this.form = this.Form;
		this.m_requestDto = this.requestDto;
		await this.initialize();
	},
	mounted() {
		// store.state.loading = false;
	},
	methods: {
		async initialize() {
			try {
				await this.getFormForm();
				for (
					let i = 0;
					i < this.m_requestDto.templateForms.length;
					i++
				) {
					let response = await globalService.getData_Async(
						`/api/template-form/${this.m_requestDto.templateForms[i].id}/_all/attachment-files`,
					);
					this.m_requestDto.templateForms[i].attachmentFileDTOS =
						response.data;
				}

				this.templates = this.m_requestDto.templateForms;
				this.templateForm = this.m_requestDto.templateForms[0];
				this.onSaveFile(this.m_requestDto.templateForms);
			} catch (error) {
				console.log(error);
			}
		},
		async getListTemplate() {
			try {
				let response = await globalService.getData_Async(
					administratorAPI.API_GetAllTemplateForm(),
				);
				if (!response.state) {
					return;
				}
				this.templates = response.data.filter((entry) => {
					return !entry.isDelete;
				});
			} catch (error) {
				console.log(error);
			}
			this.templates = this.sortList(this.templates);
		},

		async handleButtonClick(event) {
			await event();
		},
		async handleFile(event) {
			if (!event) {
				return;
			}
			let canUpload = true;
			if (!this.templateForm.id) {
				canUpload = await this.save();
			}
			if (!canUpload) {
				return;
			}
			let response;
			try {
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
				this.templateForm.attachmentFileDTOS.push(response.data);
			} catch (error) {
				this.toastError(error);
			}
		},
		async save() {
			if (this.m_requestDto.mappingInfo == null) {
				let obj = {};
				obj[`${this.templateForm.id}`] = this.items;
				this.m_requestDto.mappingInfo = JSON.stringify(obj);
			} else {
				let obj = JSON.parse(this.m_requestDto.mappingInfo);
				obj[`${this.templateForm.id}`] = this.items;
				this.m_requestDto.mappingInfo = JSON.stringify(obj);
			}
			this.m_requestDto.templateForms = this.templates;

			try {
				let response = await globalService.putData_Async(
					"/api/requests/" + this.m_requestDto.id,
					this.m_requestDto,
				);
				if (response) {
					this.toastSuccess(this.$t("message.save_success"));
				}
				if (!response.state) {
					this.toastError(response.messgage);
					return false;
				}
			} catch (error) {
				this.toastError(error);
			}
		},
		async delete_() {
			let response;
			try {
				this.templateForm.isDelete = true;
				response = await globalService.putData_Async(
					"/api/template-forms/" + this.templateForm.id,
					this.templateForm,
				);
				if (!response) {
					this.toastError(response);
					return;
				}
				if (!response.state) {
					this.toastError(response.messgage);
					return;
				}
				// this.$router.push({ path: "." });
				if(response){
					let index = this.templates.findIndex(ele => ele.id == this.templateForm.id);
					this.templates.splice(index, 1);
					this.templateForm = null;
					this.previewLink = "";
					this.toastSuccess(this.$t("message.delete_success"));
				}
			} catch (error) {
				this.toastError(error);
			}
		},
		back() {
			this.$router.push({ path: "./" });
		},
		appendItem() {
			this.creating = true;
			this.editing = null;
			this.mapping = { name: "", position: "" };
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
			if (this.mapping.name.trim().length == 0) {
				return (this.errorMessageMappingNameEdit =
					this.$t("message.msg_1"));
			}
			if (this.mapping.name.trim().length > 0) {
				this.errorMessageMappingNameEdit = "";
			}
			if (this.mapping.position.trim().length == 0) {
				return (this.errorMessageMappingPositionEdit =
					this.$t("message.msg_1"));
			}
			if (this.mapping.position.trim().length > 0) {
				this.errorMessageMappingPositionEdit = "";
			}
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
			// let index = this.items.indexOf(item);
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
		openSelectFormOption() {
			this.dialog.formOption = true;
		},
		async onSaveFile(value) {
			this.templateForm = value[0];
			this.templates = value;
		},
		onClose(value) {
			if (value) {
				this.dialog.formOption = false;
			}
		},
		async getFormForm() {
			if (!this.m_requestDto.form || !this.m_requestDto.form.id) return;
			try {
				let response_All_Fields = await globalService.getData_Async(
					`/api/forms/${this.m_requestDto.form.id}`,
				);
				this.form = JSON.parse(response_All_Fields.data.objectSchema);
				if (this.form.length > 0) {
					for (let i = 0; i < this.form.length; i++) {
						for (let j = 0; j < this.form[i].elements.length; j++) {
							this.list_field_form.push({
								id: `{{${this.form[i].elements[j].field.configModel.id}}}`,
								id_name:
									this.form[i].elements[j].field.configModel
										.title,
							});
						}
					}
				}
			} catch (error) {
				console.log(error);
			}
		},
		delete_item_select() {
			for (let i = 0; i < this.selected.length; i++) {
				this.deleteItem(this.selected[i]);
			}
			this.selected = [];
		},
		find_name_for_field(item) {
			let name;
			for (let i = 0; i < this.list_field_form.length; i++) {
				if (item == this.list_field_form[i].id) {
					name = this.list_field_form[i].id_name;
					break;
				}
			}
			return name;
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
	},
};
</script>

<style></style>
