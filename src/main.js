import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import VueDraggable from "vuedraggable";
import VueProgressBar from "vue-progressbar";
import i18n from "./i18n";
import VJsf from "@koumoul/vjsf";
import axios from "./plugins/axios";
import VueAxios from "vue-axios";
import globalService from "./services/global.service";
import moment from "vue-moment";
import VueToast from "vue-toast-notification";
import iBaseComponent from "./mixins/iBaseComponent.mixin";
import TreeItemVue from "./components/TreeItem.vue";
import TreeItemFileVue from "./components/TreeItemFile.vue";
import NavItemVue from "./components/NavItem.vue";
import common from "./mixins/common.mixin";
import "@koumoul/vjsf/dist/main.css";
import "vue-toast-notification/dist/theme-sugar.css";
import "@/assets/styles/tailwind.css";
import "@/assets/styles/main.css";
import BreadcrumbsVue from "./components/Breadcrumbs.vue";
import OrgchartTreeVue from "./components/OrgchartTree.vue";
import DeleteDialogVue from "./components/DeleteDialog.vue";
import TabVue from "./components/Tab.vue";
import TabVueV2 from "./components/TabV2.vue";
import DRTree from "./components/DRTree.vue";

import SelectListVue from "./components/SelectList.vue";
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import { TiptapVuetifyPlugin } from "tiptap-vuetify";
import vueJsonEditor from "vue-json-editor";
import "./components/form-control/form-control";
import "./components/components";
// don't forget to import CSS styles
import "tiptap-vuetify/dist/main.css";
// Vuetify's CSS styles
import "vuetify/dist/vuetify.min.css";
import signInVue from "./views/modules/auth/sign-in.vue";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
// load third-party dependencies (markdown-it, vuedraggable)
// you can also load them separately based on your needs
// import "@koumoul/vjsf/dist/third-party";
import VueQuillEditor from "vue-quill-editor";

// require styles
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import Quill from "quill";
const quillTable = require("quill-table");
import * as QuillTableUI from "quill-table-ui";
const options = {
	color: "#D50000",
	failedColor: "#B71C1C",
	thickness: "5px",
	transition: {
		speed: "0.2s",
		opacity: "1s",
		termination: 300,
	},
	autoRevert: true,
	location: "top",
	inverse: false,
};
import define from "@/mixins/define.mixin";

Vue.component("tree-item", TreeItemVue);
Vue.component("tree-item-file", TreeItemFileVue);
Vue.component("nav-item", NavItemVue);
Vue.component("vue-breadcrumbs", BreadcrumbsVue);
Vue.component("vue-orgchart-tree", OrgchartTreeVue);
Vue.component("vue-delete-dialog", DeleteDialogVue);
Vue.component("vue-tab", TabVue);
Vue.component("vue-tab-2", TabVueV2);
Vue.component("vue-select-list", SelectListVue);
Vue.component("vue-perfect-scrollbar", VuePerfectScrollbar);
Vue.component("vue-sign-in", signInVue);
Vue.component("VJsf", VJsf);
Vue.component("dr-tree", DRTree);
Vue.component(VueDraggable);
Vue.component("vue-json-editor", vueJsonEditor);
Quill.register(quillTable.TableCell);
Quill.register(quillTable.TableRow);
Quill.register(quillTable.Table);
Quill.register(quillTable.Contain);
Quill.register({ "modules/table": quillTable.TableModule }, true);
Quill.register(
	{
		"modules/tableUI": QuillTableUI.default,
	},
	true,
);
Vue.use(VueQuillEditor /* { default global options } */);
Vue.use(VueProgressBar, options);
Vue.use(VueAxios, axios);
Vue.use(globalService);
Vue.use(moment);
Vue.use(VueToast);
Vue.use(TiptapVuetifyPlugin, {
	// the next line is important! You need to provide the Vuetify Object to this place.
	vuetify, // same as "vuetify: vuetify"
	// optional, default to 'md' (default vuetify icons before v2.0.0)
	iconsGroup: "mdi",
});
// Vue.directive("click-outside", {
// 	bind: function (el, binding, vnode) {
// 		el.clickOutsideEvent = function (event) {
// 			// here I check that click was outside the el and his children
// 			if (!(el == event.target || el.contains(event.target))) {
// 				// and if it did, call method provided in attribute value
// 				vnode.context[binding.expression](event);
// 			}
// 		};
// 		document.body.addEventListener("click", el.clickOutsideEvent);
// 	},
// 	unbind: function (el) {
// 		document.body.removeEventListener("click", el.clickOutsideEvent);
// 	},
// });
Vue.mixin(iBaseComponent);
Vue.mixin(common);
Vue.mixin(define);
Vue.config.productionTip = false;
const vue = new Vue({
	router,
	store,
	i18n,
	vuetify,
	render: (h) => h(App),
}).$mount("#app");

vue.$vuetify.theme.dark = false;
export default vue;
