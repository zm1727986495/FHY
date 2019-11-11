<template>
  <div class="cost_box">
    <div class="head_nav">
      <!-- 导航栏 -->
      <breadcrumb :navList="navList"></breadcrumb>
    </div>

    <div class="cost_content">
      <!-- 左边的查询卡片 -->
      <el-card class="m-bottom20">
        <div class="warp_list">
          <div class="head_search">
            <el-input placeholder size="medium" v-model="searchtext" maxlength="50"></el-input>
          </div>
          <div class="head_btn">
            <el-button class="button-fc" type="warning" size="medium" @click="organizationSearh">查询</el-button>
          </div>
        </div>
        <el-tree
          ref="tree"
          :data="categorys"
          :props="defaultProps"
          @node-click="cateClick"
          :filter-node-method="filterNode"
          node-key="id"
        ></el-tree>
      </el-card>
      <!-- 右边的表格卡片 -->
      <el-card class="m-bottom20">
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
                :class="{ active: item.id === formInline.commodityClassifyId }"
                class="filter_style_cell"
                @click="getChildClassifyList(item.id,index)"
                :key="item.id"
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
                @click="selectClassify(item.id)"
                class="filter_style_cell"
                :class="{ active: formInline.childCommodityClassifyId === item.id }"
                :key="item.id"
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
        <el-row :gutter="10" class="queryForm">
          <el-col :span="6">
            <el-input
              class="width-100"
              v-model.trim="formInline.commodityGroup"
              @keyup.enter.native='onSearch()'
              placeholder="商品名称/商品编码"
              size="medium"
              maxlength="50"
              clearable
            ></el-input>
          </el-col>
          <el-col :span="6">
            <el-select v-model="formInline.seriesId" placeholder="系列" clearable size="medium">
              <el-option
                v-for="item in seriesList"
                :key="item.id"
                :label="item.dictName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="6">
            <el-select v-model="formInline.colourId" placeholder="颜色" clearable size="medium">
              <el-option
                v-for="item in colorsList"
                :key="item.id"
                :label="item.dictName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="6">
            <el-select v-model="formInline.materialId" placeholder="材质" clearable size="medium">
              <el-option
                v-for="item in materialList"
                :key="item.id"
                :label="item.dictName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="6">
            <el-input
              class="width-100"
              v-model.trim="formInline.commodityModel"
              placeholder="请输入货号"
              size="medium"
              maxlength="50"
              clearable
            ></el-input>
          </el-col>
          <el-col :span="6">
            <el-input
              class="width-100"
              v-model.trim="formInline.itemNumber"
              placeholder="请输入型号"
              size="medium"
              maxlength="50"
              clearable
            ></el-input>
          </el-col>
          <el-col :span="6">
            <el-button class="button-fc" type="warning" size="medium" @click="onSearch">查询</el-button>
            <el-button class="el-button--medium" type="primary" size="medium" @click="resetFun">重置</el-button>
          </el-col>
        </el-row>
        <div class="m-bottom20 m-top10">
          <el-button v-if="btnJurisdiction.costguard_Add" size="small" class="button-96" @click="addProduct" >新增</el-button>
          <el-button v-if="btnJurisdiction.costguard_Modify" size="small" class="button-96" @click="editFun">修改</el-button>
          <el-button v-if="btnJurisdiction.costguard_Submission" size="small" class="button-96" @click="submitFun" :loading="loadingbtn">提交</el-button>
          <el-button v-if="btnJurisdiction.costguard_Delete" size="small" class="button-96" @click="deleteFun">删除</el-button>
          <!-- <el-button size="small" class="button-96" @click="importFun">批量导入</el-button> -->
          <el-upload
            v-if="btnJurisdiction.costguard_Import"
            action="/api/pc/commodityPriceImport/addCostmport"
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

        <!-- 表格 -->
        <div class="table_list" v-loading="loading">
          <el-table
            border
            :row-class-name="tableRowClassName"
            :data="tableData"
            @selection-change="handleSelectionChange"
            :max-height="maxHeight"
          >
            <el-table-column type="selection" width="55" align="center" fixed="left"></el-table-column>
            <el-table-column type="index" width="55" align="center" label="序号"></el-table-column>
            <el-table-column prop="commodityCode" label="商品编码" width="150" align="center" sortable></el-table-column>
            <el-table-column
              prop="commodityName"
              label="商品名称"
              width="150"
              align="center"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column prop="brandName" label="品牌" width="120" align="center"></el-table-column>
            <el-table-column prop="categoryName" label="品类" width="120" align="center"></el-table-column>
            <el-table-column width="150" label="成本价" align="center">
              <template slot-scope="scope">
                <el-input
                  v-if="scope.row.isFlag"
                  class="width-100"
                  v-model.number="scope.row.costPrice"
                  size="mini"
                  oninput="value=value.replace(/[^\d]/g,'')"
                ></el-input>
                <!-- @input="sellInput(scope.row)" -->
                <p
                  v-else
                  class="table_action_span"
                  @click="costPriceFn(scope.row.costPriceId)"
                >{{scope.row.costPrice | formatAmount}}</p>
              </template>
            </el-table-column>
            <el-table-column width="150" label="成本价系数" align="center">
              <template slot-scope="scope">
                <el-input
                  v-if="scope.row.isFlag"
                  class="width-100"
                  v-model="scope.row.coefficient"
                  size="mini"
                  @input="coeffInput(scope.row)"
                ></el-input>
                <!-- oninput="value=value.replace(/[^\d\.?\d$]/g,'')" -->
                <p
                  v-else
                  class="table_action_span"
                  @click="coefficientFn(scope.row.costPriceId)"
                >{{scope.row.coefficient | costCoefficient}}</p>
              </template>
            </el-table-column>
            <el-table-column width="150" label="额定工期" align="center">
              <template slot-scope="scope">
                <el-input-number
                  v-if="scope.row.isFlag"
                  class="width-100"
                  :controls="false"
                  v-model="scope.row.ratedPeriod"
                  :min="0"
                  size="mini"
                ></el-input-number>
                <p v-else>{{scope.row.ratedPeriod}}</p>
              </template>
            </el-table-column>
            <el-table-column width="150" label="最短工期" align="center">
              <template slot-scope="scope">
                <el-input-number
                  v-if="scope.row.isFlag"
                  class="width-100"
                  :controls="false"
                  v-model="scope.row.minPeriod"
                  :min="0"
                  size="mini"
                ></el-input-number>
                <p v-else>{{scope.row.minPeriod}}</p>
              </template>
            </el-table-column>
            <el-table-column width="150" label="免申请天数" align="center">
              <template slot-scope="scope">
                <el-input-number
                  v-if="scope.row.isFlag"
                  class="width-100"
                  :controls="false"
                  v-model="scope.row.exemptionPeriod"
                  :min="0"
                  size="mini"
                ></el-input-number>
                <p v-else>{{scope.row.exemptionPeriod}}</p>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip width="300" label="有效期" align="center">
              <template slot-scope="scope">
                <div>
                  <el-date-picker
                    v-if="scope.row.isFlag"
                    v-model="scope.row.validDate"
                    value-format="yyyy-MM-dd"
                    format="yyyy-MM-dd"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  ></el-date-picker>
                  <p v-else>{{scope.row.validDate[0]}}-{{scope.row.validDate[1]}}</p>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="remarks" width="240" label="备注" align="center"></el-table-column>
          </el-table>
        </div>
        <!-- 分页条 -->

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
      </el-card>
    </div>

    <el-dialog
      title="商品列表"
      custom-class="customDialogTitle"
      :visible.sync="productDialog"
      width="1024px"
      class="selectCommodity"
      :append-to-body="true"
      top="20px"
    >
      <select-commodity
        @selectionChange="selectionChange"
        ref="selectedCommodities"
        :select-list="productList"
        v-if="productDialog"
      ></select-commodity>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="selectProductConfirm">确 定</el-button>
        <el-button @click="productDialog = false">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 历史成本价 -->
    <costprice ref="costprice" v-if="priceDialog" :priceDialog="priceDialog" @closeFn="closeFn"></costprice>

    <!-- 历史成本价系数 -->
    <coefficient ref="coefficient" v-if="coeffDialog" :coeffDialog="coeffDialog" @closeFn="closeFn"></coefficient>
  </div>
</template>
<script>
import spot from "@/assets/images/spot.png";
import breadcrumb from "@/views/components/breadcrumb";
import pagination from "@/views/components/pagination";
import selectCommodity from "@/views/components/selectCommodity";
import {
  listCategory, // 获取品类
  listBrand, // 获取品牌
  listClassify,
  listCommodity,
  listBaseDict, //字典查询
  listOrganization // 组织机构
} from "api/pulicJava";

import {
  listCostPrice,
  commitCostPrice,
  addCostPrice,
  deleteCostPrice
} from "api/administrationCenter/salecost/costguard/costguard";
import { getToken } from "utils/auth";
import costprice from "./components/costprice";
import coefficient from "./components/coefficient";
import { mapGetters } from 'vuex'
export default {
  components: {
    breadcrumb,
    // popPop,
    pagination,
    selectCommodity,
    costprice,
    coefficient
  },
  data() {
    return {
      loading: false,
      loadingbtn:false,
      defaultProps: {
        children: "children",
        label: "label"
      },
      navList: [], //导航标签
      spot,
      searchtext: "", // 左边的查询条件
      // 条件
      categorys: [], // 组织机构
      colorsList: [], //颜色
      materialList: [], //材质
      seriesList: [], //系列
      obj: {},
      headers: {
        Authorization: getToken()
      },

      // 按钮权限***********
      btnJurisdiction: JSON.parse(this.$loca.getItem("element")),

      // 查询条件搜索
      formInline: {
        commodityGroup: "", // 商品名称/商品编码
        seriesId: "", // 系列
        materialId: "", // 材质
        colourId: "", // 颜色
        itemNumber: "", // 货号
        brandId: "", // 品牌
        commodityModel: "", //型号
        commodityCategoryId: "", // 品类
        commodityClassifyId: "", // 一级分类
        childCommodityClassifyId: "", // 二级分类
        organizationId: "" //机构id
      },

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
      productDialog: false,
      productList: {
        selectedCommodities: [], // 选中的商品 可不传 即 已有的table中的商品
        height: "350px", // 设置表格高度 可不传（弹出层最好传下）
        isDialog: true, // 是否为弹出层（不传默认为页面）
        isShow: true
      },
      selectedProducts: [], // 选择商品
      tableData: [], //  // 表格数据
      elsectVal: [], // table表单 勾选属性

      //分页
      total: 0, // 总数
      pageSize: 10, // 单页条数
      currentPage: 1, // 当前页

      priceDialog: false, //历史成本价
      coeffDialog: false //历史成本价系数
    };
  },
  activated(){
    this.navList = this.$route.meta;
    this.getMechanism();
    // 获取品牌
    this.getBrandList();
    // 获取品类
    this.getCategoryList();
    //获取颜色
    this.getColors();
    //获取材质
    this.getMaterial();
    //获取系列
    this.getSeries();
  },
  // deactivated () {
  //     this.$destroy(true)
  // },
  // created() {
  //   this.getMechanism();
  //   // 获取品牌
  //   this.getBrandList();
  //   // 获取品类
  //   this.getCategoryList();
  //   //获取颜色
  //   this.getColors();
  //   //获取材质
  //   this.getMaterial();
  //   //获取系列
  //   this.getSeries();
  // },

  // mounted() {
  //   // 头部面包屑
  //   this.navList = this.$route.meta;
  // },
  methods: {
    sellInput(row) {
      row.costPrice = row.costPrice.replace(/[^\d.]/g, ""); //清除“数字”和“.”以外的字符  
      row.costPrice = row.costPrice.replace(/\.{4,}/g, "."); //只保留第一个. 清除多余的  
      row.costPrice = row.costPrice.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
      row.costPrice = row.costPrice.replace(/^(\-)*(\d+)\.(\d{0,2}).*$/, '$1$2.$3'); //只能输入两个小数  
      if (row.costPrice.indexOf(".") < 0 && row.costPrice != "") { //以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额 
          row.costPrice = parseFloat(row.costPrice);
      }
    },
    coeffInput(row) {
      row.coefficient = row.coefficient.replace(/[^\d.]/g, ""); //清除“数字”和“.”以外的字符  
      row.coefficient = row.coefficient.replace(/\.{4,}/g, "."); //只保留第一个. 清除多余的  
      row.coefficient = row.coefficient.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
      row.coefficient = row.coefficient.replace(/^(\-)*(\d+)\.(\d{0,3}).*$/, '$1$2.$3'); //只能输入两个小数  
      if (row.coefficient.indexOf(".") < 0 && row.coefficient != "") { //以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额 
          row.coefficient = parseFloat(row.coefficient);
      }
    },
    //点击列表成本价
    costPriceFn(costPriceId) {
      this.priceDialog = true;
      this.$nextTick(() => {
        this.$refs.costprice.getData(costPriceId);
      });
    },
    coefficientFn(costPriceId) {
      this.coeffDialog = true;
      this.$nextTick(() => {
        this.$refs.coefficient.getData(costPriceId);
      });
    },
    //关闭
    closeFn() {
      this.priceDialog = false;
      this.coeffDialog = false;
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

    //获取机构
    getMechanism() {
      // 获取组织机构
      listOrganization({}).then(res => {
        this.categorys = res.data;
        this.formInline.organizationId = res.data[0].id;

        this.getCostPrice();
      });
    },
    //获取成本价格列表
    getCostPrice() {
      //结构赋值***********
      let {
        commodityGroup, // 商品名称/商品编码
        seriesId, // 系列
        materialId, // 材质
        colourId, // 颜色
        itemNumber, // 货号
        brandId, // 品牌
        commodityCategoryId, // 品类
        commodityClassifyId, // 一级分类
        childCommodityClassifyId, // 二级分类
        organizationId //机构ID
      } = this.formInline;

      let data = {
        page: this.currentPage,
        limit: this.pageSize,
        commodityclassifyId1: commodityClassifyId,
        commodityclassifyId2: childCommodityClassifyId,
        commodityGroup,
        seriesId,
        materialId,
        colourId,
        itemNumber,
        brandId,
        commodityCategoryId,
        organizationId
      };

      listCostPrice(data)
        .then(res => {
          if (res.status == 200) {
            this.tableData = res.data.rows.map(item => {
              let arr = [];
              if (item.startTime && item.endTime) {
                arr = [item.startTime, item.endTime];
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
          console.error("获取成本价格列表", error);
        });
    },
    // 选择商品 复选框
    selectionChange(val) {
      this.selectedProducts = val;
    },
    //导入之前
    beforeUploat(file) {
      console.log(file);
      this.obj.organizationId = this.formInline.organizationId;
      this.loading = true;
    },
    //导入成功
    uploadSuccess(file) {
      console.log(file.status);
      if (file.status == 300) {
        this.$router.push({
          path: "Importpage",
          query: {
            organizationId: this.formInline.organizationId
          }
        });
      }
      if (file.status == 200) {
        this.getCostPrice();
        this.$message.success('导入成功!')
      }
    },
    // 点击添加商品
    addProduct() {
      if (this.elsectVal.length > 0) {
        this.$message({
          message: "请勿选择商品",
          type: "warning"
        });
        return;
      }
      this.productDialog = true;
      this.productList.selectedCommodities = this.commodityIds;
    },
    // 选择商品
    selectProductConfirm() {
      if (this.selectedProducts.length) {
        let arr = [];
        this.selectedProducts.forEach(item => {
          arr.push({
            commodityId: item.commodityId,
            organizationId: this.formInline.organizationId
          });
        });
        addCostPrice(arr)
          .then(res => {
            if (res.status == 200) {
              this.productDialog = false;
              this.$message.success("新增成功!");
              this.getCostPrice();
            }
          })
          .catch(error => {
            console.error("新增价格成本", error);
          });
      } else {
        this.$message.warning("请选择商品");
      }
    },
    // 获取全部品牌列表
    getBrandList() {
      listBrand()
        .then(res => {
          if (res.status == 200) {
            this.selectList.brandList = res.data;
          }
        })
        .catch(error => {
          console.log(
            "成本销售价格 成本价格维护 获取全部品牌列表 views/salecost/costguard/index",
            error
          );
        });
    },

    // 获取全部品类列表
    getCategoryList() {
      listCategory()
        .then(res => {
          if (res.status == 200) {
            this.selectList.categoryList = res.data;
          }
        })
        .catch(error => {
          console.log(
            "成本销售价格 成本价格维护 获取全部品类列表 views/salecost/costguard/index",
            error
          );
        });
    },

    // 选中品牌 and 品类
    selectType(value, type) {
      this.formInline[type] = value;
      this.getCostPrice();
      if (type == "commodityCategoryId") {
        // 如果是点击品类 即 获取二级分类
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
              console.log(
                "成本销售价格 成本价格维护 选中品牌 and 品类 views/salecost/costguard/index",
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
      this.getCostPrice();
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
      this.getCostPrice();
    },

    // 左边的查询按钮
    organizationSearh() {
      this.$refs.tree.filter(this.searchtext);
    },
    //树过滤
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 点击组织机构
    cateClick(val, idx) {
      console.log(val);

      this.$refs.tree.filter("");
      this.formInline.organizationId = val.id;
      this.getCostPrice();
    },

    // 修改
    editFun() {
      this.tableData.forEach(item => {
        this.elsectVal.forEach(attr => {
          if (attr.costPriceId == item.costPriceId) {
            const validateNumber = n =>
            !isNaN(parseFloat(n)) && isFinite(n) && Number(n) === n;

            if (!validateNumber(+item.coefficient)) {
              return item.coefficient;
            }
            item.coefficient= (+item.coefficient)
            .toFixed(3)
            .replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, "$&,");
            item.isFlag = true;

          }
        });
      });
    },
    //删除
    deleteFun() {
      this.$confirm("是否删除本条信息?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let arr = [];
          this.elsectVal.forEach(item => {
            arr.push(item.costPriceId);
          });
          let data = {
            costPriceIds: arr,
            organizationId: this.formInline.organizationId
          };
          deleteCostPrice(data)
            .then(res => {
              console.log(res);
              if (res.status == 200) {
                this.$message.success("删除成功!");
                this.getCostPrice();
              }
            })
            .catch(error => {
              console.error("删除成本价", error);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作"
          });
        });
    },
    // 提交
    submitFun() {
      if (this.elsectVal.length < 1) {
        this.$message.warning("您未勾选!");
      } else {
        let arr = [];
        this.elsectVal.forEach(item => {
          arr.push({
            costPriceId: item.costPriceId,
            coefficient: item.coefficient,
            costPrice: item.costPrice,
            exemptionPeriod: item.exemptionPeriod,
            minPeriod: item.minPeriod,
            ratedPeriod: item.ratedPeriod,
            startTime: item.validDate ? item.validDate[0] : null,
            endTime: item.validDate ? item.validDate[1] : null
          });
        });

        this.tableData.forEach(item => {
          this.elsectVal.forEach(attr => {
            if (attr.costPriceId == item.costPriceId) {
              item.isFlag = false;
            }
          });
        });
        this.loadingbtn = true;
        commitCostPrice(arr)
          .then(res => {
            if (res.status == 200) {
              this.$message.success("提交成功");
              this.loadingbtn = false;
              this.getCostPrice();
            }else{
              this.loadingbtn = false;
            }
          })
          .catch(error => {
            this.loadingbtn = false;
            console.error("成本价提交", error);
          });
      }
    },
    //勾选函数回调
    handleSelectionChange(val) {
      this.elsectVal = val;
    },

    // 表格行样式
    tableRowClassName({ row, rowIndex }) {
      //表格斑马线设置
      return rowIndex % 2 != 0 ? "el-f0" : "";
    },
    // 查询
    onSearch() {
      this.currentPage = 1;
      this.getCostPrice();
    },

    // 重置
    resetFun() {
      this.formInline = {
        ...this.formInline,
        commodityGroup: "", // 商品名称/商品编码
        seriesId: "", // 系列
        materialId: "", // 材质
        colourId: "", // 颜色
        itemNumber: "", // 货号
        brandId: "", // 品牌
        commodityModel: "", //型号
        commodityCategoryId: "", // 品类
        commodityClassifyId: "", // 一级分类
        childCommodityClassifyId: "" // 二级分类
      };
    },

    // 改变条数方法
    sizeChange(val) {
      this.currentPage = 1;
      this.pageSize = val;
      this.getCostPrice();
    },
    // 翻页方法
    currentChange(val) {
      this.currentPage = val;
      this.getCostPrice();
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
    },
    costCoefficient(amount) {
      const validateNumber = n =>
        !isNaN(parseFloat(n)) && isFinite(n) && Number(n) === n;

      if (!validateNumber(+amount)) {
        return amount;
      }
      return (+amount)
        .toFixed(3)
        .replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, "$&,");
    }
  },
  computed: {
    commodityIds() {
      let arr = [];
      this.tableData.forEach(item => {
        arr.push(item.commodityId);
      });
      return arr;
    },
    ...mapGetters(['maxHeight'])
  }
};
</script>
<style scoped lang="scss">
.cost_box {
  .cost_content {
    display: flex;
    flex-wrap: nowrap;
    align-items: flex-start;
    justify-content: space-between;
    > div {
      &:nth-of-type(1) {
        min-width: 300px;
        margin-right: 16px;
        height: calc(100vh - 145px);
        overflow-y: auto;
        min-height: 600px;
        .el-card__body {
          padding: 0;
        }
        .warp_list {
          padding: 12px 4px;
          display: flex;
          flex-wrap: nowrap;
          align-items: flex-start;
          justify-content: space-between;
          .head_search {
            flex: 1;
          }
          .head_btn {
            margin-left: 6px;
          }
        }
      }
      &:nth-of-type(n + 2) {
        flex: 1;
      }

      .warp_head_list {
        width: 100%;
        .list_top {
          width: 100%;
          display: flex;
          flex-wrap: wrap;
          // justify-content: center;
          align-items: center;
          .search_item {
            margin: 10px 0px;
            padding: 0px 5px;
            width: 25%;
            display: flex;
            flex-wrap: nowrap;
            > div {
              width: 100%;
            }
          }
        }
      }
      .cost-btn-list {
        display: flex;
        flex-wrap: nowrap;
      }
    }
  }
  .listTitle {
    height: 40px;
    line-height: 40px;
    color: #666;
    cursor: pointer;
    border-bottom: 1px solid #ebeef5;
    font-size: 14px;
    font-weight: 500;
    outline: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0px 15px;
  }
  .listTitleBg {
    background: #409eff;
    color: #fff;
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
        text-overflow: ellipsis;
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


<style lang="scss">
.cost_box {
  .cost_content {
    > div {
      &:nth-of-type(1) {
        .el-card__body {
          padding: 0;
        }
      }
    }
  }
}
</style>





