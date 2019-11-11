<template>
<!-- 生成处罚单页面 -->
  <div class="edit_dia">
	  	<!-- 导航栏 -->
	  	<div class="head_nav">
			<breadcrumb :navList="navList"></breadcrumb>
		</div>
		<el-card style="marginBottom: 54px;">
			<div class="genepunishContent" style="marginBottom: 20px;" v-for="(item, index) in genePunish" :key="index">
				<div class="orderbox">
					<ul class="orderlsit">
						<li>定责单号</li>
						<li>{{item.taskDutyNumber}}</li>
						<li>被处罚部门</li>
						<li>{{item.dihukumGroup}}</li>
						<li>被处罚人</li>
						<li>{{item.dutyName}}</li>
					</ul>
					<ul class="orderlsit">
						<li>被处罚人职位</li>
						<li>{{item.dihukumPost}}</li>
					</ul>
					<ul class="orderlsit">
						<li>开单日期</li>
						<li>{{item.sponsorTime}}</li>
						<li>发起人</li>
						<li>{{item.sponsorName}}</li>
					</ul>
				</div>
				<div class="punish_item"> 
					<span>备注</span>
					<el-input type="textarea" v-model="item.punishCause"></el-input>
				</div>

				<div class="punishinput">
					<div class="list">
						<el-input class="width-100" placeholder="处罚金额计算公式" v-model="item.punishMoneyCountType" maxlength="50"></el-input>
					</div>

					<div class="list">
						<el-input-number class="width-100" :controls="false" placeholder="处罚金额" v-model="item.punishMoney" :precision="2" :min="0" ></el-input-number>
						<!-- <el-input class="width-100" placeholder="处罚金额" v-model="item.punishMoney" maxlength="50"></el-input> -->
						<span>元</span>
					</div>
				</div>
			</div>
			
			<div class="backButton">
				<el-button type="primary" @click="submitForm">提 交</el-button>
				<!-- <el-button  @click="selectclo">取 消</el-button> -->
			</div>
		</el-card>
        <!-- </el-dialog> -->
    </div>
</template>
<script>
import breadcrumb from "@/views/components/breadcrumb";

import { getUUID } from "api/pulicJava";
import { 
	listDutyUserMessage, // 处罚页回显
	addTicket, // 添加处罚单
} from 'api/entrepotSet/duty/index';

import {
  getNames,
} from 'src/utils/pubilcFn.js';
import { log } from 'util';
export default {
	components: {
		breadcrumb,
		// pagination,
		// genepunish
		// appealdia
	},
  // name: 'brandmanagement',
	data() {
		return {
			ticketNumber: '',
			navList: [],
			visible: true,
			genePunish: [],
			punish: {
				remarks: '',
				formula: '',
				desc: '',
			},
			

		};
	},

	created() {

		this.getlistDutyUserMessage();
	},
  
	mounted() {
		// 头部面包屑
		this.navList = this.$route.meta;
	},
  	methods: {
		getlistDutyUserMessage() {
			let data = {
				taskDutyId: this.$route.query.taskDutyId,
				statuses: this.$route.query.statuses
			};

			listDutyUserMessage(data).then(res => {
				if(res.status == 200) {
					this.genePunish = res.data.rows;
				}
			}).catch(err => {
				console.log('定责管理:生成处罚单回显 duty/dutylist/genepunish.vue', error);
			})
		},

		//关闭回调函数
		handleClose(){
			this.$emit("close_dialog")
		},
		//点击取消按钮
		selectclo(){
			this.$emit("close_dialog")
		},

      	//确认按钮
		submitForm() {
			if(this.genePunish.length == 0) {
				this.$message({
					message: '无法生成处罚单',
					type: 'warning'
				});
				return;
			}

			let dutyBaseUserDTOS = this.genePunish.map(item => {
				return {
					dutyBaseUserId: item.dutyBaseUserId,
					punishCause: item.punishCause, 
					punishMoney: item.punishMoney, 
					punishMoneyCountType: item.punishMoneyCountType,  
				};
			})

			let data = {
				ticketNumber: this.ticketNumber,
				taskDutyId: this.$route.query.taskDutyId,
				dutyBaseUserDTOS
			};

			getUUID({ serialNumber: 'PU' }).then(res => {
				if(res.status == 200) {
					data.ticketNumber = res.data;
					
					addTicket(data).then(res => {
						this.$message({
							message: "生成处罚单成功",
							type: "success"
						});
						this.$router.push({
							path: "/duty/dutylist"
						});
					}).then(err => {
						console.log('定责管理:添加处罚单 duty/dutylist/genepunish.vue', err);
					})
				}
			}).catch(err => {
				console.log('报废管理:报废管理 增加报废 entrepotSet/scrapmanagement/addScrap.vue', err);	
			})
		},
    },
};
</script>
<style scoped lang='scss'>
.edit_dia{
	.genepunishContent {
		padding: 20px 0;
		position: relative;
		&:nth-of-type(n+2):before {
			position: absolute;
			top: 0px;
			left: 0px;
			content: "";
			width: 100%;
			height: 1px;
			background: #d9d9d9;
		}
	}
	.backButton {
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: 20px;
	}
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

