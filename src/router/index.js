import ROLE from "@/common/ROLE";
import guardService from "@/services/auth/guard.service";
import AdministratorVue from "@/views/modules/administrator/Administrator.vue";
import Vue from "vue";
import VueRouter from "vue-router";
import store from "../store/index";
const HomeViewVue = () => import("../views/HomeView.vue");
import administratorRoutes from "../router/administator.router";
import quantriRoutes from "./quantri.route";
Vue.use(VueRouter);

const router = new VueRouter({
	mode: "history",
	scrollBehavior(to) {
		if (to.hash) {
			return {
				selector: to.hash,
				behavior: "smooth",
			};
		}
	},
	routes: [
		{
			path: "/sign-in",
			name: "Đăng nhập",
			component: () => import("../views/modules/auth/sign-in.vue"),
			meta: {
				title: "Sign in",
				requiresAuth: false,
			},
		},
		{
			path: "/administrator",
			name: "Trang quản lý",
			component: AdministratorVue,
			meta: {
				requiresAuth: true,
				roles: [ROLE.ROLE_ADMINISTRATOR],
			},
			children: administratorRoutes,
		},
		{
			path: "/quan-tri",
			name: "Trang quản trị",
			component: AdministratorVue,
			meta: {
				requiresAuth: true,
				roles: [ROLE.ROLE_ADMINISTRATOR],
			},
			children: quantriRoutes,
		},
		{
			path: "/",
			name: "Trang chủ",
			component: HomeViewVue,
			meta: {
				title: "VSM Application",
				requiresAuth: true,
				roles: [ROLE.ROLE_USER, ROLE.ROLE_ADMINISTRATOR],
			},
			children: [
				{
					path: "",
					name: "Dashboard",
					component: () =>
						import(
							"../views/modules/administrator/Dashboard/DashboardEoffice.vue"
						),
					meta: {
						requiresAuth: true,
						roles: [ROLE.ROLE_USER],
					},
				},
				{
					path: "report",
					name: "Báo cáo - Thống kê",
					meta: {
						requiresAuth: true,
						roles: [ROLE.ROLE_USER],
					},
					component: () =>
								import(
									"@/views/modules/administrator/Report/ReportView"
								),
					children: [
						{
							path: "",
							name: "Chi tiết phiếu yêu cầu thống kê",
							component: () =>
								import(
									"@/views/modules/administrator/Report/ReportList.vue"
								),
							meta: {
								requiresAuth: true,
								roles: [ROLE.ROLE_USER],
							},
						},
						// duowngTora: để tạm ở ngoài vì trong children đang ko call được (tìm cách sửa sau)
						{
							path: "chi-tiet/:id(\\d+)",
							name: "Chi tiết phiếu yêu cầu thống kê",
							component: () =>
								import(
									"@/views/modules/administrator/Report/ViewDetailReport.vue"
								),
							meta: {
								requiresAuth: true,
								roles: [ROLE.ROLE_USER],
							},
						},
					],
				},



				{
					path: "phieu-yeu-cau",
					name: "Quản lý phiếu yêu cầu",
					meta: {
						requiresAuth: true,
						roles: [ROLE.ROLE_USER],
					},
					component: () =>
						import(
							"@/views/modules/khai-phieu-yeu-cau/RequestForm/RequestForm"
						),

					children: [
						// {
						// 	path: "tao-moiV2",
						// 	name: "Tạo mới phiếu yêu cầu",
						// 	component: () =>
						// 		import(
						// 			"@/views/modules/khai-phieu-yeu-cau/RequestForm/CreateRequestFormV2"
						// 		),
						// 	meta: {
						// 		requiresAuth: true,
						// 		roles: [ROLE.ROLE_USER],
						// 	},
						// },
						{
							path: "tao-moi",
							name: "Tạo mới phiếu yêu cầu",
							component: () =>
								import(
									"@/views/modules/khai-phieu-yeu-cau/RequestForm/NewRequestGroup"
								),
							meta: {
								requiresAuth: true,
								roles: [ROLE.ROLE_ADMINISTRATOR],
							},
						},
						{
							path: "chi-tiet/:id(\\d+)",
							name: "Chi tiết phiếu yêu cầu",
							component: () =>
								import(
									"@/views/modules/khai-phieu-yeu-cau/RequestForm/ViewRequestForm"
								),
							meta: {
								requiresAuth: true,
								roles: [ROLE.ROLE_USER],
							},
						},
						{
							path: "chi-tiet-phieu-cho-phe-duyet/:id(\\d+)",
							name: "Chi tiết phiếu yêu cầu",
							component: () =>
								import(
									"@/views/modules/khai-phieu-yeu-cau/RequestForm/ViewRequestForm"
								),
							meta: {
								requiresAuth: true,
								roles: [ROLE.ROLE_USER],
							},
						},
						{
							path: "phe-duyet/:id(\\d+)",
							name: "Chi tiết phiếu yêu cầu cần xử lý",
							component: () =>
								import(
									"@/views/modules/khai-phieu-yeu-cau/RequestForm/ViewRequestFormHandle"
								),
							meta: {
								requiresAuth: true,
								roles: [ROLE.ROLE_USER],
							},
						},
						{
							path: ":id(\\d+)/chi-tiet",
							name: "Chi tiết phiếu yêu cầu",
							component: () =>
								import(
									"@/views/modules/khai-phieu-yeu-cau/RequestForm/NewRequestType"
								),
							meta: {
								requiresAuth: true,
								roles: [ROLE.ROLE_USER],
							},
						},
						{
							path: ":id(\\d+)/phe-duyet",
							name: "Chi tiết phiếu yêu cầu",
							component: () =>
								import(
									"@/views/modules/khai-phieu-yeu-cau/RequestForm/NewRequestTypeV2"
								),
							meta: {
								requiresAuth: true,
								roles: [ROLE.ROLE_USER],
							},
						},
						{
							path: "list-request",
							name: "Toàn bộ",
							component: () =>
								import(
									"@/views/modules/khai-phieu-yeu-cau/RequestForm/ListRequestForm"
								),
							meta: {
								requiresAuth: true,
								roles: [ROLE.ROLE_USER],
							},
						},
						{
							path: "list-request-handle",
							name: "Phiếu yêu cầu cần xử lý",

							component: () =>
								import(
									"@/views/modules/khai-phieu-yeu-cau/RequestNeedProcess/ListRequesdInProcess.vue"
								),
							meta: {
								requiresAuth: true,
								roles: [ROLE.ROLE_USER],
							},
						},
						{
							path: "list-request-shared",
							name: "Phiếu yêu cầu được chia sẻ",

							component: () =>
								import(
									"@/views/modules/khai-phieu-yeu-cau/RequestDataShared/ListRequestDataShared.vue"
								),
							meta: {
								requiresAuth: true,
								roles: [ROLE.ROLE_USER],
							},
						},
						{
							path: "dang-soan",
							name: "Phiếu đang soạn",

							component: () =>
								import(
									"@/views/modules/khai-phieu-yeu-cau/MyRequestDrafting/ListRequestDrafting.vue"
								),
							meta: {
								requiresAuth: true,
								roles: [ROLE.ROLE_USER],
							},
						},
						{
							path: "list-request-following",
							name: "Phiếu đang theo dõi",

							component: () =>
								import(
									"@/views/modules/khai-phieu-yeu-cau/RequestDataFollow/ListRequestDataFollowing.vue"
								),
							meta: {
								requiresAuth: true,
								roles: [ROLE.ROLE_USER],
							},
						},
						{
							path: "list-request-approved",
							name: "Phiếu đã duyệt",

							component: () =>
								import(
									"@/views/modules/khai-phieu-yeu-cau/RequestAppoved/ListRequestApproved.vue"
								),
							meta: {
								requiresAuth: true,
								roles: [ROLE.ROLE_USER],
							},
						},
						{
							path: "list-request-give-back",
							name: "Phiếu bị từ chối",

							component: () =>
								import(
									"@/views/modules/khai-phieu-yeu-cau/RequestGiveBack/ListRequestGiveBack.vue"
								),
							meta: {
								requiresAuth: true,
								roles: [ROLE.ROLE_USER],
							},
						},
						{
							path: "list-request-wait-approval",
							name: "Phiếu chờ phê duyệt",

							component: () =>
								import(
									"@/views/modules/khai-phieu-yeu-cau/RequestWaitApproval/ListRequestWaitApproval.vue"
								),
							meta: {
								requiresAuth: true,
								roles: [ROLE.ROLE_USER],
							},
						},
						{
							path: "view-customer/:id",
							name: "Xem văn bản",

							component: () =>
								import(
									"@/views/modules/khai-phieu-yeu-cau/RequestForm/ViewCustomer.vue"
								),
						},
					],
				},
			],
		},
	],
});
router.beforeEach(async (to, from, next) => {
	if (!store.state.initialized) {
		// the store initialize will set initialized to true
		await store.dispatch("initialize");
	}
	// if user not logged in or the route is not public
	// if (!store.state.user && !to.meta.public) {
	if (!guardService.canAccess(to)) {
		next("/sign-in");
	} else {
		next();
	}
	next();
});

router.afterEach((to) => {
	Vue.nextTick(() => {
		document.title = to.name ?? "Eoffice";
	});
});

export default router;
