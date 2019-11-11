<template>
  <!-- 分配货区货位操作组件 -->
  <div class="allocationstock" @click.stop>
    <div class="quantity" v-if='isShow'>
      <div class="input_numbers" v-if="numbers > 0">
        <span>数量：</span>
        <el-input-number size="mini" :min="1" v-model="numberval" 
          :disabled="checkboxs" @change="handleChange(numberval)">
        </el-input-number>
      </div>
      <div class="areaorlocation">
        <ul class="area">
          <li
            v-for="(item,index) in hqdatalist"
            :class="{'areabg': indexs==index}"
            :key="index"
            @click="areaFun(item, index)"
          >{{item.regionName}}</li>
        </ul>
        <ul class="location">
          <li @click="numFun(itm)" v-for="(itm, idx) in hwdatalist" :key="idx">{{itm.siteCode}}</li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import { getTreeById } from "api/entrepotSet/inventorymanagement/stockingstock/stockingstock.js";
export default {
  props:['isShow','storageIds','numbers','checkboxs'],
  data() {
    return {
      storageId: this.storageIds,
      hqdatalist: [],
      hwdatalist: [],
      selectobj: {},
      numberval: 0,
      indexs: 0,
    };
  },
  watch: {
    numbers(val){
      this.numberval = val
    }
  },
  created() {
    let data = {
      // storageId: this.storageId,
      storageId: this.storageId,
      theStaging: 0
    }
    // 请求获取货位树接口
    getTreeById(data).then(res => {
      if(res.status == 200){
        this.hqdatalist = res.data;
        this.areaFun(this.hqdatalist[0], 0)
      }
    })
    .catch(error => {
      console.error("获取备货列表", error);
    });
  },
  methods: {
    handleChange(val) {
      if(val > this.numbers){
        this.$message.error("不得超出勾选数量")
        this.$nextTick(() => {
          this.numberval = this.numbers;
        });
      }
    },
    // 点击货区
    areaFun(item, i) {
      if(item){
        this.indexs = i;
        // 赋值货位
        this.hwdatalist = item.siteList
      }
    },
    // 点击货位
    numFun(data) {
      this.selectobj.regionId = data.regionId;//货区id
      this.selectobj.siteId = data.siteId;//货位id
      this.selectobj.regionSiteName = data.regionSiteName;//货位
      this.selectobj.count = data.count;//仓库数量
      this.selectobj.storageId = data.storageId;//仓库id
      this.selectobj.numberval = this.numberval;//要分配的数量
      this.$emit('closeallocation', this.selectobj)
    }
  }
};
</script>
<style lang="scss" scoped>
.allocationstock{
  // 选择货区样式
  .quantity {
    width: 150px;
    background: #333333;
    color: #fff;
    border-radius: 4px;
    overflow: hidden;
    ul{
      max-height: 200px;
      overflow-y: auto;
      &::-webkit-scrollbar {
        width: 5px;
        height: 1px;
        border-radius: 10px;
      }
      &::-webkit-scrollbar-thumb {
        border-radius: 10px;
        background: #c5c5c5;
      }
      &::-webkit-scrollbar-track{ 
        border-radius: 10px; 
        background-color: #333333; 
      } 
    }
  }
  .input_numbers {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 5px 0;
  }
  .areaorlocation {
    display: flex;
  }
  .li_list{
    width: 75px;
    height: 30px;
    line-height: 30px;
    border-bottom: 1px solid #ebeef5;
    text-align: center;
    cursor: pointer;
    box-sizing: border-box;
    &:last-of-type{
      border-bottom: none;
    }
  }
  .area {
    li {
      @extend .li_list;
      overflow: hidden;
      background: #333333;
    }
    .areabg {
      background: #a2a2a2;
    }
  }
  .location {
    li {
      @extend .li_list;
      overflow: hidden;
    }
  }
}
</style>
