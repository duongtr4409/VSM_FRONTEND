<template>
	<v-card elevation="0" class="rounded-0">
		<v-card-title class="padding-10">
			<v-breadcrumbs
				:items="_breadcrumbs"
				class="pl-0 no-padding-top-bottom"
			>
				<template v-slot:divider>
					<v-icon>mdi-chevron-right</v-icon>
				</template>
				<template v-slot:item="{ item }">
					<v-breadcrumbs-item>
						<span class="text--grey">
							{{ item.text }}
						</span>
					</v-breadcrumbs-item>
				</template>
			</v-breadcrumbs>
			<v-spacer></v-spacer>
			<!-- <v-text-field
				dense
				outlined
				append-icon="mdi-magnify"
				class="rounded-pill"
				style="max-width: 442px"
				hide-details
			></v-text-field> -->
		</v-card-title>
	</v-card>
</template>

<script>
import constant from "@/common/constant";
export default {
	name: "BreadcrumbsVue",
	watch: {
		search(value) {
			this.$emit(constant.keys.search, value);
		},
	},
	data() {
		return {
			search: "",
		};
	},
	computed: {
		_breadcrumbs: {
			get() {
				return this.getBreadscrumb();
			},
		},
	},
	methods: {
		handleClick(item) {
			if (item?.disable) {
				return;
			}
			this.$router.push({
				path: item?.to,
			});
		},
	},
};
</script>

<style></style>
