<template>
    <div>
        <div class="head_nav">
            <breadcrumb :navList="navList"></breadcrumb>
        </div>
        <el-card>
            <div class="flexTitle">
                <i class="icon"></i>
                <span class="title">结算明细</span>
            </div>
            <div class="m-top20">
                <el-row :gutter="10">
                    <el-col :span="8">
                        <span >付款方：</span>
                        {{query.paymentName}}
                    </el-col>
                    <el-col :span="8">
                        <span >收款金额：</span>
                        {{query.receivablesMoney}} 元
                        
                    </el-col>
                    <el-col :span="8">
                        <span >费用月份：</span>
                        {{query.receivablesDate}}
                        
                    </el-col>
                    <el-col :span="8" class="m-top20">
                        <span >收款方式：</span>
                        {{query.receivablesTypeName}}
                    </el-col>
                    <el-col :span="8" class="m-top20" v-if="!query.bankAccountId">
                        <span >支票号：</span>
                        {{query.checkNumber}}
                    </el-col>
                    <el-col :span="8" class="m-top20" v-if="query.bankAccountId">
                        <span >收款账号：</span>
                        {{query.bankCardName}} || {{query.bankCardNumber}} || {{query.createName}}
                    </el-col>
                    <el-col :span="8" class="m-top20">
                        <span >所属门店：</span>
                        {{query.storeName}}
                    </el-col>
                </el-row>
            </div>
        </el-card>
        <div class="m-top20">
            <el-card>
                <div class="unsortable">
                    <el-table
                        :data="tableData"
                        border
                        row-key="id"
                        :row-class-name="tableRowClassName"
                        @selection-change="selectRows"
                        ref="topicTable">
                        <el-table-column
                        show-overflow-tooltip
                        prop="status"
                        align="center"
                        label="状态"
                        >
                        <template slot-scope="scope">
                            <div>
                                <el-tooltip placement="right" visible-arrow >
                                    <div slot="content" class="tips tipFon">
                                        <p class="operaItems" @click="check(scope.row)">选择</p>
                                        <p class="operaItems" @click="details(scope.row)">详细</p>
                                    </div>
                                    <img :src="spot" alt="" class=" attributesTips">
                                </el-tooltip>
                                <span>{{scope.row.status}}</span>
                            </div>
                        </template>
                        </el-table-column>
                        <el-table-column
                        show-overflow-tooltip
                        align="center"
                        prop="companyName"
                        label="建材城">
                        </el-table-column>
                        <el-table-column
                        show-overflow-tooltip
                        align="center"
                        prop="amountCollected"
                        label="收款金额">
                        </el-table-column>
                        <el-table-column
                        show-overflow-tooltip
                        align="center"
                        prop="refundAmount"
                        label="返款金额">
                        </el-table-column>
                        <el-table-column
                        show-overflow-tooltip
                        align="center"
                        prop="actualSettlementAmount"
                        label="实际结算金额">
                        </el-table-column>
                        <el-table-column
                        show-overflow-tooltip
                        align="center"
                        prop="createAtName"
                        label="创建人">
                        </el-table-column>
                        <el-table-column
                        show-overflow-tooltip
                        align="center"
                        prop="createTime"
                        label="创建时间">
                        </el-table-column>
                    </el-table>
                    <div class="pagination_wrap">
                        <pagination
                            :current-page="formList.page"
                            :pageSize="formList.limit"
                            :total="total"
                            @sizeChange="sizeChange"
                            @currentChange="currentChange">
                        </pagination>
                    </div>
                </div>
            </el-card>
        </div>
    </div>
</template>
<script>
import breadcrumb from "@/views/components/breadcrumb";
import pagination from "@/views/components/pagination";
import spot from '@/assets/images/spot.png';
import { listBmcBatch, choiceBmcSettlement } from '@/api/FinanceCenter/financeSettlementManagement/homeBillingDetails/index';
import { getUUID } from "@/api/pulicJava";
import { getBuildingMaterialsCity } from '@/api/FinanceCenter/financeSettlementManagement/domesticOutfitCollection/index';
import {formatAmount} from '@/utils/pubilcFn'
export default {
    components:{
        breadcrumb,
        pagination
    },
    mounted() {
        this.navList = this.$route.meta;
        this.formList.bmcReceivablesId=this.$route.query.bmcReceivablesIds;
        this.pages()
        getBuildingMaterialsCity(
            {
                bmcReceivablesId:this.$route.query.bmcReceivablesIds
            }
        ).then(res=>{
            res.data.receivablesMoney=formatAmount(res.data.receivablesMoney);
            for(let i in this.query){
                this.query[i]=res.data[i];
            }
        })
    },
    data(){
        return{
            spot,
            navList:[],
            total:10,
            tableData:[],
            formList:{
                page:1, 
                limit:10,
                bmcReceivablesId:''
            },
            query:{
                paymentName:"",
                receivablesTypeName:"",
                bankCardNumber:"",
                receivablesMoney:0,
                storeName:"",
                costMonth:"",
                receivablesDate:"",
                bankCardName:'',
                createName:'',
                bankAccountId:''
            },
        }
    },
    methods: {
        details(val){
            this.$router.push({
                path:'billingDetails',
                query:{
                    bmcBatchId:val.bmcBatchId,
                    edit:true
                }
            })
        },
        check(val){
            getUUID({
                serialNumber:'SA'
            }).then(resion=>{
                choiceBmcSettlement({
                    bmcBatchId:val.bmcBatchId,
                    bmcReceivablesIds:[Number(this.$route.query.bmcReceivablesIds)],
                    bmcSettlementId:this.$route.query.bmcSettlementId,
                    settlementNumber:resion.data
                }).then(res=>{
                    this.$router.push({
                        path:'finalStatement',
                        query:{
                            bmcReceivablesId:Number(this.$route.query.bmcReceivablesIds),
                            bmcSettlementId:res.data,
                            btn:0
                        }
                    })
                })
            })
            
        },
        pages(){
            listBmcBatch(
                this.formList
            ).then(res=>{
                this.tableData=res.data.rows;
                this.total=res.data.total;
            })
        },
        selectRows(val){
            this.rowsData=val;
        },
        tableRowClassName({row, rowIndex}) {//表格斑马线设置
            return rowIndex % 2 != 0 ? 'el-f0' : '';
        },
        currentChange(val) {
            this.formList.page = val;
            this.pages()
        },
        sizeChange(val) {
            this.formList.page = 1;
            this.formList.limit = val;
            this.pages()
        },
    },
}
</script>
<style scoped>
.martop{
    transform: translateY(40px);
}
.icon{
    display:inline-block;
    width: 4px;
    height: 25px; 
    background: #006EC7;
}
.flexTitle{
    display: flex;
    align-items: center;
}
.title{
    font-size: 20px;
    color:#006EC7;
    margin-left:15px;
}
.homeName{
    margin-left:30px;
}
.transactionNum{
    text-align: right;
}
.formList{
    display: flex;

}
.formList li>span{
    /* width: 100px; */
    display: inline-block;
    text-align: left;
}
.formList li:nth-child(1){
    flex:4
}
.formList li:nth-child(2){
    flex:2
}
.formList li:nth-child(3){
    flex:3
}
.formList li:nth-child(4){
    flex:3
}
.formList li:nth-child(5){
    flex:3
}
.formList li{
    flex:1;
}
</style>
