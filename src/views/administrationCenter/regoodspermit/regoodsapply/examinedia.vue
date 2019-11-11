<template>
<!-- 审核记录弹出框 所有审核列表页的审核弹框-->
  <div class="examine_dia">
        <el-dialog title="审核记录" :visible.sync="visible" width="800px" custom-class="customDialogTitle" :close-on-press-escape="false" :close-on-click-modal="false" :show-close="false">
          <div class="table_list lvs attribute m-top20">
            <el-table
                border max-height="250"
                :row-class-name="tableRowClassName"
                @selection-change="handleSelectionChange"
                :data="tabList"
                style="width: 100%;">
                <el-table-column type="selection" width="40"></el-table-column>
                <el-table-column align="center" prop="auditName"  label="审核人"></el-table-column>
                <el-table-column align="center" prop="auditTime" label="操作时间"></el-table-column>
                <el-table-column align="center" prop="auditResult" show-overflow-tooltip label="操作结果" :formatter="statusFormatter"></el-table-column>
                <el-table-column align="center" prop="auditOpinion" show-overflow-tooltip label="备注"></el-table-column>
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
    listChargeBackAuditRecord, //  查询退货订单审核记录接口
} from '@/api/administrationCenter/regoodspermit/index';


export default {
  components: {
    breadcrumb,
    pagination
  },
 
  data() {
    return {
        tabList:[],
		elsectVal:[],
		visible: true,
        // 分页
        currentPage: 1,//当前页数
        pageSize: 20,//总页数
        total: 0,//总条数
    };
  },
  props: ["chargeBackId",'auditStatus'],
  created() {
      
	  let data = {
          chargeBackId: this.chargeBackId,
		  page: 1,
		  limit: this.pageSize,
	  };
	  this.getList(data);
  },
  watch: {
      chargeBackId(val) {
          let data = this.searchdatas();
          this.getList(data);
      },
  },
  
  methods: {
      //审批结果 1.通过,2.拒绝
	    statusFormatter(row) {
            let status = "";

            if(row.auditResult == 1) {
                status = "通过";
            }else if(row.auditResult == 2) {
                status = "领导审批"
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
                chargeBackId: this.chargeBackId,
                auditStatus:this.auditStatus,
                page: this.currentPage,
                limit: this.pageSize,
            };
        },
		

		//勾选函数回调
		handleSelectionChange(val) {
			this.elsectVal = val;
		},
	  	// 获取表格数据
		getList(data){
            listChargeBackAuditRecord(data).then(res =>{
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

