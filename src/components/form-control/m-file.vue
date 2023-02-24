<template>
	<span>
		<v-btn v-if="value" icon @click="downloadFileTemplate(value)">
			<v-icon> mdi-file </v-icon>
		</v-btn>
		<input type="file" ref="input" @change="handle" class="w-fit" />
	</span>
</template>

<script>
import globalService from "@/services/global.service";
import administratorAPI from "@/views/modules/administrator/administrator.api";
export default {
	name: "FileVue",
	data() {
		return {
			value: null,
		};
	},
	methods: {
		/* Component Editor Lifecycle methods */
		// the final value to send to the grid, on completion of editing
		getValue() {
			// this simple editor doubles any value entered into the input
			return this.value;
		},

		// Gets called once before editing starts, to give editor a chance to
		// cancel the editing before it even starts.
		isCancelBeforeStart() {
			return false;
		},

		// Gets called once when editing is finished (eg if Enter is pressed).
		// If you return true, then the result of the edit will be ignored.
		isCancelAfterEnd() {
			// our editor will reject any value greater than 1000
			return this.value > 1000;
		},
		async handle(event) {
			if (!event?.target?.files[0]) {
				return;
			}
			let response;
			try {
				response = await globalService.uploadData_Async(
					administratorAPI.API_UploadFile365(),
					event?.target?.files[0],
					{},
				);
				if (!response || !response.state) {
					return;
				}
				this.value = response.data.ofice365Path;
			} catch (e) {
				console.log(e);
			}
		},
		downloadFileTemplate(item) {
			if (!item) {
				return;
			}
			window.open(item, "_blank");
		},
	},
	mounted() {
		this.value = this.params?.value;
		// this.nextTick(() => this.$refs.input.focus());
	},
};
</script>

<style></style>
