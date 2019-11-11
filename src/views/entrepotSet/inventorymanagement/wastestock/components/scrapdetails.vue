<template >
  <div class="scrapdetails">
    <div class="table_list lvs attribute">
      <el-table border style="width: 100%" :row-class-name="tableRowClassName" :data="tableData">
        <el-table-column align="center" prop="receiptsNum" label="商品名称" sortable width="200"></el-table-column>
        <el-table-column align="center" prop="receiptsNum" label="商品规格" width="200"></el-table-column>
        <el-table-column align="center" prop="receiptsNum" label="商品类型" width="200"></el-table-column>
        <el-table-column align="center" prop="receiptsNum" label="计量单位" width="200"></el-table-column>
        <el-table-column align="center" prop="receiptsNum" label="实际库存数量" width="200"></el-table-column>
        <el-table-column align="center" prop="receiptsNum" label="所属仓库" width="200"></el-table-column>
        <el-table-column align="center" prop="receiptsNum" label="货区" width="200"></el-table-column>
        <el-table-column align="center" prop="receiptsNum" label="货位号" width="200"></el-table-column>
        <el-table-column align="center" prop="receiptsNum" label="报废来源" width="200"></el-table-column>
        <el-table-column align="center" prop="receiptsNum" label="采购单号" width="200"></el-table-column>
        <el-table-column align="center" prop="receiptsNum" label="客户合同号" width="200"></el-table-column>
        <el-table-column align="center" prop="receiptsNum" label="入库人" width="200"></el-table-column>
        <el-table-column align="center" prop="receiptsNum" label="报废人" width="200"></el-table-column>
        <el-table-column align="center" prop="receiptsNum" label="报废时间" width="200"></el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tableData: [{ receiptsNum: "哈哈" }]
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
.scrapdetails {
}
</style>
