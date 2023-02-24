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
					:single-select="true"
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

		<!-- <div class="flex justify-between m-[-0.5rem]">
				<v-card-title> Lựa chọn người dùng </v-card-title>
				<span class="flex">
					<v-text-field
						maxLength="255"
						v-model="search"
						outlined
						hide-details
						dense
						class="mt-3 rounded-pill"
						:no-data-text="$t('message.no_results')"
						@keyup="customFilter($event)"
					>
					</v-text-field>
					<v-btn icon class="mt-3" @click="searchUserByFilter">
						<v-icon> mdi-magnify </v-icon>
					</v-btn>
					<v-btn
						class="mt-3"
						icon
						@click="filterExist = !filterExist"
					>
						<v-icon>mdi-filter-outline </v-icon>
					</v-btn>
				</span>
			</div>
			<v-row v-if="filterExist" class="bg-gray-100 my-1 justify-end">
				<v-col cols="3" class="m-[-0.5rem]">
					<v-select
						clearable
						v-model="s_organizations"
						:items="listOrganization"
						item-text="organizationName"
						:item-value="(item) => item.organizationName"
						label="Bộ phận"
						dense
						hide-details
						outlined
						class="rounded-pill w-[15rem]"
						:menu-props="{
							left: true,
							offsetY: true,
						}"
						auto
					></v-select>
				</v-col>
			</v-row> -->

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
		// await this.GetAllUser();
		await this.getAllUserInfo(constant.page, constant.page_size);
		// await this.getAllOrganzation();
	},

	methods: {
		close() {
			this.$emit("close", true);
		},
		async GetAllUser() {
			let response;
			try {
				response = await globalService.getData_Async(
					administratorAPI.API_GetAllUserInfos(),
				);
				if (!response || !response.state) {
					return [];
				}
				this.listUserInfosDefault = response.data.filter((entry) => {
					return !entry.isDelete && entry.isActive;
				});
				this.listUserInfos = response.data.filter((entry) => {
					return !entry.isDelete && entry.isActive;
				});
			} catch (error) {
				this.toastError(error);
				return;
			}
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
					// this.listBophan[i]["children"].push({
					// 							organizationName: 'index.html',
					// 							id: i,
					// 							})
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
			// this.listUserInfos = Object.assign([], this.listUserInfosDefault);
			// if (!this.search.trim()) {
			// 	return;
			// }
			// this.listUserInfos = this.listUserInfosDefault.filter((entry) => {
			// 	return (
			// 		this.nonAccentVietnamese(
			// 			entry.fullName.toLocaleUpperCase(),
			// 		).includes(
			// 			this.nonAccentVietnamese(
			// 				this.search.toLocaleUpperCase(),
			// 			),
			// 		) ||
			// 		this.nonAccentVietnamese(
			// 			entry.email.toLocaleUpperCase(),
			// 		).includes(
			// 			this.nonAccentVietnamese(
			// 				this.search.toLocaleUpperCase(),
			// 			),
			// 		)
			// 	);
			// });
		},
		async Save() {
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
		async getAllUserInfo(page, size) {
			let response = await globalService.getData_AsyncWithHeader(
				administratorAPI.GetAllUser(page, size),
			);
			if (!response) {
				return this.toastError(this.$t("error.load"));
			}
			this.listUserInfosDefault = response.data.data.filter((entry) => {
				return !entry.isDelete && entry.isActive;
			});
			this.listUserInfos = response.data.data.filter((entry) => {
				entry.showAll = false;
				return entry;
			});
			this.countAllItem = parseInt(response.headers["x-total-count"]);
			this.listUserInfos = this.sortList(this.listUserInfos);
		},
		changePage(event) {
			if (event.page > this.max_page) {
				this.max_page = event.page;
			}
			if (!this.search) {
				this.getAllUserInfo(event.page - 1, event.itemsPerPage);
			} else {
				this.searchUserByFilter(event.page - 1, event.itemsPerPage);
			}
			// console.log("event", event);
			return;
		},
		async searchUserByFilter(
			page = constant.page,
			page_size = constant.page_size,
		) {
			this.objFilter = {
				fullName: this.search,
				isDelete: false,
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
