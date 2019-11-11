<template>
  <div class="table_list unsortable" v-loading="loading">
    <el-table border :data="datas" :max-height="maxHeight">
      <el-table-column type="index" align="center" width="60"></el-table-column>
      <el-table-column label="操作人" prop="purchaseName" align="center"></el-table-column>
      <el-table-column label="采购单/库取单" prop="purchaseNumber" align="center"></el-table-column>
      <el-table-column label="执行时间" prop="purchaseTime" align="center"></el-table-column>
      <el-table-column label="操作结果" prop="operationResult" align="center"></el-table-column>
    </el-table>
    <div class="pagination_wrap">
      <pagination
        :current-page="currentPage"
        :pageSize="pageSize"
        :total="total"
        @sizeChange="sizeChange"
        @currentChange="currentChange">
      </pagination>
    </div>
  </div>
</template>

<script>
  import pagination from '@/views/components/pagination';
  import { mapGetters } from 'vuex';
  import { listContractDecomposition } from '@/api/administrationCenter/contractmanagement/contractmanagement';
  export default {
    components: {
      pagination
    },
    props: {
      orderId: '',
      contractId: '',
      recordType: '',
      page: {
        type: Number,
        default: () => 1
      },
      limit: {
        type: Number,
        default: () => 20
      }
    },
    created() {
      this.getData();
    },
    data() {
      return {
        datas: [],
        currentPage: this.page,
        pageSize: this.limit,
        total: 0,
        loading: true
      }
    },
    methods: {
      tableRowClassName({ row, rowIndex }) {
        return rowIndex % 2 != 0 ? 'el-f0' : '';
      },
      currentChange(val) {
        this.currentPage = val;
        this.getData();
      },
      sizeChange(val) {
        this.currentPage = 1;
        this.pageSize = val;
        this.getData();
      },
      // 请求数据
      getData() {
        this.loading = true;
        let params = {
          page: this.currentPage,
          limit: this.pageSize,
          customerContractId: this.contractId ? this.contractId : this.$route.query.contractId
        }
        listContractDecomposition(params)
          .then(response => {
            this.loading = false;
            this.datas = response.data;
          })
          .catch(error => {
            this.loading = false;
            console.log('views/administrationCenter/contractmanagement/components/RecordsTableSecond:' + error);
          })
      }
    },
    computed: {
      ...mapGetters(['maxHeight'])
    }
  };
</script>

<style scoped>

</style>
