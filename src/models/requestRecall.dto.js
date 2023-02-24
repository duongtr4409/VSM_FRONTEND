const RequestRecallDto = {
	createdDate: new Date(),
	createdName: "",
	createdOrgName: "",
	createdRankName: "",
	feedBack: "",
	id: null,
	isActive: false,
	isDelete: false,
	modifiedName: "",
	modifiedate: new Date(),
	processTime: null, // time xu ly yeu cau
	processer: null, //nguoi xu ly
	reason: "",
	recallCode: "",
	recaller: null, //nguoi gui y/c
	requestData: null,
	requestTime: new Date(), //time y/c
	result: "",
	stepData: null,
};
export default RequestRecallDto;
