<template>
  <div class="rewarehousing">
    <div class="pl-20">
      <div class="warp_head">
        <div class="operationbutton m-bottom10">
          <el-button size="small" class="button-96 m-right40" @click="cargoArea">选择货区货位</el-button>
          <el-button size="small" class="button-96 m-right40" @click="delCargo">删除</el-button>
        </div>
        <!-- 分配货区货位 -->
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
                <el-button size="mini" @click="areaCancel">取消</el-button>
              </div>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div v-if="tableData&&tableData.length!=0" class="table_list lvs attribute m-top20">
      <el-table
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
        :row-class-name="tableRowClassName"
        :data="tableData"
      >
        <el-table-column align="center" type="selection"></el-table-column>
        <el-table-column align="center" prop="commodityName" show-overflow-tooltip label="商品名称"></el-table-column>
        <el-table-column align="center" prop="receivableNumber" label="应收数量" v-if="brandId!=2"></el-table-column>
        <el-table-column align="center" prop="paidInAmount" label="实收数量" v-if="brandId!=2">
          <template slot-scope="scope">
            <div>
              <el-input size="small" v-model.number="scope.row.paidInAmount"></el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="receivableNumber" label="应收套" v-if="brandId==2"></el-table-column>
        <el-table-column align="center" prop="receivableNumber" label="实收套" v-if="brandId==2">
          <template slot-scope="scope">
            <div>
              <el-input size="small" v-model.number="scope.row.paidInAmount"></el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="receivablePiece" label="应收件" v-if="brandId==2"></el-table-column>
        <el-table-column align="center" prop="piece" label="实收件" v-if="brandId==2">
          <template slot-scope="scope">
            <div>
              <el-input size="small" v-model.number="scope.row.piece"></el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column width="270" align="center" label="货位">
          <template slot-scope="scope">
            <div v-if="scope.row.cargoList.length!=0">
              <div v-for="(item,index) in scope.row.cargoList" :key="index">
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
                @blur="CargoSureFn(scope.row.skuGoodsId,scope.row.CargoStr,scope.row.regionId)"
                v-model.trim="scope.row.CargoStr"
                size="small"
              ></el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="treasuryNote" label="备注">
          <template slot-scope="scope">
            <div>
              <el-input size="small" v-model="scope.row.treasuryNote"></el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="brandName" label="品牌"></el-table-column>
        <el-table-column align="center" prop="categoryName" label="品类"></el-table-column>
        <el-table-column align="center" prop="commodityCode" label="商品编码" sortable></el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import { getTreeById } from "api/entrepotSet/locationcargoarea/index";
import { checkSiteOrAddSite } from "api/entrepotSet/stockManagement/stockPending/stockPending";
import { mapGetters } from "vuex";
import { setTimeout } from "timers";
export default {
  props: ["tableData"],
  data() {
    return {
      indexs: 0, //点击选择货区货位状态
      isFlag: false, //显示货区货位
      arealocation: [], //货区货位数据
      CargoStr: "",
      Cargonum: 0, //数量
      isNums: false, //选择货区货位数量禁用
      quantitative: 0,
      backupsnum: 0, //备份
      storageId: "",
      chArr: []
    };
  },
  created() {
    this.brandId = this.$route.query.brandId;
  },
  methods: {
    //点击表格上确定
    CargoSureFn(skuGoodsId, CargoStr, regionId) {
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
              if (skuGoodsId == item.skuGoodsId) {
                if (item.paidInAmount == 0 && !item.paidInAmount) {
                  this.$message.error("当前实收数为有误或者为0!");
                  return;
                }
                item.cargoList.push({
                  regionSiteName: obj.regionSiteName,
                  num: item.paidInAmount,
                  regionId: obj.regionId,
                  siteId: obj.siteId,
                  isT: false
                });
              }
            });
          }
        })
        .catch(error => {
          console.error("新增货位", error);
        });
    },
    //勾选
    handleSelectionChange(val) {
      this.chArr = val;
      this.isFlag = false;
    },
    //获取货区
    getTree(storageId) {
      this.storageId = storageId;
      return getTreeById({
        storageId,
        theStaging: 0
      })
        .then(res => {
          if (res.status == 200) {
            this.arealocation = res.data;
            return this.arealocation;
          }
        })
        .catch(error => {
          console.error("获取货区", error);
        });
    },
    //表格斑马线设置
    tableRowClassName({ row, rowIndex }) {
      return rowIndex % 2 != 0 ? "el-f0" : "";
    },
    //选择货区货位
    cargoArea() {
      if (!this.chArr.length) {
        this.$message.error("当前没有勾选!");
        return;
      }
      let sum = 0;
      let num = 0;
      this.quantitative = 0;
      this.chArr.forEach(attr => {
        this.tableData.forEach(item => {
          if (attr.skuGoodsId == item.skuGoodsId) {
            sum += item.paidInAmount * 1;
            num++;
          }
        });
      });
      this.isFlag = !this.isFlag;
      this.isNums = num > 1;
      this.Cargonum = sum;
      this.backupsnum = sum;
    },
    //删除货区货位
    delCargo() {
      this.tableData.forEach(item => {
        item.CargoStr = "";
        item.cargoList = item.cargoList.filter(key => {
          return !key.isT;
        });
      });
    },
    //点击货区
    areaFun(index) {
      this.indexs = index;
    },
    //点击货位
    locationFun() {
      if (!this.CargoStr) {
        this.$message.error("当前没有输入货位");
        return;
      }
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
      this.chArr.forEach(attr => {
        this.tableData.forEach(item => {
          if (attr.skuGoodsId == item.skuGoodsId) {
            receivable = item.paidInAmount;
            item.cargoList.forEach(val => {
              carNum += val.num;
              this.quantitative = carNum + this.Cargonum;
            });
          }
        });
      });

      //判断当前是否勾选多个，然后分配货区货位
      if (this.isNums) {
        this.chArr.forEach(attr => {
          this.tableData.forEach(item => {
            if (attr.skuGoodsId == item.skuGoodsId) {
              item.cargoList = [];
              item.cargoList.push({
                regionSiteName: obj.regionSiteName,
                siteId: obj.siteId,
                regionId: obj.regionId,
                num: item.paidInAmount,
                isT: false
              });
            }
          });
        });
      } else {
        if (this.quantitative > receivable) {
          this.$message.error("数量超出!");
          this.isShow = true;
          return;
        }
        this.chArr.forEach(attr => {
          this.tableData.forEach(item => {
            if (attr.skuGoodsId == item.skuGoodsId) {
              item.cargoList.push({
                regionSiteName: obj.regionSiteName,
                num: this.Cargonum,
                siteId: obj.siteId,
                regionId: obj.regionId,
                isT: false
              });
            }
          });
        });
      }
      this.isFlag = false;
      this.CargoStr = "";
    },
    //关闭货区货位
    areaCancel() {
      this.isFlag = false;
    }
  },
  computed: {
    ...mapGetters(["id"])
  }
};
</script>
<style lang="scss" scoped>
.rewarehousing {
  .CargoStyle {
    display: flex;
  }
  .warp_head {
    position: relative;
  }
  .operationbutton {
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
  }

  .close {
    display: flex;
    flex-direction: row-reverse;
    span {
      cursor: pointer;
      display: block;
      margin-right: 10px;
    }
  }

  .details {
    width: 170px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .bk {
    border-bottom: 1px solid #ebeef5;
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
    top: 32px;
    right: 40px;
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
}
</style>
