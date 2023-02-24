<template>
	<div class="white h-[100%]">
		<v-toolbar elevation="0" class="red darken-2 w-full" absolute>
			<v-spacer></v-spacer>
			<v-btn icon dark @click="close">
				<v-icon>mdi-close</v-icon>
			</v-btn>
		</v-toolbar>
		<div class="h-[100%]">
			<v-skeleton-loader
				v-if="!previewLink"
				class="m-0"
				type="card"
			></v-skeleton-loader>
			<iframe
				v-if="previewLink"
				:src="previewLink"
				width="100%"
				height="100%"
				frameborder="0"
				title=""
			>
			</iframe>
		</div>
		<!-- <div-actions>
			<v-spacer></v-spacer>
			<v-btn
				elevation="0"
				class="grey lighten-4 rounded-0"
				@click="close"
			>
				Hủy
			</v-btn>
		</v-card-actions> -->
	</div>
</template>

<script>
import globalService from "@/services/global.service";
import administratorAPI from "../../administrator/administrator.api";

export default {
	components: {},
	name: "VsmFeViewattachmentfile",
	props: { attachmentFile: [], requestData: {} },
	watch: {
		async attachmentFile(value) {
			this.requestid = value;
			await this.getPreviewLink();
		},
		requestData(newValue) {
			this.m_requestData = newValue;
		},
	},

	data() {
		return {
			listAttachmentFile: [],
			requestid: null,
			m_requestData: null,
			previewLink: "",
		};
	},
	async created() {
		// this.m_requestData = this.requestData;
		// this.listAttachmentFile = this.requestAttachmentFile;
		this.requestid = this.attachmentFile;
		await this.getPreviewLink();
	},

	mounted() {},

	methods: {
		async getPreviewLink() {
			let response;
			try {
				response = await globalService.getData_Async(
					administratorAPI.API_GetPreviewLink(this.requestid),
				);
				if (!response || !response.state) {
					return;
				}
				this.previewLink = response.data;
			} catch {
				return;
			}
		},
		close() {
			this.$emit("close", true);
		},
	},
};
</script>

<style lang="scss" scoped></style>
