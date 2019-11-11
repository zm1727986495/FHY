<template>
  <div>
    <el-tabs type="border-card" v-model="tabActive" @tab-click="tabClick" v-loading="loading">
      <el-tab-pane label="记录" name="1">
        <RecordsTableFirst :datas="datas1"></RecordsTableFirst>
      </el-tab-pane>
      <el-tab-pane label="工作流" name="2">
        <RecordsTableFirst :datas="datas2"></RecordsTableFirst>
      </el-tab-pane>
    </el-tabs>
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
  import RecordsTableFirst from '@/views/administrationCenter/contractmanagement/components/RecordsTableFirst';
  import { listDiscountAuditLogging, listAuditRecord, contractAuditRecords } from 'src/api/administrationCenter/contractmanagement/contractmanagement';
  export default {
    components: {
      RecordsTableFirst,
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
    data() {
      return {
        currentPage: this.page,
        pageSize: this.limit,
        total: 0,
        datas1: [],
        datas2: [],
        tabActive: '1',
        loading: false
      }
    },
    created() {
      // console.log(this.currentPage, this.pageSize, this.recordType);
      this.getData();
    },
    methods: {
      currentChange(val) {
        this.currentPage = val;
        this.getData();
      },
      sizeChange(val) {
        this.currentPage = 1;
        this.pageSize = val;
        this.getData();
      },
      // 切换标签
      tabClick(tab) {
        this.currentPage = 1;
        this.getData();
      },
      // 请求数据
      getData() {
        this.loading = true;
        console.log(this.recordType)
        // 折扣特批 和 工期加急
        if (this.recordType == 1 || this.recordType == 2) {
          this.getData12();
        }
        // 图纸审核记录-信息审核记录
        if (this.recordType == 4 || this.recordType == 6) {
          this.getData4(this.recordType);
        }
        // 合同违规审核
        if (this.recordType == 3) {
          this.getData3();
        }
      },
      // 工期加急和折扣特批
      getData12() {
        let applyType = this.recordType == 1 ? 'DISCOUNT_APPLY' : 'URGENT_APPLY';
        let params = {
          applyType,
          orderId: this.orderId ? this.orderId : this.$route.query.orderId
        }
        if (this.tabActive == 1) { // 记录
          listDiscountAuditLogging(params)
            .then(response => {
              this.loading = false;
              let datas = response.data.rows;
              datas.forEach(item => {
                item.auditAtName = item.createAt;
                item.auditOpinion = item.rejectionReasons;
                item.auditResult = item.operationStatus
              })
              this.datas1 = datas;
              this.total = response.data.total;
            })
            .catch(error => {
              this.loading = false;
              console.log('views/contractmanagement/components/RecordsTabs.vue:getData12' + error)
            })
        } else { // 工作流
          this.loading = false;
        }
      },
      // 图纸审核记录-信息审核记录
      getData4(recordType) {
        let auditType = recordType == 4 ? 1 : 2;
        let params = {
          customerContractId: this.contractId ? this.contractId : this.$route.query.contractId,
          auditType
        };
        listAuditRecord(params)
          .then(response => {
            this.loading = false;
            this.datas1 = response.data.rows;
            this.total = response.data.total;
          })
          .catch(error => {
            console.log('views/contractmanagement/components/RecordsTabs.vue:getData4' + error)
          })
      },
      // 合同违规审核记录
      getData3() {
        let params = {
          orderId: this.orderId ? this.orderId : this.$route.query.orderId
        };
        contractAuditRecords(params)
          .then(response => {
            this.loading = false;
            this.datas1 = response.data.rows;
            this.total = response.data.total;
          })
          .catch(error => {
            console.log('views/contractmanagement/components/RecordsTabs.vue:getData4' + error)
          })
      }
    }
  }
</script>

<style scoped>

</style>
