<template>
    <div class="recommenman">
      <!-- 导航栏 -->
      <div class="head_nav">
        <breadcrumb :navList="navList"></breadcrumb>
      </div>

		<el-card class="lvs">
            <!-- @searchfun ="getList"  -->
            <projectcompon  :total="total">

                <div class="btn_list_1">
                    <el-button size="small" class="button-96" @click="auditFun">审核</el-button>   
                    <el-button size="small" class="button-96" @click="viewProcess">查看流程图</el-button>
                    <el-button size="small" class="button-96" @click="auditRecord">审核记录</el-button>   
                    <el-button size="small" class="button-96" @click="attachManagement">附件管理</el-button> 
                    <el-button size="small" class="button-96" @click="exportFun">导出</el-button>
                </div>
                
            </projectcompon>
			
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

        <!-- 撤销的弹出框 -->
        <el-dialog title="提示" custom-class="customDialogTitle" :visible.sync="centerDialogVisible" width="40%" v-if="centerDialogVisible">
            <div class="content_box" v-if="!centerDialogVisible">
                <el-form :model="repeal" ref="repeal" label-width="100px" class="demo-dynamic">
                    <el-form-item
                        prop="isScrap">
                        <el-checkbox v-model= "repeal.whether">是否确定撤销</el-checkbox>
                    </el-form-item>

                     <el-form-item label="撤销原因：" prop="desc" :rules="[
                          { required: true, message: '请输入撤销原因', trigger: 'blur' },
                      ]">
                        <el-input type="textarea" v-model="repeal.desc" :rows = "2" placeholder = "请输入内容">
                     </el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div class="content_box" v-else>
                <i class="el-icon-warning iconimg"></i>
                
                <span>当前备货申请已被审批，不可撤销；</span>
            </div>

            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel">取 消</el-button>
                <el-button type="primary" @click="sendJava">确 定</el-button>
            </div>

        </el-dialog>

        <!-- 审核记录 -->
       <examinedia :visible="examine_vis" @close_examin="examineclose" @examin_ok="examinok" :orderApplyId="orderApplyId"></examinedia>

    </div>
  
</template>
<script>


import breadcrumb from "../../../components/breadcrumb";
import projectcompon from '../components/projectcompon';
import examinedia from "../components/examinedia"; //审核记录

import spot from '@/assets/images/spot.png';

import { 
    listBaseDict,
} from 'api/samplemanagement/upsample/upsample';
import accessory from "@/views/administrationCenter/contractmanagement/components/accessory"//附件管理组件引入

export default {
	components: {
		breadcrumb,
        projectcompon,
        accessory,
        examinedia, // 审核弹框
	},
  // name: 'procurement',
	data() {
		return {
            navList: [],//头部面包屑
            // 附件
            accessoryTypes: 1,
            orderId: 1,
            seeannexval: false,

            // 分页
            total: 10,

            centerDialogVisible: false, //撤销弹出框
            repeal: {}, //撤销表单字段值

            
            examine_vis: false, // 审核记录弹框是否显示
		};
	},
  
	mounted() {
	// 头部面包屑
		this.navList = this.$route.meta;
	},
	created() {



    },
	methods: {
        sendJava() {
            this.centerDialogVisible = false; // 关闭弹出框
        },
        cancel() {
            this.centerDialogVisible = false; // 关闭弹出框
        },
        // 操作按钮组
        // 审核
        auditFun() {
            this.$router.push({ 
                path: "auditproject",
            });
        },

        // 查看流程图
        viewProcess() {

        },
        // 审核记录 --- 打开审核记录弹框 
        auditRecord () {
            this.examine_vis = true;
        },

        //关闭弹框   审核记录
        examineclose() {
            this.examine_vis = false;
        },

        //确认关闭弹框   审核记录
        examinok() {
            this.examine_vis = false;
            // this.$message("审核信息成功");
        },

        // 附件查看
        attachManagement() {
          
             // if(this.checkfun()){
                this.seeannexval = true;
            // }
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

