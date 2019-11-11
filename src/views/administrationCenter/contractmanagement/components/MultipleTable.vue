<template>
  <div class="tableBox tableBoxMax commodity">
<!--    <el-button type="primary" size="small" class="m-bottom10" v-print="'#printContentClassify'">打印2</el-button>-->
    <div class="multipleTable" v-loading="loading" id="printContentClassify">
      <ul class="multipleTableHeader multipleTableHeaderBg bt1 fw">
        <li>序号</li>
        <li>房间</li>
        <li class="commodityNumber">名称</li>
        <li v-if="isUnFinished">型号</li>
        <li v-if="isFinished">货号</li>
        <li v-if="isFinished">规格</li>
        <li v-if="isUnFinished">系列</li>
        <li v-if="isUnFinished">材质</li>
        <li>颜色</li>
        <li>单价</li>
        <li>单位</li>
        <li>计价方式</li>
        <li>非标系数</li>
        <li>数量</li>
        <li>原价</li>
        <li>折扣率</li>
        <li>活动价</li>
        <li class="commodityNumber">备注</li>
        <li>品牌</li>
        <li>品类</li>
        <li>宽</li>
        <li>高</li>
        <li>深</li>
        <li>厚</li>
        <li>商品编码</li>
      </ul>
      <MultipleTableBody :datas="datas"></MultipleTableBody>
    </div>
  </div>
</template>
<script>
  import { listOrderCommodity } from '@/api/administrationCenter/contractmanagement/contractmanagement';
  import MultipleTableBody from '@/views/administrationCenter/contractmanagement/components/MultipleTableBody';
  import { calPrice } from '@/utils/pubilcFn';
  import { mapGetters } from 'vuex';
  export default {
    name: 'multipleTable',
    components: {
      MultipleTableBody
    },
    props: ['showType', 'orderId', 'contractId'],
    created() {
      this.getListOrderCommodity();
    },
    data() {
      return {
        datas: [],
        loading: true
      }
    },
    methods: {
      tableRowClassName({ row, rowIndex }) {
        return rowIndex % 2 != 0 ? 'el-f0' : '';
      },
      // 获取商品信息
      getListOrderCommodity() {
        let params = {
          orderId: this.orderId ? this.orderId : this.$route.query.orderId,
          showType: this.showType,
          customerContractId: this.contractId ? this.contractId : this.$route.query.orderId
        };
        listOrderCommodity(params)
          .then(response => {
            this.loading = false;
            if (response.data[0].orderCommodityByClassify) {
              response.data[0].orderCommodityByClassify.isShow = true;
            }
            calPrice(response.data[0].orderCommodityByClassify);
            this.datas = response.data[0].orderCommodityByClassify;
          })
          .catch(error => {
            this.loading = false;
            console.log('合同管理/商品信息 views/administrationCenter/contractmanagement/components/audit/MultipleTable:' + error);
          });
      }
    },
    computed: {
      ...mapGetters([
        'orderDetails'
      ]),
      // 是否是成品
      isFinished() {
        return this.orderDetails.orderGoodsType == 1;
      },
      // 是否是定制品
      isUnFinished() {
        return this.orderDetails.orderGoodsType == 2;
      }
    }
  }
</script>
