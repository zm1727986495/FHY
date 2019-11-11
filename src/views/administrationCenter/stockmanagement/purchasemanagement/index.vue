<template>
    <div class="recommenman">
      <!-- 导航栏 -->
      <div class="head_nav">
        <breadcrumb :navList="navList"></breadcrumb>
      </div>

		<el-card class="lvs">
            <!-- @searchfun ="getList"  -->
            <purchasecom ref="multiquery">
                <div class="h-width"></div>
                <div class="btn_list_1">
                    <el-button size="small" class="button-96" @click="addStock"  v-if="btnJurisdiction.purchase_add">新增</el-button>   
                    <el-button size="small" class="button-96" @click="editStock"  v-if="btnJurisdiction.purchase_edit">修改</el-button> 
                    <el-button size="small" class="button-96" @click="scrapFun"  v-if="btnJurisdiction.purchase_scrap">作废</el-button>
                    <!-- <el-button size="small" class="button-96" @click="auditFun">审核记录</el-button>   
                    <el-button size="small" class="button-96" @click="attachManagement">附件管理</el-button>  -->
                    <el-button size="small" class="button-96" @click="exportFun"  v-if="btnJurisdiction.purchase_export">导出</el-button>
                </div>
            </purchasecom>
			
      	</el-card>

            <!-- <el-dialog title="提示"  custom-class="customDialogTitle" :visible.sync="centerDialogVisible" width="40%" v-if="centerDialogVisible">
                <div class="content_box" v-if="!centerDialogVisible">
                    <el-form :model="repeal" ref="repeal" label-width="100px" class="demo-dynamic">
                        <el-form-item
                            prop="isScrap">
                            <el-checkbox v-model= "repeal.whether">是否确定撤销备货采购单</el-checkbox>
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
                    
                    <span>当前备货采购已被审批，不可撤销；</span>
                </div>

                <div slot="footer" class="dialog-footer">
                    <el-button @click="cancel">取 消</el-button>
                    <el-button type="primary" @click="sendJava">确 定</el-button>
                </div>

            </el-dialog> -->
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

        <!-- <el-dialog title="提示" custom-class="customDialogTitle" :visible.sync="centerDialogVisible" width="40%" v-if="centerDialogVisible">
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

        </el-dialog> -->

    </div>
  
</template>
<script>
import breadcrumb from "@/views/components/breadcrumb";
import purchasecom from '../components/purchasecom';

import spot from '@/assets/images/spot.png';

import { 
    listBaseDict,
} from 'api/samplemanagement/upsample/upsample';
import accessory from "@/views/administrationCenter/contractmanagement/components/accessory"//附件管理组件引入

import {
    deleteStockUpPurchaseOrder, // 作废
} from 'api/administrationCenter/stockmanagement/index';

import module from '../../../../../config/index.js';


export default {
	components: {
		breadcrumb,
        purchasecom,
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
         

            centerDialogVisible: false,
            repeal: {},
            downFile: '',

            btnJurisdiction: JSON.parse(this.$loca.getItem('element')),
		};
	},
  
    activated(){
        // 头部面包屑
        this.navList = this.$route.meta;
        this.downFile = module.dev.proxyTable['/api'].target + '/api/pc/sample/exportSample?sampleIds=';
    },
    // deactivated () {
    //     this.$destroy(true)
    // },
	// mounted() {
	// // 头部面包屑
    //     this.navList = this.$route.meta;
        
	// },
	// created() {
    //     this.downFile = module.dev.proxyTable['/api'].target + '/api/pc/sample/exportSample?sampleIds=';
    // },
	methods: {
        sendJava() {
            this.centerDialogVisible = false; // 关闭弹出框
        },
        cancel() {
            this.centerDialogVisible = false; // 关闭弹出框
        },
        // 审核记录
        auditFun() {

        },
        // 新增
        addStock() {
            this.$router.push({
                path: "addpurchase",
            });
        },
        // 修改
        editStock() {
            if(this.warnMessage()) {
                if(this.$refs.multiquery.elsectVal[0].isSubmit == 0){
                    this.$router.push({
                        path: "editpurchase",
                        query: {
                            stockUpPurchaseOrderId: this.$refs.multiquery.elsectVal[0].stockUpPurchaseOrderId
                        }
                    });
                }else {
                    this.$message.warning("只有未提交状态才可修改");
                }
                
            }
        },
        // 表格选中警示信息 -- 只能选择一个订单并且必须选择
        warnMessage() {
            if(this.$refs.multiquery.elsectVal.length > 1){
                this.$message({
                    message: '只能选择一个',
                    type: 'warning'
                });
                return false;
            } else if (this.$refs.multiquery.elsectVal.length < 1){
                this.$message({
                    message: '抱歉， 请进行选择',
                    type: 'warning'
                });
                return false;
            }
            return true;
        },

        // 作废
        scrapFun() { 
            if(this.warnMessage()) {
                // 0 待提交 1申请中 2 已通过 3 未通过
                if(this.$refs.multiquery.elsectVal[0].isSubmit == 0 ) {
                    this.$confirm('是否确定作废?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        let data = {
                            stockUpPurchaseOrderId: this.$refs.multiquery.elsectVal[0].stockUpPurchaseOrderId
                        }
                        
                        deleteStockUpPurchaseOrder(data).then(res => {
                            if(res.status == 200) {
                                this.$message({
                                    message: '作废成功',
                                    type: 'success'
                                });

                                this.$refs.multiquery.$refs.multipleTable.clearSelection();
                                let data = this.$refs.multiquery.searchdatas();
                                this.$refs.multiquery.getList(data);
                            }
                        }).catch(err => {
                            console.log('备货采购申请管理 备货管理 作废 views/stockmanagement/stockpurchase/index', err);
                        })
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消作废'
                        });          
                    });
                }else {
                    this.$message({
                        message: '只有状态为未提交，才可作废',
                        type: 'warning'
                    });
                }
            }

            // this.centerDialogVisible = true;
        },

        // 导出
        exportFun() {
            // this.$router.push({  // 查看备货申请 应为导出按钮的功能 为了测试用，改为查看备货申请功能
            //     path: "viewpurchase",
            // });
            if(this.$refs.multiquery.elsectVal.length < 1) {
                this.$message.warning("请进行选择");
                return;
            }
			let data = this.$refs.multiquery.elsectVal
				.map(item => {
					return item.stockUpPurchaseOrderId;
				})
				.join(",");
			window.location.href = this.downFile + data;
			this.$refs.multiquery.$refs.multipleTable.clearSelection();

        },

        // 附件查看
		seeannexfun(){ 
            if(this.warnMessage()) {
				this.orderId = this.$refs.multiquery.elsectVal[0].orderId;
                this.seeannexval = true;
            }
        },
	}
};
</script>
<style scoped lang='scss'>

    .content_box{
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 16px;
    }
    .iconimg {
        color: #E6A23C;
        font-size: 24px;
        padding-right: 12px;
    }
    .btn_list_1 {
        display: flex;
        flex-wrap: nowrap;
	}
</style>

