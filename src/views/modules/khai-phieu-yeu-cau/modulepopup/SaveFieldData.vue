<template>
	<v-card elevation="0" class="rounded-lg">
		<!-- <v-toolbar elevation="0" class="grey lighten-4">
			<v-spacer></v-spacer>
			<v-btn icon @click="closeDialog">
				<v-icon>mdi-close</v-icon>
			</v-btn>
		</v-toolbar> -->
		<v-toolbar elevation="0">
			<v-spacer></v-spacer>
			<v-btn icon @click="closeDialog">
				<v-icon>mdi-close</v-icon>
			</v-btn>
		</v-toolbar>

		<v-card-text>
			<v-radio-group
				v-model="radios"
				mandatory
				class="text-center text-xl font-bold"
			>
				<v-radio
					:label="$t('label.file_template_form')"
					value="Ký số"
					@click="radios1"
				></v-radio>
				<v-radio
					:label="$t('label.file_main_document')"
					value="Ký tươi"
					@click="radios2"
				></v-radio>
			</v-radio-group>
		</v-card-text>

		<v-card-actions>
			<v-spacer></v-spacer>
			<v-btn
				elevation="0"
				color="blue darken-2"
				dark
				class="rounded-0"
				@click="confirmDeleteDialog()"
			>
				{{ $t("button.ok") }}
			</v-btn>
			<v-btn
				elevation="0"
				color="grey lighten-4"
				class="rounded-0"
				@click="closeDialog()"
			>
				{{ $t("button.cancel") }}
			</v-btn>
		</v-card-actions>
	</v-card>
</template>

<script>
export default {
	name: "SaveFieldDataVue",

	data() {
		return {
			radio: 0,
			radios: null,
		};
	},

	mounted() {},

	methods: {
		confirmDeleteDialog() {
			this.$emit("save", this.radio);
			this.$emit("close");
		},
		radios1() {
			this.radio = 0;
		},
		radios2() {
			this.radio = 1;
		},
	},
};
</script>

<style lang="scss" scoped></style>
