<template>
	<div>
		<v-btn v-if="value" icon @click="downloadFile(value)">
			<v-icon>mdi-file</v-icon>
		</v-btn>
		{{ value }}
	</div>
</template>

<script>
export default {
	name: "FileRenderer",
	data() {
		return {
			value: null,
		};
	},
	mounted() {
		this.value = this.params?.value;
	},
	methods: {
		downloadFile(item) {
			if (!item) {
				return;
			}
			window.open(item, "_blank");
		},
	},
};
</script>

<style></style>
