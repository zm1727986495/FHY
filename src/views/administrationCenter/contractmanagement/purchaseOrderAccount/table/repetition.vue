<template>
    <div class="simTable table_list unsortable">
        <el-button class="button-96" size="small" @click="repeat">去重</el-button>
        <el-table v-loading="tableObj.tabLoading" border :data="tableObj.tableData" @selection-change="selectChange" ref="table" class="m-top20">
            <el-table-column type="selection" align="center"></el-table-column>
            <el-table-column width="250" show-overflow-tooltip prop="purchaseNumber" align="center" label="采购单号"></el-table-column>
            <el-table-column show-overflow-tooltip prop="settlementMoneyIm" align="center" label="对账金额"></el-table-column>
            <el-table-column width="150" show-overflow-tooltip prop="asAmountIm" align="center" label="加减收金额"></el-table-column>
            <el-table-column width="150" show-overflow-tooltip prop="additionalAsAmountIm" align="center" label="额外加减收"></el-table-column>
            <el-table-column show-overflow-tooltip prop="createNameIm" align="center" label="创建人"></el-table-column>
            <el-table-column width="150" show-overflow-tooltip prop="createTimeIm" align="center" label="创建时间"></el-table-column>
            <el-table-column width="150" show-overflow-tooltip prop="feeMonthIm" align="center" label="对账日期"></el-table-column>
            <!-- <el-table-column show-overflow-tooltip prop="settlementMoneyIm" align="center" label="结算金额"></el-table-column> -->
            <el-table-column width="400" show-overflow-tooltip prop="remark" align="center" label="备注"></el-table-column>
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
import { listRepeatPurchaseDataVO, editRepeatPurchaseData } from '@/api/administrationCenter/purchaseOrderAccountCheck/index';
export default {
    components:{
        pagination
    },
    props:["tableObj","purchaseOrderBatchId"],
    data(){
        return{
            formList:{
                page:1,
                limit:10,
                purchaseOrderBatchId:''
            },
            rowsData:[]
        }
    },
    methods: {
        repeat(){
            if(this.rowsData.length){
                var allArr=[];
                for(var i=0;i<this.rowsData.length;i++){
                　　var flag = true;
                　　for(var j=0;j<allArr.length;j++){
                　　　　if(this.rowsData[i].purchaseNumber == allArr[j].purchaseNumber){
                　　　　　　flag = false;
                　　　　};
                　　}; 
                　　if(flag){
                　　　　allArr.push(this.rowsData[i]);
                　　};
                };
                let arr=[], brr=[];
                allArr.map((item,idx)=>{
                    arr.push(item.purchaseNumber);
                    brr.push(item.purchaseOrderBatchDataId)
                })
                editRepeatPurchaseData({
                    purchaseNumber:arr,
                    purchaseOrderBatchDataId:brr,
                    purchaseOrderBatchId:this.purchaseOrderBatchId
                }).then(res=>{
                    this.$message.success("去重成功")
                    this.pages()
                })
            }else{
                this.$message.warning("请选择")
            }
        },
        selectChange(val){
            for(let i=0;i<val.length-1;i++){
                if(val[val.length-1].purchaseNumber==val[i].purchaseNumber){
                    this.$refs.table.toggleRowSelection(val[val.length-1],false)
                    this.$message.warning("采购单号不可相同");
                    break;
                }
            }
            this.rowsData=val;
        },
        pages(){
            this.formList.purchaseOrderBatchId=this.purchaseOrderBatchId;
            listRepeatPurchaseDataVO(this.formList).then(res=>{
                this.tableObj.total=res.data.total;
                this.tableObj.tableData=res.data.rows;
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