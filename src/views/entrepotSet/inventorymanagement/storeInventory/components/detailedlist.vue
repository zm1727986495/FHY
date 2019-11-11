<template>
  <div class="detailedlist">
    <div>
      <ul class="customerlist">
        <li>
          <span class="fw">名称：</span>
          <span>十里河居然店</span>
        </li>
        <li>
          <span class="fw">店长：</span>
          <span>张大</span>
        </li>
        <li>
          <span class="fw">联系方式：</span>
          <span>13333333333</span>
        </li>
        <li>
          <span class="fw">地址：</span>
          <span>十里河居然店</span>
        </li>
        <li>
          <span class="fw">备注：</span>
          <span>废品出库</span>
        </li>
        <li>
          <span class="fw">入库人：</span>
          <span>十里河居然店</span>
        </li>
      </ul>
    </div>

    <div class="m-top10">
      <span class="fw">店面库存列表：</span>
      <div class="table_list lvs attribute m-top10">
        <el-table border style="width: 100%" :row-class-name="tableRowClassName" :data="tableData">
          <el-table-column align="center" prop="receiptsNum" label="产品编码" sortable width="200"></el-table-column>
          <el-table-column align="center" prop="receiptsType" label="产品名称" width="200"></el-table-column>
          <el-table-column align="center" prop="getStorageType" label="计量单位" width="200"></el-table-column>
          <el-table-column align="center" prop="orderNum" label="来源" width="200"></el-table-column>
          <el-table-column align="center" prop="warehouse" label="来源单号" width="200"></el-table-column>
          <el-table-column align="center" prop="driver" label="门店数量" width="200"></el-table-column>
          <el-table-column align="center" prop="deliverGoods" label="在途数量" width="200"></el-table-column>
          <el-table-column align="center" prop="date" label="未提数量" width="200">
            、
            <template slot-scope="scope">
              <div>
                <p class="unknown" @click="unknownFun">{{scope.row.date}}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="department" label="成本金额" width="200"></el-table-column>
        </el-table>
      </div>
    </div>
    <div>
      <el-dialog width="40%" :visible.sync="innerVisible" append-to-body>
        <div class="titlecals">库存</div>
        <div class="table_list lvs attribute m-top10">
        <el-table border style="width: 100%" :row-class-name="tableRowClassName" :data="dataList">
          <el-table-column align="center" prop="receiptsNum" label="商品名称" sortable width="200"></el-table-column>
          <el-table-column align="center" prop="receiptsType" label="类型" width="200"></el-table-column>
          <el-table-column align="center" prop="getStorageType" label="所属仓库" width="200"></el-table-column>
          <el-table-column align="center" prop="orderNum" label="数量" width="200"></el-table-column>
          <el-table-column align="center" prop="warehouse" label="货位" width="200"></el-table-column>
        </el-table>
      </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tableData: [{ date: 50 }],
      innerVisible:false,
      dataList:[{}]
    };
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      //表格斑马线设置
      return rowIndex % 2 != 0 ? "el-f0" : "";
    },
    unknownFun() {
      this.innerVisible=true
    }
  }
};
</script>
<style lang="scss" scoped>
.detailedlist {
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
  .unknown {
    cursor: pointer;
  }
}
</style>
