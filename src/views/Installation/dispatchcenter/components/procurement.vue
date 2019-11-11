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
            <div class="purchase" :title="item.purchaseNumber">
              <span class="span_title">采购单号：</span>
              <span>{{item.purchaseNumber}}</span>
            </div>
            <div class="purchase" :title="item.storageName">
              <span class="span_title">仓库：</span>
              <span>{{item.storageName}}</span>
            </div>
            <div class="purchase" :title="item.purchaseContractCode">
              <span class="span_title">采购合同号：</span>
              <span>{{item.purchaseContractCode}}</span>
            </div>
            <div class="purchase" :title="item.orderNumber">
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
                      <!-- <p>{{attr.regionName}} {{attr.siteCode}} 数量{{attr.inventoryNumber}}</p> -->
                      <p>{{attr.siteCode}}</p>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="table_list lvs attribute conetBox m-top20" v-for="(item,index) in dataList" :key="index">
      <div v-if="item.inventoryGoodsVOS.length!==0">
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
          <el-table-column align="center" prop="libraryOfAge" label="库龄"></el-table-column>
          <el-table-column align="center" prop="putStorageTime" label="入库时间"></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
import { listPurchaseOrder } from "api/Installation/dispatchcenter/dispatchcenter";
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
    gerlistOrder(storageId) {
      let data = {
        orderId: this.orderId,
        kind: 1,
        storageId
      };
      listPurchaseOrder(data)
        .then(res => {
          if (res.status == 200) {
            this.dataList = res.data.rows.map(item => {
              return { checked: false, ...item };
            });

            // let arr = [];
            // this.dataList.forEach(item=>{
            //   arr.push(item.storageId)
            // })
            // let flag = Math.min.apply(null,arr) == Math.max.apply(null,arr)
            // if(flag){
            //   this.$emit('storageFun',arr[0])
            // }else{
            //   this.$emit('storageFun',false)
            // }
          }
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
          obj.purchaseOrderId = item.purchaseOrderId;
          obj.storagePurchaseOrderId = item.storagePurchaseOrderId;
          // obj.deliveryNumber = item.deliveryNumber;
          obj.storageId = item.storageId;
          if (item.unpackingDataVOS.length !== 0) {
            let DataVOtotal = 0; //包总数量
            if(item.unpackingDataVOS){
              item.unpackingDataVOS.forEach(attr => {
                let DataVOSum = 0; //包数量
                let sto = [];
                let os = {};
                os.inventoryPurchasePackageId = attr.inventoryPurchasePackageId;
                if(attr.storageSiteVOS){
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
                os.storagePurchaseOrderId = attr.storagePurchaseOrderId;
                os.storageId = attr.storageId;
                DataVOtotal += os.outboundNumber;
                asy.push(os);
              });
            }
            obj.deliveryNumber = DataVOtotal;
            obj.unpackingDataVOS = asy;
          } else {
            //处理采购下商品的数据
            let GoodsVOSum = 0; //商品总数量
            let invent = [];
            item.inventoryGoodsVOS.forEach(attr => {
              invent.push({
                inventoryGoodsId: attr.inventoryGoodsId,
                inventoryNumber: attr.inventoryNumber,
                skuGoodsId:attr.skuGoodsId,
                storageId: attr.storageId,
                storagePurchaseOrderId: attr.storagePurchaseOrderId
              });
              GoodsVOSum += attr.inventoryNumber;
            });
            obj.inventoryGoodsVOS = invent;
            obj.deliveryNumber = GoodsVOSum;
          }
          ary.push(obj);
        }
      });
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
    min-width: 150px;
    width: 25%;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .conetBox {
    padding: 0 20px;
  }
  .details {
    display: flex;
    width: 100%;
    p {
      width: 100%;
      text-align: center;
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
      border: 1px solid #ebeef5;

      .item_body {
        max-height: 300px;
        overflow-y: auto;
        overflow-x: auto;
        .item_div {
          display: flex;
          flex-wrap: nowrap;
          ul {
            border-right: 1px solid #ebeef5;
            .item_tiele {
              height: calc(100% - 93px);
            }
            .textAl {
              display: flex;
              align-items: center;
            }
          }
          li {
            border-bottom: 1px solid #ebeef5;
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
            width: 80px;
            text-align: center;
          }
          .li_detail2 {
            // min-width: 80px;
            width: 80px;
            // display: flex;
            // justify-content: center;
            // align-items: center;
          }
        }
      }
    }
  }
}
</style>
