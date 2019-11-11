<template>
  <div class="table_list" v-loading="loading">
    <el-table border :data="tableList" :row-class-name="tableRowClassName">
      <el-table-column :align="columnAlign" type="index"></el-table-column>
      <el-table-column prop="roomId" label="房间号" :align="columnAlign" sortable></el-table-column>
      <el-table-column prop="commodityCode" label="自有商品编码" :align="columnAlign" sortable show-overflow-tooltip></el-table-column>
      <el-table-column prop="commodityName" label="自有商品名称" :align="columnAlign" sortable show-overflow-tooltip></el-table-column>
      <el-table-column prop="brandName" label="品牌" :align="columnAlign" sortable show-overflow-tooltip></el-table-column>
      <el-table-column prop="categoryName" label="品类" :align="columnAlign" sortable show-overflow-tooltip></el-table-column>
      <el-table-column prop="classifyName" label="分类" :align="columnAlign" sortable show-overflow-tooltip></el-table-column>
      <el-table-column prop="amount" label="数量" :align="columnAlign" sortable show-overflow-tooltip></el-table-column>
      <el-table-column prop="remarks" label="备注" :align="columnAlign" width="150" sortable show-overflow-tooltip></el-table-column>
    </el-table>
  </div>
</template>

<script>
  import { listOrderOwnGoods } from 'api/order/contract/contract';
  export default {
    name: "CommodityPrivate",
    data() {
      return {
        columnAlign: 'center',
        size: 'medium',
        tableList: [],
        loading: true
      }
    },
    props: ['orderId'],
    created() {
      this.getData();
    },
    methods: {
      tableRowClassName({ row, rowIndex }) {
        return rowIndex % 2 != 0 ? 'el-f0' : '';
      },
      getData() {
        this.loading = true;
        let params = {
          orderId: this.orderId ? this.orderId : this.$route.query.orderId,
          orderType: 2
        }
        listOrderOwnGoods(params)
          .then(response => {
            this.loading = false;
            this.tableList = response.data;
          })
          .catch(error => {
            this.loading = false;
            console.log('views/administrationCenter/contractmanagement/components/audit/CommodityPrivate' + error);
          });
      }
    }
  }
</script>
