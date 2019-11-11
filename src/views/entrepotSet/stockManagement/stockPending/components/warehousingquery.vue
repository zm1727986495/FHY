<template>
  <div>
    <div class="head_list">
      <div class="input-vw">
        <el-input
          placeholder="订单号/采购合同号/到货单号/采购单号/来源单号/入库单号"
          v-model.trim="bindInfo.text"
          @keyup.enter.native='searchFun()'
          size="medium"
          class="width-100"
        ></el-input>
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
        <el-select filterable clearable v-model="bindInfo.storageId" placeholder="所属仓库" size="medium" class="width-100">
          <el-option
            v-for="item in stateList"
            :key="item.storageId"
            :label="item.storageName"
            :value="item.storageId"
          ></el-option>
        </el-select>
      </div>
      <div class="input-vw">
        <div class="btnsList">
          <el-button type="warning" class="button-fc" size="medium" @click="searchFun" :loading='loading'>查询</el-button>
          <el-button type="primary" size="medium" @click="Reset">重置</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getStorageList } from "api/entrepotSet/stockManagement/stockPending/stockPending";
export default {
  props: {
    obtainFun: Function,
    loading:Boolean
  },
  data() {
    return {
      stateList: [], //仓库列表
      bindInfo: {} //查询条件
    };
  },
  mounted() {
    this.getWarehouse();
  },
  methods: {
    //获取仓库
    getWarehouse() {
      getStorageList()
        .then(res => {
          this.stateList = res.data;
        })
        .catch(error => {
          console.error("获取所属仓库", error);
        });
    },
    //查询
    searchFun() {
      this.$emit("obtainFun", this.bindInfo);
    },
    //重置
    Reset() {
      this.bindInfo = {};
      this.$emit("obtainFun", this.bindInfo,1);
    }
  }
};
</script>
<style lang="scss" scoped>
// .btnsList {
//   width: 100%;
//   display: flex;
//   justify-content: center;
// }
.head_list {
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
}
.input-vw {
  width: calc(((92.5vw - 250px)) / 4);
  margin-bottom: 5px;
  float: left;
  position: relative;
  display: flex;
  align-items: center;
}
</style>
