<template>
    <div class="transfer">
        <div class="transfer_c">
            <div class="crumbs">
                <span>当前位置：</span>
                <el-breadcrumb separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item>销售中心</el-breadcrumb-item>
                    <el-breadcrumb-item>客户管理</el-breadcrumb-item>
                    <el-breadcrumb-item>移交审批</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
            <div class="search">
                <div class="query">
                    <input type="text" placeholder="客户名称/客户电话/订单号/产品品牌/订单状态/订单类型">
                    <el-button type="primary">查询</el-button>
                </div>
            </div>
            <div class="transfer_tab">
                <div class="table_btn">
                    <el-button type="primary" @click="pendingApproval">待审批</el-button>
                    <el-button type="primary" @click="approved">已审批</el-button>
                </div>
                <div class="table">
                    <!-- 待 -->
                    <div class="table" v-if="table1">  
                        <div class="operation">
                            <el-button type="primary" v-for="(item,index) in btn" :key="index" @click="handleClickBtn(index)">{{item}}</el-button>                
                        </div>             
                        <el-table   border  ref="multipleTable"   :data="tableData" tooltip-effect="dark"  
                                    style="width: 100%"  @selection-change="handleSelectionChange"
                                    :cell-style="cellStyle"  :header-cell-style="rowClass" 
                                    >
                            <el-table-column type="selection" ></el-table-column>
                            <el-table-column prop="id" label="操作" >
                                <template slot-scope="scope">
                                    <span v-for="(item,index) in operate" :key="index" class="operate" @click="handleOperation(index)">{{item}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="name" label="客户姓名" ></el-table-column>
                            <el-table-column prop="tel" label="客户电话"  show-overflow-tooltip></el-table-column>
                            <el-table-column prop="guide" label="原导购"   show-overflow-tooltip></el-table-column>
                            <el-table-column prop="receiver" label="接收人"  show-overflow-tooltip></el-table-column>
                            <el-table-column prop="number" label="移交订单数"   show-overflow-tooltip></el-table-column>
                            <el-table-column prop="time" label="移交开始时间"   show-overflow-tooltip></el-table-column>
                        </el-table>
                        <div class="pagination_wrap">
                            <el-pagination  background  @current-change="handleCurrentChange" :current-page.sync="currentPage"  :page-sizes="[10,20,30,40]" :page-size="10" prev-text="上一页" next-text="下一页"
                                layout="total,prev, pager, next ,sizes,  jumper" :total="total" :page-count="totalPage">
                            </el-pagination>
                        </div>                  
                    </div>
                    <div class="table2" v-if="table2">           
                        <el-table   border  ref="multipleTable"   :data="tableData1" tooltip-effect="dark"  
                                    style="width: 100%"  @selection-change="handleSelectionChange"
                                    :cell-style="cellStyle"  :header-cell-style="rowClass" 
                                    >
                            <el-table-column type="selection" ></el-table-column>
                            <el-table-column label="操作" >
                                <template slot-scope="scope">
                                    <span v-for="(item,index) in operate" :key="index" class="operate">{{item}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="name" label="客户姓名" ></el-table-column>
                            <el-table-column prop="tel" label="客户电话"  show-overflow-tooltip></el-table-column>
                            <el-table-column prop="guide" label="原导购"   show-overflow-tooltip></el-table-column>
                            <el-table-column prop="receiver" label="接收人"  show-overflow-tooltip></el-table-column>
                            <el-table-column prop="number" label="移交订单数"   show-overflow-tooltip></el-table-column>
                            <el-table-column prop="time" label="移交开始时间"   show-overflow-tooltip></el-table-column>
                        </el-table>
                        <div class="pagination_wrap">
                            <el-pagination  background  @current-change="handleCurrentChange" :current-page.sync="currentPage"  :page-sizes="[10,20,30,40]" :page-size="10" prev-text="上一页" next-text="下一页"
                                layout="total,prev, pager, next ,sizes,  jumper" :total="total" :page-count="totalPage">
                            </el-pagination>
                        </div> 
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return{
            table1:true,
            table2:false,
            btn: ["审核通过", "审核退回"],
            operate:["通过","退回"],
            tableData:[
                {"name":"张三","tel":"","guide":"","receiver":"","number":"","time":""}
            ],
            tableData1:[
                {"name":"张三","tel":"","guide":"李四","receiver":"","number":"","time":""}
            ],
              //分页当前页
            currentPage: 1,
            //总页数
            total: 100,
             //
            totalPage: 10,

        }
    },
    methods:{
        cellStyle({row,column,rowIndex,columnIndex}){
            return "text-align:center";
        },
        rowClass({row,rowIndex}){
            return "text-align:center";
        },
        // 待审批
        pendingApproval(){
            console.log(111)
            this.table1 = true;
            this.table2 = false;
        },
        // 已审批
        approved(){
            console.log(222)

            this.table1 = false;
            this.table2 = true
           
        },
         // 审核通过0  审核退回1
        handleClickBtn(index){
            console.log(index)
            switch(index){
                case 0:
                    alert();
                    break;
                case 1:
                    alert();
                    break;
            }
        },
         //分页插件
        handleCurrentChange(page) {
            console.log(page);
            this.currentPage = page;
          
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        // 操作
        handleOperation(index){
            console.log(index)
        }
    }
}
</script>
<style scoped>

.transfer{
    height:100%;
    background:#fff;
    overflow: hidden;
}
.transfer_c{
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
.search{
    border:1px solid #333;
    /* height:60px; */
    padding:20px;
    margin-bottom:20px;
}
.query>input{
    width:25%;
    height:36px;
    font-size:12px;
}
.operation{
    margin: 20px 0;
}

.pagination_wrap {
    margin-top: 30px;
    text-align: center;
    padding-bottom: 30px;
}

    /* 分页 */
    .btn-prev {
        width: 67px;
        background: #f4f4f4;
        padding-right: 0;

    }

    .el-pagination button:disabled {
        background: #f4f4f4 !important;
    }

    .el-pagination .btn-prev {
        width: 67px;
        background: #f4f4f4 !important;
    }

    .el-pager li {
        border: 1px solid #dddddd;
        margin: 0 5px;
        width:40px;
        height:30px;
    }

    .el-pager li.active+li {
        border-left: 1px solid #dddddd;
    }

    .el-pagination .btn-next {
        padding-left: 0;
    }

    .el-pager li.active {
        border-color: #169BD5;
        color: #ffffff;
        background: #169BD5;
    }

    .btn-next {
        width: 67px;
        background: #f4f4f4 !important;
        padding-left: 0;
    }

    .el-pagination.is-background .el-pager li:not(.disabled).active {
        background: #169BD5;
    }

    .el-pagination.is-background .btn-next,
    .el-pagination.is-background .btn-prev,
    .el-pagination.is-background .el-pager li {
        border-radius: 3px;
    }

    .el-pagination__editor.el-input .el-input__inner {
        width: 100%;
    }

</style>
