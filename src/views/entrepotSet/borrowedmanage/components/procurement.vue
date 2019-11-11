<template>
  <div class="procurement" v-if="dataList.length!=0">
    <div class="h-width"></div>
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
              <span class="span_title">采购合同号：</span>
              <span>{{item.purchaseContractCode}}</span>
            </div>
            <div class="purchase">
              <span class="span_title">订单号：</span>
              <span>{{item.orderNumber}}</span>
            </div>
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
                <li>
                  <span>查货数</span>
                </li>
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
                <li>
                  <span class="li_pro">{{pro.factorySeeNumber}}</span>
                </li>
                <li class="item_tiele">
                  <div class="li_detail2" v-for="(attr,k) in pro.storageSiteVOS" :key="k">
                    <div class="details">
                      <p class="left">{{attr.regionName}}</p>
                      <p class="center">{{attr.siteCode}}</p>
                      <p class="right">数量{{attr.inventoryNumber}}</p>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      class="table_list lvs attribute conetBox m-top20"
      v-for="(item,index) in dataList"
      :key="index"
    >
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
          <el-table-column align="center" prop="commodityName" label="名称" sortable></el-table-column>
          <el-table-column align="center" prop="inventoryNumber" label="数量"></el-table-column>
          <el-table-column align="center" prop="factorySeeNumber" label="查货数"></el-table-column>
          <el-table-column align="center" prop="regionSite" label="货位" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="firstInstallationTime" label="库龄"></el-table-column>
          <el-table-column align="center" prop="contractMoney" label="入库时间"></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
import { listPurchaseOrder } from "api/Installation/dispatchcenter/dispatchcenter";
import { error } from "util";
export default {
  props: ["orderId"],
  data() {
    return {
      dataList: [],
      tableData: []
    };
  },
  mounted() {
    this.gerlistOrder();
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
        // orderId: this.orderId
        orderId: 1,
      };
      listPurchaseOrder(data)
        .then(res => {
          this.dataList = res.data.rows.map(item => {
            return { checked: false, ...item };
          });
        })
        .catch(error => {
          console.error("订单采购单的货区货位", error);
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
          obj.storagePurchaseOrderId = item.storagePurchaseOrderId;
          obj.deliveryNumber = item.deliveryNumber;
          if (item.unpackingDataVOS.length !== 0) {
            let DataVOtotal = 0; //包总数量
            item.unpackingDataVOS.forEach(attr => {
              let DataVOSum = 0; //包数量
              let sto = [];
              let os = {};
              os.inventoryPurchasePackageId = attr.inventoryPurchasePackageId;
              attr.storageSiteVOS.forEach(key => {
                sto.push({
                  inventoryPurchasePackageDetailId:
                    key.inventoryPurchasePackageDetailId,
                  inventoryNumber: key.inventoryNumber
                });
                DataVOSum += key.inventoryNumber;
              });
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
          ary.push(obj);
        }
      });
      console.log(ary);

      return ary;
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
    background-color: #dcdcdc;
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
    max-height: 650px;
    padding: 0 20px;
    .order_item {
      width: 100%;
      border: 1px solid #EBEEF5;

      .item_body {
        max-height: 400px;
        overflow-y: auto;
        overflow-x: auto;
        .item_div {
          display: flex;
          flex-wrap: nowrap;
          ul {
            border-right: 1px solid #EBEEF5;
            .item_tiele {
              height: calc(100% - 90px);
            }
            .textAl {
              display: flex;
              align-items: center;
            }
          }
          li {
            border-bottom: 1px solid #EBEEF5;
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
            width: 300px;
            text-align: center;
          }
          .li_detail2 {
            min-width: 300px;
            display: flex;
            justify-content: center;
            align-items: center;
          }
        }
      }
    }
  }
}
</style>
