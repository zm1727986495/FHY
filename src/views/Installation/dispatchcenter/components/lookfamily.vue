<template>
  <div class="lookfamily">
    <div class="h-width"></div>
    <div class="iconBox">
      <i class="Icon"></i>
      <span>顾家</span>
    </div>
    <div class="table_list lvs attribute">
      <el-table
        border
        :row-class-name="tableRowClassName"
        @selection-change="chooseDelete"
        :data="tableData"
      >
        <el-table-column fixed type="selection" width="40"></el-table-column>
        <el-table-column align="center" prop="designer" label="行号" width="200"></el-table-column>
        <el-table-column align="center" prop="timeCycle" label="采购单号" width="200"></el-table-column>
        <el-table-column align="center" prop="predictInstallationTime" label="商品名称" width="200"></el-table-column>
        <el-table-column align="center" prop="appointmentRemakes" label="规格" width="200"></el-table-column>
        <el-table-column align="center" prop="logisticsDistributionTime" label="采购数量" width="200"></el-table-column>
        <el-table-column align="center" prop="firstInstallationTime" label="应收数量/套" width="200"></el-table-column>
        <el-table-column align="center" prop="contractMoney" label="应收数量/件" width="200"></el-table-column>
        <el-table-column align="center" prop="presentStatus" label="实收数量/套" width="200">
          <template slot-scope="scope">
            <div>
              <el-input v-model="scope.row.presentStatus" size="small"></el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="predictInstallTime" label="实收数量/件" width="200">
          <template slot-scope="scope">
            <div>
              <el-input v-model="scope.row.presentStatus" size="small"></el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="reportContent" label="货区货位" width="200"></el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      choseArr: [],
      tableData: [{}]
    };
  },
  methods: {
    //表格斑马线设置
    tableRowClassName({ row, rowIndex }) {
      return rowIndex % 2 != 0 ? "el-f0" : "";
    },
    //勾选
    chooseDelete(val) {
      this.choseArr = val;
    }
  }
};
</script>
<style lang="scss" scoped>
.lookfamily {
}
</style>
