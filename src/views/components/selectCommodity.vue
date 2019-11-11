<template>
  <div class="selectCommodity">
    <div class="queryForm">
      <el-row :gutter="6" ref="queryForm">
        <el-col :span="3">
          <el-select v-model="queryForm.commodityClassifyId" clearable placeholder="一级分类" :size="size" filterable @change="getChildClassifyList">
            <el-option v-for="item in classifyList" :key="item.id" :value="item.id" :label="item.classifyName"></el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-select v-model="queryForm.childCommodityClassifyId" clearable placeholder="二级分类" :size="size" filterable multiple @change="searchSubmit" collapse-tags>
            <el-option v-for="item in childClassifyList" :key="item.id" :value="item.id" :label="item.classifyName"></el-option>
          </el-select>
        </el-col>
        <el-col :span="3" v-if="isUnfinished || isAll">
          <el-select v-model="queryForm.seriesId" clearable placeholder="系列" :size="size" filterable @change="searchSubmit">
            <el-option v-for="item in seriesList" :key="item.seriesId" :value="item.seriesId" :label="item.seriesName"></el-option>
          </el-select>
        </el-col>
        <el-col :span="5">
          <el-input v-model.trim="queryForm.names" clearable :placeholder="placeholder" :size="size" @keyup.enter.native="searchSubmit"></el-input>
        </el-col>
        <el-col :span="2" v-if="isUnfinished">
          <el-input v-model.trim="queryForm.thick" placeholder="厚度" :size="size" @keyup.enter.native="searchSubmit" @blur="checkNumber('thick')" clearable></el-input>
        </el-col>
        <el-col :span="5">
          <el-select v-model="queryForm.companyIds" clearable placeholder="供应商" :size="size" filterable collapse-tags default-first-option>
            <el-option v-for="item in companyList" :key="item.companyId" :value="item.companyId" :label="item.companyName"></el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-select v-model="queryForm.colourId" clearable placeholder="颜色" :size="size" filterable @focus="colorFocus" default-first-option @change="searchSubmit">
            <el-option v-for="item in colorList" :key="item.colourId" :value="item.colourId" :label="item.colourName"></el-option>
          </el-select>
        </el-col>
<!--        <el-col :span="4" v-if="isUnfinished || isAll">-->
<!--          <el-select v-model="queryForm.materialId" clearable placeholder="材质" :size="size" filterable>-->
<!--            <el-option v-for="item in materialList" :key="item.materialId" :value="item.materialId" :label="item.materialName"></el-option>-->
<!--          </el-select>-->
<!--        </el-col>-->
        <el-col :span="6">
          <div class="fl colItem" style="padding-right: 3px;">
            <el-input v-model.trim="queryForm.minPrice" placeholder="最小价格" :size="size" @keyup.enter.native="searchSubmit" @blur="checkNumber('minPrice')" clearable></el-input>
          </div>
          <div class="fl colItem" style="padding-left: 3px;">
            <el-input v-model.trim="queryForm.maxPrice" placeholder="最大价格" :size="size" @keyup.enter.native="searchSubmit" @blur="checkNumber('maxPrice')" clearable></el-input>
          </div>
        </el-col>
        <el-col :span="3">
          <el-select v-model="queryForm.brandId" clearable placeholder="品牌" :size="size" :disabled='selectList.disabled' filterable @change="brandChange">
            <el-option v-for="item in brandList" :key="item.brandId" :value="item.brandId" :label="item.brandName"></el-option>
          </el-select>
        </el-col>
        <el-col :span="3">
          <el-select v-model="queryForm.commodityCategoryId" clearable placeholder="品类" @change="getClassifyList" :size="size" :disabled='selectList.disabled' filterable>
            <el-option v-for="item in categoryList" :key="item.commodityCategoryId" :value="item.commodityCategoryId" :label="item.categoryName"></el-option>
          </el-select>
        </el-col>
        <el-col :span="5">
          <el-button class="button-fc" type="warning" @click="searchSubmit" :size="size">查询</el-button>
          <el-button type="primary" @click="resetSubmit" :size="size">重置</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="table_list selectCommodity" v-loading="loading">
      <!-- <el-table border :data="tableData" ref="tables" @selection-change="handleSelectionChange" :row-key="getRowKeys" height="350" highlight-current-row @current-change="handleCurrentChange" :row-class-name="tableRowClassName"> -->
      <el-table border :data="tableData" ref="tables" @selection-change="handleSelectionChange" :row-key="getRowKeys" height="350"  @row-dblclick="handleCurrentChange">
        <el-table-column :align="columnAlign" fixed="left" type="selection" width="40" :reserve-selection="true" :selectable="selectable"></el-table-column>
        <el-table-column prop="commodityName" label="商品名称" :align="columnAlign" width="220" sortable show-overflow-tooltip></el-table-column>
        <el-table-column prop="commodityModel" label="型号" v-if="isUnfinished || isAll" :align="columnAlign" width="140" sortable show-overflow-tooltip></el-table-column>
        <el-table-column prop="colourName" label="颜色" :align="columnAlign" width="250" sortable show-overflow-tooltip></el-table-column>
        <el-table-column prop="commodityNumber" label="货号" v-if="isFinished || isAll" :align="columnAlign" width="150" sortable show-overflow-tooltip></el-table-column>
        <el-table-column prop="commodityModel" label="规格" v-if="isFinished" :align="columnAlign" width="200" sortable show-overflow-tooltip></el-table-column>
        <el-table-column prop="commodityPrice" v-if="!selectList.isShow" label="销售价" width="100" :align="columnAlign" show-overflow-tooltip></el-table-column>
        <el-table-column prop="ratedPeriod" v-if="!selectList.isShow" label="额定工期" width="80" :align="columnAlign" show-overflow-tooltip></el-table-column>
        <el-table-column prop="commodityThick" v-if="isUnfinished" label="厚" :align="columnAlign" width="80" sortable show-overflow-tooltip></el-table-column>
        <el-table-column prop="seriesName" label="系列" v-if="isUnfinished || isAll" :align="columnAlign" width="100" sortable show-overflow-tooltip></el-table-column>
        <el-table-column prop="materialName" label="材质" v-if="isUnfinished || isAll" :align="columnAlign" width="150" sortable show-overflow-tooltip></el-table-column>
        <el-table-column prop="classifyName" label="分类" :align="columnAlign" width="150" sortable show-overflow-tooltip></el-table-column>
        <el-table-column prop="valuationMethod" label="计价方式" :align="columnAlign" width="120" sortable show-overflow-tooltip></el-table-column>
        <el-table-column prop="commodityDescribe" label="备注" width="200" :align="columnAlign" sortable show-overflow-tooltip></el-table-column>
        <el-table-column prop="commodityWide" label="宽" :align="columnAlign" width="100" sortable show-overflow-tooltip></el-table-column>
        <el-table-column prop="commodityHigh" label="高" :align="columnAlign" width="100" sortable show-overflow-tooltip></el-table-column>
        <el-table-column prop="commodityLong" label="深" :align="columnAlign" width="100" sortable show-overflow-tooltip></el-table-column>
        <el-table-column prop="commodityUnit" label="单位" :align="columnAlign" width="100" sortable show-overflow-tooltip></el-table-column>
        <el-table-column prop="companyName" label="供应商" :align="columnAlign" width="200" sortable show-overflow-tooltip></el-table-column>
        <el-table-column prop="commodityCode" label="商品编码" :align="columnAlign" width="150" sortable show-overflow-tooltip></el-table-column>
        <!--          <el-table-column prop="status" label="状态" :align="columnAlign" width="100" sortable show-overflow-tooltip>-->
        <!--            <template slot-scope="scope">-->
        <!--              <span v-if='scope.row.status==0'>在产</span>-->
        <!--              <span v-else-if='scope.row.status==1'>预计停产</span>-->
        <!--              <span v-else>停产</span>-->
        <!--            </template>-->
        <!--          </el-table-column>-->
      </el-table>
      <div class="pagination_wrap">
        <pagination
          :current-page="currentPage"
          :pageSize="pageSize"
          :total="total"
          @sizeChange="sizeChange"
          @currentChange="currentChange">
        </pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import pagination from '@/views/components/pagination';
  import {
    listCategory,
    listBrand,
    listClassify,
    listCommodity,
    listCompanyByParam,
    listCommodityColourByParam,
    listCommoditySeriesByParam,
    listCommodityMaterialByParam
  } from 'api/pulicJava';
  export default {
    name: 'selectCommodity',
    components: {
      pagination
    },
    props: {
      selectList: {
        type: Object,
        default() {
          return {
            // selectedCommodities: [],
            // priceStrategyId: '',
            // brandList: [],
            // categoryList: [],
            // isDialog: false,
            // disabled: false,
            // brandId: 0,
            // commodityCategoryId: 0,
            // companyId: '', // 供应商
            // storeId: 0,
            // goodsType: '' // 货品类型： 1成品 2定制品
          }
        }
      }
    },
    created() {
      if (this.isFinished) {
        this.placeholder = this.placeholder + '货号 规格';
        // this.span = 4;
      } else if (this.isUnfinished) {
        this.placeholder = this.placeholder + '型号';
        this.span = 3;
      } else {
        this.placeholder = this.placeholder + '型号 货号 规格';
        // this.span = 3;
      }
      if (this.selectList.brandList && this.selectList.brandList.length) {
        this.queryForm.brandId = this.selectList.brandList[0].brandId;
      } else {
        this.getBrandList();
      }
      if (this.selectList.categoryList && this.selectList.categoryList.length) {
        this.queryForm.commodityCategoryId = this.selectList.categoryList[0].commodityCategoryId;
        this.getClassifyList(this.selectList.categoryList[0].commodityCategoryId);
      } else {
        this.getCategoryList();
      }
      if (this.selectList.brandId != 0 && this.selectList.brandId != undefined) {
        this.queryForm.brandId = String(this.selectList.brandId);
      }
      if (this.selectList.commodityCategoryId != 0 && this.selectList.commodityCategoryId != undefined) {
        this.queryForm.commodityCategoryId = String(this.selectList.commodityCategoryId);
        this.getClassifyList(this.queryForm.commodityCategoryId);
      }
      if (this.selectList.companyId != 0 && this.selectList.companyId != undefined) {
        this.queryForm.companyIds = this.selectList.companyId;
        // this.queryForm.companyId = Number(this.selectList.companyId);
      }
      // if (this.$loca.getItem('queryForm') != 0 && this.$loca.getItem('queryForm')) {
      //   console.log(JSON.parse(this.$loca.getItem('queryForm')));
      //   this.queryForm = JSON.parse(this.$loca.getItem('queryForm'));
      // }
      this.getQueryParams();
      this.getData();
    },
    data() {
      return {
        currentRow: null,
        multipleSelection: [],
        loading: false,
        span: 4,
        tableData: [],
        size: 'small',
        currentPage: 1,
        pageSize: 20,
        total: 0,
        columnAlign: 'center',
        foldStatus1: 1, // 1展开 0 收起
        foldStatus2: 1, // 1展开 0 收起
        foldStatus3: 1, // 1展开 0 收起
        colorList: [],
        seriesList: [],
        materialList: [],
        companyList: [],
        classifyList: [],
        childClassifyList: [],
        childCommodityClassifyId: [],
        commodityClassifyId: '',
        queryForm: {
          names: '',
          colourId: '',
          seriesId: '',
          materialId: '',
          brandId: '',
          commodityCategoryId: '',
          companyIds: '',
          commodityClassifyId: '',
          childCommodityClassifyId: [],
          priceStrategyId: '',
          minPrice: '',
          maxPrice: '',
          thick: ''
        },
        selectedCommodities: this.selectList.selectedCommodities,
        brandList: this.selectList.brandList,
        categoryList: this.selectList.categoryList,
        goodsType: this.selectList.goodsType || '',
        placeholder: '商品名称 商品编码 '
      }
    },
    methods: {
      handleCurrentChange(val) {
        this.currentRow = val;
        if (val) {
          let arr = [];
          arr.push(val);
          if (!this.multipleSelection.length) {
            this.$emit('selectionChange', arr, true);
          }
        } else {
          this.$emit('selectionChange', [], true);
        }
      },
      resetForm(formName) {
        if (this.$refs[formName] !== undefined) {
          this.$refs[formName].resetFields();
        }
      },
      currentChange(val) {
        this.currentPage = val;
        this.getData();
      },
      sizeChange(val) {
        this.currentPage = 1;
        this.pageSize = val;
        this.getData();
      },
      tableRowClassName({row, rowIndex}) {
        return rowIndex % 2 != 0 ? 'el-f0' : '';
      },
      getRowKeys(row) {
        return row.commodityId + new Date().getTime();
      },
      handleFold(type) {
        this['foldStatus' + type] = this['foldStatus' + type] == 1 ? 0 : 1;
      },
      // 选择表格项
      handleSelectionChange(val) {
        this.multipleSelection = val;
        if (val.length) {
          this.$emit('selectionChange', val, false);
        } else {
          let arr = [];
          if (this.currentRow && this.currentRow.commodityId) {
            arr.push(this.currentRow);
            this.$emit('selectionChange', arr, false);
          }
        }
      },
      colorFocus() {
        this.getColorList();
      },
      // 获取颜色列表
      getColorList() {
        this.queryForm.colourId = '';
        this.colorList = [];
        const params = {
          ...this.queryForm,
          minThick: this.queryForm.thick,
          maxThick: this.queryForm.thick,
          page: this.currentPage,
          limit: this.pageSize,
          priceStrategyId: this.selectList.priceStrategyId,
          storeId: this.selectList.storeId
        };
        if (params.childCommodityClassifyId.length) {
          params.commodityClassifyId = params.childCommodityClassifyId.join(',');
          delete params.childCommodityClassifyId;
        }
        // params.companyIds = params.companyIds.join(',');
        listCommodityColourByParam(params)
          .then(response => {
            this.colorList = response.data;
          })
      },
      // 获取系列列表
      getSeriesList(params) {
        listCommoditySeriesByParam(params)
          .then(response => {
            this.seriesList = response.data;
          })
      },
      // 获取材质列表
      getMaterialList(params) {
        listCommodityMaterialByParam(params)
          .then(response => {
            this.materialList = response.data;
          })
      },
      // 供应商
      getCompanyList(params) {
        let paramsNew = {
          companyType: 1,
          brandId: params.brandId,
          commodityCategoryId: params.commodityCategoryId
        };
        listCompanyByParam(paramsNew)
          .then(response => {
            this.companyList = response.data;
          })
          .catch(error => {
            console.log('view/components/selectCommodity.vue:getCompanyList', error);
          })
      },
      // 获取商品列表
      getData() {
        this.loading = true;
        const params = {
          ...this.queryForm,
          page: this.currentPage,
          limit: this.pageSize,
          minThick: this.queryForm.thick,
          maxThick: this.queryForm.thick,
          priceStrategyId: this.selectList.priceStrategyId,
          storeId: this.selectList.storeId
        };
        if (params.childCommodityClassifyId.length) {
          params.commodityClassifyId = params.childCommodityClassifyId.join(',');
          delete params.childCommodityClassifyId;
        }
        // params.companyIds = params.companyIds.join(',');
        listCommodity(params)
          .then(response => {
            this.loading = false;
            this.tableData = response.data.rows;
            this.total = response.data.total;
          })
          .catch(error => {
            this.loading = false;
            console.log('选择商品组件:listCommodity', error);
          })
      },
      // 商品整行选择
      rowClick(row){
         this.$refs.tables.toggleRowSelection(row);
      },
      // 点击查询
      searchSubmit() {
        this.currentPage = 1;
        this.getData();
        // this.saveParams();
      },
      // 点击重置
      resetSubmit() {
        this.queryForm.names = '';
        this.queryForm.companyIds = '';
        this.queryForm.colourId = '';
        this.queryForm.seriesId = '';
        this.queryForm.materialId = '';
        this.queryForm.minPrice = '';
        this.queryForm.maxPrice = '';
        this.queryForm.thick = '';
        this.childClassifyList = [];
        this.queryForm.commodityClassifyId = '';
        this.queryForm.childCommodityClassifyId = [];
        this.getData();
        // this.saveParams();
      },
      // 选中供应商
      selectCompany(companyId) {
        if (this.selectList.companydisabled) {
          return;
        }
        this.queryForm.companyId = companyId;
        this.getData();
      },
      // 获取全部品牌列表
      getBrandList() {
        listBrand()
          .then(response => {
            this.brandList = response.data;
          }).catch(error => {
          console.log('选择商品组件:getBrandList', error);
        })
      },
      // 获取全部品类列表
      getCategoryList() {
        listCategory()
          .then(response => {
            this.categoryList = response.data;
          })
          .catch(error => {
            console.log('选择商品组件:getCategoryList', error);
          })
      },
      // 获取一级分类
      getClassifyList(val) {
        this.classifyList = [];
        this.childClassifyList = [];
        this.queryForm.commodityClassifyId = '';
        this.queryForm.childCommodityClassifyId = [];
        if (val) {
          const params = {
            commodityCategoryId: val
          };
          listClassify(params)
            .then(response => {
              this.classifyList = response.data;
            })
            .catch(error => {
              console.log('选择商品组件:getClassifyList', error);
            })
        }
        this.queryForm.colourId = '';
        this.queryForm.seriesId = '';
        this.queryForm.materialId = '';
        this.queryForm.companyIds = '';
        this.getQueryParams();
      },
      // 获取二级分类
      getChildClassifyList(val) {
        this.queryForm.childCommodityClassifyId = [];
        this.childClassifyList = [];
        if (val) {
          let targetEle = this.classifyList.filter(item => {
            return item.id == val;
          })[0];
          if (targetEle.children && targetEle.children.length) {
            this.childClassifyList = targetEle.children;
          } else {
            this.childClassifyList = [];
          }
        }
        this.searchSubmit();
      },
      // 点击二级分类
      selectClassify(commodityClassifyId) {
        if (commodityClassifyId) {
          this.queryForm.commodityClassifyId = commodityClassifyId;
        } else {
          this.queryForm.commodityClassifyId = this.commodityClassifyId;
        }
        this.childCommodityClassifyId = commodityClassifyId;
        this.getData();
      },
      // 是否可选
      selectable(row, index) {
        if (this.selectedCommodities.some(item => item == row.commodityId)) {
          return false;
        } else {
          return true;
        }
      },
      brandChange() {
        this.queryForm.colourId = '';
        this.queryForm.seriesId = '';
        this.queryForm.materialId = '';
        this.queryForm.companyIds = '';
        this.getQueryParams();
        this.searchSubmit();
      },
      getQueryParams() {
        let params = {
          brandId: this.queryForm.brandId,
          commodityCategoryId: this.queryForm.commodityCategoryId
        };
        let params2 = {
          ...this.queryForm,
          priceStrategyId: this.selectList.priceStrategyId,
          storeId: this.selectList.storeId
        };
        this.getColorList();
        this.getSeriesList(params);
        this.getMaterialList(params);
        this.getCompanyList(params);
      },
      checkNumber(valType) {
        if (this.queryForm[valType] != '') {
          if (!Number(this.queryForm[valType])) {
            this.$message.error('请输入数字');
            this.queryForm[valType] = '';
          }
        }
      },
      // 存储查询条件
      saveParams() {
        this.$loca.setItem('queryForm', JSON.stringify(this.queryForm));
      }
    },
    computed: {
      // 是否是成品
      isFinished() {
        return this.selectList.goodsType == 1;
      },
      // 是否是定制品
      isUnfinished() {
        return this.selectList.goodsType == 2;
      },
      isAll() {
        return !this.selectList.goodsType;
      }
    }
  }
</script>

<style scoped>
  .colItem{
    width: 50%;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }
</style>
