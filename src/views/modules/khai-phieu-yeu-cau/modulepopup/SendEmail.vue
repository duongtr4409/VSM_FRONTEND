<template>
	<v-card>
		<v-toolbar color="grey lighten-4 max-h-[2.5rem]">
			<v-toolbar-title class="mb-5">
				{{ $t("button.send_email") }}
			</v-toolbar-title>
			<v-spacer></v-spacer>
			<v-btn icon @click="closeDialog" class="mb-5">
				<v-icon>mdi-close</v-icon>
			</v-btn>
		</v-toolbar>
		<v-card-text class="mt-4">
			<v-container>
				<v-row>
					<v-col cols="12" md="10">
						<v-select
							:menu-props="{ bot: true, offsetY: true }"
							:items="listMailTemp"
							item-text="mailTemplateName"
							outlined
							dense
							hide-details
							:label="$t('label.form_email')"
							clearable
							:no-data-text="$t('message.no_results')"
						>
						</v-select>
					</v-col>
					<v-col cols="12" md="2">
						<v-btn class="blue" dark>
							{{ $t("label.compose") }}
						</v-btn>
					</v-col>
				</v-row>
				<v-row>
					<v-col cols="12" md="10">
						<v-autocomplete
							multiple
							dense
							hide-details
							outlined
							:items="listUser"
							keyName="id"
							item-text="fullName"
							:label="$t('label.mail_template_receive')"
							clearable
						>
							<template v-slot:label>
								{{ $t("label.mail_template_receive")
								}}<span class="red--text">(*)</span>
							</template>
						</v-autocomplete>
					</v-col>
					<v-col cols="12" md="1">
						<v-btn icon color="blue">
							<v-icon>mdi-account-plus</v-icon>
						</v-btn>
					</v-col>
				</v-row>
				<v-row>
					<v-col cols="12" md="10">
						<v-autocomplete
							multiple
							dense
							hide-details
							outlined
							:items="listUser"
							keyName="id"
							item-text="fullName"
							label="cc"
							clearable
						></v-autocomplete>
					</v-col>
					<v-col cols="12" md="1">
						<v-btn icon color="blue">
							<v-icon>mdi-account-plus</v-icon>
						</v-btn>
					</v-col>
				</v-row>

				<v-row>
					<v-col>
						<v-textarea
							outlined
							:label="$t('label.mail_template_content')"
							maxLength="500"
						>
						</v-textarea>
					</v-col>
				</v-row>
				<v-row>
					<v-col>
						<v-checkbox :label="$t('label.send_otp')"> </v-checkbox>
					</v-col>
				</v-row>
				<v-row>
					<v-col>
						<v-checkbox :label="$t('label.attach_pdf')">
						</v-checkbox>
					</v-col>
				</v-row>
				<v-row>
					<v-col>
						<v-file-input
							truncate-length="15"
							multiple
							label="File input"
						></v-file-input>
					</v-col>
				</v-row>
			</v-container>
		</v-card-text>
		<v-card-actions>
			<v-spacer></v-spacer>
			<v-btn elevation="0" color="blue darken-2" dark class="rounded-0">
				{{ $t("button.ok") }}
			</v-btn>
			<v-btn
				elevation="0"
				color="grey lighten-4"
				class="rounded-0"
				@click="closeDialog()"
			>
				{{ $t("button.cancel") }}
			</v-btn>
		</v-card-actions>
	</v-card>
</template>

<script>
import globalService from "@/services/global.service";
import administratorAPI from "../../administrator/administrator.api";
export default {
	props: { request: {} },
	watch: {
		request(newValue) {
			this.m_requestData = newValue;
		},
	},
	data() {
		return {
			m_requestData: null,
			listUser: [],
			listMailTemp: [],
			selected_status: null,
			menungayxuly: false,
			menuhanxuly: false,
			ngayxuly: null,
			hanxuly: null,
		};
	},
	created() {
		this.m_requestData = this.request;
		this.$Progress.start();
		this.load();
	},
	mounted() {
		this.$Progress.finish();
	},
	methods: {
		load() {
			// this.getAllUser();
			// this.getAllMailTemp();
		},
		async getAllUser() {
			try {
				if (!this.m_requestData || !this.m_requestData.id) return;
				let response = await globalService.getData_Async(
					administratorAPI.API_GetAllUserByRequest(
						this.m_requestData.id,
					),
				);
				if (!response || !response.state) return;
				this.listUser = response.data;
			} catch (error) {
				console.log(error);
			}
		},
		async getAllMailTemp() {
			try {
				let response = await globalService.getData_Async(
					administratorAPI.API_GetAllMailTemplate(),
				);
				if (!response) return;
				this.listMailTemp = response.data;
			} catch (error) {
				console.log(error);
			}
		},
	},
};
</script>

<style></style>
