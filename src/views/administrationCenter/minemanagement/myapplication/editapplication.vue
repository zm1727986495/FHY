<template>
  <!-- index -->
  <div >
    <div class="apper">
		<!-- 导航栏 -->
		<div class="head_nav">
			<breadcrumb :navList="navList"></breadcrumb>
		</div>

		<!-- 按钮组 -->
		<el-card class="apply_a m-bottom">
			<div class="iconBox gift_title_btom">
				<i class="Icon"></i>
				<span>选择订单</span>
				<span class="status">当前状态： <span class="statusContent">代签合同</span></span>
			</div>

			<div class="order_info m-top20">
				<div class="order_info_input m-bottom15">
					<el-input class="input_250" placeholder="订单号" disabled></el-input>
					<el-button type="primary" size="medium" class="reset_btn m-left20" @click="openOrderDia">选择</el-button>
				</div>

				<!-- 选择订单弹框 -->
				<orderdia
					:visible = "orderdia_vis"
					@orderdia-clo = "orderdiaClose" 
					@selOrderid = "selOrderid">
				</orderdia>

				<!-- 订单详情 -->
				<orderdetail :orderId="1"></orderdetail>
			</div>
		</el-card>

		<el-tabs type="border-card" @tab-click="handleClick" v-model="activeName">
			<el-tab-pane label="折扣申请" name=0 v-if="pageStatus == 0 || pageValid == true">
				<discountapply></discountapply>

			</el-tab-pane>

			<el-tab-pane label="工期加急申请" name = 1 v-if="pageStatus == 1 || pageValid == true">
				<urgentapply></urgentapply>
			</el-tab-pane>

			<el-tab-pane label="开票申请" name = 2 v-if="pageStatus == 2 || pageValid == true">
				<invoiceapply></invoiceapply>
			</el-tab-pane>

			<el-tab-pane label="返点申请" name = 3 v-if="pageStatus == 3 || pageValid == true">
				<rebatesapply></rebatesapply>
			</el-tab-pane>

			<el-tab-pane label="退款申请" name = 4 v-if="pageStatus == 4 || pageValid == true">
				<refundapply></refundapply>
			</el-tab-pane>

			<el-tab-pane label="退货退款申请" name = 5 v-if="pageStatus == 5 || pageValid == true">
				退货退款申请
                <regoodsapply :status="5"></regoodsapply>
			</el-tab-pane>

			<el-tab-pane label="换货申请" name = 6 v-if="pageStatus == 6 || pageValid == true">
				        换货申请
                <regoodsapply :status="6"></regoodsapply>
			</el-tab-pane>

			<el-tab-pane label="家装代收合同申请" name = 7 v-if="pageStatus == 7 || pageValid == true">
				<collectionapply></collectionapply>
			</el-tab-pane>
		</el-tabs>
     
    </div>
  </div>
</template>
<script>

import pagination from "@/views/components/pagination";
import breadcrumb from "@/views/components/breadcrumb";
import orderdetail from "../../../order/components/orderdetail";

// import orderdetail from "./components/orderdetail";   //订单详情
import orderdia from "./components/orderdia";  //选择订单弹框

import discountapply from "./components/discountapply";   //折扣申请
import urgentapply from "./components/urgentapply";   //加急申请
import collectionapply from "./components/collectionapply";   //代收申请
import invoiceapply from "./components/invoiceapply";   //开票申请
import rebatesapply from "./components/rebatesapply";   // 返点申请
import refundapply from "./components/refundapply";   // 退款申请
import regoodsapply from "./components/regoodsapply";   // 退货退款申请 and 换货申请 

import spot from '@/assets/images/spot.png';
export default {
    components: {
      breadcrumb,
      pagination,
      orderdia,  // 选择订单弹框
      orderdetail, // 订单详情
      discountapply, // 折扣申请  
      urgentapply, // 加急申请
      collectionapply, // 代收申请
      invoiceapply, // 开票申请
      rebatesapply, // 返点申请
      refundapply,  // 退款申请
      regoodsapply,  // 退货退款申请 and 换货申请 
  },
	// name: 'brandmanagement',
	data() {
		return {
			activeName: 0,
			currentPage: 1, // 当前页数
			pageSize: 20, // 总页数
			total: 100,  // 总条数
			spot,   // 操作图片
			navList: [], //头部面包屑
			orderdia_vis : false,
			status: 0,
			isAudit: false, //是否是审核页面
			pageStatus: this.$route.query.pageStatus, //是由哪个申请页面进入该页面的
			pageValid: false,
		};
	},

	created() {
		if(this.$route.path == "/minemanagement/editapplication" || this.$route.path == "/minemanagement/addapplication" || this.$route.path == "/minemanagement/audit"){
			this.pageValid = true;
		}
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
			this.status = tab.name
			console.log(tab.name);
		},


	}
};
</script>
<style scoped lang='scss'>
.apply_a{
    position: relative;
    .gift_title_btom{
        // border-bottom: 1px solid rgb(151, 150, 150);
        padding-bottom: 8px;
        width: 250px;
        .status {
            position: absolute;
            top: 20px;
            right: 20px;
            font-size: 14px;
            color: #999;
            white-space: nowrap;
            .statusContent {
                font-size: 14px;
                color:#FF9900;
            }
        }
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

