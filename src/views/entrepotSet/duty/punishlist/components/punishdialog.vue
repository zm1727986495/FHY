<template>
<!-- 处罚单详情弹出框 -->
  <div class="edit_dia">
        <el-dialog title="处罚单详情" :visible.sync="visible" custom-class="customDialogTitle"  width="50%" :before-close="handleClose" :close-on-press-escape="false" :close-on-click-modal="false" :show-close="false">
			<div class="orderbox">
				<ul class="orderlsit">
					<li>处罚单号</li>
					<li>{{dutyData.ticketNumber}}</li>
					<li>定责单号</li>
					<li>{{dutyData.taskDutyNumber}}</li>
					<li>来源单号</li>
					<el-tooltip class="item" effect="dark" :content="dutyData.orderNumber" placement="top">
						<li>{{dutyData.orderNumber}}</li>
					</el-tooltip>
				</ul>
				<ul class="orderlsit">
					<li>发起人</li>
					<li>{{dutyData.initiatorName}}</li>
				</ul>
				<ul class="orderlsit">
					<li>发起时间</li>
					<li>{{dutyData.initiatorTicketTime}}</li>
					<li>处罚计算公式</li>
					<li>{{dutyData.punishMoneyCountType}}</li>
				</ul>
			</div>
			
			<!-- <div  class="table_list lvs attribute m-top20">
				<el-table
					border
					:row-class-name="tableRowClassName"
					:row-style="tableBodycolor"
					:data="dutyData"
					style="width: 100%;">

					<el-table-column
						label="被处罚部门"
						prop="id" sortable align="center">
					</el-table-column>

					<el-table-column
						label="被处罚人"
						prop="name" sortable  align="center">
					</el-table-column>

					<el-table-column
						label="处罚类型"
						prop="phone" sortable  align="center">
						
					</el-table-column>

					<el-table-column
						label="处罚金额"
						prop="name" sortable  align="center" >
						
					</el-table-column>

					<el-table-column
						label="发起时间"
						prop="name" sortable  align="center" >
						
					</el-table-column>

					<el-table-column
						label="状态"
						prop="name" sortable  align="center" >
					</el-table-column>

					<el-table-column
						label="发起人"
						prop="name" sortable  align="center" >
						
					</el-table-column>

					<el-table-column
						label="发起时间"
						prop="name" sortable  align="center" >
					</el-table-column>

				
				</el-table>
			</div> -->

			<!-- 分页 -->
			<!-- <div class="pagination_wrap">
				<pagination
					:current-page="currentPage"
					:pageSize="pageSize"
					:total="total"
					@sizeChange="sizeChange"
					@currentChange="currentChange">
				</pagination>
			</div> -->


			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="selectok">确 定</el-button>
				<el-button  @click="selectclo">取 消</el-button>
			</div>

        </el-dialog>
    </div>
</template>
<script>

import pagination from "@/views/components/pagination";

import {
  getNames,
} from 'src/utils/pubilcFn.js';


import { 
    ticketPeopleDeails, // 处罚页列表查看详情
} from 'api/entrepotSet/duty/index';



export default {
	props: ["ticketPeopleId"],
	components: {
		pagination,
	},
  // name: 'brandmanagement',
  data() {
    return {
		
		visible: true,
		
		dutyData: [], // 表格数据

		// 分页
		currentPage: 1,//当前页数
		pageSize: 20,//总页数
		total: 100,//总条数

    };
  },

  created() {

	  this.getList();
  },
  
  mounted() {
    // 头部面包屑
    this.navList = this.$route.meta;
  },
  methods: {
	

      //关闭回调函数
      handleClose(){
        this.$emit("close_dialog")
      },
      //点击取消按钮
      selectclo(){
        this.$emit("close_dialog")
      },


      //确认按钮
      selectok(){
        this.$emit("confirm_dialog")
      },

		// 分页函数回调
        currentChange(val) {
            this.currentPage = val;
            this.getList();
        },
        // 单页条数改变
        sizeChange(val){
            this.pageSize = val;
            this.getList();
		},

        // 获取表格数据
		getList(){
			let data = {
				ticketPeopleId: this.ticketPeopleId,

				page: this.currentPage,
				limit: this.pageSize
			}
            ticketPeopleDeails(data).then(res => {
				if(res.status == 200) {
					this.dutyData = res.data;
				}
			}).catch(err => {
				console.log('定责管理:处罚列表 查看详情弹框 duty/punishlist/components/punishdialog.vue', err);
			})
		},
		//勾选函数回调
		handleSelectionChange(val) {
			this.elsectVal = val;
			console.log(this.elsectVal);
		},

		// 改变tablebody颜色
		tableBodycolor({ row, rowIndex }) {
		//   return "height: 80px";
		},

		//表格斑马线设置
		tableRowClassName({ row, rowIndex }) {
			return rowIndex % 2 != 0 ? "el-f0" : "";
		}
      
  }
};
</script>
<style scoped lang='scss'>
.edit_dia{
	.orderbox{
		width: 100%;
		font-size: 14px;
		border-top: 1px solid #e4e4e4;
		border-left: 1px solid #e4e4e4;
		.orderlsit{
			display: flex;
			li{
				padding: 0px 10px;
				display: flex;
				align-items: center;
				border-right: 1px solid #e4e4e4;
				border-bottom: 1px solid #e4e4e4;
				line-height: 2.2;
				&:nth-child(odd){
					width: 120px;
					text-align: center;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					overflow: hidden;
				}
				&:nth-child(even){
					flex: 1;
					color: #999;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					display: block;
				}
			}
		}
	}
	.punish_item {
		margin-top: 20px;
		display: flex;
		flex-wrap: nowrap;
		justify-content: center;
		align-items: center;
		>span {
			width: 50px;
			padding-right: 12px;
			text-align: right;
			white-space: nowrap;
			overflow: hidden; 
		}
	}
	.punishinput{
		margin-top: 20px;
		display: flex;
		flex-wrap: nowrap;
		align-items: center;
		justify-content: space-around;
		.list {
			display: flex;
			flex-wrap: nowrap;
			align-items: center;
			>span {
				padding-left: 12px;
			}
		}
	}
		
}
		

</style>

