<template>
  <!-- index -->
  <div >
    <div class="apper">


      <!-- 导航栏 -->
      <div class="head_nav">
        <breadcrumb :navList="navList"></breadcrumb>
      </div>

    

      <!-- 按钮组 -->
      <el-card class="apply_a">

        <div class="iconBox gift_title_btom">
          <i class="Icon"></i>
          <span>选择订单</span>
        </div>

        <div class="order_info m-top20">
          <div class="order_info_input m-bottom15">
            <el-input class="input_250" placeholder="订单号" disabled></el-input>
            <el-button type="primary" size="medium" class="reset_btn m-left20" @click="openOrderDia">选择</el-button>
          </div>


          <!-- 选择订单弹框 -->
          <!-- <orderdia
          :visible = "orderdia_vis"
          @orderdia-clo = "orderdiaClose" 
          @selOrderid = "selOrderid"
          ></orderdia> -->
          <!-- 订单详情 -->
          <orderdetail></orderdetail>

        </div>
      </el-card>

      <el-tabs type="border-card" @tab-click="handleClick">
        <el-tab-pane label="折扣申请" name=0>
          <discountapply></discountapply>
        </el-tab-pane>
        <el-tab-pane label="工期加急申请" name=1>
          <urgentapply></urgentapply>
        </el-tab-pane>
        <el-tab-pane label="开票申请" name=2>
          <invoiceapply></invoiceapply>
        </el-tab-pane>
        <el-tab-pane label="返点申请" name=3>返点申请</el-tab-pane>
        <el-tab-pane label="退款申请" name=4>退款申请</el-tab-pane>
        <el-tab-pane label="退货退款申请" name=5>退货退款申请</el-tab-pane>
        <el-tab-pane label="换货申请" name=6>换货申请</el-tab-pane>
        <el-tab-pane label="家装代收合同申请" name=7><collectionapply></collectionapply></el-tab-pane>
      </el-tabs>
     

        
  
                

        

     
        
      <!-- </el-card> -->
    </div>
  </div>
</template>
<script>

import pagination from '../../../components/pagination';
import breadcrumb from "../../../components/breadcrumb";
// import orderdia from "../../giftmanagement/giftgrant/orderdia";                     //选择订单弹框
import orderdetail from "../../../order/components/orderdetail";                    //订单详情
import discountapply from "./components/discountapply";                             //折扣申请
import urgentapply from "./components/urgentapply";                                 //加急申请
import collectionapply from "./components/collectionapply";                         //代收申请
import invoiceapply from "./components/invoiceapply";                               //开票申请
import spot from '@/assets/images/spot.png';
export default {
    components: {
      breadcrumb,
      pagination,
      // orderdia,//选择订单弹框
      orderdetail,//订单详情
      discountapply,//折扣申请  
      urgentapply,//加急申请
      collectionapply,//代收申请
      invoiceapply,//开票申请
      
  },
  // name: 'brandmanagement',
  data() {
    return {
      currentPage: 1,//当前页数
      pageSize: 20,//总页数
      total: 100,//总条数
      spot,//操作图片
      navList: [],//头部面包屑
      orderdia_vis : false,

      
    };
  },
  
  mounted() {
    // 头部面包屑
    this.navList = this.$route.meta;
  },
  methods: {


    //弹出订单选择弹框
    openOrderDia(){
      this.orderdia_vis = true;
    },

    //关闭订单选择弹框
    orderdiaClose(){
      this.orderdia_vis = false;
    },

    //确认选择订单
    selOrderid(val){
      this.orderdia_vis = false;
      this.id = val;
    },

    //tab切换
    handleClick(tab) {
      console.log(tab.name);
    },








    //查询按钮获取
    getListFun(form){
      console.log(form);
    },

    //跳转详情
    allocationdetail(){
      this.$router.push({
        path: "createallocated",
        query:{
          
        }
      });

    },

    


    //翻页方法
    sizeChange(val) {
        this.currentPage = 1;
        this.pageSize = val;
        this.getListData();
    },

    //翻页方法
    currentChange(val) {
        this.currentPage = val;
        this.getListData();
    },

    
    
    // 改变tablebody颜色
    tableBodycolor({ row, rowIndex }) {
      return "height: 80px";
    },

    //表格斑马线设置
    tableRowClassName({row, rowIndex}) {
        return rowIndex%2 != 0 ? 'el-f0' : '';
    },
    
    
  }
};
</script>
<style scoped lang='scss'>
.apply_a{
  .gift_title_btom{
    // border-bottom: 1px solid rgb(151, 150, 150);
    padding-bottom: 8px;
    width: 250px;
  }
  .order_info{
    .input_250{
      width: 250px;
    }
    .order_info_input{
      margin-left: 2.5%;
    }
  }  
}
.btn_list_1{
  height: 55px;
  float: left;
}

.pagination_wrap {
  text-align: center;
  height: 50px;
  /* line-height: 50px; */
  display: flex;
  align-items: center;
  justify-content: center;
}


</style>

