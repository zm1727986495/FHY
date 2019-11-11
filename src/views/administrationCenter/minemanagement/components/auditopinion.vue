<template>
  <!-- 开票申请 -->
	<div class="auditapply">
		
		<div  class="auditcontent">
			<div class="iconBox m-bottom">
                <i class="Icon"></i>
                <span>审批意见</span>
            </div>

			<div class="auditcard">
				<div>
					<span>审批结果: </span>
					<el-radio-group v-model="audit.type">
						<el-radio :label="0">同意</el-radio>
						<el-radio :label="1">拒绝</el-radio>
					</el-radio-group>
				</div>

				<div>
					<span>审批意见:</span>
					<el-input
						type="textarea"
						:rows="2"
						placeholder="请输入审批意见"
						v-model="audit.desc">
					</el-input>
				</div>
			</div>

		</div>
	</div>
</template>
<script>



export default {
  components: { },
  
  data() {
    return {
		audit: {	
			type: '', // 审批结果
			desc: '', // 其他说明
		},
    };
  },

  mounted() {
	
  },
  methods: {
		
  }
};
</script>
<style scoped lang='scss'>
.auditapply {
	
	.auditcontent {
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
	}
}
.btn_btn{
	width: 200px;
	margin: 10px auto;
}
</style>

