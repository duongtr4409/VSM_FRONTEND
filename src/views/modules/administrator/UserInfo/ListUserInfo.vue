<template>
	<v-card elevation="0">
		<BreadcrumbsVue />
		<v-data-table
			v-model="selected"
			:headers="headers"
			:items="listUserInfo"
			multi-sort
			show-select
			:page="eventPage.page"
			:no-results-text="$t('message.no_results')"
			:server-items-length="countAllItem"
			@pagination="changePage($event)"
		>
			<template
				v-for="header in headers.filter((header) =>
					header.hasOwnProperty('formatter'),
				)"
				v-slot:[`item.${header.value}`]="{ headers, value }"
			>
				{{ header.formatter(value) }}
			</template>
			<template v-slot:[`item.email`]="{ item }">
				<span v-if="item.email && item.email.length > 15">
					<v-tooltip bottom>
						<template v-slot:activator="{ on, attrs }">
							<span v-bind="attrs" v-on="on">
								{{ item.email.slice(0, 15) }}...
							</span>
						</template>
						<span>{{ item.email }}</span>
					</v-tooltip>
				</span>
				<span v-else>
					{{ item.email }}
				</span>
			</template>
			<template v-slot:[`item.roles`]="{ item }">
				<span v-if="item.roles && item.roles.length > 0">
					<em v-for="role of item.roles" :key="role.id">
						{{ role.roleCode }} &nbsp;
					</em>
				</span>
			</template>
			<template v-slot:[`item.organizations`]="{ item }">
				<template v-if="item.showAll">
					<v-chip
						v-for="organization of item.organizations"
						:key="organization.id"
						v-bind="item"
					>
						{{ organization.organizationName }}
					</v-chip>
				</template>
				<template v-else>
					<div
						v-for="(organization, key) of item.organizations"
						v-bind="item"
						:key="organization.id"
					>
						<v-chip v-if="key < 1">
							{{ organization.organizationName }}
						</v-chip>
					</div>
				</template>
				<span
					v-if="
						item.organizations &&
						item.organizations.length > 1 &&
						!item.showAll
					"
					@click="item.showAll = !item.showAll"
				>
					<a href="#"><em>Chi tiết</em></a>
				</span>
				<span
					v-if="
						item.organizations &&
						item.organizations.length > 1 &&
						item.showAll
					"
					@click="item.showAll = !item.showAll"
				>
					<a href="#"><em>Ẩn</em></a>
				</span>
			</template>
			<template v-slot:top>
				<v-dialog v-model="dialog.create" width="70vw" persistent>
					<template v-slot:activator="{ on, attrs }">
						<v-card-title>
							<v-btn
								v-bind="attrs"
								v-on="on"
								text
								class="
									rounded-0
									text-capitalize
									font-weight-regular
								"
							>
								<v-icon small class="mr-2"> mdi-plus </v-icon>

								{{ $t("button.create") }}
							</v-btn>
							<v-btn
								text
								@click="deleteAll"
								class="
									rounded-0
									text-capitalize
									font-weight-regular
								"
							>
								<v-icon small class="mr-2"
									>mdi-trash-can-outline
								</v-icon>
								{{ $t("button.delete_all") }}
							</v-btn>
							<v-btn
								text
								@click="sync"
								class="
									rounded-0
									text-capitalize
									font-weight-regular
								"
							>
								<v-icon small class="mr-2">mdi-sync </v-icon>
								{{ $t("button.sync") }}
							</v-btn>
							<v-spacer></v-spacer>
							<v-btn icon @click="filterExist = !filterExist">
								<v-icon>mdi-filter </v-icon>
							</v-btn>
						</v-card-title>
						<v-divider></v-divider>
					</template>
					<v-card tile>
						<v-card-text>
							<!-- <v-toolbar-title>
								{{ $t("title.information") }}
							</v-toolbar-title> -->
							<v-btn icon @click="close" class="float-right mt-4">
								<v-icon>mdi-close</v-icon>
							</v-btn>
						</v-card-text>
						<v-form ref="form">
							<v-card-text>
								<v-tabs color="blue darken-2" v-model="tab">
									<v-tab @click="tab = 'general_information'">
										<span class="text-black text-none">
											{{ $t("tab.general_information") }}
										</span>
									</v-tab>
									<v-tab
										@click="tab = 'signature_information'"
										:disabled="!userInfoItem.id"
										v-if="!userInfoItem.tennantCode"
									>
										<span class="text-black text-none">
											{{
												$t("tab.signature_information")
											}}
										</span>
									</v-tab>
									<v-tab
										@click="tab = 'role_information'"
										:disabled="!userInfoItem.id"
									>
										<span class="text-black text-none">
											{{ $t("tab.role_information") }}
										</span>
									</v-tab>
									<v-tab
										@click="tab = 'organization'"
										:disabled="!userInfoItem.id"
									>
										<span class="text-black text-none">
											{{ $t("tab.organization") }}
										</span>
									</v-tab>
								</v-tabs>
								<v-divider></v-divider>
								<v-tabs-items v-model="tab">
									<v-tab-item key="general_information">
										<v-row class="mt-4">
											<v-col cols="12" md="6">
												<m-text-field
													:label="
														$t('label.full_name')
													"
													:value="
														userInfoItem.fullName
													"
													@value="
														(v) => {
															userInfoItem.fullName =
																v;
														}
													"
													:rules="[
														() =>
															m_editedItem.stepName.trim() !=
																'' ||
															$t(
																'message.maxlength_required_255',
															),
													]"
													:required="true"
													:readonly="
														userInfoItem.tennantCode
													"
												/>
											</v-col>
											<v-col
												cols="12"
												md="6"
												v-if="
													userInfoItem.id &&
													!userInfoItem.tennantCode
												"
											>
												<v-btn
													text
													class="
														blue
														darkken-2
														float-right
													"
													dark
													@click="resetPassword()"
												>
													{{
														$t(
															"button.reset_password",
														)
													}}
												</v-btn>
											</v-col>
										</v-row>
										<v-row>
											<v-col cols="12" md="6">
												<m-text-field
													:label="
														$t(
															'label.identification',
														)
													"
													:value="
														userInfoItem.identification
													"
													@value="
														(v) => {
															userInfoItem.identification =
																v;
														}
													"
													:required="true"
													:readonly="
														userInfoItem.tennantCode
													"
												/>
											</v-col>
											<v-col cols="12" md="3">
												<m-text-field
													:label="
														$t('label.issue_by')
													"
													:value="
														userInfoItem.issuseOrg
													"
													@value="
														(v) => {
															userInfoItem.issuseOrg =
																v;
														}
													"
													:required="true"
													:readonly="
														userInfoItem.tennantCode
													"
												/>
											</v-col>
											<v-col cols="12" md="3">
												<v-menu
													ref="m_date_menu"
													v-model="showPicker2"
													:close-on-content-click="
														false
													"
													:return-value.sync="
														showPicker2
													"
													transition="scale-transition"
													offset-y
													min-width="auto"
												>
													<template
														v-slot:activator="{
															on,
															attrs,
														}"
													>
														<v-text-field
															ref="m_date_text"
															:value="
																formatModifyDateFns
															"
															dense
															outlined
															readonly
															v-bind="attrs"
															v-on="on"
															append-icon="mdi-calendar"
															:rules="m_rules"
														>
															<template
																v-slot:label
															>
																{{
																	$t(
																		"label.issue_date",
																	)
																}}
																<span
																	class="
																		text-red-600
																	"
																	>{{
																		$t(
																			"label.star",
																		)
																	}}</span
																>
															</template>
														</v-text-field>
													</template>
													<v-date-picker
														v-model="
															userInfoItem.issuseDate
														"
														scrollable
														no-title
														@input="
															showPicker2 = false
														"
														:readonly="
															userInfoItem.tennantCode
														"
													>
													</v-date-picker>
												</v-menu>
											</v-col>
										</v-row>
										<v-row>
											<v-col cols="12" md="3">
												<m-text-field
													:label="$t('label.email')"
													:value="userInfoItem.email"
													@value="
														(v) => {
															userInfoItem.email =
																v;
														}
													"
													:required="true"
													:readonly="
														userInfoItem.tennantCode
													"
												/>
											</v-col>
											<v-col cols="12" md="3">
												<!-- <m-text-field
													:label="
														$t(
															'label.bussiness_phone',
														)
													"
													:value="
														userInfoItem.businessPhones
													"
													@value="
														(v) => {
															userInfoItem.businessPhones =
																v;
														}
													"
													:required="true"
													:readonly="dialog.view"
													
													maxLength="10"
												/> -->
												<v-text-field
													hide-details
													v-model="
														userInfoItem.businessPhones
													"
													outlined
													dense
													maxLength="12"
													:readonly="
														userInfoItem.tennantCode
													"
												>
													<template v-slot:label>
														{{
															$t(
																"label.bussiness_phone",
															)
														}}
														<span
															class="text-red-600"
															>{{
																$t("label.star")
															}}</span
														>
													</template>
												</v-text-field>
											</v-col>
											<v-col cols="12" md="3">
												<!-- <m-text-field
													:label="
														$t('label.mobile_phone')
													"
													:value="
														userInfoItem.mobilePhone
													"
													@value="
														(v) => {
															userInfoItem.mobilePhone =
																v;
														}
													"
													:readonly="dialog.view"
													:phone_number="true"
													maxLength="10"
												/> -->
												<v-text-field
													hide-details
													v-model="
														userInfoItem.mobilePhone
													"
													outlined
													dense
													maxLength="12"
													:readonly="
														userInfoItem.tennantCode
													"
												>
													<template v-slot:label>
														{{
															$t(
																"label.mobile_phone",
															)
														}}
													</template>
												</v-text-field>
											</v-col>
											<v-col cols="12" md="3">
												<m-text-field
													:label="$t('label.fax')"
													:value="userInfoItem.fax"
													@value="
														(v) => {
															userInfoItem.fax =
																v;
														}
													"
													:readonly="
														userInfoItem.tennantCode
													"
												/>
											</v-col>
										</v-row>
										<v-row>
											<v-col cols="12">
												<m-text-field
													:label="$t('label.address')"
													:value="
														userInfoItem.address
													"
													@value="
														(v) => {
															userInfoItem.address =
																v;
														}
													"
													:required="true"
													:readonly="
														userInfoItem.tennantCode
													"
												/>
											</v-col>
										</v-row>
										<v-row>
											<v-col cols="12">
												<m-text-field
													:label="
														$t(
															'label.contact_address',
														)
													"
													:value="
														userInfoItem.contactAddress
													"
													@value="
														(v) => {
															userInfoItem.contactAddress =
																v;
														}
													"
													:required="true"
													:readonly="
														userInfoItem.tennantCode
													"
												/>
											</v-col>
										</v-row>
									</v-tab-item>
									<v-tab-item
										key="signature_information"
										v-if="!userInfoItem.tennantCode"
									>
										<vue-tab
											:tabs="[
												{
													key: 'signature_profile',
													title: $t(
														'label.select_signature_profile',
													),
												},
											]"
											:buttons="[]"
										></vue-tab>
										<v-row class="mt-4">
											<v-col cols="12" md="3">
												<v-select
													:menu-props="{
														bot: true,
														offsetY: true,
													}"
													:items="profiles"
													v-model="profile"
													:label="$t('label.select')"
													item-text="infomation"
													:item-value="(item) => item"
													dense
													outlined
													:no-data-text="
														$t('message.no_results')
													"
												></v-select>
											</v-col>
											<v-col>
												<v-btn
													icon
													@click="createProfile()"
												>
													<v-icon
														color="blue darken-2"
													>
														mdi-plus-circle
													</v-icon>
												</v-btn>
											</v-col>
										</v-row>
										<vue-tab
											:tabs="[
												{
													key: 'signature_profile',
													title: $t(
														'label.signature_profile',
													),
												},
											]"
											:buttons="[]"
										></vue-tab>
										<v-row class="mt-4">
											<v-col cols="12" md="3">
												<m-text-field
													:label="
														$t('label.profile_name')
													"
													:value="profile.infomation"
													@value="
														(v) => {
															profile.infomation =
																v;
														}
													"
													:required="false"
													:readonly="dialog.view"
												/>
											</v-col>
										</v-row>
										<v-row>
											<v-col cols="12" md="3">
												<m-select
													:items="methods"
													:label="
														$t('label.sign_type')
													"
													:value="profile.signType"
													@value="
														(v) =>
															(profile.signType =
																v)
													"
													:required="false"
													:readonly="dialog.view"
												/>
											</v-col>
										</v-row>
										<v-row>
											<v-col cols="12" md="3">
												<m-text-field
													:label="
														$t(
															'label.tin_or_phone_number',
														)
													"
													:value="profile.mstOrSdt"
													@value="
														(v) => {
															profile.mstOrSdt =
																v;
														}
													"
													:required="false"
													:readonly="dialog.view"
												/>
											</v-col>
										</v-row>
										<v-row>
											<v-col cols="12" md="3">
												<m-date-picker
													:label="
														$t(
															'label.issue_date_time',
														)
													"
													:value="profile.expiryDate"
													@value="
														(v) =>
															(profile.expiryDate =
																v)
													"
													format="DD/MM/yyyy"
													:required="false"
													:readonly="dialog.view"
												/>
											</v-col>
										</v-row>
										<v-row>
											<v-col>
												<v-checkbox
													v-model="profile.isDefault"
													label="Đặt làm mặc định"
												></v-checkbox>
											</v-col>
										</v-row>
									</v-tab-item>
									<v-tab-item key="role_information">
										<vue-tab
											:tabs="[
												{
													key: 'rank',
													title: $t('label.rank'),
												},
											]"
											:buttons="[]"
										></vue-tab>
										<vue-select-list
											:disable="!!userInfoItem.tennantCode"

											:items="ranks"
											:selected="userInfoItem.ranks"
											keyName="id"
											valueName="rankName"
											@localUpdate="
												(v) => {
													userInfoItem.ranks = v;
												}
											"
										></vue-select-list>
										<vue-tab
											:tabs="[
												{
													key: 'role',
													title: $t('label.role'),
												},
											]"
											:buttons="[]"
										></vue-tab>
										<vue-select-list
											:items="roles"
											:selected="
												userInfoItem.roles.filter(
													(ele) => !ele.idDelete,
												)
											"
											keyName="id"
											valueName="roleName"
											@localUpdate="
												(v) => {
													userInfoItem.roles = v;
												}
											"
										></vue-select-list>
									</v-tab-item>
									<v-tab-item key="organization">
										<vue-tab
											:tabs="[
												{
													key: 'organizations',
													title: $t(
														'tab.organization',
													),
												},
											]"
											:buttons="[]"
										></vue-tab>
										<vue-select-list
											:items="listOrganization"
											:selected="
												userInfoItem.organizations
											"
											keyName="id"
											valueName="organizationName"
											:disable="!!userInfoItem.tennantCode"
											@localUpdate="
												(v) => {
													userInfoItem.organizations =
														v;
												}
											"
										></vue-select-list>
									</v-tab-item>
								</v-tabs-items>
							</v-card-text>
						</v-form>
						<v-card-actions>
							<v-spacer></v-spacer>
							<v-btn
								elevation="0"
								dark
								@click="save()"
								class="blue darkken-2 rounded-0"
							>
								{{ $t("button.ok") }}
							</v-btn>
							<v-btn
								elevation="0"
								@click="close"
								class="grey lighten-2 rounded-0"
							>
								{{ $t("button.cancel") }}
							</v-btn>
						</v-card-actions>
					</v-card>
				</v-dialog>
			</template>
			<template v-slot:[`item.actions`]="{ item }">
				<!-- <v-icon
					small
					class="mr-2"
					color="primary"
					@click="viewItem(item)"
				>
					mdi-eye
				</v-icon> -->
				<v-icon small class="mr-2" color="blue" @click="editItem(item)">
					mdi-pencil-circle
				</v-icon>
				<v-icon small color="error" @click="deleteItem(item)">
					mdi-close-circle
				</v-icon>
			</template>
			<template v-if="filterExist" v-slot:[`body.prepend`]>
				<v-divider></v-divider>
				<tr>
					<td></td>
					<td>
						<v-text-field
							v-model="user_fullname"
							:placeholder="$t('label.full_name')"
							outlined
							hide-details
							dense
							class="rounded-sm left-[-1rem]"
							maxLength="255"
							@keyup="filterByUserName($event)"
						></v-text-field>
					</td>
					<td>
						<v-text-field
							v-model="user_email"
							:placeholder="$t('label.email')"
							outlined
							hide-details
							dense
							class="rounded-sm left-[-1rem]"
							maxLength="255"
							@keyup="filterByEmail($event)"
						></v-text-field>
					</td>
					<td>
						<v-autocomplete
							:items="listOrganization"
							v-model="user_organize"
							:placeholder="$t('label.organize_use')"
							outlined
							hide-details
							dense
							clearable
							class="rounded-sm left-[-1rem]"
							maxLength="255"
							item-text="organizationName"
							:item-value="(v) => v"
						></v-autocomplete>
					</td>
					<td>
						<v-autocomplete
							v-model="user_roleName"
							item-text="roleCode"
							:items="filterRole"
							hide-details
							:placeholder="$t('label.roleName')"
							:item-value="(item) => item"
							class="rounded-sm left-[-1rem]"
							dense
							clearable
							outlined
							maxLength="255"
						>
						</v-autocomplete>
					</td>
					<td>
						<v-text-field
							v-model="user_bussinessPhone"
							:placeholder="$t('label.numberphone')"
							outlined
							dense
							hide-details
							class="rounded-sm left-[-1rem]"
							maxLength="255"
							@keyup="filterByPhoneNumber($event)"
						></v-text-field>
					</td>
					<td>
						<v-autocomplete
							:menu-props="{ bot: true, offsetY: true }"
							v-model="s_organization"
							hide-details
							item-text="userType"
							:item-value="(item) => item.userType"
							:placeholder="$t('label.filter')"
							outlined
							:items="['Tài Khoản Khách', 'AD 365']"
							single-line
							dense
							class="rounded-sm left-[-1rem]"
							:no-data-text="$t('message.no_results')"
							clearable
						></v-autocomplete>
						<!-- <v-text-field
							v-model="s_organization"
							:placeholder="$t('label.filter')"
							outlined
							hide-details
							dense
							class="rounded-sm left-[-1rem]"
							maxLength="255"
							@keyup="filterByUserType($event)"
						></v-text-field> -->
					</td>
					<td>
						<v-menu
							v-model="showPickerExpiry"
							:close-on-content-click="false"
							transition="scale-transition"
							offset-y
						>
							<template v-slot:activator="{ on, attrs }">
								<v-text-field
									:value="formatExpiryDate"
									clearable
									:placeholder="$t('label.expiry_date')"
									readonly
									hide-details
									v-bind="attrs"
									v-on="on"
									@click:clear="s_expiryDate = null"
									append-icon="mdi-calendar"
									outlined
									dense
									class="rounded-sm left-[-1rem]"
								></v-text-field>
							</template>
							<v-date-picker
								v-model="s_expiryDate"
								@change="showPickerExpiry = false"
								no-title
								scrollable
								range
							></v-date-picker>
						</v-menu>
					</td>
					<td>
						<v-menu
							v-model="showPicker"
							:close-on-content-click="false"
							transition="scale-transition"
							offset-y
						>
							<template v-slot:activator="{ on, attrs }">
								<v-text-field
									:value="formatDateFns"
									clearable
									:placeholder="$t('label.date_create')"
									readonly
									v-bind="attrs"
									hide-details
									v-on="on"
									@click:clear="clearFilterByCreatedDate()"
									append-icon="mdi-calendar"
									outlined
									dense
									class="rounded-sm left-[-1rem]"
								></v-text-field>
							</template>

							<v-date-picker
								v-model="createdDate"
								@change="
									filterByCreatedDate((page = 0), (size = 10))
								"
								no-title
								scrollable
								range
							></v-date-picker>
						</v-menu>
					</td>
					<td></td>
				</tr>
			</template>
		</v-data-table>
		<v-dialog v-model="dialog.delete" width="fit-content" persistent>
			<DeleteDialogVue @close="close" @confirmDelete="deleteAllConfirm" />
		</v-dialog>
	</v-card>
</template>

<script>
import globalService from "@/services/global.service";
import moment from "moment";
import BreadcrumbsVue from "@/components/Breadcrumbs.vue";
import DeleteDialogVue from "@/components/DeleteDialog.vue";
import administratorAPI from "../administrator.api";
import constant from "@/common/constant";

export default {
	name: "ListUserInfo",
	components: {
		BreadcrumbsVue,
		DeleteDialogVue,
	},
	data() {
		return {
			s_organization: "",
			// s_organization: this.$t("label.show_all"),
			filterRole: [],
			showCreateDatePicker: false,
			user_organize: "",
			user_roleName: null,
			user_current: this.getUserInfo(),
			user_fullname: "",
			user_email: "",
			user_bussinessPhone: "",
			s_expiryDate: null,
			createdDate: null,
			showPicker: false,
			showPickerExpiry: false,
			dateFormat: "DD/MM/yyyy",
			// user_createdname: "",
			user_createddate: null,
			is_active: this.$t("label.show_all"),
			filterItems: [
				this.$t("label.show_all"),
				this.$t("label.used"),
				this.$t("label.unused"),
			],
			s_roleCode: "",
			success: false,
			error: false,
			regexNumberPhone: /^[0-9]*$/,
			dialog: {
				create: false,
				view: false,
				delete: false,
			},
			selected: [],
			headers: [
				{
					text: this.$t("label.full_name"),
					value: "fullName",
					filter: (value) => {
						if (!this.user_fullname) return true;
						if (!value) return;
						return this.nonAccentVietnamese(value)
							.toLocaleUpperCase()
							.includes(
								this.nonAccentVietnamese(this.user_fullname)
									.trim()
									.toLocaleUpperCase(),
							);
					},
				},
				{
					text: this.$t("label.email"),
					value: "email",
					filter: (value) => {
						if (!this.user_email) return true;

						if (!value) return;
						return this.nonAccentVietnamese(value)
							.toLocaleUpperCase()
							.includes(
								this.nonAccentVietnamese(this.user_email)
									.trim()
									.toLocaleUpperCase(),
							);
					},
				},
				{
					text: this.$t("label.organize_use"),
					value: "organizations",
					filter: (value) => {
						if (!this.user_organize) return true;

						if (!value) return;
						if (value.length >= 1) {
							return (
								value[0].organizationName ===
								this.user_organize.organizationName
							);
						}
					},
				},
				{
					text: this.$t("label.roleName"),
					value: "roles",
				},
				{
					text: this.$t("label.numberphone"),
					value: "businessPhones",
					filter: (value) => {
						if (!this.user_bussinessPhone.toString().trim())
							return true;
						if (!value) return;
						return value.includes(
							this.user_bussinessPhone.toString().trim(),
						);
					},
				},

				{
					text: this.$t("label.filter"),
					value: "userType",

					filter: (value) => {
						if (this.s_organization == this.$t("label.show_all")) {
							return true;
						}
						if (!value) return;

						return this.nonAccentVietnamese(value).includes(
							this.nonAccentVietnamese(
								this.s_organization,
							).trim(),
						);
					},
					// filter: (value) => {
					// 	if (!this.user_createdname) return true;

					// 	return value
					// 		.toLocaleUpperCase()
					// 		.includes(
					// 			this.user_createdname.toLocaleUpperCase(),
					// 		);
					// },
				},
				{
					text: this.$t("label.issue_date_time"),
					value: "expiryDate",
					formatter: (x) =>
						x ? moment(x).format(this.dateFormat) : null,
					filter: (value) => {
						if (!this.s_expiryDate) return true;
						let values = `${this.s_expiryDate}`.split(
							constant.values.DATE_RANGE_SEPARATOR,
						);
						values = values
							.map((x) => {
								return moment(`${x}`).toDate().getTime();
							})
							.sort((a, b) => a - b);
						let target = moment(value).toDate().getTime();
						return (
							target >= values[0] &&
							target <=
								values[values.length - 1] + 24 * 60 * 60 * 1000
						);
					},
				},
				{
					text: this.$t("label.created_date"),
					value: "createdDate",
					formatter: (x) =>
						x ? moment(x).format(this.dateFormat) : null,
					// filter: (value) => {
					// 	if (!this.createdDate) return true;
					// 	let values = `${this.createdDate}`.split(
					// 		constant.values.DATE_RANGE_SEPARATOR,
					// 	);
					// 	values = values
					// 		.map((x) => {
					// 			return moment(x).toDate().getTime();
					// 		})
					// 		.sort((a, b) => a - b);
					// 	let target = moment(value).toDate().getTime();
					// 	return (
					// 		target >= values[0] &&
					// 		target <=
					// 			values[values.length - 1] + 24 * 60 * 60 * 1000
					// 	);
					// },
				},
				{
					text: this.$t("label.manipulation"),
					value: "actions",
					sortable: false,
				},
			],
			now: new Date(),
			editedIndex: -1,
			userInfoItem: {
				address: "",
				avatar: "",
				businessPhones: "",
				contactAddress: "",
				createdDate: new Date(),
				createdName: "",
				createdOrgName: "",
				createdRankName: "",
				description: "",
				displayName: "",
				email: "",
				expiryDate: null,
				fax: "",
				fullName: "",
				givenName: "",
				id: null,
				idInMicrosoft: "",
				identification: "",
				infoInMicrosoft: "",
				isActive: true,
				isDelete: false,
				isLocked: false,
				issuseDate: null,
				issuseOrg: "",
				jobTitle: "",
				mail: "",
				mobilePhone: "",
				modifiedDate: null,
				modifiedName: "",
				name: "",
				numberOfLoginFailed: 0,
				oDataContext: "",
				officeLocation: "",
				organizations: [],
				password: "",
				passwordEncode: "",
				preferredLanguage: "",
				ranks: [],
				roles: [],
				signType: "",
				signTypeCode: "",
				signTypeName: "",
				surname: "",
				userName: "",
				userPrincipalName: "",
				userType: "",
				userTypeCode: "",
				userTypeName: "",
			},
			defaultItem: {
				address: "",
				avatar: "",
				businessPhones: "",
				contactAddress: "",
				createdDate: new Date(),
				createdName: "",
				createdOrgName: "",
				createdRankName: "",
				description: "",
				displayName: "",
				email: "",
				expiryDate: null,
				fax: "",
				fullName: "",
				givenName: "",
				id: null,
				idInMicrosoft: "",
				identification: "",
				infoInMicrosoft: "",
				isActive: true,
				isDelete: false,
				isLocked: false,
				issuseDate: null,
				issuseOrg: "",
				jobTitle: "",
				mail: "",
				mobilePhone: "",
				modifiedDate: null,
				modifiedName: "",
				name: "",
				numberOfLoginFailed: 0,
				oDataContext: "",
				officeLocation: "",
				organizations: [],
				password: "",
				passwordEncode: "",
				preferredLanguage: "",
				ranks: [],
				roles: [],
				signType: "",
				signTypeCode: "",
				signTypeName: "",
				surname: "",
				userName: "",
				userPrincipalName: "",
				userType: "",
				userTypeCode: "",
				userTypeName: "",
			},
			listUserInfo: [],
			listRole: [],
			tab: "general_information",
			filterExist: false,
			groups: [],
			profiles: [],
			profile: {
				createdDate: null,
				createdName: "",
				createdOrgName: "",
				createdRankName: "",
				description: "",
				expiryDate: null,
				id: null,
				infomation: "",
				isActive: true,
				isDefault: false,
				isDelete: false,
				modifiedDate: null,
				modifiedName: "",
				mstOrSdt: "",
				ownerName: "",
				seriOrCode: "",
				signDataText: "",
				signType: "",
				signTypeCode: "",
				signTypeName: "",
				userInfo: null,
			},
			defaultprofile: {
				createdDate: null,
				createdName: "",
				createdOrgName: "",
				createdRankName: "",
				description: "",
				expiryDate: null,
				id: null,
				infomation: "",
				isActive: true,
				isDefault: false,
				isDelete: false,
				modifiedDate: null,
				modifiedName: "",
				mstOrSdt: "",
				ownerName: "",
				seriOrCode: "",
				signDataText: "",
				signType: "",
				signTypeCode: "",
				signTypeName: "",
				userInfo: null,
			},
			showPicker2: false,
			showPicker3: false,
			methods: [this.$t("label.usb_token"), this.$t("label.sim")],
			ranks: [],
			roles: [],
			listOrganization: [],
			all_user: [],
			listIndexAfterFillter: [],
			date_Format: "yyyy-MM-DD",
			max_page: 0,
			countAllItem: 0,
			eventPage: { page: 1 },
			listDefaultUser: [],
			regex: /^(([^<>()\\[\]\\.,;:\s@"]+(\.[^<>()\\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/,
		};
	},
	async created() {
		await this.getAllRole();
		await this.getAllRank();
		await this.getAllUserGroup();
		// await this.getAll();
		await this.GetAllOrganization();
	},
	mounted() {},

	computed: {
		formatModifyDateFns() {
			return this.userInfoItem.issuseDate
				? moment(this.userInfoItem.issuseDate).format(this.dateFormat)
				: "";
		},
		formatDateFns() {
			if (!this.createdDate) {
				return "";
			}
			let values = `${this.createdDate}`.split(
				constant.values.DATE_RANGE_SEPARATOR,
			);
			let result = [];
			result = values.map((x) => {
				return moment(x).format("DD/MM/yyyy");
			});
			return result.join("~");
		},
		formatExpiryDate() {
			if (!this.s_expiryDate) {
				return null;
			}
			let values = `${this.s_expiryDate}`.split(
				constant.values.DATE_RANGE_SEPARATOR,
			);
			let result = [];
			result = values.map((x) => {
				return moment(x).format("DD/MM/yyyy");
			});
			return result.join("~");
		},
		// formatDateFns() {
		// 	return this.createdDate
		// 		? moment(this.createdDate).format(this.dateFormat)
		// 		: "";
		// },
		issueDate() {
			if (!this.userInfoItem.issuseDate) {
				return "";
			}
			return moment(this.userInfoItem.issuseDate).format("DD/MM/yyyy");
		},
	},
	watch: {
		"dialog.create"(val) {
			if (!val) {
				this.tab = 0;
				// this.profile = Object.assign({}, this.defaultprofile);
				this.close();
			}
		},
		"dialog.view"(val) {
			this.tab = 0;
			// this.profile = Object.assign({}, this.defaultprofile);
			val || this.close();
		},
		"dialog.delete"(val) {
			val || this.close();
		},
		// user_fullname(val) {
		// 	this.isFilter = true;
		// 	this.listUserInfo = this.listDefaultUser.filter((entry) => {
		// 		return this.nonAccentVietnamese(entry.fullName)
		// 			.toLocaleUpperCase()
		// 			.includes(
		// 				this.nonAccentVietnamese(val).toLocaleUpperCase(),
		// 			);
		// 	});
		// },
		// user_email(val) {
		// 	console.log(val);
		// 	this.isFilter = true;
		// 	this.listUserInfo = this.listDefaultUser.filter((entry) => {
		// 		return this.nonAccentVietnamese(entry.email)
		// 			.toLocaleUpperCase()
		// 			.includes(
		// 				this.nonAccentVietnamese(val).toLocaleUpperCase(),
		// 			);
		// 	});
		// },
		user_organize(val) {
			if (!val) {
				console.log(1);
			}
			this.getAllUserInfo(
				this.eventPage.page - 1,
				this.eventPage.itemsPerPage,
				this.createdDate,
			);
		},
		s_organization(val) {
			if (!val) {
				console.log(1);
			}
			this.getAllUserInfo(
				this.eventPage.page - 1,
				this.eventPage.itemsPerPage,
				this.createdDate,
			);
		},
		user_roleName(val) {
			console.log(val);
			if (!val) {
				console.log(1);
			}
			this.getAllUserInfo(
				this.eventPage.page - 1,
				this.eventPage.itemsPerPage,
				this.createdDate,
			);
		},
	},
	methods: {
		async GetAllOrganization() {
			try {
				let response = await globalService.getData_Async(
					administratorAPI.API_FindAllOrganization(),
				);
				if (!response || !response.state) {
					return;
				}
				this.listOrganization = response.data.filter((entry) => {
					return !entry.isDelete;
				});
			} catch (error) {
				console.log(error);
			}
		},
		async getAllRole() {
			let response;
			try {
				response = await globalService.getData_Async(
					administratorAPI.API_GetAllRole(),
				);
				if (!response || !response.state) {
					return;
				}
			} catch (error) {
				console.log(error);
			}
			this.filterRole = response.data.filter((entry) => {
				return !entry.isDelete;
			});
			this.roles = response.data.filter((entry) => {
				return !entry.isDelete;
			});
		},
		async getAll() {
			try {
				let response = await globalService.getData_Async(
					administratorAPI.API_GetAllUserInfo(),
				);
				if (!response || !response.state) {
					return this.toastError(this.$t("error.load"));
				}
				this.listUserInfo = response.data.filter((entry) => {
					entry.showAll = false;
					return !entry.isDelete;
				});
				this.listUserInfo = this.sortList(this.listUserInfo);
			} catch (error) {
				console.log("Error", error);
			}
		},
		async getAllUserGroup() {
			let response;
			try {
				response = await globalService.getData_Async(
					administratorAPI.API_GetAllUserGroup(),
				);
				this.groups = response.data;
			} catch (error) {
				console.log(error);
			}
		},
		async getAllProfile() {
			if (!this.userInfoItem.id) {
				return;
			}
			let response;
			try {
				response = await globalService.getData_Async(
					administratorAPI.API_GetAllSignatureInformation(
						this.userInfoItem.id,
					),
				);
				if (!response || !response.state) return;
				this.profiles = response.data;
				if (this.profiles.length > 0) {
					this.profiles.forEach((entry) => {
						if (entry.isDefault) {
							this.profile = entry;
							this.profile.expiryDate = moment(
								this.profile.expiryDate,
							).toDate();
						}
					});
				}
			} catch (error) {
				console.log(error);
			}
		},
		async createItem() {
			this.userInfoItem.fullName = this.userInfoItem.fullName
				? this.userInfoItem.fullName.trim()
				: this.userInfoItem.fullName;
			this.userInfoItem.identification = this.userInfoItem.identification
				? this.userInfoItem.identification.trim()
				: this.userInfoItem.identification;
			this.userInfoItem.issuseOrg = this.userInfoItem.issuseOrg
				? this.userInfoItem.issuseOrg.trim()
				: this.userInfoItem.issuseOrg;
			this.userInfoItem.email = this.userInfoItem.email
				? this.userInfoItem.email.trim()
				: this.userInfoItem.email;
			this.userInfoItem.businessPhones = this.userInfoItem.businessPhones
				? this.userInfoItem.businessPhones.trim()
				: this.userInfoItem.businessPhones;
			this.userInfoItem.address = this.userInfoItem.address
				? this.userInfoItem.address.trim()
				: this.userInfoItem.address;
			this.userInfoItem.contactAddress = this.userInfoItem.contactAddress
				? this.userInfoItem.contactAddress.trim()
				: this.userInfoItem.contactAddress;
			this.userInfoItem.mobilePhone = this.userInfoItem.mobilePhone
				? this.userInfoItem.mobilePhone.trim()
				: this.userInfoItem.mobilePhone;
			this.userInfoItem.fax = this.userInfoItem.fax
				? this.userInfoItem.fax.trim()
				: this.userInfoItem.fax;

			if (!this.validRequiredText(this.userInfoItem.fullName)) {
				this.toastError(this.$t("user_valid.fullName"));
				return;
			}
			if (!this.validRequiredText(this.userInfoItem.identification)) {
				this.toastError(this.$t("user_valid.identification"));
				return;
			}
			if (!this.validRequiredText(this.userInfoItem.issuseOrg)) {
				this.toastError(this.$t("user_valid.issuseOrg"));
				return;
			}
			if (!this.validRequiredText(this.userInfoItem.issuseDate)) {
				this.toastError(this.$t("user_valid.issuseDate"));
				return;
			}
			if (!this.validRequiredText(this.userInfoItem.email)) {
				this.toastError(this.$t("user_valid.email"));
				return;
			}
			if (!this.regex.test(this.userInfoItem.email)) {
				return this.toastError(this.$t("user_valid.email_format"));
			}

			if (!this.validRequiredText(this.userInfoItem.businessPhones)) {
				this.toastError(this.$t("user_valid.businessPhones"));
				return;
			}
			if (!this.regexNumberPhone.test(this.userInfoItem.businessPhones)) {
				this.toastError(this.$t("user_valid.format_businessPhones"));
				return;
			}
			if (
				!this.regexNumberPhone.test(this.userInfoItem.mobilePhone) &&
				this.userInfoItem.mobilePhone
			) {
				this.toastError(this.$t("user_valid.format_mobile"));
				return;
			}
			if (!this.validRequiredText(this.userInfoItem.address)) {
				this.toastError(this.$t("user_valid.address"));
				return;
			}
			if (!this.validRequiredText(this.userInfoItem.contactAddress)) {
				this.toastError(this.$t("user_valid.contactAddress"));
				return;
			}
			if (!this.userInfoItem.id) {
				let check_email = this.listUserInfo.some((entry) => {
					if (!entry.email) return;
					return entry.email
						.toLocaleUpperCase()
						.match(
							this.userInfoItem.email.toLocaleUpperCase().trim(),
						);
				});
				if (check_email) {
					this.toastError("Email này đã được sử dụng");
					return;
				}
			}
			if (!this.validText(this.userInfoItem.mobilePhone)) {
				return;
			}
			if (!this.validText(this.userInfoItem.fax)) {
				return;
			}
			if (
				moment(this.userInfoItem.issuseDate).toDate().getTime() >
				this.now.getTime()
			) {
				return this.toastError(this.$t("date_valid.bigger_issueDate"));
			}
			let response;
			try {
				this.userInfoItem.modifiedName = this.user_current.fullName;
				this.userInfoItem.createdName = this.user_current.fullName;
				this.userInfoItem.issuseDate = moment(
					this.userInfoItem.issuseDate,
				).toDate();
				if (this.userInfoItem.id) {
					this.userInfoItem.modifiedDate = new Date();
					this.userInfoItem.modifiedName = this.user_current.fullName;
					console.log("this.userInfoItem 1995", this.userInfoItem);
					response = await globalService.putData_Async(
						"/api/user-infos/" + this.userInfoItem.id,
						this.userInfoItem,
					);
					if (!response || !response.state) {
						return;
					}
					if (!response || !response.state) {
						this.toastError(this.$t("message.update_error"));
						return;
					}
					this.userInfoItem = response.data;
					this.toastSuccess(this.$t("message.update_success"));
				} else {
					this.userInfoItem.createdDate = new Date();
					this.userInfoItem.createdName = this.user_current.fullName;
					this.userInfoItem.expiryDate = new Date();
					response = await globalService.postData_Async(
						"/api/user-infos",
						this.userInfoItem,
					);
					if (!response || !response.state) {
						this.toastError(this.$t("message.add_error"));
						return;
					}
					this.userInfoItem = response.data;
					this.toastSuccess(this.$t("message.add_success"));
				}
				// this.getAll();
				this.getAllUserInfo(
					constant.page,
					constant.page_size,
					this.createdDate,
				);
			} catch (error) {
				console.log("Error", error);
			}
		},
		close() {
			this.dialog.create = false;
			this.dialog.delete = false;
			this.dialog.view = false;
			this.$nextTick(() => {
				this.userInfoItem = Object.assign({}, this.defaultItem);
				this.editedIndex = -1;
			});
		},
		async editItem(item) {
			this.editedIndex = this.listUserInfo.indexOf(item);
			this.userInfoItem = Object.assign({}, item);
			this.dialog.create = true;
			await this.getAllProfile(this.userInfoItem.id);
		},
		viewItem(item) {
			this.editedIndex = this.listUserInfo.indexOf(item);
			this.userInfoItem = Object.assign({}, item);
			this.dialog.create = true;
			this.dialog.view = true;
		},
		sortList(arr) {
			return arr.sort((a, b) => {
				return (
					moment(b.createdDate).toDate().getTime() -
					moment(a.createdDate).toDate().getTime()
				);
			});
		},
		async deleteAllConfirm() {
			this.selected = this.selected.map((x) => {
				x.isDelete = true;
				return x;
			});
			try {
				let response = await globalService.postData_Async(
					administratorAPI.API_SaveAllUserInfo(),
					this.selected,
				);
				if (!response || !response.state) {
					this.toastError(this.$t("message.delete_error"));
				} else {
					this.toastSuccess(this.$t("message.delete_success"));
				}
			} catch (error) {
				this.toastError(this.$t("error.load"));
			} finally {
				this.selected = [];
				// this.getAll();
				this.getAllUserInfo(
					constant.page,
					constant.page_size,
					this.createdDate,
				);
				this.close();
			}
		},
		deleteItem(item) {
			this.selected = [item];
			this.dialog.delete = true;
		},
		onConfirmDelete(value) {
			if (!value) {
				this.close();
			} else {
				if (this.selected) {
					this.deleteAllConfirm();
				}
			}
		},
		deleteAll() {
			if (this.selected.length > 0) {
				this.dialog.delete = true;
			} else {
				this.toastError(this.$t("label.no_selected"));
			}
		},
		createProfile() {
			// this.$refs.form.reset();
			this.profile = Object.assign({}, this.defaultprofile);
		},
		async saveProfiles() {
			if (!this.validRequiredText(this.profile.infomation)) {
				return;
			}
			if (!this.validRequiredText(this.profile.signType)) {
				return;
			}
			if (!this.validRequiredText(this.profile.mstOrSdt)) {
				return;
			}
			if (!this.validRequiredText(this.profile.expiryDate)) {
				return;
			}
			this.profile.modifiedName = this.getUserInfo().fullName;
			this.profile.modifiedDate = new Date();
			let _expiryDate = this.profile.expiryDate;
			this.profile.expiryDate = moment(_expiryDate).toDate();
			if (!this.profile.id) {
				this.profile.createdName = this.getUserInfo().fullName;
				this.profile.createdDate = new Date();
				this.profile.userInfo = this.userInfoItem;
				let response;
				try {
					response = await globalService.postData_Async(
						administratorAPI.API_CreateSignatureInformation(),
						this.profile,
					);
					this.profile.expiryDate = moment(
						this.profile.expiryDate,
					).format(this.date_Format);
					if (!response || !response.state) {
						this.toastError(this.$t("message.add_error"));

						return;
					}
					this.toastSuccess(this.$t("message.add_success"));
					this.profiles.push(response.data);
				} catch (error) {
					console.log(error);
				}
			} else {
				let response;
				try {
					response = await globalService.putData_Async(
						administratorAPI.API_SaveSignatureInformation(
							this.profile.id,
						),
						this.profile,
					);
					this.profile.expiryDate = moment(
						this.profile.expiryDate,
					).format(this.date_Format);
					if (!response || !response.state) {
						this.toastError(this.$t("message.update_error"));
						return;
					}
					this.toastSuccess(this.$t("message.update_success"));
				} catch (error) {
					console.log(error);
				}
			}

			// this.tab = 2;
		},
		async save() {
			if (this.tab == 1) {
				await this.saveProfiles();
			} else {
				await this.createItem();
			}
		},
		format(value) {
			if (!value) {
				return "";
			}
			return moment(value).format(this.dateFormat);
		},
		// async getAllRole() {
		// 	let response;
		// 	try {
		// 		response = await globalService.getData_Async(
		// 			administratorAPI.API_GetAllRole(),
		// 		);
		// 		if (!this.preHandleResponse(response)) {
		// 			return;
		// 		}
		// 		this.roles = response.data.filter((x) => !x.isDelete);
		// 	} catch (error) {
		// 		this.toastError(error);
		// 	}
		// },
		async getAllRank() {
			let response;
			try {
				response = await globalService.getData_Async(
					administratorAPI.API_GetAllRank(),
				);
				if (!this.preHandleResponse(response)) {
					return;
				}
				this.ranks = response.data.filter((x) => !x.isDelete);
			} catch (error) {
				this.toastError(error);
			}
		},
		handleRank(value) {
			this.userInfoItem.ranks = value;
		},
		handleRole(value) {
			this.userInfoItem.roles = value;
		},
		async resetPassword() {
			try {
				let response = await globalService.postData_Async(
					administratorAPI.API_ResetPasswordUser(),
					this.userInfoItem,
				);
				if (!response || !response.state)
					return this.toastError(this.$t("message.update_error"));
				else {
					this.toastSuccess(this.$t("message.update_success"));
				}
			} catch (error) {
				console.log(error);
			}
			// this.getAll();
			this.getAllUserInfo(constant.page, constant.page_size);
		},
		async getAllUserInfo(page, size, createdDate) {
			let _org = null;
			let _role = null;
			let _userType = null;
			let param = createdDate
				? new Date(createdDate[1]).toISOString().split("T")[0] +
				  "T23:59:59.999Z"
				: null;
			if (this.user_organize) {
				_org = [{ id: this.user_organize.id }];
			}
			if (this.user_roleName) {
				_role = [{ id: this.user_roleName.id }];
			}
			if (this.s_organization) {
				_userType = this.s_organization;
			}
			let response;
			let reqBody = {
				isDelete: "false",
				isActive: "true",
				fullName: this.user_fullname,
				email: this.user_email,
				organizations: _org,
				roles: _role,
				businessPhones: this.user_bussinessPhone,
				userType: _userType,
				createdDate: createdDate
					? new Date(createdDate[0]).toISOString()
					: "",
			};
			try {
				response = await globalService.postData_Async(
					administratorAPI.SearchAllUserInfoByDate(page, size, param),
					reqBody,
				);
				if (!response) {
					return this.toastError(this.$t("error.load"));
				}
				this.listUserInfo = response.data.listData.filter((entry) => {
					entry.showAll = false;
					return entry;
				});
			} catch (error) {
				console.log(error);
			}
			this.countAllItem = response.data.total;
			this.listUserInfo = this.sortList(this.listUserInfo);

			this.listDefaultUser = this.listUserInfo;
		},
		changePage(event) {
			this.eventPage = event;
			if (event.itemsPerPage == -1) {
				event.itemsPerPage = 100;
			}
			this.getAllUserInfo(
				event.page - 1,
				event.itemsPerPage,
				this.createdDate,
			);
			return;
		},
		async sync() {
			let response;
			try {
				response = await globalService.postData_Async(
					administratorAPI.API_SyncUsers(this.userInfo.id),
					{},
				);
				if (!response || !response.state) {
					this.toastError(this.$t("error.sync"));
					return;
				}
				this.toastSuccess(this.$t("success.sync"));
				// await this.getAll();
				this.getAllUserInfo(
					constant.page,
					constant.page_size,
					this.createdDate,
				);
			} catch (error) {
				console.error(error);
			}
		},
		filterByUserName(event) {
			if (
				event.code == constant.keys.enter ||
				event.keyCode == constant.keys.enter_keyCode ||
				!event.target.value
			) {
				this.eventPage.page = 1;
				this.getAllUserInfo(
					this.eventPage.page - 1,
					this.eventPage.itemsPerPage,
					this.createdDate,
				);
			}
		},
		filterByEmail(event) {
			if (
				event.code == constant.keys.enter ||
				event.keyCode == constant.keys.enter_keyCode ||
				!event.target.value
			) {
				this.eventPage.page = 1;
				this.getAllUserInfo(
					this.eventPage.page - 1,
					this.eventPage.itemsPerPage,
					this.createdDate,
				);
			}
		},
		filterByUserType(event) {
			if (
				event.code == constant.keys.enter ||
				event.keyCode == constant.keys.enter_keyCode ||
				!event.target.value
			) {
				this.eventPage.page = 1;
				this.getAllUserInfo(
					this.eventPage.page - 1,
					this.eventPage.itemsPerPage,
					this.createdDate,
				);
			}
		},
		filterByPhoneNumber(event) {
			if (
				event.code == constant.keys.enter ||
				event.keyCode == constant.keys.enter_keyCode ||
				!event.target.value
			) {
				this.eventPage.page = 1;
				this.getAllUserInfo(
					this.eventPage.page - 1,
					this.eventPage.itemsPerPage,
					this.createdDate,
				);
			}
		},
		filterByCreatedDate() {
			this.showPicker = false;
			this.getAllUserInfo(
				this.eventPage.page - 1,
				this.eventPage.itemsPerPage,
				this.createdDate,
			);
		},
		clearFilterByCreatedDate() {
			this.createdDate = null;
			this.eventPage.page = 1;
			this.getAllUserInfo(
				this.eventPage.page - 1,
				this.eventPage.itemsPerPage,
				this.createdDate,
			);
		},
	},
};
</script>
<style></style>
