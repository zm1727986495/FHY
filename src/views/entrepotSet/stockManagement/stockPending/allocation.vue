<template>
  <div>
    <div class="head_nav">
      <!-- 导航栏 -->
      <breadcrumb :navList="navList"></breadcrumb>
    </div>
    <el-card>
      <div class="operationbutton m-bottom10">
        <el-select :disabled="isShow" v-model="storageId" placeholder="请选择仓库">
          <el-option
            v-for="item in options"
            :key="item.storageId"
            :label="item.storageName"
            :value="item.storageId"
          ></el-option>
        </el-select>

      </div>

      <orderlist v-show="dataList.length!=0" :cargoMainList="dataList" ref="orderlist"></orderlist>

      <!-- 商品 -->
      <!-- <div
        class="table_list lvs attribute conetBox m-top20"
        v-for="(item,index) in dataList"
        :key="index"
      >
        <div v-if="item.inventoryGoodsVOS&&item.inventoryGoodsVOS.length!==0">
          <div class="item_header multipleTableHeaderBg">
            <div class="purchase" style="padding-left:50px;">
              <span class="span_title">采购单号：</span>
              <span>{{item.purchaseNumber}}</span>
            </div>
          </div>
          <el-table
            border
            :row-class-name="tableRowClassName"
            @selection-change="pendingDelete"
            :data="item.inventoryGoodsVOS"
          >
            <el-table-column align="center" type="selection"></el-table-column>
            <el-table-column align="center" prop="commodityName" label="名称" sortable></el-table-column>
            <el-table-column align="center" prop="inventoryNumber" label="数量"></el-table-column>
            <el-table-column align="center" prop="factorySeeNumber" label="查货数">
              <template slot-scope="scope">
                <div>
                  <el-input v-model="scope.row.paidInCount"></el-input>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="regionSite" label="详情">
              <template slot-scope="scope">
                <div v-for="item in scope.row.cargoList">{{item.regionSiteName}} {{item.num}}</div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>-->
    </el-card>
    <div class="foot_btn_box">
      <el-button type="primary" @click="submission" :loading="loadingBtn">提 交</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </div>
</template>
<script>
import breadcrumb from "@/views/components/breadcrumb";
import orderlist from "./twolist/orderlist";
import {
  getTransfers,
  getStorageList,
  transfersWarehouseWarrant,
  checkSiteOrAddSite
} from "api/entrepotSet/stockManagement/stockPending/stockPending";
import { getTreeById } from "api/entrepotSet/locationcargoarea/index";
import { mapGetters } from "vuex";
import { getUUID } from "api/pulicJava";
export default {
  components: {
    breadcrumb,
    orderlist
  },
  data() {
    return {
      navList: [], //导航栏
      dataList: [], //列表数据
      isFlag: false, //货区货位显示
      isNums: false, //选多个禁止数量
      indexs: 0, //货区状态
      Cargonum: 0, //数量
      arealocation: [], //货区货位列表
      pendingList: [], //勾选
      quantitative: 0, //判断数量
      backupsnum: 0, //备货数量
      options: [], //仓库列表
      storageId: "", //仓库ID
      datePicker: "", //时间
      isShow: true, //仓库修改
      CargoStr: "", //货位
      loadingBtn:false
    };
  },
  mounted() {
    this.navList = this.$route.meta;
    this.getData();
    this.getList();
  },
  computed: {
    ...mapGetters(["id"])
  },
  methods: {
    //获取仓库
    getList() {
      getStorageList()
        .then(res => {
          if (res.status == 200) {
            this.options = res.data;
            let { storageId } = this.$route.query;
            this.storageId = parseFloat(storageId);
            // this.getTree();
            this.$refs.orderlist.getTree(this.storageId);
          }
        })
        .catch(error => {
          console.error("获取所属仓库", error);
        });
    },
    //获取调拨入库列表
    getData() {
      let id;
      let { putInStorageId } = this.$route.query;
      if (Object.prototype.toString.call(putInStorageId) == "[object Array]") {
        id = putInStorageId.join("");
      } else {
        id = putInStorageId;
      }

      let data = {
        putInStorageId: id
      };
      getTransfers(data)
        .then(res => {
          this.dataList = res.data.map(item => {
            item.checked = false;
            item.treasuryNote = "";
            if (item.unpackingDataVOS) {
              item.list = item.unpackingDataVOS.map(attr => {
                return {
                  cargoList: [],
                  aogTemplateName: attr.unpackingName,
                  receivableNumber: attr.inventoryNumberSum,
                  paidInCount: attr.inventoryNumberSum,
                  isName: false,
                  ...attr
                };
              });
            }
            // if (item.inventoryGoodsVOS) {
            //   item.inventoryGoodsVOS.forEach(attr => {
            //     attr.cargoList = [];
            //     attr.paidInCount = attr.inventoryNumber;
            //     attr.isName = false;
            //   });
            // }
            return item;
          });
        })
        .catch(error => {
          console.error("获取调拨入库列表", error);
        });
    },
    //获取货区
    getTree() {
      getTreeById({
        storageId: this.storageId,
        theStaging: 0
      })
        .then(res => {
          if (res.status == 200) {
            this.arealocation = res.data;
          }
        })
        .catch(error => {
          console.error("获取货区", error);
        });
    },
    //勾选采购单
    checkfather() {
      this.dataList.forEach(item => {
        if (item.checked) {
          item.unpackingDataVOS.forEach(attr => {
            attr.isName = true;
          });
        }
      });
    },
    //取消
    cancel() {
      this.$router.go(-1);
    },
    //关闭货位
    coreCancel() {
      this.isFlag = false;
    },
    //点击显示货区货位
    cargoArea() {
      let sum = 0;
      let num = 0;
      this.quantitative = 0;
      this.dataList.forEach(item => {
        if (item.unpackingDataVOS && item.unpackingDataVOS.length !== 0) {
          item.unpackingDataVOS.forEach(itm => {
            if (itm.isName) {
              sum += itm.paidInCount * 1;
              num++;
            }
          });
        }

        if (item.inventoryGoodsVOS && item.inventoryGoodsVOS.length !== 0) {
          item.inventoryGoodsVOS.forEach(itm => {
            if (itm.isName) {
              sum += itm.paidInCount * 1;
              num++;
            }
          });
        }
      });
      this.isFlag = !this.isFlag;
      this.isNums = num > 1;
      this.isReport = false;
      this.Cargonum = sum;
      this.backupsnum = sum;
    },
    //关闭货区货位
    closeBox() {
      this.isFlag = false;
    },
    //点击货区
    areaFun(i) {
      this.indexs = i;
      this.CargoStr = "";
    },
    //点击货位
    locationFun(obj) {
      let { regionId, regionName } = this.arealocation[this.indexs];
      let data = {
        regionId,
        siteCode: this.CargoStr,
        storageId: this.storageId,
        status: 0,
        userId: this.id
      };
      if (this.isCore) {
        this.$message.error("数量超出!");
        return;
      }
      checkSiteOrAddSite(data)
        .then(res => {
          if (res.status == 200) {
            let obj = {
              regionSiteName: regionName + " " + res.data.siteCode,
              regionId: res.data.regionId,
              siteId: res.data.siteId
            };
            this.locatFn(obj);
          }
        })
        .catch(error => {
          console.error("新增货位", error);
        });
    },

    //选择货位
    locatFn(obj) {
      let receivable = 0; //应收数
      let carNum = 0; //货位数量相加
      this.dataList.forEach(item => {
        if (item.unpackingDataVOS && item.unpackingDataVOS.length !== 0) {
          item.unpackingDataVOS.forEach(attr => {
            if (attr.isName) {
              receivable = attr.paidInCount;
              attr.cargoList.forEach(val => {
                carNum += val.num;
                this.quantitative = carNum + this.Cargonum;
              });
            }
          });
        }

        if (item.inventoryGoodsVOS && item.inventoryGoodsVOS.length !== 0) {
          item.inventoryGoodsVOS.forEach(attr => {
            if (attr.isName) {
              receivable = attr.paidInCount;
              attr.cargoList.forEach(val => {
                carNum += val.num;
                this.quantitative = carNum + this.Cargonum;
              });
            }
          });
        }
      });

      //判断当前是否勾选多个，然后分配货区货位
      if (this.isNums) {
        this.dataList.forEach(item => {
          if (item.unpackingDataVOS && item.unpackingDataVOS.length !== 0) {
            item.unpackingDataVOS.forEach(attr => {
              if (attr.isName) {
                if (attr.paidInCount != 0) {
                  if (attr.paidInCount > attr.inventoryNumberSum) {
                    this.$message.error("当前有实收大于数量!");
                    return;
                  }
                  attr.cargoList = [];
                  attr.cargoList.push({
                    regionSiteName: obj.regionSiteName,
                    siteId: obj.siteId,
                    regionId: obj.regionId,
                    num: attr.paidInCount
                  });
                }
              }
            });
          }

          if (item.inventoryGoodsVOS && item.inventoryGoodsVOS.length !== 0) {
            item.inventoryGoodsVOS.forEach(attr => {
              if (attr.isName) {
                if (attr.paidInCount != 0) {
                  if (attr.paidInCount > attr.inventoryNumberSum) {
                    this.$message.error("当前有实收大于数量");
                    return;
                  }
                  attr.cargoList = [];
                  attr.cargoList.push({
                    regionSiteName: obj.regionSiteName,
                    siteId: obj.siteId,
                    regionId: obj.regionId,
                    num: attr.paidInCount
                  });
                }
              }
            });
          }
        });
      } else {
        if (this.quantitative > receivable) {
          this.$message.error("数量超出!");
          return;
        }
        this.dataList.forEach(item => {
          if (item.unpackingDataVOS && item.unpackingDataVOS !== 0) {
            item.unpackingDataVOS.forEach(attr => {
              if (attr.isName) {
                if (attr.paidInCount != 0) {
                  if (attr.paidInCount > attr.inventoryNumberSum) {
                    this.$message.error("当前实收数量大于数量!");
                    return;
                  }
                  attr.cargoList.push({
                    regionSiteName: obj.regionSiteName,
                    num: this.Cargonum,
                    siteId: obj.siteId,
                    regionId: obj.regionId
                  });
                }
              }
            });
          }

          if (item.inventoryGoodsVOS && item.inventoryGoodsVOS !== 0) {
            item.inventoryGoodsVOS.forEach(attr => {
              if (attr.isName) {
                if (attr.paidInCount != 0) {
                  if (attr.paidInCount > attr.inventoryNumberSum) {
                    this.$message.error("当前实收数量大于数量!");
                    return;
                  }
                  attr.cargoList.push({
                    regionSiteName: obj.regionSiteName,
                    num: this.Cargonum,
                    siteId: obj.siteId,
                    regionId: obj.regionId
                  });
                }
              }
            });
          }
        });
      }
      this.isFlag = false;
      this.CargoStr = "";
    },
    //表格斑马线设置
    tableRowClassName({ row, rowIndex }) {
      return rowIndex % 2 != 0 ? "el-f0" : "";
    },
    //勾选
    pendingDelete(val) {
      val.forEach(item => {
        this.dataList.forEach(attr => {
          attr.inventoryGoodsVOS.forEach(key => {
            if (item.skuGoodsId == key.skuGoodsId) {
              key.isName = true;
            }
          });
        });
      });
      if (val.length == 0) {
        this.dataList.forEach(attr => {
          attr.isName = false;
        });
      }
    },
    //提交
    submission() {
      if (!this.storageId) {
        this.$message.error("请选择仓库!");
        return;
      }
      this.getNowFormatDate();
      let orderSum = 0; //订单数量累加
      let arr = []; //到货单拆分明细项集合
      let list = [];
      //订单货物列表处理
      this.dataList.forEach(item => {
        //
        if (item.unpackingDataVOS.length !== 0) {
          let purchasing = [];
          item.list.forEach(attr => {
            let unpacking = [];
            let sum = 0;
            attr.cargoList.forEach(val => {
              unpacking.push({
                storageId: this.storageId,
                regionId: val.regionId, //货区
                siteId: val.siteId,
                inventoryNumber: val.num
              });
              sum += val.num * 1;
            });
            if(unpacking.length==0){
              unpacking=[{inventoryNumber:attr.paidInCount}]
            }
            purchasing.push({
              aogTemplateId: attr.unpackingId,
              inventoryNumber: sum?sum:attr.paidInCount,
              purchasePackageDetailList: unpacking
            });
          });

          list.push({
            treasuryNote: item.treasuryNote,
            purchaseNumber: item.purchaseNumber,
            storageId: this.storageId,
            purchasePackageList: purchasing
          });
        }
      });

      //备货货物列表处理
      // let stockSum = 0; //备货数量累加
      // this.dataList.forEach(item => {
      //   if (item.inventoryGoodsVOS.length !== 0) {
      //     let stockArr = [];
      //     item.inventoryGoodsVOS.forEach(attr => {
      //       //处理备货商品集合数据
      //       stockSum += attr.paidInAmount * 1;
      //       attr.cargoList.forEach(attr => {
      //         stockArr.push({
      //           storageId: this.storageId,
      //           regionId: attr.regionId,
      //           siteId: attr.siteId,
      //           skuGoodsId: item.goodsId,
      //           inventoryNumber: attr.num
      //         });
      //       });
      //     });
      //     list.push({
      //       storageId: this.storageId,
      //       purchaseNumber: item.purchaseNumber,
      //       inventoryGoodsList: stockArr
      //     });
      //   }
      // });

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

      let ids;
      if (this.$route.query.putInStorageId instanceof Array) {
        ids = this.$route.query.putInStorageId;
      } else {
        ids = [this.$route.query.putInStorageId];
      }
      let data = {
        putInStorageType: this.$route.query.putInStorageType,
        storageId: this.storageId, //仓库id
        warehousePeople: this.id, //入库人id
        putInStorageIdList: ids,
        warehouseAmount: orderSum, //入库数量
        storingTheResults: "已入库", //入库结果
        accountingDate: this.datePicker, //记账日期
        list: list,
        receiptsType: this.$route.query.purchaseType
      };
      console.log(data);
      this.loadingBtn = true;
      getUUID({ serialNumber: "SI" }).then(res => {
        data.warehouseWarrantCode = res.data;
        transfersWarehouseWarrant(data)
          .then(res => {
            if (res.status == 200) {
              this.$message.success("入库成功!");
              this.loadingBtn = false;
              this.$router.go(-1);
            }else{
              this.loadingBtn = false;
            }
          })
          .catch(error => {
            this.loadingBtn = false;
            console.error("入库提交", error);
          });
      });
    },
    //补0
    repair(str) {
      return str < 10 ? "0" + str : str;
    },
    getNowFormatDate() {
      let date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      let hour = date.getHours();
      let minute = date.getMinutes();
      let second = date.getSeconds();
      this.datePicker = `${year}-${this.repair(month)}-${this.repair(
        day
      )} ${this.repair(hour)}:${this.repair(minute)}:${this.repair(second)}`;
    }
  }
};
</script>
<style lang="scss" scoped>
.foot_btn_box {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.details {
  width: 170px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.close {
  display: flex;
  flex-direction: row-reverse;
  padding: 0 10px;
  span {
    cursor: pointer;
  }
}
.areabg {
  background: #a2a2a2 !important;
}
.bk {
  border-bottom: 1px solid #ebeef5;
}
.quantity {
  width: 300px;
  position: absolute;
  background: #333333;
  z-index: 2;
  top: 45px;
  left: 0;
  color: #fff;
  border-radius: 4px;
}

.input_numbers {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 5px;
}
.reportloss {
  width: 150px;
  position: absolute;
  background: #333333;
  z-index: 2;
  right: -17px;
  top: 46px;
  color: #fff;
  border-radius: 4px;
}

.areaorlocation {
  display: flex;
  width: 100%;
}
.areaStyle {
  width: 35%;
  border-top: 1px solid #ebeef5;
  border-right: 1px solid #ebeef5;
  overflow-y: auto;
  max-height: 130px;

  &::-webkit-scrollbar {
    width: 10px;
    height: 1px;
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: #c5c5c5;
  }
  li {
    width: 100%;
    height: 30px;
    line-height: 30px;
    border-bottom: 1px solid #ebeef5;
    cursor: pointer;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  li:last-child {
    border-bottom: none;
  }
}
.location {
  width: 65%;

  .cargo {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 10px;
    span {
      min-width: 45px;
    }
  }

  .btn {
    display: flex;
    justify-content: center;
    margin: 10px 0;
  }
}

.operationbutton {
  display: flex;
  // flex-direction: row-reverse;
  align-items: center;
  position: relative;
}
.item_header {
  color: #909399;
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
.orderList {
  font-size: 14px;
  max-height: 650px;
  overflow: auto;
  color: #909399;
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
          .item_tiele {
            height: calc(100% - 90px);
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
        }
      }
    }
  }
}
</style>
