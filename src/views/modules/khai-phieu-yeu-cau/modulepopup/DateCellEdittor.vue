<template>
    <v-card>
        <v-row justify="center">
            <v-date-picker v-model="picker" no-title scrollable></v-date-picker>
        </v-row>
    </v-card>
</template>

<script>
// import moment from "moment";

export default {
	name: "DateCellEditorsVue",
    watch: {
        "picker": function(value){
            if(value){
                this.setMaterial(this.params.value === value);
                this.params.stopEditing()
            }
        },
    },
	data() {
		return {
            value: null,
            picker: null,
            dateFormat: "DD/MM/yyyy",
		};
	},
	mounted() {
    },
    computed: {
    },
	created() {
        // this.GetDataCentralizedShoppingsPaging(constant.page, constant.page_size);
        // this.setMaterial(this.params.value === null);
	},

	methods: {
        getValue() {
            if(this.value){
                return this.value;
            }
        },
        setMaterial() {
            this.value = this.picker;
        },
	},
};
</script>

<style lang="scss" scoped></style>
