<template>
  <div class="recommenman">
    <!-- 导航栏 -->
    <div class="head_nav">
      <breadcrumb :navList="navList"></breadcrumb>
    </div>

    <el-card>
      <!-- 查询条件组 -->
      <searchinfo @get_List="getListFun"></searchinfo>

      <div class="h-width"></div>

      <div class="btn_list_1">
        <el-button size="small" class="button-96" @click="addpoint">新增</el-button>
        <el-button size="small" class="button-96" @click="editpoint">修改</el-button>
        <el-button size="small" class="button-96">作废</el-button>
        <el-button size="small" class="button-96">提交</el-button>
        <el-button size="small" class="button-96">附件管理</el-button>
        <el-button size="small" class="button-96">审核记录</el-button>
        <!-- @click="examinelog" -->
        <el-button size="small" class="button-96">导出</el-button>
      </div>

      <!-- table表格 -->
      <div class="table_list lvs attribute m-top20">
        <el-table
          border
          :row-class-name="tableRowClassName"
          :row-style="tableBodycolor"
          @selection-change="handleSelectionChange"
          :data="tabList"
          style="width: 100%;"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="name" label="审核状态" width="240" sortable align="center"></el-table-column>

          <el-table-column prop="name" label="申请单号" width="240" sortable align="center"></el-table-column>

          <el-table-column prop="name" label="返点金额/元" width="240" sortable align="center"></el-table-column>

          <el-table-column prop="name" label="订单编号" width="240" sortable align="center"></el-table-column>

          <el-table-column prop="name" label="返点类型" width="240" sortable align="center"></el-table-column>

          <el-table-column prop="name" label="推荐人姓名" width="240" sortable align="center"></el-table-column>

          <el-table-column prop="name" label="电话" width="240" sortable align="center"></el-table-column>

          <el-table-column prop="name" label="所属公司" width="240" sortable align="center"></el-table-column>

          <el-table-column prop="name" label="职位" width="240" sortable align="center"></el-table-column>

          <el-table-column prop="name" label="级别" width="240" sortable align="center"></el-table-column>

          <el-table-column prop="name" label="申请人" width="240" sortable align="center"></el-table-column>

          <el-table-column prop="name" label="订单货品类型" width="240" sortable align="center"></el-table-column>

          <el-table-column prop="name" label="订单类型" width="240" sortable align="center"></el-table-column>

          <el-table-column prop="name" label="产品品牌" width="240" sortable align="center"></el-table-column>

          <el-table-column prop="name" label="产品类别" width="240" sortable align="center"></el-table-column>

          <el-table-column prop="name" label="客户姓名" width="240" sortable align="center"></el-table-column>

          <el-table-column prop="name" label="客户电话" width="240" sortable align="center"></el-table-column>

          <el-table-column prop="name" label="备用电话" width="240" sortable align="center"></el-table-column>

          <el-table-column prop="name" label="订单地址" width="240" sortable align="center"></el-table-column>

          <el-table-column prop="name" label="地址备注" width="240" sortable align="center"></el-table-column>

          <el-table-column prop="name" label="所属网点" width="240" sortable align="center"></el-table-column>

          <el-table-column prop="name" label="申请时间" width="240" sortable align="center"></el-table-column>

          <el-table-column prop="name" label="申请人" width="240" sortable align="center"></el-table-column>
        </el-table>
      </div>

      <!-- 分页 -->
      <div class="pagination_wrap">
        <pagination
          :current-page="currentPage"
          :pageSize="pageSize"
          :total="total"
          @sizeChange="sizeChange"
          @currentChange="currentChange"
        ></pagination>
      </div>
    </el-card>
  </div>
</template>
<script>

import pagination from "@/views/components/pagination";
import breadcrumb from "@/views/components/breadcrumb";
import searchinfo from "./searchInfo";

import spot from "@/assets/images/spot.png";
export default {
  components: {
    breadcrumb,
    pagination,
    searchinfo //查询条件
    // orderdetail,
    // contractdetails
  },
  // name: 'brandmanagement',
  data() {
    return {
      navList: [], //头部面包屑
      currentPage: 1,
      pageSize: 10,
      total: 100,
      tabList: [],
      elsectVal: []
    };
  },

  mounted() {
    // 头部面包屑
    this.navList = this.$route.meta;
  },
  methods: {
    // 新增推荐人
    addpoint() {
      this.$router.push({
        path: "/minemanagement/addapplication",
        query: {
          pageStatus: "3"
        }
      });
    },

    // 编辑推荐人
    editpoint() {
      this.$router.push({
        path: "addpoint"
      });
    },

    // 查询按钮查询列表
    getListFun() {},

    //表格斑马线设置
    tableRowClassName({ row, rowIndex }) {
      return rowIndex % 2 != 0 ? "el-f0" : "";
    },

    // 改变tablebody颜色
    tableBodycolor({ row, rowIndex }) {
      return "height: 80px";
    },

    //勾选函数回调
    handleSelectionChange(val) {
      this.elsectVal = val;
    },

    //翻页方法
    sizeChange(val) {
      this.currentPage = 1;
      this.pageSize = val;
      this.getListFun();
    },

    //翻页方法
    currentChange(val) {
      this.currentPage = val;
      this.getListFun();
    }
  }
};
</script>
<style scoped lang='scss'>
.recommenman {
  .btn_list_1 {
    margin-bottom: 10px;
    display: flex;
    flex-wrap: wrap;
    > button {
      margin: 5px;
    }
  }
}
</style>

