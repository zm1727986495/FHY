<template>
  <div>
    <div class="m-bottom10 cargolocation">
      <div v-for="(item,index) in btnList" :key="index">
        <el-button
          size="small"
          class="button-96"
          v-if="btnJurisdiction[item.jurisdiction]"
          @click="butGroupAction(item.type)"
        >{{item.name}}</el-button>
      </div>
    </div>
    <div>
      <div class="table_list lvs attribute" v-loading='loading'>
        <el-table border style="width: 100%" :max-height="maxHeight" :row-class-name="tableRowClassName" :data="tableData" @selection-change="handleSelectionChange">
          <el-table-column align="center" type="selection" fixed="left"></el-table-column>
          <el-table-column align="center" label="查看"  fixed="left" width="80">
            <template slot-scope="scope">
              <div>
                <p class="table_action_span" @click="caigouorder(scope.row)">查看</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="factoryContractNo" label="采购合同号" width="140" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="orderNumber" label="订单号" width="120">
            <template slot-scope="scope">
               <div>
                  <p class="table_action_span" @click="orderDetails(scope.row)">{{scope.row.orderNumber}}</p>
                </div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="createTime" label="订单创建时间" width="160" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="storeName" label="所属门店" width="120" show-overflow-tooltip ></el-table-column>
          <el-table-column align="center" prop="status" label="状态" width="100">
            <template slot-scope="scope">
              <div>
                <span v-if="scope.row.status==0">未到货</span>
                <span v-if="scope.row.status==1">全部到货</span>
                <span v-if="scope.row.status==2">部分到货</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="totality" label="总数量" width="100" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="paidInCount" label="实际库存" width="100" show-overflow-tooltip></el-table-column>
          <!-- <el-table-column align="center" prop="settlementCost" label="订单成本" width="200"></el-table-column>
          <el-table-column align="center" prop="initialCost" label="订单收入" width="200"></el-table-column>-->
          <el-table-column align="center" prop="storageName" label="所属仓库" width="120" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="libraryOfAge" label="库龄" width="100"></el-table-column>
          <el-table-column align="center" prop="brandName" label="品牌" width="100"></el-table-column>
          <el-table-column align="center" prop="categoryName" label="品类" width="100" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="appointmentTime" label="预约上门时间" width="160"></el-table-column>
          <!-- <el-table-column align="center" prop="loading" label="备注" width="200" show-overflow-tooltip></el-table-column> -->
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
    <!-- 转为备货 -->
    <transferstock v-if="outerVisible" :orderId="orderId" :outerVisible="outerVisible" @outerVisibleFun="outerVisibleFun"></transferstock>

    <el-dialog :visible.sync="dialogModel" width="50%">
      <div class="titlecals">{{Dialogtitle}}</div>
      <div class="pl-20">
        <storageassignment></storageassignment>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogModel = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import pagination from "@/views/components/pagination";
import storageassignment from "./storageassignment";
import transferstock from "./transferstock";
import module from "../../../../../../config/index.js";

import { listStoragePurchaseOrderByPage } from "api/entrepotSet/inventorymanagement/orderInventory/orderInventory";
import { mapGetters } from "vuex";

export default {
  components: {
    storageassignment,
    transferstock,
    pagination
  },
  props:['bindInfo'],
  data() {
    return {
      tableSelectList: [], //选中数据
      orderId: "",
      tableData: [],
      currentPage: 1, //当前页数
      pageSize: 10, //总页数
      total: 0, //总条数
      operation: [],
      loading:true,
      dialogModel: false,
      outerVisible: false,
      Dialogtitle: "货位分配",
      btnList: [
        { name: "导出", type: 0, jurisdiction: "orderInventory_export" },
        {
          name: "货位分配",
          type: 1,
          jurisdiction: "orderInventory_assignment"
        },
        { name: "转为备货", type: 2, jurisdiction: "orderInventory_stoceup" }
      ],
      btnJurisdiction: JSON.parse(this.$loca.getItem("element"))
    };
  },
  computed: {
    ...mapGetters(["maxHeight"])
  },
  mounted() {
    this.getData();
  },
  methods: {
    //订单详情
    orderDetails(row) {
      this.$router.push({
        path: "/ordermm/details",
        query: { orderId: row.orderId }
      });
    },
    caigouorder(data) {
      // seepurchase
      this.$router.push({
        path: "seepurchase",
        query: { orderId: data.orderId, storageId: data.storageId }
      });
    },
    //获取订单库存列表
    getData(attr = {},type) {
      if(type){
        this.currentPage = 1;
      }
      let data = {
        text: attr.text,
        startTime: attr.dataValue ? attr.dataValue[0] : null,
        endTime: attr.dataValue ? attr.dataValue[1] : null,
        storageId: attr.storageId,
        storeIds: attr.storeIds,
        purchaseContractCode: attr.purchaseContractCode,
        page: this.currentPage,
        limit: this.pageSize
      };
      this.loading = true;
      listStoragePurchaseOrderByPage(data)
        .then(res => {
          if(res.status == 200){
            this.tableData = res.data.rows;
            this.total = res.data.total;
            this.loading = false;
          }else{
            this.loading = false;
          }
        })
        .catch(error => {
          this.loading = false;
          console.error("订单库存列表", error);
        });
    },
    //按钮
    butGroupAction(type) {
      if (type == 0) {
        console.log("导出");
        let str = module.dev.proxyTable["/api"].target + "/api/pc/storagePurchaseOrder/exportListStoragePurchaseOrder";
        window.location.href = str;
      } else if (type == 1) {
        if (this.selectproving()) {
          this.orderId = this.tableSelectList[0].orderId;
          let storageId = this.tableSelectList[0].storageId;
          //货位分配
          this.$router.push({
            path: "/inventorymanagement/stockallocation",
            query: { orderId: this.orderId, storageId: storageId }
          });
        }
      } else {
        if (this.selectproving()) {
          // this.orderId = this.tableSelectList[0].orderId
          // //转为备货
          // this.outerVisible = true;
          this.$router.push({
            path: "orderTransfer",
            query: {
              orderId: this.tableSelectList[0].orderId,
              brandId: this.tableSelectList[0].brandId,
              storageId: this.tableSelectList[0].storageId
            }
          });
        }
      }
    },
    selectproving() {
      if (this.tableSelectList.length > 1) {
        this.$message({
          message: "只能选择一个订单",
          type: "warning"
        });
        return false;
      } else if (this.tableSelectList.length < 1) {
        this.$message({
          message: "请选择订单",
          type: "warning"
        });
        return false;
      }
      return true;
    },
    //关闭弹框
    outerVisibleFun() {
      this.outerVisible = false;
    },
    //关闭弹框
    handleChange() {},
    numFun() {
      this.dialogModel = true;
      this.isShow = false;
    },
    handleSelectionChange(val) {
      this.tableSelectList = val;
    },
    tableRowClassName({ row, rowIndex }) {
      //表格斑马线设置
      return rowIndex % 2 != 0 ? "el-f0" : "";
    },
    sizeChange(val) {
      //翻页方法
      this.currentPage = 1;
      this.pageSize = val;
      this.getData(this.bindInfo);
    },
    currentChange(val) {
      //翻页方法
      this.currentPage = val;
      this.getData(this.bindInfo);
    }
  }
};
</script>
<style lang="scss" scoped>
.cargolocation {
  position: relative;
  display: flex;
  button {
    margin: 0px 5px;
  }
}
.pagination_wrap {
  text-align: center;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.quantity {
  width: 150px;
  position: absolute;
  background: #333333;
  z-index: 2;
  top: 31px;
  left: 73px;
  color: #fff;
  border-radius: 4px;
}
.input_numbers {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 5px 0;
  padding-bottom: 5px;
}

.areaorlocation {
  display: flex;
}
.area {
  li {
    width: 75px;
    height: 30px;
    line-height: 30px;
    border-bottom: 1px solid #ebeef5;
    background: #a2a2a2;
    cursor: pointer;
    text-align: center;
  }
}
.location {
  li {
    width: 75px;
    height: 30px;
    line-height: 30px;
    border-bottom: 1px solid #ebeef5;
    text-align: center;
    cursor: pointer;
  }
}
.bk {
  border-bottom: 1px solid #ebeef5;
}
.areabg {
  background: #333333 !important;
}
</style>
