<template>
    <div class="unsortable">
        <div class="head_nav">
            <breadcrumb :navList="navList"></breadcrumb>
        </div>
        <el-card>
            <div class="queryForm">
                <el-row :gutter="10">
                    <el-col :span="6">
                        <el-input size="medium" v-model="formList.paymentNumber" clearable placeholder="支出单号"></el-input>
                    </el-col>
                    <el-col :span="6">
                        <el-input size="medium" v-model="formList.companyName" clearable placeholder="支付对象"></el-input>
                    </el-col>
                    <el-col :span="6">
                        <el-input size="medium" v-model="formList.bankCardNumber" clearable placeholder="银行账号"></el-input>
                        </el-col>
                    <el-col :span="6">
                        <el-select size="medium" v-model="formList.isPrinting" clearable>
                            <el-option label="已打印" :value="1"></el-option>
                            <el-option label="未打印" :value="0"></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="6" v-if="searchIsShow">
                        <el-select size="medium" v-model="formList.paymentType" clearable>
                            <el-option v-for="(item,idx) in selectList" :key="idx" :label="item.dictName" :value="item.id"></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="24" style="text-align:center">
                        <span @click="more">{{text}}</span>
                        <el-button size="medium" class="button-fc" type="warning" @click="searchTable">查询</el-button>
                        <el-button size="medium" type="primary" @click="reset">重置</el-button>
                    </el-col>
                </el-row>
            </div>
        </el-card>
        <div class="m-top20">
            <el-tabs type="border-card" @tab-click="tabClick">
                <el-tab-pane label="待提交" name="0">
                    <el-button class="button-96" size="small" v-if="btnJurisdiction.create" @click="openDialog">创建支出单</el-button>
                    <el-button class="button-96" size="small" v-if="btnJurisdiction.delete" :loading="deleteLoading" @click="deleteRows">删除支出单</el-button>
                    <el-button class="button-96" size="small" v-if="btnJurisdiction.submit" :loading="submitLoading" @click="submitRows">提交</el-button>
                    <waitSubmit :btnJurisdiction="btnJurisdiction" style="margin-top:20px" :isNull="isNull" @submitRow="submitRow" @listen="marks" :tableData="tableData" @selectRows="selectRows" @delectRow="delectRow"></waitSubmit>
                </el-tab-pane>
                <el-tab-pane label="已提交" name="1">
                    <aleradySubmit :btnJurisdiction="btnJurisdiction" :tableData="tableData" @listen="marks"></aleradySubmit>
                </el-tab-pane>
                <div class="pagination_wrap">
                    <pagination
                        :current-page="formList.page"
                        :pageSize="formList.limit"
                        :total="total"
                        @sizeChange="sizeChange"
                        @currentChange="currentChange">
                    </pagination>
                </div>
            </el-tabs>
        </div>
        <el-dialog title="创建支出单" width="800px" :visible.sync="dialog" custom-class="customDialogTitle" @close="closeEvent">
            <div>
                <div style="text-align:left;height:40px;" v-if="flag">
                    <span style="width:100px;text-align:right;display:inline-block">创建人：</span>{{createAtName}} {{createTime}}
                </div>
                <el-form label-width="100px" :inline="true" :model="dialogFormList" :rules="rules" ref="form">
                    <el-form-item label="支出类型" prop="paymentType">
                        <el-select v-model="dialogFormList.paymentType" style="width:260px" :disabled="flag" clearable>
                            <el-option v-for="(item,idx) in selectList" :key="idx" :label="item.dictName" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="合作商家" prop="companyId">
                        <el-select v-model="dialogFormList.companyId" style="width:260px" :disabled="flag" clearable @change="changeCompany">
                            <el-option v-for="(item,idx) in companyArr" :key="idx" :label="item.companyName" :value="item.companyId"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="付款方式" prop="paymentMethod">
                         <el-select v-model="dialogFormList.paymentMethod" style="width:260px" :disabled="flag" clearable @change="payMethods">
                            <el-option v-for="(item,idx) in paymentMethodArr" :key="idx" :label="item.dictName" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="费用月份" prop="costMonth">
                        <el-date-picker 
                            style="width:260px"
                            size="large"
                            v-model="dialogFormList.costMonth"
                            type="date"
                            value-format="yyyy-MM"
                            format="yyyy-MM"
                            :disabled="flag"
                            placeholder="日期">
                        </el-date-picker> 
                    </el-form-item> 
                    <div class="userInfo">
                        <el-form-item label="开户名" v-if="formShows">
                            {{dialogForm.user}}
                        </el-form-item>
                        <el-form-item label="所属银行" v-if="formShows">
                            {{dialogForm.bank}}
                        </el-form-item>
                        <el-form-item label="银行账号" v-if="formShows">
                            {{dialogForm.bankCard}}
                        </el-form-item>
                        <el-button @click="selectBank" size="small" class="button-96 chose" v-if="!flag">选择</el-button>
                    </div>
                    <el-form-item label="支付金额" prop="paymentMoney">
                        <el-input @input="filterNumber(dialogFormList.paymentMoney)" v-model="dialogFormList.paymentMoney" clearable :disabled="flag" placeholder="支付金额" style="width:260px"></el-input>
                    </el-form-item>
                    <el-form-item label="备注" class="remark">
                        <el-input type="textarea" clearable v-model="dialogFormList.remark" style="width:630px" :disabled="flag"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <span style="display:flex;justify-content:center;align-items:center">
                <el-button type="primary" :loading="saveLoading" v-if="!flag" @click="saveList">保存</el-button>
                <el-button type="primary" :loading="submitLoading2" v-if="!flag" @click="submitList">提交</el-button>
                <el-button type="primary" @click="printing">打印</el-button>
                <el-button @click="close" class="el-form-item">关闭</el-button>
            </span>
        </el-dialog>
        <el-dialog :visible.sync="show">
            <div>
                <el-table
                :data="dialogTable"
                border
                @selection-change="selectChanges"
                >
                    <el-table-column
                        type="selection"
                        align="center"
                    ></el-table-column>
                    <el-table-column
                        prop="accountName"
                        align="center"
                        label='开户名'
                    ></el-table-column>
                    <el-table-column
                        prop="openingBankName"
                        align="center"
                        label='开户行'
                    ></el-table-column>
                    <el-table-column
                        prop="bankCardNumber"
                        align="center"
                        label='卡号'
                    ></el-table-column>
                    <el-table-column
                        prop="isDefault"
                        align="center"
                        label='是否默认'
                    >
                        <template slot-scope="scope">
                            <div>
                                {{scope.isDefault==0?"否":"是"}}
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="pagination_wrap">
                <pagination
                    :current-page="dialogQuery.page"
                    :pageSize="dialogQuery.limit"
                    :total="dialogTotal"
                    @sizeChange="dialogSizeChange"
                    @currentChange="dialogCurrentChange">
                </pagination>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="clickOk" type="primary">确定</el-button>
                <el-button @click="show=false">取消</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import breadcrumb from "../../../components/breadcrumb";
import waitSubmit from './waitSubmit';
import pagination from '@/views/components/pagination'
import aleradySubmit from './aleradySubmit';
import { 
    listBaseDict, 
    listPartnerExpenditureListVOByPage, 
    listCompanyByAll, 
    addPartnerExpenditureList, 
    getPartnerExpenditureListVOByPage,
    deletePartnerExpenditureList,
    commitPartnerExpenditureList,
    updatePartnerExpenditureList,
    listCompanyBankAccountByPage
} from "@/api/FinanceCenter/serverPaymentManagement/serverSpendingApplication"
import { getUUID } from "@/api/pulicJava";
export default {
    components:{
        breadcrumb,
        waitSubmit,
        aleradySubmit,
        pagination
    },
    activated(){
        this.btnInit()
        this.navList = this.$route.meta;
        listBaseDict(
            {
                dataType:'expenditure_type'
            }
        ).then(res=>{
            this.selectList=res.data;
        })
        listBaseDict(
            {
                dataType:'expenditure_payment_method'
            }
        ).then(res=>{
            this.paymentMethodArr=res.data;
        })
        listCompanyByAll({
            companyType:1
        }).then(res=>{
            this.companyArr=res.data;
        })
        this.pages()
    },
    // deactivated () {
    //     this.$destroy(true)
    // },
    // mounted() {
    //     this.btnInit()
    //     this.navList = this.$route.meta;
    //     listBaseDict(
    //         {
    //             dataType:'expenditure_type'
    //         }
    //     ).then(res=>{
    //         this.selectList=res.data;
    //     })
    //     listBaseDict(
    //         {
    //             dataType:'expenditure_payment_method'
    //         }
    //     ).then(res=>{
    //         this.paymentMethodArr=res.data;
    //     })
    //     listCompanyByAll({
    //         companyType:1
    //     }).then(res=>{
    //         this.companyArr=res.data;
    //     })
    //     this.pages()
    // },
    data(){
        return{
            show:false,
            deleteLoading:false,
            submitLoading:false,
            saveLoading:false,
            submitLoading2:false,
            navList:[],
            searchtext:'',
            dialog:false,
            selectList:[],
            total:10,
            dialogTotal:10,
            formShows:false,
            formList:{
                paymentNumber:'',   //支出单号
                companyName:"",     //支付对象
                bankCardNumber:"",  //银行卡号
                isPrinting:"",
                paymentType:"",
                status:0,
                limit:15,
                page:1,
            },
            tableData:[],
            dialogTable:[],
            dialogQuery:{
                limit:10,
                page:1,
                companyId:"",
            },
            companyArr:[],
            paymentMethodArr:[],
            dialogFormList:{
                paymentType:"",
                companyId:"",
                paymentMethod:"",
                bankAccountId:0,
                costMonth:"",
                paymentMoney:"",
                isPrinting:0,
                remark:"",
                status:"",
                paymentNumber:null
            },
            rowsData:[],
            createAtName:"",
            createTime:"",
            isEdit:false,
            partnerExpenditureListId:"",
            flag:false,
            dialogRows:[],
            dialogForm:{
                user:'',
                bank:'',
                bankCard:'',
            },
            payType:0,
            isNull:false,
            rules:{
                paymentType:[{
                    required:true,
                    message: '请输入', trigger: 'change'
                }],
                companyId:[{
                    required:true,
                    message: '请选择', trigger: 'change'
                }],
                paymentMethod:[{
                    required:true,
                    message: '请选择', trigger: 'change'
                }],
                costMonth:[{
                    required:true,
                    message: '请选择', trigger: 'change'
                }],
                paymentMoney:[{
                    required:true,
                    message: '请选择', trigger: 'change'
                }],
            },
            searchIsShow:false,
            text:'更多',
            btnJurisdiction:{
                create:false,
                delete:false,
                submit:false,
                print:false,
            }
        }
    },
    methods: {
        btnInit(){
            this.btnJurisdiction.create=JSON.parse(this.$loca.getItem('element'))["serverSpendingApplication:btn_create"];
            this.btnJurisdiction.delete=JSON.parse(this.$loca.getItem('element'))["serverSpendingApplication:btn_delete"];
            this.btnJurisdiction.submit=JSON.parse(this.$loca.getItem('element'))["serverSpendingApplication:btn_sub"];
            this.btnJurisdiction.print=JSON.parse(this.$loca.getItem('element'))["btn:print"];
        },
        more(){
            this.searchIsShow=!this.searchIsShow;
            this.text=this.searchIsShow?"收起":"更多";
        },
        filterNumber(val){
            this.dialogFormList.paymentMoney=val.replace(/[^\d]/g,'');
        },
        reset(){
            this.formList.paymentNumber='';   //支出单号
            this.formList.companyName="";     //支付对象
            this.formList.bankCardNumber="";  //银行卡号
            this.formList.isPrinting="";
            this.formList.paymentType="";
            this.formList.page=1;
            this.pages()
        },
        closeEvent(){
            for(let i in this.dialogForm){
                this.dialogForm[i]="";
                this.formShows=false;
            }
        },
        payMethods(){
            this.formShows=false;
            for(let i in this.dialogForm){
                this.dialogForm[i]="";
            }
        },
        selectBank(){
            if(this.dialogFormList.companyId!=""&&this.dialogFormList.paymentMethod!=277&&this.dialogFormList.paymentMethod!=""){
                this.show=true;
                this.dialogTables()
            }else{
                this.$message({
                    message: '请选择合作商家并且付款方式为汇款时才可选择银行信息',
                    type: 'warning'
                });
            }
        },
        selectChanges(val){
            this.dialogRows=val;
        },
        dialogTables(){
            listCompanyBankAccountByPage(
                this.dialogQuery
            ).then(res=>{
                this.dialogTable=res.data.rows;
                this.total=res.data.total;
            })
        },
        changeCompany(val){
            this.formShows=false;
            for(let i in this.dialogForm){
                this.dialogForm[i]="";
            }
            this.dialogQuery.companyId=val;
        },
        dialogSizeChange(val){
            this.dialogQuery.page=1;
            this.formdialogQueryList.limit=val;
            this.dialogTables()
        },
        dialogCurrentChange(val){
            his.dialogQuery.page=val;
            this.dialogTables()
        },
        tabClick(val){
            this.formList.status=val.index;
            this.pages()
        },
        pages(){
            listPartnerExpenditureListVOByPage(this.formList).then(res=>{
                this.tableData=res.data.rows;
            })
        },
        createList(){
            getUUID({
                serialNumber:'PY'
            }).then(resion=>{
                this.dialogFormList.paymentNumber=resion.data;
                addPartnerExpenditureList(
                    this.dialogFormList
                ).then(res=>{
                    this.saveLoading=false;
                    this.submitLoading2=false;
                    this.dialog=false;
                    for(let i in this.dialogFormList){
                        this.dialogFormList[i]="";
                    };
                    this.dialogFormList.paymentNumber=null;
                    this.$message({
                        message: '创建成功',
                        type: 'success'
                    });
                    this.pages()
                })
            })
            
        },
        openDialog(){
            this.dialog=true;this.isEdit=false;this.flag=false;
            for(let i in this.dialogFormList){
                this.dialogFormList[i]="";
            }
        },
        editList(){
            let obj=this.dialogFormList;
            obj.partnerExpenditureListId=this.partnerExpenditureListId;
            updatePartnerExpenditureList(
                obj
            ).then(res=>{
                this.saveLoading=false;
                this.submitLoading2=false;
                this.dialog=false;
                for(let i in this.dialogFormList){
                    this.dialogFormList[i]="";
                };
                this.$message({
                    message: '编辑成功',
                    type: 'success'
                });
                this.pages()
            })
        },
        saveList(){
            this.$refs["form"].validate((valid) => {
            if (valid) {
                this.dialogFormList.status=0;
                this.saveLoading=true;
                if(this.isEdit){
                    this.editList()
                }else{
                    this.createList()
                }
            } else {
                console.log('error submit!!');
                return false;
            }
            });
            
        },
        submitList(){
            this.$refs["form"].validate((valid) => {
            if (valid) {
                this.submitLoading2=true;
                this.dialogFormList.status=1;
                if(this.isEdit){
                    this.editList()
                }else{
                    this.createList()
                }
            } else {
                console.log('error submit!!');
                return false;
            }
            });
            
        },
        printing(){
            this.dialog=false;
            for(let i in this.dialogFormList){
                this.dialogFormList[i]="";
            }
        },
        marks(data){
            this.dialog=true;
            this.isEdit=true;
            this.partnerExpenditureListId=data[0].partnerExpenditureListId;
            if(data[2]){
                this.flag=false;
            }else{
                this.flag=true;
            }
            getPartnerExpenditureListVOByPage(
                {
                    partnerExpenditureListId:data[0].partnerExpenditureListId
                }
            ).then(res=>{
                this.createAtName=res.data.createAtName;
                this.createTime=res.data.createTime;
                for(let i in this.dialogFormList){
                    this.dialogFormList[i]=res.data[i];
                }
                if(res.data.openingBank!=""){
                    this.formShows=true;
                }
                this.dialogForm.user=res.data.accountName;
                this.dialogForm.bank=res.data.openingBankName;
                this.dialogForm.bankCard=res.data.bankCardNumber;
            })
        },
        selectRows(val){
            this.rowsData=val;
        },
        publicSubOrDel(val){
            if(this.rowsData.length==0){
                this.$message({
                    message: '请选择后再进行操作',
                    type: 'warning'
                });
            }else{
                let arr=[];
                this.rowsData.map((item,idx)=>{
                    arr.push(item.partnerExpenditureListId)
                })
                if(val==0){
                    this.$confirm('是否删除?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.deleteLoading=true;
                        deletePartnerExpenditureList(
                            {
                                partnerExpenditureListIds:arr.join(",")
                            }
                        ).then(res=>{
                            this.deleteLoading=false;
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            this.rowsData=[]
                            this.pages()
                            this.isNull=true;
                        })
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });          
                    });
                }else if(val==1){
                    this.submitLoading=true;
                    commitPartnerExpenditureList(
                        {
                            partnerExpenditureListIds:arr.join(",")
                        }
                    ).then(res=>{
                        this.submitLoading=false;
                        this.$message({
                            message: '提交成功',
                            type: 'success'
                        });
                        this.rowsData=[];
                        this.pages();
                        this.isNull=true;
                    })
                }
            }
        },
        deleteRows(){
            this.publicSubOrDel(0)
        },
        submitRows(){
            this.publicSubOrDel(1)
        },
        accounts(data){
            this.dialog=true;
        },
        clickOk(){
            if(this.dialogRows.length==1){
                this.dialogForm.user=this.dialogRows[0].accountName;
                this.dialogForm.bank=this.dialogRows[0].openingBankName;
                this.dialogForm.bankCard=this.dialogRows[0].bankCardNumber;
                this.show=false;
                this.formShows=true;
                this.dialogTable=[];
                this.dialogFormList.bankAccountId=this.dialogRows[0].bankAccountId;
            }else if(this.dialogRows.length==0){
                this.$message({
                    message: '请选择后再进行操作',
                    type: 'warning'
                });
            }else{
                this.$message({
                    message: '只可选择一条',
                    type: 'warning'
                });
            }
        },
        searchTable(){
            this.pages()
        },
        close(){
            this.dialog=false;
        },
        sizeChange(val){
            this.formList.page=1;
            this.formList.limit=val;
            this.pages()
        },
        currentChange(val){
            this.formList.page=val;
            this.pages()
        },
        delectRow(val){
            this.$confirm('是否删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.partnerExpenditureListId=val.partnerExpenditureListId;
                deletePartnerExpenditureList(
                    {
                        partnerExpenditureListIds:val.partnerExpenditureListId
                    }
                ).then(res=>{
                    this.pages();
                    this.rowsData=[];
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    });
                })
            }).catch(error=>{
                this.$message({
                    message: '已取消',
                });
            })
            
        },
        submitRow(val){
            this.partnerExpenditureListId=val.partnerExpenditureListId;
            commitPartnerExpenditureList(
                {
                    partnerExpenditureListIds:val.partnerExpenditureListId
                }
            ).then(res=>{
                this.pages();
                this.rowsData=[];
            })
        },
    },
}
</script>
<style scoped>
.chose{
    position: absolute;
    right: 48px;
}
.querybox>div{
    width:calc(calc(100% - 100px) / 3)
}
.userInfo{
    width: 100%;
    height: 62px;
}
.userInfo>.el-form-item:nth-child(1){
    width: 165px;
    display: inline-block;
}
.userInfo>.el-form-item:nth-child(2){
    width: 180px;
    display: inline-block;
}
.userInfo>.el-form-item:nth-child(3){
    width: 253px;
}
.choose{
    text-align:right;
    display: inline-block;
    line-height: 38px;
}
.remark{
    width: 100%;
}
</style>

