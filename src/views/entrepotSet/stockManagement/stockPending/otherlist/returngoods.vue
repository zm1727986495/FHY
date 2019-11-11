<template>
  <div>
    <div class="head_nav">
      <!-- 导航栏 -->
      <breadcrumb :navList="navList"></breadcrumb>
    </div>
    <el-card>
      <div>
        <warehmodule @getStorageId="getStorageId" ref="warehmodule"></warehmodule>
        <div class="page_head_div"></div>
      </div>

      <div class="iconBox">
        <i class="Icon"></i>
        <span>退货列表</span>
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
            @click="butGroupAction(item.url,item.type)"
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
                <el-button size="mini" @click="Carcancel">取消</el-button>
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
          <el-table-column align="center" prop="commodityName" label="商品名称" sortable width="220"></el-table-column>
          <el-table-column align="center" prop="amount" label="应收数量" width="220"></el-table-column>
          <el-table-column align="center" prop="innerNumber" label="实收数量" width="220">
            <template slot-scope="scope">
              <div>
                <el-input size="small" v-model.number="scope.row.innerNumber"></el-input>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="driver"
            label="货位"
            width="220"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <div v-if="scope.row.driver.length!=0">
                <div v-for="(item,index) in scope.row.driver" :key="index">
                  <p>{{item.regionSiteName}}</p>
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
                  v-model="scope.row.CargoStr"
                  size="small"
                ></el-input>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="备注" width="220">
            <template slot-scope="scope">
              <div>
                <el-input size="small" v-model="scope.row.treasuryNote"></el-input>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="brandName" label="品牌" width="220"></el-table-column>
          <el-table-column align="center" prop="categoryName" label="品类" width="220"></el-table-column>
          <el-table-column align="center" prop="classifyName" label="分类" width="220"></el-table-column>
          <el-table-column align="center" prop="commodityCode" label="商品编码" width="220"></el-table-column>
        </el-table>
      </div>
    </el-card>
    <div class="foot_btn_box">
      <el-button type="primary" @click="submission" :loading="loadingbtn">提 交</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </div>
</template>
<script>
import {
  getOrderChargeBackById,
  addWarehouseWarrantSample
} from "api/entrepotSet/stockManagement/stockPending/stockPending";
import { getTreeById } from "api/entrepotSet/locationcargoarea/index";
import { mapGetters } from "vuex";
import breadcrumb from "@/views/components/breadcrumb";
import { getUUID } from "api/pulicJava";
import warehmodule from "../components/warehmodule";
export default {
  components: {
    breadcrumb,
    warehmodule
  },
  props: ["stockList"],
  data() {
    return {
      loadingbtn:false,
      tableData: [], //备货列表
      actionBtnList: [{ name: "选择货区货位", style: "default", type: 1 }],
      options: [],
      navList: [],
      isShow: false,
      isFlag: false, //选择货区货位显示
      num: "",
      indexs: 0, //点击状态
      arealocation: [], //货区货位列表
      isNums: false, //判断数量
      Cargonum: 0, //数量
      chArr: [], //勾选
      quantitative: 0, //判断数量是否超出
      storageId: "",
      CargoStr: "" //货位
    };
  },
  computed: {
    ...mapGetters(["name", "id"])
  },
  mounted() {
    let { brandId, purchaseType } = this.$route.query;
    this.getOrderCharge();
    this.navList = this.$route.meta;
  },
  methods: {
    //处理仓库ID
    getStorageId(storageId) {
      this.storageId = storageId;
      this.getData(storageId);
    },
    //获取撤样列表
    getOrderCharge() {
      let id;
      let { putInStorageId } = this.$route.query;
      //判断putInStorageId是否是数组
      if (Object.prototype.toString.call(putInStorageId) == "[object Array]") {
        id = putInStorageId.join(",");
      } else {
        id = putInStorageId;
      }
      let data = {
        putInStorageId: id
      };
      getOrderChargeBackById(data)
        .then(res => {
          if (res.status == 200) {
            this.tableData = res.data.map(item => {
              let obj = this.arealocation.filter(attr => {
                return attr.theStaging == 4;
              })[0];
              if (!obj) {
                obj = this.arealocation[0] || {};
              }
              return {
                driver: [],
                treasuryNote: "",
                CargoStr: "",
                innerNumber: item.amount,
                regionId: obj.regionId,
                ...item
              };
            });
          }
        })
        .catch(error => {
          console.error("获取退货列表", error);
        });
    },
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
                if (item.innerNumber == 0 && !item.innerNumber) {
                  this.$message.error("当前实收数为有误或者为0!");
                  return;
                }
                item.driver.push({
                  regionSiteName: obj.regionSiteName,
                  num: item.innerNumber,
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
    //货区货位列表数据
    getData(storageId) {
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
    //关闭选择货区货位
    closeBox() {
      this.isShow = false;
      this.isFlag = false;
    },
    //表格斑马线设置
    tableRowClassName({ row, rowIndex }) {
      return rowIndex % 2 != 0 ? "el-f0" : "";
    },
    //补0
    repair(str) {
      return str < 10 ? "0" + str : str;
    },
    //选择货区货位
    butGroupAction(num, type) {
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
            if (key.skuGoodsId == item.skuGoodsId) {
              sum += item.innerNumber;
            }
          });
        });
        this.Cargonum = sum;
        this.isNums = true;
      } else {
        this.tableData.forEach(item => {
          if (item.skuGoodsId == this.chArr[0].skuGoodsId) {
            sum = item.innerNumber;
          }
        });
        this.Cargonum = sum;
        this.isNums = false;
      }
      if (this.Cargonum == 0) {
        this.$message.error("当前实收数量为0!");
        return;
      }
      this.isFlag = !this.isFlag;
    },
    Carcancel() {
      this.isFlag = false;
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
      let receivable = 0; //应收数
      let carNum = 0; //货位数量相加
      this.chArr.forEach(key => {
        this.tableData.forEach(item => {
          if (key.skuGoodsId == item.skuGoodsId) {
            receivable = item.innerNumber;
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
            if (item.skuGoodsId == key.skuGoodsId) {
              if (item.innerNumber && item.innerNumber != 0) {
                item.driver = [];
                item.driver.push({
                  regionSiteName:
                    obj.regionSiteName + " " + item.innerNumber + "数量",
                  num: item.innerNumber,
                  regionId: obj.regionId,
                  siteId: obj.siteId
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
            if (this.chArr[0].skuGoodsId == item.skuGoodsId) {
              if (item.innerNumber && item.innerNumber != 0) {
                item.driver.push({
                  regionSiteName:
                    obj.regionSiteName + " " + this.Cargonum + "数量",
                  num: this.Cargonum,
                  regionId: obj.regionId,
                  siteId: obj.siteId
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
    //入库提交
    submission() {
      // return
      let arr = [];
      let sum = 0;
      let totle = 0;
      let cargoNum = 0;
      this.tableData.forEach(item => {
        sum += item.innerNumber * 1;
        totle += item.amount * 1;
        let ary = [];
        item.driver.forEach(attr => {
          cargoNum += attr.num;
          ary.push({
            storageId: this.storageId,
            regionId: attr.regionId,
            siteId: attr.siteId,
            skuGoodsId: item.skuGoodsId,
            inventoryNumber: attr.num
          });
        });
        arr.push({
          treasuryNote: item.treasuryNote,
          storageId: this.storageId,
          inventoryGoodsList: ary
        });
      });

      if (arr.length == 0) {
        this.$message.error("当前无数据!");
        return;
      }

      // let flag = arr.every(item => {
      //   return !item.inventoryGoodsList.length;
      // });
      // if (flag) {
      //   this.$message.error("当前没有分配货区货位!");
      //   return;
      // }

      let ids;
      let { putInStorageId } = this.$route.query;
      if (putInStorageId instanceof Array) {
        ids = putInStorageId;
      } else {
        ids = putInStorageId.split(",");
      }
      let isShow = totle == sum;
      let data = {
        storageId: this.storageId,
        putInStorageIdList: ids,
        warehousePeople: this.id,
        warehouseAmount: sum,
        storingTheResults: isShow ? "已入库" : "部分入库",
        accountingDate: this.$refs.warehmodule.bindInfo.expectedArrivalDate,
        remarks: this.$refs.warehmodule.bindInfo.processRemarks,
        list: arr,
        receiptsType: this.$route.query.purchaseType
      };
      console.log(data);
      this.loadingbtn = true;
      getUUID({ serialNumber: "SI" }).then(res => {
        data.warehouseWarrantCode = res.data;
        addWarehouseWarrantSample(data)
          .then(res => {
            if (res.status == 200) {
              this.$message.success("提交成功!");
              this.loadingbtn = false;
              this.$router.go(-1);
            } else {
              this.loadingbtn = false;
              this.$message.error("提交失败!");
            }
          })
          .catch(error => {
            this.loadingbtn = false;
            console.error("退货入库提交", error);
          });
      });
    },
    //取消
    cancel() {
      this.$route.go(-1);
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
