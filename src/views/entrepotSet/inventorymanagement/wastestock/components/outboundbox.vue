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
          <span class="fw">产品类型：</span>
          <span>衣柜</span>
        </li>
        <li>
          <span class="fw">入库类型：</span>
          <span>废品出库</span>
        </li>
        <li>
          <span class="fw">入库人：</span>
          <span>张三</span>
        </li>
      </ul>
    </div>
    <div class="outgoingremarks m-top10">
      <el-checkbox v-model="check" style='margin-right:0;'>
        <span class="fw">出库备注：</span>
      </el-checkbox>
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
      <span class="fw">货物详情列表：</span>
      <div class="table_list lvs attribute m-top10">
        <el-table border style="width: 100%" :row-class-name="tableRowClassName" :data="tableData">
          <el-table-column align="center" type="selection"></el-table-column>
          <el-table-column align="center" prop="receiptsNum" label="商品名称" sortable width="200"></el-table-column>
          <el-table-column align="center" prop="receiptsType" label="商品规格" width="200"></el-table-column>
          <el-table-column align="center" prop="getStorageType" label="商品类型" width="200"></el-table-column>
          <el-table-column align="center" prop="orderNum" label="计量单位" width="200"></el-table-column>
          <el-table-column align="center" prop="warehouse" label="实际库存数量" width="200"></el-table-column>
          <el-table-column align="center" prop="driver" label="出库数量" width="200">
            <template slot-scope="scope">
              <div>
                <el-input v-model="scope.row.driver" size='mini'></el-input>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="deliverGoods" label="所属仓库" width="200"></el-table-column>
          <el-table-column align="center" prop="date" label="货区" width="200"></el-table-column>
          <el-table-column align="center" prop="department" label="货位号" width="200"></el-table-column>
          <el-table-column align="center" prop="loading" label="报废来源" width="200"></el-table-column>
          <el-table-column align="center" prop="loading" label="采购单号" width="200"></el-table-column>
          <el-table-column align="center" prop="loading" label="客户合同号" width="200"></el-table-column>
          <el-table-column align="center" prop="loading" label="入库人" width="200"></el-table-column>
          <el-table-column align="center" prop="loading" label="报废人" width="200"></el-table-column>
          <el-table-column align="center" prop="loading" label="报废时间" width="200"></el-table-column>
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
