<template>
    <div>
        <div class="head_nav">
            <breadcrumb :navList="navList"></breadcrumb>
        </div>
        <el-card>
            <el-row :gutter="10">
                <el-col :span="6"><el-input @keydown.enter.native="search" clearable placeholder="导入人" v-model="formList.names" size="medium"></el-input></el-col>
                <el-col :span="6">
                    <el-date-picker
                        v-model="date"
                        clearable
                        type="daterange"
                        value-format="yyyy-MM-dd"
                        range-separator="-"
                        start-placeholder="开始日期"
                        size="medium"
                        style="width:100%"
                        @keydown.enter.native="search"
                        end-placeholder="结束日期">
                    </el-date-picker>
                </el-col>
                <el-col :span="6" style="display:flex">
                    <div v-loading="searchLoading">
                        <el-button  type="warning" size="medium" class="button-fc" @click="search">查询</el-button>
                    </div>
                    <div v-loading="resetLoading" style="margin-left:10px">
                        <el-button  type="primary" size="medium" @click="reset">重置</el-button>
                    </div>
                </el-col>
            </el-row>
        </el-card>
        <el-card>
            <el-button class="button-96" size="small" v-if="btnJurisdiction.import" @click="toLead">导入对账单</el-button>
            <el-button class="button-96" size="small" @click="downLoad">下载模板</el-button>
            <el-button class="button-96" size="small" @click="createPurchaseOrderBatch">手动添加采购单批次</el-button>
            <el-table v-loading="tabLoading" class="m-top20" border :data="tableData" :row-class-name="tableRowClassName">
                <el-table-column show-overflow-tooltip align="center" prop="status" label="状态">
                    <template slot-scope="scope">
                        <div>
                            <span v-if="scope.row.status==0">对账中</span>
                            <span v-if="scope.row.status==1">对账完成</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip align="center" prop="status" label="数据类型">
                    <template slot-scope="scope">
                        <div>
                            <span v-if="scope.row.dataType==0">手动添加</span>
                            <span v-if="scope.row.dataType==1">导入</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column width="250" align="center" prop="batchNumber" show-overflow-tooltip label="批次号">
                    <template slot-scope="scope">
                        <div>
                            <span class="table_action_span" @click="goToImport(scope.row)" v-if="scope.row.status==0">{{scope.row.batchNumber}}</span>
                            <span v-else>{{scope.row.batchNumber}}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="importSize" show-overflow-tooltip label="导入数量"></el-table-column>
                <el-table-column align="center" prop="createAt" show-overflow-tooltip label="导入人"></el-table-column>
                <el-table-column width="230" align="center" prop="createTime" show-overflow-tooltip label="导入时间"></el-table-column>
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
        <!-- <el-dialog title="创建采购单批次" width="500px" custom-class="customDialogTitle" :visible.sync="orderBatch">
            <div>
                <el-input maxlength="20" placeholder="请输入批次号" size="medium" v-model="batchNumber"></el-input>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="createComfirm">确 定</el-button>
                <el-button @click="orderBatch = false">取 消</el-button>
            </span>
        </el-dialog> -->
    </div>
</template>
<script>
import spot from '@/assets/images/spot.png';
import breadcrumb from "@/views/components/breadcrumb";
import pagination from '@/views/components/pagination';
import { listPurchaseOrderBatch, addPurchasingBatch } from '@/api/administrationCenter/purchaseOrderAccountCheck/index';
import { getUUID } from "@/api/pulicJava"
export default {
    components:{
        breadcrumb,
        pagination
    },
    data(){
        return{
            spot,
            navList:[],
            btnJurisdiction:{
                import:false,
                create:false,
                view:false,
            },
            formList:{
                page:1,
                limit:10,
                names:'',
                startTime:"",
                endTime:'',
            },
            total:0,
            tableData:[],
            date:[],
            orderBatch:false,
            batchNumber:'',
            tabLoading:false,
            searchLoading:false,
            resetLoading:false
        }
    },
    mounted() {
        this.navList = this.$route.meta;
        this.init()
    },
    methods: {
        downLoad(){
            window.location.href="https://fanhuayiju.oss-cn-beijing.aliyuncs.com/%E9%87%87%E8%B4%AD%E5%8D%95%E5%AF%B9%E8%B4%A6%E5%AF%BC%E5%85%A5.xlsx"
        },
        reset(){
            this.formList.page=1;
            this.formList.names='';
            this.formList.startTime="";
            this.formList.endTime='';
            this.date=[];
            this.resetLoading=true;
            this.pages()
        },
        search(){
            this.formList.page=1;
            this.searchLoading=true;
            this.pages()
        },
        init(){
            this.btnInit()
            this.pages()
        },
        goToImport(val){
            if(val.dataType==0){
                this.$router.push({
                    path:"/contractmanagement/addPurchaseOrder",
                    query:{
                        purchaseId:val.purchaseOrderBatchId
                    }
                })
            }else if(val.dataType==1){
                this.$router.push({
                    path:"/contractmanagement/importStatement",
                    query:{
                        purchaseOrderBatchId:val.purchaseOrderBatchId
                    }
                })
            }
            
        },
        pages(){
            if(this.date==null){
                this.formList.startTime=null;
                this.formList.endTime=null;
            }else{
                if(this.date.length){
                    this.formList.startTime=this.date[0];
                    this.formList.endTime=this.date[1];
                }else{
                    this.formList.startTime=null;
                    this.formList.endTime=null;
                }
            }
            this.tabLoading=true;
            listPurchaseOrderBatch(this.formList).then(res=>{
                this.tableData=res.data.rows;
                this.total=res.data.total;
                this.tabLoading=false;
                this.searchLoading=false;
                this.resetLoading=false;
            })
        },
        btnInit(){
            this.btnJurisdiction.import=JSON.parse(this.$loca.getItem('element'))["purchaseOrderAccountCheck:btn_import"];
            this.btnJurisdiction.create=JSON.parse(this.$loca.getItem('element'))["purchaseOrderAccountCheck:btn_create"];
            this.btnJurisdiction.view=JSON.parse(this.$loca.getItem('element'))["purchaseOrderAccountCheck:btn_view"];
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
        toLead(){
            this.$router.push({
                path:'importStatement'
            })
        },
        createPurchaseOrderBatch(){
            getUUID({
                serialNumber: 'R'
            }).then(response=>{
                addPurchasingBatch({
                    batchNumber:response.data
                }).then(res=>{
                    this.$message({
                        message: '创建成功',
                        type: 'success'
                    });
                    this.$router.push({
                        path:"addPurchaseOrder",
                        query:{
                            purchaseId:res.data
                        }
                    })
                })
            })
        },
        tableRowClassName({ row, rowIndex }) {
            return rowIndex % 2 != 0 ? 'el-f0' : '';
        },
    },
}
</script>
<style lang="scss" scoped>
    
</style>