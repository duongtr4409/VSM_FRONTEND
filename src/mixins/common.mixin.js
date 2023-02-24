import constant from "@/common/constant";
import numeral from "numeral";
const common = {
	methods: {
		capitalize(value = "") {
			let result = `${value}`.trim();
			if (result.length <= 0) {
				return "";
			}
			return result.charAt(0).toLocaleUpperCase() + result.slice(1);
		},

		/**
		 *
		 * @param {Object} source
		 * @returns boolean
		 */
		isEmpty(source) {
			if (typeof source != "object") {
				return true;
			}
			if (Array.isArray(source) && source.length <= 0) {
				return true;
			}
			for (let key in source) {
				if (source[key] != "" || source[key] != null) {
					return false;
				}
			}
			return true;
		},
		formatPropsToNumber(target) {
			for (let key in target) {
				if (typeof target[key] == "object") {
					this.formatPropsToNumber(target[key]);
				} else {
					target[key] = numeral(target[key]).value();
				}
			}
			return target;
		},
		safetify(value) {
			if (value == null) {
				return "";
			}
			if (value == undefined) {
				return "";
			}
			if (constant.unsafeValue.includes(value)) {
				return "";
			}
			return value;
		},
	},
};
export default common;
