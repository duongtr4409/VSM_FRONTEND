<template>
	<v-card elevation="0" ref="form" class="p-5">
        <v-card-text class="text-center">
            {{item.organizationName}}
        </v-card-text>
        <div v-for="(item, index) in listChild" :key="index">
            {{item.fullName}}
            <v-divider></v-divider>
        </div>
	</v-card>
</template>

<script>

export default {
	name: "ItemsOrgchartTree",
	props: { item: {}, responsechild: {}},
	watch: {
        item(value){
            this.item_ = value;
        },
        responsechild(value){
            this.listChild = value.data
        }
	},

	data() {
		return {
            item_: null,
            organzationName: null,
            listChild: []
		};
	},

	mounted() {},
	created() {
        this.listChild = this.responsechild;
        this.item_ = this.item;
	},

	methods: {
	
	},
};
</script>

<style lang="scss" scoped></style>
