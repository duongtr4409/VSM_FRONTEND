<template>
	<v-form ref="form">
		<v-menu
			ref="m_date_menu"
			v-model="showPicker"
			:close-on-content-click="false"
			:return-value.sync="showPicker"
			transition="scale-transition"
			offset-y
			min-width="auto"
		>
			<template v-slot:activator="{ on, attrs }">
				<v-text-field
					hide-details
					ref="m_date_text"
					:value="formatValue"
					dense
					outlined
					:append-icon="m_icon"
					readonly
					v-bind="attrs"
					clearable
					v-on="on"
					@click:clear="tempValue = null"
					:rules="m_rules"
				>
					<template v-slot:label>
						{{ label }}
						<span v-if="required" class="text-red-600">{{
							$t("label.star")
						}}</span>
					</template>
				</v-text-field>
			</template>
			<v-date-picker
				ref="m_date_picker"
				v-model="tempValue"
				scrollable
				no-title
				@input="showPicker = false"
			>
			</v-date-picker>
		</v-menu>
	</v-form>
</template>

<script>
import constant from "@/common/constant";
// import moment from "moment";
export default {
	name: "MDatePickerVue",
	props: {
		label: {},
		icon: {},
		format: {},
		value: {},
		required: {},
	},
	data() {
		return {
			showPicker: false,
			tempValue: null,
			m_format: "DD/MM/yyyy",
			m_icon: "mdi-calendar",
		};
	},
	watch: {
		format(value) {
			if (!value) {
				this.m_format = constant.format.vi_date;
				return;
			}
			this.m_format = value;
		},
		tempValue(value) {
			this.$emit(constant.keys.value, value);
		},
		icon(value) {
			this.m_icon = value;
		},
		value(value) {
			if (value) {
				this.tempValue = value;
			} else {
				this.tempValue = null;
			}
		},
	},
	computed: {
		// formatValue() {
		// 	return this.tempValue
		// 		? moment(this.tempValue).format(this.m_format)
		// 		: null;
		// },
	},
	mounted() {
		this.$refs.form.reset();
		this.m_format = this.format;
		this.tempValue = this.value;
	},
	beforeDestroy() {
		this.tempValue = "";
		this.m_format = constant.format.vi_date;
	},
};
</script>

<style></style>
