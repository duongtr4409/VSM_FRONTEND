<template>
	<v-card elevation="0" class="overflow-y-auto" style="height: 100vh">
		<vue-breadcrumbs></vue-breadcrumbs>
		<v-dialog v-model="dialog.itemsorgcharttree" width="30vw" persistent>
			<ItemsorgcharttreeVue
				:item="item_"
				:responsechild="response_child"
			/>
		</v-dialog>
		<div class="test">
			<div class="border-child" style="width: 200px;">
				Tổng cục
			</div>
		</div>
		<v-card-text>
			<v-treeview
				v-model="selected"
				:items="root"
				style="display: flex;"
				class="tree"
				>
				<!-- open-on-click -->
				<template v-slot:prepend="{item}"> 
					<div v-if="item">
						<v-icon> mdi-arrow-down </v-icon>
					</div>
				</template>
				<template v-slot:label="{ item }">
					<div class="border-child" @click="getItemChild(item)">
						{{ item.organizationName }}
					</div>
				</template>
			</v-treeview>
		</v-card-text>
	</v-card>
</template>

<script>
import globalService from "@/services/global.service";
import administratorAPI from "../administrator.api";
import ItemsorgcharttreeVue from './Itemsorgcharttree.vue';
export default {
	name: "OrgchartListVue",
	components: {
		ItemsorgcharttreeVue
	},
	data() {
		return {
			// user_current: this.getUserInfo(),
			selected: [],
			dialog: {
				edit: false,
				delete: false,
				itemsorgcharttree:  false
			},
			isSaving: false,
			editedItem: {
				id: null,
				organizationCode: "",
				organizationName: "",
				orgParentCode: "",
				orgParentName: "",
				createdId: null,
				createdName: "",
				createdDate: null,
				modifiedId: null,
				modifiedName: "",
				modifiedDate: null,
				isActive: true,
				orgParent: null,
				childOrganization: [],
				isDelete: false,
				description: "",
			},
			defaultItem: {
				id: null,
				organizationCode: "",
				organizationName: "",
				orgParentCode: "",
				orgParentName: "",
				createdId: null,
				createdName: "",
				createdDate: null,
				modifiedId: null,
				modifiedName: "",
				modifiedDate: null,
				isActive: true,
				orgParent: null,
				childOrganization: [],
				isDelete: false,
				description: "",
			},
			listOrgParrent: [],
			root: [],
			raw: [],
			showAllText: false,
			listOrg: [],
			isDeleting: false,
			item_: null,
			response_child: null
		};
	},
	watch: {
	},
	created() {
		this.load();
	},
	methods: {
		load() {
			this.getCustomAllOrg();
			this.getAllOrg();
		},
		async getAllOrg() {
			let response = await globalService.getData_Async(
				administratorAPI.API_FindAllOrganization(),
			);
			if (!response || !response.state) {
				return;
			}
			this.listOrg = response.data.filter((entry) => {
				return !entry.isDelete;
			});

			this.listOrgParrent = response.data.filter((entry) => {
				return !entry.isDelete;
			});
		},
		async getCustomAllOrg() {
			let response = await globalService.getData_Async(
				administratorAPI.API_FindCustomAllOrganization(),
			);
			if (!response || !response.state) {
				return;
			}

			this.root = response.data
				.filter((entry) => {
					return !entry.orgParent && !entry.isDelete;
				})
				.map((entry) => {
					// return { ...entry, children: entry.childOrganization };
					return this.mapArray(entry);
				});
		},
		mapArray(source) {
			for (let key in source) {
				if (key == "childOrganization") {
					source.childOrganization = source.childOrganization.filter(
						(ele) => !ele.isDelete,
					);
					for (let childElement of source[key]) {
						this.mapArray(childElement);
					}
					source["children"] = source[key];
				}
			}
			return source;
		},

		async getItemChild(item){
			this.item_ = item;
			try {
				let response = await globalService.getData_Async(
					administratorAPI.API_Organization_rank(item.id),
					);
					if (!response || !response.state) {
						return;
					}
					this.response_child = response;
					
				if(response.data.length > 0){
					this.dialog.itemsorgcharttree = true;
				}
			} catch (error) {
				console.error(error);
			}
		}
	},
};
</script>

<style scoped>
.v-menu__content {
	max-width: 20vw !important;
	margin-top: 20px;
}
.v-treeview-node__root {
	border-top: 1px solid #ccc;
}

.border-child{
	width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
.v-treeview-node__level{
  width: 0 !important;
}
.v-treeview-node__content{
    display: flex;
    flex-direction: column ;
}
.tree > .v-treeview-node > .v-treeview-node__children{
  display: flex !important;
  justify-content: center;
}
.test{
	display: flex;
	justify-content: center;
	margin-top: 30px;
}
template{
	background-color: red ;
}
</style>
