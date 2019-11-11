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
        <span>撤样货物列表</span>
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
          <el-table-column align="center" prop="commodityName" label="商品名称" sortable width="160"></el-table-column>
          <el-table-column align="center" prop="cancelNumber" label="应收数量" width="120"></el-table-column>
          <el-table-column align="center" prop="innerNumber" label="实收数量" width="120">
            <template slot-scope="scope">
              <div>
                <el-input size="small" v-model="scope.row.innerNumber"></el-input>
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
              <div v-for="(item,index) in scope.row.driver" :key="index">
                <p>{{item.regionSiteName}}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="备注" width="180">
            <template slot-scope="scope">
              <div>
                <el-input size="small" v-model="scope.row.treasuryNote"></el-input>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="brandName" label="品牌" width="130"></el-table-column>
          <el-table-column align="center" prop="categoryName" label="品类" width="130"></el-table-column>
          <el-table-column align="center" prop="commodityCode" label="商品编码" width="150"></el-table-column>
          <el-table-column align="center" prop="colorName" label="颜色" width="140"></el-table-column>
          <el-table-column align="center" prop="materialName" label="材质" width="140"></el-table-column>
          <el-table-column align="center" prop="seriesName" label="系列" width="140"></el-table-column>
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
  getCancelSampleSingleDetail,
  addWarehouseWarrantSample,
  getStorageList,
  checkSiteOrAddSite
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
  props: {
    stockList: Array
  },
  data() {
    return {
      loadingbtn:false,
      tableData: [], //备货列表
      actionBtnList: [{ name: "选择货区货位", style: "default", type: 1 }],
      bindInfo: {}, //信息头
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
      storageId: "", //仓库ID
      CargoStr: "", //货位
      isCore: false
    };
  },
  computed: {
    ...mapGetters(["name", "id"])
  },
  mounted() {
    let { brandId, purchaseType } = this.$route.query;
    this.getWithdrawal();
    this.navList = this.$route.meta;
  },
  methods: {
    //处理仓库
    getStorageId(storageId) {
      this.storageId = storageId;
      this.getData(storageId);
    },
    //获取撤样列表
    getWithdrawal() {
      let id;
      let { putInStorageId } = this.$route.query;
      if (Object.prototype.toString.call(putInStorageId) == "[object Array]") {
        id = putInStorageId.join("");
      } else {
        id = putInStorageId;
      }
      let data = {
        putInStorageId: id
      };
      getCancelSampleSingleDetail(data)
        .then(res => {
          if (res.status == 200) {
            if (res.data) {
              this.tableData = res.data.cancelSampleDetails.map(item => {
                return {
                  driver: [],
                  innerNumber: item.cancelNumber,
                  treasuryNote: "",
                  ...item
                };
              });
            }
          }
        })
        .catch(error => {
          console.error("获取撤样列表", error);
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
            if (key.commoditySKUId == item.commoditySKUId) {
              sum += item.innerNumber;
            }
          });
        });
        this.Cargonum = sum;
        this.isNums = true;
      } else {
        this.tableData.forEach(item => {
          if (item.commoditySKUId == this.chArr[0].commoditySKUId) {
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
    //货区货位数量change
    handleChange() {},
    //点击货区
    areaFun(i) {
      this.indexs = i;
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
      if (this.isCore) {
        this.$message.error("数量超出!");
        return;
      }
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
    //货位
    locatFn(obj) {
      let receivable = 0; //应收数
      let carNum = 0; //货位数量相加
      this.chArr.forEach(key => {
        this.tableData.forEach(item => {
          if (key.commoditySKUId == item.commoditySKUId) {
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
            if (item.commoditySKUId == key.commoditySKUId) {
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
          this.isCore = true;
          return;
        }
        this.chArr.forEach(key => {
          this.tableData.forEach(item => {
            if (this.chArr[0].commoditySKUId == item.commoditySKUId) {
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
    },
    //勾选
    handleSelectionChange(val) {
      this.chArr = val;
      this.isFlag = false;
    },
    //撤样入库提交
    submission() {
      // let flag = this.tableData.every(item => {
      //   return !item.driver.length;
      // });

      // if (flag) {
      //   this.$message.error("没有分配货区货位!");
      //   return;
      // }
      let arr = [];
      let sum = 0;
      this.tableData.forEach(item => {
        sum += item.innerNumber;
        let ary = [];
        item.driver.forEach(attr => {
          ary.push({
            storageId: item.storageId,
            regionId: attr.regionId,
            siteId: attr.siteId,
            skuGoodsId: item.commoditySKUId,
            inventoryNumber: attr.num
          });
        });
        arr.push({
          treasuryNote: item.treasuryNote,
          storageId: item.storageId,
          inventoryGoodsList: ary
        });
      });
      let ids;
      let { putInStorageId } = this.$route.query;
      if (putInStorageId instanceof Array) {
        ids = putInStorageId;
      } else {
        ids = putInStorageId.split(",");
      }
      let data = {
        storageId: this.storageId,
        putInStorageIdList: ids,
        warehousePeople: this.id,
        warehouseAmount: sum,
        storingTheResults: "已入库",
        accountingDate: this.$refs.warehmodule.bindInfo.expectedArrivalDate,
        remarks: this.$refs.warehmodule.bindInfo.processRemarks,
        list: arr,
        receiptsType: this.$route.query.purchaseType
      };
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
            console.error("撤样入库提交", error);
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
