import store from "@/store";

class AdministratorAPI {
	API_GetAllCategoryGroup(check = false) {
		return `/api/_all/category-groups?ignoreField=${check}`;
	}
	API_GetAllCategoryGroupHasChild() {
		return `/api/_all_has_child/category-groups`;
	}
	API_CreateCategoryGroup() {
		return `/api/category-groups`;
	}
	API_UpdateCategoryGroup(id) {
		return `/api/category-groups/${id}`;
	}
	API_GetCategoryGroup(id) {
		return `/api/category-groups/${id}`;
	}
	API_DeleteCategoryGroup(id) {
		return `/api/category-groups/${id}`;
	}
	API_SaveAllCategoryGroup() {
		return `/api/_save/category-groups`;
	}
	API_GetAllChildByParentId(id) {
		return `/api/_all-child/${id}/category-groups`;
	}
	API_GetAllChildByParentIdAndKeyWord(id, name, page = 0, size = 100) {
		return `/api/_all-child/${id}/search_name/category-groups?name=${name}&page=${page}&size=${size}`;
	}
	API_GetAllCategoryDataByCategoryGroupId(id) {
		return `/api/category-groups/${id}/_all/category-data`;
	}
	API_CreateCategoryData() {
		return `/api/category-data`;
	}
	API_UpdateCategoryData(id) {
		return `/api/category-data/${id}`;
	}
	API_SaveAllCategoryData() {
		return `/api/_save/category-data`;
	}
	API_DeleteCategoryData(id) {
		return `/api/category-data/${id}`;
	}
	API_DeleteAllCategoryData() {
		return `/api/_delete/category-data`;
	}
	API_FindAllOrganization() {
		return `/api/_all/organizations?ignoreField=${true}`;
	}
	API_FindCustomAllOrganization() {
		return `/api/_custom_all/organizations`;
	}
	API_SaveAllOrganization() {
		return `/api/_save/organizations`;
	}
	API_CreateOrganization() {
		return `/api/organizations`;
	}
	API_GetAllOrganization() {
		return `/api/_all/organizations`;
	}
	API_DeleteOrganization(id) {
		return `/api/organizations/${id}`;
	}
	API_UpdateOrganization(id) {
		return `/api/organizations/${id}`;
	}
	API_SaveProcessInfo() {
		return `/api/process-infos`;
	}
	API_UpdateProcessInfo(id) {
		return `/api/process-infos/${id}`;
	}
	API_SaveAllRequest() {
		return `/api/_save/requests`;
	}
	API_GetAllProcessInfo() {
		return `/api/_all/process-infos`;
	}
	API_GetAllProcessInfoIgnoreFile() {
		return `/api/_all/process-infos?ignoreField=true`;
	}
	API_GetPageProcessInfoIgnoreFile(
		ignoreField = true,
		page = 0,
		pageSize = 10,
	) {
		return `/api/_page/process-infos?ignoreField=${ignoreField}&page=${page}&size=${pageSize}`;
	}
	API_GetAllRequestGroup() {
		return `/api/_all/request-groups`;
	}
	API_GetAllRequestGroupOfUser() {
		return `/api/_all/user/request-groups`;
	}
	API_GetAllRequestType() {
		return `/api/_all/request-types`;
	}
	API_GetAllRequest() {
		return `/api/_all/requests`;
	}
	API_GetAllRequestIgnoreFile(ignoreField = true) {
		//return `/api/_all_ignorefile/requests`;
		return `/api/_all/requests?ignoreField=${ignoreField}`;
	}
	API_CreateRequest() {
		return `/api/requests`;
	}
	API_SaveRequest(id) {
		return `/api/requests/${id}`;
	}
	API_GetAllTemplateForm() {
		return `/api/_all/template-forms`;
	}
	API_GetAllTemplateFormIgoneField() {
		return `/api/_all/template-forms?ignoreFile=true`;
	}
	API_GetRequest(id) {
		return `/api/requests/${id}`;
	}
	API_CreateRequestGroup() {
		return `/api/request-groups`;
	}
	API_CreateRequestType() {
		return `/api/request-types`;
	}
	API_CreateTemplateForm() {
		return `/api/template-forms`;
	}
	API_SaveTemplateForm(id) {
		return `/api/template-forms/${id}`;
	}
	Route_EditCategroupGroup(id) {
		return `/administrator/danh-muc/${id}`;
	}
	Route_CategroupGroupList() {
		return `/administrator/danh-muc`;
	}
	API_SaveRequestData(id) {
		return `/api/request-data/${id}`;
	}
	API_CreateRequestData() {
		return `/api/request-data/`;
	}
	API_FindOneRequesrtByID(id) {
		return `/api/request-types/${id}/requests`;
	}
	API_CreateProcessData() {
		return `/api/process-data`;
	}
	API_CreateFormData() {
		return `/api/form-data`;
	}
	API_CreateStepData() {
		return `/api/step-data`;
	}
	API_FindStepInProcessesByID(id) {
		return `/api/process-infos/${id}/_all/step-in-processes`;
	}
	API_GetRequestDataByID(id) {
		return `/api/request-data/${id}`;
	}
	API_GetFormDataById(id, ignoreField = true) {
		return `/api/request-data/${id}/_all/form-data?ignoreField=${ignoreField}`;
	}
	API_UpdateFormData(id) {
		return `/api/form-data/${id}`;
	}
	API_UpdateFormDataCustom(id) {
		return `/api/update_data/form_data/${id}`;
	}
	API_UpdateFormDataCustomNoFillIn(id) {
		return `/api/update_data/form_data/${id}?fillIn=false`;
	}
	API_FindProcessesDataByID(id) {
		return `/api/request-data/${id}/_all/process-data`;
	}
	API_FindStepDataByID(id) {
		return `/api/request-data/${id}/_all/step-data`;
	}
	API_FindFieldInForm(id, ignoreField = true) {
		return `/api/forms/${id}/_all/field-in-form?ignoreField=${ignoreField}`;
	}
	API_CreateFieldData() {
		return `/api/field-data`;
	}
	API_GetFieldDataByIdRequest(id) {
		return `/api/request-data/${id}/_all/field-data`;
	}
	API_GetSteepDataByIdRequest(id) {
		return `/api/request-data/${id}/_all/step-data`;
	}
	API_GetSteepDataByIdStepInProcessId(id) {
		return `/api/step-in-processes/${id}/_all/user-in-steps`;
	}
	API_GetAllRequestData() {
		return `/api/_all/request-data`;
	}
	API_GetAllRequestDataV2(userId) {
		return `/api/v2/user/${userId}/_all_of_user/request-data`;
	}
	API_DeleteAllProcessInfo() {
		return `/api/_save/process-infos`;
	}
	API_UploadFile() {
		return `/api/file/upload`;
	}
	API_UploadFile365() {
		return `/api/file/office365/upload`;
	}
	API_SaveAttachmentFile(id) {
		return `/api/attachment-files/${id}`;
	}
	API_GetAllAttachmentFileByTemplateFormId(templateFormId) {
		return `/api/template-form/${templateFormId}/_all/attachment-files`;
	}
	API_GetAllAttachmentFileByManageStampInfoId(manageStampInfoId) {
		return `/api/manage-stamp-info/${manageStampInfoId}/_all/attachment-files`;
	}

	API_GetAllStepInProcessByProcessInfoId(processInfoId) {
		return `/api/process-infos/${processInfoId}/_all/step-in-processes`;
	}
	API_DownloadFile(fileId, fileExtension, contentType) {
		return `/api/file/download/${fileId}.${fileExtension}?type=${contentType}`;
	}
	FullAPI_DownloadFile(fileId, fileName, fileExtension, contentType) {
		let apiUrl = store.state.config.apiUrl;
		return `${apiUrl}/api/file/download/${fileId}/${fileName}.${fileExtension}?type=${contentType}`;
	}
	API_DownloadFileById(fileId, contentType) {
		return `/api/file/download/${fileId}?type=${contentType}`;
	}
	FullAPI_DownloadFileById(fileId, contentType) {
		let apiUrl = store.state.config.apiUrl;
		return `${apiUrl}/api/file/v1/download/${fileId}?type=${contentType}`;
	}
	API_GetFolderContent(id) {
		return `/api/folder/${id}`;
	}
	API_CreateFolder() {
		return `/api/folder/`;
	}
	API_RenameFolder(id, folderName) {
		return `/api/folder/${id}?folderName=${folderName}`;
	}
	API_DeleteFolder(id) {
		return `/api/file/${id}`;
	}
	API_GetAllRank() {
		return `/api/_all/ranks`;
	}
	API_GetAllSteps() {
		return `/api/_all/steps`;
	}
	API_CreateStep() {
		return `/api/steps/`;
	}
	API_UpdateStep(id) {
		return `/api/steps/${id}`;
	}
	API_DeleteAllStep() {
		return `/api/_save/steps`;
	}
	API_GetAllRankByOrganizaionId(id) {
		return `/api/organization/_all/${id}/rank`;
	}
	API_GetAllUserInfo() {
		return `/api/_all/user-infos`;
	}
	API_SaveAllUserInfo() {
		return `/api/_save/user-infos`;
	}
	API_GetAllByProcessInfoId(id) {
		return `/api/process-infos/${id}/_all/step-in-processes`;
	}
	API_GetAllByStepInProcessId(id) {
		return `/api/step-in-processes/${id}/_all/user-in-steps`;
	}
	API_DeleteStepInProcess(id) {
		return `/api/step-in-processes/${id}`;
	}
	API_UpdateStepInProcess(id) {
		return `/api/step-in-processes/${id}`;
	}
	API_CreateUserInStep() {
		return `/api/user-in-steps`;
	}
	API_DeleteUserInStep(id) {
		return `/api/user-in-steps/${id}`;
	}
	API_UpdateUserInStep(id) {
		return `/api/user-in-steps/${id}`;
	}
	API_CreateStepInProcess() {
		return `/api/step-in-processes`;
	}
	API_DeleteRequestData(id) {
		return `/api/request-data/${id}`;
	}
	API_DeleteAllRequestData() {
		return `/api/_delete/request-data`;
	}
	API_GetAttachmentFile(id) {
		return `/api/template-form/${id}/_all/attachment-files`;
	}
	API_CopyFile() {
		return `/api/file/copy-file`;
	}
	API_CreateAttachmentFile() {
		return `/api/attachment-files`;
	}
	API_UpdateAttachmentFile(id) {
		return `/api/attachment-files/${id}`;
	}
	API_GetAllAttachmentFileByRequestDataId(id) {
		return `/api/request-data/${id}/_all/attachment-files`;
	}
	API_UpdateRequestData(id) {
		return `/api/request-data/${id}`;
	}
	API_GetAllByUserIdRequestData(id) {
		return `/api/v2/user/${id}/_all/request-data`;
	}
	API_GetAllRequestNeedHandlerByUserId(id) {
		return `/api/v2/user/${id}/_all_need_handle/request-data`;
	}
	API_GetAllByUserIdRequestDataV2(id) {
		return `/api/v1/user/${id}/_all/request-data`;
	}
	API_GetAllUserInfos() {
		return `/api/_all/user-infos`;
	}
	API_DeleteAllFiltByTempId(id) {
		return `/api/template-form/${id}/_all/attachment-files`;
	}
	API_CheckCodeProcessInfo() {
		return `/api/check_code/process-infos`;
	}
	API_GetAllRequestDataNeedHandle(id) {
		return `/api/user/${id}/_all_need_handle/request-data`;
	}
	API_UpdateFile(id, fileName = false) {
		return (
			`/api/file/update-file/${id}` +
			(!fileName ? "" : `?fileName=${fileName}`)
		);
	}
	API_UpDateStepData(id) {
		return `/api/step-data/${id}`;
	}
	API_DeleteStepData(id) {
		return `/api/step-data/${id}`;
	}
	API_DeleteProcessData(id) {
		return `/api/process-data/${id}`;
	}
	API_GetRequestAboutToExpireByUserId(id) {
		return `/api/user/${id}/_all_about_to_expire/request-data`;
	}
	API_GetRequestOverDueByUserId(id) {
		return `/api/user/${id}/_all_overdue/request-data`;
	}
	API_GetCountAboutToExpireByUserId(id) {
		return `/api/user/${id}/_count_about_to_expire/request-data`;
	}
	API_GetCountOverDueByUserId(id) {
		return `/api/user/${id}/_count_overdue/request-data`;
	}
	API_GetCountInProcessingByUserId(id) {
		return `/api/user/${id}/_count_in_processing_time/request-data`;
	}
	API_GetCountRequestNeedHandle(id) {
		return `/api/v2/user/${id}/_count_all_need_handle/request-data`;
	}
	API_CountAboutToExpire() {
		return `/api/_count_about_to_expire/dashboard`;
	}
	API_CountAllGiveBack() {
		return `/api/_count_all_give_back/dashboard`;
	}
	API_CountAllNeedHandle() {
		return `/api/_count_all_need_handle/dashboard`;
	}
	API_CountOverdue() {
		return `/api/_count_overdue/dashboard`;
	}

	API_GetAllRole() {
		return `/api/_all/roles`;
	}
	API_GetRequestDataSharedByUserId(id) {
		return `/api/user/${id}/_all_shared_to_user/request-data`;
	}
	API_GetRequestInProcessing(id) {
		return `/api/user/${id}/_all_in_processing_time/request-data`;
	}
	API_ApproveRequest() {
		return `/api/approve/request-data`;
	}
	API_GetRequestDrafting(id) {
		return `/api/v2/user/${id}/_all_drafting/request-data`;
	}
	API_GetRequestFollowing(id) {
		return `/api/v2/user/${id}/_all_following/request-data`;
	}
	API_GetRequestApproved(id) {
		return `/api/v2/user/${id}/_all_approved/request-data`;
	}
	API_GetRequestSharedToUser(id) {
		return `/api/v2/user/${id}/_all_share_to_user/request-data`;
	}
	API_GetRequestGiveBack(id) {
		return `/api/v2/user/${id}/_all_give_back/request-data`;
	}
	API_GetRequestWaitApproval(id) {
		return `/api/v2/user/${id}/_all_wait_approval/request-data`;
	}
	API_GetCountRequestDrafting(id) {
		return `/api/user/${id}/_count_drafting/request-data`;
	}
	API_GetAllRequestTypeByRequestGroupId(id) {
		return `/api/request_group/${id}/_all/request-types`;
	}
	API_GetRequestNeedProcess(id) {
		return `/api/v2/user/${id}/_all_need_handle/request-data`;
	}
	API_GetRequestDataFollowing(id) {
		return `/api/user/${id}/_all_following/request-data`;
	}
	API_GetAllUserGroup() {
		return `/api/_all/user-groups`;
	}
	API_GetAllSignatureInformation(userId) {
		return `/api/user/${userId}/_all/signature-infomations`;
	}
	API_CreateSignatureInformation() {
		return `/api/signature-infomations`;
	}
	API_SaveSignatureInformation(id) {
		return `/api/signature-infomations/${id}`;
	}
	API_GetTemplateForm(id) {
		return `/api/template-forms/${id}`;
	}
	API_UploadTemplateFileCloud(id) {
		return `/api/file/office365/upload?templateFormId=${id}`;
	}
	API_UploadManageStampCloud(requestDataId, userId) {
		return `/api/file/office365/upload?requestDataId=${requestDataId}&userId=${userId}`;
	}
	API_UploadMailTemplateCloud(userId) {
		return `/api/file/office365/upload?userId=${userId}`;
	}
	API_GetPreviewLink(id) {
		return `/api/file/office365/preview/${id}`;
	}
	API_DeleteTemplateForm(id) {
		return `/api/template-forms/${id}`;
	}
	API_GetAllMailTemplate() {
		return `/api/_all/mail-templates`;
	}
	API_GetMailTemplate(id) {
		return `/api/mail-templates/${id}`;
	}
	API_CreateMailTemplate() {
		return `/api/mail-templates`;
	}
	API_SaveMailTemplate(id) {
		return `/api/mail-templates/${id}`;
	}
	API_GetAllOTP() {
		return `/api/_all/otps`;
	}
	API_CreateOTP(id, content) {
		return `/api/_generate/${id}/otps?description=${content}`;
	}
	API_DeleteAllOTP() {
		return `/api/_save/otps`;
	}
	API_UpdateOTP(id) {
		return `/api/otps/${id}`;
	}
	API_GetBook() {
		return `/api/_all/dispatch-books`;
	}
	API_CreateUserGroup() {
		return `/api/user-groups`;
	}
	API_SaveUserGroup(id) {
		return `/api/user-groups/${id}`;
	}
	API_GetUserGroup(id) {
		return `/api/user-groups/${id}`;
	}
	API_CreateDispatchBook() {
		return `/api/dispatch-books`;
	}
	API_GetAllDispatchBook() {
		return `/api/dispatch-books`;
	}
	API_UpdateDispatchBook(id) {
		return `/api/dispatch-books/${id}`;
	}
	API_DeleteAllDispatchBook() {
		return `/api/_save/dispatch-books`;
	}
	API_GetAllStatus() {
		return `/api/_all/status`;
	}
	API_CreateStatus() {
		return `/api/status`;
	}
	API_UpdateStatus(id) {
		return `/api/status/${id}`;
	}
	API_GetStepDataByIdProcessData(id) {
		return `/api/process-data/${id}/_all/step-data`;
	}
	API_DeleteAttachmentFile(id) {
		return `/api/attachment-files/${id}`;
	}
	API_CreateReqdataProcessHis() {
		return `/api/reqdata-process-his`;
	}
	API_GetReqdataProcessHisByID(id) {
		return `/api/request-data/${id}/_all/reqdata-process-his`;
	}
	API_GetUserInfo(id) {
		return `/api/user-infos/${id}`;
	}
	API_GetAllUserByRequest(id) {
		return `/api/v1/user/${id}/_all/request-data`;
	}
	API_Approve() {
		return `/api/process/request-data`;
	}
	API_Examine() {
		return `/api/examines`;
	}
	API_MailCustomRest() {
		return `/api/mail/send-mail`;
	}
	API_ExamineReply() {
		return `/api/examine-replies`;
	}
	API_GetAllStamp() {
		return `/api/_all/stamps`;
	}
	API_GetAllRequestApprovedById(id) {
		return `/api/v2/user/${id}/_all_approved/request-data`;
	}
	API_GetRootFolder() {
		return `/api/folder/office365/root/folder`;
	}
	API_Get365FolderContent(id) {
		return `/api/folder/office365/${id}`;
	}
	API_Create365Folder() {
		return `/api/folder/office365/`;
	}
	API_Save365Folder(id, name) {
		return `/api/folder/office365/rename/${id}?folderName=${name}`;
	}
	API_Delete365Folder(id) {
		return `/api/folder/office365/${id}`;
	}
	API_Delete365File(id) {
		return `/api/file/office365/${id}`;
	}
	API_GetAllSignDataByRequestData(id) {
		return `/api/request-data/${id}/_all/sign-data`;
	}
	API_updateSignData(id) {
		return `/api/sign-data/${id}`;
	}
	API_GetCheckIsCustomerStep(id) {
		return `/api/check_resend_mail/${id}/request-data`;
	}
	API_ResendSigntureInfo() {
		return `/api/resend_mail/request-data`;
	}
	API_GetAllManageStampInfoByRequestData(id) {
		return `/api/request-data/${id}/_all/manage-stamp-infos`;
	}
	API_updateManageStampInfo(id) {
		return `/api/manage-stamp-infos/${id}`;
	}
	API_createManageStampInfo() {
		return `/api/manage-stamp-infos`;
	}
	API_createSignData() {
		return `/api/sign-data`;
	}
	API_SaveAllUserGroup() {
		return `/api/_save/user-groups`;
	}
	API_GetAllSignature() {
		return `/api/_all/signature-infomations`;
	}
	API_CreateConsult() {
		return `/api/consults`;
	}
	API_CreateConsultReply() {
		return `/api/consult-replies`;
	}
	API_GetAllByUserAndRequestData(idUser, id) {
		return `/api/user/${idUser}/request-data/${id}/_all/examines`;
	}
	API_GetAllConsultByUserAndRequestData(idUser, id) {
		return `/api/user/${idUser}/request-data/${id}/_all/consults`;
	}
	API_InformationInExchanges() {
		return `/api/information-in-exchanges`;
	}
	API_CreateStepProcessDoc() {
		return `/api/step-process-docs`;
	}
	API_CreateTransferHandle() {
		return `/api/transfer-handles`;
	}
	API_GetAllStatusTransferHandles() {
		return `/api/_all/status-transfer-handles`;
	}
	API_SendMail365() {
		return `/api/mail/send-mail-365`;
	}
	API_Sign() {
		return `/api/sign/`;
	}
	API_SignAnonymous() {
		return `/api/sign/anonymous`;
	}
	API_UpdateReqdataProcessHis(id) {
		return `/api/reqdata-process-his/${id}`;
	}
	API_GetReqdataProcessHisById(id) {
		return `/api/reqdata-process-his/${id}`;
	}
	API_DownloadFile365(param, fileName, extension) {
		let url = `/api/file/office365/download/${fileName}.${extension}`;
		let start = true;
		for (let key in param) {
			if (start) {
				start = false;
				url += "?" + key + "=" + param[key];
			} else {
				url += "&" + key + "=" + param[key];
			}
		}
		return url;
	}
	API_GetAllAttachmentFileByMailTemplateId(id) {
		return `/api/mail-template/${id}/_all/attachment-files`;
	}
	API_GetAllChildOrg(id) {
		return `/api/_all-child-org/${id}/organizations`;
	}
	API_GetCountAllRequestV2(id) {
		return `/api/v2/user/${id}/_count/request-data`;
	}
	API_GetAllOtpByRequestDataId(requestDataId) {
		return `/api/request-data/${requestDataId}/_all/otps`;
	}
	API_GetAllRqdataProcessHistory(id) {
		return `/api/request-data/${id}/_all/reqdata-process-his`;
	}
	API_PostRqdataProcessHistory() {
		return `/api/reqdata-process-his`;
	}
	API_GetByCurrentSteps(id, ignoreField = true) {
		return `/api/current-steps/${id}/_all/step-data?ignoreField=${ignoreField}`;
	}
	API_CreateRequestRecall() {
		return `/api/request-recalls`;
	}
	API_GetAllRequestRecallByRequestData(id) {
		return `/api/request-data/${id}/_all/request-recalls`;
	}
	API_UpdateRequestRecall(id) {
		return `/api/request-recalls/${id}`;
	}
	API_GetStatistic() {
		return `/api/statistic/dashboard`;
	}
	API_GetChildOrg(id) {
		return `/api/_child-org/${id}/organizations`;
	}
	API_GetStatisticByDay() {
		return `/api/statistic-day/dashboard`;
	}
	API_GetStatisticByStatus() {
		return `/api/statistic-status/dashboard`;
	}
	API_CreateRole() {
		return `/api/roles`;
	}
	API_UpdateRole(id) {
		return `/api/roles/${id}`;
	}
	API_GenerateOTP(id) {
		return `/api/_generate/${id}/otps`;
	}
	API_DeleteRole() {
		return `/api/_save/roles`;
	}
	API_ResetPasswordUser() {
		return `/api/update-data/user-infos`;
	}
	API_GetAllTransferHandles(id) {
		return `/api/_all/request-data/${id}/transfer-handles`;
	}
	API_SignAll() {
		return `/api/sign/all`;
	}
	API_SignOne() {
		return `/api/sign/`;
	}
	API_GetAllProcessIgnoreField(check) {
		return `/api/_all/process-infos?ignoreField=${check}`;
	}
	API_GetAllRequestIgnoreField(check) {
		return `/api/_all/requests?ignoreField=${check}`;
	}
	API_CheckExistRequestByRequestType(requestTypeId) {
		return `/api/check_exist_request/${requestTypeId}/request-types`;
	}
	API_AddPrimaryFile(userId, requestDataId, templateFormId = null) {
		if (templateFormId) {
			return `/api/_add_primary_file/${userId}/request-data?requestDataId=${requestDataId}&templateFormId=${templateFormId}`;
		} else {
			return `/api/_add_primary_file/${userId}/request-data?requestDataId=${requestDataId}`;
		}
	}
	API_GetTemplateByRequestId(id) {
		return `/api/_all/request/${id}/template-forms`;
	}
	API_GetFormByRequestId(id) {
		return `/api/_all_by_request/${id}/forms`;
	}
	API_GetAllCargo() {
		return `/api/_all/centralized-shoppings`;
	}
	SearchAllCargo(page = 0, size = 10) {
		return `/api/search_custom/centralized-shoppings?page=${page}&size=${size}`;
	}
	SearchAllCargoByCreatedDate(page = 0, size = 10, modifiedDate) {
		if (modifiedDate) {
			return `/api/v2/search_custom/centralized-shoppings?page=${page}&size=${size}&sort=modifiedDate,desc&modifiedDate=${encodeURIComponent(
				modifiedDate,
			)}`;
		} else {
			return `/api/v2/search_custom/centralized-shoppings?page=${page}&size=${size}`;
		}
	}
	API_GetAllBussinessPartner() {
		return `/api/_all/business-partners`;
	}
	API_GetCheckOtp(requestDataId, opt) {
		return `/api/_check/otps?requestDataId=${requestDataId}&opt=${opt}`;
	}
	API_DashboardLead() {
		return `/api/_leader_statistic/member/dashboard`;
	}
	API_GetOrganizationDashboard(id) {
		return `/api/_child-org/${id}/organizations`;
	}
	API_GetRequestByRqGroupId(id) {
		return `/api/_all/request_group/${id}/requests?ignoreField=true`;
	}
	API_GetRequestByRqGroupIdV2(id) {
		return `/api/_all/request_group/${id}/user/requests?ignoreField=true`;
	}

	GetAllUser(page, size) {
		return `/api/user-infos?page=${page}&size=${size}`;
	}
	SearchAllUser(page = 0, size = 10) {
		return `/api/search_custom/user-infos?page=${page}&size=${size}`;
	}
	SearchAllUserInfoByDate(page = 0, size = 10, createDate) {
		if (createDate) {
			return `/api/v2/search_custom/user-infos?page=${page}&size=${size}&sort=createdDate,desc&createdDate=${encodeURIComponent(
				createDate,
			)}`;
		} else {
			return `/api/v2/search_custom/user-infos?page=${page}&size=${size}`;
		}
	}
	SearchAllUserGroupByDate(page = 0, size = 10, createDate) {
		if (createDate) {
			return `/api/v2/search_custom/user-groups?page=${page}&size=${size}&sort=createdDate,desc&createdDate=${encodeURIComponent(
				createDate,
			)}`;
		} else {
			return `/api/v2/search_custom/user-groups?page=${page}&size=${size}`;
		}
	}
	SearchAllRoleByCreatedDate(page = 0, size = 10, createDate) {
		return `/api/v2/search_custom/roles?page=${page}&size=${size}&sort=createdDate,desc&createdDate=${encodeURIComponent(
			createDate,
		)}`;
	}
	SearchAllProcessInfoByModifiedDate(page = 0, size = 10, modifiedDate) {
		if (modifiedDate) {
			return `/api/v2/search_custom/process-infos?page=${page}&size=${size}&sort=modifiedDate,desc&modifiedDate=${encodeURIComponent(
				modifiedDate,
			)}`;
		} else {
			return `/api/v2/search_custom/process-infos?page=${page}&size=${size}`;
		}
	}
	SearchAllOrganizationByModifiedDate(
		page = 0,
		size = 10,
		modifiedDate,
		createdDate,
	) {
		if (modifiedDate && !createdDate) {
			return `/api/v2/search_custom/organizations?page=${page}&size=${size}&sort=modifiedDate,desc&modifiedDate=${encodeURIComponent(
				modifiedDate,
			)}`;
		}
		if (createdDate && !modifiedDate) {
			return `/api/v2/search_custom/organizations?page=${page}&size=${size}&sort=modifiedDate,desc&createdDate=${encodeURIComponent(
				createdDate,
			)}`;
		}
		if (createdDate && modifiedDate) {
			return `/api/v2/search_custom/organizations?page=${page}&size=${size}&sort=modifiedDate,desc&createdDate=${encodeURIComponent(
				createdDate,
			)}&modifiedDate=${encodeURIComponent(modifiedDate)}`;
		}
		if (!createdDate && !modifiedDate) {
			return `/api/v2/search_custom/organizations?page=${page}&size=${size}`;
		}
	}
	GetAllUserGroup(page = 0, size = 10) {
		return `/api/search_custom/user-groups?page=${page}&size=${size}`;
	}
	GetAllRole(page, size) {
		return `/api/roles?page=${page}&size=${size}`;
	}
	GetAllRank(page, size) {
		return `/api/ranks?page=${page}&size=${size}`;
	}
	GetAllOrganization(page, size) {
		return `/api/search_custom/organizations?page=${page}&size=${size}`;
	}
	SearchAllOrganization(page = 0, size = 10) {
		return `/api/search_custom/organizations?page=${page}&size=${size}`;
	}
	GetAllTemplateForm(page, size) {
		return `/api/template-forms?page=${page}&size=${size}`;
	}
	GetAllCategory(page, size) {
		return `/api/category-groups?page=${page}&size=${size}`;
	}
	GetAllProcessInfo(page, size) {
		return `/api/process-infos?page=${page}&size=${size}`;
	}
	GetAllStep(page, size) {
		return `/api/steps?page=${page}&size=${size}`;
	}
	GetAllRequestGroup(page, size) {
		return `/api/request-groups?page=${page}&size=${size}`;
	}
	GetAllRequestType(page, size) {
		return `/api/request-types?page=${page}&size=${size}`;
	}
	GetAllRequest(page, size) {
		return `/api/requests?page=${page}&size=${size}`;
	}
	GetAllOTP(page, size) {
		return `/api/otps?page=${page}&size=${size}`;
	}
	GetAllMailTemplate(page, size) {
		return `/api/mail-templates?page=${page}&size=${size}`;
	}
	GetAllDispatchBook(page, size) {
		return `/api/dispatch-books?page=${page}&size=${size}`;
	}
	GetAllCentralizeShopping(page, size) {
		return `/api/centralized-shoppings?page=${page}&size=${size}`;
	}
	GetAllBussinessPartner(page, size) {
		return `/api/business-partners?page=${page}&size=${size}`;
	}
	GetUserByFilter(page, page_size) {
		return `/api/search_user/user-infos?page=${page}&size=${page_size}`;
	}
	GetUserByFiltersCustom(page, page_size) {
		return `/api/search_custom/user-infos?page=${page}&size=${page_size}`;
	}
	API_SyncUsers(userId) {
		return `/api/sync-user/${userId}`;
	}
	API_CountRequestDataOfUser(userId) {
		return `/api/v2/user/${userId}/_count_all_of_user/request-data`;
	}
	API_CountRequestDataDrafting(userId) {
		return `/api/v2/user/${userId}/_count_all_drafting/request-data`;
	}
	API_CountRequestDataGiveBack(userId) {
		return `/api/v2/user/${userId}/_count_all_give_back/request-data`;
	}
	API_CountRequestDataFollow(userId) {
		return `/api/v2/user/${userId}/_count_all_following/request-data`;
	}
	API_CountRequestDataShareToUser(userId) {
		return `/api/v2/user/${userId}/_count_all_share_to_user/request-data`;
	}
	API_CountRequestDataWaitApproval(userId) {
		return `/api/v2/user/${userId}/_count_all_wait_approval/request-data`;
	}
	API_CountRequestDataApproval(userId) {
		return `/api/v2/user/${userId}/_count_all_approved/request-data`;
	}
	API_GetAllAttachmentFileByRequestDataIdHasSign(requestDataId) {
		return `/api/sign/_all/${requestDataId}/file_sign`;
	}
	API_GetAllSites() {
		return `/api/data-room/all_site`;
	}
	API_DataRoomGetAll(siteId) {
		if (!siteId) {
			return `/api/data-room/v2/_all/directory_object`;
		} else {
			return `/api/data-room/v2/_all/directory_object?siteId=${siteId}
			`;
		}
	}
	API_GetAllTemplateFormV2() {
		return `/api/_all/has_file/template-forms?ignoreFile=true`;
	}
	API_SAPSyncContract() {
		return `/api/sync_sap/contract`;
	}
	API_SAPSyncContractRequestData(requestDataId) {
		return `/api/sync_sap/contract/${requestDataId}`;
	}
	API_GetAllFormDriverFolder(id, itemid) {
		if (!itemid) {
			return `/api/data-room/v2/_all/item_of_drive?driveId=${id}`;
		} else {
			return `/api/data-room/v2/_all/item_of_drive?driveId=${id}&itemId=${itemid}`;
		}
	}
	API_GetRequestByStatus(id) {
		return `/api/_status/${id}/request-data`;
	}
	API_UpdateRequestDataContractNumber(id) {
		return `/api/_update_contract/${id}/request-data`;
	}
	API_ApproveAll() {
		return `/api/process_concurrent/request-data`;
	}
	API_GetAllFieldDataByRequestDataId(id, page, size = 20) {
		return `/api/request-data/${id}/_all/field-data?page=${page}&size=${size}&ignoreField=true&sort=order, asc`;
	}
	API_UpdateAllFieldDataByRequestDataId(id) {
		return `/api/field-data/${id}`;
	}
	API_UpdateAllFieldDataByRequestDataId_SaveAll(
		requestDataId,
		useTemplate = false,
	) {
		return `/api/_save_custom/field-data/${requestDataId}?useTemplate=${useTemplate}`;
	}
	API_UpdateAllFieldDataByRequestDataId_SaveAll_V2(
		requestDataId,
		attachmentFileId,
		useTemplate = false,
	) {
		return `/api/_fill_in/${requestDataId}?attachmentFileId=${attachmentFileId}&useTemplate=${useTemplate}`;
	}
	API_UpdateAllFieldDataByRequestDataId_SaveAll_NoFill(requestDataId) {
		return `/api/_save_custom/field-data/${requestDataId}?fillIn=false`;
	}

	API_GetHisTradeRequestData(id) {
		return `/api/request-data/${id}/_all/information-in-exchanges`;
	}
	API_Chat() {
		return `/api/information-in-exchanges`;
	}
	API_CreateAllFieldDataByRequestDataId() {
		return `/api/_create_custom/field-data`;
	}
	API_GetAllRequestNeedProcessPaging(userId) {
		return `/api/v2/user/${userId}/_all_need_handle/paging/request-data?page=0&size=10`;
	}
	API_GetRequestDraftingPaging(userId, pageSize = 10) {
		return `/api/v2/user/${userId}/_all_drafting/paging/request-data?page=0&size=${pageSize}`;
	}
	API_GetRequestApprovedPaging(userId, pageSize = 10) {
		return `/api/v2/user/${userId}/_all_approved/paging/request-data?page=0&size=${pageSize}`;
	}
	API_GetRequestWaitApprovalPaging(userId, pageSize = 10) {
		return `/api/v2/user/${userId}/_all_wait_approval/paging/request-data?page=0&size=${pageSize}`;
	}
	API_GetRequestGiveBackPaging(userId, pageSize = 10) {
		return `/api/v2/user/${userId}/_all_give_back/paging/request-data?page=0&size=${pageSize}`;
	}
	API_GetRequestFollowPaging(userId, pageSize = 10) {
		return `/api/v2/user/${userId}/_all_following/paging/request-data?page=0&size=${pageSize}`;
	}
	API_GetRequestSharedToUserPaging(userId, pageSize = 10) {
		return `/api/v2/user/${userId}/_all_share_to_user/paging/request-data?page=0&size=${pageSize}`;
	}
	API_GetRequestOfUserPaging(userId, pageSize = 10) {
		return `/api/v2/user/${userId}/_all_of_user/paging/request-data?page=0&size=${pageSize}`;
	}
	API_GetAllRequestNeedHandlePaging(userId, page = 0, pageSize = 10) {
		return `/api/v2/user/${userId}/_all_need_handle/paging/request-data?page=${page}&size=${pageSize}`;
	}
	API_GetAllProcessInfoCustom(page = 0, pageSize = 10) {
		return `/api/search_custom/process-infos?page=${page}&size=${pageSize}`;
	}
	API_GetRequestCustom(page = 0, pageSize = 10) {
		return `/api/search_custom/requests?page=${page}&size=${pageSize}`;
	}
	API_GetAllTemplateCustom(page = 0, pageSize = 10) {
		return `/api/search_custom/template-forms?page=${page}&size=${pageSize}`;
	}
	API_GetAllCentralizedShoppings() {
		return `/api/_all/centralized-shoppings`;
	}
	API_SearchCustomCentralizedShoppings(page = 0, pageSize = 10) {
		return `/api/search_custom/centralized-shoppings?page=${page}&size=${pageSize}`;
	}
	API_SearchCentralizedShoppingsPaging(page = 0, pageSize = 10) {
		return `/api/centralized-shoppings?page=${page}&size=${pageSize}`;
	}
	API_GetCodeAttachName() {
		return `/api/_all/generate-attach-name-option`;
	}
	API_GetCodeAttachNameV2(requestId) {
		return `/api/v2/requests/${requestId}/_all/generate-code-option`;
	}
	API_GetMaxLevelCategory() {
		return `/api/_all_not_has_parent/category-groups`;
	}
	API_GetAllChildCategory(id, page = 0, size = 10) {
		return `/api/_all_child_pageable/${id}/category-groups?page=${page}&size=${size}&sort=id,desc`;
	}
	API_Delete_UpDateCentralized(id) {
		return `/api/centralized-shoppings/${id}`;
	}
	API_Creat_Centralized() {
		return `/api/centralized-shoppings`;
	}
	API_GetOne_Centralized(id) {
		return `/api/centralized-shoppings/${id}`;
	}
	API_DeleteBusinessParner(id) {
		return `/api/business-partners/${id}`;
	}
	API_CreateBusinessParner() {
		return `/api/business-partners`;
	}
	API_UpdateBusinessParner(id) {
		return `/api/business-partners/${id}`;
	}
	API_Organization_rank(id) {
		return `/api/organization_rank/_all/user-infos?organizationId=${id}`;
	}
	API_Role_Organization() {
		return `/api/role-organizations`;
	}
	API_Update_Role_Organization(id) {
		return `/api/role-organizations/${id}`;
	}
	API_GetOne_Role_Organization(roleId) {
		return `/api/role/${roleId}/_all/role-organizations`;
	}
	API_Role_Request() {
		return `/api/role-requests`;
	}
	API_Update_Role_Request(id) {
		return `/api/role-requests/${id}`;
	}
	API_GetOne_Role_Request(roleId) {
		return `/api/role/${roleId}/_all/role-requests`;
	}
	API_Save_Attachment_Permisition() {
		return `/api/_save/attachment-permisitions`;
	}
	API_GetAll_ByAttachment_Attachment_Permisition(attachmentFileId) {
		return `/api/attachmentFile/${attachmentFileId}/_all/attachment-permisitions`;
	}
	API_DeleteAll_Attachment_Permisition() {
		return `/api/_delete/attachment-permisitions`;
	}
	API_GetAllFileInFormOfRequest(requestId) {
		return `/api/request/${requestId}/_all/field-in-form`;
	}
	API_GetAllOrganizationWithRole(useId) {
		return `/api/user/${useId}/_all/organization-with-role`;
	}
	API_GetAllRequestWithRole(useId) {
		return `/api/user/${useId}/_all/request-with-role`;
	}
	API_GetAllRequestDataStatistic() {
		return `/api/_all/statistic`;
	}
	API_DeleteAll_Role_Request() {
		return `/api/_delete/role-requests`;
	}
	API_DeleteAll_Role_Organization() {
		return `/api/_delete/role-organizations`;
	}
	API_GetAllOfUser_Feature(userId) {
		return `/api/user/${userId}/_all/features`;
	}
	API_GetAllFeature() {
		return `/api/_all/features`;
	}
	API_GetAll_Attachment_Permisition(userId) {
		return `/api/user/${userId}/_all/attachment-permisitions`;
	}
	API_CheckPermissionUserInRequestData(requestDataId) {
		return `/api/_check_permission/statistic?requestDataId=${requestDataId}`;
	}
	SearchAllCategoryGroup(id, page = 0, size = 10) {
		return `/api/_all_child_pageable/${id}/category-groups?page=${page}&size=${size}`;
	}
	countAllChildPageable(id) {
		return `/api/_count_child_pageable/${id}/category-groups`;
	}
	API_ImportCargo_Me() {
		return `/api/_import_cargo/me-cargos`;
	}
	API_ImportCargo() {
		return `/api/_import_cargo/construction-cargos`;
	}
	API_GetAllMeCargo(page = 0, size = 10) {
		return `/api/search_custom/me-cargos?page=${page}&size=${size}`;
	}
	API_GetAllCargoService(page = 0, size = 10) {
		return `/api/search_custom/construction-cargos?page=${page}&size=${size}`;
	}
	API_GetCargoKeyWord(name,sort ="name", page = 0, size = 10) {
		return `/api/_all/search_name/bp_cargo/category-groups?name=${name}&page=${page}&size=${size}&sort=${sort}`;
		
	}
	API_GetAllMaHieuServices() {
		return `/api/_all_ma_hieu/construction-cargos`;
	}
	API_GetAllMaHieuMe() {
		return `/api/_all_ma_hieu/me-cargos`;
	}
	API_GetAllOrganizaionByRankInOrg(id) {
		return `/api/organization/_all_rank_in_org/${id}/rank`;
	}
	API_GetAllProcessInfoByRequestWithRole(id) {
		return `/api/request/${id}/_all_with_role/process-infos?ignoreField=true`
	}

}
const administratorAPI = new AdministratorAPI();
export default administratorAPI;
