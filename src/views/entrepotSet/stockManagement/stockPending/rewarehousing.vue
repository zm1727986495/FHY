<template>
  <div class="rewarehousing">
    <div class="head_nav">
      <!-- 导航栏 -->
      <breadcrumb :navList="navList"></breadcrumb>
    </div>
    <el-card class="box-card">
      <!-- 信息头 -->
      <warehmodule @getStorageId="getStorageId" ref="warehmodule"></warehmodule>

      <div class="h-width"></div>
      <!-- 包 -->
      <orderlist v-show="cargoMainList.length!=0" :cargoMainList="cargoMainList" ref="orderlist"></orderlist>

      <!-- 商品 -->
      <commoditylist v-show="tableData.length!=0" :tableData="tableData" ref="commoditylist"></commoditylist>
    </el-card>

    <!-- 提交按钮 -->
    <div class="foot_btn_box">
      <el-button type="primary" @click="submission" :loading="loadingbtn">提 交</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </div>
</template>
<script>
import breadcrumb from "@/views/components/breadcrumb";
import warehmodule from "./components/warehmodule";
import orderlist from "./twolist/orderlist";
import commoditylist from "./twolist/commoditylist";
import {
  getTwoPutInStorage,
  checkSiteOrAddSite,
  addWarehouseWarrant
} from "api/entrepotSet/stockManagement/stockPending/stockPending";
import { getUUID } from "api/pulicJava";
import { mapGetters } from "vuex";
export default {
  components: {
    breadcrumb,
    warehmodule,
    orderlist,
    commoditylist
  },
  data() {
    return {
      navList: [], //导航条
      indexs: 0, //点击选择货区货位状态
      isFlag: false, //显示货区货位
      cargoMainList: [], //包列表
      tableData: [], //商品列表
      arealocation: [], //货区货位数据
      CargoStr: "",
      Cargonum: 0, //数量
      isNums: false, //选择货区货位数量禁用
      quantitative: 0,
      backupsnum: 0, //备份
      storageId: "",
      loadingbtn: false
    };
  },
  mounted() {
    this.navList = this.$route.meta;
    this.getData();
  },
  methods: {
    //处理仓库ID
    getStorageId(storageId) {
      this.storageId = storageId;

      this.$refs.orderlist.getTree(storageId);

      this.$refs.commoditylist.getTree(storageId);
    },
    //获取列表
    getData() {
      let data = {
        putInStorageId: this.$route.query.putInStorageId
      };
      getTwoPutInStorage(data)
        .then(res => {
          if (res.status == 200) {
            //包
            if (res.data.packagelist) {
              this.cargoMainList = res.data.packagelist.map(item => {
                item.list = item.list.map(attr => {
                  return {
                    paidInCount: attr.receivableNumber,
                    isName: false,
                    cargoList: [],
                    ...attr
                  };
                });
                return {
                  checked: false,
                  ...item
                };
              });
            }

            if (res.data.putGoodslist) {
              this.tableData = res.data.putGoodslist.map(item => {
                return { cargoList: [], paidInAmount: "", ...item };
              });
            }
          }
        })
        .catch(error => {
          console.error("获取二次入库数据", error);
        });
    },
    //提交
    submission() {
      let list = [];
      let arr = [];
      let orderSum = 0; //订单数量累加
      let stockSum = 0; //商品数量累加
      let packagelist = []; //包
      let putGoodslist = []; //商品
      let isShow = false;
      let { putInStorageId } = this.$route.query;

      // 包*************
      if (this.cargoMainList.length != 0) {
        let total = 0;
        let ySum = 0;
        
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
              total+=val.num * 1
            });

            purchasing.push({
              aogTemplateId: key.aogTemplateId,
              inventoryNumber: sum,
              purchasePackageDetailList: unpacking
            });

            let num = key.receivableNumber - sum; //应收减实收
            if (num <= 0) {
              num = 0;
            }
            let putsId = "";
            if (putInStorageId instanceof Array) {
              putsId = putInStorageId.join("");
            } else {
              putsId = putInStorageId;
            }

            packagelist.push({
              aogTemplateId: key.aogTemplateId,
              purchaseNumber: attr.purchaseNumber,
              putInStorageId: putsId,
              packageNumber: sum,
              receivableNumber: num
            });
          });
          list.push({
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
            // total += key.receivableNumber * 1;
            orderSum += key.paidInCount * 1;
            ySum+=key.receivableNumber*1
          });
        });
        if (total != ySum) {
          isShow = false;
        } else {
          isShow = true;
        }

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
        let total = 0;
        let ySum = 0;
        this.tableData.forEach(item => {
          let stockArr = [];
          stockSum += item.paidInAmount * 1;
          ySum+=item.receivableNumber*1
          // total += item.receivableNumber * 1;

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
            total+=attr.num*1
          });
          list.push({
            storageId: this.storageId,
            purchaseNumber: item.purchaseNumber,
            inventoryGoodsList: stockArr
          });
          let num = item.receivableNumber - item.paidInAmount;
          if (num <= 0) {
            num = 0;
          }
          let putsId = "";
          if (putInStorageId instanceof Array) {
            putsId = putInStorageId.join("");
          } else {
            putsId = putInStorageId;
          }
          putGoodslist.push({
            skuGoodsId: item.skuGoodsId,
            purchaseNumber: item.purchaseNumber,
            putInStorageId: putsId,
            goodsNumber: item.receivableNumber,
            receivableNumber: num
          });
        });
        if (total != ySum) {
          isShow = false;
        } else {
          isShow = true;
        }

        if (list.length == 0) {
          this.$message.error("当前无数据!");
          return;
        }
        // let flag = list.every(item => {
        //   return !item.inventoryGoodsList.length;
        // });
        // if (flag) {
        //   this.$message.error("没有选择货区货位!");
        //   return;
        // }
      }

      let ids;
      if (putInStorageId instanceof Array) {
        ids = putInStorageId;
      } else {
        ids = [putInStorageId];
      }
      let {
        expectedArrivalDate,
        processRemarks
      } = this.$refs.warehmodule.bindInfo;
      let data = {
        arrivalNoticeCode: this.$route.query.arrivalNoticeCode,
        putInStorageType: this.$route.query.putInStorageType,
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
        packagelist,
        putGoodslist,
        status: isShow ? 1 : 2
      };
      console.log(data);
      this.loadingbtn = true;
      getUUID({ serialNumber: "SI" }).then(res => {
        data.warehouseWarrantCode = res.data;
        addWarehouseWarrant(data)
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
    }
  },
  computed: {
    ...mapGetters(["storagearea", "id"])
  }
};
</script>
<style lang="scss" scoped>
.rewarehousing {
  .warp_head {
    position: relative;
  }
  .operationbutton {
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
  }
  .foot_btn_box {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .box-card {
    min-height: 600px;
  }
}
</style>
