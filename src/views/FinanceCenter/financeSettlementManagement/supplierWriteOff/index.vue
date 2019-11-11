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
                <el-tab-pane label="待销账" name="0">
                    <waitWriteOff :tableData="tableData" @searchPages="searchPages"></waitWriteOff>
                </el-tab-pane>
                <el-tab-pane label="已销账" name="1">
                    <aleradyWriteOff :tableData="tableData"></aleradyWriteOff>
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
    </div>
</template>
<script>
import breadcrumb from "@/views/components/breadcrumb";
import pagination from "@/views/components/pagination";
import spot from '@/assets/images/spot.png';
import waitWriteOff from './waitWrite-off';
import aleradyWriteOff from './aleradyWrite-off';
import { listPurchasingSettlementByPage } from "@/api/FinanceCenter/statementReview/index";
export default {
    components:{
        breadcrumb,
        pagination,
        waitWriteOff,
        aleradyWriteOff
    },
    activated(){
        this.navList = this.$route.meta;
        this.pages();
    },
    // deactivated () {
    //     this.$destroy(true)
    // },
    // mounted() {
    //     this.navList = this.$route.meta;
    //     this.pages();
    // },
    data(){
        return{
            span:6,
            navList:[],
            formList:{
                names:'',
                startTime:"",
                endTime:'',
                startMonth:'',
                endMonth:'',
                page:1,
                limit:10,
                dataType:1,
            },
            tableData:[],
            total:10,
            date1:[],
            date2:'',
        }
    },
    methods: {
        reset(){
            this.formList.names='';
            this.formList.startTime="";
            this.formList.endTime='';
            this.formList.startMonth='';
            this.formList.endMonth='';
            this.formList.page=1;
            this.pages()
        },
        search(){
            this.formList.page=1;
            this.pages();
        },
        searchPages(){
            this.pages()
        },
        pages(){
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
            if(val.index==0){
                this.formList.dataType=1;
            }else if(val.index==1){
                this.formList.dataType=2;
            }
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
<style scoped>

</style>
