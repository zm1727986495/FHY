<template>
  <div>
    <!-- 货区货位 -->
    <div class="operationbutton m-bottom10">
      <el-button size="small" class="button-96 m-right40" @click.stop="cargoFn">选择货区货位</el-button>
      <el-button size="small" class="button-96 m-right40" @click.stop="delCommodity">删除</el-button>

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
              <el-button size="mini" @click="closeBox">取消</el-button>
            </div>
          </ul>
        </div>
      </div>
    </div>

    <!-- 列表 -->
    <div class="table_list lvs attribute">
      <el-table
        border
        :row-class-name="tableRowClassName"
        @selection-change="chooseDelete"
        :data="tableData"
      >
        <el-table-column type="selection" width="40" fixed="left"></el-table-column>
        <el-table-column align="center" prop="commodityName" label="商品名称" width="220"></el-table-column>
        <el-table-column align="center" prop="commodityCode" label="商品编码" width="220" sortable></el-table-column>
        <el-table-column align="center" prop="commodityUnit" label="单位" width="220"></el-table-column>
        <el-table-column align="center" prop="commodityModel" label="型号" width="220"></el-table-column>
        <!-- 顾家 -->
        <el-table-column align="center" prop="inventoryNumber" label="实收数量/件" width="220" v-if="isBrand">
          <template slot-scope="scope">
            <div>
              <el-input v-model="scope.row.piece"></el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="inventoryNumber" label="实收数量/套" width="220" v-if="isBrand">
          <template slot-scope="scope">
            <div>
              <el-input v-model="scope.row.inventoryNumber" @input="emptyCargo(scope.row)"></el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="inventoryNumber" label="数量" width="220" v-else>
          <template slot-scope="scope">
            <div>
              <el-input v-model="scope.row.inventoryNumber" @input="emptyCargo(scope.row)"></el-input>
            </div>
          </template>
        </el-table-column>

        <!-- 正常商品 -->
        <el-table-column align="center" prop="categoryName" label="货区货位" width="220">
          <template slot-scope="scope">
            <div>
              <div v-for="(item,index) in scope.row.cargoList" :key="index">
                <el-checkbox v-model="item.isT">{{item.regionSiteName}} {{item.num}}数量</el-checkbox>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column align="center" prop="materialName" label=" 颜色" width="220">
          <template slot-scope="scope">
            <div>
              <el-select v-model="scope.row.commodityColourId" placeholder="请选择">
                <el-option
                  v-for="item in scope.row.colorList"
                  :key="item.colourId"
                  :label="item.colourName"
                  :value="item.colourId"
                ></el-option>
              </el-select>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="colourName" label="材质" width="220">
          <template slot-scope="scope">
            <div>
              <el-select v-model="scope.row.commodityMaterialId" placeholder="请选择">
                <el-option
                  v-for="item in scope.row.materialList"
                  :key="item.materialId"
                  :label="item.materialName"
                  :value="item.materialId"
                ></el-option>
              </el-select>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="colourName" label="系列" width="220">
          <template slot-scope="scope">
            <div>
              <el-select v-model="scope.row.commoditySeriesId" placeholder="请选择">
                <el-option
                  v-for="item in scope.row.seriesList"
                  :key="item.seriesId"
                  :label="item.seriesName"
                  :value="item.seriesId"
                ></el-option>
              </el-select>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="classifyName"
          label="分类名称"
          width="220"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column align="center" prop="category_name" label="品类名称" width="220"></el-table-column>
        <el-table-column
          align="center"
          prop="companyName"
          label="供应商"
          width="220"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column align="center" prop="brand_name" label="品牌" width="220"></el-table-column>
        <el-table-column align="center" prop="commodityWide" label="宽" width="220"></el-table-column>
        <el-table-column align="center" prop="commodityHigh" label="高" width="220"></el-table-column>
        <el-table-column align="center" prop="commodityLong" label="深" width="220"></el-table-column>
        <el-table-column align="center" prop="commodityThick" label="厚" width="220"></el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import {
  getGoodsSKUId,
  insertCommoditySku,
  checkSiteOrAddSite
} from "api/entrepotSet/stockManagement/stockPending/stockPending";
export default {
  props: ["tableData", "isBrand", "ruleForm", "arealocation", "storageId"],
  data() {
    return {
      choseArr: [], //勾选数据
      indexs: 0, //点击货区状态
      Cargonum: 0, // 货区数量
      isFlag: false, //显示货区货位
      isNums: false, //是否能修改货区货位数量
      CargoStr: "" //货位
    };
  },
  mounted() {
    // this.getCargoList();
  },
  methods: {
    //选择货区货位显示
    cargoFn() {
      if (this.arealocation.length == 0) {
        this.$message.error("当前仓库没有货区货位!");
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
        sum += item.inventoryNumber * 1;
        num++;
      });

      this.isNums = num > 1;
      this.Cargonum = sum;
      this.backupsnum = sum;
      this.isFlag = !this.isFlag;
    },
    //表格斑马线设置
    tableRowClassName({ row, rowIndex }) {
      return rowIndex % 2 != 0 ? "el-f0" : "";
    },
    //勾选
    chooseDelete(val) {
      this.choseArr = val;
    },

    //修改数量清空货区货位
    emptyCargo(row) {
      this.tableData.forEach(item => {
        if (item.commodityId == row.commodityId) {
          item.cargoList = [];
        }
      });
    },
    //删除商品
    delCommodity() {
      this.choseArr.forEach(item => {
        this.tableData.forEach((attr, index) => {
          if (item.commodityId == attr.commodityId) {
            // this.tableData.splice(index, 1);
            attr.cargoList = attr.cargoList.filter(val => {
              return !val.isT;
            });
          }
        });
      });
    },
    //关闭货区
    closeBox() {
      this.isFlag = false;
      this.CargoStr = "";
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
            receivable = attr.inventoryNumber;
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
              if (attr.inventoryNumber && attr.inventoryNumber != 0) {
                attr.cargoList = [];
                attr.cargoList.push({
                  regionSiteName: obj.regionSiteName,
                  siteId: obj.siteId,
                  regionId: obj.regionId,
                  num: attr.inventoryNumber,
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
              if (attr.inventoryNumber && attr.inventoryNumber != 0) {
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
</style>
