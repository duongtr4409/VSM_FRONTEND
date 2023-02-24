import vue from "@/main";
import numeral from "numeral";

numeral.register("locale", "vi", {
	delimiters: {
		thousands: ".",
		decimal: ",",
	},
	abbreviations: {
		thousand: "K",
		million: "M",
		billion: "B",
		trillion: "T",
	},
	currency: {
		symbol: vue.$t("label.currency_symbol"),
	},
});
numeral.locale("vi");

export default numeral;
