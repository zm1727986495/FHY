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
                    <el-button size="small" class="button-96" @click="printFun">打印</el-button> 
                    <el-button size="small" class="button-96" @click="exportFun">导出</el-button>
                </div>
            </auditcompon>
      	</el-card>
    </div>
  
</template>
<script>
import breadcrumb from "@/views/components/breadcrumb";

import auditcompon from '../components/auditcompon';

import module from '../../../../../config/index.js';
import spot from '@/assets/images/spot.png';

export default {
	components: {
		breadcrumb,
        auditcompon,
	},
  // name: 'procurement',
	data() {
		return {
            navList: [],//头部面包屑
            downFile: '',

		};
	},
  
	mounted() {
	// 头部面包屑
		this.navList = this.$route.meta;
	},
	created() { 
        this.downFile = module.dev.proxyTable['/api'].target + '/api/pc/projectDelayUrgentApply/listProjectDelayUrgentApply?orderApplyIds=';
    },
	methods: {
        // 操作按钮组
        // 打印
        printFun() {

        },
        // 导出操作按钮
		exportFun() {
            if (this.$refs.auditcompon.elsectVal.length == 0) {
                this.$message.warning("请勾选数据后再进行导出");
            } else {
                let data = this.$refs.auditcompon.elsectVal
                    .map(item => {
                        return item.orderApplyId;
                    })
                    .join(",");
                window.location.href = this.downFile + data;
            }
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

