<template>
  <div>
    <div class="head_list">
      <div class="input-vw">
          <el-input placeholder="订单号/合同号/采购合同号/商品名称/货位码" v-model="textsearch" size="medium" class='width-100'></el-input>
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
          <el-select v-model="billType" placeholder="盘点方式" size="medium" class="width-100">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
      </div>
       <div class="input-vw">
          <el-select v-model="billType" placeholder="盘点类型" size="medium" class="width-100">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
      </div>
       <div class="input-vw">
          <el-select v-model="billType" placeholder="盘点状态" size="medium" class="width-100">
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
          <el-button @click="searchFun" type="warning" class="button-fc" size="medium">查询</el-button>
          <el-button @click="Reset" type='primary' size="medium">重置</el-button>
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
		width: 100%;
		display: flex;
		flex-flow: row wrap;
		// justify-content: space-between;
		.input-vw {
			display: flex;
			flex-wrap: nowrap;
			// justify-content: center;
			align-items: center;
			margin: 10px 0px;
			padding: 0px 5px;
			width: 25%;
			>div{
				width: 100%;
			}
		}
	}

</style>
