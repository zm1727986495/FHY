<template>
  <div class="table_list unsortable">
    <el-row>
      <el-col :span="span">
        <div class="tableTitle">实际合同金额</div>
      </el-col>
      <el-col :span="span">
        <div class="tableTitle">实际收款金额</div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="span" class="table_list">
        <el-table border :data="tableList">
          <el-table-column prop="name" label="合同额" :align="columnAlign"></el-table-column>
          <el-table-column prop="name" label="CNG合同" :align="columnAlign" show-overflow-tooltip></el-table-column>
          <el-table-column prop="name" label="退单" :align="columnAlign" show-overflow-tooltip></el-table-column>
          <el-table-column prop="name" label="折扣退款" :align="columnAlign" show-overflow-tooltip></el-table-column>
          <el-table-column prop="name" label="退货退款" :align="columnAlign" show-overflow-tooltip></el-table-column>
          <el-table-column prop="name" label="小计" :align="columnAlign" show-overflow-tooltip></el-table-column>
        </el-table>
      </el-col>
      <el-col :span="span" class="table_list">
        <el-table border :data="tableList">
          <el-table-column prop="name" label="收款金额" :align="columnAlign"></el-table-column>
          <el-table-column prop="name" label="退款金额" :align="columnAlign" show-overflow-tooltip></el-table-column>
          <el-table-column prop="name" label="退单金额" :align="columnAlign" show-overflow-tooltip></el-table-column>
          <el-table-column prop="name" label="折扣退款" :align="columnAlign" show-overflow-tooltip></el-table-column>
          <el-table-column prop="name" label="退货退款" :align="columnAlign" show-overflow-tooltip></el-table-column>
          <el-table-column prop="name" label="小计" :align="columnAlign" show-overflow-tooltip></el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  let tableList = [
    {
      id: 1,
      name: 120000,
      total: 1300000
    },
    {
      id: 2,
      name: 120000,
      total: 1300000
    }
  ]
  export default {
    name: "Appendix",
    data() {
      return {
        columnAlign: 'center',
        size: 'medium',
        span: 12,
        tableList
      }
    },
    methods: {
      tableRowClassName({ row, rowIndex }) {
        return rowIndex % 2 != 0 ? 'el-f0' : '';
      }
    }
  }
</script>

<style scoped>
  .tableTitle{
    height: 48px;
    line-height: 48px;
    text-align: center;
    border: 1px solid #eee;
    font-size: 14px;
    color: #666;
    font-weight: bold;
  }
</style>
