<template>
    <div class="recommenman">
      <!-- 导航栏 -->
      <div class="head_nav">
        <breadcrumb :navList="navList"></breadcrumb>
      </div>

		<el-card class="lvs">
             <!-- @searchfun ="getList"  -->
            <querycompon :total="total">
                <div class="h-width"></div>
                <div class="btn_list_1">
                    <el-button size="small" class="button-96" @click="auditFun">审核</el-button>   
                    <el-button size="small" class="button-96" @click="viewProcess">查看流程图</el-button>
                    <el-button size="small" class="button-96" @click="auditRecord">审核记录</el-button>   
                    <el-button size="small" class="button-96" @click="attachManagement">附件管理</el-button> 
                    <el-button size="small" class="button-96" @click="exportFun">导出</el-button>
                </div>
            </querycompon>
      	</el-card>
        <!-- 
            附件管理组件
            orderId：订单id 不传默认为空
            accessoryTypes：(传Number类型)附件类型(根据模块传对应的参数)不传默认为1 
        -->
        <el-dialog :visible.sync="seeannexval" width="960px">
            <accessory 
                v-if="seeannexval" 
                :orderId="orderId" 
                :accessoryTypes="accessoryTypes">
            </accessory>
        </el-dialog>

    </div>
  
</template>
<script>



import breadcrumb from "@/views/components/breadcrumb";
import querycompon from '../components/querycompon';

import spot from '@/assets/images/spot.png';

import { 
    listBaseDict,
} from 'api/samplemanagement/upsample/upsample';
import accessory from "@/views/administrationCenter/contractmanagement/components/accessory"//附件管理组件引入

export default {
	components: {
		breadcrumb,
        querycompon,
        accessory,
	},
  // name: 'procurement',
	data() {
		return {
            navList: [],//头部面包屑
            // 附件
            accessoryTypes: 1,
            orderId: 1,
            seeannexval: false,
         
            total: 10,

			
			
		};
	},
  
	mounted() {
	// 头部面包屑
		this.navList = this.$route.meta;
	},
	created() {

        
    },
	methods: {
        // 审核
        auditFun() {
            this.$router.push({
                path: "auditstock",
            });
        },
        // 查看流程图
        viewProcess() {

        },  
        // 审核记录
        auditRecord () {

        },

        // 导出
        exportFun() {

        },

        // 附件管理
        attachManagement() {
             // if(this.checkfun()){
                this.seeannexval = true;
            // }
        },
       
       



	}
};
</script>
<style scoped lang='scss'>
.btn_list_1 {
    margin-top: 20px;
}
</style>

