<template>
	<v-card v-if="listUserInfos" elevation="0">
		<v-toolbar elevation="0" class="h-2 px-2 -mp-2">
			<span class="text-base"> {{$t("label.user_selection")}} </span>
			<v-spacer></v-spacer>
			<v-btn icon x-small @click="close">
				<v-icon> mdi-close </v-icon>
			</v-btn>
		</v-toolbar>
		<v-divider></v-divider>
		<vue-perfect-scrollbar class="h-[70vh]">
			<v-card-text>
				<v-text-field
					maxLength="255"
					v-model="search"
					flat
					hide-details
					dense
					class="rounded-0 mx-2 my-2 elevation-0 text-xs"
					:no-data-text="$t('message.no_results')"
					@keyup="customFilter($event)"
					:placeholder="$t('title.search')"
					><template v-slot:[`prepend-inner`]>
						<v-icon size="16" class="mt-1.5"> mdi-magnify </v-icon>
					</template>
				</v-text-field>
				<v-data-table
					v-model="selected"
					:headers="headers"
					:items="listUserInfos"
					:single-select="false"
					item-key="id"
					show-select
					:no-data-text="$t('message.no_results')"
					:no-results-text="$t('message.no_results')"
					:server-items-length="countAllItem"
					@pagination="changePage($event)"
					fixed-header
					multi-sort
					height="280"
					class="grey lighten-5 mt-4"
				>
					<template v-slot:[`item.ranks`]="{ item }">
						<div v-for="rank of item.ranks" :key="rank.id">
							<span
								v-if="
									rank.rankName && rank.rankName.length <= 25
								"
								class="text-xs"
							>
								{{ rank.rankName }}
							</span>
							<v-tooltip
								bottom
								v-if="
									rank.rankName && rank.rankName.length > 25
								"
							>
								<template v-slot:activator="{ on, attrs }">
									<span
										v-bind="attrs"
										v-on="on"
										class="text-xs"
									>
										{{ rank.rankName.slice(0, 25) }}
										...
									</span>
								</template>
								<span class="text-xs">
									{{ rank.rankName }}
								</span>
							</v-tooltip>
						</div>
					</template>
					<template v-slot:[`item.email`]="{ item }">
						<span
							v-if="item.email && item.email.length <= 25"
							class="text-xs"
						>
							{{ item.email }}
						</span>
						<v-tooltip
							bottom
							v-if="item.email && item.email.length > 25"
						>
							<template v-slot:activator="{ on, attrs }">
								<span v-bind="attrs" v-on="on" class="text-xs">
									{{ item.email.slice(0, 25) }}
									...
								</span>
							</template>
							<span class="text-xs">
								{{ item.email }}
							</span>
						</v-tooltip>
					</template>
					<template v-slot:[`item.organizations`]="{ item }">
						<span
							v-for="organization of item.organizations"
							:key="organization.id"
							v-bind="item"
						>
							<v-avatar color="red mr-2" size="24">
								<span class="white--text">
									{{
										getAvatarText(
											organization.organizationName,
											2,
										)
									}}
								</span>
							</v-avatar>
							{{ organization.organizationName }}
						</span>
					</template>
					<template
						v-for="header in headers.filter((header) =>
							header.hasOwnProperty('formatter'),
						)"
						v-slot:[`item.${header.value}`]="{ headers, value }"
					>
						{{ header.formatter(value) }}
					</template>

					<template v-slot:no-data>
						<h3>{{ $t("message.no_data") }}</h3>
					</template>
				</v-data-table>
			</v-card-text>
		</vue-perfect-scrollbar>
		<v-card-actions>
			<v-spacer></v-spacer>
			<v-btn
				elevation="0"
				color="blue darken-2"
				dark
				class="rounded-0"
				@click="Save"
			>
				{{ $t("button.ok") }}</v-btn
			>

			<v-btn
				elevation="0"
				color="grey lighten-4"
				class="rounded-0"
				@click="closeDialog"
			>
				{{ $t("button.cancel") }}</v-btn
			>
		</v-card-actions>
	</v-card>
</template>

<script>
import globalService from "@/services/global.service";
import moment from "moment";
import administratorAPI from "../../administrator/administrator.api";
import constant from "@/common/constant";
export default {
	name: "VSMFEUserInfosRequestDataV2",

	data() {
		return {
			dialogSelectBophan: false,
			listUserInfos: [],
			listUserInfosDefault: [],
			headers: [
				{
					text: this.$t("label.first_and_lastname"),
					value: "fullName",
					sortable: false,
					filter: (value) => {
						if (!this.search) return true;
						if (!value) return;
						return this.nonAccentVietnamese(value)
							.toLocaleUpperCase()
							.includes(
								this.nonAccentVietnamese(
									this.search,
								).toLocaleUpperCase(),
							);
					},
				},
				{
					text: this.$t("label.roleName"),
					value: "ranks",

					// filter: (value) => {
					// 	if (!this.ranks) return true;
					// 	if (!value) return;
					// 	return this.nonAccentVietnamese(value)
					// 		.toLocaleUpperCase()
					// 		.includes(
					// 			this.nonAccentVietnamese(
					// 				this.ranks,
					// 			).toLocaleUpperCase(),
					// 		);
					// },
				},
				{
					text: this.$t("label.email"),
					value: "email",
					// filter: (value) => {
					// 	if (!this.search) return true;
					// 	if (!value) return;
					// 	return this.nonAccentVietnamese(value)
					// 		.toLocaleUpperCase()
					// 		.includes(
					// 			this.nonAccentVietnamese(
					// 				this.search,
					// 			).toLocaleUpperCase(),
					// 		);
					// },
				},
				{
					text: this.$t("label.part"),
					value: "organizations",

					// filter: (value) => {
					// 	if (
					// 		this.s_organizations == this.$t("label.show_all") ||
					// 		this.s_organizations == null
					// 	)
					// 		return true;
					// 	return value.filter((entry) => {
					// 		return entry.organizationName.includes(
					// 			this.s_organizations,
					// 		);
					// 	});
					// },
				},
			],
			items: [],
			search: "",
			singleSelect: true,
			selected: [],
			selected_tree: [],
			fullName: "",
			rankName: "",
			listOrganization: [],
			countAllItem: 0,
			filterExist: false,
			s_organizations: this.$t("label.show_all"),
			listBophan: [],
			objFilter: {
				fullName: "",
			},
		};
	},

	async mounted() {
	},

	methods: {
		close() {
			this.$emit("close", true);
		},
		async getAllOrganzation() {
			try {
				let response = await globalService.getData_Async(
					administratorAPI.API_FindAllOrganization(),
				);
				if (!response || !response.state) return;
				this.listOrganization = response.data.filter((entry) => {
					return !entry.isDelete;
				});
				this.listBophan = this.listOrganization;
				for (let i = 0; i < this.listBophan.length; i++) {
					this.listBophan[i]["children"] = [];
					this.findUserInListBophan(this.listBophan[i]);
				}
			} catch (error) {
				this.toastError(error);
			}
		},

		customFilter(event) {
			if (
				event.code == constant.keys.enter ||
				event.keyCode == constant.keys.enter_keyCode
			) {
				this.searchUserByFilter();
			}
		},
		async Save() {
			if (this.selected.length == 0) {
				return this.toastError(this.$t("message.alert_no_selected"));
			}
			await this.$emit("save", this.selected);
			await this.$emit("close", true);
			this.selected = [];
		},
		async findUserInListBophan(item) {
			for (let i = 0; i < this.listUserInfos.length; i++) {
				for (
					let j = 0;
					j < this.listUserInfos[i].organizations.length;
					j++
				) {
					if (
						this.listUserInfos[i].organizations[j]
							.organizationName == item.organizationName
					) {
						item["children"].push({
							organizationName: this.listUserInfos[i].fullName,
							id: this.listUserInfos[i],
						});
					}
				}
			}
		},
		selectBophan(item) {
			this.organizations = item.organizationName;
			this.dialogSelectBophan = false;
		},
		openDialog() {
			this.dialogSelectBophan = true;
		},
		sortList(arr) {
			return arr.sort((a, b) => {
				return (
					moment(b.createdDate).toDate().getTime() -
					moment(a.createdDate).toDate().getTime()
				);
			});
		},
		changePage(event) {
			this.searchUserByFilter(event.page - 1, event.itemsPerPage);
			// console.log("event", event);
			return;
		},
		async searchUserByFilter(
			page = constant.page,
			page_size = constant.page_size,
		) {
			this.objFilter = {
				fullName: this.search,
			};
			let response = await globalService.postData_Async(
				administratorAPI.GetUserByFilter(page, page_size),
				this.objFilter,
			);
			if (!response || !response.state) {
				return;
			}
			this.countAllItem = response.data.total;
			this.listUserInfos = response.data?.listData.filter((entry) => {
				entry.showAll = false;
				return entry;
			});
			this.listUserInfos = this.sortList(this.listUserInfos);
		},
	},
};
</script>

<style lang="scss" scoped>
.test {
	display: flex;
	justify-content: space-between;
}

.w-40 {
	width: 200px !important;
}
</style>
