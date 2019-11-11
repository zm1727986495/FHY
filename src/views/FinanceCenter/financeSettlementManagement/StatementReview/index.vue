<template>
    <div>
        <div class="head_nav">
            <breadcrumb :navList="navList"></breadcrumb>
        </div>
        <el-card>
            <div class="queryForm">
                <el-row :gutter="10">
                    <el-col :span="span"><el-input @keyup.enter.native="search" size="medium" placeholder="供货商" v-model="formList.names"></el-input></el-col>
                    <el-col :span="span">
                        <el-date-picker
                            @keyup.enter.native="search"
                            size="medium" v-model="date1" type="daterange" 
                            value-format='yyyy-MM-dd'
                            range-separator="-"
                            start-placeholder="创建开始日期" end-placeholder="创建结算日期">
                        </el-date-picker>
                    </el-col>
                    <el-col :span="span">
                        <el-date-picker
                            @keyup.enter.native="search"
                            size="medium" v-model="date2" type="monthrange" 
                            value-format='yyyy-MM'
                            range-separator="-"
                            start-placeholder="开始月份" end-placeholder="结束月份" >
                        </el-date-picker>
                    </el-col>
                    <el-col :span="span">
                        <el-button size="medium" class="button-fc" type="warning" @click="search">查询</el-button>
                        <el-button size="medium" type="primary" @click="reset">重置</el-button>
                    </el-col>
                </el-row>
            </div>
        </el-card>
        <div class="m-top20">
            <el-tabs type="border-card" @tab-click="tabClick">
                <el-tab-pane label="待审核" name="0">
                    <el-button class="button-96" size="small" @click="showDialog">创建结算单</el-button>
                    <waitAudit :btnJurisdiction="btnJurisdiction" :tableData="tableData" @searchPages="searchPages"></waitAudit>
                </el-tab-pane>
                <el-tab-pane label="已审核" name="1">
                    <alreadyAudit :btnJurisdiction="btnJurisdiction" :tableData="tableData"></alreadyAudit>
                </el-tab-pane>
                <div class="pagination_wrap">
                    <pagination
                        :current-page="formList.page"
                        :pageSize="formList.page"
                        :total="total"
                        @sizeChange="sizeChange"
                        @currentChange="currentChange">
                    </pagination>
                </div>
            </el-tabs>
        </div>
        <el-dialog width="400px" title="创建结算单" :visible.sync="show" custom-class="customDialogTitle" @close="close">
            <div class="dialogInput">
                <label>
                    结算单名称：
                </label>
                <div>
                    <el-input size="medium" placeholder="请输入结算单名称" clearable v-model="names"></el-input>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" :loading="createFinalStatementLoading" @click="generateStatement">确 定</el-button>
                <el-button @click="show = false">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import breadcrumb from "@/views/components/breadcrumb";
import pagination from "@/views/components/pagination";
import waitAudit from './waitAudit';
import alreadyAudit from './alreadyAudit';
import { listPurchasingSettlementByPage } from "@/api/FinanceCenter/statementReview/index";
import { getUUID } from "@/api/pulicJava";
import { savePurchasingSettlement } from  '@/api/administrationCenter/purchaseOrderAccountCheck/index';
export default {
    components:{
        breadcrumb,
        waitAudit,
        alreadyAudit,
        pagination
    },
    activated(){
        this.btnInit()
        this.navList = this.$route.meta;
        this.pages()
    },
    // deactivated () {
    //     this.$destroy(true)
    // },
    // mounted() {
    //     this.btnInit()
    //     this.navList = this.$route.meta;
    //     this.pages()
    // },
    data(){
        return{
            span:6,
            navList:[],
            total:10,
            formList:{
                names:'',
                startTime:"",
                endTime:'',
                startMonth:'',
                endMonth:'',
                dataType:0,
                page:1,
                limit:10,
            },
            date1:["",""],
            date2:'',
            tableData:[],
            btnJurisdiction:{
                audit:false,
                goBack:false,
                import:false
            },
            show:false,
            names:null,
            createFinalStatementLoading:false
        }
    },
    methods: {
        //创建结算单弹窗
        showDialog(){
            this.show=true;
        },
        close(){
            this.names=null
        },
        //创建结算单
        generateStatement(){
            if(this.names){
                this.createFinalStatementLoading=true;
                getUUID({
                    serialNumber:'QJ'
                }).then(response=>{
                    let date = new Date();
                    let month=date.getMonth()+1;
                    let year=date.getFullYear()
                    savePurchasingSettlement({
                        purchasingSettlementNumber:response.data,
                        purchasingSettlementName:this.names,
                        bookkeepingMonth:year+'-'+month
                    }).then(res=>{
                        this.pages()
                        this.createFinalStatementLoading=false;
                        this.show=false;
                        this.$message({
                            message: '创建成功',
                            type: 'success'
                        });
                    }).catch(err=>{
                        console.log(err)
                        this.createFinalStatementLoading=false;
                        this.$message({
                            message: '创建失败',
                            type: 'error'
                        });
                    })
                }).catch(err=>{
                    console.log(err)
                    this.createFinalStatementLoading=false;
                    this.$message({
                        message: '创建失败',
                        type: 'error'
                    });
                })
            }else{
                this.$message.warning("请输入结算单名称")
            }
            
        },
        btnInit(){
            this.btnJurisdiction.audit=JSON.parse(this.$loca.getItem('element'))["statementReview:btn_audit"];
            this.btnJurisdiction.goBack=JSON.parse(this.$loca.getItem('element'))["statementReview:btn_goBack"];
            this.btnJurisdiction.import=JSON.parse(this.$loca.getItem('element'))["statementReview:btn_import"];
        },
        reset(){
            this.formList.names='';
            this.formList.startTime="";
            this.formList.endTime='';
            this.formList.startMonth='';
            this.formList.endMonth='';
            this.formList.page=1;
            this.date1=["",""];
            this.date2='';
            this.pages()
        },
        searchPages(){
            this.pages()
        },
        search(){
            this.formList.page=1;
            this.pages()
        },
        pages(){
            this.tableData=[];
            this.total=0;
            this.formList.startTime=this.date1[0];
            this.formList.endTime=this.date1[1];
            this.formList.startMonth=this.date2[0];
            this.formList.endMonth=this.date2[1];
            listPurchasingSettlementByPage(
                this.formList
            ).then(res=>{
                this.tableData=res.data.rows;
                this.total=res.data.total;
            })
        },
        tabClick(val){
            this.formList.dataType=val.index;
            this.pages()
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
<style scoped lang="scss">
.dialogInput{
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
