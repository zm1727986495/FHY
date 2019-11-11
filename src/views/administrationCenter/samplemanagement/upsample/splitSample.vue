<template>
    <div class="">
      <!-- 导航栏 -->
      <div class="head_nav">
        <breadcrumb :navList="navList"></breadcrumb>
      </div>

			<!-- 订单详情 -->
			<orderdetail></orderdetail>
			<!-- 上样清单 --> 
      <div class="uplist">
        
        <div class="textitle">
          <div class="titlecals">上样清单</div>
        </div>
        <div class="tableBox tableBoxMax">
        <div class="multipleTable purchaseTable">
          <uplist  :datas="data1"></uplist>
        </div>
        </div>
      </div>
      <div class="conlist">
        <!-- 采购合同 -->
      <PurchaseContract></PurchaseContract>
      </div>
    

		<div class="bottom_btnlist">
			<el-button type="primary" @click="submitForm('ruleForm')">保 存</el-button>
			<el-button type="primary" @click="submitForm('ruleForm')">提 交</el-button>
			<el-button @click="submitForm('ruleForm')">取 消</el-button>
		</div>


    </div>
  
</template>
<script>

import pagination from "@/views/components/pagination";
import breadcrumb from "@/views/components/breadcrumb";
import orderdetail from '../../../order/components/orderdetail'; // 订单编号
import uplist from "./components/uplist";
import contlist from "./components/contlist";
// import PurchaseContract from "./components/PurchaseContract";
import PurchaseContract from '@/views/administrationCenter/contractmanagement/components/PurchaseContract';

import spot from '@/assets/images/spot.png';
export default {
    components: {
      breadcrumb,
      pagination,
      orderdetail,
	  uplist,
    contlist,
    PurchaseContract
  },
  // name: 'brandmanagement',
  data() {
    return {
	  navList: [],//头部面包屑
	  
    data1 : [
            {
              roomId: 1,
              roomName: '一级分类1',
              isShow: true,
              children: [
                {
                  roomId: 11,
                  roomName: '二级分类1-1',
                  children: [],
                  products: [
                    {
                      id: 1,
                      name: '商品1-2-2',
                      checked:false,
                      price: 200
                    },
                    {
                      id: 2,
                      name: '商品1-2-3',
                      checked:false,
                      price: 100
                    }
                  ]
                }
              ]
            },
            {
              roomId: 2,
              roomName: '一级分类2',
              children: [
                {
                  roomId: 22,
                  roomName: '二级分类2-1',
                  children: [
                    {
                      roomId: 33,
                      roomName: '三级分类2-1',
                      children: [],
                      products: [
                        {
                          id:2,
                          name: '商品2-3-1',
                          checked:false,
                          price: 300
                        },
                        {
                          id:2,
                          name: '商品2-3-2',
                          checked:false,
                          price: 200
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              roomId: 3,
              roomName: '一级分类3',
              children: [],
              products: [
                {
                  id:3,
                  name: '商品3-1-1',
                  checked:false,
                  price: 100
                },
                {
                  id:4,
                  name: '商品3-1-2',
                  checked:false,
                  price: 500
                }
              ]
            }
          ],
	
	
      
      
    };
  },
  
  created() {
    this.$store.dispatch('QUERY_TABLEDATA', this.data1);
  },
  mounted() {
    // 头部面包屑
    this.navList = this.$route.meta;
  },
  methods: {
    submitForm(formName) {
      
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
  .uplist{
    .textitle {
      padding:10px 0px;
      .titlecals{
        top: 0px;
      }
    }
    
  }
  .conlist{
    padding:10px 0px;
  }
	

</style>

