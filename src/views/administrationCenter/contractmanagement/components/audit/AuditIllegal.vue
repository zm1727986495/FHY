<template>
  <div>
    <IllegalPunishment v-if="contractDetails.contractMoney" @successFn="successFn"></IllegalPunishment>
    <el-tabs type="border-card" v-model="tabActive">
      <el-tab-pane label="定责提醒" name="1">
        <IllegalRecordsTable :type="1" v-if="tabActive == 1" ref="IllegalRecordsTable"></IllegalRecordsTable>
      </el-tab-pane>
      <el-tab-pane label="违规处罚记录" name="2">
        <IllegalRecordsTable :type="0" v-if="tabActive == 2" ref="IllegalRecordsTable"></IllegalRecordsTable>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import IllegalRecordsTable from '@/views/administrationCenter/contractmanagement/components/IllegalRecordsTable';
  import IllegalPunishment from '@/views/administrationCenter/contractmanagement/components/IllegalPunishment';
  import { mapGetters } from 'vuex';
  export default {
    components: {
      IllegalRecordsTable,
      IllegalPunishment
    },
    data() {
      return {
        tabActive: '1'
      };
    },
    methods: {
      // 成功或失败回调
      successFn(val) {
        if (val) {
          this.$refs.IllegalRecordsTable.getData();
        }
      }
    },
    computed: {
      ...mapGetters([
        'contractDetails'
      ])
    }
  };
</script>
