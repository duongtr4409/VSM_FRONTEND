<template>
	<v-card elevation="0">
		<v-row class="mt-4 px-4">
			<v-col>
				<v-btn
					color="blue darken-1"
					dark
					class="m-2 rounded float-right"
					@click="save()"
				>
					<v-icon> mdi-content-save </v-icon>
					{{ $t("button.save") }}
				</v-btn>
			</v-col>
		</v-row>
		<v-row>
			<v-col v-for="field in fields" :key="field.id" cols="12" md="4">
				<v-combobox
					v-if="field.items"
					v-model="model[field.id]"
					:items="field.items"
					:label="field.name"
					item-value="value.value"
					item-text="name"
					dense
					outlined
				></v-combobox>
				<v-combobox
					v-else
					v-model="model[field.id]"
					:items="formFields"
					:label="field.name"
					item-value="value.value"
					item-text="name"
					dense
					outlined
				></v-combobox>
			</v-col>
		</v-row>
	</v-card>
</template>

<script>
import store from "@/store";
import globalService from "@/services/global.service";
import RequestDto from "@/models/request.dto";

export default {
	name: "CauHinhSharp",
	props: {
		form: {},
		requestDto: {},
	},
	computed: {},
	watch: {
		requestDto(value) {
			this.m_requestDto = value;
			try {
				this.model = JSON.parse(value?.sapMapping);
				if (!this.model || this.model == null) {
					this.model = {};
				}
			} catch (error) {
				console.log(error);
			}
		},
		form(value) {
			console.log(value);
			this.getFields();
		},
	},
	data() {
		return {
			m_requestDto: RequestDto,
			tabs: [{ key: "information", title: this.$t("label.information") }],
			buttons: [
				{
					icon: "mdi-content-save",
					title: this.$t("button.save"),
					color: "blue darken-2",
					transparent: false,
					dark: true,
					event: this.save,
				},
			],
			formFields: [],
			fields: [
				{
					id: "comp_code_ext",
					name: this.$t("label.comp_code_ext"),
				},
				{
					id: "contract_type",
					name: this.$t("label.contract_type"),
					// items: [
					// 	{ value: "A010", name: "HĐ cho thuê QC ATL/BTL" },
					// 	{ value: "A020", name: "HĐ tài trợ ATL/BTL" },
					// 	{
					// 		value: "A030",
					// 		name: "HD chia sẻ DT cước Viễn Thông",
					// 	},
					// 	{ value: "AS01", name: "Assessment Contract" },
					// 	{ value: "CM01", name: "Condo. Management Contract" },
					// 	{ value: "CO01", name: "Commercial lease-out" },
					// 	{ value: "CO02", name: "Residential Lease-Out" },
					// 	{ value: "CO03", name: "Service Contract (Customer)" },
					// 	{ value: "CO04", name: "Internal Lease-Out" },
					// 	{ value: "CO09", name: "ATL/BTL lease-out" },
					// 	{ value: "CU01", name: "Commercial Lease-In" },
					// 	{ value: "CU02", name: "Residential Lease-In" },
					// 	{ value: "CU03", name: "Service Contract (Vendor)" },
					// 	{ value: "CU04", name: "Internal Lease-In" },
					// 	{ value: "CX01", name: "G/L Account Contract" },
					// 	{
					// 		value: "DO01",
					// 		name: "Secur.Deposit Lease-Out Comm.",
					// 	},
					// 	{ value: "DO02", name: "Secur.Deposit Lease-Out Res." },
					// 	{
					// 		value: "H010",
					// 		name: "HĐ hầm gửi xe và dịch vụ khác",
					// 	},
					// 	{ value: "H020", name: "HĐ dịch vụ vận hành" },
					// 	{ value: "S010", name: "HĐ cho thuê GH dài hạn" },
					// 	{ value: "S020", name: "HĐ cho thuê GH thông thường" },
					// 	{ value: "S030", name: "HĐ cho thuê GH theo CPI" },
					// 	{ value: "S040", name: "HĐ cho thuê GH bậc thang" },
					// 	{ value: "S050", name: "HĐ cho thuê GH biến đổi năm" },
					// 	{
					// 		value: "S060",
					// 		name: "HĐ cho thuê chia sẻ doanh thu",
					// 	},
					// 	{
					// 		value: "S070",
					// 		name: "HĐ chia sẻ doanh thu theo CPI",
					// 	},
					// 	{ value: "S080", name: "HĐ dịch vụ gửi xe tháng" },
					// 	{ value: "S100", name: "HĐ đặt cọc" },
					// 	{ value: "T010", name: "Tự doanh - Outlet" },
					// 	{ value: "V010", name: "HĐ cho thuê VP dài hạn" },
					// 	{ value: "V020", name: "HĐ cho thuê VP ngắn hạn" },
					// 	{ value: "V100", name: "HĐ đặt cọc - văn phòng" },
					// ],
				},
				{
					id: "tenancy_law",
					name: this.$t("label.tenancy_law"),
					items: [
						{ value: "1", name: "Vietnam Tenancy Law" },
						{ value: "2", name: "Hợp đồng thuê mới" },
						{ value: "3", name: "Hợp đồng thuê gia hạn" },
						{ value: "4", name: "Hợp đồng đổi pháp nhân" },
						{ value: "5", name: "Hợp đồng thay đổi khác" },
						{ value: "6", name: "Hợp đồng chuyển đổi sáp nhập" },
						{ value: "7", name: "Hợp đồng dịch chuyển" },
					],
				},
				{
					id: "pos_code",
					name: this.$t("label.pos_code"),
				},
				{
					id: "contract_name",
					name: this.$t("label.contract_name"),
				},
				{
					id: "bct_code",
					name: this.$t("label.bct_code"),
				},
				{
					id: "bp_role",
					name: this.$t("label.bp_role"),
					items: [
						{ value: "REBP01", name: "Chuyên viên KD/Employee" },
						{ value: "REBP02", name: "CV Chăm sóc khách hàng" },
						{ value: "REBP03", name: "BP in hóa đơn" },
						{ value: "REBP04", name: "Chủ sở hữu/Owner" },
						{ value: "REBP05", name: "Nhà đầu tư/Investor" },
						{ value: "REBP06", name: "Khách lớn/Big Tenant" },
						{ value: "REBP07", name: "Khách thuê ngoài" },
						{ value: "REBP08", name: "Kthuê Nbộ/Internal BP" },
						{ value: "REBP09", name: "Khách hàng tiềm năng" },
						{ value: "REBP10", name: "Đại diện ký HĐ" },
						{ value: "REBP11", name: "Đại diện liên lạc" },
						{ value: "REBP12", name: "Nhà CC trong nước" },
						{ value: "REBP13", name: "Nhà CC nước ngoài" },
						{ value: "REBP14", name: "NCC nội bộ" },
						{ value: "REBP30", name: "Ngân hàng bảo lãnh" },
						{ value: "REBP31", name: "GĐ Kinh doanh" },
						{ value: "REBP32", name: "Hỗ trợ kinh doanh" },
					],
				},
				{
					id: "customer_code",
					name: this.$t("label.customer_code"),
				},
				{
					id: "sign_date",
					name: this.$t("label.sign_date"),
				},
				{
					id: "measure_type",
					name: this.$t("label.measure_type"),
					// items: [
					// 	{ value: "B001", name: "tổng diện tích mặt sàn TTTM" },
					// 	{ value: "B002", name: "Diện tích trông giữ xe" },
					// 	{ value: "B003", name: "tổng diện tích mặt sàn VP" },
					// 	{ value: "M005", name: "Số lượng điểm đỗ xe" },
					// 	{ value: "M020", name: "Share of Garden" },
					// 	{ value: "T001", name: "Tổng diện tích TTTM" },
					// 	{ value: "T002", name: "DT có thể cho thuê th/xuyên" },
					// 	{ value: "T003", name: "DT khu vực công cộng" },
					// 	{ value: "T004", name: "DT WC" },
					// 	{
					// 		value: "T005",
					// 		name: "Diện tích hầm gửi xe tổng thể",
					// 	},
					// 	{ value: "T006", name: "Tổng DT khu vực hành lang" },
					// 	{ value: "T007", name: "Tổng diện tích mỗi tầng hầm" },
					// 	{ value: "T008", name: "Tổng diện tích mỗi tầng đế" },
					// 	{ value: "T100", name: "DT cho thuê ngắn hạn" },
					// 	{ value: "T101", name: "S Vị trí QC (Không chiếm S)" },
					// 	{ value: "TYGG", name: "Tỷ Giá Gốc" },
					// 	{ value: "X001", name: "Số lượng xe đạp" },
					// 	{ value: "X002", name: "Số lượng xe máy" },
					// 	{ value: "X003", name: "Số lượng ô tô" },
					// 	{ value: "Y001", name: "Diện tích thuê chính bản vẽ" },
					// 	{ value: "Y002", name: "Diện tích gian hàng bàn giao" },
					// 	{ value: "Y003", name: "Diện tích thuê chính thực tế" },
					// 	{ value: "Y004", name: "Diện tích phụ và kho thực tế" },
					// 	{ value: "Y005", name: "Diện tích phụ và kho thực tế" },
					// 	{ value: "Y006", name: "Diện tích văn phòng bản vẽ" },
					// 	{ value: "Y007", name: "Diện tích văn phòng bàn giao" },
					// 	{ value: "Y008", name: "Diện tích văn phòng thực tế" },
					// 	{ value: "Y009", name: "Diện tích thuê phụ thực tế" },
					// 	{ value: "Y010", name: "DT thuê ngoài trời thực tế" },
					// 	{ value: "Y011", name: "DT cho thuê hành lang" },
					// 	{ value: "Y012", name: "Diện tích bãi đỗ xe" },
					// 	{ value: "Y013", name: "DT thuê khác" },
					// 	{
					// 		value: "Y014",
					// 		name: "Diện tích cho thuê mặt bằng #",
					// 	},
					// 	{
					// 		value: "Y015",
					// 		name: "Diện tích thuê quản lý thực tế",
					// 	},
					// 	{ value: "Y101", name: "Diện tích phụ và kho bản vẽ" },
					// 	{ value: "Y102", name: "DT kho trần thấp - BBBG" },
					// 	{ value: "Y103", name: "DT kho trần cao - bản vẽ" },
					// 	{ value: "Y104", name: "DT kho trần cao - BBBG" },
					// 	{ value: "Y105", name: "DT thuê ngoài trời bản vẽ" },
					// 	{ value: "Y106", name: "DT thuê ngoài trời BBBG" },
					// 	{
					// 		value: "Y107",
					// 		name: "Diện tích thuê quản lý bản vẽ",
					// 	},
					// 	{ value: "Y108", name: "Diện tích thuê phụ BBBG" },
					// 	{ value: "Y109", name: "Diện tích dịch vụ vận hành" },
					// 	{ value: "Z001", name: "DT cho thuê Quảng cáo" },
					// 	{ value: "Z002", name: "Chiều dài bảng biển" },
					// 	{ value: "Z003", name: "Chiều rộng bảng biển" },
					// 	{ value: "Z004", name: "Vị trí cho thuê QC & khác" },
					// 	{ value: "Z005", name: "Địa điểm quảng cáo" },
					// 	{ value: "Z006", name: "Số lượng Block chiếu QC" },
					// 	{ value: "Z010", name: "Số lượng thùng rác lớn" },
					// 	{ value: "Z011", name: "Số lượng thùng rác nhỏ" },
					// ],
				},
				{
					id: "square",
					name: this.$t("label.square"),
				},
				{
					id: "purpose",
					name: this.$t("label.purpose"),
					items: [
						{ value: "1", name: "Fast Fashion" },
						{ value: "2", name: "Department Store" },
						{ value: "3", name: "Thời trang công sở nam" },
						{ value: "4", name: "Thời trang công sở nữ" },
						{ value: "5", name: "Thời trang công sở nam/nữ" },
						{ value: "6", name: "Thời trang casual nam" },
						{ value: "7", name: "Thời trang casual nữ" },
						{ value: "8", name: "Thời trang casual nam/nữ" },
						{ value: "9", name: "Thời trang thể thao" },
						{ value: "10", name: "Thời trang đồ Jeans" },
						{
							value: "11",
							name: "Thời trang áo cưới/dạ hội/áo dài/nhà may",
						},
						{ value: "12", name: "Thời trang nhà thiết kế VN" },
						{ value: "13", name: "Phụ kiện Vali/túi xách" },
						{ value: "14", name: "Giày dép" },
						{
							value: "15",
							name: "Trang phụ lót/áo tắm/đồ mặc nhà",
						},
						{ value: "16", name: "Đồng hồ/Kính mắt/Bút" },
						{ value: "17", name: "Trang sức/Nữ trang" },
						{ value: "18", name: "Phụ kiện kẹp tóc/khăn/mũ…" },
						{ value: "19", name: "Mỹ phẩm (Make up/Skincare)" },
						{ value: "20", name: "Hóa mỹ phẩm" },
						{ value: "21", name: "Dược mỹ phẩm" },
						{ value: "22", name: "Nước hoa" },
						{
							value: "23",
							name: "Thực phẩm chức năng/Sản phẩm chăm sóc sức khỏe và sắc đẹp/Tinh dầu",
						},
						{ value: "24", name: "Fast Food" },
						{ value: "25", name: "Foodcourt" },
						{
							value: "26",
							name: "Nhà hàng Á (Trung Quốc, Nhật, Hàn Quốc, Thái Lan, Singapore, Hồng Kong, Đài Loan, Ấn Độ, Malaysia…)",
						},
						{ value: "27", name: "Nhà hàng Âu (Ý, Nga, Pháp,..)" },
						{ value: "28", name: "Nhà hàng Việt Nam" },
						{ value: "29", name: "Nhà hàng nướng/lẩu" },
						{ value: "30", name: "Nhà hàng hải sản" },
						{ value: "31", name: "Cà phê/Trà" },
						{
							value: "32",
							name: "Đồ dessert (sinh tố, kem, bánh ngọt, tào phớ, trà sữa, bingsu…)",
						},
						{ value: "33", name: "Bakery" },
						{ value: "34", name: "Rạp chiếu phim" },
						{ value: "35", name: "Game tổng hợp" },
						{ value: "36", name: "Game bowling" },
						{ value: "37", name: "Kid zone" },
						{ value: "38", name: "Video Game" },
						{ value: "39", name: "Game thực tế ảo" },
						{ value: "40", name: "Game vận động/tương tác" },
						{ value: "41", name: "Chăn ga gối đệm" },
						{ value: "42", name: "Đồ bếp/Đồ gia dụng" },
						{
							value: "43",
							name: "Thiết bị chăm sóc sức khỏe và phụ kiện",
						},
						{ value: "44", name: "Nội thất/Đồ xây dựng" },
						{ value: "45", name: "Trang trí nội thất" },
						{ value: "46", name: "Siêu thị nội thất" },
						{ value: "47", name: "Siêu thị điện máy" },
						{ value: "48", name: "Điện thoại/công nghệ/máy tính" },
						{
							value: "49",
							name: "Nhạc cụ/Thiết bị nghe nhìn/âm thanh",
						},
						{ value: "50", name: "Gym" },
						{ value: "51", name: "Siêu thị tiêu dùng" },
						{ value: "52", name: "Cửa hàng tiện ích" },
						{
							value: "53",
							name: "Trung tâm giáo dục (ngoại ngữ, đào tạo nghề, kĩ năng,..)",
						},
						{ value: "54", name: "Salon/Spa/Massage/Trị liệu" },
						{ value: "55", name: "Giặt là" },
						{ value: "56", name: "Ngân hàng" },
						{ value: "57", name: "Nhà thuốc" },
						{
							value: "58",
							name: "Phòng khám (nha khoa, mắt, tổng hợp,..)",
						},
						{
							value: "59",
							name: "Triển lãm nghệ thuật (phòng tranh,..)",
						},
						{ value: "60", name: "Văn phòng cho thuê" },
						{ value: "61", name: "Nhà sách, VPP, quà tặng" },
						{ value: "62", name: "Mẹ và bé" },
						{ value: "63", name: "Showroom/ lounge" },
						{ value: "64", name: "Xưởng dịch vụ" },
					],
				},
				{
					id: "name_of_office",
					name: this.$t("label.name_of_office"),
				},
				{
					id: "valid_from",
					name: this.$t("label.valid_from"),
				},
				{
					id: "valid_to",
					name: this.$t("label.valid_to"),
				},
				{
					id: "cash_flow_from",
					name: this.$t("label.cash_flow_from"),
				},
				{
					id: "end_of_term",
					name: this.$t("label.end_of_term"),
				},
				{
					id: "construction",
					name: this.$t("label.construction"),
				},
				{
					id: "construction_price",
					name: this.$t("label.construction_price"),
				},
				{
					id: "service",
					name: this.$t("label.service"),
					items: [
						{ value: "V001", name: "Tiền Thuê TTTM" },
						{ value: "V002", name: "Thuê kho trần thấp" },
						{ value: "V003", name: "Thuê kho trần cao" },
						{ value: "V004", name: "Tiền dvụ quảnlý TTTM" },
						{ value: "V005", name: "Thuê Mặt bằng khác" },
						{ value: "V006", name: "Phí quản lý/KhoTT" },
						{ value: "V007", name: "Phí quản lý/KhoTC" },
						{ value: "V008", name: "Phí quản lý/DT phụ" },
						{ value: "V009", name: "Phí gia tăng" },
						{ value: "V010", name: "Phụ phí khác" },
						{ value: "V011", name: "Phí gia tăng/DT phụ" },
						{ value: "V012", name: "Tiền d/vụ quản lý VP" },
						{ value: "V013", name: "Tiền dvụ qlý SH/SO" },
						{ value: "V014", name: "DT DV gia tăng / VS" },
						{ value: "V015", name: "Chi phí thu gom rác" },
						{ value: "V016", name: "Phí đèn chiếu (SW)" },
						{ value: "V018", name: "Phí q.ý TTTM đã bán" },
						{ value: "V019", name: "Tiền thuê – CSDT" },
						{ value: "V020", name: "Tiền thuê – CSDT min" },
						{ value: "V021", name: "Lệ phí thi công/TTế" },
						{ value: "V022", name: "Tiền thuê ký quỹ" },
						{ value: "V023", name: "Cọc thuê" },
						{ value: "V024", name: "Cọc thi công" },
						{ value: "V025", name: "Cọc b.giao mặt bằng" },
						{ value: "V026", name: "Tiền thuê Quảng Cáo" },
						{ value: "V027", name: "Phí quạt điện HK" },
						{ value: "V028", name: "Phí dịch vụ điều hòa" },
						{ value: "V029", name: "Phí marketing – CSDT" },
						{ value: "V030", name: "Tiền thuê – CSDT max" },
						{ value: "V031", name: "Phí dịchvụ khác CSDT" },
						{ value: "V032", name: "Phí dịch vụ DT thuê" },
						{ value: "V039", name: "Tiền thuê – CSDT VT" },
						{ value: "V040", name: "DVVH Kỹ thuật" },
						{ value: "V041", name: "DVVH Vệ sinh" },
						{ value: "V042", name: "DVVH Cây xanh" },
						{ value: "V043", name: "DV Kỹ thuật gia tăng" },
						{ value: "V044", name: "DV Vệ sinh gia tăng" },
						{ value: "V045", name: "DV Cây xanh gia tăng" },
						{ value: "V046", name: "Gửi xe tháng - ô tô" },
						{ value: "V051", name: "Phí q.ý VP đã bán" },
						{ value: "V052", name: "Gửi xe - xe máy" },
						{ value: "V054", name: "Gửi xe - xe đạp" },
						{ value: "V055", name: "Gủi xe - xe đạp điện" },
						{ value: "V060", name: "Thuê S ngoài trời" },
						{ value: "V061", name: "Thuê S hành lang" },
						{ value: "V062", name: "Thuê S phụ" },
						{ value: "V063", name: "Tiền thuê Văn phòng" },
						{ value: "V064", name: "Thuê hầm kỹ thuật" },
					],
				},
				{
					id: "service_pricing",
					name: this.$t("label.service_pricing"),
				},
				{
					id: "condition_type",
					name: this.$t("label.condition_type"),
					// items: [
					// 	{ value: "V001", name: "Tiền Thuê TTTM" },
					// 	{ value: "V002", name: "Thuê kho trần thấp" },
					// 	{ value: "V003", name: "Thuê kho trần cao" },
					// 	{ value: "V004", name: "Tiền dvụ quảnlý TTTM" },
					// 	{ value: "V005", name: "Thuê Mặt bằng khác" },
					// 	{ value: "V006", name: "Phí quản lý/KhoTT" },
					// 	{ value: "V007", name: "Phí quản lý/KhoTC" },
					// 	{ value: "V008", name: "Phí quản lý/DT phụ" },
					// 	{ value: "V009", name: "Phí gia tăng" },
					// 	{ value: "V010", name: "Phụ phí khác" },
					// 	{ value: "V011", name: "Phí gia tăng/DT phụ" },
					// 	{ value: "V012", name: "Tiền d/vụ quản lý VP" },
					// 	{ value: "V013", name: "Tiền dvụ qlý SH/SO" },
					// 	{ value: "V014", name: "DT DV gia tăng / VS" },
					// 	{ value: "V015", name: "Chi phí thu gom rác" },
					// 	{ value: "V016", name: "Phí đèn chiếu (SW)" },
					// 	{ value: "V018", name: "Phí q.ý TTTM đã bán" },
					// 	{ value: "V019", name: "Tiền thuê – CSDT" },
					// 	{ value: "V020", name: "Tiền thuê – CSDT min" },
					// 	{ value: "V021", name: "Lệ phí thi công/TTế" },
					// 	{ value: "V022", name: "Tiền thuê ký quỹ" },
					// 	{ value: "V023", name: "Cọc thuê" },
					// 	{ value: "V024", name: "Cọc thi công" },
					// 	{ value: "V025", name: "Cọc b.giao mặt bằng" },
					// 	{ value: "V026", name: "Tiền thuê Quảng Cáo" },
					// 	{ value: "V027", name: "Phí quạt điện HK" },
					// 	{ value: "V028", name: "Phí dịch vụ điều hòa" },
					// 	{ value: "V029", name: "Phí marketing – CSDT" },
					// 	{ value: "V030", name: "Tiền thuê – CSDT max" },
					// 	{ value: "V031", name: "Phí dịchvụ khác CSDT" },
					// 	{ value: "V032", name: "Phí dịch vụ DT thuê" },
					// 	{ value: "V039", name: "Tiền thuê – CSDT VT" },
					// 	{ value: "V040", name: "DVVH Kỹ thuật" },
					// 	{ value: "V041", name: "DVVH Vệ sinh" },
					// 	{ value: "V042", name: "DVVH Cây xanh" },
					// 	{ value: "V043", name: "DV Kỹ thuật gia tăng" },
					// 	{ value: "V044", name: "DV Vệ sinh gia tăng" },
					// 	{ value: "V045", name: "DV Cây xanh gia tăng" },
					// 	{ value: "V046", name: "Gửi xe tháng - ô tô" },
					// 	{ value: "V051", name: "Phí q.ý VP đã bán" },
					// 	{ value: "V052", name: "Gửi xe - xe máy" },
					// 	{ value: "V054", name: "Gửi xe - xe đạp" },
					// 	{ value: "V055", name: "Gủi xe - xe đạp điện" },
					// 	{ value: "V060", name: "Thuê S ngoài trời" },
					// 	{ value: "V061", name: "Thuê S hành lang" },
					// 	{ value: "V062", name: "Thuê S phụ" },
					// 	{ value: "V063", name: "Tiền thuê Văn phòng" },
					// 	{ value: "V064", name: "Thuê hầm kỹ thuật" },
					// ],
				},
				{
					id: "condition_amount",
					name: this.$t("label.condition_amount"),
				},
				{
					id: "price_per_month",
					name: this.$t("label.price_per_month"),
				},
				{
					id: "v019_condition_type",
					name: this.$t("label.v019_condition_type"),
					items: [{ value: "V019", name: "Tiền thuê – CSDT" }],
				},
				{
					id: "v019_external_purpose",
					name: this.$t("label.v019_external_purpose"),
					items: [{ value: "A", name: "A" }],
				},
				{
					id: "v020_condition_type",
					name: this.$t("label.v020_condition_type"),
					items: [{ value: "V020", name: "Tiền thuê – CSDT min" }],
				},
				{
					id: "v020_external_purpose",
					name: this.$t("label.v020_external_purpose"),
					items: [{ value: "A", name: "A" }],
				},
				{
					id: "v020_unit_price",
					name: this.$t("label.v020_unit_price"),
				},
				{
					id: "v020_valid_from",
					name: this.$t("label.v020_valid_from"),
				},
				{
					id: "v020_valid_to",
					name: this.$t("label.v020_valid_to"),
				},
				{
					id: "sales_type",
					name: this.$t("label.sales_type"),
					items: [{ value: "S100", name: "HĐ đặt cọc" }],
				},
				{
					id: "frequency",
					name: this.$t("label.frequency"),
				},
				{
					id: "sales_rule_type",
					name: this.$t("label.sales_rule_type"),
					items: [{ value: "S001", name: "S001" }],
				},
				{
					id: "perc_sales_as_rent",
					name: this.$t("label.perc_sales_as_rent"),
				},
				{
					id: "s100_condition_type",
					name: this.$t("label.s100_condition_type"),
					items: [{ value: "V023", name: "Cọc thuê" }],
				},
				{
					id: "s100_unit_price",
					name: this.$t("label.s100_unit_price"),
				},
				{
					id: "tygg_value",
					name: this.$t("label.ty_gia"),
				},
				{
					id: "customer_code_01",
					name: this.$t("label.maso_nhanvien"),
				},
				{
					id: "bp_role_01",
					name: this.$t("label.machucvu_nhanvien"),
				},
				{
					id: "customer_code_31",
					name: this.$t("label.msnv_cbql"),
				},
				{
					id: "bp_role_31",
					name: this.$t("label.machucvu_cbql"),
				},
				{
					id: "customer_code_32",
					name: this.$t("label.msnv_key"),
				},
				{
					id: "bp_role_32",
					name: this.$t("label.machucvu_key"),
				},
				{
					id: "measure_tygg",
					name: this.$t("label.ty_gia_goc"),
				},
			],
			model: {},
		};
	},
	created() {
		store.state.loading = true;
		this.m_requestDto = this.requestDto;
	},
	mounted() {
		this.initialize();
		store.state.loading = false;
	},
	methods: {
		initialize() {
			this.getFields();
			try {
				this.model = JSON.parse(this.requestDto?.sapMapping || {});
				if (!this.model || this.model == null) {
					this.model = {};
				}
			} catch (error) {
				console.log(error);
			}
		},
		async save() {
			this.m_requestDto.sapMapping = JSON.stringify(this.model);
			try {
				let response = await globalService.putData_Async(
					"/api/requests/" + this.m_requestDto.id,
					this.m_requestDto,
				);
				if (response) {
					this.toastSuccess(this.$t("message.save_success"));
				}
				if (!response.state) {
					this.toastError(response.messgage);
					return false;
				}
				this.m_requestDto = response.data;
			} catch (error) {
				this.toastError(error);
			}
		},
		getFields() {
			let objectSchema = JSON.parse(this.form.objectSchema);
			if (objectSchema.length > 0) {
				for (let i = 0; i < objectSchema.length; i++) {
					for (let j = 0; j < objectSchema[i].elements.length; j++) {
						this.formFields.push({
							value: `${objectSchema[i].elements[j].field.configModel?.id}`,
							name: objectSchema[i].elements[j].field.configModel
								?.title,
						});
					}
				}
			}
		},
	},
};
</script>

<style></style>
