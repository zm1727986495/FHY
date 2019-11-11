
<template>
  <div class="wrapper">
    <div class="head_nav">
      <!-- 导航栏 -->
      <breadcrumb :navList="navList"></breadcrumb>
    </div>

    <el-card class="lvs m-bottom">
      <div class="searchModules">
        <div class="searchModule" :class="{ unfold : foldStatus1 === 0 }">
          <div class="searchModuleTitle">品牌</div>

          <div class="searchModuleContent">
            <span
              class="filter_style_cell"
              :class="{ active: formInline.brandId === '' }"
              @click="selectType('','brandId')"
            >全部</span>
            <span
              v-for="item in selectList.brandList"
              :key="item.brandId"
              class="filter_style_cell"
              :class="{ active: item.brandId == formInline.brandId }"
              @click="selectType(item.brandId,'brandId')"
            >{{ item.brandName }}</span>
          </div>

          <div class="searchModuleBtn">
            <el-button
              type="text"
              :size="size"
              :icon="foldStatus1 == 1 ? 'el-icon-arrow-down' : 'el-icon-arrow-up'"
              @click="handleFold(1)"
            >{{ foldStatus1 == 1 ? '展开' : '收起' }}</el-button>
          </div>
        </div>

        <div class="searchModule" :class="{ unfold : foldStatus2 === 0 }">
          <div class="searchModuleTitle">品类</div>

          <div class="searchModuleContent">
            <span
              class="filter_style_cell"
              :class="{ active: formInline.commodityCategoryId === '' }"
              @click="selectType('','commodityCategoryId')"
            >全部</span>
            <span
              v-for="item in selectList.categoryList"
              :key="item.commodityCategoryId"
              class="filter_style_cell"
              :class="{ active: item.commodityCategoryId == formInline.commodityCategoryId }"
              @click="selectType(item.commodityCategoryId,'commodityCategoryId')"
            >{{ item.categoryName }}</span>
          </div>

          <div class="searchModuleBtn">
            <el-button
              type="text"
              :size="size"
              :icon="foldStatus2 == 1 ? 'el-icon-arrow-down' : 'el-icon-arrow-up'"
              @click="handleFold(2)"
            >{{ foldStatus2 == 1 ? '展开' : '收起' }}</el-button>
          </div>
        </div>

        <div
          class="searchModule"
          :class="{ unfold : foldStatus3 === 0 }"
          v-show="selectList.classifyList && selectList.classifyList.length"
        >
          <div class="searchModuleTitle">一级分类</div>

          <div class="searchModuleContent">
            <span
              class="filter_style_cell"
              :class="{ active: formInline.commodityClassifyId === '' }"
              @click="getChildClassifyList('')"
            >全部</span>
            <span
              v-for="(item,index) in selectList.classifyList"
              :class="{ active: item.commodityClassifyId === formInline.commodityClassifyId }"
              class="filter_style_cell"
              @click="getChildClassifyList(item.commodityClassifyId,index)"
              :key="item.commodityClassifyId"
            >{{ item.classifyName }}</span>
          </div>

          <div
            class="searchModuleBtn"
            v-show="selectList.classifyList && selectList.classifyList.length > 3"
          >
            <el-button
              type="text"
              :size="size"
              :icon="foldStatus3 == 1 ? 'el-icon-arrow-down' : 'el-icon-arrow-up'"
              @click="handleFold(3)"
            >{{ foldStatus3 == 1 ? '展开' : '收起' }}</el-button>
          </div>
        </div>
        <div
          class="searchModule"
          :class="{ unfold : foldStatus4 === 0 }"
          v-show="selectList.childClassifyList && selectList.childClassifyList.length"
        >
          <div class="searchModuleTitle">二级分类</div>

          <div class="searchModuleContent">
            <span
              class="filter_style_cell"
              :class="{ active: formInline.childCommodityClassifyId === '' }"
              @click="selectClassify('')"
            >全部</span>
            <span
              v-for="item in selectList.childClassifyList"
              @click="selectClassify(item.commodityClassifyId)"
              class="filter_style_cell"
              :class="{ active: formInline.childCommodityClassifyId === item.commodityClassifyId }"
              :key="item.commodityClassifyId"
            >{{ item.classifyName }}</span>
          </div>

          <div
            class="searchModuleBtn"
            v-show="selectList.childClassifyList && selectList.childClassifyList.length > 3"
          >
            <el-button
              type="text"
              :size="size"
              :icon="foldStatus4 == 1 ? 'el-icon-arrow-down' : 'el-icon-arrow-up'"
              @click="handleFold(4)"
            >{{ foldStatus4 == 1 ? '展开' : '收起' }}</el-button>
          </div>
        </div>
      </div>

      <div class="warp_head_list">
        <!-- 商品价格详情按钮组 -->
        <div class="list_top">
          <!-- 查询条件组 -->
          <div class="search_item">
            <el-input
              class="width-100"
              v-model.trim="formInline.commodityGroup"
              @keyup.enter.native='searchFun()'
              placeholder="商品名称/商品编码"
              size="medium"
              maxlength="50"
              clearable
            ></el-input>
          </div>
          <div class="search_item">
            <el-select v-model="formInline.seriesId" placeholder="系列" clearable>
              <el-option
                v-for="item in seriesList"
                :key="item.id"
                :label="item.dictName"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
          <div class="search_item">
            <el-select v-model="formInline.colourId" placeholder="颜色" clearable>
              <el-option
                v-for="item in colorsList"
                :key="item.id"
                :label="item.dictName"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
          <div class="search_item">
            <el-select v-model="formInline.materialId" placeholder="材质" clearable>
              <el-option
                v-for="item in materialList"
                :key="item.id"
                :label="item.dictName"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
          <div class="search_item">
            <el-input
              class="width-100"
              v-model.trim="formInline.commodityModel"
              placeholder="请输入货号"
              size="medium"
              maxlength="50"
              clearable
            ></el-input>
          </div>
          <div class="search_item">
            <el-input
              class="width-100"
              v-model.trim="formInline.itemNumber"
              placeholder="请输入型号"
              size="medium"
              maxlength="50"
              clearable
            ></el-input>
          </div>
          <div class="search_item btn_list">
            <el-button class="button-fc" type="warning" size="medium" @click="searchFun">查询</el-button>
            <el-button class="el-button--medium" type="primary" size="medium" @click="resetFun">重置</el-button>
          </div>
        </div>
      </div>
      <!-- 商品价格详情小按钮 -->
      <div class="h-width"></div>
      <div class="price-btn-list">
        <el-button
          v-if="btnJurisdiction.priceguard_Submission"
          size="small"
          class="button-96"
          @click="addFun"
        >提交</el-button>
        <el-button
          v-if="btnJurisdiction.priceguard_Edit"
          size="small"
          class="button-96"
          @click="editFun"
        >编辑</el-button>
        <!-- <el-button size="small" class="button-96" @click="recallFun">导入</el-button> -->
        <el-upload
          v-if="btnJurisdiction.priceguard_Import"
          action="/api/pc/commodityPriceImport/addBatchImport"
          accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          class="upload-demo"
          multiple
          :headers="headers"
          :data="obj"
          :show-file-list="false"
          :before-upload="beforeUploat"
          :on-success="uploadSuccess"
          style="display:inline-block;margin-left:10px"
        >
          <el-button class="button-96" size="small">导入</el-button>
        </el-upload>
      </div>
      <!-- 批次记录商品详情表格 -->
      <div class="table_list lvs attribute m-top20" v-loading="loading">
        <el-table
          border
          :row-class-name="tableRowClassName"
          :data="tabList"
          @selection-change="handleSelectionChange"
          ref="multipleTable"
          style="width: 100%;"
        >
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column type="index" width="55" align="center" label="序号"></el-table-column>
          <el-table-column prop="commodityCode" align="center" sortable label="商品编码" width="200"></el-table-column>
          <el-table-column
            prop="commodityName"
            align="center"
            label="商品名称"
            width="200"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column prop="brandName" align="center" label="品牌" width="200"></el-table-column>
          <el-table-column prop="sellingPrice" align="center" label="销售价" width="200">
            <template slot-scope="scope">
              <div>
                <el-input
                  v-if="scope.row.isFlag"
                  class="width-100"
                  v-model.number="scope.row.sellingPrice"
                  size="mini"
                  @input="sellInput(scope.row)"
                  oninput="value=value.replace(/[^\d]/g,'')"
                ></el-input>
                <p
                  v-else
                  class="table_action_span"
                  @click="salesPriceFn(scope.row.commodityPriceId)"
                >{{scope.row.sellingPrice | formatAmount}}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="categoryName" align="center" label="品类" width="200"></el-table-column>
          <el-table-column show-overflow-tooltip width="300" label="有效期" align="center">
            <template slot-scope="scope">
              <div>
                <!-- <el-date-picker
                  size="small"
                  v-if="scope.row.isFlag"
                  v-model="scope.row.validDate"
                  value-format="yyyy-MM-dd"
                  format="yyyy-MM-dd"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                ></el-date-picker>-->
                <p>{{scope.row.validDate[0]}}-{{scope.row.validDate[1]}}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="remarks" align="center" label="备注" width="200"></el-table-column>
        </el-table>
        <!-- 点击批次记录ID分页条 -->
        <div class="pagination_wrap">
          <pagination
            background
            :current-page="currentPage"
            :pageSize="pageSize"
            :total="total"
            @sizeChange="sizeChange"
            @currentChange="currentChange"
          ></pagination>
        </div>
      </div>
    </el-card>
    <div class="foot_btn_box">
      <el-button @click="cancel">返 回</el-button>
    </div>

    <el-dialog
      title="有效时间"
      :visible.sync="dateVisible"
      width="600px"
      custom-class="customDialogTitle"
    >
      <!-- <el-date-picker
        size="small"
        v-model="dateValue"
        value-format="yyyy-MM-dd"
        format="yyyy-MM-dd"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      ></el-date-picker>-->
      <el-date-picker
        v-model="dateValue"
        value-format="yyyy-MM-dd"
        format="yyyy-MM-dd"
        type="date"
        placeholder="开始日期"
      ></el-date-picker>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="timeDetermination">确 定</el-button>
        <el-button @click="dateVisible = false">取 消</el-button>
      </span>
    </el-dialog>

    <!-- 销售价历史 -->
    <salesprice ref="salesprice" :dialogVisible="dialogVisible" @closeFn="closeFn"></salesprice>
  </div>
</template>
<script>
import breadcrumb from "@/views/components/breadcrumb";
import spot from "@/assets/images/spot.png";

import pagination from "@/views/components/pagination";
import batchRecords from "./components/batchRecords";
import {
  listSellingPriceCom,
  editPrice
} from "api/administrationCenter/salecost/priceguard/priceguard";

import {
  listCategory, // 获取品类
  listBrand, // 获取品牌
  listClassify
} from "api/price/price";
import { getToken } from "utils/auth";
import { listBaseDict } from "api/pulicJava"; //字典查询
import salesprice from "./components/salesprice"; //销售价历史

export default {
  // name: 'strateDetails',
  components: {
    breadcrumb,
    pagination,
    batchRecords,
    salesprice
  },

  data() {
    return {
      // 按钮权限***********
      btnJurisdiction: JSON.parse(this.$loca.getItem("element")),
      navList: [], //导航标签
      spot,
      dialogVisible: false, //历史数据
      dateVisible: false,
      loading: false,
      // 商品价格详情里的表格数据
      tabList: [],
      selectVal: [], // 商品价格详情表格的选中
      idData: [],
      dateValue: "", //时间

      // 查询条件搜索
      formInline: {
        commodityGroup: "", // 商品名称/商品编码
        seriesId: "", // 系列
        materialId: "", // 材质
        colourId: "", // 颜色
        itemNumber: "", // 货号
        commodityModel: "", //型号

        brandId: "", // 品牌
        commodityCategoryId: "", // 品类
        commodityClassifyId: "", // 一级分类
        childCommodityClassifyId: "" // 二级分类
      },

      //导入
      obj: {},
      headers: {
        Authorization: getToken()
      },

      // 手风琴的数据
      foldStatus1: 1, // 1展开 0 收起
      foldStatus2: 1, // 1展开 0 收起
      foldStatus3: 1, // 1展开 0 收起
      foldStatus4: 1, // 1展开 0 收起

      size: "medium",
      // 条件
      selectList: {
        brandList: [], // 品牌数据
        categoryList: [], // 品类数据
        classifyList: [], // 一级分类
        childClassifyList: [] // 二级分类
      },
      colorsList: [], //颜色
      materialList: [], //材质
      seriesList: [], //系列
      selectedProducts: [], // 选择商品

      //分页
      total: 0, // 总数
      pageSize: 20, // 单页条数
      currentPage: 1 // 当前页
    };
  },
  created() {
    // 获取品牌
    this.getBrandList();
    // 获取品类
    this.getCategoryList();
  },
  mounted() {
    // 头部面包屑
    this.navList = this.$route.meta;
    this.getList();
    this.getSeries();
    this.getColors();
    this.getMaterial();
  },
  methods: {
    //时间弹框
    timeDetermination() {
      if (!this.dateValue) {
        this.$message.error("请选择有效期!");
        return;
      }
      // if (this.dateValue.length == 0) {
      //   this.$message.error("请选择有效期!");
      //   return;
      // }
      let arr = [];
      this.selectVal.forEach(attr => {
        arr.push({
          priceStrategyId: this.$route.query.priceStrategyId,
          //organizationId: this.$route.query.organizationId,
          commodityId: attr.commodityId,
          // sellingPrice: parseFloat(attr.sellingPrice.replace(/,/g,'')),
          sellingPrice: attr.sellingPrice,
          saleStartTime: this.dateValue,
          saleEndTime: this.dateValue
          // saleStartTime: this.dateValue ? this.dateValue[0] : null,
          // saleEndTime: this.dateValue ? this.dateValue[1] : null
        });
        this.tabList.forEach(item => {
          if (attr.organizationId == item.organizationId) {
            attr.isFlag = true;
          }
        });
      });
      editPrice(arr)
        .then(res => {
          if (res.status == 200) {
            this.$message.success("提交成功!");
            this.dateVisible = false;
            this.getList();
          }
        })
        .catch(error => {
          console.error("策略详情提交", error);
        });
    },
    //点击销售价
    salesPriceFn(commodityPriceId) {
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.salesprice.getData(commodityPriceId);
      });
    },
    sellInput(row) {
      this.tabList.forEach(item => {
        if (item.commodityId == row.commodityId) {
          item.sellingPrice = row.sellingPrice;
        }
      });
    },
    //关闭弹框
    closeFn() {
      this.dialogVisible = false;
    },
    //获取颜色
    getColors() {
      let data = {
        dataType: "COMMODITY_COLOR"
      };
      listBaseDict(data)
        .then(res => {
          this.colorsList = res.data;
        })
        .catch(error => {
          console.error("获取颜色", error);
        });
    },
    // 材质
    getMaterial() {
      let data = {
        dataType: "COMMODITY_MATERIAL"
      };
      listBaseDict(data)
        .then(res => {
          this.materialList = res.data;
        })
        .catch(error => {
          console.error("获取材质", error);
        });
    },

    // 系列
    getSeries() {
      let data = {
        dataType: "DEMAND_STYLE"
      };
      listBaseDict(data)
        .then(res => {
          this.seriesList = res.data;
        })
        .catch(error => {
          console.error("获取系列", error);
        });
    },
    /**
     * 获取全部品牌列表
     * @method
     * getBrandList
     */
    getBrandList() {
      listBrand()
        .then(res => {
          if (res.status == 200) {
            this.selectList.brandList = res.data;
          }
        })
        .catch(error => {
          console.error(
            "销售价格 销售价格维护 商品价格详情 获取品牌 views/price/strateDetail",
            error
          );
        });
    },

    /**
     * 获取全部品类列表
     * @method
     * getCategoryList
     */
    getCategoryList() {
      listCategory()
        .then(res => {
          if (res.status == 200) {
            this.selectList.categoryList = res.data;
          }
        })
        .catch(error => {
          console.error(
            "销售价格 销售价格维护 商品价格详情 获取品类 views/price/strateDetail",
            error
          );
        });
    },

    // 选中品牌 and 品类
    selectType(value, type) {
      this.formInline[type] = value;
      this.getList();

      if (type == "commodityCategoryId") {
        // 如果点击的类型是品类
        // 如果是点击品类 即 获取一级分类
        this.selectList.classifyList = [];
        this.selectList.childClassifyList = [];
        this.formInline.commodityClassifyId = "";
        if (value) {
          let params = {
            commodityCategoryId: value
          };
          listClassify(params)
            .then(response => {
              this.selectList.classifyList = response.data; // 一级分类
            })
            .catch(error => {
              console.error(
                "销售价格 销售价格维护 选中品牌 and 品类 views/price/strateDetail",
                error
              );
            });
        }
      }
    },

    // 点击一级分类 即获取二级分类
    getChildClassifyList(commodityClassifyId, index) {
      if (commodityClassifyId) {
        this.selectList.childClassifyList = this.selectList.classifyList[
          index
        ].children;
        this.formInline.commodityClassifyId = commodityClassifyId; // 一级分类
        this.formInline.childCommodityClassifyId = "";
      } else {
        // 点击一级分类的全部
        this.formInline.commodityClassifyId = "";
        this.formInline.childCommodityClassifyId = "";
        this.selectList.childClassifyList = [];
      }
      this.formInline.commodityClassifyId = commodityClassifyId;
      // this.getCostPrice();
    },

    handleFold(type) {
      this["foldStatus" + type] = this["foldStatus" + type] == 1 ? 0 : 1;
    },

    // 点击二级分类
    selectClassify(commodityClassifyId) {
      if (commodityClassifyId) {
        this.formInline.commodityClassifyId = commodityClassifyId;
      } else {
        // 点击二级分类的全部
        this.formInline.commodityClassifyId = this.commodityClassifyId;
      }
      this.formInline.childCommodityClassifyId = commodityClassifyId;
      // this.getCostPrice();
    },

    // 查询商品价格详情
    searchFun() {
      this.currentPage = 1;
      this.getList();
    },
    // 重置按钮
    resetFun() {
      this.formInline = {};
    },

    /**
     * 获取策略商品列表
     * @method
     * getList
     */
    getList() {
      let data = {
        ...this.formInline,
        priceStrategyId: this.$route.query.priceStrategyId,
        organizationId: this.$route.query.organizationId,
        page: this.currentPage,
        limit: this.pageSize
      };

      listSellingPriceCom(data)
        .then(res => {
          if (res.status == 200) {
            this.tabList = res.data.rows.map(item => {
              let arr = [];
              if (item.saleStartTime && item.saleEndTime) {
                arr = [item.saleStartTime, item.saleEndTime];
              } else {
                arr = [];
              }
              item.validDate = arr;
              return { isFlag: false, ...item };
            });
            this.total = res.data.total;
            this.loading = false;
          }else{
            this.loading = false;
          }
        })
        .catch(error => {
          this.loading = false;
          console.error("获取策略商品列表", error);
        });
    },

    //提交
    addFun() {
      if (this.selectVal < 1) {
        this.$message.error("您未勾选!");
        return;
      }
      this.dateValue = "";
      this.dateVisible = true;
    },
    //编辑
    editFun() {
      this.selectVal.forEach(attr => {
        this.tabList.forEach(item => {
          if (attr.commodityId == item.commodityId) {
            attr.isFlag = true;
          }
        });
      });
    },
    //导入之前
    beforeUploat(file) {
      this.obj.organizationId = this.$route.query.organizationId;
      this.obj.priceStrategyId = this.$route.query.priceStrategyId;
      this.loading = true;
    },
    //导入成功
    uploadSuccess(file) {
      console.log(file.status);
      if (file.status == 300) {
        this.$router.push({
          path: "Importstrategy",
          query: {
            organizationId: this.$route.query.organizationId,
            priceStrategyId: this.$route.query.priceStrategyId
          }
        });
      }
      if (file.status == 200) {
        this.getList();
        this.$message.success('导入成功!')
      }
    },
    // 改变条数方法
    sizeChange(val) {
      this.currentPage = 1;
      this.pageSize = val;
      this.getList();
    },
    // 翻页方法
    currentChange(val) {
      this.currentPage = val;
      this.getList();
    },
    //勾选
    handleSelectionChange(val) {
      this.selectVal = val;
    },

    //表格斑马线设置
    tableRowClassName({ row, rowIndex }) {
      return rowIndex % 2 != 0 ? "el-f0" : "";
    },
    //返回
    cancel() {
      this.$router.go(-1);
    }
  },
  filters: {
    formatAmount(amount) {
      const validateNumber = n =>
        !isNaN(parseFloat(n)) && isFinite(n) && Number(n) === n;

      if (!validateNumber(+amount)) {
        return amount;
      }
      return (+amount)
        .toFixed(2)
        .replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, "$&,");
    }
  }
};
</script>
<style scoped lang="scss">
.wrapper {
  .foot_btn_box {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .price-btn-list {
    display: flex;
    flex-wrap: nowrap;
  }
  .warp_head_list {
    width: 100%;
  }

  .list_top {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    .search_item {
      margin: 10px 0px;
      padding: 0px 5px;
      width: 25%;
      > div {
        width: 100%;
      }
      &.center {
        width: 100%;
      }
    }
    .btn_list {
      width: 100%;
      text-align: center;
      display: flex;
      flex-wrap: nowrap;
      justify-content: center;
      align-items: center;
    }
  }

  .Dialog_input_cell {
    display: flex;
    flex-wrap: nowrap;
    height: 50px;
    align-items: center;
  }
  .dialog_con_box .Dialog_input_cell .Dialog_input_cell_title {
    width: 100px;
    text-align: right;
    padding-right: 10px;
  }
  .Dialog_input_cell_input {
    flex: 1;
  }
}

.operaItems {
  color: rgb(127, 221, 228);
  box-sizing: border-box;
  width: 30%;
  // padding:2px 6px;
  border: none;
  appearance: none;
  background: transparent;
  &:hover {
    background: transparent;
  }
}

.searchModules {
  width: 100%;
  margin-bottom: 10px;
  font-size: 14px;
  .searchModule {
    width: 100%;
    display: flex;
    background-color: #fff;
    border-bottom: 1px solid #dcdfe6;
    height: 40px;
    line-height: 40px;
    overflow: hidden;
    .searchModuleTitle {
      width: 180px;
      background-color: #f0f5f9;
      text-align: center;
    }
    .searchModuleContent {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: start;
      flex-wrap: wrap;
      color: #666;
      .filter_style_cell {
        cursor: pointer;
        padding: 0 30px;
        width: 25%;
        height: 40px;
        overflow: hidden;
      }
      .filter_style_cell.active {
        color: #409eff;
      }
    }
  }
  .unfold {
    overflow: auto;
    height: auto;
  }
}
</style>

