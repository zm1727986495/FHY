
<template>
    <div class="applypage">
      
      

		<el-tabs @tab-click="tabclickH" type="border-card">
			<el-tab-pane label="采购合同1" name="0">
				<div class="conBuy">

                    <div class="roommarks">
                        <span>房间:</span>
                        <span>主卧(房间备注)</span>
                    </div>

                    <div class="apply">
                        <span>供应商</span>
                        <span>广州柜橱工厂</span>
                    </div>

                    <div class="evalitem">
                        <span>是否入出库</span>
                        <el-radio-group v-model="isware">
                            <el-radio :label="1">是</el-radio>
                            <el-radio :label="0">否</el-radio>
                        </el-radio-group>
                    </div>
                </div>
				<contable></contable>


					<!-- <div class="bottom_btnlist">
						<el-button type="primary" @click="submitForm('ruleForm')">保 存</el-button>
						<el-button type="primary" @click="submitForm('ruleForm')">提 交</el-button>
						<el-button @click="submitForm('ruleForm')">取 消</el-button>
					</div> -->

			</el-tab-pane>

          	<el-tab-pane label="采购合同2" name="1">
			  
		  	</el-tab-pane>
          <el-tab-pane label="采购合同3" name="2">
              <div class="table_warp_box">
                

              </div>
          </el-tab-pane>
           
                <div class="conButtons">
                    <el-button size="small" class="button-96">添加商品</el-button>   
                    <el-button size="small" class="button-96">删除</el-button> 
                    <el-button size="small" class="button-96">保存</el-button> 
                    <el-button size="small" class="button-96">执行完成</el-button> 
                </div>
            
        </el-tabs>

        


    </div>
  
</template>
<script>

import pagination from "@/views/components/pagination";
import breadcrumb from "@/views/components/breadcrumb";


import contable from "./contable";

import spot from '@/assets/images/spot.png';
export default {
    components: {
      breadcrumb,
      pagination,
      contable
  },
  // name: 'brandmanagement',
  data() {
    return {
	  navList: [],//头部面包屑
	  // begin
        isware: false,
	
	  // end
      
      
    };
  },
  
  mounted() {
    // 头部面包屑
    this.navList = this.$route.meta;
  },
  methods: {
    submitForm(formName) {
      
    },
    // tab页选择
	tabclickH(e) {
		// let data = this.searchdatas();

		if (e.name == 0){ // 基础信息
			// let data = 

			// this.status = 0;
			// this.getList(data);
		} else if (e.name == 1) { // 售后跟进记录

			// this.status = 1;
			// this.getList(data);
		} else if (e.name == 2) { // 相关附件

			// this.status = 2;
			// this.getList(data);
		}
	},

    
  }
};
</script>
<style scoped lang='scss'>

    .bottom_btnlist{
        height: 60px;
        display: flex;
        align-items: center;
        justify-content: center;
        // border: 1px solid red;
    }
  
    .conBuy {
        color: #303133;
        display: flex;
        flex-wrap: nowrap;
        >div {
            display: flex;
            color: #303133;
            flex-wrap: nowrap;
            margin-left: 15px;
            span {
                color: #303133;
            }
        }
    }    

</style>

