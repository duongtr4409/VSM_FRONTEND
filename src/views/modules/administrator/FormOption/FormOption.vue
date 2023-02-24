<template>
	<v-card v-if="desserts" class="overflow-hidden py-4">
		<v-icon class="float-right mr-5 cursor-pointer" @click="close"
			>mdi-close</v-icon
		>
		<v-card-title> {{ $t("title.template_form_selection") }} </v-card-title>
		<v-data-table
			v-model="selected"
			:headers="headers"
			:items="desserts_filter"
			item-key="id"
			multi-sort
			show-select
			class="grey lighten-5"
			:hide-default-footer="desserts_filter.length < 10 ? true : false"
			loading="true"
			:loading-text="$t('error.no_data')"
			fixed-header
			height="270"
		>
			<template v-slot:[`item.templateFormName`]="{ item }">
				<span v-if="item.templateFormName.length <= 20">
					{{ item.templateFormName }}
				</span>
				<v-tooltip bottom v-if="item.templateFormName.length > 20">
					<template v-slot:activator="{ on, attrs }">
						<span v-bind="attrs" v-on="on">
							{{ item.templateFormName.slice(0, 20) }}
							...
						</span>
					</template>
					<span>{{ item.templateFormName }}</span>
				</v-tooltip>
			</template>
			<template v-slot:[`item.createdName`]="{ item }">
				<v-avatar color="red mr-2" size="28">
					<span class="white--text">
						{{ getAvatarText(item.createdName, 2) }}
					</span>
				</v-avatar>
				<span>
					{{ item.createdName }}
				</span>
			</template>
			<template v-slot:top>
				<v-row>
					<v-col cols="8"></v-col>

					<v-col cols="4" class="flex items-center">
						<v-text-field
							v-model="search"
							append-icon="mdi-magnify"
							:label="$t('title.search')"
							outlined
							dense
							rounded
							class="mt-2 mx-4"
							maxLength="255"
							@keyup="customFilter()"
						></v-text-field>
						<!-- <v-spacer></v-spacer> -->
						<v-btn
							icon
							@click="filterExist = !filterExist"
							class="mb-4 mr-2"
						>
							<v-icon>mdi-filter </v-icon>
						</v-btn>
					</v-col>
				</v-row>
				<!-- <v-spacer></v-spacer> -->
			</template>

			<template v-slot:[`body.prepend`]>
				<v-divider></v-divider>
				<tr v-if="filterExist">
					<td></td>
					<!-- <td>
						<v-text-field
							v-model="fileName"
							type="string"
							outlined
							dense
							class="mt-2"
							:label="$t('label.file_name')"
							maxLength="255"
							rounded
						></v-text-field>
					</td> -->
					<td class="pl-0">
						<v-text-field
							v-model="templateFormName"
							type="string"
							outlined
							dense
							class="mt-2"
							:label="$t('label.template_form')"
							maxLength="255"
							rounded
						></v-text-field>
					</td>
					<td class="pl-0">
						<v-text-field
							v-model="createdName"
							type="string"
							outlined
							dense
							class="mt-2"
							:label="$t('label.modified_name_')"
							maxLength="255"
							rounded
						></v-text-field>
					</td>
					<td class="pl-0">
						<v-menu
							v-model="showModifyDatePicker"
							:close-on-content-click="false"
							max-width="290"
						>
							<template v-slot:activator="{ on, attrs }">
								<v-text-field
									:value="formatModifyDateFns"
									clearable
									:label="$t('label.update_time')"
									class="mt-2"
									readonly
									v-bind="attrs"
									v-on="on"
									@click:clear="modifiedDate = null"
									outlined
									dense
									rounded
								></v-text-field>
							</template>
							<v-date-picker
								v-model="modifiedDate"
								@change="showModifyDatePicker = false"
								no-title
								scrollable
							></v-date-picker>
						</v-menu>
					</td>
				</tr>
			</template>
			<template
				v-for="header in headers.filter((header) =>
					header.hasOwnProperty('formatter'),
				)"
				v-slot:[`item.${header.value}`]="{ headers, value }"
			>
				{{ header.formatter(value) }}
			</template>
			<template v-slot:no-data
				><h1>{{ $t("message.no_data") }}</h1></template
			>
			<template v-slot:no-results
				><h1>{{ $t("message.no_results") }}</h1>
			</template>
		</v-data-table>
		<v-divider></v-divider>
		<v-row class="mt-4">
			<v-col cols="12" md="12" class="px-10">
				<div class="float-right">
					<v-btn
						color="blue"
						dark
						elevation="0"
						class="mx-5 my-0"
						@click="Save"
					>
						{{ $t("button.ok") }}</v-btn
					>

					<v-btn @click="close" elevation="0">
						{{ $t("button.cancel") }}</v-btn
					>
				</div>
			</v-col>
		</v-row>
	</v-card>
</template>

<script>
import moment from "moment";
import administratorAPI from "../../administrator/administrator.api";
import globalService from "@/services/global.service";
import RequestDto from "@/models/request.dto";

export default {
	name: "FormOption",
	props: { requestDto: {} },
	data() {
		return {
			fileName: "",
			templateFormName: "",
			createdName: "",
			modifiedDate: null,
			showModifyDatePicker: false,
			m_requestDto: RequestDto,
			items: [],
			search: "",
			singleSelect: false,
			selected: [],
			dateFormat: "DD/MM/yyyy",
			desserts: [],
			desserts_filter: [],
			headers: [
				// {
				// 	text: this.$t("button.upload"),
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
		};
	},
	watch: {
		requestDto(value) {
			this.m_requestDto = value;
		},
	},

	computed: {
		formatModifyDateFns() {
			return this.modifiedDate
				? moment(this.modifiedDate).format(this.dateFormat)
				: null;
		},
	},
	created() {
		this.m_requestDto = this.requestDto;
		this.selected = this.m_requestDto.templateForms;
	},

	mounted() {
		this.getAllTemplateForm();
	},

	methods: {
		close() {
			this.$emit("close", true);
		},
		async getAllTemplateForm() {
			let response;
			try {
				response = await globalService.getData_Async(
					administratorAPI.API_GetAllTemplateFormIgoneField(),
				);

				if (!response || !response.state) {
					this.toastError(this.$t("error.load"));
				}

				this.requestAll = response.data.filter((entry) => {
					return !entry.isDelete;
				});
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
			await this.$emit("save", this.selected);
			await this.$emit("close", true);
		},
		customFilter() {
			this.desserts_filter = this.desserts.filter((entry) => {
				return (
					this.nonAccentVietnamese(
						entry.templateFormName.toLocaleUpperCase(),
					).includes(
						this.nonAccentVietnamese(
							this.search.toLocaleUpperCase(),
						),
					) ||
					this.nonAccentVietnamese(
						entry.modifiedName.toLocaleUpperCase(),
					).includes(
						this.nonAccentVietnamese(
							this.search.toLocaleUpperCase(),
						),
					) ||
					this.nonAccentVietnamese(
						moment(entry.modifiedDate)
							.format(this.dateFormat)
							.toLocaleUpperCase(),
					).includes(
						this.nonAccentVietnamese(
							this.search.toLocaleUpperCase(),
						),
					) ||
					(entry["attachmentFileDTOS"].length > 0 &&
						this.nonAccentVietnamese(
							entry[
								"attachmentFileDTOS"
							][0].fileName.toLocaleUpperCase(),
						).includes(
							this.nonAccentVietnamese(
								this.search.toLocaleUpperCase(),
							),
						))
				);
			});
		},
	},
};
</script>

<style lang="scss" scoped></style>
