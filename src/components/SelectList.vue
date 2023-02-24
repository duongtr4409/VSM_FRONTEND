<template>
	<v-card elevation="0">
		<v-skeleton-loader
			v-if="!items"
			v-bind="attrs"
			type="list-item-three-line"
		></v-skeleton-loader>
		<v-row v-else>
			<v-col cols="5">
				<v-text-field
					filled
					single-line
					append-icon="mdi-magnify"
					v-model="search"
					maxLength="255"
				>
				</v-text-field>
				<VuePerfectScrollbar
					class="h-80 grey lighten-4"
					v-on:scroll="onItemScroll"
				>
					<v-list two-line class="pa-0">
						<v-list-item-group v-model="tempSelect" multiple>
							<v-list-item
								v-for="item in filteredItems"
								:key="item[keyName]"
								color="green"
								class="grey lighten-4"
								:disabled="disable"
							>
								<template v-slot:default="{ active }">
									<v-list-item-content>
										<v-list-item-title>
											{{ item[valueName] }}
										</v-list-item-title>
									</v-list-item-content>
									<v-list-item-action>
										<v-icon
											v-if="!active"
											color="grey lighten-1"
										>
											<!-- mdi-check-circle-outline -->
											mdi-circle-outline
										</v-icon>

										<v-icon v-else color="green darken-3">
											mdi-check-circle
										</v-icon>
									</v-list-item-action>
								</template>
							</v-list-item>
						</v-list-item-group>
					</v-list>
				</VuePerfectScrollbar>
			</v-col>
			<v-col cols="2" class="text-center align-center my-auto">
				<p>
					<v-btn icon @click="addAll" :disabled="disable">
						<v-icon>mdi-chevron-double-right </v-icon>
					</v-btn>
				</p>
				<p>
					<v-btn icon @click="add" :disabled="disable">
						<v-icon>mdi-chevron-right </v-icon>
					</v-btn>
				</p>
				<p>
					<v-btn icon @click="remove" :disabled="disable">
						<v-icon>mdi-chevron-left </v-icon>
					</v-btn>
				</p>
				<p>
					<v-btn icon @click="removeAll" :disabled="disable">
						<v-icon>mdi-chevron-double-left </v-icon>
					</v-btn>
				</p>
			</v-col>
			<v-col cols="5">
				<v-text-field
					maxLength="255"
					filled
					single-line
					append-icon="mdi-magnify"
					v-model="searchSelected"
				>
				</v-text-field>
				<VuePerfectScrollbar class="h-80 grey lighten-4">
					<v-list two-line class="pa-0">
						<v-list-item-group v-model="tempRemove" multiple>
							<v-list-item
								v-for="item in filteredSelected"
								:key="item[keyName]"
								color="red"
								class="grey lighten-4"
								:disabled="disable"
							>
								<template v-slot:default="{ active }">
									<v-list-item-content>
										<v-list-item-title>
											{{ item[valueName] }}
										</v-list-item-title>
									</v-list-item-content>
									<v-list-item-action>
										<v-icon
											v-if="!active"
											color="grey lighten-1"
										>
											<!-- mdi-close-circle-outline -->
											mdi-circle-outline
										</v-icon>

										<v-icon v-else color="red darken-3">
											mdi-close-circle
										</v-icon>
									</v-list-item-action>
								</template>
							</v-list-item>
						</v-list-item-group>
					</v-list>
				</VuePerfectScrollbar>
			</v-col>
		</v-row>
	</v-card>
</template>

<script>
import constant from "@/common/constant";
import VuePerfectScrollbar from "vue-perfect-scrollbar";
export default {
	name: "SelectListVue",
	components: { VuePerfectScrollbar },
	props: ["items", "selected", "keyName", "valueName", "doAction", "disable"],
	data() {
		return {
			filteredItems: this.items,
			m_selected: [],
			filteredSelected: this.m_selected,
			tempSelect: [],
			tempRemove: [],
			search: "",
			searchSelected: "",
			m_items: [],
			searchError: "",
			searchSelectedError: "",
		};
	},
	watch: {
		search(value) {
			if (!value) {
				this.filteredItems = this.m_items;
				return;
			}
			value = `${value}`.trim();
			this.filteredItems = this.m_items.filter((entry) => {
				return this.matchString(`${entry[this.valueName]}`, `${value}`);
			});
			this.searchError = "";
			if (!this.filteredItems || this.filteredItems.length <= 0) {
				this.searchError = this.$t("message.msg_9");
			}
		},
		searchSelected(value) {
			if (!value) {
				this.filteredSelected = this.m_selected;
				return;
			}
			value = `${value}`.trim();
			this.filteredSelected = this.m_selected.filter((entry) => {
				return this.matchString(`${entry[this.valueName]}`, `${value}`);
			});
			this.searchSelectedError = "";
			if (!this.filteredSelected || this.filteredSelected.length <= 0) {
				this.searchSelectedError = this.$t("message.msg_9");
			}
		},
		m_selected(value) {
			this.searchSelected = "";
			this.filteredSelected = value;
		},
		items(value) {
			this.resetItem(value);
		},
		m_items(value) {
			this.search = "";
			this.filteredItems = value;
		},
		selected(value) {
			this.m_selected = [];
			if (!value) {
				return;
			}
			for (let item of value) {
				this.m_selected.push(Object.assign({}, item));
			}
		},
		doAction(value) {
			if (!value) {
				return;
			}
			this.resetFilter();
		},
	},

	created() {},
	mounted() {
		if (this.selected) {
			for (let item of this.selected) {
				this.m_selected.push(Object.assign({}, item));
			}
		}
		if (this.items) {
			for (let item of this.items) {
				// if (
				// 	this.selected.find(
				// 		(e) => e[this.keyName] == item[this.keyName],
				// 	)
				// ) {
				// 	continue;
				// }
				this.m_items.push(Object.assign({}, item));
			}
		}
	},
	destroyed() {
		this.m_items = [];
		this.m_selected = [];
		this.resetFilter();
	},
	methods: {
		resetFilter() {
			this.search = "";
			this.searchSelected = "";
			this.tempSelect = [];
			this.tempRemove = [];
		},
		resetItem(value) {
			this.m_items = [];
			if (!value) {
				return;
			}
			for (let item of value) {
				this.m_items.push(Object.assign({}, item));
			}
		},
		add() {
			if (!this.m_selected) {
				this.m_selected = [];
			}
			let remove = [];
			for (let item of this.tempSelect) {
				let result = this.m_selected.findIndex(
					(v) =>
						v[this.keyName] ==
						this.filteredItems[item][this.keyName],
				);
				let tmp = Object.assign({}, this.filteredItems[item]);
				remove.push(tmp);
				if (result < 0) {
					this.m_selected.push(tmp);
				}
			}
			// this.m_items = this.m_items.filter(
			// 	(e) => !remove.find((v) => v[this.keyName] == e[this.keyName]),
			// );
			this.resetFilter();
			this.$emit(constant.keys.update, this.m_selected);
		},
		remove() {
			let remove = [];
			for (let item of this.tempRemove) {
				let tmp = Object.assign({}, this.filteredSelected[item]);
				this.m_items.push(
					Object.assign({}, this.filteredSelected[item]),
				);
				remove.push(tmp);
			}
			this.m_selected = this.m_selected.filter(
				(e) => !remove.find((v) => v[this.keyName] == e[this.keyName]),
			);
			this.resetFilter();
			this.$emit(constant.keys.update, this.m_selected);
		},
		addAll() {
			for (let item of this.filteredItems) {
				let result = this.m_selected.findIndex(
					(v) => v[this.keyName] == item[this.keyName],
				);
				if (result < 0) {
					this.m_selected.push(Object.assign({}, item));
				}
			}
			// this.m_items = this.m_items.filter(
			// 	(v) =>
			// 		!this.filteredItems.find(
			// 			(e) => e[this.keyName] == v[this.keyName],
			// 		),
			// );
			this.resetFilter();
			this.$emit(constant.keys.update, this.m_selected);
		},
		removeAll() {
			for (let item of this.filteredSelected) {
				let result = this.m_items.findIndex(
					(v) => v[this.keyName] == item[this.keyName],
				);
				if (result < 0) {
					this.m_items.push(Object.assign({}, item));
				}
			}
			this.m_selected = this.m_selected.filter(
				(ele) =>
					!this.filteredSelected.some(
						(ele1) => ele[this.keyName] == ele1[this.keyName],
					),
			);
			this.resetFilter();
			this.$emit(constant.keys.update, this.m_selected);
		},
		onItemScroll(event) {
			if (
				Math.abs(event.target.scrollHeight - event.target.scrollTop) <=
				constant.values.SCROLL_END_RANGE
			) {
				this.$emit(constant.keys.scrollReachEnd, true);
			}
		},
	},
};
</script>
