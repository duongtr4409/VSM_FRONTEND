<template>
	<v-card>
		<v-toolbar>
			<v-toolbar-title>
				{{ $t("tab.general_information") }}
			</v-toolbar-title>
			<v-spacer></v-spacer>
			<v-btn icon @click="closeDialog">
				<v-icon>mdi-close</v-icon>
			</v-btn>
		</v-toolbar>
		<v-card-text>
			<v-row class="p-3">
				<v-col cols="12" md="6">
					<v-list-item-content>
						<v-list-item-title class="mb-4 pt-2">
							<strong>{{ $t("label.step_name") }}</strong
							>:
							<em>{{ m_editedItem.stepName }}</em>
						</v-list-item-title>
						<v-list-item-title class="mb-4 pt-2">
							<strong>{{ $t("label.processingTerm") }}</strong
							>:
							<em
								>{{
									m_editedItem.processingTerm
										? m_editedItem.processingTerm
										: 0
								}}
								{{ $t("label.hours") }}</em
							>
						</v-list-item-title>
						<v-list-item-title class="mb-4 pt-2">
							<strong>{{ $t("label.description") }}</strong
							>:
							<em>{{ m_editedItem.description }}</em>
						</v-list-item-title>
						<v-list-item-title class="mb-4 pt-2">
							<strong>{{ $t("label.organization") }}</strong
							>:
							<em
								v-if="
									m_editedItem.organization &&
									m_editedItem.organization.organizationName
								"
								>{{
									m_editedItem.organization.organizationName
								}}
							</em>
						</v-list-item-title>
						<v-list-item-title class="mb-4 pt-2">
							<strong>{{ $t("label.rank") }}</strong
							>:
							<em
								v-if="
									m_editedItem.rank &&
									m_editedItem.rank.rankName
								"
								>{{ m_editedItem.rank.rankName }}</em
							>
						</v-list-item-title>
						<v-list-item-title class="mb-4 pt-2">
							<strong>{{ $t("label.created_name") }}</strong
							>:
							<em>{{ m_editedItem.createdName }}</em>
						</v-list-item-title>
						<v-list-item-title class="mb-4 pt-2">
							<strong>{{ $t("label.created_date") }}</strong
							>:
							<em>{{ m_editedItem.createdDate | dateToString }}</em>
						</v-list-item-title>
						<v-list-item-title class="mb-4 pt-2">
							<strong>{{ $t("label.modified_name") }}</strong
							>:
							<em>{{ m_editedItem.modifiedName }}</em>
						</v-list-item-title>
						<v-list-item-title class="mb-4 pt-2">
							<strong>{{ $t("label.modified_date") }}</strong
							>:
							<em>{{
								m_editedItem.modifiedDate | dateToString
							}}</em>
						</v-list-item-title>
						<v-list-item-title>
							<v-checkbox
								class="mx-0"
								readonly
								v-model="m_editedItem.isActive"
								:label="$t('label.is_active')"
							>
							</v-checkbox>
						</v-list-item-title>
					</v-list-item-content>
				</v-col>
				<v-col cols="12" md="6">
					<v-list-item-content>
						<v-list-item-title class="mb-4 pt-2">
							<strong>{{ $t("label.is_examine") }}</strong
							>:
							<em>{{
								m_editedItem.isExamine
									? $t("button.yes")
									: $t("button.no")
							}}</em>
						</v-list-item-title>
						<v-list-item-title class="mb-4 pt-2">
							<strong>{{ $t("label.is_request_modify") }}</strong
							>:
							<em>
								{{
									m_editedItem.isRequestModify
										? $t("button.yes")
										: $t("button.no")
								}}</em
							>
						</v-list-item-title>
						<v-list-item-title class="mb-4 pt-2">
							<strong>{{ $t("label.is_process_recover") }}</strong
							>:
							<em>{{
								m_editedItem.isProcessRecover
									? $t("button.yes")
									: $t("button.no")
							}}</em>
						</v-list-item-title>
						<v-list-item-title class="mb-4 pt-2">
							<strong>{{ $t("label.required_tfs") }}</strong
							>:
							<em>{{
								m_editedItem.isCreateTFSTask
									? $t("button.yes")
									: $t("button.no")
							}}</em>
						</v-list-item-title>
						<v-list-item-title class="mb-4 pt-2">
							<strong>{{ $t("label.allow_send_email") }}</strong
							>:
							<em>{{
								m_editedItem.isSendMail
									? $t("button.yes")
									: $t("button.no")
							}}</em>
						</v-list-item-title>
						<v-list-item-title class="mb-4 pt-2">
							<strong>{{ $t("label.is_required_signature") }}</strong
							>:
							<em>{{
								m_editedItem.isRequiredSignature
									? $t("button.yes")
									: $t("button.no")
							}}</em>
						</v-list-item-title>
						<v-list-item-title class="mb-4 pt-2">
							<strong>{{ $t("label.is_authorized_approval") }}</strong
							>:
							<em>{{
								m_editedItem.isAuthorizedApproval
									? $t("button.yes")
									: $t("button.no")
							}}</em>
						</v-list-item-title>
					</v-list-item-content>
				</v-col>
			</v-row>
		</v-card-text>

		<v-card-actions>
			<v-spacer></v-spacer>
			<v-btn color="error" class="rounded-pill" dark @click="closeDialog">
				<v-icon>mdi-close</v-icon>
				{{ $t("button.close") }}
			</v-btn>
		</v-card-actions>
	</v-card>
</template>

<script>
export default {
	name: "ViewProcessStep",
	props: { editedItem: {} },
	data() {
		return { m_editedItem: {} };
	},
	watch: {
		editedItem(value) {
			this.m_editedItem = value;
		},
	},
	mounted() {
		this.initialize();
	},
	methods: {
		async initialize() {
			this.m_editedItem = this.editedItem;
		},
	},
};
</script>

<style></style>
