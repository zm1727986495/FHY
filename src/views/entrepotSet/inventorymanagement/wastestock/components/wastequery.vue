<template>
  <div>
    <div class="head_list">
      <div class="input-vw">
          <el-input placeholder="订单号/合同号/采购合同号/商品名称/货位码"  @keyup.enter.native='searchFun()' v-model="textsearch" size="medium" class='width-100'>
            <i slot="suffix" class="el-input__icon el-icon-search"></i>
          </el-input>
      </div>
      <div class="input-vw">
        <div class="stock_time">
          <el-date-picker
            size="medium"
            v-model="dataValue"
            type="daterange"
            range-separator="-"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style='width:100%'
          ></el-date-picker>
        </div>
      </div>
      <div class="input-vw">
          <el-select v-model="ownershipType" placeholder="所属仓库" size="medium" class="width-100">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
      </div>
      <div class="input-vw">
          <el-select v-model="billType" placeholder="所属网点" size="medium" class="width-100">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
      </div>
       <div class="input-vw">
          <el-select v-model="billType" placeholder="供应商" size="medium" class="width-100">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
      </div>
       <div class="input-vw">
          <el-select v-model="billType" placeholder="商品类型" size="medium" class="width-100">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
      </div>
      <div class="input-vw">
        <div class="btnsList">
          <el-button type="warning" class="button-fc" size="medium" @click="searchFun">查询</el-button>
          <el-button type="primary" size="medium" @click="Reset">重置</el-button>
        </div>
      </div>
      <div class="input-vw"></div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      options: [],
      textsearch: "",
      dataValue: [],
      ownershipType: "",
      billType: ""
    };
  },
  methods: {
    searchFun() {
      //查询
    },
    Reset() {
      //重置
    }
  }
};
</script>
<style lang="scss" scoped>
.head_list {
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
}
.input-vw {
  width: calc(((94vw - 250px)) / 4);
  margin-bottom: 20px;
  float: left;
  position: relative;
  display: flex;
  align-items: center;
}

</style>
