<template>
  <div class="warehousingquery">
    <div class="head_nav">
      <!-- 导航栏 -->
      <breadcrumb :navList="navList"></breadcrumb>
    </div>

    <el-card>
      <div class="iconBox m-bottom20">
        <i class="Icon"></i>
        <span>入库单详情</span>
      </div>

      <div class="orderList m-top10" v-if="cargoMainList">
        <div v-for="(item,index) in cargoMainList" :key="index">
          <div class="order_item m-bottom">
            <div class="pl-5 item_header multipleTableHeaderBg">
              <div class="purchase">
                <span class="span_title">采购单号：</span>
                <span>{{item.purchaseCode}}</span>
              </div>
              <div class="purchase">
                <span class="span_title">采购合同单号：</span>
                <span>{{item.purchaseContractCode}}</span>
              </div>
            </div>

            <div class="item_body">
              <div class="item_div">
                <ul>
                  <li>名称</li>
                  <li>数量</li>
                  <li class="item_tiele textAl li_detail1">详情</li>
                </ul>
                <ul v-for="(pro,i) in item.packageList" :key="i">
                  <li>{{pro.aogTemplateName}}</li>
                  <li>{{pro.inventoryNumber}}</li>
                  <li class="item_tiele">
                    <div class="li_detail2" v-for="(attr,k) in pro.siteList" :key="k">
                      <el-tooltip
                        class="item"
                        effect="dark"
                        :content="attr.siteCodeStr"
                        placement="bottom-start"
                      >
                        <p>{{attr.siteCodeStr}}</p>
                      </el-tooltip>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="table_list lvs attribute" v-if="tableData&&tableData.length!=0">
        <el-table border style="width: 100%" :row-class-name="tableRowClassName" :data="tableData">
          <el-table-column
            align="center"
            prop="commodityName"
            label="商品名称"
            width="200"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column align="center" prop="commodityCode" label="商品编码" width="200" sortable></el-table-column>
          <el-table-column align="center" prop="brandName" label="品牌" width="200"></el-table-column>
          <el-table-column align="center" prop="categoryName" label="品类" width="200"></el-table-column>
          <el-table-column align="center" prop="purchaseCode" label="采购单号" width="200"></el-table-column>
          <el-table-column align="center" prop="purchaseContractCode" label="采购合同号" width="200"></el-table-column>
          <el-table-column
            align="center"
            prop="inventoryNumber"
            label="实收套"
            width="200"
            v-if="brandName=='顾家'"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="piece"
            label="实收件"
            width="200"
            v-if="brandName=='顾家'"
          ></el-table-column>
          <el-table-column align="center" prop="inventoryNumber" label="数量" width="200" v-else></el-table-column>
          <el-table-column
            align="center"
            prop="siteCode"
            label="货区货位"
            width="200"
            show-overflow-tooltip
          ></el-table-column>
        </el-table>
      </div>
    </el-card>
    <div class="foot_btn_box">
      <el-button @click="cancel">返 回</el-button>
    </div>
  </div>
</template>
<script>
import breadcrumb from "@/views/components/breadcrumb";
import { getById } from "api/entrepotSet/stockManagement/stockPending/stockPending";

export default {
  components: {
    breadcrumb
  },
  data() {
    return {
      navList: [], //导航条
      tableData: [], //商品列表
      cargoMainList: [], //包列表
      brandName: ""
    };
  },
  mounted() {
    this.navList = this.$route.meta;
    this.getData();
  },
  methods: {
    //获取入库单详情列表
    getData() {
      let data = {
        warehouseWarrantId: this.$route.query.warehouseWarrantId
      };
      getById(data)
        .then(res => {
          if (res.status == 200) {
            if (res.data.goodsList) {
              res.data.goodsList.forEach(item => {
                this.brandName = item.brandName;
              });
            }
            this.tableData = res.data.goodsList;
            this.cargoMainList = res.data.list;
          }
        })
        .catch(error => {
          console.error("获取入库单详情列表", error);
        });
    },
    //返回
    cancel() {
      this.$router.go(-1);
    },
    //表格斑马线设置
    tableRowClassName({ row, rowIndex }) {
      return rowIndex % 2 != 0 ? "el-f0" : "";
    }
  }
};
</script>
<style lang="scss" scoped>
.warehousingquery {
  .foot_btn_box {
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }
  .orderList {
    font-size: 14px;
    max-height: 650px;
    overflow: auto;
    color: #909399;
    .order_item {
      width: 100%;
      border: 1px solid #ebeef5;
      .item_header {
        > span {
          width: 80px;
        }
        height: 50px;
        line-height: 50px;
        display: flex;
        flex-wrap: nowrap;
        > div {
          width: 25%;
          .span_title {
            font-weight: bold;
          }
        }
      }
      .item_body {
        max-height: 400px;
        overflow-y: auto;
        overflow-x: auto;
        .item_div {
          display: flex;
          flex-wrap: nowrap;
          ul {
            .item_tiele {
              height: calc(100% - 80px);
            }
            .textAl {
              display: flex;
              align-items: center;
            }
          }
          li {
            width: 200px;
            border-top: 1px solid #ebeef5;
            height: 40px;
            line-height: 40px;
            text-align: center;
            border-right: 1px solid #ebeef5;
          }
          .li_detail1 {
            display: flex;
            justify-content: center;
            align-items: center;
            flex: 1;
            height: 100%;
          }
          .li_pro {
            display: flex;
            width: 200px;
            height: 100%;
          }
          .li_detail2 {
            max-width: 200px;
            display: flex;
            justify-content: center;
            align-items: center;

            p {
              width: 170px;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
          }
        }
      }
    }
  }
}
</style>
