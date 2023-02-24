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
					v-model="centralizedShoping.fullName"
					:label="$t('cargo_valid.fullName')"
					maxLength="255"
					outlined
					hide-details
					dense
				
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
					v-model="centralizedShoping.description"
					maxLength="255"
					outlined
					hide-details
					dense
				/>
			</v-col>
		</v-row>
		<v-row class="mt-4 px-4">
			<v-col cols="12" md="6">
				<v-text-field
					:label="$t('cargo_valid.cBLDPnLPheDuyet')"
					v-model="centralizedShoping.cBLDPnLPheDuyet"
					maxLength="255"
					outlined
					hide-details
					dense
				/>
			</v-col>
			<v-col cols="12" md="3">
				<v-text-field
					:label="$t('cargo_valid.dVTSAP')"
					v-model="centralizedShoping.dVTSAP"
					maxLength="255"
					outlined
					hide-details
					dense
				/>
			</v-col>
			<v-col cols="12" md="3">
				<v-text-field
					:label="$t('cargo_valid.bangSo')"
					v-model="centralizedShoping.bangSo"
					maxLength="255"
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
					v-model="centralizedShoping.level1"
					maxLength="255"
					outlined
					hide-details
					dense
				/>
			</v-col>
			<v-col cols="12" md="3">
				<v-text-field
					:label="$t('cargo_valid.level2')"
					v-model="centralizedShoping.level2"
					maxLength="255"
					outlined
					hide-details
					dense
				/>
			</v-col>
			<v-col cols="12" md="3">
				<v-text-field
					:label="$t('cargo_valid.level3')"
					v-model="centralizedShoping.level3"
					maxLength="255"
					outlined
					hide-details
					dense
				/>
			</v-col>
			<v-col cols="12" md="3">
				<v-text-field
					:label="$t('cargo_valid.level4')"
					v-model="centralizedShoping.level4"
					maxLength="255"
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
					v-model="centralizedShoping.tenNhomLevel1"
					maxLength="255"
					outlined
					hide-details
					dense
				/>
			</v-col>
			<v-col cols="12" md="3">
				<v-text-field
					:label="$t('cargo_valid.tenNhomLevel2')"
					v-model="centralizedShoping.tenNhomLevel2"
					maxLength="255"
					outlined
					hide-details
					dense
				/>
			</v-col>
			<v-col cols="12" md="3">
				<v-text-field
					:label="$t('cargo_valid.tenNhomLevel3')"
					v-model="centralizedShoping.tenNhomLevel3"
					maxLength="255"
					outlined
					hide-details
					dense
				/>
			</v-col>
			<v-col cols="12" md="3">
				<v-text-field
					:label="$t('cargo_valid.tenNhomLevel4')"
					v-model="centralizedShoping.tenNhomLevel4"
					maxLength="255"
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
					v-model="centralizedShoping.pLSuDung"
					maxLength="255"
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
					v-model="centralizedShoping.ghiChuKhac"
					maxLength="255"
					outlined
					hide-details
					dense
				/>
			</v-col>
			<v-col cols="12" md="4">
				<v-text-field
					:label="$t('cargo_valid.maChungPnL')"
					v-model="centralizedShoping.maChungPnL"
					maxLength="255"
					outlined
					hide-details
					dense
				/>
			</v-col>
			<v-col cols="12" md="4">
				<v-text-field
					:label="$t('cargo_valid.noteKhoaMa')"
					v-model="centralizedShoping.noteKhoaMa"
					maxLength="255"
					outlined
					hide-details
					dense
				/>
			</v-col>
			<v-col cols="12" md="4">
				<v-text-field
					:label="$t('cargo_valid.pICYeuCauTaoMa')"
					v-model="centralizedShoping.pICYeuCauTaoMa"
					maxLength="255"
					outlined
					hide-details
					dense
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
import administratorAPI from '../administrator.api';
import globalService from '@/services/global.service';

export default {
	name: "CreateCargo",
	components: {},

	data() {
		return {
			centralizedShoping:  Object.assign({},CentralizedDTO),
			user_current: this.getUserInfo(),

			
		};
	},
	watch: {
			
		
	},
	mounted() {},

	methods: {
		close() {
			this.clearData();
			this.$emit("close", false);
		},
		async save() {
			this.centralizedShoping.fullName =
				this.centralizedShoping.fullName.trim();

			if (!this.validRequiredText(this.centralizedShoping.fullName)) {
				return this.toastError(this.$t("cargo_valid.fullNamenull"));
			}
			this.centralizedShoping.modifiedName = this.user_current.fullName;
			
			let response;
			try {

				response = await globalService.postData_Async(
					administratorAPI.API_Creat_Centralized(),
					this.centralizedShoping,
				);

				if (!response) {
					this.toastError(response);
					return false;
				}
				if (!response.state) {
					this.toastError(response.message);
					return false;
				}

				this.toastSuccess(response.message);
				this.close();
				this.$emit("isLoadList", false);
			} catch (error) {
				this.toastError(error);
				return false;
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