<template>
  <!-- 退货退款申请 -->
	<div class="auditapply">
		<el-card>
			<div class="iconBox m-bottom">
				<span>
					<i class="Icon"></i>
					<span>审批意见</span>
				</span>
				<span class="table_action_span record"  @click="auditRecord">审核记录</span>
			</div>
			<div class="auditcontent">
				<div class="auditcard">
					<div>
						<span>审批结果: </span>
						<el-radio-group v-model="audit.auditStatus">
							<el-radio :label="2">通过</el-radio>
							<el-radio :label="4">驳回</el-radio>
							<el-radio :label="3" v-if="!isLeadAudit">领导审批</el-radio>
						</el-radio-group>
					</div>
					<div class="adminSec" v-if="isSecAudit && audit.auditStatus == 3">
						<div>
							<span>姓名: </span>
							<el-select class="filter-item" filterable clearable filterable v-model="audit.userId" placeholder="请选择">
								<el-option v-for="(item,idx) in dict" :key="idx" :label="item.name" :value="item.userId"> </el-option>
							</el-select>
						</div>
					</div>
					<div>
						<span>审批意见:</span>
						<el-input type="textarea" :rows="2" placeholder="请输入审批意见" v-model="audit.auditOpinion"></el-input>
					</div>
				</div>
				<examinedia v-if="examVisible" :orderId="orderId" :applyType="applyType" :orderApplyId="orderApplyId" :status="status" @close_examin="examineclose" @examin_ok="examinok"></examinedia>
			</div>
		</el-card>
	</div>
</template>
<script>
import { 
    listChargeBackLeader,//退货获取行政部领导接口
} from '@/api/administrationCenter/regoodspermit/index';
import examinedia from "./examinedia"; // 审核记录
import {
    listBaseDict, // 岗位
  } from 'api/pulicJava';

export default {
  components: { 
	  examinedia, // 审核记录 
  },
  
  data() {
    return {
		audit: {	
			auditStatus: '', // 审批结果
			auditOpinion: '', // 其他说明
			customerName: '', 
			userId: '',
		},
		orderId: "",
		applyType: "",
		orderApplyId: "",
		dict:[], //岗位
		examVisible: false, 
		isLeadAudit: false, // 是否是行政部领导审核
		isFirAudit: false, // 是否是行政部一审核
		isSecAudit: false,// 是否是行政部二审核
    };
  },
	created() {
		// 岗位
		this.listBaseDictQuery()
		if(this.$route.path == "/regoodspermit/adminfiraudit") { // 行政部一审核
				this.isAudit = true;
				this.isFirAudit = true;
		}
		if(this.$route.path == "/regoodspermit/adminsecaudit") { // 行政部二审核
				this.isAudit = true;
				this.isSecAudit = true;
		}
		if(this.$route.path == "/regoodspermit/adminsleadeaudit") { // 行政部领导审核
				this.isAudit = true;
				this.isLeadAudit = true;
		}
	},
  mounted() {
	
  },
  methods: {
	    // 岗位
	  	listBaseDictQuery(){
			listChargeBackLeader().then(res=>{
				console.log(res);
				this.dict = res.data;
			})
			// listBaseDict({ dataType: 'POST_DICT' }).then(res=>{
			// 	this.dict = res.data;
			// })
		},

		 // 审核记录 --- 打开审核记录弹框 
        auditRecord (rowData) {
            this.examVisible = true;
        },

        //关闭弹框   审核记录
        examineclose() {
            this.examVisible = false;
        },

        //确认关闭弹框   审核记录
        examinok() {
            this.examVisible = false;
            // this.$message("审核信息成功");
        },
  }
};
</script>
<style scoped lang='scss'>
.auditapply {
	
	.auditcontent {
		margin: 0 auto;
		width: 90%;
		.auditcard{
			>div{
                display: flex;
                flex-wrap: nowrap;
                align-items: center;
                padding: 6px 0;
				>span {
					min-width: 120px;
					text-align: right;
					padding-right: 12px;
					white-space: nowrap;
				}
                >div {
                    display: flex;
                    flex-wrap: nowrap;
                    align-items: center;
                }
			}
			.adminSec {
				display: flex;
				flex-wrap: nowrap;
				>div{
					display: flex;
					flex-wrap: nowrap;
					align-items: center;
					padding: 6px 0;
					>span {
						min-width: 120px;
						text-align: right;
						padding-right: 12px;
						white-space: nowrap;
					}
					>div {
						display: flex;
						flex-wrap: nowrap;
						align-items: center;
					}
				}
			}
		}
	}
}
.btn_btn{
	width: 200px;
	margin: 10px auto;
}

.iconBox {
	display: flex;
	justify-content: space-between;
	>span {
		&:nth-of-type(1) {
			.Icon {
				display: inline-block;
				width: 4px;
				height: 18px;
				background: #006ec6;
				margin-right: 15px;
				margin-top: 2px;
				border-radius: 3px;
				font-size: 18px;
				vertical-align: middle;
			}
		}
	}
	
	.record {
		font-size: 14px;
	}
}

</style>

