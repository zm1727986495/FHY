<template >
  <div>
    <div class="head_nav">
      <!-- 导航栏 -->
      <breadcrumb :navList="navList"></breadcrumb>
    </div>
    <div>
      <el-card class="box-card">
        <!-- 信息头 -->
        <warehmodule @getStorageId="getStorageId" ref="warehmodule"></warehmodule>

        <!-- 导入到货单 -->
        <orderlist v-if="isWay==4" ref="orderlist" :stockList="stockList" :isOrder="true"></orderlist>

        <!-- 商品入库 -->
        <ordergoods v-if="isWay==2" ref="ordergoods" :stockList="stockList" :isOrder="true"></ordergoods>

        <!-- 模板入库 -->
        <selecttemplate v-if="isWay==3" ref="selecttemplate"></selecttemplate>

        <!-- 顾家入库 -->
        <lookfamily v-if="isWay==1" ref="lookfamily" :stockList="stockList" :isOrder="true"></lookfamily>
      </el-card>
      <div>
        <div class="foot_btn_box">
          <el-button type="primary" @click="submission" :loading="loadingbtn">提 交</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import breadcrumb from "@/views/components/breadcrumb";
import warehmodule from "./components/warehmodule";
import orderlist from "./components/orderlist";
import ordergoods from "./components/ordergoods";
import selecttemplate from "./components/selecttemplate";
import lookfamily from "./components/lookfamily";
import { addWarehouseWarrant } from "api/entrepotSet/stockManagement/stockPending/stockPending";
import { getUUID } from "api/pulicJava";
export default {
  components: {
    breadcrumb,
    warehmodule,
    orderlist,
    lookfamily,
    ordergoods,
    selecttemplate
  },
  data() {
    return {
      navList: [],
      stockList: [],
      isWay: "",
      loadingbtn:false
    };
  },
  created() {
    let { putInStorageId, isWay, brandId } = this.$route.query;
    if (isWay == 4 && brandId == 2) {
      this.isWay = 1;
    } else {
      this.isWay = isWay;
    }
    // this.isWay = isWay;
    if (putInStorageId instanceof Array) {
      this.stockList = putInStorageId;
    } else {
      this.stockList = putInStorageId.split(",");
    }
  },
  mounted() {
    this.navList = this.$route.meta;
  },
  methods: {
    //处理仓库ID
    getStorageId(storageId) {
      let { isWay } = this.$route.query;
      if (isWay == 3) {
        this.$refs.selecttemplate.getData(storageId);
      }
      if (isWay == 2) {
        this.$refs.ordergoods.getData(storageId);
      }
    },
    //确认提交
    submission() {
      this.$confirm("是否入库?", {
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        type: "warning"
      })
        .then(() => {
          //操作调接口
          this.submissionFn();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作"
          });
        });
    },
    //提交
    submissionFn() {
      let orderSum = 0; //订单数量累加
      let stockSum = 0; //商品数量累加
      let familySum = 0; //顾家数量累加
      let tempSum = 0; //模板数量累加
      let arr = []; //到货单拆分明细项集合
      let list = [];
      let gjArr = []; //顾家
      let packagelist = []; //包
      let putGoodslist = []; //商品
      let isShow = true;

      let { storageId } = this.$refs.warehmodule.bindInfo;
      if (!storageId) {
        this.$message.error("请选择仓库!");
        return;
      }
      let { putInStorageId } = this.$route.query;
      //订单货物列表处理
      if (this.isWay == 4) {
        let total = 0;
        let ySum = 0;
        this.$refs.orderlist.tableData.forEach(item => {
          // item.flag  判断当前是直接给采购单分配，还是单个分配
          if(item.flag){
            // 分配货区货位
            let purchasing = [];
            item.list.forEach(attr=>{
              let sum = 0;
              orderSum += attr.dataValue * 1;
              total += attr.dataValue * 1;
              ySum += attr.dataValue * 1;
              arr.push({
                arrivalNoticeDetailId: attr.arrivalNoticeDetailId,
                siteId: item.siteId,
                regionId: item.regionId,
                number: attr.dataValue
              })
              purchasing.push({
                aogTemplateId: attr.aogTemplateId,
                inventoryNumber: attr.dataValue,
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
            //分别分配货区货位
            if (item.cargoMainList) {
              item.cargoMainList.forEach(attr => {
                let purchasing = [];
                attr.list.forEach(key => {
                  let unpacking = [];
                  let sum = 0;
  
                  key.cargoList.forEach(val => {
                    total+= val.num*1
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
                  let putsId = "";
                  if (putInStorageId instanceof Array) {
                    putsId = putInStorageId.join("");
                  } else {
                    putsId = putInStorageId;
                  }
  
                  packagelist.push({
                    aogTemplateId: key.aogTemplateId,
                    purchaseNumber: item.purchaseNumber,
                    putInStorageId: putsId,
                    packageNumber: sum,
                    receivableNumber: num
                  });
                });
                list.push({
                  storageId,
                  treasuryNote: item.treasuryNote,
                  purchaseNumber: item.purchaseNumber,
                  purchasePackageList: purchasing
                });
              });
  
              //处理 到货单拆分明细项集合
              item.cargoMainList.forEach(attr => {
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
              item.cargoMainList.forEach(attr => {
                attr.list.forEach(key => {
                  // total += key.receivableCount * 1;
                  orderSum += key.paidInCount * 1;
                  ySum+=key.receivableCount*1
                });
              });
            }
          }

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

      //模板入库
      if (this.isWay == 3) {
        let ary = [];
        this.$refs.selecttemplate.tableData.forEach(item => {
          tempSum += item.paidInAmount * 1;
          let arr = [];
          let num = 0;
          item.driver.forEach(attr => {
            num += attr.num;
            arr.push({
              storageId,
              regionId: attr.regionId,
              siteId: attr.siteId,
              inventoryNumber: attr.num
            });
          });
          ary.push({
            aogTemplateId: item.aogTemplateId,
            purchasePackageDetailList: arr,
            inventoryNumber: num
          });
        });
        list.push({
          storageId,
          purchaseNumber: this.$route.query.purchaseNumber,
          purchasePackageList: ary
        });
        isShow = true;
        if (ary.length == 0) {
          this.$message.error("没有模板!");
          return;
        }
        // let flag = ary.every(item => {
        //   return !item.purchasePackageDetailList.length;
        // });
        // if (flag) {
        //   this.$message.error("当前没有分配货区货位!");
        //   return;
        // }
      }

      //商品列表处理
      if (this.isWay == 2) {
        let total = 0;
        let ySum=0
        this.$refs.ordergoods.tableData.forEach(item => {
          let stockArr = [];
          stockSum += item.paidInAmount * 1;
          ySum += item.amount * 1
          // total += item.amount * 1;

          item.driver.forEach(attr => {
            total+=attr.num*1
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
            treasuryNote: item.treasuryNote,
            purchaseNumber: item.purchaseNumber,
            inventoryGoodsList: stockArr
          });
          let num = item.amount - item.paidInAmount;
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
            goodsNumber: item.amount,
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
        let flag = list.every(item => {
          return !item.inventoryGoodsList.length;
        });
        // if (flag) {
        //   this.$message.error("没有选择货区货位!");
        //   return;
        // }
      }

      //顾家列表处理
      if (this.isWay == 1) {
        let total = 0;
        let ySum=0;
        this.$refs.lookfamily.tableData.forEach(item => {
          let stockArr = [];
          familySum += item.paidInCover * 1;
          ySum+=item.receivableCover*1
          // total += item.receivableCover * 1;
          gjArr.push(item);
          item.driver.forEach(attr => {
            total+=attr.num*1
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
            treasuryNote: item.treasuryNote,
            purchaseNumber: item.purchaseNumber,
            inventoryGoodsList: stockArr
          });
          let num = item.receivableCover - item.paidInCover;
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
            goodsNumber: item.receivableCover,
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
        storageId, //仓库id
        warehousePeople: this.$refs.warehmodule.id, //入库人id
        putInStorageIdList: ids,
        warehouseAmount: stockSum + orderSum + familySum + tempSum, //入库数量
        storingTheResults: isShow ? "已入库" : "部分入库", //入库结果
        accountingDate: expectedArrivalDate, //记账日期
        remarks: processRemarks,
        splitDetailList: arr,
        list: list,
        gjGoodsList: gjArr, //顾家
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
