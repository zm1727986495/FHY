<template>
  <div>
    <div>
      <!-- <div class="page_head_div"></div> -->
      <div class="iconBox">
        <i class="Icon"></i>
        <span>模板列表</span>
      </div>
      <!-- 选择货区货位 -->
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
                <el-input-number
                  :disabled="isNums"
                  size="small"
                  v-model="Cargonum"
                  @change="handleChange"
                ></el-input-number>
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

      <!-- 列表 -->
      <div class="orderList m-top10" v-if="tableData.length!==0">
        <div>
          <div class="order_item m-bottom">
            <div class="item_header multipleTableHeaderBg">
              <el-checkbox class="m-left10" v-model="checkfather"></el-checkbox>
              <div class="purchase">
                <span class="span_title">采购单号：</span>
                <span>{{this.$route.query.purchaseNumber}}</span>
              </div>
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
                    <el-input
                      placeholder
                      maxlength="50"
                      size="mini"
                      v-model.number="pro.paidInAmount"
                      @input="receiptsFn(pro.aogTemplateId)"
                    ></el-input>
                  </li>
                  <li class="item_tiele">
                    <div v-if="pro.driver.length!=0">
                      <div class="li_detail2" v-for="(attr,k) in pro.driver" :key="k">
                        <div class="details" :title="attr.regionSiteName+' 数量'+attr.num">
                          <el-checkbox v-model="attr.iscore">
                            <span>{{attr.regionSiteName}} 数量{{attr.num}}</span>
                          </el-checkbox>
                        </div>
                      </div>
                    </div>
                    <div class="CargoStyle" v-else>
                      <el-select size="small" v-model="pro.regionId" placeholder="请选择">
                        <el-option
                          v-for="item in arealocation"
                          :key="item.regionId"
                          :label="item.regionName"
                          :value="item.regionId"
                        ></el-option>
                      </el-select>
                      <el-input
                        @blur="CargoSureFn(pro.aogTemplateId,pro.CargoStr,pro.regionId)"
                        v-model="pro.CargoStr"
                        size="small"
                      ></el-input>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 选择模板 -->
    <el-dialog
      title="选择模板"
      :visible.sync="dialogVisible"
      width="900"
      :before-close="handleClose"
      custom-class="customDialogTitle"
    >
      <div class="downLoad" v-if="dialogVisible">
        <div class="tempStyle">
          <div class="table-width lvs attribute">
            <el-table
              border
              style="width: 100%"
              @selection-change="choiceChange"
              :row-class-name="tableRowClassName"
              :data="tableList"
            >
              <el-table-column type="selection" align="center" width="55" fixed></el-table-column>
              <el-table-column
                align="center"
                prop="aogName"
                label="名称"
                width="200"
                sortable
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column align="center" prop="brandName" label="品牌" width="200"></el-table-column>
              <el-table-column
                align="center"
                prop="companyName"
                label="供应商"
                width="200"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column align="center" prop="createTime" label="生效时间" width="200"></el-table-column>
              <el-table-column align="center" prop="createName" label="创建人" width="200"></el-table-column>
              <el-table-column
                align="center"
                prop="remarks"
                label="备注"
                width="200"
                show-overflow-tooltip
              ></el-table-column>
            </el-table>
          </div>
        </div>
        <div class="pagination_wrap">
          <pagination
            :current-page="currentPage"
            :pageSize="pageSize"
            :total="total"
            @sizeChange="sizeChange"
            @currentChange="currentChange"
          ></pagination>
        </div>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="determineFn">确 定</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  listPurchaseOrderGoods,
  getListById,
  checkSiteOrAddSite
} from "api/entrepotSet/stockManagement/stockPending/stockPending";
import { getTreeById } from "api/entrepotSet/locationcargoarea/index";
import { listAogByPage } from "api/entrepotSet/stockManagement/arrivalNotice/arrivalNotice";
import pagination from "@/views/components/pagination";
import { mapGetters } from "vuex";
export default {
  components: {
    pagination
  },
  props: ["stockList"],
  data() {
    return {
      tableData: [], //列表
      tableList: [], //选择模板
      actionBtnList: [
        { name: "选择模板", style: "default", type: 2 },
        { name: "选择货区货位", style: "default", type: 1 },
        { name: "删除", style: "default", type: 3 }
      ],
      isShow: false,
      isFlag: false, //选择货区货位显示
      num: "",
      indexs: 0, //点击状态
      arealocation: [], //货区货位列表
      CargoStr: "", //货位
      isNums: false, //判断数量
      Cargonum: 0, //数量
      chArr: [], //勾选
      quantitative: 0, //判断数量是否超出
      dialogVisible: false,
      tempList: [],
      currentPage: 1, //当前页数
      pageSize: 10, //总页数
      total: 0, //总条数
      storageId: "", //仓库ID
      isCore: false //货位判断
    };
  },
  mounted() {
    this.getstockData();
    this.getData();
  },
  computed: {
    ...mapGetters(["id"]),
    checkfather: {
      get() {
        let str = this.tableData.every(item => {
          return item.isName;
        });
        return str;
      },
      set(val) {
        this.tableData.forEach(item => {
          item.isName = val;
        });
      }
    }
  },
  methods: {
    //获取订单入库商品列表
    getstockData() {
      let data = {
        page: this.currentPage,
        limit: this.pageSize,
        brandId: this.$route.query.brandId,
        categoryId: this.$route.query.categoryId
      };
      listAogByPage(data)
        .then(res => {
          this.tableList = res.data.rows;
          this.total = res.data.total;
        })
        .catch(error => {
          console.error("到货模板", error);
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
          }
        })
        .catch(error => {
          console.error("获取货区", error);
        });
    },
    //选择模板确定
    determineFn() {
      if (this.tempList.length < 1) {
        this.$message.error("你未勾选!");
      } else if (this.tempList.length > 1) {
        this.$message.error("只能勾选一条!");
      } else {
        getListById({ aogId: this.tempList[0].aogId })
          .then(res => {
            if (res.status == 200) {
              this.tableData = res.data.map(item => {
                return {
                  ...item,
                  paidInAmount: "",
                  driver: [],
                  regionId: "",
                  CargoStr: "",
                  isName: false
                };
              });
            }
          })
          .catch(error => {
            console.error("选择模板确定", error);
          });
        this.dialogVisible = false;
      }
    },
    //点击表格上确定
    CargoSureFn(aogTemplateId, CargoStr, regionId) {
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
            this.tableData.forEach(val => {
              if (val.aogTemplateId == aogTemplateId) {
                if (val.paidInAmount == 0 && val.paidInAmount) {
                  this.$message.error("当前实收数为有误或者为0!");
                  return;
                }
                val.driver.push({
                  regionSiteName: obj.regionSiteName,
                  siteId: obj.siteId,
                  regionId: obj.regionId,
                  num: val.paidInAmount,
                  iscore: false,
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
    //实收change
    receiptsFn(aogTemplateId) {
      this.tableData.forEach(val => {
        if (val.aogTemplateId == aogTemplateId) {
          val.CargoStr = "";
          val.regionId = "";
        }
      });
    },
    //关闭弹框
    handleClose() {
      this.dialogVisible = false;
    },
    //弹框勾选
    choiceChange(val) {
      this.tempList = val;
    },
    //翻页方法
    sizeChange(val) {
      this.currentPage = 1;
      this.pageSize = val;
      this.getData();
    },
    //翻页方法
    currentChange(val) {
      this.currentPage = val;
      this.getData();
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
      //选择货区货位
      if (type == 1) {
        if (this.tableData.length == 0) {
          this.$message.error("当前无数据!");
          return;
        }
        let flag = 0;
        this.tableData.forEach(item => {
          if (item.isName) {
            flag++;
          }
        });

        if (flag < 1) {
          this.$message.error("没有勾选!");
          return;
        }
        this.Cargonum = 0;
        this.quantitative = 0;
        let sum = 0;
        let num = 0;
        this.tableData.forEach(item => {
          if (item.isName) {
            sum += item.paidInAmount * 1;
            num++;
          }
        });

        this.Cargonum = sum;
        this.isNums = num > 1;
        this.isFlag = !this.isFlag;
      } else if (type == 2) {
        //选择模板
        this.dialogVisible = true;
      } else {
        //删除
        this.cargoChange();
      }
    },
    //货区货位数量change
    handleChange() {},
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

      this.tableData.forEach(item => {
        if (item.isName) {
          receivable = item.paidInAmount;
          item.driver.forEach(attr => {
            carNum += attr.num;
            this.quantitative = carNum + this.Cargonum;
          });
        }
      });

      if (this.isNums) {
        this.tableData.forEach(item => {
          if (item.isName) {
            if (item.paidInAmount && item.paidInAmount != 0) {
              item.driver = [];
              item.driver.push({
                regionSiteName: obj.regionSiteName,
                num: item.paidInAmount,
                regionId: obj.regionId,
                siteId: obj.siteId,
                iscore: false
              });
            } else {
              this.$message.error("有实收数量为0的!");
            }
          }
        });
      } else {
        if (this.quantitative > receivable) {
          this.$message.error("数量超出!");
          this.isCore = true;
          return;
        }

        this.tableData.forEach(item => {
          if (item.isName) {
            if (item.paidInAmount && item.paidInAmount != 0) {
              item.driver.push({
                regionSiteName: obj.regionSiteName,
                num: this.Cargonum,
                regionId: obj.regionId,
                siteId: obj.siteId,
                iscore: false
              });
            } else {
              this.$message.error("实收数量为0!");
            }
          }
        });
      }
    },
    //删除
    cargoChange() {
      this.tableData.forEach(item => {
        item.driver = item.driver.filter(attr => {
          return !attr.iscore;
        });
      });
    },
    //勾选
    handleSelectionChange(val) {
      this.chArr = val;
      this.isFlag = false;
    },
    //关闭货位
    cancel() {
      this.isFlag = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.CargoStyle {
  display: flex;
}
.downLoad {
  .tempStyle {
    max-height: 400px;
    overflow-y: auto;
  }
  .btnList {
    margin-bottom: 20px;
  }
  .table_action_span {
    color: rgb(127, 221, 228);
    cursor: pointer;
  }
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
          // line-height: 40px;
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
