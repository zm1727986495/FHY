<template>
  <!-- 退款申请 -->
	<div class="refundapply">
        <div class="selType">
            <span>退款方式:</span>
            <el-select v-model="refund.type1"  placeholder="" size="medium">
                <el-option
                    v-for="item in refundList" :key="item.value"
                    :label="item.label" :value="item.value">
                </el-option>
            </el-select>
        </div>
        <div class="h-widths"></div>
        <div class="status1" v-if="status1 == 1 || status1 == 0">
            <div class="allMoney">
                <div>
                    <span>可退金额:</span>
                    <span style="color:red">312,348元</span>
                </div>

                <div>
                    <span>合同金额:</span>
                    <span style="color:red">312,348元</span>
                </div>

                <div>
                    <span>代金券金额:</span>
                    <span style="color:red">312,348元</span>
                </div>

                <div>
                    <span>实收金额:</span>
                    <span style="color:red">312,348元</span>
                </div>
            </div>
            <div class="h-width"></div>
            <div class="typeMoney" v-if="isAudit">
                <span>收款方式</span>
                <div>
                    <span>建材城收款:</span>
                    <span style="color: #006ec6;">10,348元</span>
                </div>

                <div>
                    <span>汇款:</span>
                    <span style="color: #006ec6;">10,348元</span>
                </div>

                <div>
                    <span>现金:</span>
                    <span style="color: #006ec6;">20,348元</span>
                </div>
            </div>

            <el-form
                :model="refunds"
                :rules="ruleForm"
                ref="refunds"
                label-width="120px"
                class="demo-refunds" label-position="right">

                <el-form-item  label="退款原因" class="search_item"  prop="reason"  v-if="isAudit">
                    <el-radio-group v-model="refunds.reason">
                        <el-radio :label="1">多收款</el-radio>
                        <el-radio :label="2">退预付款</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item :label="实际退款金额" prop="money">
                    <el-input placeholder="实际退款金额/元"  v-model="refunds.money"></el-input>
                </el-form-item>
                
                <el-form-item label="退款方式" prop="type" class="paytype">
                    <el-select v-model="refunds.type" placeholder="请选择付款方式">
                        <el-option
                            v-for="item in typeList" :key="item.value"
                            :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>

                    <el-input placeholder="收款账号"  v-model="refunds.money" v-if="refunds.type == 1"></el-input>
                </el-form-item>      
            
                <el-form-item label="申请说明"  prop="remarks">
                    <el-input type="textarea" v-model="refunds.remarks"></el-input>
                </el-form-item>
            </el-form>
            <!-- <div class="card">
                <el-form :model="refund" :rules="rules" ref="refund" label-width="120px" class="demo-refund">
                    <el-form-item label="退单金额" prop="money">
                        <el-input v-model="refund.money" placeholder="退单金额/元" type="number"></el-input>
                    </el-form-item>

                    <el-form-item label="退款方式" prop="type2">
                        <el-select v-model="refund.type2"  placeholder="退款方式"  >
                            <el-option
                                v-for="item in typeList" :key="item.value"
                                :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="退单原因" prop="desc">
                        <el-input v-model="refund.desc" type="textarea" :autosize="{ minRows: 3, maxRows: 5}" placeholder="请输入退单原因" > </el-input>
                    </el-form-item>
                </el-form>
            </div> -->
        </div>
		
        <div class="status1" v-if="status1 == 2">
            <!-- 折扣退款时的table -->
           <refundtable></refundtable>
        </div>

		<div  class="refundcontent">
			<div class="refundinput">
				
				
			</div>

            <!-- 审批意见组件 -->
            <auditopinion v-if="isAudit"></auditopinion>

			<div class="btn_btn">
				<el-button type="primary" size="medium" class="reset_btn m-left20" >申 请</el-button>
				<el-button  size="medium" class="reset_btn m-left20" >取 消</el-button>
			</div>
		</div>
	</div>
</template>
<script>
import pagination from "@/views/components/pagination";
import breadcrumb from "@/views/components/breadcrumb";
import refundtable from './refundtable';
import auditopinion from "../../components/auditopinion";

import { getUpToken } from "@/utils/auth";

export default {
  components: {
    breadcrumb,
    pagination,
    refundtable,
    auditopinion,
  },
  // name: 'brandmanagement',
  data() {
    return {
        // 条件
        refundList: [{ // 退款方式
            label: '退款',value: '0',
        },{
            label: '退单退款',value: '1',
        },{
            label: '折扣退款',value: '2',
        },], 
        typeList: [{ // 退款方式2
            label: '现金',value: '0',
        },{
            label: '转账',value: '1',
        },{
            label: '内部转账',value: '2',
        },],
		textarea: '',
		refund: {	
            type1: '1', // 上面的退款方式 -- 需监听
            money : '', // 上面的退款方式 -- 需监听
            type2: '', // 内容的退款方式
			desc: '', // 其他说明
		},
		// 上传
		fileList:[], 
		imgShow: "http://file.xczhihui.com/", //文件上传域名
		action: "http://up-z2.qiniup.com",
		accept: "image/jpeg,image/jpg,image/gif,image/png,image/bmp",
		uptoken: {
			//上传参数
			token: "",
			key: ""
        },
        status1: '0', // 退款方式状态 -- 上面的
        rules: {
            money: [
                { required: true, message: '请输入退单金额', trigger: 'blur' },
            ],
            type2: [
            	{ required: true, message: '请选择退款方式', trigger: 'change' }
            ],
            desc: [
                { required: true, message: '请输入描述',trigger: 'blur'}, 
            ]
        },
        isAudit: false,
        refunds: { // 退款申请，选择 退款 的退款方式出现的input
            reason: '' , // reason
            money: '' , //   实际退款金额
            type: '' , //  退款方式 
            remarks: '' , 
        }
    };
  },

    watch: {  
        'refund.type1'(val) {
            if(val == 0) {
                this.status1 = 0;
            }else if(val == 1) {
                this.status1 = 1;
            }else if(val == 2){
                this.status1 = 2;
            }
            console.log(val,"refund.type")
        }
    },
    created() {
      if(this.$route.path == "/minemanagement/audit") {
          this.isAudit = true;
      }
  },
  mounted() {
	  this.uptoken.token = getUpToken();
  },
  methods: {
		//文件上传前操作
		beforeAvatarUpload(file) {
			//console.log(this.imgShow+file.lastModified+".jpg");
			this.uptoken.key = `${file.lastModified}.jpg`;
		},
		//文件成功操作  //addAccessory编辑的新增接口
		handleAvatarSuccess(res, file, fileList) {
			if (this.referrerId) {
			let data = {
				dataSourceEnum: "IdCopiesImg",
				dataSourceId: this.referrerId,
				fileUrl: this.imgShow + res.key
			};
			addAccessory(data).then(res => {
				console.log(res);
				if (res.status == "200") {
				this.$message.success("图片上传成功");
				} else {
				this.$message.error("图片上传失败");
				}
			});
			} else {
			this.fileList = fileList;
			}
		},
			//文件上传失败
		handError(err) {
			this.$message.error("文件上传失败，可尝试退出登录重新操作");
		},
		//文件删除操作
		handleRemove(file, fileList) {
			if (this.referrerId) {
			let data = {
				accessoryId: file.accessoryId,
				dataSourceId: file.dataSourceId,
				dataSourceEnum: file.dataSourceEnum
			};
			removeAccessoryImg(data).then(res => {
				if (res.status == "200") {
				this.$message.success("删除图片成功");
				} else {
				this.$message.error("删除图片失败");
				}
			});
			} else {
			this.fileList = fileList;
			}
		},

    //翻页方法
    sizeChange(val) {
      this.currentPage = 1;
      this.pageSize = val;
    },

    //翻页方法
    currentChange(val) {
      this.currentPage = val;
    },

    // 改变tablebody颜色
    tableBodycolor({ row, rowIndex }) {
      return "height: 80px";
    },

    //表格斑马线设置
    tableRowClassName({ row, rowIndex }) {
      return rowIndex % 2 != 0 ? "el-f0" : "";
    }
  }
};
</script>
<style scoped lang='scss'>
.refundapply {
    .selType{
        display: flex;
        flex-wrap: nowrap;
        align-items: center;
        >span {
            min-width: 120px;
            padding-right: 12px;
            white-space: nowrap;
            text-align: right;
        }
    }
    .h-widths{
        margin-top: 20px;
    }
    .status1 {
        margin-top: 20px;
        .allMoney{
            display: flex;
            flex-wrap: nowrap;
            align-items: center;
            justify-content: space-around;
            >div {
                font-size: 14px;
                display: flex;
                flex-wrap: nowrap;
                >span{
                    white-space: nowrap;
                    &:nth-of-type(odd){
                        display: inline-block;
                        min-width: 80px;
                        text-align: right;
                        padding-right: 12px;
                    }
                }
            }
        }
        .typeMoney {
            display: flex;
            flex-wrap: nowrap;
            align-items: center;
            // justify-content: space-around;
            padding: 6px 0px;
            >span {
                width: 120px;
                font-size: 18px;
                font-weight: bold;
            }
             >div {
                font-size: 16px;
                display: flex;
                flex-wrap: nowrap;
                >span{
                    white-space: nowrap;
                    &:nth-of-type(odd){
                        display: inline-block;
                        min-width: 80px;
                        text-align: right;
                        padding-right: 12px;
                    }
                }
            }
        }
        .demo-refunds{
            .paytype{
                >div {
                    >div.el-input{
                        width: 36%;
                        padding-left: 12px;
                    }
                }
            }
        }
        .card {
            margin-top: 20px;
            .demo-refund {
                display: flex;
                flex-wrap: wrap;
                align-items: center;
                >div.el-form-item {
                    width: 100%;
                    >div.el-form-item__content{
                        width: 36%;
                    }
                }
            }
        }
    }
	
	.app_text {
		display: flex;
		flex-wrap: nowrap;
		align-items: center;
		padding: 12px;
		>span:nth-of-type(odd){
			display: inline-block;
			min-width: 80px;
			text-align: right;
			padding-right: 12px;
			white-space: nowrap;
		}
	}
	.refundcontent {
		.refundinput {
			display: flex;
			flex-wrap: nowrap;
			justify-content: center;
			div.card {
				width: 50%;
				min-width: 340px;
				box-sizing: border-box;
				padding:12px 12px 0px;
				ul {
					height: 100%;
					display: flex;
					align-content: stretch;
					flex-wrap: wrap;
					li{
						width: 100%;
						display: flex;
						flex-wrap: nowrap;
						align-items: center;
						>span{
							min-width: 80px;
							white-space: nowrap;
							text-align: right;
							padding-right: 12px;
						}
						>div{
							display: flex;
							flex-wrap: nowrap;
							align-items: center;
						}
					}
				}
				&:nth-of-type(even) {
					border-left: 1px solid #999;
				}
			}
			div.card.refundright{
				ul {
					li{
						box-sizing: border-box;
						padding-bottom: 12px;
						>div {
							width: 42%;
						}
					}
				}
			}
		}
		.cardbottom{
			>div{
				display: flex;
				flex-wrap: nowrap;
				align-items: center;
				padding: 12px 12px 0px;
				>span {
					min-width: 80px;
					text-align: right;
					padding-right: 12px;
					white-space: nowrap;
				}
				
				>div {
					display: flex;
					flex-wrap: nowrap;
					&.addressinput {
						width: 36%;
						padding-left:12px;
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

<style  lang='scss'>
    .demo-refund {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        >div.el-form-item {
            width: 100%;
            >div.el-form-item__content{
                width: 36%;
            }
        }
    }
</style>

