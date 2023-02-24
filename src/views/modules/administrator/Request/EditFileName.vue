<template>
	<v-card elevation="0">
        <v-row @click="closeList()">
            <v-col cols="6"  @click="closeList()">
                <v-row class="mt-2" @click="closeList()">
                    <v-col cols="11" md="11">
                        <strong>
                            {{ $t("label.code_generation_filename") }}
                            <!-- <span class="text-red-500">
                                {{ $t("label.star") }}
                            </span> -->
                        </strong>
                        <v-divider class="mb-2"></v-divider>
                    </v-col>
                    <v-col
                        cols="11"
                        sm="11"
                        md="11"
                        class="ruleGenerateCodes"
                    >
                        <div class="rounded border-2 p-2 w-full">
                            <v-chip
                                class="m-2"
                                v-for="(
                                    item, index
                                ) in ruleGenerateCodeFileName"
                                :key="index + item"
                            >
                                {{ item }}
                                <v-icon
                                    @click="
                                        delete_item_code_filename(index)
                                    "
                                    >mdi-close-circle</v-icon
                                >
                            </v-chip>
                            <v-text-field
                                v-model="textCodeFileName"
                                @keyup="keyUpRuleFilename($event)"
                                dense
                                :outlined="false"
                                @click="
                                    toggleListCodeFilename();
                                    action($event);
                                    false;
                                "
                            ></v-text-field>
                        </div>
                        <div>
                            <span>{{ $t("") }}</span>
                        </div>
                        <v-card
                            elevation="2"
                            v-if="toggle_list_code_filename"
                            class="
                                generateCodeOption
                                overflow-scroll overflow-x-hidden
                                h-80
                            "
                            @click="
                                action($event);
                                false;
                            "
                        >
                            <v-list-item-group>
                                <v-list-item
                                    v-for="(
                                        item, i
                                    ) in generateCodeFilename"
                                    :key="i"
                                    @click="clickItemCodeFilename(item.variable)"
                                >
                                    {{ item.name }}
                                </v-list-item>
                            </v-list-item-group>
                        </v-card>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col>
                        <v-spacer></v-spacer>
                        <v-btn
                            color="blue darken-1"
                            dark
                            class="rounded-0"
                            @click="save()"
                        >
                            <v-icon> mdi-content-save</v-icon>
                            {{ $t("button.save") }}
                        </v-btn></v-col
                    >
                </v-row>
            </v-col>
        </v-row>
	</v-card>
</template>

<script>
import RequestDto from "@/models/request.dto";
import globalService from "@/services/global.service";
import administratorAPI from "../administrator.api";
export default {
	name: "EditFileName",
	props: {
		requestDto: {},
	},
	computed: {},
	watch: {
        requestDto(value) {
			if (value) {
				this.m_requestDto = value;
			}
		},
        m_requestDto(val) {
			val || this.resetRequestDto();
			if (val) {
				this.ruleGenerateCodeFileName = [];
				if (
					this.m_requestDto.ruleGenerateAttachName &&
					this.m_requestDto.ruleGenerateAttachName.length > 0
				) {
					let arr = this.m_requestDto.ruleGenerateAttachName
						.split("$")
						.filter((ele) => ele.length > 0);
					for (let i in arr) {
						let itemTextCode = arr[i];
						if (
							itemTextCode[0] == "{" &&
							itemTextCode[itemTextCode.length - 1] != "}"
						) {
							let index = itemTextCode.indexOf("}");
							this.ruleGenerateCodeFileName.push(
								itemTextCode.slice(1, index),
							);
							this.ruleGenerateCodeFileName.push(
								itemTextCode.slice(
									index + 1,
									itemTextCode.length,
								),
							);
						}
						if (
							itemTextCode[0] == "{" &&
							itemTextCode[itemTextCode.length - 1] == "}"
						) {
							this.ruleGenerateCodeFileName.push(
								itemTextCode.slice(1, itemTextCode.length - 1),
							);
						}
						if (
							itemTextCode[0] != "{" &&
							itemTextCode[itemTextCode.length - 1] == "}"
						) {
							let index = itemTextCode.indexOf("{");
							this.ruleGenerateCodeFileName.push(
								itemTextCode.slice(0, index),
							);
							this.ruleGenerateCodeFileName.push(
								itemTextCode.slice(
									index,
									itemTextCode.length - 1,
								),
							);
						}
						if (
							itemTextCode[0] != "{" &&
							itemTextCode[itemTextCode.length - 1] != "}"
						) {
							this.ruleGenerateCodeFileName.push(
								itemTextCode.slice(0, itemTextCode.length),
							);
						}
					}
					this.ruleGenerateCodeFileName = this.ruleGenerateCodeFileName.filter(
						(ele) => ele.length > 0,
					);
				}
			}
		},

	},
	data() {
		return {
			ruleGenerateCodeFileName: [],
            m_requestDto: RequestDto,
            generateCodeFilename: [],
            textCodeFileName: "",
            toggle_list_code_filename: false,
		};
	},
	created() {
        this.initialize()
	},
	mounted() {

	},
	methods: {
		initialize() {
			try {
                this.m_requestDto = this.requestDto;
                this.getAllCodeAttachName();
			} catch (error) {
				console.log(error);
			}
		},
        async getAllCodeAttachName() {
			try {
				let response = await globalService.getData_Async(
					administratorAPI.API_GetCodeAttachNameV2(this.m_requestDto.id),
				);
				if (!response || !response.state) {
					return;
				}
				this.generateCodeFilename = response.data;
				// console.log("this.generateCodeFilename", this.generateCodeFilename)
			} catch (error) {
				console.log(error);
			}
		},
		async save() {
			try {
                let response;
			    let editing = !!this.m_requestDto.id;
                if(editing){
                    if (this.ruleGenerateCodeFileName.length > 0) {
						for (let i in this.ruleGenerateCodeFileName) {
							if (
								this.generateCodeFilename.findIndex(
									ele => ele.variable == "${" +
									this.ruleGenerateCodeFileName[i] +
									"}"
								) != -1
							) {
								this.ruleGenerateCodeFileName[i] =
									"${" +
									this.ruleGenerateCodeFileName[i] +
									"}";
							}
						}
					}
					this.m_requestDto.ruleGenerateAttachName =
						this.ruleGenerateCodeFileName.join("");
                    this.m_requestDto.modified = this.getUserInfo();
			        this.m_requestDto.modifiedDate = new Date();
                    response = await globalService.putData_Async(
						administratorAPI.API_SaveRequest(this.m_requestDto.id),
						this.m_requestDto,
					);
					if (!response) {
						return this.toastError(this.$t("message.update_error"));
					}
					if (!response.state) {
						return this.toastError(this.$t("message.update_error"));
					}
					this.toastSuccess(this.$t("message.update_success"));
                }else{
                    if (this.ruleGenerateCodeFileName.length > 0) {
						for (let i in this.ruleGenerateCodeFileName) {
							if (
								this.generateCodeFilename.findIndex(
									ele => ele.variable == "${" +
									this.ruleGenerateCodeFileName[i] +
									"}"
								) != -1
							) {
								this.ruleGenerateCodeFileName[i] =
									"${" +
									this.ruleGenerateCodeFileName[i] +
									"}";
							}
						}
					}
					this.m_requestDto.ruleGenerateAttachName =
						this.ruleGenerateCodeFileName.join("");
                    this.m_requestDto.created = this.getUserInfo();
					this.m_requestDto.createdName =
						this.getUserInfo().createdName;
                    response = await globalService.postData_Async(
						administratorAPI.API_CreateRequest(),
						this.m_requestDto,
					);

					if (!response) {
						return this.toastError(this.$t("message.add_error"));
					}
					if (!response.state) {
						return this.toastError(this.$t("message.add_error"));
					}
					this.toastSuccess(this.$t("message.add_success"));
                }
                this.m_requestDto = response.data;
				this.$emit("save", this.m_requestDto);
			} catch (error) {
				this.toastError(error);
			}
		},
        resetRequestDto() {
			this.m_requestDto = RequestDto;
		},
        clickItemCodeFilename(item) {
            let itemSave = item.slice(2, item.length - 1)
			this.ruleGenerateCodeFileName.push(itemSave);
		},
        delete_item_code_filename(index) {
			this.ruleGenerateCodeFileName.splice(index, 1);
		},
        keyUpRuleFilename(event) {
			if (event.keyCode == 13 && event.target.value.trim().length > 0) {
				this.ruleGenerateCodeFileName.push(event.target.value);
				this.textCodeFileName = "";
			}
		},
        toggleListCodeFilename() {
			this.toggle_list_code_filename = true;
			this.getAllCodeAttachName();
		},
        action(event) {
			event.stopPropagation();
		},
		closeList() {
			this.toggle_list_code_filename = false;
		},
	},
};
</script>

<style></style>
