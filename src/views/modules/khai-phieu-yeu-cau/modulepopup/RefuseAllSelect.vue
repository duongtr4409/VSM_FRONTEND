<template>
	<v-card elevation="0" ref="form">
		<v-toolbar flat color="grey lighten-4 max-h-[2.5rem]">
			<v-toolbar-title class="mb-5"> {{ $t("button.return_old") }} </v-toolbar-title>
			<v-spacer></v-spacer>
			<v-btn icon @click="close" class="mb-5">
				<v-icon>mdi-close</v-icon>
			</v-btn>
		</v-toolbar>
		<v-card-text class="white">
			<v-container>
				<v-form v-model="valid">
					<v-row>
						<v-col cols="12" sm="12" md="12">
							<v-textarea
								dense
								outlined
								v-model="refuseRequestDto.reason"
								maxLength="500"
								hide-details
							>
								<template v-slot:label>
									{{ $t("label.mail_template_content") }}
									<span class="red--text">
										{{ $t("label.star") }}
									</span>
								</template>
							</v-textarea>
						</v-col>
						<!-- <v-col cols="12" sm="12" md="12">
							<v-file-input
								ref="file"
								:label="$t('label.attachment_file')"
								outlined
								dense
								@change="handleFileUpload($event)"
								:error-messages="errorMessageFile"
								chips
								multiple
								small-chips
								truncate-length="20"
							>
							</v-file-input>
						</v-col> -->
						<v-col cols="12" sm="12" md="12">
							<v-card
								elevation="0"
								dropzone
								:class="
									!isDragOver
										? 'bordered bordered-solid'
										: 'bordered bordered-dashed background-active'
								"
								class="items-center p-0"
								@drop="onDrop($event)"
								@dragenter="onDragEnter($event)"
								@dragleave="onDragLeave($event)"
								@dragover="onDragOver($event)"
								@dragend="onDragEnd($event)"
								@click="onClick($event)"
								style="box-sizing: border-box"
							>
								<div
									class="
										d-flex
										justify-space-between
										border-2
										px-2
									"
								>
									<v-card-text>
										{{ $t("Tải lên") }}
									</v-card-text>
									<v-divider vertical></v-divider>
									<v-icon x-large class="ml-4"
										>mdi-cloud-upload-outline
									</v-icon>
								</div>
							</v-card>
							<input
								ref="files"
								id="filesRefuseAll"
								type="file"
								accept=".xlsx,.docx,.pptx,.pdf"
								class="d-none"
								multiple
								@change="handleFile($event)"
							/>
							<VuePerfectScrollbar class="h-60">
								<v-list>
									<v-list-item
										v-for="file in files"
										:key="file.name"
									>
										<v-list-item-icon>
											<!-- <v-icon>
														{{
															m_files_icon[
																file.type
															]
														}}
													</v-icon> -->
											<v-icon>
												{{
													m_files_icon[
														file.name.split(".")[
															file.name.split(".")
																.length - 1
														]
													]
												}}
											</v-icon>
										</v-list-item-icon>
										<v-list-item-title>
											{{ file.name }}
										</v-list-item-title>
										<v-list-item-icon>
											<v-icon
												color="red darken-2"
												@click="remove(file)"
											>
												mdi-delete-circle
											</v-icon>
										</v-list-item-icon>
									</v-list-item>
								</v-list>
							</VuePerfectScrollbar>
						</v-col>
					</v-row>
				</v-form>
			</v-container>
		</v-card-text>
		<v-card-actions class="white">
			<v-spacer></v-spacer>
			<v-btn
				color="blue darken-1"
				elevation="0"
				dark
				@click="refuseRequest_All()"
			>
				{{ $t("button.ok") }}
			</v-btn>
			<v-btn color="grey lighten-4" elevation="0" @click="close">
				{{ $t("button.cancel") }}
			</v-btn>
		</v-card-actions>
	</v-card>
</template>

<script>
import globalService from "@/services/global.service";
import administratorAPI from "../../administrator/administrator.api";
import ApproveDto from "@/models/approve.dto";
import constant from "@/common/constant";

export default {
	name: "VsmFeRefuserequestform",
	props: { _selected: [] },
	watch: {
		_selected(newValue) {
			this.m_selected = newValue;
		},
	},

	data() {
		return {
			file: null,
			m_requestData: null,
			refuseRequestDto: ApproveDto,
			user_info: this.getUserInfo(),
			attachmentFiles: [],
			files: [],
			m_selected: [],
			results: [],
		};
	},

	mounted() {},
	created() {
		this.m_selected = this._selected;
	},

	methods: {
		close() {
			this.$emit("close", true);
			this.refuseRequestDto.reason = "";
			this.files = [];
		},
		handleFileUpload(event) {
			this.file = event;
		},
		async refuseRequest_All() {
			this.refuseRequestDto.reason = this.refuseRequestDto.reason.trim();
			this.results = [];
			if (!this.refuseRequestDto.reason) {
				return this.toastError(this.$t("message.empty_requestContent"));
			}
			// if (this.refuseRequestDto.reason > 500) {
			// 	return this.toastError(
			// 		this.$t("message.maxlength_required_500"),
			// 	);
			// }
			try {
				for (const item of this.m_selected) {
					let result = await this.refuseRequest(item);
					if (!result || !result.state) {
						this.results.push({
							item: item,
							data: this.$t("message.not_success"),
						});
					} else {
						result.item = item;
						this.results.push(Object.assign({}, result));
					}
				}
			} catch (error) {
				console.log(error);
			}
			this.close();
			this.$emit(constant.keys.close, this.results);
		},
		async refuseRequest(item) {
			let response;
			this.refuseRequestDto.action = "Refuse";
			this.refuseRequestDto.errorMessageReturn = this.$t("error.fail");
			this.refuseRequestDto.requestDataId = item.id;
			this.refuseRequestDto.successMessageReturn = this.$t("message.success");
			this.refuseRequestDto.userId = this.user_info.id;
			this.refuseRequestDto.attachmentFileId = this.attachmentFiles;

			try {
				response = await globalService.postData_Async(
					administratorAPI.API_Approve(),
					this.refuseRequestDto,
				);
				if (!this.files.length == 0) {
					await this.upload(item);
				}
				return response;
			} catch (error) {
				console.log(error);
			} finally {
				this.refuseRequestDto.reason = "";
				this.files = [];
			}
			
		},
		handleFile(files) {
			for (let i in Array.from(files.target.files)) {
				if(!this.files.find(ele => (ele.name == Array.from(files.target.files)[i].name))) {
					this.files.push(Array.from(files.target.files)[i])					
				}
			}
			for (let file of this.files) {
				let ext = file.name.split(".").pop();
				let arr = ["docx", "pdf", "xlsx", "pptx", "jpg", "jpeg"];
				if (!arr.includes(ext)) {
					return (
						this.toastError(this.$t("error.extFile")),
						(this.files = null)
					);
				}
			}
			files.target.value = null;
		},
		onDrop(event) {
			event.preventDefault();
			this.isDragOver = false;
			if (event.dataTransfer) {
				this.files = Array.from(event.dataTransfer.files);
			}
		},
		onDragEnd(event) {
			event.preventDefault();
			this.isDragOver = false;
		},
		onDragEnter(event) {
			event.preventDefault();
			this.isDragOver = true;
		},
		onDragLeave(event) {
			event.preventDefault();
			this.isDragOver = false;
		},
		onDragOver(event) {
			event.preventDefault();
			this.isDragOver = true;
		},
		onClick(event) {
			event.preventDefault();
			let files = document.getElementById("filesRefuseAll");
			files.click();
		},
		remove(file) {
			let index = this.files.indexOf(file);
			this.files.splice(index, 1);
		},
		async upload(item) {
			if (!this.files.length) {
				return;
			}

			let response;
			try {
				for (let file of this.files) {
					
					response = await globalService.uploadData_Async(
						administratorAPI.API_UploadFile365(),
						file,
						{
							parentItemId: item?.idDirectoryPath,
							userId: this.userInfo.id,
							requestDataId: item.id,
						},
					);
					if (!response) {
						return this.toastError(this.$t("error.upload_file"));
					}
					if (!response.state) {
						return this.toastError(response.message);
					}
					this.attachmentFiles.push(response.data.id);
					this.files = [];
					//this.$emit(constant.keys.upload, true);
				}
				// this.$emit("save", this.attachmentFiles);
				// this.closeDialog();
			} catch (error) {
				this.toastError(error);
			}
		},
	},
};
</script>

<style lang="scss" scoped></style>
