<template>
  <div>
    <div>
      <!-- <div class="page_head_div"></div> -->
      <div class="headerStyle">
        <div class="iconBox">
          <i class="Icon"></i>
          <span>商品列表</span>
        </div>
        <div>
          <div class="btnStyle">
            <el-button
              v-for="(item,index) in actionBtnList"
              :key="index"
              :type="item.style"
              size="small"
              class="button-96"
              style="margin-left:20px;"
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
                <el-button size="mini" @click="cancel">取消</el-button>
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
          <el-table-column align="center" prop="commodityName" show-overflow-tooltip label="商品名称" width="110"></el-table-column>
          <el-table-column align="center" prop="amount" label="应收数量" width="80"></el-table-column>
          <el-table-column align="center" label="实收数量" width="80">
            <template slot-scope="scope">
              <div>
                <el-input size="small" v-model.number="scope.row.paidInAmount"></el-input>
              </div>
            </template>
          </el-table-column>
          <el-table-column width="200" align="center" prop="driver" label="货位">
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
                  @blur="CargoSureFn(scope.row.purchaseOrderCommodityId,scope.row.CargoStr,scope.row.regionId)"
                  v-model.trim="scope.row.CargoStr"
                  size="small"
                ></el-input>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="brandName" label="品牌" width="80"></el-table-column>
          <el-table-column align="center" prop="categoryName" label="品类" width="80" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="commodityCode" label="商品编码" width="110" show-overflow-tooltip></el-table-column>
          <el-table-column width="150" align="center" prop="brandName" label="备注">
            <template slot-scope="scope">
              <div>
                <el-input size="small" v-model="scope.row.treasuryNote"></el-input>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
import {
  listPurchaseOrderGoods,
  checkSiteOrAddSite,
  getOrderAndPurchaseBackById
} from "api/entrepotSet/stockManagement/stockPending/stockPending";
import { getTreeById } from "api/entrepotSet/locationcargoarea/index";
import { mapGetters } from "vuex";
import { setTimeout } from "timers";
export default {
  props: ["stockList", "isOrder"],
  data() {
    return {
      tableData: [], //备货列表
      actionBtnList: [
        { name: "选择货区货位", style: "default", type: 1 },
        { name: "删除", style: "default", type: 2 }
      ],
      isShow: false,
      isFlag: false, //选择货区货位显示
      isNumber: false, //验证数量
      num: "",
      indexs: 0, //点击状态
      arealocation: [], //货区货位列表
      isNums: false, //判断数量
      Cargonum: 0, //数量
      CargoStr: "", //货位
      chArr: [], //勾选
      quantitative: 0, //判断数量是否超出
      storageId: "", //仓库ID
      isCore: false //货位判断
    };
  },
  created() {
    if (this.isOrder) {
      this.getstockData();
    } else {
      this.getData(this.$route.query.storageId);
    }
  },
  computed: {
    ...mapGetters(["id"])
  },
  methods: {
    //获取订单入库商品列表
    getstockData() {
      let data = {
        purchaseOrderId: this.$route.query.purchaseOrderId
      };
      listPurchaseOrderGoods(data)
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
          console.error("获取订单入库商品列表", error);
        });
    },

    //同一到货单入库
    OrderAnd() {
      let { goodsId } = this.$route.query;

      let data = {
        goodsId
      };
      getOrderAndPurchaseBackById(data)
        .then(res => {
          if (res.status == 200) {
            this.tableData = res.data.list.map(item => {
              let obj = this.arealocation.filter(attr => {
                return attr.theStaging == 4;
              })[0];
              if (!obj) {
                obj = this.arealocation[0] || {};
              }
              return {
                ...item,
                regionId: obj.regionId,
                driver: [],
                paidInAmount: item.amount,
                CargoStr: ""
              };
            });
          }
        })
        .catch(error => {
          console.error("获取订单备货入库列表", error);
        });
    },
    //货区货位列表数据
    getData(storageId) {
      this.storageId = storageId;
      getTreeById({
        storageId,
        theStaging: 0
      })
        .then(res => {
          if (res.status == 200) {
            this.arealocation = res.data;
            if (!this.isOrder) {
              this.OrderAnd();
            }
            if (this.tableData.length != 0) {
              this.tableData = this.tableData.map(item => {
                let obj = this.arealocation.filter(attr => {
                  return attr.theStaging == 4;
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
      this.quantitative = 0;
      //type==1选择货区  or type==0删除
      if (type == 1) {
        if (this.chArr.length < 1) {
          this.$message.error("你未勾选!");
          return;
        }
        this.Cargonum = 0;

        let sum = 0;
        //判断当前是多选还是单选
        if (this.chArr.length > 1) {
          this.chArr.forEach(key => {
            this.tableData.forEach(item => {
              if (key.purchaseOrderCommodityId == item.purchaseOrderCommodityId) {
                sum += item.paidInAmount*1;
              }
            });
          });
          this.Cargonum = sum;
          this.isNums = true;
        } else {
          this.tableData.forEach(item => {
            if (item.purchaseOrderCommodityId == this.chArr[0].purchaseOrderCommodityId) {
              sum = item.paidInAmount*1;
            }
          });
          this.Cargonum = sum;
          this.isNums = false;
        }
        console.log(this.Cargonum);

        if (!this.Cargonum) {
          this.$message.error("当前没有实收数量!");
          return;
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
    CargoSureFn(purchaseOrderCommodityId, CargoStr, regionId) {
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
              if (purchaseOrderCommodityId == item.purchaseOrderCommodityId) {
                if (item.paidInAmount == 0 && !item.paidInAmount) {
                  this.$message.error("当前实收数为有误或者为0!");
                  return;
                }
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
    locationFun() {
      let { regionId, regionName } = this.arealocation[this.indexs];
      let data = {
        regionId,
        siteCode: this.CargoStr,
        storageId: this.storageId,
        status: 0,
        userId: this.id
      };
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
      this.chArr.forEach(key => {
        this.tableData.forEach(item => {
          if (key.purchaseOrderCommodityId == item.purchaseOrderCommodityId) {
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
            if (item.purchaseOrderCommodityId == key.purchaseOrderCommodityId) {
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
        if (this.quantitative > receivable) {
          this.$message.error("数量超出!");
          this.isCore = true;
          return;
        }
        this.chArr.forEach(key => {
          this.tableData.forEach(item => {
            if (this.chArr[0].purchaseOrderCommodityId == item.purchaseOrderCommodityId) {
              if (item.paidInAmount && item.paidInAmount != 0) {
                item.driver.push({
                  regionSiteName: obj.regionSiteName,
                  num: this.Cargonum,
                  regionId: obj.regionId,
                  siteId: obj.siteId,
                  isT: false
                });
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
    //取消
    cancel() {
      this.isFlag = false;
      this.CargoStr = "";
    }
  }
};
</script>
<style lang="scss" scoped>
.CargoStyle {
  display: flex;
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
  height: 30px;
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
