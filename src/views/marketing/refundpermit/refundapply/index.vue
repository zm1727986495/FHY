<template>
<!-- 退款申请 -->
    <div class="recommenman">
      <!-- 导航栏 -->
      <div class="head_nav">
        <breadcrumb :navList="navList"></breadcrumb>
      </div>
		<el-card class="lvs">
            <!-- @searchfun ="getList"  -->
            <querycompon ref="querycom">
                <div class="btn_list_1">
                    <el-button size="small" class="button-96" @click="addApply"  v-if="btnJurisdiction.refundapply_add">新增申请</el-button>   
                    <!-- <el-button size="small" class="button-96" @click="printFun"  v-if="btnJurisdiction.refundapply_print">打印</el-button>  -->
                    <el-button size="small" class="button-96" @click="exportFun"  v-if="btnJurisdiction.refundapply_export">导出</el-button>
                    <el-button size="small" class="button-96" @click="returnapply">取消退款</el-button>
                </div>
            </querycompon>
      	</el-card>
    </div>
</template>
<script>
import breadcrumb from "@/views/components/breadcrumb";
import querycompon from '@/views/components/components/querycompon';
import {
    cancelOrderApplyList
} from 'api/marketing/refundpermit/index';

import module from '../../../../../config/index.js';

export default {
	components: {
		breadcrumb,
        querycompon,
	},
  // name: 'procurement',
	data() {
		return {
            navList: [],//头部面包屑
            downFile: '',
            btnJurisdiction: JSON.parse(this.$loca.getItem('element')),
		};
	},
  
	// mounted() {
	// // 头部面包屑
	// 	this.navList = this.$route.meta;
	// },
	// created() {
    //     this.downFile = module.dev.proxyTable['/api'].target + '/api/pc/orderApply/exportOrderApple?orderApplyIds=';
    // },
    activated(){
        // 头部面包屑
        this.navList = this.$route.meta;
        this.downFile = module.dev.proxyTable['/api'].target + '/api/pc/orderApply/exportOrderApple?orderApplyIds=';
    },
    // deactivated () {
    //     this.$destroy(true)
    // },
	methods: {
        // 新增申请 
        addApply() {
            this.$router.push({
                path: "/refundpermit/addapplication",
                query: {
                    pageStatus: "4",
                }
            })
        },
        // 打印
        printFun() {

        },
        //取消退款
        returnapply(){
            let val = this.$refs.querycom.elsectVal
            if(val.length == 0){
                this.$message.warning("请选择订单")
            }else if(val.length > 1){
                this.$message.warning("只能勾选一条订单")
            }else{
                console.log(val[0]);
                if(val[0].applyStatus != 0 && val[0].applyStatus != 2){
                    this.$message.warning("只有待审核和驳回才可进行取消退款操作!")
                    return
                }
                let datas = {
                    orderApplyId: val[0].orderApplyId
                }
                cancelOrderApplyList(datas).then(res =>{
                    if(res.status == 200){
                        this.$message.success("操作成功");  
                        let data = this.$refs.querycom.searchdatas();
                        this.$refs.querycom.getList(data);
                    }
                }).catch(error =>{
                    console.log('申请 删除 表格列表 marketing/components/querycompon.vue', error);
                })
            }
        },
        // 导出
        exportFun() {
            if(this.$refs.querycom.elsectVal.length < 1){
                this.$message({
                    message: '抱歉，请进行选择',
                    type: 'warning'
                });
                return;
            }
			let data = this.$refs.querycom.elsectVal
				.map(item => {
					return item.orderApplyId;
				})
				.join(",");
			window.location.href = this.downFile + data;
			this.$refs.querycom.$refs.multiTable.clearSelection();
        },
	}
};
</script>
<style scoped lang='scss'>
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

