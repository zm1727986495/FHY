<template>
  <div v-if="tableData.length!==0">
    <!-- <div class="page_head_div"></div> -->
    <div class="headerStyle">
      <div class="iconBox">
        <i class="Icon"></i>
        <span>顾家列表</span>
      </div>
      <div>
        <div class="btnStyle">
          <el-button
            v-for="(item,index) in actionBtnList"
            :key="index"
            :type="item.style"
            size="small"
            class="button-96"
            style="margin-left:40px;"
            @click="butGroupAction(item.type)"
            @click.stop
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
              <el-input-number
                :disabled="isNums"
                size="small"
                v-model="Cargonum"
                @change="handleChange"
              ></el-input-number>
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
        <el-table-column fixed="left" type="selection" width="40"></el-table-column>
        <el-table-column align="center" prop="rowCode" label="行号" width="100" sortable></el-table-column>
        <el-table-column align="center" prop="purchaseNumber" label="采购单号" width="180"></el-table-column>
        <el-table-column align="center" prop="commodityName" label="商品名称" width="210"></el-table-column>
        <el-table-column align="center" prop="receivableCover" label="应收数量/套" width="120"></el-table-column>
        <el-table-column align="center" label="实收数量/套" width="120">
          <template slot-scope="scope">
            <div>
              <el-input size="small" v-model.number="scope.row.paidInCover"></el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="receivablePiece" label="应收数量/件" width="120"></el-table-column>

        <el-table-column align="center" label="实收数量/件" width="120">
          <template slot-scope="scope">
            <div>
              <el-input size="small" v-model.number="scope.row.paidInPiece"></el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="货区货位" width="230" show-overflow-tooltip>
          <template slot-scope="scope">
            <div v-if="scope.row.driver.length!=0">
              <div v-for="(item,index) in scope.row.driver" :key="index">
                <el-checkbox v-model="item.isT">{{item.regionSiteName}} {{item.num}}数量</el-checkbox>
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
                @blur="CargoSureFn(scope.row.gjGoodsDetailId,scope.row.CargoStr,scope.row.regionId)"
                v-model.trim="scope.row.CargoStr"
                size="small"
              ></el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="备注" width="210">
          <template slot-scope="scope">
            <div>
              <el-input size="small" v-model="scope.row.treasuryNote"></el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="amount" label="采购数量" width="210"></el-table-column>
        <el-table-column align="center" prop="commodityModel" label="型号" width="210"></el-table-column>
        <el-table-column align="center" prop="commodityName" label="规格" width="210"></el-table-column>
      </el-table>
    </div>
    <!-- <div class="page_head_div"></div> -->
  </div>
</template>
<script>
import {
  getPutInStorageGoodsGjList,
  checkSiteOrAddSite
} from "api/entrepotSet/stockManagement/stockPending/stockPending";
import { getTreeById } from "api/entrepotSet/locationcargoarea/index";
import { mapGetters } from "vuex";
export default {
  props: ["stockList", "isOrder"],
  data() {
    return {
      tableData: [],
      actionBtnList: [
        { name: "删除", style: "default", type: 3 },
        { name: "选择货区货位", style: "default", type: 1 }
        // { name: "报损", style: "default", type: 2 },
      ],
      isShow: false,
      isFlag: false, //选择货区货位显示
      num: "",
      indexs: 0, //点击状态
      arealocation: [], //货区货位列表
      isNums: false, //判断数量
      Cargonum: 0, //数量
      chArr: [], //勾选
      quantitative: 0, //判断数量是否超出
      isCore: false, //货位判断
      CargoStr: "" //货位
    };
  },
  created() {
    this.getData();
  },
  computed: {
    ...mapGetters(["id"])
  },
  methods: {
    //获取顾家列表
    getstockData() {
      let data = {};
      if (this.isOrder) {
        data.putInStorageIdList = this.stockList.join(",");
      } else {
        data.putInStorageIdList = this.$route.query.goodsId;
      }

      getPutInStorageGoodsGjList(data)
        .then(res => {
          if ((res.status = 200)) {
            this.tableData = res.data.map(item => {
              let obj = this.arealocation.filter(item => {
                return item.theStaging == 4;
              })[0];
              if (!obj) {
                obj = this.arealocation[0] || {};
              }
              return {
                ...item,
                paidInPiece: item.receivablePiece,
                paidInCover: item.receivableCover,
                driver: [],
                CargoStr: "",
                treasuryNote: "",
                regionId: obj.regionId
              };
            });
          }
        })
        .catch(error => {
          console.error("获取顾家列表", error);
        });
    },
    //货区货位列表数据
    getData() {
      getTreeById({
        storageId: this.$route.query.storageId,
        theStaging: 0
      })
        .then(res => {
          if (res.status == 200) {
            this.arealocation = res.data;
            if (this.tableData.length != 0) {
              this.tableData = this.tableData.map(item => {
                let obj = this.arealocation.filter(attr => {
                  return attr.theStaging == 4;
                })[0];
                if (!obj) {
                  obj = this.arealocation[0] || {};
                }
                return {
                  paidInPiece: "",
                  paidInCover: "",
                  driver: [],
                  CargoStr: "",
                  regionId: obj.regionId,
                  ...item
                };
              });
            }

            // 获取顾家列表
            this.getstockData();
          }
        })
        .catch(error => {
          console.error("获取货区", error);
        });
    },
    //点击表格上确定
    CargoSureFn(gjGoodsDetailId, CargoStr, regionId) {
      if (!regionId) {
        this.$message.error("没有选择货区!");
        return;
      }
      if (!CargoStr) {
        this.$message.error("没有输入货位!");
        return;
      }
      let data = {
        regionId: regionId,
        siteCode: CargoStr,
        storageId: this.$route.query.storageId,
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
              if (gjGoodsDetailId == item.gjGoodsDetailId) {
                if (item.paidInCover == 0 && !item.paidInCover) {
                  this.$message.error("当前实收数为有误或者为0!");
                  return;
                }
                item.driver=[{
                  regionSiteName: obj.regionSiteName,
                  num: item.paidInCover,
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
        this.Cargonum = 0;
        this.quantitative = 0;
        let sum = 0;
        //判断当前是多选还是单选

        if (this.chArr.length > 1) {
          this.chArr.forEach(key => {
            this.tableData.forEach(item => {
              if (key.gjGoodsDetailId == item.gjGoodsDetailId) {
                sum += key.paidInCover * 1;
              }
            });
          });
          this.Cargonum = sum;
          this.isNums = true;
        } else {
          this.tableData.forEach(item => {
            if (item.gjGoodsDetailId == this.chArr[0].gjGoodsDetailId) {
              sum = item.paidInCover;
            }
          });
          this.Cargonum = sum;
          this.isNums = false;
        }
        this.isFlag = !this.isFlag;
      } else if (type == 3) {
        //删除货区货位
        this.tableData.forEach(item => {
          item.driver.forEach((attr, index) => {
            if (attr.isT) {
              item.driver.splice(index, 1);
            }
          });
        });
      }
    },
    //货区货位数量change
    handleChange() {},
    //点击货区
    areaFun(i) {
      this.indexs = i;
    },
    //点击货位
    locationFun() {
      let { regionId, regionName } = this.arealocation[this.indexs];
      let data = {
        regionId,
        siteCode: this.CargoStr,
        storageId: this.$route.query.storageId,
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
      if (this.Cargonum == 0) {
        this.$message.error("当前数量为0！");
        return;
      }
      let receivable = 0; //应收数
      let carNum = 0; //货位数量相加
      this.chArr.forEach(key => {
        this.tableData.forEach(item => {
          if (key.gjGoodsDetailId == item.gjGoodsDetailId) {
            receivable = item.paidInCover;
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
            if (item.gjGoodsDetailId == key.gjGoodsDetailId) {
              if (item.paidInCover && item.paidInCover != 0) {
                item.driver = [];
                item.driver.push({
                  regionSiteName: obj.regionSiteName,
                  num: item.paidInCover,
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
            if (this.chArr[0].gjGoodsDetailId == item.gjGoodsDetailId) {
              if (item.paidInCover && item.paidInCover != 0) {
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
      console.log(val);

      this.chArr = val;
      this.isFlag = false;
    },
    //关闭货位
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
