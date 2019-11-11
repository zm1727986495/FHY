<template>
  <div>
    <div class="m-bottom10">
      <el-button v-if="btnJurisdiction.outofstock_Export" size="small" class="button-96" @click="releasedexport">导出</el-button>
    </div>
    <div class="table_list lvs attribute" v-loading='loading'>
      <el-table border style="width: 100%" :max-height="maxHeight" :row-class-name="tableRowClassName" :data="tableData">
        <el-table-column align="center" type="selection" fixed="left"></el-table-column>
        <el-table-column align="center" prop="outboundNumber" fixed="left" label="出库单号" sortable width="120" show-overflow-tooltip>
          <template slot-scope="scope">
            <div>
              <p class="table_action_span" @click="warehousingFun(scope.row)">{{scope.row.outboundNumber}}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="storageName" label="仓库" width="120" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="orderNumber" label="订单号" width="130" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="factoryContractNo" label="采购合同号" width="130" show-overflow-tooltip=""></el-table-column>
        <el-table-column align="center" prop="outboundStatus" label="出库状态" width="90">
          <template slot-scope="scope">
            <div>
              <p v-if="scope.row.outboundStatus==3">已出库</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="outboundTime" label="出库时间" width="160"></el-table-column>
        <el-table-column align="center" prop="createTime" label="生成出库单时间" width="160"></el-table-column>
        <el-table-column align="center" prop="brandName" label="品牌" width="90"></el-table-column>
        <el-table-column align="center" prop="categoryName" label="品类" width="90" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="storeName" label="所属门店" width="120" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="customerName" label="客户姓名" width="80"></el-table-column>
        <el-table-column align="center" prop="customerPhone" label="客户电话" width="120"></el-table-column>
        <el-table-column align="center" prop="address" label="客户地址" width="150" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="pickUpTime" label="提货日期" width="160"></el-table-column>
        <el-table-column align="center" prop="userName" label="出库人" width="80"></el-table-column>
        <el-table-column align="center" prop="amount" label="出库数量" width="80"></el-table-column>
        <el-table-column align="center" prop="receivingPeople" label="接货人姓名" width="100"></el-table-column>
        <el-table-column align="center" prop="receivingPeoplePhone" label="接货人电话" width="120"></el-table-column>
        <el-table-column align="center" prop="driver" label="司机" width="80" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="licensePlateNumber" label="车牌号" width="110"></el-table-column>
        <el-table-column align="center" prop="designateType" label="服务类型" width="90">
          <template slot-scope="scope">
            <div>
              <p v-if="scope.row.designateType==1">送装一体</p>
              <p v-if="scope.row.designateType==2">送装分离</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="organizationName" label="安装部" width="110" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="cost" label="出库成本" width="80" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="predictInstallTime" label="预计上门日期" width="170"></el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import module from "../../../../../config/index"; //导出文件
import { mapGetters } from "vuex";
import { getToken } from '@/utils/auth';
export default {
  props: ["tableData","loading","beforIn"],
  data() {
    return {
      // 按钮权限***********
      btnJurisdiction: JSON.parse(this.$loca.getItem("element"))
    };
  },
  computed: {
    ...mapGetters(["maxHeight"])
  },
  methods: {
    warehousingFun(row) {
      this.$router.push({
        path: "handover",
        query: {
          outboundOrderId: row.outboundOrderId,
          outboundType: row.outboundType
        }
      });
    },
    //表格斑马线设置
    tableRowClassName({ row, rowIndex }) {
      return rowIndex % 2 != 0 ? "el-f0" : "";
    },
    //导出
    releasedexport() {
      if(!(this.beforIn.brandId&&this.beforIn.categoryId)){
        this.$message.error('没有选择品牌品类!')
        return
      }
      let Interface='';
      //  欧派 衣柜
      if(this.beforIn.brandId==1&&this.beforIn.categoryId==1000026){
        Interface = 'exportOutboundOrder';
      }

      //  欧派 橱柜
      if(this.beforIn.brandId==1&&this.beforIn.categoryId==1000033){
        Interface = 'exportOutboundOrderChuGui';
      }

      let str = module.dev.proxyTable["/api"].target +
      `/api/pc/outboundOrder/${Interface}?token=${getToken()}&outboundStatus=3&brandId=${this.beforIn.brandId}&categoryId=${this.beforIn.categoryId}`;
      window.location.href = str;
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
