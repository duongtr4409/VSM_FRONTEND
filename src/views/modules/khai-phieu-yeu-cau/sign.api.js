class SignAPI {
	Viettel_GetToken() {
		return `http://localhost:8888/GetToken`;
	}
	Viettel_GetCert() {
		return `http://localhost:8888/GetCert`;
	}
	Viettel_SignHash() {
		return `http://localhost:8888/SignHash`;
	}
	MobiFone_GetCert() {
		return `http://localhost:6704/api/mobi/getcert?mst=`;
	}
	MobiFone_SignPDF() {
		return `http://localhost:6704/api/mobi/signpdf`;
	}
}
const signApi = new SignAPI();
export default signApi;
