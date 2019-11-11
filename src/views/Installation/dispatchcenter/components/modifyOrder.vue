<template>
  <div class="procurement" v-if="dataList.length!=0">
    <div class="m-top10">
      <div class="iconBox">
        <i class="Icon"></i>
        <span>订单</span>
      </div>
    </div>
    <div
      class="table_list lvs attribute conetBox m-top20"
      v-for="(item,index) in dataList"
      :key="index"
    >
      <div v-if="item.purchaseOrderCommodities.length!==0">
        <div class="item_header">
          <el-checkbox class="m-left10" v-model="item.checked" @change="checkfather(index)"></el-checkbox>
          <!-- <div class="purchase">
            <span class="span_title">是否安装：</span>
            <span>{{item.isInstall==1?'是':'否'}}</span>
          </div> -->
          <div class="purchase">
            <span class="span_title">采购单号：</span>
            <span>{{item.purchaseNumber}}</span>
          </div>

          <div class="purchase">
            <span class="span_title">订单号：</span>
            <span>{{item.orderNumber}}</span>
          </div>
        </div>
        <el-table border :row-class-name="tableRowClassName" :data="item.purchaseOrderCommodities">
          <el-table-column align="center" prop="commodityName" label="商品名称" sortable></el-table-column>
          <el-table-column align="center" prop="commodityCode" label="商品编码"></el-table-column>
          <el-table-column align="center" prop="amount" label="采购数量"></el-table-column>
          <el-table-column align="center" prop="brandName" label="品牌"></el-table-column>
          <el-table-column align="center" prop="categoryName" label="品类" show-overflow-tooltip></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
import { listPurchaseOrderTable } from "api/Installation/dispatchcenter/dispatchcenter";
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
      this.dataList.forEach((item, index) => {
        if (idx == index) {
          if (item.checked) {
            this.$confirm("是否修改安装状态?", {
              confirmButtonText: "是",
              cancelButtonText: "否",
              type: "warning"
            })
              .then(() => {
                item.modify = 1;
              })
              .catch(() => {
                this.$message({
                  type: "info",
                  message: "已取消操作"
                });
              });
          }
        }
      });
    },
    //订单采购单的货区货位
    gerlistOrder() {
      let data = {
        orderId: this.orderId
      };
      listPurchaseOrderTable(data)
        .then(res => {
          this.dataList = res.data.rows.map(item => {
            return { checked: false, modify: "", ...item };
          });
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
      border: 1px solid #ebeef5;

      .item_body {
        max-height: 400px;
        overflow-y: auto;
        overflow-x: auto;
        .item_div {
          display: flex;
          flex-wrap: nowrap;
          ul {
            border-right: 1px solid #ebeef5;
            .item_tiele {
              height: calc(100% - 90px);
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
