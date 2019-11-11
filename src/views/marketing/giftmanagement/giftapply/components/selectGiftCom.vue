<template>
    <div class="selectCommodity">
      <div class="queryForm">
        <el-row :gutter="10" ref="queryForm">
          <el-col :span="span">
            <el-input v-model.trim="queryForm.names" clearable placeholder="商品名称 / 商品编码" :size="size"></el-input>
          </el-col>
          <el-col :span="span">
            <el-select v-model="queryForm.colourId" clearable placeholder="颜色" :size="size">
              <el-option v-for="item in colorList" :key="item.id" :value="item.id" :label="item.dictName"></el-option>
            </el-select>
          </el-col>
          <el-col :span="span">
            <el-select v-model="queryForm.materialId" clearable placeholder="材质" :size="size">
              <el-option v-for="item in materialList" :key="item.id" :value="item.id" :label="item.dictName"></el-option>
            </el-select>
          </el-col>
          <el-col :span="span">
            <el-select v-model="queryForm.seriesId" clearable placeholder="系列" :size="size">
              <el-option v-for="item in seriesList" :key="item.id" :value="item.id" :label="item.dictName"></el-option>
            </el-select>
          </el-col>
          <el-col :span="span">
            <el-select v-model="queryForm.brandId" clearable placeholder="品牌" :size="size">
              <el-option v-for="item in selectList.brandList" :key="item.brandId" :value="item.brandId" :label="item.brandName"></el-option>
            </el-select>
          </el-col>
          <!-- <el-col :span="span">
            <el-select v-model="queryForm.commodityCategoryId" clearable placeholder="品类" @change="getClassifyList" :size="size">
              <el-option v-for="item in selectList.categoryList" :key="item.commodityCategoryId" :value="item.commodityCategoryId" :label="item.categoryName"></el-option>
            </el-select>
          </el-col> -->
          <el-col :span="span">
            <el-button class="button-fc" type="warning" @click="searchSubmit" :size="size">查询</el-button>
            <el-button @click="resetSubmit" :size="size" plain>重置</el-button>
          </el-col>
        </el-row>
        <div class="searchModules">
          <div class="searchModule" :class="{ unfold : foldStatus1 === 0 }">
            <div class="searchModuleTitle"> 供应商 </div>
            <div class="searchModuleContent">
              <span class="filter_style_cell" :class="{ active: queryForm.companyId === '' }" @click="selectCompany('')">全部</span>
              <span v-for="item in companyList" class="filter_style_cell" :class="{ active: item.companyId == queryForm.companyId }" @click="selectCompany(item.companyId)">{{ item.companyName }}</span>
            </div>
            <div class="searchModuleBtn">
              <el-button type="text" :size="size" :icon="foldStatus1 == 1 ? 'el-icon-arrow-down' : 'el-icon-arrow-up'" @click="handleFold(1)">{{ foldStatus1 == 1 ? '展开' : '收起' }}</el-button>
            </div>
          </div>
          <div class="searchModule" :class="{ unfold : foldStatus2 === 0 }" v-show="classifyList && classifyList.length">
            <div class="searchModuleTitle">一级分类</div>
            <div class="searchModuleContent">
              <span class="filter_style_cell" :class="{ active: queryForm.commodityClassifyId === '' }" @click="getChildClassifyList('')">全部</span>
              <span v-for="item,index in classifyList" :class="{ active: commodityClassifyId === item.id }" class="filter_style_cell" @click="getChildClassifyList(item.id,index)" :key="item.id">{{ item.classifyName }}</span>
            </div>
            <div class="searchModuleBtn" v-show="classifyList && classifyList.length > 3">
              <el-button type="text" :size="size" :icon="foldStatus2 == 1 ? 'el-icon-arrow-down' : 'el-icon-arrow-up'" @click="handleFold(2)">{{ foldStatus2 == 1 ? '展开' : '收起' }}</el-button>
            </div>
          </div>
          <div class="searchModule" :class="{ unfold : foldStatus3 === 0 }" v-show="childClassifyList && childClassifyList.length">
            <div class="searchModuleTitle">二级分类</div>
            <div class="searchModuleContent">
              <span class="filter_style_cell" :class="{ active: childCommodityClassifyId === '' }" @click="selectClassify('')">全部</span>
              <span v-for="childClassify in childClassifyList" @click="selectClassify(childClassify.id)" class="filter_style_cell" :class="{ active: childCommodityClassifyId === childClassify.id }" :key="childClassify.id">{{ childClassify.classifyName }}</span>
            </div>
            <div class="searchModuleBtn" v-show="childClassifyList && childClassifyList.length > 3">
              <el-button type="text" :size="size" :icon="foldStatus3 == 1 ? 'el-icon-arrow-down' : 'el-icon-arrow-up'" @click="handleFold(3)">{{ foldStatus3 == 1 ? '展开' : '收起' }}</el-button>
            </div>
          </div>
        </div>
      </div>
      <div class="table_list common-table">
        <el-table border :data="tableData" @selection-change="handleSelectionChange" :row-key="getRowKeys" :height="selectList.height">
          <el-table-column fixed type="selection" width="40" :reserve-selection="true" :selectable="selectable"></el-table-column>
          <el-table-column prop="commodityCode" label="商品编码" :width="columnWidth" :align="columnAlign" sortable show-overflow-tooltip></el-table-column>
          <el-table-column prop="commodityName" label="商品名称" :width="columnWidth" :align="columnAlign" sortable show-overflow-tooltip></el-table-column>
          <el-table-column prop="commodityModel" label="型号" :width="columnWidth" :align="columnAlign" sortable show-overflow-tooltip></el-table-column>
          <el-table-column prop="commodityPrice" label="单价" :width="columnWidth" :align="columnAlign" sortable show-overflow-tooltip></el-table-column>
          <el-table-column prop="valuationMethod" label="计价方式" :width="columnWidth" :align="columnAlign" sortable show-overflow-tooltip></el-table-column>
          <el-table-column prop="classifyName" label="分类" :width="columnWidth" :align="columnAlign" sortable show-overflow-tooltip></el-table-column>
          <el-table-column prop="constructionPeriod" label="工期" :width="columnWidth" :align="columnAlign" sortable show-overflow-tooltip></el-table-column>
          <el-table-column prop="commodityUnit" label="单位" :width="columnWidth" :align="columnAlign" sortable show-overflow-tooltip></el-table-column>
          <el-table-column prop="commodityWide" label="宽" :width="columnWidth" :align="columnAlign" sortable show-overflow-tooltip></el-table-column>
          <el-table-column prop="commodityHigh" label="高" :width="columnWidth" :align="columnAlign" sortable show-overflow-tooltip></el-table-column>
          <el-table-column prop="commodityLong" label="深" :width="columnWidth" :align="columnAlign" sortable show-overflow-tooltip></el-table-column>
          <el-table-column prop="commodityThick" label="厚" :width="columnWidth" :align="columnAlign" sortable show-overflow-tooltip></el-table-column>
          <el-table-column prop="status" label="状态" :width="columnWidth" :align="columnAlign" sortable show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if='scope.row.status==0'>在产</span>
              <span v-else-if='scope.row.status==1'>预计停产</span>
              <span v-else>停产</span>
            </template>
          </el-table-column>
          <el-table-column prop="commodityDescribe" label="备注" :width="columnWidth" :align="columnAlign" sortable show-overflow-tooltip></el-table-column>
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
  import pagination from '@/views/components/pagination'
  import { listCategory, listBrand, listClassify, listCommodity, listBaseDict, listCompanyByAll } from 'api/pulicJava'
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
              selectedCommodities: [],
              priceStrategyId: '',
              brandList: [],
              categoryList: [],
              isDialog: false
            }
          }
        },
        height: {
          default() {
            return ''
          }
        }
      },
      created() {
        this.getBaseDict('COMMODITY_COLOR');
        this.getBaseDict('COMMODITY_SERIES');
        this.getBaseDict('COMMODITY_MATERIAL');
        this.getCompanyList();
        this.getData();
      },
      mounted() {
        if (!(this.selectList.brandList && this.selectList.brandList.length)) {
          this.getBrandList();
        }
        if (!(this.selectList.categoryList && this.selectList.categoryList.length)) {
          this.getCategoryList();
        }
      },
      data() {
        return {
          span: 6,
          tableData: [],
          size: 'medium',
          currentPage: 1,
          pageSize: 20,
          total: 10,
          columnWidth: 200,
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
          childCommodityClassifyId: '',
          commodityClassifyId: '',
          queryForm: {
            names: '',
            colourId: '',
            seriesId: '',
            materialId: '',
            brandId: '',
            commodityCategoryId: 999999,
            companyId: '',
            commodityClassifyId: ''
          },
          selectedCommodities: this.selectList.selectedCommodities
        }
      },
      methods: {
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
        tableRowClassName({ row, rowIndex }) {
          return rowIndex % 2 != 0 ? 'el-f0' : '';
        },
        getRowKeys(row) {
          return row.commodityId;
        },
        handleFold(type) {
          this['foldStatus' + type] = this['foldStatus' + type] == 1 ? 0 : 1;
        },
        // 选择表格项
        handleSelectionChange(val) {
          this.$emit('selectionChange', val);
        },
        // 基础字典查询（颜色、材质、系列）
        getBaseDict(dataType) {
          let params = {
            dataType: dataType
          }
          listBaseDict(params)
            .then(response => {
              if (dataType === 'COMMODITY_COLOR') {
                this.colorList = response.data;
              }
              if (dataType === 'COMMODITY_SERIES') {
                this.seriesList = response.data;
              }
              if (dataType === 'COMMODITY_MATERIAL') {
                this.materialList = response.data;
              }
            })
            .catch(error => {
              console.log('选择商品组件：getBaseDict' + error)
            })
        },
        // 供应商
        getCompanyList() {
          listCompanyByAll({ companyType: 1 })
            .then(response => {
              this.companyList = response.data;
            })
            .catch(error => {
              console.log('view/components/selectCommodity.vue:getCompanyList', error);
            })
        },
        // 获取商品列表
        getData() {
          const params = {
            names: this.queryForm.names,
            colourId: this.queryForm.colourId,
            seriesId: this.queryForm.seriesId,
            materialId: this.queryForm.materialId,
            brandId: this.queryForm.brandId,
            commodityCategoryId: this.queryForm.commodityCategoryId,
            companyId: this.queryForm.companyId, // 供应商
            commodityClassifyId: this.queryForm.commodityClassifyId,
            page: this.currentPage,
            limit: this.pageSize
          }
          listCommodity(params)
            .then(response => {
              this.tableData = response.data.rows;
              this.total = response.data.total;
            })
            .catch(error => {
              console.log('选择商品组件:listCommodity', error);
            })
        },
        // 点击查询
        searchSubmit() {
          this.currentPage = 1;
          this.getData();
        },
        // 点击重置
        resetSubmit() {
          this.queryForm = {
            names: '',
            colourId: '',
            seriesId: '',
            materialId: '',
            brandId: '',
            commodityCategoryId: 999999,
            companyId: '', // 供应商
            commodityClassifyId: ''
          }
          this.foldStatus1 = 1;
          this.foldStatus2 = 1;
          this.foldStatus3 = 1;
          this.currentPage = 1;
          this.classifyList = [];
          this.childClassifyList = [];
          this.getData();
        },
        // 选中供应商
        selectCompany(companyId) {
          this.queryForm.companyId = companyId;
          this.getData();
        },
        // 获取全部品牌列表
        getBrandList() {
          listBrand()
            .then(response => {
              this.selectList.brandList = response.data;
            })
            .catch(error => {
              console.log('选择商品组件:getBrandList', error);
            })
        },
        // 获取全部品类列表
        getCategoryList() {
          listCategory()
            .then(response => {
              this.selectList.categoryList = response.data;
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
          if (val) {
            let params = {
              commodityCategoryId: val
            }
            listClassify(params)
              .then(response => {
                this.classifyList = response.data;
              })
              .catch(error => {
                console.log('选择商品组件:getClassifyList', error);
              })
          }
        },
        // 获取二级分类
        getChildClassifyList(commodityClassifyId, index) {
          console.log(commodityClassifyId)
          if (commodityClassifyId) {
            this.childClassifyList = this.classifyList[index].children;
            this.queryForm.commodityClassifyId = commodityClassifyId;
            this.childCommodityClassifyId = '';
          } else {
            this.queryForm.commodityClassifyId = '';
            this.childCommodityClassifyId = '';
            this.childClassifyList = [];
          }
          this.commodityClassifyId = commodityClassifyId;
          this.getData();
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
        }
      }
    }
</script>

<style scoped>
  .queryForm .el-select{
    width: 100%;
  }
  .searchModules{
    width:100%;
    margin-bottom: 10px;
    font-size: 14px;
  }
  .searchModules .searchModule{
    width:100%;
    display: flex;
    background-color:#fff;
    border-bottom: 1px solid #DCDFE6;
    height: 40px;
    line-height: 40px;
    overflow: hidden;
  }
  .searchModules .searchModule .searchModuleTitle{
    width: 180px;
    background-color:#f0f5f9;
    text-align: center;
  }
  .searchModules .searchModule .searchModuleContent{
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: start;
    flex-wrap: wrap;
    color: #666;
  }
  .searchModuleBtn{
    margin-right: 10px;
  }
  .searchModuleContent .filter_style_cell{
    cursor: pointer;
    padding: 0 30px;
    width: 25%;
    height: 40px;
    overflow: hidden;
  }
  .searchModuleContent .filter_style_cell.active{
    color: #409EFF;
  }
  .filter_style_cell:hover{
    color: #409EFF;
  }
  .searchModules .unfold{
    overflow: auto;
    height: auto;
  }
</style>
