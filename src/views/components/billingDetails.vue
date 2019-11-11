<template>
    <div>
        <div class="m-top20" v-if="isTallOrder">
            <el-card>
                <div class="iconBox"><i class='Icon'></i><span>导入结算明细</span></div>
                <div class="m-top20">
                    <el-button class="button-96" size="small" v-if="!$route.query.btn && radioStatus== 0" @click="clickBilling">导入结算明细</el-button>
                    <el-button class="button-96" size="small" @click="downloadMoudle">下载模板</el-button>
                    <el-button class="button-96" size="small" @click="deleteBilling">删除</el-button>
                    <el-button class="button-96" size="small" @click="searchBilling">导入失败记录</el-button>
                    <div style="float:right">
                        <span style="margin-right:50px">共 {{billingTotal}} 笔收款</span>
                        <span>合计：{{moneyAll}} 元</span>
                    </div>
                </div>
                <div class="m-top20 unsortable">
                    <el-table
                    :data="tableData"
                    :row-class-name="tableRowClassName"
                    @selection-change="billingsChange"
                    border>
                        <el-table-column align="center" type="selection" width="50" fixed="left"></el-table-column>
                        <el-table-column prop="transactionVoucher" width="140" align="center" label="建材城收据号"></el-table-column>
                        <el-table-column prop="orderNumber" width="140" align="center" label="订单编号"></el-table-column>
                        <el-table-column prop="customerName" width="140" align="center" label="客户姓名"></el-table-column>
                        <el-table-column prop="paymentMethodName" width="140" align="center" label="收款方式"></el-table-column>
                        <el-table-column prop="amountCollected" width="140"  align="center" label="收款金额"></el-table-column>
                        <el-table-column prop="refundAmount" width="140" align="center" label="返款金额"></el-table-column>
                        <el-table-column prop="cardNumber" width="180" align="center" label="刷卡卡号" show-tooltip-when-overflow></el-table-column>
                        <el-table-column prop="serviceCharge" width="120" align="center" label="刷卡手续费"></el-table-column>
                        <el-table-column prop="dateCollection" width="170" align="center" label="收款日期"></el-table-column>
                    </el-table>
                    <div class="pagination_wrap">
                        <pagination
                            :current-page="billingParams.page"
                            :pageSize="billingParams.limit"
                            :total="billingTotal"
                            @sizeChange="billingSizeChange"
                            @currentChange="billingCurrentChange">
                        </pagination>
                    </div>
                </div>
            </el-card>
        </div>
        <div class="m-top20" v-if="isCost">
            <el-card>
                <div class="iconBox"><i class='Icon'></i><span>导入费用明细</span></div>
                <div class="m-top20">
                    <el-upload
                        action="/api/pc/buildingMaterialsCity/importDetailsCharges"
                        class="upload-demo"
                        multiple
                        :headers="headers"
                        :data="costParams"
                        :show-file-list="false"
                        :before-upload="costUpload"
                        :on-success="costSuccess"
                        style="display:inline-block;margin-right:10px"
                        >
                        <el-button class="button-96" size="small" @click="importCost">导入费用明细</el-button>
                    </el-upload>
                    <el-button class="button-96" size="small" @click="addNewCostBreakdown">新增费用明细</el-button>
                    <el-button class="button-96" size="small" @click="deleteAll">删除</el-button>
                    <el-button class="button-96" size="small" @click="searchCost">查询导入费用明细记录</el-button>
                </div>
                <div class="m-top20 unsortable">
                    <el-table
                    :data="tableData2"
                    @selection-change="detailsChange"
                    :row-class-name="tableRowClassName"
                    border>
                        <el-table-column align="center" type="selection"></el-table-column>
                        <el-table-column prop="costName" align="center" label="费用类型">
                            <template slot-scope="scope">
                                <el-tooltip placement="right" visible-arrow >
                                    <div slot="content" class="tips tipFon">
                                        <p class="operaItems" @click="editRows(scope.row)">编辑</p>
                                        <p class="operaItems" @click="deleteRows(scope.row)">删除</p>
                                    </div>
                                    <img :src="spot" alt="" class="attributesTips">
                                </el-tooltip>
                                <span class="table_action_span" >{{scope.row.costName}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="costMoney" align="center" label="费用金额"></el-table-column>
                        <el-table-column prop="costMonth" align="center" label="费用月份"></el-table-column>
                        <el-table-column prop="costAbstract" align="center" label="摘要"></el-table-column>
                        <el-table-column prop="remarks" align="center" label="备注"></el-table-column>
                        
                        
                    </el-table>
                    <div class="pagination_wrap">
                        <pagination
                            :current-page="detailsParams.page"
                            :pageSize="detailsParams.limit"
                            :total="detailTotal"
                            @sizeChange="sizeChange"
                            @currentChange="currentChange">
                        </pagination>
                    </div>
                </div>
            </el-card>
        </div>
        <el-card class="m-top50">
            <div class="btnList">
                <el-button size="medium" type="primary" @click="saveList(0)">保存结算单</el-button>
                <el-button size="medium" type="primary" @click="saveList(1)">创建结算单</el-button>
                <el-button size="medium" @click="$router.go(-1)">取消</el-button>
            </div>
        </el-card>
        <el-dialog
            :visible.sync="dialog"
            width="600px"
            custom-class="customDialogTitle"
            title="费用明细"
            @close="close"
            >
            <div>
                <el-form ref="formCost" :rules="rules" :model="costBreakdownQuery" label-width="100px">
                    <el-form-item label="费用类别：" prop="costType">
                        <el-select v-model="costBreakdownQuery.costType" style="width:70%" size="medium">
                            <el-option v-for="(item,idx) in costTypeArr" :key="idx" :label="item.dictName" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="返款金额：" prop="costMoney">
                        <el-input placeholder="请输入返款金额" size="medium" @input="filterMoney" :value="costBreakdownQuery.costMoney" style="width:70%"></el-input>
                    </el-form-item>
                    <el-form-item label="费用月份：" prop="costMonth">
                        <div class="head_nav_datapick" style="width:70%">
                            <el-date-picker
                                size="medium" v-model="costBreakdownQuery.costMonth" type="date"
                                value-format='yyyy-MM-dd HH:mm:ss'
                                range-separator="-"
                                style="width:100%"
                                start-placeholder="选择创建订单时间">
                            </el-date-picker>
                        </div>
                    </el-form-item>
                    <el-form-item label="摘要：">
                        <el-input type="textarea" v-model="costBreakdownQuery.costAbstract"></el-input>
                    </el-form-item>
                    <el-form-item label="备注：">
                        <el-input type="textarea" v-model="costBreakdownQuery.remarks"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="confirmCost">提交</el-button>
                <el-button @click="dialog = false">取 消</el-button>
            </span>
        </el-dialog>
        <el-dialog
            :visible.sync="visible"
            width="400px"
            custom-class="customDialogTitle"
            title="生成结算方式"
            >
            <div style="display:flex;justify-content:center">
                <el-radio v-model="radios" :label="0" clearable>新生成</el-radio>
                <el-radio v-model="radios" :label="1" clearable>选择已有</el-radio>
            </div>
            <span slot="footer" class="dialog-footer">
                <div class="footer">
                    <el-button type="primary" @click="ConfrimClearingForm" v-if="radios==1" class="confirm">确定</el-button>
                    <el-upload
                        v-else
                        action="/api/pc/buildingMaterialsCity/importSettlementDetails"
                        class="upload-demo"
                        multiple
                        :headers="headers"
                        :data="obj"
                        :show-file-list="false"
                        :before-upload="beforeUploat"
                        :on-success="uploadSuccess"
                        :disabled="loading"
                        style="display:inline-block;margin-right:10px"
                        >
                        <el-button type="primary" :disabled="loading" :loading="loading" class="confirm" @click="confirmUpload">确定</el-button>
                    </el-upload>
                    <el-button @click="visible = false">取 消</el-button>
                </div>
            </span>
        </el-dialog>
        <el-dialog :visible.sync="downloadDialog" title="下载模板" custom-class="customDialogTitle">
            <el-table :data="data" border @selection-change="selectChange">
                <el-table-column align="center" type="selection"></el-table-column>
                <el-table-column align="center" prop="number" label="编号"></el-table-column>
                <el-table-column align="center" prop="name" label="名称"></el-table-column>
                <el-table-column align="center" prop="isEffective" label="是否有效">
                    <template slot-scope="scope">
                        <el-radio :value="scope.row.isEffective" :label="1">是</el-radio>
                        <el-radio :value="scope.row.isEffective" :label="0">否</el-radio>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="organizationName" label="服务机构"></el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="download">
                    下载
                </el-button>
                <el-button @click="downloadDialog=false">关闭</el-button>
            </span>
        </el-dialog>
        <el-dialog
            :visible.sync="settlementDialog"
            title="导入失败记录"
            custom-class="customDialogTitle"
            width="80%"
            >
            <div class="table_list unsortable">
              <el-table
                :data="billingData"
                :row-class-name="tableRowClassName"
                @selection-change="statementChange"
                border>
                <el-table-column align="center" type="index" fixed="left" width="50"></el-table-column>
                <el-table-column show-overflow-tooltip prop="transactionVoucher" align="center" label="建材城收据号" width="140"></el-table-column>
                <el-table-column show-overflow-tooltip prop="paymentMethodName" align="center" label="收款方式" width="120"></el-table-column>
                <el-table-column show-overflow-tooltip prop="amountCollected" align="center" label="收款金额" width="120"></el-table-column>
                <el-table-column show-overflow-tooltip prop="serviceCharge" align="center" label="刷卡手续费" width="120"></el-table-column>
                <el-table-column show-overflow-tooltip prop="cardNumber" align="center" label="刷卡卡号" width="140"></el-table-column>
                <el-table-column show-overflow-tooltip prop="dateCollection" width="180" align="center" label="收款日期"></el-table-column>
                <el-table-column show-overflow-tooltip prop="status" align="center" label="状态" width="120">
                  <template slot-scope="scope">
                    {{scope.row.status==0?"成功":"失败"}}
                  </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="remarks" width="400" align="center" label="失败原因"></el-table-column>
              </el-table>
              <div class="pagination_wrap">
                <pagination
                  :current-page="searchBillingParams.page"
                  :pageSize="searchBillingParams.limit"
                  :total="statementTotal"
                  @sizeChange="statementSizeChange"
                  @currentChange="statementCurrentChange">
                </pagination>
              </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="settlementDialog=false">关闭</el-button>
            </span>
        </el-dialog>
        <el-dialog
            :visible.sync="BillingDialog"
            title="查询导入费用明细记录"
            custom-class="customDialogTitle"
            width="1300px"
            >
            <div class="table_list unsortable">
              <el-table
                :data="costData"
                @selection-change="costChange"
                :row-class-name="tableRowClassName"
                border>
                <el-table-column align="center" type="selection" width="50" fixed="left"></el-table-column>
                <el-table-column prop="costType" align="center" label="费用类型">
                </el-table-column>
                <el-table-column prop="costAbstract" align="center" label="摘要"></el-table-column>
                <el-table-column prop="costMonth" align="center" label="费用月份"></el-table-column>
                <el-table-column prop="costMoney" align="center" label="费用金额"></el-table-column>
                <el-table-column prop="remarks" align="center" label="备注"></el-table-column>
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
import {
    listImportDetailsCharges,
    listImportSettlementDetails,
    addDetailsCharges,
    importSettlementDetails,
    listSettlementImportTemplate,
    listBmcCostDetailedByPage,
    delImportDetailsCharges,
    listSettlementDetails,
    delImportSettlementDetails,
    submissionReceivables,
    getDetailsCharges,
    editImportDetailsCharges,
    getSumAmount
} from "@/api/FinanceCenter/financeSettlementManagement/domesticOutfitCollection/index"
import module from "../../../config/index";
import { put } from "@/utils/pubilcFn";
import { getToken } from 'utils/auth';// 登录Token
import { listBaseDict, getUUID } from "@/api/pulicJava";
import { formatAmount } from '@/utils/pubilcFn';
import model from '../../../config/index';
export default {
    props:["isShow", "bmcReceivablesId", "radio","isCost","isTallOrder",'storeId'],
    components:{
        breadcrumb,
        pagination,
    },
    mounted() {
        this.navList = this.$route.meta;
        listBaseDict({
            dataType:"CostType"
        }).then(res=>{
            this.costTypeArr=res.data
        })
            this.doloadPages()
            this.bmcSettlementId=this.$route.query.bmcSettlementId?this.$route.query.bmcSettlementId:"";
            if(this.bmcSettlementId){
                this.setstatementStatus=true;
                this.billingParams.bmcBatchId=this.$route.query.bmcBatchId;
                this.billingPage()
                this.detailsPages()
                this.costStatus=1;
            }
        // if(this.$route.query.bmcBatchId){
            
        // }
    },
    data(){
        return{
            headers: {
                Authorization: getToken(),
                // contentType:"application/x-www-form-urlencoded; charset=UTF-8"
            },
            domainName:"http://47.111.169.139:8766",
            navList:[],
            bmcSettlementId:null,
            loading:false,
            spot:spot,
            searchtext:'',
            statementTotal:10,
            billingTotal:0,
            detailTotal:0,
            costTotal:10,
            dialog:false,
            BillingDialog:false,
            payUser:'居然之家',
            paymentTerm:'汇款',
            moneyNum:'招商银行||张三||12313131',
            remittanceMoney:2020560,
            closeAccount:'十里河店',
            settlementDialog:false,
            month:"",
            searchData:'',
            visible:false,
            moneyAll:0,
            costParams:{
                bmcReceivablesIds:this.$route.query.bmcReceivablesId,
                bmcSettlementId:""
            },
            obj:{
                bmcReceivablesIds:this.$route.query.bmcReceivablesId,
                settlementImportTemplateId:"",
                bmcSettlementId:"",
                settlementType:0,
                settlementNumber:null,
                storeId:""
            },
            form:{

            },
            collectionDays:'2019-01-04',
            tableData:[
            ],
            tableData2:[
            ],
            searchCostParams:{
                bmcSettlementId:"",
                page:1,
                limit:10,
                dataType:0
            },
            searchBillingParams:{
                bmcSettlementId:"",
                page:1,
                limit:10
            },
            dialogRowsData:[],
            data:[],
            downloadDialog:false,
            costBreakdownQuery:{
                costType:"",
                costMonth:"",
                costAbstract:"",
                remarks:"",
                bmcReceivablesIds:[],
                bmcSettlementId:"",
                settlementType:0,
                costMoney:''
            },
            detailsParams:{
                bmcSettlementId:"",
                page:1,
                limit:10,
            },
            billingParams:{
                bmcBatchId:"",
                page:1,
                limit:10,
            },
            costTypeArr:[],
            detailsRows:[],
            status:0,
            costStatus:0,
            billingRows:[],
            billingData:[],
            statementRows:[],
            setstatementStatus:false,
            costData:[],
            costRows:[],
            isAddOrEdit:0,
            bmcCostDetailedId:"",
            bmcBatchId:'',
            radios:0,
            radioStatus:0,
            rules:{
                costType:[
                    {
                        required:true,
                        message:'请选择费用类型',
                        trigger: 'change'
                    }
                ],
                costMoney:[
                    {
                        required:true,
                        message:'请输入费用金额',
                        trigger: 'blur'
                    }
                ],
                costMonth:[
                    {
                        required:true,
                        message:'请选择费用月份',
                        trigger: 'change'
                    }
                ],
            }
        }
    },
    methods: {
        filterMoney(val){
            this.costBreakdownQuery.costMoney=val.replace(/[^\d]/g,'');
        },
        importCost(){
            getUUID({
                serialNumber:'SA'
            }).then(res=>{
                this.costParams.settlementNumber=res.data;
            })
        },
        download(){
            if(this.dialogRowsData.length>1){
                this.$message({
                    message: '只可选择一条下载',
                    type: 'warning'
                });
            }else if(this.dialogRowsData.length==1){
                window.location.href=  module.dev.proxyTable['/api'].target+"/api/pc/buildingMaterialsCity/downloadSettlementDetails?settlementImportTemplateId="+this.dialogRowsData[0].settlementImportTemplateId;
                this.status=1;
                this.downloadDialog=false;
            }else{
                this.$message({
                    message: '选择后在进行下载',
                    type: 'warning'
                });
            }
        },
        close(){
            for(let i in this.costBreakdownQuery){
                this.costBreakdownQuery[i]="";
            }
        },
        editRows(val){
            this.bmcCostDetailedId=val.bmcCostDetailedId;
            getDetailsCharges(
                {
                    bmcCostDetailedId:this.bmcCostDetailedId
                }
            ).then(res=>{
                for(let i in this.costBreakdownQuery){
                    this.costBreakdownQuery[i]=res.data[i]
                }
                this.dialog=true;
                this.isAddOrEdit=1;
            })

        },
        saveList(val){
            if(this.bmcSettlementId){
                submissionReceivables(
                    {
                        bmcBatchId:this.bmcBatchId,
                        bmcSettlementId:this.bmcSettlementId?this.bmcSettlementId:"",
                        status:val
                    }
                ).then(res=>{
                    if(val==0){
                        this.$message({
                            message: '保存成功',
                            type: 'success'
                        });
                    }else if(val==1){
                        this.$message({
                            message: '提交成功',
                            type: 'success'
                        });
                    }
                    setTimeout(()=>{
                        this.$router.push({
                            path:"domesticOutfitCollection"
                        })
                    },500)
                })
            }else{
                if(val==0){
                    this.$message({
                        message: '请操作后再进行保存',
                        type: 'warning'
                    });
                }else if(val==1){
                    this.$message({
                        message: '请操作后再进行提交',
                        type: 'warning'
                    });
                }
            }
        },
        statementChange(val){
            this.statementRows=val;
        },
        //结算明细分页器换页
        billingSizeChange(val){
            this.billingParams.limit=val;
            this.billingParams.page=1;
            this.billingPage()
        },
        //改变结算明细分页器数量
        billingCurrentChange(val){
            this.billingParams.page=val;
            this.billingPage()
        },
        //选择结算明细
        billingsChange(val){
            this.billingRows=val;
        },
        //结算明细表格
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
                this.billingTotal=res.data.total;
            })
        },
        //结算明细删除按钮
        deleteBilling(){
            if(this.billingRows.length){
                let arr=[];
                this.billingRows.map((item,idx)=>{
                    arr.push(item.bmcSettlementDetailedId)
                })
                delImportSettlementDetails(
                    {
                        bmcSettlementDetailedIds:arr
                    }
                ).then(res=>{
                    this.billingPage();
                })
            }else{
                this.$message({
                    message: '请选择后再进行删除',
                    type: 'warning'
                });
            }
        },
        costUpload(file){
            this.costParams.bmcSettlementId=this.bmcSettlementId?this.bmcSettlementId:"";
            return true
        },
        costSuccess(val){
            this.bmcSettlementId=val.data;
            this.detailsParams.bmcSettlementId=this.bmcSettlementId?this.bmcSettlementId:"";
            this.detailsPages();
            this.costStatus=1;
            this.$message({
                message: '导入成功',
                type: 'success'
            });
        },
        //上传之前的回调
        beforeUploat(file){
            this.obj.settlementImportTemplateId=this.status==1?this.dialogRowsData[0].settlementImportTemplateId:this.data[0].settlementImportTemplateId;
            this.obj.bmcSettlementId=this.bmcSettlementId?this.bmcSettlementId:"";
            this.obj.settlementType=this.radio;
            this.obj.storeId=this.storeId;
            this.loading=true;
        },
        confirmUpload(){
            getUUID({
                serialNumber:'SA'
            }).then(res=>{
                this.obj.settlementNumber=res.data;
            })
        },
        //上传成功之后的回调
        uploadSuccess(val){
            this.radioStatus=1;
            this.visible=false;
            this.bmcSettlementId=val.data.bmcSettlementId?val.data.bmcSettlementId:"";
            this.billingParams.bmcBatchId=val.data.bmcBatchId?val.data.bmcBatchId:"";
            this.setstatementStatus=true;
            this.bmcBatchId=val.data.bmcBatchId;
            this.loading=false;
            this.costStatus=1;
            this.billingPage()
            this.$message({
                message: '导入成功',
                type: 'success'
            });
        },
        //费用明细表格选择
        detailsChange(val){
            this.detailsRows=val;
        },
        //批量删除费用明细
        deleteAll(){
            if(this.detailsRows.length){
                let arr=[];
                this.detailsRows.map((item,idx)=>{
                    arr.push(item.bmcCostDetailedId)
                })
                delImportDetailsCharges(
                    {
                        bmcCostDetailedIds:arr
                    }
                ).then(res=>{
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    });
                    this.detailsPages();
                })
            }else{
                this.$message({
                    message: '请选择后再删除',
                    type: 'warning'
                });
            }
        },
        //单删费用明细
        deleteRows(val){
            delImportDetailsCharges(
                {
                    bmcCostDetailedIds:[val.bmcCostDetailedId]
                }
            ).then(res=>{
                this.$message({
                    message: '删除成功',
                    type: 'success'
                });
                this.detailsPages();
            })
        },
        //新增费用明细提交
        confirmCost(){
            this.$refs.formCost.validate((valid) => {
                if(valid) {
                    this.costBreakdownQuery.bmcReceivablesIds=[this.$route.query.bmcReceivablesId];
                    this.costBreakdownQuery.settlementType=this.radio;
                    this.costBreakdownQuery.bmcSettlementId=this.bmcSettlementId?this.bmcSettlementId:"";
                    if(this.isAddOrEdit==0){
                        addDetailsCharges(
                            this.costBreakdownQuery
                        ).then(res=>{
                            this.bmcSettlementId=res.data?res.data:"";
                            this.$message({
                                message: '新增成功',
                                type: 'success'
                            });
                            this.detailsPages();
                            this.dialog=false;
                            this.costStatus=1;
                        })
                    }else{
                        this.costBreakdownQuery.bmcCostDetailedId=this.bmcCostDetailedId;
                        editImportDetailsCharges(this.costBreakdownQuery).then(res=>{
                            this.dialog=false;
                            this.$message({
                                message: '编辑成功',
                                type: 'success'
                            });
                            this.detailsPages()
                        })
                    }
                }else{
                    return false;
                }
            });

        },
        //新增费用明细弹窗
        addNewCostBreakdown(){
            this.dialog=true;
            this.isAddOrEdit=0;
        },
        //下载模板弹窗表格选择
        selectChange(val){
            this.dialogRowsData=val;
        },
        //下载模板按钮
        downloadMoudle(){
            this.downloadDialog=true
            this.doloadPages()
        },
        doloadPages(){
            listSettlementImportTemplate().then(res=>{
                this.data=res.data.rows;
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
        //查询费用明细
        searchCost(){
            if(this.costStatus){
                this.costPort()
            }else{
                this.$message({
                    message: '请先导入明细记录或新增后再进行查询',
                    type: 'warning'
                });
            }
        },
        costPort(){
            this.searchCostParams.bmcSettlementId=this.bmcSettlementId?this.bmcSettlementId:"";
            listImportDetailsCharges(
                this.searchCostParams
            ).then(res=>{
                this.costData=res.data.rows;
                this.BillingDialog=true;
            })
        },
        //查询结算明细
        searchBilling(){
            this.setstatementPort()
        },
        setstatementPort(){
            if(this.setstatementStatus){
                this.searchBillingParams.bmcSettlementId=this.bmcSettlementId?this.bmcSettlementId:"";
                listImportSettlementDetails(
                    this.searchBillingParams
                ).then(res=>{
                    this.billingData=res.data.rows;
                    this.settlementDialog=true;
                })
            }else{
                this.$message({
                    message: '请先导入结算明细',
                    type: 'warning'
                });
            }
        },
        //
        statementSizeChange(val){
            this.searchBillingParams.page=1;
            this.searchBillingParams.limit=val;
            this.setstatementPort()
        },
        statementCurrentChange(val){
            this.searchBillingParams.page=val;
            this.setstatementPort()
        },
        //费用明细列表
        detailsPages(){
            this.detailsParams.bmcSettlementId=this.bmcSettlementId?this.bmcSettlementId:"";
            listBmcCostDetailedByPage(
                this.detailsParams
            ).then(res=>{
                this.tableData2=res.data.rows;
                this.detailTotal=res.data.total;
            })
        },
        costChange(val){
            this.costRows=val;
        },
        //表格斑马线设置
        tableRowClassName({row, rowIndex}) {
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
        ConfrimClearingForm(){
            if(this.radios==null){
                this.$message({
                    message: '请选择',
                    type: 'warning'
                });
            }else if(this.radios==0){
                // 新生成
            }else if(this.radios==1){
                this.$router.push({
                    path:"chooseBillingDetails",
                    query:{
                        bmcReceivablesIds:this.$route.query.bmcReceivablesId,
                        bmcSettlementId:this.bmcSettlementId?this.bmcSettlementId:""
                    }
                })
            }
        },
        clickBilling(){
            this.visible=true;
        }
    }
}
</script>
<style scoped>
.clearfloat:after{display:block;clear:both;content:"";visibility:hidden;height:0}
.clearfloat{zoom:1}
.formList>li{
    width:25%;
    height: 50px;;
    float: left;
    display: flex;
    align-items: center;
}
.list>span{
    display: inline-block;
    width: 120px;;
    text-align: right;
}
.list>div{
    display: inline-block;
}
.btnList{
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
