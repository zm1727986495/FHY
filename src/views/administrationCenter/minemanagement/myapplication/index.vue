<template>
    <div class="recommenman">
      <!-- 导航栏 -->
      <div class="head_nav">
        <breadcrumb :navList="navList"></breadcrumb>
      </div>

		<el-card class="lvs">
            <!-- @searchfun ="getList"  -->
            <auditcompon  :total="total">
                <div class="btn_list_1">
                    <el-button size="small" class="button-96" @click="addFun">新增申请</el-button> 
                </div>        
            </auditcompon>	
      	</el-card>
    </div>
  
</template>
<script>


import breadcrumb from "@/views/components/breadcrumb";
import auditcompon from './components/auditcompon';

import spot from '@/assets/images/spot.png';

import { 
    listBaseDict,
} from 'api/samplemanagement/upsample/upsample';


export default {
	components: {
		breadcrumb,
        auditcompon,
	},
  // name: 'procurement',
	data() {
		return {
            navList: [],//头部面包屑
            
            // 分页
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
        // 操作按钮组

        // 新增申请
        addFun() {
            this.$router.push({
                path: '/minemanagement/addapplication',
                // query: {
                   
                // }
            });
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

