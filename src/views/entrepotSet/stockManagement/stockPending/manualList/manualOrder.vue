<template>
  <div>
    <!-- 货区货位 -->
    <div class="operationbutton m-bottom10">
      <el-button size="small" class="button-96 m-right40" @click.stop="cargo">选择货区货位</el-button>

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
    <!-- 表格 -->
    <div class="table_list lvs attribute">
      <el-table
        border
        :row-class-name="tableRowClassName"
        @selection-change="chooseDelete"
        :data="tableData"
      >
        <el-table-column type="selection" width="40" fixed></el-table-column>
        <el-table-column align="center" prop="commodityName" label="商品名称" width="220"></el-table-column>
        <el-table-column align="center" prop="commodityCode" label="商品编码" width="220" sortable></el-table-column>
        <el-table-column align="center" prop="commodityUnit" label="单位" width="220"></el-table-column>
        <el-table-column align="center" prop="commodityModel" label="型号" width="220"></el-table-column>
        <el-table-column align="center" prop="amount" label="数量" width="220"></el-table-column>
        <el-table-column align="center" prop="categoryName" label="货区货位" width="220">
          <template slot-scope="scope">
            <div>
              <div v-for="(item,index) in scope.row.cargoList" :key="index">
                <el-checkbox v-model="item.isT">{{item.regionSiteName}} {{item.num}}数量</el-checkbox>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="classifyName" label="分类名称" width="220"></el-table-column>
        <el-table-column align="center" prop="categoryName" label="品类名称" width="220"></el-table-column>
        <el-table-column align="center" prop="companyName" label="供应商" width="220"></el-table-column>
        <el-table-column align="center" prop="materialName" label="材质" width="220"></el-table-column>
        <el-table-column align="center" prop="colourName" label="颜色" width="220"></el-table-column>
        <el-table-column align="center" prop="brandName" label="品牌" width="220"></el-table-column>

        <el-table-column align="center" prop="commodityWide" label="宽" width="220"></el-table-column>
        <el-table-column align="center" prop="commodityHigh" label="高" width="220"></el-table-column>
        <el-table-column align="center" prop="commodityLong" label="深" width="220"></el-table-column>
        <el-table-column align="center" prop="commodityThick" label="长" width="220"></el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import {
  listPurchaseOrderGoods,
  checkSiteOrAddSite
} from "api/entrepotSet/stockManagement/stockPending/stockPending";
import { mapGetters } from "vuex";
export default {
  props: ["arealocation", "storageId"],
  data() {
    return {
      isFlag: false, //显示货区货位
      isNums: false, //是否能修改货区货位数量
      Cargonum: 0, // 货区数量
      indexs: 0, //点击货区状态
      tableData: [], //列表数量
      choseArr: [], //勾选
      quantitative: 0, //判断数量是否超出
      backupsnum: 0, //备份数量
      CargoStr: "" //货位
    };
  },
  computed: {
    ...mapGetters(["id"])
  },
  mounted() {
    // let that = this;
    // document.addEventListener("click", function(e) {
    //   that.isFlag = false;
    // });
  },
  methods: {
    //获取采购单商品列表
    getPurchaseGoods(id) {
      let data = {
        purchaseOrderId: id
      };
      listPurchaseOrderGoods(data)
        .then(res => {
          this.tableData = res.data.map(item => {
            return { cargoList: [], ...item };
          });
        })
        .catch(error => {
          console.error("获取采购单商品列表", error);
        });
    },
    //选择货区货位显示
    cargo() {
      if (!this.storageId) {
        this.$message.error("没有仓库!");
        return;
      }
      if (this.choseArr.length < 1) {
        this.$message.error("请勾选");
        return;
      }
      let sum = 0;
      let num = 0;
      this.quantitative = 0;
      this.choseArr.forEach(item => {
        sum += item.amount * 1;
        num++;
      });

      this.isNums = num > 1;
      this.Cargonum = sum;
      this.backupsnum = sum;
      this.isFlag = !this.isFlag;
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
      this.choseArr.forEach(item => {
        this.tableData.forEach(attr => {
          if (item.skuGoodsId == attr.skuGoodsId) {
            receivable = attr.amount;
            attr.cargoList.forEach(key => {
              carNum += key.num;
              this.quantitative = carNum + this.Cargonum;
            });
          }
        });
      });

      //判断当前是否勾选多个，然后分配货区货位
      if (this.isNums) {
        this.choseArr.forEach(item => {
          this.tableData.forEach(attr => {
            if (item.skuGoodsId == attr.skuGoodsId) {
              if (attr.amount && attr.amount != 0) {
                attr.cargoList = [];
                attr.cargoList.push({
                  regionSiteName: obj.regionSiteName,
                  siteId: obj.siteId,
                  regionId: obj.regionId,
                  num: attr.amount,
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
        this.choseArr.forEach(item => {
          this.tableData.forEach(attr => {
            if (item.skuGoodsId == attr.skuGoodsId) {
              if (attr.amount && attr.amount != 0) {
                attr.cargoList.push({
                  regionSiteName: obj.regionSiteName,
                  num: this.Cargonum,
                  siteId: obj.siteId,
                  regionId: obj.regionId,
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
    //点击货区
    areaFun(i) {
      this.indexs = i;
      this.CargoStr = "";
    },
    //表格斑马线设置
    tableRowClassName({ row, rowIndex }) {
      return rowIndex % 2 != 0 ? "el-f0" : "";
    },
    //勾选
    chooseDelete(val) {
      this.choseArr = val;
    },
    //关闭货位
    cancel() {
      this.isFlag = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.operationbutton {
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  position: relative;
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
.input_numbers {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 5px 0;
  padding-bottom: 5px;
}
</style>
