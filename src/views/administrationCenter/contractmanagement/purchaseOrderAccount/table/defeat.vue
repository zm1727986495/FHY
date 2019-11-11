<template>
    <div class="simTable table_list unsortable">
        <el-button class="button-96" size="small" @click="exportExcel">导出</el-button>
        <el-table v-loading="tableObj.tabLoading" border :data="tableObj.tableData">
            <el-table-column show-overflow-tooltip prop="importRemark" align="center" label="失败原因" width="400px"></el-table-column>
            <el-table-column width="250px" show-overflow-tooltip prop="purchaseNumber" align="center" label="采购单号"></el-table-column>
            <el-table-column width="100px" show-overflow-tooltip prop="settlementMoney" align="center" label="对账金额"></el-table-column>
            <el-table-column width="100px" show-overflow-tooltip prop="asAmount" align="center" label="加减收"></el-table-column>
            <el-table-column width="100px" show-overflow-tooltip prop="additionalAsAmount" align="center" label="额外加减收"></el-table-column>
            <el-table-column width="400px" show-overflow-tooltip prop="remark" align="center" label="备注"></el-table-column>
        </el-table>
        <div class="pagination_wrap">
            <pagination
                :current-page="formList.page"
                :pageSize="formList.limit"
                :total="tableObj.total"
                @sizeChange="sizeChange"
                @currentChange="currentChange">
            </pagination>
        </div>
    </div>
</template>
<script>
import pagination from '@/views/components/pagination';
import { listPurchaseOrderBatchDataFailVO, exportPurchaseOrderBatchDataFailVO } from '@/api/administrationCenter/purchaseOrderAccountCheck/index';
import spot from '@/assets/images/spot.png';
import module from '../../../../../../config/index';
import { getToken } from '@/utils/auth';
export default {
    props:["tableObj","purchaseOrderBatchId"],
    components:{
        pagination
    },
    data(){
        return{
            formList:{
                page:1,
                limit:10,
                purchaseOrderBatchId:''
            },
            spot
        }
    },
    methods: {
        exportExcel(){
            let Url=module.dev.proxyTable['/api'].target+'/api/pc/purchasingOrder/exportPurchaseOrderBatchDataFailVO?purchaseOrderBatchId='+this.purchaseOrderBatchId + "&token=" + getToken();
            window.location.href=Url;
            // exportPurchaseOrderBatchDataFailVO({
            //     purchaseOrderBatchId:this.$route.query.purchaseOrderBatchId
            // }).then(res=>{

            // })
        },
        dispose(val){
            // console.log(val.customerContractId,val.orderId)
            if(val.customerContractId&&val.orderId){
                this.$router.push({
                    path:"needDispose",
                    query:{
                        contractId:val.customerContractId,
                        orderId:val.orderId,
                        purchaseOrderBatchDataId:val.purchaseOrderBatchDataId,
                        brandId:val.brandId,
                        commodityCategoryId:val.commodityCategoryId,
                        contractType:val.contractType,
                        dataSource:0,
                        purchaseOrderBatchId:this.purchaseOrderBatchId
                    }
                })
                
            }else{
                this.$message({
                    message: '合同与订单没有匹配上',
                    type: 'warning'
                });
            }
            
        },
        pages(){
            this.formList.purchaseOrderBatchId=this.purchaseOrderBatchId;
            listPurchaseOrderBatchDataFailVO(this.formList).then(res=>{
                this.tableObj.tableData=res.data.rows;
                this.tableObj.total=res.data.total;
            })
        },
        sizeChange(val){
            this.formList.page=1;
            this.formList.limit=val;
            this.pages()
        },
        currentChange(val){
            this.formList.page=val;
            this.pages()
        }
    },
}
</script>