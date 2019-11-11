<template>
  <div class="manual">
    <div class="head_nav">
      <breadcrumb :navList="navList"></breadcrumb>
    </div>
    <el-card>
      <div class="head_list">
        <div class="input-vw">
          <el-input
            placeholder="订单号/合同号"
            v-model="bindInfo.text"
            size="medium"
            class="width-100"
          >
          </el-input>
        </div>
        <div class="input-vw">
          <el-input placeholder="采购合同号" @keyup.enter.native='searchFun()' v-model="bindInfo.purchaseContractCode" size="medium" class="width-100"></el-input>
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
          <el-select
            v-model="bindInfo.storageId"
            placeholder="所属仓库"
            size="medium"
            class="width-100"
          >
            <el-option
              v-for="item in warehouseList"
              :key="item.storageId"
              :label="item.storageName"
              :value="item.storageId"
            ></el-option>
          </el-select>
        </div>
        <div class="input-vw">
          <el-select v-model="bindInfo.storeId" placeholder="所属门店" size="medium" class="width-100">
            <el-option
              v-for="item in listStoreList"
              :key="item.storeId"
              :label="item.storeName"
              :value="item.storeId"
            ></el-option>
          </el-select>
        </div>
        <div class="input-vw">
          <el-button type="warning" class="button-fc" size="medium" @click="searchFun">查询</el-button>
          <el-button type="primary" size="medium" @click="Reset">重置</el-button>
        </div>
        <div class="input-vw"></div>
        <div class="input-vw"></div>
      </div>
      <!-- <div class="btnsList">
        <el-button type="warning" class="button-fc" size="medium" @click="searchFun">查询</el-button>
        <el-button type="primary" size="medium" @click="Reset">重置</el-button>
      </div> -->
    </el-card>

    <el-card class="box-card m-top5">
      <div class="m-bottom">
        <span>类型：</span>
        <el-radio v-model="radio" label="1" @change="typeFun">定制品</el-radio>
        <el-radio v-model="radio" label="2" @change="typeFun">成品</el-radio>
      </div>
      <div class="table_list lvs attribute" v-if="radio==1" v-loading='loading'>
        <el-table
          border
          style="width: 100%"
          @selection-change="chooseDelete"
          :row-class-name="tableRowClassName"
          :data="tableData"
        >
          <el-table-column align="center" type="selection" fixed='left'></el-table-column>
          <el-table-column align="center" prop="storageName" label="所属仓库" sortable width="150"></el-table-column>
          <el-table-column
            align="center"
            prop="orderNumber"
            label="订单号"
            width="150"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <div>
                <p
                  class="table_action_span"
                  @click="orderDetails(scope.row)"
                >{{scope.row.orderNumber}}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="factoryContractNo" label="采购合同号" width="150" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="createTime" label="订单创建时间" width="170"></el-table-column>
          <el-table-column align="center" prop="amount" label="数量" width="120"></el-table-column>
          <el-table-column align="center" prop="storeName" label="所属门店" width="200" show-overflow-tooltip></el-table-column>
        </el-table>
      </div>
      <div class="table_list lvs attribute" v-if="radio==2" v-loading='loading'>
        <el-table
          border
          style="width: 100%"
          @selection-change="chooseDelete"
          :row-class-name="tableRowClassName"
          :data="tableData"
        >
          <el-table-column align="center" type="selection" fixed='left'></el-table-column>
          <el-table-column align="center" prop="storageName" label="所属仓库" width="140"></el-table-column>
          <!-- <el-table-column align="center" prop="inventoryStatus" label="库存状态" width="120">
            <template slot-scope="scope">
              <div>
                <p v-if="scope.row.inventoryStatus==1">正常</p>
                <p v-if="scope.row.inventoryStatus==2">严重不足</p>
                <p v-if="scope.row.inventoryStatus==3">库存过少</p>
                <p v-if="scope.row.inventoryStatus==4">库存过多</p>
                <p v-if="scope.row.inventoryStatus==5">严重过多</p>
              </div>
            </template>
          </el-table-column> -->
          <el-table-column align="center" prop="commodityName" label="商品名称" width="150" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="commodityCode" label="商品编码" width="150" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="commodityModel" label="商品型号" width="150"></el-table-column>
          <el-table-column align="center" prop="materialName" label="商品材质" width="150" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="colourName" label="商品颜色" width="150" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="theActualInventory" label="实际库存" width="130"></el-table-column>
          <el-table-column align="center" prop="number" label="出货数量" width="120">
            <template slot-scope="scope">
              <div>
                <el-input
                  v-model.number="scope.row.number"
                  @input="shipments(scope.row.number,scope.row.theActualInventory)"
                  size="mini"
                ></el-input>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="status" label="商品属性" width="150">
             <template slot-scope="scope">
                <div>
                  <p v-if="scope.row.status==1">正常</p>
                  <p v-if="scope.row.status==2">严重呆滞品</p>
                  <p v-if="scope.row.status==3">呆滞品</p>
                </div>
              </template>
          </el-table-column>
          <el-table-column align="center" prop="commodityUnit" label="计量单位" width="120"></el-table-column>
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

      <div class="btn">
        <el-button type="primary" @click="manualconfirm">确 定</el-button>
        <el-button @click="handleClose">取 消</el-button>
      </div>
    </el-card>
  </div>
</template>
<script>
import {
  listStockUpGoodsByPage, //备货库存查询列表  成品
  listStoragePurchaseOrderByPage, //订单库存查询列表 定制品
  getStoragePurchaseOrder //根据订单id获取订单采购单详情
} from "api/entrepotSet/allocationmanage/tobeallocated/tobeallocated";
import {
  getStorageList,
  listStore
} from "api/entrepotSet/inventorymanagement/orderInventory/orderInventory";
import { addOutbound } from "api/entrepotSet/outgoingManagement/outgoingManagement";
import breadcrumb from "@/views/components/breadcrumb";
import pagination from "@/views/components/pagination";
import { getUUID } from "api/pulicJava";
export default {
  components: {
    pagination,
    breadcrumb
  },
  data() {
    return {
      radio: "1",
      choseArr: [],
      tableData: [],
      navList: [],
      currentPage: 1, //当前页数
      pageSize: 20, //当前页最大条数
      total: 0, //总条数
      isShow: false,
      isFlag: false,
      bindInfo: {}, //查询条件
      dataValue: [],
      loading:true,
      warehouseList: [], //仓库
      listStoreList: [] //门店
    };
  },
  mounted() {
    this.navList = this.$route.meta;
    this.getStockUp();
    this.getWarehouse();
    this.getListStore();
  },
  methods: {
    //订单详情
    orderDetails(row) {
      this.$router.push({
        path: "/ordermm/details",
        query: { orderId: row.orderId }
      });
    },
    //时间
    timeChange() {
      this.bindInfo.startTime = this.dataValue ? this.dataValue[0] : "";
      this.bindInfo.endTime = this.dataValue ? this.dataValue[1] : "";
    },
    //获取列表
    getStockUp() {
      this.tableData=[];
      this.total = 0;
      let data = {
        ...this.bindInfo,
        page: this.currentPage,
        limit: this.pageSize
      };
      this.loading = true;
      if (this.radio == 1) {
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
            console.error("订单库存查询列表", error);
          });
      } else {
        listStockUpGoodsByPage(data)
          .then(res => {
            if(res.status == 200){
              this.tableData = res.data.rows.map(item => {
                return { number: "", ...item };
              });
              this.total = res.data.total;
              this.loading = false;
            }else{
              this.loading = false;
            }
          })
          .catch(error => {
            this.loading = false;
            console.error("备货库存查询列表", error);
          });
      }
    },
    typeFun(val) {
      if (val == 1) {
        this.getStockUp();
      } else {
        this.getStockUp();
      }
    },
    // 查询
    searchFun() {
      this.getStockUp();
    },
    //重置
    Reset() {
      this.bindInfo = {};
      this.dataValue = [];
      this.searchFun()
    },
    //获取仓库
    getWarehouse() {
      getStorageList()
        .then(res => {
          this.warehouseList = res.data;
        })
        .catch(error => {
          console.error("获取仓库", error);
        });
    },
    //获取门店
    getListStore() {
      listStore()
        .then(res => {
          console.log(res);
          this.listStoreList = res.data;
        })
        .catch(error => {
          console.error("", error);
        });
    },
    //关闭
    handleClose() {
      this.$router.go(-1);
    },
    //输入出货数量验证
    shipments(shipnum, actualnum) {
      if (shipnum > actualnum) {
        this.$message.error("出货数量不能大于实际库存");
        this.isShow = false;
      } else if (shipnum < 0) {
        this.$message.error("出货数量不能小于0");
        this.isShow = false;
      } else if (isNaN(shipnum)) {
        this.$message.error("出货数量格式有误");
        this.isShow = false;
      } else {
        this.isShow = true;
      }
    },
    //手动出库确认
    manualconfirm() {
      if (this.choseArr.length == 0) {
        this.$message.error("您未勾选!");
        return;
      }
      if (!this.isFlag) {
        this.$message.error("仓库不同!");
        return;
      }

      let data = {};
      if (this.radio == 2) {
        if (!this.isShow) {
          this.$message.error("数量格式与实际库存不符!");
          return;
        }
        let ary = [];
        this.choseArr.forEach(item => {
          ary.push(item.number);
        });
        let flag = ary.every(item => {
          return item;
        });

        if (!flag) {
          this.$message.error("您没有填写数量或者数量为0!");
          return;
        }
        let arr = [];
        this.choseArr.forEach(item => {
          arr.push({
            inventoryGoodsId: item.inventoryGoodsId,
            storagePurchaseOrderId: item.storagePurchaseOrderId,
            inventoryNumber: item.storageNumber,
            purchaseOrderId: item.purchaseOrderId,
            number: item.number,
            skuGoodsId: item.skuGoodsId
          });
        });
        data = {
          outboundStatus: 3,
          outboundType: 5,
          storageId: this.choseArr[0].storageId,
          goodsList: arr
        };
        getUUID({ serialNumber: "ST" }).then(res => {
          data.outboundNumber = res.data;
          addOutbound(data)
            .then(res => {
              console.log(res);
              if (res.status == 200) {
                this.$message.success("提交成功");
                this.$router.go(-1);
              }
            })
            .catch(error => {
              console.error("手动出库确认", error);
            });
        });
      } else {
        let arr = [];
        this.choseArr.forEach(item => {
          arr.push(item.orderId);
        });
        let data = {
          orderList: arr.join(",")
        };
        getStoragePurchaseOrder(data).then(res => {
          if (res.data.length == 0) {
            this.$message.error("此订单已经出库完!");
            return;
          }
          this.$router.push({
            path: "/allocationmanage/choseord",
            query: {
              orderId: arr,
              isType: "1",
              storageId: this.choseArr[0].storageId
            }
          });
        });
      }
    },
    //表格斑马线设置
    tableRowClassName({ row, rowIndex }) {
      return rowIndex % 2 != 0 ? "el-f0" : "";
    },
    //勾选
    chooseDelete(val) {
      if (val.length == 0) {
        this.choseArr = val;
        return;
      }
      let str = val[0].storageId;
      this.isFlag = val.every(item => {
        return item.storageId == str;
      });
      if (this.isFlag) {
        this.choseArr = val;
      } else {
        this.$message.error("仓库不同!");
        this.choseArr = val;
      }
    },
    //翻页方法
    sizeChange(val) {
      this.currentPage = 1;
      this.pageSize = val;
      this.getStockUp();
    },
    //翻页方法
    currentChange(val) {
      this.currentPage = val;
      this.getStockUp();
    }
  }
};
</script>
<style lang="scss" scoped>
.btn {
  display: flex;
  justify-content: center;
  padding: 20px 0;
}
.btnsList {
  display: flex;
  justify-content: center;
}
.head_list {
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
}
.input-vw {
  width: calc(((92.5vw - 250px)) / 4);
  margin-bottom: 10px;
  float: left;
  position: relative;
  display: flex;
  // justify-content: center;
  align-items: center;
}
</style>
