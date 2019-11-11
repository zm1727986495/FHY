<template>
  <div class="wrapper">
    <div class="apper">

      <!-- 导航栏 -->
      <div class="head_nav">
        <breadcrumb :navList="navList"></breadcrumb>
      </div>

      <!-- 按钮组 -->
      <el-card>
      

        <!-- table表格 -->
        <div class="table_list lvs attribute">

          <el-table
            border
            :row-class-name="tableRowClassName"
            :row-style="tableBodycolor"
            @selection-change="handleSelectionChange"
            :data="tabList"
            style="width: 100%;">
            <el-table-column type="selection" width="40"></el-table-column>

            <el-table-column
              prop="name"
              label="处罚单号"
              width="240" sortable align="center">
            </el-table-column>

            <el-table-column
              prop="name"
              label="处罚金额"
              width="240" sortable align="center">
            </el-table-column>

            <el-table-column
              prop="name"
              label="处罚类型"
              width="240" sortable align="center">
            </el-table-column>

            <el-table-column
              prop="name"
              label="来源"
              width="240" sortable align="center">
            </el-table-column>

            <el-table-column
              prop="name"
              label="来源单号"
              width="240" sortable align="center">
            </el-table-column>

            <el-table-column
              prop="name"
              label="责任部门"
              width="240" sortable align="center">
            </el-table-column>

            <el-table-column
              prop="name"
              label="责任人"
              width="240" sortable align="center">
            </el-table-column>

            <el-table-column
              prop="name"
              label="发起人"
              width="240" sortable align="center">
            </el-table-column>

            <el-table-column
              prop="name"
              label="发起时间"
              width="240" sortable align="center">
            </el-table-column>

          </el-table>    

        </div>



        <!-- 分页 -->
        <div class="pagination_wrap">
          <pagination
            :current-page="currentPage"
            :pageSize="pageSize"
            :total="total"
            @sizeChange="sizeChange"
            @currentChange="currentChange">
          </pagination>
        </div>

      </el-card>
      
       
      <!-- </el-card> -->
    </div>
  </div>
</template>
<script>

import pagination from "@/views/components/pagination";
import breadcrumb from "@/views/components/breadcrumb";

import spot from '@/assets/images/spot.png';

export default {
    components: {
      breadcrumb,
      pagination,
    
      
  },
  // name: 'brandmanagement',
  data() {
    return {
      currentPage: 1,//当前页数
      pageSize: 20,//总页数
      total: 100,//总条数
      spot,//操作图片
      navList: [],//头部面包屑

      elsectVal:[],//选中框
      tabList:[],//table数据
      


      
    };
  },
  
  mounted() {
    // 头部面包屑
    this.navList = this.$route.meta;
  },
  methods: {
    //查询按钮获取
    getListFun(form){
      console.log(form);
      

    },

    

    // 改变页目条数方法
    sizeChange(val) {
        this.currentPage = 1;
        this.pageSize = val;
        this.getListData();
    },

    // 翻页方法
    currentChange(val) {
        this.currentPage = val;
        this.getListData();
    },

    //勾选函数回调
    handleSelectionChange(val) {
      this.elsectVal = val;
      console.log(this.elsectVal)
    },
    
    // 改变tablebody颜色
    tableBodycolor({ row, rowIndex }) {
      return "height: 80px";
    },

    //表格斑马线设置
    tableRowClassName({row, rowIndex}) {
        return rowIndex%2 != 0 ? 'el-f0' : '';
    },
    
    
  }
};
</script>
<style scoped lang='scss'>
.btn_list_1{
  height: 55px;
  float: left;
}

.pagination_wrap {
  text-align: center;
  height: 50px;
  /* line-height: 50px; */
  display: flex;
  align-items: center;
  justify-content: center;
}


</style>

