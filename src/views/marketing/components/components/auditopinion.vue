<template>
  <!-- 审批意见 -->
	<div class="auditapply">
		
		<div  class="auditcontent">
			<div class="iconBox m-bottom">
				<span>
					<i class="Icon"></i>
					<span>审批意见</span>
				</span>
				<span class="table_action_span record"  @click="auditRecord">审核记录</span>
            </div>

			<div class="auditcard">
				<div>
					<span>审批结果: </span>
					<el-radio-group v-model="audit.operationStatus">
						<el-radio :label="1">同意</el-radio>
						<el-radio :label="2">拒绝</el-radio>
					</el-radio-group>
				</div>

				<div>
					<span>审批意见:</span>
					<el-input
						type="textarea"
						:rows="2"
						placeholder="请输入审批意见"
						v-model="audit.rejectionReasons">
					</el-input>
				</div>
			</div>

			<examinedia v-if = "examVisible" :status="status" @close_examin="examineclose" @examin_ok="examinok"></examinedia>
		</div>
	</div>
</template>
<script>
import examinedia from "../../components/examinedia"; // 审核记录

export default {
  components: {
	  examinedia, // 审核记录
   },
  
  data() {
    return {
		examVisible: false, // 审核弹出框
		status: 999,
		audit: {	
			operationStatus: '', // 审批结果
			rejectionReasons: '', // 其他说明
		},
    };
  },

  	created() {
		if(this.$route.path == "/discountpermit/discountapply"){ // 折扣特批的审批页面
		  	this.status = 0;
		}else if(this.$route.path == "/projectpermit/projectapply"){ // 工期特批的审批页面
			this.status = 1;
		}else if(this.$route.path == "/rebatespermit/rebatesapply"){ // 返点的审批页面
			this.status = 2;
		}else if(this.$route.path == "/invoicepermit/invoiceapply"){ // 开票的审批页面
			this.status = 3;
		}else if(this.$route.path == "/refundpermit/refundapply"){ // 退款的审批页面
			this.status = 4;
		}else if(this.$route.path == "/regoodspermit/regoodsapply"){ // 退货退款的审批页面
			this.status = 5;
		}else if(this.$route.path == "/exchangepermit/exchangeapply"){ // 换货的审批页面
			this.status = 6;
		}else if(this.$route.path == "/rediscountpermit/rediscountapply"){ // 退折扣的审批页面  退折扣在退款页
			this.status = 7;
		}else if(this.$route.path == "/decorationpermit/decorationapply"){ // 家装合同的审批页面
			this.status = 8;
		}
  	},

  mounted() {
	
  },
  methods: {
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
		width: 80%;
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
			
		}
		.record {
			font-size: 14px;
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
		}
	}
}
.btn_btn{
	width: 200px;
	margin: 10px auto;
}
</style>

