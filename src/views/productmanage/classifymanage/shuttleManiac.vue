<template>
<div>
    <div class="shuttleContent">
        <div class="shuttleHead">
            <span>商品品类：</span><el-input size="medium m-bottom input-396" v-model="shttle"></el-input> 
        </div>
        <div class='contentBox'>
        <!-- <el-col :span="11"> -->
        <el-table
                :data="propss"
                border
                ref="selection" 
                @selection-change="checkAll"
                class='m-bottom20'
                >
                <el-table-column
                type="selection"
                align="center"
                width="50">
                </el-table-column>

                <el-table-column
                    prop="attribute_name"
                    align="center"
                    label="属性名称"
                    width="250"
                    sortable
                    :filters= leftValue :filter-method="filterHandler"
                    >
                </el-table-column>
                
                <el-table-column
                    prop="attribute_unit"
                    align="center"
                    label="计量单位"
                    >
                </el-table-column>          
            </el-table>
        <!-- </el-col> -->

        <!-- <el-col :span="2"> -->
        <div class="opSetting">
            <div @click="handelSelect">
            <el-button icon="el-icon-d-arrow-right" size="medium"  :disabled="nowSelectData.length?false:true" :size="buttonSize" type="primary" >
                选中
            </el-button>
            </div>
            <div class="spacing" @click="handleRemoveSelect">
            <el-button icon="el-icon-d-arrow-left" size="medium"  :disabled="nowSelectRightData.length?false:true" :size="buttonSize" type="primary">
                取消
            </el-button>
            </div>
        </div>
        <!-- </el-col> -->
    
        <!-- <el-col :span="11" class="m-bottom"> -->
            <el-table
                :data="selectArr"
                border
                ref="selection" 
                @selection-change="checkRightAll"
                style="width: 100%">
                <el-table-column
                type="selection"
                align="center"
                width="50"
                >
                </el-table-column>

                <el-table-column
                    prop="attribute_name"
                    label="属性名称"
                    align="center"
                    width="250"
                    >
                </el-table-column>
                <el-table-column
                    prop="attribute_unit"
                    align="center"
                    label="计量单位"
                    >
                </el-table-column>
            </el-table>
        <!-- </el-col> -->
        </div>
    </div>
  </div>
</template>
<script>
//新增商品组件
import {
  getNames,
  getTypes
} from 'src/utils/pubilcFn.js';
import { addCategory } from 'api/productmanage/classifymanage/classifymanage';
  export default {
  props:{
      category: {
        type: Array,
          default: function () {
            return []
          }
      }
  },
  data() {
    return {
      selectArr:[],  // 右边列表
      leftValue:[],//左边属性筛选数据
      buttonSize: 'large',
      shttle:'',
      propss:this.category,//props获取的数据中转变量
      options: [],
      value: '',
      nowSelectData: [], // 左边选中列表数据
      nowSelectRightData: [], // 右边选中列表数据
    };
  },
  created(){
    this.screenFn();

  },
  methods: {
    filterHandler(value, row, column) { //筛选方法调用
            const property = column['property'];
            return row[property] === value;                
    },
    addPost(val){
      console.log(this.selectArr);
      let strAttributeIds = this.selectArr.map( item => {
        return item.commodity_attribute_id
      }).join();
      let data= {
        categoryName:this.shttle,
        commodityAttributeIds:strAttributeIds,
        remarks:val
      };
      addCategory(data).then(res => {
        console.log(res)
      }).catch(error =>{
        console.log('品类管理新增数据接口',error)
      })
    },
    screenFn(){
      // this.propss = this.category; 
      this.leftValue = getNames('attribute_name', this.propss);
    },
    checkAll(val){
      this.nowSelectData = val;
    },
    checkRightAll(val) {
      this.nowSelectRightData = val;
    },
    // 选中
    handelSelect(){   
      this.selectArr = this.handleConcatArr(this.selectArr, this.nowSelectData) 
      this.handleRemoveTabList(this.nowSelectData,  this.propss);
      this.nowSelectData = [];
   },
    // 取消
    handleRemoveSelect() {
      this.propss = this.handleConcatArr(this.propss, this.nowSelectRightData) 
      this.handleRemoveTabList(this.nowSelectRightData,  this.selectArr);
      this.nowSelectRightData = [];
    },
    handleConcatArr(selectArr, nowSelectData) {
      let arr = [];
      arr = arr.concat(selectArr, nowSelectData); 
      return arr;
    },
    handleRemoveTabList(isNeedArr,  originalArr) {
      if(isNeedArr.length && originalArr.length) {
         for(let i=0; i<isNeedArr.length; i++) {
            for(let k=0; k<originalArr.length; k++) {
              if(isNeedArr[i]["attribute_name"] === originalArr[k]["attribute_name"]) {
                originalArr.splice(k, 1);   
              }
            }
         }
      }
    }
  },
 
};
</script>
<style scoped lang='scss'>
  .opSetting{
    text-align: center;
    margin:30px 20px 0 20px;

  }
  .spacing{
    margin-top:10px;
  }
  .shuttleHead{
      width: 100%;
      /* display: flex;
      align-items: center; */
  }
    .shuttleContent{
    max-height: 400px;
    overflow: auto;
    }
    .contentBox{
      display:flex;
      justify-content:space-between;
    }
</style>