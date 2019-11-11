<template>
  <div class="rewarehousing">
    <div class="pl-20">
      <div class="warp_head">
        <div class="operationbutton">
          <el-button size="small" class="button-96 m-right40" @click="cargoArea">选择货区货位</el-button>
          <el-button size="small" class="button-96 m-right40" @click="delCargo">删除</el-button>
        </div>
        <!-- 分配货区货位 -->
        <div class="quantity" v-if="isFlag">
          <div class="areaorlocation">
            <ul class="areaStyle">
              <li v-for="(item,index) in arealocation" :class="indexs==index?'areabg':''" :key="index" @click="areaFun(index)">{{item.regionName}}</li>
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
                <el-button size="mini" @click="areaCancel">取消</el-button>
              </div>
            </ul>
          </div>
        </div>
      </div>

      <div class="orderList m-top10" v-if="cargoMainList.length!==0">
        <el-checkbox class="m-left10" v-model="Allelection">全选</el-checkbox>
        <div v-for="(item,index) in cargoMainList" :key="index">
          <div class="order_item m-bottom">
            <div class="item_header multipleTableHeaderBg">
              <el-checkbox class="m-left10" v-model="item.checked" @change="checkfather(index)"></el-checkbox>
              <div class="purchase">
                <span class="span_title">采购单号：</span>
                <span>{{item.purchaseNumber}}</span>
              </div>
              <div class="purchase">
                <p>备注：</p>
                <el-input size="small" v-model="item.treasuryNote"></el-input>
              </div>
            </div>
            <div class="item_body">
              <div class="item_div">
                <ul>
                  <li>名称</li>
                  <li>数量</li>
                  <li>实收数</li>
                  <li class="item_tiele textAl li_detail1">详情</li>
                </ul>
                <ul v-for="(pro,i) in item.list" :key="i">
                  <li>
                    <el-checkbox
                      @change="checkChild(index,i)"
                      v-model="pro.isName"
                    >{{pro.aogTemplateName}}</el-checkbox>
                  </li>
                  <li>{{pro.receivableNumber}}</li>
                  <li class="inputStle">
                    <el-input
                      placeholder
                      maxlength="50"
                      size="mini"
                      v-model.number="pro.paidInCount"
                    ></el-input>
                  </li>
                  <li class="item_tiele">
                    <div class="li_detail2" v-for="(attr,k) in pro.cargoList" :key="k">
                      <div class="details" :title="attr.regionSiteName+' 数量'+attr.num">
                        <el-checkbox v-model="attr.iscore" @change="cargoChange">
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
  </div>
</template>
<script>
import { getTreeById } from "api/entrepotSet/locationcargoarea/index";
import { checkSiteOrAddSite } from "api/entrepotSet/stockManagement/stockPending/stockPending";
import { mapGetters } from "vuex";
export default {
  props: ["cargoMainList"],
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
      storageId: ""
    };
  },
  methods: {
    //获取货区
    getTree(storageId) {
      this.storageId = storageId;
      getTreeById({
        storageId,
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
    //选择货区货位
    cargoArea() {
      let sum = 0;
      let num = 0;
      this.quantitative = 0;
      this.cargoMainList.forEach(item => {
        item.list.forEach(itm => {
          if (itm.isName) {
            sum += itm.paidInCount * 1;
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
      this.cargoMainList.forEach(item => {
        item.list.forEach(attr => {
          attr.cargoList = attr.cargoList.filter(key => {
            return !key.iscore;
          });
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
      this.cargoMainList.forEach(item => {
        item.list.forEach(attr => {
          if (attr.isName) {
            receivable = attr.paidInCount;
            attr.cargoList.forEach(val => {
              carNum += val.num;
              this.quantitative = carNum + this.Cargonum;
            });
          }
        });
      });
      //判断当前是否勾选多个，然后分配货区货位
      if (this.isNums) {
        this.cargoMainList.forEach(item => {
          item.list.forEach(attr => {
            if (attr.isName) {
              if (attr.paidInCount && attr.paidInCount != 0) {
                attr.cargoList = [];
                attr.cargoList.push({
                  regionSiteName: obj.regionSiteName,
                  siteId: obj.siteId,
                  regionId: obj.regionId,
                  num: attr.paidInCount,
                  iscore: false,
                  isT: false
                });
              }
            }
          });
        });
      } else {
        if (this.quantitative > receivable) {
          this.$message.error("数量超出!");
          this.isShow = true;
          return;
        }
        this.cargoMainList.forEach(item => {
          item.list.forEach(attr => {
            if (attr.isName) {
              if (this.Cargonum && this.Cargonum != 0) {
                attr.cargoList.push({
                  regionSiteName: obj.regionSiteName,
                  num: this.Cargonum,
                  siteId: obj.siteId,
                  regionId: obj.regionId,
                  iscore: false,
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
    //关闭货区货位
    areaCancel() {
      this.isFlag = false;
    },
    //子复选框change
    checkChild(index, i) {
      let flag = this.cargoMainList[index].list.every(item => {
        return item.isName;
      });
      console.log(flag);

      if (flag) {
        this.cargoMainList[index].checked = flag;
        this.cargoMainList.forEach(item => {
          item.list.forEach(attr => {
            if (attr.isNums) {
              attr.cargoList.forEach(key => {
                key.iscore = false;
              });
            }
          });
        });
      } else {
        this.cargoMainList[index].checked = flag;
      }
    },
    //父复选框change
    checkfather(index) {
      this.cargoMainList[index].list.forEach(item => {
        item.isName = this.cargoMainList[index].checked;
      });
    },
    cargoChange() {
      this.cargoMainList.forEach(item => {
        item.list.forEach(attr => {
          attr.cargoList.forEach(val => {
            if (val.iscore) {
              attr.isName = false;
            }
          });
        });
      });
    }
  },
  computed: {
    ...mapGetters(["id"]),
    Allelection: {
      get() {
        let str = this.cargoMainList.every(item => {
          return item.checked;
        });
        return str;
      },
      set(val) {
        this.cargoMainList.forEach(item => {
          item.checked = val;
        });
        this.cargoMainList.forEach(item => {
          item.list.forEach(attr => {
            attr.isName = item.checked;
          });
        });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.rewarehousing {
  .purchase {
    display: flex;
    p {
      min-width: 50px;
    }
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

  .orderList {
    font-size: 14px;
    max-height: 650px;
    overflow: auto;
    color: #909399;
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
              height: calc(100% - 120px);
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
}
</style>
