<template>
    <div>
        <div class="head_nav">
            <breadcrumb :navList="navList"></breadcrumb>
        </div>
         <orderdetail></orderdetail>
         <contractdetails :contract-id="contractId"></contractdetails>
        <div>
            <el-tabs type="border-card" v-model="tabActive" class="auditInformation">
                <el-tab-pane label="采购合同" name="1">
                    <PurchaseContract :setQuery="setQuery" :status="status" v-if="tabActive == 1 && contractDetails.isSplitOrder && purchaseOrderList.length"></PurchaseContract>
                </el-tab-pane>
                <el-tab-pane label="采购单列表" name="2">
                    <PurchaseListTable v-if="tabActive == 2"></PurchaseListTable>
                </el-tab-pane>
                <el-tab-pane label="商品信息" name="3">
                    <commodity v-if="tabActive == 3"></commodity>
                </el-tab-pane>
                <el-tab-pane label="库取单" name="4">
                    <WarehouseListTable v-if="tabActive == 4"></WarehouseListTable>
                </el-tab-pane>
                
            </el-tabs>
        </div>
        <div class="btnGoBack m-top20">
            <el-button size="medium" @click="close">关闭</el-button>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex';
import PurchaseContract from '@/views/administrationCenter/contractmanagement/components/PurchaseContract';
import PurchaseListTable from '@/views/administrationCenter/contractmanagement/components/PurchaseListTable';
import WarehouseListTable from '@/views/administrationCenter/contractmanagement/components/WarehouseListTable';
import breadcrumb from "@/views/components/breadcrumb";
import orderdetail from "@/views/order/components/orderdetail";
import contractdetails from "@/views/administrationCenter/contractmanagement/components/contractdetails";
import commodity  from "@/views/administrationCenter/contractmanagement/components/commodity";
import { listBaseDict } from "@/api/pulicJava";
export default {
    components:{
        PurchaseContract,
        PurchaseListTable,
        WarehouseListTable,
        breadcrumb,
        orderdetail,
        contractdetails,
        commodity,
    },
    data(){
        return{
            navList:[],
            tabActive: '1',
            contractId:"",
            status:true,
            setQuery:false,
            // roomList:[]
        }
    },
    mounted() {
        this.init()
    },
    // activated(){
    //     this.init()
    // },
    // deactivated () {
    //     this.$destroy(true)
    // },
    methods: {
        init(){
            this.navList = this.$route.meta;
            this.contractId=this.$route.query.contractId;
            if(this.$route.query.onlyReady){
                this.status=false;
                this.setQuery=true;
            }
            this.getBaseDict('ROOM_TYPE');
        },
        close(){
            this.$router.go(-1)
        },
        getBaseDict(dataType) {
            let params = {
                dataType: dataType
            }
            listBaseDict(params)
            .then(response => {
                // this.roomList = response.data;
                this.$store.dispatch('SET_ROOM_LIST', response.data);
            })
            .catch(error => {
                console.log('views/contractmanagement/audit.vue:getBaseDict' + error)
            })
        },
    },
    computed: {
        ...mapGetters([
            'contractDetails',
            'purchaseOrderList',
            'orderDetails',
            'roomList'
        ]),
    },
}
</script>
<style lang="scss" scoped>
    .btnGoBack{
        text-align: center;
    }
</style>
