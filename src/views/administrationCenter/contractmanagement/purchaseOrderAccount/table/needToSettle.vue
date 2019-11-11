<template>
    <div class="simTable table_list unsortable">
        <el-table border :data="tableObj.tableData"
        :row-class-name="tableRowClassName"
        v-loading="tableObj.tabLoading"
        @selection-change="selectChange"
        >
            <el-table-column fixed type="selection" align="center"></el-table-column>
            <el-table-column width="250px" show-overflow-tooltip align="center" prop="purchaseNumber" label="采购单">
                <template slot-scope="scope">
                    <div>
                        <el-tooltip placement="right" visible-arrow>
                            <div slot="content" class="tips tipFon">
                                <p class="operaItems" @click="dispose(scope.row)">处理</p>
                            </div>
                            <img :src="spot" alt="" class=" attributesTips">
                        </el-tooltip>
                    </div>
                    <div>
                        {{scope.row.purchaseNumber}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column width="180px" show-overflow-tooltip align="center" prop="settlementMoneyIm" label="对账金额">
                <template slot-scope="scope">
                    <div>
                        <el-input @focus="focus(scope.row.settlementMoneyIm)" :disabled="scope.row.settlementMoneyIm===0||scope.row.accountsStatus==3" @input="changeNum(scope.row,1)" @blur="changeMoney(scope.row,scope.row.settlementMoneyIm,0)" placeholder="请输入金额" size="small" v-model="scope.row.settlementMoneyIm"></el-input>
                    </div>
                </template>
            </el-table-column>
            <el-table-column width="180px" show-overflow-tooltip align="center" prop="asAmountIm" label="加减收">
                <template slot-scope="scope">
                    <div>
                        <el-input @focus="focus(scope.row.asAmountIm)" :disabled="scope.row.asAmountIm===0||scope.row.accountsStatus==3" @input="changeNum(scope.row,2)" @blur="changeMoney(scope.row,scope.row.asAmountIm,1)" placeholder="请输入加减收金额" size="small" v-model="scope.row.asAmountIm"></el-input>
                    </div>
                </template>
            </el-table-column>
            <el-table-column width="180px" show-overflow-tooltip align="center" prop="additionalAsAmountIm" label="额外加减收">
                <template slot-scope="scope">
                    <div>
                        <el-input @focus="focus(scope.row.additionalAsAmountIm)" :disabled="scope.row.additionalAsAmountIm===0||scope.row.accountsStatus==3" @input="changeNum(scope.row,3)" @blur="changeMoney(scope.row,scope.row.additionalAsAmountIm,2)" placeholder="请输入额外加减收金额" size="small" v-model="scope.row.additionalAsAmountIm"></el-input>
                    </div>
                </template>
            </el-table-column>
            <el-table-column width="180px" show-overflow-tooltip align="center" prop="settlementMoney" label="差额">
                <template slot-scope="scope">
                    <div>
                        {{(scope.row.settlementMoneyIm+scope.row.asAmountIm+scope.row.additionalAsAmountIm-scope.row.settlementMoney).toFixed(2)}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column width="180px" show-overflow-tooltip align="center" prop="verifyMonye" label="对账成本金额"></el-table-column>
            <el-table-column width="180px" show-overflow-tooltip align="center" prop="settlementMoney" label="拆单成本金额"></el-table-column>
            <el-table-column width="180px" show-overflow-tooltip align="center" prop="purchaseStatus" label="执行状态">
                <template slot-scope="scope">
                    <div v-if="scope.row.purchaseStatus==1">待执行</div>
                    <div v-if="scope.row.purchaseStatus==2">执行完成</div>
                </template>
            </el-table-column>
            <el-table-column width="180px" show-overflow-tooltip align="center" prop="accountsStatus" label="对账状态">
                <template slot-scope="scope">
                    <div v-if="scope.row.accountsStatus==1">对账中</div>
                    <div v-if="scope.row.accountsStatus==2">对账完成</div>
                    <div v-if="scope.row.accountsStatus==3">结算中</div>
                    <div v-if="scope.row.accountsStatus==4">结算完成</div>
                </template>
            </el-table-column>
            <el-table-column width="180px" show-overflow-tooltip align="center" prop="feeMonthIm" label="对账日期"></el-table-column>
            <el-table-column width="180px" show-overflow-tooltip align="center" prop="createTimeIm" label="导入时间"></el-table-column>
            <el-table-column width="180px" show-overflow-tooltip align="center" prop="createNameIm" label="导入人"></el-table-column>
            <el-table-column width="200px" show-overflow-tooltip align="center" prop="remark" label="备注"></el-table-column>
        </el-table>
        <div class="pagination_wrap">
            <pagination
                :current-page="needParams.page"
                :pageSize="needParams.limit"
                :total="tableObj.total"
                @sizeChange="sizeChange"
                @currentChange="currentChange">
            </pagination>
        </div>
    </div>
</template>
<script>
import pagination from '@/views/components/pagination';
import spot from '@/assets/images/spot.png';
import { listPurchaseDataVO, savePurchaseOrderData, editImportPurchaseData } from '@/api/administrationCenter/purchaseOrderAccountCheck/index';
export default {
    props:["tableObj","purchaseOrderBatchId","updatas"],
    components:{
        pagination
    },
    data(){
        return{
            needParams:{
                page:1,
                limit:10,
                purchaseOrderBatchId:''
            },
            spot,
            focusMoney:0
        }
    },
    watch: {
        updatas(val){
            console.log(val)
            this.pages()
        }
    },
    updata(){
        this.pages()
    },
    mounted() {
        console.log(this.updatas)
    },
    methods: {
        selectChange(val){
            this.$emit("rowsData",val)
        },
        focus(val){
            this.focusMoney=val;
        },
        changeMoney(val,money,index){
            if(money==""){
                money=0;
            }
            if(this.focusMoney!=money){
                editImportPurchaseData({
                    purchaseOrderBatchDataId:val.purchaseOrderBatchDataId,
                    settlementMoney:Number(money),
                    dataType:index,
                    purchaseNumber:val.purchaseNumber
                }).then(res=>{
                    this.$message.success("修改成功")
                    this.pages()
                })
            }
        },
        changeNum(val,index){
            if(index==1){
                val.settlementMoneyIm = val.settlementMoneyIm.replace(/[^\-?\d.]/g,'');
            }else if(index==2){
                val.asAmountIm = val.asAmountIm.replace(/[^\-?\d.]/g,'');
            }else if(index==3){
                val.additionalAsAmountIm = val.additionalAsAmountIm.replace(/[^\-?\d.]/g,'');
            }
        },
        dispose(val){
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
        sizeChange(val){
            this.needParams.page=1;
            this.needParams.limit=val;
            this.pages()
        },
        currentChange(val){
            this.needParams.page=val;
            this.pages()
        },
        pages(){
            this.tableObj.tabLoading=true;
            this.needParams.purchaseOrderBatchId= this.purchaseOrderBatchId;
            listPurchaseDataVO(this.needParams).then(res=>{
                res.data.rows.map((item,idx)=>{
                    if(item.additionalAsAmountIm==null){
                        item.additionalAsAmountIm=0;
                    }
                    if(item.settlementMoneyIm==null){
                        item.settlementMoneyIm=0;
                    }
                    if(item.asAmountIm==null){
                        item.asAmountIm=0;
                    }
                    if(!item.verifyMonye){
                        item.verifyMonye=0;
                    }
                })
                this.tableObj.tabLoading=false;
                this.tableObj.tableData=res.data.rows;
                this.tableObj.total=res.data.total;
                this.getSpanArr(this.tableObj.tableData)
            })
        },
        // 计算跨列（按房源）
        spanMethodByHouse({ row, column, rowIndex, columnIndex }){
            if(columnIndex <= 2){
                const _row = this.spanArr[rowIndex];
                const _col = _row > 0 ? 1 : 0;
                return {
                    rowspan: _row,
                    colspan: _col
                }
            }
        },
        tableRowClassName({row, rowIndex}) {//表格斑马线设置
            return rowIndex % 2 != 0 ? 'el-f0' : '';
        },
        getSpanArr(data){
            this.spanArr = [];
            for (var i = 0; i < data.length; i++){
                if(i === 0){
                    this.spanArr.push(1);
                    this.pos = 0;
                }else{
                    if (data[i].purchaseNumber=== data[i - 1].purchaseNumber){
                        this.spanArr[this.pos] += 1;
                        this.spanArr.push(0);
                    }else{
                        this.spanArr.push(1);
                        this.pos = i;
                    }
                }
            }
        },
    },
}
</script>