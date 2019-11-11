<template>
    <div>
        <div class="head_nav">
            <breadcrumb :navList="navList"></breadcrumb>
        </div>
        <el-card>
            <div class="flexTitle">
                <i class="icon"></i>
                <span class="title">供货商结算单</span>
            </div>
            <div style="margin-top:30px;">
                <div style="display:inline-block">
                    <span >供货商：</span>
                    {{moneys.companyName}}
                </div>
                <div style="display:inline-block;margin-left:50px">
                    <span >费用月份：</span>
                    {{moneys.feeMonth}}
                </div>
            </div>
        </el-card>
        <el-card class="m-top20">
            <div class="queryForm">
                <el-row :gutter="10">
                    <el-col :span="6">
                        <el-input size="medium" placeholder="采购单号" clearable v-model="formList.names"></el-input>
                    </el-col>
                    <el-col :span="6">
                        <el-button type="warning" size="medium" class="button-fc" @click="search">查询</el-button>
                        <el-button type="primary" size="medium" @click="reset">重置</el-button>
                        <el-button type="primary" size="medium" @click="add">添加采购单</el-button>
                    </el-col>
                </el-row>
            </div>
        </el-card>
        <el-card class="m-top20">
            <el-table border :data="tableData" :row-class-name="tableRowClassName">
                <el-table-column align="center" type="index"></el-table-column>
                <el-table-column align="center" width="180px" show-overflow-tooltip prop="purchaseNumber" label="采购单号">
                    <template slot-scope="scope">
                        <div>
                            <el-tooltip placement="right" visible-arrow>
                                <div slot="content" class="tips tipFon">
                                    <p class="operaItems" @click="deleteRows(scope.row)">删除</p>
                                </div>
                                <img :src="spot" alt="" class="attributesTips">
                            </el-tooltip>
                            <p class="operation" style="padding-left:20px">{{scope.row.purchaseNumber}}</p>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column align="center" width="180px" show-overflow-tooltip prop="settlementMoney" label="结算金额"></el-table-column>
                <el-table-column align="center" width="180px" show-overflow-tooltip prop="asAmount" label="加减收"></el-table-column>
                <el-table-column align="center" width="180px" show-overflow-tooltip prop="additionalAsAmount" label="额外加减收"></el-table-column>
                <el-table-column align="center" width="180px" show-overflow-tooltip prop="contractSerialNumber" label="客户合同号"></el-table-column>
                <el-table-column align="center" width="180px" show-overflow-tooltip prop="purchaseContractCode" label="采购合同号"></el-table-column>
                <el-table-column align="center" width="180px" show-overflow-tooltip prop="orderNumber" label="订单号"></el-table-column>
                <el-table-column align="center" width="180px" show-overflow-tooltip prop="orderType" label="订单类型">
                    <template slot-scope="scope">
                        <span v-if="scope.row.orderType==0">正单</span>
                        <span v-if="scope.row.orderType==1">增单</span>
                        <span v-if="scope.row.orderType==2">补单</span>
                        <span v-if="scope.row.orderType==3">遗留单</span>
                        <span v-if="scope.row.orderType==4">退货单</span>
                        <span v-if="scope.row.orderType==5">上样</span>
                        <span v-if="scope.row.orderType==6">撤样</span>
                        <span v-if="scope.row.orderType==7">换货</span>
                        <span v-if="scope.row.orderType==8">第三方订单</span>
                        <span v-if="scope.row.orderType==9">售后问题</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" width="180px" show-overflow-tooltip prop="storeName" label="所属门店"></el-table-column>
                <el-table-column align="center" width="180px" show-overflow-tooltip prop="companyName" label="供应商"></el-table-column>
                <el-table-column align="center" width="180px" show-overflow-tooltip prop="createOrderTime" label="下单完成时间"></el-table-column>
                <el-table-column align="center" width="180px" show-overflow-tooltip prop="lastImportTime" label="末次导入时间"></el-table-column>
                <el-table-column align="center" width="180px" show-overflow-tooltip prop="checkBillTime" label="对账完成时间"></el-table-column>
                <el-table-column align="center" width="180px" show-overflow-tooltip prop="createTime" label="提交结算时间"></el-table-column>
                <el-table-column align="center" width="180px" show-overflow-tooltip prop="settlementTime" label="结算完成时间"></el-table-column>
                <el-table-column align="center" width="180px" show-overflow-tooltip prop="remark" label="备注"></el-table-column>
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
        </el-card>
        <el-card class="m-top20">
            <div class="clearfix">
                <div class="fl">
                    <h2 style="display:inline-block">结算金额合计：</h2>{{moneys.settlementAmount}}
                </div>
                <div class="fl" style="margin-left:50px">
                    <h2 style="display:inline-block">结算加减收金额合计：</h2>{{moneys.asAmount}}
                </div>
                <div class="fl" style="margin-left:50px">
                    <h2 style="display:inline-block">结算额外加减收金额合计：</h2>{{moneys.additionalAsAmount}}
                </div>
            </div>
        </el-card>
        <el-card class="m-top20" style="display:flex;justify-content:center;align-items:center">
            <el-button size="medium" type="primary" @click="submit">提交</el-button>
            <el-button size="medium" @click="cancel">取消</el-button>
        </el-card>
        <el-dialog title="添加采购单" :visible.sync="dialog" custom-class="customDialogTitle">
            <div class="queryForm">
                <el-row :gutter="10">
                    <el-col :span="6">
                        <el-input placeholder="采购单号" v-model="dialogFormList.names" clearable></el-input>
                    </el-col>
                    <el-col :span="6">
                        <el-button type="warning" size="medium" class="button-fc" @click="dialogSearch">查询</el-button>
                    </el-col>
                </el-row>
            </div>
            <el-table :data="dialogTable" border :row-class-name="tableRowClassName" @selection-change="selectChange">
                <el-table-column align="center" type="selection"></el-table-column>
                <el-table-column align="center" width="180px" show-overflow-tooltip prop="purchaseNumber" label="采购单号"></el-table-column>
                <el-table-column align="center" width="180px" show-overflow-tooltip prop="settlementMoney" label="结算金额"></el-table-column>
                <el-table-column align="center" width="180px" show-overflow-tooltip prop="asAmount" label="加减收"></el-table-column>
                <el-table-column align="center" width="180px" show-overflow-tooltip prop="additionalAsAmount" label="额外加减收"></el-table-column>
                <el-table-column align="center" width="180px" show-overflow-tooltip prop="contractSerialNumber" label="客户合同号"></el-table-column>
                <el-table-column align="center" width="180px" show-overflow-tooltip prop="purchaseContractCode" label="采购合同号"></el-table-column>
                <el-table-column align="center" width="180px" show-overflow-tooltip prop="orderNumber" label="订单号"></el-table-column>
                <el-table-column align="center" width="180px" show-overflow-tooltip prop="orderTypeName" label="订单类型">
                </el-table-column>
                <el-table-column align="center" width="180px" show-overflow-tooltip prop="storeName" label="所属门店"></el-table-column>
                <el-table-column align="center" width="180px" show-overflow-tooltip prop="companyName" label="供应商"></el-table-column>
                <el-table-column align="center" width="180px" show-overflow-tooltip prop="createOrderTime" label="下单完成时间"></el-table-column>
                <el-table-column align="center" width="180px" show-overflow-tooltip prop="lastImportTime" label="末次导入时间"></el-table-column>
                <el-table-column align="center" width="180px" show-overflow-tooltip prop="checkBillTime" label="对账完成时间"></el-table-column>
                <el-table-column align="center" width="180px" show-overflow-tooltip prop="createTime" label="提交结算时间"></el-table-column>
                <el-table-column align="center" width="180px" show-overflow-tooltip prop="settlementTime" label="结算完成时间"></el-table-column>
                <el-table-column align="center" width="180px" show-overflow-tooltip prop="remark" label="备注"></el-table-column>
            </el-table>
            <div class="pagination_wrap">
				<pagination
					:current-page="dialogFormList.page"
					:pageSize="dialogFormList.limit"
					:total="dialogTotal"
					@sizeChange="dialogSizeChange"
					@currentChange="dialogCurrentChange">
				</pagination>
			</div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="confirm">确 定</el-button>
                <el-button @click="dialog = false">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import spot from '@/assets/images/spot.png';
import breadcrumb from "@/views/components/breadcrumb";
import pagination from '@/views/components/pagination';
import { getPurchasingSettlement, listPurchaseOrderData, deletePurchasingSettlementData, savePurchasingSettlementData, listPurchaseOrderDataVO, commitPurchasingSettlement } from '@/api/administrationCenter/finalStatement/index'
import { setTimeout } from 'timers';
export default {
    components:{
        breadcrumb,
        pagination
    },
    data(){
        return{
            spot,
            navList:[],
            tableData:[],
            dialog:false,
            dialogTable:[],
            dialogTotal:10,
            formList:{
                purchasingSettlementId:this.$route.query.purchasingSettlementId,
                page:1,
                limit:10,
                names:'',
            },
            total:10,
            dialogFormList:{
                page:1,
                limit:10,
                names:'',
                status:0,
            },
            moneys:{
                settlementAmount:'',
                asAmount:'',
                additionalAsAmount:'',
                companyName:'',
                feeMonth:''
            },
            rowsData:[]
        }
    },
    mounted() {
        this.navList = this.$route.meta;
        this.echo()
        this.pages()
    },
    methods: {
        reset(){
            this.formList.page=1;
            this.formList.limit=10;
            this.formList.names='';
            this.pages()
        },
        dialogSearch(){
            this.dialogFormList.page=1;
            this.dialogPages();
        },
        deleteRows(val){
            this.$confirm('是否删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                deletePurchasingSettlementData(
                    {
                        purchaseOrderDataIds:[val.purchaseOrderDataId],
                        purchasingSettlementId:this.$route.query.purchasingSettlementId
                    }
                ).then(res=>{
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    });
                    this.echo()
                    this.pages()
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
            
        },
        echo(){
            getPurchasingSettlement({
                purchasingSettlementId:this.$route.query.purchasingSettlementId
            }).then(res=>{
                for(let i in this.moneys){
                    this.moneys[i]=res.data[i];
                }
            })
        },
        selectChange(val){
            this.rowsData=val;
        },
        confirm(){
            if(this.rowsData.length){
                let arr=[]
                this.rowsData.map((item,idx)=>{
                    arr.push(item.purchaseOrderDataId)
                })
                savePurchasingSettlementData({
                    purchaseOrderDataIds:arr,
                    purchasingSettlementId:this.$route.query.purchasingSettlementId
                }).then(res=>{
                    this.dialog=false;
                    this.$message({
                        message: '添加成功',
                        type: 'success'
                    });
                    this.pages()
                    this.echo()
                })
            }else{
                this.$message({
                    message: '请选择后再进行添加',
                    type: 'warning'
                });
            }
        },
        cancel(){
            this.$router.push({
                path:'finalStatement'
            })
        },
        submit(){
            commitPurchasingSettlement({
                purchasingSettlementIds:[this.$route.query.purchasingSettlementId]
            }).then(res=>{
                this.$message({
                    message: '提交成功',
                    type: 'success'
                });
                setTimeout(()=>{
                    this.$router.push({
                        path:'finalStatement'
                    })
                },300)
            })
        },
        pages(){
            listPurchaseOrderData(this.formList).then(res=>{
                this.tableData=res.data.rows;
                this.total=res.data.total;
            })
        },
        dialogPages(){
            listPurchaseOrderDataVO(this.dialogFormList).then(res=>{
                this.dialogTable=res.data.rows;
                this.total=res.data.total;
            })
        },
        add(){
            this.dialogPages()
            this.dialog=true;
        },
        dialogSizeChange(val){
            this.dialogFormList.page=1;
            this.dialogFormList.limit=val;
            this.dialogPages()
        },
        dialogCurrentChange(val){
            this.dialogFormList.page=val;
            this.dialogPages()
        },
        search(){
            this.formList.page=1;
            this.pages()
        },
        tableRowClassName({ row, rowIndex }) {
            return rowIndex % 2 != 0 ? 'el-f0' : '';
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
<style scoped>
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
    width: 100px;
    display: inline-block;
    text-align: right;
}
.formList li:nth-child(3){
    flex:2
}
.formList li{
    flex:1;
}
</style>
