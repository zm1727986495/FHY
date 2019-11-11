<template>
<!-- 审核记录弹出框 所有审核列表页的审核弹框-->
  <div class="examine_dia">
        <el-dialog title="审核记录" :visible.sync="visible" width="50%" custom-class="customDialogTitle" :close-on-press-escape="false" :close-on-click-modal="false" :show-close="false">
          <div class="table_list lvs attribute m-top20">
            <el-table
                border
                :row-class-name="tableRowClassName"
                @selection-change="handleSelectionChange"
                :data="tabList"
                style="width: 100%;">
                <el-table-column type="selection" width="40"></el-table-column>
                <el-table-column prop="createName"  label="操作人"></el-table-column>
                <el-table-column prop="createTime" label="操作时间"></el-table-column>
                <el-table-column prop="approveResult" show-overflow-tooltip label="操作结果" :formatter="statusFormatter"></el-table-column>
                <el-table-column prop="approveOpinion" show-overflow-tooltip label="备注"></el-table-column>
            </el-table>
          </div>

          <!-- 分页 -->
          <div class="pagination_wrap">
              <pagination
                  :current-page="currentPage"
                  :pageSize="pageSize"
                  :total="total"
                  @sizeChange="sizeChange"
                  @currentChange="currentChange">
              </pagination>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="selectok">确 定</el-button>
            <el-button @click="handleClose">取 消</el-button>
          </span>
        </el-dialog>
    </div>
</template>
<script>
import pagination from "@/views/components/pagination";
import breadcrumb from "@/views/components/breadcrumb";

import {
    examineOrderApply, // 退款申请审核记录
} from 'api/marketing/refundpermit/index';

import {
	recommendRebatesApplyLog, // 返点审批记录
} from 'api/marketing/rebatespermit/index';

import {
  getNames,
} from 'src/utils/pubilcFn.js';
export default {
  components: {
    breadcrumb,
    pagination
  },
  // name: 'brandmanagement',
    props: {
        status: {
            type: Number,
        }
    },
  data() {
    return {
        tabList:[],
		elsectVal:[],
		visible: true,
        // 分页
        currentPage: 1,//当前页数
        pageSize: 20,//总页数
        total: 100,//总条数
    };
  },
  created() {
	  let data = {
		  page: 1,
		  limit: this.pageSize,
	  };
	  this.getList(data);
  },
  
  methods: {
	  statusFormatter(row) {
            let status = "";

            if(row.approveResult == 1) {
                status = "通过";
            }else if(row.approveResult == 2) {
                status = "驳回"
            }
            return status;
        },
		//关闭回调函数
		handleClose(){
			this.$emit("close_examin")
		},
		//确认按钮
		selectok(){
			this.$emit("examin_ok")
		},

		//表格斑马线设置
		tableRowClassName({row, rowIndex}) {
			return rowIndex%2 != 0 ? 'el-f0' : '';
		},
		// 改变页码
        currentChange(val) {
            this.currentPage = val;

            let data = this.searchdatas();
            this.getList(data);
        },
        // 改变单页条数
        sizeChange(val) {
            this.currentPage = 1;
            this.pageSize = val;

            let data = this.searchdatas();
            this.getList(data);
		},
		// 搜索条件获取
        searchdatas(){
            return {
                // names: this.names,//订单编号
                // createTimeStart: this.searchData[0],//创建时间
                // createTimeEnd: this.searchData[1],
             
                // applyerIds: this.applyer.join(","),// 申请人状态
                // applyTypes: this.applyType.join(","), // 申请类型别
                
                page: this.currentPage,
                limit: this.pageSize,
            };
        },
		// examineOrderApply() {
		// 	let data = {
		// 		orderApplyId: , 
		// 	}
		// 	examineOrderApply(data).then(res =>{
		// 		if(res.status == 200){
					
		// 		}
		// 	}).catch(error =>{
		// 		console.log('备货采购申请管理 备货管理 列表页 views/stockmanagement/stockpurchase/components/querycompon', error);
		// 	})
		// },

		//勾选函数回调
		handleSelectionChange(val) {
			this.elsectVal = val;
		},
	  	// 获取表格数据
		getList(data){
            if(this.$route.path == "/discountpermit/discountapply"){ // 折扣特批的审核记录弹框
                
            }else if(this.$route.path == "/projectpermit/projectapply"){ // 工期特批的审核记录弹框
                
            }else if(this.$route.path == "/rebatespermit/rebatesapply"){ // 返点的审核记录弹框
                this.recommendRebatesApplyLog();
            }else if(this.$route.path == "/invoicepermit/invoiceapply"){ // 开票的审核记录弹框
                
            }else if(this.$route.path == "/refundpermit/refundapply"){ // 退款的审核记录弹框
                this.examineOrderApply();
            }else if(this.$route.path == "/regoodspermit/regoodsapply"){ // 退货退款的审核记录弹框
                
            }else if(this.$route.path == "/exchangepermit/exchangeapply"){ // 换货的审核记录弹框
                
            }else if(this.$route.path == "/rediscountpermit/rediscountapply"){ // 退折扣的审核记录弹框  退折扣在退款页
                
            }else if(this.$route.path == "/decorationpermit/decorationapply"){ // 家装合同的审核记录弹框
               
            }
        },   
        
        // 退款审核记录
        examineOrderApply() {
            examineOrderApply(data).then(res =>{
                if(res.status == 200){
                    this.total = res.data.total;
                    this.tabList = res.data.rows;
                    
                    this.tabList.forEach(item => {
                        Number(item.applyStatus)
                    })
                    this.loading = false;
                }
            }).catch(error =>{
                console.log('申请 退款申请 审核记录 views/marketing/components/examinedia', error);
            })
        },

        // 返点审核记录
        recommendRebatesApplyLog() {
            recommendRebatesApplyLog(data).then(res =>{
                if(res.status == 200){
                    this.total = res.data.total;
                    this.tabList = res.data.rows;
                    
                    this.tabList.forEach(item => {
                        Number(item.applyStatus)
                    })
                    this.loading = false;
                }
            }).catch(error =>{
                console.log('申请 返点申请 审核记录 views/marketing/components/examinedia', error);
            })
        },


  }
};
</script>
<style scoped lang='scss'>



</style>

