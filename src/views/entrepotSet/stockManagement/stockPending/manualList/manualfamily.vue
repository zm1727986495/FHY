<template>
  <div v-if="tableData.length!==0">
    <div class="page_head_div"></div>
    <div class="iconBox">
      <i class="Icon"></i>
      <span>顾家列表</span>
    </div>
    <div class="warp_head_action_btn">
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
              <el-input style="width:67%;" size="small" v-model="CargoStr"></el-input>
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
        <el-table-column fixed type="selection" width="40"></el-table-column>
        <el-table-column align="center" prop="rowCode" label="行号" width="210" sortable></el-table-column>
        <el-table-column align="center" prop="purchaseNumber" label="采购单号" width="210"></el-table-column>
        <el-table-column align="center" prop="commodityName" label="商品名称" width="210"></el-table-column>
        <el-table-column align="center" prop="commodityModel" label="型号" width="210"></el-table-column>
        <el-table-column align="center" prop="commodityName" label="规格" width="210"></el-table-column>
        <el-table-column align="center" prop="amount" label="采购数量" width="210"></el-table-column>
        <el-table-column align="center" label="货区货位" width="210" show-overflow-tooltip>
          <template slot-scope="scope">
            <div v-for="(item,index) in scope.row.driver" :key="index">
              <el-checkbox v-model="item.isT">{{item.regionSiteName}} {{item.num}}数量</el-checkbox>
            </div>
          </template>
        </el-table-column>
        <!-- <el-table-column align="center" prop="receivableCover" label="应收数量/套" width="210"></el-table-column> -->
        <el-table-column align="center" label="实收数量/套" width="210">
          <template slot-scope="scope">
            <div>
              <el-input v-model="scope.row.paidInCover" @input="receiptsSet(scope.row)"></el-input>
            </div>
          </template>
        </el-table-column>
        <!-- <el-table-column align="center" prop="receivablePiece" label="应收数量/件" width="210"></el-table-column> -->

        <el-table-column align="center" label="实收数量/件" width="210">
          <template slot-scope="scope">
            <div>
              <el-input v-model="scope.row.paidInPiece"></el-input>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- <div class="page_head_div"></div> -->
  </div>
</template>
<script>
import {
  listPurchaseOrderGoods,
  checkSiteOrAddSite
} from "api/entrepotSet/stockManagement/stockPending/stockPending";
import { mapGetters } from "vuex";
export default {
  props: ["stockList", "arealocation"],
  data() {
    return {
      tableData: [],
      actionBtnList: [
        { name: "删除", style: "default", type: 3 },
        { name: "选择货区货位", style: "default", type: 1 }
        // { name: "报损", style: "default", type: 2 },
      ],
      isFlag: false, //选择货区货位显示
      num: "",
      indexs: 0, //点击状态
      isNums: false, //判断数量
      Cargonum: 0, //数量
      chArr: [], //勾选
      quantitative: 0, //判断数量是否超出
      CargoStr: ""
    };
  },
  computed: {
    ...mapGetters(["id"])
  },
  methods: {
    //获取顾家列表
    getstockData(id) {
      let data = {
        purchaseOrderId: id
      };
      listPurchaseOrderGoods(data)
        .then(res => {
          this.tableData = res.data.map(item => {
            return { paidInPiece: "0", paidInCover: "0", driver: [], ...item };
          });
        })
        .catch(error => {
          console.error("获取顾家列表", error);
        });
    },
    //关闭选择货区货位
    cancel() {
      this.isFlag = false;
    },
    //表格斑马线设置
    tableRowClassName({ row, rowIndex }) {
      return rowIndex % 2 != 0 ? "el-f0" : "";
    },

    //按钮组
    butGroupAction(type) {
      if (type == 1) {
        if (this.arealocation.length == 0) {
          this.$message.error("当前仓库没有货区货位!");
          return;
        }
        if (this.chArr.length < 1) {
          this.$message.error("你未勾选!");
          return;
        }
        this.Cargonum = 0;
        this.quantitative = 0;
        let sum = 0;
        //判断当前是多选还是单选
        console.log(this.chArr);

        if (this.chArr.length > 1) {
          this.chArr.forEach(key => {
            this.tableData.forEach(item => {
              if (key.gjGoodsDetailId == item.gjGoodsDetailId) {
                sum += item.paidInCover;
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
    //点击货区
    areaFun(i) {
      this.indexs = i;
      this.CargoStr = "";
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
              if (item.receivableCover && item.receivableCover !== 0) {
                item.driver = [];
                item.driver.push({
                  regionSiteName: obj.regionSiteName,
                  num: item.receivableCover,
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
          return;
        }
        this.chArr.forEach(key => {
          this.tableData.forEach(item => {
            if (this.chArr[0].gjGoodsDetailId == item.gjGoodsDetailId) {
              if (item.receivableCover && item.receivableCover !== 0) {
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
    //实收套输入改变
    receiptsSet(obj) {
      this.tableData.forEach(item => {
        if (obj.gjGoodsDetailId == item.gjGoodsDetailId) {
          if (obj.paidInCover > item.receivableCover) {
            this.$message.error("超出应收数量!");
          }
          item.driver = [];
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
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
.warp_head_action_btn {
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  border: none;
  position: relative;
}
</style>
