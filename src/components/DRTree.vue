<template>
	<ul>
		<li>
			<v-list-item v-if="!isFolder" @click="select" class="cursor-pointer">
				<v-list-item-icon>
					<v-icon color="yellow darken-2">{{ m_files_icon[""] }}</v-icon>
				</v-list-item-icon>
				<v-list-item-title v-if="item && item.name">
					{{ item.name }}
					<span v-if="item.displayName"> - {{ item.displayName }} </span>
				</v-list-item-title>
				<v-list-item-title v-if="item && item.fields">
					{{ item.fields.Title }}
				</v-list-item-title>
				<v-btn
					color="blue darken-2"
					dark
					elevation="0"
					x-small
					@click="chooseItem(item)"
					>{{ $t("button.select") }}</v-btn
				>
			</v-list-item>
			<v-divider v-if="!isFolder"></v-divider>
			<v-list-group v-if="isFolder" @click="toggle" append-icon="">
				<template v-slot:activator>
					<v-list-item-icon>
						<v-icon v-if="isOpen"> mdi-minus-circle </v-icon>
						<v-icon v-else color="yellow darken-2">
							{{ m_files_icon[""] }}
						</v-icon>
					</v-list-item-icon>
					<v-list-item-title v-if="item && item.name">
						{{ !item.name ? $t("label.list_site") : item.name }}
						<span v-if="item.displayName">
							- {{ item.displayName }}
						</span>
					</v-list-item-title>
					<v-list-item-title v-if="item && item.fields">
						{{ item.fields.Title }}
					</v-list-item-title>
					<v-btn
						color="blue darken-2"
						dark
						elevation="0"
						x-small
						@click="chooseItem(item)"
						>{{ $t("button.select") }}</v-btn
					>
				</template>
				<ul class="ml-4">
					<dr-tree
						v-for="(child, index) in item.children"
						:key="index"
						:item="child"
						@toggle="$emit('toggle', $event)"
						@select="$emit('select', $event)"
						@choose="$emit('choose', $event)"
					></dr-tree>
				</ul>
			</v-list-group>
		</li>
	</ul>
</template>

<script>
import constant from "@/common/constant";
export default {
	name: "DRTreeVue",
	props: ["item"],
	data: function () {
		return {
			isOpen: false,
		};
	},
	computed: {
		isFolder: function () {
			return this.item && this.item.children && this.item.children.length;
		},
	},
	watch: {
		item() {
			this.isOpen = false;
		},
	},
	mounted() {
		this.m_item = this.item;
	},
	methods: {
		async toggle() {
			this.isOpen = !this.isOpen;
			this.$emit(constant.keys.toggle, this.item);
		},
		async select() {
			this.isOpen = true;
			this.$emit(constant.keys.select, this.item);
		},
		async chooseItem(item) {
			this.$emit(constant.keys.choose, item);
		},
	},
};
</script>

<style>
li {
	list-style: none;
}
</style>
