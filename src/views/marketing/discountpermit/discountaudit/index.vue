<template>
    <div class="recommenman">
      <!-- 导航栏 -->
      <div class="head_nav">
        <breadcrumb :navList="navList"></breadcrumb>
      </div>

		<el-card class="lvs">
            <!-- @searchfun ="getList"  -->
            <auditcompon>
                <div class="btn_list_1">
                    <!-- <el-button size="small" class="button-96" @click="printFun"  v-if="btnJurisdiction.discountaudit_print">打印</el-button>  -->
                    <el-button size="small" class="button-96" @click="exportFun"  v-if="btnJurisdiction.discountaudit_export">导出</el-button>
                </div>
            </auditcompon>
      	</el-card>
    </div>
  
</template>
<script>
import pagination from "@/views/components/pagination";
import breadcrumb from "@/views/components/breadcrumb";
import auditcompon from '../components/auditcompon';
import examinedia from "../../components/examinedia"; //审核记录

import spot from '@/assets/images/spot.png';

import { 
    listBaseDict,
} from 'api/samplemanagement/upsample/upsample';


export default {
	components: {
		breadcrumb,
        auditcompon,
        examinedia, // 审核弹框
	},
  // name: 'procurement',
	data() {
		return {
            navList: [],//头部面包屑
            
                
            btnJurisdiction: JSON.parse(this.$loca.getItem('element')),


		};
	},
  
	// mounted() {
	// // 头部面包屑
	// 	this.navList = this.$route.meta;
	// },
	// created() {



    // },
    activated(){
        // 头部面包屑
		this.navList = this.$route.meta;
    },
    // deactivated () {
    //     this.$destroy(true)
    // },
	methods: {
        // 操作按钮组

        // 新增申请 
        addApply() {

        },
        // 打印
        printFun() {

        },
        // 导出
        exportFun() {
            
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

