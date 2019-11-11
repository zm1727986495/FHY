<template>
  <div>
    <div class="table_list lvs attribute">
      <el-table border style="width: 100%" :row-class-name="tableRowClassName" :data="tableData">
        <el-table-column align="center" prop="receiptsNum" label="采购单号" sortable></el-table-column>
        <el-table-column align="center" prop="receiptsNum" label="名称" ></el-table-column>
        <el-table-column align="center" prop="receiptsNum" label="原货位" ></el-table-column>
        <el-table-column align="center" prop="receiptsNum" label="数量" ></el-table-column>
        <el-table-column align="center" prop="receiptsNum" label="现货位" ></el-table-column>
        <el-table-column align="center" prop="receiptsNum" label="目前数量" ></el-table-column>
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
