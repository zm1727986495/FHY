<template>
  <div class="procurement" v-if="dataList.length!=0">
    <div class="m-top10">
      <div class="iconBox">
        <i class="Icon"></i>
        <span>订单</span>
      </div>
    </div>
    <div class="orderList m-top10">
      <div v-if="isShow" class="numSty">
        <el-checkbox class="m-left10" v-model="Allelection" v-if="dataList.length!==0">全选</el-checkbox>
        <p class="m-left10">总包数：{{num}}</p>
      </div>
      <div v-for="(item,index) in dataList" :key="index">
        <div class="order_item m-bottom" v-if="item.unpackingDataVOS.length!==0">
          <div class="item_header">
            <el-checkbox
              class="m-left10"
              v-if="isShow"
              v-model="item.checked"
              @change="checkfather(index)"
            ></el-checkbox>
            <div :class="isShow?'purchase':'purchase m-left10'">
              <span class="span_title">采购单号：</span>
              <span>{{item.purchaseNumber}}</span>
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
                  <!-- <el-input size="small" v-model="pro.inventoryNumberSum"></el-input> -->
                  <span class="li_pro">
                    <span>{{pro.inventoryNumberSum}}</span>
                  </span>
                </li>
                <li class="item_tiele" v-if="isShow">
                  <div class="li_detail2" v-for="(attr,k) in pro.storageSiteVOS" :key="k">
                    <div class="details" v-if="pro.inventoryNumberSum">{{attr.siteCode}}</div>
                  </div>
                </li>
                <li class="item_tiele" v-else>
                  <div class="li_detail2" v-if="pro.inventoryNumberSum">{{pro.regionName}} {{pro.siteCode}}</div>
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
          <el-checkbox
            v-if="isShow"
            class="m-left10"
            v-model="item.checked"
            @change="checkfather(index)"
          ></el-checkbox>
          <div :class="isShow?'purchase':'purchase m-left10'">
            <span class="span_title">采购单号：</span>
            <span>{{item.purchaseNumber}}</span>
          </div>
          <div class="purchase">
            <span class="span_title">订单号：</span>
            <span>{{item.orderNumber}}</span>
          </div>
          <div class="remarksStyle">
            <p>备注：</p>
            <el-input size="small" v-model="item.treasuryNote"></el-input>
          </div>
        </div>
        <el-table border :row-class-name="tableRowClassName" :data="item.inventoryGoodsVOS">
          <el-table-column align="center" prop="commodityName" label="名称" width="170" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="inventoryNumber" label="数量" width="90">
            <template slot-scope="scope">
              <div>
                <el-input size="small" @input="inputFun(scope.row)" v-model="scope.row.inventoryNumber"></el-input>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="regionSite" label="货位" show-overflow-tooltip width="150"></el-table-column>
          <el-table-column align="center" prop="libraryOfAge" label="库龄" width="80"></el-table-column>
          <el-table-column align="center" prop="putStorageTime" label="入库时间" width="160"></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
import { listStoragePurchaseOrder } from "api/entrepotSet/outgoingManagement/outgoingManagement";
export default {
  props: {
    isShow: {
      default: true
    }
  },
  data() {
    return {
      dataList: [],
      tableData: [],
      num:0
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
    //数量
    inputFun(row){
    this.dataList.forEach(item=>{
      item.inventoryGoodsVOS.forEach(attr=>{
        if(attr.inventoryGoodsId == row.inventoryGoodsId){
          if(row.inventoryNumber > attr.maxSum){
            row.inventoryNumber = attr.maxSum;
          }
         }
       })
     }) 
    },
    //订单采购单的货区货位
    gerlistOrder() {
      let data = {
        outboundOrderId: this.$route.query.outboundOrderId
      };
      listStoragePurchaseOrder(data)
        .then(res => {
          if (res.status == 200) {
            this.dataList = res.data.map(item => {
              item.unpackingDataVOS = item.unpackingDataVOS.map(attr => {
                if(!attr.inventoryNumberSum || attr.inventoryNumberSum=='0'){
                  attr.inventoryNumberSum = '';
                }
                return { storageSiteVOS: [],maxSum:attr.inventoryNumberSum, ...attr };
              });
              item.inventoryGoodsVOS = item.inventoryGoodsVOS.map(attr => {
                if(!attr.inventoryNumber){
                  attr.inventoryNumber = ''
                }
                return {storageSiteVOS:[],maxSum:attr.inventoryNumber, ...attr };
              });
              return { checked: false, theDeliveryNote: "", ...item };
            });

            this.dataList.forEach(item=>{
              if(item.unpackingDataVOS.length){
                item.unpackingDataVOS.forEach(attr=>{
                  this.num+=attr.inventoryNumberSum*1;
                })
              }
            })
          }
        })
        .catch(error => {
          console.error("订单采购单的货区货位", error);
        });
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
  .numSty{
    display: flex;
  }
  .remarksStyle{
    display: flex;
    max-width: 200px;
    p{
      width: 60px;
      display: flex;
      align-items: center;
    }
  }
  .purchase {
    min-width: 200px;
    width: 33%;
  }
  .conetBox {
    padding: 0 20px;
  }
  .details {
    display: flex;
    // text-align: center;
    justify-content: center;
    color: #409eff;
    width: 100%;
  }
  .item_header {
    > span {
      width: 80px;
    }
    background-color: #f5f7fa;
    height: 35px;
    // line-height: 30px;
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
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
            width: 120px;
          }
          span {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 120px;
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
            width: 120px;
            text-align: center;
          }
          .li_detail2 {
            color: #409eff;
            min-width: 120px;
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
