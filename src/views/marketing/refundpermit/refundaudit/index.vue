<template>
    <div class="recommenman">
      <!-- 导航栏 -->
      <div class="head_nav">
        <breadcrumb :navList="navList"></breadcrumb>
      </div>
		<el-card class="lvs">
            <!-- @searchfun ="getList"  -->
            <auditcompon ref="auditcompon">
                <div class="btn_list_1">
                    <!-- <el-button size="small" class="button-96" @click="printFun"  v-if="btnJurisdiction.refundaudit_print">打印</el-button>  -->
                    <el-button size="small" class="button-96" @click="exportFun"  v-if="btnJurisdiction.refundaudit_export">导出</el-button>
                    <el-button size="small" class="button-96" v-if="btnJurisdiction.refundaudit_batchrefund" @click="batchVisible">批量审核</el-button>
                </div>
            </auditcompon>
            <el-dialog title="审批意见" :visible.sync="dialogVisible" width="800px" :before-close="handleClose" custom-class="customDialogTitle">
            <div class="auditcard">
				<div>
					<span>审批结果: </span>
					<el-radio-group v-model="operationStatus">
						<el-radio :label="1">同意</el-radio>
						<!-- <el-radio :label="2">拒绝</el-radio> -->
						<el-radio :label="3">退回</el-radio>
					</el-radio-group>
				</div>
				<div>
					<span>{{operationStatus == 1 ? '审批意见':'退回意见'}}:</span>
					<el-input
						type="textarea"
						:rows="2"
						placeholder="请输入"
						v-model.trim="rejectionReasons">
					</el-input>
				</div>
			</div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" :loading="loadingBtn" @click="batchFn">确 定</el-button>
                <el-button @click="handleClose">取 消</el-button>
            </span>
            </el-dialog>
      	</el-card>
    </div>
</template>
<script>
import breadcrumb from "@/views/components/breadcrumb";
import auditcompon from '../components/auditcompon';
import { getUUID } from "api/pulicJava";
import module from '../../../../../config/index.js';
import {examineOrderApplyList} from 'api/marketing/refundpermit/index';
import { resolve } from 'path';


export default {
	components: {
		breadcrumb,
        auditcompon,
	},
  // name: 'procurement',
	data() {
		return {
            loadingBtn:false,
            navList: [],//头部面包屑
            downFile: '',
            operationStatus:'',
            rejectionReasons:'',
            dialogVisible:false,
            btnJurisdiction: JSON.parse(this.$loca.getItem('element')),
		};
	},
  
	// mounted() {
	// // 头部面包屑
	// 	this.navList = this.$route.meta;
	// },
	// created() { 
    //     this.downFile = module.dev.proxyTable['/api'].target + '/api/pc//homeCollectionApply/exportHomeCollectionApplyorderApplyIds=';
    // },
    activated(){
        // 头部面包屑
        this.navList = this.$route.meta;
        this.downFile = module.dev.proxyTable['/api'].target + '/api/pc//homeCollectionApply/exportHomeCollectionApplyorderApplyIds=';
    },
    // deactivated () {
    //     this.$destroy(true)
    // },
	methods: {
        // 操作按钮组
        // 打印
        printFun() {

        },
        //关闭弹框
        handleClose(){
            this.dialogVisible = false;
        },
        //打开弹框
        batchVisible(){
            if(this.$refs.auditcompon.elsectVal.length==0){
                this.$message.error('当前没有勾选')
                return
            }
            this.dialogVisible = true;
        },
        //审核意见确定
        batchFn(){
            if(!this.operationStatus){
                this.$message.error('没有选择审核意见')
                return
            }
            if(this.operationStatus == 3 && !this.rejectionReasons){
                this.$message.error('请输入退回原因!')
                return
            }
            new Promise((relve,rej)=>{
                let arr = [];
                this.$refs.auditcompon.elsectVal.forEach(item=>{
                    let p1 = new Promise((resolve,reject)=>{
                        getUUID({serialNumber: 'MC'}).then(res => {
                            resolve(res.data)
                        })
                    })
                    let p2 = new Promise((resolve,reject)=>{
                        getUUID({serialNumber: 'PY'}).then(res => {
                            resolve(res.data)
                        }) 
                    })
    
                    Promise.all([p1,p2]).then(res=>{
                        arr.push({
                            dataSourceId:item.orderApplyId,
                            workFlowBusinessId:item.workFlowBusinessId,
                            collectMoneyName:res[0],
                            paymentNumber:res[1]
                        })
                        if(arr.length>=this.$refs.auditcompon.elsectVal.length){
                            relve(arr)
                        }
                    })
                })
            }).then(res=>{
                let data = {
                    operationStatus:this.operationStatus,
                    rejectionReasons:this.rejectionReasons,
                    workExamineFlowDTOS:res
                }
                console.log(data);
                this.loadingBtn = true;
                examineOrderApplyList(data).then(res=>{
                    if(res.status==200){
                        this.$message.success(res.message)
                        this.dialogVisible = false;
                        this.loadingBtn = false;
                        this.$refs.auditcompon.searchfun()
                        this.$refs.auditcompon.clearTable()
                    }else{
                        this.loadingBtn = false;
                    }
                }).catch(error=>{
                    this.loadingBtn = false;
                    console.error('批量审核!',error);
                })
            })

        },
        // 导出操作按钮
		exportFun() {
            if (this.$refs.auditcompon.elsectVal.length < 1) {
                this.$message.warning("请进行勾选数据");
            } else {
                let data = this.$refs.auditcompon.elsectVal
                    .map(item => {
                        return item.orderApplyId;
                    })
                    .join(",");
                window.location.href = this.downFile + data;
                this.$refs.auditcompon.$refs.multipleTable.clearSelection();
            }
		},


	}
};
</script>
<style scoped lang='scss'>
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
    .content_box {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 16px;
        .iconimg {
            color: #E6A23C;
            font-size: 24px;
            padding-right: 12px;
        }
    }
    

</style>

