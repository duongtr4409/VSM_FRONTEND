<template>
	<v-card elevation="0">
		<v-row class="mt-4 px-4">
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
			<v-col cols="12" md="12">
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
									:items="list_field_sharp"
									item-text="id"
									:item-value="(item) => item.id"
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
											:items="list_field_sharp"
											item-text="id"
											:item-value="(item) => item.id"
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
		</v-row>
	</v-card>
</template>

<script>
import store from "@/store";
import TemplateFormDto from "@/models/template-form.dto";
import globalService from "@/services/global.service";
// import administratorAPI from "../administrator.api";
import RequestDto from "@/models/request.dto";

export default {
	name: "CauHinhSharp",
	props: {
		Form: {},
		requestDto: {},
	},
	computed: {},
	watch: {
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
				// {
				// 	icon: "mdi-trash-can-outline",
				// 	title: this.$t("button.delete"),
				// 	color: "black",
				// 	transparent: true,
				// 	dark: false,
				// 	event: this.delete,
				// },
				// {
				// 	icon: "mdi-arrow-left-top",
				// 	title: this.$t("button.back"),
				// 	color: "black",
				// 	transparent: true,
				// 	dark: false,
				// 	event: this.back,
				// },
			],
			m_template: Object.assign({}, TemplateFormDto),
			headers: [
				{
					text: this.$t("label.data_field_form"),
					align: "start",
					value: "name",
				},
				{
					text: this.$t("label.data_field_sharp"),
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
			items: [],
			list_field_form: [],
			list_field_sharp: [
				{
					id: "comp_code_ext",
					name: "comp_code_ext",
				},
				{
					id: "contract_type",
					name: "contract_type",
				},
				{
					id: "tenancy_law",
					name: "tenancy_law",
				},
				{
					id: "pos_code",
					name: "pos_code",
				},
				{
					id: "contract_name",
					name: "contract_name",
				},
				{
					id: "bct_code",
					name: "bct_code",
				},
				{
					id: "bp_role",
					name: "bp_role",
				},
				{
					id: "customer_code",
					name: "customer_code",
				},
				{
					id: "sign_date",
					name: "sign_date",
				},
				{
					id: "measure_type",
					name: "measure_type",
				},
				{
					id: "square",
					name: "square",
				},
				{
					id: "purpose",
					name: "purpose",
				},
				{
					id: "valid_from",
					name: "valid_from",
				},
				{
					id: "valid_to",
					name: "valid_to",
				},
				{
					id: "cash_flow_from",
					name: "cash_flow_from",
				},
				{
					id: "end_of_term",
					name: "end_of_term",
				},
				{
					id: "construction",
					name: "construction",
				},
				{
					id: "construction_price",
					name: "construction_price",
				},
				{
					id: "service",
					name: "service",
				},
				{
					id: "service_pricing",
					name: "service_pricing",
				},
				{
					id: "condition_type",
					name: "condition_type",
				},
				{
					id: "condition_amount",
					name: "condition_amount",
				},
				{
					id: "price_per_month",
					name: "price_per_month",
				},
			],
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
	},
	async mounted() {
		await this.initialize();
		// store.state.loading = false;
	},
	methods: {
		async initialize() {
			await this.getFormForm();
		},
		async save() {
			this.m_requestDto.sapMapping = JSON.stringify(this.items);

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
		appendItem() {
			this.creating = true;
			this.editing = null;
			this.mapping = { name: "", position: "" };
		},
		add() {
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
			this.items.push(this.mapping);
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
			this.creating = false;
			this.editing = null;
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
		},
		async getFormForm() {
			if (!this.m_requestDto.form || !this.m_requestDto.form.id) return;
			let response_All_Fields = await globalService.getData_Async(
				`/api/forms/${this.m_requestDto.form.id}`,
			);
			if (this.m_requestDto.sapMapping) {
				this.items = JSON.parse(this.m_requestDto.sapMapping);
			}
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
