<template>
    <div>
        <div class="head_nav">
            <breadcrumb :navList="navList"></breadcrumb>
        </div>
        <el-card>
            <div class="queryForm">
                <el-row :gutter="10">
                    <el-col :span="4">
                        <el-input size="medium" @keyup.enter.native="search" placeholder="订单号/姓名/电话" v-model="formList.orderCustomer" clearable></el-input>
                    </el-col>
                    <el-col :span="4">
                        <el-input size="medium" @keyup.enter.native="search" placeholder="收据号" v-model="formList.collectNumber" clearable></el-input>
                    </el-col>
                    <el-col :span="4">
                        <el-input size="medium" @keyup.enter.native="search" placeholder="门店名称" v-model="formList.storeName" clearable></el-input>
                    </el-col>
                    <el-col :span="4">
                        <el-date-picker
                            v-model="date"
                            type="daterange"
                            @keyup.enter.native="search"
                            range-separator="-"
                            start-placeholder="收款开始日期"
                            size="medium"
                            value-format="yyyy-MM-dd"
                            @change="resetDate1"
                            end-placeholder="收款结束日期">
                        </el-date-picker>
                    </el-col>
                    <el-col :span="4" v-if="showSearch">
                        <el-date-picker
                            v-model="date2"
                            @keyup.enter.native="search"
                            type="daterange"
                            range-separator="-"
                            start-placeholder="审核开始日期"
                            size="medium"
                            value-format="yyyy-MM-dd"
                            @change="resetDate2"
                            end-placeholder="审核结束日期">
                        </el-date-picker>
                    </el-col>
                    <el-col :span="4">
                        <el-button class="button-fc" type="warning" size="medium" @click="search">查询</el-button>
                        <el-button type="primary" size="medium" @click="reset">重置</el-button>
                    </el-col>
                </el-row>
            </div>
        </el-card>
        <div>
            <el-tabs type="border-card" @tab-click="tabClick">
                <el-tab-pane label="已结算" name="0">
                    <Tables :tableLoading="loading" :tableData="tableData" :searchIpts="formList" :paginations="paginations"></Tables>
                </el-tab-pane>
                <el-tab-pane label="未结算" name="1">
                    <Tables :tableLoading="loading" :tableData="tableData" :searchIpts="formList" :paginations="paginations"></Tables>
                </el-tab-pane>
                <div class="pagination_wrap">
                    <pagination
                        :current-page="paginations.currentPage"
                        :pageSize="paginations.pageSize"
                        :total="paginations.total"
                        @sizeChange="sizeChange"
                        @currentChange="currentChange">
                    </pagination>
                </div>
            </el-tabs>
        </div>
    </div>
</template>
<script>
import breadcrumb from "@/views/components/breadcrumb";
import pagination from '@/views/components/pagination';
import spot from '@/assets/images/spot.png';
import { billOrderCollectMoney } from '@/api/receivablesrun/clientcollection/index';
import Tables from './Table'
export default {
    components:{
        breadcrumb,
        pagination,
        Tables
    },
    // mounted() {
    //     var now = new Date(); //当前日期 
    //     var nowMonth = now.getMonth(); //当前月 
    //     var nowYear = now.getFullYear(); //当前年 
    //     var monthStartDate = new Date(nowYear, nowMonth, 1); 
    //     var monthEndDate = new Date(nowYear, nowMonth+1, 0);
    //     this.date=[
    //         monthStartDate.getFullYear() + '-' + Number(monthStartDate.getMonth()+1) + '-' +monthStartDate.getDate(),
    //         monthEndDate.getFullYear() + '-' + Number(monthEndDate.getMonth()+1) + '-' +monthEndDate.getDate()
    //     ];
    // // 头部面包屑
    //     this.pageTable();
    //     this.navList = this.$route.meta;
    //     // 代收款--获取表格数据
    //     // this.getListData();
    // },
    activated(){
        var now = new Date(); //当前日期 
        var nowMonth = now.getMonth(); //当前月 
        var nowYear = now.getFullYear(); //当前年 
        var monthStartDate = new Date(nowYear, nowMonth, 1); 
        var monthEndDate = new Date(nowYear, nowMonth+1, 0);
        this.date=[
            monthStartDate.getFullYear() + '-' + Number(monthStartDate.getMonth()+1) + '-' +monthStartDate.getDate(),
            monthEndDate.getFullYear() + '-' + Number(monthEndDate.getMonth()+1) + '-' +monthEndDate.getDate()
        ];
        this.pageTable();
        // 头部面包屑
        this.navList = this.$route.meta;
        // 代收款--获取表格数据
        // this.getListData();
    },
    // deactivated () {
    //     this.$destroy(true)
    // },
    data(){
        return{
            showSearch:false,
            text:'更多',
            paginations:{
                currentPage:1,
                pageSize:10,
                total:0,
            },
            spot:spot,
            navList: [],
            tableData: [],
            expands:[],
            childTable:[],
            status:6,
            date:["",""],
            date2:["",""],
            formList:{
                orderCustomer:'',
                collectNumber:'',
                storeName:'',
                auditStartTime:'',
                auditStartEnd:'',
                gatheringEndTime:'',
                gatheringStartTime:'',
            },
            loading:{
                tableLoading:false
            }
            
        }
    },
    methods:{
        resetDate2(val) {
            if(!val){
                this.date2 = ["", ""]
            }
        },
        resetDate1(val) {
            if(!val){
                this.date = ["", ""]
            }
        },
        more(){
            this.showSearch=!this.showSearch;
            this.text=this.showSearch?"收起":"更多";
        },
        reset(){
            var now = new Date(); //当前日期 
            var nowMonth = now.getMonth(); //当前月 
            var nowYear = now.getFullYear(); //当前年 
            var monthStartDate = new Date(nowYear, nowMonth, 1); 
            var monthEndDate = new Date(nowYear, nowMonth+1, 0);
            this.date=[
            monthStartDate.getFullYear() + '-' + Number(monthStartDate.getMonth()+1) + '-' +monthStartDate.getDate(),
            monthEndDate.getFullYear() + '-' + Number(monthEndDate.getMonth()+1) + '-' +monthEndDate.getDate()
            ];
            this.paginations.currentPage=1;
            for(let i in this.formList){
                this.formList[i]="";
            }
            this.pageTable()
        },
        search(){
            this.paginations.currentPage=1;
            this.pageTable()
        },
        pageTable(){
            this.loading.tableLoading=true;
            billOrderCollectMoney(
                {   
                    orderCustomer:this.formList.orderCustomer,
                    collectNumber:this.formList.collectNumber,
                    storeName:this.formList.storeName,
                    collectMoneyName:this.formList.collectMoneyName,
                    gatheringStartTime:this.date[0],
                    gatheringEndTime:this.date[1],
                    auditStartTime:this.date2[0],
                    auditEndTime:this.date2[1],
                    status:this.status,
                    page:this.paginations.currentPage,
                    limit:this.paginations.pageSize
                }
            ).then(res=>{
                this.tableData=res.data.rows;
                this.paginations.total=res.data.total;
                this.loading.tableLoading=false;
            })
        },
        jumpList(){
            this.$router.push({
                path:'creditCheck'
            })
        },
        cellStyle({row, column, rowIndex, columnIndex}){
            // console.log(column,columnIndex)
            if(columnIndex === 0){ // 指定坐标-- 第一列
                return 'borderRight:none'
            }else{
                return ''
            }
        },
        tableRowClassName({row, rowIndex}) {//表格斑马线设置
            return rowIndex % 2 != 0 ? 'el-f0' : '';
        },
        currentChange(val) {
            this.paginations.currentPage = val;
            this.pageTable();
        },
        sizeChange(val) {
            this.paginations.currentPage = 1;
            this.paginations.pageSize = val;
            this.pageTable();
        },
        tabClick(val){
            if(val.index==0){
                this.status=6;
            }else if(val.index==1){
                this.status=4;
            }
            this.pageTable()
            
        },
        rowClick(row){
            if (this.expands.indexOf(row.id) < 0) {
                    this.expands = [];
                    this.expands.push(row.id);
                } else {
                    let arr = this.expands.indexOf(row.id);
                    this.expands.splice(arr,1);
                }
        }
    }
}
</script>
<style scoped>
    .searchIpts{
        width: 100%;
        display: flex;
        justify-content: space-between;
    }
    .orderinp{
        width:calc(100% - 70px / 7);
        padding-right:20px;
    }
</style>