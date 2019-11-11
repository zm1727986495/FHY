<template>
  <div class="procurement">
    <div class="head_nav">
      <breadcrumb :navList="navList"></breadcrumb>
    </div>
    <el-card class="box-card">
      <div v-if="dataList.length!=0">
        <div class="m-top10">
          <div class="iconBox">
            <i class="Icon"></i>
            <span>订单</span>
          </div>
        </div>
        <div class="orderList m-top10">
          <el-checkbox class="m-left10" v-model="Allelection" v-if="dataList.length!==0">全选</el-checkbox>
          <div v-for="(item,index) in dataList" :key="index">
            <div class="order_item m-bottom" v-if="item.unpackingDataVOS.length!==0">
              <div class="item_header">
                <el-checkbox class="m-left10" v-model="item.checked" @change="checkfather(index)"></el-checkbox>
                <div class="purchase">
                  <span class="span_title">采购单号：</span>
                  <span>{{item.purchaseNumber}}</span>
                </div>
                <div class="purchase">
                  <span class="span_title">仓库：</span>
                  <span>{{item.storageName}}</span>
                </div>
                <!-- <div class="purchase">
                  <span class="span_title">订单号：</span>
                  <span>{{item.orderNumber}}</span>
                </div>-->
              </div>
              <div class="item_body">
                <div class="item_div">
                  <ul>
                    <li>
                      <span>名称</span>
                    </li>
                    <li>
                      <span>数量</span>
                    </li>
                    <!-- <li>
                      <span>查货数</span>
                    </li>-->
                    <li class="item_tiele textAl">
                      <div class="li_detail1">详情</div>
                    </li>
                  </ul>

                  <ul v-for="(pro,i) in item.unpackingDataVOS" :key="i">
                    <li>
                      <span class="li_pro">
                        <span>{{pro.unpackingName}}</span>
                      </span>
                    </li>
                    <li>
                      <span class="li_pro">{{pro.inventoryNumberSum}}</span>
                    </li>
                    <!-- <li>
                      <span class="li_pro">{{pro.factorySeeNumber}}</span>
                    </li>-->
                    <li class="item_tiele">
                      <div class="li_detail2" v-for="(attr,k) in pro.storageSiteVOS" :key="k">
                          {{attr.siteCode}}
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="table_list lvs attribute conetBox m-top10" v-for="(item,index) in dataList" :key="index">
          <div v-if="item.inventoryGoodsVOS.length!==0">
            <div class="item_header">
              <el-checkbox class="m-left10" v-model="item.checked" @change="checkfather(index)"></el-checkbox>
              <div class="purchase">
                <span class="span_title">采购单号：</span>
                <span>{{item.purchaseNumber}}</span>
              </div>
              <div class="purchase">
                <span class="span_title">采购合同号：</span>
                <span>{{item.purchaseContractCode}}</span>
              </div>
              <div class="purchase">
                <span class="span_title">订单号：</span>
                <span>{{item.orderNumber}}</span>
              </div>
            </div>
            <el-table border :row-class-name="tableRowClassName" :data="item.inventoryGoodsVOS">
              <el-table-column align="center" prop="commodityName" label="名称" width="150" show-overflow-tooltip></el-table-column>
              <el-table-column align="center" prop="inventoryNumber" label="数量" width="80"></el-table-column>
              <!-- <el-table-column align="center" prop="factorySeeNumber" label="查货数"></el-table-column> -->
              <el-table-column align="center" prop="regionSite" label="货位" width="130" show-overflow-tooltip></el-table-column>
              <el-table-column align="center" prop="firstInstallationTime" label="库龄" width="80"></el-table-column>
              <el-table-column align="center" prop="contractMoney" label="入库时间" width="160"></el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </el-card>
    <div class="btn">
      <el-button type="primary" @click="manualconfirm" :loading="loadingBtn">确 定</el-button>
      <el-button @click="handleClose">取 消</el-button>
    </div>
  </div>
</template>
<script>
import { listPurchaseOrder } from "api/Installation/dispatchcenter/dispatchcenter";
import {
  getStoragePurchaseOrderByStorage, //根据订单id获取订单采购单详情
  addTransfersApply, //添加调拨申请单
  checkPurchaseOrder,//判断采购单是否正在出库
} from "api/entrepotSet/allocationmanage/tobeallocated/tobeallocated";
import { addOutbound } from "api/entrepotSet/outgoingManagement/outgoingManagement";
import { getUUID } from "api/pulicJava";
import breadcrumb from "@/views/components/breadcrumb";
export default {
  components: {
    breadcrumb
  },
  data() {
    return {
      dataList: [],
      tableData: [],
      navList: [],
      form: {},
      loadingBtn:false
    };
  },
  created() {
    this.navList = this.$route.meta;
    let { orderId } = this.$route.query;
    if (orderId instanceof Array) {
      this.orderId = orderId;
      this.gerlistOrder();
    } else {
      this.orderId = orderId.split(",");
      this.gerlistOrder();
    }
  },
  methods: {
    //父复选框
    checkfather(idx) {
      this.dataList.forEach(item => {
        item.unpackingDataVOS.forEach(attr => {
          attr.flag = item.checked;
        });
      });
    },
    //订单采购单的货区货位
    gerlistOrder() {
      let data = {
        orderList: this.orderId.join(","),
        storageId:this.$route.query.bringUpTheLibraryId
      };
      getStoragePurchaseOrderByStorage(data).then(res => {
        this.dataList = res.data.map(item => {
          if (!item.inventoryGoodsVOS) {
            item.inventoryGoodsVOS = [];
          }
          if (!item.unpackingDataVOS) {
            item.unpackingDataVOS = [];
          }
          return { checked: false, ...item };
        });
      });
    },

    orderData() {
      //处理货区货位数据
      let ary = [];
      this.dataList.forEach(item => {
        if (item.checked) {
          //处理采购下包的数据
          let obj = {};
          let asy = [];
          obj.purchaseOrderId = item.purchaseOrderId;
          obj.storagePurchaseOrderId = item.storagePurchaseOrderId;
          obj.deliveryNumber = item.deliveryNumber;
          obj.storageId = item.storageId;
          if (item.unpackingDataVOS&&item.unpackingDataVOS.length) {
            let DataVOtotal = 0; //包总数量
            item.unpackingDataVOS.forEach(attr => {
              let DataVOSum = 0; //包数量
              let sto = [];
              let os = {};
              os.inventoryPurchasePackageId = attr.inventoryPurchasePackageId;
              if(attr.storageSiteVOS&&attr.storageSiteVOS.length){
                attr.storageSiteVOS.forEach(key => {
                  sto.push({
                    inventoryPurchasePackageDetailId:
                      key.inventoryPurchasePackageDetailId,
                    inventoryNumber: key.inventoryNumber
                  });
                  DataVOSum += key.inventoryNumber;
                });
              }
              os.storageSiteVOS = sto;
              os.outboundNumber = DataVOSum;
              DataVOtotal += os.outboundNumber;
              asy.push(os);
            });
            obj.deliveryNumber = DataVOtotal;
            obj.unpackingDataVOS = asy;
          } else {
            //处理采购下商品的数据
            let GoodsVOSum = 0; //商品总数量
            let invent = [];
            if(item.inventoryGoodsVOS&&item.inventoryGoodsVOS.length){
              item.inventoryGoodsVOS.forEach(attr => {
                invent.push({
                  inventoryGoodsId: attr.inventoryGoodsId,
                  inventoryNumber: attr.inventoryNumber
                });
                GoodsVOSum += attr.inventoryNumber;
              });
              obj.commoditySKUVOS = invent;
              obj.deliveryNumber = GoodsVOSum;
            }
          }
          ary.push(obj);
        }
      });
      return ary;
    },
    //确认
    manualconfirm() {
      if (this.$route.query.isType == 1) {
        let arr = [];
        this.dataList.forEach(item => {
          if (item.checked) {
            arr.push(item.storagePurchaseOrderId);
          }
        });
        let data = {
          outboundStatus: 3,
          outboundType: 5,
          storageId: this.$route.query.storageId,
          idList: arr
        };
        getUUID({ serialNumber: "ST" }).then(res => {
          data.outboundNumber = res.data;
          addOutbound(data)
            .then(res => {
              if(res.status==200){
                this.$message.success('出库成功!')
                this.$router.push({path:'/outgoingManagement/outofstock'})
              }
            })
            .catch(error => {
              console.error("手动出库", error);
            });
        });
      }
      if (this.$route.query.isType == 2) {
        if(this.orderId.length==1){
          this.form.orderId = this.orderId[0];
        }
        let dataList = this.orderData();
        console.log(dataList);
        this.form.purchaseOrderList = dataList.map(item => {
          return item.storagePurchaseOrderId;
        });
        
        
        this.form.status = 0; //状态  0 未生成调拨单
        this.form.type = 2; //type   1商品  2 订单
        this.form.transfersSource = 3; //transfersSource2 备货 3 订单
        this.form.applyType = 5; //5 仓库
        this.form.theWarehousingId = this.$route.query.theWarehousingId; //调入仓id
        this.form.bringUpTheLibraryId = this.$route.query.bringUpTheLibraryId; //调出仓id
        this.form.pickUpTime = this.$route.query.pickUpTime;//提货时间
        let sum = 0;
        let ary = []
        let purchaseList=[]
        dataList.forEach(item => {
          sum = item.deliveryNumber + sum;
          ary.push(item.storageId)
          purchaseList.push(item.storagePurchaseOrderId)
        });

        this.form.transfersNumber = sum; //调拨总数量
        let flag = Math.max.apply(null, ary) == Math.min.apply(null, ary);
        if(!flag){
          this.$message.error('当前采购单仓库不一致!')
          return
        }
        let data = {
         purchaseOrderIdList:purchaseList.join(',')
        }
        checkPurchaseOrder(data).then(res=>{
          if(res.status == 200){
            this.loadingBtn = true;
            addTransfersApply(this.form).then(res => {
              if (res.status == 200) {
                this.loadingBtn = false;
                this.$message.success("添加待调拨任务成功");
                this.$router.push({path: "tobeallocated"});
              }else{
                this.loadingBtn = false;
              }
            }).catch(error => {
              this.loadingBtn = false;
              console.error(error + "添加待调拨任务");
            });
          }else{
            this.$message.error(res.message);
          }
        })
      }
    },
    //取消
    handleClose() {
      this.$router.go(-1);
    },
    //表格斑马线设置
    tableRowClassName({ row, rowIndex }) {
      return rowIndex % 2 != 0 ? "el-f0" : "";
    }
  },
  computed: {
    Allelection: {
      get() {
        let str = this.dataList.every(item => {
          return item.checked;
        });
        return str;
      },
      set(val) {
        this.dataList.forEach(item => {
          item.checked = val;
        });
        this.dataList.forEach(item => {
          item.unpackingDataVOS.forEach(attr => {
            attr.flag = item.checked;
          });
        });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.procurement {
  .btn {
    display: flex;
    justify-content: center;
    padding: 20px 0;
  }
  .purchase {
    min-width: 400px;
  }
  .conetBox {
    padding: 0 20px;
  }
  .details {
    display: flex;
    width: 100%;
    .left {
      width: 100px;
      text-align: center;
      color: #409eff;
    }
    .center {
      width: 100%;
      text-align: center;
      color: #409eff;
    }
    .right {
      width: 100px;
      text-align: left;
      color: #409eff;
    }
  }
  .item_header {
    > span {
      width: 80px;
    }
    background-color: #f5f7fa;
    height: 50px;
    line-height: 50px;
    display: flex;
    flex-wrap: nowrap;
    div {
      // width: 25%;
      .span_title {
        font-weight: bold;
      }
    }
  }
  .orderList {
    font-size: 14px;
    // max-height: 650px;
    padding: 0 20px;
    .order_item {
      width: 100%;
      border: 1px solid #f5f7fa;

      .item_body {
        max-height: 400px;
        overflow-y: auto;
        overflow-x: auto;
        .item_div {
          display: flex;
          flex-wrap: nowrap;
          ul {
            border-right: 1px solid #f5f7fa;
            .item_tiele {
              height: calc(100% - 62px);
            }
            .textAl {
              display: flex;
              align-items: center;
            }
          }
          li {
            border-bottom: 1px solid #f5f7fa;
          }
          span {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 80px;
            height: 30px;
          }
          .li_detail1 {
            display: flex;
            justify-content: center;
            align-items: center;
            flex: 1;
          }
          .li_pro {
            display: flex;
            width: 150px;
            text-align: center;
          }
          .li_detail2 {
            min-width: 150px;
            padding: 10px 0;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            text-align: center;
            color: #409eff;
          }
        }
      }
    }
  }
}
</style>
