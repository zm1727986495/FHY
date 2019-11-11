<template>
  <div>
    <div class="head_nav">
      <!-- 导航栏 -->
      <breadcrumb :navList="navList"></breadcrumb>
    </div>

    <el-card class="box-card">
      <!-- 信息头 -->
      <warehmodule @getStorageId="getStorageId" ref="warehmodule"></warehmodule>
      <!-- 包 -->
      <orderlist v-if="packageId!=''&&brandId!=2" ref="orderlist" :isOrder="false"></orderlist>

      <ordergoods v-if="goodsId!=''&&brandId!=2" ref="ordergoods" :isOrder="false"></ordergoods>

      <lookfamily v-if="brandId==2" ref="lookfamily" :isOrder="false"></lookfamily>
    </el-card>

    <div>
      <div class="foot_btn_box">
        <el-button type="primary" @click="submission" :loading="loadingbtn">提 交</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import breadcrumb from "@/views/components/breadcrumb";
import warehmodule from "./components/warehmodule";
import orderlist from "./components/orderlist";
import ordergoods from "./components/ordergoods";
import lookfamily from "./components/lookfamily";
import { addWarehouseWarrantOrderGoods } from "api/entrepotSet/stockManagement/stockPending/stockPending";
import { getUUID } from "api/pulicJava";
export default {
  components: {
    orderlist,
    breadcrumb,
    warehmodule,
    ordergoods,
    lookfamily
  },
  data() {
    return {
      navList: [],
      packageId: "",
      goodsId: "",
      brandId: "",
      loadingbtn: false
    };
  },
  created() {
    let { packageId, goodsId, brandId } = this.$route.query;
    this.packageId = packageId;
    this.goodsId = goodsId;
    this.brandId = brandId;
  },
  mounted() {
    this.navList = this.$route.meta;
  },
  methods: {
    getStorageId(storageId) {
      if (this.goodsId != ""&&this.brandId!=2) {
        this.$refs.ordergoods.getData(storageId);
      }
    },
    //提交
    submission() {
      let orderSum = 0; //订单数量累加
      let stockSum = 0; //商品数量
      let familySum = 0; //顾家
      let arr = []; //到货单拆分明细项集合
      let list = [];
      let gjArr = []; //顾家
      let packagelist = []; //包
      let putGoodslist = []; //商品
      let isShow = false;
      let { storageId } = this.$refs.warehmodule.bindInfo;
      let { putInStorageId } = this.$route.query;

      // 包数据
      if (this.packageId != "") {
          if (this.$refs.orderlist.tableData.length != 0) {
            let total = 0;
            this.$refs.orderlist.tableData.forEach((item, index) => {
              if(item.flag){
                // 分配货区货位
                let purchasing = [];
                item.list.forEach(attr=>{
                  let sum = 0;
                  orderSum += attr.dataValue * 1;
                  total += attr.dataValue * 1;
                  sum += attr.dataValue * 1;

                  arr.push({
                    arrivalNoticeDetailId: attr.arrivalNoticeDetailId,
                    siteId: item.siteId,
                    regionId: item.regionId,
                    number: attr.dataValue
                  })
                  purchasing.push({
                    aogTemplateId: attr.aogTemplateId,
                    inventoryNumber: sum,
                    purchasePackageDetailList:[{
                      storageId,
                      regionId: item.regionId,
                      siteId: item.siteId,
                      inventoryNumber:attr.dataValue
                    }]
                  })
                });
                list.push({
                  storageId,
                  treasuryNote: item.treasuryNote,
                  purchaseNumber: item.purchaseNumber,
                  purchasePackageList: purchasing
                });
              }else{
                if (item.cargoMainList) {
                  item.cargoMainList.forEach(attr => {
                    let purchasing = [];
                    attr.list.forEach(key => {
                      let unpacking = [];
                      let sum = 0;
  
                      key.cargoList.forEach(val => {
                        unpacking.push({
                          storageId,
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
  
                      let num = key.receivableCount - sum; //应收减实收
                      if (num <= 0) {
                        num = 0;
                      }
                      packagelist.push({
                        aogTemplateId: key.aogTemplateId,
                        purchaseNumber: item.purchaseNumber,
                        putInStorageId: item.putInStorageId,
                        packageNumber: sum,
                        receivableNumber: num
                      });
                    });
                    list.push({
                      storageId,
                      putInStorageType: 1,
                      receiptsType: 4,
                      treasuryNote: item.treasuryNote,
                      purchaseNumber: item.purchaseNumber,
                      purchasePackageList: purchasing
                    });
                  });
  
                  //处理总数
                  item.cargoMainList.forEach(attr => {
                    attr.list.forEach(key => {
                      total += key.receivableCount * 1;
                      orderSum += key.paidInCount * 1;
                    });
                  });
                }
              }
            });
            if (total != orderSum) {
              isShow = false;
            } else {
              isShow = true;
            }

            //提交验证****************
            if (list.length == 0) {
              this.$message.error("没有选择货区货位!");
              return;
            }
            // let flag = list.every(item => {
            //   return item.purchasePackageList.every(attr => {
            //     return (
            //       attr.purchasePackageDetailList &&
            //       !attr.purchasePackageDetailList.length
            //     );
            //   });
            // });
            // if (flag) {
            //   this.$message.error("没有选择货区货位!");
            //   return;
            // }
          }
      }

      // 商品
      if (this.goodsId != 0) {
        if (this.brandId == 2) {
          let total = 0;
          let GJnum=0
          this.$refs.lookfamily.tableData.forEach(item => {
            let stockArr = [];
            familySum += item.paidInCover * 1;
            GJnum += item.receivableCover * 1;
            gjArr.push(item);
            item.driver.forEach(attr => {
              total+=attr.num*1;
              stockArr.push({
                storageId,
                regionId: attr.regionId,
                siteId: attr.siteId,
                skuGoodsId: item.skuGoodsId,
                inventoryNumber: attr.num,
                piece: item.paidInPiece
              });
            });
            list.push({
              storageId,
              receiptsType: 4,
              putInStorageType: 1,
              treasuryNote: item.treasuryNote,
              purchaseNumber: item.purchaseNumber,
              inventoryGoodsList: stockArr
            });
            let num = item.receivableCover - item.paidInCover;
            if (num <= 0) {
              num = 0;
            }
            // let putsId = "";
            // if (putInStorageId instanceof Array) {
            //   putsId = putInStorageId.join("");
            // } else {
            //   putsId = putInStorageId;
            // }
            putGoodslist.push({
              skuGoodsId: item.skuGoodsId,
              purchaseNumber: item.purchaseNumber,
              putInStorageId: item.putInStorageId,
              goodsNumber: item.receivableCover,
              receivableNumber: num
            });
            if (total != GJnum) {
              isShow = false;
            } else {
              isShow = true;
            }
          });
        }else{
          if (this.$refs.ordergoods.tableData.length != 0) {
            let total = 0;
            this.$refs.ordergoods.tableData.forEach(item => {
              let stockArr = [];
              stockSum += item.paidInAmount * 1;
              total += item.amount * 1;
              item.driver.forEach(attr => {
                stockArr.push({
                  storageId,
                  regionId: attr.regionId,
                  siteId: attr.siteId,
                  skuGoodsId: item.skuGoodsId,
                  inventoryNumber: attr.num
                });
              });
              list.push({
                storageId,
                putInStorageType: 2,
                receiptsType: 4,
                treasuryNote: item.treasuryNote,
                purchaseNumber: item.purchaseNumber,
                inventoryGoodsList: stockArr
              });
              let num = item.amount - item.paidInAmount;
              if (num <= 0) {
                num = 0;
              }
              putGoodslist.push({
                skuGoodsId: item.skuGoodsId,
                purchaseNumber: item.purchaseNumber,
                putInStorageId: item.putInStorageId,
                goodsNumber: item.amount,
                receivableNumber: num
              });
            });
            if (total != stockSum) {
              isShow = false;
            } else {
              isShow = true;
            }
            if (list.length == 0) {
              this.$message.error("当前无数据!");
              return;
            }
  
            // let flag = list.every(item => {
            //   return item.inventoryGoodsList && !item.inventoryGoodsList.length;
            // });
            // if (flag) {
            //   this.$message.error("没有选择货区货位!");
            //   return;
            // }
          }
        }
      }

      let {expectedArrivalDate,processRemarks} = this.$refs.warehmodule.bindInfo;
      let data = {
        arrivalNoticeCode: this.$route.query.arrivalNoticeCode,
        storageId, //仓库id
        warehousePeople: this.$refs.warehmodule.id, //入库人id
        putInStorageIdList: putInStorageId.split(","),
        warehouseAmount: orderSum + stockSum + familySum, //入库数量
        storingTheResults: isShow ? "已入库" : "部分入库", //入库结果
        accountingDate: expectedArrivalDate, //记账日期
        remarks: processRemarks,
        list: list,
        gjGoodsList: gjArr, //顾家
        packagelist,
        putGoodslist,
        status: isShow ? 1 : 2
      };
      console.log(data);
      this.loadingbtn = true;
      getUUID({ serialNumber: "SI" }).then(res => {
        data.warehouseWarrantCode = res.data;
        addWarehouseWarrantOrderGoods(data)
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
  }
};
</script>
<style lang="scss" scoped>
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
