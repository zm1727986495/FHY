<template>
  <div class="wrapper">
    <div class="apper">
      <div class="head_nav">
        <breadcrumb :navList="navList"></breadcrumb>
      </div>
      <el-tabs type="border-card" v-model="tabActive">
        <el-tab-pane label="基本信息" name="basicInfo">
          <basicInfo ref="basicInfo" v-if="tabActive == 'basicInfo'"></basicInfo>
        </el-tab-pane>
        <el-tab-pane label="优惠类型" name="ruleType" :disabled="setTabDisabled">
          <ruleType ref="ruleType" v-if="tabActive == 'ruleType'"></ruleType>
        </el-tab-pane>
        <el-tab-pane label="规则互斥" name="ruleMutex" :disabled="setTabDisabled">
          <ruleMutex ref="ruleMutex" v-if="tabActive == 'ruleMutex'"></ruleMutex>
        </el-tab-pane>
      </el-tabs>
      <div class="btnList m-top20 m-bottom20 center">
        <el-button type="primary" @click="submitActivity('basicModel')">保 存</el-button>
        <el-button @click="goBack">取 消</el-button>
        <el-button type="warning" class="button-fc" @click="publishActivity" :disabled="!canPublish">发 布</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import breadcrumb from '@/views/components/breadcrumb';
  import basicInfo from '@/views/systemcenter/activityMaintain/components/basicInfo';
  import ruleMutex from '@/views/systemcenter/activityMaintain/components/ruleMutex';
  import ruleType from '@/views/systemcenter/activityMaintain/components/ruleType';
  import selectCommodity from '@/views/components/selectCommodity';
  import { editPublish } from 'src/api/administrationCenter/sysParamsSetting/activityMaintain';
  export default {
    name: 'addActivity',
    components: {
      breadcrumb,
      basicInfo,
      ruleMutex,
      ruleType,
      selectCommodity
    },
    created() {
      let selectedInfo = {
        brandList: [],
        categoryList: [],
        priceStrategyId: '',
        activityId: this.$route.query.activityId || '',
        activityStatus: ''
      };
      this.$store.dispatch('SET_SELECTED_INFO', selectedInfo);
    },
    data() {
      return {
        navList: [],
        tabActive: 'basicInfo',
        activityId: this.$route.query.activityId || ''
      }
    },
    methods: {
      // 取消 返回上一页
      goBack() {
        this.$router.go(-1);
      },
      // 发布活动
      publishActivity() {
        let params = {
          activityId: [],
          activityStatus: 0
        }
        params.activityId.push(Number(this.activityId));
        editPublish(params)
          .then(response => {
            this.$message.success('操作成功');
            this.goBack();
          })
          .catch(error => {
            this.$message.error('操作失败');
            console.log('activity/editPublish:' + error);
          });
      },
      // 保存活动-添加活动基本信息
      submitActivity() {
        this.$refs.basicInfo.submitActivity('basicModel');
      }
    },
    computed: {
      ...mapGetters([
        'selectedInfo'
      ]),
      setTabDisabled() {
        return this.selectedInfo.activityId == '' || this.selectedInfo.activityId == null || this.selectedInfo.activityId == undefined;
      },
      // 是否可以发布
      canPublish() {
        return this.selectedInfo.activityStatus == 0;
      }
    }
  }
</script>
<style scoped>
  .rulesBox {
    height: 300px;
  }
  .rulesBox .itemBox {
    height: 100%;
    position: relative;
    overflow-y: auto;
  }
  .rulesBox .leftBox .editRules{
    width: 100%;
    line-height: 30px;
    text-align: center;
    position: absolute;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%, -50%);
    -moz-transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
    -o-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
  }
  .rulesBox .leftBox, .rulesBox .rightBox {
    border: 1px solid #e1e1e1;
    -webkit-border-radius: 3px;
    -moz-border-radius: 3px;
    border-radius: 3px;
  }
  .rulesBox .rightBox{
    padding: 15px;
  }
  .basicInfo .el-select {
    display: block;
  }
  .rulesBox .el-checkbox {
    display: block;
    margin-right: 0;
    margin-bottom: 5px;
  }
  .rulesButton {
    position: absolute;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%, -50%);
    -moz-transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
    -o-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
  }
  .form-item-table {
    margin-left: 130px;
    margin-bottom: 15px;
  }
  .rulesDialogForm .line{
    padding-left: 10px;
    text-align: left;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }
</style>
