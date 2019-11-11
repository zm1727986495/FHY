<template>
  <div>
    <div class="m-bottom10">
      <el-button v-if="btnJurisdiction.outofstock_Export" size="small" class="button-96" @click="releasedexport">导出</el-button>
      <el-button v-if="btnJurisdiction.outofstock_Handover" size="small" class="button-96" @click="warehousingFun">交接确认</el-button>
    </div>
    <div class="table_list lvs attribute" v-loading='loading'>
      <el-table border style="width: 100%" :row-class-name="tableRowClassName" @selection-change="chooseDelete" :data="tableData" :max-height="maxHeight">
        <el-table-column align="center" type="selection" fixed="left"></el-table-column>
        <el-table-column align="center" prop="outboundNumber" fixed="left" label="出库单号" sortable width="150" show-overflow-tooltip>
          <template slot-scope="scope">
            <div>
              <p class="table_action_span" @click="warehousingFun(scope.row)">{{scope.row.outboundNumber}}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="storageName" label="仓库" width="120" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="orderNumber" label="订单号" width="150"></el-table-column>
        <el-table-column align="center" prop="factoryContractNo" label="采购合同号" width="150"></el-table-column>
        <el-table-column align="center" prop="storeName" label="所属门店" width="150" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="customerName" label="客户姓名" width="120"></el-table-column>
        <el-table-column align="center" prop="customerPhone" label="客户电话" width="150"></el-table-column>
        <el-table-column align="center" prop="address" label="客户地址" width="150" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="pickUpTime" label="提货日期" width="170"></el-table-column>
        <el-table-column align="center" prop="userName" label="出库人" width="120"></el-table-column>
        <el-table-column align="center" prop="amount" label="出库数量" width="120"></el-table-column>
        <el-table-column align="center" prop="receivingPeople" label="接货人姓名" width="120"></el-table-column>
        <el-table-column align="center" prop="receivingPeoplePhone" label="接货人电话" width="150"></el-table-column>
        <el-table-column align="center" prop="driver" label="司机" width="120"></el-table-column>
        <el-table-column align="center" prop="licensePlateNumber" label="车牌号" width="150"></el-table-column>
        <el-table-column align="center" prop="designateType" label="服务类型" width="120">
          <template slot-scope="scope">
            <div>
              <p v-if="scope.row.designateType==1">送装一体</p>
              <p v-if="scope.row.designateType==2">送装分离</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="organizationName" label="安装部" width="120"></el-table-column>
        <el-table-column align="center" prop="predictInstallTime" label="预计安装日期" width="170"></el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import module from "../../../../../config/index"; //导出文件
import { mapGetters } from "vuex";
export default {
  props: ["tableData","loading"],
  data() {
    return {
      // 按钮权限***********
      btnJurisdiction: JSON.parse(this.$loca.getItem("element")),
      choseArr: []
    };
  },
  computed: {
    ...mapGetters(["maxHeight"])
  },
  methods: {
    //验证
    canonlyFun() {
      if (this.choseArr.length < 1) {
        this.$message.warning("您未勾选!");
        return false;
      } else if (this.choseArr.length > 1) {
        this.$message.warning("只能勾选一条!");
        return false;
      } else {
        return true;
      }
    },
    tableRowClassName({ row, rowIndex }) {
      //表格斑马线设置
      return rowIndex % 2 != 0 ? "el-f0" : "";
    },
    warehousingFun(row) {
      if (row.outboundOrderId) {
        this.$router.push({
          path: "handover",
          query: {
            outboundOrderId: row.outboundOrderId,
            outboundType: row.outboundType
          }
        });
      } else {
        if (this.canonlyFun()) {
          this.$router.push({
            path: "handover",
            query: {
              outboundOrderId: this.choseArr[0].outboundOrderId,
              outboundType: this.choseArr[0].outboundType
            }
          });
        }
      }
    },
    chooseDelete(val) {
      this.choseArr = val;
    },
    //导出
    releasedexport() {
      let str =
        module.dev.proxyTable["/api"].target +
        "/api/pc/outboundOrder/exportOutboundOrder?" +
        "outboundStatus=2";
      window.location.href = str;
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
