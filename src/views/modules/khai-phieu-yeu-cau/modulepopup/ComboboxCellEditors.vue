<template>
	<v-card>
		<v-combobox
			v-model="value_material"
			:items="materials"
			item-text="name"
			outlined
			prepend-inner-icon="mdi-magnify"
			dense
			maxLength="255"
			@update:search-input="getData($event)"
		>
			<template v-slot:label>
				{{ $t("label.choose_") }}
				<!-- <span class="text-red-500">
					{{ $t("label.star") }}
				</span> -->
			</template>
		</v-combobox>
	</v-card>
</template>

<script>
import globalService from "@/services/global.service";
import administratorAPI from "../../administrator/administrator.api";

export default {
	name: "ComboboxCellEditorsVue",
	watch: {
		value_material: function (value) {
			if (value) {
				this.value = value.name ?? value ?? "";
				this.params.stopEditing();
			}
		},
	},
	data() {
		return {
			value: null,
			value_material: null,
			materials: [],
			searchQueue: [],
		};
	},
	mounted() {},
	created() {
		this.value_material = "";
	},

	methods: {
		getValue() {
			if (this.value) {
				return this.value;
			}
		},
		getData(search = "") {
			this.value = search;
			this.searchQueue = [];
			this.searchQueue.push(
				globalService
					.getData_NoAsync(
						administratorAPI.API_GetAllChildByParentIdAndKeyWord(
							this.params["category"],
							search ?? "",
						),
					)
					.then((response) => {
						if (response.status != 200) {
							return;
						}
						this.materials = response.data.data;
					}),
			);
		},
	},
};
</script>
