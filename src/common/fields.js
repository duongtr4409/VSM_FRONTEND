import vue from "@/main";
const fields = [
	{
		//text
		name: vue.$t("label.field_text"),
		icon: "mdi-form-textbox",
		previewModel: {},
		previewSchema: {
			type: "object",
			properties: {
				title: {
					type: "string",
					title: vue.$t("label.field_text"),
					readOnly: true,
					textFieldProps: { "prepend-icon": "mdi-pencil" },
				},
			},
		},
		configModel: {},
		configSchema: {
			type: "object",
			properties: {
				id: {
					type: "string",
					title: vue.$t("label.id_field_text"),
					default: "",
					maxLength: 255,
					pattern: "^[a-z_0-9]+$",
					"x-options": {
						messages: {
							maxLength: vue.$t("message.maxlength_required_255"),
							pattern: vue.$t("message.msg_code_id"),
						},
					},
				},
				title: {
					type: "string",
					title: vue.$t("label.field_text"),
					default: "",
					maxLength: 255,
					pattern: "\\S+",
					"x-options": {
						messages: {
							maxLength: vue.$t("message.maxlength_required_255"),
							pattern: vue.$t("message.msg_1"),
						},
					},
				},
				placeholder: {
					type: "string",
					title: vue.$t("label.field_placeholder"),
					default: "",
					maxLength: 255,
					"x-options": {
						messages: {
							maxLength: vue.$t("message.maxlength_required_255"),
						},
					},
				},
				is_required: {
					type: "boolean",
					title: vue.$t("label.is_required"),
					"x-display": "switch",
					default: false,
				},
				minLength: {
					type: "string",
					title: vue.$t("label.field_min_length"),
					maxLength: 12,
					default: undefined,
					pattern: "^[\\s]{0,12}[0-9]{0,12}[\\s]{0,12}$",
					"x-options": {
						messages: {
							maxLength: vue.$t("message.maxlength_required_12"),
							pattern: vue.$t("message.invalid_value"),
						},
					},
				},
				maxLength: {
					type: "string",
					title: vue.$t("label.field_max_length"),
					maxLength: 12,
					pattern: "^[\\s]{0,12}[0-9]{0,12}[\\s]{0,12}$",
					default: undefined,
					"x-options": {
						messages: {
							maxLength: vue.$t("message.maxlength_required_12"),
							pattern: vue.$t("message.invalid_value"),
						},
					},
				},
				pattern: {
					type: "string",
					title: vue.$t("label.field_pattern"),
					maxLength: 255,
					default: "",
					"x-options": {
						messages: {
							maxLength: vue.$t("message.maxlength_required_255"),
						},
					},
				},
				default: {
					type: "string",
					title: vue.$t("label.default_value"),
					maxLength: 255,
					default: "",
					"x-options": {
						messages: {
							maxLength: vue.$t("message.maxlength_required_255"),
						},
					},
				},
				numberWord: {
					type: "string",
					title: vue.$t("label.source_field"),
					maxLength: 255,
					default: "",
					"x-options": {
						messages: {
							maxLength: vue.$t("message.maxlength_required_255"),
						},
					},
				},
				
				
			},
		},
		viewLeftModel: {},
		viewLeft: {
			type: "object",
			properties: {
				title: {
					type: "string",
					title: vue.$t("label.field_text"),
					readOnly: true,
				},
			},
		},
	},
	//textarea
	{
		viewLeftModel: {},
		viewLeft: {
			type: "object",
			properties: {
				title: {
					type: "string",
					title: vue.$t("label.field_textarea"),
					readOnly: true,
				},
			},
		},
		name: vue.$t("label.field_textarea"),
		icon: "mdi-form-textarea",
		previewModel: {},
		previewSchema: {
			type: "object",
			properties: {
				title: {
					type: "string",
					title: vue.$t("label.field_textarea"),
					"x-display": "textarea",
					readOnly: true,
				},
			},
		},
		configModel: {},
		configSchema: {
			type: "object",
			properties: {
				id: {
					type: "string",
					title: vue.$t("label.id_field_textarea"),
					default: "",
					maxLength: 255,
					pattern: "^[a-z_0-9]+$",
					"x-options": {
						messages: {
							maxLength: vue.$t("message.maxlength_required_255"),
							pattern: vue.$t("message.msg_code_id"),
						},
					},
				},
				title: {
					type: "string",
					title: vue.$t("label.field_textarea"),
					default: "",
					maxLength: 255,
					pattern: "\\S+",
					"x-options": {
						messages: {
							maxLength: vue.$t("message.maxlength_required_255"),
							pattern: vue.$t("message.msg_1"),
						},
					},
				},
				placeholder: {
					type: "string",
					title: vue.$t("label.field_placeholder"),
					default: "",
					maxLength: 255,
					"x-options": {
						messages: {
							maxLength: vue.$t("message.maxlength_required_255"),
						},
					},
				},
				is_required: {
					type: "boolean",
					title: vue.$t("label.is_required"),
					default: "",
					"x-display": "switch",
				},
				minLength: {
					type: "string",
					title: vue.$t("label.field_min_length"),
					default: undefined,
					pattern: "^[\\s]{0,12}[0-9]{0,12}[\\s]{0,12}$",
					maxLength: 12,
					"x-options": {
						messages: {
							maxLength: vue.$t("message.maxlength_required_12"),
							pattern: vue.$t("message.invalid_value"),
						},
					},
				},
				maxLength: {
					type: "string",
					title: vue.$t("label.field_max_length"),
					default: undefined,
					maxLength: 12,
					pattern: "^[\\s]{0,12}[0-9]{0,12}[\\s]{0,12}$",
					"x-options": {
						messages: {
							maxLength: vue.$t("message.maxlength_required_12"),
							pattern: vue.$t("message.invalid_value"),
						},
					},
				},
				pattern: {
					type: "string",
					title: vue.$t("label.field_pattern"),
					default: "",
					maxLength: 255,
					"x-options": {
						messages: {
							maxLength: vue.$t("message.maxlength_required_255"),
						},
					},
				},
			},
		},
	},
	//integer
	{
		viewLeftModel: {},
		viewLeft: {
			type: "object",
			properties: {
				title: {
					type: "string",
					title: vue.$t("label.field_integer"),
					readOnly: true,
				},
			},
		},
		name: vue.$t("label.field_integer"),
		icon: "mdi-counter",
		previewModel: {},
		previewSchema: {
			type: "object",
			properties: {
				title: {
					type: "number",
					title: vue.$t("label.field_integer"),
					readOnly: true,
				},
			},
		},
		configModel: {},
		configSchema: {
			type: "object",
			properties: {
				id: {
					type: "string",
					title: vue.$t("label.id_field_integer"),
					default: "",
					maxLength: 255,
					pattern: "^[a-z_0-9]+$",
					"x-options": {
						messages: {
							maxLength: vue.$t("message.maxlength_required_255"),
							pattern: vue.$t("message.msg_code_id"),
						},
					},
				},
				title: {
					type: "string",
					title: vue.$t("label.field_integer"),
					default: "",
					maxLength: 255,
					pattern: "\\S+",
					"x-options": {
						messages: {
							maxLength: vue.$t("message.maxlength_required_255"),
							pattern: vue.$t("message.msg_1"),
						},
					},
				},
				placeholder: {
					type: "string",
					title: vue.$t("label.field_placeholder"),
					default: "",
					maxLength: 255,
					"x-options": {
						messages: {
							maxLength: vue.$t("message.maxlength_required_255"),
						},
					},
				},
				is_required: {
					type: "boolean",
					title: vue.$t("label.is_required"),
					"x-display": "switch",
					default: "",
				},
				minimum: {
					type: "string",
					title: vue.$t("label.field_min_value"),
					default: undefined,
					maxLength: 12,
					pattern:
						"^[\\s]{0,12}[-]{0,1}[0-9]{0,12}((\\.[0-9]{0,3})||(\\,[0-9]{0,3}))[\\s]{0,12}?$",
					"x-options": {
						messages: {
							maxLength: vue.$t("message.maxlength_required_12"),
							pattern: vue.$t("message.invalid_value"),
						},
					},
				},
				maximum: {
					type: "string",
					title: vue.$t("label.field_max_value"),
					default: undefined,
					maxLength: 12,
					pattern:
						"^[\\s]{0,12}[-]{0,1}[0-9]{0,12}((\\.[0-9]{0,3})||(\\,[0-9]{0,3}))[\\s]{0,12}?$",
					"x-options": {
						messages: {
							maxLength: vue.$t("message.maxlength_required_12"),
							pattern: vue.$t("message.invalid_value"),
						},
					},
				},
				default: {
					type: "string",
					title: vue.$t("label.value_field"),
					default: "",
					maxLength: 12,
					pattern:
						"^[\\s]{0,12}[-]{0,1}[0-9]{0,12}((\\.[0-9]{0,3})||(\\,[0-9]{0,3}))[\\s]{0,12}?$",
					"x-options": {
						messages: {
							maxLength: vue.$t("message.maxlength_required_12"),
							pattern: vue.$t("message.invalid_value"),
						},
					},
				},
			},
		},
	},
	//double
	{
		viewLeftModel: {},
		viewLeft: {
			type: "object",
			properties: {
				title: {
					type: "string",
					title: vue.$t("label.field_double"),
					readOnly: true,
				},
			},
		},
		name: vue.$t("label.field_double"),
		icon: "mdi-decimal",
		previewModel: {},
		previewSchema: {
			type: "object",
			properties: {
				title: {
					type: "number",
					title: vue.$t("label.field_double"),
					readOnly: true,
					double: "double"
				},
			},
		},
		configModel: {},
		configSchema: {
			type: "object",
			properties: {
				id: {
					type: "string",
					title: vue.$t("label.field_double"),
					default: " ",
					maxLength: 255,
					pattern: "^[a-z_0-9]+$",
					"x-options": {
						messages: {
							maxLength: vue.$t("message.maxlength_required_255"),
							pattern: vue.$t("message.msg_code_id"),
						},
					},
				},
				title: {
					type: "string",
					title: vue.$t("label.field_double"),
					default: " ",
					maxLength: 255,
					pattern: "\\S+",
					"x-options": {
						messages: {
							maxLength: vue.$t("message.maxlength_required_255"),
							pattern: vue.$t("message.msg_1"),
						},
					},
				},
				placeholder: {
					type: "string",
					title: vue.$t("label.field_placeholder"),
					default: "",
					maxLength: 255,
					"x-options": {
						messages: {
							maxLength: vue.$t("message.maxlength_required_255"),
						},
					},
				},
				is_required: {
					type: "boolean",
					title: vue.$t("label.is_required"),
					"x-display": "switch",
					default: false,
				},
				minimum: {
					type: "string",
					title: vue.$t("label.field_min_value"),
					default: undefined,
					maxLength: 12,
					pattern:
						"^[\\s]{0,12}[-]{0,1}[0-9]{0,12}((\\.[0-9]{0,3})||(\\,[0-9]{0,3}))[\\s]{0,12}?$",
					"x-options": {
						messages: {
							maxLength: vue.$t("message.maxlength_required_12"),
							pattern: vue.$t("message.invalid_value"),
						},
					},
				},
				maximum: {
					type: "string",
					title: vue.$t("label.field_max_value"),
					default: undefined,
					maxLength: 12,
					pattern:
						"^[\\s]{0,12}[-]{0,1}[0-9]{0,12}((\\.[0-9]{0,3})||(\\,[0-9]{0,3}))[\\s]{0,12}?$",
					"x-options": {
						messages: {
							maxLength: vue.$t("message.maxlength_required_12"),
							pattern: vue.$t("message.invalid_value"),
						},
					},
				},
				default: {
					type: "string",
					title: vue.$t("label.value_field"),
					default: "",
					maxLength: 12,
					pattern:
						"^[\\s]{0,12}[-]{0,1}[0-9]{0,12}((\\.[0-9]{0,3})||(\\,[0-9]{0,3}))[\\s]{0,12}?$",
					"x-options": {
						messages: {
							maxLength: vue.$t("message.maxlength_required_12"),
							pattern: vue.$t("message.invalid_value"),
						},
					},
				},
			},
		},
	},
	//select
	{
		viewLeftModel: {},
		viewLeft: {
			type: "object",
			properties: {
				title: {
					type: "string",
					title: vue.$t("label.field_select"),
					readOnly: true,
				},
			},
		},
		name: vue.$t("label.field_select"),
		icon: "mdi-form-dropdown",
		previewModel: {},
		previewSchema: {
			type: "object",
			properties: {
				title: {
					type: "string",
					title: vue.$t("label.field_select"),
					oneOf: [
						{
							const: "value1",
							title: "Value 1",
						},
						{
							const: "value2",
							title: "Value 2",
						},
					],
					is_required: false,
					value: "",
					readOnly: true,
				},
			},
		},
		configModel: {},
		configSchema: {
			type: "object",
			properties: {
				id: {
					type: "string",
					title: vue.$t("label.id_field_select"),
					default: "",
					maxLength: 255,
					pattern: "^[a-z_0-9]+$",
					"x-options": {
						messages: {
							maxLength: vue.$t("message.maxlength_required_255"),
							pattern: vue.$t("message.msg_code_id"),
						},
					},
				},
				title: {
					type: "string",
					title: vue.$t("label.field_select"),
					default: "",
					maxLength: 255,
					pattern: "\\S+",
					"x-options": {
						messages: {
							maxLength: vue.$t("message.maxlength_required_255"),
							pattern: vue.$t("message.msg_1"),
						},
					},
				},
				is_required: {
					type: "boolean",
					title: vue.$t("label.is_required"),
					"x-display": "switch",
					default: false,
				},
				value: {
					type: "string",
					title: vue.$t("label.field_value"),
					"x-display": "textarea",
					default: "",
					maxLength: 500,
					"x-options": {
						messages: {
							maxLength: vue.$t("message.maxlength_required_500"),
						},
					},
				},
				category: {
					type: "string",
					title: vue.$t("label.field_category"),
					oneOf: [],
				},
				filter: {
					type: "string",
					title: vue.$t("label.field_filter"),
					oneOf: [],
				},
				relation_name: {
					type: "string",
					title: vue.$t("title.relation_name"),
					default: "",
					maxLength: 255,
					"x-options": {
						messages: {
							maxLength: vue.$t("message.maxlength_required_255"),
						},
					},
				},
			},
		},
	},
	//combobox
	{
		viewLeftModel: {},
		viewLeft: {
			type: "object",
			properties: {
				title: {
					type: "string",
					title: vue.$t("label.field_combobox"),
					readOnly: true,
				},
			},
		},
		name: vue.$t("label.field_combobox"),
		icon: "mdi-form-select",
		previewModel: {},
		previewSchema: {
			type: "object",
			properties: {
				title: {
					type: "string",
					title: vue.$t("label.field_combobox"),
					default: "",
					anyOf: [
						{
							const: "value1",
							title: "Value 1",
						},
						{
							const: "value2",
							title: "Value 2",
						},
						{},
					],
					readOnly: true,
					"x-display": "combobox",
				},
			},
		},
		configModel: {},
		configSchema: {
			type: "object",
			properties: {
				id: {
					type: "string",
					title: vue.$t("label.id_field_combobox"),
					default: "",
					maxLength: 255,
					pattern: "^[a-z_0-9]+$",
					"x-options": {
						messages: {
							maxLength: vue.$t("message.maxlength_required_255"),
							pattern: vue.$t("message.msg_code_id"),
						},
					},
				},
				title: {
					type: "string",
					title: vue.$t("label.field_combobox"),
					default: "",
					maxLength: 255,
					pattern: "\\S+",
					"x-options": {
						messages: {
							maxLength: vue.$t("message.maxlength_required_255"),
							pattern: vue.$t("message.msg_1"),
						},
					},
				},
				is_required: {
					type: "boolean",
					title: vue.$t("label.is_required"),
					"x-display": "switch",
					default: false,
				},
				value: {
					type: "string",
					title: vue.$t("label.field_value"),
					"x-display": "textarea",
					default: "",
					maxLength: 500,
					"x-options": {
						messages: {
							maxLength: vue.$t("message.maxlength_required_500"),
						},
					},
				},
				category: {
					type: "string",
					title: vue.$t("label.field_category"),
					default: "",
					oneOf: [],
				},
				filter: {
					type: "string",
					title: vue.$t("label.field_filter"),
					oneOf: [],
				},
				relation_name: {
					type: "string",
					title: vue.$t("title.relation_name"),
					default: "",
					maxLength: 255,
				},
			},
		},
	},
	//date
	{
		viewLeftModel: {},
		viewLeft: {
			type: "object",
			properties: {
				title: {
					type: "string",
					title: vue.$t("label.field_date"),
					readOnly: true,
				},
			},
		},
		name: vue.$t("label.field_date"),
		icon: "mdi-calendar-month",
		previewModel: {},
		previewSchema: {
			type: "object",
			properties: {
				title: {
					type: "string",
					title: vue.$t("label.field_date"),
					format: "date",
					readOnly: true,
				},
			},
		},
		configModel: {},
		configSchema: {
			type: "object",
			properties: {
				id: {
					type: "string",
					title: vue.$t("label.id_field_date"),
					default: "",
					maxLength: 255,
					pattern: "^[a-z_0-9]+$",
					"x-options": {
						messages: {
							maxLength: vue.$t("message.maxlength_required_255"),
							pattern: vue.$t("message.msg_code_id"),
						},
					},
				},
				title: {
					type: "string",
					title: vue.$t("label.field_date"),
					default: "",
					maxLength: 255,
					pattern: "\\S+",
					"x-options": {
						messages: {
							maxLength: vue.$t("message.maxlength_required_255"),
							pattern: vue.$t("message.msg_1"),
						},
					},
				},
				is_required: {
					type: "boolean",
					title: vue.$t("label.is_required"),
					"x-display": "switch",
					default: false,
				},
				// min_date: {
				// 	type: "string",
				// 	title: vue.$t("label.field_min_date"),
				// 	format: "date",
				// 	default: "",
				// },
				// max_date: {
				// 	type: "string",
				// 	title: vue.$t("label.field_max_date"),
				// 	format: "date",
				// 	default: "",
				// },
			},
		},
	},
	//multiple checkbox
	{
		viewLeftModel: {},
		viewLeft: {
			type: "object",
			properties: {
				title: {
					type: "string",
					title: vue.$t("label.field_checkbox"),
					readOnly: true,
				},
			},
		},
		name: vue.$t("label.field_checkbox"),
		icon: "mdi-order-bool-ascending-variant",
		previewModel: {},
		previewSchema: {
			type: "object",
			properties: {
				title: {
					type: "boolean",
					title: vue.$t("label.field_checkbox"),
					description: "This description is used as a help message.",
					default: "",
					is_required: false,
					readOnly: true,
				},
			},
		},
		configModel: {},
		configSchema: {
			type: "object",
			properties: {
				id: {
					type: "string",
					title: vue.$t("label.id_field_checkbox"),
					default: "",
					maxLength: 255,
					pattern: "^[a-z_0-9]+$",
					"x-options": {
						messages: {
							maxLength: vue.$t("message.maxlength_required_255"),
							pattern: vue.$t("message.msg_code_id"),
						},
					},
				},
				title: {
					type: "string",
					title: vue.$t("label.field_checkbox"),
					default: "",
					maxLength: 255,
					pattern: "\\S+",
					"x-options": {
						messages: {
							maxLength: vue.$t("message.maxlength_required_255"),
							pattern: vue.$t("message.msg_1"),
						},
					},
				},
				is_required: {
					type: "boolean",
					title: vue.$t("label.is_required"),
					"x-display": "switch",
					default: false,
				},
			},
		},
	},
	//file
	{
		viewLeftModel: {},
		viewLeft: {
			type: "object",
			properties: {
				title: {
					type: "string",
					title: vue.$t("label.field_file"),
					readOnly: true,
				},
			},
		},
		name: vue.$t("label.field_file"),
		icon: "mdi-file-plus-outline",
		attachmentInfo: null,
		previewModel: {},
		previewSchema: {
			type: "object",
			properties: {
				title: {
					readOnly: true,
					type: "object",
					title: vue.$t("label.field_file"),
					contentMediaType: "image/*",
					properties: {
						name: {
							type: "string",
						},
						size: {
							type: "number",
						},
						type: {
							type: "string",
						},
						lastModified: {
							type: "string",
							format: "date-time",
						},
						data: {
							type: "string",
						},
					},
				},
			},
		},
		configModel: {},
		configSchema: {
			type: "object",
			properties: {
				id: {
					type: "string",
					title: vue.$t("label.id_field_file"),
					default: "",
					maxLength: 255,
					pattern: "^[a-z_0-9]+$",
					"x-options": {
						messages: {
							maxLength: vue.$t("message.maxlength_required_255"),
							pattern: vue.$t("message.msg_code_id"),
						},
					},
				},
				title: {
					type: "string",
					title: vue.$t("label.field_file"),
					default: "",
					maxLength: 255,
					pattern: "\\S+",
					"x-options": {
						messages: {
							maxLength: vue.$t("message.maxlength_required_255"),
							pattern: vue.$t("message.msg_1"),
						},
					},
				},
				is_required: {
					type: "boolean",
					title: vue.$t("label.is_required"),
					"x-display": "switch",
					default: false,
				},
				// upload_dest: {
				// 	type: "string",
				// 	title: vue.$t("label.field_upload_dest"),
				// 	maxLength: 255,
				// 	pattern: "\\S+",
				// 	"x-options": {
				// 		messages: {
				// 			maxLength: vue.$t("message.maxlength_required_255"),
				// 			pattern: vue.$t("message.msg_1"),
				// 		},
				// 	},
				// },
				upload_ext: {
					type: "array",
					title: vue.$t("label.field_upload_ext"),
					default: undefined,
					items: {
						type: "string",
						examples: ["image"],
					},
				},
				upload_size: {
					type: "string",
					title: vue.$t("label.field_upload_size"),
					maxLength: 12,
				
					
					pattern: "^[\\s]{0,12}[0-9]{0,12}[\\s]{0,12}$",

					"x-options": {
						messages: {
						
							maxLength: vue.$t("message.maxlength_required_12"),
							pattern: vue.$t("message.invalid_value"),

						},
					},
				},
			},
		},
	},
	//table
	{
		viewLeftModel: {},
		viewLeft: {
			type: "object",
			properties: {
				title: {
					type: "string",
					title: vue.$t("label.field_table"),
					readOnly: true,
				},
			},
		},
		name: vue.$t("label.field_table"),
		icon: "mdi-file-plus-outline",
		previewModel: {},
		previewSchema: {
			type: "object",
			properties: {
				title: {
					title: vue.$t("label.field_table"),
					type: "string",
					"x-display": "custom-table",
					displayTable: {
						validation: {
							"SNR HF": {
								path: ".analysis.snr.hf",
								rules: {
									maximum: 999999999999,
									minimum: 0,
									precision: 0,
								},
							},
						},
					},
				},
			},
		},
		configModel: {},
		configSchema: {
			type: "object",
			properties: {
				id: {
					type: "string",
					title: vue.$t("label.id_field_table"),
					default: "",
					maxLength: 255,
					pattern: "^[a-z_0-9]+$",
					"x-options": {
						messages: {
							maxLength: vue.$t("message.maxlength_required_255"),
							pattern: vue.$t("message.msg_code_id"),
						},
					},
				},
				title: {
					type: "string",
					title: vue.$t("label.field_table"),
					default: "",
					maxLength: 255,
					pattern: "\\S+",
					"x-options": {
						messages: {
							maxLength: vue.$t("message.maxlength_required_255"),
							pattern: vue.$t("message.msg_1"),
						},
					},
				},
				Headers: "",
			},
		},
	},
];
export default fields;
