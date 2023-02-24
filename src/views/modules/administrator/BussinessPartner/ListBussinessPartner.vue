<template>
	<v-card flat elevation="0">
		<BreadcrumbsVue />
		<v-data-table :items="listAllBussinesspartner" :headers="headers">
			<template v-slot:top>
				<v-card-title>
					<v-spacer></v-spacer>
					<v-btn icon @click="filterExist = !filterExist">
						<v-icon>mdi-filter </v-icon>
					</v-btn>
				</v-card-title>
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
					<td>
						<v-text-field
							v-model="s_shortName"
							:label="$t('label.name')"
							outlined
							dense
							class="mt-2 rounded-pill"
							maxLength="255"
						></v-text-field>
					</td>
					<td>
						<v-text-field
							v-model="s_description"
							:label="$t('label.description')"
							outlined
							dense
							class="mt-2 rounded-pill"
							maxLength="255"
						></v-text-field>
					</td>
					<td>
						<v-text-field
							v-model="s_address"
							:label="$t('label.description')"
							outlined
							dense
							class="mt-2 rounded-pill"
							maxLength="255"
						></v-text-field>
					</td>
					<td>
						<v-text-field
							v-model="s_modified_name"
							:label="$t('label.modified_name')"
							outlined
							dense
							class="mt-2 rounded-pill"
							maxLength="255"
						></v-text-field>
					</td>

					<td>
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
export default {
	name: "BussinesspartnerVue",
	components: {
		BreadcrumbsVue,
	},
	data() {
		return {
			user_current: this.getUserInfo(),
			filterExist: false,
			showPickerExpiry: false,
			dateFormat: "DD/MM/yyyy",
			s_shortName: "",
			s_description: "",
			s_address: "",
			s_modified_name: "",
			s_modified_date: null,
			headers: [
				{
					width: "25vw",
					text: this.$t("label.name"),
					value: "name",
					filter: (value) => {
						if (!this.s_shortName || !value) return true;

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
						if (!this.s_description || !value) return true;

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
						if (!this.s_address || !value) return true;

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
						if (!this.s_modified_name || !value) return true;

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
				this.listAllBussinesspartner = this.sortList(response.data);
			} catch (error) {
				console.log(error);
			}
		},
		sortList(arr) {
			if (arr.length == 0) return;
			return arr.sort((a, b) => {
				return a.createdDate - b.createdDate;
			});
		},
	},
};
</script>

<style></style>
