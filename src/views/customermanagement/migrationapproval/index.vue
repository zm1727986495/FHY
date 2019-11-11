<template>
    <div class="approval">
        <div class="approval_c">
            <div class="crumbs">
                <span>当前位置：</span>
                <el-breadcrumb separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item>销售中心</el-breadcrumb-item>
                    <el-breadcrumb-item>客户管理</el-breadcrumb-item>
                    <el-breadcrumb-item>移交审批</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
            <div class="search">
                <div class="query_c">
                    <el-form ref="form" :model="form"  size="mini">
                        <el-form-item label="客户名称/客户电话/原导购/接收人/提交人：">
                            <el-input v-model="form.name"></el-input>
                        </el-form-item>
                    </el-form> 
                </div>
                <div class="button">
                    <el-button type="primary">查询</el-button>
                </div>
            </div>
            <div class="approval_tab">
                <el-tabs v-model="activeName" type="card">
                        <el-tab-pane label="待审批" name="first">
                            <div class="table">  
                                <div class="operation">
                                    <el-button type="primary"  @click="handleClicKadopt">审核通过</el-button>   
                                    <el-button type="primary"  @click="handleClickReturn">审核退回</el-button>                      
                                </div>             
                                <el-table   border  ref="multipleTable"   :data="tableFirst" tooltip-effect="dark"  
                                            style="width: 100%"  @selection-change="handleSelectionChange"
                                            :cell-style="cellStyle"  :header-cell-style="tableHeaderColor"   key ='tableData'
                                            >
                                    <el-table-column type="selection" ></el-table-column>
                                    <el-table-column label="操作" >
                                        <template slot-scope="scope">
                                            <span @click="handleClicKadopt(scope.row)">通过</span>
                                            <span @click="handleClickReturn(scope.row)">退回</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="name" label="客户姓名"></el-table-column>
                                    <el-table-column prop="tel" label="客户电话"  show-overflow-tooltip></el-table-column>
                                    <el-table-column prop="guide" label="原导购"   show-overflow-tooltip></el-table-column>
                                    <el-table-column prop="receiver" label="接收人"  show-overflow-tooltip></el-table-column>
                                    <el-table-column prop="order" label="移交订单"   show-overflow-tooltip></el-table-column>
                                    <el-table-column prop="time" label="移交开始时间"   show-overflow-tooltip></el-table-column>
                                </el-table>
                                <div class="pagination_wrap">
                                    <el-pagination  background  @current-change="handleCurrentChange" :current-page.sync="currentPage"  :page-sizes="[10,20,30,40]" :page-size="10" prev-text="上一页" next-text="下一页"
                                        layout="total,prev, pager, next ,sizes,  jumper" :total="total" :page-count="totalPage">
                                    </el-pagination>
                                </div>                  
                            </div>
                        </el-tab-pane>
                        <el-tab-pane label="已审批" name="second">
                            <div class="recommend_m">
                                 <el-table border  :data="tableSecond"  style="width: 100%"  key ='tableDataRM'  :header-cell-style="tableHeaderColor" >
                                    <el-table-column prop="name" label="客户姓名"></el-table-column>
                                    <el-table-column prop="tel" label="客户电话"></el-table-column>
                                    <el-table-column prop="guide" label="原导购" ></el-table-column>
                                    <el-table-column prop="receiver" label="接收人"></el-table-column>
                                    <el-table-column prop="order" label="移交订单" ></el-table-column>
                                    <el-table-column prop="time" label="移交开始时间"></el-table-column>  
                                    <el-table-column prop="people" label="提交人"></el-table-column>                        
                                </el-table>
                                <div class="pagination_wrap">
                                    <el-pagination  background  @current-change="handleCurrentChange" :current-page.sync="currentPage"  :page-sizes="[10,20,30,40]" :page-size="10" prev-text="上一页" next-text="下一页"
                                        layout="total,prev, pager, next ,sizes,  jumper" :total="total" :page-count="totalPage">
                                    </el-pagination>
                                </div> 
                            </div>
                        </el-tab-pane>
                </el-tabs>
            </div>
             <!-- 弹出框 -->
            <div class="dialog_con_box">
                <el-dialog
                    :title="Dialogtitle"
                    :visible.sync="centerDialogVisible"
                    width="40%"
                    >                  
                    <el-input
                        type="textarea"
                        v-model="brandInfo"
                        maxlength="50">
                    </el-input>                                         
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="centerDialogVisible = false">取 消</el-button>
                        <el-button type="primary" @click="centerDialogVisible = false">提交</el-button>
                    </span>
                </el-dialog>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return{
            form:{
                name:''
            },
            activeName:'first',
            tableFirst:[
                {'name':'','tel':'','guide':'','receiver':'','order':'','time':''}
            ],
            tableSecond:[
                {'name':'张三','tel':'','guide':'','receiver':'','order':'','time':'','people':''}
            ],
             //分页当前页
            currentPage: 1,
            //总页数
            total: 100,
             //
            totalPage: 10,


            //弹框页面数据
            brandInfo:'',
            Dialogtitle:'',
            centerDialogVisible:false,


        }
    },
    methods:{
         // 改变table头部颜色
        tableHeaderColor({ row, column, rowIndex, columnIndex }) {
            if (rowIndex == 0) {
                return "background: #f8f8f8;border-color: #f6f6f6"
            }
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        handleSelectionChangeR(val){
            console.log(val)
            this.receiveTable = val;
        },
        // 通过
        handleClicKadopt(row){
            console.log(row)
        },
        // 退回
        handleClickReturn(row){
            this.Dialogtitle="请录入退回原因";
            this.centerDialogVisible=true;
        },
        cellStyle({row,column,rowIndex,columnIndex}){
            return "text-align:center";
        },
        rowClass({row,rowIndex}){
            return "text-align:center";
        },
        //分页插件
        handleCurrentChange(page) {
            console.log(page);
            this.currentPage = page;
          
        },

        
       
    }
}
</script>
<style scoped>

.approval{
    height:100%;
    background:#fff;
    overflow: hidden;
}
.approval_c{
    margin:30px 60px 0;
}

.crumbs {
  overflow: hidden;
}
.crumbs > span {
  color: #ddd;
  font-size: 15px;
  float: left;
}
.el-input{
    width:200px;
}
.search{
    border:1px solid #e6e6e6;
    margin:20px 0 44px 0;
    position:relative;
}
.query_c{
    margin-top:18px;
    padding-left: 20px;
}
.el-form-item{
    width:36%;
}
.el-form-item__label{
    color:#999;
    font-size:16px;
    font-weight:normal;
}
.button{
    position:absolute;
    right: 30px;
    top: 12px;
}
.table,.recommend_m{
    margin-top:20px;
}
.operation{
    margin-bottom:30px;
}
.cell>span{
    color:#409EFF;
}
.cell>span:nth-child(1){
    margin-right:20px;
}
</style>
