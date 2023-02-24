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
				{{ $t("button.close") }}
			</v-btn>
		</v-card-actions>
	</v-card>
</template>

<script>
export default {
	name: "ResultVue",
	props: { results: [] },
	watch: {
		results(value) {
			this.m_values = value;
			console.log("this.m_values", this.m_values);
		},
	},
	data() {
		return {
			headers: [
				{
					text: this.$t("label.mail_template_subject"),
					value: "item.title",
					align: "start",
				},
				{
					text: this.$t("label.status"),
					value: "data",
					align: "start",
				},
			],
			m_values: [],
		};
	},
	created() {
		this.m_values = this.results;
		console.log("this.m_values", this.m_values);
	},
	mounted() {
		this.m_values = this.results;
	},

	methods: {},
};
</script>
