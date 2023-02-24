<template>
	<v-card elevation="0">
		<v-toolbar elevation="0" class="h-2 px-2 -ml-2">
			<span class="text-base">
				{{ $t("label.main_document") }}
			</span>
			<v-spacer></v-spacer>
			<v-btn icon x-small @click="close">
				<v-icon> mdi-close </v-icon>
			</v-btn>
		</v-toolbar>
		<v-divider></v-divider>
		<vue-perfect-scrollbar class="h-[70vh]">
			<label
				for="filesDocument"
				class="
					cursor-pointer
					mx-4
					p-2
					mt-2
					flex
					rounded-md
					blue-grey
					lighten-5
				"
			>
				<v-icon color="blue darken-2">
					mdi-cloud-upload-outline
				</v-icon>
				<div class="flex justify-end">
					<v-chip
						color="teal accent-4"
						dark
						class="rounded cursor-pointer"
					>
						{{ $t("button.upload") }}
					</v-chip>
				</div>
			</label>
			<input
				ref="files"
				id="filesDocument"
				type="file"
				class="sr-only"
				multiple
				@change="handleFile($event)"
			/>
			<vue-perfect-scrollbar v-if="!!files.length" class="mx-4 p-2">
				<p v-for="file in files" :key="file.name" class="text-xs my-1">
					{{ file.name }}
					<v-btn icon x-small>
						<v-icon color="red darken-2" @click="remove(file)">
							mdi-delete-circle
						</v-icon>
					</v-btn>
				</p>
			</vue-perfect-scrollbar>
			<v-card-text>
				<div>
					<label for="" class="text-base py-0">
						{{ $t("title.template_form_selection") }}
					</label>
					<!-- <v-btn
						icon
						x-small
						@click="filter = !filter"
						class="float-right"
					>
						<v-icon> mdi-filter-outline </v-icon>
					</v-btn> -->
				</div>
				<v-text-field
					maxLength="255"
					v-model="search"
					dense
					flat
					hide-details
					@keyup="customFilter()"
					:placeholder="$t('title.search')"
					class="rounded-0 mx-2 my-2 elevation-0 text-xs"
				>
					<template v-slot:[`prepend-inner`]>
						<v-icon size="16" class="mt-1.5"> mdi-magnify </v-icon>
					</template>
				</v-text-field>
				<v-data-table
					v-model="selected"
					:headers="headers"
					:items="desserts_filter"
					item-key="id"
					multi-sort
					show-select
					:hide-default-footer="
						desserts_filter.length < 10 ? true : false
					"
					loading="true"
					:loading-text="$t('message.no_data')"
					fixed-header
					height="200"
					class="grey lighten-5 mt-4"
				>
					<template v-slot:[`item.templateFormName`]="{ item }">
						<span
							v-if="item.templateFormName.length <= 40"
							class="text-xs"
						>
							{{ item.templateFormName }}
						</span>
						<v-tooltip
							bottom
							v-if="item.templateFormName.length > 40"
						>
							<template v-slot:activator="{ on, attrs }">
								<span v-bind="attrs" v-on="on" class="text-xs">
									{{ item.templateFormName.slice(0, 40) }}
									...
								</span>
							</template>
							<span class="text-xs">
								{{ item.templateFormName }}
							</span>
						</v-tooltip>
					</template>
					<template v-slot:[`item.createdName`]="{ item }">
						<template>
							<v-avatar color="red mr-2" size="28">
								<span class="white--text">
									{{ getAvatarText(item.createdName, 2) }}
								</span>
							</v-avatar>
							{{ item.createdName }}
						</template>
					</template>
					

					<template
						v-for="header in headers.filter((header) =>
							header.hasOwnProperty('formatter'),
						)"
						v-slot:[`item.${header.value}`]="{ headers, value }"
					>
						{{ header.formatter(value) }}
					</template>

					<template v-slot:no-data>
						<h3>{{ $t("message.no_data") }}</h3>
					</template>
				</v-data-table>
			</v-card-text>
		</vue-perfect-scrollbar>
		<!-- <v-divider></v-divider> -->
		<v-card-actions>
			<v-spacer></v-spacer>
			<v-btn
				elevation="0"
				color="blue darken-2"
				dark
				class="rounded mr-2"
				@click="Save"
			>
				{{ $t("button.ok") }}
			</v-btn>
		</v-card-actions>
	</v-card>
</template>

<script>
import moment from "moment";
import administratorAPI from "../../administrator/administrator.api";
import globalService from "@/services/global.service";

export default {
	name: "VSMFEFileRequestData",
	props: { requestDataV2: {} },
	watch: {
		requestDataV2(newValue) {
			this.m_requestData = newValue;
		},
	},

	data() {
		return {
			file_name: [],
			user_current: this.getUserInfo(),
			m_requestData: null,
			desserts_filter: [],
			showModifyDatePicker: false,
			fileName: "",
			templateFormName: "",
			createdName: "",
			modifiedDate: null,
			s_date_update: null,
			showPicker: false,
			s_createdName: "",
			s_templateForm: "",
			s_fileName: "",
			file: null,
			items: [],
			search: "",
			singleSelect: false,
			selected: [],
			fileTemplateForm: [],
			dateFormat: "DD/MM/yyyy",
			listTemplateForm: [],
			files: [],
			headers: [
				// {
				// 	text: this.$t("Tên file"),
				// 	value: "attachmentFileDTOS[0].fileName",
				// 	filter: (value) => {
				// 		if (!this.fileName) return true;
				// 		return this.nonAccentVietnamese(value)
				// 			.toLocaleUpperCase()
				// 			.includes(
				// 				this.nonAccentVietnamese(this.fileName)
				// 					.trim()
				// 					.toLocaleUpperCase()
				// 					.replace(/\s+/g, " "),
				// 			);
				// 	},
				// },
				{
					text: this.$t("label.template_form"),
					value: "templateFormName",

					filter: (value) => {
						if (!this.templateFormName) return true;
						return this.nonAccentVietnamese(value)
							.toLocaleUpperCase()
							.includes(
								this.nonAccentVietnamese(this.templateFormName)
									.trim()
									.toLocaleUpperCase()
									.replace(/\s+/g, " "),
							);
					},
				},

				{
					text: this.$t("label.modified_name_"),
					value: "createdName",

					filter: (value) => {
						if (!this.createdName) return true;

						return this.nonAccentVietnamese(value)
							.toLocaleUpperCase()
							.includes(
								this.nonAccentVietnamese(this.createdName)
									.trim()
									.toLocaleUpperCase()
									.replace(/\s+/g, " "),
							);
					},
				},

				{
					text: this.$t("label.update_time"),
					value: "modifiedDate",
					formatter: (x) =>
						x ? moment(x).format(this.dateFormat) : null,
					filter: (value) => {
						if (!this.modifiedDate) return true;
						return value.includes(this.modifiedDate);
					},
				},
			],
			filter: false,
		};
	},
	created() {
		this.m_requestData = this.requestDataV2;
	},
	mounted() {
		this.getAllTemplateForm();
	},

	methods: {
		close() {
			this.file_name = [];

			this.$emit("close", true);
		},
		async getAllTemplateForm() {
			let response;
			try {
				response = await globalService.getData_Async(
					administratorAPI.API_GetAllTemplateFormV2(),
				);
				if (!response || !response.state) {
					this.toastError(this.$t("error.load"));
				}
				this.desserts = response.data.filter((entry) => {
					return !entry.isDelete;
				});
				this.desserts_filter = this.desserts;
			} catch (error) {
				this.toastError(error);
				return;
			}
		},
		async Save() {
			if (!this.selected.length && !this.files.length) {
				return this.toastError(this.$t("label.no_selected"));
			}
			await this.saveFile();
			this.$emit("save", this.fileTemplateForm);
			this.$emit("close", true);
			await this.getAllTemplateForm();
			this.files = [];
			this.selected = [];

		},
		customFilter() {
			this.desserts_filter = this.desserts.filter((entry) => {
				return (
					this.nonAccentVietnamese(
						entry.templateFormName.toLocaleUpperCase(),
					).includes(
						this.nonAccentVietnamese(
							this.search.trim().toLocaleUpperCase(),
						),
					) ||
					this.nonAccentVietnamese(
						entry.createdName.toLocaleUpperCase(),
					).includes (
						this.nonAccentVietnamese(
							this.search.trim().toLocaleUpperCase(),
						)
					)
					//  ||
					// this.nonAccentVietnamese(
					// 	moment(entry.modifiedDate)
					// 		.format(this.dateFormat)
					// 		.toLocaleUpperCase(),
					// ).includes(
					// 	this.nonAccentVietnamese(
					// 		this.search.trim().toLocaleUpperCase(),
					// 	),
					// ) ||
					// (entry["attachmentFileDTOS"].length > 0 &&
					// 	this.nonAccentVietnamese(
					// 		entry[
					// 			"attachmentFileDTOS"
					// 		][0].fileName.toLocaleUpperCase(),
					// 	).includes(
					// 		this.nonAccentVietnamese(
					// 			this.search.trim().toLocaleUpperCase(),
					// 		),
					// 	))
				);
			});
		},
		onClick(event) {
			event.preventDefault();
			let files = document.getElementById("filesDocument");
			files.click();
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
						(this.files = [])
					);
				}
			}
			files.target.value = [];
			// this.files = Array.from(files.target.files);
		},
		remove(file) {
			let index = this.files.indexOf(file);
			this.files.splice(index, 1);
		},
		async saveFile() {
			let success = true;
			let response;
			if (!this.selected.length > 0 && this.files > 0)
				return this.$emit("close", true);
			if (this.selected.length > 0) {
				for (let item of this.selected) {
					response = await globalService.postData_Async(
						administratorAPI.API_AddPrimaryFile(
							this.user_current.id,
							this.m_requestData.id,
							item.id,
						),
					);
					if (!response) {
						success = false;
						return;
					}

					this.fileTemplateForm.push(...response.data);
				}
			}
			if (this.files && this.files.length > 0) {
				for (let item of this.files) {
					response = await globalService.upload_Async(
						administratorAPI.API_AddPrimaryFile(
							this.user_current.id,
							this.m_requestData.id,
						),
						item,
					);
					if (!response) {
						success = false;
						return;
					}

					this.fileTemplateForm.push(...response.data);
				}
			}
			if (!success) {
				return;
			} else {
				this.toastSuccess(this.$t("message.successfully_added_new"));
			}
		},
		
	},
	computed: {
		formatModifyDateFns() {
			return this.modifiedDate
				? moment(this.modifiedDate).format(this.dateFormat)
				: null;
		},
	},
};
</script>

<style lang="scss" scoped></style>
