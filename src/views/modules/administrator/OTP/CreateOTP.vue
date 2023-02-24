<template>
	<v-card>
		<v-toolbar>
			<v-toolbar-title> OTP </v-toolbar-title>
			<v-spacer></v-spacer>
			<v-btn icon @click="closeDialog">
				<v-icon>mdi-close</v-icon>
			</v-btn>
		</v-toolbar>
		<v-card-text>
			<v-container>
				<v-row class="mt-2">
					<v-col class="underline">
						<v-btn
							color="blue"
							v-if="
								m_editedItem.requestData &&
								m_editedItem.requestData.requestDataCode
							"
							:to="{
								path: `/phieu-yeu-cau/chi-tiet/${m_editedItem.requestData.id}`,
							}"
							text
						>
							{{ m_editedItem.requestData.requestDataCode }}
						</v-btn>
					</v-col>
				</v-row>
				<v-row>
					<v-col cols="12" md="9">
						<v-text-field
							dense
							outlined
							:label="$t('label.OTP')"
							:value="m_editedItem.oTPCode"
							readonly
						>
						</v-text-field>
					</v-col>
					<v-col cols="12" md="3">
						<v-btn text @click="gererateOTP()">
							<v-icon> mdi-sync </v-icon>
							{{ $t("button.create_otp") }}
						</v-btn>
					</v-col>
				</v-row>
				<v-row>
					<v-col>
						<v-menu
							v-model="showModifyDatePicker"
							:close-on-content-click="false"
							max-width="290"
						>
							<template v-slot:activator="{ on, attrs }">
								<v-text-field
									:value="formatModifyDateFns"
									clearable
									:label="$t('label.issue_date_time')"
									class="mt-2"
									readonly
									v-bind="attrs"
									v-on="on"
									@click:clear="
										m_editedItem.expiryDate = null
									"
									outlined
									dense
									append-icon="mdi-calendar-blank"
								></v-text-field>
							</template>
							<v-date-picker
								v-model="m_editedItem.expiryDate"
								@change="showModifyDatePicker = false"
								no-title
								scrollable
							></v-date-picker>
						</v-menu>
					</v-col>
				</v-row>
				<v-row>
					<v-col>
						<v-btn @click="disabled()" class="float-right" text>
							<v-icon> mdi-lock </v-icon>
							{{ $t("button.disabled") }}
						</v-btn>
					</v-col>
				</v-row>
			</v-container>
		</v-card-text>
		<v-card-actions class="white mb-4">
			<v-spacer></v-spacer>
			<v-btn color="blue darken-1" dark @click="save">
				{{ $t("button.ok") }}
			</v-btn>
			<v-btn color="red" dark @click="closeDialog">
				{{ $t("button.cancel") }}
			</v-btn>
		</v-card-actions>
	</v-card>
</template>

<script>
import globalService from "@/services/global.service";
import administratorAPI from "../administrator.api";
import moment from "moment";
export default {
	props: { editedItem: {} },
	data() {
		return {
			user_current: this.getUserInfo(),
			dateFormat: "DD/MM/yyyy",
			showModifyDatePicker: false,
			m_editedItem: {
				createdDate: null,
				createdName: "",
				createdOrgName: "",
				createdRankName: "",
				description: "",
				expiryDate: null,
				id: null,
				isActive: true,
				isCustomerSign: false,
				isDelete: false,
				link: "",
				modifiedName: "",
				modifiedate: null,
				numberDownload: 0,
				numberPrint: 0,
				numberView: 0,
				oTPCode: "",
				requestData: null,
				status: "",
				numberFail:null
			},
		};
	},
	watch: {
		editedItem(value) {
			this.m_editedItem = value;
		},
	},
	created() {
		this.m_editedItem = this.editedItem;
	},
	computed: {
		formatModifyDateFns() {
			return this.m_editedItem.expiryDate
				? moment(this.m_editedItem.expiryDate).format(this.dateFormat)
				: "";
		},
	},
	methods: {
		async save() {
			this.m_editedItem.modifiedName = this.user_current.fullName;
			this.m_editedItem.expiryDate = moment(
				this.m_editedItem.expiryDate,
			).toDate();
			// this.modifiedDate = new Date();
			this.m_editedItem.modifiedate = new Date();

			let response = await globalService.putData_Async(
				administratorAPI.API_UpdateOTP(this.m_editedItem.id),
				this.m_editedItem,
			);
			if (!response || !response.state) {
				this.closeDialog();
				return this.toastError(this.$t("message.update_error"));
			}
			
			this.toastSuccess(this.$t("message.update_success"));
			
			this.closeDialog();
		},
		async disabled() {
			// this.m_editedItem.expiryDate = moment(new Date())
			// 	.toDate()
			// 	.setDate(new Date().getDate() - 1);

			this.m_editedItem.expiryDate = moment(new Date().setDate(new Date().getDate() - 1)).toDate();
			
			// this.m_editedItem.expiryDate = "";
			this.m_editedItem.isActive = false;
			let response = await globalService.putData_Async(
				administratorAPI.API_UpdateOTP(this.m_editedItem.id),
				this.m_editedItem,
			);
			if (!response || !response.state) {
				this.closeDialog();
				return this.toastError(this.$t("title.disable_error"));
			}
				this.closeDialog();

			this.toastSuccess(this.$t("title.disable_success"));
		},
		gererateOTP() {
			let response = Math.random() * 999999;
			this.m_editedItem.oTPCode = response.toString().slice(0, 6);
			this.m_editedItem.numberFail = 0;
		},
	},
};
</script>

<style></style>
