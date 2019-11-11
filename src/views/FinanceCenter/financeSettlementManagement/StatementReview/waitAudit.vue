<template>
    <div>
        <!-- <div>
            <el-checkbox label="未导入财务数据"></el-checkbox>
            <el-checkbox label="已导入财务数据"></el-checkbox>
            <el-checkbox label="比对一致"></el-checkbox>
            <el-checkbox label="比对不一致"></el-checkbox>
        </div> -->
        <div class="m-top20">
            <el-table
            border
            :data="tableData"
            :row-class-name="tableRowClassName"
            >
                <el-table-column show-overflow-tooltip width="180" align="center" prop="status" fixed label="状态">
                    <template slot-scope="scope">
                        <div>
                            <el-tooltip placement="right" visible-arrow >
                                <div slot="content" class="tips tipFon">
                                    <p class="operaItems" v-if="btnJurisdiction.audit" @click="audit(scope.row)">审核</p>
                                    <!-- <p class="operaItems" v-if="btnJurisdiction.goBack" @click="goBack(scope.row)">退回</p> -->
                                    <div style="margin-left:16px" v-if="btnJurisdiction.import">
                                        <el-upload
                                            action="/api/pc/purchasingSettlement/importPurchasingSettlement"
                                            multiple
                                            :headers="headers"
                                            :data="costParams"
                                            :show-file-list="false"
                                            :before-upload="beforeUploat"
                                            :on-success="uploadSuccess"
                                            style="display:inline-block;margin-right:10px"
                                            >
                                            <p class="operaItems" @click="append(scope.row)">导入</p>
                                        </el-upload>
                                    </div>
                                </div>
                                <img :src="spot" alt="" class=" attributesTips">
                            </el-tooltip>
                            <span v-if="scope.row.status==0">待提交</span>
                            <span v-if="scope.row.status==1">待审核</span>
                            <span v-if="scope.row.status==2">已退回</span>
                            <span v-if="scope.row.status==3">已审核</span>
                            <span v-if="scope.row.status==4">已销账</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip width="180" align="center" prop="isAgreement" label="对比是否一致">
                    <template slot-scope="scope">
                        {{scope.row.isAgreement==0?"一致":"不一致"}}
                    </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip width="180" align="center" prop="purchasingSettlementNumber" label="结算单号"></el-table-column>
                <el-table-column show-overflow-tooltip width="180" align="center" prop="purchasingSettlementName" label="结算单名称"></el-table-column>
                <el-table-column show-overflow-tooltip width="180" align="center" prop="feeMonth" label="费用月份"></el-table-column>
                <!-- <el-table-column show-overflow-tooltip width="180" align="center" prop="companyName" label="供货商"></el-table-column> -->
                <el-table-column show-overflow-tooltip width="180" align="center" prop="dataSize" label="结算单数"></el-table-column>
                <el-table-column show-overflow-tooltip width="180" align="center" prop="settlementAmount" label="结算金额">
                    <template slot-scope="scope">
                        <div>
                            {{scope.row.settlementAmount?scope.row.settlementAmount:'0.00'}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip width="180" align="center" prop="additionalAsAmount" label="额外加减收金额">
                    <template slot-scope="scope">
                        <div>
                            {{scope.row.additionalAsAmount?scope.row.additionalAsAmount:'0.00'}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip width="180" align="center" prop="asAmount" label="加减收合计">
                    <template slot-scope="scope">
                        <div>
                            {{scope.row.asAmount?scope.row.asAmount:'0.00'}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip width="180" align="center" prop="createAt" label="提交人"></el-table-column>
                <el-table-column show-overflow-tooltip width="180" align="center" prop="createTime" label="提交时间"></el-table-column>
            </el-table>
        </div>
        <el-dialog :visible.sync="dialog" title="退回原因" custom-class="customDialogTitle" width="700px" @close="close">
            <el-input type="textarea" v-model="returnReason"></el-input>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="goBackConfirm">确 定</el-button>
                <el-button @click="dialog = false">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import spot from '@/assets/images/spot.png';
import { returnPurchasingSettlement } from "@/api/FinanceCenter/statementReview/index";
import { getToken } from 'utils/auth';// 登录Token
export default {
    props:["tableData","btnJurisdiction"],
    data(){
        return{
            spot,
            dialog:false,
            returnReason:'',
            purchasingSettlementId:'',
            headers: {
                Authorization: getToken(),
                // contentType:"application/x-www-form-urlencoded; charset=UTF-8"
            },
            costParams:{
                purchasingSettlementId:'',
                feeMonth:'',
            },
            rowData:{}
        }
    },
    methods: {
        append(val){
            console.log(val)
            this.rowData=val;
        },
        beforeUploat(val,cc){
            console.log(val,cc)
            this.costParams.purchasingSettlementId=this.rowData.purchasingSettlementId;
            this.costParams.feeMonth=this.rowData.feeMonth;
            return true
        },
        uploadSuccess(val){
            this.pages()
            this.$message({
                message: '导入成功',
                type: 'success'
            });
        },
        close(){
            this.returnReason='';
            this.purchasingSettlementId='';
        },
        // goBack(val){
        //     this.purchasingSettlementId=val.purchasingSettlementId;
        //     this.dialog=true;
        // },
        goBackConfirm(){
            returnPurchasingSettlement({
                returnReason:this.returnReason,
                purchasingSettlementId:this.purchasingSettlementId
            }).then(res=>{
                this.$message({
                    message: '退回成功',
                    type: 'success'
                });
                this.dialog=false;
                this.$emit("searchPages")
            })
        },
        tableRowClassName({row, rowIndex}) {//表格斑马线设置
            return rowIndex % 2 != 0 ? 'el-f0' : '';
        },
        audit(val){
            this.$router.push({
                path:'reviewDetailed',
                query:{
                    purchasingSettlementId:val.purchasingSettlementId,
                    feeMonth:val.feeMonth
                }
            })
        }
    },
}
</script>
<style scoped>

</style>
