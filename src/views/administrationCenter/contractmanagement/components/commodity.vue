<template>
  <div>
    <el-tabs class="commodity" type="border-card" v-model="tabActive">
      <el-button type="primary" size="small" class="m-bottom10" v-print="'#printContentRoom'" v-if="tabActive == 1">打印</el-button>
<!--      <el-button type="primary" size="small" class="m-bottom10" v-print="'#printContentClassify'" v-if="tabActive == 2" >打印2</el-button>-->
      <el-tab-pane label="房间" name="1">
        <MultipleTableRoom show-type="1" :group="getShowType" :orderId="orderId" v-if="tabActive == 1 && getShowType" id="printContentRoom"></MultipleTableRoom>
      </el-tab-pane>
      <el-tab-pane label="分类" name="2">
        <MultipleTable show-type="2" :orderId="orderId" v-if="tabActive == 2" id="printContentClasssify"></MultipleTable>
      </el-tab-pane>
    </el-tabs>
<!--    <div class="table_list" v-if="billType == 2">-->
<!--      <el-table border :data="contractDetails.stockUpPurchaseOrderGoodsVOS" :row-class-name="tableRowClassName">-->
<!--        <el-table-column align="center" type="index"></el-table-column>-->
<!--        <el-table-column prop="commodityName" label="商品名称" align="center" width="200" sortable show-overflow-tooltip></el-table-column>-->
<!--        <el-table-column prop="commodityCode" label="商品编码" align="center" width="140" sortable show-overflow-tooltip></el-table-column>-->
<!--        <el-table-column prop="brandName" label="品牌" align="center" width="120" sortable show-overflow-tooltip></el-table-column>-->
<!--        <el-table-column prop="categoryName" label="品类" align="center" width="120" sortable show-overflow-tooltip></el-table-column>-->
<!--        <el-table-column prop="commoditySeries" label="系列" width="120" align="center" sortable show-overflow-tooltip></el-table-column>-->
<!--        <el-table-column prop="commodityMaterial" label="材质" width="120" align="center" sortable show-overflow-tooltip></el-table-column>-->
<!--        <el-table-column prop="commodityColour" label="颜色" width="120" align="center" sortable show-overflow-tooltip></el-table-column>-->
<!--        <el-table-column prop="commodityUnit" label="单位" width="100" align="center" sortable show-overflow-tooltip></el-table-column>-->
<!--        <el-table-column prop="commodityWide" label="宽" width="100" align="center" sortable show-overflow-tooltip></el-table-column>-->
<!--        <el-table-column prop="commodityHigh" label="高" width="100" align="center" sortable show-overflow-tooltip></el-table-column>-->
<!--        <el-table-column prop="commodityHigh" label="深" width="100" align="center" sortable show-overflow-tooltip></el-table-column>-->
<!--        <el-table-column prop="commodityThick" label="厚" width="100" align="center" sortable show-overflow-tooltip></el-table-column>-->
<!--        <el-table-column prop="commodityNumber" label="货号" width="140" align="center" sortable show-overflow-tooltip></el-table-column>-->
<!--      </el-table>-->
<!--    </div>-->
  </div>

</template>

<script>
  import { mapGetters } from 'vuex';
  import MultipleTable from '@/views/administrationCenter/contractmanagement/components/MultipleTable';
  import MultipleTableRoom from '@/views/administrationCenter/contractmanagement/components/MultipleTableRoom';
  export default {
    name: 'accessory',
    components: {
      MultipleTable,
      MultipleTableRoom
    },
    props: ['orderId','auditType'],
    data() {
      return {
        tabActive: '1',
        billType: this.$route.query.billType
      }
    },
    methods: {
      tableRowClassName({ row, rowIndex }) {
        return rowIndex % 2 != 0 ? 'el-f0' : '';
      }
    },
    computed: {
      ...mapGetters([
        'contractDetails',
        'orderDetails'
      ]),
      getShowType() {
        let showTypes = '';
        if (this.orderDetails.category) {
          // 衣柜-房间，其他-分类，橱柜-一个房间按分类，多个房间按房间
          if (this.orderDetails.category.commodityCategoryId === 1000026 || this.orderDetails.category.commodityCategoryId === 1000033) {
            showTypes = 2;
          } else {
            showTypes = 1;
          }
        }
        return showTypes;
      }
    }
  }
</script>
