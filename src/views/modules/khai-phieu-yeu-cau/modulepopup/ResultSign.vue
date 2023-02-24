<template>
	<v-card elevation="0">
		<v-toolbar flat color="grey lighten-4">
			<v-toolbar-title>
				{{ $t("label.list_of_processing_tickets") }}
			</v-toolbar-title>
			<v-spacer></v-spacer>
			<v-btn icon @click="closeDialog">
				<v-icon>mdi-close</v-icon>
			</v-btn>
		</v-toolbar>
		<v-card-text>
			{{ m_values }}
			<v-data-table
				v-if="m_values.length"
				:headers="headers"
				:items="m_values"
				hide-default-footer
				:items-per-page="-1"
				class="elevation-0"
			></v-data-table>
		</v-card-text>
		<v-card-actions class="white">
			<v-spacer></v-spacer>
			<v-btn color="grey lighten-4" elevation="0" @click="closeDialog">
				{{ $t("button.cancel") }}
			</v-btn>
		</v-card-actions>
	</v-card>
</template>

<script>
export default {
	name: "ResultSignVue",
	props: { results: [] },
	watch: {
		results(value) {
			this.m_values = value;
		},
	},
	data() {
		return {
			headers: [
				{
					text: this.$t("label.processing_slip"),
					value: "requestDataId",
					align: "start",
				},
				{
					text: this.$t("label.status"),
					value: "resultSign",
					align: "start",
				},
			],
			m_values: [],
		};
	},
	created() {
		this.m_values = this.results;
	},
	mounted() {
		this.m_values = this.results;
	},

	methods: {},
};
</script>
