<template>
	<v-card elevation="0" v-if="m_requestDto">
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
		<v-row class="p-0">
			<v-col cols="12" md="9">
				<vue-perfect-scrollbar class="h-100">
					<v-list>
						<v-list-item>
							<v-row class="mt-4 my-4">
								<v-col cols="2">
									<span
										>{{
											$t("label.mail_template_subject")
										}}
										:</span
									>
								</v-col>
								<v-col cols="10" md="10">
									<span> {{ m_requestDto.title }} </span>
								</v-col>
								<v-col cols="2">
									<span>
										{{ $t("label.description") }} :
									</span>
								</v-col>
								<v-col cols="10" md="10">
									<span
										v-html="sanitizeText(m_requestDto.description)"
									></span>
								</v-col>
							</v-row>
						</v-list-item>

						<v-card elevation="0" class="thongtin my-4 p-0">
							<v-list-group no-action sub-group :value="true">
								<template v-slot:activator>
									<v-list-item-title
										class="text-black font-weight-bold"
										>{{
											$t("label.information_form")
										}}</v-list-item-title
									>
									<!-- <v-btn
										text
										tile
										color="blue"
										@click="editUserInfosRequestData"
										class="float-right"
									>
										<v-icon color="blue"
											>mdi-content-save-all</v-icon
										>
									</v-btn> -->
								</template>
								<v-list-item class="bieumau p-0">
									<vue-perfect-scrollbar
										class="h-auto w-full"
									>
										<v-row class="mt-4 w-full">
											<v-form
												ref="form"
												v-model="valid"
												class="w-full"
											>
												<v-card elevation="0">
													<v-jsf
														v-model="objectModel"
														:schema="objectSchema"
														:options="options"
													/>
												</v-card>
											</v-form>
										</v-row>

										<v-row class="w-full">
											<template
												v-for="(
													table, idxTable
												) in tableSchema"
											>
												<ag-grid-vue
													class="
														ag-theme-alpine
														h-[20rem]
														w-full
													"
													:key="`grid_${idxTable}`"
													:columnDefs="
														columnDefs[idxTable]
													"
													:defaultColDef="
														defaultColDef
													"
													:rowData="
														objectModel[table.id]
													"
													:pinnedTopRowData="
														pinnedTopRowData
													"
													:pinnedBottomRowData="
														pinnedBottomRowData
													"
													:pagination="true"
													:suppressExcelExport="true"
												></ag-grid-vue>
											</template>
										</v-row>
									</vue-perfect-scrollbar>
								</v-list-item>
							</v-list-group>
							<v-progress-linear
								v-if="componentLoading.form"
								indeterminate
								color="blue darken-2"
							>
							</v-progress-linear>
						</v-card>

						<v-card elevation="0" class="thongtin my-4">
							<v-list-group no-action sub-group :value="true">
								<template v-slot:activator>
									<v-list-item-title
										class="text-black font-weight-bold"
									>
										{{ $t("label.main_document") }}
										<v-spacer></v-spacer>
										<v-tooltip bottom>
											<template
												v-slot:activator="{ on, attrs }"
											>
												<span
													v-bind="attrs"
													v-on="on"
													@click="
														clickToOpen(
															m_requestDto.dataRoomPath,
														)
													"
													class="
														text-decoration-underline
													"
												>
													{{ decodeUrlDR }}
												</span>
											</template>
											<span>{{
												decodeUrlDRDataRoomPath
											}}</span>
										</v-tooltip></v-list-item-title
									>
									<!-- <v-btn
										text
										tile
										color="blue"
										@click="editFileRequestData"
										class="float-right"
									>
										<v-icon color="blue"
											>mdi-plus-circle</v-icon
										>
									</v-btn> -->
								</template>
								<v-list-item class="p-0">
									<v-progress-linear
										indeterminate
										color="blue darken-2"
										v-if="componentLoading.document"
									></v-progress-linear>
									<vue-perfect-scrollbar
										class="h-auto w-full"
									>
										<v-data-table
											v-model="selected"
											:headers="headers"
											:items="listTemplateForm"
											:single-select="singleSelect"
											item-key="id"
											show-select
											:search="search"
											:loading-text="
												$t('message.no_data')
											"
											:no-data-text="
												$t('message.no_data')
											"
											:no-results-text="
												$t('message.no_results')
											"
											class="table"
											:hide-default-footer="
												$t('message.no_data')
											"
										>
											<template
												v-for="header in headers.filter(
													(header) =>
														header.hasOwnProperty(
															'formatter',
														),
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
													class="cursor-pointer"
													v-if="
														item.templateForm
															.templateFormName
															.length <= 30
													"
													@click="
														editViewAttachmentFile(
															item,
														)
													"
												>
													<span>{{
														item.templateForm
															.templateFormName
													}}</span>
												</span>
												<v-tooltip
													bottom
													v-if="
														item.templateForm
															.templateFormName
															.length > 30
													"
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
															class="
																cursor-pointer
															"
															@click="
																editViewAttachmentFile(
																	item,
																)
															"
														>
															<span
																>{{
																	item.templateForm.templateFormName.slice(
																		0,
																		30,
																	)
																}}
																...</span
															>
														</span>
													</template>
													<span>{{
														item.templateForm
															.templateFormName
													}}</span>
												</v-tooltip>
											</template>
											<template
												v-slot:[`item.fileName`]="{
													item,
												}"
											>
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
																item.fileName
																	.length <=
																30
															"
														>
															<span>{{
																item.fileName
															}}</span>
														</span>
														<v-tooltip
															bottom
															v-if="
																item.fileName
																	.length > 30
															"
														>
															<template
																v-slot:activator="{
																	on,
																	attrs,
																}"
															>
																<span
																	v-bind="
																		attrs
																	"
																	v-on="on"
																>
																	<span
																		>{{
																			item.fileName.slice(
																				0,
																				30,
																			)
																		}}
																		...</span
																	>
																</span>
															</template>
															<span>{{
																item.fileName
															}}</span>
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
																	v-bind="
																		attrs
																	"
																	v-on="on"
																>
																	<v-icon
																		>mdi-dots-vertical</v-icon
																	>
																</v-btn>
															</template>
															<v-list
																class="
																	w-[120px]
																"
															>
																<v-list-item
																	@click="
																		editViewAttachmentFile(
																			item,
																		)
																	"
																>
																	<v-icon
																		color=" darken-2"
																		class="
																			pr-3
																		"
																	>
																		mdi-eye-circle-outline
																	</v-icon>
																	<v-list-item-title>
																		{{
																			$t(
																				"button.view",
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

																<!-- <v-list-item
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
															</v-list-item> -->
															</v-list>
														</v-menu>
													</div>
												</td>
											</template>
										</v-data-table>
									</vue-perfect-scrollbar>
								</v-list-item>
							</v-list-group>
						</v-card>
						<v-card elevation="0" class="thongtin my-4">
							<v-list-group no-action sub-group :value="true">
								<template v-slot:activator>
									<v-list-item-title
										class="text-black font-weight-bold"
										>{{ $t("label.attachments") }}
									</v-list-item-title>
									<!-- <v-btn
										text
										tile
										color="blue"
										@click="editAttachmentFileRequestData"
										class="float-right"
									>
										<v-icon color="blue"
											>mdi-plus-circle</v-icon
										>
									</v-btn> -->
								</template>
								<v-list-item>
									<v-progress-linear
										indeterminate
										color="blue darken-2"
										v-if="componentLoading.attachment"
									></v-progress-linear>
									<vue-perfect-scrollbar
										class="h-auto w-full"
									>
										<v-data-table
											v-model="selected"
											:headers="headerss"
											:items="
												listAttachmentFlieByRequests
											"
											:single-select="singleSelect"
											item-key="id"
											show-select
											:search="search"
											class="table"
											:hide-default-footer="
												$t('message.no_data')
											"
											:loading-text="
												$t('message.no_data')
											"
											:no-data-text="
												$t('message.no_data')
											"
											:no-results-text="
												$t('message.no_results')
											"
										>
											<template
												v-for="header in headerss.filter(
													(header) =>
														header.hasOwnProperty(
															'formatter',
														),
												)"
												v-slot:[`item.${header.value}`]="{
													headerss,
													value,
												}"
											>
												{{ header.formatter(value) }}
											</template>
											<template
												v-slot:[`item.fileName`]="{
													item,
												}"
											>
												<td>
													<div
														class="
															flex
															items-center
															justify-between
														"
													>
														<span
															class="
																cursor-pointer
															"
															v-if="
																item.fileName
																	.length <=
																30
															"
															@click="
																editViewAttachmentFile(
																	item,
																)
															"
														>
															<span>{{
																item.fileName
															}}</span>
														</span>
														<v-tooltip
															bottom
															v-if="
																item.fileName
																	.length > 30
															"
														>
															<template
																v-slot:activator="{
																	on,
																	attrs,
																}"
															>
																<span
																	v-bind="
																		attrs
																	"
																	v-on="on"
																	class="
																		cursor-pointer
																	"
																	@click="
																		editViewAttachmentFile(
																			item,
																		)
																	"
																>
																	<span
																		>{{
																			item.fileName.slice(
																				0,
																				30,
																			)
																		}}
																		...</span
																	>
																</span>
															</template>
															<span>{{
																item.fileName
															}}</span>
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
																	v-bind="
																		attrs
																	"
																	v-on="on"
																>
																	<v-icon
																		>mdi-dots-vertical</v-icon
																	>
																</v-btn>
															</template>
															<v-list
																class="
																	w-[120px]
																"
															>
																<v-list-item
																	@click="
																		editViewAttachmentFile(
																			item,
																		)
																	"
																>
																	<v-icon
																		color=" darken-2"
																		class="
																			mr-3
																		"
																	>
																		mdi-eye-circle-outline
																	</v-icon>
																	<v-list-item-title>
																		{{
																			$t(
																				"button.view",
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
															</v-list>
														</v-menu>
													</div>
												</td>
											</template>
										</v-data-table>
									</vue-perfect-scrollbar>
								</v-list-item>
							</v-list-group>
						</v-card>
						<v-card elevation="0" class="thongtin my-4">
							<v-list-group no-action sub-group :value="true">
								<template v-slot:activator>
									<v-list-item-title
										class="text-black font-weight-bold"
										>{{ $t("label.exchange") }}
									</v-list-item-title>
								</template>
								<v-list-item>
									<vue-perfect-scrollbar
										class="h-auto w-full"
									>
										<v-col cols="12" class="bg-white">
											<v-textarea
												outlined
												v-model="content"
												disabled
											></v-textarea>
											<div class="flex justify-end">
												<!-- <v-btn
													@click="sendInformationInExchange()"
													color="red"
													dark
													elevation="0"
													rounded
												>
													{{ $t("button.send") }}
												</v-btn> -->
											</div>
										</v-col>
									</vue-perfect-scrollbar>
								</v-list-item>
							</v-list-group>
						</v-card>
					</v-list>
				</vue-perfect-scrollbar>
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
													background: getColor(steep),
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
																steep.userInfos
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
											>
												{{$t('label.history')}} :{{
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
																item.processer
																	.fullName
															}}</span
														>
														<p
															:class="'text-black text-base'"
															:style="{
																margin: 0,
															}"
														>
															{{ item.status }}
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
															).format(dateFormat)
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
					<!-- <v-tab-item key="processing_process">
							<v-progress-linear
								indeterminate
								color="blue darken-2"
								v-if="componentLoading.process"
							></v-progress-linear>
							<vue-perfect-scrollbar class="h-[24rem]">
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

											{{ $t("label.step") }}
											{{ index + 1 }}
										</v-btn>
										<div
											class="flex justify-start gap-2 items-center"
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
											class="grey lighten-3 rounded-md my-2 min-h-[3rem]"
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
													:input-value="active"
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
							</vue-perfect-scrollbar>
						</v-tab-item> -->
				</v-tabs-items>

				<div>
					<v-divider></v-divider>
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
						v-for="(relate, index) of m_requestDto.requestDataList"
						:key="index"
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
									<v-list-item>
										<v-icon color="darken-2 " class="pr-3">
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
								<v-avatar color="red darken-2 mr-2">
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
					<!-- <div
							v-for="(user, indexUser) of m_requestDto.userInfos"
							:key="indexUser"
						>
							{{ user.fullName }}
						</div> -->
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
import FileRequestData from "./FileRequestData.vue";
import UserInfosRequestData from "./UserInfosRequestData.vue";
import RelateRequestData from "./RelateRequestData.vue";
import moment from "moment";
import RequestFormDataDto from "@/models/form-data.dto";

import AttachmentFileRequestData from "./AttachmentFileRequestData.vue";
import ViewAttachmentFile from "./ViewAttachmentFile.vue";
import store from "@/store";
import { AgGridVue } from "ag-grid-vue";
import constant from "@/common/constant";
import FileRenderer from "@/components/form-control/fileRenderer";

export default {
	name: "VSMFEViewDeclaration",
	props: { requestDataV2: {}, isSaved: {} },
	components: {
		VJsf,
		FileRequestData,
		UserInfosRequestData,
		RelateRequestData,
		AttachmentFileRequestData,
		ViewAttachmentFile,
		AgGridVue,
		fileRenderer: FileRenderer,
	},
	data() {
		return {
			ALL_STATUS: [],
			tab: 0,

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

			attachmentFilePDF: {},
			user_info: this.getUserInfo(),
			listAttachmentFlieByRequests: [],
			moment: moment,
			listUserReqdataProcessHis: {},
			requestdataProcessHis: null,
			idView: null,
			listTemplateForm: [],

			m_isSaved: {},
			m_requestDto: null,
			listAttachmentFlieByRequest: [],
			statusRequestData: "",
			isStatusRequestData: false,
			STATUS_TRALAI_CODE: this.$t("status_code.Reject"),
			STATUS_DANGSOAN_CODE: this.$t("status_code.dang_soan"),
			listUserInfos: [],
			form: [],
			procesHisTemps: [],

			options: {
				fieldProps: {
					outlined: "outlined",
					dense: "dense",
					readonly: "readonly",
				},
			},
			formData: null,
			file: [],
			"x-options": {
				messages: {
					pattern: "Sai định dạng",
					required: "Đây là trường bắt buộc.",
					maxLength: "Lớn hơn maxLength",
					minLength: "Nhỏ hơn minLength",
				},
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
			dateFormat: "DD/MM/yyyy h:mm",
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
			stepDatas: [],
			isCvd: false,
			requestFormDataDto: RequestFormDataDto,
			content: "",
			isQR: false,
			isWater: false,
			columnDefs: [],
			gridApi: null,
			columnApi: null,
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
	},
	async created() {
		//để chạy thêm dữ liệu bảng ko cần .
		// await this.saveFormData();
	},
	async mounted() {
		this.m_requestDto = this.requestDataV2;
		if (this.m_requestDto?.requestGroupName.includes(this.$t("enum.CVD"))) {
			this.isCvd = true;
		}
		this.m_isSaved = this.isSaved;
		await this.FormData();
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
		async getReqdataProcessHis() {
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
					// if (this.requestdataProcessHis.length > 1) {
					// 	this.requestdataProcessHis.shift();
					// }
					this.reqdataProcessHisDTO();
				})
				.finally(() => {
					this.componentLoading.history = false;
				});
		},
		async getListStepData() {
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
					this.stepDatas = response.data.data.sort((a, b) => {
						return a.stepOrder - b.stepOrder;
					});
					this.getReqdataProcessHis();
				})
				.finally(() => {
					this.componentLoading.process = false;
				});
		},
		reqdataProcessHisDTO() {
			this.procesHisTemps = [];
			let isDone = false;
			let startIndex = 0;
			for (let i=0; i<this.requestdataProcessHis.length; i++) {
				let processHis =  this.requestdataProcessHis[i];
				let procesHisTemp = Object.assign({}, processHis);
				if (procesHisTemp.status.includes(this.$t("status.approved")) && !this.requestdataProcessHis[i + 1]?.status?.includes(this.$t("status.cancelApproval"))) {
					isDone = true;
				}
				if (procesHisTemp.status.includes(this.$t("status.approved")) && this.requestdataProcessHis[i + 1]?.status?.includes(this.$t("status.cancelApproval"))) {
					isDone = false;
				}
				
				if (processHis.isChild) {
					if (procesHisTemp.status == this.$t('status.need_process')) {
						procesHisTemp.status = this.$t("status.processed");
					}
					this.procesHisTemps[
						this.procesHisTemps.length - 1
					].processHisChild.push(procesHisTemp);
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
						status: this.$t('status.processing'),
					};
					this.procesHisTemps.push(newObj);
				}
			});
			this.procesHisTemps.forEach((entry, index) => {
				if (
					index > 0 &&
					index < this.procesHisTemps.length - 1 &&
					entry.status == this.$t('status.need_process')
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
				proces >= 0;
				proces--
			) {
				if (this.procesHisTemps[proces - 1]) {
					this.procesHisTemps[proces].processHisChild = Object.assign(
						[],
						this.procesHisTemps[proces - 1]?.processHisChild,
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
		initialize() {
			this.getAllRequestData();
			this.getAttachmentFileRequest();
			// this.getAttachmentFileRequestV2();
			// this.getAttachmentFileRequestV3();
			this.getAllStatus();
			this.getListStepData();
		},
		async FormData() {
			this.componentLoading.form = true;
			globalService
				.getData_NoAsync(
					administratorAPI.API_GetFormDataById(this.m_requestDto.id),
				)
				.then((response) => {
					this.componentLoading.form = false;
					if (
						!response ||
						response.status != 200 ||
						!response.data ||
						!response.data.state
					) {
						return;
					}
					let requests = response.data.data;
					if (requests.length > 0) {
						// code mới \\
						this.formData = requests[0];
						this.objectSchema = JSON.parse(
							this.formData.objectSchema,
						);
						this.objectModel = JSON.parse(
							this.formData.objectModel,
						);
						// lấy ra nhưng field là bảng có trong objectSchema đẩy vào biến tableSchema
						this.tableSchema = [];

						let itemAddToTableTemp = {};
						let flagEditTemp = {};
						this.columnDefs = [];
						for (let index in this.objectSchema.properties) {
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
								this.objectModel[table.id] = this.objectModel[
									table.id
								]
									? this.objectModel[table.id]
									: [];
								itemAddToTableTemp[table.id] = {};

								flagEditTemp[table.id] = {
									editingItem: null,
								};
								let dataGridColDefs = [];
								table.Headers.forEach((ele) => {
									itemAddToTableTemp[table.id][ele.value] =
										"";
									let colDef = {
										field: ele.value,
										headerName: ele.text,
										cellEditorParams: {
											cellHeight: 20,
											useFormatter: true,
										},
									};
									if (ele?.type == constant.type.file) {
										colDef.cellRenderer = "fileRenderer";
										colDef.valueGetter = function (params) {
											return params.data[
												params.column.colId
											];
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
									dataGridColDefs.push(colDef);
								});

								// table.Headers.push({
								// 	text: "Actions",
								// 	value: "actions",
								// 	sortable: false,
								// });
								this.tableSchema.push(table);
								this.columnDefs.push(dataGridColDefs);
								this.objectSchema.properties[index] = {
									Headers:
										this.objectSchema.properties[index]
											?.Headers,
									title: table.title,
								};
							}
						}
						this.itemAddToTable = itemAddToTableTemp;
						this.flagEdit = flagEditTemp;
					}
				})
				.finally(() => {
					this.componentLoading.form = false;
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
				await this.getAttachmentFileRequestV2();

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
			}
		},
		async getAllRequestData() {
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
		async getAttachmentFileRequest() {
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
		async getAttachmentFileRequestV2() {
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
					this.listTemplateForm.push(
						...response.data.data.filter((ele) => ele.templateForm),
					);
					this.listAttachmentFlieByRequests.push(
						...response.data.data.filter(
							(ele) => !ele.templateForm,
						),
					);
				});
		},
		async getAttachmentFileRequestV3() {
			globalService
				.getData_NoAsync(
					administratorAPI.API_GetAllAttachmentFileByRequestDataId(
						this.m_requestDto.id,
					),
				)
				.then((response) => {
					this.listAttachmentFlieByRequests = [];
					this.listAttachmentFlieByRequests.push(
						...response.data.data.filter(
							(ele) => !ele.templateForm,
						),
					);
				});
		},
		async getAllTemplateForm() {
			globalService
				.getData_NoAsync(administratorAPI.API_GetAllTemplateForm())
				.then((response) => {
					if (
						!response ||
						response.status != 200 ||
						!response.data ||
						!response.data.state
					) {
						return;
					}
					this.requestAll = response.data.filter((entry) => {
						return !entry.isDelete;
					});
					this.listTemplateForm = Object.assign([], this.requestAll);
				});
		},
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
			this.FormData();
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
				this.m_requestDto.modifiedDate = new Date();
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

				this.m_requestDto.modifiedDate = new Date();
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
		// async getReqdataProcessHis() {
		// 	let response;
		// 	try {
		// 		response = await globalService.getData_Async(
		// 			administratorAPI.API_GetReqdataProcessHisByID(
		// 				this.m_requestDto.id,
		// 			),
		// 		);
		// 		if (!response || !response.state) {
		// 			return;
		// 		}
		// 		this.requestdataProcessHis = response.data;
		// 	} catch (error) {
		// 		this.toastError(error);
		// 		return;
		// 	}
		// },
		async editrequestDataList(item) {
			this.$router.push({
				path: `/phieu-yeu-cau/${item}/chi-tiet`,
			});
			this.FormData();
			this.initialize();
		},

		/**
		 * Hàm thực hiện thêm item vào trong table
		 * table: bảng cần thêm dữ liệu
		 * item: dữ liệu cần xem
		 * */
		addItemToTable(table, item) {
			if (!table) table = [];
			table.push(this.cloneObject({}, item));
			item = this.cleanDataObject(item);
		},
		updateItemToTable(table, item, indexEdit, tableName) {
			if (indexEdit < 0) return;
			if (!table) this.toastError('123');
			let itemUpdate = this.cloneObject({}, item);
			table.splice(indexEdit, 1, itemUpdate);
			item = this.cleanDataObject(item);

			this.flagEdit[tableName].editingItem = null;
			this.flagEdit[tableName].editingIndex = -1;
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
			if (item.status.trim() == this.$t('status.processing')) {
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
		async getAllStatus() {
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
				return;
			}
		},
	},
};
</script>

<style lang="scss" scoped>
.bieumau {
	display: block;
	padding: 0 !important;
}

.table {
	width: 100% !important;
}

.v-list-item {
	padding: 0 !important;
}

.maxhight {
	max-height: 150px;
}

.v-list-item-title:hover {
	background: yellow !important;
}

.v-card__text {
	padding: 0 !important;
	margin: 0 !important;
}

.v-sheet {
	padding: 10px !important;
}

.userInfo {
	border-radius: 0px;
}

.test {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
}

.thongtin {
	padding: 0 !important;
	border: 1px solid rgb(214 211 209);
	// background-color: rgb(231 229 228);
	background-color: #eeeeee;
}
</style>
