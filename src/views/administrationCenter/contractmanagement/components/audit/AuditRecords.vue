<template>
  <el-tabs type="border-card" v-model="tabActive">
    <el-tab-pane label="折扣特批" name="1">
      <RecordsTabs record-type="1" v-if="tabActive == 1" :orderId="orderId" :contractId="contractId"></RecordsTabs>
    </el-tab-pane>
    <el-tab-pane label="工期加急" name="2">
      <RecordsTabs record-type="2" v-if="tabActive == 2" :orderId="orderId" :contractId="contractId"></RecordsTabs>
    </el-tab-pane>
    <el-tab-pane label="合同违规审核" name="3">
      <RecordsTabs record-type="3" v-if="tabActive == 3" :orderId="orderId" :contractId="contractId"></RecordsTabs>
    </el-tab-pane>
    <el-tab-pane label="合同信息审核" name="6">
      <RecordsTabs record-type="6" v-if="tabActive == 6" :orderId="orderId" :contractId="contractId" type="contract"></RecordsTabs>
    </el-tab-pane>
    <el-tab-pane label="合同图纸审核" name="4">
      <RecordsTabs record-type="4" v-if="tabActive == 4" :orderId="orderId" :contractId="contractId" type="contract"></RecordsTabs>
    </el-tab-pane>
    <el-tab-pane label="合同拆单" name="5">
      <RecordsTableSecond  record-type="5" v-if="tabActive == 5" :orderId="orderId" :contractId="contractId"></RecordsTableSecond>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
  import RecordsTabs from "@/views/administrationCenter/contractmanagement/components/RecordsTabs";
  import RecordsTableSecond from "@/views/administrationCenter/contractmanagement/components/RecordsTableSecond";
  export default {
    components: {
      RecordsTabs,
      RecordsTableSecond
    },
    data() {
      return {
        tabActive: '1'
      };
    },
    props: ['contractId', 'orderId']
  };
</script>
