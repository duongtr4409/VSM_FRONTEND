<template>
	<v-card elevation="0" class="overflow-y-hidden">
		<v-toolbar flat color="grey lighten-4">
			<v-toolbar-title> Thông tin hàng hóa</v-toolbar-title>
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
					v-model="centralizedShoping.fullName"
					outlined
					hide-details
					dense
					maxLength="255"

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
					v-model="centralizedShoping.description"
					outlined
					hide-details
					dense
					maxLength="255"

				/>
			</v-col>
		</v-row>
		<v-row class="mt-4 px-4">
			<v-col cols="12" md="6">
				<v-text-field
					:label="$t('cargo_valid.cBLDPnLPheDuyet')"
					ref="cBLDPnLPheDuyet"
					v-model="centralizedShoping.cBLDPnLPheDuyet"
					outlined
					hide-details
					dense
					maxLength="255"

				/>
			</v-col>
			<v-col cols="12" md="3">
				<v-text-field
					:label="$t('cargo_valid.dVTSAP')"
					ref="dVTSAP"
					v-model="centralizedShoping.dVTSAP"
					outlined
					hide-details
					dense
					maxLength="255"

				/>
			</v-col>
			<v-col cols="12" md="3">
				<v-text-field
					:label="$t('cargo_valid.bangSo')"
					ref="bangSo"
					v-model="centralizedShoping.bangSo"
					outlined
					hide-details
					dense
					maxLength="255"

				/>
			</v-col>
		</v-row>
		<v-row class="mt-4 px-4">
			<v-col cols="12" md="3">
				<v-text-field
					:label="$t('cargo_valid.level1')"
					ref="level1"
					v-model="centralizedShoping.level1"
					outlined
					hide-details
					dense
					maxLength="255"

				/>
			</v-col>
			<v-col cols="12" md="3">
				<v-text-field
					:label="$t('cargo_valid.level2')"
					ref="level2"
					v-model="centralizedShoping.level2"
					outlined
					hide-details
					dense
					maxLength="255"

				/>
			</v-col>
			<v-col cols="12" md="3">
				<v-text-field
					:label="$t('cargo_valid.level3')"
					ref="level3"
					v-model="centralizedShoping.level3"
					outlined
					hide-details
					dense
					maxLength="255"

				/>
			</v-col>
			<v-col cols="12" md="3">
				<v-text-field
					:label="$t('cargo_valid.level4')"
					ref="level4"
					v-model="centralizedShoping.level4"
					outlined
					hide-details
					dense
					maxLength="255"

				/>
			</v-col>
		</v-row>
		<v-row class="mt-4 px-4">
			<v-col cols="12" md="3">
				<v-text-field
					:label="$t('cargo_valid.tenNhomLevel1')"
					ref="tenNhomLevel1"
					v-model="centralizedShoping.tenNhomLevel1"
					outlined
					hide-details
					dense
					maxLength="255"

				/>
			</v-col>
			<v-col cols="12" md="3">
				<v-text-field
					:label="$t('cargo_valid.tenNhomLevel2')"
					ref="tenNhomLevel2"
					v-model="centralizedShoping.tenNhomLevel2"
					outlined
					hide-details
					dense
					maxLength="255"

				/>
			</v-col>
			<v-col cols="12" md="3">
				<v-text-field
					:label="$t('cargo_valid.tenNhomLevel3')"
					ref="tenNhomLevel3"
					v-model="centralizedShoping.tenNhomLevel3"
					outlined
					hide-details
					dense
					maxLength="255"

				/>
			</v-col>
			<v-col cols="12" md="3">
				<v-text-field
					:label="$t('cargo_valid.tenNhomLevel4')"
					ref="tenNhomLevel4"
					v-model="centralizedShoping.tenNhomLevel4"
					outlined
					hide-details
					dense
					maxLength="255"

				/>
			</v-col>
		</v-row>
		<v-row class="mt-4 px-4">
			<v-col cols="12">
				<v-text-field
					:label="$t('cargo_valid.pLSuDung')"
					ref="pLSuDung"
					v-model="centralizedShoping.pLSuDung"
					outlined
					hide-details
					dense
					maxLength="255"

				/>
			</v-col>
		</v-row>
		<v-row class="mt-4 px-4">
			<v-col cols="12">
				<v-text-field
					:label="$t('cargo_valid.ghiChuKhac')"
					ref="ghiChuKhac"
					v-model="centralizedShoping.ghiChuKhac"
					outlined
					hide-details
					dense
					maxLength="255"

				/>
			</v-col>
			<v-col cols="12" md="4">
				<v-text-field
					:label="$t('cargo_valid.maChungPnL')"
					ref="maChungPnL"
					v-model="centralizedShoping.maChungPnL"
					outlined
					hide-details
					dense
					maxLength="255"

				/>
			</v-col>
			<v-col cols="12" md="4">
				<v-text-field
					:label="$t('cargo_valid.noteKhoaMa')"
					ref="noteKhoaMa"
					v-model="centralizedShoping.noteKhoaMa"
					outlined
					hide-details
					dense
					maxLength="255"

				/>
			</v-col>
			<v-col cols="12" md="4">
				<v-text-field
					:label="$t('cargo_valid.pICYeuCauTaoMa')"
					ref="pICYeuCauTaoMa"
					v-model="centralizedShoping.pICYeuCauTaoMa"
					outlined
					hide-details
					dense
					maxLength="255"

				/>
			</v-col>
		</v-row>
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
import CentralizedDTO from "@/models/centralized-shopping.dto";
import administratorAPI from "../administrator.api";
import globalService from "@/services/global.service";

export default {
	name: "EditCargo",

	props: {
		idMailSelect: { type: Number },
		isLoad: { type: Boolean },
	},

	data() {
		return {
			centralizedShoping: Object.assign({}, CentralizedDTO),
			id: null,
			isLoad_: null,
			user_current: this.getUserInfo(),
		};
	},
	watch: {
		// id: async function (value) {
		// 	let response;
		// 	try {
		// 		response = await globalService.getData_Async(
		// 			administratorAPI.API_GetOne_Centralized(value),
		// 		);
		// 		if (!response || !response.state) {
		// 			this.$router.push({ path: "./" });
		// 			return;
		// 		}
		// 		this.centralizedShoping = response.data;

		// 	} catch (error) {
		// 		this.$router.push({ path: "./" });
		// 	}
		// },
		idMailSelect(value) {
			this.id = value;
		},
		isLoad(value) {
			this.isLoad_ = value;
		},
		isLoad_: async function (value) {
			if (value) {
				let response;
				try {
					response = await globalService.getData_Async(
						administratorAPI.API_GetOne_Centralized(this.id),
					);
					if (!response || !response.state) {
						this.$router.push({ path: "./" });
						return;
					}
					this.centralizedShoping = response.data;
				} catch (error) {
					this.$router.push({ path: "./" });
				}
			}
		},
	},
	created() {
		(this.id = this.idMailSelect), (this.isLoad_ = this.isLoad);
	},

	mounted() {},

	methods: {
		close() {
			//this.clearData();
			this.$emit("close", false);
		},
		async save() {
			try {
				this.centralizedShoping.modifiedName =
					this.user_current.fullName;
				this.centralizedShoping.fullName =
					this.centralizedShoping.fullName.trim();

				if (!this.validRequiredText(this.centralizedShoping.fullName)) {
					return this.toastError(this.$t("cargo_valid.fullNamenull"));
				}
				let response = await globalService.putData_Async(
					administratorAPI.API_Delete_UpDateCentralized(
						this.centralizedShoping.id,
					),
					this.centralizedShoping,
				);
				if (!response.state) {
					this.toastError(response.message);
				}
				this.toastSuccess(response.message);
				this.close();
				this.$emit("isLoadList", false);
			} catch (error) {
				console.log(error);
			}
		},
		clearData() {
			this.centralizedShoping = Object.assign({}, CentralizedDTO);
		},
	},
};
</script>

<style lang="scss" scoped>
</style>