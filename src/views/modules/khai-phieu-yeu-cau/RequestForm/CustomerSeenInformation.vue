<template>
	<v-card>
		<v-row>
			<v-col cols="12">
				<v-select
					:menu-props="{ bot: true, offsetY: true }"
					v-model="templateForm"
					:items="listTemplateForm"
					item-text="templateFormName"
					:item-value="(item) => item"
					outlined
					dense
				>
				</v-select>
			</v-col>
		</v-row>
		<v-row>
			<v-col cols="12" md="12">
				<v-skeleton-loader
					v-if="!previewLink"
					class="mx-auto"
					width="100%"
					type="card"
				></v-skeleton-loader>
				<iframe
					v-if="previewLink"
					:src="previewLink + '&amp;action=embedview'"
					width="100%"
					height="750"
					title=""
					frameborder="0"
					>This is an embedded
					<a target="_blank" href="https://office.com"
						>Microsoft Office</a
					>
					document, powered by
					<a target="_blank" href="https://office.com/webapps"
						>Office</a
					>.</iframe
				>
			</v-col>
		</v-row>
	</v-card>
</template>

<script>
import TemplateFormDto from "@/models/template-form.dto";
import globalService from "@/services/global.service";
import administratorAPI from "../../administrator/administrator.api";
// import RequestDataDto from "@/models/request-data.dto";
export default {
	name: "VSMFECustomerSeenInformation",
	props: { requestDataDto: {} },

	data() {
		return {
			templateForm: Object.assign({}, TemplateFormDto),
			listTemplateForm: [],
			m_requestDataDto_: null,
			previewLink: "",
		};
	},
	watch: {
		"templateForm.attachmentFileDTOS": async function (value) {
			let response;
			try {
				let id = value[value.length - 1].id;
				response = await globalService.getData_Async(
					administratorAPI.API_GetPreviewLink(id),
				);
				if (!response || !response.state) {
					return;
				}
				this.previewLink = response.data;
			} catch {
				return;
			}
		},
		requestDataDto(value) {
			this.m_requestDataDto_ = value;
		},
	},

	mounted() {},
	async created() {
		this.m_requestDataDto_ = this.requestDataDto;
		await this.init();
	},

	methods: {
		async init() {
			// await this.getAllTemplateForm();
		},
		// async getAllTemplateForm() {
		// 	let response;
		// 	try {
		// 		response = await globalService.getData_Async(
		// 			administratorAPI.API_GetAllTemplateForm(),
		// 		);
		// 		if (!response || !response.state) {
		// 			this.toastError(this.$t("error.load"));
		// 		}

		// 		this.listTemplateForm = response.data.filter((entry) => {
		// 			return !entry.isDelete;
		// 		});
		// 	} catch (error) {
		// 		this.toastError(error);
		// 		return;
		// 	}
		// },
	},
};
</script>

<style lang="scss" scoped></style>
