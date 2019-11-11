<template>
  <div style="padding-left: 20px; min-height: 200px">
    <span>电子合同</span>
    <el-button type="text" class="m-left20" @click="accessoryPreview" :disabled="!accessoryUrl" :loading="loading">点击查看</el-button>
  </div>
</template>
<script>
  import { getPreviewContract } from 'api/order/contract/contract';
  export default {
    name: "Appendix",
    created() {
      this.getData();
    },
    data() {
      return {
        accessoryApi: 'https://fanhuayiju.oss-cn-beijing.aliyuncs.com/',
        accessoryUrl: '',
        loading: true
      }
    },
    methods: {
      getData() {
        let data = {
          orderId: this.$route.query.orderId,
          customerContractId: this.$route.query.contractId
        }
        getPreviewContract(data).then(res =>{
          this.loading = false;
          if (res.status == 200) {
            this.accessoryUrl = res.data;
          } else {
            this.$message.error(res.message || '获取合同附件失败');
          }
        }).catch(error =>{
          this.loading = false;
          console.log('views/contractmanagement/components/Appendix.vue-getData:' + error);
        })
      },
      accessoryPreview() {
        window.open(this.accessoryApi + this.accessoryUrl);
      }
    }
  }
</script>

<style scoped>

</style>
