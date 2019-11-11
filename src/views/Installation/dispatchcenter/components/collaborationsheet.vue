<template>
  <div class="collaborationsheet">
    <div class="table_list lvs attribute rl-padding20">
      <el-table border :row-class-name="tableRowClassName" :data="tableData">
        <el-table-column
          align="center"
          prop="installationOrderStatus"
          label="订单状态"
          width="200"
          sortable
        >
          <template slot-scope="scope">
            <div>
              <p v-if="scope.row.installationOrderStatus==0">未接单</p>
              <p v-if="scope.row.installationOrderStatus==1">已转单</p>
              <p v-if="scope.row.installationOrderStatus==2">转单被拒</p>
              <p v-if="scope.row.installationOrderStatus==3">已接单未通知</p>
              <p v-if="scope.row.installationOrderStatus==4">已通知未预约</p>
              <p v-if="scope.row.installationOrderStatus==5">派单已撤销</p>
              <p v-if="scope.row.installationOrderStatus==6">已预约待指派</p>
              <p v-if="scope.row.installationOrderStatus==7">安装中</p>
              <p v-if="scope.row.installationOrderStatus==8">汇报未完成</p>
              <p v-if="scope.row.installationOrderStatus==9">汇报已完成</p>
              <p v-if="scope.row.installationOrderStatus==10">回访中</p>
              <p v-if="scope.row.installationOrderStatus==11">回访驳回</p>
              <p v-if="scope.row.installationOrderStatus==12">已完成</p>
              <p v-if="scope.row.installationOrderStatus==13">已预约未确定</p>
              <p v-if="scope.row.installationOrderStatus==14">已指派待派单</p>
              <p v-if="scope.row.installationOrderStatus==15">待安装</p>
              <p v-if="scope.row.installationOrderStatus==16">已回访未结算</p>
              <p v-if="scope.row.installationOrderStatus==17">已回访已结算</p>
              <p v-if="scope.row.installationOrderStatus==18">汇报未完成已预约</p>
              <p v-if="scope.row.installationOrderStatus==19">回访未完成已预约</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="customerContractNumber" label="采购合同号" width="200"></el-table-column>
        <el-table-column align="center" prop="source" label="来源" width="200">
          <template slot-scope="scope">
            <div>
              <p v-if="scope.row.source==1">销售</p>
              <p v-if="scope.row.source==2">上样</p>
              <p v-if="scope.row.source==3">转移</p>
              <p v-if="scope.row.source==4">售后</p>
              <p v-if="scope.row.source==5">400</p>
              <p v-if="scope.row.source==6">撤样</p>
              <p v-if="scope.row.source==7">第三方</p>
              <p v-if="scope.row.source==8">退货</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="customerName" label="客户姓名" width="120"></el-table-column>
        <el-table-column align="center" prop="customerPhone" label="客户电话" width="120"></el-table-column>
        <el-table-column
          align="center"
          prop="address"
          label="订单地址"
          width="300"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column align="center" prop="predictInstallationTime" label="预计安装日期" width="200"></el-table-column>
        <el-table-column align="center" prop="visitTime" label="预约上门时间" width="200"></el-table-column>
        <el-table-column align="center" prop="orderType" label="订单类型" width="200">
          <template slot-scope="scope">
            <div>
              <p v-if="scope.row.orderType==0">正单</p>
              <p v-if="scope.row.orderType==1">增单</p>
              <p v-if="scope.row.orderType==2">补单</p>
              <p v-if="scope.row.orderType==3">遗留单</p>
              <p v-if="scope.row.orderType==4">备货采购单</p>
              <p v-if="scope.row.orderType==5">调拨入库单</p>
              <p v-if="scope.row.orderType==6">退货入库单</p>
              <p v-if="scope.row.orderType==7">上样</p>
              <p v-if="scope.row.orderType==8">撤样</p>
              <p v-if="scope.row.orderType==9">手动</p>
              <p v-if="scope.row.orderType==10">退款</p>
              <p v-if="scope.row.orderType==11">换货</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="orderGoodsType" label="订单货品类型" width="200">
          <template slot-scope="scope">
            <div>
              <p v-if="scope.row.orderGoodsType==1">定制</p>
              <p v-if="scope.row.orderGoodsType==2">成品</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="brandName" label="品牌" width="200"></el-table-column>
        <el-table-column align="center" prop="categoryName" label="品类" width="200"></el-table-column>
        <el-table-column align="center" prop="contractMoney" label="合同金额/元" width="200"></el-table-column>

        <el-table-column
          align="center"
          prop="storeName"
          label="所属门店"
          width="200"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column align="center" prop="givenTime" label="合同签订日期" width="200"></el-table-column>
        <el-table-column align="center" prop="remakes" label="备注" width="200"></el-table-column>
      </el-table>
    </div>
    <div class="pagination_wrap">
      <pagination
        :current-page="currentPage"
        :pageSize="pageSize"
        :total="total"
        @sizeChange="sizeChange"
        @currentChange="currentChange"
      ></pagination>
    </div>
  </div>
</template>
<script>
import pagination from "@/views/components/pagination";
import { listSynergyOrder } from "api/Installation/dispatchcenter/dispatchcenter";
import { error } from "util";
export default {
  props: {
    choseArr: Array
  },
  components: {
    pagination
  },
  data() {
    return {
      tableData: [],
      currentPage: 1, //当前页数
      pageSize: 20, //总页数
      total: 0 //总条数
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    //获取列表数据
    getData() {
      let data = {
        page: this.currentPage,
        limit: this.pageSize,
        installationOrderId: this.choseArr[0].installationOrderId,
        customerName: this.choseArr[0].customerName,
        customerPhone: this.choseArr[0].customerPhone,
        address: this.choseArr[0].address,
      };
      listSynergyOrder(data)
        .then(res => {
          console.log(res);
          this.tableData = res.data.rows;
        })
        .catch(error => {
          console.error("获取协同单列表", error);
        });
    },
    //翻页方法
    sizeChange(val) {
      this.currentPage = 1;
      this.pageSize = val;
      this.getData();
    },

    //翻页方法
    currentChange(val) {
      this.currentPage = val;
      this.getData();
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
