<template>
    <div class="zuoweimin">
        <div class="head_nav">
            <breadcrumb :navList="navList"></breadcrumb>
        </div>
        <el-card class="lvs">
            <div class="warp_head_list">
                <div class="inp_box">
                    <el-input placeholder="订单编号" v-model="orderNumber" 
                        size="medium" maxlength="50" @keydown.enter.native="searchFun" clearable>
                    </el-input>
                    <el-input placeholder="客户合同号" v-model="contractSerialNumber" 
                        size="medium" maxlength="50" @keydown.enter.native="searchFun" clearable>
                    </el-input>
                </div>
                <div>
                    <el-button @click="searchFun" class="button-fc m-left10" type="warning" size="medium">查询</el-button>
                    <el-button @click="resetFun" type='primary' size="medium">重置</el-button>
                </div>
            </div>
            <div class="h-width"></div>
            <div class="order_table">
                <el-table border max-height="500" v-loading="loading" ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%"
                    :row-class-name="tableRowClassName" :row-style="tableRowStyle" @selection-change="handleSelectionChange">
                    <!-- <el-table-column type="selection" fixed align="center" fixed="left" width="55"></el-table-column> -->
                    <el-table-column prop="orderId" align="center" label="订单ID" width="200" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="orderNumber" align="center" label="订单编号" width="200" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="customerContractId" align="center" label="合同ID" width="200" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="contractSerialNumber" align="center" label="合同编号" width="200" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="contractState" align="center" label="合同状态" width="120">
                        <template slot-scope="scope">
                            <div v-if="scope.row.contractState == 0">合同待生成</div>
                            <div v-if="scope.row.contractState == 1">待签署</div>
                            <div v-if="scope.row.contractState == 2">合同生效</div>
                            <div v-if="scope.row.contractState == 3">合同作废</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="settlementStatus" align="center" label="款清状态" width="200" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <p v-if="scope.row.settlementStatus == 1">款未清</p>
                            <p v-else-if="scope.row.settlementStatus == 2">收费款清</p>
                            <p v-else-if="scope.row.settlementStatus == 3">财务款清</p>
                            <p v-else-if="scope.row.settlementStatus == 4">家装款清</p>
                        </template>
                    </el-table-column>
                    <el-table-column prop="auditStatus" align="center" label="审核状态" width="200" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <div v-if="scope.row.auditStatus == 0">待审核</div>
                            <div v-if="scope.row.auditStatus == 1">审核通过</div>
                            <div v-if="scope.row.auditStatus == 2">图纸驳回</div>
                            <div v-if="scope.row.auditStatus == 3">整单驳回</div>
                            <div v-if="scope.row.auditStatus == 4">同意整单驳回</div>
                            <div v-if="scope.row.auditStatus == 5">不同意整单驳回</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="isCanAudit" align="center" label="强制审单" width="200" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <div v-if="scope.row.isCanAudit == 0">否</div>
                            <div v-if="scope.row.isCanAudit == 1">是</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="serveGroupId" align="center" label="审单部门ID" width="200" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="serveGroupName" align="center" label="审单部门" width="200"></el-table-column>
                </el-table>
            </div>
        </el-card>
        <el-card class="">
            <div class="titlecals">强制添加审单部门</div>
            <div class="inp_box_two">
                <el-input placeholder="合同ID" v-model="customerContractId" clearable size="medium"></el-input>
                <el-select v-model="postId" clearable filterable placeholder="请选择要添加的审单部门" size="medium">
                    <el-option v-for="item in stateList" :key="item.value"
                        :label="item.serveGroupName" :value="item.serveGroupId">
                    </el-option>
                </el-select>
                <el-select v-model="postIds" clearable filterable placeholder="请选择要添加的下单部门" size="medium">
                    <el-option v-for="item in stateLists" :key="item.value"
                        :label="item.serveGroupName" :value="item.serveGroupId">
                    </el-option>
                </el-select>
                <div>
                    <el-button size="small" class="button-96" @click="submitbtn">保存</el-button>
                </div>
            </div>
        </el-card>
        <el-card class="m-top10">
            <div class="titlecals">修改合同款清状态</div>
            <div class="inp_box_two">
                <el-input placeholder="合同ID" v-model="contractId" clearable size="medium"></el-input>
                <el-select v-model="activeState" clearable filterable placeholder="请选择合同款清状态" size="medium">
                    <el-option v-for="item in contractStates" :key="item.value"
                        :label="item.val" :value="item.id">
                    </el-option>
                </el-select>
                <div>
                    <el-button size="small" class="button-96" @click="setContrat">保存</el-button>
                </div>
            </div>
        </el-card>
        <el-card class="m-top10">
            <div class="titlecals">强制驳回退货单（*如已生成退款单，需要驳回退款单）</div>
            <div class="inp_box_two">
                <p class="returnStyle">
                    <el-input placeholder="退货单号" v-model="returnNumber" clearable size="medium"></el-input>
                </p>
                <div>
                    <el-button size="small" class="button-96 m-left10" @click="setNumberFn">驳回</el-button>
                </div>
            </div>
        </el-card>

         <el-card class="m-top10">
            <div class="titlecals">强制修改采购单号</div>
            <div class="inp_box_two">
                <p class="returnStyle">
                    <el-input placeholder="合同ID" v-model="purchaseContractId" clearable size="medium"></el-input>
                </p>
                <div>
                    <el-button size="small" class="button-96 m-left10" @click="contractQuery">查询</el-button>
                </div>
            </div>
            <div class="purchaseStyle m-top10">
                <div>
                    <el-select style="width:400px;" v-model="purchaseOrderId" clearable filterable placeholder="请选择采购单号" size="medium">
                        <el-option
                        v-for="item in contractList" 
                        :key="item.purchaseOrderId"
                        :label="item.purchaseOrderName" 
                        :value="item.purchaseOrderId">
                        </el-option>
                    </el-select>
                </div>
                <div class="m-left10">
                    <el-input placeholder="变更采购单号" v-model="changePurchase" clearable size="medium"></el-input>
                </div>
                <div>
                    <el-button size="small" class="button-96 m-left10" @click="purchaseSubmission">提交</el-button>
                </div>
            </div>
        </el-card>
    </div>
</template>
<script>

import breadcrumb from "@/views/components/breadcrumb";
import { 
    getTimeIsMoney, 
    listServeGroup, 
    insertContractAuditFlow, 
    updateContractSettlementStatus,
    getOrderChargeBack,
    listPurchaseOrder,
    updatePurchaseNumber
} from 'api/order/contract/contract';
import { auditOrderChargeBack} from '@/api/administrationCenter/regoodspermit/index';
export default {
    components: {
        breadcrumb
    },
    data(){
        return {
            orderNumber: "",
            customerContractId: "",
            postId: "",
            postIds: "",
            contractSerialNumber: "",
            navList: [],
            tableData: [],
            stateList: [],
            stateLists: [],
            contractId:'',
            activeState:'',//已选则合同状态
            contractStates:[//合同状态列表
                {val:'款未清', id: 1},
                {val:'收费款清', id: 2},
                {val:'财务款清', id: 3},
                {val:'家装合同款清', id: 4},
            ],
            loading: false,
            returnNumber:'',

            // 强制修改采购单号
            purchaseContractId:'',//合同ID
            contractList:[],
            changePurchase:'',
            purchaseOrderId:''
        }
    },
    created() {
        // this.searchFun();
        let data = {
            serveType: "794"
        }
        listServeGroup(data).then(res =>{
            if(res.status == 200){
                this.stateList = res.data;
            }
        }).catch(error =>{
            console.log('订单管理:合同列表 order/contract/index.vue', error);
        })
        listServeGroup({serveType: "795"}).then(res =>{
            if(res.status == 200){
                this.stateLists = res.data;
            }
        }).catch(error =>{
            console.log('订单管理:合同列表 order/contract/index.vue', error);
        })
    },
    mounted() {
        // 头部面包屑
        this.navList=this.$route.meta;
    },
    methods: {
        //根据合同ID查
        contractQuery(){
            if(!this.purchaseContractId){
                this.$message.error('请输入合同ID')
                return
            }
            listPurchaseOrder({customerContractId:this.purchaseContractId}).then(res=>{
                if(res.status == 200){
                    this.contractList = res.data;
                }
            }).catch(error=>{
                console.error('查询采购单接口',error);
            })
        },
        //强制修改采购单号 提交
        purchaseSubmission(){
            let data = {
                purchaseOrderId:this.purchaseOrderId,
                purchaseNumber:this.changePurchase
            }
            updatePurchaseNumber(data).then(res=>{
                if(res.status == 200){
                    this.$message.success('提交成功!')
                }
            }).catch(error=>{
                console.error('修改采购单号',error);
            })
        },
        //修改退货通过
        setNumberFn(){
            if(!this.returnNumber){
                this.$message.error('请输入退货号!')
                return
            }
            getOrderChargeBack({chargeBackNumber:this.returnNumber}).then(res=>{
                if(res.status == 200){
                    if(!res.data.chargeBackId){
                        this.$message.error('退货单号有误!')
                        return
                    }
                    let data = {
                        chargeBackId: res.data.chargeBackId, //退货ID
                        auditType: 1, //审核类型，1行政，2下单员
                        auditStatus: 4,//审核结果
                        auditOpinion: '管理员驳回',//审核意见
                    };
                    auditOrderChargeBack(data).then(res=>{
                        if(res.status == 200){
                            this.$message.success('驳回成功!')
                        }
                    }).catch(error=>{
                        console.error('退货驳回',error);
                    })
                }
            }).catch(error=>{
                this.$message.error('退货单号错误!')
                console.error('获取退货ID',error);
            })
        },
        submitbtn(){
            if(this.customerContractId == ""){
                this.$message.warning("请输入合同ID");
                return
            }
            if(this.postIds == "" && this.postId == ""){
                this.$message.warning("请选择审单部门或下单部门");
                return
            }
            if(this.postId != "" && this.postIds != ""){
                this.$message.warning("审单部门和下单部门只能选择一个");
                return
            }else{
                let data = {
                    customerContractId: this.customerContractId,
                    postId: "",
                }
                if(this.postId != ""){
                    data.postId = this.postId
                }else{
                    data.postId = this.postIds
                }
                console.log(data);
                insertContractAuditFlow(data).then(res =>{
                    if(res.status == 200){
                        this.$message.success("操作成功");
                    }else{
                        this.$message.warning("操作失败");
                    }
                }).catch(error =>{
                    console.log('订单管理:合同列表 order/contract/index.vue', error);
                })
            }
        },
        searchFun(){
            if(this.orderNumber == "" && this.contractSerialNumber == ""){
                this.$message.warning("请输入订单编号或者合同编号");
                return
            }
            let data = {
                orderNumber: this.orderNumber,
                contractSerialNumber: this.contractSerialNumber,
            }
            getTimeIsMoney(data).then(res =>{
                if(res.status == 200){
                    this.tableData = [res.data];
                }
            }).catch(error =>{
                this.$message.warning("操作失败");
                console.log('订单管理:合同列表 order/contract/index.vue', error);
            })
        },
        resetFun(){
            this.orderNumber = "";
            this.contractSerialNumber = "";
            this.tableData = [];
        },
        setContrat(){//修改合同状态
            if(this.contractId == '' || this.activeState == ''){
                this.$message({message: '请填写合同信息',type: 'warning'});
                return ;
            }
            updateContractSettlementStatus( {customerContractId:this.contractId, settlementStatus: this.activeState}).then(res=>{
                this.$message({message: '操作成功',type: 'success'});
                this.contractId = '';
                this.activeState ='';
            }).catch(error=>{
                console.log('作为民页面，修改合同状态接口, views/marketing/contract/zuoweimin.vue')
            })
        },
        handleSelectionChange(val){
            this.tableSelectList = val;
            console.log(this.tableSelectList,"tableSelectList1234");
        },
        tableRowClassName({row, rowIndex}) {//表格斑马线设置
            return rowIndex%2 != 0 ? 'el-f0' : '';
        },
        // 表格行样式
        tableRowStyle({row, rowIndex}){
            // return row.isTovoid != '-' ? 'color:#e1a6ac' : '';
        },
    },
    filters: {
        // 千分号过滤方法
        fenge(val){
            return (val*1).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
        }
    },
}
</script>
<style scoped lang="scss">
.returnStyle{
    width: 300px !important;
}
.purchaseStyle{
    display: flex;
}
.zuoweimin{
    .warp_head_list{
        display: flex;
        .inp_box{
            display: flex;
            >div+div{
                margin-left: 10px;
            }
        }
    }
    .inp_box_two{
        margin-top: 20px;
        display: flex;
        >div{
            flex: 1;
            &+div{
                margin-left: 10px;
            }
        }
    }
    .order_table{
        margin-top: 10px;
        width: 100%;
    }
    .titlecals{
        top: 0;
    }
}
</style>