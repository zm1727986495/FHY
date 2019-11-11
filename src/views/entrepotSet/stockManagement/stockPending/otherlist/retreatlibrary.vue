<template>
  <div>
    <div class="head_nav">
      <!-- 导航栏 -->
      <breadcrumb :navList="navList"></breadcrumb>
    </div>
    <el-card class="box-card">
      <warehmodule @getStorageId="getStorageId" ref="warehmodule"></warehmodule>

      <div class="h-width"></div>
      <!-- 包 -->
      <orderlist v-show="cargoMainList.length!=0" :cargoMainList="cargoMainList" ref="orderlist"></orderlist>

      <!-- 商品 -->
      <commoditylist v-show="tableData.length!=0" :tableData="tableData" ref="commoditylist"></commoditylist>
    </el-card>
    <div class="foot_btn_box">
      <el-button type="primary" @click="submission" :loading="loadingbtn">提 交</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </div>
</template>
<script>
import warehmodule from "../components/warehmodule";
import orderlist from "../twolist/orderlist";
import commoditylist from "../twolist/commoditylist";
import breadcrumb from "@/views/components/breadcrumb";
import {
  listStocksGoods,
  withdrawing
} from "api/entrepotSet/stockManagement/stockPending/stockPending";
import { getUUID } from "api/pulicJava";
export default {
  components: {
    orderlist,
    breadcrumb,
    warehmodule,
    commoditylist
  },
  data() {
    return {
      navList: [], //导航条
      cargoMainList: [], //包
      tableData: [], //商品
      storageId: "",
      loadingbtn:false
    };
  },
  created() {},
  mounted() {
    this.navList = this.$route.meta;
  },
  methods: {
    //处理仓库ID
    getStorageId(storageId) {
      this.$refs.orderlist.getTree(storageId);
      this.$refs.commoditylist.getTree(storageId).then(res => {
        this.getData(res);
      });

      this.storageId = storageId;
    },
    //获取退库入库列表  ary货区
    getData(ary) {
      let data = {
        designateInstallationId: this.$route.query.sourceId
      };
      listStocksGoods(data)
        .then(res => {
          if (res.status == 200) {
            // 处理包数据
            if (res.data.packageList) {
              this.cargoMainList = res.data.packageList.map(item => {
                item.list = item.unpackingDataVOS.map(attr => {
                  return {
                    ...attr,
                    receivableNumber: attr.outboundNumber,
                    paidInCount: attr.outboundNumber,
                    aogTemplateName: attr.unpackingName,
                    cargoList: [],
                    isName: false
                  };
                });
                return { ...item, treasuryNote: "", checked: false };
              });
            }

            // 商品
            if (res.data.goodsList) {
              this.tableData = res.data.goodsList.map(item => {
                let obj = ary.filter(attr => {
                  return attr.theStaging == 4;
                })[0];
                if (!obj) {
                  obj = ary[0] || {};
                }
                return {
                  ...item,
                  paidInAmount: item.inventoryNumber,
                  cargoList: [],
                  CargoStr: "",
                  treasuryNote: "",
                  receivableNumber: item.inventoryNumber,
                  regionId: obj.regionId
                };
              });
            }
          }
        })
        .catch(error => {
          console.error("获取退库入库列表", error);
        });
    },
    //提交
    submission() {
      let list = [];
      let arr = [];
      let orderSum = 0; //订单数量累加
      let stockSum = 0; //商品数量累加
      let isShow = false;
      let total = 0;
      let { putInStorageId } = this.$route.query;

      // 包*************
      if (this.cargoMainList.length != 0) {
        this.cargoMainList.forEach(attr => {
          let purchasing = [];
          attr.list.forEach(key => {
            let unpacking = [];
            let sum = 0;

            key.cargoList.forEach(val => {
              unpacking.push({
                storageId: this.storageId,
                regionId: val.regionId, //货区
                siteId: val.siteId,
                inventoryNumber: val.num
              });
              sum += val.num * 1;
            });
            purchasing.push({
              aogTemplateId: key.aogTemplateId,
              inventoryNumber: sum,
              purchasePackageDetailList: unpacking
            });
          });
          list.push({
            treasuryNote: attr.treasuryNote,
            storageId: this.storageId,
            purchaseNumber: attr.purchaseNumber,
            purchasePackageList: purchasing
          });
        });

        //处理 到货单拆分明细项集合
        this.cargoMainList.forEach(attr => {
          attr.list.forEach(key => {
            key.cargoList.forEach(val => {
              arr.push({
                arrivalNoticeDetailId: key.arrivalNoticeDetailId,
                siteId: val.siteId,
                regionId: val.regionId,
                number: val.num
              });
            });
          });
        });

        //处理总数
        this.cargoMainList.forEach(attr => {
          attr.list.forEach(key => {
            total += key.receivableNumber * 1;
            orderSum += key.paidInCount * 1;
          });
        });

        //提交验证****************
        if (list.length == 0) {
          this.$message.error("当前无数据!");
          return;
        }

        // let flag = list.every(item => {
        //   return item.purchasePackageList.every(attr => {
        //     return !attr.purchasePackageDetailList.length;
        //   });
        // });
        // if (flag) {
        //   this.$message.error("没有选择货区货位!");
        //   return;
        // }
      }

      // 商品***********
      if (this.tableData.length != 0) {
        let ary = [];
        this.tableData.forEach(item => {
          let stockArr = [];
          total += item.paidInAmount * 1;
          stockSum += item.paidInAmount * 1;

          item.cargoList.forEach(attr => {
            if (this.$route.query.brandId == 2) {
              stockArr.push({
                storageId: this.storageId,
                regionId: attr.regionId,
                siteId: attr.siteId,
                skuGoodsId: item.skuGoodsId,
                inventoryNumber: attr.num,
                piece: item.piece
              });
            } else {
              stockArr.push({
                storageId: this.storageId,
                regionId: attr.regionId,
                siteId: attr.siteId,
                skuGoodsId: item.skuGoodsId,
                inventoryNumber: attr.num
              });
            }
          });
          list.push({
            treasuryNote: item.treasuryNote,
            storageId: this.storageId,
            purchaseNumber: item.purchaseNumber,
            inventoryGoodsList: stockArr
          });
          ary.push({
            stockArr
          });
        });
        if (ary.length == 0) {
          this.$message.error("当前无数据!");
          return;
        }

        let flag = ary.every(item => {
          return !item.stockArr.length;
        });
        console.log(flag);

        if (flag) {
          this.$message.error("没有选择货区货位!");
          return;
        }
      }
      let ids;
      if (putInStorageId instanceof Array) {
        ids = putInStorageId;
      } else {
        ids = [putInStorageId];
      }
      isShow = total == stockSum + orderSum;
      let {
        expectedArrivalDate,
        processRemarks
      } = this.$refs.warehmodule.bindInfo;
      let data = {
        storageId: this.storageId, //仓库id
        warehousePeople: this.$refs.warehmodule.id, //入库人id
        putInStorageIdList: ids,
        warehouseAmount: stockSum + orderSum, //入库数量
        storingTheResults: isShow ? "已入库" : "部分入库", //入库结果
        accountingDate: expectedArrivalDate, //记账日期
        remarks: processRemarks,
        splitDetailList: arr,
        list: list,
        receiptsType: this.$route.query.purchaseType,
        status: isShow ? 1 : 2
      };
      console.log(data);
      this.loadingbtn = true;
      getUUID({ serialNumber: "SI" }).then(res => {
        data.warehouseWarrantCode = res.data;
        withdrawing(data)
          .then(res => {
            if (res.status == 200) {
              this.$message.success("入库成功!");
              this.loadingbtn = false;
              this.$router.go(-1);
            }else{
              this.$message.error(res.message)
              this.loadingbtn = false;
            }
          })
          .catch(error => {
            this.loadingbtn = false;
            console.error("入库提交", error);
          });
      });
    },
    //取消
    cancel() {
      this.$router.go(-1);
    },
    //表格斑马线设置
    tableRowClassName({ row, rowIndex }) {
      return rowIndex % 2 != 0 ? "el-f0" : "";
    },
    //勾选
    pendingDelete() {}
  }
};
</script>
<style lang="scss" scoped>
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
.box-card {
  min-height: 650px;
}
.foot_btn_box {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
