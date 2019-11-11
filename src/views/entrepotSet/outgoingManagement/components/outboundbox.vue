<template>
  <div>
    <div>
      <ul class="customerlist">
        <li>
          <span class="fw">出库单号：</span>
          <span>RK46464588</span>
        </li>
        <li>
          <span class="fw">供应商：</span>
          <span>北京欧派</span>
        </li>
        <li>
          <span class="fw">所属仓库：</span>
          <span>北京顺义仓库</span>
        </li>
        <li>
          <span class="fw">出库类型：</span>
          <span>销售出库</span>
        </li>
        <li>
          <span class="fw">所属网点：</span>
          <span>北京1门店</span>
        </li>
        <li>
          <span class="fw">出库状态：</span>
          <span>正常</span>
        </li>
        <li>
          <span class="fw">出库人：</span>
          <span>小李</span>
        </li>
        <li>
          <span class="fw">预计出库时间：</span>
          <span>2018-09-08 09:30:00</span>
        </li>
      </ul>
    </div>
    <div class="outgoingremarks m-top10">
      <span class="fw deposit">出库备注：</span>

      <el-input
        class="inputStyle"
        type="textarea"
        :rows="2"
        placeholder="请输入内容"
        resize="none"
        v-model="textarea"
      ></el-input>
    </div>
    <div class="m-top10">
      <span class="fw">采购单货物列表：</span>
      <div class="table_list lvs attribute m-top10">
        <el-table border style="width: 100%" :row-class-name="tableRowClassName" :data="tableData">
          <el-table-column align="center" type="selection"></el-table-column>
          <el-table-column align="center" prop="receiptsNum" label="出库单号" sortable width="200"></el-table-column>
          <el-table-column align="center" prop="receiptsType" label="状态" width="200"></el-table-column>
          <el-table-column align="center" prop="getStorageType" label="订单编号" width="200"></el-table-column>
          <el-table-column align="center" prop="orderNum" label="合同号" width="200"></el-table-column>
          <el-table-column align="center" prop="warehouse" label="采购订单号" width="200"></el-table-column>
          <el-table-column align="center" prop="driver" label="单据类型" width="200"></el-table-column>
          <el-table-column align="center" prop="deliverGoods" label="订单类型" width="200"></el-table-column>
          <el-table-column align="center" prop="date" label="所属网点" width="200"></el-table-column>
          <el-table-column align="center" prop="department" label="预约送货时间" width="200"></el-table-column>
          <el-table-column align="center" prop="loading" label="商品类型" width="200"></el-table-column>
          <el-table-column align="center" prop="loading" label="客户姓名" width="200"></el-table-column>
          <el-table-column align="center" prop="loading" label="客户电话" width="200"></el-table-column>
          <el-table-column align="center" prop="loading" label="客户地址" width="200"></el-table-column>
          <el-table-column align="center" prop="loading" label="安装方式" width="200"></el-table-column>
          <el-table-column align="center" prop="loading" label="司机" width="200"></el-table-column>
          <el-table-column align="center" prop="loading" label="安装部" width="200"></el-table-column>
          <el-table-column align="center" prop="loading" label="预计安装日期" width="200"></el-table-column>
          <el-table-column align="center" prop="loading" label="备注" width="200"></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      check: false,
      textarea: "",
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
.deposit{
  min-width: 80px;
}
.outgoingremarks {
  display: flex;
  .inputStyle {
    width: 100%;
  }
}
.customerlist {
  display: flex;
  flex-wrap: wrap;
  li {
    width: 33%;
    line-height: 30px;
    span {
      font-weight: none !important;
    }
  }
}
</style>
