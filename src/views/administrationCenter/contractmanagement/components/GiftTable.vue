<template>
  <div class="table_list" v-loading="loading">
    <el-table border :data="tableList" :row-class-name="tableRowClassName">
      <el-table-column :align="columnAlign" type="index"></el-table-column>
      <el-table-column prop="commodityName" label="礼品名称" :align="columnAlign" sortable></el-table-column>
      <el-table-column prop="commodityCode" label="礼品编码" :align="columnAlign" sortable show-overflow-tooltip></el-table-column>
      <el-table-column prop="costPrice" label="价格" :align="columnAlign" sortable show-overflow-tooltip></el-table-column>
      <el-table-column label="赠送方式" :align="columnAlign" sortable show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="scope.row.sendWay == 0">自取</span>
          <span v-else-if="scope.row.sendWay == 0">快递</span>
          <span v-else></span>
        </template>
      </el-table-column>
      <el-table-column prop="giftAmount" label="赠送数量" :align="columnAlign" sortable show-overflow-tooltip></el-table-column>
      <el-table-column prop="remark" label="备注" :align="columnAlign" width="200" sortable show-overflow-tooltip></el-table-column>
    </el-table>
  </div>
</template>

<script>
  import { listOrderGift } from '@/api/administrationCenter/contractmanagement/contractmanagement';
  export default {
    props: ['orderId'],
    created() {
      this.getData();
    },
    data() {
      return {
        tableList: [],
        columnAlign: 'center',
        loading: true
      };
    },
    methods: {
      tableRowClassName({ row, rowIndex }) {
        return rowIndex % 2 != 0 ? 'el-f0' : '';
      },
      getData() {
        let params = {
          orderId: this.orderId ? this.orderId : this.$route.query.orderId,
        }
        listOrderGift(params)
          .then(response => {
            this.tableList = response.data;
            this.loading = false;
          })
          .catch(error => {
            this.loading = false;
            console.log('合同管理/商品信息 views/administrationCenter/contractmanagement/components/audit/GiftTable' + error);
          });
      }
    }
  };
</script>
