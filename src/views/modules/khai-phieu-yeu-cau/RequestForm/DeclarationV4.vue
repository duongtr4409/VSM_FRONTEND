<template>
	<v-card elevation="0" v-if="m_requestDto">
		<fileEditor class="d-none"></fileEditor>
		<fileRenderer class="d-none"></fileRenderer>
		<v-dialog v-model="openSaveFieldData" max-width="26vw" persistent>
			<!-- <SaveFieldDataVue
				@close="onCloseDeleteDialog"
				@save="comfirmSaveField"
			/> -->
			<SaveFieldDataVue
				@close="onCloseDeleteDialog"
				@save="saveFieldData(true)"
			/>
		</v-dialog>
		<v-dialog width="60vw" v-model="openFileRequestData" persistent>
			<FileRequestData
				:requestDataV2="m_requestDto"
				@close="onClose"
				@save="onSaveFile"
			/>
		</v-dialog>
		<v-dialog width="20vw" persistent>
			<ComboboxCellEditorsVue :material_="material" />
		</v-dialog>
		<v-dialog v-model="dialog.check_material" width="500">
			<v-card>
				<v-card-title class="text-h5 grey lighten-2">
					{{ $t("check_material_title") }}
				</v-card-title>
				<v-card-text class="mt-4">
					<p class="font-weight-black">
						{{ $t("total_fail_value") }} : {{ total_fail_value }}
					</p>
					<p>{{ $t("summary") }}:</p>
					<p>
						<span class="font-weight-black">{{
							$t("total_greater_value")
						}}</span>
						: {{ total_greater_value }}
					</p>
					<p>
						<span class="font-weight-black">{{
							$t("total_less_value")
						}}</span>
						: {{ total_less_value }}
					</p>

					<p>
						<span class="font-weight-black">
							{{ $t("unknow_value") }}
						</span>
						: {{ unknown_value }}
					</p>
				</v-card-text>
				<v-divider></v-divider>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn
						color="primary"
						text
						@click="dialog.check_material = false"
					>
						{{ $t("close") }}
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
		<v-dialog v-model="dialog.check_material_me" width="500">
			<v-card>
				<v-card-title class="text-h5 grey lighten-2">
					{{ $t("check_material_title") }}
				</v-card-title>
				<v-card-text class="mt-4">
					<!-- good -->
					<p class="font-weight-black">1. Đối với vật tư, vật liệu</p>
					<p class="font-weight-black ml-2">
						{{ $t("total_fail_value") }} :
						{{ me_goods_total_fail_value }}
					</p>
					<p class="ml-4">{{ $t("summary") }}:</p>
					<p class="ml-4">
						<span>{{ $t("total_greater_value") }}</span>
						: {{ me_goods_total_greater_value }}
					</p>
					<p class="ml-4">
						<span>{{ $t("total_less_value") }}</span>
						: {{ me_goods_total_less_value }}
					</p>

					<p class="ml-4">
						<span>
							{{ $t("unknow_value") }}
						</span>
						: {{ me_unknown_value }}
					</p>
					<!-- human resource -->
					<p class="font-weight-black">2. Đối với nhân công</p>
					<p class="font-weight-black ml-2">
						{{ $t("total_fail_value") }} :
						{{ me_human_total_fail_value }}
					</p>
					<p class="ml-4">{{ $t("summary") }}:</p>
					<p class="ml-4">
						<span>{{ $t("total_greater_value") }}</span>
						: {{ me_human_total_greater_value }}
					</p>
					<p class="ml-4">
						<span>{{ $t("total_less_value") }}</span>
						: {{ me_human_total_less_value }}
					</p>

					<p class="ml-4">
						<span>
							{{ $t("unknow_value") }}
						</span>
						: {{ me_unknown_value }}
					</p>
				</v-card-text>
				<v-divider></v-divider>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn
						color="primary"
						text
						@click="dialog.check_material_me = false"
					>
						{{ $t("close") }}
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
		<!-- <v-dialog width="20vw" persistent>
			<DateCellEdittorVue :material_="material" />
		</v-dialog> -->
		<!-- <v-dialog max-width="60vw" v-model="openAttachmentFilePDF" persistent>
			<ExportfileVue
				@close="onClose"
				@save="onSaveDownLoadFile"
				:requestDataV2="m_requestDto"
				:attachmentFile="attachmentFilePDF"
				:stepDataRequest="stepData"
			></ExportfileVue>
		</v-dialog> -->
		<v-dialog
			width="60vw"
			v-model="openAttachmentFileRequestData"
			persistent
		>
			<AttachmentFileRequestData
				@close="onClose"
				:requestDataV2="m_requestDto"
				@save="onSaveFileAta"
			>
			</AttachmentFileRequestData>
		</v-dialog>
		<v-dialog
			max-width="60vw"
			v-model="openUserInfosRequestData"
			persistent
		>
			<UserInfosRequestData
				@save="onSave"
				@close="onClose"
			></UserInfosRequestData>
		</v-dialog>
		<v-dialog max-width="80vw" v-model="openRelateRequestData" persistent>
			<RelateRequestData
				@close="onClose"
				@saveRelate="onSaveRelate"
			></RelateRequestData>
		</v-dialog>
		<v-dialog width="80vw" v-model="dialogSite" persistent>
			<ListSite
				@close="onClose"
				:idRequest="idView"
				@saveSite="onSaveSite"
			>
			</ListSite>
		</v-dialog>
		<v-dialog fullscreen v-model="openViewAttachmentFile" persistent>
			<ViewAttachmentFile
				@close="onClose"
				@saveRelate="onSaveRelate"
				:attachmentFile="idView"
			>
			</ViewAttachmentFile>
		</v-dialog>
		<v-dialog fullscreen v-model="openViewTemplateForm" persistent>
			<ViewAttachmentFile
				@close="onClose"
				:attachmentFile="idTemplateForm"
			>
			</ViewAttachmentFile>
		</v-dialog>
		<v-row class="p-0">
			<v-col cols="12" md="9">
				<v-col
					class="flex justify-end"
					v-if="
						m_requestDto.signTypeCode === '0' ||
						m_requestDto.signTypeCode === '1'
					"
				>
					{{ $t("label.guest") }}:
					<span class="ml-8"
						><strong>{{
							`Xem(${signData.numberView})`
						}}</strong></span
					>
					<span class="ml-8"
						><strong>{{
							`In(${signData.numberPrint})`
						}}</strong></span
					>
					<span class="ml-8"
						><strong>{{
							`Ký số(${signData.numberSign})`
						}}</strong></span
					>
					<span class="ml-8"
						><strong>{{
							`Tải xuống(${signData.numberDownload})`
						}}</strong></span
					>
				</v-col>
				<v-row class="my-4 p-2">
					<v-col cols="12" md="2">
						<span class="text-black text-base"
							>{{ $t("label.mail_template_subject") }} :</span
						>
					</v-col>
					<v-col cols="12" md="9">
						<v-text-field
							v-if="isEdit"
							v-model="m_requestDto.title"
							class="mt-2"
							outlined
							dense
							maxLength="255"
						>
						</v-text-field>
						<span v-else>
							{{ m_requestDto.title }}
						</span>
					</v-col>

					<v-col cols="1" md="1" v-if="isEdit">
						<v-btn
							color="green darken-1"
							icon
							@click="confirmEdit()"
						>
							<v-icon>mdi-checkbox-marked-circle </v-icon>
						</v-btn>
					</v-col>
					<v-col cols="1" md="1" v-else>
						<v-btn color="blue darken-1" icon @click="editTitle()">
							<v-icon> mdi-pencil-circle </v-icon>
						</v-btn>
					</v-col>

					<v-col cols="12" md="2">
						<span class="text-black text-base">
							{{ $t("label.description") }} :
						</span>
					</v-col>
					<v-col cols="12" md="10">
						<!-- <v-text-field
										v-if="isEdit"
										v-model="m_requestDto.description"
										class="mt-2"
										outlined
										dense
									>
									</v-text-field>
									<span v-else>
										{{ m_requestDto.description }}
									</span> -->
						<tiptap-vuetify
							v-if="isEdit"
							v-model="m_requestDto.description"
							:extensions="extensions"
							:placeholder="$t('label.description') + '...'"
							min-height="300"
							:card-props="{
								flat: true,
								outlined: true,
							}"
							class="mb-1"
						/>
						<!-- <span v-else>
										{{ m_requestDto.description }}
									</span> -->
						<div
							v-else
							v-html="sanitizeText(m_requestDto.description)"
							class="table_tiptap"
						></div>
					</v-col>
				</v-row>
				<v-expansion-panels
					multiple
					focusable
					flat
					accordion
					class="border-[1px] border-grey-200"
					v-model="panels"
				>
					<v-expansion-panel>
						<v-expansion-panel-header
							class="grey lighten-4 py-1 max-h-[2rem]"
						>
							<v-card-actions class="py-0 max-h-[2rem]">
								<span
									class="text-black text-base font-weight-bold"
								>
									{{ $t("label.information_form") }}
								</span>
								<v-spacer></v-spacer>
								<!-- <v-btn
									icon
									color="blue darken-2"
									@click="editSaveFieldData"
									class="float-right"
								>
									<v-icon>mdi-content-save</v-icon>
								</v-btn> -->
								<v-btn
									v-if="FEATURE.ON_REQUEST"
									icon
									color="blue darken-2"
									@click="saveFieldDataV2()"
									class="float-right"
								>
									<v-icon>mdi-content-save</v-icon>
								</v-btn>
								<v-btn
									v-if="!FEATURE.ON_REQUEST"
									icon
									color="blue darken-2"
									@click="saveFieldData(true)"
									class="float-right"
								>
									<v-icon>mdi-content-save</v-icon>
								</v-btn>
							</v-card-actions>
						</v-expansion-panel-header>
						<v-divider></v-divider>
						<v-progress-linear
							indeterminate
							color="blue darken-2"
							v-if="formLoading"
						></v-progress-linear>
						<v-expansion-panel-content>
							<v-form
								ref="form"
								v-model="valid"
								class="w-full mt-4"
							>
								<v-jsf
									v-model="objectModel"
									:schema="objectSchema"
									:options="options"
									@input="handleFormInput($event)"
								/>
							</v-form>
							<template v-for="(table, idxTable) in tableSchema">
								<v-btn
									elevation="0"
									:key="`button_${idxTable}`"
									icon
									color="blue darken-2"
									@click="
										addItemToTable(
											m_objectModel[table.id],
											{},
											table.id,
										)
									"
								>
									<v-icon> mdi-plus-circle </v-icon>
								</v-btn>
								<v-btn
									elevation="0"
									icon
									color="blue darken-2"
									:key="`download_${idxTable}`"
									@click="downloadTable(table.id)"
								>
									<v-icon> mdi-download </v-icon>
								</v-btn>
								<label
									:for="`importFile_${idxTable}`"
									:key="`label_importFile_${idxTable}`"
									class="cursor-pointer"
								>
									<v-icon color="green darken-2">
										mdi-file-excel
									</v-icon>
								</label>
								<input
									type="file"
									:id="`importFile_${idxTable}`"
									:key="`importFile_${idxTable}`"
									class="sr-only"
									@change.stop="
										handleImportFile($event, table.id)
									"
								/>
								<v-btn
									elevation="0"
									icon
									color="red darken-2"
									:key="`delete_${idxTable}`"
									@click="deleteTable(table.id)"
								>
									<v-icon> mdi-trash-can-outline </v-icon>
								</v-btn>
								<v-btn
									elevation="0"
									icon
									class="cursor-pointer"
									:key="`check_${idxTable}`"
									@click="checkMaterial(table.id)"
									v-if="
										isHHXD &&
										table.id == 'bang_hang_hoa_xay_dung'
									"
								>
									<v-icon color="green darken-2">
										mdi-check-circle
									</v-icon>
								</v-btn>
								<v-btn
									elevation="0"
									icon
									class="cursor-pointer"
									:key="`check_me_${idxTable}`"
									@click="checkMaterialMe(table.id)"
									v-if="
										isHHME && table.id == 'bang_hang_hoa_me'
									"
								>
									<v-icon color="green darken-2">
										mdi-check-circle
									</v-icon>
								</v-btn>

								<v-btn
									elevation="0"
									class="cursor-pointer"
									:key="`check_${idxTable}`"
									@click="editNoCargoService(table.id)"
									text
									v-if="
										isHHXD &&
										table.id == 'bang_hang_hoa_xay_dung'
									"
								>
									<v-icon color="red">
										mdi-plus-circle</v-icon
									>
									<span class="normal-case text-xs">
										HH xây dựng không thuộc danh mục</span
									>
								</v-btn>
								<v-btn
									elevation="0"
									class="cursor-pointer"
									:key="`check_${idxTable}`"
									@click="editNoCargoME(table.id)"
									text
									v-if="
										isHHME && table.id == 'bang_hang_hoa_me'
									"
								>
									<v-icon color="red">
										mdi-plus-circle</v-icon
									>
									<span class="normal-case text-xs">
										HH ME không thuộc danh mục</span
									>
								</v-btn>
								<v-btn
									elevation="0"
									class="cursor-pointer"
									:key="`check_${idxTable}`"
									@click="editCargoService(table.id)"
									text
									v-if="
										isHHXD &&
										table.id == 'bang_hang_hoa_xay_dung'
									"
								>
									<v-icon color="blue">
										mdi-plus-circle</v-icon
									>

									<span class="normal-case text-xs">
										HH xây dựng thuộc danh mục</span
									>
								</v-btn>
								<v-btn
									elevation="0"
									class="cursor-pointer"
									:key="`check_${idxTable}`"
									@click="editCargoME(table.id)"
									text
									v-if="
										isHHME && table.id == 'bang_hang_hoa_me'
									"
								>
									<v-icon color="blue">
										mdi-plus-circle</v-icon
									>

									<span class="normal-case text-xs">
										HH ME thuộc danh mục</span
									>
								</v-btn>

								<!-- <v-radio-group
									:key="`region_${idxTable}`"
									v-model="region[table.id]"
									row
								>
									<v-radio
										:label="$t('hanoi')"
										:value="1"
									></v-radio>
									<v-radio
										:label="$t('hcm')"
										:value="2"
									></v-radio>
								</v-radio-group> -->
								<ag-grid-vue
									class="ag-theme-alpine h-[20rem]"
									:key="`grid_${idxTable}`"
									:columnDefs="columnDefs[idxTable]"
									:defaultColDef="defaultColDef"
									:rowData="getTableItem(table.id)"
									rowSelection="multiple"
									:pinnedTopRowData="pinnedTopRowData"
									:pinnedBottomRowData="pinnedBottomRowData"
									:pagination="true"
									:enableRangeSelection="true"
									:enableFillHandle="true"
									:undoRedoCellEditing="true"
									:enableCellChangeFlash="true"
									@grid-ready="onGridReady($event, table.id)"
									@cell-editing-stopped="onCellEditingStopped"
									@cell-editing-started="
										onCellEditingStarted(table.id)
									"
									style="color: red"
								></ag-grid-vue>
							</template>
						</v-expansion-panel-content>
					</v-expansion-panel>
					<v-divider></v-divider>
					<v-expansion-panel>
						<v-expansion-panel-header
							class="grey lighten-4 h-[2rem]"
						>
							<v-card-actions>
								<span
									class="text-black text-base font-weight-bold"
								>
									{{ $t("label.main_document") }}
								</span>
								<v-spacer></v-spacer>
								<v-tooltip bottom>
									<template v-slot:activator="{ on, attrs }">
										<span
											v-bind="attrs"
											v-on="on"
											@click="
												clickToOpen(
													m_requestDto.dataRoomPath,
												)
											"
											class="text-decoration-underline"
										>
											{{ decodeUrlDR }}
										</span>
									</template>
									<span>{{ decodeUrlDRDataRoomPath }}</span>
								</v-tooltip>
								<v-btn
									color="blue darken-2"
									@click="openViewSite"
									icon
								>
									<v-icon> mdi-sitemap </v-icon>
								</v-btn>
								<v-btn
									icon
									color="blue darken-2"
									@click="editFileRequestData"
									class="float-right"
								>
									<v-icon>mdi-plus-circle</v-icon>
								</v-btn>
							</v-card-actions>
						</v-expansion-panel-header>
						<v-divider></v-divider>
						<v-progress-linear
							indeterminate
							color="blue darken-2"
							v-if="componentLoading.document"
						>
						</v-progress-linear>
						<v-expansion-panel-content :eager="showBieumau">
							<v-data-table
								v-model="selecteds"
								:headers="headers"
								:items="listTemplateForm"
								:single-select="singleSelect"
								item-key="id"
								show-select
								:search="search"
								loading="true"
								:loading-text="$t('message.no_data')"
								:no-data-text="$t('message.no_data')"
								:no-results-text="$t('message.no_results')"
								class="w-full"
								hide-default-footer
								:items-per-page="-1"
							>
								<template
									v-for="header in headers.filter((header) =>
										header.hasOwnProperty('formatter'),
									)"
									v-slot:[`item.${header.value}`]="{
										headers,
										value,
									}"
								>
									{{ header.formatter(value) }}
								</template>
								<template
									v-slot:[`item.templateForm.templateFormName`]="{
										item,
									}"
								>
									<span
										v-if="
											item.templateForm.templateFormName
												.length <= 30
										"
										@click="
											viewTemplateForm(item.templateForm)
										"
										class="cursor-pointer"
									>
										{{ item.templateForm.templateFormName }}
									</span>
									<v-tooltip
										bottom
										v-if="
											item.templateForm.templateFormName
												.length > 30
										"
									>
										<template
											v-slot:activator="{ on, attrs }"
										>
											<span
												v-bind="attrs"
												v-on="on"
												@click="
													viewTemplateForm(
														item.templateForm,
													)
												"
												class="cursor-pointer"
											>
												{{
													item.templateForm.templateFormName.slice(
														0,
														30,
													)
												}}
												...
											</span>
										</template>
										<span>{{
											item.templateForm.templateFormName
										}}</span>
									</v-tooltip>
								</template>
								<template v-slot:[`item.fileName`]="{ item }">
									<td>
										<div
											class="flex items-center justify-between"
										>
											<span
												v-if="
													item.fileName.length <= 30
												"
											>
												{{ item.fileName }}
											</span>
											<v-tooltip
												bottom
												v-if="item.fileName.length > 30"
											>
												<template
													v-slot:activator="{
														on,
														attrs,
													}"
												>
													<span
														v-bind="attrs"
														v-on="on"
														text
													>
														{{
															item.fileName.slice(
																0,
																30,
															)
														}}
														...
													</span>
												</template>
												<span>{{ item.fileName }}</span>
											</v-tooltip>
											<v-menu bottom left>
												<template
													v-slot:activator="{
														on,
														attrs,
													}"
												>
													<v-btn
														icon
														v-bind="attrs"
														v-on="on"
													>
														<v-icon
															>mdi-dots-vertical</v-icon
														>
													</v-btn>
												</template>
												<v-list>
													<v-list-item
														@click="
															editViewAttachmentFile(
																item,
															)
														"
													>
														<v-list-item-icon>
															<v-icon
																color="green darken-2"
															>
																mdi-eye-circle
															</v-icon>
														</v-list-item-icon>
														<v-list-item-title>
															{{
																$t(
																	"button.view",
																)
															}}
														</v-list-item-title>
													</v-list-item>

													<v-list-item
														v-if="
															item.fileExtension ==
																'docx' ||
															item.fileExtension ==
																'pptx' ||
															item.fileExtension ==
																'xlsx'
														"
														@click="
															editAttachmentFile(
																item,
															)
														"
													>
														<v-list-item-icon>
															<v-icon
																color="blue darken-2"
															>
																mdi-pencil-circle
															</v-icon>
														</v-list-item-icon>
														<v-list-item-title>
															{{
																$t(
																	"button.edit",
																)
															}}
														</v-list-item-title>
													</v-list-item>
													<v-list-item
														@click="
															deleteAttachmentFile(
																item,
															)
														"
													>
														<v-list-item-icon>
															<v-icon
																color="red darken-2"
															>
																mdi-delete-circle
															</v-icon>
														</v-list-item-icon>
														<v-list-item-title>
															{{
																$t(
																	"button.delete",
																)
															}}
														</v-list-item-title>
													</v-list-item>
													<v-list-item
														@click="
															downloadFileTemplate(
																item,
															)
														"
													>
														<v-list-item-icon>
															<v-icon
																color="red darken-2"
															>
																mdi-download
															</v-icon>
														</v-list-item-icon>
														<v-list-item-title>
															{{
																$t(
																	"button.download",
																)
															}}
														</v-list-item-title>
													</v-list-item>
												</v-list>
											</v-menu>
										</div>
									</td>
								</template>
							</v-data-table>
						</v-expansion-panel-content>
					</v-expansion-panel>
					<v-divider></v-divider>
					<v-expansion-panel>
						<v-expansion-panel-header
							class="grey lighten-4 h-[2rem]"
						>
							<v-card-actions>
								<span
									class="text-black text-base font-weight-bold"
								>
									{{ $t("label.attachments") }}
								</span>
								<v-spacer></v-spacer>
								<v-btn
									icon
									color="blue darken-2"
									@click="editAttachmentFileRequestData"
									class="float-right"
								>
									<v-icon> mdi-plus-circle </v-icon>
								</v-btn>
							</v-card-actions>
						</v-expansion-panel-header>
						<v-progress-linear
							indeterminate
							color="blue darken-2"
							v-if="componentLoading.attachment"
						>
						</v-progress-linear>
						<v-expansion-panel-content>
							<v-data-table
								v-model="selected"
								:headers="headerss"
								:items="listAttachmentFlieByRequests"
								:single-select="singleSelect"
								item-key="id"
								show-select
								:search="search"
								loading="true"
								hide-default-footer
								:loading-text="$t('message.no_data')"
								:no-data-text="$t('message.no_data')"
								:no-results-text="$t('message.no_results')"
								:items-per-page="-1"
							>
								<template
									v-for="header in headerss.filter((header) =>
										header.hasOwnProperty('formatter'),
									)"
									v-slot:[`item.${header.value}`]="{
										headerss,
										value,
									}"
								>
									{{ header.formatter(value) }}
								</template>

								<template v-slot:[`item.fileName`]="{ item }">
									<td>
										<div
											class="flex items-center justify-between"
										>
											<span
												v-if="
													item.fileName.length <= 30
												"
												class="cursor-pointer"
												@click="
													editViewAttachmentFile(item)
												"
											>
												{{ item.fileName }}
											</span>
											<v-tooltip
												bottom
												v-if="item.fileName.length > 30"
											>
												<template
													v-slot:activator="{
														on,
														attrs,
													}"
												>
													<span
														v-bind="attrs"
														v-on="on"
														class="cursor-pointer"
														@click="
															editViewAttachmentFile(
																item,
															)
														"
													>
														{{
															item.fileName.slice(
																0,
																30,
															)
														}}
														...
													</span>
												</template>
												<span>{{ item.fileName }}</span>
											</v-tooltip>
											<v-menu offset-y>
												<template
													v-slot:activator="{
														on,
														attrs,
													}"
												>
													<v-btn
														icon
														v-bind="attrs"
														v-on="on"
													>
														<v-icon
															>mdi-dots-vertical</v-icon
														>
													</v-btn>
												</template>
												<v-list>
													<v-list-item
														@click="
															editViewAttachmentFile(
																item,
															)
														"
													>
														<v-list-item-icon>
															<v-icon
																color="green darken-2"
															>
																mdi-eye-circle
															</v-icon>
														</v-list-item-icon>
														<v-list-item-title>
															{{
																$t(
																	"button.view",
																)
															}}
														</v-list-item-title>
													</v-list-item>

													<v-list-item
														v-if="
															item.fileExtension ==
																'docx' ||
															item.fileExtension ==
																'pptx' ||
															item.fileExtension ==
																'xlsx'
														"
														@click="
															editAttachmentFile(
																item,
															)
														"
													>
														<v-list-item-icon>
															<v-icon
																color="blue darken-2"
															>
																mdi-pencil-circle
															</v-icon>
														</v-list-item-icon>
														<v-list-item-title>
															{{
																$t(
																	"button.edit",
																)
															}}
														</v-list-item-title>
													</v-list-item>
													<v-list-item
														@click="
															deleteAttachmentFileV2(
																item,
															)
														"
													>
														<v-list-item-icon>
															<v-icon
																color="red darken-2"
															>
																mdi-delete-circle
															</v-icon>
														</v-list-item-icon>
														<v-list-item-title>
															{{
																$t(
																	"button.delete",
																)
															}}
														</v-list-item-title>
													</v-list-item>
													<v-list-item
														@click="
															downloadAtackFileTemplate(
																item,
															)
														"
													>
														<v-list-item-icon>
															<v-icon
																color="red darken-2"
															>
																mdi-download
															</v-icon>
														</v-list-item-icon>
														<v-list-item-title>
															{{
																$t(
																	"button.download",
																)
															}}
														</v-list-item-title>
													</v-list-item>
													<!-- <v-list-item
																	@click="
																		editAttachmentFilePDF(
																			item,
																		)
																	"
																>
																	<v-list-item-icon>
																		<v-icon
																			color="blue darken-2"
																		>
																			mdi-file
																		</v-icon>
																	</v-list-item-icon>
																	<v-list-item-title>
																		Xuất file
																	</v-list-item-title>
																</v-list-item> -->
												</v-list>
											</v-menu>
										</div>
									</td>
								</template>
							</v-data-table>
						</v-expansion-panel-content>
					</v-expansion-panel>
					<v-expansion-panel>
						<v-expansion-panel-header
							class="grey lighten-4 h-[2rem]"
						>
							<v-card-actions>
								<span
									class="text-black text-base font-weight-bold"
								>
									{{ $t("label.exchange") }}
								</span>
								<v-spacer></v-spacer>
							</v-card-actions>
						</v-expansion-panel-header>
						<v-expansion-panel-content>
							<v-row>
								<v-col cols="12" class="white">
									<v-tabs v-model="tabChat">
										<v-tab key="individual">
											{{ $t("label.individual") }}</v-tab
										>
										<v-tab key="customer">
											{{ $t("label.customer") }}</v-tab
										>
									</v-tabs>
									<v-tabs-items v-model="tabChat">
										<v-tab-item key="individual">
											<vue-perfect-scrollbar
												class="max-h-[15rem] p-2 border-dashed border-2"
												v-if="hisTrade.length > 0"
											>
												<span
													v-for="item of hisTrade"
													:key="item.id"
													class="d-flex text-sm"
												>
													<span>
														<span class="font-bold">
															{{ item.sendName }}
														</span>
														<span
															v-if="
																item.organizationName
															"
														>
															({{
																item.organizationName
															}})
														</span>
														<br />
														<span class="text-xs">
															{{
																item.sendDate
																	| format_date
															}}
														</span>
													</span>
													:
													<span
														v-html="
															sanitizeText(
																item.content,
															)
														"
														class="min-w-[30rem] h-[fit-content] table_tiptap"
													></span>
												</span>
											</vue-perfect-scrollbar>
										</v-tab-item>
										<v-tab-item key="customer">
											<vue-perfect-scrollbar
												class="max-h-[15rem] p-2 border border-solid rounded"
												v-if="
													hisTradeCustomer.length > 0
												"
											>
												<span
													v-for="item of hisTradeCustomer"
													:key="item.id"
													class="d-flex text-sm"
												>
													<span>
														<span class="font-bold">
															{{ item.sendName }}
														</span>
														<span
															v-if="
																item.organizationName
															"
														>
															({{
																item.organizationName
															}})
														</span>
														<br />
														<span class="text-xs">
															{{
																item.sendDate
																	| format_date
															}}
														</span>
													</span>
													:
													<span
														v-html="
															sanitizeText(
																item.content,
															)
														"
														class="min-w-[30rem] h-[fit-content] table_tiptap"
													></span>
												</span>
											</vue-perfect-scrollbar>
										</v-tab-item>
									</v-tabs-items>
								</v-col>
								<v-col cols="12" class="bg-white mt-1">
									<!-- <v-textarea
										outlined
										v-model="content"
										maxLength="500"
									></v-textarea> -->
									<tiptap-vuetify
										v-model="content"
										:extensions="extensions"
										:placeholder="
											$t('label.exchange') + '...'
										"
										min-height="100"
										class="mb-4 mt-2"
									/>
									<div class="flex justify-end">
										<span
											v-if="update_at"
											class="text-sm mt-2 mr-5"
										>
											{{ $t("label.update_at")
											}}{{ update_at | format_date }}
										</span>
										<v-btn
											@click="getHisTrade()"
											color="blue"
											rounded
											dark
											class="mr-5"
										>
											{{ $t("button.refresh") }}
										</v-btn>

										<v-btn
											:disabled="
												content.trim().length > 0
													? false
													: true
											"
											:dark="
												content.trim().length > 0
													? true
													: false
											"
											@click="sendInformationInExchange()"
											color="red"
											elevation="0"
											rounded
										>
											{{ $t("button.send") }}
										</v-btn>
									</div>
								</v-col>
							</v-row>
						</v-expansion-panel-content>
					</v-expansion-panel>
				</v-expansion-panels>
			</v-col>
			<v-divider vertical></v-divider>
			<v-col cols="12" md="3">
				<!-- <vue-tab :tab="tab" @tab="(v)=>tab = v " :tabs="tabs"  :buttons="buttons"></vue-tab> -->
				<v-tabs color="blue" v-model="tab">
					<v-tab key="processing_history" class="font-bold">
						{{ $t("label.processing_process") }}
						<v-icon> mdi-history </v-icon>
					</v-tab>

					<!-- <v-tab
						v-if="!isCvd"
						key="processing_process"
						class="font-bold"
					>
						{{ $t("label.processing_history") }}
					</v-tab> -->
				</v-tabs>
				<v-divider></v-divider>
				<vue-perfect-scrollbar>
					<v-tabs-items v-model="tab">
						<v-tab-item key="processing_history">
							<v-progress-linear
								indeterminate
								color="blue darken-2"
								v-if="componentLoading.history"
							>
							</v-progress-linear>

							<vue-perfect-scrollbar class="h-[60vh]">
								<v-timeline
									align-top
									dense
									v-for="(steep, index) of procesHisTemps"
									:key="index"
									class="ml-[-1.5rem]"
								>
									<div class="flex items-center">
										<v-tooltip top>
											<template
												v-slot:activator="{ on, attrs }"
											>
												<v-btn
													:style="{
														background:
															getColor(steep),
													}"
													elevation="0"
													dark
													small
													v-bind="attrs"
													v-on="on"
													class="rounded-pill text-black text-base ml-20"
												>
													<v-icon>mdi-pencil</v-icon>

													{{ steep.status }}
												</v-btn>
											</template>
											<span>{{ steep.status }}</span>
										</v-tooltip>
									</div>
									<v-timeline-item
										class="pb-0"
										small
										fill-dot
										left
										:color="getColor(steep)"
									>
										<v-card
											elevation="0"
											class="grey lighten-3 rounded-md my-1 p-2 flex flex-col min-h-[3rem] left-[-1rem]"
										>
											<span
												:class="'font-bold'"
												:style="{ margin: 0 }"
												v-if="
													steep.processer &&
													!steep.processerName
												"
												>{{ steep.processer.fullName }}
											</span>
											<span
												:class="'font-bold'"
												:style="{ margin: 0 }"
												v-if="steep.processerName"
												>{{ steep.processerName }}
											</span>
											<p
												:class="'text-black text-base'"
												:style="{ margin: 0 }"
											>
												{{ steep.organizationName }}
											</p>
											<p
												:class="'text-black text-xs'"
												:style="{ margin: 0 }"
												v-if="steep.description"
											>
												Mô tả :
												{{ steep.description }}
											</p>
											<p
												:class="'text-black text-base'"
												:style="{ margin: 0 }"
												v-if="
													steep.userInfos &&
													steep.userInfos.length > 0
												"
											>
												<span
													v-for="(
														per, indexPer
													) of steep.userInfos"
													:key="indexPer"
												>
													<span
														:class="'font-bold'"
														:style="{
															margin: 0,
														}"
													>
														{{ per.fullName }}
														<span
															v-if="
																indexPer > 0 &&
																indexPer <
																	steep
																		.userInfos
																		.length -
																		1
															"
															>,</span
														>
													</span>
												</span>
											</p>
										</v-card>
										<!-- <template
														v-if="
															!steep
																.processHisChild
																.length == 0
														"
														><v-treeview
															:items="
																steep.processHisChild
															"
														></v-treeview
													></template> -->
										<p
											:class="'text-black text-xs'"
											:style="{ margin: 0 }"
											v-if="steep.createDate"
										>
											{{
												moment(steep.createDate).format(
													dateFormat,
												)
											}}
										</p>
										<v-list-group
											no-action
											sub-group
											:value="true"
											v-if="
												steep.processHisChild &&
												steep.processHisChild.length > 0
											"
										>
											<template v-slot:activator>
												<v-list-item-title
													class="text-black text-xs h-[1rem] p-0 m-0 ml-[-1rem]"
													>{{
														$t("label.history")
													}}
													:{{
														steep.status
													}}</v-list-item-title
												>
											</template>
											<v-list-group-item>
												<div
													v-for="(
														item, index1
													) of steep.processHisChild"
													:key="index1"
												>
													<v-timeline-item
														class="pb-0"
														hide-dot
														left
													>
														<v-card
															elevation="0"
															class="grey lighten-3 rounded-md my-1 flex flex-col left-[-1rem]"
														>
															<span
																v-if="
																	item.processer
																"
																:class="'font-bold'"
																:style="{
																	margin: 0,
																}"
															>
																{{
																	item
																		.processer
																		.fullName
																}}
															</span>
															<p
																:class="'text-black text-base'"
																:style="{
																	margin: 0,
																}"
															>
																{{
																	item.status
																}}
															</p>
															<p
																:class="'text-black text-xs'"
																:style="{
																	margin: 0,
																}"
															>
																Mô tả :
																{{
																	item.description
																}}
															</p>
														</v-card>

														<v-card-text
															:class="'text-black text-xs'"
															:style="{
																margin: 0,
															}"
														>
															{{
																moment(
																	item.createDate,
																).format(
																	dateFormat,
																)
															}}
														</v-card-text>
													</v-timeline-item>
												</div>
											</v-list-group-item>
										</v-list-group>
									</v-timeline-item>
								</v-timeline>
							</vue-perfect-scrollbar>
						</v-tab-item>
						<v-tab-item key="processing_process">
							<v-progress-linear
								indeterminate
								color="blue darken-2"
								v-if="componentLoading.process"
							>
							</v-progress-linear>

							<vue-perfect-scrollbar class="h-[36rem]">
								<v-timeline
									align-top
									dense
									v-for="(steep, index) of stepDatas"
									:key="index"
									class="ml-[-1.5rem]"
								>
									<v-timeline-item
										class="pb-0"
										small
										fill-dot
										left
										color="green darken-5"
									>
										<div class="flex items-center">
											<v-btn
												color="green darken-5"
												elevation="0"
												dark
												class="rounded-pill cursor-none"
											>
												<v-icon>mdi-pencil</v-icon>

												Bước {{ index + 1 }}
											</v-btn>
											<div
												class="flex justify-start gap-2 items-center"
												v-if="steep.isActive"
											>
												<span
													class="text-base font-bold"
												>
													{{ $t("label.handle") }}
												</span>
												<v-progress-circular
													:size="30"
													color="blue-grey lighten-2"
												>
												</v-progress-circular>
											</div>
										</div>

										<v-card
											flat
											elevation="0"
											class="grey lighten-3 rounded-md mt-1 p-2 min-h-[3rem]"
										>
											<span class="font-bold">{{
												steep.stepDataName
											}}</span>

											<div>
												<v-chip
													v-for="(
														items, item
													) of steep.userInfos"
													:key="item"
													class="ma-2"
													filter
												>
													<v-avatar
														color="red darken-2 mr-2"
														size="26"
													>
														<span
															class="white--text"
														>
															{{
																getAvatarText(
																	items.fullName,
																	2,
																)
															}}
														</span>
													</v-avatar>
													{{ items.fullName }}
												</v-chip>
											</div>
										</v-card>
										<!-- <v-card-text>
												{{
													moment(
														steep.createDate,
													).format(dateFormat)
												}}
											</v-card-text> -->
									</v-timeline-item>
								</v-timeline>
							</vue-perfect-scrollbar>
						</v-tab-item>
					</v-tabs-items>
				</vue-perfect-scrollbar>
				<div>
					<v-divider></v-divider>
					<v-card elevation="0">
						<v-row>
							<v-col cols="10">
								<v-card-text class="font-weight-medium"
									>{{ $t("label.related_request_form") }}
								</v-card-text>
							</v-col>

							<v-col cols="2">
								<v-btn
									text
									tile
									color="blue"
									@click="editRelateRequestData"
									class="float-right mt-2"
								>
									<v-icon color="blue"
										>mdi-plus-circle</v-icon
									>
								</v-btn>
							</v-col>
						</v-row>
					</v-card>

					<div
						class="flex flex-col"
						v-for="(relate, index) of m_requestDto.requestDataList"
						:key="index"
					>
						<!-- <span v-if="relate" class="pl-4 mx-2">{{
							relate.title
						}}</span> -->
						<div class="flex justify-between">
							<!-- <v-btn text color="blue">
									{{ relate.title }}
								</v-btn> -->
							<span class="text-blue-400">
								{{ relate.title }}
							</span>

							<v-menu offset-y>
								<template v-slot:activator="{ on, attrs }">
									<v-btn icon v-bind="attrs" v-on="on">
										<v-icon>mdi-dots-vertical</v-icon>
									</v-btn>
								</template>
								<v-list>
									<v-list-item
										@click="viewRequestRelateData(relate)"
									>
										<v-list-item-icon>
											<v-icon color="green darken-2">
												mdi-eye-circle
											</v-icon>
										</v-list-item-icon>
										<v-list-item-title>
											{{ $t("button.view") }}
										</v-list-item-title>
									</v-list-item>

									<!-- <v-list-item
											@click="
												editrequestDataList(relate.id)
											"
										>
											<v-list-item-icon>
												<v-icon color="blue darken-2">
													mdi-pencil-circle
												</v-icon>
											</v-list-item-icon>
											<v-list-item-title>
												{{ $t("button.edit") }}
											</v-list-item-title>
										</v-list-item> -->
									<v-list-item
										@click="deleteRequestRelateData(relate)"
									>
										<v-list-item-icon>
											<v-icon color="red darken-2">
												mdi-delete-circle
											</v-icon>
										</v-list-item-icon>
										<v-list-item-title>
											{{ $t("button.delete") }}
										</v-list-item-title>
									</v-list-item>
								</v-list>
							</v-menu>
						</div>
						<v-divider></v-divider>
					</div>
					<v-divider></v-divider>
					<v-card elevation="0">
						<v-row>
							<v-col cols="10">
								<v-card-text class="font-weight-medium">
									{{ $t("label.share_with") }}
								</v-card-text>
							</v-col>
							<v-col cols="2">
								<v-btn
									text
									tile
									color="blue"
									@click="editUserInfosRequestData"
									class="float-right mt-2"
								>
									<v-icon color="blue"
										>mdi-plus-circle</v-icon
									>
								</v-btn>
							</v-col>
						</v-row>
					</v-card>
					<v-divider></v-divider>

					<v-combobox
						v-if="m_requestDto.userInfos.length"
						v-model="m_requestDto.userInfos"
						chips
						dense
						multiple
					>
						<template
							v-slot:selection="{ attrs, item, parent, selected }"
						>
							<v-chip
								v-if="item === Object(item)"
								v-bind="attrs"
								:input-value="selected"
								label
								class="ma-2"
								close
								@click:close="remove(item)"
							>
								<v-avatar color="red darken-2 mr-2" size="30">
									<span class="white--text">
										{{ getAvatarText(item.fullName, 2) }}
									</span>
								</v-avatar>
								<span class="pr-2">
									{{ item.fullName }}
								</span>
								<v-icon small @click="parent.selectItem(item)">
								</v-icon>
							</v-chip>
						</template>
					</v-combobox>
				</div>
			</v-col>
			<v-dialog width="50vw" v-model="openNoCargoService" persistent>
				<v-card elevation="0">
					<v-toolbar flat color="grey lighten-4 max-h-[2.5rem]">
						<v-toolbar-title class="mb-5">
							Thêm mới hàng hóa xây dựng không thuộc danh
							mục</v-toolbar-title
						>
						<v-spacer></v-spacer>
						<v-btn icon @click="closeNoCargoService" class="mb-5">
							<v-icon>mdi-close</v-icon>
						</v-btn>
					</v-toolbar>
					<v-card-text class="white mt-5">
						<v-container>
							<v-form>
								<v-col>
									<v-form>
										<v-radio-group
											v-model="checkKV"
											mandatory
											row
											class="px-5"
										>
											<v-radio
												label="KV Hà Nội"
												value="KV Hà Nội"
												@click="checkKV_HN"
											></v-radio>
											<v-radio
												label="KV HCM"
												value="KV HCM"
												@click="checkKV_HCM"
											></v-radio>
										</v-radio-group>
										<v-card elevation="0">
											<!-- <v-col>

												</v-col> -->
											<v-row class="mt-4 px-4">
												<v-col cols="12" md="6">
													<v-text-field
														v-model.trim="
															m_CargoServiceDto.noi_dung_cong_viec
														"
														:label="
															$t(
																'cargo_DVXD.noi_dung_cong_viec',
															)
														"
														maxLength="255"
														outlined
														hide-details
														dense
													>
														<template v-slot:label>
															{{
																$t(
																	"cargo_DVXD.noi_dung_cong_viec",
																)
															}}
															<span
																class="text-red-600"
															>
																{{
																	$t(
																		"label.star",
																	)
																}}
															</span>
														</template>
													</v-text-field>
												</v-col>
												<v-col cols="12" md="6">
													<v-text-field
														v-model.trim="
															m_CargoServiceDto.quy_cach_ky_thuat
														"
														maxLength="255"
														outlined
														hide-details
														dense
													>
														<template v-slot:label>
															{{
																$t(
																	"cargo_DVXD.quy_cach_ky_thuat",
																)
															}}
															<span
																class="text-red-600"
															>
																{{
																	$t(
																		"label.star",
																	)
																}}
															</span>
														</template>
													</v-text-field>
												</v-col>
											</v-row>
											<v-row class="mt-4 px-4">
												<v-col cols="12" md="6">
													<v-text-field
														v-model.trim="
															m_CargoServiceDto.ma_hieu
														"
														maxLength="255"
														outlined
														hide-details
														dense
													>
														<template v-slot:label>
															{{
																$t(
																	"cargo_DVXD.ma_hieu",
																)
															}}
															<span
																class="text-red-600"
															>
																{{
																	$t(
																		"label.star",
																	)
																}}
															</span>
														</template>
													</v-text-field>
												</v-col>
												<v-col cols="12" md="3">
													<v-text-field
														v-model.trim="
															m_CargoServiceDto.don_vi_tinh
														"
														maxLength="255"
														outlined
														hide-details
														dense
													>
														<template v-slot:label>
															{{
																$t(
																	"cargo_DVXD.don_vi_tinh",
																)
															}}
															<span
																class="text-red-600"
															>
																{{
																	$t(
																		"label.star",
																	)
																}}
															</span>
														</template>
													</v-text-field>
												</v-col>
												<v-col cols="12" md="3">
													<v-text-field
														v-model.trim="
															m_CargoServiceDto.don_gia_ha_noi_str
														"
														:label="
															$t(
																'cargo_DVXD.don_gia_chuan_kv_hn',
															)
														"
														maxLength="255"
														outlined
														hide-details
														dense
														type="number"
														ref="ref_don_gia_ha_noi_str"
													/>
												</v-col>
											</v-row>
											<v-row class="mt-4 px-4">
												<v-col cols="12" md="3">
													<v-text-field
														v-model.trim="
															m_CargoServiceDto.don_gia_hcm_str
														"
														:label="
															$t(
																'cargo_DVXD.don_gia_chuan_kv_HCM',
															)
														"
														maxLength="255"
														outlined
														hide-details
														dense
														type="number"
														ref="ref_don_gia_hcm_str"
													/>
												</v-col>
												<v-col cols="12" md="3">
													<v-combobox
														v-model="
															m_CargoServiceDto.nha_cung_cap
														"
														:items="materials"
														item-text="name"
														outlined
														prepend-inner-icon="mdi-magnify"
														dense
														maxLength="255"
														@update:search-input="
															getDataCargo($event)
														"
													>
														<template v-slot:label>
															{{
																$t(
																	"cargo_DVXD.chon_nha_cung_cap",
																)
															}}
															<span
																class="text-red-500"
															>
																{{
																	$t(
																		"label.star",
																	)
																}}
															</span>
														</template>
													</v-combobox>
												</v-col>
												<v-col cols="12" md="3">
													<v-text-field
														v-model.trim="
															m_CargoServiceDto.so_luong
														"
														maxLength="255"
														outlined
														hide-details
														dense
														type="number"
														ref="ref_so_luong"
													>
														<template v-slot:label>
															{{
																$t(
																	"cargo_DVXD.so_luong",
																)
															}}
															<span
																class="text-red-600"
															>
																{{
																	$t(
																		"label.star",
																	)
																}}
															</span>
														</template>
													</v-text-field>
												</v-col>
												<v-col cols="12" md="3">
													<v-text-field
														v-model.trim="
															m_CargoServiceDto.don_gia_ncc
														"
														maxLength="255"
														outlined
														hide-details
														dense
														type="number"
														ref="ref_don_gia_ncc"
													>
														<template v-slot:label>
															{{
																$t(
																	"cargo_DVXD.nhap_don_gia_NCC",
																)
															}}
															<span
																class="text-red-600"
															>
																{{
																	$t(
																		"label.star",
																	)
																}}
															</span>
														</template>
													</v-text-field>
												</v-col>
											</v-row>
											<v-row class="mt-4 px-4">
												<v-col cols="12" md="6">
													<v-text-field
														v-model.trim="
															m_CargoServiceDto.thanh_tien
														"
														maxLength="255"
														outlined
														hide-details
														dense
														disabled
													>
														<template v-slot:label>
															{{
																$t(
																	"cargo_DVXD.thanh_tien",
																)
															}}
															<span
																class="text-red-600"
															>
																{{
																	$t(
																		"label.star",
																	)
																}}
															</span>
														</template>
													</v-text-field>
												</v-col>
											</v-row>
										</v-card>
									</v-form>
								</v-col>
							</v-form>
						</v-container>
					</v-card-text>
					<v-card-actions class="white">
						<v-spacer></v-spacer>
						<v-btn
							color="blue darken-1"
							elevation="0"
							dark
							@click="findNoCargoService()"
						>
							{{ $t("button.ok") }}
						</v-btn>
						<v-btn
							color="grey lighten-4"
							elevation="0"
							@click="closeNoCargoService"
						>
							{{ $t("button.cancel") }}
						</v-btn>
					</v-card-actions>
				</v-card>
			</v-dialog>
			<v-dialog width="50vw" v-model="openNoCargoME" persistent>
				<v-card elevation="0">
					<v-toolbar flat color="grey lighten-4 max-h-[2.5rem]">
						<!-- <v-toolbar-title class="mb-5">
						{{ $t("button.import_cargo") }}</v-toolbar-title
					> -->
						<v-toolbar-title class="mb-5">
							Thêm mới hàng hóa ME không thuộc danh
							mục</v-toolbar-title
						>
						<v-spacer></v-spacer>
						<v-btn icon @click="closeNoCargoME" class="mb-5">
							<v-icon>mdi-close</v-icon>
						</v-btn>
					</v-toolbar>
					<v-card-text class="white mt-5">
						<v-container>
							<v-form>
								<v-col>
									<v-form>
										<v-card elevation="0">
											<v-row class="mt-4 px-4">
												<v-col cols="12" md="6">
													<v-text-field
														v-model="
															m_CargoMeDto.noi_dung_cong_viec
														"
														maxLength="255"
														outlined
														hide-details
														dense
													>
														<template v-slot:label>
															{{
																$t(
																	"cargo_ME.noi_dung_cong_viec",
																)
															}}
															<span
																class="text-red-600"
															>
																{{
																	$t(
																		"label.star",
																	)
																}}
															</span>
														</template>
													</v-text-field>
												</v-col>
												<v-col cols="12" md="6">
													<v-text-field
														v-model="
															m_CargoMeDto.quy_cach_ky_thuat
														"
														maxLength="255"
														outlined
														hide-details
														dense
													>
														<template v-slot:label>
															{{
																$t(
																	"cargo_DVXD.quy_cach_ky_thuat",
																)
															}}
															<span
																class="text-red-600"
															>
																{{
																	$t(
																		"label.star",
																	)
																}}
															</span>
														</template></v-text-field
													>
												</v-col>
											</v-row>
											<v-row class="mt-4 px-4">
												<v-col cols="12" md="6">
													<v-text-field
														v-model="
															m_CargoMeDto.ma_hieu
														"
														maxLength="255"
														outlined
														hide-details
														dense
													>
														<template v-slot:label>
															{{
																$t(
																	"cargo_ME.ma_hieu",
																)
															}}
															<span
																class="text-red-600"
															>
																{{
																	$t(
																		"label.star",
																	)
																}}
															</span>
														</template></v-text-field
													>
												</v-col>
												<v-col cols="12" md="3">
													<v-text-field
														v-model="
															m_CargoMeDto.don_vi_tinh
														"
														maxLength="255"
														outlined
														hide-details
														dense
													>
														<template v-slot:label>
															{{
																$t(
																	"cargo_ME.don_vi_tinh",
																)
															}}
															<span
																class="text-red-600"
															>
																{{
																	$t(
																		"label.star",
																	)
																}}
															</span>
														</template></v-text-field
													>
												</v-col>

												<v-col cols="12" md="3">
													<v-text-field
														v-model="
															m_CargoMeDto.don_gia_chuan_vt_vl
														"
														:label="
															$t(
																'cargo_ME.don_gia_chuan_vt_vl',
															)
														"
														maxLength="255"
														outlined
														hide-details
														dense
														type="number"
														ref="ref_don_gia_chuan_vl_vt"
													/>
												</v-col>
											</v-row>
											<v-row class="mt-4 px-4">
												<v-col cols="12" md="3">
													<v-text-field
														v-model="
															m_CargoMeDto.don_gia_chuan_nhan_cong
														"
														:label="
															$t(
																'cargo_ME.don_gia_chuan_nhan_cong',
															)
														"
														maxLength="255"
														outlined
														hide-details
														dense
														type="number"
														ref="ref_don_gia_nhan_cong_str"
													/>
												</v-col>
												<v-col cols="12" md="3">
													<v-text-field
														v-model="
															m_CargoMeDto.so_luong
														"
														maxLength="255"
														outlined
														hide-details
														dense
														type="number"
														ref="ref_cargo_me_so_luong"
													>
														<template v-slot:label>
															{{
																$t(
																	"cargo_ME.so_luong",
																)
															}}
															<span
																class="text-red-600"
															>
																{{
																	$t(
																		"label.star",
																	)
																}}
															</span>
														</template>
													</v-text-field>
												</v-col>
												<v-col cols="12" md="3">
													<v-text-field
														v-model="
															m_CargoMeDto.don_gia_ncc_vt_vl
														"
														maxLength="255"
														outlined
														hide-details
														dense
														type="number"
														ref="ref_don_gia_ncc_vt_vl"
													>
														<template v-slot:label>
															{{
																$t(
																	"cargo_ME.don_gia_ncc_vt_vc",
																)
															}}
															<span
																class="text-red-600"
															>
																{{
																	$t(
																		"label.star",
																	)
																}}
															</span>
														</template></v-text-field
													>
												</v-col>
												<v-col cols="12" md="3">
													<v-text-field
														v-model="
															m_CargoMeDto.don_gia_ncc_nhan_cong
														"
														:label="
															$t(
																'cargo_ME.don_gia_ncc_nhan_cong',
															)
														"
														maxLength="255"
														outlined
														hide-details
														dense
														type="number"
														ref="ref_don_gia_ncc_nhan_cong"
													>
														<template v-slot:label>
															{{
																$t(
																	"cargo_ME.don_gia_ncc_nhan_cong",
																)
															}}
															<span
																class="text-red-600"
															>
																{{
																	$t(
																		"label.star",
																	)
																}}
															</span>
														</template>
													</v-text-field>
												</v-col>
											</v-row>
											<v-row class="mt-4 px-4">
												<v-col cols="12" md="6">
													<!-- <v-autocomplete
														maxLength="255"
														:label="
															$t(
																'cargo_DVXD.chon_nha_cung_cap',
															)
														"
														outlined
														dense
														v-model="
															list_Organizations
														"
														:items="
															listOrganizations
														"
														item-text="organizationName"
														clearable
														multiple
														:item-value="
															(val) => val
														"
													>
													</v-autocomplete> -->
													<v-combobox
														v-model="
															m_CargoMeDto.ncc
														"
														:items="materials"
														item-text="name"
														outlined
														prepend-inner-icon="mdi-magnify"
														dense
														maxLength="255"
														@update:search-input="
															getDataCargo($event)
														"
													>
														<template v-slot:label>
															{{
																$t(
																	"cargo_DVXD.chon_nha_cung_cap",
																)
															}}
															<span
																class="text-red-500"
															>
																{{
																	$t(
																		"label.star",
																	)
																}}
															</span>
														</template>
													</v-combobox>
												</v-col>
												<v-col cols="12" md="6">
													<v-text-field
														v-model="
															m_CargoMeDto.thanh_tien
														"
														maxLength="255"
														outlined
														hide-details
														dense
														disabled
													>
														<template v-slot:label>
															{{
																$t(
																	"cargo_ME.thanh_tien",
																)
															}}
															<span
																class="text-red-600"
															>
																{{
																	$t(
																		"label.star",
																	)
																}}
															</span>
														</template>
													</v-text-field>
												</v-col>
											</v-row>
										</v-card>
									</v-form>
								</v-col>
							</v-form>
						</v-container>
					</v-card-text>
					<v-card-actions class="white">
						<v-spacer></v-spacer>
						<v-btn
							color="blue darken-1"
							elevation="0"
							dark
							@click="findNoCargoME()"
						>
							{{ $t("button.ok") }}
						</v-btn>
						<v-btn
							color="grey lighten-4"
							elevation="0"
							@click="closeNoCargoME"
						>
							{{ $t("button.cancel") }}
						</v-btn>
					</v-card-actions>
				</v-card>
			</v-dialog>
			<v-dialog width="60vw" v-model="openCargoService" persistent>
				<v-card elevation="0">
					<v-toolbar flat color="grey lighten-4 max-h-[2.5rem]">
						<v-toolbar-title class="mb-5">
							Thêm mới hàng hóa xây dựng thuộc danh
							mục</v-toolbar-title
						>
						<v-spacer></v-spacer>
						<v-btn icon @click="closeCargoService" class="mb-5">
							<v-icon>mdi-close</v-icon>
						</v-btn>
					</v-toolbar>
					<v-card-text class="white">
						<v-container>
							<v-form>
								<v-col>
									<v-form>
										<v-card elevation="0">
											<v-data-table
												:items="listCargoService"
												:headers="headersCargoService"
												show-select
												v-model="selectedCargoService"
												multi-sort
												@pagination="
													changePageService($event)
												"
												:server-items-length="
													countAllItemService
												"
												:page="eventPage.page"
												:no-results-text="
													$t('message.no_results')
												"
											>
												<template v-slot:top="{}">
													<v-card-title>
														<v-radio-group
															v-model="radios"
															mandatory
															row
														>
															<v-radio
																label="KV Hà Nội"
																value="KV Hà Nội"
																@click="radios1"
															></v-radio>
															<v-radio
																label="KV HCM"
																value="KV HCM"
																@click="radios2"
															></v-radio>
														</v-radio-group>

														<v-spacer></v-spacer>
														<v-btn
															icon
															@click="
																filterExist =
																	!filterExist
															"
														>
															<v-icon
																>mdi-filter
															</v-icon>
														</v-btn>
													</v-card-title>
													<v-divider></v-divider>
												</template>

												<template
													v-if="filterExist"
													v-slot:[`body.prepend`]
												>
													<v-divider></v-divider>
													<tr>
														<td></td>
														<td class="pl-0">
															<v-text-field
																v-model="
																	s_noi_dung_cong_viec_service
																"
																:label="
																	$t(
																		'cargo_ME.noi_dung_cong_viec',
																	)
																"
																outlined
																dense
																class="mt-2 rounded-pill"
																maxLength="255"
																@keyup="
																	filterByNoidungService(
																		$event,
																	)
																"
															></v-text-field>
														</td>
														<td class="pl-0">
															<v-text-field
																v-model="
																	s_quy_cach_ky_thuat_service
																"
																:label="
																	$t(
																		'cargo_ME.quy_cach_ky_thuat',
																	)
																"
																outlined
																dense
																class="mt-2 rounded-pill"
																maxLength="255"
																@keyup="
																	filterByQuyCachService(
																		$event,
																	)
																"
															></v-text-field>
														</td>
														<td class="pl-0">
															<v-text-field
																v-model="
																	s_ma_hieu_service
																"
																:label="
																	$t(
																		'cargo_ME.ma_hieu',
																	)
																"
																outlined
																dense
																class="mt-2 rounded-pill"
																maxLength="255"
																@keyup="
																	filterByMaHieuService(
																		$event,
																	)
																"
															></v-text-field>
														</td>
														<td class="pl-0">
															<v-text-field
																v-model="
																	s_don_vi_tinh_service
																"
																:label="
																	$t(
																		'cargo_ME.don_vi_tinh',
																	)
																"
																outlined
																dense
																class="mt-2 rounded-pill"
																maxLength="255"
																@keyup="
																	filterByDonViTinhService(
																		$event,
																	)
																"
															></v-text-field>
														</td>
														<td class="pl-0">
															<v-text-field
																v-model="
																	s_don_gia_ha_noi_str_service
																"
																:label="
																	$t(
																		'cargo_DVXD.don_gia_chuan_kv_hn',
																	)
																"
																outlined
																dense
																class="mt-2 rounded-pill"
																maxLength="255"
																@keyup="
																	filterByDonGiaChuanHN(
																		$event,
																	)
																"
															></v-text-field>
														</td>
														<td class="pl-0">
															<v-text-field
																v-model="
																	s_don_gia_hcm_str_service
																"
																:label="
																	$t(
																		'cargo_DVXD.don_gia_chuan_kv_HCM',
																	)
																"
																outlined
																dense
																class="mt-2 rounded-pill"
																maxLength="255"
																@keyup="
																	filterByDonGiaChuanHCM(
																		$event,
																	)
																"
															></v-text-field>
														</td>

														<td></td>
													</tr>
												</template>
											</v-data-table>
										</v-card>
									</v-form>
								</v-col>
							</v-form>
						</v-container>
					</v-card-text>
					<v-card-actions class="white">
						<v-spacer></v-spacer>
						<v-btn
							color="blue darken-1"
							elevation="0"
							dark
							@click="findCargoService()"
						>
							{{ $t("button.ok") }}
						</v-btn>
						<v-btn
							color="grey lighten-4"
							elevation="0"
							@click="closeCargoService"
						>
							{{ $t("button.cancel") }}
						</v-btn>
					</v-card-actions>
				</v-card>
			</v-dialog>
			<v-dialog width="60vw" v-model="openCargoME" persistent>
				<v-card elevation="0">
					<v-toolbar flat color="grey lighten-4 max-h-[2.5rem]">
						<v-toolbar-title class="mb-5">
							Thêm mới hàng hóa ME thuộc danh mục</v-toolbar-title
						>
						<v-spacer></v-spacer>
						<v-btn icon @click="closeCargoME" class="mb-5">
							<v-icon>mdi-close</v-icon>
						</v-btn>
					</v-toolbar>
					<v-card-text class="white">
						<v-container>
							<v-form>
								<v-col>
									<v-form>
										<v-card elevation="0">
											<v-data-table
												:items="listMeCargo"
												:headers="headersCargoME"
												show-select
												v-model="selectedCargoME"
												multi-sort
												@pagination="changePage($event)"
												:server-items-length="
													countAllItem
												"
												:page="eventPage.page"
												:no-results-text="
													$t('message.no_results')
												"
											>
												<template v-slot:top="{}">
													<v-card-title>
														<v-spacer></v-spacer>
														<v-btn
															icon
															@click="
																filterExist =
																	!filterExist
															"
														>
															<v-icon
																>mdi-filter
															</v-icon>
														</v-btn>
													</v-card-title>
													<v-divider></v-divider>
												</template>

												<template
													v-if="filterExist"
													v-slot:[`body.prepend`]
												>
													<v-divider></v-divider>
													<tr>
														<td></td>
														<td class="pl-0">
															<v-text-field
																v-model="
																	s_noi_dung_cong_viec
																"
																:label="
																	$t(
																		'cargo_ME.noi_dung_cong_viec',
																	)
																"
																outlined
																dense
																class="mt-2 rounded-pill"
																maxLength="255"
																@keyup="
																	filterByNoidungME(
																		$event,
																	)
																"
															></v-text-field>
														</td>
														<td class="pl-0">
															<v-text-field
																v-model="
																	s_quy_cach_ky_thuat
																"
																:label="
																	$t(
																		'cargo_ME.quy_cach_ky_thuat',
																	)
																"
																outlined
																dense
																class="mt-2 rounded-pill"
																maxLength="255"
																@keyup="
																	filterByQuyCachME(
																		$event,
																	)
																"
															></v-text-field>
														</td>
														<td class="pl-0">
															<v-text-field
																v-model="
																	s_ma_hieu
																"
																:label="
																	$t(
																		'cargo_ME.ma_hieu',
																	)
																"
																outlined
																dense
																class="mt-2 rounded-pill"
																maxLength="255"
																@keyup="
																	filterByMaHieuME(
																		$event,
																	)
																"
															></v-text-field>
														</td>
														<td class="pl-0">
															<v-text-field
																v-model="
																	s_don_vi_tinh
																"
																:label="
																	$t(
																		'cargo_ME.don_vi_tinh',
																	)
																"
																outlined
																dense
																class="mt-2 rounded-pill"
																maxLength="255"
																@keyup="
																	filterByDonViTinhME(
																		$event,
																	)
																"
															></v-text-field>
														</td>
														<td class="pl-0">
															<v-text-field
																v-model="
																	s_don_gia_vat_tu_vat_lieu_str
																"
																:label="
																	$t(
																		'cargo_ME.don_gia_chuan_vt_vl',
																	)
																"
																outlined
																dense
																class="mt-2 rounded-pill"
																maxLength="255"
																@keyup="
																	filterByDonGiaChuanME(
																		$event,
																	)
																"
															></v-text-field>
														</td>
														<td class="pl-0">
															<v-text-field
																v-model="
																	s_don_gia_nhan_cong_str
																"
																:label="
																	$t(
																		'cargo_ME.don_gia_chuan_nhan_cong',
																	)
																"
																outlined
																dense
																class="mt-2 rounded-pill"
																maxLength="255"
																@keyup="
																	filterByDonGiaNhanCongME(
																		$event,
																	)
																"
															></v-text-field>
														</td>

														<td></td>
													</tr>
												</template>
											</v-data-table>
										</v-card>
									</v-form>
								</v-col>
							</v-form>
						</v-container>
					</v-card-text>
					<v-card-actions class="white">
						<v-spacer></v-spacer>
						<v-btn
							color="blue darken-1"
							elevation="0"
							dark
							@click="findCargoME()"
						>
							{{ $t("button.ok") }}
						</v-btn>
						<v-btn
							color="grey lighten-4"
							elevation="0"
							@click="closeCargoME"
						>
							{{ $t("button.cancel") }}
						</v-btn>
					</v-card-actions>
				</v-card>
			</v-dialog>
		</v-row>
	</v-card>
</template>

<script>
import "@koumoul/vjsf/lib/VJsf.css";
import "@koumoul/vjsf/lib/deps/third-party.js";
import VJsf from "@koumoul/vjsf/lib/VJsf";
import globalService from "@/services/global.service";
import administratorAPI from "../../administrator/administrator.api";
import FileRequestData from "./FileRequestData.vue";
import UserInfosRequestData from "./UserInfosRequestDataV2.vue";
import RelateRequestData from "./RelateRequestData.vue";
import moment from "moment";
import RequestFormDataDto from "@/models/form-data.dto";
import AttachmentFileRequestData from "./AttachmentFileRequestData.vue";
import ViewAttachmentFile from "./ViewAttachmentFile.vue";
// import ExportfileVue from "../modulepopup/Exportfile.vue";
import constant from "@/common/constant";

import {
	// component
	TiptapVuetify,
	// extensions
	Heading,
	Bold,
	Italic,
	Strike,
	Underline,
	Code,
	Paragraph,
	BulletList,
	OrderedList,
	ListItem,
	Link,
	Blockquote,
	HardBreak,
	HorizontalRule,
	History,
	Image,
	Table,
	TableCell,
	TableHeader,
	TableRow,
} from "tiptap-vuetify";
import ExprEval from "expr-eval";
import store from "@/store";
import { AgGridVue } from "ag-grid-vue";
import FileVue from "@/components/form-control/m-file.vue";
import FileRenderer from "@/components/form-control/fileRenderer";
import numeral from "@/plugins/numeral";
import xlsx from "json-as-xlsx";
import * as XLSX from "xlsx";
import ListSite from "../ViewSites/ListSite.vue";
import InformationInExchangeDto from "@/models/informationInExchange.dto";
import SaveFieldDataVue from "../modulepopup/SaveFieldData.vue";
// import { default as VNnum2words } from "vn-num2words";
import docsoModule from "@/modules/docso.module";
import ComboboxCellEditorsVue from "../modulepopup/ComboboxCellEditors.vue";
import DateEditor from "@/components/form-control/dateEditor";
import SignDataDto from "@/models/sign-data.dto";
import CargoServiceDto from "@/models/cargo-service.dto";
import CargoMeDto from "@/models/cargo-me.dto";

// import DateCellEdittorVue from "../modulepopup/DateCellEdittor.vue";

export default {
	name: "VSMFEDeclarationV4",
	props: {
		requestDataV2: {},
		isSaved: {},
		m_Stamp: {},
		approve_requestDto: {},
		is_reload: Boolean,
	},
	components: {
		VJsf,
		FileRequestData,
		UserInfosRequestData,
		RelateRequestData,
		AttachmentFileRequestData,
		ViewAttachmentFile,
		// ExportfileVue,
		TiptapVuetify,
		AgGridVue,
		fileEditor: FileVue,
		fileRenderer: FileRenderer,
		ListSite,
		SaveFieldDataVue,
		ComboboxCellEditorsVue,
		// DateCellEdittorVue
	},
	data() {
		return {
			allMaHieuMe: [],
			allMaHieuServices: [],
			isHHXD: false,
			isHHME: false,
			ref_don_gia_ncc_nhan_cong: 0,
			ref_don_gia_ncc_vl_vt: 0,
			ref_cargo_me_so_luong: 0,
			ref_don_gia_nhan_cong_str: 0,
			ref_don_gia_chuan_vl_vt: 0,
			ref_don_gia_ha_noi_str: 0,
			ref_don_gia_hcm_str: 0,
			ref_so_luong: 0,
			ref_don_gia_ncc: 0,
			rules: {
				regex: (value) => {
					if (!value) return false;
					return (
						/^[1-9]+\d*$/.test(("" + value).trim()) ||
						this.$t("message.non_negative_number")
					);
				},
			},
			// Im port
			reader: new FileReader(),
			m_ManageStamp: null,
			dataFileCSV: null,
			jsonSchemaForm: {
				type: "object",
				properties: {},
			},
			model: {},
			files: {},
			content: "",
			tableSchema: [], // Danh sách các bảng có trong form
			tableModel: [], // dánh sách dữ liệu của bảng trong form
			objectSchema: {},
			objectModel: {},
			valid: null,
			itemAddToTable: {},
			flagEdit: {},
			isEdit: false,
			tab: 0,
			tabChat: 0,
			showBieumau: true,
			attachmentFilePDF: {},
			user_info: this.getUserInfo(),
			listAttachmentFlieByRequests: [],
			moment: moment,
			listUserReqdataProcessHis: {},
			requestdataProcessHis: null,
			idView: null,
			idTemplateForm: null,
			listTemplateForm: [],
			m_isSaved: {},
			m_requestDto: null,
			listAttachmentFlieByRequest: [],
			listUserInfos: [],
			form: [],
			options: {
				fieldProps: {
					outlined: "outlined",
					dense: "dense",
				},
				formats: {
					date: function (e) {
						let value = moment(e);
						return !value.isValid()
							? ""
							: value.format(constant.format.vi_date);
					},
				},
				datePickerProps: {
					"prepend-icon": "",
					"no-title": true,
				},
				initialValidation: "none",
				readOnlyFieldProps: {
					hideDetails: false,
				},
				markdownit: {
					html: true,
				},
				rules: {
					fileSize: (value) => {
						return (
							!value ||
							value.size < 20000 ||
							"File size should be less than 2 MB!"
						);
					},
					nameFile: (value) => {
						return (
							!value ||
							!value.includes(value.name.split(".").pop()) ||
							"File name"
						);
					},
				},
			},
			arr: [
				"jpeg",
				"pdf",
				"png",
				"jpg",
				"gif",
				"tiff",
				"psd",
				"eps",
				"raw",
			],
			formData: null,
			xOptions: {
				messages: {
					pattern: this.$t("validator.pattern"),
					required: this.$t("validator.required"),
					maxLength: this.$t("validator.max_length"),
					minLength: this.$t("validator.min_length"),
					maximum: this.$t("validator.max_length"),
					minimum: this.$t("validator.min_length"),
				},
			},
			openSaveFieldData: false,
			openFileRequestData: false,
			openAttachmentFilePDF: false,
			openAttachmentFileRequestData: false,
			openUserInfosRequestData: false,
			openRelateRequestData: false,
			openViewAttachmentFile: false,
			openViewTemplateForm: false,
			items: [],
			search: "",
			singleSelect: false,
			stepDatas: [],
			selected: [],
			selecteds: [],
			dateFormat: "DD/MM/yyyy HH:mm",
			// listRequestData: [],
			list_Organizations: [],
			listOrganizations: [],
			headers: [
				{
					text: "Tên file ",
					value: "fileName",
					sortable: false,

					filter: (value) => {
						if (!this.fileName) return true;
						if (!value) return;
						return this.nonAccentVietnamese(value)
							.toLocaleUpperCase()
							.includes(
								this.nonAccentVietnamese(
									this.fileName,
								).toLocaleUpperCase(),
							);
					},
					width: "28%",
				},
				{
					text: "Biểu mẫu",
					value: "templateForm.templateFormName",

					filter: (value) => {
						if (!this.templateFormName) return true;
						if (!value) return;
						return this.nonAccentVietnamese(value)
							.toLocaleUpperCase()
							.includes(
								this.nonAccentVietnamese(
									this.templateFormName,
								).toLocaleUpperCase(),
							);
					},
					width: "28%",
				},

				{
					text: this.$t("label.updated_name"),
					value: "createdName",

					filter: (value) => {
						if (!this.createdName) return true;

						return this.nonAccentVietnamese(value)
							.toLocaleUpperCase()
							.includes(
								this.nonAccentVietnamese(
									this.createdName,
								).toLocaleUpperCase(),
							);
					},
					width: "20%",
				},

				{
					text: this.$t("label.updated_date"),
					value: "createdDate",

					formatter: (x) =>
						x ? moment(x).format(this.dateFormat) : null,
					filter: (value) => {
						if (!this.createdDate) return true;
						return value.includes(this.createdDate);
					},
					width: "20%",
				},
			],
			headerss: [
				{
					text: "Tên file",
					value: "fileName",
					filter: (value) => {
						if (!this.fileName) return true;
						if (!value) return;
						return this.nonAccentVietnamese(value)
							.toLocaleUpperCase()
							.includes(
								this.nonAccentVietnamese(
									this.fileName,
								).toLocaleUpperCase(),
							);
					},
					width: "56%",
				},
				// {
				// 	text: "Kiểu file",
				// 	value: "fileExtension",

				// 	filter: (value) => {
				// 		if (!this.fileExtension) return true;
				// 		if (!value) return;
				// 		return this.nonAccentVietnamese(value)
				// 			.toLocaleUpperCase()
				// 			.includes(
				// 				this.nonAccentVietnamese(
				// 					this.fileExtension,
				// 				).toLocaleUpperCase(),
				// 			);
				// 	},
				// 	width: "28%",
				// },
				{
					text: this.$t("label.updated_name"),
					value: "createdName",
					width: "20%",
				},
				{
					text: this.$t("label.updated_date"),
					value: "createdDate",

					formatter: (x) =>
						x ? moment(x).format(this.dateFormat) : null,
					filter: (value) => {
						if (!this.createdDate) return true;
						return value.includes(this.createdDate);
					},
					width: "20%",
				},
			],
			listFile: [],
			requestFormDataDto: RequestFormDataDto,
			extensions: [
				History,
				Table,
				TableCell,
				TableHeader,
				TableRow,
				Blockquote,
				Link,
				Underline,
				Strike,
				Italic,
				ListItem, // if you need to use a list (BulletList, OrderedList)
				BulletList,
				OrderedList,
				Image,
				[
					Heading,
					{
						// Options that fall into the tiptap's extension
						options: {
							levels: [1, 2, 3],
						},
					},
				],
				Bold,
				Link,
				Code,
				HorizontalRule,
				Paragraph,
				HardBreak, // line break on Shift + Ctrl + Enter
			],
			procesHisTemps: [],
			ALL_STATUS: [],
			calculator: {},
			tableCalculator: {},
			json_fields: [],
			json_data: [],
			json_meta: [],
			model_json: [],
			file: null,
			categories: [],
			panels: [0, 1, 2, 3],
			formLoading: true,
			m_manageStampInfo: null,
			m_objectModel: {},
			isCvd: false,
			update_at: null,
			columnDefs: [],
			rowSelection: [],
			gridApi: [],
			columnApi: [],
			gridColumnApi: [],
			defaultColDef: {
				flex: 1,
				// minWidth: 110,
				width: 5,
				editable: true,
				resizable: true,
				sortable: true,
				filter: true,
			},
			rowData: null,
			pinnedTopRowData: null,
			pinnedBottomRowData: null,
			isQR: false,
			isWater: false,
			editingTableId: null,
			dialogSite: false,
			approveRequestDto: null,
			statusRequestData: "",
			isStatusRequestData: false,
			STATUS_TRALAI_CODE: this.$t("status_code.Reject"),
			STATUS_DANGSOAN_CODE: this.$t("status_code.dang_soan"),
			fieldData: [],
			hisTrade: [],
			hisTradeCustomer: [],
			userTrade: InformationInExchangeDto,
			material: [],
			listSign: [],
			signData: SignDataDto,
			caches: {
				categories: [],
			},
			dialog: {
				check_material: false,
				check_material_me: false,
			},
			total_fail_value: "",
			total_greater_value: "",
			total_less_value: "",
			unknown_value: "",
			me_goods_total_fail_value: "",
			me_goods_total_greater_value: "",
			me_goods_total_less_value: "",
			me_unknown_value: "",
			me_human_total_fail_value: "",
			me_human_total_greater_value: "",
			me_human_total_less_value: "",
			region: {},
			openNoCargoService: false,
			openNoCargoME: false,
			openCargoService: false,
			openCargoME: false,
			listMeCargo: [],
			countAllItem: 0,
			countAllItemService: 0,
			eventPage: { page: 1 },
			editedIndex: -1,
			filterExist: false,
			s_noi_dung_cong_viec: null,
			s_quy_cach_ky_thuat: null,
			s_ma_hieu: null,
			s_don_vi_tinh: null,
			s_don_gia_vat_tu_vat_lieu_str: null,
			s_don_gia_nhan_cong_str: null,
			s_noi_dung_cong_viec_service: null,
			s_quy_cach_ky_thuat_service: null,
			s_ma_hieu_service: null,
			s_don_vi_tinh_service: null,
			s_don_gia_ha_noi_str_service: null,
			s_don_gia_hcm_str_service: null,
			listCargoService: [],
			radios: null,
			radio: 0,
			checkKV: null,
			checkKVs: 0,
			selectedCargoME: [],
			selectedCargoService: [],
			value: null,
			value_NCC_ME: null,
			materials: [],
			searchQueue: [],
			selectedTableId_Me: null,
			objectTableId_Me: [],
			selectedTableId_Service: null,
			objectTableId_Service: [],
			onCallingApi: [],
			m_CargoServiceDto: CargoServiceDto,
			m_CargoMeDto: CargoMeDto,
			headersCargoME: [
				{
					text: this.$t("cargo_ME.noi_dung_cong_viec"),
					value: "noi_dung_cong_viec",
					filter: (value) => {
						if (!this.s_noi_dung_cong_viec || !value) return true;

						return this.nonAccentVietnamese(value)
							.toLocaleUpperCase()
							.includes(
								this.nonAccentVietnamese(
									this.s_noi_dung_cong_viec,
								)
									.trim()
									.toLocaleUpperCase(),
							);
					},
				},
				{
					text: this.$t("cargo_ME.quy_cach_ky_thuat"),
					value: "quy_cach_ky_thuat",
					filter: (value) => {
						if (!this.s_description || !value) return true;

						return this.nonAccentVietnamese(value)
							.toLocaleUpperCase()
							.includes(
								this.nonAccentVietnamese(this.s_description)
									.trim()
									.toLocaleUpperCase(),
							);
					},
				},
				{
					text: this.$t("cargo_ME.ma_hieu"),
					value: "ma_hieu",
					filter: (value) => {
						if (!this.s_modified_name || !value) return true;

						return this.nonAccentVietnamese(value)
							.toLocaleUpperCase()
							.includes(
								this.nonAccentVietnamese(this.s_modified_name)
									.trim()
									.toLocaleUpperCase(),
							);
					},
				},
				{
					text: this.$t("cargo_ME.don_vi_tinh"),
					value: "don_vi_tinh",
					filter: (value) => {
						if (!this.s_modified_name || !value) return true;

						return this.nonAccentVietnamese(value)
							.toLocaleUpperCase()
							.includes(
								this.nonAccentVietnamese(this.s_modified_name)
									.trim()
									.toLocaleUpperCase(),
							);
					},
				},
				{
					text: this.$t("cargo_ME.don_gia_chuan_vt_vl"),
					value: "don_gia_vat_tu_vat_lieu",
					filter: (value) => {
						if (!this.s_modified_name || !value) return true;

						return this.nonAccentVietnamese(value)
							.toLocaleUpperCase()
							.includes(
								this.nonAccentVietnamese(this.s_modified_name)
									.trim()
									.toLocaleUpperCase(),
							);
					},
				},
				{
					text: this.$t("cargo_ME.don_gia_chuan_nhan_cong"),
					value: "don_gia_nhan_cong",
					filter: (value) => {
						if (!this.s_modified_name || !value) return true;

						return this.nonAccentVietnamese(value)
							.toLocaleUpperCase()
							.includes(
								this.nonAccentVietnamese(this.s_modified_name)
									.trim()
									.toLocaleUpperCase(),
							);
					},
				},
			],
			headersCargoService: [
				{
					text: this.$t("cargo_ME.noi_dung_cong_viec"),
					value: "noi_dung_cong_viec",
					filter: (value) => {
						if (!this.s_noi_dung_cong_viec_service || !value)
							return true;

						return this.nonAccentVietnamese(value)
							.toLocaleUpperCase()
							.includes(
								this.nonAccentVietnamese(
									this.s_noi_dung_cong_viec_service,
								)
									.trim()
									.toLocaleUpperCase(),
							);
					},
				},
				{
					text: this.$t("cargo_ME.quy_cach_ky_thuat"),
					value: "quy_cach_ky_thuat",
					filter: (value) => {
						if (!this.s_quy_cach_ky_thuat_service || !value)
							return true;

						return this.nonAccentVietnamese(value)
							.toLocaleUpperCase()
							.includes(
								this.nonAccentVietnamese(
									this.s_quy_cach_ky_thuat_service,
								)
									.trim()
									.toLocaleUpperCase(),
							);
					},
				},
				{
					text: this.$t("cargo_ME.ma_hieu"),
					value: "ma_hieu",
					filter: (value) => {
						if (!this.s_ma_hieu_service || !value) return true;

						return this.nonAccentVietnamese(value)
							.toLocaleUpperCase()
							.includes(
								this.nonAccentVietnamese(this.s_ma_hieu_service)
									.trim()
									.toLocaleUpperCase(),
							);
					},
				},
				{
					text: this.$t("cargo_ME.don_vi_tinh"),
					value: "don_vi_tinh",
					filter: (value) => {
						if (!this.s_don_vi_tinh_service || !value) return true;

						return this.nonAccentVietnamese(value)
							.toLocaleUpperCase()
							.includes(
								this.nonAccentVietnamese(
									this.s_don_vi_tinh_service,
								)
									.trim()
									.toLocaleUpperCase(),
							);
					},
				},
				{
					text: this.$t("cargo_DVXD.don_gia_chuan_kv_hn"),
					value: "don_gia_ha_noi",
					filter: (value) => {
						if (!this.s_don_gia_ha_noi_str_service || !value)
							return true;

						return this.nonAccentVietnamese(value)
							.toLocaleUpperCase()
							.includes(
								this.nonAccentVietnamese(
									this.s_don_gia_ha_noi_str_service,
								)
									.trim()
									.toLocaleUpperCase(),
							);
					},
				},
				{
					text: this.$t("cargo_DVXD.don_gia_chuan_kv_HCM"),
					value: "don_gia_hcm",
					filter: (value) => {
						if (!this.s_don_gia_hcm_str_service || !value)
							return true;

						return this.nonAccentVietnamese(value)
							.toLocaleUpperCase()
							.includes(
								this.nonAccentVietnamese(
									this.s_don_gia_hcm_str_service,
								)
									.trim()
									.toLocaleUpperCase(),
							);
					},
				},
			],
		};
	},
	watch: {
		requestDataV2(newValue) {
			this.m_requestDto = newValue;
		},
		async isSaved(value) {
			this.m_isSaved = value;
			if (this.m_isSaved.state == 1) {
				await this.getStatusOfRequestData();
				if (!this.isStatusRequestData) {
					return (
						this.toastError(this.$t("error.no_request")),
						this.$router.push({
							path: `/phieu-yeu-cau/dang-soan`,
						})
					);
				}

				this.getStepInProcessesByIdRequestData();
				await this.save();
				if (this.FEATURE.ON_REQUEST) {
					await this.saveFieldDataV2NoToast();
				} else {
					await this.saveFieldData();
				}
				this.$emit("save", true);
			}
		},
		is_reload(val) {
			console.log(val);
			this.getStepInProcessesByIdRequestData();
			this.getAttachmentFileRequestV3();
		},
		// objectModel(value) {

		// 	// this.m_objectModel = value;
		// },
		m_Stamp(val) {
			this.m_ManageStamp = val;
			if (val) {
				this.getAttachmentFileRequestV3();
			}
		},
		openFileRequestData(val) {
			if (!val) {
				this.getAttachmentFileRequestV3();
			}
		},
		openAttachmentFileRequestData(val) {
			if (!val) {
				this.getAttachmentFileRequestV3();
			}
		},
		openViewAttachmentFile(val) {
			if (!val) {
				this.getAttachmentFileRequestV3();
			}
		},
		value_NCC_ME: function (value) {
			if (value) {
				this.value = value.name ?? value ?? "";
				this.params.stopEditing();
			}
		},
		"m_CargoServiceDto.so_luong"(val) {
			if (val) {
				this.m_CargoServiceDto.thanh_tien =
					val * this.m_CargoServiceDto.don_gia_ncc;
			}
		},
		"m_CargoServiceDto.don_gia_ncc"(val) {
			if (val) {
				this.m_CargoServiceDto.thanh_tien =
					val * this.m_CargoServiceDto.so_luong;
			}
		},
		"m_CargoMeDto.so_luong"(val) {
			this.m_CargoMeDto.thanh_tien =
				+val *
				(+this.m_CargoMeDto.don_gia_ncc_nhan_cong +
					+this.m_CargoMeDto.don_gia_ncc_vt_vl);
		},

		"m_CargoMeDto.don_gia_ncc_vt_vl"(val) {
			this.m_CargoMeDto.thanh_tien =
				+this.m_CargoMeDto.so_luong *
				(+this.m_CargoMeDto.don_gia_ncc_nhan_cong + +val);
		},
		"m_CargoMeDto.don_gia_ncc_nhan_cong"(val) {
			this.m_CargoMeDto.thanh_tien =
				+this.m_CargoMeDto.so_luong *
				(+this.m_CargoMeDto.don_gia_ncc_vt_vl + +val);
		},
	},
	computed: {
		decodeUrlDR() {
			if (!this.m_requestDto.dataRoomPath) return "";
			let subIndex = this.m_requestDto.dataRoomPath.split("/sites/");
			return decodeURI(subIndex[subIndex.length - 1]);
		},
		decodeUrlDRDataRoomPath() {
			return decodeURI(this.m_requestDto.dataRoomPath);
		},
	},
	async mounted() {
		this.m_requestDto = this.requestDataV2;

		if (this.m_requestDto?.requestGroupName.includes(this.$t("enum.CVD"))) {
			this.isCvd = true;
		}
		this.m_isSaved = this.isSaved;
		this.m_ManageStamp = this.m_Stamp;
		this.initialize();
		await this.getAllSignData();
		this.getTotalPage();
		// this.FormData();
	},

	methods: {
		onCloseDeleteDialog() {
			this.openSaveFieldData = false;
		},
		close() {
			this.$nextTick(() => {
				this.editedItem = Object.assign({}, this.defaultItem);
				this.editedIndex = -1;
			});
		},

		saveItemInTable() {
			if (this.editedIndex > -1) {
				Object.assign(
					this.dessertsDuowngTora[this.editedIndex],
					this.editedItem,
				);
			} else {
				this.dessertsDuowngTora.push(this.editedItem);
			}
			this.close();
		},

		onSave(value) {
			this.m_requestDto.userInfos = this.mergeArray(
				this.m_requestDto.userInfos,
				value,
			);
			this.updateRequestData();
		},
		onSaveRelate(value) {
			this.m_requestDto.requestDataList = this.mergeArray(
				this.m_requestDto.requestDataList,
				value,
			);
			this.updateRequestRelateData();
		},
		onSaveFile(value) {
			this.listTemplateForm.push(...value);
			this.getLoadAttachmentFileRequestV2();
		},
		comfirmSaveField(value) {
			let useTemplate = value == 0 ? true : false;
			this.saveFieldData(useTemplate);
		},
		onSaveFileAta(value) {
			this.listAttachmentFlieByRequests.push(...value);
		},
		async initialize() {
			this.getAttachmentFileRequestV3();
			this.getAllStatus();
			this.getStepInProcessesByIdRequestData();
			this.getHisTrade();
		},

		async getStepInProcessesByIdRequestData() {
			this.componentLoading.process = true;
			globalService
				.getData_NoAsync(
					administratorAPI.API_GetByCurrentSteps(
						this.m_requestDto.id,
					),
				)
				.then((response) => {
					this.componentLoading.process = false;
					if (
						!response ||
						response.status != 200 ||
						!response.data ||
						!response.data.state
					) {
						return;
					}
					this.stepDatas = response.data.data.sort(
						(e1, e2) => e1.stepOrder - e2.stepOrder,
					);
					this.liststepDatas = response.data.data.filter((ele) => {
						return ele.isActive;
					});
					this.stepData = this.liststepDatas[0];
					this.getReqdataProcessHis();
				})
				.finally(() => {
					this.componentLoading.process = false;
				});
		},
		FormData() {
			globalService
				.getData_NoAsync(
					administratorAPI.API_GetFormDataById(this.m_requestDto.id),
				)
				.then((response) => {
					this.formLoading = false;
					if (
						!response ||
						response.status != 200 ||
						!response.data ||
						!response.data.state
					) {
						return;
					}
					if (response.data.data.length > 0) {
						// code mới \\
						this.formData = response.data.data[0];
						if (this.formData.objectSchema) {
							this.objectSchema = JSON.parse(
								this.formData.objectSchema,
							);
						}
						if (this.formData.objectModel) {
							this.objectModel = JSON.parse(
								this.formData.objectModel,
							);
						}
					}
				});
		},

		getAllStatus() {
			globalService
				.getData_NoAsync(administratorAPI.API_GetAllStatus())
				.then((response) => {
					if (
						!response ||
						response.status != 200 ||
						!response.data ||
						!response.data.state
					) {
						return;
					}
					this.ALL_STATUS = response.data.data.filter((entry) => {
						{
							return !entry.isDelete && entry.isActive;
						}
					});
				});
		},
		getColor(item) {
			if (!item.status) return "#9E9E9E";
			if (item.status.trim() == this.$t("status.processing")) {
				return "#FBBC3D";
			}

			if (item.status.includes(this.$t("status.approval"))) {
				return "#66BB6A";
			}
			if (item.status.includes(this.$t("status.exchange"))) {
				return "#03A9F4";
			}
			let status = this.ALL_STATUS.find(
				(ele) =>
					ele.statusName.toLocaleUpperCase().trim() ==
					item.status.toLocaleUpperCase().trim(),
			);
			if (!status?.statusColor) return "#9E9E9E";
			return "#" + status.statusColor;
		},
		remove(item) {
			this.m_requestDto.userInfos.splice(
				this.m_requestDto.userInfos.indexOf(item),
				1,
			);

			this.updateRequestData();
		},
		async deleteAttachmentFile(item) {
			let response;
			this.idView = item.id;

			try {
				response = await globalService.deleteData_Async(
					administratorAPI.API_DeleteAttachmentFile(this.idView),
				);
				if (!response || !response.state) {
					return [];
				}
				if (response) {
					let index = this.listTemplateForm.indexOf(item);
					this.listTemplateForm.splice(index, 1);
					this.toastSuccess(this.$t("message.delete_success"));
				}

				// this.listUserInfos =get response.data.filter((entry) => {
				// 	return !entry.isDelete && entry.isActive;
				// });
			} catch (error) {
				this.toastError(error);
				return;
			}
		},
		async deleteAttachmentFileV2(item) {
			let response;
			this.idView = item.id;

			try {
				response = await globalService.deleteData_Async(
					administratorAPI.API_DeleteAttachmentFile(this.idView),
				);
				if (!response || !response.state) {
					return [];
				}
				if (response) {
					let index = this.listAttachmentFlieByRequests.indexOf(item);
					this.listAttachmentFlieByRequests.splice(index, 1);

					this.toastSuccess(this.$t("message.delete_success"));
				}

				// this.listUserInfos =get response.data.filter((entry) => {
				// 	return !entry.isDelete && entry.isActive;
				// });
				await this.getAttachmentFileRequestV3();
			} catch (error) {
				this.toastError(error);
				return;
			}
		},
		async editRelateRequestData() {
			await this.getStatusOfRequestData();
			if (!this.isStatusRequestData) {
				return (
					this.toastError(this.$t("error.no_request")),
					this.$router.push({
						path: `/phieu-yeu-cau/dang-soan`,
					})
				);
			}
			this.openRelateRequestData = true;
		},
		editViewAttachmentFile(item) {
			this.openViewAttachmentFile = true;
			this.idView = item.id;
		},
		async editUserInfosRequestData() {
			await this.getStatusOfRequestData();
			if (!this.isStatusRequestData) {
				return (
					this.toastError(this.$t("error.no_request")),
					this.$router.push({
						path: `/phieu-yeu-cau/dang-soan`,
					})
				);
			}
			this.openUserInfosRequestData = true;
		},
		editAttachmentFilePDF(item) {
			this.openAttachmentFilePDF = true;
			this.attachmentFilePDF = item;
		},
		async editAttachmentFileRequestData() {
			await this.getStatusOfRequestData();
			if (!this.isStatusRequestData) {
				return (
					this.toastError(this.$t("error.no_request")),
					this.$router.push({
						path: `/phieu-yeu-cau/dang-soan`,
					})
				);
			}
			this.openAttachmentFileRequestData = true;
		},
		async editFileRequestData() {
			await this.getStatusOfRequestData();
			if (!this.isStatusRequestData) {
				return (
					this.toastError(this.$t("error.no_request")),
					this.$router.push({
						path: `/phieu-yeu-cau/dang-soan`,
					})
				);
			}
			this.openFileRequestData = true;
		},
		async editSaveFieldData() {
			this.openSaveFieldData = true;
		},

		onClose(value) {
			if (value) {
				this.openRelateRequestData = false;
				this.openUserInfosRequestData = false;
				this.openAttachmentFileRequestData = false;
				this.openFileRequestData = false;
				this.openViewAttachmentFile = false;
				this.openAttachmentFilePDF = false;
				this.openViewTemplateForm = false;
				this.dialogSite = false;
				this.openSaveFieldData = false;
			}
		},

		async getLoadAttachmentFileRequestV2() {
			let response;

			response = await globalService.getData_Async(
				administratorAPI.API_GetAllAttachmentFileByRequestDataId(
					this.m_requestDto.id,
				),
			);
			if (!response || !response.state) {
				return [];
			}

			this.listTemplateForm = response.data.filter(
				(ele) => ele.templateForm,
			);
		},
		getAttachmentFileRequestV3() {
			this.componentLoading.attachment = true;
			this.componentLoading.document = true;
			globalService
				.getData_NoAsync(
					administratorAPI.API_GetAllAttachmentFileByRequestDataId(
						this.m_requestDto.id,
					),
				)
				.then((response) => {
					this.componentLoading.attachment = false;
					this.componentLoading.document = false;
					this.listAttachmentFlieByRequests = [];
					this.listTemplateForm = [];
					if (!response) {
						return;
					}
					if (response.status != 200) {
						return;
					}
					if (!response.data || !response.data.state) {
						return;
					}
					this.listAttachmentFlieByRequests.push(
						...response.data.data.filter(
							(ele) => !ele.templateForm,
						),
					);
					this.listTemplateForm.push(
						...response.data.data.filter((ele) => {
							ele.showAllTemplateName = false;
							ele.showAllTemplateNameFileName = false;
							return ele.templateForm;
						}),
					);
				})
				.finally(() => {
					this.componentLoading.attachment = false;
					this.componentLoading.document = false;
				});
		},
		deepFormatObject(
			objectModel,
			properties,
			targetFormat = constant.format.vi_date,
			sourceFormat = constant.format.date,
			formatNumber = constant.type.string,
		) {
			if (!properties || !objectModel) {
				return;
			}
			for (let key in objectModel) {
				if (!properties[key]) {
					continue;
				}
				try {
					if (!properties[key]?.Headers) {
						if (
							properties[key]?.type == constant.type.number &&
							!properties[key]?.double
						) {
							try {
								if (formatNumber == constant.type.string) {
									objectModel[key] = numeral(
										objectModel[key],
									).format();
								} else {
									objectModel[key] = numeral(
										objectModel[key],
									).value();
								}
							} catch (e) {
								console.log(e);
							}
							continue;
						}
						if (properties[key]?.format != constant.type.date) {
							continue;
						}
						if (
							!objectModel[key] ||
							typeof objectModel[key] != constant.type.string
						) {
							continue;
						}
						let tmp = moment(objectModel[key], sourceFormat);
						if (`${objectModel[key]}`.includes("/")) {
							tmp = moment(
								objectModel[key],
								constant.format.vi_date,
							);
						}
						if (`${objectModel[key]}`.includes("-")) {
							tmp = moment(
								objectModel[key],
								constant.format.date,
							);
						}
						if (!tmp.isValid()) {
							continue;
						}
						objectModel[key] = tmp.format(targetFormat);
					} else {
						let headers = JSON.parse(properties[key]?.Headers);
						if (!headers) {
							continue;
						}
						for (let header of headers) {
							for (let row of objectModel[key]) {
								if (!row || row == null) {
									continue;
								}
								if (this.isEmpty(row)) {
									row = null;
									continue;
								}
								if (!row[header.value]) {
									row[header.value] = "";
								}
								if (header?.type == constant.type.number) {
									if (!row[header.value]) {
										continue;
									}
									try {
										if (
											formatNumber == constant.type.string
										) {
											row[header.value] = numeral(
												row[header.value],
											).format();
										} else {
											if (!row.sumRow) {
												row[header.value] = numeral(
													row[header.value],
												).value();
											}
										}
									} catch (e) {
										console.log(e);
									}
									continue;
								}
								if (header?.type == constant.type.date) {
									if (
										!row ||
										!row[header.value] ||
										typeof row[header.value] !=
											constant.type.string
									) {
										continue;
									}
									let tmp = moment(
										row[header.value],
										constant.format.vi_date,
									);
									if (`${row[header.value]}`.includes("-")) {
										tmp = moment(
											row[header.value],
											constant.format.date,
										);
									}
									if (`${row[header.value]}`.includes("/")) {
										tmp = moment(
											row[header.value],
											constant.format.vi_date,
										);
									}
									if (!tmp.isValid()) {
										continue;
									}
									row[header.value] =
										tmp.format(targetFormat);
								}
							}
						}
					}
				} catch (e) {
					console.log(e);
					continue;
				}
			}
		},
		async saveFormData() {
			await this.getStatusOfRequestData();
			if (!this.isStatusRequestData) {
				return (
					this.toastError(this.$t("error.no_request")),
					this.$router.push({
						path: `/phieu-yeu-cau/dang-soan`,
					})
				);
			}
			if (this.$refs?.form) {
				if (!this.$refs.form.validate()) {
					this.toastError(this.$t("message.required_form"));
					return;
				}
			}

			this.m_objectModel = Object.assign(
				{},
				{ ...this.m_objectModel, ...this.objectModel },
			);
			this.deepFormatObject(
				this.m_objectModel,
				this.objectSchema.properties,
				this.$t("format.date"),
			);
			if (this.formData) {
				this.formData["objectSchema"] = JSON.stringify(
					this.objectSchema,
				);
				this.formData["objectModel"] = JSON.stringify(
					this.m_objectModel,
				);
				this.requestFormDataDto = this.formData;

				let response;
				this.requestFormDataDto.isActive = this.formData.isActive;
				this.requestFormDataDto.form = null;
				this.requestFormDataDto.modifiedDate = new Date();
				try {
					response = await globalService.putData_Async(
						administratorAPI.API_UpdateFormDataCustom(
							this.requestFormDataDto.id,
						),
						this.requestFormDataDto,
					);
					if (!response || !response.state) {
						this.toastError(this.$t("error.update"));
					}
					this.requestFormDataDto = response.data;

					this.toastSuccess(this.$t("message.update_success"));
				} catch (e) {
					console.log(e);
				}
				// reload lại form
				await this.FormData();
			}
		},
		async saveFormDataNoFillIn() {
			if (this.$refs?.form) {
				if (!this.$refs.form.validate()) {
					this.toastError(this.$t("message.required_form"));
					return;
				}
			}
			this.m_objectModel = Object.assign(
				{},
				{ ...this.m_objectModel, ...this.objectModel },
			);
			this.deepFormatObject(
				this.m_objectModel,
				this.objectSchema.properties,
				this.$t("format.date"),
			);
			if (this.formData) {
				this.formData["objectSchema"] = JSON.stringify(
					this.objectSchema,
				);
				this.formData["objectModel"] = JSON.stringify(
					this.m_objectModel,
				);
				this.requestFormDataDto = this.formData;

				let response;
				this.requestFormDataDto.isActive = this.formData.isActive;
				this.requestFormDataDto.form = null;
				this.requestFormDataDto.modifiedDate = new Date();
				try {
					response = await globalService.putData_Async(
						administratorAPI.API_UpdateFormDataCustomNoFillIn(
							this.requestFormDataDto.id,
						),
						this.requestFormDataDto,
					);
					if (!response || !response.state) {
						this.toastError(this.$t("error.update"));
					}
					this.requestFormDataDto = response.data;
				} catch (e) {
					console.log(e);
				}
				// reload lại form
				// await this.FormData();
			}
		},
		async save() {
			let response;
			this.m_requestDto.status = { id: 1 };
			this.m_requestDto.statusName = this.$t("label.drafting");

			// if (
			// 	this.m_isSaved &&
			// 	this.m_isSaved.manageStamp &&
			// 	this.m_isSaved.manageStamp.id
			// ) {
			// 	this.m_requestDto.manageStampInfo = {
			// 		id: this.m_isSaved?.manageStamp.id,
			// 	};
			// } else {
			// 	await this.getAllManageStampByRequestData();
			// 	if (this.m_manageStampInfo) {
			// 		this.m_requestDto.manageStampInfo = {
			// 			id: this.m_manageStampInfo.id,
			// 		};
			// 	}
			// }
			this.m_requestDto.modifiedDate = new Date();
			try {
				response = await globalService.putData_Async(
					administratorAPI.API_UpdateRequestData(
						this.m_requestDto.id,
					),
					this.m_requestDto,
				);
				if (!response || !response.state) {
					this.toastError(this.$t("error.load"));
					return;
				}
				this.m_requestDto = response.data;

				//this.toastSuccess(this.$t("message.update_success"));
			} catch (e) {
				console.log(e);
			}
		},
		editAttachmentFile(item) {
			window.open(item.ofice365Path, "_blank");
		},
		getReqdataProcessHis() {
			this.componentLoading.history = true;
			globalService
				.getData_NoAsync(
					administratorAPI.API_GetReqdataProcessHisByID(
						this.m_requestDto.id,
					),
				)
				.then((response) => {
					this.componentLoading.history = false;

					if (
						!response ||
						response.status != 200 ||
						!response.data ||
						!response.data.state
					) {
						return;
					}
					this.requestdataProcessHis = response.data.data.sort(
						(e1, e2) => e1.id - e2.id,
					);
					this.reqdataProcessHisDTO();
				})
				.finally(() => {
					this.componentLoading.history = false;
				});
		},
		async editrequestDataList(item) {
			this.$router.push({
				path: `/phieu-yeu-cau/${item}/chi-tiet`,
			});
			this.FormData();
			this.initialize();
			this.getReqdataProcessHis();
		},

		/**
		 * Hàm thực hiện thêm item vào trong table
		 * table: bảng cần thêm dữ liệu
		 * item: dữ liệu cần xem
		 * */
		async addItemToTable(table, item, tableId) {
			if (!this.objectModel[tableId]) {
				this.objectModel[tableId] = this.m_objectModel[tableId];
				table = this.m_objectModel[tableId];
			}
			for (let key in item) {
				if (
					this.tableCalculator[tableId] &&
					this.tableCalculator[tableId][key]
				) {
					try {
						item[key] = ExprEval.Parser.evaluate(
							this.tableCalculator[tableId][key],
							item,
						);
					} catch (e) {
						console.error(e);
					}
				}
			}
			this.objectModel[tableId].push(this.cloneObject({}, item));
			item = this.cleanDataObject(item);
			this.refreshSchema();
		},
		updateItemToTable(table, item, indexEdit, tableName) {
			if (indexEdit < 0) return;
			if (!table) return;
			let itemUpdate = this.cloneObject({}, item);
			for (let key in itemUpdate) {
				if (!this.tableCalculator[tableName][key]) {
					continue;
				}
				try {
					itemUpdate[key] = ExprEval.Parser.evaluate(
						this.tableCalculator[tableName][key],
						itemUpdate,
					);
				} catch (e) {
					console.log(e);
				}
			}
			table.splice(indexEdit, 1, itemUpdate);
			item = this.cleanDataObject(item);
			this.flagEdit[tableName].editingItem = null;
			this.flagEdit[tableName].editingIndex = -1;
			this.refreshSchema();
		},

		/**
		 * Hàm thực hiện sửa item trong table
		 * table: bảng cần sửa dữ liệu
		 * item: item cần sửa
		 */
		editItemInTable(table, item, idx, tableName) {
			this.flagEdit[tableName].editingItem = item;
			this.flagEdit[tableName].editingIndex = idx;

			this.itemAddToTable[tableName] = Object.assign({}, item);
			this.refreshSchema();
		},
		updateItemInTable(table, item, idx, tableName) {
			this.flagEdit[tableName].editingItem = null;
			this.flagEdit[tableName].editingIndex = -1;
			this.refreshSchema();
		},
		/**
		 * Hàm thực hiện sửa xóa trong table
		 * table: bảng cần sửa dữ liệu
		 * item: item cần xóa
		 */
		deleteItemInTable(table, item, idx) {
			table.splice(idx, 1);
			this.refreshSchema();
		},

		/**
		 * Hàm dùng để clean dữ liệu cuả 1 object
		 */
		cleanDataObject(item) {
			if (!item) return item;
			for (let key in item) {
				if (typeof item[key] == "object") {
					if (Array.isArray(typeof item[key])) {
						item[key] = [];
					} else {
						item[key] = {};
					}
				}
				item[key] = "";
			}
			return item;
		},
		/**
		 * Hàm dùng để coppy dữ liệu của 1 array
		 */
		cloneArray(targetArayy, sourceArray) {
			if (!sourceArray) return sourceArray;
			targetArayy = sourceArray.map((ele) => this.cloneObject({}, ele));
			return targetArayy;
		},
		/**
		 * Hàm dùng dể coppy dữ liệu của 1 object
		 */
		cloneObject(targetObject, sourceObject) {
			if (!sourceObject) return null;
			targetObject = Object.assign({}, sourceObject);
			for (let prop in sourceObject) {
				if (typeof sourceObject[prop] == "object") {
					if (Array.isArray(sourceObject[prop])) {
						this.cloneArray([], sourceObject[prop]);
					} else {
						targetObject[prop] = this.cloneObject(
							targetObject[prop],
							sourceObject[prop],
						);
					}
				}
			}
			return targetObject;
		},
		mergeArray(sourceArray, mergeArray) {
			if (!sourceArray) return mergeArray;
			if (!mergeArray) return sourceArray;
			let result = [...sourceArray];
			mergeArray.forEach((ele) => {
				if (!sourceArray.some((ele1) => ele1.id == ele.id))
					result.push(ele);
			});
			return result;
		},
		editTitle() {
			this.isEdit = true;
		},

		confirmEdit() {
			this.m_requestDto.title = this.m_requestDto.title?.trim();
			if (!this.validRequiredText(this.m_requestDto.title)) {
				return this.toastError(this.$t("message.empty_title"));
			}
			this.isEdit = false;
		},
		reqdataProcessHisDTO() {
			this.procesHisTemps = [];
			let isDone = false;
			let startIndex = 0;
			for (let i = 0; i < this.requestdataProcessHis.length; i++) {
				let processHis = this.requestdataProcessHis[i];
				let procesHisTemp = Object.assign({}, processHis);
				if (
					procesHisTemp.status.includes(this.$t("status.approved")) &&
					!this.requestdataProcessHis[i + 1]?.status?.includes(
						this.$t("status.cancelApproval"),
					)
				) {
					isDone = true;
				}
				if (
					procesHisTemp.status.includes(this.$t("status.approved")) &&
					this.requestdataProcessHis[i + 1]?.status?.includes(
						this.$t("status.cancelApproval"),
					)
				) {
					isDone = false;
				}

				if (processHis.isChild) {
					if (
						procesHisTemp.status == this.$t("status.need_process")
					) {
						procesHisTemp.status = this.$t("status.processed");
					}
					this.procesHisTemps[
						this.procesHisTemps.length - 1
					]?.processHisChild.push(procesHisTemp);
				} else {
					procesHisTemp.processHisChild = [];
					this.procesHisTemps.push(procesHisTemp);
				}
			}
			this.stepDatas.sort((a, b) => {
				return a.stepOrder - b.stepOrder;
			});

			this.stepDatas.find((entry, index) => {
				if (entry.isActive) {
					startIndex = index + 1;
					let newObj = {
						isChild: false,
						userInfos: entry.userInfos,
						status: this.$t("status.processing"),
					};
					this.procesHisTemps.push(newObj);
				}
			});
			this.procesHisTemps.forEach((entry, index) => {
				if (
					index > 0 &&
					index < this.procesHisTemps.length - 1 &&
					entry.status == this.$t("status.need_process")
				) {
					entry.status = this.$t("status.approval");
				}
			});
			if (this.procesHisTemps.length > 1) {
				this.procesHisTemps.shift();
			}
			if (!isDone && startIndex < this.stepDatas.length) {
				for (let i = startIndex; i < this.stepDatas.length; i++) {
					let addObj = {
						isChild: false,
						userInfos: this.stepDatas[i]?.userInfos,
						status: this.stepDatas[i].stepDataName,
					};
					this.procesHisTemps.push(addObj);
				}
			}
			for (
				let proces = this.procesHisTemps.length - 1;
				proces > 0;
				proces--
			) {
				if (
					this.procesHisTemps[proces - 1] &&
					this.procesHisTemps[proces - 1].processHisChild
				) {
					this.procesHisTemps[proces].processHisChild = Object.assign(
						[],
						this.procesHisTemps[proces - 1].processHisChild,
					);
					this.procesHisTemps[proces - 1].processHisChild = [];
				}
			}

			return this.procesHisTemps;
		},
		async updateRequestData() {
			let response;

			this.m_requestDto.modifiedDate = new Date();

			// this.m_requestDto.modifiedDate = new Date();
			response = await globalService.putData_Async(
				administratorAPI.API_UpdateRequestData(this.m_requestDto.id),
				this.m_requestDto,
			);
			if (!response || !response.state) {
				this.toastError(this.$t("error.load"));
			} else {
				this.toastSuccess(this.$t("message.update_success"));
			}
		},
		async updateRequestRelateData() {
			let response;

			this.m_requestDto.modifiedDate = new Date();

			// this.m_requestDto.modifiedDate = new Date();
			response = await globalService.putData_Async(
				administratorAPI.API_UpdateRequestData(this.m_requestDto.id),
				this.m_requestDto,
			);
			if (!response || !response.state) {
				this.toastError(this.$t("error.load"));
			} else {
				this.toastSuccess(
					this.$t("message.successfully_added_share_vote"),
				);
			}
		},
		async deleteRequestRelateData(item) {
			item.reqDataConcerned = null;
			let response;
			item.modifiedDate = new Date();

			response = await globalService.putData_Async(
				administratorAPI.API_UpdateRequestData(item.id),
				item,
			);
			if (!response || !response.state) {
				this.toastError(this.$t("error.load"));
			}
			if (response) {
				let index = this.m_requestDto.requestDataList.indexOf(item);
				this.m_requestDto.requestDataList.splice(index, 1);
			}
		},
		viewRequestRelateData(item) {
			if (item.status.id == 1) {
				this.$router.push({
					path: `/phieu-yeu-cau/chi-tiet/${item.id}`,
				});
			}
			if (item.status.id != 1) {
				this.$router.push({
					path: `/phieu-yeu-cau/chi-tiet/${item.id}`,
				});
			}
		},
		async openViewSite() {
			await this.getStatusOfRequestData();
			if (!this.isStatusRequestData) {
				return (
					this.toastError(this.$t("error.no_request")),
					this.$router.push({
						path: `/phieu-yeu-cau/dang-soan`,
					})
				);
			}
			this.dialogSite = true;
		},
		getTableItem(id) {
			if (!this.m_objectModel[id]?.length) {
				this.m_objectModel[id] = [{}];
			}
			// return Object.assign([], this.m_objectModel[id]).filter(
			// 	(e) => !e.sumRow,
			// );
			return this.m_objectModel[id].filter((e) => !e.sumRow);
		},
		getFilenameExcel() {
			let str = "Bang_" + new Date().getTime();
			return str;
		},
		// import \\
		async handleFile(e) {
			try {
				let inputFile = e.target.files[0];
				this.file = e.target.files[0];
				let reader = new FileReader();

				reader.readAsText(inputFile);
				reader.onload = async (e) => {
					this.dataFileCSV = e.target.result;
				};
			} catch (e) {
				console.error(e);
			}
		},
		imPortTable(dataOfTable) {
			dataOfTable.push(...this.csvToArray(this.dataFileCSV));
		},

		onDrop(event) {
			event.preventDefault();
			this.isDragOver = false;
			if (event.dataTransfer) {
				this.files = Array.from(event.dataTransfer.files);
			}
		},
		onClick(event) {
			event.preventDefault();
			let files = document.getElementById(constant.keys.files);
			files.click();
		},
		remove_(file) {
			let index = this.files.indexOf(file);
			this.files.splice(index, 1);
		},
		csvToArray(str, delimiter = ",") {
			let result = [];
			let headers = str
				.slice(0, str.indexOf("\n"))
				.split(delimiter)
				.map((ele) => ele.trim());
			const lengthData = headers.length - 1; // biến dánh dấu số lượng field cần xuất hiện
			const allRow = str.split("\n");
			for (let rowIdx in allRow) {
				let objectModel = {};
				if (rowIdx >= 1) {
					// đọc từ dòng số 1 trở đi
					let count = (allRow[rowIdx].match(/,/g) || []).length; // đếm số lần dấu ',' xuất hiện trong dữ liệu
					if (count < lengthData) break;
					let dataOfRow = allRow[rowIdx]
						.split(",")
						.map((ele) => ele.trim());
					headers.forEach((ele, idx) => {
						// ele = this.nonAccentVietnamese(ele).split(" ").join("");
						ele = this.getIdFromValue(ele);
						if (isNaN(dataOfRow[idx]) || dataOfRow[idx] == "") {
							objectModel[ele] = `${dataOfRow[idx]}`;
						} else {
							objectModel[ele] = parseFloat(`${dataOfRow[idx]}`);
						}
					});
					result.push(objectModel);
				}
			}
			return result;
		},
		async getAllManageStampByRequestData() {
			let response;
			try {
				response = await globalService.getData_Async(
					administratorAPI.API_GetAllManageStampInfoByRequestData(
						this.m_requestDto.id,
					),
				);

				if (!response) {
					return [];
				}

				this.m_manageStampInfo = response.data[0];
			} catch (error) {
				this.toastError(error);
				return;
			}
		},
		logEvent(key, $event) {
			console.log("vjsf event", key, $event);
		},
		viewTemplateForm(item) {
			if (item.attachmentFileDTOS.length > 0) {
				this.idTemplateForm = item.attachmentFileDTOS[0]?.id;
				this.openViewTemplateForm = true;
			}
		},
		downloadFileTemplate(item) {
			let param = {
				PDF: false,
				addHistory: false,
				addQrCode: this.isQR,
				addWatermark: this.isWater,
				// itemId: this.itemAttachmentFile.itemId365,
				attachmentFileId: item.id,
				userId: this.user_info?.id,
			};
			let fileName = item.fileName.split(".")[0];
			let regex = /[^a-zA-Z]+/gi;
			fileName = encodeURIComponent(`${fileName}`.replaceAll(regex, "_"));
			let fileExtension = item.fileExtension;
			if (fileExtension == "pdf") param.PDF = false;
			if (param.PDF) fileExtension = "pdf";
			let urlDownload =
				store.state.config.apiUrl +
				administratorAPI.API_DownloadFile365(
					param,
					fileName,
					fileExtension,
				);

			// window.open(urlDownload, "_blank");

			let accessToken = store.state.accessToken;
			if (!accessToken) {
				accessToken =
					localStorage.getItem(constant.keys.accessToken) ||
					sessionStorage.getItem(constant.keys.accessToken);
			}
			let xhr = new XMLHttpRequest();
			xhr.open("GET", urlDownload);
			xhr.onreadystatechange = function () {
				if (xhr.readyState === xhr.DONE) {
					try {
						if (xhr.status === 200) {
							// this.response is a Blob, because we set responseType above
							let data_url = URL.createObjectURL(xhr.response);
							// window.open(data_url, "_blank");
							let downloadLink = document.createElement("a");
							downloadLink.href = data_url;
							downloadLink.download =
								fileName + "." + fileExtension;
							document.body.appendChild(downloadLink);
							downloadLink.click();
							document.body.removeChild(downloadLink);
						} else {
							this.toastError(this.$t("error.load"));
						}
					} catch (e) {
						this.toastError(this.$t("error.load"));
					}
				}
			};
			xhr.responseType = "blob";
			xhr.setRequestHeader("Authorization", "Bearer " + accessToken);
			xhr.send();
		},
		downloadAtackFileTemplate(item) {
			let param = {
				PDF: false,
				addHistory: false,
				addQrCode: this.isQR,
				addWatermark: this.isWater,
				// itemId: this.itemAttachmentFile.itemId365,
				attachmentFileId: item.id,
				userId: this.user_info?.id,
			};
			let fileName = item.fileName.split(".")[0];
			fileName = encodeURIComponent(
				`${fileName}`.replaceAll(/[^a-zA-Z]+/gi, "_"),
			);
			let fileExtension = item.fileExtension;
			if (fileExtension == "pdf") param.PDF = false;
			if (param.PDF) fileExtension = "pdf";
			let urlDownload =
				store.state.config.apiUrl +
				administratorAPI.API_DownloadFile365(
					param,
					fileName,
					fileExtension,
				);

			// window.open(urlDownload, "_blank");

			let accessToken = store.state.accessToken;
			if (!accessToken) {
				accessToken =
					localStorage.getItem(constant.keys.accessToken) ||
					sessionStorage.getItem(constant.keys.accessToken);
			}
			let xhr = new XMLHttpRequest();
			xhr.open("GET", urlDownload);
			xhr.onreadystatechange = function () {
				if (xhr.readyState === xhr.DONE) {
					try {
						if (xhr.status === 200) {
							// this.response is a Blob, because we set responseType above
							let data_url = URL.createObjectURL(xhr.response);
							// window.open(data_url, "_blank");
							let downloadLink = document.createElement("a");
							downloadLink.href = data_url;
							downloadLink.download =
								fileName + "." + fileExtension;
							document.body.appendChild(downloadLink);
							downloadLink.click();
							document.body.removeChild(downloadLink);
						} else {
							this.toastError(this.$t("error.load"));
						}
					} catch (e) {
						this.toastError(this.$t("error.load"));
					}
				}
			};
			xhr.responseType = "blob";
			xhr.setRequestHeader("Authorization", "Bearer " + accessToken);
			xhr.send();
		},
		// onSaveDownLoadFile(value){
		// 	if(value){
		// 		this.openAttachmentFilePDF = false;
		// 	}
		// }
		onGridReady(params, tableId) {
			this.gridApi[tableId] = params.api;
			this.gridColumnApi[tableId] = params.columnApi;
			let sumRow = this.m_objectModel[tableId].find((e) => e.sumRow);
			// this.addItemToTable(this.m_objectModel[tableId], {}, tableId);
			if (!sumRow) {
				return;
			}
			this.gridApi[tableId].setPinnedBottomRowData([sumRow]);
		},
		updateRowValue(row, data, key) {
			try {
				let json = JSON.parse(data);
				row[key] = json[key];
			} catch (e) {
				console.log(e);
			}
		},
		onCellEditingStopped(event) {
			if (!this.editingTableId) {
				return;
			}
			try {
				let pinnedRow = {};
				let headers = JSON.parse(
					this.objectSchema.properties[this.editingTableId].Headers,
				);
				let hasSumRow = false;
				let header_noi_dung_cong_viec = false;
				for (let header of headers) {
					if (header?.value == constant.id.table.noi_dung_cong_viec) {
						header_noi_dung_cong_viec = header;
					}
				}
				for (let header of headers) {
					if (!header?.sum) {
						pinnedRow[header.value] = "";
					} else {
						hasSumRow = true;
					}
					if (header?.sum) {
						pinnedRow[header.value] = 0;
					}
					for (let rowIndex in this.m_objectModel[
						this.editingTableId
					]) {
						let row =
							this.m_objectModel[this.editingTableId][rowIndex];
						if (header?.sum && !row.sumRow) {
							pinnedRow[header.value] += numeral(
								row[header.value],
							).value();
						}
						if (
							this.FEATURE.MATERIAL_VENDOR_CATEGORY &&
							header_noi_dung_cong_viec &&
							row[constant.id.table.noi_dung_cong_viec]
						) {
							if (
								header?.value == constant.id.table.ma_hieu ||
								header?.value ==
									constant.id.table.don_vi_tinh ||
								header?.value ==
									constant.id.table.don_gia_chuan ||
								header?.value ==
									constant.id.table.don_gia_chuan_vt_vl ||
								header?.value ==
									constant.id.table.don_gia_chuan_nhan_cong
							) {
								if (
									this.caches.categories[
										header_noi_dung_cong_viec.category.id +
											"_" +
											row[
												constant.id.table
													.noi_dung_cong_viec
											]
									]
								) {
									this.updateRowValue(
										this.m_objectModel[this.editingTableId][
											rowIndex
										],
										this.caches.categories[
											header_noi_dung_cong_viec.category
												.id +
												"_" +
												row[
													constant.id.table
														.noi_dung_cong_viec
												]
										]?.description,
										header?.value,
									);
								} else {
									globalService
										.getData_NoAsync(
											administratorAPI.API_GetAllChildByParentIdAndKeyWord(
												header_noi_dung_cong_viec
													.category.id,
												row[
													constant.id.table
														.noi_dung_cong_viec
												],
												0,
												1,
											),
										)
										.then((response) => {
											if (
												response.status != 200 ||
												!response?.data?.data
											) {
												return;
											}
											this.caches.categories[
												header_noi_dung_cong_viec
													.category.id +
													"_" +
													row[
														constant.id.table
															.noi_dung_cong_viec
													]
											] = response?.data?.data[0];
											this.updateRowValue(
												this.m_objectModel[
													this.editingTableId
												][rowIndex],
												this.caches.categories[
													header_noi_dung_cong_viec
														.category.id +
														"_" +
														row[
															constant.id.table
																.noi_dung_cong_viec
														]
												]?.description,
												header?.value,
											);
										});
								}
							}
						}
					}
					if (header?.sum) {
						pinnedRow[header.value] =
							this.$t("label.total") +
							`: ` +
							numeral(pinnedRow[header.value]).format();
					}
				}
				if (this.FEATURE.SUM_TOTAL_IN_TABLE && hasSumRow) {
					this.gridApi[this.editingTableId].setPinnedBottomRowData([
						pinnedRow,
					]);
				}
			} catch (e) {
				console.log(e);
			}
			if (!event || !event.node.lastChild) {
				return;
			}
			this.addItemToTable(
				this.m_objectModel[this.editingTableId],
				{},
				this.editingTableId,
			);
		},
		onCellEditingStarted(tableId) {
			this.editingTableId = tableId;
		},
		downloadTable(tableId) {
			// this.gridApi[tableId].exportDataAsCsv();
			let settings = {
				fileName: tableId, // Name of the resulting spreadsheet
			};
			let data = {
				sheet: tableId,
			};
			try {
				let headers = JSON.parse(
					this.objectSchema.properties[tableId].Headers,
				);
				let columnName = {};
				for (let tmp of headers) {
					tmp.label = tmp.value;
					columnName[tmp.value] = tmp.text;
				}
				data.columns = headers;
				//this.m_objectModel[tableId].unshift(columnName);
				data.content = Object.assign([], this.m_objectModel[tableId]);
				data.content.unshift(columnName);
				xlsx([data], settings);
			} catch (e) {
				console.log(e);
			}
		},
		async handleImportFile(event, tableId) {
			if (!event?.target?.files[0] || !tableId) {
				return;
			}
			try {
				let result = await this.excelFileToJSON(
					event.target.files[0],
					tableId,
				);
				this.m_objectModel[tableId] = result;
				this.editingTableId = tableId;
				this.onCellEditingStopped(null);
				// this.addItemToTable(this.m_objectModel[tableId], {}, tableId);
				event.target.value = null;
				this.refreshSchema();
			} catch (e) {
				console.log(e);
			}
		},
		excelFileToJSON(file, tableId) {
			let headers = JSON.parse(
				this.objectSchema.properties[tableId].Headers,
			);
			let reader = new FileReader();
			let calculator = this.tableCalculator;
			let parser = new ExprEval.Parser();
			return new Promise((resolve, reject) => {
				reader.onerror = function () {
					reader.abort();
					reject();
				};
				reader.onload = function (e) {
					let data = e.target.result;
					let workbook = XLSX.read(data, {
						type: "binary",
					});
					let result = {};
					workbook.SheetNames.forEach(function (sheetName) {
						let roa = XLSX.utils.sheet_to_row_object_array(
							workbook.Sheets[sheetName],
						);
						if (roa.length > 0) {
							result[sheetName] = roa;
						}
					});
					if (!result[tableId]) {
						return;
					}
					let content = [];
					let index = 1;
					for (let i in result[tableId]) {
						if (i <= 0) {
							continue;
						}
						let e = result[tableId][i];
						let tmp = {};
						let arrCalculateField = [];
						for (let header of headers) {
							if (header.type == constant.type.string) {
								tmp[header.value] = `${e[header.value]}`;
							}
							if (header.type == constant.type.number) {
								tmp[header.value] = numeral(
									e[header.value],
								).value();
							}
							if (header.type == constant.type.date) {
								if (isNaN(e[header.value])) {
									tmp[header.value] = moment(
										e[header.value],
									).format();
								} else {
									tmp[header.value] = moment(
										(e[header.value] - (25567 + 1)) *
											86400 *
											1000,
									).format();
								}
							}
							if (header.auto) {
								tmp[header.value] = index;
								index++;
							}
							if (calculator[tableId][header.value]) {
								arrCalculateField.push(header.value);
							}
						}
						if (arrCalculateField.length > 0) {
							for (let key of arrCalculateField) {
								try {
									tmp[key] = parser.evaluate(
										calculator[tableId][key],
										tmp,
									);
								} catch (e) {
									console.log(e);
								}
							}
						}
						content.push(tmp);
					}
					resolve(content);
				};
				reader.readAsBinaryString(file);
			});
		},
		deleteTable(tableId) {
			if (!tableId) {
				return;
			}
			for (let row of this.gridApi[tableId].getSelectedRows()) {
				let index = this.m_objectModel[tableId].indexOf(row);
				if (index < 0) {
					continue;
				}
				this.m_objectModel[tableId].splice(index, 1);
			}
			this.onCellEditingStopped(null);
			// this.addItemToTable(this.m_objectModel[tableId], {}, tableId);
			this.refreshSchema();
		},
		async onSaveSite(value) {
			if (!value) return;
			this.m_requestDto.dataRoomPath = null;
			this.m_requestDto.dataRoomId = value.id;
			this.m_requestDto.dataRoomPath = value.webUrl;
			if (value.parentReference) {
				this.m_requestDto.dataRoomDriveId =
					value.parentReference?.driveId;
			}
			if (store.state.config.features.loadByList) {
				if (value.drive) {
					this.m_requestDto.dataRoomId = value.drive.id;
					this.m_requestDto.dataRoomPath = value.drive.webUrl;
					if (value.drive.parentReference) {
						this.m_requestDto.dataRoomDriveId =
							value.drive.parentReference?.driveId;
					}
				}
				if (value.driveItem) {
					this.m_requestDto.dataRoomId = value.driveItem.id;
					this.m_requestDto.dataRoomPath = value.driveItem.webUrl;
					if (value.driveItem.parentReference) {
						this.m_requestDto.dataRoomDriveId =
							value.driveItem.parentReference?.driveId;
					}
				}
			}

			await this.getStatusOfRequestData();
			if (!this.isStatusRequestData) {
				this.toastError(this.$t("error.no_request"));
				return;
			}
			this.save();
		},
		async clickToOpen(value) {
			await this.getStatusOfRequestData();
			if (!this.isStatusRequestData) {
				return (
					this.toastError(this.$t("error.no_request")),
					this.$router.push({
						path: `/phieu-yeu-cau/dang-soan`,
					})
				);
			}
			window.open(value, "_blank");
		},
		async getStatusOfRequestData() {
			try {
				this.isStatusRequestData = false;
				let response;
				response = await globalService.getData_Async(
					administratorAPI.API_GetRequestByStatus(
						this.m_requestDto.id,
					),
				);
				if (!response || !response.state) {
					return [];
				}

				this.statusRequestData = response.data.status.statusCode;
				if (
					this.statusRequestData == this.STATUS_DANGSOAN_CODE ||
					this.statusRequestData == this.STATUS_TRALAI_CODE
				) {
					this.isStatusRequestData = true;
				}
			} catch (error) {
				this.toastError(error);
			}
		},
		refreshSchema() {
			this.objectSchema = Object.assign({}, this.objectSchema);
		},

		async getTotalPage() {
			this.formLoading = true;
			let pageSize = 20;
			let m_requestDto = this.m_requestDto;
			this.fieldData = [];
			let fieldData = this.fieldData;
			globalService
				.getData_NoAsync(
					administratorAPI.API_GetAllFieldDataByRequestDataId(
						m_requestDto.id,
						0,
						pageSize,
					),
				)

				.then((res) => {
					if (!res || !res.data.state) {
						return;
					}
					let totalPage = Math.ceil(res.data.data.total / pageSize);
					fieldData.push(...res.data.data.data);
					for (let i = 1; i <= totalPage; i++) {
						globalService
							.getData_NoAsync(
								administratorAPI.API_GetAllFieldDataByRequestDataId(
									m_requestDto.id,
									i,
									pageSize,
								),
							)
							.then((pageResponse) => {
								if (!pageResponse || !pageResponse.data.state) {
									return;
								}
								fieldData.push(...pageResponse.data.data.data);

								this.handleFieldData();
							});
					}
				})
				.finally(() => {
					this.formLoading = false;
				});
		},
		handleFieldData() {
			if (this.fieldData) {
				this.fieldData.sort((e2, e1) => e2.order - e1.order);
				this.formLoading = false;
				let objectSchema = { type: "object", properties: {} };

				for (let field of this.fieldData) {
					if (
						field.objectModel &&
						(field.tennantCode == "truong_bang" ||
							field.tennantCode == "truong_file")
					) {
						try {
							let model = JSON.parse(field.objectModel);
							this.objectModel[`${field.fieldDataCode}`] = model;
						} catch (e) {
							console.log(e);
						}
					}
					if (
						field.objectModel &&
						field.tennantCode != "truong_bang" &&
						field.tennantCode != "truong_file" &&
						field.tennantCode != "number"
					) {
						this.objectModel[`${field.fieldDataCode}`] =
							field.objectModel;
					}
					if (field.objectModel && field.tennantCode == "number") {
						this.objectModel[`${field.fieldDataCode}`] = numeral(
							field.objectModel,
						).value();
					}
					if (field.objectModel && field.tennantCode == "double") {
						let model = JSON.parse(field.objectModel);
						this.objectModel[`${field.fieldDataCode}`] = model;
					}
					if (field.objectModel && field.tennantCode == "boolean") {
						let model = JSON.parse(field.objectModel);
						this.objectModel[`${field.fieldDataCode}`] = model;
					}

					// code mới \\
					let fieldObject = JSON.parse(field.objectSchema);
					let fieldId = `${fieldObject.title.id}`.trim();
					if (objectSchema.properties[fieldId]) {
						fieldId = this.getIdFromValue(
							`${fieldObject.title.title}`.trim(),
						);
					}
					let objectShemaOfField = {
						...fieldObject.title,
						"x-cols": fieldObject["x-cols"],
						"x-class": "px-2",
					};
					if (objectShemaOfField.readOnly)
						objectShemaOfField.readOnly = false;
					// if (objectShemaOfField.numberWord.length > 0)
					// 	objectShemaOfField.readOnly = true;
					objectSchema.properties[fieldId] = objectShemaOfField;
					this.objectSchema = objectSchema;
				}
				this.deepFormatObject(
					this.objectModel,
					this.objectSchema.properties,
					constant.format.date,
					constant.format.vi_date,
					constant.type.number,
				);

				this.m_objectModel = this.objectModel;
				// lấy ra nhưng field là bảng có trong objectSchema đẩy vào biến tableSchema
				this.tableSchema = [];
				let itemAddToTableTemp = {};
				let flagEditTemp = {};
				let parser = new ExprEval.Parser();
				let requires = [];
				this.columnDefs = [];
				for (let index in this.objectSchema.properties) {
					if (index == "bang_hang_hoa_xay_dung") {
						this.isHHXD = true;
						this.getAllMaHieuService();
					}
					if (index == "bang_hang_hoa_me") {
						this.isHHME = true;
						this.getAllMaHieuMe();
					}
					this.objectSchema.properties[index]["x-props"] = {};
					if (
						typeof this.objectSchema.properties[index] ==
							"object" &&
						this.objectSchema.properties[index]?.Headers
					) {
						let table = Object.assign(
							{},
							this.objectSchema.properties[index],
						);
						try {
							table.Headers = JSON.parse(table.Headers);
						} catch (e) {
							table.Headers = [];
						}

						if (!this.objectModel[table.id]) {
							this.objectModel[table.id] = [];
						}
						itemAddToTableTemp[table.id] = {};

						flagEditTemp[table.id] = { editingItem: null };

						let dataGridColDefs = [];
						table.Headers.forEach((ele) => {
							if (ele.value2) {
								if (!this.tableCalculator[table.id]) {
									this.tableCalculator[table.id] = {};
								}
								this.tableCalculator[table.id][ele.value] =
									ele.value2;
							}
							itemAddToTableTemp[table.id][ele.value] = "";

							let colDef = {
								field: ele.value,
								headerName: ele.text,
								minWidth: !ele?.width ? 0 : ele.width,
								width: !ele?.width ? 0 : ele.width,
								cellEditorParams: {
									cellHeight: 20,
									useFormatter: true,
								},
								valueGetter: (params) => {
									return params.data[params.column.colId];
								},
								valueSetter: (params) => {
									params.data[params.column.colId] =
										params.newValue;
									if (params.node.rowPinned) {
										return true;
									}
									if (ele?.type == constant.type.number) {
										params.data[params.column.colId] =
											numeral(params.newValue).value();
									}
									for (let header of table.Headers) {
										if (header?.auto) {
											params.data[header.value] =
												params.node.rowIndex + 1;
										}
									}
									for (let key in this.tableCalculator[
										table.id
									]) {
										try {
											params.data[key] =
												ExprEval.Parser.evaluate(
													this.tableCalculator[
														table.id
													][key],
													params.data,
												);
										} catch (e) {
											console.log(e);
										}
									}
									return true;
								},
							};

							if (ele.value2) {
								colDef.editable = false;
								colDef.valueFormatter = (params) => {
									if (params.node.rowPinned) {
										return params?.value;
									}
									if (!params?.value) {
										return "";
									}
									return numeral(`${params.value}`)
										.format
										//
										();
									// return `${params.value}`.replace(
									// 	/(\d)(?=(\d{3})+(?!\d))/g,
									// 	"$1,",
									// );
								};
							}
							if (ele?.type == constant.type.number) {
								colDef.valueFormatter = (params) => {
									if (!params?.value) {
										return "";
									} else if (
										!params.node.rowPinned &&
										!params.data.sumRow
									) {
										return numeral(
											`${params.value}`,
										).format();
									} else {
										return Object.assign(
											{},
											this.m_objectModel[table.id].find(
												(e) => e.sumRow,
											),
										)[params.column.colId];
									}
								};
							}
							if (ele?.type == constant.type.date) {
								colDef.cellEditor = DateEditor;
								colDef.cellEditorPopup = true;
								colDef.valueFormatter = (params) => {
									if (params.node.rowPinned) {
										return params?.value;
									}
									if (!params?.value) {
										return "";
									}
									let check = moment(
										params?.value,
										constant.format.vi_date,
									);
									if (!check.isValid()) {
										return moment(params?.value).format(
											this.$t("format.date"),
										);
									}
									return check.format(this.$t("format.date"));
								};
							}
							if (ele?.type == constant.type.file) {
								colDef.cellEditor = "fileEditor";
								colDef.cellRenderer = "fileRenderer";
								colDef.valueGetter = function (params) {
									return params.data[params.column.colId];
								};
							}
							if (
								this.FEATURE.MATERIAL_VENDOR_CATEGORY &&
								ele?.type == constant.type.material
							) {
								colDef.cellEditorSelector = (params) => {
									params["category"] = ele?.category.id;
									return {
										component: "ComboboxCellEditorsVue",
										popup: true,
										popupPosition: "under",
									};
								};
							}
							if (this.FEATURE.MATERIAL_VENDOR_CATEGORY) {
								if (
									ele?.value == constant.id.table.ma_hieu ||
									ele?.value ==
										constant.id.table.don_vi_tinh ||
									ele?.value ==
										constant.id.table.don_gia_chuan ||
									ele?.value ==
										constant.id.table.quy_cach_ky_thuat ||
									ele?.value ==
										constant.id.table.don_gia_chuan_vt_vl ||
									ele?.value ==
										constant.id.table.noi_dung_cong_viec ||
									ele?.value ==
										constant.id.table
											.don_gia_chuan_nhan_cong
								) {
									colDef.editable = false;
								}
							}

							// if (
							// 	ele?.type == constant.type.date
							// ) {
							// 	colDef.cellEditorSelector = (params) => {
							// 		console.log(params);
							// 		return {
							// 			component: "DateCellEdittorVue",
							// 			popup: true,
							// 			popupPosition: "under",
							// 		};
							// 	};
							// }
							dataGridColDefs.push(colDef);
						});

						this.tableSchema.push(table);
						this.columnDefs.push(dataGridColDefs);
						this.objectSchema.properties[index] = {
							Headers:
								this.objectSchema.properties[index]?.Headers,
							title: table.title,
						};
					}
					if (this.objectSchema.properties[index]?.value) {
						try {
							let expr = parser.parse(
								this.objectSchema.properties[index]?.value,
							);
							if (expr) {
								this.calculator[
									this.objectSchema.properties[index]?.id
								] = this.objectSchema.properties[index]?.value;

								// this.objectSchema.properties[
								// 	index
								// ].readOnly = true;
								this.objectModel[
									this.objectSchema.properties[index]?.id
								] = "";
							}
						} catch (e) {
							console.error(e);
						}
					}

					if (this.objectSchema.properties[index]?.numberWord) {
						this.objectSchema.properties[index].readOnly = true;
					}
					if (this.objectSchema.properties[index]?.relation_name) {
						this.objectSchema.properties[index].readOnly = true;
					}
					if (this.objectSchema.properties[index]?.category) {
						this.objectSchema.properties[index]["default"] = "";
						// this.objectSchema.properties[index]["x-fromUrl"] =
						// 	`${store.state.config.apiUrl}` +
						// 	administratorAPI.API_GetAllChildByParentIdAndKeyWord(
						// 		this.objectSchema.properties[index]?.category,
						// 		"",
						// 	);
						this.objectSchema.properties[index]["x-itemsProp"] =
							"data";
						this.objectSchema.properties[index]["x-itemTitle"] =
							"name";
						this.objectSchema.properties[index]["x-itemKey"] =
							"name";
						this.objectSchema.properties[index]["x-props"][
							"prepend-inner-icon"
						] = "mdi-magnify";
					}
					if (this.objectSchema.properties[index]?.is_required) {
						requires.push(this.objectSchema.properties[index]?.id);
						this.objectSchema.properties[index].title = `${
							this.objectSchema.properties[index].title
						} ${this.$t("label.star")}`;
					}
					if (
						this.objectSchema.properties[index]?.contentMediaType ==
						"image/*"
					) {
						this.objectSchema.properties[index]["x-slots"] = {
							// after:
							// 	"<img class='my-4' src='data:image/png;base64, " +
							// 	this.objectModel[index]?.data +
							// 	"'>",
							after: this.objectModel[index]?.name,
						};

						// (this.options.rules["fileName" + index] = (value) => {
						// 	console.log("value", value);
						// 	return (
						// 		!value ||
						// 		!this.arr.includes(
						// 			value.name.split(".").pop(),
						// 		) ||
						// 		"File name demo"
						// 	);
						// }),
						// 	(this.objectSchema.properties[index]["x-rules"] = [
						// 		"fileName" + index,
						// 	]);
					}
					if (
						this.objectSchema.properties[index]?.contentMediaType ==
						"image/*"
					) {
						(this.options.rules["fileSize" + index] = (value) => {
							// return (
							// 	!value ||
							// 	value.size <
							// 		this.objectSchema.properties[index]
							// 			.upload_size ||
							// 	this.$t("validator.max_size_file") +
							// 		this.objectSchema.properties[index]
							// 			.upload_size +
							// 		" Byte"
							// );
							if (
								!(
									!value ||
									value.size <
										this.objectSchema.properties[index]
											.upload_size
								) &&
								this.objectSchema.properties[index].upload_size
							) {
								return (
									!value ||
									value.size <
										this.objectSchema.properties[index]
											.upload_size ||
									this.$t("validator.max_size_file") +
										this.objectSchema.properties[index]
											.upload_size +
										" Byte"
								);
							} else {
								return (
									!value ||
									this.arr.includes(
										value.name.split(".").pop(),
									) ||
									this.$t("validator.must_image_file") + ""
								);
							}
						}),
							(this.objectSchema.properties[index]["x-rules"] = [
								"fileSize" + index,
							]);
					}
					this.objectSchema.properties[index]["x-options"] =
						this.xOptions;
				}
				this.objectSchema.required = requires;

				this.itemAddToTable = itemAddToTableTemp;
				this.flagEdit = flagEditTemp;
			}
		},

		async saveFieldData(value) {
			await this.getStatusOfRequestData();
			if (!this.isStatusRequestData) {
				this.toastError(this.$t("error.no_request"));
				this.$router.push({
					path: `/phieu-yeu-cau/dang-soan`,
				});
				return;
			}
			if (this.$refs?.form) {
				let validated = true;
				try {
					validated = this.$refs.form.validate();
				} catch (e) {
					console.log(e);
				}
				if (!validated) {
					this.toastError(this.$t("message.required_form"));
					return;
				}
			}
			this.processFieldData();
			try {
				let response;

				response = await globalService.postData_Async(
					administratorAPI.API_UpdateAllFieldDataByRequestDataId_SaveAll(
						this.m_requestDto.id,
						value,
					),
					this.fieldData,
				);

				if (!response) {
					return [];
				}
				this.getLoadAttachmentFileRequestV2();
				this.toastSuccess(this.$t("message.update_success"));
				this.handleFieldData();
				// await this.saveFormData();
			} catch (error) {
				this.toastError(error);
				return;
			}
		},
		async saveFieldDataV2(value) {
			if (!this.isStatusRequestData) {
				this.toastError(this.$t("error.no_request"));
				this.$router.push({
					path: `/phieu-yeu-cau/dang-soan`,
				});
				return;
			}
			if (this.$refs?.form) {
				let validated = true;
				try {
					validated = this.$refs.form.validate();
				} catch (e) {
					console.log(e);
				}
				if (!validated) {
					this.toastError(this.$t("message.required_form"));
					return;
				}
			}

			await this.saveFieldDataNoFill();
			this.processFieldData();
			this.getLoadAttachmentFileRequestV2();
			this.listTemplateForm;
			for (let item of this.listTemplateForm) {
				globalService
					.postData_NoAsync(
						administratorAPI.API_UpdateAllFieldDataByRequestDataId_SaveAll_V2(
							this.m_requestDto.id,
							item.id,
							value,
						),
					)
					.then((response) => {
						if (
							!response ||
							response.status != 200 ||
							!response.data ||
							!response.data.state
						) {
							return;
						}
					});
			}

			this.handleFieldData();

			this.toastSuccess(this.$t("message.update_success"));
		},
		async saveFieldDataV2NoToast(value) {
			if (!this.isStatusRequestData) {
				this.toastError(this.$t("error.no_request"));
				this.$router.push({
					path: `/phieu-yeu-cau/dang-soan`,
				});
				return;
			}
			if (this.$refs?.form) {
				let validated = true;
				try {
					validated = this.$refs.form.validate();
				} catch (e) {
					console.log(e);
				}
				if (!validated) {
					this.toastError(this.$t("message.required_form"));
					return;
				}
			}

			await this.saveFieldDataNoFill();
			this.processFieldData();
			this.getLoadAttachmentFileRequestV2();
			this.listTemplateForm;
			for (let item of this.listTemplateForm) {
				globalService
					.postData_NoAsync(
						administratorAPI.API_UpdateAllFieldDataByRequestDataId_SaveAll_V2(
							this.m_requestDto.id,
							item.id,
							value,
						),
					)
					.then((response) => {
						if (
							!response ||
							response.status != 200 ||
							!response.data ||
							!response.data.state
						) {
							return;
						}
					});
			}

			this.handleFieldData();

			this.toastSuccess(this.$t("message.update_success"));
		},
		processFieldData() {
			this.m_objectModel = Object.assign(
				{},
				{ ...this.m_objectModel, ...this.objectModel },
			);

			this.deepFormatObject(
				this.m_objectModel,
				this.objectSchema.properties,
				this.$t("format.date"),
			);

			for (let i in this.fieldData) {
				try {
					let objectSchema = JSON.parse(
						this.fieldData[i]?.objectSchema,
					);
					if (
						!objectSchema.title.Headers &&
						typeof this.m_objectModel[objectSchema?.title?.id] !=
							"object"
					) {
						this.fieldData[i].objectModel =
							this.m_objectModel[objectSchema?.title?.id];
					} else if (
						(!objectSchema.title.Headers &&
							typeof this.m_objectModel[
								objectSchema?.title?.id
							] == "object") ||
						this.fieldData[i].tennantCode == "boolean"
					) {
						this.fieldData[i].objectModel = JSON.stringify(
							this.m_objectModel[objectSchema?.title?.id],
						);
					} else {
						let headers = JSON.parse(objectSchema.title.Headers);
						let sumRow = {};
						// sumRow = this.m_objectModel[
						// 	objectSchema?.title?.id
						// ].find((e) => e.sumRow);
						// if (!sumRow) {
						// 	sumRow = {};
						// }
						let hasSumRow = false;
						for (let header of headers) {
							sumRow[header.value] = "";
							let stt = 1;
							let sum = 0;
							for (let row of this.m_objectModel[
								objectSchema?.title?.id
							]) {
								if (this.isEmpty(row)) {
									continue;
								}
								if (header?.sum) {
									hasSumRow = true;
									if (!row[header.value]) {
										continue;
									}
									sum += numeral(row[header.value]).value();
								}
								if (header?.auto && !row?.sum) {
									row[header.value] = stt;
									stt++;
								}
							}
							if (header?.sum) {
								sumRow[header.value] =
									this.$t("label.total") +
									":" +
									numeral(sum).format();
							}
						}
						if (!this.isEmpty(sumRow)) {
							sumRow.sumRow = true;
							// let index = this.m_objectModel[
							// 	objectSchema?.title?.id
							// ].findIndex((e) => e.sumRow);
							// if (index >= 0) {
							// 	this.m_objectModel[
							// 		objectSchema?.title?.id
							// 	].splice(index, 1);
							// }
							this.m_objectModel[objectSchema?.title?.id] =
								this.m_objectModel[
									objectSchema?.title?.id
								].filter((e) => !e.sumRow);
							if (this.FEATURE.SUM_TOTAL_IN_TABLE && hasSumRow) {
								this.m_objectModel[
									objectSchema?.title?.id
								].push(sumRow);
							}
						}
						this.fieldData[i].objectModel = JSON.stringify(
							this.m_objectModel[objectSchema?.title?.id],
						);
					}
				} catch (e) {
					console.log(e);
				}
			}
		},
		async saveFieldDataNoFill() {
			await this.getStatusOfRequestData();
			if (!this.isStatusRequestData) {
				return (
					this.toastError(this.$t("error.no_request")),
					this.$router.push({
						path: `/phieu-yeu-cau/dang-soan`,
					})
				);
			}
			if (this.$refs?.form) {
				if (!this.$refs.form.validate()) {
					this.toastError(this.$t("message.required_form"));
					return;
				}
			}
			this.processFieldData();
			try {
				let response;

				response = await globalService.postData_Async(
					administratorAPI.API_UpdateAllFieldDataByRequestDataId_SaveAll_NoFill(
						this.m_requestDto.id,
					),
					this.fieldData,
				);
				if (!response) {
					return [];
				}
				this.handleFieldData();
				//this.toastSuccess(this.$t("message.update_success"));
				// await this.saveFormData();
			} catch (error) {
				this.toastError(error);
				return;
			}
		},
		async getHisTrade() {
			await this.getStatusOfRequestData();
			if (!this.isStatusRequestData) {
				return (
					this.toastError(this.$t("error.no_request")),
					this.$router.push({
						path: `/phieu-yeu-cau/dang-soan`,
					})
				);
			}
			let response;
			this.hisTrade = [];
			this.hisTradeCustomer = [];
			try {
				response = await globalService.getData_Async(
					administratorAPI.API_GetHisTradeRequestData(
						this.m_requestDto.id,
					),
				);
				if (!response || !response.state) {
					return this.toastError(this.$t("error.history_chat_error"));
				}
				response.data.filter((entry) => {
					if (
						entry.informationType &&
						entry.informationType.includes(constant.type.customer)
					) {
						this.hisTradeCustomer.push(entry);
					} else {
						this.hisTrade.push(entry);
					}
				});
				this.hisTradeCustomer = this.sortHisTrade(
					this.hisTradeCustomer,
				);
				this.hisTrade = this.sortHisTrade(this.hisTrade);
				this.update_at = new Date();
			} catch (error) {
				console.log(error);
			}
		},
		async sendInformationInExchange() {
			await this.getStatusOfRequestData();
			if (!this.isStatusRequestData) {
				return (
					this.toastError(this.$t("error.no_request")),
					this.$router.push({
						path: `/phieu-yeu-cau/dang-soan`,
					})
				);
			}
			let result = [];

			this.userTrade.content = this.content;
			this.userTrade.sendDate = new Date();
			this.userTrade.requestData = this.m_requestDto;

			let response;
			try {
				if (this.tabChat == 1) {
					this.userTrade.informationType = constant.type.customer;
				} else {
					this.userTrade.informationType = null;
				}
				if (this.user_info.organizations.length > 0) {
					this.user_info.organizations.filter((entry) => {
						return result.push(entry.organizationName);
					});
				}
				if (result.length > 0) {
					this.userTrade.organizationName = result[0];
				}
				this.userTrade.sender = this.user_info;
				this.userTrade.sendName = this.user_info.fullName;
				response = await globalService.postData_Async(
					administratorAPI.API_Chat(),
					this.userTrade,
				);
				if (!response || !response.state) {
					return;
				}
			} catch (error) {
				console.log(error);
			}
			await this.getHisTrade();
			this.userTrade = Object.assign({}, InformationInExchangeDto);
			this.content = "";
		},
		sortHisTrade(arr) {
			return arr.sort((a, b) => {
				return (
					moment(a.sendDate).toDate().getTime() -
					moment(b.sendDate).toDate().getTime()
				);
			});
		},
		handleFormInput(value) {
			for (let index in this.objectSchema.properties) {
				try {
					let key = this.objectSchema.properties[index]?.id;
					if (this.calculator[key]) {
						value[key] = ExprEval.Parser.evaluate(
							this.calculator[key],
							value,
						);
					}
				} catch (e) {
					console.log(e);
				}
				// if (
				// 	this.objectSchema.properties[index]?.contentMediaType ==
				// 	"image/*"
				// ) {
				// 	this.rules = [
				// 			(value) =>
				// 				!value ||
				// 				value.truong_tai_len_file.size <
				// 					this.objectSchema.properties[index]
				// 						.upload_size ||
				// 				"File size should be less than 2 MB!",
				// 		];

				// }
				if (
					this.objectSchema.properties[index]?.type ==
						constant.type.string &&
					this.objectSchema.properties[index]?.numberWord &&
					value[this.objectSchema.properties[index]?.numberWord]
				) {
					try {
						// value[index] = VNnum2words(
						// 	value[
						// 		this.objectSchema.properties[index]?.numberWord
						// 	],
						// );
						value[index] = this.capitalize(
							docsoModule.docso(
								value[
									this.objectSchema.properties[index]
										?.numberWord
								],
							),
						);
					} catch (e) {
						console.log(e);
					}
				}
				if (
					this.objectSchema.properties[index]?.category &&
					// `${value[index]}`.length >= constant.minimumSearchLength &&
					this.objectSchema.properties[index]["x-fromUrl"] !=
						`${store.state.config.apiUrl}` +
							administratorAPI.API_GetAllChildByParentIdAndKeyWord(
								this.objectSchema.properties[index]?.category,
								value[index],
							)
				) {
					this.objectSchema.properties[index]["default"] = "";
					this.objectSchema.properties[index]["x-fromUrl"] =
						`${store.state.config.apiUrl}` +
						administratorAPI.API_GetAllChildByParentIdAndKeyWord(
							this.objectSchema.properties[index]?.category,
							value[index],
						);
					this.objectSchema.properties[index]["x-itemsProp"] = "data";
					this.objectSchema.properties[index]["x-itemTitle"] = "name";
					this.objectSchema.properties[index]["x-itemKey"] = "name";
					this.objectSchema.properties[index]["x-props"][
						"prepend-inner-icon"
					] = "mdi-magnify";
				}
				let filterName = this.objectSchema.properties[index]?.filter;
				if (
					filterName /*&& `${value[filterName]}`.length >= constant.minimumSearchLength*/
				) {
					if (!value[filterName]) {
						continue;
					}
					if (
						!this.objectSchema.properties[
							this.objectSchema.properties[index]?.filter
						]?.category
					) {
						continue;
					}
					let categoryApi =
						administratorAPI.API_GetAllChildByParentIdAndKeyWord(
							this.objectSchema.properties[
								this.objectSchema.properties[index]?.filter
							]?.category,
							value[filterName],
						);
					if (
						!this.categories[categoryApi] &&
						!(this.onCallingApi.indexOf(categoryApi) >= 0)
					) {
						this.onCallingApi.push(categoryApi);
						try {
							globalService
								.getData_NoAsync(categoryApi)
								.then((result) => {
									this.onCallingApi =
										this.onCallingApi.splice(
											this.onCallingApi.indexOf(
												categoryApi,
											),
											1,
										);
									if (!result) {
										return;
									}
									if (result.status != 200) {
										return;
									}
									if (!result.data) {
										return;
									}
									if (!result.data.state) {
										return;
									}
									this.categories[categoryApi] =
										result.data.data;
									this.handleFormInput(value);
									// let target = this.categories[
									// 	categoryApi
									// ].find((e) => e.name == value[filterName]);
									// if (!target) {
									// 	return;
									// }
									// let description = JSON.parse(
									// 	target.description,
									// );
									// // if (!value[index]) {
									// if (!this.FEATURE.REMOVE_UNSAFE_VALUE) {
									// 	value[index] =
									// 		description[
									// 			this.objectSchema.properties[
									// 				index
									// 			]?.relation_name
									// 		];
									// } else {
									// 	value[index] = this.safetify(
									// 		description[
									// 			this.objectSchema.properties[
									// 				index
									// 			]?.relation_name
									// 		],
									// 	);
									// }
									// }
								});
						} catch (e) {
							console.error(e);
							this.onCallingApi = this.onCallingApi.splice(
								this.onCallingApi.indexOf(categoryApi),
								1,
							);
						}
					} else {
						try {
							if (!this.categories[categoryApi]) {
								continue;
							}
							let target = this.categories[categoryApi].find(
								(e) => e.name == value[filterName],
							);
							if (!target) {
								continue;
							}
							let description = JSON.parse(target.description);
							// if (!value[index]) {
							if (!this.FEATURE.REMOVE_UNSAFE_VALUE) {
								value[index] =
									description[
										this.objectSchema.properties[
											index
										]?.relation_name
									];
							} else {
								value[index] = this.safetify(
									description[
										this.objectSchema.properties[index]
											?.relation_name
									],
								);
							}
							// }
						} catch (e) {
							console.error(e);
						}
					}
				}
			}
			this.objectModel = value;
			this.m_objectModel = value;
			this.refreshSchema();
		},
		async getAllMaHieuService() {
			let response;
			try {
				response = await globalService.getData_Async(
					administratorAPI.API_GetAllMaHieuServices(),
				);
				if (!response || !response.state) {
					return;
				}
				this.allMaHieuServices = response.data;
			} catch (error) {
				console.log(error);
			}
		},
		async getAllMaHieuMe() {
			let response;
			try {
				response = await globalService.getData_Async(
					administratorAPI.API_GetAllMaHieuMe(),
				);
				if (!response || !response.state) {
					return;
				}
				this.allMaHieuMe = response.data;
			} catch (error) {
				console.log(error);
			}
		},
		async getAllSignData() {
			let response;
			this.signData = Object.assign({}, SignDataDto);

			try {
				response = await globalService.getData_Async(
					administratorAPI.API_GetAllSignDataByRequestData(
						this.m_requestDto.id,
					),
				);
				if (!response || !response.state) {
					return [];
				}
				this.listSign = response.data.sort((a, b) => {
					return a.id - b.id;
				});
				// this.signData = this.listSign[0];
				for (let _signData of this.listSign) {
					this.signData.numberDownload =
						_signData.numberDownload + this.signData.numberDownload;
					this.signData.numberPrint =
						_signData.numberPrint + this.signData.numberPrint;
					this.signData.numberSign =
						_signData.numberSign + this.signData.numberSign;
					this.signData.numberView =
						_signData.numberView + this.signData.numberView;
				}
			} catch (error) {
				this.toastError(error);
				return;
			}
		},
		async checkMaterial(tableId) {
			await this.saveFieldDataNoFill();
			this.dialog.check_material = true;
			this.total_fail_value = 0;
			this.unknown_value = 0;
			this.total_greater_value = 0;
			this.total_less_value = 0;
			let unknow = [];
			let greater = [];
			let less = [];
			for (let row of this.objectModel[tableId]) {
				if (
					!this.allMaHieuServices.includes(
						row[constant.id.table.ma_hieu],
					) &&
					row[constant.id.table.stt]
				) {
					this.total_fail_value++;
					this.unknown_value++;
					unknow.push(row[constant.id.table.stt]);
				}
				// if (
				// 	row[constant.id.table.stt] &&
				// 	!row[constant.id.table.ma_hieu]
				// ) {
				// 	this.total_fail_value++;
				// 	this.unknown_value++;
				// 	unknow.push(row[constant.id.table.stt]);
				// }
				if (!isNaN(row[constant.id.table.don_gia])) {
					let don_gia = parseFloat(row[constant.id.table.don_gia]);
					if (don_gia > row[constant.id.table.don_gia_chuan]) {
						this.total_greater_value++;
						this.total_fail_value++;
						greater.push(row[constant.id.table.stt]);
					} else if (don_gia < row[constant.id.table.don_gia_chuan]) {
						this.total_less_value++;
						this.total_fail_value++;
						less.push(row[constant.id.table.stt]);
					}
				}
			}
			if (greater?.length) {
				this.total_greater_value += " [" + greater.join(",") + "]";
			}
			if (less?.length) {
				this.total_less_value += " [" + less.join(",") + "]";
			}
			if (unknow?.length) {
				this.unknown_value += " [" + unknow.join(",") + "]";
			}
		},
		async checkMaterialMe(tableId) {
			await this.saveFieldDataNoFill();

			this.dialog.check_material_me = true;
			this.me_unknown_value = 0;

			this.me_goods_total_fail_value = 0;
			this.me_goods_total_greater_value = 0;
			this.me_goods_total_less_value = 0;

			this.me_human_total_fail_value = 0;
			this.me_human_total_greater_value = 0;
			this.me_human_total_less_value = 0;

			let unknow = [];
			let me_goods_greater = [];
			let me_goods_less = [];

			let me_human_greater = [];
			let me_human_less = [];

			for (let row of this.objectModel[tableId]) {
				if (
					!this.allMaHieuMe.includes(
						row[constant.id.table.ma_hieu],
					) &&
					row[constant.id.table.stt]
				) {
					this.me_goods_total_fail_value++;
					this.me_human_total_fail_value++;
					this.me_unknown_value++;
					unknow.push(row[constant.id.table.stt]);
				}
				// if (
				// 	row[constant.id.table.stt] &&
				// 	!row[constant.id.table.ma_hieu]
				// ) {
				// 	this.me_goods_total_fail_value++;
				// 	this.me_human_total_fail_value++;
				// 	this.me_unknown_value++;
				// 	unknow.push(row[constant.id.table.stt]);
				// }

				if (!isNaN(row[constant.id.table.don_gia_ncc_vt_vl])) {
					let don_gia_ncc_vt_vl = parseFloat(
						row[constant.id.table.don_gia_ncc_vt_vl],
					);
					if (
						don_gia_ncc_vt_vl >
						row[constant.id.table.don_gia_chuan_vt_vl]
					) {
						this.me_goods_total_greater_value++;
						this.me_goods_total_fail_value++;
						me_goods_greater.push(row[constant.id.table.stt]);
					} else if (
						don_gia_ncc_vt_vl <
						row[constant.id.table.don_gia_chuan_vt_vl]
					) {
						this.me_goods_total_less_value++;
						this.me_goods_total_fail_value++;
						me_goods_less.push(row[constant.id.table.stt]);
					}
				}
				if (!isNaN(row[constant.id.table.don_gia_ncc_nhan_cong])) {
					let don_gia_ncc_nhan_cong = parseFloat(
						row[constant.id.table.don_gia_ncc_nhan_cong],
					);
					if (
						don_gia_ncc_nhan_cong >
						row[constant.id.table.don_gia_chuan_nhan_cong]
					) {
						this.me_human_total_greater_value++;
						this.me_human_total_fail_value++;
						me_human_greater.push(row[constant.id.table.stt]);
					} else if (
						don_gia_ncc_nhan_cong <
						row[constant.id.table.don_gia_chuan_nhan_cong]
					) {
						this.me_human_total_less_value++;
						this.me_human_total_fail_value++;
						me_human_less.push(row[constant.id.table.stt]);
					}
				}
			}
			if (me_goods_greater?.length) {
				this.me_goods_total_greater_value +=
					" [" + me_goods_greater.join(",") + "]";
			}
			if (me_goods_less?.length) {
				this.me_goods_total_less_value +=
					" [" + me_goods_less.join(",") + "]";
			}

			if (me_human_greater?.length) {
				this.me_human_total_greater_value +=
					" [" + me_human_greater.join(",") + "]";
			}
			if (me_human_less?.length) {
				this.me_human_total_less_value +=
					" [" + me_human_less.join(",") + "]";
			}

			if (unknow?.length) {
				this.me_unknown_value += " [" + unknow.join(",") + "]";
			}
		},
		cellValueChanged(event) {
			console.log(event);
		},

		editNoCargoService(value) {
			this.selectedTableId_Service = value;

			this.openNoCargoService = true;
		},
		editNoCargoME(value) {
			this.openNoCargoME = true;
			this.selectedTableId_Me = value;
		},
		async editCargoService(value) {
			this.selectedTableId_Service = value;

			this.openCargoService = true;
			await this.getAllCargoService();
		},
		async editCargoME(value) {
			this.selectedTableId_Me = value;
			this.openCargoME = true;
			await this.getAllMeCargo();
		},
		closeNoCargoService() {
			this.m_CargoServiceDto = Object.assign({}, CargoServiceDto);
			this.m_CargoServiceDto = {};
			this.openNoCargoService = false;
			this.checkKVs = 0;
		},
		closeNoCargoME() {
			this.m_CargoMeDto = Object.assign({}, CargoMeDto);
			this.m_CargoMeDto = {};
			this.openNoCargoME = false;
		},
		closeCargoService() {
			this.openCargoService = false;
			this.eventPage.page = 1;
			this.clearFindCargoService();
			//this.getAllCargoService();
		},
		closeCargoME() {
			this.openCargoME = false;
			this.eventPage.page = 1;

			this.clearFindMeCargo();
		},

		findNoCargoService() {
			if (!this.m_CargoServiceDto.noi_dung_cong_viec) {
				return this.toastError(this.$t("message.empty_work_content"));
			}
			if (!this.m_CargoServiceDto.quy_cach_ky_thuat) {
				return this.toastError(this.$t("message.empty_qckt"));
			}
			if (!this.m_CargoServiceDto.ma_hieu) {
				return this.toastError(this.$t("message.empty_ma_hieu"));
			}
			if (
				this.allMaHieuServices.includes(this.m_CargoServiceDto.ma_hieu)
			) {
				return this.toastError(this.$t("message.duplicate_ma_hieu"));
			}
			if (!this.m_CargoServiceDto.don_vi_tinh) {
				return this.toastError(this.$t("message.empty_dv_tinh"));
			}
			if (+this.m_CargoServiceDto.don_gia_ha_noi_str < 0) {
				return this.toastError(this.$t("message.non_negative_number"));
			}
			if (+this.m_CargoServiceDto.don_gia_hcm_str < 0) {
				return this.toastError(this.$t("message.non_negative_number"));
			}
			if (+this.m_CargoServiceDto.so_luong < 0) {
				return this.toastError(this.$t("message.non_negative_number"));
			}
			if (+this.m_CargoServiceDto.don_gia_ncc < 0) {
				return this.toastError(this.$t("message.non_negative_number"));
			}
			if (!this.m_CargoServiceDto.so_luong) {
				return this.toastError(this.$t("message.empty_so_luong"));
			}
			if (!this.m_CargoServiceDto.don_gia_ncc) {
				return this.toastError(this.$t("message.empty_don_gia_ncc"));
			}
			if (!this.m_CargoServiceDto.nha_cung_cap) {
				return this.toastError(this.$t("message.empty_ncc"));
			}
			if (!this.m_CargoServiceDto.nha_cung_cap?.name) {
				return this.toastError(this.$t("message.empty_ncc"));
			}
			this.m_CargoServiceDto.nha_cung_cap =
				this.m_CargoServiceDto.nha_cung_cap.name;
			if (this.checkKVs == 0) {
				this.m_CargoServiceDto.don_gia_chuan =
					this.m_CargoServiceDto.don_gia_ha_noi_str;
			}
			if (this.checkKVs == 1) {
				this.m_CargoServiceDto.don_gia_chuan =
					this.m_CargoServiceDto.don_gia_hcm_str;
			}

			if (
				this.objectModel[this.selectedTableId_Service][
					this.objectModel[this.selectedTableId_Service].length - 1
				].ma_hieu == undefined
			) {
				this.objectModel[this.selectedTableId_Service].pop();
			}
			this.objectModel[this.selectedTableId_Service].push(
				this.m_CargoServiceDto,
			);
			// this.objectModel[this.selectedTableId_Service]=[...this.objectModel[this.selectedTableId_Service],this.m_CargoServiceDto]
			this.m_CargoServiceDto = Object.assign({}, CargoServiceDto);
			this.m_CargoServiceDto = {};
			this.checkKVs = 0;
			this.checkKV = "KV Hà Nội";
			this.toastSuccess(this.$t("message.successfully_added_new"));
			this.openNoCargoService = false;
		},
		findNoCargoME() {
			if (!this.m_CargoMeDto.noi_dung_cong_viec) {
				return this.toastError(this.$t("message.empty_work_content"));
			}
			if (!this.m_CargoMeDto.quy_cach_ky_thuat) {
				return this.toastError(this.$t("message.empty_qckt"));
			}
			if (!this.m_CargoMeDto.ma_hieu) {
				return this.toastError(this.$t("message.empty_ma_hieu"));
			}
			if (this.allMaHieuMe.includes(this.m_CargoMeDto.ma_hieu)) {
				return this.toastError(this.$t("message.duplicate_ma_hieu"));
			}
			if (!this.m_CargoMeDto.don_vi_tinh) {
				return this.toastError(this.$t("message.empty_dv_tinh"));
			}
			if (!this.m_CargoMeDto.so_luong) {
				return this.toastError(this.$t("message.empty_so_luong"));
			}
			if (!this.m_CargoMeDto.don_gia_ncc_vt_vl) {
				return this.toastError(
					this.$t("message.empty_don_gia_ncc_vt_vl"),
				);
			}
			if (!this.m_CargoMeDto.don_gia_ncc_nhan_cong) {
				return this.toastError(
					this.$t("message.empty_don_gia_ncc_nhan_cong"),
				);
			}
			if (!this.m_CargoMeDto.ncc) {
				return this.toastError(this.$t("message.empty_ncc"));
			}
			if (+this.m_CargoMeDto.don_gia_chuan_vt_vl < 0) {
				return this.toastError(this.$t("message.non_negative_number"));
			}
			if (+this.m_CargoMeDto.don_gia_chuan_nhan_cong < 0) {
				return this.toastError(this.$t("message.non_negative_number"));
			}
			if (+this.m_CargoMeDto.so_luong < 0) {
				return this.toastError(this.$t("message.non_negative_number"));
			}
			if (+this.m_CargoMeDto.don_gia_ncc_vt_vl < 0) {
				return this.toastError(this.$t("message.non_negative_number"));
			}
			if (+this.m_CargoMeDto.don_gia_ncc_nhan_cong < 0) {
				return this.toastError(this.$t("message.non_negative_number"));
			}
			if (!this.m_CargoMeDto.ncc?.name) {
				return this.toastError(this.$t("message.empty_ncc"));
			}
			this.m_CargoMeDto.ncc = this.m_CargoMeDto.ncc.name;
			if (
				this.objectModel[this.selectedTableId_Me][
					this.objectModel[this.selectedTableId_Me].length - 1
				].ma_hieu == undefined
			) {
				this.objectModel[this.selectedTableId_Me].pop();
			}
			this.objectModel[this.selectedTableId_Me].push(this.m_CargoMeDto);

			this.m_CargoMeDto = Object.assign({}, CargoMeDto);
			this.m_CargoMeDto = {};
			this.openNoCargoME = false;

			this.toastSuccess(this.$t("message.successfully_added_new"));
		},
		findCargoService() {
			if (!this.selectedCargoService.length > 0) {
				return this.toastError(this.$t("message.alert_no_selected"));
			}
			this.objectTableId_Service = this.objectModel[
				this.selectedTableId_Service
			].filter((entry) => {
				return entry.noi_dung_cong_viec;
			});
			if (this.radio == 0) {
				for (let item of this.selectedCargoService) {
					item.don_gia_chuan = item.don_gia_ha_noi_str;
				}
			}
			if (this.radio == 1) {
				for (let item of this.selectedCargoService) {
					item.don_gia_chuan = item.don_gia_hcm_str;
				}
			}
			this.objectModel[this.selectedTableId_Service] = [];
			this.objectModel[this.selectedTableId_Service] =
				this.objectTableId_Service.concat(this.selectedCargoService);
			this.selectedCargoService = [];
			this.openCargoService = false;
			this.radio = 0;
			this.eventPage.page = 1;

			this.clearFindCargoService();
			this.toastSuccess(this.$t("message.successfully_added_new"));
		},
		findCargoME() {
			if (!this.selectedCargoME.length > 0) {
				return this.toastError(this.$t("message.alert_no_selected"));
			}
			for (let item of this.selectedCargoME) {
				item.don_gia_chuan_nhan_cong = item.don_gia_nhan_cong_str;
				item.don_gia_chuan_vt_vl = item.don_gia_vat_tu_vat_lieu_str;
			}
			this.objectTableId_Me = this.objectModel[
				this.selectedTableId_Me
			].filter((entry) => {
				return entry.noi_dung_cong_viec;
			});

			this.objectModel[this.selectedTableId_Me] = [];
			// this.objectModel[this.selectedTableId_Me] = this.objectModel[this.selectedTableId_Me].concat(this.selectedCargoME)
			this.objectModel[this.selectedTableId_Me] =
				this.objectTableId_Me.concat(this.selectedCargoME);
			this.openCargoME = false;
			this.selectedCargoME = [];
			this.eventPage.page = 1;
			this.clearFindMeCargo();
			this.toastSuccess(this.$t("message.successfully_added_new"));
		},

		async getAllMeCargo(page, size) {
			let reqBody = {
				isDelete: "false",
				isActive: "true",
				noi_dung_cong_viec: this.s_noi_dung_cong_viec ? this.s_noi_dung_cong_viec : null,
				quy_cach_ky_thuat: this.s_quy_cach_ky_thuat ? this.s_quy_cach_ky_thuat : null,
				ma_hieu: this.s_ma_hieu ? this.s_ma_hieu : null,
				don_vi_tinh: this.s_don_vi_tinh ? this.s_don_vi_tinh : null,
				don_gia_vat_tu_vat_lieu_str: this.s_don_gia_vat_tu_vat_lieu_str ? this.s_don_gia_vat_tu_vat_lieu_str : null,
				don_gia_nhan_cong_str: this.s_don_gia_nhan_cong_str ? this.s_don_gia_nhan_cong_str : null,
			};
			try {
				let response = await globalService.postData_Async(
					administratorAPI.API_GetAllMeCargo(page, size),
					reqBody,
				);
				this.countAllItem = response.data.total;
				this.listMeCargo = response.data.listData.filter((entry) => {
					entry.showAll = false;
					return entry;
				});
			} catch (error) {
				console.log(error);
			}
		},
		clearFindMeCargo() {
			this.s_noi_dung_cong_viec = "";
			this.s_quy_cach_ky_thuat = "";
			this.s_ma_hieu = "";
			this.s_don_vi_tinh = "";
			this.s_don_gia_vat_tu_vat_lieu_str = "";
			this.s_don_gia_nhan_cong_str = "";
		},
		clearFindCargoService() {
			this.s_noi_dung_cong_viec_service = "";
			this.s_quy_cach_ky_thuat_service = "";
			this.s_ma_hieu_service = "";
			this.s_don_vi_tinh_service = "";
			this.s_don_gia_ha_noi_str_service = "";
			this.s_don_gia_hcm_str_service = "";
		},
		changePage(event) {
			this.eventPage = event;
			if (event.itemsPerPage == -1) {
				event.itemsPerPage = 100;
			}
			this.getAllMeCargo(event.page - 1, event.itemsPerPage);
			return;
		},
		changePageService(event) {
			this.eventPage = event;
			if (event.itemsPerPage == -1) {
				event.itemsPerPage = 100;
			}
			this.getAllCargoService(event.page - 1, event.itemsPerPage);
			return;
		},
		filterByNoidungME(event) {
			if (
				event.code == constant.keys.enter ||
				event.keyCode == constant.keys.enter_keyCode ||
				!event.target.value
			) {
				this.eventPage.page = 1;
				this.getAllMeCargo(
					this.eventPage.page - 1,
					this.eventPage.itemsPerPage,
				);
			}
		},
		filterByQuyCachME(event) {
			if (
				event.code == constant.keys.enter ||
				event.keyCode == constant.keys.enter_keyCode ||
				!event.target.value
			) {
				this.eventPage.page = 1;
				this.getAllMeCargo(
					this.eventPage.page - 1,
					this.eventPage.itemsPerPage,
				);
			}
		},
		filterByMaHieuME(event) {
			if (
				event.code == constant.keys.enter ||
				event.keyCode == constant.keys.enter_keyCode ||
				!event.target.value
			) {
				this.eventPage.page = 1;
				this.getAllMeCargo(
					this.eventPage.page - 1,
					this.eventPage.itemsPerPage,
				);
			}
		},
		filterByDonViTinhME(event) {
			if (
				event.code == constant.keys.enter ||
				event.keyCode == constant.keys.enter_keyCode ||
				!event.target.value
			) {
				this.eventPage.page = 1;
				this.getAllMeCargo(
					this.eventPage.page - 1,
					this.eventPage.itemsPerPage,
				);
			}
		},
		filterByDonGiaChuanME(event) {
			if (
				event.code == constant.keys.enter ||
				event.keyCode == constant.keys.enter_keyCode ||
				!event.target.value
			) {
				this.eventPage.page = 1;
				this.getAllMeCargo(
					this.eventPage.page - 1,
					this.eventPage.itemsPerPage,
				);
			}
		},
		filterByDonGiaNhanCongME(event) {
			if (
				event.code == constant.keys.enter ||
				event.keyCode == constant.keys.enter_keyCode ||
				!event.target.value
			) {
				this.eventPage.page = 1;
				this.getAllMeCargo(
					this.eventPage.page - 1,
					this.eventPage.itemsPerPage,
				);
			}
		},
		async getAllCargoService(page, size) {
			let reqBody = {
				isDelete: "false",
				isActive: "true",
				noi_dung_cong_viec: this.s_noi_dung_cong_viec_service ? this.s_noi_dung_cong_viec_service : null,
				quy_cach_ky_thuat: this.s_quy_cach_ky_thuat_service ? this.s_quy_cach_ky_thuat_service : null,
				ma_hieu: this.s_ma_hieu_service ? this.s_ma_hieu_service : null,
				don_vi_tinh: this.s_don_vi_tinh_service ? this.s_don_vi_tinh_service : null,
				don_gia_ha_noi_str: this.s_don_gia_ha_noi_str_service ? this.s_don_gia_ha_noi_str_service : null,
				don_gia_hcm_str: this.s_don_gia_hcm_str_service ? this.s_don_gia_hcm_str_service : null,
			};
			try {
				let response = await globalService.postData_Async(
					administratorAPI.API_GetAllCargoService(page, size),
					reqBody,
				);
				this.countAllItemService = response.data.total;
				this.listCargoService = response.data.listData.filter(
					(entry) => {
						entry.showAll = false;
						return entry;
					},
				);
			} catch (error) {
				console.log(error);
			}
		},
		filterByNoidungService(event) {
			if (
				event.code == constant.keys.enter ||
				event.keyCode == constant.keys.enter_keyCode ||
				!event.target.value
			) {
				this.eventPage.page = 1;
				this.getAllCargoService(
					this.eventPage.page - 1,
					this.eventPage.itemsPerPage,
				);
			}
		},
		filterByQuyCachService(event) {
			if (
				event.code == constant.keys.enter ||
				event.keyCode == constant.keys.enter_keyCode ||
				!event.target.value
			) {
				this.eventPage.page = 1;
				this.getAllCargoService(
					this.eventPage.page - 1,
					this.eventPage.itemsPerPage,
				);
			}
		},
		filterByMaHieuService(event) {
			if (
				event.code == constant.keys.enter ||
				event.keyCode == constant.keys.enter_keyCode ||
				!event.target.value
			) {
				this.eventPage.page = 1;
				this.getAllCargoService(
					this.eventPage.page - 1,
					this.eventPage.itemsPerPage,
				);
			}
		},
		filterByDonViTinhService(event) {
			if (
				event.code == constant.keys.enter ||
				event.keyCode == constant.keys.enter_keyCode ||
				!event.target.value
			) {
				this.eventPage.page = 1;
				this.getAllCargoService(
					this.eventPage.page - 1,
					this.eventPage.itemsPerPage,
				);
			}
		},
		filterByDonGiaChuanHN(event) {
			if (
				event.code == constant.keys.enter ||
				event.keyCode == constant.keys.enter_keyCode ||
				!event.target.value
			) {
				this.eventPage.page = 1;
				this.getAllCargoService(
					this.eventPage.page - 1,
					this.eventPage.itemsPerPage,
				);
			}
		},
		filterByDonGiaChuanHCM(event) {
			if (
				event.code == constant.keys.enter ||
				event.keyCode == constant.keys.enter_keyCode ||
				!event.target.value
			) {
				this.eventPage.page = 1;
				this.getAllCargoService(
					this.eventPage.page - 1,
					this.eventPage.itemsPerPage,
				);
			}
		},
		radios1() {
			this.radio = 0;
		},
		radios2() {
			this.radio = 1;
		},
		checkKV_HN() {
			this.checkKVs = 0;
		},
		checkKV_HCM() {
			this.checkKVs = 1;
		},
		getDataCargo(search = "") {
			this.value = search;
			this.searchQueue = [];
			this.searchQueue.push(
				globalService
					.getData_NoAsync(
						administratorAPI.API_GetCargoKeyWord(search ?? ""),
					)
					.then((response) => {
						if (response.status != 200) {
							return;
						}
						this.materials = response.data.data;
					}),
			);
		},
		clearFromService() {
			(this.m_CargoServiceDto.noi_dung_cong_viec = ""),
				(this.m_CargoServiceDto.quy_cach_ky_thuat = ""),
				(this.m_CargoServiceDto.ma_hieu = ""),
				(this.m_CargoServiceDto.don_vi_tinh = ""),
				(this.m_CargoServiceDto.don_gia_ha_noi_str = ""),
				(this.m_CargoServiceDto.don_gia_hcm_str = ""),
				(this.m_CargoServiceDto.nha_cung_cap = ""),
				(this.m_CargoServiceDto.so_luong = null),
				(this.m_CargoServiceDto.don_gia_ncc = null);
			//this.m_CargoServiceDto.thanh_tien = ""
		},
	},
	filters: {
		format_date: function (value) {
			return moment(value).format(constant.format.date_hours);
		},
	},
};
</script>

<style lang="scss">
@import "~ag-grid-community/styles/ag-grid.css";
@import "~ag-grid-community/styles/ag-theme-alpine.css";

.table_tiptap > table > tbody > tr > td {
	padding: 4px 16px;
	border: 1px solid rgb(206, 206, 206);
}

.table_tiptap > table > tbody > tr > th {
	padding: 4px 16px;
	border: 1px solid rgb(206, 206, 206);
}

.table_tiptap > table > tbody > tr > td > p {
	margin: 0px;
}

.table_tiptap > table > tbody > tr > th > p {
	margin: 0px;
}

.ui-datepicker-prev {
	text-align: center;
}

.ui-datepicker-next {
	text-align: center;
}

.ui-datepicker-prev::before {
	content: "\2039";
}

.ui-datepicker-next::before {
	content: "\203A";
}
</style>
