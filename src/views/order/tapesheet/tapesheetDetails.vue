<template>
  <div class="seemeasure">
    <div class="head_nav">
      <breadcrumb :navList="navList"></breadcrumb>
    </div>
    <el-card>
      <div class="modules">
        <div class="titlecals" style="margin-top: 0;">带单信息</div>
        <ul class="moduleContent">
          <li>带单号：{{ assistOrderInfo.assistNo }}</li>
          <li>所属门店：{{ assistOrderInfo.assistStoreName }}</li>
          <li>销售：{{ assistOrderInfo.salesmanName }}</li>
          <li>带单时间：{{ assistOrderInfo.assistTime }}</li>
          <li>带单订单号：{{ assistOrderInfo.assistOrderNo }}</li>
          <li>带单品牌：{{ assistOrderInfo.assistBrandName }}</li>
          <li>带单品类：{{ assistOrderInfo.assistCommodityCategoryName }}</li>
        </ul>
      </div>
      <div class="modules">
        <div class="titlecals">被推介门店</div>
        <ul class="moduleContent">
          <li>被推介门店：{{ assistOrderInfo.acceptStoreName }}</li>
          <li>被推介门店品牌：{{ assistOrderInfo.acceptBrankName }}</li>
          <li>被推介门店品类：{{ assistOrderInfo.acceptCategoryName }}</li>
        </ul>
      </div>
      <div class="modules">
        <div class="titlecals">客户信息</div>
        <ul class="moduleContent">
          <li>带单客户：{{ assistOrderInfo.customerName }}</li>
          <li>客户电话：{{ assistOrderInfo.customerPhone }}</li>
          <li>客户地址：{{ assistOrderInfo.address }}</li>
        </ul>
        <div class="moduleContent remarks">
          <span class="labelText">带单备注：</span>
          <p class="content">{{ assistOrderInfo.assistRemarks }}</p>
        </div>
      </div>
      <!-- 订单详情 -->
      <orderdetail></orderdetail>
    </el-card>
  </div>
</template>

<script>
  import breadcrumb from "../../components/breadcrumb";
  import orderdetail from "../components/orderdetail";
  import { assistOrderInfo } from 'api/order/tapesheet/tapesheet'
  export default {
    components: {
      breadcrumb,
      orderdetail
    },
    data() {
      return {
        navList: [],
        assistOrderInfo: {}
      };
    },
    created() {
      let params = {
        assistOrderId: this.$route.query.assistOrderId
      }
      this.getAssistOrderInfo(params);
    },
    props: [],
    mounted() {
      // 头部面包屑
      this.navList = this.$route.meta;
    },
    methods: {
      // 获取带单详情
      getAssistOrderInfo(params) {
        assistOrderInfo(params)
          .then(response => {
            this.assistOrderInfo = response.data;
          })
          .catch(error => {
            console.log('获取带单详情views/order/tapesheet/tapesheetDetails:getAssistOrderInfo' + error);
          });
      }
    }
  };
</script>

<style lang="scss" scoped>
  .modules{
    margin-bottom: 10px;
  }
  .moduleContent{
    padding: 0 20px;
    border-radius: 2px;
    display: flex;
    flex-wrap: wrap;
    font-size: 13px;
    color: #333333;
  }
  .moduleContent li {
    width: 33.3%;
    line-height: 30px;
  }
  .titlecals{
    top: 0;
    margin: 15px 20px;
  }
  .remarks{
    padding-right: 0;
    display: flex;
    border: none;
    line-height: 26px;
    .labelText{
      width: 70px;
    }
    .content{
      flex:1;
      /*border: 1px solid #d9d9d9;*/
      /*min-height: 120px;*/
      -webkit-border-radius: 2px;
      -moz-border-radius: 2px;
      border-radius: 2px;
      /*padding: 10px;*/
    }
  }
</style>

