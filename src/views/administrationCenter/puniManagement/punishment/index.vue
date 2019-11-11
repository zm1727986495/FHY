<template>
    <div class="recommenman">
      <!-- 导航栏 -->
      <div class="head_nav">
        <breadcrumb :navList="navList"></breadcrumb>
      </div>
		<el-card>
      <el-row :gutter="10" class="queryForm">
        <el-col :span="6">
          <el-input placeholder="订单编号/客户合同号/客户姓名/客户电话/订单地址" v-model="punish.names" size="medium" maxlength="50" clearable @keydown.enter.native="onSearch"></el-input>
        </el-col>
        <el-col :span="5">
          <el-date-picker
            size="medium" v-model="searchData" type="daterange"
            value-format='yyyy-MM-dd' format='yyyy-MM-dd'
            start-placeholder="年/月/日" end-placeholder="年/月/日">
          </el-date-picker>
        </el-col>
        <el-col :span="3">
          <el-select v-model="punish.illegalType" placeholder="违规类型" size="medium" clearable filterable >
            <el-option v-for="item in typeList" :key="item.id" :label="item.dictName" :value="item.id"></el-option>
          </el-select>
        </el-col>
        <el-col :span="3">
          <el-select v-model="punish.storeId" placeholder="门店" size="medium" clearable filterable >
            <el-option v-for="item in netList" :key="item.storeId" :label="item.storeName" :value="item.storeId"></el-option>
          </el-select>
        </el-col>
        <el-col :span="3">
          <el-select v-model="punish.punishId" placeholder="处罚人" size="medium" clearable filterable >
            <el-option v-for="item in punisherList" :key="item.punishId" :label="item.punishName" :value="item.punishId">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-button class="button-fc" type="warning" size="medium"  @click="onSearch">查询</el-button>
          <el-button class="el-button--medium" type="primary" size="medium"   @click="resetFun">重置</el-button>
        </el-col>
      </el-row>
			<div class="m-bottom10">
        <el-button size="small" class="button-96" @click="exportFun" :loading="exportLoading">导出</el-button>
			</div>
      <div class="table_list lvs attribute" v-loading="loading">
        <el-table border  max-height="460"
                  @row-click="rowClick"
                  :row-key="getRowKeys"
                  :row-class-name="tableRowClassName" @selection-change="handleSelectionChange"
                  :data="tabList"  ref="multipleTable">
          <el-table-column type="selection" width="50" fixed='left' align="center" :reserve-selection="true"></el-table-column>
          <el-table-column  fixed='left' prop="punishBillSn" show-overflow-tooltip label="处罚单号" width="140" sortable align="center">
            <template slot-scope="scope">
              <div><p class="operation table_action_span">{{scope.row.punishBillSn}}</p></div>
            </template>
          </el-table-column>
          <el-table-column prop="storeName" label="被处罚部门" width="170" sortable align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="punishName" label="被处罚人" width="140" sortable align="center"></el-table-column>
          <el-table-column prop="punishJob" label="被处罚人职位" width="170" sortable align="center"></el-table-column>
          <el-table-column prop="contractSerialNumber" label="客户合同号" width="140" sortable align="center"></el-table-column>
          <el-table-column prop="punishReason" show-overflow-tooltip label="处罚理由(详细)" width="240" sortable align="center"> </el-table-column>
          <el-table-column prop="punishFormula" label="处罚金额计算公式" width="200" sortable align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="punishMoney" label="处罚金额" width="140" sortable align="center"></el-table-column>
          <el-table-column prop="illegalBillSn" label="违规单号" show-overflow-tooltip width="140" sortable align="center">
            <template slot-scope="scope">
              <div>
                <p class="operation table_action_span">{{scope.row.illegalBillSn}}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="illegalType" label="违规处罚类型" width="170" sortable align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="illegalLevel" label="违规等级" width="150" sortable align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="orderNumber" label="订单编号" show-overflow-tooltip width="140" sortable align="center">
            <template slot-scope="scope">
              <div>
                <p class="operation table_action_span">{{scope.row.orderNumber}}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="customerName" label="客户姓名" width="120" sortable align="center"></el-table-column>
          <el-table-column prop="customerPhone" label="客户电话" width="140" sortable align="center"></el-table-column>
          <el-table-column prop="otherPhone" label="备用电话" width="140" sortable align="center"></el-table-column>
          <el-table-column prop="address" show-overflow-tooltip label="订单地址" width="200" sortable align="center"></el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="170" sortable align="center"></el-table-column>
          <el-table-column prop="createAt" label="创建人" width="120" sortable align="center"></el-table-column>
        </el-table>
        <div class="pagination_wrap">
          <pagination
            :current-page="currentPage"
            :pageSize="pageSize"
            :total="total"
            @sizeChange="sizeChange"
            @currentChange="currentChange">
          </pagination>
        </div>
      </div>
      <el-dialog title="审核管理"  custom-class="customDialogTitle"  :visible.sync="orderdialogVisible" width="50%">
          <div class="table_list lvs attribute m-top20">
              <el-table
                  border
                  :row-class-name="tableRowClassName"
                  :data="tableData">
                      <el-table-column prop="name" label="操作人" width="180"></el-table-column>
                      <el-table-column prop="address" label="操作"></el-table-column>
                      <el-table-column prop="date" label="操作时间" width="180"></el-table-column>
                      <el-table-column prop="date" label="操作结果" width="180"></el-table-column>
                      <el-table-column prop="address" label="备注"></el-table-column>
              </el-table>
            <div class="pagination_wrap">
              <pagination
                :current-page="currentPage"
                :pageSize="pageSize"
                :total="total"
                @sizeChange="sizeChange"
                @currentChange="currentChange">
              </pagination>
            </div>
          </div>
      </el-dialog>
			<el-dialog title="处罚单" custom-class="customDialogTitle" :visible.sync="punishVisible" width="50%">
					<punishlist isrecord @close-dialog="closeDialog" ></punishlist>
			</el-dialog>
			<el-dialog title="处罚单" :visible.sync="orderVisible" width="50%" custom-class="customDialogTitle">
					<punishlist  @close-dialog="closeDialog" ></punishlist>
			</el-dialog>
			<el-dialog title="违规单详情" custom-class="customDialogTitle" :visible.sync="violaVisible" width="60%">
        <div class="titlecals martop">违规单详情</div>
					<violaDetail  @close-dialog="closeDialog" ></violaDetail>
			</el-dialog>
      	</el-card>
    </div>
</template>
<script>
import pagination from "@/views/components/pagination";
import breadcrumb from "@/views/components/breadcrumb";
import punishlist from "../components/punishlist"; // 生成处罚单
import violaDetail from "../components/violaDetail"; // 违规单
import { listPunishBillByPage } from 'api/administrationCenter/puniManagement/punish';
import module from '../../../../../config/index.js';
import { getToken } from "utils/auth";
import { listLoginUserStore, listBaseDict } from 'api/pulicJava';
import { listAllPunishPeople } from 'api/administrationCenter/puniManagement/punish';

export default {
	components: {
		breadcrumb,
		pagination,
        punishlist,
        violaDetail
		// orderdetail,
		// contractdetails
	},
  // name: 'puniManagement',
	data() {
		return {
            navList: [],//头部面包屑
            // begin
            // 查询条件
            punish:{
                names: '',
                illegalType: '',
                storeId: '',
                punishId: '',
            },
            searchData: [], // 查询条件--时间
            orderdialogVisible: false,
            orderVisible: false,
            punishVisible: false, // 生成处罚单
            violaVisible: false, // 违规单详情的弹出框
            tableData: [],
            // 违规类型
            typeList: [],
            //  所属网点
            netList: [], 
            // 处罚人条件
            punisherList: [{
                label: '张三',value: "1"
            },{
                label: '李四',value: "2"
            },{
                label: '王五',value: "3"
            },{
                label: '赵柳',value: "4"
            },], 
            sourceList: [{
                label: '微信公众号',value: "1"
            },{
                label: '联盟',value: "2"
            },{
                label: '小区',value: "3"
            },{
                label: '单店',value: "4"
            },{
                label: '展会活动',value: "5"
            },{
                label: '团购',value: "6"
            },], // 订单来源条件

            btnJurisdiction: JSON.parse(this.$loca.getItem('element')),
            elsectVal: [], // 表格选中的数据
            tabList:[], // 表格数据
			loading: true, // table的loading控制
      exportLoading: false,
      // 分页
			currentPage:1,
			pageSize: 20,
			total: 0,
            
            downFile: '',
		};
  },
  activated(){
    let data = {
        page: this.currentPage,
        limit: this.pageSize,
    };
    this.getList(data);

    listLoginUserStore().then(res =>{
        if(res.status == 200){
            this.netList = res.data;
        }
    }).catch(error =>{
        console.log('订单管理:获取门店 order/order/order.vue', error);
    })
    // 违规类型
    data = {
        dataType: 'ILLEGAL_TYPE',		//字典类型
        // belongId: 233,
    }

    listBaseDict(data).then(res => {
        if(res.status == 200) {
            this.typeList = res.data;
        }
    }).catch(err => {
        console.log('违规处罚管理:违规管理 order/puniManagement/violations/index.vue', err);
    })
    
    // 处罚人
    listAllPunishPeople().then(res => {
        if(res.status == 200) {
            this.punisherList = res.data.rows;
        }
    }).catch(error => {
        console.log('违规处罚管理:违规管理 生成处罚单 order/puniManagement/components/punishlist.vue', error);    
    })
    this.navList = this.$route.meta;
  },
  // deactivated () {
  //     this.$destroy(true)
  // },
	// mounted() {
	// // 头部面包屑
	// 	this.navList = this.$route.meta;
	// },
	// created() {
  //       let data = {
  //           page: this.currentPage,
  //           limit: this.pageSize,
  //       };
  //       this.getList(data);

  //       listLoginUserStore().then(res =>{
  //           if(res.status == 200){
  //               this.netList = res.data;
  //           }
  //       }).catch(error =>{
  //           console.log('订单管理:获取门店 order/order/order.vue', error);
  //       })
  //       // 违规类型
  //       data = {
  //           dataType: 'ILLEGAL_TYPE',		//字典类型
  //           // belongId: 233,
  //       }

  //       listBaseDict(data).then(res => {
  //           if(res.status == 200) {
  //               this.typeList = res.data;
  //           }
  //       }).catch(err => {
  //           console.log('违规处罚管理:违规管理 order/puniManagement/violations/index.vue', err);
  //       })
        
  //       // 处罚人
  //       listAllPunishPeople().then(res => {
  //           if(res.status == 200) {
  //               this.punisherList = res.data.rows;
  //           }
  //       }).catch(error => {
  //           console.log('违规处罚管理:违规管理 生成处罚单 order/puniManagement/components/punishlist.vue', error);    
  //       })

  //       // this.downFile = module.dev.proxyTable['/api'].target + '/api/pc/orderApply/exportOrderApple?orderApplyIds=';
  // },
	methods: {
        getRowKeys(row) {
            return row.illegalBillId;
        },
        rowClick(row, column, event) {
            // if(column.property == 'punishBillSn') {//处罚单号
            //     this.orderVisible = true;
            //     return;
            // }else if(column.property == 'illegalBillSn') {//违规单号
            //     this.violaVisible = true;
            //     return;
            // }

            this.$refs.multipleTable.toggleRowSelection(row)
        },
        // 点击价格策略
        clickPunish(row,column,event,cell) {
            // var id = row.priceStrategyId;
            if(column.label === "处罚单号"){
                this.orderVisible = true;
            }else if(column.label ==="违规单号") {
                this.violaVisible = true;
            }
        },
        closeDialog() {
            this.punishVisible = false;
        },
        // 导出
        exportFun() {
          this.exportLoading = true;
          let params = {
            names: this.punish.names,
            decisionStartTime: this.searchData && this.searchData.length ? this.searchData[0] : '',
            decisionEndTime: this.searchData && this.searchData.length ? this.searchData[1] : '',
            illegalType: this.punish.illegalType,
            storeId: this.punish.storeId,
            punishId: this.punish.punishId,
            token: getToken()
          };
          if (this.elsectVal.length) {
            params.punishIds = this.elsectVal.map(item => {
              return item.punishBillId;
            }).join(',');
          }
          let paramsStr = '';
          for (let keys in params) {
            paramsStr += (keys + '=' + params[keys] + '&');
          }
          paramsStr = paramsStr.substr(0, paramsStr.length - 1);
          let URLS = module.dev.proxyTable['/api'].target + '/api/pc/punishBill/exportPunishBill?' + paramsStr;
          window.location.href = URLS;
          this.exportLoading = false;
        },
        printFun() {
            this.punishVisible = true;
        },
		// 搜索条件获取
        searchdatas(){
            if(!this.searchData) {
                this.searchData = [];
            }
            return {
                names: this.punish.names,//订单编号
                decisionStartTime: this.searchData ? this.searchData[0] : '',//创建时间
                decisionEndTime: this.searchData ? this.searchData[1] : '',
                illegalType: this.punish.illegalType,
                storeId: this.punish.storeId,
                punishId: this.punish.punishId,
                page: this.currentPage,
                limit: this.pageSize
            };
		},
        onSearch(){    //搜索
            this.currentPage = 1;
            let data = this.searchdatas();
            this.getList(data);
        },
		// 重置
        resetFun(){     
            this.punish = {
                illegalType: '',
                storeId: '',
                punishId: '',
            },
            this.searchData = [];
            let data = this.searchdatas();
            this.getList(data);
        },
        // 获取表格数据
		getList(data){
            this.loading = true;
            listPunishBillByPage(data).then(res =>{
                if(res.status == 200){
                    this.total = res.data.total;
                    this.tabList = res.data.rows;
                    this.loading = false;
                }
            }).catch(error =>{
                this.loading = false;
                console.log('违规处罚管理:处罚管理 administrationCenter/puniManagement/punishment/index.vue', error);
            })
        },
		//表格斑马线设置
		tableRowClassName({row, rowIndex}) {
			return rowIndex%2 != 0 ? 'el-f0' : '';
		},
		// 分页函数回调
        currentChange(val) {
            this.currentPage = val;

            let data = this.searchdatas();
            this.getList(data);
        },
        // 单页条数改变
        sizeChange(val){
            this.currentPage = 1;
            this.pageSize = val;

            let data = this.searchdatas();
            this.getList(data);
		},
		// 表格勾选函数回调
		handleSelectionChange(val){
          this.elsectVal = val;
        },
		    // 表格选中警示信息 -- 只能选择一个订单并且必须选择
        warnMessage() {
            if(this.elsectVal.length > 1){
                this.$message({
                    message: '只能选择一个订单 新增预算清单',
                    type: 'warning'
                });
                return;
            } else if (this.elsectVal.length < 1){
                this.$message({
                    message: '抱歉， 请选择订单',
                    type: 'warning'
                });
                return;
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
    .warp_head_list {
        width: 100%;
        .list_top {
          width: 100%;
          display: flex;
          flex-wrap: wrap;
          // justify-content: center;
          align-items: center;
          .search_item {
            margin: 10px 0px;
            padding: 0px 5px;
            width: 25%;
            display: flex;
            flex-wrap: nowrap;
            > div {
              width: 100%;
            }
          }
        }
      }
	.btn_list_1 {
        display: flex;
        flex-wrap: nowrap;
	}
</style>

