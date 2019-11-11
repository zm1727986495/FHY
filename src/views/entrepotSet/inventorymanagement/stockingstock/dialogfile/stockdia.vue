<template>
  <div class="actualinventory">
    <el-dialog :visible.sync="dialogVisible" width="900px" :before-close="handleClose">
      <div class="titlecals">{{ datatitle[indexs-1]}}</div>
      <div class="table_list lvs attribute">
        <el-table border style="width: 100%" :row-class-name="tableRowClassName" :data="tabledata">
          <el-table-column align="center" prop="inventoryNumber" label="数量" sortable></el-table-column>
          <el-table-column align="center" prop="siteCode" label="货区货位" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="maintainSource" label="来源" v-if="indexs==3"></el-table-column>
          <el-table-column align="center" prop="orderNumber" label="订单号" v-if="indexs == 2"></el-table-column>
          <el-table-column align="center" prop="purchaseCode" label="占用单号" v-if="indexs == 2"></el-table-column>
          <el-table-column align="center" prop="orderTypeStr" label="订单类型" v-if="indexs == 2"></el-table-column>
          <el-table-column align="center" prop="purchaseCode" label="采购单号" v-if="indexs == 2"></el-table-column>
          <el-table-column align="center" prop="purchaseCode" label="销售员" v-if="indexs == 4"></el-table-column>
          <el-table-column align="center" prop="purchaseCode" label="处罚门店" v-if="indexs == 4"></el-table-column>
          <el-table-column align="center" prop="purchaseCode" label="处罚单号" v-if="indexs == 4"></el-table-column>
          <el-table-column align="center" prop="cancelSampleSingleCode" label="撤样单号"  v-if="indexs == 6"></el-table-column>
          <el-table-column
            align="center"
            prop="storeName"
            label="所属门店"
            v-if="indexs == 2 || indexs == 4 || indexs == 5"
          ></el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getStockUpGoodsInventoryById } from "@/api/entrepotSet/inventorymanagement/stockingstock/stockingstock.js";

export default {
  data() {
    return {
      tabledata: [],
      datatitle: [
        "新品可用库存",
        "占用库存",
        "二次可用库存",
        "暂扣库存",
        "门店暂存数量",
        "样品库存"
      ],
      plesdata: this.fromdata
    };
  },
  props:['dialogVisible','indexs','fromdata'],
  created() {
    let data = this.plesdata;
    this.getdatafun(data);
  },
  methods: {
    getdatafun(data) {
      getStockUpGoodsInventoryById(data)
        .then(res => {
          if (res.status == 200) {
            this.tabledata = res.data;
          }
        })
        .catch(error => {
          console.error("", error);
        });
    },
    handleClose() {
      this.$emit("closebox");
    },
    tableRowClassName({ row, rowIndex }) {
      //表格斑马线设置
      return rowIndex % 2 != 0 ? "el-f0" : "";
    }
  }
};
</script>
<style lang="scss" scoped>
.actualinventory {
  .totalStyle {
    display: flex;
    justify-content: space-around;
    li {
      width: 50%;
    }
  }
  .conetnStyle {
    display: flex;
  }
  .totalStyle {
    display: flex;
    flex-wrap: wrap;
    li {
      width: 50%;
    }
  }
  .conetnStyle {
    display: flex;
    justify-content: center;
  }
}
</style>
