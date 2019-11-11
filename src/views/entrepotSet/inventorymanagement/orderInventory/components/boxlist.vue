<template>
  <div>
    <!-- 查看数量 -->
    <div class="table_list lvs attribute m-top10">
      <el-table
        border
        style="width: 100%"
        :row-class-name="tableRowClassName"
        :data="[cargoMainList]"
      >
        <el-table-column align="center" label="数量">
          <template slot-scope="scope">
            <div>
              <p>总数量</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          v-for="(item,index) in cargoMainList.packageList"
          :key="index"
          align="center"
          :label="item.aogTemplateName"
        >
          <template slot-scope="scope">
            <div>
              <p
                class="table_action_span"
                @click="getPackage(item.idStr)"
              >{{item.inventoryNumber}}</p>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 货区货位详情 -->
    <el-dialog
      class="customDialogTitle"
      width="500px"
      title="货区货位详情"
      :visible.sync="innerVisible"
      append-to-body
    >
      <div class="table_list lvs attribute m-top10">
        <el-table border style="width: 100%" :row-class-name="tableRowClassName" :data="tableData">
          <el-table-column align="center" prop="siteCode" label="货位"></el-table-column>
          <el-table-column align="center" prop="barcode" label="条码"></el-table-column>
          <el-table-column align="center" prop="inventoryNumber" label="数量"></el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { listPackageSiteById } from "api/entrepotSet/inventorymanagement/orderInventory/orderInventory";
export default {
  props: ["cargoMainList"],
  data() {
    return {
      innerVisible: false,
      tableData: []
    };
  },
  methods: {
    //获取货区货位
    getPackage(packageId) {
      listPackageSiteById({ packageId })
        .then(res => {
          if (res.status == 200) {
            console.log(res);
            this.tableData = res.data.list;
            this.innerVisible = true;
          }
        })
        .catch(error => {
          console.error("获取货区货位", error);
        });
    },
    //表格斑马线设置
    tableRowClassName({ row, rowIndex }) {
      return rowIndex % 2 != 0 ? "el-f0" : "";
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
