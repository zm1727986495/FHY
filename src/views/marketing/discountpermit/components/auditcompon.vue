<template>
  <!-- 折扣特批审核列表 -->
  <div class="screencompon">
    <div class="warp_head_list">
		<div class="list_top">
			<div>
				<el-input placeholder="申请单号/订单编号/客户姓名/客户电话/客户地址" v-model="orderGroup" size="medium" maxlength="50" @keydown.enter.native="searchfun"></el-input>
			</div>
			<div>
				<el-date-picker
					size="medium" v-model="searchData" type="daterange" 
					value-format='yyyy-MM-dd' format='yyyy-MM-dd' 
					range-separator="-"
					start-placeholder="年/月/日" end-placeholder="年/月/日">
				</el-date-picker>
			</div>
			<div>
				<el-input placeholder="申请人" v-model="applyName" size="medium" maxlength="50" @keydown.enter.native="searchfun"></el-input>
			</div>
			<div>
				<el-select v-model="status" placeholder="选择状态" size="medium" clearable filterable >
					<el-option
						v-for="item in statusList" :key="item.value"
						:label="item.label" :value="item.value">
					</el-option>
				</el-select>
			</div>
		</div>
		<div class="head_nav_btn">
			<el-button class="button-fc" type="warning" size="medium"  @click="searchfun">查询</el-button>
			<el-button class="el-button--medium" type="primary" size="medium"  @click="resetFun">重置</el-button>
		</div>
    </div>
    <div class="h-width"></div>
    <div class="btn_list_1">
        <!-- <el-button size="small" class="button-96" @click="printFun" v-if="btnJurisdiction.discountaudit_print">打印</el-button>  -->
        <el-button size="small" class="button-96" @click="exportFun" v-if="btnJurisdiction.discountaudit_print">导出</el-button>
    </div>
    <!-- table表格 -->
    <div class="table_list lvs attribute m-top20"  v-loading="loading">
      <el-table
        border  :row-key="getRowKeys" @row-click="rowClick"
        :row-class-name="tableRowClassName"
        @selection-change="handleSelectionChange"
        :data="tabList" ref="multipleTable"
        style="width: 100%;" >
        <el-table-column type="selection" width="55"  :reserve-selection="true"  fixed></el-table-column>
        <el-table-column prop="applyStatus" label="审核状态" width="240" sortable align="center"  fixed>
          <template slot-scope="scope">
            <div>
              <el-tooltip placement="right" visible-arrow>
                <div slot="content" class="tips tipFon">
                  <p @click="auditHandle(scope.row)" v-if="(scope.row.status == 0 || scope.row.status == 3)  && btnJurisdiction.discountaudit_audit"  class="operaItems">审核</p>
                  <p @click="auditRecord(scope.row)" class="operaItems" v-if="btnJurisdiction.discountaudit_record">审核记录</p>
                </div>
                <img :src="spot" alt class="attributesTips" />
              </el-tooltip>

              <p class="text">{{scope.row.applyStatus}}</p>
            </div>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="workFlowNodeName" label="当前节点" width="240" sortable align="center"></el-table-column> -->
        <el-table-column prop="applyCode" label="申请单号" width="240" sortable align="center"  fixed>
          <template slot-scope="scope">
            <div>
              <p class="operation table_action_span">{{scope.row.applyCode}}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="orderStatus" align="center" label="订单状态" width="280" sortable></el-table-column>
        <el-table-column prop="orderNumber" label="订单号" width="240" sortable align="center">
          <template slot-scope="scope">
            <div>
              <p class="operation table_action_span">{{scope.row.orderNumber}}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="contractSerialNumber" label="客户合同号" width="240" sortable align="center"></el-table-column>
        <el-table-column prop="orderType" label="订单类型" width="240" sortable align="center"></el-table-column>
        <el-table-column prop="discountRate" label="特批折扣" width="240" sortable align="center"></el-table-column>
        <el-table-column prop="contractMoney" label="合同原价" width="240" sortable align="center">
          <template slot-scope="scope">
            <div>{{scope.row.contractMoney | fenge}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="aftercontractMoney" label="折后合同金额" width="240" sortable align="center">
          <template slot-scope="scope">
            <div>{{scope.row.aftercontractMoney | fenge}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="discountMoney" label="优惠金额" width="240" sortable align="center">
          <template slot-scope="scope">
            <div>{{scope.row.discountMoney | fenge}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="customerName" label="客户姓名" width="240" sortable align="center"></el-table-column>
        <el-table-column prop="customerPhone" label="客户电话" width="240" sortable align="center"></el-table-column>
        <el-table-column prop="otherPhone" label="备用电话" width="240" sortable align="center"></el-table-column>
        <el-table-column prop="storeName" label="所属门店" width="240" sortable align="center"></el-table-column>
        <el-table-column prop="address" label="订单地址" width="240" sortable align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="applyTime" label="申请时间" width="240" sortable align="center"></el-table-column>
        <el-table-column prop="applyName" label="申请人" width="240" sortable align="center"></el-table-column>
        <el-table-column prop="auditTime" label="审核时间" width="240" sortable align="center"></el-table-column>
        <el-table-column prop="auditorName" label="审核人" width="240" sortable align="center"></el-table-column>
        <el-table-column prop="applyCause" label="备注" width="240" sortable align="center"></el-table-column>
      </el-table>
    </div>
    <!-- 点击单元格--申请单号的弹出框 -->
    <applydetail @close-dialog="closeDialog" v-if="diaVisible"></applydetail>
    <!-- 点击审核记录的操作按耨--审核记录 -->
    <examinedia v-if="examVisible" :applyType="1064" :orderId="orderId"  :orderApplyId="orderApplyId"  @close_examin="examineclose" @examin_ok="examinok"></examinedia>

    <!-- 分页 -->
    <div class="pagination_wrap">
      <pagination :current-page="currentPage" :pageSize="pageSize" :total="total" @sizeChange="sizeChange" @currentChange="currentChange"></pagination>
    </div>
  </div>
</template>
<script>
import spot from "@/assets/images/spot.png";
import pagination from "@/views/components/pagination";
import breadcrumb from "@/views/components/breadcrumb";
import applydetail from "./applydetail"; // 申请详情
import examinedia from "@/views/components/components/examinedia"; //审核记录
import {
  listDiscountApply,  //获取审核列表
  auditNumber,        //审批次数
} from "api/marketing/discountpermit/discountpermit";
import module from "../../../../../config/index";


export default {
  components: {
    pagination,
    applydetail,
    examinedia
  },
  data() {
    return {
      spot,
      // 分页
      currentPage: 1,
      pageSize: 20,
	  total: 0,
	
	  orderId: '',
	  applyTypes: '',
	  orderApplyId: '',
		
      // 搜索条件
		orderGroup: '',//订单编号
		applyName: '', //申请人
		applyType: '',//申请类型
		status: '',//申请状态
		auditName: '',// 审核人
		searchData: [],// 选择时间

		orderApplyId: '',
    btnJurisdiction: JSON.parse(this.$loca.getItem('element')),
		// 条件
		applyList: [],  // 选择申请人条件
		typeList: [],  // 选择申请类型条件
		statusList: [{
			label: "待审核", value: "0",
		},{
			label: "审核通过", value: "1",
		},{
			label: "驳回", value: "2",
		},{
			label: "审核中", value: "3",
		}],
		auditList: [],  // 选择审核人条件
      // 搜索框的显示与否
      isShow: false,
      // 申请详情弹出框的显示与否
      diaVisible: false,
      examVisible: false, // 审核记录弹框是否显示
      // 表格
      elsectVal: [], // 表格选中的数据
	  tabList: [], // 表格数据
	  loading: true, // table的loading控制
    };
  },
  created() {
    this.searchfun();
  },
  filters: {
    // 千分号过滤方法
    // fenge(val){
    //       return val ? (val+"").replace(/(?=(?!\b)(\d{3})+$)/g, ',') : 0;
	// }
		fenge(amount) {
            const validateNumber = n =>
                !isNaN(parseFloat(n)) && isFinite(n) && Number(n) === n;

            if (!validateNumber(+amount)) {
                return amount;
            }
            return (+amount)
                .toFixed(2)
                .replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, "$&,");
        },
  },
  methods: {
    getRowKeys(row) {
      return row.discountApplyId;
    },
   
	rowClick(row, column, event) {
		if(column.property == 'applyCode') {
			this.$router.push({
				path: "/discountpermit/viewapplication", // 折扣特批的编辑页面
				query: {
					pageStatus: "0",
					orderApplyId: row.orderApplyId,
					orderId: row.orderId,
				}
			})
			return;
		}
		
		this.$refs.multiTable.toggleRowSelection(row)
	},


    //申请时间改变
    time1Change(){
      this.form.applyStartTime = this.searchData ? this.searchData[0] : "";
      this.form.applyEndTime = this.searchData ? this.searchData[1] : "";
    },

    //审核时间改变
    time2Change(){
      this.form.auditStartTime = this.searchData2 ? this.searchData2[0] : "";
      this.form.auditEndTime = this.searchData2 ? this.searchData2[1] : "";
    },
    
    //打印功能
    printFun(){
      this.$message.warning("打印功能未开发")
    },

    //导出
    exportFun(){
      if (this.elsectVal.length) {
        let ids = this.elsectVal
          .map(item => {
            return item.orderApplyId;
          })
          .join(",");
        let str =
          module.dev.proxyTable["/api"].target +
          "/api/pc/discountApply/exportDiscountApply?orderApplyIds=" +
          ids;
        console.log(str + "下载地址");

        window.location.href = str;
        this.$refs.multipleTable.clearSelection();
      } else {
        this.$message.warning("您没有勾选数据");
      }
    },



    //获取审核列表
    listDiscountApplyFun() {
      
            this.loading = true;
      let data = {
		// ...this.form,
		orderGroup: this.orderGroup,//订单编号
		applyStartTime: this.searchData ? this.searchData[0] : '',//创建时间
		applyEndTime: this.searchData ?  this.searchData[1] : '',
		
		applyName: this.applyName, //申请人
		status: this.status,//申请状态

		page: this.currentPage,
		limit: this.pageSize,
      };
      listDiscountApply(data).then(res => {
        // contractMoney  discountRate
        if(res.status == 200) {
			this.tabList = res.data.rows;
			this.total = res.data.total;
			
			
			
			this.tabList.forEach((item,index)=>{
			  item.aftercontractMoney = item.contractMoney * ( item.discountRate/10 );  //计算折扣后金额  aftercontractMoney 
			  item.discountMoney =  item.contractMoney - item.aftercontractMoney;       //计算优惠金额
			})

			
			this.loading = false;

		}
      }).catch(error =>{
                
		this.loading = false;
		console.log('折扣申请管理 审核列表页 views/administrationCenter/decorationpermit/components/auditcompon', error);
	});
    },

    // 审核记录 --- 打开审核记录弹框
    auditRecord(val) {
    this.orderId = val.orderId;
    this.orderApplyId= val.orderApplyId;
	  
      this.examVisible = true;
    },

    //关闭弹框   审核记录
    examineclose() {
      this.examVisible = false;
    },

    //确认关闭弹框   审核记录
    examinok() {
      this.examVisible = false;
      // this.$message("审核信息成功");
    },

    closeDialog() {
      this.diaVisible = false;
    },

    // 审核 0 待审核，1 审核通过，2 驳回
    auditHandle(val) {
      //只有待审核的信息可以审核  审核条件判断
      //调用审核次数接口    如果当前登录人的审核次数大于0  就可审核   默认一个人有十次审核机会
      auditNumber().then(res=>{
        if(res.data > 0){
          this.$router.push({
            path: "/discountpermit/auditmanagement",
            query: {
              pageStatus: "0",
              orderApplyId: val.orderApplyId,
              orderId: val.orderId,
              workFlowBusinessId:val.workFlowBusinessId
            }
          });
        }else{
          this.$message.warning("您的审核次数使用已使用完")
        }
      })
    },
    // 改变页码
    currentChange(val) {
	  this.currentPage = val;
	  
      this.listDiscountApplyFun();
    },
    // 改变单页条数
    sizeChange(val) {
	  this.currentPage = 1;
	  
      this.pageSize = val;
      this.listDiscountApplyFun();
    },
    // 显示隐藏搜索
    hideSearch() {
      this.isShow = !this.isShow;
    },
    searchfun() {
      //搜索
	  this.currentPage = 1;
	  
      this.listDiscountApplyFun();
    },
    resetFun() {
      // 重置
    //   this.searchData = []; // 时间搜索
    //   this.searchData2 = [];
    //   this.form = {
	// 	orderGroup:"",
	// 	applyStartTime:"",
	// 	applyEndTime:"",
	// 	auditStartTime:"",
	// 	auditEndTime:"",
	//   }
		this.orderGroup = '';//订单编号
		this.searchData = [];//创建时间
			
		this.applyName = ''; //申请人
		this.status = '';//申请状态
		this.currentPage = 1;



      this.searchfun();
    },
    // 表格选中
    handleSelectionChange(val) {
	  this.elsectVal = val;
	  console.log(this.elsectVal,"elsectVal");
    },

    //表格斑马线设置
    tableRowClassName({ row, rowIndex }) {
      return rowIndex % 2 != 0 ? "el-f0" : "";
    }
  }
};
</script>
<style lang="scss">
.screencompon {
  .warp_head_list {
        width: 100%;
        display: flex;
        align-items: baseline;
        flex-wrap: wrap;
        .list_top{
            flex: 1;
            display: flex;
            flex-wrap: wrap;
            >div{
                margin-bottom: 10px;
                padding: 0px 5px;
                width: 25%;
                >div{
                    width: 100%;
                }
            }
            .fontMore{
                color:#d0cfcf;
            }
            .margright{
                margin-right: 5px;
            }
        }
        .head_nav_btn{
            width: 200px;
            text-align: center;
            margin-bottom: 0px;
            .fontMore{
                color:#d0cfcf;
            }
            button+button{
                margin-left: 10px;
            }
        }
    }
}
</style>