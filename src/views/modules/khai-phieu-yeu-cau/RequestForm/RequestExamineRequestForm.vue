<template>
	<v-card elevation="0" ref="form" color="primary">
		<v-toolbar dark color="primary">
			<v-toolbar-title> {{$t("button.send_information")}} </v-toolbar-title>
			<v-spacer></v-spacer>
			<v-btn icon dark @click="close">
				<v-icon>mdi-close</v-icon>
			</v-btn>
		</v-toolbar>
		<v-card-text class="white">
			<v-container>
				<v-form v-model="valid">
					<v-row>
						<v-col cols="12" sm="12" md="12">
							<v-textarea :label="$t('label.comment_note')" dense outlined>
							</v-textarea>
						</v-col>

						<v-col cols="12" sm="12" md="12">
							<v-file-input
								ref="file"
								:label="$t('label.attachment_file')"
								outlined
								dense
								@change="handleFileUpload($event)"
								:error-messages="errorMessageFile"
							>
							</v-file-input>
						</v-col>
					</v-row>
				</v-form>
			</v-container>
		</v-card-text>
		<v-card-actions class="white">
			<v-spacer></v-spacer>
			<v-btn color="blue darken-1" text @click="close"> {{$t("button.cancel")}} </v-btn>
			<v-btn color="blue darken-1" text @click="close">
				{{$t("button.send_information")}}
			</v-btn>
		</v-card-actions>
	</v-card>
</template>

<script>
export default {
	name: "VsmFeRequestexaminerequestform",
	watch: {
		requestData(newValue) {
			this.m_requestData = newValue;
		},
	},
	props: { requestData: {} },

	data() {
		return {
			m_requestData: null,
		};
	},
	created() {
		this.m_requestData = this.requestData;
	},

	mounted() {},

	methods: {
		close() {
			this.$emit("close", true);
		},
		handleFileUpload(event) {
			this.file = event;
		},
	},
};
</script>

<style lang="scss" scoped></style>
