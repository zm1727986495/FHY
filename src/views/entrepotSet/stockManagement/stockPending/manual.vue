<template >
  <div class="manual">
    <div class="head_nav">
      <!-- 导航栏 -->
      <breadcrumb :navList="navList"></breadcrumb>
    </div>

    <el-card class="box-card" style="min-height:500px;">
      <div class="iconBox m-bottom10">
        <i class="Icon"></i>
        <span>生成入库单</span>
      </div>
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="120px"
        class="form_class"
      >
        <div class="infoform">
          <div class="infoform_item">
            <el-form-item label="到货单号">
              <el-input v-model="ruleForm.name"></el-input>
            </el-form-item>
            <el-form-item label="所属仓库">
              <el-select @change="warehouseFn" v-model="ruleForm.storageId" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.storageId"
                  :label="item.storageName"
                  :value="item.storageId"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
        </div>
        <div class="infoform">
          <div class="infoform_item">
            <el-form-item label="类型" prop="resource">
              <el-radio-group v-model="ruleForm.resource" style="min-width:272px">
                <el-radio label="0">订单入库</el-radio>
                <el-radio label="1">其他入库</el-radio>
                <el-radio label="2">客盆</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
        </div>
        <div class="infoform" v-if="ruleForm.resource==0">
          <div class="infoform_item">
            <el-form-item label="选择到货单" prop="resource" style="min-width:320px;">
              <el-button size="small" class="button-96" @click="addingOrders">添加订单</el-button>
              <el-button
                size="small"
                class="button-96"
                v-if="ruleForm.resource==0&&isFlag==2"
                @click="arrivalFun"
              >到货单模板</el-button>
            </el-form-item>
          </div>
        </div>
        <div class="infoform" v-if="ruleForm.resource==1">
          <div class="infoform_item">
            <el-form-item label="选择商品" prop="resource" style="min-width:320px;">
              <el-button size="small" class="button-96" @click="addCommodity">选择商品</el-button>
            </el-form-item>
          </div>
        </div>
        <el-form-item label="备注" prop="remarks" v-if="ruleForm.resource==2">
          <el-input type="textarea" v-model="ruleForm.remarks"></el-input>
        </el-form-item>
      </el-form>

      <!-- 采购单商品列表 -->
      <manualOrder :storageId="ruleForm.storageId" :arealocation="arealocation" ref="manualOrder" v-if="isFlag==1"></manualOrder>

      <!-- 采购单包列表 -->
      <guidanceBill :storageId="ruleForm.storageId" :arealocation="arealocation" ref="guidanceBill" v-if="isFlag==2"></guidanceBill>

      <!-- 顾家 -->
      <manualfamily :storageId="ruleForm.storageId" :arealocation="arealocation" ref="manualfamily" v-if="isFlag==3"></manualfamily>

      <!-- 其它入库 -->
      <manualCommodity ref="manualCommodity" :storageId="ruleForm.storageId" v-if="ruleForm.resource==1" :ruleForm="ruleForm" :tableData="commodityTable" :isBrand="isBrand" :arealocation="arealocation"></manualCommodity>
    </el-card>

    <!-- 添加订单 -->
    <ordercomponent v-if="centerDialogVisible" :centerDialogVisible="centerDialogVisible" @orderclosefun="orderclosefun" ></ordercomponent>

    <!-- 选择商品 -->
    <el-dialog title="选择商品" :visible.sync="isCommodity" width="90%" :before-close="handleClose" custom-class="customDialogTitle" top="2vh">
      <select-commodity v-if="isCommodity" @selectionChange="selectionChange" ref="selectedCommodities" :select-list="selectList"></select-commodity>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="SureFun">确 定</el-button>
        <el-button @click="handleClose">取 消</el-button>
      </span>
    </el-dialog>

    <!-- 采购单列表 -->
    <purchaseList v-if="isPurchase" :isPurchase="isPurchase" @closurePurchase="closurePurchase" @getPurchaseGoods="getPurchaseGoods" ref="purchaseList"></purchaseList>

    <!-- 到货单模板 -->
    <downLoad @closurePurchase="closurePurchase" :dialogVisible="dialogVisible" ref="download" v-if="dialogVisible"></downLoad>

    <!-- 按钮 -->
    <div class="btn">
      <el-button type="primary" @click="submission" :loading="loadingbtn">提 交</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </div>
</template>
<script>
import breadcrumb from "@/views/components/breadcrumb";
import ordercomponent from "@/views/components/ordercomponent";
import downLoad from "./manualList/downLoad";
import purchaseList from "./manualList/purchaseList";
import manualfamily from "./manualList/manualfamily";
import manualOrder from "./manualList/manualOrder";
import guidanceBill from "./manualList/guidanceBill";
import manualCommodity from "./manualList/manualCommodity";
import selectCommodity from "@/views/components/selectCommodity";
import {
  listPutInStorageByPage,
  listPurchaseOrder,
  manuallyPutInStorage,
  otherWarehousing,
  getGoodsSKUId,
  guestBasin
} from "api/entrepotSet/stockManagement/stockPending/stockPending";
import {
  listCommodityColour, // 商品颜色查询
  listCommoditySeries, // 商品系列查询
  listCommodityMaterial // 商品材质查询
} from "api/administrationCenter/stockmanagement/index";
import {
  getStorageList,
  insertCommoditySku
} from "api/entrepotSet/stockManagement/stockPending/stockPending.js";
import { getTreeById } from "api/entrepotSet/locationcargoarea/index.js";
import { mapGetters } from "vuex";
import { getUUID } from "api/pulicJava";
export default {
  components: {
    downLoad,
    breadcrumb,
    ordercomponent,
    purchaseList,
    manualOrder,
    guidanceBill,
    manualfamily,
    selectCommodity,
    manualCommodity
  },
  data() {
    return {
      ruleForm: {
        resource: "0",
        storageId: ""
      },
      tableData: [], //列表数据
      loadingbtn:false,
      isNums: false,
      options: [], //所属仓库
      navList: [], //导航条
      isCommodity: false, //选择商品
      isShow: false, //货区货位显隐
      isFlag: "", //是否是到货单  订单入库purchaseList修改
      num: 0, //数量
      purchaseNumber: "", //采购单号
      datePicker: "", //当前时间
      centerDialogVisible: false, //添加订单
      dialogVisible: false, //到货单模板
      isPurchase: false, //采购单列表
      templateArr: [], //到货单模板数据
      arealocation: [], //货区货位
      rules: {
        //验证
        name: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        region: [
          { required: true, message: "请选择活动区域", trigger: "change" }
        ],
        date1: [
          {
            type: "date",
            required: true,
            message: "请选择日期",
            trigger: "change"
          }
        ],
        date2: [
          {
            type: "date",
            required: true,
            message: "请选择时间",
            trigger: "change"
          }
        ],
        type: [
          {
            type: "array",
            required: true,
            message: "请至少选择一个活动性质",
            trigger: "change"
          }
        ],
        resource: [
          { required: true, message: "请选择活动资源", trigger: "change" }
        ],
        remarks: [
          { required: true, message: "请填写活动形式", trigger: "blur" }
        ]
      },
      //选择商品
      selectList: {
        selectedCommodities: [], // 选中的商品 可不传
        brandList: [], // 品牌数组 可不传（不传默认为全部品牌）
        categoryList: [], // 品类数组 可不传（不传默认为全部品类）
        priceStrategyId: "", // 价格策略 不是必填
        height: "350px", // 设置表格高度 可不传（弹出层最好传下）
        isDialog: true // 是否为弹出层（不传默认为页面）
      },
      commodityList: [], //勾选商品
      commodityTable: [], //选定的商品
      isBrand: false, //判断当前是否是顾家
      storeInfo:JSON.parse(this.$loca.getItem('activeStoreId'))//门店id
    };
  },
  mounted() {
    this.navList = this.$route.meta;
    this.getList();
  },
  computed: {
    ...mapGetters(["id",'activeStoreId'])
  },
  watch: {
    activeStoreId(val) {
      if (val) {
        this.storeInfo = val;
      }
    }
  },
  methods: {
    warehouseFn() {
      this.getCargoList(this.ruleForm.storageId);
    },
    //获取货区货位数据
    getCargoList(storageId) {
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
    //获取仓库
    getList() {
      getStorageList()
        .then(res => {
          if (res.status == 200) {
            this.options = res.data;
            this.ruleForm.storageId = res.data[0].storageId;
            this.getCargoList(this.ruleForm.storageId);
          }
        })
        .catch(error => {
          console.error("获取所属仓库", error);
        });
    },
    //获取采购商品列表
    getPurchaseGoods(id) {
      this.$nextTick(() => {
        this.$refs.manualOrder.getPurchaseGoods(id);
      });
    },
    //获取采购单包列表
    getPackage(aogId) {
      this.$nextTick(() => {
        this.$refs.guidanceBill.getData(aogId);
      });
    },

    //获取顾家列表
    getDataDJ(purchaseOrderId) {
      this.$nextTick(() => {
        this.$refs.manualfamily.getstockData(purchaseOrderId);
      });
    },
    //关闭弹框
    closurePurchase() {
      this.isPurchase = false;
      this.dialogVisible = false;
    },
    //添加订单弹框
    addingOrders() {
      this.centerDialogVisible = true;
    },

    //选择商品
    addCommodity() {
      this.isCommodity = true;
    },
    //订单弹框选择的数据
    orderclosefun(val) {
      if (val) {
        this.isPurchase = true;
        this.$nextTick(() => {
          this.$refs.purchaseList.getData(val[0].orderId);
        });
        this.centerDialogVisible = false;
      } else {
        this.centerDialogVisible = false;
      }
    },

    //点击到货单模板显示弹框
    arrivalFun() {
      if (this.isFlag) {
        this.dialogVisible = true;
      } else {
        this.$message.error("当前采购单不是包!");
      }
    },
    //提交
    submission() {
      if (!this.ruleForm.storageId) {
        this.$message.error("请选择仓库!");
        return;
      }
      this.getNowFormatDate();
      //*********************** 其它入库
      if (this.ruleForm.resource == 1) {
        let arr = [];
        let orderSum = 0;
        let { tableData } = this.$refs.manualCommodity;
        if (tableData.length == 0) {
          this.$message.error("当前无数据!");
          return;
        }
        let falg = tableData.every(item => {
          return !item.cargoList.length;
        });
        if (falg) {
          this.$message.error("当前没有分配货区货位!");
          return;
        }

        tableData.forEach(item => {
          let key = {
            commoditySeriesId: item.commoditySeriesId,
            commodityColourId: item.commodityColourId,
            commodityMaterialId: item.commodityMaterialId,
            commodityNumber: item.commodityNumber,
            commodityId: item.commodityId,
            commodityWide: item.commodityWide,
            commodityHigh: item.commodityHigh,
            commodityLong: item.commodityLong,
            commodityThick: item.commodityThick,
          };
          new Promise((resolve, reject) => {
            getGoodsSKUId(key).then(res => {
              resolve(res);
            }).catch(error=>{
              console.error('获取sku',error);
            })
          }).then(res => {
            new Promise(relve => {
              if (res.data&&res.data.commoditySKUId) {
                relve(res.data.commoditySKUId);
              } else {
                // 新增sku
                insertCommoditySku(key).then(res => {
                  relve(res.data);
                }).catch(error=>{
                  console.error('新增sku',error);
                })
              }
            }).then(res => {
              item.cargoList.forEach(attr => {
                arr.push({
                  regionId: attr.regionId,
                  siteId: attr.siteId,
                  storageId: this.ruleForm.storageId,
                  skuGoodsId: res,
                  inventoryNumber: attr.num
                });
                orderSum += attr.num * 1;
              });
              
              let data = {
                arrivalNoticeCode: this.ruleForm.name, //到货单号
                storageId: this.ruleForm.storageId, //仓库id
                warehousePeople: this.id, //入库人id
                warehouseAmount: orderSum, //入库数量
                storingTheResults: "已入库", //入库结果
                accountingDate: this.datePicker, //记账日期
                inventoryGoodsList: arr
              };
              console.log(data);
              console.log(arr.length,tableData.length);
              
              if(arr.length<tableData.length){
                return
              }
              this.loadingbtn = true;
              getUUID({ serialNumber: "SI" }).then(res => {
                data.warehouseWarrantCode = res.data;
                otherWarehousing(data)
                  .then(res => {
                    if (res.status == 200) {
                      this.$message.success("提交成功!");
                      this.loadingbtn = false;
                      this.$router.go(-1);
                    }else{
                      this.$message.error(res.message)
                      this.loadingbtn = false;
                    }
                  })
                  .catch(error => {
                    this.loadingbtn = false;
                    console.error("手动入库中的其它入库", error);
                  });
              });
            });
          });
        });

        return;
      }
      //*********************** 客盆
      if (this.ruleForm.resource == 2) {
        if (!this.ruleForm.remarks) {
          this.$message.error("请输入备注!");
          return;
        }
        let data = {
          arrivalNoticeCode: this.ruleForm.name,
          storageId: this.ruleForm.storageId,
          remarks: this.ruleForm.remarks
        };
        this.loadingbtn = true;
        getUUID({ serialNumber: "SI" }).then(res => {
          data.warehouseWarrantCode = res.data;
          guestBasin(data)
            .then(res => {
              if (res.status == 200) {
                this.$message.success("提交成功!");
                this.loadingbtn = false;
                this.$router.go(-1);
              }else{
                this.$message.error(res.message)
                this.loadingbtn = false;
              }
            })
            .catch(error => {
              this.loadingbtn = false;
              console.error("手动客盆提交", error);
            });
        });

        return;
      }

      //*********************** 订单入库
      let list = [];
      let orderSum = 0; //采购单商品

      if (this.isFlag == 1) {
        //采购单商品
        /**
         * 采购单商品
         *
         * 货区ID
         * @param regionId
         *
         * 货位ID
         * @param siteId
         *
         * skuID
         * @param skuGoodsId
         *
         * 库存数量
         * @param inventoryNumber
         *
         */
        this.$refs.manualOrder.tableData.forEach(item => {
          let arr = [];
          item.cargoList.forEach(attr => {
            arr.push({
              regionId: attr.regionId,
              siteId: attr.siteId,
              skuGoodsId: item.skuGoodsId,
              inventoryNumber: attr.num
            });
          });
          orderSum += item.amount * 1;
          list.push({
            purchaseNumber: this.purchaseNumber,
            inventoryGoodsList: arr
          });
        });

        if (list.length == 0) {
          this.$message.error("当前无数据!");
          return;
        }

        let flag = list.every(item => {
          return !item.inventoryGoodsList.length;
        });

        if (flag) {
          this.$message.error("没有分配货区货位!");
          return;
        }
      }

      let stockSum = 0; //备货数量累加
      if (this.isFlag == 2) {
        // 到货单的数据处理
        let ary = [];
        this.$refs.guidanceBill.tableData.forEach(item => {
          let arr = [];
          item.cargoList.forEach(attr => {
            arr.push({
              regionId: attr.regionId,
              siteId: attr.siteId,
              inventoryNumber: attr.num
            });
          });
          stockSum += item.paidInCount * 1;
          ary.push({
            aogTemplateId: item.aogTemplateId,
            inventoryNumber: item.paidInCount,
            purchasePackageDetailList: arr
          });
        });
        list.push({
          purchaseNumber: this.purchaseNumber,
          purchasePackageList: ary
        });

        if (this.$refs.guidanceBill.tableData.length == 0) {
          this.$message.error("当前无数据");
          return;
        }

        let flag = list.every(item => {
          return item.purchasePackageList.every(attr => {
            return !attr.purchasePackageDetailList.length;
          });
        });

        if (flag) {
          this.$message.error("没有分配货区货位!");
          return;
        }
      }

      //顾家列表处理
      let gjArr = [];
      if (this.isFlag == 3) {
        this.$refs.manualfamily.tableData.forEach(item => {
          let stockArr = [];
          gjArr.push(item);
          item.driver.forEach(attr => {
            stockArr.push({
              storageId: this.ruleForm.storageId,
              regionId: attr.regionId,
              siteId: attr.siteId,
              skuGoodsId: item.skuGoodsId,
              inventoryNumber: attr.num,
              piece: item.paidInPiece
            });
          });
          list.push({
            purchaseNumber: this.purchaseNumber,
            inventoryGoodsList: stockArr
          });
        });

        if (list.length == 0) {
          this.$message.error("当前无数据!");
          return;
        }

        let flag = list.every(item => {
          return !item.inventoryGoodsList.length;
        });

        if (flag) {
          this.$message.error("没有分配货区货位!");
          return;
        }
      }

      if (list.length == 0) {
        this.$message.error("当前无数据!");
        return;
      }
      let data = {
        arrivalNoticeCode: this.ruleForm.name, //到货单号
        storageId: this.ruleForm.storageId, //仓库id
        warehousePeople: this.id, //入库人id
        warehouseAmount: stockSum + orderSum, //入库数量
        storingTheResults: "已入库", //入库结果
        accountingDate: this.datePicker, //记账日期
        list: list,
        gjGoodsList: gjArr
      };
      console.log(data);
      this.loadingbtn = true;
      getUUID({ serialNumber: "SI" }).then(res => {
        data.warehouseWarrantCode = res.data;
        manuallyPutInStorage(data)
          .then(res => {
            console.log(res);
            if (res.status == 200) {
              this.$message.success("入库成功!");
              this.loadingbtn = false;
              this.$router.go(-1);
            }else{
              this.$message.error(res.message)
              this.loadingbtn = false;
            }
          })
          .catch(error => {
            this.loadingbtn = false;
            console.error("手动入库提交", error);
          });
      });
    },

    //选择商品勾选
    selectionChange(val) {
      this.commodityList = val;
    },

    //选择商品确定
    SureFun() {
      if (this.commodityList.length < 1) {
        this.$message.error("请勾选一条!");
      } else {
        let bran = [];
        this.commodityList.forEach(item => {
          bran.push(item.brandId);
        });
        if (this.commodityTable.length == 0) {
          let isBran = Math.max.apply(null, bran) === Math.min.apply(null, bran);
          if (!isBran) {
            this.$message.error("当前品牌不同!");
            return;
          }
        } else {
          let branTab = [];
          this.commodityTable.forEach(item => {
            branTab.push(item.brandId);
          });
          let isBranTab = Math.max.apply(null, branTab) === Math.min.apply(null, bran);
          if (!isBranTab) {
            this.$message.error("已选择的商品品牌和新选择商品品牌不同！");
            return;
          }
        }

        this.commodityList.forEach(item => {
          /**
           * 通过Promise来控制异步，
           * 先请求数据然后放到每条数据集合中
           */
          let data = {
            commodityId: item.commodityId
          };
          let p1 = new Promise((resolve, reject) => {
            listCommodityColour(data).then(attr => {
              resolve(attr);
            });
          });

          let p2 = new Promise((resolve, reject) => {
            listCommoditySeries(data).then(attr => {
              resolve(attr);
            });
          });

          let p3 = new Promise((resolve, reject) => {
            listCommodityMaterial(data).then(attr => {
              resolve(attr);
            });
          });

          //判断当前品牌是否是顾家
          if (item.brandId == 2) {
            Promise.all([p1, p2, p3]).then(res => {

              this.commodityTable.push({
                ...item,
                commodityColourId:item.colourId,
                inventoryNumber: 0,
                colorList: res[0].data,
                seriesList: res[1].data,
                materialList: res[2].data,
                cargoList: [],
                piece: 0,
                colors: "",
                material: "",
                series: "",
              });
              this.isBrand = true;
            });
          } else {
            Promise.all([p1, p2, p3]).then(res => {
              this.commodityTable.push({
                ...item,
                commodityColourId:item.colourId,
                inventoryNumber: 0,
                colorList: res[0].data,
                seriesList: res[1].data,
                materialList: res[2].data,
                cargoList: [],
                colors: "",
                material: "",
                series: "",
              });
              this.isBrand = false;
            });
          }
        });
        this.isCommodity = false;
      }
    },
    handleClose() {
      this.isCommodity = false;
    },
    //补0
    repair(str) {
      return str < 10 ? "0" + str : str;
    },
    //当前时间
    getNowFormatDate() {
      let date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      let hour = date.getHours();
      let minute = date.getMinutes();
      let second = date.getSeconds();
      this.datePicker = `${year}-${this.repair(month)}-${this.repair(
        day
      )} ${this.repair(hour)}:${this.repair(minute)}:${this.repair(second)}`;
    },
    //取消
    cancel() {
      this.$router.go(-1);
    }
  }
};
</script>
<style lang="scss" scoped>
.manual {
  position: relative;
  // 货区货位

  .form_class {
    width: 90%;
    .infoform {
      display: flex;
      flex-wrap: nowrap;
      justify-content: space-between;
      .infoform_item {
        display: flex;
        width: 100%;
      }
    }
  }

  .btn {
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }
}
</style>
