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
        <el-button size="small" class="button-96" @click="pointexamine">审 核</el-button>
        <el-button size="small" class="button-96">查看流程图</el-button>
        <el-button size="small" class="button-96" @click="examinelog">审核记录</el-button>
        <el-button size="small" class="button-96">附件管理</el-button>
        <el-button size="small" class="button-96" @click="openexportdia">导出</el-button>
      </div>

      <!-- 审核记录 -->
      <examinedia :visible="examine_vis" @close_examin="examineclose" @examin_ok="examinok"></examinedia>

      <!-- 导出 -->
      <exportdia :visible="exportdia_vis" @close_export="exportclose" @export_ok="exportok"></exportdia>

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
import pagination from "../../../components/pagination";
import breadcrumb from "../../../components/breadcrumb";
import searchinfo from "./searchInfo";
import exportdia from "../auditlist/exportdia"; //变更记录条件
import examinedia from "../auditlist/examinedia"; //审核记录弹框

import spot from "@/assets/images/spot.png";
export default {
  components: {
    breadcrumb,
    pagination,
    searchinfo, //查询条件
    exportdia, //导出,
    examinedia //审核记录,
  },
  // name: 'brandmanagement',
  data() {
    return {
      navList: [], //头部面包屑
      currentPage: 1,
      pageSize: 10,
      total: 100,
      tabList: [],
      elsectVal: [],

      examine_vis: false, //审核记录弹框是否显示
      exportdia_vis: false //导出弹框是否显示
    };
  },

  mounted() {
    // 头部面包屑
    this.navList = this.$route.meta;
  },
  methods: {
    // 新增推荐人
    pointexamine() {
      this.$router.push({
        path: "pointexamine"
      });
    },

    // 编辑推荐人
    editpoint() {
      this.$router.push({
        path: "addpoint"
      });
    },

    //审核记录  打开审核记录弹框
    examinelog() {
      this.examine_vis = true;
    },

    //关闭弹框   审核记录
    examineclose() {
      this.examine_vis = false;
    },

    //确认关闭弹框   审核记录
    examinok() {
      this.examine_vis = false;
      this.$message("审核信息成功");
    },

    //导出数据  打开导出数据弹框
    openexportdia() {
      this.exportdia_vis = true;
    },

    //关闭弹框   导出数据
    exportclose() {
      this.exportdia_vis = false;
    },

    //确认关闭弹框   导出数据
    exportok() {
      this.exportdia_vis = false;
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

