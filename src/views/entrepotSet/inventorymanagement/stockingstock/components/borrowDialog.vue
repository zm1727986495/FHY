<template>
  <div>
    <div class="table_list lvs attribute">
      <el-table border style="width: 100%" :row-class-name="tableRowClassName" :data="tableData">
        <el-table-column align="center" prop="receiptsNum" label="来源单号" sortable width="200"></el-table-column>
        <el-table-column align="center" prop="receiptsNum" label="商品名称" width="200"></el-table-column>
        <el-table-column align="center" prop="receiptsNum" label="商品型号" width="200"></el-table-column>
        <el-table-column align="center" prop="receiptsNum" label="数量" width="200"></el-table-column>
        <el-table-column align="center" prop="receiptsnumber" label="货位" width="200"></el-table-column>
        <el-table-column align="center" prop="receiptsNum" label="借入单号" width="200"></el-table-column>
        <el-table-column align="center" prop="receiptsNum" label="借入时间" width="200"></el-table-column>
        <el-table-column align="center" prop="receiptsNum" label="状态" width="200"></el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tableData: [{}]
    };
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      //表格斑马线设置
      return rowIndex % 2 != 0 ? "el-f0" : "";
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
