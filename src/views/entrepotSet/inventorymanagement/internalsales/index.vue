<template>
  <div class="temporarymaintenance">
    <div class="head_nav" ref="topInfo">
      <!-- 导航栏 -->
      <breadcrumb :navList="navList"></breadcrumb>
    </div>
    <!-- 查询条件 -->
    <el-card>
      <div>
        <div class="head_list">
          <div class="input-vw">
            <el-input
              placeholder="订单号/合同号/采购合同号/商品名称/货位码"
              v-model="textsearch"
              size="medium"
              class="width-100"
            >
              <i slot="suffix" class="el-input__icon el-icon-search"></i>
            </el-input>
          </div>
          <div class="input-vw">
            <div class="stock_time">
              <el-date-picker
                size="medium"
                v-model="dataValue"
                type="daterange"
                range-separator="-"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                style="width:100%"
              ></el-date-picker>
            </div>
          </div>
          <div class="input-vw">
            <el-select v-model="ownershipType" placeholder="所属仓库" size="medium" class="width-100">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <div class="input-vw">
            <el-select v-model="billType" placeholder="所属网点" size="medium" class="width-100">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <div class="input-vw">
            <el-select v-model="billType" placeholder="供应商" size="medium" class="width-100">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <div class="input-vw">
            <el-select v-model="billType" placeholder="商品类型" size="medium" class="width-100">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <div class="input-vw">
            <div class="btnsList">
              <el-button type="warning" class="button-fc" size="medium" @click="searchFun">查询</el-button>
              <el-button type="primary" size="medium" @click="Reset">重置</el-button>
            </div>
          </div>
          <div class="input-vw"></div>
        </div>
      </div>

      <div class="h-width"></div>
      
      <stockuplist></stockuplist>
    </el-card>

    <!-- 切换列表 -->
    <!-- <el-tabs class="m-top20" type="border-card" v-model="activeName">
      <div class="btn_list_1">
        <el-button size="small" class="button-96" type="default">导出</el-button>
        <el-button size="small" class="button-96" type="default">审批</el-button>
      </div>
      <el-tab-pane label="订单" name="orderlist">
        <orderlist v-if="activeName=='orderlist'"></orderlist>
      </el-tab-pane>
      <el-tab-pane label="备货" name="stockuplist">
        <stockuplist v-if="activeName=='stockuplist'"></stockuplist>
      </el-tab-pane>
    </el-tabs>-->
  </div>
</template>
<script>
import breadcrumb from "@/views/components/breadcrumb";
// import orderlist from "./components/orderlist";
import stockuplist from "./components/stockuplist";
export default {
  components: {
    breadcrumb,
    // orderlist,
    stockuplist
  },
  data() {
    return {
      navList: [],
      options: [],
      textsearch: "",
      dataValue: [],
      ownershipType: "",
      billType: "",
      activeName: "orderlist"
    };
  },
  mounted() {
    this.navList = this.$route.meta;
  },
  methods: {
    searchFun() {
      //查询
    },
    Reset() {
      //重置
    }
  }
};
</script>
<style lang="scss" scoped>
.temporarymaintenance {
  .head_list {
    display: flex;
    flex-flow: row wrap;
    justify-content: space-between;
  }
  .input-vw {
    width: calc(((94vw - 250px)) / 4);
    margin-bottom: 20px;
    float: left;
    position: relative;
    display: flex;
    align-items: center;
  }
  
}
</style>
