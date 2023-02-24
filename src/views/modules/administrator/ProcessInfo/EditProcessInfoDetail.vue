<template>
	<v-card elevation="0">
		<v-dialog
			max-width="60vw"
			v-model="openUserInfosRequestData"
			persistent
		>
			<UserInfosRequestDataV2Vue
				@save="handleUser"
				@close="onClose"
			></UserInfosRequestDataV2Vue>
		</v-dialog>
		<v-row class="mx-2">
			<v-col cols="12" md="10" class="d-flex">
				<v-col cols="12" md="6">
					<div class="mx-10">
						<v-row>
							<v-list-item-title>
								<span :class="is_show_detail()">
									<strong>{{
										$t("label.process_name")
									}}</strong
									>:
									<em>{{
										this.processInfoDto.processName
									}}</em>
								</span>
							</v-list-item-title>
							<span
								v-if="
									this.processInfoDto.processName &&
									this.processInfoDto.processName.length >
										65 &&
									!showName
								"
								@click="toggle_detail()"
								class="float-right"
							>
								<em
									><a href="#">{{ $t("button.show") }}</a></em
								>
							</span>
							<span
								v-if="showName"
								@click="toggle_detail()"
								class="float-right"
							>
								<em
									><a href="#">{{ $t("button.hide") }}</a></em
								>
							</span>
						</v-row>
						<v-row>
							<v-list-item-title>
								<strong>{{ $t("label.description") }}</strong
								>:
								<em>{{ this.processInfoDto.description }}</em>
							</v-list-item-title>
							<span
								v-if="
									this.processInfoDto.description &&
									this.processInfoDto.description.length >
										65 &&
									!showDescription
								"
								@click="toggle_description()"
								class="float-right"
							>
								<em
									><a href="#">{{ $t("button.show") }}</a></em
								>
							</span>
							<span
								v-if="showDescription"
								@click="toggle_description()"
								class="float-right"
							>
								<em
									><a href="#">{{ $t("button.hide") }}</a></em
								>
							</span>
						</v-row>
					</div>
				</v-col>
				<v-col>
					<div class="mx-10">
						<v-row>
							<v-list-item-title>
								<strong>{{ $t("label.created_name") }}</strong
								>:
								<v-chip v-if="processInfoDto.createdName">
									<v-avatar color="indigo mr-2" size="36">
										<span class="white--text">
											{{
												getAvatarText(
													user_current.createdName,
												)
											}}
										</span>
									</v-avatar>
									{{ this.processInfoDto.createdName }}
								</v-chip>
								<v-chip v-if="!processInfoDto.createdName">
									<v-avatar color="indigo mr-2" size="36">
										<span class="white--text">
											{{
												getAvatarText(
													user_current.createdName,
												)
											}}
										</span>
									</v-avatar>
									{{ this.user_current.createdName }}
								</v-chip>
							</v-list-item-title>
						</v-row>
						<v-row>
							<v-list-item-title>
								<strong>{{ $t("label.created_date") }}</strong
								>:
								<em>{{
									this.processInfoDto.createdDate
										| dateToString
								}}</em>
							</v-list-item-title>
						</v-row>
					</div>
				</v-col>
				<v-col>
					<div class="mx-10">
						<v-row>
							<v-list-item-title>
								<strong>{{ $t("label.modified_name") }}</strong
								>:
								<v-chip v-if="processInfoDto.modifiedName">
									<v-avatar color="indigo mr-2" size="36">
										<span class="white--text">
											{{
												getAvatarText(
													processInfoDto.modifiedName,
												)
											}}
										</span>
									</v-avatar>
									{{
										this.processInfoDto.modifiedName
									}}</v-chip
								>
							</v-list-item-title>
						</v-row>
						<v-row>
							<v-list-item-title>
								<strong>{{ $t("label.modified_date") }}</strong
								>:
								<em>{{
									this.processInfoDto.modifiedDate
										| dateToString
								}}</em>
							</v-list-item-title>
						</v-row>
					</div>
				</v-col>
			</v-col>
		</v-row>
		<v-divider class="mt-5"></v-divider>
		<v-btn text @click="showStep = !showStep">
			<v-icon> mdi-plus </v-icon>
			{{ $t("button.create") }}
		</v-btn>
		<v-row class="mt-2">
			<v-col cols="12" md="2" v-if="showStep">
				<VuePerfectScrollbar class="scroll-area">
					<Container
						class="w-full pr-4"
						group-name="column"
						:get-child-payload="
							(itemIndex) => getChildPayload_Selector(itemIndex)
						"
					>
						<Draggable
							class="mb-3 rounded"
							v-for="(step, index) in steps"
							:key="'step_' + index"
						>
							<!-- <div class="draggable-item">
								<v-row>
									<v-col>
										{{ step.stepName }}
									</v-col>
								</v-row>
							</div> -->
							<v-expansion-panels hover focusable>
								<v-expansion-panel class="draggable-item">
									<v-expansion-panel-header
										class="text-xl bordered px-0"
									>
										<v-row class="m-0 p-0">
											<v-col cols="12" md="2">
												<v-app-bar-nav-icon></v-app-bar-nav-icon>
											</v-col>
											<v-col cols="12" md="10">
												<strong>{{
													step.stepName
												}}</strong>
											</v-col>
										</v-row>
									</v-expansion-panel-header>
									<v-expansion-panel-content
										class="grey lighten-3"
									>
										<p>
											<strong>
												{{
													$t(
														"label.is_authorized_approval",
													)
												}}</strong
											>:
											<em>
												{{
													step.isAuthorizedApproval
														? $t("button.yes")
														: $t("button.no")
												}}
											</em>
										</p>
										<p>
											<strong>{{
												$t("label.is_examine")
											}}</strong
											>:
											<em>{{
												step.isExamine
													? $t("button.yes")
													: $t("button.no")
											}}</em>
										</p>
										<p>
											<strong>{{
												$t("label.is_request_modify")
											}}</strong
											>:
											<em>{{
												step.isRequestModify
													? $t("button.yes")
													: $t("button.no")
											}}</em>
										</p>
										<p>
											<strong>{{
												$t(
													"label.is_required_signature",
												)
											}}</strong
											>:
											<em>
												{{
													step.isRequiredSignature
														? $t("button.yes")
														: $t("button.no")
												}}
											</em>
										</p>
										<p>
											<strong>{{
												$t("label.is_process_recover")
											}}</strong
											>:
											<em>
												{{
													step.isProcessRecover
														? $t("button.yes")
														: $t("button.no")
												}}
											</em>
										</p>
										<p>
											<strong>
												{{
													$t("label.processing_term")
												}}
											</strong>
											:
											<em v-if="step.processingTerm">
												{{ step.processingTerm }}
												{{ $t("label.hours") }}
											</em>
										</p>
										<p>
											<strong>
												{{ $t("label.organization") }}
											</strong>
											:
											<em
												v-if="
													step.organization &&
													step.organization
														.organizationName
												"
											>
												{{
													step.organization
														.organizationName
												}}
											</em>
										</p>
										<p>
											<strong>
												{{ $t("label.rank") }}
											</strong>
											:
											<em
												v-if="
													step.rank &&
													step.rank.rankName
												"
											>
												{{ step.rank.rankName }}
											</em>
										</p>
									</v-expansion-panel-content>
								</v-expansion-panel>
							</v-expansion-panels>
						</Draggable>
					</Container>
				</VuePerfectScrollbar>
			</v-col>
			<v-divider vertical></v-divider>
			<v-col cols="12" :md="w_col">
				<v-card-text>
					<VuePerfectScrollbar class="scroll-area">
						<v-timeline align-top dense clipped>
							<Container
								:class="returnHover()"
								:get-child-payload="
									(itemIndex) => getChildPayload(itemIndex)
								"
								:should-accept-drop="
									(src, payload) => getdAcceptDrop(src)
								"
								:should-animate-drop="
									(src, payload) => getShouldAnimateDrop()
								"
								@drop="onDrop($event)"
							>
								<v-timeline-item
									v-for="(items, index) in groups"
									:key="index"
									small
									fill-dot
									left
									color="green darken-5"
								>
									<template v-slot:icon>
										<div class="gr_button">
											<v-btn
												class="red"
												dark
												small
												icon
												@click="removeRow(index)"
											>
												<v-icon>
													mdi-trash-can-outline
												</v-icon>
											</v-btn>
											<v-btn
												class="blue mt-1"
												dark
												small
												icon
												@click="addColumnIndex(index)"
											>
												<v-icon> mdi-plus </v-icon>
											</v-btn>
										</div>
									</template>
									<Container
										class="white"
										:data-index="index"
										group-name="column"
										:get-child-payload="
											(itemIndex) =>
												getChildPayload(itemIndex)
										"
										:should-accept-drop="
											(src, payload) =>
												getShouldAcceptDrop(src)
										"
										:should-animate-drop="
											(src, payload) =>
												getShouldAnimateDrop()
										"
										@drop="onDropStep(index, $event, false)"
									>
										<Draggable>
											<v-card
												v-bind:class="{
													isFocus:
														index ==
														groups.length - 1,
													['rounded bordered ' +
													getClass(index)]: true,
												}"
												:elevation="getElevation(index)"
												@click="
													clickToEdit(items, index)
												"
												:id="`step` + index"
											>
												<v-card-text
													class="text--primary"
													@click="clickTarget($event)"
												>
													<v-form>
														<div
															class="text-h6 mb-2"
														>
															{{
																$t("label.step")
															}}
															{{ index + 1 }}.
															<span
																v-if="
																	!!items &&
																	!!items.stepInProcessName
																"
																class="h3"
															>
																{{
																	items.stepInProcessName
																}}
															</span>
														</div>
														<template>
															<v-row
																class="
																	subtitle-1
																	mx-0
																"
																dense
															>
																<v-col
																	cols="2"
																	md="2"
																>
																	<em>
																		{{
																			$t(
																				"label.processingTerm",
																			)
																		}}:
																	</em>
																</v-col>
																<v-col>
																	<v-text-field
																		hide-details
																		dense
																		outlined
																		v-model="
																			items.processingTerm
																		"
																		:suffix="
																			$t(
																				'label.hours',
																			)
																		"
																		minLength="0"
																	>
																	</v-text-field>
																</v-col>
															</v-row>
															<v-row
																class="
																	subtitle-1
																	mx-0
																"
																dense
															>
																<v-col
																	cols="2"
																	md="2"
																>
																	<em>
																		{{
																			$t(
																				"label.organization",
																			)
																		}}
																	</em>
																	:
																</v-col>
																<v-col
																	cols="1"
																	md="1"
																>
																	<v-icon
																		color="blue"
																		@click="
																			changeFlagHiden(
																				showOrganize,
																				index,
																			)
																		"
																		class="
																			text--blue
																		"
																	>
																		mdi-domain-plus
																	</v-icon>
																</v-col>
																<v-col
																	v-if="
																		!showOrganize[
																			index
																		] &&
																		!!items &&
																		!!items.organization
																	"
																>
																	<v-chip>
																		<v-avatar
																			color="indigo mr-2"
																			size="36"
																		>
																			<span
																				class="
																					white--text
																				"
																			>
																				{{
																					getAvatarText(
																						items
																							.organization
																							.organizationName,
																					)
																				}}
																			</span>
																		</v-avatar>
																		{{
																			items
																				.organization
																				.organizationName
																		}}
																	</v-chip>
																</v-col>
																<v-col
																	v-if="
																		showOrganize[
																			index
																		]
																	"
																>
																	<v-autocomplete
																		v-model="
																			items.organization
																		"
																		:items="
																			listOrganize
																		"
																		item-text="organizationName"
																		:item-value="
																			(
																				item,
																			) =>
																				item
																		"
																		:label="
																			$t(
																				`label.organization`,
																			)
																		"
																		dense
																		clearable
																		outlined
																		@click:clear="
																			removeOrganization(
																				index,
																			)
																		"
																	>
																		<template
																			v-slot:label
																		>
																			<span
																				class="
																					text--primary
																				"
																			>
																				{{
																					$t(
																						`label.organization`,
																					)
																				}}
																			</span>
																		</template>
																		<template
																			v-slot:item="{
																				item,
																			}"
																		>
																			<v-list-item
																				@click="
																					selectOrganization(
																						item,
																						index,
																					)
																				"
																				class="
																					m-1
																				"
																			>
																				<v-avatar
																					color="indigo mr-2"
																					size="36"
																				>
																					<span
																						class="
																							white--text
																						"
																					>
																						{{
																							getAvatarText(
																								item.organizationName,
																								2,
																							)
																						}}
																					</span>
																				</v-avatar>
																				{{
																					item.organizationName
																				}}
																			</v-list-item>
																		</template>
																		<template
																			v-slot:selection="{
																				attrs,
																				item,
																			}"
																		>
																			<v-chip
																				v-if="
																					!!item &&
																					!!item.id
																				"
																				v-bind="
																					attrs
																				"
																				class="
																					mt-2
																				"
																			>
																				<v-avatar
																					color="indigo mr-2"
																					size="36"
																				>
																					<span
																						class="
																							white--text
																						"
																					>
																						{{
																							getAvatarText(
																								item.organizationName,
																								2,
																							)
																						}}
																					</span>
																				</v-avatar>
																				{{
																					item.organizationName
																				}}
																			</v-chip>
																		</template>
																	</v-autocomplete>
																</v-col>
															</v-row>

															<v-row
																class="
																	subtitle-1
																	mx-0
																"
																dense
															>
																<v-col
																	cols="2"
																	md="2"
																>
																	<em>
																		{{
																			$t(
																				"label.rank",
																			)
																		}}
																	</em>
																	:
																</v-col>
																<v-col
																	cols="1"
																	md="1"
																>
																	<v-icon
																		color="blue"
																		@click="
																			changeFlagHiden(
																				showRank,
																				index,
																			)
																		"
																		class="
																			text--blue
																		"
																	>
																		mdi-domain-plus
																	</v-icon>
																</v-col>
																<v-col
																	v-if="
																		showRank[
																			index
																		]
																	"
																>
																	<v-autocomplete
																		v-model="
																			items.rank
																		"
																		:items="
																			listRank
																		"
																		item-text="rankName"
																		:item-value="
																			(
																				item,
																			) =>
																				item
																		"
																		:label="
																			$t(
																				'label.rank',
																			)
																		"
																		dense
																		clearable
																		outlined
																		@click:clear="
																			removeRank(
																				index,
																			)
																		"
																	>
																		<template
																			v-slot:label
																		>
																			<span
																				class="
																					text--blue
																				"
																			>
																				{{
																					$t(
																						"label.rank",
																					)
																				}}
																			</span>
																		</template>
																		<template
																			v-slot:item="{
																				item,
																			}"
																		>
																			<v-list-item
																				@click="
																					selectRank(
																						item,
																						index,
																					)
																				"
																				class="
																					m-1
																				"
																			>
																				<v-list-item-avatar>
																					<v-avatar
																						color="indigo mr-2"
																						size="36"
																					>
																						<span
																							class="
																								white--text
																							"
																						>
																							{{
																								getAvatarText(
																									item.rankName,
																									2,
																								)
																							}}
																						</span>
																					</v-avatar>
																				</v-list-item-avatar>
																				<v-list-item-content>
																					<v-list-item-title
																						v-html="
																							sanitizeText(
																								item.rankName,
																							)
																						"
																					>
																					</v-list-item-title>
																					<v-list-item-subtitle
																						v-if="
																							item.organization &&
																							item
																								.organization
																								.organizationName
																						"
																					>
																						{{
																							item
																								.organization
																								.organizationName
																						}}
																					</v-list-item-subtitle>
																				</v-list-item-content>
																			</v-list-item>
																		</template>

																		<template
																			v-slot:selection="{
																				attrs,
																				item,
																			}"
																		>
																			<v-chip
																				v-if="
																					!!item &&
																					!!item.id
																				"
																				v-bind="
																					attrs
																				"
																				class="
																					mt-2
																				"
																			>
																				<v-avatar
																					color="indigo mr-2"
																					size="36"
																				>
																					<span
																						class="
																							white--text
																						"
																					>
																						{{
																							getAvatarText(
																								item.rankName,
																								2,
																							)
																						}}
																					</span>
																				</v-avatar>
																				{{
																					item.rankName
																				}}
																			</v-chip>
																		</template>
																	</v-autocomplete>
																</v-col>
																<v-col
																	v-if="
																		!showRank[
																			index
																		] &&
																		!!items &&
																		!!items.rank
																	"
																>
																	<i
																		v-if="
																			!!items.rank
																		"
																	>
																		<v-chip
																			class="
																				mt-2
																			"
																		>
																			<v-avatar
																				color="indigo mr-2"
																				size="36"
																			>
																				<span
																					class="
																						white--text
																					"
																				>
																					{{
																						getAvatarText(
																							items
																								.rank
																								.rankName,
																						)
																					}}
																				</span>
																			</v-avatar>
																			{{
																				items
																					.rank
																					.rankName
																			}}
																		</v-chip>
																	</i>
																</v-col>
															</v-row>
															<v-row
																class="
																	subtitle-1
																	mx-0
																"
																dense
															>
																<v-col
																	cols="2"
																	md="2"
																>
																	<em>
																		{{
																			$t(
																				"label.handler_pr",
																			)
																		}}
																	</em>
																	:
																</v-col>
																<v-col
																	cols="1"
																	md="1"
																>
																	<v-icon
																		color="blue"
																		@click="
																			selectUser
																		"
																		class="
																			text--blue
																		"
																	>
																		mdi-account-plus
																	</v-icon>
																</v-col>

																<v-col
																	v-if="
																		items &&
																		items.userInStepDTOs
																	"
																>
																	<v-chip-group
																		style="
																			width: 50rem;
																		"
																	>
																		<v-chip
																			v-for="item in items.userInStepDTOs"
																			:key="
																				item.id
																			"
																		>
																			<v-avatar
																				color="indigo mr-2"
																				size="36"
																			>
																				<span
																					class="
																						white--text
																					"
																					v-if="
																						!item.avatar
																					"
																				>
																					{{
																						getAvatarText(
																							item.fullName,
																						)
																					}}
																				</span>
																				<v-img
																					v-if="
																						item.avatar
																					"
																					:src="
																						item.avatar
																					"
																				>
																				</v-img>
																			</v-avatar>
																			{{
																				item.fullName
																			}}
																		</v-chip>
																	</v-chip-group>
																</v-col>
															</v-row>
														</template>
													</v-form>
												</v-card-text>
												<!-- <v-btn
													class="remove-row"
													fab
													dark
													icon
													@click="removeRow(index)"
												>
													<v-icon dark>
														mdi-trash-can-outline
													</v-icon>
												</v-btn> -->
											</v-card>
										</Draggable>
									</Container>
								</v-timeline-item>
							</Container>
						</v-timeline>
					</VuePerfectScrollbar>
				</v-card-text>
			</v-col>
			<v-divider vertical></v-divider>

			<v-col cols="12" md="3">
				<v-card
					v-if="groups.length > 0"
					v-click-outside="onClickOutside"
				>
					<v-card-text>
						<v-form ref="form" v-model="valid">
							<v-container>
								<v-row>
									<v-text-field
										v-model="modelslt.stepInProcessName"
										ref="stepInProcessName"
										dense
										maxLength="255"
										outlined
										:error-messages="
											requiredStepInProcessName
										"
										@keyup="onchangeStepName"
									>
										<template v-slot:label>
											{{ $t("label.stepInProcess_name") }}
											<span class="text--red">{{
												$t("label.star")
											}}</span>
										</template>
									</v-text-field></v-row
								>
								<v-row>
									<v-text-field
										dense
										outlined
										v-model="modelslt.description"
										:label="this.$t(`label.description`)"
										maxLength="255"
									></v-text-field
								></v-row>
								<v-row>
									<v-text-field
										v-click-outside="
											onClickOutsideProcessingTerm
										"
										ref="processingTerm"
										:rules="[rules.regex]"
										dense
										type="number"
										outlined
										v-model="modelslt.processingTerm"
										:label="$t('label.processingTerm')"
										append-icon="mdi-clock"
										suffix="Giờ"
										:error-messages="errorProcessingTerm"
										@keyup="onchangeProcessingTerm"
										maxLength="255"
									>
									</v-text-field>
								</v-row>
								<v-row>
									<v-autocomplete
										ref="cbbOrganization"
										dense
										v-model="modelslt.organization"
										:items="listOrganize"
										item-text="organizationName"
										:item-value="(item) => item"
										:label="this.$t(`label.organization`)"
										clearable
										outlined
										@click:clear="removeOrganization(null)"
									>
										<template v-slot:item="{ item }">
											<v-list-item
												@click="
													selectOrganizationStep(item)
												"
												class="m-1"
											>
												<v-avatar
													color="indigo mr-2"
													size="36"
												>
													<span class="white--text">
														{{
															getAvatarText(
																item.organizationName,
																2,
															)
														}}
													</span>
												</v-avatar>
												{{ item.organizationName }}
											</v-list-item>
										</template>
										<template
											v-slot:selection="{ attrs, item }"
										>
											<v-chip
												v-if="!!item && !!item.id"
												v-bind="attrs"
												class="mt-2"
											>
												<v-avatar
													color="indigo mr-2"
													size="36"
												>
													<span class="white--text">
														{{
															getAvatarText(
																item.organizationName,
																2,
															)
														}}
													</span>
												</v-avatar>
												{{ item.organizationName }}
											</v-chip>
										</template>
									</v-autocomplete>
								</v-row>

								<v-row>
									<v-autocomplete
										ref="cbbRank"
										dense
										v-model="modelslt.rank"
										:items="listRank"
										item-text="rankName"
										:item-value="(item) => item"
										:label="$t('label.rank')"
										clearable
										outlined
										@click:clear="removeRank(null)"
										maxLength="255"
									>
										<template v-slot:item="{ item }">
											<v-list-item
												@click="selectRankStep(item)"
												class="m-1 w-[20rem]"
											>
												<v-list-item-avatar>
													<v-avatar
														color="indigo mr-2"
														size="36"
													>
														<span
															class="white--text"
														>
															{{
																getAvatarText(
																	item.rankName,
																	2,
																)
															}}
														</span>
													</v-avatar>
												</v-list-item-avatar>
												<v-list-item-content>
													<v-list-item-title
														v-html="
															sanitizeText(
																item.rankName,
															)
														"
													>
													</v-list-item-title>
													<v-list-item-subtitle
														v-if="
															modelslt.organization &&
															modelslt
																.organization
																.organizationName
														"
													>
														{{
															modelslt
																.organization
																.organizationName
														}}
													</v-list-item-subtitle>
												</v-list-item-content>
											</v-list-item>
										</template>
										<template
											v-slot:selection="{ attrs, item }"
										>
											<v-chip
												v-if="!!item && !!item.id"
												v-bind="attrs"
												class="mt-2"
											>
												<v-avatar
													color="indigo mr-2"
													size="36"
												>
													<span class="white--text">
														{{
															getAvatarText(
																item.rankName,
																2,
															)
														}}
													</span>
												</v-avatar>
												{{ item.rankName }}
											</v-chip>
										</template>
									</v-autocomplete>
								</v-row>
								<v-row>
									<v-combobox
										v-model="modelslt.userInStepDTOs"
										item-text="fullName"
										chips
										clearable
										:label="$t(`label.handler`)"
										dense
										outlined
										multiple
										@click="selectUser"
										@click:clear="removeHandler"
									>
										<template
											v-slot:selection="{ attrs, item }"
										>
											<v-chip
												v-if="!!item && !!item.id"
												v-bind="attrs"
												class="mt-2"
												close
												@click:close="
													removeUserInStep(item)
												"
											>
												<v-avatar
													color="indigo mr-2"
													size="30"
												>
													<span
														class="white--text"
														v-if="!item.avatar"
													>
														{{
															getAvatarText(
																item.fullName,
															)
														}}
													</span>
												</v-avatar>
												{{ item.fullName }}
											</v-chip>
										</template>
									</v-combobox>
								</v-row>
								<v-row>
									<v-checkbox
										v-model="modelslt.isDelete"
										dense
										:label="$t('label.is_delete')"
									></v-checkbox
								></v-row>
								<v-row>
									<v-checkbox
										dense
										v-model="modelslt.isEdit"
										:label="$t('label.is_edit')"
									></v-checkbox
								></v-row>

								<!-- <v-row>
								<v-checkbox
									v-model="modelslt.isReSend"
									dense
									:label="$t('label.is_recall')"
								>
								</v-checkbox>
							</v-row> -->

								<v-row align="center">
									<v-checkbox
										v-model="modelslt.isCreateOTPLink"
										dense
										:label="$t('label.is_createdOTP')"
									></v-checkbox
								></v-row>

								<!-- //////// -->
								<v-row align="center">
									<v-checkbox
										dense
										v-model="modelslt.isBack"
										:label="$t('label.is_back')"
										class="shrink mr-2 mt-0"
									></v-checkbox>
								</v-row>
								<!-- /////// -->
								<v-row align="center">
									<v-checkbox
										dense
										v-model="modelslt.isConsult"
										class="shrink mr-2 mt-0"
										:label="$t('label.consult')"
									></v-checkbox>
								</v-row>
								<!-- //////// -->
								<v-row align="center">
									<v-checkbox
										dense
										v-model="modelslt.isSendNoticePriority"
										:label="$t('label.is_send_priority')"
										class="shrink mr-2 mt-0"
									></v-checkbox>
								</v-row>
								<!-- /////// -->
								<v-row align="center">
									<v-checkbox
										dense
										v-model="modelslt.isExamine"
										class="shrink mr-2 mt-0"
										:label="$t('label.is_examine')"
									></v-checkbox>
								</v-row>
								<!-- ////// -->
								<v-row align="center">
									<v-checkbox
										dense
										v-model="modelslt.isApprove"
										:label="$t('label.approve')"
										class="shrink mr-2 mt-0"
									></v-checkbox>
								</v-row>

								<v-row align="center">
									<v-checkbox
										dense
										v-model="modelslt.isProcessRecover"
										:label="$t('label.is_process_recover')"
										class="shrink mr-2 mt-0"
									></v-checkbox>
								</v-row>

								<!-- ////// -->
								<v-row align="center">
									<v-checkbox
										dense
										v-model="modelslt.isProcessSaveDoc"
										:label="$t('label.is_saveDoc')"
										class="shrink mr-2 mt-0"
									></v-checkbox>
								</v-row>
								<!-- /////// -->
								<v-row align="center">
									<v-checkbox
										dense
										v-model="modelslt.isRequiredSignature"
										class="shrink mr-2 mt-0"
										:label="
											this.$t(
												`label.is_required_signature`,
											)
										"
									></v-checkbox>
								</v-row>
								<!-- ///////// -->
								<v-row align="center">
									<v-checkbox
										dense
										v-model="modelslt.isCreateContract"
										hide-details
										class="shrink mr-2 mt-0"
									></v-checkbox>
									<v-text-field
										readonly
										append-icon="mdi-chevron-down"
										:label="$t('label.is_create_contract')"
									>
									</v-text-field>
								</v-row>
								<v-row v-if="modelslt.isCreateContract">
									<v-col cols="12" md="12">
										<v-select
											:menu-props="{
												bot: true,
												offsetY: true,
											}"
											dense
											:items="listRequesst"
											outlined
											v-model="modelslt.contractType"
											clearable
											:label="
												$t('label.type_create_contract')
											"
											item-text="requestName"
											:item-value="(item) => item.id"
											:no-data-text="
												$t('message.no_results')
											"
										>
										</v-select>
									</v-col>
									<v-col cols="12" md="12">
										<v-select
											:menu-props="{
												bot: true,
												offsetY: true,
											}"
											dense
											v-model="modelslt.processOfContract"
											:items="listProcess"
											outlined
											item-text="processName"
											clearable
											:item-value="(item) => item.id"
											:label="
												$t(
													'label.type_process_contract',
												)
											"
											:no-data-text="
												$t('message.no_results')
											"
										>
										</v-select>
									</v-col>
									<v-col cols="12" md="12">
										<v-select
											:menu-props="{
												bot: true,
												offsetY: true,
											}"
											:items="filterOptionCreateContract"
											v-model="
												modelslt.createContractType
											"
											:item-value="(item) => item.key"
											item-text="value"
											:label="
												$t('label.optionCreateContact')
											"
											outlined
											dense
											clearable
											:no-data-text="
												$t('message.no_results')
											"
										>
										</v-select>
									</v-col>
								</v-row>

								<!-- ////// -->
								<v-row align="center">
									<v-checkbox
										dense
										v-model="modelslt.isDeny"
										hide-details
										class="shrink mr-2 mt-0"
									></v-checkbox>
									<v-text-field
										readonly
										append-icon="mdi-chevron-down"
										:label="this.$t('button.return_old')"
									>
									</v-text-field>
								</v-row>
								<v-row v-if="modelslt.isDeny">
									<v-select
										:menu-props="{
											bot: true,
											offsetY: true,
										}"
										dense
										v-model="modelslt.optionDeny"
										:items="filterItems"
										item-text="value"
										:item-value="(item) => item.id"
										:label="$t('label.deny_old')"
										outlined
										:no-data-text="$t('message.no_results')"
									></v-select>
								</v-row>
								<!-- <v-row v-if="modelslt.optionDeny == 3">
								<v-select :menu-props="{ bot: true, offsetY: true }"
									:items="groups"
									item-text="stepInProcessName"
									:no-data-text="$t('message.no_results')"
								>
									<template v-slot:item="{ item }">
										<v-list-item
											@click="o_selectOptionDeny(item)"
										>
											{{ item.stepInProcessName }}
										</v-list-item>
									</template>
								</v-select>
							</v-row> -->

								<!-- //////// -->
								<v-row align="center">
									<v-checkbox
										dense
										v-model="modelslt.isExportPDF"
										hide-details
										class="shrink mr-2 mt-0"
									></v-checkbox>
									<v-text-field
										readonly
										append-icon="mdi-chevron-down"
										:label="$t('label.exportPdf')"
									>
									</v-text-field>
								</v-row>
								<v-row v-if="modelslt.isExportPDF">
									<v-col cols="12" md="12">
										<v-checkbox
											v-model="modelslt.isAddWaterMark"
											dense
											:label="$t('label.watermark')"
										></v-checkbox>
									</v-col>
									<v-col cols="12" md="12">
										<v-checkbox
											v-model="modelslt.isAddQRCode"
											dense
											:label="$t('label.qr_code')"
										></v-checkbox>
									</v-col>
								</v-row>

								<!-- /////////// -->
								<v-row align="center">
									<v-checkbox
										dense
										v-model="modelslt.isSendMail"
										hide-details
										class="shrink mr-2 mt-0"
									></v-checkbox>
									<v-text-field
										readonly
										append-icon="mdi-chevron-down"
										:label="$t('label.allow_send_email')"
									>
									</v-text-field>
								</v-row>
								<v-row v-if="modelslt.isSendMail">
									<v-col cols="12" md="12">
										<v-checkbox
											v-model="modelslt.isAutoSendMail"
											dense
											:label="$t('label.auto_send_email')"
										>
										</v-checkbox>
									</v-col>
									<v-col cols="12" md="12">
										<v-select
											:menu-props="{
												bot: true,
												offsetY: true,
											}"
											v-model="modelslt.mailTemplate"
											:item-value="(item) => item"
											item-text="mailTemplateName"
											:items="listMailTemplate"
											dense
											:label="$t('label.form_email')"
											outlined
											:no-data-text="
												$t('message.no_results')
											"
											clearable
										></v-select>
									</v-col>
									<v-col cols="12" md="12">
										<v-checkbox
											dense
											:label="$t('label.send_otp')"
											v-model="modelslt.isSendOTP"
										>
										</v-checkbox>
									</v-col>
									<v-col cols="12" md="12">
										<v-checkbox
											v-model="modelslt.isAttachFilePDF"
											dense
											:label="$t('label.attach_pdf')"
										>
										</v-checkbox>
									</v-col>
								</v-row>
								<!-- /////////// -->
								<v-row align="center">
									<v-checkbox
										dense
										v-model="modelslt.isSendMailCustomer"
										hide-details
										class="shrink mr-2 mt-0"
									></v-checkbox>
									<v-text-field
										readonly
										append-icon="mdi-chevron-down"
										:label="
											$t('label.allow_send_email_custom')
										"
									>
									</v-text-field>
								</v-row>
								<v-row v-if="modelslt.isSendMailCustomer">
									<v-col cols="12" md="12">
										<v-select
											:menu-props="{
												bot: true,
												offsetY: true,
											}"
											v-model="
												modelslt.mailTemplateCustomer
											"
											:item-value="(item) => item"
											item-text="mailTemplateName"
											:items="listMailTemplate"
											dense
											:label="$t('label.form_email')"
											outlined
											:no-data-text="
												$t('message.no_results')
											"
											clearable
										></v-select>
									</v-col>
								</v-row>
							</v-container>
						</v-form>
					</v-card-text>
				</v-card>
			</v-col>
		</v-row>
	</v-card>
</template>

<script>
import { Container, Draggable } from "vue-dndrop";
import { applyDrag } from "@/utils/helpers";
import Vue from "vue";
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import "@koumoul/vjsf/lib/VJsf.css";
import "@koumoul/vjsf/lib/deps/third-party.js";
import globalService from "@/services/global.service";
import constant from "@/common/constant.js";
import ProcessInfoDTO from "@/models/process-info.dto";
import administratorAPI from "../administrator.api";
import UserInfosRequestDataV2Vue from "../../khai-phieu-yeu-cau/RequestForm/UserInfosRequestDataV2.vue";

export default {
	name: "EditProcessInfoDetailVue",
	components: {
		Container,
		Draggable,
		VuePerfectScrollbar,
		UserInfosRequestDataV2Vue,
	},
	props: {
		processInfoDto: ProcessInfoDTO,
		isSaved: {},
	},
	data() {
		return {
			user_current: this.getUserInfo(),
			showStep: false,
			tab: 0,
			ProcessInfoDTO: ProcessInfoDTO,
			filterItems: [
				{ id: -1, value: this.$t("label.deny_1") },
				{ id: -2, value: this.$t("label.deny_2") },
				{ id: 3, value: this.$t("label.deny_3") },
			],
			filterOptionCreateContract: [
				{ key: 1, value: this.$t("label.all_contract_totrinh") },
				{ key: 2, value: this.$t("label.all_contract_pheduyet") },
			],
			w_col: 9,
			showManageStamp: false,
			listStatus: [],
			showOrganize: [],
			showRank: [],
			showHandler: [],
			listOrganize: [],
			user_in_step: [],
			NguoiXuLy: [],
			userFilters: [],
			listRank: [],
			selected: [],
			searchNguoiXuLy: "",
			stepInProcess: [],
			deleteStepInProcessArr: [],
			deleteUserInStepArr: [],
			beforeDelete: [],
			indexItems: 0,
			dateFormat: "DD/MM/yyyy",
			processes: this.processInfoDto,
			itemid: this.$route.params.id,
			modelslt: {
				created: null,
				createdDate: null,
				createdName: "",
				createdOrgName: "",
				createdRankName: "",
				description: "",
				id: null,
				isActive: false,
				isAddHistory: false,
				isConsult: true,
				isAddQRCode: false,
				isAddWaterMark: false,
				isAutoSendMail: false,
				isAttachFilePDF: false,
				isChangeProcess: false,
				isApprove: true,
				isAuthorizedApproval: false,
				isBack: false,
				isChangeStatus: false,
				isCreateContract: false,
				isCreateOTPLink: false,
				isCreateOfficalDispath: false,
				isCreateReport: false,
				isCreateTFSTask: false,
				isDeny: true,
				isEdit: false,
				isExamine: true,
				isExportPDF: false,
				isManageStamp: false,
				isProcessRecover: false,
				isRecall: false,
				isRequestModify: false,
				isRequiredSignature: false,
				isSaveDoc: false,
				isSendMail: false,
				isSendNoticePriority: false,
				processOfContract: false,
				createContractType: "",
				modified: null,
				modifiedDate: null,
				modifiedName: "",
				optionDeny: -1,
				organization: null,
				organizationCode: "",
				organizationName: "",
				processInfo: null,
				processingActiveTime: null,
				processingTerm: "0",
				processingTermTime: null,
				isProcessSaveDoc: false,
				isSendOTP: false,
				mailTemplate: null,
				contractType: "",
				rank: null,
				rankCode: "",
				rankName: "",
				step: null,
				stepInProcessCode: "",
				stepInProcessName: "",
				stepOrder: 0,
				tennant: null,
				tennantCode: "",
				tennantName: "",
				userInStepDTOs: [],
			},
			defaultItem: {
				created: null,
				createdDate: null,
				createdName: "",
				createdOrgName: "",
				createdRankName: "",
				description: "",
				id: null,
				isActive: false,
				isAddHistory: false,
				isConsult: true,
				isAddQRCode: false,
				isAddWaterMark: false,
				isAttachFilePDF: false,
				isAutoSendMail: false,
				isSendOTP: false,
				isApprove: true,
				isChangeProcess: false,
				isAuthorizedApproval: false,
				processOfContract: false,
				contractType: "",
				isBack: false,
				isChangeStatus: false,
				isCreateContract: false,
				isCreateOTPLink: false,
				isCreateOfficalDispath: false,
				createContractType: "",
				isCreateReport: false,
				isCreateTFSTask: false,
				isProcessSaveDoc: false,
				isDeny: true,
				isEdit: false,
				isExamine: true,
				isExportPDF: false,
				isManageStamp: false,
				isProcessRecover: false,
				isRecall: false,
				isRequestModify: false,
				isRequiredSignature: false,
				isSaveDoc: false,
				isSendMail: false,
				isSendNoticePriority: false,
				mailTemplate: null,
				modified: null,
				modifiedDate: null,
				modifiedName: "",
				optionDeny: -1,
				organization: null,
				organizationCode: "",
				organizationName: "",
				processInfo: null,
				processingActiveTime: null,
				processingTerm: "0",
				processingTermTime: null,
				rank: null,
				rankCode: "",
				rankName: "",
				step: null,
				stepInProcessCode: "",
				stepInProcessName: "",
				stepOrder: 0,
				tennant: null,
				tennantCode: "",
				tennantName: "",
				userInStepDTOs: [],
			},
			groups: [],
			steps: [],
			previousItems: null,
			nextItems: null,
			indexA: null,
			indexB: null,
			showName: false,
			showDescription: false,
			is_add: false,
			listArrRank: [],
			isRankLoad: false,
			listArrHandler: [],
			isHandlerLoad: false,
			requiredStepInProcessName: "",
			errorProcessingTerm: "",
			regex: /^[0-9]{1,3}(\.[0-9])?$/,
			errFomat: false,
			dragg: false,
			m_isSaved: 0,
			listProcess: [],
			listRequesst: [],
			listMailTemplate: [],
			openUserInfosRequestData: false,
			valid: null,
			rules: {
				regex: (value) => {
					if (!value) return false;
					return (
						/^[0-9]{1,3}(\.[0-9]{1})?$/.test(("" + value).trim()) ||
						this.$t("error.wrong_format_000_0")
					);
				},
			},
		};
	},
	watch: {
		processInfoDto(value) {
			this.processes = value;
		},
		selected() {
			this.searchNguoiXuLy = "";
		},
		async isSaved(value) {
			this.m_isSaved = value;
			if (this.m_isSaved.state == 2) {
				this.save();
			}
		},
		"modelslt.isCreateContract"(val) {
			if (
				val &&
				this.listRequesst.length == 0 &&
				this.listProcess.length == 0
			) {
				this.getAllRequest();
				this.getAllProcess();
			}
			if (!val) {
				this.modelslt.processOfContract = null;
				this.modelslt.contractType = null;
				this.modelslt.createContractType = "";
			}
		},
		"modelslt.isSendMail"(val) {
			if (!val) {
				this.modelslt.isAutoSendMail = false;
				this.modelslt.mailTemplate = null;
				this.modelslt.isSendOTP = false;
				this.modelslt.isAttachFilePDF = false;
			}
		},
		"modelslt.isSendMailCustomer"(val) {
			if (!val) {
				this.modelslt.mailTemplateCustomer = null;
			}
		},
		"modelslt.isExportPDF"(val) {
			if (!val) {
				this.modelslt.isAddWaterMark = false;
				this.modelslt.isAddQRCode = false;
			}
		},
		showStep(value) {
			if (!value) {
				this.w_col = 9;
			} else {
				this.w_col = 7;
			}
		},
	},
	async created() {
		await this.getAllStepInProcess();
		await this.getAllStep();
		// await this.getAllUser();
		await this.getAllRank();
		await this.getAllOrganize();
		// await this.getAllProcess();
		// await this.getAllRequest();
		await this.getMailTemplate();
		this.user_in_step = {
			avatar: "",
			created: { id: this.getUserInfo().id },
			createdDate: new Date(),
			createdName: this.getUserInfo().fullName,
			description: "",
			id: null,
			isActive: true,
			modified: { id: this.getUserInfo().id },
			modifiedDate: new Date(),
			modifiedName: this.getUserInfo().fullName,
			stepInProcess: null,
			userInfo: null,
			fullName: "",
		};
		this.m_isSaved = this.isSaved;
		if (this.itemid) {
			this.clickToEdit(this.stepInProcess[0]);
		}
		if (!this.itemid) {
			this.addColumn();
			this.groups[0].stepInProcessName = "";
		}
	},

	updated() {
		if (this.is_add) {
			let theTemp = document.getElementsByClassName("isFocus");
			theTemp = theTemp.length >= 0 ? theTemp[0] : null;
			if (theTemp) theTemp.focus();
			this.scrollToView(this.groups.length - 1);
			this.is_add = false;
		}
	},

	computed: {
		allSelected() {
			return this.selected.length === this.NguoiXuLy.length;
		},
		categories() {
			const search = this.searchNguoiXuLy.toLowerCase();

			if (!search) return this.NguoiXuLy;

			return this.NguoiXuLy.filter((item) => {
				const text = item.fullName.toLowerCase();

				return text.indexOf(search) > -1;
			});
		},
		selections() {
			const selections = [];
			for (const selection of this.groups[this.indexItems]
				.userInStepDTOs) {
				selections.push(selection);
			}

			return selections;
		},
		form() {
			return {
				stepInProcessName: this.modelslt.stepInProcessName,
			};
		},
		modelsltOrganization: {
			get: function () {
				return this.modelslt.organization;
			},
			set: function (value) {
				if (!value) return;
				if (!this.isObject(value)) return;
				this.modelslt.organization = value;
			},
		},
	},
	methods: {
		async getAllRequest() {
			let response;
			try {
				response = await globalService.getData_Async(
					administratorAPI.API_GetAllRequestIgnoreField(true),
				);
				if (!response) {
					return this.toastError(this.$t("error.load"));
				}
				if (!response.state) {
					return this.toastError(this.$t("error.load"));
				}
				this.listRequesst = response.data.filter((entry) => {
					return !entry.isDelete && entry.isActive;
				});
			} catch (error) {
				this.toastError(error.message);
			}
		},
		async getMailTemplate() {
			try {
				let response = await globalService.getData_Async(
					administratorAPI.API_GetAllMailTemplate(),
				);
				if (!response || !response.state) return;
				this.listMailTemplate = response.data.filter((entry) => {
					return !entry.isDelete;
				});
			} catch (error) {
				console.log(error);
			}
		},
		remove(item) {
			this.deleteUserInStepArr.push(item);
			this.modelslt.userInStepDTOs.splice(
				this.modelslt.userInStepDTOs.indexOf(item),
				1,
			);
			if (
				!this.groups[this.indexItems].userInStepDTOs ||
				this.groups[this.indexItems].userInStepDTOs.length == 0
			) {
				return;
			}
			this.groups[this.indexItems].userInStepDTOs.splice(
				this.groups[this.indexItems].userInStepDTOs.indexOf(item),
				1,
			);
			this.groups[this.indexItems].userInStepDTOs = [
				...this.groups[this.indexItems].userInStepDTOs,
			];
		},
		removeUserInStep(item) {
			this.beforeDelete.push(item);
			this.modelslt.userInStepDTOs.splice(
				this.modelslt.userInStepDTOs.indexOf(item),
				1,
			);
		},
		async getAllProcess() {
			try {
				let response = await globalService.getData_Async(
					administratorAPI.API_GetAllProcessIgnoreField(true),
				);
				if (!response || !response.state) return;
				this.listProcess = response.data;
			} catch (error) {
				console.log(error);
			}
		},
		async getAllStatus() {
			try {
				let response = await globalService.getData_Async(
					administratorAPI.API_GetAllStatus(),
				);
				if (!response || !response.state)
					return this.toastError(this.$t("error.load"));
				this.listStatus = response.data;
			} catch (error) {
				console.log(error);
			}
		},
		async getAllOrganize() {
			try {
				let response = await globalService.getData_Async(
					administratorAPI.API_FindAllOrganization(),
				);
				if (!response || !response.state) {
					return;
				}
				this.listOrganize = response.data.filter((entry) => {
					return !entry.isDelete && entry.isActive;
				});
			} catch (error) {
				this.toastError(error);
			}
		},
		async getAllRank() {
			try {
				let response = await globalService.getData_Async(
					administratorAPI.API_GetAllRank(),
				);
				if (!response || !response.state) {
					return;
				}
				this.listRank = response.data.filter((entry) => {
					return !entry.isDelete && entry.isActive;
				});
			} catch (error) {
				this.toastError(error);
			}
		},
		async getAllUser() {
			try {
				let response = await globalService.getData_Async(
					administratorAPI.API_GetAllUserInfo(),
				);
				if (!response || !response.state) {
					return;
				}
				this.NguoiXuLy = response.data.filter((entry) => {
					return !entry.isDelete && entry.isActive;
				});
				this.userFilters = this.NguoiXuLy;
			} catch (error) {
				this.toastError(error);
			}
		},
		async getAllStepInProcess() {
			if (!this.itemid) return;
			let response;
			try {
				response = await globalService.getData_Async(
					administratorAPI.API_GetAllByProcessInfoId(this.itemid),
				);
				if (!response || !response.state) {
					return;
				}
			} catch (error) {
				console.log(error);
			}
			if (response.data.length > 0) {
				this.stepInProcess = response.data.sort((a, b) => {
					return a.stepOrder - b.stepOrder;
				});
				this.groups = [];
				this.stepInProcess.forEach(async (stepIn, index) => {
					response = await globalService.getData_Async(
						administratorAPI.API_GetAllByStepInProcessId(stepIn.id),
						// `/api/step-in-processes/${stepIn.id}/_all/user-in-steps`,
					);
					if (!response || !response.state) {
						return;
					}
					stepIn.userInStepDTOs = response.data;
					Vue.set(this.groups, index, stepIn);
				});
				this.clickToEdit(this.stepInProcess[0]);
			}
		},

		async getAllStep() {
			try {
				let response = await globalService.getData_Async(
					administratorAPI.API_GetAllSteps(),
				);
				if (!response) {
					return;
				}
				if (!response.state) {
					return;
				}
				this.steps = response.data.filter((entry) => {
					return !entry.isDelete && entry.isActive;
				});
				this.modelslt.stepName = this.$t("label.empty");
				this.steps.unshift(this.modelslt);
			} catch (error) {
				console.log(error);
			}
		},

		getChildPayload(itemIndex) {
			return this.groups[itemIndex];
		},
		getChildPayload_Selector(itemIndex) {
			this.dragg = true;
			return this.steps[itemIndex];
		},
		getShouldAcceptDrop(src) {
			if (!src.onDrop) return false;
			return true;
		},
		getdAcceptDrop(src) {
			if (!src.onDrop) return true;
			return false;
		},
		getShouldAnimateDrop() {
			//this.log("should-animate-drop", sourceContainerOptions, payload);
			return true;
		},

		onDrop(dropResult) {
			let scene = Object.assign([], this.groups);
			let newStep = {
				...this.modelslt,
				step: dropResult.payload.id ? dropResult.payload : null,
				id: null,
				stepInProcessName: dropResult.payload.stepName,
				stepInProcessCode: dropResult.payload.stepCode,
				userInStepDTOs: [],
				processInfo: null,
				organization: dropResult.payload.organization,
				description: dropResult.payload.description,
				created: this.getUserInfo(),
				createdDate: new Date(),
				createdName: this.getUserInfo().fullName,
				isActive: dropResult.payload.isActive,
				isAuthorizedApproval: dropResult.payload.isAuthorizedApproval,
				isBack: dropResult.payload.isBack,
				isCreateTFSTask: dropResult.payload.isCreateTFSTask,
				isEdit: dropResult.payload.isEdit,
				isExamine: dropResult.payload.isExamine,
				isProcessRecover: dropResult.payload.isProcessRecover,
				isRequestModify: dropResult.payload.isRequestModify,
				isRequiredSignature: dropResult.payload.isRequiredSignature,
				isSendMail: dropResult.payload.isSendMail,
				modified: this.getUserInfo(),
				modifiedDate: new Date(),
				modifiedName: this.getUserInfo().fullName,
				processingTerm: dropResult.payload.processingTerm,
				rank: dropResult.payload.rank,
				optionDeny: -1,
			};
			dropResult.payload = newStep;
			scene = applyDrag(scene, dropResult, true);
			this.modelslt = dropResult.payload;
			this.groups = scene;
			this.clickToEdit(this.groups[dropResult.addedIndex]);
			this.dragg = false;
		},
		onDropStep(groupIndex, dropResult) {
			if (
				dropResult.removedIndex !== null ||
				dropResult.addedIndex !== null
			) {
				if (dropResult.addedIndex != null) {
					this.previousItems = this.groups[groupIndex];
					this.indexA = groupIndex;
				}
				if (dropResult.removedIndex != null) {
					this.nextItems = this.groups[groupIndex];
					this.indexB = groupIndex;
				}
				if (this.previousItems && this.nextItems) {
					let c = this.previousItems;
					this.previousItems = this.nextItems;
					this.nextItems = c;
					Vue.set(this.groups, this.indexA, this.previousItems);
					Vue.set(this.groups, this.indexB, this.nextItems);
					this.previousItems = null;
					this.nextItems = null;
					this.indexItems = this.groups.indexOf(
						this.groups[this.indexB],
					);
					this.clickToEdit(this.groups[this.indexA]);
					return;
				}
			}
			return;
		},
	
		async save() {
			if (this.$refs?.form) {
				if (!this.$refs.form.validate()) {
					this.toastError(this.$t("message.required_form_process"));
					return;
				}
			}
			if (this.isSaving || `${this.processes.processName}` == "") {
				this.toastError(this.$t("message.save_error"));
				return;
			}
			if (this.deleteStepInProcessArr.length > 0) {
				for (const item of this.deleteStepInProcessArr) {
					let response = await globalService.deleteData_Async(
						administratorAPI.API_DeleteStepInProcess(item.id),
					);
					if (!response || !response.state) {
						return;
					}
				}
			}
			if (this.beforeDelete.length > 0) {
				for (const item of this.beforeDelete) {
					if (!item.id) return;
					let response = await globalService.deleteData_Async(
						administratorAPI.API_DeleteUserInStep(item.id),
					);
					if (!response || !response.state) {
						return;
					}
				}
				this.beforeDelete = [];
			}

			this.deleteUserInStepArr = [];
			this.deleteStepInProcessArr = [];
			try {
				this.isSaving = true;
				let stt = 1;
				for (const arr of this.groups) {
					arr.stepInProcessName = arr.stepInProcessName.trim();
					arr.description = arr.description.trim();
					if (arr.stepInProcessName == "") {
						this.toastError(
							this.$t("message.error_step_in_process"),
						);
						this.isSaving = false;
						return;
					}
					if (arr.contractType.id) {
						arr.contractType = arr.contractType.id;
					}
					if (arr.processOfContract.id) {
						arr.processOfContract = arr.processOfContract.id;
					}
					if (arr.createContractType.key) {
						arr.createContractType = arr.createContractType.key;
					}

					// if (arr.processingTerm && this.errFomat) {
					// 	this.errorProcessingTerm = this.$t(
					// 		"message.error_format",
					// 	);
					// 	this.$refs["processingTerm"].focus();
					// 	return;
					// }
					if (!this.regex.test(arr.processingTerm)) {
						this.errFomat = true;
					}

					if (arr.processingTerm && this.errFomat) {
						this.toastError(
							this.$t("message.required_form_processingTerm"),
						);
						this.isSaving = false;
						return;
					}
					if (arr.id == null) {
						arr.stepOrder = stt;
						arr.createdDate = new Date();
						arr.createdName = this.user_current.fullName;
						arr.modifiedDate = new Date();
						arr.modifiedName = this.user_current.fullName;
						arr.created = { id: this.user_current.id };
						arr.modified = { id: this.user_current.id };
						arr.processInfo = this.processes;
						let responsesip = await globalService.postData_Async(
							administratorAPI.API_CreateStepInProcess(),
							arr,
						);
						if (!responsesip || !responsesip.state) {
							this.toastError(this.$t("message.save_error"));
							this.isSaving = false;
							return;
						}
						this.groups[stt - 1] = responsesip.data;
						this.user_in_step.stepInProcess = {
							id: responsesip.data.id,
						};
						if (
							arr.userInStepDTOs &&
							arr.userInStepDTOs.length > 0
						) {
							for (const per of arr.userInStepDTOs) {
								this.user_in_step.userInfo = { id: per.id };
								this.user_in_step.fullName = per.fullName;
								let responseper =
									await globalService.postData_Async(
										administratorAPI.API_CreateUserInStep(),
										this.user_in_step,
									);
								if (!responseper || !responseper.state) {
									this.toastError(
										this.$t("message.save_error"),
									);
									this.isSaving = false;
									return;
								}
							}
						}
					} else {
						arr.modifiedDate = new Date();
						arr.modifiedName = this.user_current.fullName;
						arr.modified = { id: this.user_current.id };
						arr.stepOrder = stt;
						let responsesip = await globalService.putData_Async(
							administratorAPI.API_UpdateStepInProcess(arr.id),
							arr,
						);
						if (!responsesip || !responsesip.state) {
							this.toastError(this.$t("message.save_error"));
							this.isSaving = false;
							return;
						}
						if (
							arr.userInStepDTOs &&
							arr.userInStepDTOs.length > 0
						) {
							for (const per of arr.userInStepDTOs) {
								let responseper;
								if (!per.userInfo) {
									this.user_in_step.stepInProcess = {
										id: responsesip.data.id,
									};
									this.user_in_step.userInfo = { id: per.id };
									this.user_in_step.fullName = per.fullName;
									responseper =
										await globalService.postData_Async(
											administratorAPI.API_CreateUserInStep(),
											this.user_in_step,
										);
									if (!responseper || !responseper.state) {
										this.toastError(
											this.$t("message.save_error"),
										);
										this.isSaving = false;
										return;
									}
								}
							}
						}
					}
					stt++;
				}
				this.toastSuccess(this.$t("message.save_success"));

				await this.getAllStepInProcess();
				await this.getAllStep();
				// await this.getAllUser();
				await this.getAllRank();
				await this.getAllOrganize();
				// await this.getAllProcess();
				// await this.getAllRequest();
				await this.getMailTemplate();
				this.user_in_step = {
					avatar: "",
					created: { id: this.getUserInfo().id },
					createdDate: new Date(),
					createdName: this.getUserInfo().fullName,
					description: "",
					id: null,
					isActive: true,
					modified: { id: this.getUserInfo().id },
					modifiedDate: new Date(),
					modifiedName: this.getUserInfo().fullName,
					stepInProcess: null,
					userInfo: null,
					fullName: "",
				};
				this.m_isSaved = this.isSaved;
				if (this.itemid) {
					this.clickToEdit(this.stepInProcess[0]);
				}
				// if (!this.itemid) {
				// 	this.addColumn();
				// 	this.groups[0].stepInProcessName = "";
				// }
				this.isSaving = false;
				// this.$router.push({ path: "/administrator/quy-trinh" });
			} catch (e) {
				this.toastError(this.$t("message.save_error"));
				this.isSaving = false;
			}
		},
		async clickToEdit(items) {
			if (!items) return;
			this.modelslt = items;
			let s_mailTamplate = this.listMailTemplate.find((entry) => {
				if (items.mailTemplate) {
					return entry.id == this.modelslt.mailTemplate.id;
				}
			});
			let s_mailTamplate_custom = this.listMailTemplate.find((entry) => {
				if (items.mailTemplateCustomer) {
					return entry.id == this.modelslt.mailTemplateCustomer.id;
				}
			});
			let _request = this.listRequesst.find((entry) => {
				return entry.id == this.modelslt.contractType;
			});
			let _process = this.listProcess.find((entry) => {
				return entry.id == this.modelslt.processOfContract;
			});
			let _type = this.filterOptionCreateContract.find((entry) => {
				return entry.key == this.modelslt.createContractType;
			});
			if (_request) {
				this.modelslt.contractType = _request;
			}
			if (_process) {
				this.modelslt.processOfContract = _process;
			}
			if (_type) {
				this.modelslt.createContractType = _type;
			}
			if (s_mailTamplate) {
				this.modelslt.mailTemplate = s_mailTamplate;
			}
			if (s_mailTamplate_custom) {
				this.modelslt.mailTemplateCustomer = s_mailTamplate_custom;
			}
			this.requiredStepInProcessName = "";
			this.indexItems = this.groups.indexOf(items);
			if (!items.userInStepDTOs || items.userInStepDTOs.length == 0) {
				this.userFilters = Object.assign([], this.NguoiXuLy);
			} else {
				this.userFilters = this.NguoiXuLy.filter((e1) => {
					return !items.userInStepDTOs.some((e2) => {
						if (e2.userInfo && e2.userInfo.id)
							return e2.userInfo.id == e1.id;
					});
				});
			}
		},

		addColumn() {
			this.modelslt = Object.assign({}, this.defaultItem);
			this.modelslt.userInStepDTOs = [];
			this.groups.push(this.modelslt);
			this.showOrganize.push(false);
			this.showRank.push(false);
			this.showHandler.push(false);
			this.clickToEdit(this.groups[this.groups.length - 1]);
			this.is_add = true;
		},
		addColumnIndex(index) {
			this.modelslt = Object.assign({}, this.defaultItem);
			this.modelslt.userInStepDTOs = [];
			this.showOrganize.push(false);
			this.showRank.push(false);
			this.showHandler.push(false);
			this.groups.splice(index + 1, 0, this.modelslt);
			this.clickToEdit(this.groups[index + 1]);
			this.is_add = true;
		},
		removeRow(index) {
			if (this.groups[index] && this.groups[index].id != null) {
				this.deleteStepInProcessArr.push(this.groups[index]);

				this.groups.splice(index, 1);
				this.showOrganize.splice(index, 1);
				this.showRank.splice(index, 1);
				this.showHandler.splice(index, 1);
			} else {
				this.groups.splice(index, 1);
				this.showOrganize.splice(index, 1);
				this.showRank.splice(index, 1);
				this.showHandler.splice(index, 1);
			}
			if (index > this.groups.length) {
				this.clickToEdit(this.groups[this.groups.length]);
			} else {
				this.clickToEdit(this.groups[index]);
			}
		},
		removeColumn() {
			if (this.groups[this.groups.length - 1].id != null) {
				this.deleteStepInProcessArr.push(
					this.groups[this.groups.length - 1],
				);
				this.groups.pop();
				this.showOrganize.pop();
				this.showRank.pop();
				this.showHandler.pop();
			} else {
				this.groups.pop();
				this.showOrganize.pop();
				this.showRank.pop();
				this.showHandler.pop();
			}
			this.clickToEdit(this.groups[this.groups.length - 1]);
		},
		removeOrganization(index) {
			if (index != null) {
				this.groups[index].rank = null;
				this.groups[index].userInStepDTOs = [];
			}
			this.modelslt.organization = null;
			this.modelslt.rank = null;

			this.modelslt.userInStepDTOs = [];
			this.modelslt.userInStepDTOs = [];
			this.getAllRank();
			this.getAllUser();
		},
		removeRank(index) {
			if (index != null) {
				this.groups[index].rank = null;
				this.groups[index].userInStepDTOs = [];
			}
			this.modelslt.rank = null;
			this.modelslt.userInStepDTOs = [];
			this.modelslt.userInStepDTOs = [];
			this.getAllUser();
		},
		async selectOrganization(item, index) {
			this.groups[index].organization = item;
			this.showOrganize[index] = false;
			this.groups[index].rank = null;
			this.groups[index].userInStepDTOs = [];
			await this.listArrRank.filter((entry) => {
				if (item.id == entry.id) {
					this.listRank = entry.arr;
					this.isRankLoad = true;
				}
			});
			if (!this.isRankLoad) {
				let responseRank = await globalService.getData_Async(
					administratorAPI.API_GetAllRankByOrganizaionId(item.id),
				);
				if (!responseRank || !responseRank.state) {
					this.toastError(this.$t("error.load"));
					return;
				}
				this.listArrRank.push({
					id: item.id,
					arr: responseRank.data.filter((entry) => {
						return !entry.isDelete && entry.isActive;
					}),
				});
				this.listRank = responseRank.data.filter((entry) => {
					return !entry.isDelete && entry.isActive;
				});
			}
			this.isRankLoad = false;
			this.userFilters = [];
			if (!this.modelslt.rank || !this.modelslt.rank.id) {
				await this.NguoiXuLy.filter((entry) => {
					if (!entry.organizations) {
						return;
					}
					return entry.organizations.some((result) => {
						if (result.id == item.id) {
							this.userFilters.push(entry);
						}
					});
				});
			}

			this.clickToEdit(this.groups[index]);
		},
		async selectRank(item, index) {
			this.groups[index].rank = item;
			this.showRank[index] = false;
			this.groups[index].userInStepDTOs = [];
			this.userFilters = [];
			if (
				!this.groups[index].organization ||
				!this.groups[index].organization.id
			) {
				this.NguoiXuLy.filter((entry) => {
					if (!entry.ranks) {
						return;
					}
					return entry.ranks.some((result) => {
						if (result.id == item.id) {
							this.userFilters.push(entry);
						}
					});
				});
			} else {
				this.NguoiXuLy.filter((entry) => {
					if (!entry.organizations || !entry.ranks) {
						return;
					}
					entry.organizations.some((e1) => {
						entry.ranks.some((e2) => {
							if (
								e1.id == this.groups[index].organization.id &&
								e2.id == item.id
							) {
								this.userFilters.push(entry);
							}
						});
					});
				});
			}

			this.clickToEdit(this.groups[index]);
		},
		selectHandler(item, index) {
			this.groups[index].userInStepDTOs.push(item);
			// this.modelslt.userInStepDTOs.push(item);
			// this.clickToEdit(this.groups[index]);
		},
		async selectOrganizationStep(item) {
			this.modelslt.organization = item;
			this.modelslt.rank = null;
			this.modelslt.userInStepDTOs = [];

			await this.listArrRank.filter((entry) => {
				if (item.id == entry.id) {
					this.listRank = entry.arr;
					this.isRankLoad = true;
				}
			});
			if (!this.isRankLoad) {
				let responseRank = await globalService.getData_Async(
					administratorAPI.API_GetAllRankByOrganizaionId(item.id),
				);
				if (!responseRank || !responseRank.state) {
					this.toastError(this.$t("error.load"));
					return;
				}
				this.listArrRank.push({
					id: item.id,
					arr: await responseRank.data.filter((entry) => {
						return !entry.isDelete && entry.isActive;
					}),
				});
				this.listRank = await responseRank.data.filter((entry) => {
					return !entry.isDelete && entry.isActive;
				});
			}
			this.isRankLoad = false;
			this.userFilters = [];
			if (!this.modelslt.rank || !this.modelslt.rank.id) {
				this.NguoiXuLy.filter((entry) => {
					if (!entry.organizations) {
						return;
					}
					return entry.organizations.some((result) => {
						if (result.id == item.id) {
							this.userFilters.push(entry);
						}
					});
				});
			}
		},
		async selectRankStep(item) {
			this.modelslt.rank = item;
			this.modelslt.userInStepDTOs = [];
			this.userFilters = [];
			if (!this.modelslt.organization || !this.modelslt.organization.id) {
				this.NguoiXuLy.filter((entry) => {
					if (!entry.ranks) {
						return;
					}
					return entry.ranks.some((result) => {
						if (result.id == item.id) {
							this.userFilters.push(entry);
						}
					});
				});
			} else {
				this.NguoiXuLy.filter((entry) => {
					if (!entry.organizations || !entry.ranks) {
						return;
					}
					entry.organizations.some((e1) => {
						entry.ranks.some((e2) => {
							if (
								e1.id == this.modelslt.organization.id &&
								e2.id == item.id
							) {
								this.userFilters.push(entry);
							}
						});
					});
				});
			}
		},
		selectHandlerStep(item) {
			this.modelslt.userInStepDTOs.push(item);
		},
		async removeHandler() {
			// this.userFilters = Object.assign([], this.NguoiXuLy);
			// await this.modelslt.userInStepDTOs.filter((entry) => {
			// 	this.deleteUserInStepArr.push(entry);
			// });
			this.beforeDelete.push(...this.modelslt.userInStepDTOs);
			// this.modelslt.userInStepDTOs = [];
		},
		getElevation(index) {
			return this.indexItems == index ? 2 : 0;
		},
		getClass(index) {
			return this.indexItems == index
				? "grey lighten-2"
				: "grey lighten-3";
		},
		onClickOutside() {
			this.requiredStepInProcessName = "";
			// this.showHandler = [false];
		},
		clickTarget(event) {
			if (!event.target.className.match("v-card__text")) {
				// this.showHandler = [false];
			}
		},
		is_show_detail() {
			if (!this.showName) return "";
			return "showAllText";
		},
		toggle_detail() {
			this.showName = !this.showName;
		},
		is_show_description() {
			if (!this.showDescription) return "";
			return "showAllText";
		},
		toggle_description() {
			this.showDescription = !this.showDescription;
		},

		scrollToView(index) {
			let test = document.getElementById("step" + index);
			if (test[0]) test[0].scrollIntoView();
		},
		onchangeProcessingTerm() {
			if (!this.regex.test(this.modelslt.processingTerm)) {
				this.errorProcessingTerm = this.$t("message.error_format");
				this.errFomat = true;
			} else {
				this.errFomat = false;
				this.errorProcessingTerm = "";
			}
		},
		onchangeStepName() {
			this.requiredStepInProcessName = "";
		},
		onClickOutsideProcessingTerm() {
			if (this.groups.length == 0) return;
			if (!this.modelslt.processingTerm) {
				this.modelslt.processingTerm = "0";
				this.errFomat = false;
				this.errorProcessingTerm = "";
			}
		},
		returnHover() {
			if (this.dragg) {
				return " rounded py-5 bordered-dashed active";
			}
			return "rounded ";
		},
		selectUser() {
			this.openUserInfosRequestData = true;
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
		handleUser(value) {
			// console.log("dữ liệu thêm mới :", value);
			// this.modelslt.userInStepDTOs = [];
			// this.modelslt.userInStepDTOs = Object.assign([], value);
			this.modelslt.userInStepDTOs = this.mergeArray(
				this.modelslt.userInStepDTOs,
				value,
			);
		},
		onClose(value) {
			if (value) {
				this.openUserInfosRequestData = false;
			}
		},
		changeFlagHiden(changeData, index) {
			// changeData: mảng dữ liệu cần thay đổi, index: vị trí cần thay đổi
			Vue.set(changeData, index, !changeData[index]);
		},
	},
	filters: constant.filters,
};
</script>

<style>
.remove-row {
	top: 0;
	right: 0;
	border-radius: 50%;
	position: absolute;
}
.scroll-area {
	max-height: 100vh;
}
.showAllText {
	white-space: normal !important;
}
.on-hover:hover {
	background-color: #e3f2fd;
}
.gr_button {
	display: grid !important;
	position: absolute;
	top: 9rem;
}
.v-menu__content {
	max-width: 20vw !important;
}
</style>
