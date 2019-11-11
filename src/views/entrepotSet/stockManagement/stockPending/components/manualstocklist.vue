<template>
  <div class="manualorderlist">
    <div class="table-width lvs attribute">
      <el-table
        border
        @selection-change="handleSelectionChange"
        :data="tabList"
        :row-class-name="tableRowClassName"
      >
        <el-table-column fixed type="selection" width="40"></el-table-column>
        <el-table-column prop="name" label="订单号" width="240" sortable align="center"></el-table-column>
        <el-table-column prop="name" label="采购合同号" width="240" align="center"></el-table-column>
        <el-table-column prop="name" label="订单创建时间" width="240" align="center"></el-table-column>
        <el-table-column prop="name" label="商品品牌" width="240" align="center"></el-table-column>
        <el-table-column prop="name" label="商品名称" width="240" align="center"></el-table-column>
        <el-table-column prop="name" label="所属门店" width="240" align="center"></el-table-column>
        <el-table-column prop="name" label="状态" width="240" align="center"></el-table-column>
        <el-table-column prop="name" label="所属仓库" width="240" align="center"></el-table-column>
        <el-table-column prop="name" label="备注" width="240" align="center"></el-table-column>
      </el-table>
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
  </div>
</template>
<script>
import pagination from "../../../../components/pagination";
export default {
  components: {
    pagination
  },
  data() {
    return {
      currentPage: 1, //当前页数
      pageSize: 10, //总页数
      total: 100, //总条数
      tabList: [{ name: 1 }, { name: 1 }, { name: 1 }],
      valData: []
    };
  },
  methods: {
    //翻页方法
    sizeChange(val) {
      this.currentPage = 1;
      this.pageSize = val;
    },
    //翻页方法
    currentChange(val) {
      this.currentPage = val;
    },
    handleSelectionChange(val) {
      console.log(val);
      this.valData = val;
    },
    tableRowClassName({ row, rowIndex }) {
      //表格斑马线设置
      return rowIndex % 2 != 0 ? "el-f0" : "";
    },
    fun() {
      this.$emit("stockFun", this.valData);
    }
  }
};
</script>
<style lang="scss" scoped>
.manualorderlist {
}
</style>
