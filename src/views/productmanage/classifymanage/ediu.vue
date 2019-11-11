<template>
<div>
    <div class="shuttleContent">
        <div class="shuttleHead">
            <span>商品品类：</span><el-input size="medium m-bottom input-396" v-model="shttle"></el-input> 
        </div>
        <el-col :span="11">
        <el-table
                :data="propss"
                border
                ref="selection" 
                @selection-change="checkAll"
                style="width: 100%;margin-bottom:20px;">
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
        </el-col>
        <el-col :span="2">
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
        </el-col>
    
        <el-col :span="11" class="m-bottom">
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
        </el-col>
    </div>
  </div>
</template>
<script>
//新增商品组件
import {
  getNames,
  getTypes
} from 'src/utils/pubilcFn.js';
import { editCategory, attribute, getCategory} from 'api/productmanage/classifymanage/classifymanage';
  export default {
  props:{
      getTabVal: {
        type: Object,
          default: function () {
            return {}
          }
      }
  },
  data() {
    return {
      selectArr:[],  // 右边列表
      leftValue:[],//左边属性筛选数据
      buttonSize: 'large',
      shttle:'',
      propss:[],
      options: [],
      value: '',
      nowSelectData: [], // 左边选中列表数据
      nowSelectRightData: [], // 右边选中列表数据
    };
  },
  created(){
        this.screenFn();
        this.getCategorys();
        this.shttle = this.getTabVal.categoryName;
        this.getList(this.getTabVal.commodityCategoryId, 1).then(res => {
           this.selectArr= res.data;
           this.nowSelectRightData = res.data;
        });        
        this.getList(this.getTabVal.commodityCategoryId, 0).then(res => {
           this.propss= res.data;
           console.log(this.nowSelectData,1);
        });
  },
  methods: {
    getCategorys () {
        console.log(22);
        getCategory({
            commodityCategoryId: this.getTabVal.commodityCategoryId
        }).then(res => {
            res.data.params;
        }).catch(error => {
            console.log('查看品类',error);
        })
    },
    getList (id, selection){
            let data = {
                commodityCategoryId: id,
                isSelection: selection
            }
            return attribute(data);
    },
    filterHandler(value, row, column) { //筛选方法调用
            const property = column['property'];
            return row[property] === value;                
    },
    ediuPost(val){//编辑接口
      let strAttributeIds = this.selectArr.map( item => {
        return item.commodity_attribute_id
      }).join();
      let data= {
        commodityCategoryId: this.getTabVal.commodityCategoryId,
        categoryName:this.shttle,
        commodityAttributeIds:strAttributeIds,
        remarks:val
      };
      editCategory(data).then(res => {
        console.log(res)
      }).catch(error =>{
        console.log('品类管理新增数据接口',error)
      })
    },
    screenFn(){
      // this.propss = this.category; 
    //   this.leftValue = getNames('attribute_name', this.propss);
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
<style scoped>
  .opSetting{
    text-align: center;
    margin-top:30px;
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
</style>