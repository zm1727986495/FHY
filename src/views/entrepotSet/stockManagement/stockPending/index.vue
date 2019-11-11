<template>
  <div>
    <div class="head_nav">
      <!-- 导航栏 -->
      <breadcrumb :navList="navList"></breadcrumb>
    </div>
    <el-card>
      <div>
        <warehousingquery :loading='loading' ref="warehousingquery" @obtainFun="obtainFun"></warehousingquery>
      </div>
    </el-card>
    <div class="storagelist m-top10">
      <el-tabs type="border-card" @tab-click="handleClick">
        <el-tab-pane :label="item.name" v-for="(item,index) in filterBtnList" :key="index">
          <div v-if="item.type==0">
            <div class="m-bottom10">
              <el-button v-if="btnJurisdiction.stockPending_Warehousing" size="small" class="button-96" @click="warehousingFun">入库</el-button>
              <el-button v-if="btnJurisdiction.stockPending_Manual" size="small" class="button-96" @click="manualwarehousing">手动入库</el-button>
              <!-- <el-button size="small" class="button-96">入库完成</el-button> -->
            </div>
            <div class="table_list lvs attribute" v-loading='loading'>
              <el-table
                border
                style="width: 100%"
                :row-class-name="tableRowClassName"
                @selection-change="pendingDelete"
                :data="tableData"
                :max-height="maxHeight"
              >
                <el-table-column align="center" type="selection" fixed="left"></el-table-column>
                <el-table-column align="center" prop="purchaseNumber" label="单据单号" sortable width="150" fixed="left" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" prop="putInStorageType" label="入库类型" width="140">
                  <template slot-scope="scope">
                    <div class="statusStyle">
                      <span v-if="scope.row.putInStorageType==1">订单入库</span>
                      <span v-if="scope.row.putInStorageType==2">备货入库</span>
                      <span v-if="scope.row.putInStorageType==3">调拨入库</span>
                      <span v-if="scope.row.putInStorageType==4">其它入库</span>
                      <i class="many" v-if="scope.row.isTwo==1"></i>
                      <i class="manyStyle" v-if="scope.row.isTwo==1">二</i>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="arrivalNoticeCode" label="到货单号" width="140" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" prop="orderNumber" label="订单号" width="130" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <div>
                      <p
                        class="table_action_span"
                        @click="orderDetails(scope.row)"
                      >{{scope.row.orderNumber}}</p>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="receiptsName" label="单据类型" width="110"></el-table-column>
                <el-table-column align="center" prop="sourceCode" label="来源单号" width="150"></el-table-column>
                <el-table-column align="center" prop="purchaseContractCode" label="采购合同号" width="140" show-overflow-tooltip></el-table-column>

                <el-table-column align="center" prop="brandName" label="品牌" width="120"></el-table-column>
                <el-table-column align="center" prop="categoryName" label="品类" width="120"></el-table-column>
                <el-table-column align="center" prop="storageName" label="仓库" width="120"></el-table-column>
                <el-table-column align="center" prop="expectedArrivalDate" label="预计到货日期" width="160"></el-table-column>
                <el-table-column align="center" prop="storeName" label="所属门店" width="150" show-overflow-tooltip></el-table-column>

                <el-table-column align="center" prop="sourceDocuments" label="来源" width="120">
                  <template slot-scope="scope">
                    <div>
                      <span v-if="scope.row.sourceDocuments==1">手动</span>
                      <span v-if="scope.row.sourceDocuments==2">接口</span>
                      <span v-if="scope.row.sourceDocuments==3">到货单</span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="receivableSum" label="应收数量" width="120"></el-table-column>
                <el-table-column align="center" prop="username" label="导入人" width="100" show-overflow-tooltip></el-table-column>
              </el-table>
            </div>
          </div>
          <div v-if="item.type==1">
            <div class="m-bottom10">
              <el-button size="small" class="button-96" @click="exportFn">导出</el-button>
            </div>
            <div class="table_list lvs attribute" v-loading='loading'>
              <el-table
                border
                style="width: 100%"
                :row-class-name="tableRowClassName"
                :data="tableData"
                :max-height="maxHeight"
              >
                <el-table-column align="center" prop="purchaseNumber" label="单据单号" sortable width="170" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" prop="warehouseWarrantCode" label="入库单号" sortable width="170" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <div>
                      <p
                        class="table_action_span"
                        @click="warehousingFn(scope.row)"
                      >{{scope.row.warehouseWarrantCode}}</p>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="receiptsName" label="单据类型" width="120"></el-table-column>
                <el-table-column align="center" prop="putInStorageType" label="入库类型" width="120">
                  <template slot-scope="scope">
                    <div>
                      <span v-if="scope.row.putInStorageType==1">订单入库</span>
                      <span v-if="scope.row.putInStorageType==2">备货入库</span>
                      <span v-if="scope.row.putInStorageType==3">调拨入库</span>
                      <span v-if="scope.row.putInStorageType==4">其它入库</span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="orderNumber" label="订单号" width="150">
                  <template slot-scope="scope">
                    <div>
                      <p class="table_action_span" @click="orderDetails(scope.row)">{{scope.row.orderNumber}}</p>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="purchaseContractCode" label="采购合同号" width="170" show-overflow-tooltip
                ></el-table-column>
                <el-table-column align="center" prop="arrivalNoticeCode" label="到货单号" width="170"  show-overflow-tooltip></el-table-column>
                <el-table-column align="center" prop="storageName" label="入库仓库" width="120"></el-table-column>
                <el-table-column align="center" prop="sourceCode" label="来源单号" width="170" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" prop="brandName" label="品牌" width="120"></el-table-column>
                <el-table-column align="center" prop="categoryName" label="品类" width="120"></el-table-column>
                <el-table-column align="center" prop="storageTime" label="入库时间" width="170"></el-table-column>
                <el-table-column align="center" prop="storeName" label="所属门店" width="150" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" prop="sourceDocuments" label="来源" width="120">
                  <template slot-scope="scope">
                    <div>
                      <span v-if="scope.row.sourceDocuments==1">手动</span>
                      <span v-if="scope.row.sourceDocuments==2">接口</span>
                      <span v-if="scope.row.sourceDocuments==3">到货单</span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="receivableSum" label="应收数量" width="120"></el-table-column>
                <el-table-column align="center" prop="paidInCount" label="实收数量" width="120"></el-table-column>
                <el-table-column align="center" prop="initialCost" label="期初成本" width="120"></el-table-column>
                <el-table-column align="center" prop="settlementCost" label="实际成本" width="120"></el-table-column>
                <el-table-column align="center" prop="updatename" label="入库人" width="100" show-overflow-tooltip></el-table-column>
              </el-table>
            </div>
          </div>
        </el-tab-pane>
        <div class="pagination_wrap">
          <pagination
            :pageSizes='pageSizes'
            :current-page="currentPage"
            :pageSize="pageSize"
            :total="total"
            @sizeChange="sizeChange"
            @currentChange="currentChange"
          ></pagination>
        </div>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import breadcrumb from "@/views/components/breadcrumb";
import warehousingquery from "./components/warehousingquery";
import pagination from "@/views/components/pagination";
import { listPutInStorageByPage } from "api/entrepotSet/stockManagement/stockPending/stockPending";
import { mapGetters } from "vuex";
export default {
  components: {
    breadcrumb,
    warehousingquery,
    pagination
  },
  data() {
    return {
      // 按钮权限***********
      btnJurisdiction: JSON.parse(this.$loca.getItem("element")),
      loading:true,
      //按钮组
      filterBtnList: [{ name: "待入库", type: '0' }, { name: "已入库", type: '1' }],
      //单据类型
      documenttype: [
        { name: "正单", type: 0 },
        { name: "增单", type: 1 },
        { name: "补单", type: 2 },
        { name: "遗留单", type: 3 },
        { name: "备货入库", type: 4 },
        { name: "调拨入库", type: 5 },
        { name: "退货入库", type: 6 },
        { name: "上样", type: 7 },
        { name: "撤样", type: 8 },
        { name: "手动入库", type: 9 },
        { name: "退款", type: 10 },
        { name: "换货入库", type: 11 },
        { name: "接口入库", type: 12 },
        { name: "回库入库单", type: 13 },
        { name: "退库入库", type: 14 },
        { name: "第三方入库", type: 15 }
      ],
      pageSizes:[300,500,1000],
      currentPage: 1, //当前页数
      pageSize: 300, //总页数
      total: 0, //总条数
      tableData: [], //待入库和已入库列表
      statusType: "0", //切换状态
      pendingList: [], //勾选内容
      navList: [],
      queryObj:{}
    };
  },
  computed: {
    ...mapGetters(["maxHeight"])
  },
  // mounted() {
  //   this.navList = this.$route.meta;
  //   this.getData();
  // },
  activated(){
    this.navList = this.$route.meta;
    this.getData();
  },
  // deactivated () {
  //     this.$destroy(true)
  // },
  methods: {
    //订单详情
    orderDetails(row) {
      this.$router.push({
        path: "/ordermm/details",
        query: { orderId: row.orderId }
      });
    },
    //查询条件
    obtainFun(obj,page) {
      if(page){
        this.currentPage = 1;
      }
      this.queryObj = obj;
      this.getData();
    },
    //点击切换
    handleClick(val) {
      this.statusType = val.paneName;
      this.getData();
    },
    //获取待入库列表
    getData() {
      let data = {
        page: this.currentPage,
        limit: this.pageSize,
        text: this.queryObj.text,
        startTime: this.queryObj.dataValue ? this.queryObj.dataValue[0] : null,
        endTime: this.queryObj.dataValue ? this.queryObj.dataValue[1] : null,
        storageId: this.queryObj.storageId,
        status: this.statusType
      };
      this.loading = true;
      listPutInStorageByPage(data)
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
          console.error("获取待入库列表", error);
        });
    },
    //待入库勾选
    pendingDelete(val) {
      this.pendingList = val;
    },
    //表格斑马线设置
    tableRowClassName({ row, rowIndex }) {
      return rowIndex % 2 != 0 ? "el-f0" : "";
    },
    //翻页方法
    sizeChange(val) {
      this.currentPage = 1;
      this.pageSize = val;
      this.$refs.warehousingquery.searchFun();
    },
    //翻页方法
    currentChange(val) {
      this.currentPage = val;
      this.$refs.warehousingquery.searchFun();
    },
    //导出
    exportFn() {
      this.$router.push({ path: "export" });
    },
    //入库
    warehousingFun() {
      if (this.pendingList.length < 1) {
        this.$message.warning("您未勾选!");
      } else if (this.pendingList.length > 1) {
        // 勾选多个入库
        let isType = this.pendingList.every(item => {
          return item.putInStorageType == 1 || item.putInStorageType == 2;
        });

        let arr1 = this.pendingList.filter(item => {
          return item.putInStorageType == 1;
        });
        let arr2 = this.pendingList.filter(item => {
          return item.putInStorageType == 2;
        });
        let arr3 = this.pendingList.filter(item => {
          return item.putInStorageType == 3;
        });
        let arr4 = this.pendingList.filter(item => {
          return item.putInStorageType == 4;
        });
        if (arr3.length) {
          this.$message.error("当前有入库类型不能一起入库!");
          return;
        }
        if (arr4.length) {
          this.$message.error("当前有入库类型不能一起入库!");
          return;
        }

        // 订单和备货同一到货单*********************
        if (arr1.length != 0 || arr2.length != 0) {
          let isCode = this.pendingList.every(item => {
            return (item.arrivalNoticeCode == this.pendingList[0].arrivalNoticeCode &&item.arrivalNoticeCode);
          });
          let isTwo = this.pendingList.every(item => {
            return item.isTwo!=1
          });

          if(!isTwo){
            this.$message.error('当前数据有二次入库的信息!')
            return
          }


          if (isCode) {
            let arr = []; // 待入库ID
            let ary = []; // 单据类型
            this.pendingList.forEach(item => {
              arr.push(item.putInStorageId);
              ary.push(item.purchaseType);
            });
            // 包
            let packageId = [];//包
            let goodsId = [];//商品
            this.pendingList.forEach(item => {
              if (item.putInStorageType == 1) {
                if(item.isWay == 4){
                  packageId.push(item.putInStorageId);
                }else{
                  goodsId.push(item.putInStorageId);
                }
              }
            });

            // 商品
            this.pendingList.forEach(item => {
              if (item.putInStorageType == 2) {
                goodsId.push(item.putInStorageId);
              }
            });

            this.$router.push({
              path: "preparegoods",
              query: {
                packageId: packageId.join(","),
                goodsId: goodsId.join(","),
                putInStorageId: arr.join(","), // 待入库ID
                purchaseType: ary.join(","), // 单据类型
                storageId: this.pendingList[0].storageId,
                brandId: this.pendingList[0].brandId,
                arrivalNoticeCode: this.pendingList[0].arrivalNoticeCode
              }
            });
          } else {
            this.$message.error("到货单号不同!");
          }
        }
      } else {
        // 勾选单个入库******************
        let arr = [];
        this.pendingList.forEach(item => {
          arr.push(item.putInStorageId);
        });

        let {
          putInStorageType, //待入库
          storageId, //仓库ID
          storageName, //仓库名称
          arrivalNoticeCode, //到货单号
          brandId, //品牌ID
          purchaseType, //单据类型
          isWay, //入库方式
          purchaseNumber, //单据单号
          purchaseOrderId, //采购单ID
          categoryId, //品类
          putInStorageId, //待入库Id
          sourceId //来源ID
        } = this.pendingList[0]; //结构赋值
        //订单入库
        if (putInStorageType == 1) {
          // 二次入库
          if (this.pendingList[0].isTwo == 1) {
            this.$router.push({
              path: "rewarehousing",
              query: {
                putInStorageId: putInStorageId,
                putInStorageType,
                storageId,
                arrivalNoticeCode,
                purchaseOrderId,
                brandId,
                categoryId,
                purchaseNumber,
                purchaseType
              }
            });
          } else {
            this.$router.push({
              path: "warehousing",
              query: {
                putInStorageId: arr,
                putInStorageType,
                storageId,
                arrivalNoticeCode,
                isWay,
                purchaseOrderId,
                brandId,
                categoryId,
                purchaseNumber,
                purchaseType
              }
            });
          }
          return;
        }

        //备货入库
        if (putInStorageType == 2) {
          this.$router.push({
            path: "stockuplist",
            query: {
              putInStorageId: arr,
              putInStorageType,
              storageId,
              arrivalNoticeCode,
              purchaseType,
              brandId
            }
          });
          return;
        }

        //判断当前是不是调拨
        if (putInStorageType == 3) {
          this.$router.push({
            path: "allocation",
            query: {
              putInStorageId: arr,
              putInStorageType,
              storageId,
              storageName,
              arrivalNoticeCode,
              purchaseType
            }
          });
          return;
        }

        //其它入库**************************文件otherlist
        //判断当前是否是撤样
        if (purchaseType == 8) {
          this.$router.push({
            path: "withdrawal",
            query: {
              putInStorageId: arr,
              putInStorageType,
              storageId,
              purchaseType
            }
          });
        }
        // 判断当前是否是退货入库
        if (purchaseType == 6) {
          this.$router.push({
            path: "returngoods",
            query: {
              putInStorageId: arr,
              putInStorageType,
              storageId,
              purchaseType
            }
          });
        }

        // 判断当前是否是回库入库单
        if (purchaseType == 13) {
          this.$router.push({
            path: "returnstorage",
            query: {
              putInStorageId: arr,
              putInStorageType,
              storageId,
              purchaseType
            }
          });
        }

        // 判断当前是否是退库入库单
        if (purchaseType == 14) {
          this.$router.push({
            path: "retreatlibrary",
            query: {
              putInStorageId: arr,
              putInStorageType,
              storageId,
              purchaseType,
              sourceId
            }
          });
        }
      }
    },
    //点击入库单号
    warehousingFn(row) {
      this.$router.push({
        path: "warehousingquery",
        query: { warehouseWarrantId: row.warehouseWarrantId }
      });
    },
    //手动入库
    manualwarehousing() {
      let date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      let hour = date.getHours();
      let minute = date.getMinutes();
      let second = date.getSeconds();
      let time = `${year}-${month}-${day} ${hour}:${minute}:${
        second < 10 ? "0" + second : second
      }`;
      this.$router.push({ path: "manual", query: { time } });
    }
  }
};
</script>
<style lang="scss" scoped>
.storagelist {
  .statusStyle {
    position: relative;
  }
  .manyStyle {
    position: absolute;
    right: 7px;
    top: 0;
    color: #fff;
    width: 20px;
    height: 20px;
    font-size: 15px;
    font-style:normal;
    font-family: "宋体";
  }
  .many {
    position: absolute;
    right: 10px;
    top: 0px;
    display: block;
    width: 14px;
    height: 25px;
    background-color: #00479d;
  }
  .many:before {
    content: "";
    display: block;
    position: absolute;
    width: 0;
    height: 0;
    right: 14px;
    border-width: 11px 7px;
    border-style: solid;
    border-color: transparent #00479d transparent transparent;
  }

  .many:after {
    content: "";
    display: block;
    position: absolute;
    width: 0;
    height: 0;
    left: 14px;
    border-width: 11px 7px;
    border-style: solid;
    border-color: transparent transparent transparent #00479d;
    top: 0;
  }
  .pagination_wrap {
    text-align: center;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>

