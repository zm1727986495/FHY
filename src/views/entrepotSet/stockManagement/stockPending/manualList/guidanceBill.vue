<template>
  <div>
    <div class="operationbutton">
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
    <div class="orderList m-top10" v-if="tableData.length!==0">
      <div>
        <div class="order_item m-bottom">
          <div class="item_header multipleTableHeaderBg">
            <el-checkbox class="m-left10" v-model="isCheck" @change="checkfather"></el-checkbox>
          </div>
          <div class="item_body">
            <div class="item_div">
              <ul>
                <li>名称</li>
                <li>实收数</li>
                <li class="item_tiele textAl li_detail1">详情</li>
              </ul>
              <ul v-for="(pro,i) in tableData" :key="i">
                <li>
                  <el-checkbox v-model="pro.isName">{{pro.aogTemplateName}}</el-checkbox>
                </li>
                <li class="inputStle">
                  <el-input placeholder maxlength="50" size="mini" v-model.number="pro.paidInCount"></el-input>
                </li>
                <li class="item_tiele">
                  <div class="li_detail2" v-for="(attr,k) in pro.cargoList" :key="k">
                    <div class="details" :title="attr.regionSiteName+' 数量'+attr.num">
                      <el-checkbox v-model="attr.isT">
                        <span>{{attr.regionSiteName}} 数量{{attr.num}}</span>
                      </el-checkbox>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  getListById,
  checkSiteOrAddSite
} from "api/entrepotSet/stockManagement/stockPending/stockPending";
import { mapGetters } from "vuex";
export default {
  props: ["arealocation", "storageId"],
  data() {
    return {
      tableData: [], //列表数据
      choseArr: [], //勾选
      indexs: 0, //点击货区状态
      isNums: false, //是否能修改货区货位数量
      Cargonum: 0, // 货区数量
      isCheck: false, //父级勾选
      isFlag: false, //是否显示货区货位
      quantitative: 0, //判断数量是否超出
      backupsnum: 0, //备份数量
      CargoStr: "" //货位
    };
  },
  computed: {
    ...mapGetters(["id"])
  },
  methods: {
    //采购单包数据
    getData(aogId) {
      let data = {
        aogId
      };
      getListById(data)
        .then(res => {
          this.tableData = res.data.map(item => {
            return { cargoList: [], isName: false, paidInCount: 0, ...item };
          });
        })
        .catch(error => {
          console.error("获取手动入库包数据", error);
        });
    },
    //表格斑马线设置
    tableRowClassName({ row, rowIndex }) {
      return rowIndex % 2 != 0 ? "el-f0" : "";
    },
    //勾选
    chooseDelete(val) {
      this.choseArr = val;
    },
    //点击选择货区货位
    cargo() {
      if (!this.storageId) {
        this.$message.error("没有仓库!");
        return;
      }
      let flag = this.tableData.every(item => {
        return !item.isName;
      });
      if (flag) {
        this.$message.error("当前没有勾选!");
        return;
      }
      let sum = 0;
      let num = 0;
      this.quantitative = 0;
      this.tableData.forEach(item => {
        if (item.isName) {
          sum += item.paidInCount * 1;
          num++;
        }
      });

      this.isFlag = !this.isFlag;
      this.isNums = num > 1;
      this.Cargonum = sum;
      this.backupsnum = sum;
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
    locatFn(obj) {
      let receivable = 0; //应收数
      let carNum = 0; //货位数量相加
      this.tableData.forEach(attr => {
        if (attr.isName) {
          receivable = attr.paidInCount;
          attr.cargoList.forEach(key => {
            carNum += key.num;
            this.quantitative = carNum + this.Cargonum;
          });
        }
      });

      //判断当前是否勾选多个，然后分配货区货位
      if (this.isNums) {
        this.tableData.forEach(attr => {
          if (attr.isName) {
            if (attr.paidInCount && attr.paidInCount != 0) {
              attr.cargoList = [];
              attr.cargoList.push({
                regionSiteName: obj.regionSiteName,
                siteId: obj.siteId,
                regionId: obj.regionId,
                num: attr.paidInCount,
                isT: false
              });
            }
          }
        });
      } else {
        if (this.quantitative > receivable) {
          this.$message.error("数量超出!");
          return;
        }

        this.tableData.forEach(attr => {
          if (attr.isName) {
            if (attr.paidInCount && attr.paidInCount != 0) {
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
      }

      this.isFlag = false;
      this.CargoStr = "";
    },
    //点击货区
    areaFun(i) {
      this.indexs = i;
      this.CargoStr = "";
    },
    //关闭货区
    cancel() {
      this.isFlag = false;
    },
    checkfather() {
      this.tableData.forEach(item => {
        item.isName = this.isCheck;
      });
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

// 货区货位样式
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
.orderList {
  font-size: 14px;
  max-height: 650px;
  overflow: auto;
  color: #909399;

  // 包样式
  .order_item {
    width: 100%;
    border: 1px solid #ebeef5;
    .item_header {
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
    .item_body {
      max-height: 400px;
      overflow-y: auto;
      overflow-x: auto;
      .item_div {
        display: flex;
        flex-wrap: nowrap;
        ul {
          .item_tiele {
            height: calc(100% - 80px);
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
