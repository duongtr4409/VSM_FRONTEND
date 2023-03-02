<template>
	<v-card flat elevation="0" v-if="m_requestDto">
		<fileRenderer class="d-none"></fileRenderer>
		<v-dialog max-width="60vw" v-model="openFileRequestData" persistent>
			<FileRequestData
				@close="onClose"
				@save="onSaveFile"
			></FileRequestData>
		</v-dialog>
		<v-dialog
			max-width="60vw"
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
		<v-row>
			<v-col cols="12" md="9">
				<v-row class="my-2">
					<v-col cols="2">
						<span>{{ $t("label.mail_template_subject")}} :</span>
					</v-col>
					<v-col cols="10" md="10">
						<span> {{ m_requestDto.title }}</span>
					</v-col>
					<v-col cols="2">
						<span> {{ $t("label.description") }} : </span>
					</v-col>
					<v-col cols="10" md="10">
						<span
							v-html="sanitizeText(m_requestDto.description)"
							class="table_tiptap"
						></span>
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
									class="
										text-black text-base
										font-weight-bold
									"
								>
									{{ $t("label.information_form") }}
								</span>
								<v-spacer></v-spacer>
								<!-- <v-btn
									icon
									color="blue darken-2"
									@click="saveFormData"
									class="float-right"
								>
									<v-icon>mdi-content-save</v-icon>
								</v-btn> -->
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
								/>
							</v-form>
							<template v-for="(table, idxTable) in tableSchema">
								<ag-grid-vue
									class="ag-theme-alpine h-[20rem] my-4"
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
									class="
										text-black text-base
										font-weight-bold
									"
								>
									{{ $t("label.main_document") }}
								</span>
								<v-spacer></v-spacer>
								<!-- <v-btn
									icon
									color="blue darken-2"
									@click="editFileRequestData"
									class="float-right"
								>
									<v-icon>mdi-plus-circle</v-icon>
								</v-btn> -->
							</v-card-actions>
						</v-expansion-panel-header>
						<v-divider></v-divider>
						<v-progress-linear
							indeterminate
							color="blue darken-2"
							v-if="componentLoading.document"
						>
						</v-progress-linear>
						<v-expansion-panel-content>
							<v-data-table
								v-model="selected"
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
											class="
												flex
												items-center
												justify-between
											"
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
														v-if="checkShowButton(VIEW)"
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
															(item.fileExtension ==
																'docx' ||
															item.fileExtension ==
																'pptx' ||
															item.fileExtension ==
																'xlsx') 
															&& checkShowButton(EDIT)
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
														v-if="checkShowButton(DELETE)"
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
														v-if="checkShowButton(DOWNLOAD)"
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
									class="
										text-black text-base
										font-weight-bold
									"
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
											class="
												flex
												items-center
												justify-between
											"
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
														v-if="checkShowButton(VIEW)"
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
															(item.fileExtension ==
																'docx' ||
															item.fileExtension ==
																'pptx' ||
															item.fileExtension ==
																'xlsx')
															&& checkShowButton(EDIT)
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
														v-if="checkShowButton(DELETE)"
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
														v-if="checkShowButton(DOWNLOAD)"
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
									class="
										text-black text-base
										font-weight-bold
									"
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
												class="
													max-h-[15rem]
													p-2
													border border-solid
													rounded
												"
												v-if="hisTrade.length > 0"
											>
												<span
													v-for="item of hisTrade"
													:key="item.id"
													class="d-flex"
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
														v-html="sanitizeText(item.content)"
														class="
															table_tiptap
															min-w-[30rem]
															h-[fit-content]
														"
													></span>
												</span>
											</vue-perfect-scrollbar>
										</v-tab-item>
										<v-tab-item key="customer">
											<vue-perfect-scrollbar
												class="
													max-h-[15rem]
													p-2
													border border-solid
													rounded
												"
												v-if="
													hisTradeCustomer.length > 0
												"
											>
												<span
													v-for="item of hisTradeCustomer"
													:key="item.id"
													class="d-flex"
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
														v-html="sanitizeText(item.content)"
														class="
															table_tiptap
															min-w-[30rem]
															h-[fit-content]
														"
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
				<v-tabs v-model="tab" color="blue">
					<v-tab key="processing_history" class="font-bold">
						<span class="text-[#454545]">
							{{ $t("label.processing_process") }}
							<v-icon> mdi-history </v-icon>
						</span>
					</v-tab>

					<!-- <v-tab
						v-if="!isCvd"
						key="processing_process"
						class="font-bold"
					>
						<span class="text-[#454545]">
							{{ $t("label.processing_history") }}
						</span>
					</v-tab> -->
				</v-tabs>
				<v-divider></v-divider>
				<v-col>
					<v-tabs-items v-model="tab">
						<v-tab-item key="processing_history">
							<v-progress-linear
								indeterminate
								color="blue darken-2"
								v-if="componentLoading.history"
							>
							</v-progress-linear>

							<vue-perfect-scrollbar class="h-[50vh] w-full">
								<v-timeline
									dense
									v-for="(steep, index) of procesHisTemps"
									align-top
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
													class="
														rounded-pill
														text-black text-base
														ml-20
													"
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
											class="
												grey
												lighten-3
												rounded-md
												my-1
												flex flex-col
												p-2
												min-h-[3rem]
												left-[-1rem]
											"
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
												:class="'text-black text-base'"
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
										<v-card-text
											:class="'text-black text-xs'"
											:style="{ margin: 0 }"
											v-if="steep.createDate"
										>
											{{
												moment(steep.createDate).format(
													dateFormat,
												)
											}}
										</v-card-text>
										<v-list-group
											no-action
											sub-group
											:value="true"
											v-if="
												steep.processHisChild &&
												steep.processHisChild.length > 0
											"
											class="ml-[-1rem]"
										>
											<template v-slot:activator>
												<v-list-item-title
													class="
														text-black text-base
														h-[1rem]
														p-0
														m-0
														ml-[-1rem]
													"
													>{{$t('label.history')}} :{{
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
													class="ml-[-4rem]"
												>
													<v-timeline-item
														class="pb-0"
														hide-dot
														left
													>
														<v-card
															elevation="0"
															class="
																grey
																lighten-3
																rounded-md
																my-1
																flex flex-col
																left-[-1rem]
															"
														>
															<span
																v-if="
																	item.processer
																"
																:class="'font-bold'"
																:style="{
																	margin: 0,
																}"
																>{{
																	item
																		.processer
																		.fullName
																}}</span
															>
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
																:class="'text-black text-base'"
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
															:class="'text-black text-base'"
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
							<v-card elevation="0">
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
										<v-btn
											color="green darken-5"
											elevation="0"
											dark
											class="rounded-pill cursor-none"
										>
											<v-icon>mdi-pencil</v-icon>

											{{$t('label.step')}} {{ index + 1 }}
										</v-btn>
										<div
											class="
												flex
												justify-start
												gap-2
												items-center
											"
											v-if="steep.isActive"
										>
											<span class="text-base font-bold">
												{{ $t("label.handle") }}
											</span>
											<v-progress-circular
												:size="30"
												color="blue-grey lighten-2"
											>
											</v-progress-circular>
										</div>
										<v-card
											elevation="0"
											class="
												grey
												lighten-3
												rounded-md
												my-2
												min-h-[3rem]
											"
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
														color="indigo mr-2"
														size="28"
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
									</v-timeline-item>
								</v-timeline>
							</v-card>
						</v-tab-item>
					</v-tabs-items>
				</v-col>
				<div>
					<v-divider class="mt-2"></v-divider>
					<v-card elevation="0">
						<v-row>
							<v-col cols="10">
								<v-card-text class="font-weight-medium"
									>{{ $t("label.related_request_form") }}
								</v-card-text>
							</v-col>
						</v-row>
					</v-card>
					<div
						class="flex flex-col"
						v-for="(
							relate, indexreq
						) of m_requestDto.requestDataList"
						:key="indexreq"
					>
						<!-- <span v-if="relate" class="pl-4 mx-2">{{
							relate.title
						}}</span> -->
						<div class="flex justify-between">
							<!-- <v-btn
								class="mx-2 my-0"
								text
								color="blue"
								rounded-pill
								depressed
							>
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
								<v-list class="w-[120px]">
									<v-list-item
										@click="viewRequestRelateData(relate)"
									>
										<v-icon color=" darken-2 " class="pr-3">
											mdi-eye-circle-outline
										</v-icon>
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
									<!-- <v-list-item>
											<v-list-item-icon>
												<v-icon color="red darken-2">
													mdi-delete-circle
												</v-icon>
											</v-list-item-icon>
											<v-list-item-title>
												{{ $t("button.delete") }}
											</v-list-item-title>
										</v-list-item> -->
								</v-list>
							</v-menu>
						</div>
						<v-divider></v-divider>
					</div>
					<v-divider class="mt-2"></v-divider>
					<v-card elevation="0">
						<v-row>
							<v-col cols="10">
								<v-card-text class="font-weight-medium">
									{{ $t("label.share_with") }}
								</v-card-text>
							</v-col>
							<v-col cols="2">
								<!-- <v-btn
													text
													tile
													color="blue"
													@click="
														editUserInfosRequestData
													"
													class="float-right mt-2"
												>
													<v-icon color="blue"
														>mdi-plus-circle</v-icon
													>
												</v-btn> -->
							</v-col>
						</v-row>
					</v-card>
					<v-combobox
						v-if="m_requestDto.userInfos.length"
						v-model="m_requestDto.userInfos"
						chips
						dense
						multiple
						disabled
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
							>
								<v-avatar color="red mr-2" size="30">
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
		</v-row>
	</v-card>
</template>

<script>
import "@koumoul/vjsf/lib/VJsf.css";
import "@koumoul/vjsf/lib/deps/third-party.js";
import VJsf from "@koumoul/vjsf/lib/VJsf";
import globalService from "@/services/global.service";
import administratorAPI from "../../administrator/administrator.api";
import FileRequestData from "../../khai-phieu-yeu-cau/RequestForm/FileRequestData.vue";
import UserInfosRequestData from "../../khai-phieu-yeu-cau/RequestForm/UserInfosRequestData.vue";
import RelateRequestData from "../../khai-phieu-yeu-cau/RequestForm/RelateRequestData.vue";
// import FileRequestData from "./FileRequestData.vue";
// import UserInfosRequestData from "./UserInfosRequestData.vue";
// import RelateRequestData from "./RelateRequestData.vue";
import moment from "moment";
import RequestFormDataDto from "@/models/form-data.dto";
import FileRenderer from "@/components/form-control/fileRenderer";
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
import AttachmentFileRequestData from "../../khai-phieu-yeu-cau/RequestForm/AttachmentFileRequestData.vue";
import ViewAttachmentFile from "../../khai-phieu-yeu-cau/RequestForm/ViewAttachmentFile.vue";
// import AttachmentFileRequestData from "./AttachmentFileRequestData.vue";
// import ViewAttachmentFile from "./ViewAttachmentFile.vue";
import constant from "@/common/constant";
import store from "@/store";
import { AgGridVue } from "ag-grid-vue";
import ExprEval from "expr-eval";
import numeral from "@/plugins/numeral";
import DateEditor from "@/components/form-control/dateEditor";
import InformationInExchangeDto from "@/models/informationInExchange.dto";
export default {
	name: "VSMFEViewDeclarationStatistic",
	props: { requestDataV2: {}, isSaved: {}, isLoad: Boolean },
	components: {
		VJsf,
		FileRequestData,
		UserInfosRequestData,
		RelateRequestData,
		AttachmentFileRequestData,
		ViewAttachmentFile,
		TiptapVuetify,
		AgGridVue,
		fileRenderer: FileRenderer,
	},
	data() {
		return {
			formLoading: true,
			isEdit: false,
			panels: [0, 1, 2, 3],
			ALL_STATUS: [],
			tab: 0,
			m_isLoad: true,
			tabs: [
				{
					key: "processing_history",
					title: this.$t("label.processing_history"),
				},
				{
					key: "processing_process",
					title: this.$t("label.processing_process"),
				},
			],
			tableSchema: [], // Danh sách các bảng có trong form
			tableModel: [], // dánh sách dữ liệu của bảng trong form
			objectSchema: {},
			objectModel: {},
			itemAddToTable: {},
			flagEdit: {},
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
			attachmentFilePDF: {},
			user_info: this.getUserInfo(),
			listAttachmentFlieByRequests: [],
			moment: moment,
			listUserReqdataProcessHis: {},
			requestdataProcessHis: null,
			idView: null,
			listTemplateForm: [],
			userTrade: InformationInExchangeDto,
			tabChat: 0,
			update_at: null,
			m_isSaved: {},
			m_requestDto: null,
			listAttachmentFlieByRequest: [],
			listUserInfos: [],
			form: [],
			procesHisTemps: [],
			openViewTemplateForm: false,
			hisTrade: [],
			hisTradeCustomer: [],
			content: "",
			idTemplateForm: null,
			options: {
				fieldProps: {
					outlined: "outlined",
					dense: "dense",
					readonly: "readonly",
				},
				formats: {
					date: function (e) {
						let value = moment(e);
						return !value.isValid()
							? ""
							: value.format(constant.format.vi_date);
					},
				},
			},
			formData: null,
			file: [],
			xOptions: {
				messages: {
					pattern: this.$t("validator.pattern"),
					required: this.$t("validator.required"),
					maxLength: this.$t("validator.max_length"),
					minLength: this.$t("validator.min_length"),
					maximum: this.$t("validator.max_length"),
					minimum: this.$t("validator.min_length"),
				},
				disableAll: true,
			},
			openFileRequestData: false,
			openAttachmentFilePDF: false,
			openAttachmentFileRequestData: false,
			openUserInfosRequestData: false,
			openRelateRequestData: false,
			openViewAttachmentFile: false,
			items: [],
			search: "",
			singleSelect: false,
			selected: [],
			dateFormat: "DD/MM/yyyy HH:mm",
			listRequestData: [],
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
					class: "tableFont",
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
					class: "tableFont",
					width: "28%",
				},

				{
					text: this.$t("label.updated_name"),
					value: "templateForm.createdName",

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
					class: "tableFont",
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
					class: "tableFont",
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
					class: "tableFont",
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
				// 	class: "tableFont",
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
					class: "tableFont",
					width: "20%",
				},
			],
			listFile: [],
			stepDatas: [],
			isCvd: false,
			requestFormDataDto: RequestFormDataDto,
			isQR: false,
			isWater: false,
			columnDefs: [],
			gridApi: [],
			columnApi: [],
			defaultColDef: {
				flex: 1,
				// minWidth: 110,
				editable: false,
				resizable: true,
				sortable: true,
			},
			rowData: null,
			pinnedTopRowData: null,
			pinnedBottomRowData: null,
			json_fields: [],
			json_data: [],
			json_meta: [],
			tableCalculator: {},
			fieldData: [],
			permissionUserOfRequestData: {},			// biến chứa thông tin quyền tác động của user đối với requestData\
			VIEW: 'view',
			EDIT: 'edit',
			DELETE: 'delete',
			DOWNLOAD: 'download',
		};
	},

	computed: {
		formTitle() {
			return this.editedIndex === -1 ? "New Item" : "Edit Item";
		},
	},

	watch: {
		dialog(val) {
			val || this.close();
		},
		dialogDelete(val) {
			val || this.closeDelete();
		},

		requestDataV2(newValue) {
			this.m_requestDto = newValue;
		},

		async isSaved(value) {
			this.m_isSaved = value;
			if (this.m_isSaved.state == 1) {
				await this.saveFormData();
			}
		},
		openAttachmentFileRequestData(val) {
			if (!val) {
				this.getAttachmentFileRequestV3();
			}
		},
		isLoad(val) {
			this.m_isLoad = val;
			this.getAttachmentFileRequestV3();
			this.getListStepData();
		},
	},
	async created() {},
	mounted() {
		this.m_requestDto = this.requestDataV2;
		if (this.m_requestDto?.requestGroupName.includes(this.$t("enum.CVD"))) {
			this.isCvd = true;
		}
		this.m_isSaved = this.isSaved;
		this.getTotalPage();
		// await this.saveFormData();
		this.initialize();
	},

	methods: {
		editItem(item) {
			this.editedIndex = this.dessertsDuowngTora.indexOf(item);
			this.editedItem = Object.assign({}, item);
			this.dialog = true;
		},

		deleteItem(item) {
			this.editedIndex = this.dessertsDuowngTora.indexOf(item);
			this.editedItem = Object.assign({}, item);
			this.dialogDelete = true;
		},

		deleteItemConfirm() {
			this.dessertsDuowngTora.splice(this.editedIndex, 1);
			this.closeDelete();
		},

		close() {
			this.dialog = false;
			this.$nextTick(() => {
				this.editedItem = Object.assign({}, this.defaultItem);
				this.editedIndex = -1;
			});
		},

		closeDelete() {
			this.dialogDelete = false;
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
		getReqdataProcessHis() {
			this.componentLoading.history = true;
			globalService
				.getData_NoAsync(
					administratorAPI.API_GetReqdataProcessHisByID(
						this.m_requestDto.id,
					),
				)
				.then(async (response) => {
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
					// this.requestdataProcessHis =
					// 	this.requestdataProcessHis.filter((ele) => {
					// 		return !ele.isShowCustomer;
					// 	});
					this.reqdataProcessHisDTO();
				})
				.finally(() => {
					this.componentLoading.history = false;
				});
		},
		getListStepData() {
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
					this.getReqdataProcessHis();
				})
				.finally(() => {
					this.componentLoading.process = false;
				});

			//this.idStepData = 1;
			//this.$emit("saveStepData", this.idStepData);
		},
		async reqdataProcessHisDTO() {
			this.procesHisTemps = [];
			let startIndex = 0;
			let isDone = false;
			for (let processHis of this.requestdataProcessHis) {
				let procesHisTemp = Object.assign({}, processHis);
				if (procesHisTemp.status.includes(this.$t("status.approved"))) {
					isDone = true;
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
					entry.status = this.$t('status.approval');
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
		onSave(value) {
			this.m_requestDto.userInfos = value;
		},
		onSaveRelate(value) {
			this.m_requestDto.requestDataList = value;
		},
		onSaveFile(value) {
			this.listFile = value;
			for (let file of this.listFile) {
				this.listTemplateForm.push(...file.attachmentFileDTOS);
			}
		},
		onSaveFileAta(value) {
			this.listAttachmentFlieByRequests.push(...value);
		},
		async initialize() {
			// this.getAllRequestData();
			// await this.getAttachmentFileRequestV2();
			this.getAttachmentFileRequestV3();
			//await this.getAttachmentFileRequest();
			this.getAllStatus();
			this.getListStepData();
			this.getHisTrade();
			this.getPermissionUserInRequestData();
		},
		FormData() {
			this.formLoading = true;
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
						this.objectSchema = JSON.parse(
							this.formData.objectSchema,
						);
						this.objectModel = JSON.parse(
							this.formData.objectModel,
						);
						this.deepFormatObject(
							this.objectModel,
							this.objectSchema.properties,
							constant.format.date,
							constant.format.vi_date,
						);
						this.m_objectModel = this.objectModel;
						// this.deepFormatObject(
						// 	this.m_objectModel,
						// 	constant.format.date,
						// 	constant.format.vi_date,
						// 	true,
						// );
						// lấy ra nhưng field là bảng có trong objectSchema đẩy vào biến tableSchema
						this.tableSchema = [];

						let itemAddToTableTemp = {};
						let flagEditTemp = {};
						let parser = new ExprEval.Parser();
						let requires = [];
						this.columnDefs = [];
						for (let index in this.objectSchema.properties) {
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
								// this.objectModel[table.title] = this.objectModel[
								// 	table.title
								// ]
								// 	? this.objectModel[table.title]
								// 	: [];
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
										this.tableCalculator[table.id][
											ele.value
										] = ele.value2;
									}
									itemAddToTableTemp[table.id][ele.value] =
										"";
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
											return params.data[
												params.column.colId
											];
										},
										valueSetter: (params) => {
											params.data[params.column.colId] =
												params.newValue;
											for (let key in this
												.tableCalculator[table.id]) {
												try {
													params.data[key] =
														ExprEval.Parser.evaluate(
															this
																.tableCalculator[
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
											}
											return `${params.value}`.replace(
												/(\d)(?=(\d{3})+(?!\d))/g,
												"$1,",
											);
										};
									}
									if (ele?.type == constant.type.date) {
										colDef.cellEditor = DateEditor;
										colDef.cellEditorPopup = true;
									}
									if (ele?.type == constant.type.file) {
										colDef.cellEditor = "fileEditor";
										colDef.cellRenderer = "fileRenderer";
										colDef.valueGetter = function (params) {
											return params.data[
												params.column.colId
											];
										};
									}
									dataGridColDefs.push(colDef);
								});
								//Thêm dữ liệu để xuất file
								this.model_json = this.objectModel[table.title];
								for (let json_data of table.Headers) {
									this.json_meta.push(json_data.text);
								}
								//hết Thêm dữ liệu để xuất file

								table.Headers.push({
									text: this.$t("label.actions"),
									value: "actions",
									sortable: false,
								});
								this.tableSchema.push(table);
								this.columnDefs.push(dataGridColDefs);
								this.objectSchema.properties[index] = {
									Headers:
										this.objectSchema.properties[index]
											?.Headers,
									title: table.title,
								};
							} else if (
								this.objectSchema.properties[index]?.value
							) {
								try {
									let expr = parser.parse(
										this.objectSchema.properties[index]
											?.value,
									);
									if (expr) {
										this.calculator[
											this.objectSchema.properties[
												index
											]?.id
										] =
											this.objectSchema.properties[
												index
											]?.value;

										this.objectSchema.properties[
											index
										].readOnly = true;
										this.objectModel[
											this.objectSchema.properties[
												index
											]?.id
										] = "";
									}
								} catch (e) {
									console.error(e);
								}
							} 
							if (
								this.objectSchema.properties[index]?.is_required
							) {
								requires.push(
									this.objectSchema.properties[index]?.id,
								);
								this.objectSchema.properties[index].title = `${
									this.objectSchema.properties[index].title
								} ${this.$t("label.star")}`;
								this.objectSchema.properties[index]["x-props"][
									"validateOnBlur"
								] = true;
							}
							if (
								this.objectSchema.properties[index]?.format ==
								constant.type.date
							) {
								this.objectSchema.properties[index]["x-props"][
									"prependIcon"
								] = "mdi-heart";
								this.objectSchema.properties[index]["x-slots"] =
									{
										"prepend-outer": "",
									};
							}
							if (
								this.objectSchema.properties[index]
									?.contentMediaType == "image/*"
							) {
								console.log(
									"this.objectModel[index]?.name",
									this.objectModel[index]?.name,
								);
								this.objectSchema.properties[index]["x-slots"] =
									{
										// after:
										// 	"<img class='my-4' src='data:image/png;base64, " +
										// 	this.objectModel[index]?.data +
										// 	"'>",
										after: this.objectModel[index]?.name,
									};
							}

							this.objectSchema.properties[index]["x-options"] =
								this.xOptions;
						}
						this.objectSchema.required = requires;
						this.itemAddToTable = itemAddToTableTemp;
						this.flagEdit = flagEditTemp;
					}
				})
				.finally(() => {
					this.formLoading = false;
				});
		},

		remove(item) {
			this.m_requestDto.userInfos.splice(
				this.m_requestDto.userInfos.indexOf(item),
				1,
			);
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
				this.toastSuccess(this.$t("message.delete_success"));
				this.getAttachmentFileRequestV3();

				// this.listUserInfos = response.data.filter((entry) => {
				// 	return !entry.isDelete && entry.isActive;
				// });
			} catch (error) {
				this.toastError(error);
				return;
			}
		},
		editRelateRequestData() {
			this.openRelateRequestData = true;
		},
		editViewAttachmentFile(item) {
			this.openViewAttachmentFile = true;
			this.idView = item.id;
		},
		editUserInfosRequestData() {
			this.openUserInfosRequestData = true;
		},
		editAttachmentFilePDF(item) {
			this.openAttachmentFilePDF = true;
			this.attachmentFilePDF = item;
		},
		editAttachmentFileRequestData() {
			this.openAttachmentFileRequestData = true;
		},
		editFileRequestData() {
			this.openFileRequestData = true;
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
			}
		},
		getAllRequestData() {
			globalService
				.getData_NoAsync(
					administratorAPI.API_GetAllRequestDataV2(this.user_info.id),
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
					this.requestAll = response.data.data.filter((entry) => {
						return !entry.isDelete;
					});
					this.listRequestData = Object.assign([], this.requestAll);
				});
		},
		getAttachmentFileRequest() {
			globalService
				.getData_NoAsync(
					administratorAPI.API_GetAllAttachmentFileByRequestDataId(
						this.m_requestDto.id,
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
					this.listAttachmentFlieByRequest.push(
						...response.data.data,
					);
				});
		},
		// getAttachmentFileRequestV2() {
		// 	globalService
		// 		.getData_NoAsync(
		// 			administratorAPI.API_GetAllAttachmentFileByRequestDataId(
		// 				this.m_requestDto.id,
		// 			),
		// 		)
		// 		.then((response) => {
		// 			if (
		// 				!response ||
		// 				response.status != 200 ||
		// 				!response.data ||
		// 				!response.data.state
		// 			) {
		// 				return;
		// 			}
		// 			this.listTemplateForm.push(
		// 				...response.data.data.filter((ele) => ele.templateForm),
		// 			);
		// 		});
		// },
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
					if (
						!response ||
						response.status != 200 ||
						!response.data ||
						!response.data.state
					) {
						return;
					}
					this.listTemplateForm.push(
						...response.data.data.filter((ele) => ele.templateForm),
					);
					this.listAttachmentFlieByRequests.push(
						...response.data.data.filter(
							(ele) => !ele.templateForm,
						),
					);
				})
				.finally(() => {
					this.componentLoading.attachment = false;
					this.componentLoading.document = false;
				});
		},
		// getAllTemplateForm() {
		// 	globalService
		// 		.getData_NoAsync(administratorAPI.API_GetAllTemplateForm())
		// 		.then((response) => {
		// 			if (
		// 				!response ||
		// 				response.status != 200 ||
		// 				!response.data ||
		// 				!response.data.state
		// 			) {
		// 				return;
		// 			}
		// 			this.requestAll = response.data.data.filter((entry) => {
		// 				return !entry.isDelete;
		// 			});
		// 			this.listTemplateForm = Object.assign([], this.requestAll);
		// 		});
		// },
		async saveFormData() {
			//if (!this.$refs.form.validate()) return;
			this.formData["objectSchema"] = JSON.stringify(this.objectSchema);
			this.formData["objectModel"] = JSON.stringify(this.objectModel);
			this.requestFormDataDto = this.formData;

			let response;
			this.requestFormDataDto.isActive = this.formData.isActive;

			response = await globalService.putData_Async(
				administratorAPI.API_UpdateFormData(this.requestFormDataDto.id),
				this.requestFormDataDto,
			);
			if (!response || !response.state) {
				this.toastError(this.$t("error.load"));
			}
			// this.toastSuccess(this.$t("message.update_success"));

			// reload lại form
			await this.FormData();
		},
		async save() {
			if (this.m_requestDto.status.id == 1) {
				if (!this.$refs.form.validate()) return;
				if (this.form.length > 0) {
					this.formData["objectSchema"] = JSON.stringify(this.form);
				}
				this.requestFormDataDto = this.formData;

				let response;
				this.requestFormDataDto.isActive = this.formData.isActive;

				response = await globalService.putData_Async(
					administratorAPI.API_UpdateFormData(
						this.requestFormDataDto.id,
					),
					this.requestFormDataDto,
				);
				this.requestFormDataDto = response;
				if (!response || !response.state) {
					this.toastError(this.$t("error.load"));
				}
				let request;
				this.m_requestDto.status = { id: 2 };
				request = await globalService.putData_Async(
					administratorAPI.API_UpdateRequestData(
						this.m_requestDto.id,
					),
					this.m_requestDto,
				);
				if (!request || !request.state) {
					this.toastError(this.$t("error.load"));
				}
				this.toastSuccess("Lưu thành công");
				this.$router.push({
					path: `/phieu-yeu-cau/list-request`,
				});
			} else {
				await this.UpLoadFile2();
				if (!this.$refs.form.validate()) return;
				if (this.form.length > 0) {
					this.formData["objectSchema"] = JSON.stringify(this.form);
				}
				this.requestFormDataDto = this.formData;

				let response;
				this.requestFormDataDto.isActive = this.formData.isActive;
				response = await globalService.putData_Async(
					administratorAPI.API_UpdateFormData(
						this.requestFormDataDto.id,
					),
					this.requestFormDataDto,
				);
				this.requestFormDataDto = response;
				if (!response || !response.state) {
					this.toastError(this.$t("error.load"));
				}
				let request;
				this.m_requestDto.status = { id: 2 };
				request = await globalService.putData_Async(
					administratorAPI.API_UpdateRequestData(
						this.m_requestDto.id,
					),
					this.m_requestDto,
				);
				if (!request || !request.state) {
					this.toastError(this.$t("error.load"));
				}

				this.toastSuccess(this.$t("message.update_success"));

				this.$router.push({
					path: `/phieu-yeu-cau/list-request`,
				});
			}
		},
		editAttachmentFile(item) {
			window.open(item.ofice365Path, "_blank");
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
		},
		updateItemInTable(table, item, idx, tableName) {
			this.flagEdit[tableName].editingItem = null;
			this.flagEdit[tableName].editingIndex = -1;
		},
		/**
		 * Hàm thực hiện sửa xóa trong table
		 * table: bảng cần sửa dữ liệu
		 * item: item cần xóa
		 */
		deleteItemInTable(table, item, idx) {
			table.splice(idx, 1);
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
		getColor(item) {
			if (!item.status) return "#9E9E9E";
			if (item.status.trim() == this.$t("status.processing")) {
				return "#FBBC3D";
			}

			if (item.status.includes(this.$t('status.approval'))) {
				return "#66BB6A";
			}
			if (item.status.includes(this.$t('status.exchange'))) {
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
			xhr.open('GET', urlDownload);
			xhr.onreadystatechange = function(){
				if (xhr.readyState === xhr.DONE) {
					try{
						if (xhr.status === 200) {
							// this.response is a Blob, because we set responseType above
							let data_url = URL.createObjectURL(xhr.response);
							// console.log('data_url: ', data_url);
							// window.open(data_url, "_blank");
							let downloadLink = document.createElement("a");
							downloadLink.href = data_url;
							downloadLink.download = fileName + "." + fileExtension;
							document.body.appendChild(downloadLink);
							downloadLink.click();
							document.body.removeChild(downloadLink);
						} else {
							this.toastError(this.$t('error.load_file'));
						}
					}catch(e){
						this.toastError(this.$t('error.load_file'));
					}
				}
			};
			xhr.responseType = 'blob';
			xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
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
			xhr.open('GET', urlDownload);
			xhr.onreadystatechange = function(){
				if (xhr.readyState === xhr.DONE) {
					try{
						if (xhr.status === 200) {
							// this.response is a Blob, because we set responseType above
							let data_url = URL.createObjectURL(xhr.response);
							// console.log('data_url: ', data_url);
							// window.open(data_url, "_blank");
							let downloadLink = document.createElement("a");
							downloadLink.href = data_url;
							downloadLink.download = fileName + "." + fileExtension;
							document.body.appendChild(downloadLink);
							downloadLink.click();
							document.body.removeChild(downloadLink);
						} else {
							this.toastError(this.$t('error.load_file'));
						}
					}catch(e){
						this.toastError(this.$t('error.load_file'));
					}
				}
			};
			xhr.responseType = 'blob';
			xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
			xhr.send();
		},

		getTableItem(id) {
			if (!this.m_objectModel[id]?.length) {
				this.m_objectModel[id] = [{}];
			}
			return Object.assign([], this.m_objectModel[id]).filter(
				(e) => !e.sumRow,
			);
		},
		viewRequestRelateData(item) {
			let url = "";
			if (item.status.id == 1) {
				url = "/phieu-yeu-cau/chi-tiet/" + item.id;
				window.open(url);
				// this.$router.push({
				// 	path: `/phieu-yeu-cau/chi-tiet/${item.id}`,
				// });
			} else {
				url = "/phieu-yeu-cau/chi-tiet/" + item.id;
				window.open(url);
				// this.$router.push({
				// 	path: `/phieu-yeu-cau/phe-duyet/${item.id}`,
				// });
			}
		},
		async getHisTrade() {
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
	getTotalPage() {
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
									if (
										params.node.rowPinned ||
										params.data.sumRow
									) {
										return params?.value;
									}
									if (!params?.value) {
										return "";
									}
									return numeral(`${params.value}`).format();
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
									console.log(params);
									return {
										component: "ComboboxCellEditorsVue",
										popup: true,
										popupPosition: "under",
									};
								};
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

								this.objectSchema.properties[
									index
								].readOnly = true;
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
					
					if (this.objectSchema.properties[index]?.is_required) {
						requires.push(this.objectSchema.properties[index]?.id);
						this.objectSchema.properties[index].title = `${
							this.objectSchema.properties[index].title
						} ${this.$t("label.star")}`;
					}
					if (
						this.objectSchema.properties[index]?.format ==
						constant.type.date
					) {
						this.objectSchema.properties[index]["x-props"][
							"prepend-icon"
						] = "mdi-heart";
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
					}

					this.objectSchema.properties[index]["x-options"] =
						this.xOptions;
				}
				this.objectSchema.required = requires;
				this.itemAddToTable = itemAddToTableTemp;
				this.flagEdit = flagEditTemp;
				


			}
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
										"DD/MM",
									);
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
		onGridReady(params, tableId) {
			this.gridApi[tableId] = params.api;
			let sumRow = this.m_objectModel[tableId].find((e) => e.sumRow);
			if (!sumRow) {
				return;
			}
			this.gridApi[tableId].setPinnedBottomRowData([sumRow]);
		},
		async getPermissionUserInRequestData(){
			let response = await globalService.postData_Async(
				administratorAPI.API_CheckPermissionUserInRequestData(this.requestDataV2.id),
			);
			if(response && response.data) this.permissionUserOfRequestData = response.data;	
		},
		/**
		 * Hamf hàm kiểm tra quyền của user và chức năng được phép để ẩn hiện button (nếu là người tạo phiếu -> có full quyền) (TH sửa và xóa thì phiếu phải đang ở trạng thái 'Đang Soạn' hoặc 'Từ Chối')
		 * @action: hàng động tương ứng(view, edit, delete, download)
		 */
		checkShowButton(action){
			if(action == this.VIEW){
				return this.user_info?.id == this.requestDataV2?.created?.id || this.permissionUserOfRequestData[this.VIEW];
			}else if(action == this.EDIT){
				let arrayEdit = [1, 6]; 	/* 1: đang soạn. 6: từ chối */
				return arrayEdit.some(ele => this.requestDataV2?.status?.id == ele) && (this.user_info?.id == this.requestDataV2?.created?.id || this.permissionUserOfRequestData[this.EDIT])
			}else if(action == this.DELETE){
				let arrayEdit = [1, 6]; 	/* 1: đang soạn. 6: từ chối */
				return arrayEdit.some(ele => this.requestDataV2?.status?.id == ele) && (this.user_info?.id == this.requestDataV2?.created?.id || this.permissionUserOfRequestData[this.DELETE])
			}else if(action == this.DOWNLOAD){
				return this.user_info?.id == this.requestDataV2?.created?.id || this.permissionUserOfRequestData[this.DOWNLOAD];
			}
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
</style>
