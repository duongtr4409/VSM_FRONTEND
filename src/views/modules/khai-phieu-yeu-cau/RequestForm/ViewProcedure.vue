<template>
	<v-card flat elevation="0">
		<v-card-text v-if="stepInProcess && stepInProcess.length > 0">
			<v-timeline align-top dense>
				<v-timeline-item
					v-for="(items, index) in stepInProcess"
					:key="items.id"
					small
					fill-dot
					left
					color="green darken-5"
				>
					<div class="mb-2">
						<span
							class="
								text-h6 text-white
								rounded-pill
								green
								lighten-2
								px-10
								py-2
							"
						>
							{{$t('label.step')}} {{ index + 1 }}
						</span>
					</div>
					<Container
						class="white"
						:data-index="index"
						group-name="column"
					>
						<v-card
							flat
							elevation="0"
							class="grey lighten-3 rounded"
							:id="`step` + index"
						>
							<v-card-text class="text--primary">
								<v-form>
									<template>
										<v-row class="subtitle-1 mx-0" dense>
											<v-col cols="2" md="2">
												{{ $t("label.processingTerm") }}
											</v-col>
											<v-col cols="2" md="2">
												<v-text-field
													hide-details
													solo
													outlined
													dense
													readonly
													:rules="[rules.required]"
													v-model="
														items.processingTerm
													"
													:suffix="$t('label.hours')"
												>
												</v-text-field>
											</v-col>
											<v-col cols="1" md="1"> </v-col>
											<v-col cols="1" md="1">
												{{ $t("label.step_name") }}
											</v-col>

											<v-col>
												<v-text-field
													hide-details
													v-model="items.stepDataName"
													solo
													:rules="[rules.required]"
													readonly
													outlined
													dense
												>
												</v-text-field>
											</v-col>
										</v-row>

										<v-row class="subtitle-1 mx-0" dense>
											<v-col cols="2" md="2">
												{{ $t("label.handler") }}
											</v-col>
											<v-col cols="1" md="1"> </v-col>
											<v-col>
												<span
													v-for="item of items.userInfos"
													:key="item.id"
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
														{{ item.fullName }}
													</v-chip>
												</span>
											</v-col>
										</v-row>
									</template>
								</v-form>
							</v-card-text>
						</v-card>
					</Container>
				</v-timeline-item>
			</v-timeline>
		</v-card-text>
	</v-card>
</template>

<script>
import globalService from "@/services/global.service";
import administratorAPI from "../../administrator/administrator.api";
import { Container } from "vue-dndrop";

export default {
	name: "VSMFEProcedureV3",
	components: {
		Container,
	},
	props: { requestDataV2: {} },
	watch: {
		requestDataV2(newValue) {
			this.m_requestDto = newValue;
		},
		async isSaved(value) {
			this.m_isSaved = value;
			if (this.m_isSaved.state === 1) {
				//await this.saveFormData();
			}
		},
	},
	data() {
		return {
			m_requestDto: null,
			stepInProcess: [],
			defaultStepInProcess: [],
			indexItems: 0,
			userFilters: [],
			showUser: [],
			rules: {
				required: (value) => !!value || "Required.",
			},
		};
	},
	async created() {
		this.m_requestDto = this.requestDataV2;
	},

	mounted() {
		this.getStepInProcesses();
	},

	methods: {
		async getStepInProcesses() {
			let response;
			try {
				response = await globalService.getData_Async(
					administratorAPI.API_GetByCurrentSteps(
						this.m_requestDto.id,
					),
				);
				if (!response || !response.state) {
					return;
				}
				this.stepInProcess = response.data.filter((entry) => {
					entry.showHandler = false;
					return entry;
				});
				this.stepInProcess = this.stepInProcess.sort((a, b) => {
					return a.stepOrder - b.stepOrder;
				});
				// this.stepInProcess = this.cloneArray(
				// 	this.stepInProcess,
				// 	this.defaultStepInProcess,
				// );
				//this.idStepData = 1;
				//this.$emit("saveStepData", this.idStepData);
			} catch (error) {
				this.toastError(error);
				return;
			}
		},
	},
};
</script>

<style lang="scss" scoped></style>
