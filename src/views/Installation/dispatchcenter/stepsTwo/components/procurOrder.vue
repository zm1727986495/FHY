<template>
  <!-- 这个组件只是用来展示订单商品的列表  通过安装单id来获取 派维修排安装的商品信息   -->
  <div class="procurement" v-if='dataList.length != 0'>
    <div class="m-top10">
      <div class="iconBox">
        <i class="Icon"></i>
        <span>订单</span>
      </div>
    </div>
    <div class="orderList m-top10">
      <div v-for="(item,index) in dataList" :key="index">
        <div class="order_item m-bottom" v-if="item.unpackingDataVOS.length!==0">
          <div class="item_header">
            <div class="purchase">
              <span class="span_title m-left20">采购单号：</span>
              <span>{{item.purchaseNumber}}</span>
            </div>
            <div class="purchase">
              <span class="span_title">采购合同号：</span>
              <span>{{item.purchaseContractCode}}</span>
            </div>
            <div class="purchase">
              <span class="span_title">仓库：</span>
              <span>{{item.storageName}}</span>
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
                <!-- <li>
                  <span>查货数</span>
                </li> -->
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
                  <span class="li_pro">{{pro.outboundNumber}}</span>
                </li>
                <!-- <li>
                  <span class="li_pro">{{pro.factorySeeNumber}}</span>
                </li> -->
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
          <div class="purchase">
            <span class="span_title m-left20">采购单号：</span>
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
import { listDesignateOutLibraryDesies } from "api/Installation/dispatchcenter/dispatchcenter";
export default {
  data() {
    return {
      dataList:[]
    };
  },
  mounted() {
    this.getlistDesignateOut(); //回显订单信息  listDesignateOutLibraryDesies
  },

  methods: {
    //回显订单信息
    getlistDesignateOut() {
      let data = {
        installationOrderId: this.$route.query.installationOrderId,
        
      };
      listDesignateOutLibraryDesies(data).then(res => {
        this.dataList = res.data.rows;
        console.log(this.dataList);
      }).catch(error=>{
        console.error('回显订单信息',error)
      })
    },
    //表格斑马线设置
    tableRowClassName({ row, rowIndex }) {
      return rowIndex % 2 != 0 ? "el-f0" : "";
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
  .cloS {
    color: #409eff;
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
    background-color: #F5F7FA;
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
    // overflow-y: auto;
    padding: 0 20px;
    .order_item {
      width: 100%;
      border: 1px solid #F5F7FA;

      .item_body {
        max-height: 400px;
        overflow-y: auto;
        overflow-x: auto;
        .item_div {
          display: flex;
          flex-wrap: nowrap;
          ul {
            border-right: 1px solid #F5F7FA;
            .item_tiele {
              height: calc(100% - 60px);
            }
            .textAl {
              display: flex;
              align-items: center;
            }
          }
          li {
            border-bottom: 1px solid #F5F7FA;
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
