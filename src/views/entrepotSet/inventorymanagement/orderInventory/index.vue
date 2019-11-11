<template>
  <div class="orderInventory">
    <div class="head_nav" ref="topInfo">
      <!-- 导航栏 -->
      <breadcrumb :navList="navList"></breadcrumb>
    </div>
    <el-card>
      <el-row :gutter="10" class="queryForm">
        <el-col :span="6">
          <el-input placeholder="订单号/合同号/电话号" @keyup.enter.native='searchFun()' v-model.trim="bindInfo.text" size="medium" class="width-100"></el-input>
        </el-col>
        <el-col :span="6">
          <el-input placeholder="采购合同号" @keyup.enter.native='searchFun()' v-model="bindInfo.purchaseContractCode" size="medium" class="width-100"></el-input>
        </el-col>
        <el-col :span="6">
          <el-date-picker size="medium" v-model="dataValue" type="daterange" value-format="yyyy-MM-dd" 
            format="yyyy-MM-dd" start-placeholder="开始日期" end-placeholder="结束日期" style="width:100%" @change="timeChange"></el-date-picker>
        </el-col>
        <el-col :span="6">
          <el-select clearable v-model="bindInfo.storageId" placeholder="所属仓库" size="medium" class="width-100">
            <el-option v-for="item in warehouseList" :key="item.storageId"
              :label="item.storageName" :value="item.storageId">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-select filterable collapse-tags clearable multiple v-model="storeId" placeholder="所属门店" size="medium" class="width-100">
            <el-option v-for="item in listStoreList" :key="item.storeId" :label="item.storeName"
              :value="item.storeId"></el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-select filterable collapse-tags clearable v-model="bindInfo.brandId" placeholder="品牌" size="medium" class="width-100">
            <el-option v-for="item in brandList" :key="item.brandId" :label="item.brandName" :value="item.brandId"></el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-select filterable collapse-tags clearable v-model="bindInfo.categoryId" placeholder="品类" size="medium" class="width-100">
            <el-option v-for="item in categoryList" :key="item.commodityCategoryId" :label="item.categoryName" :value="item.commodityCategoryId"></el-option>
          </el-select>
        </el-col>
         <el-col :span="6">
          <el-button type="warning" class="button-fc" size="medium" @click="searchFun">查询</el-button>
          <el-button type="primary" size="medium" @click="Reset">重置</el-button>
        </el-col>
      </el-row>
      <div class="h-width"></div>
      <div>
        <orderlist :bindInfo='bindInfo' ref="orderlist"></orderlist>
      </div>
    </el-card>
  </div>
</template>
<script>
import {
  listInventoryOrderByPage,
  getStorageList,
  listStore
} from "api/entrepotSet/inventorymanagement/orderInventory/orderInventory";
import {listBrand,listCategory} from "api/entrepotSet/stockManagement/arrivalNotice/arrivalNotice";
import breadcrumb from "@/views/components/breadcrumb";
import orderlist from "./components/orderlist";

export default {
  components: {
    breadcrumb,
    orderlist
  },
  data() {
    return {
      navList: [],
      storeId:[],
      bindInfo: {}, //查询
      dataValue: [], //时间
      listStoreList: [], //门店
      warehouseList: [], //仓库
      brandList:[],//品牌
      categoryList:[]//品类
    };
  },
  // mounted() {
  //   this.navList = this.$route.meta;
  //   this.getWarehouse();
  //   this.getListStore();
  // },
  activated(){
    this.navList = this.$route.meta;
    this.getWarehouse();
    this.getListStore();
    this.getBrand();
    this.getCategory()
  },
  // deactivated () {
  //     this.$destroy(true)
  // },
  methods: {
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
    //时间
    timeChange() {
      this.bindInfo.startTime = this.dataValue ? this.dataValue[0] : "";
      this.bindInfo.endTime = this.dataValue ? this.dataValue[1] : "";
    },
    //获取仓库
    getWarehouse() {
      getStorageList().then(res => {
          this.warehouseList = res.data;
        }).catch(error => {
          console.error("获取仓库", error);
        });
    },
    //获取门店
    getListStore() {
      listStore().then(res => {
          console.log(res);
          this.listStoreList = res.data;
        }).catch(error => {
          console.error("", error);
        });
    },
    //查询
    searchFun() {
      this.bindInfo.storeIds = this.storeId.join(',');
      this.$refs.orderlist.currentPage = 1;
      this.$refs.orderlist.getData(this.bindInfo);
    },
    //重置
    Reset() {
      this.bindInfo = {};
      this.storeId = [];
      this.dataValue = [];
      this.$refs.orderlist.getData(this.bindInfo,1);
    }
  }
};
</script>