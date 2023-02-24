<template>
	<v-card elevation="0">
		<v-row>
			<v-col cols="6">
				<v-btn elevation="0" text class="mt-2" @click="addRow()">
					<v-icon>mdi-plus</v-icon> {{ $t("button.create") }}
				</v-btn>
			</v-col>
			<v-col cols="6">
				<v-btn
					color="blue darken-2"
					dark
					class="m-2 rounded-0 float-right"
					@click="saveRequest()"
				>
					<v-icon> mdi-content-save </v-icon>
					{{ $t("button.save_form") }}
				</v-btn>
			</v-col>
		</v-row>
		<v-divider></v-divider>
		<v-row class="mt-2">
			<v-col cols="12" md="2" sm="12">
				<v-card elevation="0">
					<VuePerfectScrollbar class="h-[75vh]">
						<Container :get-child-payload="getChildPayload">
							<Draggable
								v-for="(field, index) in fields"
								:key="'field_' + index"
							>
								<!-- :data-index="index" -->
								<v-card
									elevation="0"
									color="grey lighten-3"
									class="
										mb-2
										mx-auto
										text-center
										p-2
										cursor-move
									"
								>
									<!-- <v-btn icon class="mx-auto cursor-move">
										<v-icon x-large>{{
											field.icon
										}}</v-icon>
									</v-btn>
									<br /> -->
									<span>
										{{ field.name }}
									</span>

									<!-- <v-form>
										<v-jsf
											v-model="field.viewLeftModel"
											:schema="field.viewLeft"
											:options="options"
											:key="'field_' + index"
										></v-jsf>
									</v-form> -->
								</v-card>
							</Draggable>
						</Container>
					</VuePerfectScrollbar>
				</v-card>
			</v-col>
			<v-col
				cols="12"
				md="7"
				sm="12"
				class="overflow-y-auto max-h-screen"
			>
				<v-card elevation="0">
					<Container>
						<v-row
							v-for="(row, rowIndex) in form"
							:key="'row_' + rowIndex"
							class="form-row d-flex"
						>
							<v-col
								v-for="(col, colIndex) in row.elements"
								:key="'col_' + rowIndex + '_' + colIndex"
								:cols="col.width"
								@click="config(col, rowIndex, colIndex)"
								:class="getClass(rowIndex, colIndex)"
							>
								<v-card
									elevation="0"
									outlined
									color="grey lighten-4"
									class="m-1 p-2 border-dashed border-[1px]"
								>
									<Container
										@drag-enter="
											onDragEnter(rowIndex, colIndex)
										"
										:should-accept-drop="shouldAcceptDrop"
										@drop="onDrop(col, rowIndex, colIndex)"
									>
										<v-form
											v-if="
												col.field &&
												col.field.previewSchema
											"
									
										>
											<v-jsf
												v-model="col.field.previewModel"
												:schema="
													col.field.previewSchema
												"
												:options="options"
												:key="
													'col_' +
													rowIndex +
													'_' +
													colIndex
												"
											>
												<v-data-table
													v-if="
														col.field.name ==
														$t('label.field_table')
													"
													dense
													:headers="
														search_header(
															rowIndex,
															colIndex,
														)
													"
													:items-per-page="-1"
													class="elevation-1"
												>
													<template
														v-slot:[`item.value`]="{
															item,
														}"
													>
														<v-chip
															:color="
																getColor(item)
															"
															class="ma-2"
															outlined
														>
															<span
																style="
																	font-weight: bold;
																"
																>{{
																	item.value
																}}</span
															>
														</v-chip>
													</template>
												</v-data-table>
											</v-jsf>
										</v-form>
									</Container>
								</v-card>
							</v-col>
							<v-col class="number-col">
								<v-btn
									v-if="toggle[rowIndex]"
									elevation="0"
									color="primary"
									small
									@click="addCol(rowIndex, 1)"
								>
									1
								</v-btn>
								<v-btn
									v-if="toggle[rowIndex]"
									elevation="0"
									color="primary"
									small
									@click="addCol(rowIndex, 2)"
								>
									1/2 + 1/2
								</v-btn>
								<v-btn
									v-if="toggle[rowIndex]"
									elevation="0"
									color="primary"
									small
									@click="addCol(rowIndex, 3)"
								>
									1/3 + 2/3
								</v-btn>
								<v-btn
									v-if="toggle[rowIndex]"
									elevation="0"
									color="primary"
									small
									@click="addCol(rowIndex, 4)"
								>
									1/3 + 1/3 + 1/3
								</v-btn>
								<v-btn
									v-if="toggle[rowIndex]"
									elevation="0"
									color="primary"
									small
									@click="addCol(rowIndex, 5)"
								>
									2/3 + 1/3
								</v-btn>
								<v-btn
									elevation="0"
									small
									class="rounded-0"
									@click="openShowAddCol(rowIndex)"
								>
									<v-icon small
										>mdi-format-align-justify</v-icon
									>
								</v-btn>
							</v-col>
							<v-btn
								elevation="0"
								class="remove-row"
								fab
								dark
								x-small
								color="error"
								@click="removeRow(rowIndex)"
							>
								<v-icon dark> mdi-close </v-icon>
							</v-btn>
							<v-btn
								elevation="0"
								class="push-row"
								fab
								dark
								x-small
								color="blue"
								@click="pushRow(rowIndex)"
							>
								<v-icon dark> mdi-plus </v-icon>
							</v-btn>
						</v-row>
					</Container>
					<v-row>
						<v-col class="text-center mt-2">
							<v-btn
								fab
								dark
								x-small
								class="mx-2"
								color="primary"
								@click="addRow()"
							>
								<v-icon> mdi-plus-circle </v-icon>
							</v-btn>
						</v-col>
					</v-row>
				</v-card>
			</v-col>
			<v-col cols="12" md="3" sm="12" outlined>
				<v-card elevation="0">
					<v-list>
						<v-list-item>
							<v-list-item-content>
								<v-list-item-title
									><strong
										>{{
											$t("label.request_group")
										}}:</strong
									>
									<em
										v-if="
											m_requestDto &&
											m_requestDto.requestGroup
										"
										>{{
											m_requestDto.requestGroup
												.requestGroupName
										}}</em
									>
								</v-list-item-title>
							</v-list-item-content>
						</v-list-item>
					</v-list>
					<v-list>
						<v-list-item>
							<v-list-item-content>
								<v-list-item-title
									><strong
										>{{ $t("label.request_type") }}:</strong
									>
									<em
										v-if="
											m_requestDto &&
											m_requestDto.requestType
										"
										>{{
											m_requestDto.requestType
												.requestTypeName
										}}</em
									>
								</v-list-item-title>
							</v-list-item-content>
						</v-list-item>
					</v-list>
				</v-card>
				<v-card elevation="0" class="p-2 mt-4">
					<v-row>
						<VuePerfectScrollbar class="h-[65vh]">
							<v-col cols="12">
								<v-form
									v-if="selected.field"
									ref="form"
								v-model="valid"
								>
									<v-jsf
										v-model="selected.field.configModel"
										:schema="selected.field.configSchema"
										:options="options"
									/>
								</v-form>
								<v-form
									v-if="
										selected.field &&
										selected.field.name ==
											$t('label.field_table')
									"
									
								>
									<h3 class="mb-4">
										{{ $t("label.title_configuration") }}
									</h3>
									<v-divider></v-divider>
									<div
										v-for="(item, index) of search_header(
											rowIndex,
											colIndex,
										)"
										:key="index"
									>
										<v-row>
											<v-col cols="12">
												{{ item.value }}
												<v-btn
													elevation="0"
													icon
													@click="
														addTableColumn(
															search_header(
																rowIndex,
																colIndex,
															),
															index,
														)
													"
												>
													<v-icon
														color="blue darken-2"
													>
														mdi-plus-circle
													</v-icon>
												</v-btn>
												<v-btn
													elevation="0"
													icon
													@click="
														removeTableColumn(
															search_header(
																rowIndex,
																colIndex,
															),
															index,
														)
													"
												>
													<v-icon
														color="red darken-2"
													>
														mdi-delete-circle
													</v-icon>
												</v-btn>
											</v-col>
											<v-col cols="12">
												<v-text-field
													v-model="item.text"
													:label="
														$t(
															'label.column_header_name',
														) +
														(index + 1)
													"
													dense
													@keyup="textToValue(item)"
													outlined
													required
													maxLength="255"
													hide-details
												></v-text-field>
											</v-col>
											<v-col cols="12">
												<v-combobox
													:label="
														$t('label.datatypes')
													"
													v-model="item.type"
													:items="itemsType"
													outlined
													dense
													hide-details
												></v-combobox>
											</v-col>
											<v-col cols="12">
												<v-text-field
													:label="
														$t('label.value_field')
													"
													v-model="item.value2"
													outlined
													dense
													maxLength="255"
													hide-details
												></v-text-field>
											</v-col>
											<v-col cols="12">
												<v-text-field
													:label="$t('label.width')"
													v-model.trim="item.width"
													outlined
													:rules="[rules.isNumber]"
													dense
													maxLength="255"
													
												></v-text-field>
											</v-col>
											<v-col cols="12">
												<v-combobox
													:label="$t('label.field_category')"
													v-model="item.category"
													:items="root"
													item-text="name"
													:item-value="item => item.name"
													outlined
													dense
													maxLength="255"
													
												></v-combobox>
											</v-col>
											<v-col cols="12">
												<v-checkbox
													v-model="item.auto"
													:label="
														$t(
															'label.auto_increament',
														)
													"
													hide-details
												></v-checkbox>
											</v-col>
											<v-col cols="12">
												<v-checkbox
													v-model="item.sum"
													:label="$t('label.sum')"
													hide-details
												></v-checkbox>
											</v-col>
										</v-row>
									</div>
									<v-divider class="my-4"></v-divider>
									<div class="d-flex my-4">
										<v-btn
											elevation="0"
											class="mx-4"
											small
											@click="
												addHeader(rowIndex, colIndex)
											"
											outlined
										>
											{{ $t("label.add_title") }}
										</v-btn>
										<v-btn
											elevation="0"
											class="mx-4"
											small
											@click="
												removeHeader(rowIndex, colIndex)
											"
											outlined
										>
											{{ $t("label.remove_title") }}
										</v-btn>
									</div>
								</v-form>
							</v-col>
						</VuePerfectScrollbar>
					</v-row>
				</v-card>
			</v-col>
		</v-row>
	</v-card>
</template>

<script>
import { Container, Draggable } from "vue-dndrop/dist/vue-dndrop";
import VJsf from "@koumoul/vjsf/lib/VJsf.js";
import "@koumoul/vjsf/lib/VJsf.css";
import "@koumoul/vjsf/lib/deps/third-party.js";
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import RequestDto from "@/models/request.dto";
import fields from "@/common/fields";
import globalService from "@/services/global.service";
import administratorAPI from "@/views/modules/administrator/administrator.api";
import constant from "@/common/constant";
export default {
	name: "EditRequestDetailVue",
	props: {
		requestDto: RequestDto,
	},
	components: {
		Container,
		Draggable,
		VJsf,
		VuePerfectScrollbar,
	},
	watch: {
		requestDto(value) {
			this.m_requestDto = value;
		},
		"selected.field.configModel": function (value) {
			if (value) {
				if (
					value.title !=
					this.form[this.rowIndex].elements[this.colIndex].field
						.previewSchema.properties.title.title
				) {
					value.id = this.getIdFromValue(value.title);
				}
				this.autoChangeFieldNamePreview();
			}
		},
	},
	async created() {
		this.$Progress.start();
	},
	async mounted() {
		await this.$Progress.finish();
		await this.initialize();
	},
	data() {
		return {
			valid: null,
			m_requestDto: RequestDto,
			user_current: this.getUserInfo(),
			dateFormat: "DD/MM/yyyy",
			selected: {},
			rowIndex: null,
			colIndex: null,
			col: {},
			modelTarget: {},
			selectedItem: {},
			selected_row: 0,
			selected_col: 0,
			itemid: this.$route.params.id,
			requestTypes: {},
			toggle: [],
			fields: fields,
			desserts: [],
			root: [],
			raw: [],
			truong_quanhe: [],
			form: [],
			response_eForm_Id: null,
			options: {
				fieldProps: {
					outlined: "outlined",
					dense: "dense",
				},
			},
			tableSrc: null,
			headers: [],
			header_select: [],
			itemsType: [
				constant.type.number,
				constant.type.string,
				"combobox",
				constant.type.date,
				constant.type.file,
				constant.type.material,
				constant.type.vendor,
			],
			measurementErrors: [],
			displayTableError: [],
			check_fieldId_duplicate: false,
			rules: {
				isNumber: (value) =>
					/^[0-9]{0,12}?$/.test(value?.trim()) ||
					!value ||
					this.$t("message.rule_is_number"),
			},
		};
	},
	methods: {
		//loop textarea cbo
		buildArrFromTextArea(textAreaVal) {
			let retArr = [];

			if (textAreaVal.trim()) {
				textAreaVal.split("\n").forEach((elem) => {
					retArr.push({
						const: elem,
						title: elem,
					});
				});
			}

			return retArr;
		},
		//merge deep
		mergeDeep(...objects) {
			const isObject = (obj) => obj && typeof obj === "object";

			return objects.reduce((prev, obj) => {
				Object.keys(obj).forEach((key) => {
					const pVal = prev[key];
					const oVal = obj[key];

					if (Array.isArray(pVal) && Array.isArray(oVal)) {
						prev[key] = pVal.concat(...oVal);
					} else if (isObject(pVal) && isObject(oVal)) {
						prev[key] = this.mergeDeep(pVal, oVal);
					} else {
						prev[key] = oVal;
					}
				});

				return prev;
			}, {});
		},
		async initialize() {
			try {
				this.m_requestDto = this.requestDto;
				await this.getAllCategoryGroup();
				await this.getFormForm();
				this.finishLoad();
			} catch (error) {
				this.errorLoad(error);
			}
		},
		async getAllCategoryGroup() {
			let response;
			try {
				response = await globalService.getData_Async(
					administratorAPI.API_GetAllCategoryGroupHasChild(),
				);
				if (!response) {
					this.errorLoad();
					return;
				}
				if (!response.state) {
					this.errorLoad();
					return;
				}
				this.raw = response.data;

				this.raw = this.raw.map((entry) => {
					return {
						...entry,
						title: entry.name,
						const: `${entry.id}`,
					};
				});
				this.root = response.data
					.filter((entry) => {
						return !entry.isDelete;
					})
					.map((entry) => {
						return {
							...entry,
							children: [],
							title: entry.name,
							const: `${entry.id}`,
						};
					});
				let children = response.data.filter((entry) => {
					return !!entry.parent && !entry.isDelete;
				});

				let rerun = [];
				for (let child of children) {
					let parent = this.findParent(child.parent.id, this.root);
					if (!parent) {
						if (
							children.find((entry) => {
								return child.parent.id == entry.id;
							})
						) {
							rerun.push(child);
						}
						continue;
					}
					if (!child.children) {
						child.children = [];
					}
					parent.children.push(child);
				}
				for (let child of rerun) {
					let parent = this.findParent(child.parent.id, this.root);
					if (!parent) {
						if (
							children.find((entry) => {
								return child.parentId == entry.id;
							})
						) {
							rerun.push(child);
						}
						continue;
					}
					if (!child.children) {
						child.children = [];
					}
					parent.children.push(child);
				}
			} catch (error) {
				this.errorLoad(error);
			}
		},

		findParent(parentId, root) {
			for (let entry of root) {
				if (entry.id == parentId) {
					return entry;
				}
				if (!entry.children || !entry.children.length) {
					continue;
				}
				let result = this.findParent(parentId, entry.children);
				if (!result) {
					continue;
				} else {
					return result;
				}
			}
		},
		onDrop(col, rowIndex, colIndex) {
			this.selected = {};
			this.form[this.selected_row].elements[this.selected_col].field =
				Object.assign({}, this.selectedItem);
			this.selected =
				this.form[this.selected_row].elements[this.selected_col];
			this.form[this.selected_row].elements[
				this.selected_col
			].field.name = this.selectedItem.name;

			if (
				col.field.name == this.$t("label.field_table") &&
				rowIndex == this.selected_row &&
				colIndex == this.selected_col
			) {
				let check = 0;
				for (let i in this.headers) {
					if (
						this.headers[i].isRow == rowIndex &&
						this.headers[i].isCol == colIndex
					) {
						this.headers[i].isHeader = [
							{
								text: "Col 1",
								value: "col_1",
								type: "string",
								title: "",
								value2: "",
								category: ""
							},
						];
						check = check + 1;
						break;
					}
				}
				if (check == 0) {
					this.headers.push({
						isRow: rowIndex,
						isCol: colIndex,
						isHeader: [
							{
								text: "Col 1",
								value: "col_1",
								type: "string",
								title: "",
								value2: "",
								category: ""
							},
						],
					});
				}
			}
			if (
				rowIndex != this.selected_row ||
				colIndex != this.selected_col
			) {
				this.config(
					this.form[this.selected_row].elements[this.selected_col],
					this.selected_row,
					this.selected_col,
				);
			} else {
				this.config(col, rowIndex, colIndex);
			}
		},
		shouldAcceptDrop() {
			return true;
		},
		addRow() {
			this.selected = {};
			let tmp = {
				elements: [
					{
						width: 12,
						field: {},
					},
				],
			};
			this.toggle.push(false);
			this.form.push(tmp);
		},
		addCol(rowIndex, type) {
			this.selected = {};
			let widths = [];
			switch (type) {
				case 1:
					widths = [12];
					break;
				case 2:
					widths = [6, 6];
					break;
				case 3:
					widths = [4, 8];
					break;
				case 4:
					widths = [4, 4, 4];
					break;
				case 5:
					widths = [8, 4];
					break;
			}
			if (this.form.length > 0) {
				if (this.form[rowIndex].elements.length < widths.length) {
					for (let i = 0; i < widths.length; i++) {
						if (this.form[rowIndex].elements.length >= i + 1) {
							if (this.form[rowIndex].elements[i].field != {}) {
								this.form[rowIndex].elements[i].width =
									widths[i];
							}
						} else if (
							this.form[rowIndex].elements.length <
							i + 1
						) {
							this.form[rowIndex].elements.push({
								width: widths[i],
								field: {},
							});
						}
					}
				}
				if (this.form[rowIndex].elements.length > widths.length) {
					this.form[rowIndex].elements = this.form[
						rowIndex
					].elements.slice(0, widths.length);
					for (let i = 0; i < widths.length; i++) {
						this.form[rowIndex].elements[i].width = widths[i];
					}
				}
				if (this.form[rowIndex].elements.length == widths.length) {
					for (let i = 0; i < widths.length; i++) {
						this.form[rowIndex].elements[i].width = widths[i];
					}
				}
				this.toggle[rowIndex] = false;
			}
		},

		removeRow(rowIndex) {
			this.form.splice(rowIndex, 1);
			this.headers = this.headers.filter((ele) => {
				return ele.isRow != rowIndex;
			});
			for (let i in this.headers) {
				if (this.headers[i].isRow > rowIndex) {
					this.headers[i].isRow = this.headers[i].isRow - 1;
				}
			}
		},
		pushRow(rowIndex) {
			this.selected = {};
			let tmp = {
				elements: [
					{
						width: 12,
						field: {},
					},
				],
			};
			this.toggle.push(false);
			this.form.splice(rowIndex + 1, 0, tmp);
			for (let i in this.headers) {
				if (this.headers[i].isRow > rowIndex) {
					this.headers[i].isRow = this.headers[i].isRow + 1;
				}
			}
		},
		onDragEnter(rowIndex, colIndex) {
			this.selected_row = rowIndex;
			this.selected_col = colIndex;
		},
		getChildPayload(index) {
			let check = 0;
			for (const itemRow of this.form) {
				for (const itemCol of itemRow.elements) {
					if (itemCol.field.configModel == undefined) {
						check = check + 1;
						break;
					}
				}
			}
			if (check == 0) {
				this.addRow();
			}
			this.selectedItem = this.cloneObject({}, this.fields[index]);
		},
		search_header(rowIndex, colIndex) {
			for (const header of this.headers) {
				if (header.isRow == rowIndex && header.isCol == colIndex) {
					return header.isHeader;
				}
			}
		},
		cloneObject(targetObject, sourceObject) {
			if (!sourceObject) return {};
			targetObject = Object.assign({}, sourceObject);
			for (let prop in sourceObject) {
				if (typeof sourceObject[prop] == "object") {
					targetObject[prop] = this.cloneObject(
						targetObject[prop],
						sourceObject[prop],
					);
				}
			}
			return targetObject;
		},
		openShowAddCol(rowIndex) {
			this.toggle.push(false);
			this.toggle[rowIndex] = !this.toggle[rowIndex];
		},

		config(col, rowIndex, colIndex) {
			if (!col?.field?.configModel) {
				return;
			}
			this.selected = {};
			this.col = col;
			this.rowIndex = rowIndex;
			this.colIndex = colIndex;
			this.truong_quanhe = [];
			for (const form_row of this.form) {
				for (const form_col of form_row.elements) {
					if (form_col?.field?.configModel) {
						this.truong_quanhe.push({
							const: form_col.field.configModel.id,
							title: form_col.field.configModel.title,
						});
					}
				}
			}
			this.selected = col;
			if (!this.selected?.field) {
				return;
			}
			if (!this.selected?.field?.configModel) {
				return;
			}
			if (!this.selected?.field?.configModel?.id) {
				this.selected.field.configModel.id = this.getIdFromValue(
					col.field.previewSchema.properties.title.title,
				);
			}
			if (!this.selected.field.configModel.title) {
				this.selected.field.configModel.title =
					col.field.previewSchema.properties.title.title;
			}
			if (
				col.field.name == this.$t("label.field_autotext") ||
				col.field.name == this.$t("label.field_select") ||
				col.field.name == this.$t("label.field_combobox")
			) {
				if (
					this.selected?.field?.configSchema?.properties?.category
						?.oneOf
				) {
					this.selected.field.configSchema.properties.category.oneOf =
						this.root;
				}
				if (
					this.selected?.field?.configSchema?.properties?.filter
						?.oneOf
				) {
					this.selected.field.configSchema.properties.filter.oneOf =
						this.truong_quanhe;
				}
			}
			if (col.field.name == this.$t("label.field_text")) {
				this.selected.field.configSchema.properties.pattern["anyOf"] = [
					{
						const: `^(([^<>()\\[\\]\\.,;:\\s@"]+(\\.[^<>()\\[\\]\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,24}))$`,
						title: "Định dạng email",
					},
					{
						const: `^[0-9]{1,3}(\\.[0-9]{0,1})?$`,
						title: "Định dạng số thập phân 000.0",
					},
					{},
				];
			}
			if (col.field.name == this.$t("label.field_textarea")) {
				this.selected.field.configSchema.properties.pattern["anyOf"] = [
					{
						const: `^(([^<>()\\[\\]\\.,;:\\s@"]+(\\.[^<>()\\[\\]\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,24}))$`,
						title: "Định dạng email",
					},
					{
						const: `^[0-9]{1,3}(\\.[0-9]{0,1})?$`,
						title: "Định dạng số thập phân 000.0",
					},
					{},
				];
			}
			if (col.field.name == this.$t("label.field_file")) {
				this.selected.field.configSchema.properties.upload_ext.items.examples =
					["image"];
			}
		},
		saveItemForm() {
			
			for (const form_row of this.form) {

				for (const form_col of form_row.elements) {
					if (form_col.field?.configModel) {
						for (let key of Object.keys(
							form_col.field.configModel,
						)) {
							if (
								form_col.field.configModel[key] != null &&
								form_col.field.configModel[key] != "" &&
								form_col.field.configModel[key] != undefined &&
								typeof form_col.field.configModel[key] ==
									"string"
							) {
								form_col.field.configModel[key] =
									form_col.field.configModel[key].trim();
							}
						}
					}
				}
			}
			for (const formRow of this.form) {
				if (formRow.elements.length == 0) {
					let indexRow = this.form.indexOf(formRow);
					this.form.splice(indexRow, 1);
					for (let i in this.headers) {
						if (this.headers[i].isRow > indexRow) {
							this.headers[i].isRow = this.headers[i].isRow - 1;
						}
					}
				} else {
					let tables = [];
					let indexTables = [];
					let indexRow = this.form.indexOf(formRow);
					let elements_old = formRow.elements;
					formRow.elements = formRow.elements.filter((ele) => {
						return ele.field.previewSchema;
					});
					let elements_new = formRow.elements;

					for (let i in formRow.elements) {
						if (
							formRow.elements[i].field.name ==
							this.$t("label.field_table")
						) {
							indexTables.push(i);
						}
					}

					tables = this.headers.filter((ele) => {
						return ele.isRow == indexRow;
					});

					if (tables.length > 0) {
						tables = tables.sort((a, b) => {
							return a.isCol - b.isCol;
						});
					}

					this.headers = this.headers.filter((ele) => {
						return ele.isRow != indexRow;
					});

					for (let i in indexTables) {
						tables[i].isCol = indexTables[i];
					}
					this.headers.push(...tables);
					if (elements_old.length != elements_new.length) {
						if (formRow.elements.length == 1) {
							for (const formCol of formRow.elements) {
								formCol.width = 12;
							}
						}
						if (formRow.elements.length == 2) {
							for (const formCol of formRow.elements) {
								formCol.width = 6;
							}
						}
						if (formRow.elements.length == 3) {
							for (const formCol of formRow.elements) {
								formCol.width = 4;
							}
						}
					}
				}
			}
			for (const form_row of this.form) {
				let checkForm = 0;
				for (const form_col of form_row.elements) {
					if (
						form_col.field.previewSchema != undefined &&
						form_col.field.previewSchema.properties != undefined
					) {
						form_col.field.previewSchema.properties.title.title =
							form_col.field.configModel.title;
					} else {
						checkForm = checkForm + 1;
					}
					//loop textArea
					if (
						form_col.field.name ==
							this.$t("label.field_autotext") ||
						form_col.field.name == this.$t("label.field_select")
					) {
						if (
							Object.prototype.hasOwnProperty.call(
								form_col.field.previewSchema.properties.title,
								"oneOf",
							)
						) {
							form_col.field.configModel.oneOf =
								this.buildArrFromTextArea(
									form_col.field.configModel.value,
								);
						}
					}
					if (
						form_col.field.name == this.$t("label.field_combobox")
					) {
						if (
							Object.prototype.hasOwnProperty.call(
								form_col.field.previewSchema.properties.title,
								"anyOf",
							)
						) {
							form_col.field.configModel.anyOf =
								this.buildArrFromTextArea(
									form_col.field.configModel.value,
								);
							form_col.field.configModel.anyOf.push({});
						}
					}
				}
			}
			for (const form_row of this.form) {
				for (const form_col of form_row.elements) {
					if (form_col.field.name == this.$t("label.field_table")) {
							if (this.$refs?.form) {
							if (!this.$refs?.form.validate()) {
								return this.toastError(
									this.$t("message.information_fasle"),
								);
							}
						}
						for (let i in this.headers) {
							if (
								this.headers[i].isRow ==
									this.form.indexOf(form_row) &&
								this.headers[i].isCol ==
									form_row.elements.indexOf(form_col)
							) {
								for (let j in this.headers[i].isHeader) {
									this.headers[i].isHeader[j].text =
										this.headers[i].isHeader[
											j
										].text?.trim();
								}
								form_col.field.configSchema.properties.Headers =
									JSON.stringify(this.headers[i].isHeader);
								form_col.field.configModel.Headers =
									JSON.stringify(this.headers[i].isHeader);
							}
						}
					}
				}
			}
		},
		async saveEForm() {
			try {
				if (this.$refs?.form) {
					if (!this.$refs?.form.validate()) {
						return this.toastError(
							this.$t("message.information_fasle"),
						);
					}
				}
				await this.saveItemForm();
				let arr_fieldId = [];
				this.check_fieldId_duplicate = false;
				let duplicateName = [];
				for (let form_row of this.form) {
					for (let form_col of form_row.elements) {
						if (form_col.field.configModel) {
							if (
								arr_fieldId.indexOf(
									form_col.field.configModel.id,
								) === -1
							) {
								arr_fieldId.push(form_col.field.configModel.id);
							} else {
								this.check_fieldId_duplicate = true;
								duplicateName.push(
									form_col.field.configModel.title,
								);
								// break;
							}
						}
					}
				}
				if (this.check_fieldId_duplicate) {
					this.toastError(
						this.$t("message.field_in_eform_duplicate") +
							": " +
							duplicateName.join(","),
					);
					return;
				}
				let listFieldTemp = [];
				let eForm = {
					id: null,
					created: { id: this.user_current.id },
					createdDate: new Date(),
					createdName: this.user_current.name,
					description: "",
					eFormCode: "",
					eFormName: "",
					fields: [],
					isActive: true,
					isDelete: true,
					modified: { id: this.user_current.id },
					modifiedDate: new Date(),
					modifiedName: this.user_current.name,
					objectModel: "",
					objectSchema: JSON.stringify(this.form),
					option: "",
					tennantCode: "",
					tennantName: "",
				};
				let response_eForm = await globalService.postData_Async(
					`/api/forms`,
					eForm,
				);
				if (response_eForm) {
					this.response_eForm_Id = response_eForm.data.id;
					this.$emit("save", {
						eformId: this.response_eForm_Id,
						form_: this.form,
						save: true,
					});
				}

				if (response_eForm.state) {
					let stt = 1;
					for (let row in this.form) {
						if (Array.isArray(this.form[row].elements)) {
							for (let col in this.form[row].elements) {
								if (
									this.form[row].elements[col].field
										.previewSchema
								) {
									let schema = Object.assign(
										{},
										this.form[row].elements[col].field
											.previewSchema.properties,
									);
									schema.title = {
										...schema.title,
										...this.form[row].elements[col].field
											.configModel,
									};
									if (
										Object.prototype.hasOwnProperty.call(
											schema.title,
											"oneOf",
										) &&
										typeof schema.title.oneOf == "object"
									) {
										schema.title.oneOf =
											this.buildArrFromTextArea(
												this.form[row].elements[col]
													.field.configModel.value,
											);
									}
									if (
										Object.prototype.hasOwnProperty.call(
											schema.title,
											"anyOf",
										) &&
										typeof schema.title.anyOf == "object"
									) {
										schema.title.anyOf =
											this.buildArrFromTextArea(
												this.form[row].elements[col]
													.field.configModel.value,
											);
										schema.title.anyOf.push({});
									}
									if (!schema) schema = {};
									let fieldInEForm = {
										id: null,
										fieldInFormCode:
											this.form[row].elements[col].field
												.configModel.id,
										fieldInFormName:
											this.form[row].elements[col].field
												.configModel.title,
										objectSchema: JSON.stringify({
											"x-cols":
												this.form[row].elements[col]
													.width,
											...this.mergeDeep({}, schema),
										}),
										objectModel: JSON.stringify({}),
										option: this.form[row].elements[col]
											.field.configModel.value
											? JSON.stringify(
													this.form[row].elements[col]
														.field.configModel
														.value,
											  )
											: "",
										description: "",
										nameOfField: schema.title.title,
										fieldPattern: null,
										required: null,
										order: stt,
										createdName: this.user_current.name,
										createdDate: new Date(),
										modifiedName: this.user_current.name,
										modifiedDate: new Date(),
										row: row,
										col: col,
										tennantCode: this.form[row].elements[
											col
										].field.configSchema.properties.Headers
											? "truong_bang"
											: this.form[row].elements[col].field
													.configSchema.properties
													.upload_ext
											? "truong_file"
											: "",
										tennantName: this.form[row].elements[
											col
										].field.configSchema.properties.Headers
											? "Trường bảng"
											: this.form[row].elements[col].field
													.configSchema.properties
													.upload_ext
											? "Trường File"
											: "",
										created: {
											id: this.user_current.id,
										},
										modified: {
											id: this.user_current.id,
										},
										form: {
											id: response_eForm.data.id,
										},
									};
									listFieldTemp.push(fieldInEForm);
									stt++;
									let response_fields =
										await globalService.postData_Async(
											`/api/field-in-forms`,
											fieldInEForm,
										);
									if (!response_fields) return;
								}
							}
						}
					}
				} else {
					this.toastError(this.$t("message.update_error"));
				}
			} catch (error) {
				console.log(error);
			}
		},

		async getFormForm() {
			try {
				if (!this.m_requestDto.form || !this.m_requestDto.form.id)
					return;
				let response_All_Fields = await globalService.getData_Async(
					`/api/forms/${this.m_requestDto.form.id}`,
				);
				this.form = JSON.parse(response_All_Fields.data.objectSchema);
				for (const form_row of this.form) {
					for (const form_col of form_row.elements) {
						if (
							form_col.field.name == this.$t("label.field_table")
						) {
							this.headers.push({
								isRow: this.form.indexOf(form_row),
								isCol: form_row.elements.indexOf(form_col),
								isHeader: JSON.parse(
									form_col.field.configSchema.properties
										.Headers,
								),
							});
						}
					}
				}
				for (const form_row of this.form) {
					for (const form_col of form_row.elements) {
						if (
							form_col.field.name ==
								this.$t("label.field_autotext") ||
							form_col.field.name ==
								this.$t("label.field_select") ||
							(form_col.field.name ==
								this.$t("label.field_combobox") &&
								form_col.configSchema.properties)
						) {
							form_col.configSchema.properties.category[
								"default"
							] = this.root.find((ele) => {
								parseInt(ele.const) ==
									parseInt(
										form_col.field.configModel.category,
									);
							}).name;
						}
					}
				}

				if (this.form.length > 0) {
					this.config(this.form[0].elements[0], 0, 0);
				}
			} catch (error) {
				console.log(error);
			}
		},

		getColor(tableRecord) {
			if (
				tableRecord.value > tableRecord.max ||
				tableRecord.value < tableRecord.min
			) {
				return "red";
			} else {
				return "#81c784";
			}
		},
		shorten(inText, maxLength = 200) {
			if (inText.length > maxLength) {
				return inText.substring(0, maxLength) + "...";
			} else {
				return inText;
			}
		},
		async saveRequest() {
			try {
				await this.saveEForm();
				if (this.check_fieldId_duplicate) {
					return;
				}
				this.m_requestDto.form = {
					id: null,
				};
				if (!this.response_eForm_Id) {
					return;
				}
				this.m_requestDto.form.id = this.response_eForm_Id;
				let response_quest = await globalService.putData_Async(
					"/api/requests/" + this.m_requestDto.id,
					this.m_requestDto,
				);
				if (response_quest) {
					this.toastSuccess(this.$t("message.save_success"));
				} else {
					this.toastError(this.$t("message.error"));
				}
			} catch (error) {
				console.log(error);
			}
		},
		addHeader(rowIndex, colIndex) {
			rowIndex = this.rowIndex;
			colIndex = this.colIndex;
			for (let i in this.headers) {
				if (
					this.headers[i].isRow == rowIndex &&
					this.headers[i].isCol == colIndex
				) {
					this.headers[i].isHeader.push({
						text: "new col",
						value: "new_col",
						type: "string",
						title: "",
						value2: "",
						category: ""
					});
				}
			}
		},
		removeHeader(rowIndex, colIndex) {
			rowIndex = this.rowIndex;
			colIndex = this.colIndex;
			for (let i in this.headers) {
				if (
					this.headers[i].isRow == rowIndex &&
					this.headers[i].isCol == colIndex
				) {
					this.headers[i].isHeader.pop();
				}
			}
		},
		getClass(rowIndex, colIndex) {
			return this.rowIndex == rowIndex && this.colIndex == colIndex
				? "grey lighten-2 rounded-lg border-dashed border-[1px] border-gray-500"
				: "white";
		},
		textToValue(item) {
			item.value = this.getIdFromValue(item.text);
		},
		autoChangeFieldNamePreview() {
			if (!this.selected?.field) {
				return;
			}
			this.form[this.rowIndex].elements[
				this.colIndex
			].field.configSchema = this.selected.field.configSchema;
			this.form[this.rowIndex].elements[
				this.colIndex
			].field.previewSchema.properties.title.title =
				this.selected.field.configModel.title;
			if (
				this.seleted.field.name == this.$t("label.field_text") ||
				this.seleted.field.name == this.$t("label.field_textarea")
			) {
				if (this.selected.field.configModel["maxLength"]) {
					this.form[this.rowIndex].elements[
						this.colIndex
					].field.previewSchema.properties.title["maxLength"] =
						parseFloat(this.selected.field.configModel.maxLength);
				}
				if (this.selected.field.configModel["minLength"]) {
					this.form[this.rowIndex].elements[
						this.colIndex
					].field.previewSchema.properties.title["minLength"] =
						parseFloat(this.selected.field.configModel.minLength);
				}
			}
		},
		addTableColumn(table, index) {
			table.splice(index + 1, 0, {});
		},
		removeTableColumn(table, index) {
			table.splice(index, 1);
		},
	},
};
</script>
<style>
.scroll-area {
	position: relative;
	margin: auto;
	height: 80vh;
	padding: 0.5em;
}

.form-row {
	position: relative;
}

.remove-row {
	display: none;
	position: absolute;
	top: 0;
	left: 0;
}

.push-row {
	display: none;
	position: absolute;
	bottom: 0;
	left: 0;
}

.number-col {
	display: none;
	justify-content: end;
	gap: 4px;
	align-items: flex-start;
	position: absolute;
	top: 0;
	right: 0;
	padding: 0;
}

.form-row:hover .number-col {
	display: flex;
}

.form-row:hover .remove-row {
	display: flex;
}

.form-row:hover .push-row {
	display: flex;
}

/* .v-select-list,
.v-list {
	max-width: 30vw !important;
} */
</style>
