<template>
	<v-card flat elevation="0">
		<v-toolbar elevation="0">
			<span class="font-bold">
				{{ $t("label.list_site") }}
			</span>
			<v-spacer></v-spacer>
			<v-btn icon @click="close">
				<v-icon> mdi-close </v-icon>
			</v-btn>
		</v-toolbar>
		<!-- <v-row class="my-[-1rem]">
			<v-col>
				<v-text-field
					v-model="s_search"
					:placeholder="$t('label.search')"
					append-icon="mdi-magnify"
					@keyup="filterSites($event)"
				>
				</v-text-field>
			</v-col>
		</v-row> -->
		<vue-perfect-scrollbar class="h-[60vh]">
			<!-- <v-treeview
					v-model="selected"
					open-on-click
					return-object
					selectable
					selection-type="independent"
					:items="root"
				>
					<template v-slot:prepend="{ item }">
						<v-icon v-if="item.children">
							{{ open ? "mdi-folder-open" : "mdi-folder" }}
						</v-icon>
					</template>
					<template slot="label" slot-scope="{ item }">
						<span @click="clickToView(item)">{{ item.name }}</span>
					</template>
				</v-treeview> -->
			<dr-tree
				:item="root"
				@toggle="unsafe_toggle"
				@select="unsafe_toggle"
				@choose="chooseItem"
			></dr-tree>
		</vue-perfect-scrollbar>

		<!-- <v-card-actions>
			<v-spacer></v-spacer>
			<v-btn
				@click="save"
				small
				class="rounded-sm"
				color="blue darken-2"
				dark
			>
				{{ $t("button.ok") }}
			</v-btn>
		</v-card-actions> -->
	</v-card>
</template>

<script>
import globalService from "@/services/global.service";
import administratorAPI from "../../administrator/administrator.api";
import constant from "@/common/constant";
import Vue from "vue";
import store from "@/store";
import graphService from "@/modules/graph/services/graph.service";

export default {
	comments: {},
	watch: {
		selected(val) {
			if (val.length > 1) {
				val.shift();
				this.selected = val;
			}
		},
	},
	data() {
		return {
			s_search: "",
			selected: [],
			root: {
				id: store.state.config.rootSite,
				name: this.$t("label.list_site"),
				folder: false,
				children: [],
			},
			defaultRoot: [],
			parrentId: null,
			ignoreNames: [
				"Search",
				"Documents",
				"Translation Packages",
				"Images",
				"Pages",
				"Site Collection Documents",
				"Site Collection Images",
				"Site Collection Pages",
				"ContextMenu",
				"PublishedFeed",
				"LeftNavFooter",
				"Settings",
				"Shared Documents",
				"WorkflowTasks",
				"LeftNavLink",
				"Access Requests",
				"Quick Deploy Items",
				"PublishedLinks",
				"Notification Pages",
				"ReusableContent",
				"ProjectPolicyItemList",
				"Reports List",
				"Variation Labels",
				"Cache Profiles",
				"PublishingImages",
				"Translation Status",
				"Long Running Operation Status",
				"ContentTypeSyncLog",
				"SiteCollectionDocuments",
				"SiteCollectionImages",
				"DeviceChannels",
				"Relationships List",
			],
		};
	},
	created() {
		this.load();
	},
	async mounted() {
		console.log("this.root.id", this.root);

		if (!this.root.id) {
			this.close();
		}
		await this.unsafe_toggle(this.root);
	},
	methods: {
		async load() {
			// await this.getRoot();
		},
		async getRoot() {
			// let response = await globalService.postData_Async(
			// 	administratorAPI.API_DataRoomGetAll(),
			// );
			// if (!response || !response.state) return;
			// if (response.data) {
			// 	Vue.set(this.root, constant.keys.children, response.data);
			// }
			// for (let child of this.root.children) {
			// 	if (!child.folder || !child.driveType) {
			// 		continue;
			// 	}
			// 	let tmp = await this.select(child);
			// 	Vue.set(child, constant.keys.children, tmp);
			// }
			await this.select(this.root);
		},
		close() {
			this.$emit("close", true);
		},
		save() {
			this.$emit("saveSite", this.selected);
			this.selected = [];
			this.close();
		},
		filterSites(event) {
			if (
				event.code == constant.keys.enter ||
				event.keyCode == constant.keys.enter_keyCode
			) {
				let val = event.target.value.trim();
				if (!val) {
					this.root = Object.assign([], this.defaultRoot);
				} else {
					this.root = this.defaultRoot.filter((entry) => {
						return entry.name
							.toLocaleLowerCase()
							.includes(val.toLocaleLowerCase());
					});
				}
			}
		},
		async toggle(event) {
			await this.select(event);
		},
		async select(event) {
			if (!event) return;
			let id = encodeURI(event.id);
			if (!event.driveType && !event.folder) {
				//// sites
				let response;
				if (!event?.id) {
					response = await globalService.postData_Async(
						administratorAPI.API_DataRoomGetAll(),
					);
				} else {
					response = await globalService.postData_Async(
						administratorAPI.API_DataRoomGetAll(id),
					);
				}
				if (response && response.data) {
					Vue.set(event, constant.keys.children, response.data);
				}
				for (let child of event.children) {
					if (!child.folder && !child.driveType) {
						continue;
					}
					await this.select(child);
				}
			} else if (!event.folder && event.driveType) {
				/// drive
				let response = await globalService.postData_Async(
					administratorAPI.API_GetAllFormDriverFolder(id),
				);
				if (!response || !response.state) {
					return;
				}
				if (response && response.data) {
					Vue.set(event, constant.keys.children, response.data);
				}
				for (let child of event.children) {
					if (!child.folder && !child.driveType) {
						continue;
					}
					await this.select(child);
				}
			} else if (event.folder && !event.folder.id) {
				///folder
				let itemid = encodeURI(event.id);
				let response = await globalService.postData_Async(
					administratorAPI.API_GetAllFormDriverFolder(id, itemid),
				);
				if (!response || !response.state) {
					return;
				}
				if (response && response.data) {
					Vue.set(event, constant.keys.children, response.data);
				}
				for (let child of event.children) {
					if (!child.folder && !child.driveType) {
						continue;
					}
					await this.select(child);
				}
			}
		},
		chooseItem(event) {
			this.$emit("saveSite", event);
			console.log(event);
			this.selected = [];
			this.close();
		},
		async unsafe_toggle(event) {
			console.log("event", event);
			if (!event || !event?.id) {
				return;
			}
			let children = [];
			if (!store.state.config.features.loadByList) {
				if (!event.folder && !event?.driveType) {
					let siteResponse = await graphService.Sites_ListSites(
						event?.id,
					);
					if (!siteResponse || !siteResponse.value) {
						console.log(siteResponse);
					} else {
						children = Array.from(siteResponse.value);
					}
					let documentResponse = await graphService.Sites_ListDrives(
						event?.id,
					);
					if (!documentResponse || !documentResponse.value) {
						console.log(documentResponse);
					} else {
						children = children.concat(
							Array.from(documentResponse.value),
						);
					}
				} else {
					let driveResponse = await graphService.Drives_ListItems(
						event?.id,
					);
					children = Array.from(driveResponse.value);
				}
				children = children.filter(
					(e) => !this.ignoreNames.includes(e.name),
				);
				Vue.set(event, constant.keys.children, children);
				for (let child of children) {
					let item = [];
					if (!child.folder && !child?.driveType) {
						item = await graphService.Sites_ListSites(child?.id);
					} else if (child?.folder && !child?.driveType) {
						item = await graphService.Sites_ListDrives(child?.id);
					} else {
						item = await graphService.Drives_ListItems(child?.id);
					}
					if (!item || !item?.value) {
						continue;
					}
					let values = item.value.filter(
						(e) => !this.ignoreNames.includes(e.name),
					);
					Vue.set(child, constant.keys.children, values);
				}
			} else {
				if (`${event.id}`.includes(constant.values.SHAREPOINT)) {
					let siteResponse = await graphService.Sites_GetSites(
						event?.id,
					);
					if (!siteResponse) {
						console.log(siteResponse);
					} else {
						let sites = Array.from(siteResponse.sites);
						let lists = Array.from(siteResponse.lists).filter(
							(e) => !this.ignoreNames.includes(e.name),
						);
						children = sites.concat(lists);
						Vue.set(event, constant.keys.children, children);
					}
				} else {
					let listResponse = await graphService.Sites_ListItems(
						event.parentReference.siteId,
						event?.id,
					);
					if (!listResponse || !listResponse.value) {
						console.log(listResponse);
					} else {
						let tmps = Array.from(listResponse.value).filter(
							(e) => !this.ignoreNames.includes(e.name),
						);
						children = this.toTree(tmps);
						Vue.set(event, constant.keys.children, children);
					}
				}
			}
		},
		toTree(list) {
			let map = {},
				node,
				roots = [],
				i;
			for (i = 0; i < list.length; i += 1) {
				map[list[i].id] = i;
				list[i].children = [];
			}
			for (i = 0; i < list.length; i += 1) {
				node = list[i];
				let parent = this.findParent(node, list);
				if (!parent) {
					roots.push(node);
				} else {
					list[map[parent.id]].children.push(node);
				}
			}
			return roots;
		},
		findParent(target, data) {
			let check = data.find((e) =>
				`${e["@odata.etag"]}`.includes(target.parentReference.id),
			);
			return check;
		},
	},
};
</script>

<style></style>
