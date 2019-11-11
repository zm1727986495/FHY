<template>
  <div>
    <div class="table_list lvs attribute">
      <el-table border style="width: 100%" @selection-change="chooseDelete" :row-class-name="tableRowClassName" :data="tableData">
        <el-table-column align="center" type="selection" fixed></el-table-column>
        <el-table-column align="center" prop="commodityName" label="商品名称" width="120" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="commodityCode" label="商品编码" width="120" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="brandName" label="品牌" width="80"></el-table-column>
        <el-table-column align="center" prop="categoryName" label="品类" width="80" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="applyNumber" label="领用数量" width="80"></el-table-column>
        <el-table-column align="center" prop="regionSite" label="货区货位" v-if="isShow" width="140" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="regionSite" label="货区货位" v-else width="140" show-overflow-tooltip>
          <template slot-scope="scope">
            <div>{{scope.row.regionName}} {{scope.row.siteCode}}</div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import { listRecipientsGoods } from "api/entrepotSet/outgoingManagement/outgoingManagement";
export default {
  props: {
    isShow: {
      default: true
    }
  },
  data() {
    return {
      tableData: [], //列表
      choseArr: [] //勾选
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    //获取出库领用列表
    getData() {
      let data = {
        outboundOrderId: this.$route.query.outboundOrderId,
        outboundType: this.$route.query.outboundType
      };
      listRecipientsGoods(data)
        .then(res => {
          if (res.status == 200) {
            this.tableData = res.data.map(item => {
              return { regionSite: "", ...item };
            });
          }
        })
        .catch(error => {
          console.error("获取出库领用列表", error);
        });
    },
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
</style>
