<template>
  <div class="temporarymaintenance">
    <div class="head_nav" ref="topInfo">
      <!-- 导航栏 -->
      <breadcrumb :navList="navList"></breadcrumb>
    </div>
    <!-- 查询条件 -->
    <el-card class="m-bottom10">
      <div class="queryForm">
        <el-row :gutter="10">
          <el-col :span="span">
            <el-input :placeholder="searchText" v-model="queryForm.text" size="medium" clearable @keyup.enter.native="searchFun"></el-input>
          </el-col>
          <el-col :span="span">
            <el-select v-model="queryForm.maintainStatus" clearable placeholder="维修状态" size="medium">
              <el-option v-for="item in maintainStatusList" :key="item.code" :label="item.value" :value="item.code"></el-option>
            </el-select>
          </el-col>
          <el-col :span="span">
            <el-select v-model="queryForm.handling" clearable placeholder="处理方式" size="medium">
              <el-option v-for="item in handlingList" :key="item.code" :label="item.value" :value="item.code"></el-option>
            </el-select>
          </el-col>
          <el-col :span="span">
            <el-select v-model="queryForm.storageId" clearable placeholder="所属仓库" size="medium">
              <el-option v-for="item in storageList" :key="item.storageId" :label="item.storageName" :value="item.storageId"></el-option>
            </el-select>
          </el-col>
          <el-col :span="24" class="block center">
            <el-button type="warning" class="button-fc" size="medium" @click="searchFun">查询</el-button>
            <el-button type="primary" size="medium" @click="reset">重置</el-button>
          </el-col>
        </el-row>
      </div>
    </el-card>
    <!-- 切换列表 -->
    <el-tabs type="border-card" v-model="activeName" @tab-click="tabClick">
<!--      <el-tab-pane label="订单" name="orderlist">-->
<!--        <orderlist v-if="activeName=='orderlist'" :params="queryForm" ref="orderlist" :isReset="isResetPage" @resetPage="resetPage"></orderlist>-->
<!--      </el-tab-pane>-->
      <el-tab-pane label="备货" name="stockuplist">
        <stockuplist v-if="activeName=='stockuplist'" :params="queryForm" ref="stockuplist" :isReset="isResetPage" @resetPage="resetPage"></stockuplist>
      </el-tab-pane>
      <el-tab-pane label="内部销售" name="internalSalesList">
        <internalSalesList v-if="activeName=='internalSalesList'" :params="queryForm" ref="internalSalesList" :isReset="isResetPage" @resetPage="resetPage"></internalSalesList>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
  import breadcrumb from "@/views/components/breadcrumb";
  import orderlist from "./components/orderlist";
  import stockuplist from "./components/stockuplist";
  import internalSalesList from "./components/internalSalesList";
  import { getStorageList } from 'api/pulicJava';
  export default {
    components: {
      breadcrumb,
      orderlist,
      stockuplist,
      internalSalesList
    },
    data() {
      return {
        span: 6,
        navList: [],
        activeName: "stockuplist",
        companyList: [], // 供应商
        storageList: [], // 仓库
        queryForm: {
          text: '', // 来源单号
          storageId: '', // 仓库id
          maintainStatus: '', // 维修状态
          handling: '' // 处理方式
        },
        maintainStatusList: [
          { code: 0, value: '待处理' },
          { code: 1, value: '处理中' },
          { code: 2, value: '再处理' },
          { code: 3, value: '已处理' }
        ],
        handlingList: [
          { code: 1, value: '新增' },
          { code: 2, value: '转可用' },
          { code: 3, value: '报废' },
          { code: 4, value: '内部销售' }
        ],
        searchText: '来源单号',
        isResetPage: false // 是否需要重置到第一页
      };
    },
    // created() {
    //   this.getStorageList();
    // },
    // mounted() {
    //   this.navList = this.$route.meta;
    // },
    activated(){
      this.getStorageList();
      this.navList = this.$route.meta;
    },
    // deactivated () {
    //     this.$destroy(true)
    // },
    methods: {
      // 点击选项卡切换
      tabClick() {
        if (this.activeName == 'orderlist') {
          this.searchText = '来源单号';
        } else {
          this.searchText = '商品名称 商品编码 商品型号';
        }
      },
      // 获取所有的仓库
      getStorageList() {
        getStorageList()
          .then(response => {
            this.storageList = response.data;
          })
          .catch(error => {
            console.log('views/entrepotSet/inventorymanagement/temporarymaintenance/index.vue-getStorageList:' + error)
          })
      },
      // 查询
      searchFun() {
        this.isResetPage = true;
        setTimeout(() => {
          this.$refs[this.activeName].getData();
        }, 0);
      },
      // 重置
      reset() {
        this.isResetPage = true;
        for (let keys in this.queryForm) {
          this.queryForm[keys] = '';
        }
        setTimeout(() => {
          this.$refs[this.activeName].getData();
        }, 0);
      },
      // 只有点击查询和重置按钮需要把isResetPage设为true
      resetPage() {
        this.isResetPage = false;
      }
    }
  };
</script>
