<template>
  <div>
    <div class="head_nav">
      <!-- 导航栏 -->
      <breadcrumb :navList="navList"></breadcrumb>
    </div>
    <el-card>
      <div>
        <div class="head_list">
          <div class="input-vw">
            <el-input placeholder="入库单号/到货单号/入库人/订单号/采购合同号"  @keyup.enter.native='searchFun()' v-model="bindInfo.text" size="medium" class="width-100"></el-input>
          </div>
          <div class="input-vw">
            <div class="stock_time">
              <el-date-picker
                size="medium"
                v-model="dataValue"
                type="daterange"
                range-separator="-"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                style="width:100%"
                @change="timeChange"
              ></el-date-picker>
            </div>
          </div>
          <div class="input-vw">
            <el-select v-model="bindInfo.storageId" placeholder="仓库" size="medium" class="width-100">
              <el-option
                v-for="item in stateList"
                :key="item.storageId"
                :label="item.storageName"
                :value="item.storageId"
              ></el-option>
            </el-select>
          </div>

          <div class="input-vw">
            <div class="btnsList">
              <el-button type="warning" class="button-fc" size="medium" @click="searchFun" :loading='loading'>查询</el-button>
              <el-button type="primary" size="medium" @click="Reset">重置</el-button>
            </div>
          </div>
        </div>
      </div>
      <div class="h-width"></div>
      <div>
        <div class="m-bottom10">
          <el-button v-if="btnJurisdiction.warehousereceipt_Export" size="small" class="button-96" @click="exportButton">导出</el-button>
        </div>
        <div class="table_list lvs attribute" v-loading='loading'>
          <el-table border style="width: 100%" :row-class-name="tableRowClassName" :data="tableData" :max-height="maxHeight">
            <el-table-column align="center" prop="warehouseWarrantCode" show-overflow-tooltip label="入库单号" width="150" sortable>
              <template slot-scope="scope">
                <div>
                  <p
                    class="table_action_span"
                    @click="warehousingFn(scope.row)"
                  >{{scope.row.warehouseWarrantCode}}</p>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="arrivalNoticeCode" show-overflow-tooltip label="到货单号" width="140"></el-table-column>
            <el-table-column align="center" prop="storageTime" width="170" show-overflow-tooltip label="入库时间"></el-table-column>
            <el-table-column align="center" prop="accountingDate" width="170" show-overflow-tooltip label="记账日期"></el-table-column>
            <el-table-column align="center" prop="userName" width="120" label="入库人"></el-table-column>
            <el-table-column align="center" prop="storingTheResults" width="120" label="入库结果"></el-table-column>
            <el-table-column align="center" prop="warehouseAmount" width="120" label="数量"></el-table-column>
            <el-table-column align="center" prop="remarks" width="200" show-overflow-tooltip label="入库备注"></el-table-column>
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
    </el-card>
  </div>
</template>
<script>
import breadcrumb from "@/views/components/breadcrumb";
import { mapGetters } from "vuex";
import { listCompanyByAll } from "api/entrepotSet/stockManagement/arrivalNotice/arrivalNotice";
import pagination from "@/views/components/pagination";
import module from "../../../../../config/index.js";
import { getStorageList } from "api/entrepotSet/stockManagement/stockPending/stockPending";
import { listWarehouseWarrantByPage } from "api/entrepotSet/stockManagement/stockPending/stockPending";
export default {
  components: {
    breadcrumb,
    pagination
  },
  data() {
    return {
      // 按钮权限***********
      btnJurisdiction: JSON.parse(this.$loca.getItem("element")),
      loading:true,
      navList: [], //导航条
      bindInfo: {}, //查询条件
      dataValue: [], //时间
      supplierList: [],
      currentPage: 1, //当前页数
      pageSize: 10, //总页数
      total: 0, //总条数
      tableData: [],
      operation: [],
      stateList: []
    };
  },
  computed: {
    ...mapGetters(["maxHeight"])
  },
  // mounted() {
  //   this.navList = this.$route.meta;
  //   this.getData();
  //   this.getWarehouse();
  // },
  activated(){
    this.navList = this.$route.meta;
    this.getData();
    this.getWarehouse();
  },
  // deactivated () {
  //     this.$destroy(true)
  // },
  methods: {
    //时间
    timeChange() {
      this.bindInfo.startTime = this.dataValue ? this.dataValue[0] : "";
      this.bindInfo.endTime = this.dataValue ? this.dataValue[1] : "";
    },
    //获取仓库
    getWarehouse() {
      getStorageList()
        .then(res => {
          if (res.status == 200) {
            this.stateList = res.data;
          }
        })
        .catch(error => {
          console.error("获取所属仓库", error);
        });
    },
    //获取列表
    getData() {
      let data = {
        ...this.bindInfo,
        page: this.currentPage,
        limit: this.pageSize
      };
      this.loading = true;
      listWarehouseWarrantByPage(data).then(res => {
          if(res.status == 200){
            this.loading = false;
            this.tableData = res.data.rows;
            this.total = res.data.total;
          }else{
            this.loading = false;
          }
        }).catch(error => {
          this.loading = false;
          console.error("查询入库单列表", error);
        });
    },
    //点击入库单号
    warehousingFn(row) {
      this.$router.push({
        path: "warehousingquery",
        query: { warehouseWarrantId: row.warehouseWarrantId }
      });
    },
    //表格斑马线设置
    tableRowClassName({ row, rowIndex }) {
      return rowIndex % 2 != 0 ? "el-f0" : "";
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
    //导出
    exportButton() {
      let str =
        module.dev.proxyTable["/api"].target +
        "/api/pc/warehouseWarrant/exportListWarehouseWarrant";
      window.location.href = str;
    },
    //查询
    searchFun() {
      this.currentPage = 1;
      this.getData();
    },
    //重置
    Reset() {
      this.bindInfo = {};
      this.dataValue = [];
      this.getData();
      this.currentPage = 1;
    }
  }
};
</script>
<style lang="scss" scoped>
.head_list {
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
}
.input-vw {
  width: calc(((92.5vw - 250px)) / 4);
  margin-bottom: 20px;
  float: left;
  position: relative;
  display: flex;
  align-items: center;
}
// .pagination_wrap {
//   text-align: center;
//   height: 50px;
//   display: flex;
//   align-items: center;
//   justify-content: center;
// }
</style>
