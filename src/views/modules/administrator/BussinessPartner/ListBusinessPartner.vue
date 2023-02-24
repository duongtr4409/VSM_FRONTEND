<template>
	<v-card flat elevation="0">
		<BreadcrumbsVue />
		<v-dialog width="70vw" v-model="dialog.edit" persistent>
			<EditBusinessPartner
				@close="closeDeleteAll"
				:business="editedItem"
			></EditBusinessPartner>
		</v-dialog>
		<v-dialog width="70vw" v-model="dialog.create" persistent>
			<CreateBusinessPartner
				@close="closeDeleteAll"
			></CreateBusinessPartner>
		</v-dialog>
		<v-dialog v-model="dialog.delete" persistent width="fit-content">
			<DeleteDialogVue
				@close="closeDeleteAll"
				@confirmDelete="onConfirmDelete"
			/>
		</v-dialog>

		<v-data-table
			v-model="selected"
			show-select
			:items="listAllBussinesspartner"
			:headers="headers"
			:no-data-text="$t('message.no_results')"
			:no-results-text="$t('message.no_results')"
		>
			<template v-slot:top="{ on, attrs }">
				<v-card-title class="p-0 w-full">
					<v-btn
						elevation="0"
						class="rounded-pill text-capitalize font-weight-regular"
						v-bind="attrs"
						v-on="on"
						@click="editBussinessPartner"
						text
						append
					>
						<v-icon small class="mr-2"> mdi-plus</v-icon>
						{{ $t("button.create") }}
					</v-btn>
					<v-btn
						elevation="0"
						class="rounded-pill text-capitalize font-weight-regular"
						@click="deleteAll"
						text
					>
						<v-icon small class="mr-2">
							mdi-trash-can-outline
						</v-icon>
						{{ $t("button.delete_all") }}
					</v-btn>
					<v-spacer></v-spacer>
					<v-btn icon @click="filterExist = !filterExist">
						<v-icon>mdi-filter </v-icon>
					</v-btn>
				</v-card-title>
				<v-divider></v-divider>
			</template>
			<template v-slot:[`item.actions`]="{ item }">
				<div class="d-flex" style="min-width: fit-content">
					<v-btn color="blue darken-1" icon @click="editItem(item)">
						<v-icon small> mdi-pencil </v-icon>
					</v-btn>
					<v-btn color="red darken-1" icon @click="deleteItem(item)">
						<v-icon small> mdi-trash-can-outline </v-icon>
					</v-btn>
				</div>
			</template>
			<template v-slot:[`item.description`]="{ item }">
				<v-tooltip bottom>
					<template v-slot:activator="{ on, attrs }">
						<span v-bind="attrs" v-on="on">
							{{ item.description.slice(0, 30) }}
							<span v-if="item.description.length > 20">
								...
							</span>
						</span>
					</template>
					<span>
						{{ item.description }}
					</span>
				</v-tooltip>
			</template>
			<template v-slot:[`item.street`]="{ item }">
				<v-tooltip bottom>
					<template v-slot:activator="{ on, attrs }">
						<span v-bind="attrs" v-on="on">
							{{ item.street.slice(0, 30) }}
							<span v-if="item.street.length > 20"> ... </span>
						</span>
					</template>
					<span>
						{{ item.street }}
					</span>
				</v-tooltip>
			</template>
			<template v-slot:[`item.name`]="{ item }">
				<v-tooltip bottom>
					<template v-slot:activator="{ on, attrs }">
						<span v-bind="attrs" v-on="on">
							{{ item.name.slice(0, 30) }}
							<span v-if="item.name.length > 20"> ... </span>
						</span>
					</template>
					<span>
						{{ item.name }}
					</span>
				</v-tooltip>
			</template>
			<template
				v-for="header in headers.filter((header) =>
					header.hasOwnProperty('formatter'),
				)"
				v-slot:[`item.${header.value}`]="{ headers, value }"
			>
				{{ header.formatter(value) }}
			</template>

			<template v-if="filterExist" v-slot:[`body.prepend`]>
				<v-divider></v-divider>
				<tr>
					<td></td>
					<td class="pl-0">
						<v-text-field
							v-model="s_shortName"
							:label="$t('label.name')"
							outlined
							dense
							class="mt-2 rounded-pill"
							maxLength="255"
						></v-text-field>
					</td>
					<td class="pl-0">
						<v-text-field
							v-model="s_description"
							:label="$t('business_parner.description')"
							outlined
							dense
							class="mt-2 rounded-pill"
							maxLength="255"
						></v-text-field>
					</td>
					<td class="pl-0">
						<v-text-field
							v-model="s_address"
							:label="$t('business_parner.street')"
							outlined
							dense
							class="mt-2 rounded-pill"
							maxLength="255"
						></v-text-field>
					</td>
					<td class="pl-0">
						<v-text-field
							v-model="s_modified_name"
							:label="$t('label.modified_name')"
							outlined
							dense
							class="mt-2 rounded-pill"
							maxLength="255"
						></v-text-field>
					</td>

					<td class="pl-0">
						<v-menu
							v-model="showPickerExpiry"
							:close-on-content-click="false"
							transition="scale-transition"
							offset-y
						>
							<template v-slot:activator="{ on, attrs }">
								<v-text-field
									:value="formatModifiedDate"
									clearable
									:label="$t('label.modified_date')"
									readonly
									v-bind="attrs"
									v-on="on"
									@click:clear="s_modified_date = null"
									append-icon="mdi-calendar"
									outlined
									dense
									class="mt-2 rounded-pill"
								></v-text-field>
							</template>
							<v-date-picker
								v-model="s_modified_date"
								@change="showPickerExpiry = false"
								no-title
								scrollable
								range
							></v-date-picker>
						</v-menu>
					</td>
					<td></td>
				</tr>
			</template>
		</v-data-table>
	</v-card>
</template>

<script>
import BreadcrumbsVue from "@/components/Breadcrumbs.vue";
import moment from "moment";
import constant from "@/common/constant";
import globalService from "@/services/global.service";
import administratorAPI from "../administrator.api";
import EditBusinessPartner from "./EditBusinessPartner.vue";
import DeleteDialogVue from "@/components/DeleteDialog.vue";
import BusinessPartnerDTO from "@/models/business-partner.dto";
import CreateBusinessPartner from "./CreateBusinessPartner.vue";

export default {
	name: "BussinesspartnerVue",
	components: {
		BreadcrumbsVue,
		EditBusinessPartner,
		DeleteDialogVue,
		CreateBusinessPartner,
	},
	data() {
		return {
			selected: [],
			user_current: this.getUserInfo(),
			filterExist: false,
			showPickerExpiry: false,
			dateFormat: "DD/MM/yyyy",
			s_shortName: "",
			s_description: "",
			s_address: "",
			isDeleting: false,
			editedItem: BusinessPartnerDTO,
			dialog: { edit: false, delete: false, create: false },
			s_modified_name: "",
			s_modified_date: null,
			headers: [
				{
					width: "25vw",
					text: this.$t("label.name"),
					value: "name",
					filter: (value) => {
						if (!this.s_shortName.trim()) return true;

						return this.nonAccentVietnamese(value)
							.toLocaleUpperCase()
							.includes(
								this.nonAccentVietnamese(this.s_shortName)
									.trim()
									.toLocaleUpperCase(),
							);
					},
				},
				{
					width: "15vw",
					text: this.$t("label.description"),
					value: "description",
					filter: (value) => {
						if (!this.s_description.trim()) {
							return true;
						}

						return this.nonAccentVietnamese(value)
							.toLocaleUpperCase()
							.includes(
								this.nonAccentVietnamese(this.s_description)
									.trim()
									.toLocaleUpperCase(),
							);
					},
				},
				{
					width: "25vw",
					text: this.$t("label.address"),
					value: "street",
					filter: (value) => {
						if (!this.s_address.trim()) return true;

						return this.nonAccentVietnamese(value)
							.toLocaleUpperCase()
							.includes(
								this.nonAccentVietnamese(this.s_address)
									.trim()
									.toLocaleUpperCase(),
							);
					},
				},
				{
					text: this.$t("label.modified_name"),
					value: "modifiedName",
					filter: (value) => {
						if (!this.s_modified_name.trim()) return true;

						return this.nonAccentVietnamese(value)
							.toLocaleUpperCase()
							.includes(
								this.nonAccentVietnamese(this.s_modified_name)
									.trim()
									.toLocaleUpperCase(),
							);
					},
				},
				{
					text: this.$t("label.modified_date"),
					value: "modifiedDate",
					formatter: (x) =>
						x ? moment(x).format(this.dateFormat) : null,
					filter: (value) => {
						if (!this.s_modified_date) return true;
						let values = `${this.s_modified_date}`.split(
							constant.values.DATE_RANGE_SEPARATOR,
						);
						values = values
							.map((x) => {
								return moment(x).toDate().getTime();
							})
							.sort((a, b) => a - b);
						let target = moment(value).toDate().getTime();
						return (
							target >= values[0] &&
							target <=
								values[values.length - 1] + 24 * 60 * 60 * 1000
						);
					},
				},
				{
					text: "",
					value: "actions",
					sortable: false,
				},
			],
			listAllBussinesspartner: [],
		};
	},
	computed: {
		formatModifiedDate() {
			if (!this.s_modified_date) {
				return null;
			}
			let values = `${this.s_modified_date}`.split(
				constant.values.DATE_RANGE_SEPARATOR,
			);
			let result = [];
			result = values.map((x) => {
				return moment(x).format("DD/MM/yyyy");
			});
			return result.join("~");
		},
	},
	created() {
		this.load();
	},
	methods: {
		load() {
			this.getAllBussinessPartner();
		},
		async getAllBussinessPartner() {
			try {
				let response = await globalService.getData_Async(
					administratorAPI.API_GetAllBussinessPartner(),
				);
				if (!response || !response.state) {
					this.toastError(this.$t("error.load"));
					return;
				}
				this.listAllBussinesspartner = response.data.filter((entry) => {
					return !entry.isDelete;
				});
				this.listAllBussinesspartner = this.sortList(
					this.listAllBussinesspartner,
				);
			} catch (error) {
				console.log(error);
			}
		},
		// sortList(arr) {
		// 	if (arr.length == 0) return;
		// 	return arr.sort((a, b) => {
		// 		return a.createdDate - b.createdDate;
		// 	});
		// },
		sortList(arr) {
			return arr.sort((a, b) => {
				return (
					moment(b.createdDate).toDate().getTime() -
					moment(a.createdDate).toDate().getTime()
				);
			});
		},
		editBussinessPartner() {
			this.dialog.create = true;
		},
		deleteAll() {
			if (this.selected.length > 0) {
				this.dialog.delete = true;
			} else {
				this.toastError(this.$t("message.alert_no_selected"));
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
			// this.selected = this.selected.map((entry) => {
			// 	entry.isDelete = true;
			// 	return entry;
			// });
			this.selected.isDelete = true;
			for (let itemSelected of this.selected) {
				itemSelected.isDelete = true;
				try {
					let response = await globalService.putData_Async(
						administratorAPI.API_DeleteBusinessParner(
							itemSelected.id,
						),
						itemSelected,
					);
					if (!response.state) {
						this.toastError(response.message);
						continue;
					}
				} catch (error) {
					console.log(error);
				}
			}
			this.toastSuccess(this.$t("message.delete_success"));

			this.selected = [];
			this.isDeleting = false;
			this.load();
			this.closeDeleteAll();
		},
		closeDeleteAll() {
			this.dialog.edit = false;
			this.dialog.delete = false;
			this.dialog.create = false;
			this.load();
		},
		editItem(item) {
			this.editedItem = item;
			this.dialog.edit = true;
		},
		deleteItem(item) {
			this.selected = [item];
			this.deleteAll();
		},
	},
};
</script>

<style></style>
