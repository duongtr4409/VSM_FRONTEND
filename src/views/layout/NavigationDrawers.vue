<template>
	<div v-click-outside="onClickOutside">
		<v-dialog v-model="creating2" width="60vw" persistent>
			<NewRequestGroupV2Vue :isCreating="creating2" @close="onClose" />
		</v-dialog>
		<v-navigation-drawer
			dark
			color="#FF0000"
			mini-variant
			mini-variant-width="100"
			app
			permanent
		>
			<v-list-item class="px-2">
				<v-list-item-avatar>
					<v-tooltip bottom>
						<template v-slot:activator="{ on, attrs }">
							<v-img
								src="/img/backgrounds/VRE.jpg"
								v-bind="attrs"
								v-on="on"
							></v-img>
						</template>
						<span>{{ user_infor.fullName }}</span>
					</v-tooltip>
				</v-list-item-avatar>
			</v-list-item>
			<v-divider></v-divider>
			<v-list nav>
				<v-list-item-group
					v-model="selectedItem"
					active-class="menu-item-active"
				>
					<template v-for="item in modules">
						<template v-if="canAccess(item.roles, userInfo.roles)">
							<v-list-item
								v-if="!item.onClick"
								@click="showSecondary(item)"
								:key="`primary_${item.title}`"
							>
								<v-list-item-action class="mx-auto">
									<v-icon class="mx-auto">
										{{ item.icon }}
									</v-icon>
									<span class="text-xs">
										{{ item.title }}
									</span>
								</v-list-item-action>
							</v-list-item>
							<v-list-item
								v-else
								@click="item.onClick"
								:key="`primary_onClick_${item.title}`"
							>
								<v-list-item-action class="mx-auto">
									<v-icon class="mx-auto">
										{{ item.icon }}
									</v-icon>
									<span class="text-xs">
										{{ item.title }}
									</span>
								</v-list-item-action>
							</v-list-item>
						</template>
					</template>
				</v-list-item-group>
			</v-list>
			<v-divider></v-divider>
			<v-list-item class="mx-auto" @click="signOut()">
				<v-tooltip bottom>
					<template v-slot:activator="{ on, attrs }">
						<v-icon dark v-bind="attrs" v-on="on">
							mdi-logout
						</v-icon>
					</template>
					<span>{{ $t("label.logout") }}</span>
				</v-tooltip>
			</v-list-item>
		</v-navigation-drawer>

		<v-list
			v-if="hovering"
			color="white"
			style="left: 100px; z-index: 9; position: fixed"
			width="300"
			rounded
			class="grow fixed fill-height drop-shadow-lg rounded-0"
			@mouseout="hideSecondary()"
		>
			<div flat class="red h-[4px]"></div>
			<vue-perfect-scrollbar class="h-[100vh]">
				<template v-for="child in selected.children">
					<v-list-item
						v-if="!child.children && child.onClick"
						:key="`${child.title}_click`"
						@click="child.onClick"
						:class="child.class"
					>
						<v-list-item-action v-if="child.icon">
							<v-icon :color="child.iconColor">
								{{ child.icon }}
							</v-icon>
						</v-list-item-action>
						<v-list-item-title
							v-text="child.title"
						></v-list-item-title>
					</v-list-item>
					<v-list-item
						v-else-if="!child.children"
						:key="`${child.title}_to`"
						:to="child.link"
						@click="hovering = false"
						:class="child.class"
					>
						<v-list-item-action v-if="child.icon">
							<v-icon :color="child.iconColor">
								{{ child.icon }}
							</v-icon>
						</v-list-item-action>
						<v-list-item-title>
							<span>{{ child.title }}</span>
							<span
								v-if="child.counter"
								dark
								color="blue darken-2"
								class="
									text-red-500
									float-right
									font-bold
									text-xs
								"
							>
								{{
									child.counter() != 0 ? child.counter() : ""
								}}
							</span>
						</v-list-item-title>
					</v-list-item>
					<v-list-group v-else :key="child.title">
						<template v-slot:activator>
							<v-list-item-content>
								<v-list-item-title>{{
									child.title
								}}</v-list-item-title>
							</v-list-item-content>
						</template>
						<v-list-item
							v-for="item in child.children"
							:key="`${item.title}`"
							:to="item.link"
							@click="hovering = false"
							color="primary"
							class="ml-2"
							sub-group
						>
							<v-list-item-title
								v-text="item.title"
							></v-list-item-title>
						</v-list-item>
					</v-list-group>
				</template>
			</vue-perfect-scrollbar>
		</v-list>
	</div>
</template>
<script>
import userService from "@/services/user.service";
import administratorAPI from "../modules/administrator/administrator.api";
// import NewRequestGroupVue from "../modules/khai-phieu-yeu-cau/RequestForm/NewRequestGroup.vue";
import NewRequestGroupV2Vue from "../modules/khai-phieu-yeu-cau/RequestForm/NewRequestGroupV2.vue";
import globalService, { GlobalService } from "@/services/global.service";
import ROLE from "@/common/ROLE";
import axios from "axios";
export default {
	name: "NavigationDrawersVue",
	components: { NewRequestGroupV2Vue },
	async created() {
		await this.$Progress.start();
		await this.load();
		if (this.FEATURE.ORGCHART_TREE_VINGROUP) {
			this.modules = [
				{
					title: "Tạo mới",
					icon: "mdi-plus-circle",
					onClick: this.createNewRequestData2,
				},
				{
					title: this.$t("title.home"),
					icon: "mdi-home",
					link: "/",
					// children: [
					// 	{
					// 		title: "Tạo mới phiếu yêu cầu",
					// 		link: "/phieu-yeu-cau/tao-moi",
					// 	},
					// 	{
					// 		title: "Tạo mới",
					// 		link: "/phieu-yeu-cau/tao-moi",
					// 	},
					// 	{
					// 		title: "Toàn bộ",
					// 		link: "/phieu-yeu-cau",
					// 	},
					// 	{
					// 		title: "Cần xử lý",
					// 		link: "/phieu-yeu-cau/list-request-handle",
					// 	},
					// 	{
					// 		title: "Đã ủy quyền",
					// 		link: "/",
					// 	},
					// 	{
					// 		title: "Đang theo dõi",
					// 		link: "/phieu-yeu-cau/list-request-following",
					// 	},

					// ],
				},
				{
					title: this.$t("title.request"),
					icon: "mdi-briefcase",
					link: "/danh-sach-can-xu-ly",
					children: [
						// {
						// 	title: "Tạo mới phiếu yêu cầu",
						// 	link: "/phieu-yeu-cau/tao-moi",
						// },
						// {
						// 	title: "Tạo mới",
						// 	link: "/phieu-yeu-cau/tao-moi",
						// 	onClick: this.createNewRequestData2,
						// 	class: "grey lighten-2 rounded",
						// 	icon: "mdi-plus-circle",
						// 	iconColor: "blue darken-2",
						// },
						// {
						// 	title: "Tạo mới V2",
						// 	link: "/phieu-yeu-cau/tao-moi",
						// 	onClick: this.createNewRequestData2,
						// },
						{
							title: `${"Đang soạn"}`,
							link: "/phieu-yeu-cau/dang-soan",
							counter: this.getCountRequestDataDrafting,
						},
						{
							title: `${"Cần xử lý"}`,
							link: "/phieu-yeu-cau/list-request-handle",
							counter: this.getCountRequestNeedHandle,
						},
						{
							title: `${"Chờ phê duyệt"}`,
							link: "/phieu-yeu-cau/list-request-wait-approval",
							counter: this.getCountRequestDataWaitApproval,
						},
						{
							title: `${"Đã phê duyệt"}`,
							link: "/phieu-yeu-cau/list-request-approved",
							counter: this.getCountRequestDataApproval,
						},
						{
							title: `${"Từ chối"}`,
							link: "/phieu-yeu-cau/list-request-give-back",
							counter: this.getCountRequestDataGiveBack,
						},
						{
							title: `${"Đang theo dõi"}`,
							link: "/phieu-yeu-cau/list-request-following",
							counter: this.getCountRequestDataFollows,
						},
						{
							title: `${"Được chia sẻ"}`,
							link: "/phieu-yeu-cau/list-request-shared",
						},
						{
							title: `${"Toàn bộ"}`,
							link: "/phieu-yeu-cau/list-request",
							counter: this.getCountAllRequest,
						},
						// {
						// 	title: "Màn hình khách hàng",
						// 	link: "/phieu-yeu-cau/view-customer",
						// },
					],
					// children: [
					// 	{
					// 		title: this.$t("title.create_request_data"),
					// 		link: "/phieu-yeu-cay/tao-moi",
					// 		class: "grey lighten-2 rounded",
					// 		icon: "mdi-plus-circle",
					// 		iconColor: "blue darken-2",
					// 	},
					// 	{
					// 		title: this.$t("title.draft_request"),
					// 		link: "/danh-sach-dang-soan",
					// 	},
					// 	{
					// 		title: this.$t("title.resolve"),
					// 		link: "/danh-sach-can-xu-ly",
					// 	},
					// 	{
					// 		title: this.$t("title.reject"),
					// 		link: "/danh-sach-tra-lai",
					// 	},
					// ],
				},
				{
					title: this.$t("title.management"),
					icon: "mdi-cog",
					link: "/quan-tri",
					children: this.getFeatureOfUser(),
					children_bak: [
						{
							title: this.$t("title.user_management"),
							link: "/quan-tri/nguoi-dung",
							children: [
								{
									title: this.$t("title.user"),
									link: "/quan-tri/nguoi-dung/nguoi-dung",
								},
								{
									title: this.$t(
										"title.user_group_management",
									),
									link: "/quan-tri/nguoi-dung/nhom-nguoi-dung/",
								},
								{
									title: this.$t("title.role_management"),
									link: "/quan-tri/nguoi-dung/quyen/",
								},
								{
									title: this.$t("title.title_management"),
									link: "/quan-tri/rank-management",
								},
								// {
								// 	title: this.$t("title.list_of_organization"),
								// 	link: "/quan-tri/list-organization",
								// },
							],
						},
						{
							title: this.$t("title.orgchart_management"),
							link: "/quan-tri/orgchart",
						},
						{
							title: "Orgchart Tree Vingroup",
							link: "/quan-tri/orgchart-tree-vingroup",
						},

						{
							title: this.$t("title.template_management"),
							link: "/quan-tri/bieu-mau",
						},
						{
							title: this.$t("title.storage_management"),
							link: "/quan-tri/luu-tru",
						},
						{
							title: this.$t("title.category_management"),
							link: "/quan-tri/danh-muc",
						},
						{
							title: this.$t("title.process_management"),
							link: "/quan-tri/quy-trinh",
							children: [
								{
									title: this.$t("title.process_management"),
									link: "/quan-tri/quy-trinh",
								},
								{
									title: this.$t("title.processstep"),
									link: "/quan-tri/list-processstep",
								},
							],
						},
						{
							title: this.$t("title.request_management"),
							link: "/quan-tri/loai-yeu-cau",
							children: [
								{
									title: this.$t(
										"title.list_of_request_group",
									),
									link: "/quan-tri/list-group-request",
								},
								{
									title: this.$t("title.request_type_list"),
									link: "/quan-tri/list-types-request",
								},
								{
									title: this.$t(
										this.$t("title.request_management"),
									),
									link: "/quan-tri/quan-tri-nhom-loai-yeu-cau",
								},
							],
						},
						{
							title: this.$t("title.otp_management"),
							link: "/quan-tri/otp",
						},
						{
							title: this.$t("title.email_management"),
							link: "/quan-tri/email",
						},
						{
							title: "Quản lý sổ công văn",
							link: "/quan-tri/so-cong-van",
						},
						{
							title: "Quản lý danh mục trạng thái",
							link: "/quan-tri/trang-thai",
						},
						{
							title: "Quản trị hàng hóa dịch vụ",
							link: "/quan-tri/manage-cargo",
						},
						{
							title: "Quản trị Bussiness Partner",
							link: "/quan-tri/bussiness-partner",
						},
					],
					roles: [ROLE.ROLE_ADMINISTRATOR],
				},
				{
					title: this.$t("title.report"),
					icon: "mdi-chart-bar-stacked",
					link: "/report",
				},
			];
		}
		if (!this.FEATURE.ORGCHART_TREE_VINGROUP) {
			this.modules = [
				{
					title: "Tạo mới",
					icon: "mdi-plus-circle",
					onClick: this.createNewRequestData2,
				},
				{
					title: this.$t("title.home"),
					icon: "mdi-home",
					link: "/",
					// children: [
					// 	{
					// 		title: "Tạo mới phiếu yêu cầu",
					// 		link: "/phieu-yeu-cau/tao-moi",
					// 	},
					// 	{
					// 		title: "Tạo mới",
					// 		link: "/phieu-yeu-cau/tao-moi",
					// 	},
					// 	{
					// 		title: "Toàn bộ",
					// 		link: "/phieu-yeu-cau",
					// 	},
					// 	{
					// 		title: "Cần xử lý",
					// 		link: "/phieu-yeu-cau/list-request-handle",
					// 	},
					// 	{
					// 		title: "Đã ủy quyền",
					// 		link: "/",
					// 	},
					// 	{
					// 		title: "Đang theo dõi",
					// 		link: "/phieu-yeu-cau/list-request-following",
					// 	},

					// ],
				},
				{
					title: this.$t("title.request"),
					icon: "mdi-briefcase",
					link: "/danh-sach-can-xu-ly",
					children: [
						// {
						// 	title: "Tạo mới phiếu yêu cầu",
						// 	link: "/phieu-yeu-cau/tao-moi",
						// },
						// {
						// 	title: "Tạo mới",
						// 	link: "/phieu-yeu-cau/tao-moi",
						// 	onClick: this.createNewRequestData2,
						// 	class: "grey lighten-2 rounded",
						// 	icon: "mdi-plus-circle",
						// 	iconColor: "blue darken-2",
						// },
						// {
						// 	title: "Tạo mới V2",
						// 	link: "/phieu-yeu-cau/tao-moi",
						// 	onClick: this.createNewRequestData2,
						// },
						{
							title: `${"Đang soạn"}`,
							link: "/phieu-yeu-cau/dang-soan",
							counter: this.getCountRequestDataDrafting,
						},
						{
							title: `${"Cần xử lý"}`,
							link: "/phieu-yeu-cau/list-request-handle",
							counter: this.getCountRequestNeedHandle,
						},
						{
							title: `${"Chờ phê duyệt"}`,
							link: "/phieu-yeu-cau/list-request-wait-approval",
							counter: this.getCountRequestDataWaitApproval,
						},
						{
							title: `${"Đã phê duyệt"}`,
							link: "/phieu-yeu-cau/list-request-approved",
							counter: this.getCountRequestDataApproval,
						},
						{
							title: `${"Từ chối"}`,
							link: "/phieu-yeu-cau/list-request-give-back",
							counter: this.getCountRequestDataGiveBack,
						},
						{
							title: `${"Đang theo dõi"}`,
							link: "/phieu-yeu-cau/list-request-following",
							counter: this.getCountRequestDataFollows,
						},
						{
							title: `${"Được chia sẻ"}`,
							link: "/phieu-yeu-cau/list-request-shared",
						},
						{
							title: `${"Toàn bộ"}`,
							link: "/phieu-yeu-cau/list-request",
							counter: this.getCountAllRequest,
						},
						// {
						// 	title: "Màn hình khách hàng",
						// 	link: "/phieu-yeu-cau/view-customer",
						// },
					],
					// children: [
					// 	{
					// 		title: this.$t("title.create_request_data"),
					// 		link: "/phieu-yeu-cay/tao-moi",
					// 		class: "grey lighten-2 rounded",
					// 		icon: "mdi-plus-circle",
					// 		iconColor: "blue darken-2",
					// 	},
					// 	{
					// 		title: this.$t("title.draft_request"),
					// 		link: "/danh-sach-dang-soan",
					// 	},
					// 	{
					// 		title: this.$t("title.resolve"),
					// 		link: "/danh-sach-can-xu-ly",
					// 	},
					// 	{
					// 		title: this.$t("title.reject"),
					// 		link: "/danh-sach-tra-lai",
					// 	},
					// ],
				},
				{
					title: this.$t("title.management"),
					icon: "mdi-cog",
					link: "/quan-tri",
					children: this.getFeatureOfUser(),
					children_bak: [
						{
							title: this.$t("title.user_management"),
							link: "/quan-tri/nguoi-dung",
							children: [
								{
									title: this.$t("title.user"),
									link: "/quan-tri/nguoi-dung/nguoi-dung",
								},
								{
									title: this.$t(
										"title.user_group_management",
									),
									link: "/quan-tri/nguoi-dung/nhom-nguoi-dung/",
								},
								{
									title: this.$t("title.role_management"),
									link: "/quan-tri/nguoi-dung/quyen/",
								},
								{
									title: this.$t("title.title_management"),
									link: "/quan-tri/rank-management",
								},
								// {
								// 	title: this.$t("title.list_of_organization"),
								// 	link: "/quan-tri/list-organization",
								// },
							],
						},
						{
							title: this.$t("title.orgchart_management"),
							link: "/quan-tri/orgchart",
						},
						// {
						// 	title: "Orgchart Tree Vingroup",
						// 	link: "/quan-tri/orgchart-tree-vingroup",
						// },

						{
							title: this.$t("title.template_management"),
							link: "/quan-tri/bieu-mau",
						},
						{
							title: this.$t("title.storage_management"),
							link: "/quan-tri/luu-tru",
						},
						{
							title: this.$t("title.category_management"),
							link: "/quan-tri/danh-muc",
						},
						{
							title: this.$t("title.process_management"),
							link: "/quan-tri/quy-trinh",
							children: [
								{
									title: this.$t("title.process_management"),
									link: "/quan-tri/quy-trinh",
								},
								{
									title: this.$t("title.processstep"),
									link: "/quan-tri/list-processstep",
								},
							],
						},
						{
							title: this.$t("title.request_management"),
							link: "/quan-tri/loai-yeu-cau",
							children: [
								{
									title: this.$t(
										"title.list_of_request_group",
									),
									link: "/quan-tri/list-group-request",
								},
								{
									title: this.$t("title.request_type_list"),
									link: "/quan-tri/list-types-request",
								},
								{
									title: this.$t(
										this.$t("title.request_management"),
									),
									link: "/quan-tri/quan-tri-nhom-loai-yeu-cau",
								},
							],
						},
						{
							title: this.$t("title.otp_management"),
							link: "/quan-tri/otp",
						},
						{
							title: this.$t("title.email_management"),
							link: "/quan-tri/email",
						},
						{
							title: "Quản lý sổ công văn",
							link: "/quan-tri/so-cong-van",
						},
						{
							title: "Quản lý danh mục trạng thái",
							link: "/quan-tri/trang-thai",
						},
						{
							title: "Quản trị hàng hóa dịch vụ",
							link: "/quan-tri/manage-cargo",
						},
						{
							title: "Quản trị Bussiness Partner",
							link: "/quan-tri/bussiness-partner",
						},
					],
					roles: [ROLE.ROLE_ADMINISTRATOR],
				},
				{
					title: this.$t("title.report"),
					icon: "mdi-chart-bar-stacked",
					link: "/report",
				},
			];
		}
	},
	mounted() {
		this.$Progress.finish();
	},
	data() {
		return {
			user_infor: this.getUserInfo(),
			current_feature: [],

			countRequestDataWaitApproval: 0,
			countRequestDataApproval: 0,
			countRequestDataShareToUser: 0,
			countRequestDataFollow: 0,
			countRequestDataGiveBack: 0,
			countRequestDrafting: 0,
			countRequestHandle: 0,
			countRequestAll: 0,
			hovering: false,
			hovering2: false,
			selected: [],
			creating: false,
			creating2: false,
			openRequestData: false,
			selectedItem: 0,
			childrenOfMangage: [
				{
					title: this.$t("title.user_management"),
					link: "/quan-tri/nguoi-dung",
					children: [
						{
							title: this.$t("title.user"),
							link: "/quan-tri/nguoi-dung/nguoi-dung",
						},
						{
							title: this.$t("title.user_group_management"),
							link: "/quan-tri/nguoi-dung/nhom-nguoi-dung/",
						},
						{
							title: this.$t("title.role_management"),
							link: "/quan-tri/nguoi-dung/quyen/",
						},
						{
							title: this.$t("title.title_management"),
							link: "/quan-tri/rank-management",
						},
						// {
						// 	title: this.$t("title.list_of_organization"),
						// 	link: "/quan-tri/list-organization",
						// },
					],
				},
				{
					title: this.$t("title.orgchart_management"),
					link: "/quan-tri/orgchart",
				},
				// {
				// 	title: "Orgchart Tree Vingroup",
				// 	link: "/quan-tri/orgchart-tree-vingroup",
				// },

				{
					title: this.$t("title.template_management"),
					link: "/quan-tri/bieu-mau",
				},
				{
					title: this.$t("title.storage_management"),
					link: "/quan-tri/luu-tru",
				},
				{
					title: this.$t("title.category_management"),
					link: "/quan-tri/danh-muc",
				},
				{
					title: this.$t("title.process_management"),
					link: "/quan-tri/quy-trinh",
					children: [
						{
							title: this.$t("title.process_management"),
							link: "/quan-tri/quy-trinh",
						},
						{
							title: this.$t("title.processstep"),
							link: "/quan-tri/list-processstep",
						},
					],
				},
				{
					title: this.$t("title.request_management"),
					link: "/quan-tri/loai-yeu-cau",
					children: [
						{
							title: this.$t("title.list_of_request_group"),
							link: "/quan-tri/list-group-request",
						},
						{
							title: this.$t("title.request_type_list"),
							link: "/quan-tri/list-types-request",
						},
						{
							title: this.$t(this.$t("title.request_management")),
							link: "/quan-tri/quan-tri-nhom-loai-yeu-cau",
						},
					],
				},
				{
					title: this.$t("title.otp_management"),
					link: "/quan-tri/otp",
				},
				{
					title: this.$t("title.email_management"),
					link: "/quan-tri/email",
				},
				{
					title: "Quản lý sổ công văn",
					link: "/quan-tri/so-cong-van",
				},
				{
					title: "Quản lý danh mục trạng thái",
					link: "/quan-tri/trang-thai",
				},
				{
					title: "Quản trị hàng hóa dịch vụ",
					link: "/quan-tri/manage-cargo",
				},
				{
					title: "Quản trị Bussiness Partner",
					link: "/quan-tri/bussiness-partner",
				},
			],
			modules: [
				{
					title: "Tạo mới",
					icon: "mdi-plus-circle",
					onClick: this.createNewRequestData2,
				},
				{
					title: this.$t("title.home"),
					icon: "mdi-home",
					link: "/",
					// children: [
					// 	{
					// 		title: "Tạo mới phiếu yêu cầu",
					// 		link: "/phieu-yeu-cau/tao-moi",
					// 	},
					// 	{
					// 		title: "Tạo mới",
					// 		link: "/phieu-yeu-cau/tao-moi",
					// 	},
					// 	{
					// 		title: "Toàn bộ",
					// 		link: "/phieu-yeu-cau",
					// 	},
					// 	{
					// 		title: "Cần xử lý",
					// 		link: "/phieu-yeu-cau/list-request-handle",
					// 	},
					// 	{
					// 		title: "Đã ủy quyền",
					// 		link: "/",
					// 	},
					// 	{
					// 		title: "Đang theo dõi",
					// 		link: "/phieu-yeu-cau/list-request-following",
					// 	},

					// ],
				},
				{
					title: this.$t("title.request"),
					icon: "mdi-briefcase",
					link: "/danh-sach-can-xu-ly",
					children: [
						// {
						// 	title: "Tạo mới phiếu yêu cầu",
						// 	link: "/phieu-yeu-cau/tao-moi",
						// },
						{
							title: "Tạo mới",
							link: "/phieu-yeu-cau/tao-moi",
							onClick: this.createNewRequestData2,
							class: "grey lighten-2 rounded",
							icon: "mdi-plus-circle",
							iconColor: "blue darken-2",
						},
						// {
						// 	title: "Tạo mới V2",
						// 	link: "/phieu-yeu-cau/tao-moi",
						// 	onClick: this.createNewRequestData2,
						// },
						{
							title: "Đang soạn",
							link: "/phieu-yeu-cau/dang-soan",
						},
						{
							title: "Cần xử lý",
							link: "/phieu-yeu-cau/list-request-handle",
						},
						{
							title: "Từ chối",
							link: "/phieu-yeu-cau/list-request-give-back",
						},
						{
							title: "Đang theo dõi",
							link: "/phieu-yeu-cau/list-request-following",
						},
						{
							title: "Chờ phê duyệt",
							link: "/phieu-yeu-cau/list-request-wait-approval",
						},
						{
							title: "Đã phê duyệt",
							link: "/phieu-yeu-cau/list-request-approved",
						},
						{
							title: "Được chia sẻ",
							link: "/phieu-yeu-cau/list-request-shared",
						},
						{
							title: "Toàn bộ",
							link: "/phieu-yeu-cau/list-request",
						},
						// {
						// 	title: "Màn hình khách hàng",
						// 	link: "/phieu-yeu-cau/view-customer",
						// },
					],
					// children: [
					// 	{
					// 		title: this.$t("title.create_request_data"),
					// 		link: "/phieu-yeu-cay/tao-moi",
					// 		class: "grey lighten-2 rounded",
					// 		icon: "mdi-plus-circle",
					// 		iconColor: "blue darken-2",
					// 	},
					// 	{
					// 		title: this.$t("title.draft_request"),
					// 		link: "/danh-sach-dang-soan",
					// 	},
					// 	{
					// 		title: this.$t("title.resolve"),
					// 		link: "/danh-sach-can-xu-ly",
					// 	},
					// 	{
					// 		title: this.$t("title.reject"),
					// 		link: "/danh-sach-tra-lai",
					// 	},
					// ],
				},
				{
					title: this.$t("title.management"),
					icon: "mdi-cog",
					link: "/quan-tri",
					children: [
						{
							title: this.$t("title.user_management"),
							link: "/quan-tri/nguoi-dung",
							children: [
								{
									title: this.$t("title.user"),
									link: "/quan-tri/nguoi-dung/nguoi-dung",
								},
								{
									title: this.$t(
										"title.user_group_management",
									),
									link: "/quan-tri/nguoi-dung/nhom-nguoi-dung/",
								},
								{
									title: this.$t("title.role_management"),
									link: "/quan-tri/nguoi-dung/quyen/",
								},
								{
									title: this.$t("title.title_management"),
									link: "/quan-tri/rank-management",
								},
								// {
								// 	title: this.$t(
								// 		"title.list_of_organization",
								// 	),
								// 	link: "/quan-tri/list-organization",
								// },
							],
						},
						{
							title: this.$t("title.orgchart_management"),
							link: "/quan-tri/orgchart",
						},

						{
							title: this.$t("title.template_management"),
							link: "/quan-tri/bieu-mau",
						},
						{
							title: this.$t("title.storage_management"),
							link: "/quan-tri/luu-tru",
						},
						{
							title: this.$t("title.category_management"),
							link: "/quan-tri/danh-muc",
						},
						{
							title: this.$t("title.process_management"),
							link: "/quan-tri/quy-trinh",
							children: [
								{
									title: this.$t("title.process_management"),
									link: "/quan-tri/quy-trinh",
								},
								{
									title: this.$t("title.processstep"),
									link: "/quan-tri/list-processstep",
								},
							],
						},
						{
							title: this.$t("title.request_management"),
							link: "/quan-tri/loai-yeu-cau",
							children: [
								{
									title: this.$t(
										"title.list_of_request_group",
									),
									link: "/quan-tri/list-group-request",
								},
								{
									title: this.$t("title.request_type_list"),
									link: "/quan-tri/list-types-request",
								},
								{
									title: this.$t(
										this.$t("title.request_management"),
									),
									link: "/quan-tri/quan-tri-nhom-loai-yeu-cau",
								},
							],
						},
						{
							title: this.$t("title.otp_management"),
							link: "/quan-tri/otp",
						},
						{
							title: this.$t("title.email_management"),
							link: "/quan-tri/email",
						},
						{
							title: "Quản lý sổ công văn",
							link: "/quan-tri/so-cong-van",
						},
						{
							title: "Quản lý danh mục trạng thái",
							link: "/quan-tri/trang-thai",
						},
						{
							title: "Quản trị hàng hóa dịch vụ",
							link: "/quan-tri/manage-cargo",
						},
						{
							title: "Quản trị Bussiness Partner",
							link: "/quan-tri/bussiness-partner",
						},
					],
					roles: [ROLE.ROLE_ADMINISTRATOR],
				},
				{
					title: this.$t("title.report"),
					icon: "mdi-chart-bar-stacked",
					link: "/report",
				},
			],
		};
	},
	watch: {
		hovering(val) {
			if (val) {
				this.countRequestDataDrafting();
				this.countRequestNeedHandle();
				this.countRequestGiveBack();
				this.countRequestWaitApproval();
				this.countAllRequest();
				this.countRequestDataApprovals();
				this.countRequestDataFollows();
				// await this.GetCountRequestDataShareToUser();
				// await this.GetCountRequestDataApproval();
				// await this.GetcountRequestDataFollow();
			}
		},
	},
	methods: {
		async load() {
			await this.loadAllFuture();
		},
		async loadAllFuture() {
			let configResponse = await globalService.getLocalData_Async(
				"/json/config.json?v=" + new Date().getTime(),
			);
			let featureResponse = await axios.get(
				configResponse.apiUrl +
					administratorAPI.API_GetAllOfUser_Feature(
						this.user_infor?.id,
					),
				{
					headers: GlobalService.headers,
				},
			);
			this.current_feature = featureResponse?.data?.data ?? [];
		},
		hideSecondary() {
			this.hovering = false;
			this.hovering2 = false;
		},
		showPrimary(item) {
			if (!item || !item.link) {
				this.mini = false;
				return;
			}
			this.mini = true;
		},
		showSecondary(item) {
			if (!item) {
				return;
			}
			if (!item.children) {
				this.hovering = false;
				this.$router.push({ path: item.link });
			} else {
				this.selected = item;
				this.hovering = true;
			}
		},
		onClickOutside() {
			this.hideSecondary();
		},
		signOut() {
			userService.signOut();
			this.$router.push({
				path: "/sign-in",
			});
		},
		createNewRequestData() {
			this.hovering = false;
			this.creating = true;
		},
		createNewRequestData2() {
			this.hovering2 = false;
			this.creating2 = true;
			this.hovering = false;
		},

		onClose(value) {
			if (value) {
				this.creating = false;
				this.creating2 = false;
			}
		},
		getCountAllRequest() {
			return this.countRequestAll;
		},
		countAllRequest() {
			globalService
				.getData_NoAsync(
					administratorAPI.API_CountRequestDataOfUser(
						this.user_infor.id,
					),
				)
				.then((response) => {
					if (!response || !response.data.state) {
						return;
						// return this.toastError(this.$t("error.load"));
					}
					this.countRequestAll = response.data.data;
				});
		},
		getCountRequestNeedHandle() {
			return this.countRequestHandle;
		},
		countRequestNeedHandle() {
			globalService
				.getData_NoAsync(
					administratorAPI.API_GetCountRequestNeedHandle(
						this.user_infor.id,
					),
				)
				.then((response) => {
					if (!response || !response.data.state) {
						return;
						// return this.toastError(this.$t("error.load"));
					}
					this.countRequestHandle = response.data.data;
				});
		},
		getCountRequestDataDrafting() {
			return this.countRequestDrafting;
		},
		countRequestDataDrafting() {
			globalService
				.getData_NoAsync(
					administratorAPI.API_CountRequestDataDrafting(
						this.user_infor.id,
					),
				)
				.then((response) => {
					if (!response || !response.data.state) {
						return;
						// return this.toastError(this.$t("error.load"));
					}
					this.countRequestDrafting = response.data.data;
				});
		},
		getCountRequestDataGiveBack() {
			return this.countRequestDataGiveBack;
		},
		countRequestGiveBack() {
			globalService
				.getData_NoAsync(
					administratorAPI.API_CountRequestDataGiveBack(
						this.user_infor.id,
					),
				)
				.then((response) => {
					if (!response || !response.data.state) {
						return;
						// this.toastError(this.$t("error.load"));
					}
					this.countRequestDataGiveBack = response.data.data;
				});
		},
		getCountRequestDataFollows() {
			return this.countRequestDataFollow;
		},
		countRequestDataFollows() {
			globalService
				.getData_NoAsync(
					administratorAPI.API_CountRequestDataFollow(
						this.user_infor.id,
					),
				)
				.then((response) => {
					if (!response || !response.data.state) {
						return;
						// this.toastError(this.$t("error.load"));
					}
					this.countRequestDataFollow = response.data.data;
				});
		},
		getCountRequestDataWaitApproval() {
			return this.countRequestDataWaitApproval;
		},
		countRequestWaitApproval() {
			globalService
				.getData_NoAsync(
					administratorAPI.API_CountRequestDataWaitApproval(
						this.user_infor.id,
					),
				)
				.then((response) => {
					if (!response || !response.data.state) {
						return;
						// this.toastError(this.$t("error.load"));
					}
					this.countRequestDataWaitApproval = response.data.data;
				});
		},
		getCountRequestDataApproval() {
			return this.countRequestDataApproval;
		},

		countRequestDataApprovals() {
			globalService
				.getData_NoAsync(
					administratorAPI.API_CountRequestDataApproval(
						this.user_infor.id,
					),
				)
				.then((response) => {
					if (!response || !response.data.state) {
						return;
						// this.toastError(this.$t("error.load"));
					}
					this.countRequestDataApproval = response.data.data;
				});
		},
		async GetCountRequestDataShareToUser() {
			let response = await globalService.getData_Async(
				administratorAPI.API_CountRequestDataShareToUser(
					this.user_infor.id,
				),
			);
			if (!response || !response.state) {
				return;
				// this.toastError(this.$t("error.load"));
			}
			this.countRequestDataShareToUser = response.data;
		},
		canAccess(roles, userRoles) {
			if (!roles) {
				return true;
			}
			if (!roles.length) {
				return true;
			}
			if (
				!userRoles.filter((e) => {
					return roles.indexOf(e.roleType) >= 0;
				})
			) {
				return false;
			}
			if (
				!userRoles.filter((e) => {
					return roles.indexOf(e.roleType) >= 0;
				}).length
			) {
				return false;
			}
			return true;
		},
		getFeatureOfUser() {
			if (this.FEATURE.ORGCHART_TREE_VINGROUP)
				return this.childrenOfMangage;
			let result = this.childrenOfMangage.filter((ele) => {
				return this.current_feature.some(
					(ele1) => ele1.link == ele.link,
				);
			});
			return result;
		},
	},
};
</script>
<style>
.scroll-area {
	height: 70vh;
}
</style>
