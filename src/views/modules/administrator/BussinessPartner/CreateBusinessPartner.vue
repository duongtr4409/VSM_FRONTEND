<template>
	<v-card flat elevation="0" class="overflow-y-hidden">
		<v-toolbar flat color="grey lighten-4">
			<v-toolbar-title> Thông tin</v-toolbar-title>
			<v-spacer></v-spacer>
			<v-btn icon @click="close">
				<v-icon>mdi-close</v-icon>
			</v-btn>
		</v-toolbar>
		<v-row class="mt-4 px-4">
			<v-col cols="12" md="6">
				<v-text-field
					:label="$t('cargo_valid.fullName')"
					ref="fullName"
					v-model="businessPartner.name"
					outlined
					hide-details
					dense
					maxLength="250"
				>
					<template v-slot:label>
						{{ $t("cargo_valid.fullName") }}
						<span class="text-red-600">
							{{ $t("label.star") }}
						</span>
					</template>
				</v-text-field>
			</v-col>
			<v-col cols="12" md="6">
				<v-text-field
					:label="$t('cargo_valid.description')"
					ref="description"
					v-model="businessPartner.description"
					outlined
					hide-details
					dense
					maxLength="250"
				/>
			</v-col>
		</v-row>
		<v-row class="mt-4 px-4">
			<v-col cols="12" md="6">
				<v-text-field
					:label="$t('business_parner.tenChuoi')"
					ref="fullName"
					v-model="businessPartner.tenChuoi"
					outlined
					hide-details
					dense
					maxLength="250"
				>
				</v-text-field>
			</v-col>
			<v-col cols="12" md="6">
				<v-text-field
					:label="$t('business_parner.street')"
					v-model="businessPartner.street"
					outlined
					hide-details
					dense
					maxLength="250"
				/>
			</v-col>
		</v-row>
		<!-- <v-row class="mt-4 px-4">
			<v-col cols="12" md="6">
				<v-text-field
					:label="$t('cargo_valid.cBLDPnLPheDuyet')"
					ref="cBLDPnLPheDuyet"
					v-model="businessPartner.cBLDPnLPheDuyet"
					outlined
					hide-details
					dense
				/>
			</v-col>
			<v-col cols="12" md="3">
				<v-text-field
					:label="$t('cargo_valid.dVTSAP')"
					ref="dVTSAP"
					v-model="businessPartner.dVTSAP"
					outlined
					hide-details
					dense
				/>
			</v-col>
			<v-col cols="12" md="3">
				<v-text-field
					:label="$t('cargo_valid.bangSo')"
					ref="bangSo"
					v-model="businessPartner.bangSo"
					outlined
					hide-details
					dense
				/>
			</v-col>
		</v-row>
		<v-row class="mt-4 px-4">
			<v-col cols="12" md="3">
				<v-text-field
					:label="$t('cargo_valid.level1')"
					ref="level1"
					v-model="businessPartner.level1"
					outlined
					hide-details
					dense
				/>
			</v-col>
			<v-col cols="12" md="3">
				<v-text-field
					:label="$t('cargo_valid.level2')"
					ref="level2"
					v-model="businessPartner.level2"
					outlined
					hide-details
					dense
				/>
			</v-col>
			<v-col cols="12" md="3">
				<v-text-field
					:label="$t('cargo_valid.level3')"
					ref="level3"
					v-model="businessPartner.level3"
					outlined
					hide-details
					dense
				/>
			</v-col>
			<v-col cols="12" md="3">
				<v-text-field
					:label="$t('cargo_valid.level4')"
					ref="level4"
					v-model="businessPartner.level4"
					outlined
					hide-details
					dense
				/>
			</v-col>
		</v-row>
		<v-row class="mt-4 px-4">
			<v-col cols="12" md="3">
				<v-text-field
					:label="$t('cargo_valid.tenNhomLevel1')"
					ref="tenNhomLevel1"
					v-model="businessPartner.tenNhomLevel1"
					outlined
					hide-details
					dense
				/>
			</v-col>
			<v-col cols="12" md="3">
				<v-text-field
					:label="$t('cargo_valid.tenNhomLevel2')"
					ref="tenNhomLevel2"
					v-model="businessPartner.tenNhomLevel2"
					outlined
					hide-details
					dense
				/>
			</v-col>
			<v-col cols="12" md="3">
				<v-text-field
					:label="$t('cargo_valid.tenNhomLevel3')"
					ref="tenNhomLevel3"
					v-model="businessPartner.tenNhomLevel3"
					outlined
					hide-details
					dense
				/>
			</v-col>
			<v-col cols="12" md="3">
				<v-text-field
					:label="$t('cargo_valid.tenNhomLevel4')"
					ref="tenNhomLevel4"
					v-model="businessPartner.tenNhomLevel4"
					outlined
					hide-details
					dense
				/>
			</v-col>
		</v-row>
		<v-row class="mt-4 px-4">
			<v-col cols="12">
				<v-text-field
					:label="$t('cargo_valid.pLSuDung')"
					ref="pLSuDung"
					v-model="businessPartner.pLSuDung"
					outlined
					hide-details
					dense
				/>
			</v-col>
		</v-row>
		<v-row class="mt-4 px-4">
			<v-col cols="12">
				<v-text-field
					:label="$t('cargo_valid.ghiChuKhac')"
					ref="ghiChuKhac"
					v-model="businessPartner.ghiChuKhac"
					outlined
					hide-details
					dense
				/>
			</v-col>
			<v-col cols="12" md="4">
				<v-text-field
					:label="$t('cargo_valid.maChungPnL')"
					ref="maChungPnL"
					v-model="businessPartner.maChungPnL"
					outlined
					hide-details
					dense
				/>
			</v-col>
			<v-col cols="12" md="4">
				<v-text-field
					:label="$t('cargo_valid.noteKhoaMa')"
					ref="noteKhoaMa"
					v-model="businessPartner.noteKhoaMa"
					outlined
					hide-details
					dense
				/>
			</v-col>
			<v-col cols="12" md="4">
				<v-text-field
					:label="$t('cargo_valid.pICYeuCauTaoMa')"
					ref="pICYeuCauTaoMa"
					v-model="businessPartner.pICYeuCauTaoMa"
					outlined
					hide-details
					dense
				/>
			</v-col>
		</v-row> -->
		<v-col cols="12">
			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn
					elevation="0"
					dark
					@click="save"
					class="blue darkken-2 rounded-0"
				>
					{{ $t("button.ok") }}
				</v-btn>
				<v-btn
					elevation="0"
					@click="close"
					class="grey lighten-2 rounded-0"
				>
					{{ $t("button.cancel") }}
				</v-btn>
			</v-card-actions>
		</v-col>
	</v-card>
</template>

<script>
import BusinessPartnerDTO from "@/models/business-partner.dto";
import globalService from "@/services/global.service";
import administratorAPI from "../administrator.api";

export default {
	name: "CreateBusinessPartner",

	props: {},

	data() {
		return {
			businessPartner: BusinessPartnerDTO,
			id: null,
			isLoad_: null,
			user_current: this.getUserInfo(),
		};
	},
	watch: {
		// business(val) {
		// 	if (val) {
		// 		this.businessPartner = val;
		// 	} else {
		// 		this.businessPartner = Object.assign({}, BusinessPartnerDTO);
		// 	}
		// },
	},
	created() {
		// this.businessPartner = this.business;
		// console.log("this.businessPartner 1995",this.businessPartner)
	},

	mounted() {},

	methods: {
		close() {
			this.clearData();
			this.businessPartner = Object.assign({}, BusinessPartnerDTO);
			this.$emit("close", false);
		},
		async save() {
			let response;
			try {
				if (this.businessPartner.name?.trim().length == 0) {
					return this.toastError(this.$t("cargo_valid.fullNamenull"));
				}
				this.businessPartner.name = this.businessPartner.name.trim();
				this.businessPartner.description =
					this.businessPartner.description.trim();
				this.businessPartner.tenChuoi =
					this.businessPartner.tenChuoi.trim();
				this.businessPartner.street =
					this.businessPartner.street.trim();
				this.businessPartner.modifiedName = this.user_current.fullName;
				response = await globalService.postData_Async(
					administratorAPI.API_CreateBusinessParner(),
					this.businessPartner,
				);
				if (!response) {
					return this.toastError(this.$t("message.add_error"));
				}
				this.toastSuccess(this.$t("message.add_success"));
				this.clearData();
				this.close();
			} catch (error) {
				console.log(error);
			}
		},
		clearData() {
			this.businessPartner.name = "";
			this.businessPartner.description = "";
			this.businessPartner.tenChuoi = "";
			this.businessPartner.street = "";
		},
	},
};
</script>

<style lang="scss" scoped></style>
