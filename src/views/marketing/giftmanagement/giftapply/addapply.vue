<template>
  <div class="addapply">
    <div class="head_nav">
      <!-- 导航栏 -->
      <breadcrumb :navList="navList"></breadcrumb>
    </div>

    <el-card>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="135px">
        <div class="search_box">
          <!-- prop="applyStoreId" -->
          <el-form-item label="门店：" required>
            <el-select v-model="ruleForm.applyStoreId" placeholder="请选择门店" @change="storeIdChange(ruleForm.applyStoreId)" style="width:100%">
              <el-option v-for="item in storeOptions" :key="item.storeId" :label="item.storeName" :value="item.storeId"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="门店人员：" prop="applyUserId">
            <el-select v-model="ruleForm.applyUserId" placeholder="请选择门店人员" @change="applyUserIdChange(ruleForm.applyUserId)" style="width:100%">
              <el-option style="width:100%" v-for="item in userOptiones" :key="item.userId" :label="item.name" :value="item.userId"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="联系人电话：" class="width-100">
            <el-input placeholder="联系人电话" v-model="ruleForm.contactPhone"></el-input>
          </el-form-item>
        </div>
        <div class="search_box">
          <el-form-item label="预计到货时间：" prop="estimatedTimeOfArrival">
            <el-date-picker style="width:100%" v-model="ruleForm.estimatedTimeOfArrival" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" format="yyyy-MM-dd"></el-date-picker>
          </el-form-item>

          <el-form-item label="品牌：" prop="brandId">
            <el-select v-model="ruleForm.brandId" placeholder="请选择品牌" style="width:100%">
              <el-option v-for="item in brandOptions" :key="item.brandId" :label="item.brandName" :value="item.brandId"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="品类：" prop="categoryId">
            <el-select v-model="ruleForm.categoryId" placeholder="请选择品类" style="width:100%">
              <el-option v-for="item in categoryOptions" :key="item.commodityCategoryId" :label="item.categoryName" :value="item.commodityCategoryId"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="search_item_area">
          <el-form-item label="申请原因：" class="width-100">
            <el-input type="textarea" placeholder="申请原因" v-model="ruleForm.applyReason" class="width-100"></el-input>
          </el-form-item>
        </div>

        <div>
          <div class="btn_list_2 m-top20">
            <el-button class="el-button--medium" type="primary" size="medium" @click="addlist">添加</el-button>
            <el-button class="el-button--medium" type="primary" size="medium" @click="dellist">删除</el-button>
          </div>
          <div class="iconBox">
            <i class="Icon"></i>
            <span>申领清单</span>
          </div>

          <div class="search_item_list table_list lvs attribute">
            <el-table border :row-class-name="tableRowClassName" @selection-change="handleSelectionChange" :data="storeGiftsList">
              <el-table-column fixed='left' type="selection" width="40"></el-table-column>
              <el-table-column width="240" prop="commodityCode" align="center" label="礼品编码" sortable></el-table-column>
              <el-table-column width="240" prop="brand_name" align="center" label="礼品品牌" sortable></el-table-column>
              <el-table-column width="240" prop="category_name" align="center" label="礼品品类" sortable></el-table-column>
              <el-table-column width="240" prop="commodityName" align="center" label="礼品名称" sortable></el-table-column>
              <el-table-column width="240" prop="colourId" align="center" label="选择颜色" sortable>
                <template slot-scope="scope">
                  <el-select v-model="scope.row.colourId" placeholder="请选择颜色" @change="colourmaterialseriesChange(scope.row)">
                    <el-option v-for="(item,index) in scope.row.commoditycolourList" :key="index" :label="item.colourName" :value="item.colourId"></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column width="240" prop="seriesId" align="center" label="选择系列" sortable>
                <template slot-scope="scope">
                  <el-select v-model="scope.row.seriesId" placeholder="请选择系列" @change="colourmaterialseriesChange(scope.row)">
                    <el-option v-for="(item,index) in scope.row.commodityseriesList" :key="index" :label="item.seriesName" :value="item.seriesId"></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column width="240" prop="materialId" align="center" label="选择材质" sortable>
                <template slot-scope="scope">
                  <el-select v-model="scope.row.materialId" placeholder="请选择材质" @change="colourmaterialseriesChange(scope.row)">
                    <el-option v-for="item in scope.row.commoditymaterialList" :key="item.materialId" :label="item.materialName" :value="item.materialId"></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column width="240" prop="numberSum" align="center" label="库存数" sortable></el-table-column>
              <el-table-column width="240" prop="inventoryGoodsDTOList" align="center" label="申请数量" sortable>
                <template slot-scope="scope">
                  <p @click="distribution(scope.row)" class="table_action_span" v-if="scope.row.number=='0'">选择数量</p>
                  <p @click="distribution(scope.row)" class="table_action_span" v-if="scope.row.number!='0'">{{scope.row.number}}</p>
                </template>
              </el-table-column>
              <el-table-column width="240" prop="collarNumber" align="center" label="领用到店数量" sortable>
                <template slot-scope="scope">
                  <el-input-number v-model="scope.row.collarNumber" :min="0" :max="scope.row.number"></el-input-number>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>

        <div class="btn_btq">
          <el-button class="el-button--medium" type="primary" size="medium" @click="sendJava('ruleForm')">提交</el-button>
          <el-button class="el-button--medium" type="primary" size="info" @click="backFun">取消</el-button>
        </div>
      </el-form>
    </el-card>

    <!-- 添加礼品弹框 -->
    <el-dialog title="礼品列表" custom-class="customDialogTitle" :visible="productDialog" width="90%" top="2vh"
     class="selectCommodity" :before-close="closeProductDialog" :append-to-body="true">
      <selectGiftCom @selectionChange="selectionChange" ref="selectedCommodities" :select-list="productList" v-if="productDialog"></selectGiftCom>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="selectProductConfirm">确 定</el-button>
        <el-button @click="closeProductDialog">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 礼品数量选择 -->
    <stockNumdia :visible="stockNum_vis" v-if="stockNum_vis" :rowObj="rowObj" @close_num="closeNum"></stockNumdia>
  </div>
</template>
<script>
import pagination from "@/views/components/pagination";

import breadcrumb from "@/views/components/breadcrumb";

import stockNumdia from "./components/stockNumdia"; //库存数量弹框

import selectGiftCom from "./components/selectGiftCom"; //添加礼品弹框

import {
  listCommodityColour, // 商品颜色查询
  listCommoditySeries, // 商品系列查询
  listCommodityMaterial // 商品材质查询
} from "api/administrationCenter/stockmanagement/index";

import {
  recommendedStoreBrand, //根据门店id  获取门店下品牌
  recommendedStoreCategory //根据门店id  获取门店下品类
} from "api/order/tapesheet/tapesheet";

import { getUUID } from "api/pulicJava";//生成编码 

import {  getGoodsSKUId } from "api/entrepotSet/stockManagement/stockPending/stockPending";//获取商品skuid

import { listBrand, listCategory } from "api/pulicJava";

import { listStoreUser } from "api/common/common";//根据门店id获取门店人员接口

import { getNoNumber } from "api/entrepotSet/inventorymanagement/storeInventory/storeInventory"; //礼品库存数量查询

import {
  insertStoreGiftCollar, //新增申请单
  getUserStore, //获取登录人所属门店
  updateStoreGiftCollar //提交编辑信息
} from "@/api/order/giftmanagement/giftmanagement";


import { resolve } from "url";
import { StringDecoder } from 'string_decoder';

export default {
  data() {
    return {
      storeOptions: [], //登录人所属门店列表
      userOptiones: [], //门店人员列表
      brandOptions: [], //品牌下拉
      categoryOptions: [], //品类下拉
      navList: [], //头部面包屑
      ruleForm: {
        applyUserId: "",
        contactPhone: "",
        storeGiftsList: []
      },
      storeGiftsList: [], //页面上增加过来的礼品列表
      rules: {
        estimatedTimeOfArrival: [
          { required: true, message: "请选择时间", trigger: "change" }
        ],
        brandId: [{ required: true, message: "请选择品牌", trigger: "change" }],
        applyStoreId: [
          { required: true, message: "请选择门店", trigger: "change" }
        ],
        applyUserId: [
          { required: true, message: "请选择门店人员", trigger: "change" }
        ],
        contactPhone: [
          { required: true, message: "请填写联系人员电话", trigger: "blur" }
        ],
        categoryId: [
          { required: true, message: "请选择品类", trigger: "change" }
        ],
        applyReason: [
          { required: true, message: "请输入申请原因", trigger: "blur" }
        ]
      },

      stockNum_vis: false, //库存数量弹框是否显示
      rowObj: {}, //库存数量要用对象信息
      // 商品弹框   --->
      productDialog: false,
      productList: {
        selectedCommodities: [], // 选中的商品 可不传 即 已有的table中的商品
        height: "350px", // 设置表格高度 可不传（弹出层最好传下）
        isDialog: true // 是否为弹出层（不传默认为页面）
      },
      selectedProducts: [], // 选择商品
      elsectVal: [] // table表单 勾选属性
      //  <----    商品弹框
    };
  },

  mounted() {
    this.navList = this.$route.meta;
    this.getUserStoreFun(); // 获取登录人所属门店
  },

  methods: {
    //获取登录人的门店
    getUserStoreFun() {
      getUserStore().then(res => {
        this.storeOptions = res.data.rows;
        this.ruleForm.applyStoreId = this.storeOptions[0].storeId;//默认选中第一条门店
        this.storeIdChange(this.ruleForm.applyStoreId);
      });
    },

    //门店id改变   根据门店id获取门店人员信息
    storeIdChange(id) {
      let data = {
        storeId: id
      };
      listStoreUser(data).then(res => {
        this.userOptiones = res.data;//根据门店id获取门店人员信息
      });
      recommendedStoreBrand(data).then(res => {
        this.brandOptions = res.data.rows;//根据门店id获取品牌
      });
      recommendedStoreCategory(data).then(res => {
        this.categoryOptions = res.data.rows;//根据门店id获取品类
      });
    },

    //门店人员改变   带出选中人的电话
    applyUserIdChange(id) {
      let arr = this.userOptiones.filter(item => {
        return item.userId == id;
      });
      this.ruleForm.contactName = arr[0].name;

      this.ruleForm.contactPhone = arr[0].mobilePhone;
    },

    //颜色系列材质改变
    colourmaterialseriesChange(row) {
      let obj = {
        commodityColourId: row.colourId,
        commodityMaterialId: row.materialId,
        commoditySeriesId: row.seriesId,
        commodityId: row.commodityId
      };
      new Promise((resolve, reject) => {
        getGoodsSKUId(obj).then(res => {
          resolve(res);
        });
      }).then(res => {//如果能获取到skuid  根据skuid查询库存
        if (res.data) {
          row.commoditySkuId = res.data.commoditySKUId;
          let query = {
            skuGoodsId: res.data.commoditySKUId,
            // storeId: this.ruleForm.applyStoreId
          };
          getNoNumber(query).then(res => {
            let sum = 0;
            res.data.forEach(item => {
              sum = sum + item.inventoryNumber;
            });
            row.numberSum = sum;      //计算库存总数
            row.inventoryGoodsDTOList = res.data;
          });
        }
      });
    },

    
    // 点击添加商品
    addlist() {
      if(this.ruleForm.applyStoreId==undefined){
        this.$message.warning("请选择先选择门店");
      }else{
        this.productDialog = true;//打开弹框
        this.productList.selectedCommodities = this.commodityIds;//计算勾选过得商品  不能再添加
      };
    },

    //根据仓库填数量
    distribution(obj) {
      if (obj.numberSum == "0") {
        this.$message.warning("该礼品没有实际库存，无法选择数量");
      } else {
        this.rowObj = obj;
        this.stockNum_vis = true;
      }
    },
    //关闭仓库的数量分配弹框
    closeNum() {
      this.stockNum_vis = false;
    },

    // 选择商品  用commodityId商品id去差库存数量
    selectProductConfirm() {
      if (this.selectedProducts.length) {
        this.selectedProducts.forEach((item, index) => {
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

          Promise.all([p1, p2, p3]).then(res => {
            item.commoditycolourList = res[0].data; //商品颜色
            item.commodityseriesList = res[1].data; //商品系列
            item.commoditymaterialList = res[2].data; //商品材质
            this.$set(item,'numberSum', 0);    //设置对象库存数数量
            this.$set(item,'number',0);        //设置对象申请数量
            this.$set(item,'collarNumber',0);  //设置对象领用到店数量
            this.$set(item,'inventoryGoodsDTOList',[]);//设置对象的弹出框的库存数量为空数组  
            this.firstSKUid(item);
            this.storeGiftsList.push(item);
          });
        });
        this.productDialog = false;
      } else {
        this.$message.warning("请选择商品");
      }
    },

    //选择完商品push
    firstSKUid(row){
      let obj = {
        commodityColourId: row.colourId,
        commodityMaterialId: row.materialId,
        commoditySeriesId: row.seriesId,
        commodityId: row.commodityId
      };
      new Promise((resolve, reject) => {
        getGoodsSKUId(obj).then(res => {
          resolve(res);
        });
      }).then(res => {//如果能获取到skuid  根据skuid查询库存
        if (res.data) {
          row.commoditySkuId = res.data.commoditySKUId;
          let query = {
            skuGoodsId: res.data.commoditySKUId,
            // storeId: this.ruleForm.applyStoreId
          };
          getNoNumber(query).then(res => {
            let sum = 0;
            res.data.forEach(item => {
              sum = sum + item.inventoryNumber;
            });
            row.numberSum = sum;      //计算库存总数
            row.inventoryGoodsDTOList = res.data;
          });
        }
      });
    },




    //关闭商品弹框
    closeProductDialog() {
      this.productDialog = false;
    },

    //删除申请清单
    dellist() {
      if (this.elsectVal.length > 0) {
        this.$confirm("是否作废勾选信息?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.elsectVal.forEach(item => {
              this.storeGiftsList = this.storeGiftsList.filter(attr => {
                return item.commodityId !== attr.commodityId;
              });
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消操作"
            });
          });
      } else {
        this.$message.warning("请勾选需要删除的商品");
      }
    },

    //保存  提交按钮
    sendJava(formName) {
    
      this.$refs[formName].validate(valid => {
        if (valid) {
          //校验有没有勾选
          if (this.elsectVal.length == "0") {
            this.$message.warning("请勾选要添加的礼品");
            return;
          }

          //校验没有库存的礼品
          let flag1 = this.elsectVal.every(item => {
            return item.numberSum != 0;
          });

          if (!flag1) {
            this.$message.warning("您勾选了没有库存的礼品");
            return;
          }

          //校验没有增加申请数量
          let flag2 = this.elsectVal.every(item => {
            return item.number != 0;
          });
          if (!flag2) {
            this.$message.warning("您勾选了没有申请数量的礼品");
            return;
          }

          this.ruleForm.storeGiftsList = this.elsectVal;
          console.log(this.ruleForm);
          

          new Promise((resolve, reject) => {
            getUUID({ serialNumber: "GA" }).then(res => {
              resolve(res);
            });
          }).then(res => {
            this.ruleForm.applyOdd = res.data;
            insertStoreGiftCollar(this.ruleForm)
              .then(res => {
                if (res.status == "200") {
                  this.$message.success("添加成功");
                  this.$router.push({
                    path: "/gift/giftapply"
                  });
                }
              })
              .catch(error => {
                console.log(
                  error + "views/marketing/giftmanagement/giftapply/addapply"
                );
              });
          });
        } else {
          this.$message.error("请检查填写信息是否遗漏");
        }
      });
    },

    //取消按钮
    backFun() {
      this.$router.go(-1);
    },
    // 选择商品 复选框
    selectionChange(val) {
      this.selectedProducts = val;
    },

    //表格斑马线设置
    tableRowClassName({ row, rowIndex }) {
      return rowIndex % 2 != 0 ? "el-f0" : "";
    },

    //勾选函数回调
    handleSelectionChange(val) {
      this.elsectVal = val;
    }
  },
  computed: {
    commodityIds() {
      let arr = [];
      this.storeGiftsList.forEach(item => {
        arr.push(item.commodityId);
      });
      return arr;
    }
  },

  components: {
    breadcrumb,
    pagination,
    stockNumdia, //库存数量弹框
    selectGiftCom //选择商品弹框
    //addgiftdia
  }
};
</script>

<style scope lang="scss">
.addapply {
  .search_box {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    width: 97%;
    > div {
      width: 33%;
    }
  }

  .search_item_area {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    border-bottom: 1px solid #f2eeee;
    padding-bottom: 25px;
    width: 97%;
    // div {
    //   width: 97%;
    // }
  }
  .search_item_list {
    margin-top: 20px;
    display: flex;
    flex-wrap: nowrap;
    > span {
      min-width: 100px;
      text-align: right;
    }
  }

  .btn_list_2 {
    width: 100%;
    text-align: right;
  }
  .btn_btq {
    width: 300px;
    margin: 20px auto;
  }
}
</style>
