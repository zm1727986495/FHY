<template>
    <div>
        <el-button size="small" class="button-96" v-if="btnJurisdiction.writeOff" @click="writeOff">销账</el-button>
        <div class="m-top20">
            <el-table
            border
            :row-class-name="tableRowClassName"
            @selection-change="selectionChange"
            @row-click="rowClick"
            ref="table"
            :data="tableData">
              <el-table-column type="selection"></el-table-column>
                <el-table-column fixed show-overflow-tooltip width="180" align="center" prop="settlementNumber" label="结算单号">
                    <template slot-scope="scope">
                        <div>
                            <el-tooltip placement="right" visible-arrow v-if="btnJurisdiction.writeOff">
                                <div slot="content" class="tips tipFon">
                                    <p class="operaItems" @click="writeOffRows(scope.row)">销账</p>
                                </div>
                                <img :src="spot" alt="" class=" attributesTips">
                            </el-tooltip>
                        </div>
                        <span class="table_action_span" style="padding-left:15px" @click="jumpSettlementNumber(scope.row)">{{scope.row.settlementNumber}}</span>
                    </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip width="180" align="center" prop="examineName" label="审核人"></el-table-column>
                <el-table-column show-overflow-tooltip width="180" align="center" prop="examineTime" label="审核时间"></el-table-column>
                <el-table-column show-overflow-tooltip width="180" align="center" prop="unprocessedData" label="未确认数量">
                    <template slot-scope="scope">
                        <el-popover
                        placement="bottom-start"
                        width="400"
                        trigger="click">
                            <div style="display:inline-block">
                                未处理 12 条
                            </div>
                            <div style="display:inline-block;float:right">
                                共 27 条数据
                            </div>
                            <el-table :data="tableData2" border :row-class-name="tableRowClassName">
                                <el-table-column show-overflow-tooltip align="center" property="user" label="确认人"></el-table-column>
                                <el-table-column show-overflow-tooltip align="center" property="tel" label="联系方式"></el-table-column>
                                <el-table-column show-overflow-tooltip align="center" property="processed" label="已处理/未处理"></el-table-column>
                            </el-table>
                            <p slot="reference" style="color:red;cursor: pointer">{{scope.row.unprocessedData}}</p>
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip width="230" align="center" prop="companyName" label="付款方"></el-table-column>
                <el-table-column show-overflow-tooltip width="180" align="center" prop="storeName" label="所属门店"></el-table-column>
                <el-table-column show-overflow-tooltip width="180" align="center" prop="receivablesTypeName" label="收款方式"></el-table-column>
                <el-table-column show-overflow-tooltip width="180" align="center" prop="bankCardNumber" label="收款账号"></el-table-column>
                <el-table-column show-overflow-tooltip width="180" align="center" prop="amountSum" label="合同合计金额"></el-table-column>
                <el-table-column show-overflow-tooltip width="180" align="center" prop="countOrder" label="结算订单数"></el-table-column>
                <el-table-column show-overflow-tooltip width="180" align="center" prop="actualSettlementAmount" label="实际结算金额"></el-table-column>
                <el-table-column show-overflow-tooltip width="180" align="center" prop="settlementAmount" label="应结算金额"></el-table-column>
                <el-table-column show-overflow-tooltip width="180" align="center" prop="totalCost" label="费用总额"></el-table-column>
                <el-table-column show-overflow-tooltip width="180" align="center" prop="createAt" label="创建人"></el-table-column>
                <el-table-column show-overflow-tooltip width="180" align="center" prop="createTime" label="创建时间"></el-table-column>
            </el-table>
        </div>
        <el-dialog title="设定记账月份" :visible.sync="dialog" width="500px" custom-class="customDialogTitle">
            <div style="display:flex;justify-content:center;align-items:center;">
                <span>记账月份：</span>
                <div style="display:inline-block">
                    <el-date-picker
                    v-model="month"
                    type="month"
                    placeholder="选择月">
                    </el-date-picker>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="confirmWriteOff">确 定</el-button>
                <el-button @click="dialog = false">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import pagination from "@/views/components/pagination";
import spot from '@/assets/images/spot.png';
import { writeOffBmcSettlement } from '@/api/FinanceCenter/financeSettlementManagement/reconciliation/index';
export default {
    props:["tableData","btnJurisdiction"],
    components:{
        pagination
    },
    data(){
        return{
            currentPage:1,
            pageSize:10,
            total:10,
            dialog:false,
            months:["01","02","03","04","05","06","07","08","09","10","11","12"],
            tableData2:[],
            spot,
            month:'',
            rowData:[],
            rowsData:[],
            status:0,
        }
    },
    computed: {
        nowDate(){
             let Dates=new Date()
            return Dates.getFullYear()
        }
    },
    methods: {
        rowClick(row){
           this.$refs.table.toggleRowSelection(row)
        },
        selectionChange(val){
            this.rowsData=val;
        },
        jumpSettlementNumber(val){
            this.$router.push({
                path:"audit",
                query:{
                    bmcSettlementId:val.bmcSettlementId,
                    onlyReady:true
                }
            })
        },
        confirmWriteOff(){
            if(this.status==0){
                if(this.month){
                    writeOffBmcSettlement({
                        accountingMonth:this.month,
                        ids:[this.rowData.bmcSettlementId]
                    }).then(res=>{
                        this.$message({
                            message: '销账成功',
                            type: 'success'
                        });
                        this.$emit("requestQuery")
                        this.dialog=false;
                    })
                }else{
                    this.$message({
                        message: '请选择销账月份',
                        type: 'warning'
                    });
                }

            }else{
                let arr=[];
                if(this.month){
                    let arr=[];
                    this.rowsData.map((item,idx)=>{
                        arr.push(item.bmcSettlementId)
                    })
                    writeOffBmcSettlement({
                        accountingMonth:this.month,
                        ids:arr
                    }).then(res=>{
                        this.$message({
                            message: '销账成功',
                            type: 'success'
                        });
                        this.$emit("requestQuery")
                        this.dialog=false;
                    })
                }else{
                    this.$message({
                        message: '选择后在进行销账',
                        type: 'warning'
                    });
                }
            }

        },
        writeOff(){
            if(this.rowsData.length){
                this.status=1;
                this.dialog=true;
            }else{
                this.$message({
                    message: '选择后在进行销账',
                    type: 'warning'
                });
            }

        },
        writeOffRows(val){
            this.rowData=val;
            this.status=0;
            this.dialog=true;
        },
        tableRowClassName({row, rowIndex}) {//表格斑马线设置
            return rowIndex % 2 != 0 ? 'el-f0' : '';
        },
        currentChange(val) {
            this.currentPage = val;
        //   this.getListData();
        },
        sizeChange(val) {
            this.currentPage = 1;
            this.pageSize = val;
        //   this.getListData();
        },
    },
}
</script>
<style scoped>

</style>
