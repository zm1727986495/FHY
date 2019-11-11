<template>
    <!-- 换货 -->
    <div class="recommenman">
      <!-- 导航栏 -->
      <div class="head_nav">
        <breadcrumb :navList="navList"></breadcrumb>
      </div>

		<el-card class="lvs">
            <!-- @searchfun ="getList"  -->
            <querycompon ref="querycom">
                <div class="btn_list_1">
                    <el-button size="small" class="button-96" @click="addApply">新增申请</el-button>   
                    <el-button size="small" class="button-96" @click="printFun">打印</el-button> 
                    <el-button size="small" class="button-96" @click="exportFun">导出</el-button>
                </div>
            </querycompon>
      	</el-card>
    </div>
  
</template>
<script>
import pagination from "@/views/components/pagination";
import breadcrumb from "@/views/components/breadcrumb";
import querycompon from '@/views/components/components/querycompon';


import module from '../../../../../config/index.js';

import spot from '@/assets/images/spot.png';

import { 
    listBaseDict,
} from 'api/samplemanagement/upsample/upsample';


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
            urls: "",
		};
	},
  
	mounted() {
	// 头部面包屑
		this.navList = this.$route.meta;
	},
	created() {

        this.downFile = module.dev.proxyTable['/api'].target + '/api/pc/orderApply/exportOrderApple?orderApplyIds=';

    },
	methods: {
        // 操作按钮组

        // 新增申请 
        addApply() {
            this.$router.push({
                path: "/discountpermit/addapplication",
                query: {
                    pageStatus: 8,
                }
            })
        },
        // 打印
        printFun() {

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

