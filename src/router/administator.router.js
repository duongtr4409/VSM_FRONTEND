import ROLE from "@/common/ROLE";
const ListGroupRequestVue = () =>
	import("../views/modules/administrator/Request/ListGroupRequest.vue");
const ListTypeRequestVue = () =>
	import("../views/modules/administrator/Request/ListTypeRequest.vue");
const ListProcessStep = () =>
	import("../views/modules/administrator/ProcessStep/ListProcessStep.vue");
const ListDataFieldVue = () =>
	import("../views/modules/administrator/Form/ListDataField.vue");
const ListFormVue = () =>
	import("../views/modules/administrator/TemplateForm/ListForm.vue");
const RankManagementVue = () =>
	import(
		"../views/modules/administrator/DecentralizedManagement/RankManagement.vue"
	);
const RoleManagementVue = () =>
	import(
		"../views/modules/administrator/DecentralizedManagement/RoleManagement.vue"
	);
const ListProcess = () =>
	import("../views/modules/administrator/ProcessStep/ListProcess.vue");
const CreateProcess = () =>
	import("../views/modules/administrator/ProcessStep/CreateProcess.vue");
const CreateFormV2Vue = () =>
	import("../views/modules/administrator/Form/CreateFormV2.vue");
const ListUserInfo = () =>
	import("@/views/modules/administrator/UserInfo/ListUserInfo.vue");
const CreateRequestType = () =>
	import("@/views/modules/administrator/Request/CreateRequestType.vue");
const ListRequest = () =>
	import("@/views/modules/administrator/Request/ListRequest.vue");

const ViewProcessInfo = () =>
	import("@/views/modules/administrator/ProcessInfo/ViewProcessInfo");

const ViewRequest = () =>
	import("@/views/modules/administrator/Request/ViewRequest.vue");

// const ListOrganzation = () =>
// 	import(
// 		"@/views/modules/administrator/DecentralizedManagement/OrganizationsManagement"
// 	);
const QuanTriNhomloaiYeuCau = () =>
	import(
		"@/views/modules/administrator/QuanTriNhomLoaiYeuCau/QuanTriNhomLoaiYeucau"
	);
const administratorRoutes = [
	{
		path: "",
		name: "Trang quản lý",
		component: () =>
			import("../views/modules/administrator/Dashboard/DashboardEoffice"),
		meta: {
			requiresAuth: true,
			roles: [ROLE.ROLE_ADMINISTRATOR],
		},
	},
	{
		path: "theme-config",
		name: "Cài đặt giao diện",
		component: () =>
			import("../views/modules/administrator/ThemeConfig.vue"),
		meta: {
			requiresAuth: true,
			roles: [ROLE.ROLE_ADMINISTRATOR],
		},
	},

	{
		path: "report",
		name: "Thống kê",
		component: () =>
			import("../views/modules/administrator/Report/ReportView.vue"),
		meta: {
			requiresAuth: true,
			roles: [ROLE.ROLE_ADMINISTRATOR],
		},
	},
	{
		path: "danh-muc",
		name: "Quản lý danh mục",
		component: () =>
			import("../views/modules/administrator/Category/Category.vue"),
		meta: {
			requiresAuth: true,
			roles: [ROLE.ROLE_ADMINISTRATOR],
		},
		children: [
			{
				path: "",
				name: "Quản lý cây danh mục",
				component: () =>
					import(
						"../views/modules/administrator/Category/CategoryListV2.vue"
					),
				meta: {
					requiresAuth: true,
					roles: [ROLE.ROLE_ADMINISTRATOR],
				},
			},
			{
				path: ":id(\\d+)",
				name: "Chỉnh sửa danh mục",
				component: () =>
					import(
						"../views/modules/administrator/Category/EditCategory.vue"
					),
				meta: {
					requiresAuth: true,
					roles: [ROLE.ROLE_ADMINISTRATOR],
				},
			},
			{
				path: "tao-moi",
				name: "Tạo mới danh mục",
				component: () =>
					import(
						"../views/modules/administrator/Category/EditCategory.vue"
					),
				meta: {
					requiresAuth: true,
					roles: [ROLE.ROLE_ADMINISTRATOR],
				},
			},
		],
	},
	{
		path: "list-group-request",
		name: "Quản lý Nhóm yêu cầu",
		component: ListGroupRequestVue,
		meta: {
			requiresAuth: true,
			roles: [ROLE.ROLE_ADMINISTRATOR],
		},
	},
	{
		path: "list-types-request",
		name: "Quản lý danh mục loại yêu cầu",
		component: ListTypeRequestVue,
		meta: {
			requiresAuth: true,
			roles: [ROLE.ROLE_ADMINISTRATOR],
		},
	},
	{
		path: "list-processstep",
		name: "Quản lý Bước thực hiện",
		component: ListProcessStep,
		meta: {
			requiresAuth: true,
			roles: [ROLE.ROLE_ADMINISTRATOR],
		},
	},
	// {
	// 	path: "list-organization",
	// 	name: "Quản lý Đơn vị",
	// 	component: ListOrganzation,
	// 	meta: {
	// 		requiresAuth: true,
	// 		roles: [ROLE.ROLE_ADMINISTRATOR],
	// 	},
	// },
	{
		path: "list-datafield",
		name: "ListDataField",
		component: ListDataFieldVue,
		meta: {
			requiresAuth: true,
			roles: [ROLE.ROLE_ADMINISTRATOR],
		},
	},
	{
		path: "list-form",
		name: "Quản lý Biểu mẫu",
		component: ListFormVue,
		meta: {
			requiresAuth: true,
			roles: [ROLE.ROLE_ADMINISTRATOR],
		},
	},
	{
		path: "rank-management",
		name: "Quản lý Chức danh",
		component: RankManagementVue,
		meta: {
			requiresAuth: true,
			roles: [ROLE.ROLE_ADMINISTRATOR],
		},
	},
	{
		path: "role-management",
		name: "Quản lý Vai trò",
		component: RoleManagementVue,
		meta: {
			requiresAuth: true,
			roles: [ROLE.ROLE_ADMINISTRATOR],
		},
	},
	{
		path: "list-user-info",
		name: "Quản lý Người dùng",
		component: ListUserInfo,
		meta: {
			requiresAuth: true,
			roles: [ROLE.ROLE_ADMINISTRATOR],
		},
	},
	{
		path: "user-group",
		name: "Quản lý nhóm người dùng",
		component: () =>
			import("@/views/modules/administrator/UserGroup/UserGroup"),
		meta: {
			requiresAuth: true,
			roles: [ROLE.ROLE_ADMINISTRATOR],
		},
	},
	{
		path: "manage-cargo",
		name: "Quản trị hàng hóa dịch vụ",
		component: () =>
			import("../views/modules/administrator/ManageCargo/ListCargo.vue"),
		meta: {
			requiresAuth: true,
			roles: [ROLE.ROLE_ADMINISTRATOR],
		},
	},
	{
		path: "bussiness-partner",
		name: "Quản trị Business Partner",
		component: () =>
			import(
				"../views/modules/administrator/BussinessPartner/ListBusinessPartner.vue"
			),
		meta: {
			requiresAuth: true,
			roles: [ROLE.ROLE_ADMINISTRATOR],
		},
	},
	{
		path: "quan-tri-nhom-loai-yeu-cau",
		name: "Quản trị biểu mẫu",
		component: QuanTriNhomloaiYeuCau,
		meta: {
			requiresAuth: true,
			roles: [ROLE.ROLE_ADMINISTRATOR],
		},
	},
	{
		path: "quy-trinh",
		name: "Quản lý Quy trình",
		component: () =>
			import("../views/modules/administrator/ProcessInfo/ProcessInfo"),
		meta: {
			requiresAuth: true,
			roles: [ROLE.ROLE_ADMINISTRATOR],
		},
		children: [
			{
				path: "",
				name: "Quản lý Quy trình",
				component: ListProcess,
				meta: {
					requiresAuth: true,
					roles: [ROLE.ROLE_ADMINISTRATOR],
				},
			},
			{
				path: "tao-moi",
				name: "Tạo mới quy trình",
				component: CreateProcess,
				meta: {
					requiresAuth: true,
					roles: [ROLE.ROLE_ADMINISTRATOR],
				},
			},
			{
				path: "tao-moi-v2",
				name: "Tạo mới quy trình",
				component: () =>
					import(
						"@/views/modules/administrator/ProcessInfo/EditProcessInfo"
					),
				meta: {
					requiresAuth: true,
					roles: [ROLE.ROLE_ADMINISTRATOR],
				},
			},
			{
				path: ":id(\\d+)",
				name: "Chỉnh sửa quy trình",
				component: () =>
					import(
						"@/views/modules/administrator/ProcessInfo/EditProcessInfo"
					),
				meta: {
					requiresAuth: true,
					roles: [ROLE.ROLE_ADMINISTRATOR],
				},
			},
			{
				path: "view/:id(\\d+)",
				name: "Chi tiết Quy trình",
				component: ViewProcessInfo,
				meta: {
					requiresAuth: true,
					roles: [ROLE.ROLE_ADMINISTRATOR],
				},
			},
		],
	},
	{
		path: "list-form/create-v2/:id",
		name: "Chỉnh sửa loại yêu cầu",
		component: CreateFormV2Vue,
		meta: {
			requiresAuth: true,
			roles: [ROLE.ROLE_ADMINISTRATOR],
		},
	},
	{
		path: "list-form/create-v2",
		name: "Thêm mới loại yêu cầu",
		component: CreateFormV2Vue,
		meta: {
			requiresAuth: true,
			roles: [ROLE.ROLE_ADMINISTRATOR],
		},
	},
	{
		path: "create-request-type",
		name: "Thêm mới Loại yêu cầu",
		component: CreateRequestType,
		meta: {
			requiresAuth: true,
			roles: [ROLE.ROLE_ADMINISTRATOR],
		},
	},
	{
		path: "list-request",
		name: "Quản lý Loại yêu cầu",
		component: ListRequest,
		meta: {
			requiresAuth: true,
			roles: [ROLE.ROLE_ADMINISTRATOR],
		},
	},

	{
		path: "loai-yeu-cau",
		name: "Quản lý Loại yêu cầu",
		component: () =>
			import("@/views/modules/administrator/Request/Request"),
		meta: {
			requiresAuth: true,
			roles: [ROLE.ROLE_ADMINISTRATOR],
		},
		children: [
			{
				path: "",
				name: "Quản lý Loại yêu cầu",
				component: ListRequest,
				meta: {
					requiresAuth: true,
					roles: [ROLE.ROLE_ADMINISTRATOR],
				},
			},
			{
				path: ":id(\\d+)",
				name: "Chỉnh sửa loại yêu cầu",
				component: () =>
					import("@/views/modules/administrator/Request/EditRequest"),
				meta: {
					requiresAuth: true,
					roles: [ROLE.ROLE_ADMINISTRATOR],
				},
			},
			{
				path: ":id(\\d+)",
				name: "Chỉnh sửa phiếu yêu cầu",
				component: () =>
					import("@/views/modules/administrator/Request/EditRequest"),
				meta: {
					requiresAuth: true,
					roles: [ROLE.ROLE_ADMINISTRATOR],
				},
			},
			{
				path: "tao-moi",
				name: "Thêm mới loại yêu cầu",
				component: () =>
					import("@/views/modules/administrator/Request/EditRequest"),
				meta: {
					requiresAuth: true,
					roles: [ROLE.ROLE_ADMINISTRATOR],
				},
			},
			{
				path: "tao-moiV2",
				name: "Thêm mới loại yêu cầu",
				component: () =>
					import("@/views/modules/administrator/Request/EditRequest"),
				meta: {
					requiresAuth: true,
					roles: [ROLE.ROLE_ADMINISTRATOR],
				},
			},
			{
				path: "view/:id",
				name: "Xem chi tiết loại yêu cầu",
				component: ViewRequest,
				meta: {
					requiresAuth: true,
					roles: [ROLE.ROLE_ADMINISTRATOR],
				},
			},
		],
	},
	{
		path: "file-manager",
		name: "Quản lý lưu trữ",
		component: () =>
			import("@/views/modules/administrator/FileManager/FileManager"),
		meta: {
			requiresAuth: true,
			roles: [ROLE.ROLE_ADMINISTRATOR],
		},
	},
];

export default administratorRoutes;
