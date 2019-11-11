<template>
  <div>
    <div class="head_nav" ref="topInfo">
      <!-- 导航栏 -->
      <breadcrumb :navList="navList"></breadcrumb>
    </div>

    <el-card>
      <!-- 查询条件 -->
      <div class="head_list">
        <div class="input-vw">
          <el-input placeholder="出库单号/来源单号/司机/车号/门店" @keyup.enter.native='searchFun()' v-model.trim="beforIn.text" size="medium" class="width-100"></el-input>
        </div>

        <div class="input-vw">
          <div class="stock_time">
            <el-date-picker
              size="medium"
              v-model="dataEstimate"
              type="daterange"
              range-separator="-"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              start-placeholder="预计上门开始"
              end-placeholder="预计上门结束"
              style="width:100%"
              @change="estimageChange"
            ></el-date-picker>
          </div>
        </div>

        <div class="input-vw">
          <div class="stock_time">
            <el-date-picker
              size="medium"
              v-model="dataDelivery"
              type="daterange"
              range-separator="-"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              start-placeholder="提货日期开始"
              end-placeholder="提货日期结束"
              style="width:100%"
              @change="deliveryChange"
            ></el-date-picker>
          </div>
        </div>
        

        <div class="input-vw">
          <el-select v-model="beforIn.storeId" clearable filterable placeholder="门店" size="medium" class="width-100">
            <el-option
              v-for="item in storeList"
              :key="item.storeId"
              :label="item.storeName"
              :value="item.storeId"
            ></el-option>
          </el-select>
        </div>

        <div class="input-vw">
          <el-select v-model="beforIn.brandId" clearable filterable placeholder="品牌" size="medium" class="width-100">
            <el-option
              v-for="item in brandList"
              :key="item.brandId"
              :label="item.brandName"
              :value="item.brandId"
            ></el-option>
          </el-select>
        </div>

        <div class="input-vw">
          <el-select v-model="beforIn.categoryId" clearable filterable placeholder="品类" size="medium" class="width-100">
            <el-option
              v-for="item in categoryList"
              :key="item.commodityCategoryId"
              :label="item.categoryName"
              :value="item.commodityCategoryId"
            ></el-option>
          </el-select>
        </div>

        <div class="input-vw">
          <el-select v-model="beforIn.storageId" clearable filterable placeholder="仓库" size="medium" class="width-100">
            <el-option
              v-for="item in stateList"
              :key="item.storageId"
              :label="item.storageName"
              :value="item.storageId"
            ></el-option>
          </el-select>
        </div>

        <div class="input-vw">
          <div class="btnsList">
            <el-button class="button-fc" size="medium" @click="searchFun" :loading="loading">查询</el-button>
            <el-button type="primary" size="medium" @click="Reset">重置</el-button>
          </div>
        </div>
        <div class="input-vw"></div>
      </div>
    </el-card>

    <div class="m-top20">
      <!-- 列表 -->
      <el-tabs type="border-card" v-model="activeName" @tab-click="hankwitch">
        <el-tab-pane label="待出库" name="pendingstorage">
          <pendingstorage ref="pendingstorage" @getData="getData" :beforIn='beforIn' :tableData="tableData" :loading='loading'></pendingstorage>
        </el-tab-pane>
        <!-- <el-tab-pane label="进行中" name="haveinhandlist">
          <haveinhandlist ref="haveinhandlist" :tableData="tableData" :loading='loading'></haveinhandlist>
        </el-tab-pane> -->
        <el-tab-pane label="已出库" name="outofstocklist">
          <outofstocklist ref="outofstocklist" :beforIn='beforIn' :tableData="tableData" :loading='loading'></outofstocklist>
        </el-tab-pane>

        <!-- 分页 -->
        <div class="pagination_wrap">
          <pagination
            :current-page="currentPage"
            :pageSize="pageSize"
            :total="total"
            @sizeChange="sizeChange"
            @currentChange="currentChange"
          ></pagination>
        </div>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import breadcrumb from "@/views/components/breadcrumb"; //导航
import pagination from "@/views/components/pagination"; //分页
import pendingstorage from "./components/pendingstorage"; //待出库
import haveinhandlist from "./components/haveinhandlist"; //进行中
import outofstocklist from "./components/outofstocklist"; //已出库
import { outboundOrderByPage } from "api/entrepotSet/outgoingManagement/outgoingManagement";
import { listStore } from "api/common/common";
import {listBrand,listCategory} from "api/entrepotSet/stockManagement/arrivalNotice/arrivalNotice";
import { getStorageList } from "api/entrepotSet/stockManagement/stockPending/stockPending";
export default {
  components: {
    breadcrumb,
    pagination,
    pendingstorage,
    haveinhandlist,
    outofstocklist
  },
  data() {
    return {
      navList: [], //导航列表
      beforIn: {}, //查询条件
      tableData: [], //列表数据
      currentPage: 1, //当前页数
      pageSize: 10, //总页数
      total: 0, //总条数
      activeName: "pendingstorage", //切换状态
      dataValue: [],
      dataEstimate:[],//预计安装时间
      dataDelivery:[],//提货日期
      storeList: [], //门店
      brandList:[],//品牌
      categoryList:[],//品类
      stateList:[],
      loading: true
    };
  },
  // mounted() {
  //   this.navList = this.$route.meta;
  //   let { pathtabs = "" } = this.$route.query;
  //   if (pathtabs) {
  //     this.activeName = pathtabs;
  //   }
  //   this.getData();
  //   this.getStore();
  // },
  activated(){
    this.navList = this.$route.meta;
    let { pathtabs = "" } = this.$route.query;
    if (pathtabs) {
      this.activeName = pathtabs;
    }
    this.getData();
    this.getStore();
    this.getBrand()
    this.getCategory()
    this.getWarehouse()
  },
  // deactivated () {
  //     this.$destroy(true)
  // },
  methods: {
    //获取仓库
    getWarehouse() {
      getStorageList().then(res => {
          this.stateList = res.data;
      }).catch(error => {
          console.error("获取所属仓库", error);
        });
    },
    //时间
    timeChange() {
      this.beforIn.startTime = this.dataValue ? this.dataValue[0] : "";
      this.beforIn.endTime = this.dataValue ? this.dataValue[1] : "";
    },
    //预计安装日期
    estimageChange(){
      this.beforIn.predictDateStart = this.dataEstimate ? this.dataEstimate[0] : "";
      this.beforIn.predictDateEnd = this.dataEstimate ? this.dataEstimate[1] : "";
    },
    //提货日期
    deliveryChange(){
      this.beforIn.startTime = this.dataDelivery ? this.dataDelivery[0] : "";
      this.beforIn.endTime = this.dataDelivery ? this.dataDelivery[1] : "";
    },
    //获取品牌
    getBrand() {
      listBrand()
        .then(res => {
          this.brandList = res.data;
        })
        .catch(error => {
          console.error("获取品牌", error);
        });
    },
    //获取品类
    getCategory() {
      listCategory()
        .then(res => {
          this.categoryList = res.data;
        })
        .catch(error => {
          console.error("获取品类", error);
        });
    },
    //获取列表数据
    getData() {
      let data = {
        ...this.beforIn,
        page: this.currentPage,
        limit: this.pageSize
      };
      if (this.activeName == "pendingstorage") {
        data.outboundStatus = "1";
      } else if (this.activeName == "haveinhandlist") {
        data.outboundStatus = "2";
      } else if (this.activeName == "outofstocklist") {
        data.outboundStatus = "3";
      }
      this.loading = true;
      outboundOrderByPage(data)
        .then(res => {
          if(res.status == 200){
            this.tableData = res.data.rows;
            this.total = res.data.total;
            this.loading = false;
          }else {
            this.loading = false;
          }
        })
        .catch(error => {
          this.loading = false;
          console.error("获取列表数据", error);
        });
    },
    //获取门店
    getStore() {
      listStore().then(res => {
        if (res.status == 200) {
          this.storeList = res.data;
        }
      });
    },
    //切换tabs
    hankwitch() {
      let url = "#/outgoingManagement/outofstock?pathtabs=" + this.activeName;
      this.currentPage = 1;
      history.pushState({}, '', url);
      this.getData();
    },
    //表格斑马线设置
    tableRowClassName({ row, rowIndex }) {
      return rowIndex % 2 != 0 ? "el-f0" : "";
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
    //查询
    searchFun() {
      this.getData();
    },
    //重置
    Reset() {
      this.beforIn = {}; //查询条件
      this.dataValue = [];
      this.dataEstimate=[]//预计安装时间
      this.dataDelivery=[]//提货日期
      this.getData();
    }
  }
};
</script>
<style lang="scss" scoped>
.head_list {
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
}
.input-vw {
  width: calc(((94vw - 250px)) / 4);
  margin-bottom: 5px;
  float: left;
  position: relative;
  display: flex;
  align-items: center;
}
.pagination_wrap {
  text-align: center;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
