<template>
  <div class="stockquery">
    <div class="head_list">
      <div class="input-vw">
        <el-input placeholder="物品名称、领用编号" v-model="bindInfo.text" size="medium" class="width-100"></el-input>
      </div>
      <div class="input-vw">
        <div class="stock_time">
          <el-date-picker
            size="medium"
            v-model="bindInfo.dataValue"
            type="daterange"
            range-separator="-"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width:100%"
          ></el-date-picker>
        </div>
      </div>
      <div class="input-vw">
        <el-select v-model="bindInfo.storageId" placeholder="领用状态" size="medium" class="width-100">
          <el-option
            v-for="item in stateList"
            :key="item.storageId"
            :label="item.storageName"
            :value="item.storageId"
          ></el-option>
        </el-select>
      </div>
      <div class="input-vw">
        <el-select v-model="bindInfo.storageId" placeholder="审批状态" size="medium" class="width-100">
          <el-option
            v-for="item in stateList"
            :key="item.storageId"
            :label="item.storageName"
            :value="item.storageId"
          ></el-option>
        </el-select>
      </div>
      <div class="input-vw">
        <el-select v-model="bindInfo.storageId" placeholder="申请类型" size="medium" class="width-100">
          <el-option
            v-for="item in stateList"
            :key="item.storageId"
            :label="item.storageName"
            :value="item.storageId"
          ></el-option>
        </el-select>
      </div>
      <div class="input-vw">
        <el-button type="warning" size="medium" @click="searchFun">查询</el-button>
        <el-button type="primary" size="medium" @click="Reset">重置</el-button>
      </div>
      <div class="input-vw"></div>
      <div class="input-vw"></div>
    </div>

    <!-- <div class="btnsList"></div> -->
  </div>
</template>
<script>
export default {
  data() {
    return {
      stateList: [],
      bindInfo: {}
    };
  },
  mounted() {},
  methods: {
    //查询
    searchFun() {},
    //重置
    Reset() {
      this.bindInfo = {};
    }
  }
};
</script>
<style lang="scss" scoped>
.stockquery {
  .btnsList {
    display: flex;
    justify-content: center;
  }
  .head_list {
    display: flex;
    flex-flow: row wrap;
    justify-content: space-between;
  }
  .input-vw {
    width: calc(((92.5vw - 250px)) / 4);
    margin-bottom: 20px;
    float: left;
    position: relative;
    display: flex;
    align-items: center;
  }
}
</style>
