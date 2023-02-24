class CustomerAPI {
	API_GetPreviewLink(id, otp = "") {
		return `/customer/api/file/office365/preview/${id}?otp=${otp}`;
	}

	API_GetCheckOtp(requestDataId, opt) {
		return `/customer/api/_check/otps?requestDataId=${requestDataId}&opt=${opt}`;
	}

	API_GetRequestDataByID(id, otp = "") {
		return `/customer/api/request-data/${id}?otp=${otp}`;
	}

	API_GetHisTradeRequestData(id, otp = "") {
		return `/customer/api/request-data/${id}/_all/information-in-exchanges?otp=${otp}`;
	}

	API_Chat(otp = "") {
		return `/customer/api/information-in-exchanges?otp=${otp}`;
	}

	API_GetFileCutomerView(id, otp = "") {
		return `/customer/api/_view_file_customer/${id}/request-data?otp=${otp}`;
	}

	API_GetAllAttachmentFileByRequestDataId(id, otp = "") {
		return `/customer/api/request-data/${id}/_all/attachment-files?otp=${otp}`;
	}

	API_GetSignDataOfRequestData(id, otp = "") {
		return `/customer/api/request-data/${id}/_all/sign-data?otp=${otp}`;
	}

	API_UpdateSignData(id, otp = "") {
		return `/customer/api/sign-data/${id}?otp=${otp}`;
	}
	API_GetHashFile(id, otp = "") {
		return `/customer/api/file/office365/hash-file/${id}?otp=${otp}`;
	}
	API_SignAnonymous(otp = "") {
		return `/customer/api/sign/anonymous?otp=${otp}`;
	}
	API_ProcessAnonymous(otp = "") {
		return `/customer/api/process/request_data?otp=${otp}`;
	}
	API_GetAllAttachmentFileByRequestDataIdHasSign(requestDataId, otp = "") {
		return `/customer/api/sign/_all/${requestDataId}/file_sign?otp=${otp}`;
	}
	API_DownloadFile365(param, fileName, extension, otp = "") {
		let url = `/customer/api/file/office365/download/${fileName}.${extension}`;
		let start = true;
		for (let key in param) {
			if (start) {
				start = false;
				url += "?" + key + "=" + param[key];
			} else {
				url += "&" + key + "=" + param[key];
			}
		}
		if (start) {
			url += `?otp=${otp}`;
		} else {
			url += `&otp=${otp}`;
		}
		return url;
	}
	API_GetCurrentStep(requesId, otp) {
		return `/customer/api/check_has_sign/${requesId}?otp=${otp}`;
	}
	API_SendOTP(hash) {
		return `/customer/api/send-otp?hash=${hash}`;
	}
}
const customerAPI = new CustomerAPI();
export default customerAPI;
