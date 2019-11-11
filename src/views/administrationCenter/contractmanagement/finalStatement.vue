<template>
    <div>
        <div class="head_nav">
            <breadcrumb :navList="navList"></breadcrumb>
        </div>
        <el-card class="queryForm">
            <el-row :gutter="10">
                <el-col :span="6">
                    <el-input placeholder="供货商/提交人/结算单号" v-model="formList.names" clearable></el-input>
                </el-col>
                <el-col :span="6">
                    <el-date-picker
                        v-model="date"
                        type="daterange"
                        range-separator="-"
                        value-format="yyyy-MM-dd"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                    </el-date-picker>
                </el-col>
                <el-col :span="6">
                    <el-date-picker
                        v-model="Month"
                        type="monthrange"
                        value-format="yyyy-MM"
                        range-separator="-"
                        start-placeholder="开始月份"
                        end-placeholder="结束月份">
                    </el-date-picker>
                </el-col>
                <el-col :span="6">
                    <el-select v-model="formList.status">
                        <el-option v-for="(item,idx) in status" :key="idx" :label="item.text" :value="item.value"></el-option>
                    </el-select>
                </el-col>
                <el-col :span="24" style="display:flex;justify-content:center;align-items:center">
                    <el-button type="warning" size="medium" class="button-fc" @click="search">查询</el-button>
                </el-col>
            </el-row>
        </el-card>
        <el-card class="m-top20">
            <el-button class="button-96" size="small" v-if="btnJurisdiction.submit" @click="submits">提交财务</el-button>
            <el-table border :data="tableData" :row-class-name="tableRowClassName" @selection-change="selectChange" class="m-top20">
                <el-table-column type="selection"></el-table-column>
                <el-table-column align="center" width="180" label="状态" prop="status">
                    <template slot-scope="scope">
                        <el-tooltip placement="right" visible-arrow>
                            <div slot="content" class="tips tipFon">
                                <p class="operaItems" v-if="btnJurisdiction.delete" @click="deleteRows(scope.row)">删除</p>
                                <p class="operaItems" v-if="btnJurisdiction.edit" @click="editRows(scope.row)">编辑</p>
                                <p class="operaItems" v-if="btnJurisdiction.submit" @click="submit(scope.row)">提交</p>
                            </div>
                            <img :src="spot" alt="" class="attributesTips">
                        </el-tooltip>
                        <span v-if="scope.row.status==0">待提交</span>
                        <span v-if="scope.row.status==1">提交</span>
                        <span v-if="scope.row.status==2">已退回</span>
                        <span v-if="scope.row.status==3">已审核</span>
                        <span v-if="scope.row.status==4">已销账</span>
                    </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip align="center" width="180" label="结算单号" prop="purchasingSettlementNumber"></el-table-column>
                <el-table-column show-overflow-tooltip align="center" width="180" label="费用月份" prop="feeMonth"></el-table-column>
                <el-table-column show-overflow-tooltip align="center" width="180" label="供货商" prop="companyName"></el-table-column>
                <el-table-column show-overflow-tooltip align="center" width="180" label="结算采购单数" prop="dataSize"></el-table-column>
                <el-table-column show-overflow-tooltip align="center" width="180" label="结算金额合计" prop="settlementAmount"></el-table-column>
                <el-table-column show-overflow-tooltip align="center" width="180" label="结算加减收合计" prop="asAmount"></el-table-column>
                <el-table-column show-overflow-tooltip align="center" width="180" label="创建人" prop="createAt"></el-table-column>
                <el-table-column show-overflow-tooltip align="center" width="180" label="创建时间" prop="createTime"></el-table-column>
                <el-table-column show-overflow-tooltip align="center" width="180" label="提交人" prop="updateAt"></el-table-column>
                <el-table-column show-overflow-tooltip align="center" width="180" label="提交时间" prop="updateTime"></el-table-column>
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
    </div>
</template>
<script>
import spot from '@/assets/images/spot.png';
import breadcrumb from "@/views/components/breadcrumb";
import pagination from '@/views/components/pagination';
import { listPurchasingSettlement, deletePurchasingSettlement, commitPurchasingSettlement } from '@/api/administrationCenter/finalStatement/index'
export default {
    components:{
        breadcrumb,
        pagination
    },
    data(){
        return{
            spot,
            navList:[],
            date:[],
            Month:[],
            formList:{
                names:'',
                startTime:'',
                endTime:'',
                startMonth:'',
                endMonth:'',
                status:'',
                page:1,
                limit:10
            },
            status:[
                {
                    text:'待提交',
                    value:0
                },
                {
                    text:'已提交',
                    value:0
                },
                {
                    text:'已审核',
                    value:3
                },
                {
                    text:'已销账',
                    value:4
                },
                {
                    text:'已退回',
                    value:2
                }
            ],
            tableData:[],
            total:10,
            rowsData:[],
            btnJurisdiction:{
                submit:false,
                delete:false,
                edit:false
            }
        }
    },
    // mounted() {
    //     this.btnInit()
    //     this.navList = this.$route.meta;
    //     this.pages()
    // },
    activated(){
        this.btnInit()
        this.navList = this.$route.meta;
        this.pages()
    },
    // deactivated () {
    //     this.$destroy(true)
    // },
    methods: {
        btnInit(){
            this.btnJurisdiction.submit=JSON.parse(this.$loca.getItem('element'))["finalStatement:btn_sub"];
            this.btnJurisdiction.delete=JSON.parse(this.$loca.getItem('element'))["finalStatement:btn_delete"];
            this.btnJurisdiction.edit=JSON.parse(this.$loca.getItem('element'))["finalStatement:btn_edit"];
        },
        selectChange(val){
            this.rowsData=val;
        },
        submits(){
            if(this.rowsData.length){
                let arr=[]
                this.rowsData.map((item,idx)=>{
                    arr.push(item.purchasingSettlementId)
                })
                commitPurchasingSettlement({
                    purchasingSettlementIds:arr
                }).then(res=>{
                    this.$message({
                        message: '提交成功',
                        type: 'success'
                    });
                    this.pages()
                })
            }else{
                this.$message({
                    message: '请选择后在进行提交',
                    type: 'warning'
                });
            }
        },
        submit(val){
            commitPurchasingSettlement({
                purchasingSettlementIds:[val.purchasingSettlementId]
            }).then(res=>{
                this.$message({
                    message: '提交成功',
                    type: 'success'
                });
                this.pages()
            })
        },
        editRows(val){
            this.$router.push({
                path:'supplierStatement',
                query:{
                    purchasingSettlementId:val.purchasingSettlementId
                }
            })
        },
        deleteRows(val){
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                deletePurchasingSettlement({
                    purchasingSettlementId:val.purchasingSettlementId
                }).then(res=>{
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    });
                    this.pages()
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        },
        tableRowClassName({ row, rowIndex }) {
            return rowIndex % 2 != 0 ? 'el-f0' : '';
        },
        pages(){
            this.formList.startTime=this.date[0];
            this.formList.endTime=this.date[1];
            this.formList.startMonth=this.Month[0];
            this.formList.endMonth=this.Month[1];
            listPurchasingSettlement(this.formList).then(res=>{
                this.tableData=res.data.rows;
                this.total=res.data.total;
            })
        },
        search(){
            this.formList.page=1;
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
