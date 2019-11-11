<template >
  <div>
    <div class="m-bottom10">
      <el-button v-if="btnJurisdiction.outofstock_Export" size="small" class="button-96" @click="releasedexport">导出</el-button>
      <el-button v-if="btnJurisdiction.outofstock_Outstock" size="small" class="button-96" @click="warehousingFun">出库</el-button>
      <el-button v-if="btnJurisdiction.outofstock_Manual" size="small" class="button-96" @click="manualdepot">手动出库</el-button>
      <el-button v-if="btnJurisdiction.outofstock_Temporary" size="small" class="button-96" @click="temporarOutFn">临时出库</el-button>
    </div>
    <div class="table_list lvs attribute" v-loading='loading'>
      <el-table border style="width: 100%" @selection-change="chooseDelete" :row-class-name="tableRowClassName" :data="tableData" :max-height="maxHeight">
        <el-table-column align="center" type="selection" fixed="left"></el-table-column>
        <el-table-column align="center" prop="outboundNumber" fixed="left" label="出库单号" sortable width="120">
          <template slot-scope="scope">
            <div>
              <!-- <p class="table_action_span" @click="detailsFn(scope.row)">{{scope.row.outboundNumber}}</p> -->
              <p>{{scope.row.outboundNumber}}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="storageName" label="仓库" width="120" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="orderNumber" label="订单编号" width="120"></el-table-column>
        <el-table-column align="center" prop="factoryContractNo" label="采购合同号" width="120" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="outboundStatus" label="出库状态" width="80">
          <template slot-scope="scope">
            <div>
              <p v-if="scope.row.outboundStatus==1">待出库</p>
              <p v-if="scope.row.outboundStatus==2">待交接</p>
              <p v-if="scope.row.outboundStatus==3">已出库</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="outboundType" label="出库类型" width="90">
          <template slot-scope="scope">
            <div>
              <p v-if="scope.row.outboundType==0">第三方</p>
              <p v-if="scope.row.outboundType==1">安装</p>
              <p v-if="scope.row.outboundType==2">内购</p>
              <p v-if="scope.row.outboundType==3">调拨</p>
              <p v-if="scope.row.outboundType==4">备货领用</p>
              <p v-if="scope.row.outboundType==5">手动</p>
              <p v-if="scope.row.outboundType==6">撤样</p>
              <p v-if="scope.row.outboundType==7">销售</p>
              <p v-if="scope.row.outboundType==8">盘点</p>
              <p v-if="scope.row.outboundType==9">礼品领用</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="createTime" label="生成出库单时间" width="160"></el-table-column>
        <el-table-column align="center" prop="brandName" label="品牌" width="90"></el-table-column>
        <el-table-column align="center" prop="categoryName" label="品类" width="90" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="storeName" label="所属门店" width="110" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="pickUpTime" label="提货日期" width="160"></el-table-column>
        <el-table-column align="center" prop="userName" label="出库人" width="80"></el-table-column>
        <el-table-column align="center" prop="amount" label="出库数量" width="80"></el-table-column>
        <el-table-column align="center" prop="receivingPeople" label="接货人姓名" width="100"></el-table-column>
        <el-table-column align="center" prop="receivingPeoplePhone" label="接货人电话" width="110"></el-table-column>
        <el-table-column align="center" prop="driver" label="司机" width="80"></el-table-column>
        <el-table-column align="center" prop="licensePlateNumber" label="车牌号" width="110"></el-table-column>
        <el-table-column align="center" prop="designateType" label="服务类型" width="90">
          <template slot-scope="scope">
            <div>
              <p v-if="scope.row.designateType==1">送装一体</p>
              <p v-if="scope.row.designateType==2">送装分离</p>
            </div>
          </template>
        </el-table-column>
        <!-- <el-table-column align="center" prop="organizationName" label="安装部" width="120"></el-table-column> -->
        <el-table-column align="center" prop="predictInstallTime" label="预计上门日期" width="160"></el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import outboundbox from "./outboundbox";
import { mapGetters } from "vuex";
import module from "../../../../../config/index"; //导出文件
import { getToken } from '@/utils/auth';
export default {
  components: {
    outboundbox
  },
  props: ["tableData","loading","beforIn"],
  data() {
    return {
      // 按钮权限***********
      btnJurisdiction: JSON.parse(this.$loca.getItem("element")),
      choseArr: [], //勾选
    };
  },
  computed: {
    ...mapGetters(["maxHeight"])
  },
  mounted() {},
  methods: {
    //出库
    warehousingFun() {
      if (this.choseArr.length > 1) {
        this.$message.warning("只能勾选一条!");
      } else if (this.choseArr.length < 1) {
        this.$message.warning("您未勾选!");
      } else {
        this.$router.push({
          path: "nolibrarylist",
          query: {
            outboundOrderId: this.choseArr[0].outboundOrderId,
            storageId: this.choseArr[0].storageId,
            outboundType: this.choseArr[0].outboundType,
            sourceCode:this.choseArr[0].sourceCode,
            orderId:this.choseArr[0].orderId,
            isShow: 1,
          }
        });
      }
    },
    //出库详情
    detailsFn(row) {
      this.$router.push({
        path: "handover",
        query: {
          outboundOrderId: row.outboundOrderId,
          outboundType: row.outboundType
        }
      });
    },
    //手动出库
    manualdepot() {
      this.$router.push({ path: "manual" });
    },
    //临时出库
    temporarOutFn(){
      this.$router.push({path:'temporaryoutgoing'})
    },
    //表格斑马线设置
    tableRowClassName({ row, rowIndex }) {
      return rowIndex % 2 != 0 ? "el-f0" : "";
    },
    //提交
    sendJava() {},
    //勾选
    chooseDelete(val) {
      this.choseArr = val;
    },
    //导出
    releasedexport() {
      if(!(this.beforIn.brandId&&this.beforIn.categoryId)){
        this.$message.error('没有选择品牌品类!')
        return
      }
      let Interface = '';
      //  欧派 衣柜
      if(this.beforIn.brandId==1&&this.beforIn.categoryId==1000026){
        Interface = 'exportOutboundOrder';
      }

      //  欧派 橱柜
      if(this.beforIn.brandId==1&&this.beforIn.categoryId==1000033){
        Interface = 'exportOutboundOrderChuGui';
      }

      let text = this.beforIn.text?`&text=${this.beforIn.text}`:'';
      let startTime = this.beforIn.startTime?`&startTime=${this.beforIn.startTime}`:'';
      let endTime = this.beforIn.endTime?`&endTime=${this.beforIn.endTime}`:'';
      let storeId = this.beforIn.storeId?`&storeId=${this.beforIn.storeId}`:'';
      let predictDateStart = this.beforIn.predictDateStart?`&predictDateStart=${this.beforIn.predictDateStart}`:'';
      let predictDateEnd = this.beforIn.predictDateEnd?`&predictDateEnd=${this.beforIn.predictDateEnd}`:'';
      let storageId = this.beforIn.storageId?`&storageId=${this.beforIn.storageId}`:'';

      let str = module.dev.proxyTable["/api"].target +`/api/pc/outboundOrder/${Interface}?token=${getToken()}&outboundStatus=1&brandId=${this.beforIn.brandId}&categoryId=${this.beforIn.categoryId}${text}${endTime}${predictDateStart}${predictDateEnd}${startTime}${storeId}${storageId}`;
      
      window.location.href = str;
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
