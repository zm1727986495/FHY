<template>
  <div class="stockuplist">

    <div class="table_list lvs attribute">
      <el-table border style="width: 100%" :row-class-name="tableRowClassName" :data="tableData">
        <el-table-column align="center" type="selection"></el-table-column>
        <el-table-column align="center" prop="maintainStatus" label="状态" sortable width="200">
          <template slot-scope="scope">
            <div>
              <p v-if="scope.row.maintainStatus==0">待处理</p>
              <p v-if="scope.row.maintainStatus==1">处理中</p>
              <p v-if="scope.row.maintainStatus==2">再处理</p>
              <p v-if="scope.row.maintainStatus==3">已处理</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="maintainSource" label="来源" width="200"></el-table-column>
        <el-table-column align="center" prop="oddNumbers" label="订单号" width="200"></el-table-column>
        <el-table-column align="center" prop="purchaseNumber" label="采购合同号" width="200"></el-table-column>
        <el-table-column align="center" prop="templateName" label="类型" width="200"></el-table-column>
        <el-table-column align="center" prop="storageName" label="所属仓库" width="200"></el-table-column>
        <el-table-column align="center" prop="regionName" label="货区" width="200"></el-table-column>
        <el-table-column align="center" prop="siteCode" label="货位" width="200"></el-table-column>
        <el-table-column align="center" prop="handling" label="处理方式" width="200">
          <template slot-scope="scope">
            <div>
              <p v-if='scope.row.handling==1'>新增</p>
              <p v-if='scope.row.handling==2'>转可用</p>
              <p v-if='scope.row.handling==3'>报废</p>
              <p v-if='scope.row.handling==4'>内部销售</p>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination_wrap">
      <pagination
        :current-page="currentPage"
        :pageSize="pageSize"
        :total="total"
        @sizeChange="sizeChange"
        @currentChange="currentChange"
      ></pagination>
    </div>
  </div>
</template>
<script>

import pagination from "@/views/components/pagination";

export default {
  components: {
    pagination
  },
  data() {
    return {
      tableData: [],
      currentPage: 1, //当前页数
      pageSize: 20, //总页数
      total: 0, //总条数

    };
  },
  mounted() {

  },
  methods: {
    //获取订单列表
    getData() {
    
    },
    //点击按钮组
    butGroupAction(type) {

    },
    tableRowClassName({ row, rowIndex }) {
      //表格斑马线设置
      return rowIndex % 2 != 0 ? "el-f0" : "";
    },
    sizeChange(val) {
      //翻页方法
      this.currentPage = 1;
      this.pageSize = val;
    },
    currentChange(val) {
      //翻页方法
      this.currentPage = val;
    },
    handleClose() {
      this.dialogVisible = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.stockuplist {
  .btn-list {
    position: relative;
    margin-bottom: 10px;
    display: flex;
    flex-wrap: wrap;
    > div {
      margin: 5px;
    }
  }
}
</style>
