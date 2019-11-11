<template>
  <div class="stockingstock">
    <div class="head_nav" ref="topInfo">
      <!-- 导航栏 -->
      <breadcrumb :navList="navList"></breadcrumb>
    </div>
    <el-card>
      <div class="head_list">
        <div class="input-vw">
          <el-input placeholder="订单号/合同号/采购合同号/商品名称/货号" @keyup.enter.native='searchFun()' v-model.trim="bindInfo.text" size="medium" class="width-100">
          </el-input>
        </div>
        <div class="input-vw">
          <el-select v-model="bindInfo.storageId" placeholder="所属仓库" size="medium" class="width-100">
            <el-option v-for="item in storageList" :key="item.storageId" :label="item.storageName" :value="item.storageId"></el-option>
          </el-select>
        </div>
        <div class="input-vw">
          <el-select v-model="bindInfo.brandId" placeholder="品牌" size="medium" class="width-100">
            <el-option v-for="item in brandList" :key="item.brandId" :label="item.brandName" :value="item.brandId"></el-option>
          </el-select>
        </div>
        <div class="input-vw">
          <el-select v-model="bindInfo.commodityCategoryId" placeholder="品类" size="medium" class="width-100">
            <el-option v-for="item in categoryList" :key="item.commodityCategoryId" :label="item.categoryName" :value="item.commodityCategoryId"></el-option>
          </el-select>
        </div>
        <div class="input-vw">
          <div class="btnsList">
            <el-button type="warning" class="button-fc" size="medium" @click="searchFun">查询</el-button>
            <el-button type="primary" size="medium" @click="Reset">重置</el-button>
          </div>
        </div>
      </div>
      <!-- <div class="btnsList">
        <el-button type="warning" class="button-fc" size="medium" @click="searchFun">查询</el-button>
        <el-button type="primary" size="medium" @click="Reset">重置</el-button>
      </div> -->
      <div class="h-width"></div>

      <stockuplist :bindInfo='bindInfo' ref="stockuplist"></stockuplist>
    </el-card>
  </div>
</template>
<script>
import {
  listBrand,
  listCategory,
  getStorageList
} from "api/entrepotSet/stockManagement/arrivalNotice/arrivalNotice";
import breadcrumb from "@/views/components/breadcrumb";
import stockuplist from "./components/stockuplist";
export default {
  components: {
    breadcrumb,
    stockuplist
  },
  data() {
    return {
      navList: [], //导航条
      brandList: [], //品牌
      categoryList: [], //品类
      storageList: [], //仓库
      bindInfo: {} //查询条件
    };
  },
  // mounted() {
  //   this.navList = this.$route.meta;
  //   this.getStorage(); //仓库
  //   this.getBrand(); //品牌
  //   this.getCategory(); //品类
  // },
  activated(){
    this.navList = this.$route.meta;
    this.getStorage(); //仓库
    this.getBrand(); //品牌
    this.getCategory(); //品类
  },
  // deactivated () {
  //     this.$destroy(true)
  // },
  methods: {
    //获取仓库
    getStorage() {
      getStorageList()
        .then(res => {
          this.storageList = res.data;
        })
        .catch(error => {
          console.error("获取仓库", error);
        });
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
    //查询
    searchFun() {
      this.$refs.stockuplist.currentPage = 1;
      this.$refs.stockuplist.getData(this.bindInfo);
    },
    //重置
    Reset() {
      this.bindInfo = {};
      this.$refs.stockuplist.getData(this.bindInfo,1);
    }
  }
};
</script>
<style lang="scss" scoped>
.stockingstock {
  .head_list {
    display: flex;
    flex-flow: row wrap;
    justify-content: space-between;
  }
  .input-vw {
    width: calc(((94vw - 250px)) / 5);
    margin-bottom: 20px;
    float: left;
    position: relative;
    display: flex;
    align-items: center;
  }

  .btnsList {
    width: 100%;
    display: flex;
    // justify-content: center;
  }
}
</style>
