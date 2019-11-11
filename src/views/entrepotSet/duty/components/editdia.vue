<template>
<!-- 编辑弹出框 -->
  <div class="edit_dia">
        <el-dialog title="编辑" :visible.sync="visible" custom-class="customDialogTitle"  width="35%" :close-on-press-escape="false" :close-on-click-modal="false" :show-close="false">
			<div class="orderbox">
				<ul class="orderlsit">
					<li>定责单号</li>
					<li>{{dutyData.taskDutyNumber}}</li>
					<li>被定责人</li>
					<li>{{dutyData.dutyName}}</li>
				</ul>
				<ul class="orderlsit">
					<li>被定责人电话</li>
					<li>{{dutyData.mobilePhone}}</li>
				</ul>
				<ul class="orderlsit">
					<li>定责时间</li>
					<li>{{dutyData.sponsorTime}}</li>
					<li>定责状态</li>
					<li>{{status}}</li>
				</ul>
			</div>
			<div class="editinput">
				<div class="list">
					<el-select v-model="punishType"  placeholder="处罚方式" size="medium">
						<el-option
							v-for="item in typeList" :key="item.value"
							:label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</div>

				<div class="list">
					<el-input class="width-100" placeholder="处罚金额" v-model="punishMoney" maxlength="50"></el-input>
					<span>元</span>
				</div>
			</div>
			


			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="submitForm">有条件接受</el-button>
				<el-button  @click="selectclo">取 消</el-button>
			</div>

        </el-dialog>
    </div>
</template>
<script>

import {
  dutyBaseUserDetails,  // 申诉管理中编辑时回显接口
  editDutyBaseUser, // 编辑申诉
} from 'api/entrepotSet/duty/index';

import {
  getNames,
} from 'src/utils/pubilcFn.js';
export default {
  props:["rowdata"],
  components: {
  },
  // name: 'brandmanagement',
  data() {
    return {
		punishType : '', // 处罚方式
		punishMoney: '', // 处罚金额
		visible: true,
		// 条件
		typeList: [{
			label: '罚款',value: '1'
		},{
			label: '暂扣',value: '2'
		},{
			label: '不处罚',value: '4'
		},{
			label: '其他',value: '3'
		},],
      
		dutyData: [],
    };
  },
  computed: {
	//   dutyData.status
	status() {
		let status = '';
		// 1未接受 2 已接受 3 申诉中 4申诉通过 5有条件接受
		switch(this.dutyData.status) {
			case 1 :
				status = "未接受";
				break;
			case 2 :
				status = "已接受";
				break;
			case 3 :
				status = "申诉中";
				break;
			case 4 :
				status = "申诉通过";
				break;
			case 5 :
				status = "有条件接受";
				break;
			default: 
				status = ""
		}
		return status;
	}
  },
	created() {
		let data = {
			dutyBaseUserId: this.rowdata.dutyBaseUserId, // 被责任人id
			status: this.rowdata.status,
			punishMoney: this.rowdata.punishMoney,
			punishMoneyCountType: this.rowdata.punishMoneyCountType, 
			punishType: this.rowdata.punishType,
		}
		this.getdutyBaseUserDetails(data);
	},
  mounted() {
    // 头部面包屑
    this.navList = this.$route.meta;
  },
  methods: {
		getdutyBaseUserDetails(data) {
			dutyBaseUserDetails(data).then(res => {
				if(res.status == 200) {
					this.dutyData = res.data;
				}
			}).catch(err => {
				console.log("定责管理:定责列表 申诉详情 duty/dutylist/editdia.vue",error);
			})
		},
		// 有条件接受
		submitForm() {
			let data = {
				dutyBaseUserId: this.rowdata.dutyBaseUserId,
				status: 5,
				punishType: this.punishType,
				punishMoney: this.punishMoney,
			};
			editDutyBaseUser(data).then(res => {
				if(res.status == 200) {
					this.$message({
						message: '编辑成功',
						type: 'success'
					});
					this.$emit("send_app")
				}
			})
		},

      
		//点击取消按钮
		selectclo(){
			this.$emit("close_app")
		},




      
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
					// 关联附属订单样式
					&.orderclas{
						display: flex;
						align-items: center;
						span{
							&:nth-child(odd){
								color: #5F71E7;
							}
							&:nth-child(even){
								color: #E50E0F;
								margin-right: 10px;
							}
						}
					}
				}
			}
		}
		.editinput{
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

