<template>
  <div>
    <div class="head_nav">
      <!-- 导航栏 -->
      <breadcrumb :navList="navList"></breadcrumb>
    </div>
    <el-card class="box_card">
      <!-- 信息头 -->
      <warehmodule @getStorageId="getStorageId" ref="warehmodule"></warehmodule>

      <div v-if="tableData.length!=0">
        <div class="page_head_div"></div>
        <div class="headerStyle">
          <div class="iconBox">
            <i class="Icon"></i>
            <span>备货货物列表</span>
          </div>
          <div>
            <div class="btnStyle">
              <el-button
                v-for="(item,index) in actionBtnList"
                :key="index"
                type="default"
                size="small"
                class="button-96"
                style="margin-left:40px;"
                @click="butGroupAction(item.type)"
              >{{item.name}}</el-button>
            </div>
          </div>

          <div class="quantity" v-if="isFlag">
            <div class="areaorlocation">
              <ul class="areaStyle">
                <li
                  v-for="(item,index) in arealocation"
                  :class="indexs==index?'areabg':''"
                  :key="index"
                  @click="areaFun(index)"
                >{{item.regionName}}</li>
              </ul>
              <ul class="location">
                <div class="input_numbers">
                  <span>数量：</span>
                  <el-input-number :disabled="isNums" size="small" v-model="Cargonum"></el-input-number>
                </div>

                <div class="cargo">
                  <span>货位：</span>
                  <el-input style="width:67%;" size="small" v-model.trim="CargoStr"></el-input>
                </div>

                <div class="btn">
                  <el-button type="primary" size="mini" @click="locationFun">确定</el-button>
                  <el-button size="mini" @click="coreCancel">取消</el-button>
                </div>
              </ul>
            </div>
          </div>
        </div>

        <div class="table_list lvs attribute m-top20">
          <el-table
            border
            style="width: 100%"
            @selection-change="handleSelectionChange"
            :row-class-name="tableRowClassName"
            :data="tableData"
          >
            <el-table-column align="center" type="selection"></el-table-column>
            <el-table-column align="center" prop="arrivalNoticeCode" label="到货单号" sortable></el-table-column>
            <el-table-column align="center" prop="purchaseNumber" label="采购单号"></el-table-column>
            <el-table-column align="center" prop="commodityName" label="商品名称" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="amount" label="应收数量"></el-table-column>
            <el-table-column align="center" prop="paidInAmount" label="实收数量">
              <template slot-scope="scope">
                <div>
                  <el-input size="small" v-model.number="scope.row.paidInAmount"></el-input>
                </div>
              </template>
            </el-table-column>
            <el-table-column width="270" align="center" prop="driver" label="货位">
              <template slot-scope="scope">
                <div v-if="scope.row.driver.length!=0">
                  <div v-for="(item,index) in scope.row.driver" :key="index">
                    <p>
                      <el-checkbox v-model="item.isT">{{item.regionSiteName}} {{item.num}}数量</el-checkbox>
                    </p>
                  </div>
                </div>
                <div class="CargoStyle" v-else>
                  <el-select size="small" v-model="scope.row.regionId" placeholder="请选择">
                    <el-option
                      v-for="item in arealocation"
                      :key="item.regionId"
                      :label="item.regionName"
                      :value="item.regionId"
                    ></el-option>
                  </el-select>
                  <el-input
                    @blur="CargoSureFn(scope.row.purchaseNumber,scope.row.CargoStr,scope.row.regionId)"
                    v-model.trim="scope.row.CargoStr"
                    size="small"
                  ></el-input>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="备注">
              <template slot-scope="scope">
                <div>
                  <el-input size="small" v-model="scope.row.treasuryNote"></el-input>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>

      <!-- 顾家 -->
      <lookfamily :isOrder='true' v-if="brandId==2" ref="lookfamily" :stockList="stockList"></lookfamily>
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
import {
  getPutInStorageGoodsList,
  addWarehouseWarrant,
  checkSiteOrAddSite
} from "api/entrepotSet/stockManagement/stockPending/stockPending";
import { getTreeById } from "api/entrepotSet/locationcargoarea/index";
import breadcrumb from "@/views/components/breadcrumb";
import warehmodule from "./components/warehmodule";
import lookfamily from "./components/lookfamily";
import { getUUID } from "api/pulicJava";
export default {
  components: {
    breadcrumb,
    warehmodule,
    lookfamily
  },
  data() {
    return {
      loadingbtn:false,
      tableData: [], //备货列表
      actionBtnList: [
        { name: "选择货区货位", type: 1 },
        { name: "删除", type: 2 }
      ],
      isShow: false,
      isFlag: false, //选择货区货位显示
      num: "",
      brandId: "",
      indexs: 0, //点击状态
      arealocation: [], //货区货位列表
      isNums: false, //判断数量
      Cargonum: 0, //数量
      chArr: [], //勾选
      quantitative: 0, //判断数量是否超出
      navList: [], //导航
      stockList: "",
      CargoStr: "", //货位
      isCore: false,
      storageId: ""
    };
  },
  created() {
    this.brandId = this.$route.query.brandId;
    let { putInStorageId } = this.$route.query;
    if (putInStorageId instanceof Array) {
      this.stockList = putInStorageId;
    } else {
      this.stockList = putInStorageId.split(",");
    }
  },
  mounted() {
    if (this.$route.query.brandId != 2) {
      this.getstockData();
      // this.getData();
    }
    this.navList = this.$route.meta;
  },
  methods: {
    getStorageId(storageId) {
      this.storageId = storageId;
      this.getData(storageId);
    },
    //获取备货列表
    getstockData() {
      let { putInStorageId } = this.$route.query;
      let stockList = "";
      if (putInStorageId instanceof Array) {
        stockList = putInStorageId;
      } else {
        stockList = putInStorageId.split(",");
      }
      let data = {
        putInStorageIdList: stockList.join(",")
      };

      getPutInStorageGoodsList(data)
        .then(res => {
          if (res.status == 200) {
            this.tableData = res.data.map(item => {
              let obj = this.arealocation.filter(item => {
                return item.theStaging == 4;
              })[0];
              if (!obj) {
                obj = this.arealocation[0] || {};
              }
              return {
                ...item,
                driver: [],
                paidInAmount: item.amount,
                CargoStr: "",
                treasuryNote: "",
                regionId: obj.regionId
              };
            });
          }
        })
        .catch(error => {
          console.error("获取备货列表", error);
        });
    },
    //货区货位列表数据
    getData(storageId) {
      getTreeById({
        storageId,
        theStaging: 0
      })
        .then(res => {
          if (res.status == 200) {
            this.arealocation = res.data;
            if (this.tableData.length != 0) {
              this.tableData = this.tableData.map(item => {
                let obj = this.arealocation.filter(item => {
                  return item.theStaging == 4;
                })[0];
                if (!obj) {
                  obj = this.arealocation[0] || {};
                }

                return {
                  ...item,
                  driver: [],
                  paidInAmount: item.amount,
                  CargoStr: "",
                  regionId: obj.regionId
                };
              });
            }
          }
        })
        .catch(error => {
          console.error("获取货区", error);
        });
    },
    //关闭选择货区货位
    closeBox() {
      this.isShow = false;
      this.isFlag = false;
    },
    //表格斑马线设置
    tableRowClassName({ row, rowIndex }) {
      return rowIndex % 2 != 0 ? "el-f0" : "";
    },

    //按钮组
    butGroupAction(type) {
      if (type == 1) {
        if (this.chArr.length < 1) {
          this.$message.error("你未勾选!");
          return;
        }
        // this.getData();
        this.Cargonum = 0;
        this.quantitative = 0;
        let sum = 0;
        //判断当前是多选还是单选
        if (this.chArr.length > 1) {
          this.chArr.forEach(key => {
            this.tableData.forEach(item => {
              if (key.purchaseNumber == item.purchaseNumber) {
                sum += item.paidInAmount;
              }
              item.driver.forEach(attr => {});
            });
          });
          this.Cargonum = sum;
          this.isNums = true;
        } else {
          this.tableData.forEach(item => {
            if (item.purchaseNumber == this.chArr[0].purchaseNumber) {
              sum = item.paidInAmount;
            }
            item.driver.forEach(attr => {});
          });
          this.Cargonum = sum;
          this.isNums = false;
        }
        this.isFlag = !this.isFlag;
      } else {
        this.tableData.forEach(item => {
          item.CargoStr = "";
          item.driver = item.driver.filter(attr => {
            return !attr.isT;
          });
        });
      }
    },
    //点击货区
    areaFun(i) {
      this.indexs = i;
      this.CargoStr = "";
    },
    //点击表格上确定
    CargoSureFn(purchaseNumber, CargoStr, regionId) {
      if (!regionId) {
        this.$message.error("没有选择货区!");
        return;
      }
      let data = {
        regionId: regionId,
        siteCode: CargoStr,
        storageId: this.storageId,
        status: 0,
        userId: this.id
      };
      checkSiteOrAddSite(data)
        .then(res => {
          if (res.status == 200) {
            let arr = this.arealocation.filter(item => {
              return regionId == item.regionId;
            });

            let obj = {
              regionSiteName: arr[0].regionName + " " + res.data.siteCode,
              regionId: res.data.regionId,
              siteId: res.data.siteId
            };

            if (!res.data.siteCode) {
              this.$message.error("当前没有写货位!");
              return;
            }
            this.tableData.forEach(item => {
              if (purchaseNumber == item.purchaseNumber) {
                item.driver=[{
                  regionSiteName: obj.regionSiteName,
                  num: item.paidInAmount,
                  regionId: obj.regionId,
                  siteId: obj.siteId,
                  isT: false
                }];
              }
            });
          }
        })
        .catch(error => {
          console.error("新增货位", error);
        });
    },
    //点击货位
    locationFun(obj) {
      let { regionId, regionName } = this.arealocation[this.indexs];
      let data = {
        regionId,
        siteCode: this.CargoStr,
        storageId: this.$refs.warehmodule.bindInfo.storageId,
        status: 0,
        userId: this.id
      };
      // if (this.isCore) {
      //   this.$message.error("数量超出!");
      //   return;
      // }
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
    locatFn(obj) {
      let receivable = 0; //应收数
      let carNum = 0; //货位数量相加
      this.chArr.forEach(key => {
        this.tableData.forEach(item => {
          if (key.purchaseNumber == item.purchaseNumber) {
            receivable = item.paidInAmount;
            item.driver.forEach(attr => {
              carNum += attr.num;
              this.quantitative = carNum + this.Cargonum;
            });
          }
        });
      });

      if (this.isNums) {
        this.chArr.forEach(key => {
          this.tableData.forEach(item => {
            if (item.purchaseNumber == key.purchaseNumber) {
              if (item.paidInAmount && item.paidInAmount != 0) {
                item.driver = [];
                item.driver.push({
                  regionSiteName: obj.regionSiteName,
                  num: item.paidInAmount,
                  regionId: obj.regionId,
                  siteId: obj.siteId,
                  isT: false
                });
              }
            }
          });
        });
      } else {
        // if (this.quantitative > receivable) {
        //   this.$message.error("数量超出!");
        //   this.isCore = true;
        //   return;
        // }
        this.chArr.forEach(key => {
          this.tableData.forEach(item => {
            if (this.chArr[0].purchaseNumber == item.purchaseNumber) {
              if (item.paidInAmount && item.paidInAmount != 0) {
                item.driver.push({
                  regionSiteName: obj.regionSiteName,
                  num: this.Cargonum,
                  regionId: obj.regionId,
                  siteId: obj.siteId,
                  isT: false
                });
              } else {
                this.$message.error("实收数量为0!");
              }
            }
          });
        });
      }
      this.isFlag = false;
      this.CargoStr = "";
    },
    //勾选
    handleSelectionChange(val) {
      this.chArr = val;
      this.isFlag = false;
    },

    //提交确认
    submission() {
      this.$confirm("是否入库?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
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
      if (!this.storageId) {
        this.$message.error("请选择仓库!");
        return;
      }

      // this.$message.error("订单货物列表还没有选择货区货位!");
      let stockSum = 0; //商品数量累加
      let orderSum = 0; //顾家数量累加
      let arr = []; //到货单拆分明细项集合
      let list = [];
      let putGoodslist = [];
      let isShow = false;

      //备货货物列表处理
      if (this.tableData.length != 0) {
        let totle = 0;
        let ySum=0;
        this.tableData.forEach(item => {
          let stockArr = [];
          //处理备货商品集合数据
          stockSum += item.paidInAmount * 1;
          ySum+=item.amount*1
          // totle += item.amount * 1;
          item.driver.forEach(attr => {
            totle+=attr.num*1
            stockArr.push({
              storageId: this.storageId,
              regionId: attr.regionId,
              siteId: attr.siteId,
              skuGoodsId: item.skuGoodsId,
              inventoryNumber: attr.num
            });
          });

          let num = item.amount - item.paidInAmount;
          if (num <= 0) {
            num = 0;
          }
          let putInId;
          if (this.$route.query.putInStorageId instanceof Array) {
            putInId = this.$route.query.putInStorageId.join("");
          } else {
            putInId = this.$route.query.putInStorageId;
          }
          putGoodslist.push({
            skuGoodsId: item.skuGoodsId,
            purchaseNumber: item.purchaseNumber,
            putInStorageId: putInId,
            goodsNumber: item.amount,
            receivableNumber: num
          });
          list.push({
            treasuryNote: item.treasuryNote,
            storageId: this.storageId,
            purchaseNumber: item.purchaseNumber,
            inventoryGoodsList: stockArr
          });
        });

        if (totle != ySum) {
          isShow = false;
        } else {
          isShow = true;
        }
      }

      // 顾家***************
      let gjArr = [];
      if (this.brandId == 2) {
        if (this.$refs.lookfamily.tableData.length != 0) {
          let totle = 0;
          let ySum = 0;
          this.$refs.lookfamily.tableData.forEach(item => {
            let stockArr = [];
            orderSum += item.paidInCover * 1;
            ySum+=item.receivableCover*1
            // totle += item.receivableCover * 1;
            gjArr.push(item);
            item.driver.forEach(attr => {
              totle+=attr.num*1
              stockArr.push({
                storageId: this.$route.query.storageId,
                regionId: attr.regionId,
                siteId: attr.siteId,
                skuGoodsId: item.skuGoodsId,
                inventoryNumber: attr.num,
                piece: item.paidInPiece
              });
            });
            list.push({
              treasuryNote: item.treasuryNote,
              storageId: this.$route.query.storageId,
              purchaseNumber: item.purchaseNumber,
              inventoryGoodsList: stockArr
            });

            let num = item.receivableCover - item.paidInCover;
            if (num <= 0) {
              num = 0;
            }
            let putsId = "";
            if (this.$route.query.putInStorageId instanceof Array) {
              putsId = this.$route.query.putInStorageId.join("");
            } else {
              putsId = this.$route.query.putInStorageId;
            }
            putGoodslist.push({
              skuGoodsId: item.skuGoodsId,
              purchaseNumber: item.purchaseNumber,
              putInStorageId: putsId,
              goodsNumber: item.receivableCover,
              receivableNumber: num
            });
          });

          if (totle != ySum) {
            isShow = false;
          } else {
            isShow = true;
          }
        }
      }

      if (list.length == 0) {
        this.$message.error("当前无数据!");
        return;
      }

      //验证
      // let flag = list.every(item => {
      //   return !item.inventoryGoodsList.length;
      // });

      // if (flag) {
      //   this.$message.error("当前没有分配货区货位!");
      //   return;
      // }

      let ids;
      if (this.$route.query.putInStorageId instanceof Array) {
        ids = this.$route.query.putInStorageId;
      } else {
        ids = [this.$route.query.putInStorageId];
      }

      let {
        expectedArrivalDate,
        processRemarks
      } = this.$refs.warehmodule.bindInfo;
      let data = {
        putInStorageType: this.$route.query.putInStorageType,
        storageId: this.storageId, //仓库id
        warehousePeople: this.$refs.warehmodule.id, //入库人id
        putInStorageIdList: ids,
        warehouseAmount: stockSum + orderSum, //入库数量
        storingTheResults: isShow ? "已入库" : "部分入库", //入库结果
        accountingDate: expectedArrivalDate, //记账日期
        remarks: processRemarks,
        list: list,
        gjGoodsList: gjArr,
        receiptsType: this.$route.query.purchaseType,
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
    },
    //关闭货位
    coreCancel() {
      this.isFlag = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.CargoStyle {
  display: flex;
}
.box_card {
  min-height: 650px;
}
.foot_btn_box {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
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
  right: 0;
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
.page_head_div {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  height: 50px;
  justify-content: space-between;
  border-bottom: 1px solid #ddd;
  margin-bottom: 10px;
}
.headerStyle{
  position: relative;
  display: flex;
  justify-content:space-between;
}
// .warp_head_action_btn {
//   display: flex;
//   flex-direction: row-reverse;
//   align-items: center;
//   border: none;
//   position: relative;
// }
</style>
