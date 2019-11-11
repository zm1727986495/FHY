<template>
    <div>
        <div class="head_nav">
            <breadcrumb :navList="navList"></breadcrumb>
        </div>
        <el-card>
            <div class="iconBox"><i class='Icon'></i><span>结算明细</span></div>
            <div>
                <ul class="formList clearfloat">
                    <li class="list">
                        <span>结算类型：</span>
                        <div>
                            <el-radio v-model="formList.settlementType" :label="0">建材城</el-radio>
                        </div>
                    </li>
                    <li class="list">
                        <span>建材城：</span>
                        <div >
                            <el-select size="medium" v-model="formList.companyId" style="width:100%" filterable clearable @change="changeCompany">
                                <el-option v-for="(item,idx) in listCompanyArr" :key="idx" :label="item.companyName" :value="item.companyId"></el-option>
                            </el-select>
                        </div>
                    </li>
                    <li class="list">
                        <span>门店：</span>
                        <!-- <el-checkbox v-model="formList.isSettlementOrderDetails">是否有结算订单明细</el-checkbox> -->
                        <el-select size="medium" v-model="formList.storeId" style="width:100%" filterable clearable>
                            <el-option v-for="(item,idx) in storeArr" :key="idx" :label="item.storeName" :value="item.storeId"></el-option>
                        </el-select>
                    </li>
                    <li class="list">
                        <span>费用月份：</span>
                        <div class="head_nav_datapick">
                            <el-date-picker
                                size="medium" v-model="formList.costMonth" type="date"
                                value-format='yyyy-MM'
                                range-separator="-"
                                style="width:100%"
                                >
                            </el-date-picker>
                        </div>
                    </li>
                </ul>
            </div>
        </el-card>
        <div class="m-top20">
            <el-card>
                <div class="iconBox"><i class='Icon'></i><span>导入结算明细</span></div>
                <div class="m-top20">
                    <!-- <el-upload
                        action="string"
                        list-type="picture-card"
                        :http-request="uploadSectionFile">
                        <i class="el-icon-plus"></i>
                    </el-upload> -->
                    <el-upload
                        action="/api/pc/partner/importSettlementDetails"
                        class="upload-demo"
                        multiple
                        :headers="headers"
                        :data="obj"
                        :show-file-list="false"
                        :before-upload="beforeUploat"
                        :on-success="uploadSuccess"
                        style="display:inline-block;margin-right:10px"
                        >
                        <el-button class="button-96" size="small">导入结算明细</el-button>
                    </el-upload>
                    <el-button class="button-96" size="small" @click="selectModel">下载模板</el-button>
                    <el-button class="button-96" size="small" @click="deleteAll">删除</el-button>
                    <el-button class="button-96" size="small" @click="searchCost">导入失败记录</el-button>
                    <div style="float:right">
                        <span style="margin-right:50px">共 {{billingTotal}} 条数据</span>
                        <span>合计：{{moneyAll}} 元</span>
                    </div>
                </div>
                <div class="m-top20 unsortable">
                    <el-table
                    :data="tableData"
                    :row-class-name="tableRowClassName"
                    @selection-change="selectBatchRows"
                    @row-click="rowClick"
                    ref="table"
                    border>
                        <el-table-column align="center" type="selection" fixed="left" width="50"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="transactionVoucher" align="center" label="建材城收据号"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="orderNumber" align="center" label="订单编号">
                          <template slot-scope="scope">
                            <el-button type="text">{{ scope.row.orderNumber }}</el-button>
                          </template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip prop="customerName" align="center" label="客户姓名" width="120"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="paymentMethodName" align="center" label="付款方式" width="120"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="refundAmount" align="center" label="收款金额" width="120"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="serviceCharge" align="center" label="刷卡手续费" width="120"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="cardNumber" align="center" label="刷卡卡号" width="180"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="dateCollection" align="center" label="收款日期" width="180"></el-table-column>
                    </el-table>
                    <div class="pagination_wrap">
                        <pagination
                            :current-page="currentPage"
                            :pageSize="pageSize"
                            :total="total"
                            @sizeChange="sizeChange"
                            @currentChange="currentChange">
                        </pagination>
                    </div>
                </div>
                <div class="m-top50" style="display:flex;justify-content:center;align-items:center;position:relative;bottom:0">
                    <el-button size="medium" type="primary" @click="saveAll">保存结算批次</el-button>
                </div>
            </el-card>
        </div>

        <el-dialog :visible.sync="dialog" title="选择模板" custom-class="customDialogTitle">
            <el-table :data="data" border @selection-change="selectChange" @row-click="rowClick2" ref="table2">
                    
                <el-table-column show-overflow-tooltip align="center" fixed type="selection"></el-table-column>
                <el-table-column show-overflow-tooltip align="center" prop="number" label="编号"></el-table-column>
                <el-table-column show-overflow-tooltip align="center" prop="name" label="名称"></el-table-column>
                <el-table-column show-overflow-tooltip align="center" prop="isEffective" label="是否有效">
                    <template slot-scope="scope">
                        <el-radio :value="scope.row.isEffective" :label="1">是</el-radio>
                        <el-radio :value="scope.row.isEffective" :label="0">否</el-radio>
                    </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip align="center" prop="organizationId" label="服务机构"></el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="download">
                    下载
                    <!-- <a v-if="dialogRowsData.length==1" :href="'http://47.111.169.139:8766/buildingMaterialsCity/downloadSettlementDetails?settlementImportTemplateId='+dialogRowsData[0].settlementImportTemplateId" download>下载</a> -->
                </el-button>
                <el-button @click="dialog=false">关闭</el-button>
            </span>
        </el-dialog>
        <el-dialog
            :visible.sync="BillingDialog"
            title="导入失败记录"
            custom-class="customDialogTitle"
            width="80%"
            >
            <div class="table_list unsortable">
              <el-table
                :data="costData"
                :row-class-name="tableRowClassName"
                @row-click="rowClick3"
                ref="table3"
                border>
                <el-table-column align="center" type="selection" fixed="left" width="50"></el-table-column>
                <el-table-column show-overflow-tooltip prop="transactionVoucher" align="center" label="建材城收据号"></el-table-column>
                <!--                <el-table-column show-overflow-tooltip prop="orderNumber" align="center" label="订单编号"></el-table-column>-->
                <!--                <el-table-column show-overflow-tooltip prop="customerName" align="center" label="客户姓名"></el-table-column>-->
                <el-table-column show-overflow-tooltip prop="paymentMethodName" align="center" label="收款方式"></el-table-column>
                <el-table-column show-overflow-tooltip prop="amountCollected" align="center" label="收款金额"></el-table-column>
                <el-table-column show-overflow-tooltip prop="serviceCharge" align="center" label="刷卡手续费"></el-table-column>
                <el-table-column show-overflow-tooltip prop="cardNumber" align="center" label="刷卡卡号"></el-table-column>
                <el-table-column show-overflow-tooltip prop="dateCollection" width="180" align="center" label="收款日期"></el-table-column>
                <el-table-column show-overflow-tooltip prop="status" align="center" label="状态">
                  <template slot-scope="scope">
                    {{scope.row.status==0?"成功":"失败"}}
                  </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="remarks" width="200" align="center" label="失败原因"></el-table-column>
              </el-table>
              <div class="pagination_wrap">
                <pagination
                  :current-page="searchCostParams.page"
                  :pageSize="searchCostParams.limit"
                  :total="costTotal"
                  @sizeChange="costSizeChange"
                  @currentChange="costCurrentChange">
                </pagination>
              </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="BillingDialog=false">关闭</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import breadcrumb from "@/views/components/breadcrumb";
import pagination from "@/views/components/pagination";
import spot from '@/assets/images/spot.png';
import BillingDetails from 'views/components/billingDetails';
import {
    listSettlementImportTemplate,
    downloadSettlementDetails,
    getBmcBatchVO,
    submissionReceivables,
    deleteBmcSettlementDetailed,
    listCompanyByService,
    listStoreByService
} from '@/api/FinanceCenter/financeSettlementManagement/homeBillingDetails/index';
import { listCompanyByAll, listStore } from "@/api/pulicJava"
import { put } from "@/utils/pubilcFn";
import { getToken } from 'utils/auth';// 登录Token
import {
    listImportDetailsCharges,
    getSumAmount,
    listSettlementDetails,
    listImportSettlementDetails
} from "@/api/FinanceCenter/financeSettlementManagement/domesticOutfitCollection/index"
export default {
    components:{
        breadcrumb,
        pagination,
        BillingDetails
    },
    mounted() {
        this.navList = this.$route.meta;
        if(this.$route.query.edit){
            this.bmcBatchId=this.$route.query.bmcBatchId;
            this.pages()
        }
        listCompanyByService().then(res=>{
            this.listCompanyArr=res.data;
        })
        this.downLoadPages()
    },
    data(){
        return{
            headers: {
                Authorization: getToken(),
                // contentType:"application/x-www-form-urlencoded; charset=UTF-8"
            },
            navList:[],
            storeArr:[],
            radio:"0",
            month:'',
            listCompanyArr:[],
            currentPage:1,
            pageSize:10,
            total:10,
            domainName:"http://47.111.169.139:8766",
            tableData:[
            ],
            dialog:false,
            data:[],
            dialogRowsData:[

            ],
            formList:{
                bmcBatchId:"",
                companyId:"",
                settlementType:0,
                costMonth:"",
                isSettlementOrderDetails:"",
                storeId:''
            },
            obj:{
                settlementImportTemplateId:1,
                bmcBatchId:1,
            },
            bmcBatchId:'',
            status:0,
            batchRows:[],
            searchCostParams:{
                bmcSettlementId:"",
                page:1,
                limit:10
            },
            costTotal:10,
            costData:[],
            BillingDialog:false,
            bmcSettlementId:'',
            billingParams:{
                bmcBatchId:"",
                page:1,
                limit:10,
            },
            billingTotal:0,
            moneyAll:0
        }
    },
    methods: {
        rowClick3(val){
            this.$refs.table3.toggleRowSelection(row)
        },
        rowClick2(){
            this.$refs.table2.toggleRowSelection(row)
        },
        rowClick(row){
            this.$refs.table.toggleRowSelection(row)
        },
        changeCompany(val){
            listStoreByService({
                companyId:val
            }).then(res=>{
                this.storeArr=res.data;
            })
        },
        searchCost(){
            if(this.bmcBatchId){
                this.costPort()
            }else{
                this.$message({
                    message: '请先导入明细记录或新增后再进行查询',
                    type: 'warning'
                });
            }
        },
        costPort(){
            this.searchCostParams.bmcBatchId=this.bmcBatchId;
            listImportSettlementDetails(
                this.searchCostParams
            ).then(res=>{
                this.costData=res.data.rows;
                this.costTotal=res.data.costTotal;
                this.BillingDialog=true;
            })
        },
        costSizeChange(val){
            this.searchCostParams.page=1;
            this.searchCostParams.limit=val;
            this.costPort()
        },
        costCurrentChange(val){
            this.searchCostParams.page=val;
            this.costPort()
        },
        selectBatchRows(val){
            this.batchRows=val;
        },
        deleteAll(){
            if(this.batchRows.length){
                let arr=[]
                this.batchRows.map((item,idx)=>{
                    arr.push(item.bmcSettlementDetailedId)
                })
                deleteBmcSettlementDetailed({
                    bmcSettlementDetailedIds:arr.join(",")
                }).then(res=>{
                    this.pages();
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    });
                })
            }else{
                this.$message({
                    message: '请选择后在进行删除',
                    type: 'warning'
                });
            }
        },
        billingPage(){
            getSumAmount({
                bmcBatchId:this.bmcBatchId
            }).then(res=>{
                this.moneyAll=res.data;
            })
            listSettlementDetails(
                this.billingParams
            ).then(res=>{
                this.tableData=res.data.rows;
                this.total=res.data.total;
                this.billingTotal=res.data.total;
            })
        },
        saveAll(){
            if(this.formList.companyId&&this.formList.costMonth&&this.formList.storeId){
                this.formList.bmcBatchId=this.bmcBatchId
                submissionReceivables(this.formList).then(res=>{
                    this.$message({
                        message: '保存成功',
                        type: 'success'
                    });
                    this.$router.go(-1)
                })
            }else{
                this.$message({
                    message: '请选择完之后再尝试保存结算单',
                    type: 'warning'
                });
            }

        },
        downLoad(){
            this.status=1;
        },
        //上传之前的回调
        beforeUploat(file){
           if(this.formList.storeId) {
             this.obj.settlementImportTemplateId=this.status==1?this.dialogRowsData[0].settlementImportTemplateId:this.data[0].settlementImportTemplateId;
             this.obj.bmcBatchId=this.bmcBatchId;
             this.obj.storeId=this.formList.storeId;
             return true;
           } else {
              this.$message.error('请先选择门店');
              return  false;
           }
        },
        uploadSuccess(val){
            this.bmcBatchId=val.data;
            this.billingParams.bmcBatchId=this.bmcBatchId;
            this.billingPage();
            this.$message({
                message: '导入成功',
                type: 'success'
            });
            // this.pages()
        },
        pages(){
            getBmcBatchVO({
                bmcBatchId:this.bmcBatchId,
                page:1,
                limit:10
            }).then(res=>{
                this.tableData=res.data.bmcSettlementDetailedList;
                this.formList.settlementType=res.data.settlementType;
                this.formList.costMonth=res.data.costMonth;
                this.formList.companyId=res.data.companyId;
                this.formList.isSettlementOrderDetails=res.data.isSettlementOrderDetails;
            })
        },
        download(){
            if(this.dialogRowsData.length>1){
                this.$message({
                    message: '只可选择一条下载',
                    type: 'warning'
                });
            }else if(this.dialogRowsData.length==1){
                window.location.href=this.domainName+"/buildingMaterialsCity/downloadSettlementDetails?settlementImportTemplateId="+this.dialogRowsData[0].settlementImportTemplateId;
                this.status=1;
                this.dialog=false;
            }else{
                this.$message({
                    message: '选择后在进行下载',
                    type: 'warning'
                });
            }
        },
        selectChange(val){
            this.dialogRowsData=val;
        },
        uploadSectionFile(res){
            put(res).then(data=>{
                console.log(data);
            })
        },
        selectModel(){
            this.dialog=true
            this.downLoadPages()
        },
        downLoadPages(){
            listSettlementImportTemplate().then(res=>{
                this.data=res.data.rows;
            })
        },
        tableRowClassName({row, rowIndex}) {//表格斑马线设置
            return rowIndex % 2 != 0 ? 'el-f0' : '';
        },
        currentChange(val) {
            this.billingParams.page=1;
            this.billingPage();
        },
        sizeChange(val) {
            this.billingParams.page=1;
            this.billingParams.limit=val;
            this.billingPage();
        },
        clickBilling(){
            // this.$router.push({
            //     path:"chooseBillingDetails"
            // })
        }
    },
}
</script>
<style scoped>
.clearfloat:after{display:block;clear:both;content:"";visibility:hidden;height:0}
.clearfloat{zoom:1}
.formList>li{
    width: 24.5%;
    display: flex;
    height: 50px;
    align-items: center;
    float: left;
}
.formList>li:nth-child(1){
    width: 20%;
}
.list>span{
    display: inline-block;
    width: 100px;
    text-align: right;
}
.list>div{
    display: inline-block;
    width: calc(100% - 100px);
}
</style>

