let mangso = [
	"không",
	"một",
	"hai",
	"ba",
	"bốn",
	"năm",
	"sáu",
	"bảy",
	"tám",
	"chín",
];
class DocSoModule{
     dochangchuc(so, daydu) {
        let chuoi = "";
        let chuc = Math.floor(so / 10);
        let donvi = so % 10;
    
        if (chuc > 1) {
            chuoi = " " + mangso[chuc] + " mươi";
            if (donvi == 1) {
                chuoi += " mốt";
            }
        } else if (chuc == 1) {
            chuoi = " mười";
            if (donvi == 1) {
                chuoi += " một";
            }
        } else if (daydu && donvi > 0) {
            chuoi = " lẻ";
        }
        if (donvi == 5 && chuc > 1) {
            chuoi += " lăm";
        } else if (donvi > 1 || (donvi == 1 && chuc == 0)) {
            chuoi += " " + mangso[donvi];
        }
        return chuoi;
    }
    
     docblock(so, daydu) {
        let chuoi = "";
        let tram = Math.floor(so / 100);
        so = so % 100;
        if (daydu || tram > 0) {
            chuoi = " " + mangso[tram] + " trăm";
            chuoi += this.dochangchuc(so, true);
        } else {
            chuoi = this.dochangchuc(so, false);
        }
        return chuoi;
    }
    
     dochangtrieu(so, daydu) {
        let chuoi = "";
        let trieu = Math.floor(so / 1000000);
        so = so % 1000000;
        if (trieu > 0) {
            chuoi = this.docblock(trieu, daydu) + " triệu";
            daydu = true;
        }
        let nghin = Math.floor(so / 1000);
        so = so % 1000;
        if (nghin > 0) {
            chuoi += this.docblock(nghin, daydu) + " nghìn";
            daydu = true;
        }
        if (so > 0) {
            chuoi += this.docblock(so, daydu);
        }
        return chuoi;
    }
    
     docso(so) {
        if (so == 0) return mangso[0];
        let chuoi = "",
            hauto = "";
        do {
            let ty = so % 1000000000;
            so = Math.floor(so / 1000000000);
    
            if (so > 0) {
                chuoi = this.dochangtrieu(ty, true) + hauto + chuoi;
            } else {
                chuoi = this.dochangtrieu(ty, false) + hauto + chuoi;
            }
            hauto = " tỷ";
        } while (so > 0);
    
        return chuoi;
    }
    
    ///////////////////////////////////////////////////////Thêm đọc phần thập phân
    
     docSoThapPhan(soThapPhan) {
        if (soThapPhan == 0) return mangso[0];
        let docSoTP = soThapPhan.toString();
        if (docSoTP.indexOf(".") !== -1) {
            soThapPhan =
                this.docso(parseFloat(docSoTP.split(".")[0])) +
                " phẩy " +
                this.docso(parseFloat(docSoTP.split(".")[1]));
        } else {
            soThapPhan = this.docso(soThapPhan);
        }
        return soThapPhan;
    }
    
    /* docSoTheoCent(soThapPhan) {
        if (soThapPhan == 0) return mangso[0];
        var docSoTP = soThapPhan.toString();
        if(docSoTP.includes(".")){
            soThapPhan = docso(parseFloat(docSoTP.split(".")[0])) + " và " + docso(parseFloat(docSoTP.split(".")[1]%10)) + " cents";
        }
        else {
            soThapPhan = docso(soThapPhan);
        }
        return soThapPhan;
    }*/
}
const docSoModule = new DocSoModule();
export default docSoModule;