<template>
    <div class="recommenman">
      <!-- 导航栏 -->
      <div class="head_nav">
        <breadcrumb :navList="navList"></breadcrumb>
      </div>

		<el-card class="lvs">
            <!-- @searchfun ="getList"  -->
            <querycompon ref="multiquery">
                <div class="h-width"></div>
                <div class="btn_list_1">
                    <el-button size="small" class="button-96" @click="addStock" v-if="btnJurisdiction.stock_add">新增</el-button>   
                    <el-button size="small" class="button-96" @click="editStock" v-if="btnJurisdiction.stock_edit">修改</el-button> 
                    <el-button size="small" class="button-96" @click="scrapFun" v-if="btnJurisdiction.stock_scrap">作废</el-button>
                    <el-button size="small" class="button-96" @click="auditFun"  v-if="btnJurisdiction.stock_audit">审核</el-button>
                    <el-button size="small" class="button-96" @click="auditRecord"  v-if="btnJurisdiction.stock_record">审核记录</el-button>   
                    <!-- <el-button size="small" class="button-96" @click="attachManagement">附件管理</el-button>  -->
                    <el-button size="small" class="button-96" @click="exportFun"  v-if="btnJurisdiction.stock_export">导出</el-button>
                </div>
            </querycompon>
			
      	</el-card>

        <!-- 
            附件管理组件
            orderId：订单id 不传默认为空
            accessoryTypes：(传Number类型)附件类型(根据模块传对应的参数)不传默认为1 
        -->
        <!-- <el-dialog :visible.sync="seeannexval" width="960px">
            <accessory 
                v-if="seeannexval" 
                :orderId="orderId" 
                :accessoryTypes="accessoryTypes">
            </accessory>
        </el-dialog> -->

        <!-- 是否确定撤销 弹出框 -->
        <el-dialog title="提示" custom-class="customDialogTitle" :visible.sync="centerDialogVisible" width="40%" v-if="centerDialogVisible">
            <!-- <div class="titlecals">提示</div> -->
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

        <!-- 审核记录弹出框 -->
        <el-dialog  title="审核管理"  custom-class="customDialogTitle" :visible.sync="auditdialogVisible" width="50%">
                <el-table
                border 
                :row-class-name="tableRowClassName"
                :data="tableData"
                style="width: 100%">
                <el-table-column prop="createName" label="操作人"></el-table-column>
                <el-table-column prop="createTime" label="操作时间"></el-table-column>
                <el-table-column prop="approveResult" show-overflow-tooltip label="操作结果" :formatter="statusFormatter"></el-table-column>
                <el-table-column prop="approveOpinion" show-overflow-tooltip label="备注"></el-table-column>
            </el-table>
            <!-- 分页 -->
            <div class="pagination_wrap">
                <pagination
                    :current-page="currentPage1"
                    :pageSize="pageSize1"
                    :total="total1"
                    @sizeChange="sizeChange1"
                    @currentChange="currentChange1">
                </pagination>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="confirmAudit">确 定</el-button>
                <el-button @click="auditdialogVisible = false">取 消</el-button>
            </div>
        </el-dialog>

    </div>
  
</template>
<script>
import breadcrumb from "@/views/components/breadcrumb";
import pagination from "@/views/components/pagination";
import querycompon from './components/querycompon';
import accessory from "@/views/administrationCenter/contractmanagement/components/accessory"//附件管理组件引入
import module from '../../../../../config/index.js';
import { 
    listBaseDict,
    deleteStockUpApply, // 撤销备货申请
    listStockUpApproveLog, // 备货审批记录
    submitApply, // 提交
} from 'api/administrationCenter/stockmanagement/index';


export default {
	components: {
		breadcrumb,
        pagination,
        querycompon,
        accessory,
	},
  // name: 'stockpurchase',
	data() {
		return {
            navList: [],//头部面包屑
            // 附件
            accessoryTypes: 1,
            orderId: 1,
            seeannexval: false,

            // 审核记录弹出框数据
            auditdialogVisible: false, // 审核记录弹出框
            tableData: [], // 审核弹出框的表格数据
            // 审核记录弹出框的分页
			currentPage1: 1,
			pageSize1: 10,
			total1: 0,

            total: 0,
            centerDialogVisible: false,
            repeal: {},
            downFile: '',
            btnJurisdiction: JSON.parse(this.$loca.getItem('element')),
		};
	},
  
    activated(){
        // 头部面包屑
        this.navList = this.$route.meta;
        this.downFile = module.dev.proxyTable['/api'].target + '/api/pc/stockUpApply/exportStockUpApply?stockUpApplyIds=';
    },
    // deactivated () {
    //     this.$destroy(true)
    // },
	// mounted() {
	// // 头部面包屑
    //     this.navList = this.$route.meta;

	// },
	// created() {
    //     this.downFile = module.dev.proxyTable['/api'].target + '/api/pc/stockUpApply/exportStockUpApply?stockUpApplyIds=';
    // },
	methods: {
        sendJava() {
            this.centerDialogVisible = false; // 关闭弹出框
        },
        cancel() {
            this.centerDialogVisible = false; // 关闭弹出框
        },
        // 审核操作按钮
        auditFun() {
            if(this.warnMessage()) {
                if(this.$refs.multiquery.elsectVal[0].applyStatus != 4) {
                    this.$message({
                        message: '只有状态是待审核才可审核',
                        type: 'warning'
                    });
                    return;
                }

                this.$router.push({
                    path: "/stockmanagement/auditstock",
                    query: {
                        stockUpApplyId: this.$refs.multiquery.elsectVal[0].stockUpApplyId
                    }
                });
            }
        },
        
        statusFormatter(row) {
            let status = "";

            if(row.approveResult == 1) {
                status = "通过";
            }else if(row.approveResult == 2) {
                status = "驳回"
            }
            return status;
        },
        // 审核记录弹出框的table
        auditRecord() {
            if(!this.warnMessage()) {
                return;
            }

            let data = {
                stockUpApplyId: this.$refs.multiquery.elsectVal[0].stockUpApplyId,
                
                page: this.currentPage1,
                limit: this.pageSize1,
            }
            listStockUpApproveLog(data).then(res => {
                if(res.status == 200) {
                    this.tableData = res.data.rows;
                    this.total1  = res.data.total;

                    this.tableData.forEach(item => {
                        Number(item.approveResult)
                    })

                    this.auditdialogVisible = true;
                }
            }).catch(error => {
                console.log('备货采购申请管理 备货管理 审核记录弹出框 views/stockmanagement/stockpurchase/index', error);
            })
            // auditRecords(data).then(res => {
            //     if(res.status == 200) {
            //         this.tableData = res.data.rows;
            //         this.total1  = res.data.total;
            //         this.auditdialogVisible = true;
            //     }
            // }).catch(error => {
            //     console.log('违规处罚管理:违规管理  审核记录弹出框 administrationCenter/puniManagement/violations/index.vue', error);
            // })

        },
        // 分页函数回调
        currentChange1(val) {
            this.currentPage1 = val;

            // let data = this.searchdatas();
            this.auditRecord();
        },
        // 单页条数改变
        sizeChange1(val){
            this.currentPage1 = 1;
            this.pageSize1 = val;

            this.auditRecord();
        },
        // 审核记录弹出框的确定按钮
        confirmAudit() {
            this.auditdialogVisible = false;
        },
        // 新增
        addStock() {
            if(this.$refs.multiquery.elsectVal.length > 0) {
                this.$message({
                    message: '请勿选择',
                    type: 'warning'
                });
                return;
            }
            this.$router.push({
                path: "addstockpurchase",
            });
        },
        // 修改
        editStock() {
            if(this.warnMessage()) {
                if(this.$refs.multiquery.elsectVal[0].applyStatus == 0 || this.$refs.multiquery.elsectVal[0].applyStatus == 2){
                    this.$router.push({
                        path: "editstockpurchase",
                        query: {
                            stockUpApplyId: this.$refs.multiquery.elsectVal[0].stockUpApplyId,
                            applyStatus: this.$refs.multiquery.elsectVal[0].applyStatus
                        }
                    });
                }else {
                    this.$message.warning("只有未提交状态或审核驳回状态才可修改");
                }
                
            }

            
        },
        // 作废
        scrapFun() { 
            if(this.warnMessage()) {
                // 0未提交 1审核通过 2审核驳回 3审核中 4待审核
                if(this.$refs.multiquery.elsectVal[0].applyStatus == 0 ||  this.$refs.multiquery.elsectVal[0].applyStatus == 2) {
                    this.$confirm('是否确定作废?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        let data = {
                            stockUpApplyId: this.$refs.multiquery.elsectVal[0].stockUpApplyId
                        }
                        
                        deleteStockUpApply(data).then(res => {
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
                        message: '只有申请状态为未提交或审核驳回，才可作废',
                        type: 'warning'
                    });
                }
            }
            
            
            // 撤销备货申请--弹出框 应为作废按钮的功能 为了测试用，改为撤销备货申请
            // this.centerDialogVisible = true;
        },

        // 导出
        exportFun() {
            if(this.$refs.multiquery.elsectVal && this.$refs.multiquery.elsectVal.length == 0) {
                this.$message.warning("请进行选择");
                return;
            }

            let data = this.$refs.multiquery.elsectVal
				.map(item => {
					return item.stockUpApplyId;
				})
				.join(",");
			window.location.href = this.downFile + data;
			this.$refs.multiquery.$refs.multipleTable.clearSelection();
        },

        submitApply() {
            // 提交
            if(this.warnMessage()) {
                this.$confirm('是否确定提交?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let data = {
                        stockUpApplyId: this.$refs.multiquery.elsectVal[0].stockUpApplyId
                    }

                // console.log(this.$refs.multiquery, this.$refs.multiquery.$refs.multipleTable,"multipleTable this.$refs.multiquery 89692");

                    submitApply(data).then(res => {
                        if(res.status == 200) {
                            this.$message({
                                message: '提交成功',
                                type: 'success'
                            });
                            this.$refs.multiquery.$refs.multipleTable.clearSelection();
                        }
                    }).catch(err => {
                        console.log('备货采购申请管理 备货管理 提交 views/stockmanagement/stockpurchase/index', err);
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消提交'
                    }); 
                });
            }

        },

        // 附件管理
        // attachManagement() {
        //     if(!this.warnMessage()) {
        //         return;
        //     }else {
        //         this.orderId = this.$refs.multiquery.elsectVal.orderId;
        //         console.log(this.orderId,"this.orderId 55565");
                
        //         this.seeannexval = true;
        //     }
        // },
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

        
        //表格斑马线设置
		tableRowClassName({row, rowIndex}) {
			return rowIndex%2 != 0 ? 'el-f0' : '';
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

