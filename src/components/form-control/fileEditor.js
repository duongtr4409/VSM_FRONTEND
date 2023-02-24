import { nextTick } from "vue";
import globalService from "@/services/global.service";
import administratorAPI from "@/views/modules/administrator/administrator.api";
const fileEditor = {
	template: `<div>
                <span v-if="value"> {{ value }} </span>
                <input type="file" ref="input" @change="handle" />
            </div>`,
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
			console.log(event);
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
	},
	mounted() {
		this.value = this.params.value;
		nextTick(() => this.$refs.input.focus());
	},
};
export default fileEditor;
